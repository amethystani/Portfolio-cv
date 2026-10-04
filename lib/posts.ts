import fs from 'node:fs';
import path from 'node:path';
import { posts, type Post } from '@/content/posts';

export const allPosts = posts;
export const featuredPosts = posts.filter((p) => p.featured);
export const archivePosts = posts.filter((p) => !p.featured);

export function getPost(slug: string): Post | undefined {
  return posts.find((p) => p.slug === slug);
}

/** The article body: content/posts/<slug>.html (read at build time). */
export function getPostBody(slug: string): string {
  return fs.readFileSync(path.join(process.cwd(), 'content/posts', `${slug}.html`), 'utf8');
}

/** Headline used in blog lists and related-article rows. */
export const cardTitle = (post: Post) => post.cardTitle ?? post.title;

export type Heading = { id: string; text: string };

const decode = (html: string) =>
  html
    .replace(/<[^>]*>/g, '')
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, ' ')
    .trim();

/** The sections listed under "Contents": every h2 and h3 in the article body, in order. */
export function articleHeadings(html: string, labels: Record<string, string> = {}): Heading[] {
  const out: Heading[] = [];
  for (const m of html.matchAll(/<h([23])\b([^>]*)>([\s\S]*?)<\/h\1>/gi)) {
    const id = /\bid="([^"]+)"/.exec(m[2])?.[1];
    if (id) out.push({ id, text: labels[id] ?? decode(m[3]) });
  }
  return out;
}
