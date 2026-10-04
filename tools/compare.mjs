// Pixel-compares the rebuilt site against the live nousresearch.com.
//
//   npx next start -p 3100 &            # serve the rebuild
//   node tools/compare.mjs / /blog      # paths to compare (default: /)
//   VIEWPORTS=1440x900,390x844 SCROLL=0,900 node tools/compare.mjs /
//   FULL=1 node tools/compare.mjs /blog     # whole page, not just the first screen
//   THEME=dark node tools/compare.mjs /     # dark mode on both sides
//
// Output images land in .compare/ (live-*, local-*, diff-*). Live pages are fetched by Node (so TLS
// verification stays on) and handed to Chromium through request interception.
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';

const LOCAL = process.env.LOCAL ?? 'http://localhost:3100';
const LIVE = 'https://nousresearch.com';
const viewports = (process.env.VIEWPORTS ?? '1440x900').split(',').map((v) => v.split('x').map(Number));
const scrolls = (process.env.SCROLL ?? '0').split(',').map(Number);
const settle = Number(process.env.SETTLE ?? 2500);
const full = process.env.FULL === '1';
const theme = process.env.THEME; // 'dark' or 'light' (default: the page's own default)
const paths = process.argv.slice(2).length ? process.argv.slice(2) : ['/'];
const out = '.compare';
fs.mkdirSync(out, { recursive: true });

// Pre-installed Chromium on cloud sandboxes; elsewhere Playwright finds its own (npx playwright install chromium).
const executablePath = process.env.CHROMIUM_PATH ?? ['/opt/pw-browsers/chromium-1194/chrome-linux/chrome'].find((p) => fs.existsSync(p));
const browser = await chromium.launch(executablePath ? { executablePath } : {});
const slug = (p) => (p === '/' ? 'home' : p.replace(/^\//, '').replace(/[^\w-]+/g, '_'));

async function context(w, h, live) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, reducedMotion: 'reduce', deviceScaleFactor: 1 });
  if (theme) await ctx.addInitScript((t) => localStorage.setItem('nous-research-theme', t), theme);
  await ctx.route('**/*', async (route) => {
    const u = route.request().url();
    if (!live) return /^https?:\/\/localhost/.test(u) ? route.continue() : route.abort();
    if (!/nousresearch(\.com|-com-backup\.vercel\.app)|vercel-storage|twimg\.com|substackcdn|googleusercontent/.test(u)) return route.abort();
    try {
      const hd = { ...route.request().headers() };
      delete hd.host; delete hd['accept-encoding']; delete hd.range;
      const r = await fetch(u, { headers: hd, redirect: 'follow' });
      const o = {};
      r.headers.forEach((v, k) => { if (!/^(content-encoding|content-length|transfer-encoding|connection)$/i.test(k)) o[k] = v; });
      await route.fulfill({ status: r.status, headers: o, body: Buffer.from(await r.arrayBuffer()) });
    } catch { await route.abort(); }
  });
  return ctx;
}

async function shoot(ctx, url, y, file) {
  const page = await ctx.newPage();
  await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
  await page.addStyleTag({ content: '*,*::before,*::after{animation:none!important;transition:none!important;caret-color:transparent!important}video{visibility:hidden!important}' });
  if (full) {
    // Walk down the page once so lazy images load, then come back to the top for the capture.
    await page.evaluate(async () => {
      for (let top = 0; top < document.documentElement.scrollHeight; top += 600) {
        window.scrollTo(0, top);
        await new Promise((r) => setTimeout(r, 120));
      }
      window.scrollTo(0, 0);
    });
    await page.waitForLoadState('networkidle');
  }
  if (y) await page.evaluate((y) => window.scrollTo(0, y), y);
  await page.waitForTimeout(settle);
  await page.screenshot({ path: file, fullPage: full });
  await page.close();
}

let worst = 0;
for (const [w, h] of viewports) {
  const live = await context(w, h, true);
  const local = await context(w, h, false);
  for (const p of paths) for (const y of scrolls) {
    const name = `${slug(p)}-${w}x${h}-y${y}`;
    await Promise.all([shoot(live, LIVE + p, y, `${out}/live-${name}.png`), shoot(local, LOCAL + p, y, `${out}/local-${name}.png`)]);
    const a = PNG.sync.read(fs.readFileSync(`${out}/live-${name}.png`));
    const b = PNG.sync.read(fs.readFileSync(`${out}/local-${name}.png`));
    if (a.width !== b.width || a.height !== b.height) { console.log(`${name}: SIZE MISMATCH ${a.width}x${a.height} vs ${b.width}x${b.height}`); continue; }
    const diff = new PNG({ width: a.width, height: a.height });
    const n = pixelmatch(a.data, b.data, diff.data, a.width, a.height, { threshold: 0.1 });
    fs.writeFileSync(`${out}/diff-${name}.png`, PNG.sync.write(diff));
    const pct = (100 * n) / (a.width * a.height);
    worst = Math.max(worst, pct);
    console.log(`${pct < 0.05 ? 'OK  ' : 'DIFF'} ${name}  ${n} px (${pct.toFixed(3)}%)`);
  }
  await live.close(); await local.close();
}
await browser.close();
process.exitCode = worst < 0.5 ? 0 : 1;
