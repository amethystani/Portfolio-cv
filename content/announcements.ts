export type Announcement = {
  /** Where the card links to (a post on LinkedIn). */
  url: string;
  /** 1000x563 (16:9), cropped to fill the card; files are in public/assets/portfolio/updates. */
  image: string;
  /** Intrinsic size of the image (sets the card's aspect ratio). */
  width: number;
  height: number;
  handle: string;
  text: string;
  /** Display date, shown as written. */
  date: string;
};

const POSTS = 'https://www.linkedin.com/in/animesh-mishra-in/recent-activity/all/';

/** Cards in the home page "Updates" strip, newest first. They summarise posts on LinkedIn. */
export const announcements: Announcement[] = [
  {
    url: `${POSTS}#digital-discovery`,
    image: '/assets/portfolio/updates/halftone-circle.webp',
    width: 1000,
    height: 563,
    handle: 'Published',
    text: 'Notation matters is out in Digital Discovery (Royal Society of Chemistry), Gold Open Access. The same molecule written as SMILES, IUPAC, InChI or SELFIES gave inconsistent predictions for 88% of 1,072 molecules.',
    date: 'Sep 23, 2026',
  },
  {
    url: `${POSTS}#fruit-fly`,
    image: '/assets/portfolio/updates/sheep.webp',
    width: 1000,
    height: 563,
    handle: 'Weekend project',
    text: "Wired Google's fruit-fly connectome into a crypto trading system on Binance Spot Testnet, with dopamine-gated plasticity driven by realised P&L. Built with Krishang Sharma and open-sourced.",
    date: 'Sep 20, 2026',
  },
  {
    url: `${POSTS}#global-fintech-fest`,
    image: '/assets/portfolio/updates/low-frequency.webp',
    width: 1000,
    height: 563,
    handle: 'Conference',
    text: 'Global Fintech Fest 2026: left with better questions than I came in with, on AI exposed to real conversations across languages, voice agents, and where verification should happen when AI creates and acts in the same loop.',
    date: 'Sep 14, 2026',
  },
  {
    url: `${POSTS}#wmt-2026`,
    image: '/assets/portfolio/updates/error-mountains.webp',
    width: 1000,
    height: 563,
    handle: 'Accepted',
    text: 'WMT 2026: Translation Metrics Cannot Judge What Their Tokeniser Deletes. LIGATUR and AEGIS target invisible Unicode corruptions that get normalised away before a metric sees them. See you in Budapest.',
    date: 'Sep 4, 2026',
  },
  {
    url: `${POSTS}#emnlp-2026`,
    image: '/assets/portfolio/updates/error-walker.webp',
    width: 1000,
    height: 563,
    handle: 'Accepted',
    text: 'EMNLP 2026 Main: Beyond Epistemic Collapse, Disagreement-Aware Scientific Retrieval-Augmented Generation. EVIRAG and EVIRAG-BENCH, a 1,250-query benchmark across five scientific domains.',
    date: 'Aug 22, 2026',
  },
  {
    url: `${POSTS}#machina`,
    image: '/assets/portfolio/updates/pixel-satellite.webp',
    width: 1000,
    height: 563,
    handle: 'Shared',
    text: 'Machina, open machine intelligence from ClerkTree: bearing-fault classification, remaining useful life, visual inspection and evidence-grounded industrial reasoning. Signals stay legible, models stay portable, actions stay governed.',
    date: 'Jul 26, 2026',
  },
  {
    url: `${POSTS}#juris-vakra`,
    image: '/assets/portfolio/updates/halftone-circle.webp',
    width: 1000,
    height: 563,
    handle: 'Benchmark',
    text: 'Our agent Juris ranked #2 globally on the IBM VAKRA benchmark for tool selection, using a 36B model and a capability-specific routing stack over roughly 8,000 APIs in 62 domains.',
    date: 'May 24, 2026',
  },
];
