// Copies the few third-party images whose URLs contain encoded slashes (substack) or no file extension
// (google docs) into public/assets/external/<host>/<hash>.<ext>, and records the mapping in
// tools/external-map.json so html-to-jsx / extract-posts can rewrite their URLs.
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { safeRel } from '../../tools/paths.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const SITE = path.resolve(HERE, '../../site');
const PUBLIC = path.resolve(HERE, '../public');
export const HOSTS = ['substackcdn.com', 'lh7-rt.googleusercontent.com'];

const sniff = (b) => (b[0] === 0x89 && b[1] === 0x50 ? 'png' : b[0] === 0xff && b[1] === 0xd8 ? 'jpg' : b.slice(0, 4).toString() === 'RIFF' ? 'webp' : b.slice(0, 3).toString() === 'GIF' ? 'gif' : 'bin');

function* htmlFiles(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory() && !['_next', '__ext', 'font'].includes(e.name)) yield* htmlFiles(p);
    else if (e.name.endsWith('.html')) yield p;
  }
}

const re = new RegExp(`https://(?:${HOSTS.map((h) => h.replaceAll('.', '\\.')).join('|')})/[^"'\\s)<>]+`, 'g');
const map = {};
for (const f of htmlFiles(SITE)) {
  for (const m of fs.readFileSync(f, 'utf8').matchAll(re)) {
    const u = new URL(m[0].replaceAll('&amp;', '&'));
    const key = u.hostname + decodeURIComponent(u.pathname);
    if (map[key]) continue;
    const src = path.join(SITE, '__ext', u.hostname, safeRel(decodeURIComponent(u.pathname).replace(/^\//, '')));
    if (!fs.existsSync(src)) { console.warn('missing source', src); continue; }
    const buf = fs.readFileSync(src);
    const rel = `assets/external/${u.hostname}/${crypto.createHash('sha1').update(key).digest('hex').slice(0, 16)}.${sniff(buf)}`;
    fs.mkdirSync(path.dirname(path.join(PUBLIC, rel)), { recursive: true });
    fs.writeFileSync(path.join(PUBLIC, rel), buf);
    map[key] = '/' + rel;
  }
}
for (const h of HOSTS) { // drop the old nested copies
  const dir = path.join(PUBLIC, 'assets/external', h);
  for (const e of fs.existsSync(dir) ? fs.readdirSync(dir) : []) if (!/^[0-9a-f]{16}\.\w+$/.test(e)) fs.rmSync(path.join(dir, e), { recursive: true });
}
fs.writeFileSync(path.join(HERE, 'external-map.json'), JSON.stringify(map, null, 2) + '\n');
console.log(`${Object.keys(map).length} external images localized`);
