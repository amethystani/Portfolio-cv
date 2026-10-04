import { portfolio } from './portfolio';

/** What the phone menu lists. Each section is an accordion; only one is open at a time. */
export type MenuLink = { label: string; href: string; newTab?: boolean };
export type MenuSection = { title: string; links: MenuLink[] };

const { links } = portfolio;

export const mobileMenu: MenuSection[] = [
  {
    title: 'About',
    links: [
      { label: 'Publications', href: '/releases' },
      { label: 'Experience', href: '/careers' },
      { label: 'Writing', href: '/blog' },
      { label: 'GitHub', href: links.github, newTab: true },
    ],
  },
  {
    title: 'Work',
    links: [
      { label: 'EVIRAG-Bench', href: links.evirag },
      { label: 'Notation Matters', href: links.notation },
      { label: 'Palimpsest', href: links.palimpsest },
      { label: 'DeferSeg', href: links.deferseg },
    ].map((link) => ({ ...link, newTab: true })),
  },
  {
    title: 'Elsewhere',
    links: [
      { label: 'Go to GitHub', href: links.github },
      { label: 'Go to LinkedIn', href: links.linkedin },
      { label: 'Go to ORCID', href: links.orcid },
    ].map((link) => ({ ...link, newTab: true })),
  },
  {
    title: 'Contact',
    links: [
      { label: 'Email', href: `mailto:${portfolio.email}` },
      { label: 'LinkedIn', href: links.linkedin, newTab: true },
      { label: 'animeshmishra.us', href: links.site, newTab: true },
    ],
  },
];

/**
 * The social icons come from one sprite image; each one shows a slice of it
 * (`width` is the slice, `left` how far the sprite is shifted). The sprite has no LinkedIn mark, so only GitHub is here.
 */
export const menuSocials = [{ label: 'GitHub', href: links.github, width: 17.82, left: 34.9274 }];
