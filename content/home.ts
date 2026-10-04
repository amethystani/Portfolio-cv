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
  image: string;
  /** Desktop and mobile can show different call-to-action wording and targets. */
  cta: { desktop: Cta; mobile: Cta };
};

/** The three project tiles under the "Selected Work" banner. */
export const hermesFeatures: (HermesFeature & { id: string })[] = [
  {
    id: 'evirag-bench',
    kind: 'terminal',
    eyebrow: { desktop: 'Benchmark · EMNLP 2026', mobile: 'Benchmark' },
    title: 'EVIRAG-Bench',
    image: '/assets/nous-web/mobile-home/product-terminal.png',
    cta: {
      desktop: { label: 'View on GitHub', href: 'https://github.com/amethystani/evirag-bench' },
      mobile: { label: 'View on GitHub', href: 'https://github.com/amethystani/evirag-bench' },
    },
  },
  {
    id: 'notation-matters',
    kind: 'desktop',
    eyebrow: { desktop: 'Paper · Digital Discovery', mobile: 'Paper' },
    title: 'Notation Matters',
    image: '/assets/nous-web/mobile-home/product-desktop.webp',
    cta: {
      desktop: { label: 'View on GitHub', href: 'https://github.com/amethystani/notation-matters' },
      mobile: { label: 'View on GitHub', href: 'https://github.com/amethystani/notation-matters' },
    },
  },
  {
    id: 'palimpsest',
    kind: 'portal',
    eyebrow: { desktop: 'Metric · WMT 2026', mobile: 'Metric' },
    title: 'Palimpsest',
    image: '/assets/nous-web/mobile-home/product-portal.webp',
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
  secondary: { label: 'GitHub', href: 'https://github.com/amethystani' },
  band: { poster: '/assets/nous-web/hermes-demo-poster.webp', video: '/media/hermes-desktop.mp4' },
};

/** The perspective-scroll statement on the home page, in the words of the CV's research statement. */
export const statement = {
  label: 'Research statement',
  text: 'My research asks when language models, and the measurements used to judge them, can be trusted when the underlying knowledge is heterogeneous, conflicting, or uncertain. In scientific retrieval-augmented generation I studied how standard RAG collapses real disagreement between sources into one answer, and proposed a disagreement-aware alternative. In chemistry language models I showed that the same molecule written in different notations gets inconsistent predictions. In LLM fairness auditing I used partial identification to make evaluation uncertainty explicit instead of hiding it.',
};
