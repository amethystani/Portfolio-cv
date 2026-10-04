import { portfolio } from './portfolio';

export type Release = {
  /** MM/DD/YY, shown as written (a bare year is fine when the day is unknown). */
  date: string;
  /** Category tag: PAPER, DATASET, CODE, ... */
  type: string;
  /** Optional size column (omit to show an em dash). */
  size?: string;
  title: string;
  href: string;
  description: string;
};

/** Newest first. The page shows the first 9 and reveals the rest with "Show more". */
export const releases: Release[] = [
  {
    date: '10/02/26',
    type: 'CODE',
    title: 'DeferSeg',
    href: portfolio.links.deferseg,
    description: 'Tile-scheduled neural passes for real-time compositing.',
  },
  {
    date: '09/23/26',
    type: 'PAPER',
    title:
      'Notation matters: cross-representation inconsistency in chemistry language models and its mechanistic origins',
    href: 'https://lnkd.in/dBrV7SGx',
    description:
      'Digital Discovery, Royal Society of Chemistry (Gold Open Access). The same molecule written as SMILES, IUPAC, InChI or SELFIES gave inconsistent predictions for 88% of 1,072 molecules, and ChemBERTa-2 representations of identical molecules diverge layer by layer.',
  },
  {
    date: '09/20/26',
    type: 'CODE',
    title: 'Fruit-fly connectome trader',
    href: 'https://lnkd.in/d898bxDe',
    description:
      'A weekend project with Krishang Sharma: the fruit-fly mushroom-body circuit wired into a trading system on Binance Spot Testnet, with dopamine-gated plasticity driven by realised P&L. Open-sourced on GitHub.',
  },
  {
    date: '09/04/26',
    type: 'PAPER',
    title: 'Translation Metrics Cannot Judge What Their Tokeniser Deletes',
    href: portfolio.links.palimpsest,
    description:
      'WMT26 (poster), co-located with EMNLP 2026, Budapest. LIGATUR and AEGIS submissions to the shared task on automated translation quality evaluation, with Krishang Sharma and Sonia Khetarpaul.',
  },
  {
    date: '09/04/26',
    type: 'DATASET',
    size: '171 items',
    title: 'LIGATUR',
    href: portfolio.links.palimpsest,
    description:
      'A contrastive challenge set (English-German, English-Hindi) separating Unicode-level corruption from semantic error, released with the Palimpsest code and the AEGIS metric.',
  },
  {
    date: '08/22/26',
    type: 'PAPER',
    title: 'Beyond Epistemic Collapse: Disagreement-Aware Scientific Retrieval-Augmented Generation',
    href: portfolio.links.evirag,
    description:
      'EMNLP 2026, Main Conference (CORE A*). EVIRAG keeps conflicting scientific evidence apart instead of collapsing it into one answer, and improves contradiction recall and viewpoint coverage over standard RAG. With Krishang Sharma and Sonia Khetarpaul.',
  },
  {
    date: '08/22/26',
    type: 'DATASET',
    size: '1,250 queries',
    title: 'EVIRAG-BENCH',
    href: portfolio.links.evirag,
    description:
      'A benchmark spanning five scientific domains, with a Rust pipeline, evaluation metrics and corpus tools.',
  },
  {
    date: '07/26/26',
    type: 'CODE',
    title: 'Machina (ClerkTree)',
    href: 'https://lnkd.in/d-fipCH7',
    description:
      "ClerkTree's first public research release: open machine intelligence for industrial machines, covering bearing-fault classification, remaining useful life, visual quality inspection and evidence-grounded industrial reasoning.",
  },
  {
    date: '05/24/26',
    type: 'AGENT',
    title: 'Juris on IBM VAKRA',
    href: portfolio.links.linkedin,
    description:
      'Ranked #2 globally for tool selection. A 36B model with a capability-specific routing stack over roughly 8,000 APIs in 62 domains: shortlist the tools, force one choice, normalise arguments, return answers directly from tool output.',
  },
  {
    date: '2026',
    type: 'PAPER',
    title:
      'A comprehensive reliability framework for nonbonded and reusable configurations based EMI measurements in construction steel rebar: a proof of concept',
    href: portfolio.links.orcid,
    description: 'Measurement, Vol. 274, Art. 121021, Elsevier. With Lukesh Parida and Sumedha Moharana.',
  },
  {
    date: '2026',
    type: 'PAPER',
    title:
      'Where Does Politeness Live in Hindi? A Mechanistic Case Study of Honorific Encoding in Gemma Scope SAEs',
    href: portfolio.links.orcid,
    description: 'AACL-IJCNLP 2026, Student Research Workshop (accepted). With Krishang Sharma.',
  },
];
