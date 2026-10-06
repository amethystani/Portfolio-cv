// Drives the running rebuild (default http://localhost:3100) and checks the client-side behaviours.
//   npx next start -p 3100 &  node tools/behavior-check.mjs
import fs from 'node:fs';
import { chromium } from 'playwright';

const BASE = process.env.LOCAL ?? 'http://localhost:3100';
const exe = process.env.CHROMIUM_PATH ?? ['/opt/pw-browsers/chromium-1194/chrome-linux/chrome'].find((p) => fs.existsSync(p));
const browser = await chromium.launch(exe ? { executablePath: exe } : {});
let failures = 0;
const check = (name, ok, detail = '') => { console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? '  ' + detail : ''}`); if (!ok) failures++; };

async function open(path, viewport = { width: 1440, height: 900 }) {
  const ctx = await browser.newContext({ viewport });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => m.type() === 'error' && !/Failed to load resource/.test(m.text()) && errors.push(m.text()));
  await page.goto(BASE + path, { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);
  return { page, errors, ctx };
}
const attr = (page, sel, name) => page.$eval(sel, (el, n) => el.getAttribute(n), name);

// ---------------------------------------------------------------- home, desktop
{
  const { page, errors, ctx } = await open('/');
  check('html has data-hydrated + data-research-theme', (await page.evaluate(() => document.documentElement.dataset.hydrated === 'true' && ['light', 'dark'].includes(document.documentElement.dataset.researchTheme))));
  check('pinned nav hidden at the top', (await attr(page, '.bg-hermes-paper', 'class')).includes('-translate-y-full') && (await page.$eval('.bg-hermes-paper', (e) => e.hasAttribute('inert'))));

  await page.evaluate(() => window.scrollTo(0, 900)); await page.waitForTimeout(900);
  check('pinned nav shows after scrolling', (await attr(page, '.bg-hermes-paper', 'class')).includes('translate-y-0') && !(await page.$eval('.bg-hermes-paper', (e) => e.hasAttribute('inert'))));
  const frame = await page.$eval('.hw-frame-scroll', (e) => e.style.getPropertyValue('--scroll-y'));
  check('frame --scroll-y follows scroll', /^\d+(\.\d+)?%$/.test(frame) && parseFloat(frame) > 10, frame);

  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight)); await page.waitForTimeout(1500);
  const vars = await page.$eval('.hw-footer-reveal', (e) => ({ o: e.style.getPropertyValue('--hw-footer-opacity'), l: e.style.getPropertyValue('--hw-footer-lift') }));
  check('footer reveal sets opacity 1 / lift 0 at the bottom', vars.o === '1.000' && parseFloat(vars.l) === 0, JSON.stringify(vars));
  check('pinned nav hides again at the footer', (await attr(page, '.bg-hermes-paper', 'class')).includes('-translate-y-full'));
  await page.evaluate(() => window.scrollTo(0, 0)); await page.waitForTimeout(800);

  // dropdown
  check('dropdown not in DOM until used or closed', (await page.$eval('#research-navigation', (e) => e.getAttribute('data-open'))) === 'false');
  await page.click('header [data-research-target="Work"]'); await page.waitForTimeout(500);
  check('clicking Work opens its panel', (await attr(page, '#research-navigation', 'data-open')) === 'true' && (await attr(page, '#research-navigation', 'data-preset')) === 'Work');
  check('panel lists Work links', (await page.$$eval('#research-navigation .nw-subnav-link', (l) => l.length)) === 7);
  check('trigger aria-expanded is true', (await attr(page, 'header [data-research-target="Work"]', 'aria-expanded')) === 'true');
  const box = await page.$eval('#research-navigation', (e) => { const r = e.getBoundingClientRect(); return { left: Math.round(r.left), top: Math.round(r.top), w: Math.round(r.width) }; });
  const trigger = await page.$eval('header [data-research-target="Work"]', (e) => { const r = e.getBoundingClientRect(); return { left: Math.round(r.left), bottom: Math.round(r.bottom) }; });
  check('panel sits under the trigger, left-aligned to it, 720 wide', box.left === trigger.left && box.w === 720 && box.top >= trigger.bottom && box.top - trigger.bottom <= 12, JSON.stringify({ box, trigger }));
  await page.keyboard.press('Escape'); await page.waitForTimeout(500);
  check('Escape closes it', (await attr(page, '#research-navigation', 'data-open')) === 'false');
  await page.click('header [data-research-target="Elsewhere"]'); await page.waitForTimeout(400);
  const community = await page.$eval('#research-navigation', (e) => { const r = e.getBoundingClientRect(); return Math.round(r.right); });
  const elsewhereRight = await page.$eval('header [data-research-target="Elsewhere"]', (e) => Math.round(e.getBoundingClientRect().right));
  check('right-hand trigger aligns the panel to its right edge', community === elsewhereRight, `${community} vs ${elsewhereRight}`);
  await page.mouse.click(700, 800); await page.waitForTimeout(400);
  check('clicking outside closes it', (await attr(page, '#research-navigation', 'data-open')) === 'false');

  // theme
  const before = await page.evaluate(() => document.documentElement.dataset.researchTheme);
  await page.click('header .nw-header-theme'); await page.waitForTimeout(1500);
  const after = await page.evaluate(() => document.documentElement.dataset.researchTheme);
  check('theme fold toggles light/dark', before !== after, `${before} -> ${after}`);
  check('theme is remembered', (await page.evaluate(() => localStorage.getItem('nous-research-theme'))) === after);
  check('no console errors on home', errors.length === 0, errors.slice(0, 2).join(' | '));
  await ctx.close();
}

// ---------------------------------------------------------------- the composer (⌘K)
{
  const { page, errors, ctx } = await open('/');
  const state = () => page.evaluate(() => document.querySelector('#research-composer')?.getAttribute('data-open'));
  check('composer starts closed', (await state()) === 'false');
  await page.keyboard.press('Control+k'); await page.waitForTimeout(400);
  check('Ctrl+K opens the composer and focuses the field', (await state()) === 'true' && (await page.evaluate(() => document.activeElement?.classList.contains('nw-composer-search-input'))));
  check('shows 3 suggested questions', (await page.$$('.nw-prompt-question')).length === 3);
  await page.click('.nw-prompt-question'); await page.waitForTimeout(250);
  check('a question opens its curated answer', (await page.$$('.nw-composer-answer h3')).length === 1);
  await page.click('[aria-label="Back to questions"]');
  await page.click('[aria-label="Next questions"]'); await page.waitForTimeout(150);
  check('the arrows page through the other questions', (await page.$eval('.nw-prompt-study', (e) => e.getAttribute('data-question-page'))) === '1');
  await page.fill('.nw-composer-search-input', 'evirag'); await page.waitForTimeout(1500);
  check('typing searches the site', (await page.$$('[data-search-result]')).length >= 1);
  await page.keyboard.press('Escape'); await page.waitForTimeout(250);
  check('Escape closes it', (await state()) === 'false');
  await page.keyboard.press('Control+k'); await page.waitForTimeout(300);
  await page.mouse.click(10, 500); await page.waitForTimeout(250);
  check('clicking outside closes it', (await state()) === 'false');
  check('no console errors from the composer', errors.length === 0, errors.slice(0, 2).join(' | '));
  await ctx.close();
}

// ---------------------------------------------------------------- the phone menu
{
  const { page, errors, ctx } = await open('/', { width: 390, height: 844 });
  const menu = () => page.$('#research-mobile-menu');
  const sections = () => page.$$eval('.nw-research-accordion-nav section', (s) => s.map((x) => x.querySelector('button').getAttribute('aria-expanded') + ':' + x.querySelectorAll('a').length));
  check('menu starts closed', !(await menu()));
  await page.click('button[aria-label="Open menu"]'); await page.waitForTimeout(700);
  check('burger opens the menu, "About" expanded with 4 links', !!(await menu()) && (await sections())[0] === 'true:4');
  check('page scroll is locked while open', (await page.evaluate(() => document.documentElement.style.overflow)) === 'hidden');
  await page.click('.nw-research-accordion-toggle:has-text("Work")'); await page.waitForTimeout(600);
  check('opening Work closes About and lists 4 links', (await sections()).join() === 'false:0,true:4,false:0,false:0');
  await page.click('.nw-research-accordion-toggle:has-text("Work")'); await page.waitForTimeout(600);
  check('a section can be collapsed again', (await sections()).every((x) => x.startsWith('false')));
  for (let i = 0; i < 12; i++) await page.keyboard.press('Tab');
  check('Tab stays inside the open menu', await page.evaluate(() => !!document.activeElement?.closest('#research-mobile-menu')));
  await page.keyboard.press('Escape'); await page.waitForTimeout(600);
  check('Escape closes it, unlocks scroll and returns focus to the burger', !(await menu()) && (await page.evaluate(() => document.documentElement.style.overflow)) === '' && (await page.evaluate(() => document.activeElement?.getAttribute('aria-label'))) === 'Open menu');
  await page.click('button[aria-label="Open menu"]'); await page.waitForTimeout(600);
  await page.click('.nw-research-accordion-nav a:has-text("Writing")'); await page.waitForURL('**/blog'); await page.waitForTimeout(600);
  check('choosing a page navigates and closes the menu', !(await menu()));
  check('no console errors from the menu', errors.length === 0, errors.slice(0, 2).join(' | '));
  await ctx.close();
}

// ---------------------------------------------------------------- filters and global search
{
  const { page, errors, ctx } = await open('/releases');
  const rows = () => page.$$eval('#release-list > div:not([hidden])', (d) => d.length);
  await page.click('.fl-chip:has-text("PAPER")'); await page.waitForTimeout(200);
  check('a type chip filters the list and the address bar', (await rows()) === 5 && /g=PAPER/.test(page.url()), String(await rows()));
  await page.fill('.fl-search input', 'epistemic'); await page.waitForTimeout(200);
  check('the text box narrows it further', (await rows()) === 1);
  await page.fill('.fl-search input', 'zzzz'); await page.waitForTimeout(200);
  check('no matches shows an empty state with a way out', !!(await page.$('.fl-empty button')));
  await page.click('.fl-empty button'); await page.waitForTimeout(200);
  check('clear filters restores the list', (await rows()) === 9 && !/\?/.test(page.url()));
  await page.goto(BASE + '/releases?q=wmt&g=PAPER', { waitUntil: 'networkidle' }); await page.waitForTimeout(400);
  check('a filtered link restores its filters', (await page.$eval('.fl-search input', (i) => i.value)) === 'wmt' && (await rows()) === 1);
  await page.goto(BASE + '/careers', { waitUntil: 'networkidle' });
  await page.click('header button.nw-header-icon[aria-label="Search the site"]'); await page.waitForTimeout(700);
  check('the header search button opens the palette on any page', (await page.getAttribute('#research-composer', 'data-open')) === 'true');
  await page.fill('.nw-composer-search-input', 'evirag'); await page.waitForTimeout(1500);
  check('and searches the whole site', (await page.$$('[data-search-result]')).length >= 1);
  check('no console errors with filters and search', errors.length === 0, errors.slice(0, 2).join(' | '));
  await ctx.close();
}

// ---------------------------------------------------------------- an article: dialogs, rail, dock
{
  const slug = '/notation-matters-in-digital-discovery';
  const { page, errors, ctx } = await open(slug);
  await ctx.grantPermissions(['clipboard-read', 'clipboard-write']);
  const dialog = () => page.$('[role="dialog"]:not(#research-composer):not(#research-mobile-menu)');
  await page.click('button[aria-label="Share article"]'); await page.waitForTimeout(600);
  check('Share opens a side panel with focus on its close button', !!(await dialog()) && (await page.evaluate(() => document.activeElement?.getAttribute('aria-label'))) === 'Close');
  check('the page behind the panel is inert', await page.evaluate(() => document.querySelector('main')?.closest('[inert]') !== null));
  await page.click('[role="dialog"] button:has-text("Copy link")'); await page.waitForTimeout(300);
  check('Copy link puts the article URL on the clipboard', /\/notation-matters/.test(await page.evaluate(() => navigator.clipboard.readText())));
  await page.keyboard.press('Escape'); await page.waitForTimeout(500);
  check('Escape closes it and returns focus to the Share button', !(await dialog()) && (await page.evaluate(() => document.activeElement?.getAttribute('aria-label'))) === 'Share article');
  await page.click('button[aria-label="Listen to article"]'); await page.waitForTimeout(600);
  check('Listen explains when no device voice exists', /voice|supported/i.test(await page.$eval('[role="dialog"] [role="status"]', (e) => e.textContent)));
  await page.mouse.click(200, 500); await page.waitForTimeout(500);
  check('clicking outside closes the panel', !(await dialog()));
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  await page.evaluate((y) => scrollTo(0, y), Math.round(height * 0.3)); await page.waitForTimeout(800);
  const rail = await page.$eval('.nw-article-reading-rail', (r) => ({ hidden: r.hidden, n: r.children.length }));
  check('the reading rail appears beside the text with one tick per section', !rail.hidden && rail.n >= 3, JSON.stringify(rail));
  await page.hover('.nw-article-reading-rail a:nth-child(3)'); await page.waitForTimeout(300);
  check('hovering a tick previews that section', (await page.$$('.nw-article-reading-rail a[data-preview]')).length === 1);
  check('headings and figures fade in as they scroll into view', (await page.$$('.nw-blog-reveal')).length > 5);
  check('no console errors on an article', errors.length === 0, errors.slice(0, 2).join(' | '));
  await ctx.close();
}
{
  const { page, ctx } = await open('/notation-matters-in-digital-discovery', { width: 390, height: 844 });
  const dock = () => page.$eval('.nw-article-dock', (d) => ({ hidden: d.hidden, open: d.querySelector('button').getAttribute('aria-expanded') }));
  check('the contents dock is hidden at the top', (await dock()).hidden);
  await page.evaluate(() => scrollTo(0, document.documentElement.scrollHeight * 0.3)); await page.waitForTimeout(800);
  check('the dock shows once the contents list scrolls away', !(await dock()).hidden);
  await page.click('.nw-article-dock button'); await page.waitForTimeout(300);
  check('tapping it lists the sections', (await dock()).open === 'true' && (await page.$$('.nw-article-dock-list a')).length >= 3);
  await page.keyboard.press('Escape'); await page.waitForTimeout(200);
  check('Escape closes the list', (await dock()).open === 'false');
  await ctx.close();
}

// The neuron-constellation article scene (components/article, lib/scenes) is no longer used by any post,
// so it is not exercised here.
// ---------------------------------------------------------------- canvases and video
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.addInitScript(() => {
    window.__plays = 0; window.__pauses = 0;
    HTMLMediaElement.prototype.play = function () { window.__plays++; return Promise.resolve(); };
    HTMLMediaElement.prototype.pause = function () { window.__pauses++; };
  });
  await page.goto(BASE + '/', { waitUntil: 'networkidle' }); await page.waitForTimeout(800);
  const plays = () => page.evaluate(() => window.__plays);
  const before = await plays();
  await page.evaluate(() => document.querySelector('[data-el="hermes-demo"]').scrollIntoView({ block: 'center' })); await page.waitForTimeout(800);
  check('the demo video plays when it scrolls into view', (await plays()) > before);
  const pausesBefore = await page.evaluate(() => window.__pauses);
  await page.evaluate(() => scrollTo(0, 0)); await page.waitForTimeout(800);
  check('and pauses when it leaves', (await page.evaluate(() => window.__pauses)) > pausesBefore);
  await page.evaluate(() => scrollTo(0, document.documentElement.scrollHeight)); await page.waitForTimeout(2500);
  await page.evaluate(() => document.querySelector('.nw-orb-stage')?.scrollIntoView({ block: 'center' })); await page.waitForTimeout(2500);
  const canvases = await page.$$eval('canvas', (cs) => cs.map((c) => c.width > 300));
  check('orb, footer shader and film grain canvases are all drawn', canvases.length === 3 && canvases.every(Boolean), JSON.stringify(canvases));
  await ctx.close();
}

// ---------------------------------------------------------------- an editorial page
{
  const { page, errors, ctx } = await open('/releases');
  check('releases: 9 shown + "Show more (2)"', (await page.$$eval('#release-list > div:not([hidden])', (d) => d.length)) === 9 && /Show more \(2\)/.test(await page.$eval('#release-list-more', (e) => e.textContent)));
  await page.click('#release-list-more button'); await page.waitForTimeout(300);
  check('Show more reveals the remaining 2', (await page.$$eval('#release-list > div:not([hidden])', (d) => d.length)) === 11);
  check('no console errors on /releases', errors.length === 0, errors.slice(0, 2).join(' | '));
  await ctx.close();
}
{
  const { page, ctx } = await open('/blog');
  check('blog archive shows all 10 on desktop (pagination is mobile-only)', /Showing 10 of 10/.test(await page.$eval('#blog-archive-list + button + span, #blog-archive-list ~ span.sr-only', (e) => e.textContent).catch(() => '')));
  await ctx.close();
}

await browser.close();
console.log(failures ? `\n${failures} check(s) failed` : '\nall checks passed');
process.exitCode = failures ? 1 : 0;
