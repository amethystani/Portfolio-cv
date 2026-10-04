import { portfolio } from './portfolio';

/** Top navigation. Each label opens a panel in the research-navigation dropdown (see ResearchNavigation). */
export const navigation = {
  left: ['About', 'Work'],
  right: ['Elsewhere', 'Contact'],
} as const;

export const socials = [
  { label: 'GitHub', href: portfolio.links.github },
  { label: 'LinkedIn', href: portfolio.links.linkedin },
] as const;
