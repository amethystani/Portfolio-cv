// Pixel-compares the rebuild against the offline mirror of the original (../server.mjs), which loads
// every asset, so there are no network artifacts. Handy for sweeping viewport sizes.
//
//   node ../server.mjs 3000 &  npx next start -p 3100 &
//   WIDTHS=1024,1920,2560 HEIGHT=900 node tools/compare-mirror.mjs / /blog
//   FULL=1 THEME=dark node tools/compare-mirror.mjs /
import fs from 'node:fs';
import { chromium } from 'playwright';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';

const MIRROR = process.env.MIRROR ?? 'http://localhost:3000';
const LOCAL = process.env.LOCAL ?? 'http://localhost:3100';
const widths = (process.env.WIDTHS ?? '1440').split(',').map(Number);
const height = Number(process.env.HEIGHT ?? 900);
const dpr = Number(process.env.DPR ?? 1);
const full = process.env.FULL === '1';
const theme = process.env.THEME;
const paths = process.argv.slice(2).length ? process.argv.slice(2) : ['/'];
const out = '.compare';
fs.mkdirSync(out, { recursive: true });
const executablePath = process.env.CHROMIUM_PATH ?? ['/opt/pw-browsers/chromium-1194/chrome-linux/chrome'].find((p) => fs.existsSync(p));
const browser = await chromium.launch(executablePath ? { executablePath } : {});
const slug = (p) => (p === '/' ? 'home' : p.replace(/^\//, '').replace(/[^\w-]+/g, '_'));

async function shoot(base, w, path, file) {
  const ctx = await browser.newContext({ viewport: { width: w, height }, deviceScaleFactor: dpr, reducedMotion: 'reduce' });
  if (theme) await ctx.addInitScript((t) => localStorage.setItem('nous-research-theme', t), theme);
  const page = await ctx.newPage();
  await page.goto(base + path, { waitUntil: 'networkidle' });
  // evaluate() rather than addStyleTag: the original's CSP reports can interrupt addStyleTag.
  await page.evaluate(() => { const s = document.createElement('style'); s.textContent = '*,*::before,*::after{animation:none!important;transition:none!important;caret-color:transparent!important}video{visibility:hidden!important}'; document.head.append(s); });
  if (full) {
    await page.evaluate(async () => {
      for (let t = 0; t < document.documentElement.scrollHeight; t += 600) { scrollTo(0, t); await new Promise((r) => setTimeout(r, 100)); }
      scrollTo(0, 0);
    });
    await page.waitForLoadState('networkidle');
  }
  await page.waitForTimeout(1500);
  await page.screenshot({ path: file, fullPage: full });
  await ctx.close();
}

let bad = 0;
for (const w of widths) for (const p of paths) {
  const name = `m-${slug(p)}-${w}`;
  await Promise.all([shoot(MIRROR, w, p, `${out}/orig-${name}.png`), shoot(LOCAL, w, p, `${out}/mine-${name}.png`)]);
  const a = PNG.sync.read(fs.readFileSync(`${out}/orig-${name}.png`));
  const b = PNG.sync.read(fs.readFileSync(`${out}/mine-${name}.png`));
  if (a.width !== b.width || a.height !== b.height) { bad++; console.log(`SIZE ${name}: ${a.width}x${a.height} vs ${b.width}x${b.height}`); continue; }
  const diff = new PNG({ width: a.width, height: a.height });
  const n = pixelmatch(a.data, b.data, diff.data, a.width, a.height, { threshold: 0.1 });
  fs.writeFileSync(`${out}/mdiff-${name}.png`, PNG.sync.write(diff));
  const pct = (100 * n) / (a.width * a.height);
  if (pct >= 0.05) bad++;
  console.log(`${pct < 0.05 ? 'OK  ' : 'DIFF'} ${name}  ${pct.toFixed(3)}%`);
}
await browser.close();
process.exitCode = bad ? 1 : 0;
