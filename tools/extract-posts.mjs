// One-off: turns the captured blog posts into content/posts.ts + content/posts/<slug>.html.
// BODIES_ONLY=1 rewrites just the .html bodies and leaves content/posts.ts (which has hand edits) alone.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { serialize } from 'parse5';
import prettier from 'prettier';
import { load, blogIndex, all, attr, text } from './extract-shared.mjs';
import { findNode, rewriteUrl } from './html-to-jsx.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const hasClass = (n, c) => (attr(n, 'class') || '').split(/\s+/).includes(c);
const meta = (doc, key) => all(doc, (n) => n.tagName === 'meta' && (attr(n, 'name') === key || attr(n, 'property') === key))[0]?.attrs.find((a) => a.name === 'content')?.value;

/** Rewrites asset URLs inside a body fragment (in place). */
function rewriteTree(root) {
  for (const n of all(root, () => true)) {
    for (const a of n.attrs || []) {
      if (['src', 'poster', 'href', 'data-src'].includes(a.name)) a.value = rewriteUrl(a.value);
      else if (a.name === 'srcset') a.value = a.value.split(',').map((s) => { const [u, ...r] = s.trim().split(/\s+/); return [rewriteUrl(u), ...r].join(' '); }).join(', ');
      else if (a.name === 'style') a.value = a.value.replace(/https?:\/\/[^'")\s]+/g, (u) => rewriteUrl(u));
    }
  }
}

/** Round author avatar: letters, a photo, or the Nous badge. */
function avatarOf(span) {
  const img = all(span, (n) => n.tagName === 'img')[0];
  if (img) return { image: rewriteUrl(attr(img, 'src')) };
  if (all(span, (n) => n.tagName === 'svg').length) return { badge: true };
  return { initials: text(span).trim() };
}

/**
 * Formats a body, except that math blocks keep their exact text: they render with `white-space: pre`,
 * so a line break inside one is visible and prettier must not re-flow it.
 */
async function formatBody(html) {
  const kept = [];
  const masked = html.replace(/<code class="nw-article-math-block"[^>]*>[\s\S]*?<\/code>/g, (m) => `<code data-keep="${kept.push(m) - 1}"></code>`);
  const out = await prettier.format(masked, { parser: 'html', printWidth: 110 });
  return out.replace(/<code data-keep="(\d+)">\s*<\/code>/g, (_, i) => kept[i]);
}

const idx = blogIndex(load('blog/index.html'));
const order = [...idx.featured.map((p) => ({ ...p, featured: true })), ...idx.archive.map((p) => ({ ...p, featured: false }))];
const posts = [];
/** slug -> thumbnail shown in other posts' related rows (null when the row has no image). */
const thumbs = new Map();
fs.mkdirSync(path.join(ROOT, 'content/posts'), { recursive: true });

for (const entry of order) {
  const doc = load(`${entry.slug}/index.html`);
  const main = findNode(doc, 'main');
  const hero = findNode(main, 'header');
  const time = all(main, (n) => n.tagName === 'time')[0];
  const coverFrame = all(hero, (n) => n.tagName === 'span' && hasClass(n, 'nw-article-cover'))[0];
  const coverImg = coverFrame && all(coverFrame, (n) => n.tagName === 'img')[0];
  const version = all(hero, (n) => n.tagName === 'span' && hasClass(n, 'nw-article-version'))[0];
  const tools = all(main, (n) => n.tagName === 'aside' && hasClass(n, 'nw-article-source-tools'))[0];
  const authorBlock = all(main, (n) => n.tagName === 'div' && hasClass(n, 'nw-article-author'))[0];
  const pageAuthor = text(all(authorBlock, (n) => n.tagName === 'span')[1]).replace(/^By\s*/, '').trim();
  const relatedRows = all(main, (n) => n.tagName === 'article' && hasClass(n, 'nw-blog-related-row'));
  const related = relatedRows.map((a) => {
    const slug = rewriteUrl(attr(all(a, (n) => n.tagName === 'a')[0], 'href')).replace(/^\//, '');
    const img = all(a, (n) => n.tagName === 'img')[0];
    const src = img ? rewriteUrl(attr(img, 'src')) : null;
    if (src || !thumbs.has(slug)) thumbs.set(slug, src);
    return slug;
  });
  const prose = findNode(main, '#article-prose');
  // curated "Contents" labels that differ from the section heading itself
  const navLinks = all(findNode(main, '.nw-article-contents'), (n) => n.tagName === 'a');
  const headingText = new Map(all(prose, (n) => /^h[23]$/.test(n.tagName) && attr(n, 'id')).map((h) => [attr(h, 'id'), text(h).replace(/\s+/g, ' ').trim()]));
  const contentsLabels = Object.fromEntries(navLinks.map((a) => [attr(a, 'href').slice(1), text(a).replace(/\s+/g, ' ').trim()]).filter(([id, label]) => headingText.has(id) && headingText.get(id) !== label));
  rewriteTree(prose);
  const html = await formatBody(serialize(prose));
  fs.writeFileSync(path.join(ROOT, 'content/posts', `${entry.slug}.html`), html);

  const ogImage = rewriteUrl(meta(doc, 'og:image') ?? '');
  posts.push({
    slug: entry.slug,
    title: text(all(hero, (n) => n.tagName === 'h1')[0]).trim(),
    ...(entry.title !== text(all(hero, (n) => n.tagName === 'h1')[0]).trim() ? { cardTitle: entry.title } : {}),
    description: meta(doc, 'description') ?? '',
    author: pageAuthor,
    ...(entry.author !== pageAuthor ? { byline: entry.author } : {}),
    avatar: avatarOf(all(hero, (n) => n.tagName === 'span' && hasClass(n, 'nw-article-avatar'))[0]),
    ...(time ? { publishedTime: attr(time, 'datetime'), dateLabel: text(time).trim() } : {}),
    ...(coverImg ? { cover: { src: rewriteUrl(attr(coverImg, 'src')), alt: attr(coverImg, 'alt') ?? '' } } : {}),
    ...(ogImage && ogImage !== (coverImg && rewriteUrl(attr(coverImg, 'src'))) ? { ogImage } : {}),
    ...(hasClass(main, 'nw-article-feature') ? { feature: true } : {}),
    ...(version ? { version: text(version).trim() } : {}),
    ...(tools ? { sourceTools: all(tools, (n) => n.tagName === 'a').map((a) => rewriteUrl(attr(a, 'href'))) } : {}),
    excerpt: entry.excerpt,
    ...(entry.featured ? { featured: true, cardImage: entry.image, ...(entry.eager ? { eagerCard: true } : {}) } : {}),
    ...(Object.keys(contentsLabels).length ? { contentsLabels } : {}),
    related,
  });
}

for (const p of posts) { const t = thumbs.get(p.slug); if (t === null) p.thumbnail = null; else if (t && t !== p.cover?.src) p.thumbnail = t; }

const body = `/** One entry per blog post. The article body lives in content/posts/<slug>.html. */
export type Post = {
  slug: string;
  /** Headline on the article page (the browser title adds the site name). */
  title: string;
  /** Headline in blog lists and related articles, when it differs from the article headline. */
  cardTitle?: string;
  description: string;
  /** Author as named on the article page. */
  author: string;
  /** Name shown on the blog index and in related-article lists, when it differs from the author above. */
  byline?: string;
  /** Round avatar: letters, a photo, or the Nous badge. */
  avatar: { initials: string } | { image: string } | { badge: true };
  /** ISO timestamp (used for <time> and og:article:published_time). Omitted for undated posts. */
  publishedTime?: string;
  /** Date as displayed, e.g. "April 2025". */
  dateLabel?: string;
  /** Large image under the headline (a few posts have none). */
  cover?: { src: string; alt: string };
  /** Flagship layout (adds a portrait avatar treatment and the version chip). */
  feature?: boolean;
  /** Version chip next to the cover, e.g. "v1.05". */
  version?: string;
  /** Links to standalone interactive pages, shown as "Published visualization N". */
  sourceTools?: string[];
  /** Share-card image when it differs from the cover. */
  ogImage?: string;
  /** Teaser shown on the blog index and in "related articles". */
  excerpt: string;
  /** Featured posts get a large card at the top of /blog. */
  featured?: boolean;
  cardImage?: string;
  /** Load the card image eagerly (the first card is above the fold). */
  eagerCard?: boolean;
  /** Image in other posts' "Related Articles" rows when it differs from the cover; null = no image. */
  thumbnail?: string | null;
  /** Heading id -> label, for sections whose "Contents" entry reads differently from the heading. */
  contentsLabels?: Record<string, string>;
  /** Slugs shown under "Related Articles". */
  related: string[];
};

/** Blog posts in display order: featured first, then the archive (newest first). */
export const posts: Post[] = ${JSON.stringify(posts, null, 2)};
`;
if (!process.env.BODIES_ONLY) fs.writeFileSync(path.join(ROOT, 'content/posts.ts'), await prettier.format(body, { parser: 'typescript', singleQuote: true, printWidth: 110 }));
console.log(`wrote ${posts.length} posts`);
for (const p of posts) console.log(`  ${p.slug.slice(0, 50).padEnd(50)} ${JSON.stringify(p.avatar).slice(0, 22).padEnd(24)} ${(p.dateLabel ?? "(none)").padEnd(14)} rel:${p.related.length} ${p.ogImage ? 'og≠cover' : ''}`);
