import { portfolio } from './portfolio';

/** Content of the dropdown panels opened by the header's About / Work / Elsewhere / Contact triggers. */
export type NavLink = {
  label: string;
  /** Dimmed lead-in before the label, e.g. "For" in "For Business". */
  muted?: string;
  description?: string;
  href: string;
  newTab?: boolean;
};

export type NavSection = {
  /** Small label above the heading, e.g. "Product". */
  category: string;
  heading: string;
  links: NavLink[];
  /** Product shots shown beside the links (the merch section). */
  merch?: string[];
};

export type PromoKind = 'hermes' | 'portal' | 'nous';
export type NavPanelName = 'About' | 'Work' | 'Elsewhere' | 'Contact';
export type NavPanel = { promo: PromoKind; sections: NavSection[] };

export const navPanels: Record<NavPanelName, NavPanel> = {
  About: {
    promo: 'hermes',
    sections: [
      {
        category: 'Pages',
        heading: 'About',
        links: [
          { label: 'Publications', description: 'Papers, benchmarks and releases', href: '/releases' },
          { label: 'Experience', description: 'Research and industry roles', href: '/careers' },
          { label: 'Writing', description: 'Posts and notes', href: '/blog' },
        ],
      },
      {
        category: 'Code',
        heading: 'GitHub',
        links: [{ label: 'Visit GitHub', href: portfolio.links.github, newTab: true }],
      },
    ],
  },
  Work: {
    promo: 'hermes',
    sections: [
      {
        category: 'Research',
        heading: 'Work',
        links: [
          {
            label: 'EVIRAG-Bench',
            description: 'Disagreement-aware scientific RAG',
            href: portfolio.links.evirag,
            newTab: true,
          },
          {
            label: 'Notation Matters',
            description: 'Chemistry language models',
            href: portfolio.links.notation,
            newTab: true,
          },
          {
            label: 'Palimpsest',
            description: 'Blind spots in translation metrics',
            href: portfolio.links.palimpsest,
            newTab: true,
          },
          {
            label: 'DeferSeg',
            description: 'Tile-scheduled neural passes for real-time compositing',
            href: portfolio.links.deferseg,
            newTab: true,
          },
        ],
      },
      {
        category: 'Venues',
        heading: 'Papers',
        links: [
          {
            label: 'EMNLP 2026',
            muted: 'At',
            description: 'Main conference, Budapest',
            href: '/emnlp-2026-beyond-epistemic-collapse',
          },
          { label: 'WMT 2026', muted: 'At', description: 'Proceedings, Budapest', href: '/wmt-2026-translation-metrics' },
          {
            label: 'Digital Discovery',
            muted: 'In',
            description: 'Royal Society of Chemistry',
            href: '/notation-matters-in-digital-discovery',
          },
        ],
      },
    ],
  },
  Elsewhere: {
    promo: 'hermes',
    sections: [
      {
        category: 'Profiles',
        heading: 'Elsewhere',
        links: [
          {
            label: 'GitHub',
            muted: 'Go to',
            description: 'Code and research repositories',
            href: portfolio.links.github,
            newTab: true,
          },
          {
            label: 'LinkedIn',
            muted: 'Go to',
            description: 'Updates and posts',
            href: portfolio.links.linkedin,
            newTab: true,
          },
          {
            label: 'ORCID',
            muted: 'Go to',
            description: 'Publication record',
            href: portfolio.links.orcid,
            newTab: true,
          },
        ],
      },
    ],
  },
  Contact: {
    promo: 'portal',
    sections: [
      {
        category: 'Say hello',
        heading: 'Contact',
        links: [
          {
            label: 'Email',
            description: portfolio.email,
            href: `mailto:${portfolio.email}`,
          },
          {
            label: 'LinkedIn',
            description: 'Message me on LinkedIn',
            href: portfolio.links.linkedin,
            newTab: true,
          },
        ],
      },
    ],
  },
};

/** The rotating banner at the top of every panel (use the arrows to cycle). */
export const promos = [
  {
    kind: 'hermes',
    label: 'EMNLP 2026',
    text: 'Beyond Epistemic Collapse: disagreement-aware scientific RAG, with EVIRAG-Bench.',
    href: portfolio.links.evirag,
    external: true,
  },
  {
    kind: 'portal',
    label: 'Get in touch',
    text: 'Looking for my next research role before a PhD. Say hello.',
    href: `mailto:${portfolio.email}`,
    // a mailto opens the mail app; a new tab would only leave a blank page behind
    external: false,
  },
  {
    kind: 'nous',
    label: 'Experience',
    text: 'Research and industry work, from ClerkTree to Complexity Science Hub Vienna.',
    href: '/careers',
    external: false,
  },
] as const satisfies readonly {
  kind: PromoKind;
  label: string;
  text: string;
  href: string;
  external: boolean;
}[];
