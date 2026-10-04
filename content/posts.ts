/** One entry per blog post. The article body lives in content/posts/<slug>.html. */
export type Post = {
  slug: string;
  /** Topic chip in the Writing filters: Paper, Project, Conference, Benchmark. */
  tag?: string;
  /** Headline on the article page (the browser title adds the site name). */
  title: string;
  /** Headline in blog lists and related articles, when it differs from the article headline. */
  cardTitle?: string;
  description: string;
  /** Author as named on the article page. */
  author: string;
  /** Name shown on the blog index and in related-article lists, when it differs from the author above. */
  byline?: string;
  /** Round avatar: letters, a photo, or the site mark. */
  avatar: { initials: string } | { image: string } | { badge: true };
  /** ISO timestamp (used for <time> and og:article:published_time). Omitted for undated posts. */
  publishedTime?: string;
  /** Date as displayed, e.g. "April 2025". */
  dateLabel?: string;
  /** Large image under the headline (a few posts have none). */
  cover?: { src: string; alt: string };
  /** Flagship layout (adds a portrait avatar treatment and the version chip). */
  feature?: boolean;
  /** Version chip next to the cover, e.g. "v1.05". */
  version?: string;
  /** Links to standalone interactive pages, shown as "Published visualization N". */
  sourceTools?: string[];
  /** Share-card image when it differs from the cover. */
  ogImage?: string;
  /** Teaser shown on the blog index and in "related articles". */
  excerpt: string;
  /** Featured posts get a large card at the top of /blog. */
  featured?: boolean;
  cardImage?: string;
  /** Load the card image eagerly (the first card is above the fold). */
  eagerCard?: boolean;
  /** Image in other posts' "Related Articles" rows when it differs from the cover; null = no image. */
  thumbnail?: string | null;
  /** Heading id -> label, for sections whose "Contents" entry reads differently from the heading. */
  contentsLabels?: Record<string, string>;
  /** Slugs shown under "Related Articles". */
  related: string[];
};

/** Blog posts in display order: featured first, then the archive (newest first). */
export const posts: Post[] = [
  {
    slug: 'notation-matters-in-digital-discovery',
    tag: 'Paper',
    title: 'Notation matters: chemistry language models and what is inside them',
    description:
      'My paper on cross-representation inconsistency in chemistry language models and its mechanistic origins is published in Digital Discovery (Royal Society of Chemistry) as a Gold Open Access article.',
    author: 'Animesh Mishra',
    avatar: { initials: 'AM' },
    publishedTime: '2026-09-23T12:00:00+00:00',
    dateLabel: 'September 2026',
    excerpt:
      'The same molecule written as SMILES, IUPAC, InChI or SELFIES gave inconsistent predictions for 88% of 1,072 molecules. What happens inside the model?',
    featured: true,
    cover: { src: '/assets/portfolio/animesh-mishra-poster.webp', alt: 'Animesh Mishra' },
    cardImage: '/assets/portfolio/animesh-mishra-poster.webp',
    eagerCard: true,
    related: ['emnlp-2026-beyond-epistemic-collapse', 'wmt-2026-translation-metrics', 'juris-ibm-vakra'],
  },
  {
    slug: 'fruit-fly-connectome-trading',
    tag: 'Project',
    title: 'I made a fruit fly trade crypto',
    description:
      'A weekend project with Krishang Sharma: the fruit-fly connectome wired into a trading system on Binance Spot Testnet, with dopamine-gated plasticity driven by realised P&L.',
    author: 'Animesh Mishra',
    avatar: { initials: 'AM' },
    publishedTime: '2026-09-20T12:00:00+00:00',
    dateLabel: 'September 2026',
    excerpt:
      'I have been trading crypto for a while. So I tried something I probably should not have: what if I made the fruit fly trade crypto?',
    related: ['notation-matters-in-digital-discovery', 'global-fintech-fest-2026', 'juris-ibm-vakra'],
  },
  {
    slug: 'global-fintech-fest-2026',
    tag: 'Conference',
    title: 'What I took away from Global Fintech Fest 2026',
    description:
      'Notes from Global Fintech Fest 2026: real-world language data, voice agents, and where verification should happen when AI creates and acts inside the same system.',
    author: 'Animesh Mishra',
    avatar: { initials: 'AM' },
    publishedTime: '2026-09-14T12:00:00+00:00',
    dateLabel: 'September 2026',
    excerpt:
      'I went in mostly curious about what people were building. I came out thinking much more about what we still do not understand.',
    related: ['fruit-fly-connectome-trading', 'wmt-2026-translation-metrics', 'juris-ibm-vakra'],
  },
  {
    slug: 'wmt-2026-translation-metrics',
    tag: 'Paper',
    title: 'Translation metrics cannot judge what their tokeniser deletes',
    description:
      'Our WMT 2026 paper on blind spots in machine translation evaluation: invisible Unicode corruptions that get normalised away during tokenisation, explored through LIGATUR and AEGIS.',
    author: 'Animesh Mishra',
    avatar: { initials: 'AM' },
    publishedTime: '2026-09-04T12:00:00+00:00',
    dateLabel: 'September 2026',
    excerpt:
      'Certain invisible Unicode corruptions get normalised away during tokenisation, making a corrupted translation and the clean version identical to the metric at the input level.',
    related: [
      'emnlp-2026-beyond-epistemic-collapse',
      'notation-matters-in-digital-discovery',
      'global-fintech-fest-2026',
    ],
  },
  {
    slug: 'emnlp-2026-beyond-epistemic-collapse',
    tag: 'Paper',
    title: 'Beyond epistemic collapse: disagreement-aware scientific RAG',
    description:
      'Our paper at EMNLP 2026 (CORE A*): EVIRAG, a disagreement-aware retrieval-augmented generation framework, and EVIRAG-BENCH, a 1,250-query benchmark across five scientific domains.',
    author: 'Animesh Mishra',
    avatar: { initials: 'AM' },
    publishedTime: '2026-08-22T12:00:00+00:00',
    dateLabel: 'August 2026',
    excerpt:
      'EVIRAG is designed to prevent LLMs from collapsing conflicting scientific evidence into a single answer.',
    related: ['wmt-2026-translation-metrics', 'notation-matters-in-digital-discovery', 'juris-ibm-vakra'],
  },
  {
    slug: 'juris-ibm-vakra',
    tag: 'Benchmark',
    title: 'Juris ranked #2 globally on IBM VAKRA for tool selection',
    description:
      'Our agent Juris ranked #2 globally on the IBM VAKRA benchmark for tool selection, using a 36B model and a capability-specific routing stack.',
    author: 'Animesh Mishra',
    avatar: { initials: 'AM' },
    publishedTime: '2026-05-24T12:00:00+00:00',
    dateLabel: 'May 2026',
    excerpt:
      'A lot of work went into making the agent do less and choose better. A 36B model turned out to be more than enough.',
    related: [
      'emnlp-2026-beyond-epistemic-collapse',
      'fruit-fly-connectome-trading',
      'notation-matters-in-digital-discovery',
    ],
  },
];
