export type MissionRow = { eyebrow: string; heading: string; body: string; image: string; reverse?: boolean };

export const mission = {
  /** The big title over the mission artwork. */
  title: 'Research and building cool stuff',
  heroImage: '/assets/nous-web/mission-reference/mission-header.webp',
  rows: [
    {
      eyebrow: 'About',
      heading: 'NLP Researcher, New Delhi',
      body: 'Paper at EMNLP 2026 Main (A* venue) on retrieval-augmented generation for science, plus a WMT 2026 paper on blind spots in machine translation evaluation. Presenting both in Budapest.',
      image: '/assets/nous-web/mission-reference/mission-duo-1.webp',
    },
    {
      eyebrow: 'Research',
      heading: 'Evaluation, Retrieval and Scientific AI',
      body: 'How models behave on real scientific tasks, and what they are actually responding to: 88% of 1,072 molecules got inconsistent predictions depending on notation, retrieval that keeps conflicting evidence apart, and translation metrics that cannot see what a tokeniser deletes.',
      image: '/assets/nous-web/mission-reference/mission-duo-2.webp',
      reverse: true,
    },
    {
      eyebrow: 'Building',
      heading: 'Open Source and Fast Teams',
      body: 'Contributed to open-source work at Nous Research, researched at DRDO and Complexity Science Hub Vienna, and co-founded ClerkTree. I like fast, high-output environments over slow academic ones. Looking for my next research role before a PhD.',
      image: '/assets/nous-web/mission-reference/mission-duo-3.webp',
    },
  ] satisfies MissionRow[],
};

type Cta = { label: string; href: string };

export type HermesFeature = {
  /** Picks the artwork treatment in CSS (data-kind). */
  kind: 'terminal' | 'desktop' | 'portal';
  eyebrow: { desktop: string; mobile: string };
  title: string;
  /** One line on the project's card, and the repository it lives in. */
  blurb: string;
  repo: string;
  /** Artwork behind the card (public/assets/work). */
  art?: string;
  /** Desktop and mobile can show different call-to-action wording and targets. */
  cta: { desktop: Cta; mobile: Cta };
};

/** The three project tiles under the "Selected Work" banner. */
export const hermesFeatures: (HermesFeature & { id: string })[] = [
  {
    id: 'evirag-bench',
    art: '/assets/work/evirag.webp',
    kind: 'terminal',
    eyebrow: { desktop: 'Benchmark · EMNLP 2026', mobile: 'Benchmark' },
    title: 'EVIRAG-Bench',
    blurb:
      'Retrieval that keeps conflicting scientific evidence apart instead of collapsing it into one answer.',
    repo: 'amethystani/evirag-bench',
    cta: {
      desktop: { label: 'View on GitHub', href: 'https://github.com/amethystani/evirag-bench' },
      mobile: { label: 'View on GitHub', href: 'https://github.com/amethystani/evirag-bench' },
    },
  },
  {
    id: 'notation-matters',
    art: '/assets/work/notation.webp',
    kind: 'desktop',
    eyebrow: { desktop: 'Paper · Digital Discovery', mobile: 'Paper' },
    title: 'Notation Matters',
    blurb:
      'The same molecule, written four ways, gets four different predictions from chemistry language models.',
    repo: 'amethystani/notation-matters',
    cta: {
      desktop: { label: 'View on GitHub', href: 'https://github.com/amethystani/notation-matters' },
      mobile: { label: 'View on GitHub', href: 'https://github.com/amethystani/notation-matters' },
    },
  },
  {
    id: 'palimpsest',
    art: '/assets/work/palimpsest.webp',
    kind: 'portal',
    eyebrow: { desktop: 'Metric · WMT 2026', mobile: 'Metric' },
    title: 'Palimpsest',
    blurb: 'Translation metrics cannot judge what their tokeniser deletes. LIGATUR and AEGIS can.',
    repo: 'amethystani/palimpsest',
    cta: {
      desktop: { label: 'View on GitHub', href: 'https://github.com/amethystani/palimpsest' },
      mobile: { label: 'View on GitHub', href: 'https://github.com/amethystani/palimpsest' },
    },
  },
];

/** The banner above the project tiles (the big "Selected Work" headline). */
export const work = {
  eyebrow: 'Research you can run',
  title: 'Selected Work',
  /** One sentence split over two columns on desktop. */
  intro: [
    'Open benchmarks, metrics and research code. Disagreement-aware retrieval for science, translation metrics that',
    'notice what tokenisers delete, and chemistry language models probed from the inside, all public on GitHub.',
  ],
  primary: { label: 'Publications', href: '/releases' },
  /** The looping video band under Selected Work (converted from a GIF: about 1 MB instead of 3). */
  band: {
    poster: '/assets/portfolio/terminal-loop-poster.webp',
    sources: [
      { src: '/media/terminal-loop.webm', type: 'video/webm' },
      { src: '/media/terminal-loop.mp4', type: 'video/mp4' },
    ],
  },
  secondary: { label: 'GitHub', href: 'https://github.com/amethystani' },
};

/** The perspective-scroll statement on the home page, in the words of the CV's research statement. */
export const statement = {
  label: 'Research statement',
  text: 'My research asks when language models, and the measurements used to judge them, can be trusted when the underlying knowledge is heterogeneous, conflicting, or uncertain. In scientific retrieval-augmented generation I studied how standard RAG collapses real disagreement between sources into one answer, and proposed a disagreement-aware alternative. In chemistry language models I showed that the same molecule written in different notations gets inconsistent predictions. In LLM fairness auditing I used partial identification to make evaluation uncertainty explicit instead of hiding it.',
};
