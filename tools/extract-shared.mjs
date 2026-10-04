// Pulls the shared, data-like content (footer columns, announcements) out of the captured home page.
//   node tools/extract-shared.mjs            -> prints JSON
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'parse5';
import { findNode, rewriteUrl } from './html-to-jsx.mjs';

const SITE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../site');
export const load = (f) => parse(fs.readFileSync(path.join(SITE, f), 'utf8'));
export const attr = (n, k) => (n.attrs || []).find((a) => a.name === k)?.value;
export const kids = (n) => (n.childNodes || []).filter((c) => c.tagName);
export const text = (n) => (n.nodeName === '#text' ? n.value : (n.childNodes || []).map(text).join(''));
export const all = (n, f, out = []) => { if (n.tagName && f(n)) out.push(n); (n.childNodes || []).forEach((c) => all(c, f, out)); return out; };
const hasClass = (n, c) => (attr(n, 'class') || '').split(/\s+/).includes(c);

export function footerColumns(doc) {
  const footer = findNode(doc, '.hw-footer-reveal');
  const grid = findNode(footer, '.hw-teams-footer-grid');
  const cols = [];
  for (const col of all(grid, (n) => hasClass(n, 'hw-teams-footer-column'))) {
    const ps = all(col, (n) => n.tagName === 'p').map((p) => text(p).trim());
    const links = all(col, (n) => n.tagName === 'a').map((a) => {
      // some labels carry a dimmed lead-in: <span class="opacity-60">Go to </span>Discord
      const dim = all(a, (n) => n.tagName === 'span' && hasClass(n, 'opacity-60'))[0];
      const prefix = dim ? text(dim) : '';
      return {
        label: text(a).slice(prefix.length).trim(),
        ...(prefix ? { prefix } : {}),
        href: rewriteUrl(attr(a, 'href')),
        external: attr(a, 'target') === '_blank',
      };
    });
    cols.push({ group: ps[0], title: ps[1], links });
  }
  return cols;
}

export function announcements(doc) {
  const cards = all(doc, (n) => hasClass(n, 'nw-announcement-card'));
  return cards.map((c) => {
    const imgs = all(c, (n) => n.tagName === 'img');
    const spans = all(c, (n) => n.tagName === 'span').map((s) => text(s).trim());
    return {
      url: attr(c, 'href'),
      image: rewriteUrl(attr(imgs[0], 'src')),
      width: Number(attr(imgs[0], 'width')),
      height: Number(attr(imgs[0], 'height')),
      handle: spans[0],
      text: all(c, (n) => n.tagName === 'p').map(text).join(''),
      date: spans[spans.length - 1],
    };
  });
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const doc = load('index.html');
  console.log(JSON.stringify({ footer: footerColumns(doc), announcements: announcements(doc) }, null, 1));
}

/** Blog index: featured cards + archive rows, in page order. */
export function blogIndex(doc) {
  const main = findNode(doc, 'main');
  const featured = all(main, (n) => n.tagName === 'article' && hasClass(n, 'nw-blog-feature')).map((a) => {
    const link = all(a, (n) => n.tagName === 'a' && (rewriteUrl(attr(n, 'href') || '')).startsWith('/'))[0];
    const imgs = all(a, (n) => n.tagName === 'img');
    return {
      slug: rewriteUrl(attr(link, 'href')).replace(/^\//, ''),
      title: text(all(a, (n) => n.tagName === 'h2')[0]).trim(),
      author: text(all(a, (n) => n.tagName === 'span' && /font-\[family-name:var\(--font-mono\)\]/.test(attr(n, 'class') || ''))[0]).replace(/^By\s*/, '').trim(),
      excerpt: text(all(a, (n) => n.tagName === 'p')[0]).trim(),
      image: rewriteUrl(attr(imgs[0], 'src')),
      eager: attr(imgs[0], 'loading') === 'eager',
    };
  });
  const archive = all(main, (n) => n.tagName === 'article' && hasClass(n, 'nw-blog-archive-row')).map((a) => ({
    slug: rewriteUrl(attr(all(a, (n) => n.tagName === 'a')[0], 'href')).replace(/^\//, ''),
    title: text(all(a, (n) => n.tagName === 'h3')[0]).trim(),
    excerpt: text(all(a, (n) => n.tagName === 'p')[0]).trim(),
    author: text(all(a, (n) => n.tagName === 'span' && /font-\[family-name:var\(--font-mono\)\]/.test(attr(n, 'class') || ''))[0]).replace(/^By\s*/, '').trim(),
  }));
  return { featured, archive };
}
