// One-off: turns the footer + announcements found in the captured home page into typed content files.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { load, footerColumns, announcements } from './extract-shared.mjs';

const OUT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../content');
const doc = load('index.html');
const ts = (v) => JSON.stringify(v, null, 2); // prettier turns this into idiomatic TS

const cols = footerColumns(doc).map(({ links, ...c }) => ({ ...c, links: links.map(({ external, ...l }) => ({ ...l, ...(external ? { newTab: true } : {}) })) }));
fs.writeFileSync(path.join(OUT, 'footer.ts'), `export type FooterLink = {
  label: string;
  href: string;
  /** Dimmed text before the label, e.g. "Go to ". */
  prefix?: string;
  newTab?: boolean;
};
export type FooterColumn = { group: string; title: string; links: FooterLink[] };

/** The four link columns in the footer. */
export const footerColumns: FooterColumn[] = ${ts(cols)};
`);

fs.writeFileSync(path.join(OUT, 'announcements.ts'), `export type Announcement = {
  /** Where the card links to (a post on X). */
  url: string;
  image: string;
  /** Intrinsic size of the image (sets the card's aspect ratio). */
  width: number;
  height: number;
  handle: string;
  text: string;
  /** Display date, shown as written. */
  date: string;
};

/** Cards in the home page "Announcements" strip, newest first. */
export const announcements: Announcement[] = ${ts(announcements(doc))};
`);
console.log('wrote content/footer.ts and content/announcements.ts');
