import fs from 'node:fs';
import path from 'node:path';
import { affiliations, venues } from '@/content/affiliations';
import { answers } from '@/content/composer';
import { hermesFeatures, mission, statement, work } from '@/content/home';
import { jobs } from '@/content/jobs';
import { portfolio } from '@/content/portfolio';
import { posts } from '@/content/posts';
import { releases } from '@/content/releases';

/**
 * Everything the on-device assistant can draw on, cut into short passages. Served once as a static file
 * (app/api/ai-index/route.ts) and searched in the visitor's browser by public/ai/worker.js.
 */
export type AiChunk = { id: string; title: string; url: string; kind: string; text: string };

const strip = (html: string) =>
  html
    .replace(/<(script|style)[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<\/h\d>/gi, '.\n')
    .replace(/<\/(p|li|div|section|blockquote)>/gi, '\n')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&[#\w]+;/g, ' ')
    .replace(/[ \t]+/g, ' ');

/** Splits long text into passages of about `size` words, on paragraph and sentence boundaries. */
function passages(text: string, size = 90): string[] {
  const sentences = text
    .split(/\n+/)
    .flatMap((p) => p.trim().split(/(?<=[.!?])\s+(?=[A-Z0-9"“(])/))
    .map((s) => s.trim())
    .filter(Boolean);
  const out: string[] = [];
  let current: string[] = [];
  let words = 0;
  for (const s of sentences) {
    const n = s.split(/\s+/).length;
    if (words + n > size && current.length) {
      out.push(current.join(' '));
      current = [];
      words = 0;
    }
    current.push(s);
    words += n;
  }
  if (current.length) out.push(current.join(' '));
  return out;
}

export function buildAiCorpus(): AiChunk[] {
  const chunks: AiChunk[] = [];
  const add = (id: string, title: string, url: string, kind: string, text: string) => {
    passages(text).forEach((part, i) => chunks.push({ id: `${id}#${i}`, title, url, kind, text: part }));
  };

  add(
    'profile',
    portfolio.name,
    '/',
    'page',
    `${portfolio.name} is an ${portfolio.role}. Email: ${portfolio.email}. GitHub: ${portfolio.links.github}. ` +
      `LinkedIn: ${portfolio.links.linkedin}. ORCID: ${portfolio.links.orcid}.`,
  );
  mission.rows.forEach((row, i) => add(`mission-${i}`, row.heading, '/', 'page', `${row.eyebrow}: ${row.heading}. ${row.body}`));
  add('statement', statement.label, '/', 'page', statement.text);
  add('work', work.title, '/#hermes', 'page', `${work.eyebrow}. ${work.intro.join(' ')}`);
  hermesFeatures.forEach((f) =>
    add(`project-${f.id}`, f.title, f.cta.desktop.href, 'project', `${f.title}: ${f.eyebrow.desktop}.`),
  );

  answers.forEach((a, i) =>
    add(
      `answer-${i}`,
      a.question,
      a.learn,
      'answer',
      `${a.question} ${a.answer}${/\bemail\b/i.test(a.answer) ? ` His email is ${portfolio.email}.` : ''}`,
    ),
  );

  releases.forEach((r, i) =>
    add(`release-${i}`, r.title, r.href, 'publication', `${r.type} (${r.date}): ${r.title}. ${r.description}`),
  );

  // e.g. "EMNLP, conference, 2026: Main Conference · CORE A* · Budapest. Status: accepted."
  [...venues, ...affiliations].forEach((b, i) =>
    add(
      `badge-${i}`,
      b.name,
      b.href,
      'venue',
      `${b.name}, ${b.kind.toLowerCase()}${/\d/.test(b.when) ? `, ${b.when}` : ''}: ${b.note.replace(/ · /g, ', ')}. Status: ${b.status.toLowerCase()}.`,
    ),
  );

  jobs.forEach((j) =>
    add(
      `job-${j.slug}`,
      j.title,
      `/careers/${j.slug}`,
      'experience',
      [
        `${j.title}. ${j.summary} ${j.eyebrow}. ${j.location}.`,
        ...j.intro,
        ...j.sections.map((s) => `${s.heading}: ${s.items.join('; ')}.`),
      ].join('\n'),
    ),
  );

  for (const post of posts) {
    let body = '';
    try {
      body = strip(fs.readFileSync(path.join(process.cwd(), 'content/posts', `${post.slug}.html`), 'utf8'));
    } catch {
      /* body unavailable: the title and summary still go in */
    }
    add(`post-${post.slug}`, post.cardTitle ?? post.title, `/${post.slug}`, 'writing', `${post.title}. ${post.description}\n${body}`);
  }
  return chunks;
}
