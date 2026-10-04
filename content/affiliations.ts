/** The badge wall on the home page: where the work has been published or presented, and who it was done with. */
export type GlyphKind = 'rings' | 'grid' | 'hatch' | 'squares' | 'wave' | 'cross' | 'steps' | 'orbit';

export type Badge = {
  /** The wordmark on the tile. */
  name: string;
  /** Small label top left, e.g. CONFERENCE. */
  kind: string;
  /** One line under the name. */
  note: string;
  /** Bottom left: year or span. */
  when: string;
  /** Bottom right: ACCEPTED, PUBLISHED, ... */
  status: string;
  glyph: GlyphKind;
  href: string;
};

export const venues: Badge[] = [
  {
    name: 'EMNLP',
    kind: 'Conference',
    note: 'Main Conference · CORE A* · Budapest',
    when: '2026',
    status: 'Accepted',
    glyph: 'rings',
    href: '/releases',
  },
  {
    name: 'WMT',
    kind: 'Workshop',
    note: 'Proceedings, poster · Budapest',
    when: '2026',
    status: 'Accepted',
    glyph: 'hatch',
    href: '/releases',
  },
  {
    name: 'Digital Discovery',
    kind: 'Journal',
    note: 'Royal Society of Chemistry · Gold Open Access',
    when: '2026',
    status: 'Published',
    glyph: 'orbit',
    href: '/releases',
  },
  {
    name: 'AACL-IJCNLP',
    kind: 'Workshop',
    note: 'Student Research Workshop',
    when: '2026',
    status: 'Accepted',
    glyph: 'steps',
    href: '/releases',
  },
  {
    name: 'Measurement',
    kind: 'Journal',
    note: 'Elsevier · Vol. 274',
    when: '2026',
    status: 'Published',
    glyph: 'wave',
    href: '/releases',
  },
  {
    name: 'IBM VAKRA',
    kind: 'Benchmark',
    note: 'Tool selection, ranked #2 globally',
    when: '2026',
    status: 'Rank #2',
    glyph: 'cross',
    href: '/releases',
  },
];

export const affiliations: Badge[] = [
  {
    name: 'Nous Research',
    kind: 'Open source',
    note: 'Contributor · agent tooling and RL infrastructure',
    when: '2025–26',
    status: 'Contributor',
    glyph: 'squares',
    href: '/careers/nous-research-contributor',
  },
  {
    name: 'ClerkTree',
    kind: 'Startup',
    note: 'Co-founder, tech · Machina',
    when: '2025',
    status: 'Co-founder',
    glyph: 'grid',
    href: '/careers/clerktree-co-founder',
  },
  {
    name: 'Complexity Science Hub',
    kind: 'Research',
    note: 'Student researcher · Vienna',
    when: '2025',
    status: 'Researcher',
    glyph: 'orbit',
    href: '/careers/complexity-science-hub-student-researcher',
  },
  {
    name: 'DRDO',
    kind: 'Research',
    note: 'Research',
    when: '—',
    status: 'Researcher',
    glyph: 'cross',
    href: '/careers',
  },
  {
    name: 'ACL',
    kind: 'Volunteer',
    note: 'Research volunteer coordinator',
    when: '2026–',
    status: 'Coordinator',
    glyph: 'rings',
    href: '/careers/acl-research-volunteer-coordinator',
  },
  {
    name: 'Consultadd',
    kind: 'Internship',
    note: 'Quantitative research analyst · New York',
    when: '2025',
    status: 'Intern',
    glyph: 'wave',
    href: '/careers/consultadd-quantitative-research-analyst',
  },
  {
    name: 'HFCL · Exicom',
    kind: 'Internship',
    note: 'DCT-R&D · Gurugram',
    when: '2024',
    status: 'Intern',
    glyph: 'hatch',
    href: '/careers/hfcl-dct-research-and-development',
  },
  {
    name: 'Shiv Nadar',
    kind: 'University',
    note: 'B.Tech, Computer Science and Engineering',
    when: '2022–26',
    status: 'B.Tech',
    glyph: 'steps',
    href: '/careers',
  },
];
