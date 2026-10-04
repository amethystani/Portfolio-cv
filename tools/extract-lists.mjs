// One-off: turns the captured releases + careers pages into content/releases.ts and content/jobs.ts.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { serialize } from 'parse5';
import prettier from 'prettier';
import { load, all, attr, text } from './extract-shared.mjs';
import { findNode, rewriteUrl } from './html-to-jsx.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const fmt = (src) => prettier.format(src, { parser: 'typescript', singleQuote: true, printWidth: 110 });
const hasClass = (n, c) => (attr(n, 'class') || '').split(/\s+/).includes(c);
const t = (n) => text(n).replace(/\s+/g, ' ').trim();
const inner = (n) => serialize(n).trim();

// ------------------------------------------------------------------ releases
{
  const doc = load('releases/index.html');
  const rows = all(findNode(doc, '#release-list'), (n) => n.tagName === 'article').map((a) => {
    const spans = all(a, (n) => n.tagName === 'span').map(t);
    const link = all(a, (n) => n.tagName === 'a')[0];
    return { date: spans[0], type: spans[1], size: spans[2], title: t(link), href: rewriteUrl(attr(link, 'href')), description: t(all(a, (n) => n.tagName === 'p')[0]) };
  });
  const sizes = new Set(rows.map((r) => r.size));
  console.log('releases:', rows.length, 'sizes:', [...sizes]);
  const clean = rows.map(({ size, ...r }) => (size && size !== '—' ? { ...r, size } : r));
  fs.writeFileSync(path.join(ROOT, 'content/releases.ts'), await fmt(`export type Release = {
  /** MM/DD/YY, shown as written. */
  date: string;
  /** Category tag: MODEL, PAPER, DATASET, ... */
  type: string;
  /** Optional size column (omit to show an em dash). */
  size?: string;
  title: string;
  href: string;
  description: string;
};

/** Newest first. The page shows the first ${9} and reveals the rest with "Show more". */
export const releases: Release[] = ${JSON.stringify(clean, null, 2)};
`));
}

// ------------------------------------------------------------------ jobs
{
  const idx = load('careers/index.html');
  const list = all(findNode(idx, '#role-list'), (n) => n.tagName === 'article' && hasClass(n, 'nw-role-row'));
  const jobs = [];
  const variations = { eyebrow: new Set(), apply: new Set(), inlineMarkup: [] };
  for (const a of list) {
    const link = all(a, (n) => n.tagName === 'a' && rewriteUrl(attr(n, 'href') || '').startsWith('/careers/'))[0];
    const slug = rewriteUrl(attr(link, 'href')).replace('/careers/', '');
    const tags = all(all(a, (n) => n.tagName === 'div' && hasClass(n, 'nw-catalogue-tags'))[0], (n) => n.tagName === 'span').map(t);
    const summary = t(all(a, (n) => n.tagName === 'p')[0]);

    const doc = load(`careers/${slug}/index.html`);
    const main = findNode(doc, 'main');
    const hero = findNode(main, 'header');
    const intro = all(findNode(hero, '.nw-career-intro'), (n) => n.tagName === 'p');
    const sections = all(main, (n) => n.tagName === 'section' && (attr(n, 'aria-labelledby') || '').endsWith('-heading') && !hasClass(n, 'nw-career-apply')).map((s) => {
      const items = all(s, (n) => n.tagName === 'li');
      items.forEach((li) => { if (all(li, (n) => n.tagName && n.tagName !== 'li').length) variations.inlineMarkup.push(`${slug}: ${t(li).slice(0, 50)}`); });
      return { heading: t(all(s, (n) => n.tagName === 'h2')[0]), items: items.map(t) };
    });
    const apply = findNode(main, '.nw-career-apply-copy');
    const applyItems = all(apply, (n) => n.tagName === 'li').map(t);
    variations.apply.add(JSON.stringify(applyItems));
    variations.eyebrow.add(t(all(hero, (n) => n.tagName === 'p' && hasClass(n, 'nw-catalogue-eyebrow'))[0]));
    const mailto = attr(all(main, (n) => n.tagName === 'a' && (attr(n, 'href') || '').startsWith('mailto:'))[0], 'href');
    jobs.push({
      slug, title: t(all(all(hero, (n) => n.tagName === 'h1')[0], (n) => n.tagName === 'span')[1]), summary,
      employment: tags[0], location: tags[1],
      eyebrow: t(all(hero, (n) => n.tagName === 'p' && hasClass(n, 'nw-catalogue-eyebrow'))[0]),
      intro: intro.map(t), sections,
      subject: decodeURIComponent((mailto.split('subject=')[1] ?? '')),
    });
  }
  console.log('jobs:', jobs.length, ' distinct apply lists:', variations.apply.size, ' eyebrows:', [...variations.eyebrow].join(' | '));
  console.log('inline markup in list items:', variations.inlineMarkup.length, variations.inlineMarkup.slice(0, 3));
  console.log('section headings:', [...new Set(jobs.flatMap((j) => j.sections.map((s) => s.heading)))].join(' | '));
  console.log('apply list:', [...variations.apply][0]);
  fs.writeFileSync(path.join(ROOT, 'content/jobs.ts'), await fmt(`export type JobSection = { heading: string; items: string[] };

export type Job = {
  slug: string;
  title: string;
  /** One-line description shown in the roles list. */
  summary: string;
  /** Shown as a tag in the roles list, e.g. "Full time". */
  employment: string;
  location: string;
  /** Small line above the title on the job page, e.g. "Full time, Remote". */
  eyebrow: string;
  /** Intro paragraphs under the title. */
  intro: string[];
  sections: JobSection[];
  /** Subject line of the application email. */
  subject: string;
};

export const jobs: Job[] = ${JSON.stringify(jobs, null, 2)};

/** What candidates are asked to include (identical on every job page). */
export const applicationChecklist: string[] = ${JSON.stringify(JSON.parse([...variations.apply][0]), null, 2)};

export const recruitingEmail = 'recruiting@nousresearch.com';
`));
}
