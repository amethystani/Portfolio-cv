import { portfolio } from './portfolio';

/**
 * The answers the ⌘K assistant gives to the questions people actually ask. Each entry lists ways of asking
 * (the more varied, the better it recognises paraphrases) and one complete answer, written only from facts on
 * this site. A question that matches none of these falls back to the best sentences from the site's pages.
 * Checked by tools/test-assistant.mjs: add a test line there when you add an entry.
 */
export type AssistantAnswer = {
  id: string;
  /** Ways a visitor might ask. */
  ask: string[];
  answer: string;
  /** Where the answer's source link goes, and what it is called. */
  url: string;
  source: string;
};

export const assistant: AssistantAnswer[] = [
  {
    id: 'who',
    ask: [
      'Summarise his profile',
      "What's his deal?",
      'Who am I reading about?',
      'What does Animesh do?',
      'Give me a quick intro',
      'Who is this person?',
      'Who is Animesh?',
      'Who is Animesh Mishra?',
      'Who are you?',
      'Tell me about him',
      'Tell me about Animesh',
      'Introduce yourself',
      'About Animesh',
      'What does he do?',
      'What is his background?',
      'Give me a summary of Animesh',
    ],
    answer:
      'Animesh Mishra is an ML/NLP researcher based in New Delhi. He works on NLP and ML evaluation with a focus on scientific AI, and has papers at EMNLP 2026 (Main Conference) and WMT 2026, which he is presenting in Budapest.',
    url: '/',
    source: 'About',
  },
  {
    id: 'research',
    ask: [
      'What is he working on?',
      'What are you working on?',
      'What does he research?',
      'What does Animesh work on?',
      'What are his research interests?',
      'What is his research about?',
      'Research areas',
      'What field is he in?',
      'What problems does he study?',
      'Research focus',
    ],
    answer:
      'His research asks when language models, and the measurements used to judge them, can be trusted when the underlying knowledge is heterogeneous, conflicting or uncertain. He has worked on this in scientific retrieval-augmented generation, chemistry language models, machine translation metrics and LLM fairness auditing.',
    url: '/releases',
    source: 'Publications',
  },
  {
    id: 'location',
    ask: [
      'Is he in India?',
      'Is he in Delhi?',
      'Where is he based?',
      'Where does he live?',
      'Which city is he in?',
      'Location',
      'Where is he from?',
      'What country is he in?',
    ],
    answer: 'He is based in New Delhi, India.',
    url: '/',
    source: 'About',
  },
  {
    id: 'education',
    ask: [
      'Did he graduate?',
      'B.Tech',
      'Is he still in college?',
      'Which uni?',
      'Where did he study?',
      'Which university did he go to?',
      'What is his education?',
      'What degree does he have?',
      'College',
      'Is he a student?',
      'Shiv Nadar',
    ],
    answer:
      'He did a B.Tech in Computer Science and Engineering at Shiv Nadar Institution of Eminence (2022 to 2026), where he also ran research projects with faculty advisors.',
    url: '/careers',
    source: 'Experience',
  },
  {
    id: 'publications',
    ask: [
      'Where has he published?',
      'What papers has he written?',
      'List his publications',
      'Which conferences accepted his papers?',
      'Publications',
      'How many papers does he have?',
      'Has he published anything?',
    ],
    answer:
      'EMNLP 2026 Main Conference (Beyond Epistemic Collapse, on disagreement-aware scientific RAG), WMT 2026 (Translation Metrics Cannot Judge What Their Tokeniser Deletes), Digital Discovery from the Royal Society of Chemistry (Notation Matters, on chemistry language models), the AACL-IJCNLP 2026 Student Research Workshop (Where Does Politeness Live in Hindi?) and Measurement, an Elsevier journal (EMI measurements in construction steel rebar).',
    url: '/releases',
    source: 'Publications',
  },
  {
    id: 'emnlp',
    ask: [
      'What is his EMNLP paper about?',
      'Beyond Epistemic Collapse',
      'Tell me about the EMNLP paper',
      'disagreement-aware RAG',
      'scientific retrieval augmented generation paper',
      'What is EVIRAG?',
      'What is EVIRAG-Bench?',
    ],
    answer:
      'Beyond Epistemic Collapse (EMNLP 2026, Main Conference, CORE A*) shows that standard RAG collapses real disagreement between scientific sources into one answer. EVIRAG keeps conflicting evidence apart and improves contradiction recall and viewpoint coverage; EVIRAG-BENCH is its 1,250-query benchmark across five scientific domains. Written with Krishang Sharma and Sonia Khetarpaul.',
    url: portfolio.links.evirag,
    source: 'EVIRAG-Bench on GitHub',
  },
  {
    id: 'wmt',
    ask: [
      'Unicode corruption in translation',
      'tokeniser blind spots',
      'What is his WMT paper about?',
      'translation metrics paper',
      'machine translation evaluation',
      'What is Palimpsest?',
      'What is LIGATUR?',
      'What is AEGIS?',
      'Translation Metrics Cannot Judge What Their Tokeniser Deletes',
    ],
    answer:
      'His WMT 2026 paper, Translation Metrics Cannot Judge What Their Tokeniser Deletes, is about blind spots in machine translation evaluation: certain invisible Unicode corruptions get normalised away during tokenisation, so a corrupted translation and the clean one look identical to the metric. It introduces LIGATUR, a contrastive English-German and English-Hindi challenge set, and AEGIS, a metric designed for these blind spots, with code in Palimpsest. Written with Krishang Sharma and Sonia Khetarpaul.',
    url: portfolio.links.palimpsest,
    source: 'Palimpsest on GitHub',
  },
  {
    id: 'chemistry',
    ask: [
      'SMILES vs IUPAC',
      'SMILES, IUPAC, InChI and SELFIES',
      'What is Notation Matters about?',
      'chemistry language models',
      'Digital Discovery paper',
      'molecule notation SMILES',
      'What did he find about chemistry models?',
    ],
    answer:
      'Notation Matters (Digital Discovery, Royal Society of Chemistry, Gold Open Access) shows that the same molecule written as SMILES, IUPAC, InChI or SELFIES gets inconsistent predictions for 88% of 1,072 molecules, and that ChemBERTa-2 representations of identical molecules diverge layer by layer.',
    url: portfolio.links.notation,
    source: 'Notation Matters on GitHub',
  },
  {
    id: 'hindi',
    ask: [
      'Where Does Politeness Live in Hindi?',
      'Hindi honorifics paper',
      'AACL paper',
      'Gemma Scope sparse autoencoders',
      'mechanistic interpretability',
    ],
    answer:
      'Where Does Politeness Live in Hindi? is a mechanistic case study of how honorifics are encoded in Gemma Scope sparse autoencoders, accepted at the AACL-IJCNLP 2026 Student Research Workshop. Written with Krishang Sharma.',
    url: '/releases',
    source: 'Publications',
  },
  {
    id: 'fairness',
    ask: [
      'What did he do on LLM fairness?',
      'bias in language models',
      'fairness auditing',
      'gender bias debiasing',
      'Complexity Science Hub research',
      'hidden-bias audits',
    ],
    answer:
      'At the Complexity Science Hub he audited gender-bias debiasing frameworks for LLMs and found their standard metric can be gamed by answering less: refusing looked like debiasing. Reanalysing 96 published results, he showed most reported improvements came from models abstaining, and replaced point estimates with partial-identification bounds.',
    url: '/careers/measurement-validity-of-hidden-bias-audits',
    source: 'Measurement Validity of Hidden-Bias Audits',
  },
  {
    id: 'gpu',
    ask: [
      'Has he worked with GPUs?',
      'GPU kernels',
      'Does he know CUDA?',
      'The Implicit Control Plane',
      'FlashAttention',
      'systems research',
    ],
    answer:
      'In The Implicit Control Plane he models warp-specialised persistent GPU kernels (FlashAttention-3, persistent GEMM, Hopper and Blackwell MLA) as timed marked graphs, predicting per-tile latency to within 1.2%, and designed PhaseSkew, a zero-cost scheduling fix for a 21% dispersion caused by the shared TMA copy engine.',
    url: '/careers/implicit-control-plane-gpu-kernels',
    source: 'The Implicit Control Plane',
  },
  {
    id: 'crypto',
    ask: [
      'cryptography research',
      'ML-KEM',
      'post-quantum cryptography',
      'side-channel attacks',
      'Kyber',
      'security research',
    ],
    answer:
      'He studied post-decapsulation leakage in ML-KEM (CRYSTALS-Kyber, FIPS 203): native decapsulation timing showed no exploitable leak, but he measured leakage across nine routines that consume the shared secret using timing and Prime+Probe cache analysis, and found constant-time consumption and blinded comparison reduce recovery to chance at about twice the runtime.',
    url: '/careers/post-decapsulation-leakage-ml-kem',
    source: 'Post-Decapsulation Leakage in ML-KEM',
  },
  {
    id: 'experience',
    ask: [
      'Where has he worked?',
      'What is his work experience?',
      'Experience',
      'Which companies has he worked at?',
      'Jobs he has had',
      'Career history',
      'Resume',
      'CV',
    ],
    answer:
      'He contributed to open source at Nous Research (October 2025 to April 2026), co-founded ClerkTree (2025), was a student researcher at the Complexity Science Hub in Vienna (2025), interned as a quantitative research analyst at Consultadd (2025) and in R&D at HFCL for Exicom (2024), and has researched at DRDO. Since September 2026 he is a research volunteer coordinator at the ACL.',
    url: '/careers',
    source: 'Experience',
  },
  {
    id: 'nous',
    ask: ['Nous Research', 'What did he do at Nous Research?', 'open source contributions', 'Hermes agent'],
    answer:
      'He contributed to the open-source stack at Nous Research from October 2025 to April 2026, mostly agent tooling and RL training infrastructure: the agent CLI (authentication flows, gateway logic, tool and session handling) plus bug fixes and small features across the stack.',
    url: '/careers/nous-research-contributor',
    source: 'Contributor, Nous Research',
  },
  {
    id: 'clerktree',
    ask: [
      'Industrial AI',
      'machine monitoring',
      'Did he start a company?',
      'ClerkTree',
      'What is ClerkTree?',
      'Is he a founder?',
      'startup',
      'What is Machina?',
    ],
    answer:
      'He co-founded ClerkTree with Shobhit Mishra and Kenshin Park (February to December 2025, Straubing, Germany), building governed machine-intelligence systems for industrial operations. He led Machina, an open model family for machine monitoring: bearing faults, remaining useful life, quality-inspection vision and a diagnostic reasoning agent, built to run on-premises.',
    url: '/careers/clerktree-co-founder',
    source: 'Co-Founder, Tech at ClerkTree',
  },
  {
    id: 'internships',
    ask: ['internships', 'Consultadd', 'HFCL', 'Exicom', 'industry experience', 'forecasting work'],
    answer:
      'At Consultadd (New York, summer 2025) he built forecasting for consultant demand that improved accuracy by about 8% over the baseline. At HFCL (Gurugram, 2024) he built an LLM-powered command center for Exicom’s EV charging strategy, with demand forecasting and live news ingestion.',
    url: '/careers',
    source: 'Experience',
  },
  {
    id: 'vakra',
    ask: [
      'IBM VAKRA',
      'Juris',
      'tool selection benchmark',
      'Has he won anything?',
      'achievements',
      'rankings',
    ],
    answer:
      'His agent Juris ranked #2 globally for tool selection on IBM VAKRA, using a 36B model with a routing stack over roughly 8,000 APIs in 62 domains.',
    url: '/juris-ibm-vakra',
    source: 'Juris on IBM VAKRA',
  },
  {
    id: 'next',
    ask: [
      'What is he looking for next?',
      'Is he looking for a job?',
      'Is he open to work?',
      'Is he hiring?',
      'Can I hire him?',
      'Is he available?',
      'Is he doing a PhD?',
      'PhD plans',
    ],
    answer:
      'He is looking for his next research role before a PhD, and prefers fast, high-output teams. If you work in NLP, ML evaluation or AI research, he is happy to connect.',
    url: portfolio.links.linkedin,
    source: 'LinkedIn',
  },
  {
    id: 'contact',
    ask: [
      'How can I get in touch?',
      'How do I contact him?',
      'How do I reach him?',
      'Email',
      'What is his email?',
      'Contact',
    ],
    answer: `Email works best: ${portfolio.email}. He is also on LinkedIn and GitHub.`,
    url: `mailto:${portfolio.email}`,
    source: 'Email',
  },
  {
    id: 'links',
    ask: ['GitHub', 'LinkedIn', 'Where is his code?', 'social media', 'ORCID', 'profiles'],
    answer:
      'GitHub: github.com/amethystani (the code for his papers is public). LinkedIn: linkedin.com/in/animesh-mishra-in. ORCID: 0009-0009-1770-6329.',
    url: portfolio.links.github,
    source: 'GitHub',
  },
  {
    id: 'projects',
    ask: [
      'What has he built?',
      'Projects',
      'Show me his projects',
      'side projects',
      'What code has he released?',
    ],
    answer:
      'EVIRAG-Bench (disagreement-aware scientific RAG), Palimpsest (translation metrics), Notation Matters (chemistry language models), Machina (industrial machine intelligence at ClerkTree), Juris (#2 on IBM VAKRA), DeferSeg (tile-scheduled neural passes for real-time compositing) and a fruit-fly connectome trading bot.',
    url: '/releases',
    source: 'Publications',
  },
  {
    id: 'fruitfly',
    ask: ['fruit fly trader', 'connectome trading', 'crypto trading bot', 'fruit fly'],
    answer:
      'A weekend project with Krishang Sharma: the fruit-fly mushroom-body circuit wired into a trading system on Binance Spot Testnet, with dopamine-gated plasticity driven by realised profit and loss. It is open source on GitHub.',
    url: '/fruit-fly-connectome-trading',
    source: 'Fruit-fly connectome trader',
  },
  {
    id: 'skills',
    ask: [
      'What can he do?',
      'What programming languages does he use?',
      'What are his skills?',
      'tech stack',
      'What languages does he use?',
      'What is he good at?',
      'expertise',
    ],
    answer:
      'From his work: evaluation and retrieval-augmented generation, mechanistic interpretability (sparse autoencoders, model internals), GPU kernel scheduling, side-channel analysis of post-quantum cryptography, forecasting, and agent tooling. EVIRAG-BENCH ships with a Rust pipeline.',
    url: '/releases',
    source: 'Publications',
  },
  {
    id: 'writing',
    ask: ['Does he write?', 'blog', 'posts', 'writing', 'articles'],
    answer:
      'Yes, short posts about his papers and projects: the EMNLP and WMT papers, Notation Matters, Juris on IBM VAKRA, the fruit-fly trader and notes from Global Fintech Fest 2026.',
    url: '/blog',
    source: 'Writing',
  },
  {
    id: 'collaborators',
    ask: [
      'Who does he collaborate with?',
      'Who does he work with?',
      'advisor',
      'collaborators',
      'co-authors',
      'supervisor',
    ],
    answer:
      'He often works with Krishang Sharma, and with Dr. Sonia Khetarpaul at Shiv Nadar as advisor. His GPU work is advised by Dr. Sheel Sindhu Manohar and his ML-KEM work by Dr. Rajib Mall.',
    url: '/releases',
    source: 'Publications',
  },
  {
    id: 'acl',
    ask: ['ACL volunteer', 'Association for Computational Linguistics', 'volunteering'],
    answer:
      'Since September 2026 he is a Research Volunteer Coordinator at the Association for Computational Linguistics, the society behind ACL and EMNLP.',
    url: '/careers/acl-research-volunteer-coordinator',
    source: 'ACL',
  },
];
