import { portfolio } from './portfolio';

export type FooterLink = {
  label: string;
  href: string;
  /** Dimmed text before the label, e.g. "Go to ". */
  prefix?: string;
  newTab?: boolean;
};
export type FooterColumn = { group: string; title: string; links: FooterLink[] };

/** The four link columns in the footer. */
export const footerColumns: FooterColumn[] = [
  {
    group: 'Pages',
    title: 'About',
    links: [
      { label: 'Home', href: '/' },
      { label: 'Publications', href: '/releases' },
      { label: 'Experience', href: '/careers' },
      { label: 'Writing', href: '/blog' },
    ],
  },
  {
    group: 'Research',
    title: 'Work',
    links: [
      { label: 'EVIRAG-Bench', href: portfolio.links.evirag, newTab: true },
      { label: 'Notation Matters', href: portfolio.links.notation, newTab: true },
      { label: 'Palimpsest', href: portfolio.links.palimpsest, newTab: true },
      { label: 'DeferSeg', href: portfolio.links.deferseg, newTab: true },
    ],
  },
  {
    group: 'Profiles',
    title: 'Elsewhere',
    links: [
      { label: 'GitHub', prefix: 'Go to ', href: portfolio.links.github, newTab: true },
      { label: 'LinkedIn', prefix: 'Go to ', href: portfolio.links.linkedin, newTab: true },
      { label: 'ORCID', prefix: 'Go to ', href: portfolio.links.orcid, newTab: true },
    ],
  },
  {
    group: 'Reach out',
    title: 'Contact',
    links: [
      { label: 'Email', href: `mailto:${portfolio.email}` },
      { label: 'Message on LinkedIn', href: portfolio.links.linkedin, newTab: true },
    ],
  },
];
