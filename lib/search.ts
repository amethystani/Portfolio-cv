import fs from 'node:fs';
import path from 'node:path';
import { jobs } from '@/content/jobs';
import { posts } from '@/content/posts';
import { portfolio } from '@/content/portfolio';
import { releases } from '@/content/releases';

export type SearchMatch = { id: string; title: string; text: string };
export type SearchResult = {
  id: string;
  kind: 'page' | 'release' | 'post' | 'career';
  title: string;
  url: string;
  excerpt?: string;
  /** For careers: the individual roles that matched. */
  matches?: SearchMatch[];
};

type Doc = SearchResult & { haystack: string; titleLower: string };

const strip = (html: string) =>
  html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&[#\w]+;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
const clip = (text: string, n = 170) =>
  text.length > n ? `${text.slice(0, n).replace(/\s+\S*$/, '')}…` : text;

/** Pages worth finding that are not blog posts or releases. */
const PAGES: { title: string; url: string; text: string }[] = [
  {
    title: 'About Animesh Mishra',
    url: '/',
    text: 'ML/NLP researcher. EMNLP 2026 Main and WMT 2026 papers, scientific AI, evaluation and open-source work.',
  },
  {
    title: 'Selected work',
    url: '/#hermes',
    text: 'EVIRAG-Bench, Notation Matters and Palimpsest: open benchmarks, metrics and research code on GitHub.',
  },
  {
    title: 'GitHub',
    url: portfolio.links.github,
    text: 'Code and research repositories by Animesh Mishra.',
  },
  {
    title: 'LinkedIn',
    url: portfolio.links.linkedin,
    text: 'Updates, posts and background.',
  },
  {
    title: 'Publications',
    url: '/releases',
    text: 'Papers, benchmarks and releases by Animesh Mishra.',
  },
  { title: 'Writing', url: '/blog', text: 'Posts and notes from Animesh Mishra.' },
  {
    title: 'Experience',
    url: '/careers',
    text: 'Research and industry roles: Nous Research, ClerkTree, Complexity Science Hub Vienna, DRDO.',
  },
];

let index: Doc[] | undefined;

function build(): Doc[] {
  const docs: Doc[] = [];
  const add = (doc: SearchResult, extra = '') =>
    docs.push({
      ...doc,
      titleLower: doc.title.toLowerCase(),
      haystack: `${doc.title} ${doc.excerpt ?? ''} ${extra}`.toLowerCase(),
    });

  PAGES.forEach((p) =>
    add({ id: `page:${p.title}`, kind: 'page', title: p.title, url: p.url, excerpt: p.text }),
  );
  releases.forEach((r) =>
    add({
      id: `release:${r.title}`,
      kind: 'release',
      title: r.title,
      url: r.href,
      excerpt: `${r.description} Type: ${r.type} Date: ${r.date}`,
    }),
  );
  for (const post of posts) {
    let body = '';
    try {
      body = strip(fs.readFileSync(path.join(process.cwd(), 'content/posts', `${post.slug}.html`), 'utf8'));
    } catch {
      /* body unavailable: search title and summary only */
    }
    add(
      {
        id: `post:${post.slug}`,
        kind: 'post',
        title: post.cardTitle ?? post.title,
        url: `/${post.slug}`,
        excerpt: clip(post.description || post.excerpt),
      },
      `${post.author} ${body}`,
    );
  }
  return docs;
}

const tokens = (query: string) =>
  query
    .toLowerCase()
    .split(/[^a-z0-9.+#-]+/)
    .filter((t) => t.length >= 2);

/** Ranks the site's content for a query: title hits count most, every word must appear somewhere. */
export function searchSite(query: string, limit = 5): SearchResult[] {
  index ??= build();
  const words = tokens(query);
  if (!words.length) return [];
  const phrase = query.trim().toLowerCase();

  const scored = index
    .map((doc) => {
      if (!words.every((w) => doc.haystack.includes(w))) return { doc, score: 0 };
      let score = words.reduce(
        (sum, w) => sum + (doc.titleLower.includes(w) ? 6 : 0) + (doc.haystack.split(w).length - 1),
        0,
      );
      if (doc.titleLower.includes(phrase)) score += 10;
      if (doc.titleLower.startsWith(phrase)) score += 5;
      if (doc.kind === 'page') score += 3; // official pages first
      return { doc, score };
    })
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ doc }): SearchResult => ({
      id: doc.id,
      kind: doc.kind,
      title: doc.title,
      url: doc.url,
      excerpt: doc.excerpt,
    }));

  // Matching roles are grouped under one "Experience" entry.
  const roles = jobs.filter((j) =>
    words.every((w) => `${j.title} ${j.summary} ${j.location}`.toLowerCase().includes(w)),
  );
  if (roles.length) {
    const group: SearchResult = {
      id: 'career:roles',
      kind: 'career',
      title: 'Experience',
      url: '/careers',
      matches: roles.slice(0, 3).map((j) => ({ id: j.slug, title: j.title, text: j.summary })),
    };
    scored.splice(Math.min(1, scored.length), 0, group);
    return scored.slice(0, limit);
  }
  return scored;
}
