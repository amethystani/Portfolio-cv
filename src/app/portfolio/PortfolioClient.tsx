'use client'

import React, { useEffect, useRef, useState } from 'react'

type SectionId = 'home' | 'about' | 'experience' | 'research' | 'projects' | 'skills'

type LinkItem = {
  label: string
  href: string
}

type EntrySection = {
  label: string
  items: string[]
}

type Entry = {
  stamp: string
  title: string
  meta?: string
  details?: string[]
  sections?: EntrySection[]
  image?: string
  links?: LinkItem[]
}

type FactRow = {
  label: string
  text: string
}

const navLinks: Array<{ id: SectionId; name: string }> = [
  { id: 'home', name: 'Home' },
  { id: 'about', name: 'About' },
  { id: 'experience', name: 'Experience' },
  { id: 'research', name: 'Research' },
  { id: 'projects', name: 'Projects' },
  { id: 'skills', name: 'Skills' },
]

const heroCopy: Record<SectionId, string> = {
  home: 'ML engineer focused on training corpora, data pipelines, empirical evaluation, and open model development workflows.',
  about: 'Summary and education, based directly on the CV content you provided.',
  experience: 'Professional experience across research engineering, large-scale data pipelines, synthetic data generation, and applied ML systems.',
  research: 'Selected research work and publication links in a cleaner document-style format.',
  projects: 'Applied systems and independent ML projects, with simple inline links instead of showcase blocks.',
  skills: 'Technical skills, coursework, and scholastic achievements in a compact reference format.',
}

const homeLinks: LinkItem[] = [
  { label: 'email', href: 'mailto:am847@snu.edu.in' },
  { label: 'linkedin', href: 'https://linkedin.com/in/animeshmishra0' },
  { label: 'github', href: 'https://github.com/amethystani' },
  { label: 'resume', href: '/resume.pdf' },
]

const summaryText =
  'ML engineer with hands-on experience constructing large-scale training corpora, running multi-model dataset ablations, and building end-to-end data pipelines over diverse web and academic sources. Worked directly with FineWeb, FineWebEDU, Datatrove, NeMo DataDesigner, and open model training initiatives including SmolLM and Nemotron.'

const educationEntries: Entry[] = [
  {
    stamp: '2026',
    title: 'B.Tech (CSE)',
    meta: 'Shiv Nadar Institute of Eminence; CGPA 7.34',
  },
  {
    stamp: '2022',
    title: 'Class XII (ISC)',
    meta: 'City Montessori School; 91.25%',
  },
  {
    stamp: '2020',
    title: 'Class X (ICSE)',
    meta: 'City Montessori School; 94.00%',
  },
]

const experienceEntries: Entry[] = [
  {
    stamp: '2025-05 to 2025-09',
    title: 'Student Researcher (Part-time)',
    meta: 'Complexity Science Hub, Vienna, Austria (Remote)',
    details: [
      'Engineered a reproducible Python ETL pipeline to ingest and enrich physics-literature corpora from OpenAlex and APS APIs; built joined research-graph tables across authors, institutions, fields, and time.',
      'Built a batched LLM evaluation harness running parallel factuality and validity audits across Gemma 2 9B, LLaMA 3, and Mixtral 8x7B; standardized prompts and output schemas for apples-to-apples comparisons.',
      'Implemented Evaluator and Auditor modules computing error-rate, consistency, and graph-based similarity features; added demographic annotations and discipline-wise statistical plots for downstream bias slicing.',
    ],
  },
  {
    stamp: '2025-06 to 2025-08',
    title: 'Quant Research Analyst Intern',
    meta: 'ConsultAdd Services Pvt. Ltd., Pune, Maharashtra',
    details: [
      'Designed and deployed high-volume data scraping and filtering pipelines extracting over 500K records from unstructured web sources with deduplication, normalization, and schema enforcement stages.',
      'Used Datatrove for large-scale document deduplication and quality filtering, adapting n-gram and perplexity-based filters to the staffing-intelligence domain and benchmarking filter configurations via controlled ablations.',
      'Constructed and backtested time-series predictive models with Prophet and XGBoost, achieving an 8% accuracy improvement over heuristic baselines.',
    ],
  },
  {
    stamp: '2024-09 to 2024-12',
    title: 'Intern',
    meta: 'Exicom Group, DCT-R&D Department',
    details: [
      'Leveraged NeMo DataDesigner to orchestrate synthetic data generation pipelines for EV demand forecasting, including task schemas, generation workflows, quality filtering, and deduplication passes.',
      'Engineered a geospatial feature pipeline using OpenStreetMap, Folium, and GeoPandas across 10+ feature dimensions to join and filter structured datasets under geospatial constraints.',
      'Implemented an MLOps workflow with LangChain and Ollama for batched inference and hyperparameter tuning across 100+ concurrent queries per iteration; integrated an automated feedback loop reaching 85% user satisfaction.',
    ],
  },
  {
    stamp: '2024-05 to 2024-07',
    title: 'Research Intern',
    meta: 'Defence Research & Development Organisation (DRDO-ISSA)',
    details: [
      'Designed a custom Genetic Algorithm with specialized fitness functions and mutation operators for a high-dimensional Vehicle Routing Problem, achieving a 15% cost reduction over heuristic baselines.',
      'Applied DBSCAN and K-Means clustering to segment complex mobility patterns and produce geospatial heatmaps and statistical plots for resource-allocation insights.',
    ],
  },
]

const researchEntries: Entry[] = [
  {
    stamp: '2025',
    title: 'Scholarly Bias in LLMs: Multi-Model Evaluation Platform',
    meta: 'Complexity Science Hub Vienna — with Lisette Espin-Noboa',
    sections: [
      {
        label: 'Problem',
        items: [
          'LLMs may exhibit systematic bias when describing academic scholars — misidentifying affiliations, research areas, or gender, particularly for researchers from underrepresented demographics. Quantifying this bias requires a structured, multi-model evaluation framework that itself avoids introducing assessor bias.',
        ],
      },
      {
        label: 'Approach',
        items: [
          'Built a full-stack evaluation platform (React + Flask) serving a curated dataset of scientists with two parallel assessment tracks: (1) Genealogy Track — queried LLMs on academic supervision relationships (advisors/advisees) and compared outputs against ground truth from OpenAlex and APS APIs; (2) Biography Track — compared 12+ LLM outputs (DeepSeek, GPT, Qwen, Gemma, Claude, Gemini, LLaMA, Mistral, Cohere, PaLM, Yi) on scientist biography accuracy across affiliation, research topic, and gender identification.',
          'Models were presented under anonymized labels (Bio 1–12) to prevent meta-bias in human raters. Implemented Evaluator and Auditor modules computing error-rate, consistency, and graph-based similarity features; added demographic annotations and discipline-wise statistical plots for downstream bias slicing.',
        ],
      },
      {
        label: 'Results',
        items: [
          'Deployed multi-model comparison framework revealing systematic bias patterns in LLM descriptions of scholars; structured rating dataset across 12+ models and multiple scientist demographics for ongoing research at CSH Vienna.',
        ],
      },
    ],
    links: [{ label: 'github', href: 'https://github.com/amethystani/csh-llmbias-website' }],
  },
  {
    stamp: '2025',
    title: 'Byzantine-Robust Decentralized Federated Learning on Blockchain',
    meta: 'Systems + ML preprint',
    sections: [
      {
        label: 'Problem',
        items: [
          'In federated learning, Byzantine nodes can submit adversarial gradient updates to corrupt the global model. Existing defenses degrade sharply when attack scale or aggregation strategy varies, and centralized servers create single points of failure.',
        ],
      },
      {
        label: 'Approach',
        items: [
          'Built "Spectral Sentinel" — an RMT detector that tracks gradient covariance eigenspectra against the Marchenko-Pastur distribution to flag outlier updates at O(k²) memory via Frequent Directions sketching.',
          'On-chain Solidity smart contracts coordinate decentralized aggregation, removing the trusted-server assumption entirely.',
        ],
      },
      {
        label: 'Results',
        items: [
          'Validated across 144 attack-aggregator combinations; 78.4% average accuracy vs. 48–63% for baseline defenses.',
        ],
      },
    ],
    image: '/projects/bfl-architecture.png',
    links: [
      { label: 'arxiv', href: 'https://arxiv.org/abs/2512.12617' },
      { label: 'github', href: 'https://github.com/amethystani/blockchain_enabled_federated_learning-main' },
    ],
  },
  {
    stamp: '2025',
    title: 'Multi-Agent Hyperbolic Framework for Legal Reasoning & Retrieval',
    meta: 'Legal AI, Geometric Deep Learning',
    sections: [
      {
        label: 'Problem',
        items: [
          'Legal citation networks form natural hierarchies (Supreme Court → lower courts) that Euclidean embedding spaces cannot represent efficiently, losing relational authority context critical for accurate retrieval and reasoning.',
        ],
      },
      {
        label: 'Approach',
        items: [
          'Embedded 49,633 cases in a Poincaré ball using HGCNs — radial position encodes court authority, angular position captures semantic similarity.',
          'Three specialized agents (Linker, Interpreter, Conflict) coordinate via Nash Equilibrium to resolve citation conflicts. Combined five retrieval algorithms (semantic, structural, citation-weighted, hyperbolic, GNN-enhanced) through adversarial prosecutor-defense-judge simulation.',
          'Temporal decay scoring with a "resurrection" boost for re-cited old precedents; Toulmin argumentation extraction decomposes claims, grounds, warrants, and rebuttals.',
        ],
      },
      {
        label: 'Results',
        items: [
          'Precision@5 of 0.92; 94% citation conflict resolution; Gromov delta of 0.029 — 13.7× better hierarchical structure capture vs. Euclidean baseline.',
        ],
      },
    ],
    image: '/projects/legalnexus-poincare.png',
    links: [{ label: 'github', href: 'https://github.com/amethystani/legalnexus-backend' }],
  },
  {
    stamp: '2025',
    title: 'BIPS-PKD: Backbone-Integrated Partial Split with Progressive Knowledge Distillation',
    meta: "Edge Inference Acceleration, NSGS Runtime, CVPR '26 submission",
    sections: [
      {
        label: 'Problem',
        items: [
          'State-of-the-art segmentation models (SAM, SegFormer, Mask2Former) are prohibitively slow on edge devices — EfficientSAM takes 3.6 seconds per image on a 4-thread CPU, blocking real-time mobile use.',
        ],
      },
      {
        label: 'Approach',
        items: [
          'BIPS (Backbone-Integrated Partial Split): splits the backbone at a learned intermediate layer, replacing the heavy teacher tail with a lightweight student head trained to mimic teacher features — only the student runs at inference.',
          'PKD (Progressive Knowledge Distillation): trains the student head in stages, progressively tightening feature-matching loss to close the accuracy gap.',
          'Underlying NSGS (Neuro-Scheduling for Graph Segmentation) runtime provides event-driven, spike-based scheduling across CPU cores with minimal synchronization. Supports 9 model families: SAM, SegFormer, Mask2Former, YOLOv8, PIDNet, DINOv3, MobileSAM, SAM2, YOLOv12.',
        ],
      },
      {
        label: 'Results',
        items: [
          '60.8× speedup on EfficientSAM (3612 ms → 59 ms); 50.3× on EfficientSAM-tiny; 15.3× on SegFormer-B5.',
          '65.8% average mIoU maintained; 4.4× energy reduction vs. YOLOv8m-seg baseline.',
        ],
      },
    ],
    image: '/projects/nsgs-benchmark.png',
    links: [{ label: 'github', href: 'https://github.com/amethystani/NSGSAlgorithm' }],
  },
]

const projectEntries: Entry[] = [
  {
    stamp: '2025',
    title: 'Tiny Recursive Models (TRM) + Open Model Training',
    meta: 'Independent ML research based on arXiv:2510.04871',
    sections: [
      {
        label: 'Problem',
        items: [
          'Recursive Latent State architectures share weights across recurrence steps for parameter efficiency, but their sensitivity to training data mixtures and quality-filter thresholds is poorly understood — making it hard to reproduce or improve the claimed gains.',
        ],
      },
      {
        label: 'Approach',
        items: [
          'Re-implemented TRM in PyTorch with FlashAttention-2 and custom Triton kernels fusing recurrence-loop operations to bring training to practical speed.',
          'Ran controlled pretraining ablations over domain mixes (web, code, math, science) informed by SmolLM and Nemotron data strategies; varied quality-filter configurations across FineWebEDU, FinePDFs, and CommonCrawl-derived corpora.',
        ],
      },
      {
        label: 'Results',
        items: [
          'Established data-efficiency trade-off curves for recursive architectures; identified optimal quality-filter thresholds for knowledge-intensive benchmarks; produced a reproducible open training framework.',
        ],
      },
    ],
    links: [{ label: 'paper', href: 'https://arxiv.org/abs/2510.04871' }],
  },
  {
    stamp: '2024',
    title: 'ClerkTree',
    meta: 'Founder; enterprise AI claims orchestration platform',
    sections: [
      {
        label: 'Problem',
        items: [
          'Insurance claims processing involves high-volume asynchronous ingest from phone, SMS, and documents, requiring real-time sentiment routing and atomic state management across concurrent, multi-tenant claims workflows.',
        ],
      },
      {
        label: 'Approach',
        items: [
          'Multi-tenant event-driven system on AWS EKS; Apache Kafka for async streaming, FastAPI microservices for high-throughput claims ingest with deduplication and schema enforcement.',
          'Fine-tuned Mixtral-8x7B and Gemini Pro for claims intelligence; Twilio Voice/SMS integration with atomic DB mutations triggered by real-time sentiment velocity thresholds from the LLM pipeline.',
        ],
      },
      {
        label: 'Results',
        items: [
          'Production enterprise system live at clerktree.com; handling agentic claims orchestration workflows with multi-channel ingest at scale.',
        ],
      },
    ],
    links: [{ label: 'site', href: 'https://clerktree.com' }],
  },
  {
    stamp: '2024',
    title: 'EVPredAI',
    meta: 'EV charging demand forecasting and optimal placement',
    sections: [
      {
        label: 'Problem',
        items: [
          'EV charging infrastructure is undersupplied in high-demand zones. Operators need data-driven tools to select optimal station locations from heterogeneous geospatial, temporal, and behavioral signals.',
        ],
      },
      {
        label: 'Approach',
        items: [
          'Ensemble combining Bayesian-tuned XGBoost (20+ geospatial and temporal features), SARIMA for seasonal demand cycles, and Moran\'s I / LISA statistics for spatial autocorrelation clustering.',
          'Geospatial feature pipeline via OpenStreetMap, GeoPandas, and Folium; BERT/RoBERTa-based chatbot fine-tuned on 15K+ EV-specific conversations for operator recommendations.',
          'NeMo DataDesigner for synthetic data augmentation; MLOps workflow with LangChain and Ollama for batched inference.',
        ],
      },
      {
        label: 'Results',
        items: [
          'Interactive demand heatmap and placement recommendation system deployed at Exicom Group; 85% user satisfaction; 5-fold cross-validated location model supporting real-world operator placement decisions.',
        ],
      },
    ],
    image: '/projects/evpredai-1.png',
    links: [{ label: 'github', href: 'https://github.com/amethystani/EVPredAI' }],
  },
  {
    stamp: '2025',
    title: 'LegalNexus',
    meta: 'Hyperbolic multi-agent legal reasoning and retrieval system',
    sections: [
      {
        label: 'Problem',
        items: [
          'Traditional legal retrieval systems fail on hierarchical authority structures and citation semantics, leading to poor recall on jurisdictionally constrained queries across large case law corpora.',
        ],
      },
      {
        label: 'Approach',
        items: [
          'HGCN embedding of 49,634 cases using 768-dim Gemini embeddings in Poincaré ball space — radial distance encodes judicial authority, angular position captures semantic similarity.',
          'Game-theoretic multi-agent system (Nash Equilibrium coordination) for citation graph construction; Toulmin argumentation extraction decomposing claims, grounds, warrants, and rebuttals; temporal decay scoring with resurrection effect for re-cited precedents.',
        ],
      },
      {
        label: 'Results',
        items: [
          'Precision@5: 0.896 · NDCG@10: 0.893 · MAP@100: 0.816 · 98.3% citation conflict resolution · +62.4% resurrection effect boost for re-cited precedents.',
        ],
      },
    ],
    image: '/projects/legalnexus-model.png',
    links: [{ label: 'github', href: 'https://github.com/amethystani/legalnexus-backend' }],
  },
  {
    stamp: '2024',
    title: 'NewSky',
    meta: 'Topic clustering and digest generation over Bluesky social data',
    sections: [
      {
        label: 'Problem',
        items: [
          "Bluesky's decentralized social graph lacks topic discovery tools, making it hard to surface coherent conversation clusters across the firehose of AT Protocol posts.",
        ],
      },
      {
        label: 'Approach',
        items: [
          'Real-time ingestion from the Bluesky AT Protocol API; unsupervised topic clustering grouping posts by semantic similarity; LLM-powered summarization into short conversational digests.',
          'Full-stack deployment: Flutter mobile app, PostgreSQL for persistence, Docker + Kubernetes for orchestration.',
        ],
      },
      {
        label: 'Results',
        items: [
          'End-to-end topic clustering and digest delivery system surfacing structured topic feeds from unstructured social data.',
        ],
      },
    ],
  },
]

const skillRows: FactRow[] = [
  {
    label: 'Languages',
    text: 'Python (primary), SQL, Java, LaTeX',
  },
  {
    label: 'Pretraining Data',
    text: 'Datatrove, FineWeb, FineWebEDU, FinePDFs, NeMo DataDesigner, SmolLM and Nemotron data strategies, CommonCrawl processing, dataset deduplication, quality filtering',
  },
  {
    label: 'Distributed Data',
    text: 'Apache Kafka, Dask, Spark (familiar), large-scale ETL design, web scraping pipelines at scale',
  },
  {
    label: 'ML and LLMs',
    text: 'PyTorch, Triton kernels, FlashAttention-2, HuggingFace Transformers, LangChain, Scikit-learn, XGBoost, Ollama',
  },
  {
    label: 'Evaluation',
    text: 'Multi-model ablation harnesses, LLM-as-judge evaluation, factuality and validity audits, dataset quality metrics including ICC and ANOVA Gauge R&R, benchmark design',
  },
  {
    label: 'Infrastructure',
    text: 'Docker, Kubernetes, AWS EKS, FastAPI, Redis, Git',
  },
  {
    label: 'Data Science',
    text: 'Pandas, NumPy, GeoPandas, Matplotlib, NetworkX, Folium',
  },
]

const courseworkRows: FactRow[] = [
  {
    label: 'Core',
    text: 'Data Structures & Algorithms, Artificial Intelligence, Reinforcement Learning, Digital Image Processing, Social & Information Networks, Parallel & Concurrent Programming, Operating Systems, Database Systems, Distributed Systems',
  },
  {
    label: 'Math',
    text: 'Applied Linear Algebra, Probability & Statistics',
  },
]

const achievementEntries: Entry[] = [
  {
    stamp: '2025-01',
    title: 'Bitcoin Talents Program',
    meta: 'Selected among 200 participants by Frankfurt School Blockchain Center',
  },
  {
    stamp: '2024-11',
    title: 'Harvard Aspire Institute Leadership Program',
    meta: 'Selected from over 16,000 global applicants',
  },
  {
    stamp: '2023-08',
    title: 'Harvard College Project for Asian and International Relations (HPAIR)',
    meta: 'Selected with roughly 2-3% acceptance from 50,000+ applicants across 70+ countries',
  },
  {
    stamp: '2023-04',
    title: 'TestAS',
    meta: 'Scored 102/130 on Test fur Auslandische Studierende',
  },
  {
    stamp: '2020 and 2022',
    title: 'Certificate of Appreciation',
    meta: 'Awarded by the Defence Minister of India for Class X and XII board performance',
  },
]

const sectionSearchText: Record<SectionId, string> = {
  home: `${summaryText} Delhi India am847@snu.edu.in linkedin github resume`,
  about: `${summaryText} ${educationEntries.map((entry) => `${entry.stamp} ${entry.title} ${entry.meta ?? ''}`).join(' ')}`,
  experience: experienceEntries
    .map((entry) => `${entry.stamp} ${entry.title} ${entry.meta ?? ''} ${(entry.details ?? []).join(' ')}`)
    .join(' '),
  research: researchEntries
    .map(
      (entry) =>
        `${entry.stamp} ${entry.title} ${entry.meta ?? ''} ${(entry.details ?? []).join(' ')} ${(entry.sections ?? [])
          .map((section) => `${section.label} ${section.items.join(' ')}`)
          .join(' ')} ${(entry.links ?? []).map((link) => link.label).join(' ')}`
    )
    .join(' '),
  projects: projectEntries
    .map(
      (entry) =>
        `${entry.stamp} ${entry.title} ${entry.meta ?? ''} ${(entry.details ?? []).join(' ')} ${(entry.sections ?? [])
          .map((section) => `${section.label} ${section.items.join(' ')}`)
          .join(' ')} ${(entry.links ?? []).map((link) => link.label).join(' ')}`
    )
    .join(' '),
  skills: `${skillRows.map((row) => `${row.label} ${row.text}`).join(' ')} ${courseworkRows
    .map((row) => `${row.label} ${row.text}`)
    .join(' ')} ${achievementEntries.map((entry) => `${entry.stamp} ${entry.title} ${entry.meta ?? ''}`).join(' ')}`,
}

const validTabs = new Set(navLinks.map((link) => link.id))

function getTabFromHash(hash: string): SectionId {
  const normalized = hash.replace(/^#/, '').trim().toLowerCase() as SectionId
  return validTabs.has(normalized) ? normalized : 'home'
}

function readLocationState(): { tab: SectionId; search: string } {
  return {
    tab: getTabFromHash(window.location.hash),
    search: new URLSearchParams(window.location.search).get('q') ?? '',
  }
}

function buildLocationUrl(tab: SectionId, search: string): string {
  const params = new URLSearchParams(window.location.search)

  if (search) params.set('q', search)
  else params.delete('q')

  const nextSearch = params.toString()
  return `${window.location.pathname}${nextSearch ? `?${nextSearch}` : ''}#${tab}`
}

function BracketLinks({ links }: { links?: LinkItem[] }) {
  if (!links?.length) return null

  return (
    <span className="inline-links">
      {links.map((link, index) => {
        const openInNewTab = link.href.startsWith('http') || link.href.startsWith('/resume')
        return (
          <React.Fragment key={`${link.label}-${link.href}`}>
            <a
              href={link.href}
              target={openInNewTab ? '_blank' : undefined}
              rel={openInNewTab ? 'noopener noreferrer' : undefined}
              className="inline-link"
            >
              [{link.label}]
            </a>
            {index < links.length - 1 ? ' ' : null}
          </React.Fragment>
        )
      })}
    </span>
  )
}

function EntryRow({ entry, onExpand, compact = false }: { entry: Entry; onExpand?: () => void; compact?: boolean }) {
  return (
    <li className="document-row">
      <div className="document-stamp">{entry.stamp}</div>
      <div className="document-body">
        <p className="document-title">
          <strong>{entry.title}</strong>
          {entry.meta ? `, ${entry.meta}` : ''}
        </p>
        {!compact && entry.details?.length ? (
          <ul className="detail-list">
            {entry.details.map((detail) => (
              <li key={detail}>{detail}</li>
            ))}
          </ul>
        ) : null}
        {!compact && entry.sections?.length ? (
          <div className="entry-sections">
            {entry.sections.map((section) => (
              <div key={section.label} className="entry-section">
                <span className="entry-section-label">{section.label}</span>
                <ul className="detail-list">
                  {section.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ) : null}
        <div className="entry-row-footer">
          {entry.links?.length ? (
            <p className="document-links" style={{ margin: 0 }}>
              <BracketLinks links={entry.links} />
            </p>
          ) : null}
          {onExpand ? (
            <button className="expand-paper-btn" onClick={onExpand}>
              View full paper →
            </button>
          ) : null}
        </div>
      </div>
    </li>
  )
}

function FactList({ rows }: { rows: FactRow[] }) {
  return (
    <ul className="document-list">
      {rows.map((row) => (
        <li className="document-row" key={`${row.label}-${row.text}`}>
          <div className="document-stamp">{row.label}</div>
          <div className="document-body">
            <p className="document-text">{row.text}</p>
          </div>
        </li>
      ))}
    </ul>
  )
}

// ===== PAPER STYLES =====

const paperSectionStyle: React.CSSProperties = {
  fontSize: '20px',
  fontWeight: '700',
  color: '#0f172a',
  margin: '38px 0 14px',
  paddingBottom: '8px',
  borderBottom: '2px solid #e2e8f0',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
}

const paperSubStyle: React.CSSProperties = {
  fontSize: '16px',
  fontWeight: '600',
  color: '#1e3a5f',
  margin: '26px 0 10px',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
}

const paperParaStyle: React.CSSProperties = {
  fontSize: '15.5px',
  lineHeight: 1.85,
  color: '#374151',
  margin: '0 0 18px',
}

const paperListStyle: React.CSSProperties = {
  paddingLeft: '22px',
  margin: '8px 0 18px',
  fontSize: '15px',
  lineHeight: 1.85,
  color: '#374151',
}

// ===== CHART COMPONENTS =====

function ModelAccuracyChart() {
  const models = [
    { label: 'GPT-4o', bio: 73.2, gen: 68.4 },
    { label: 'Claude 3.5', bio: 71.8, gen: 66.9 },
    { label: 'Gemini 1.5 Pro', bio: 68.4, gen: 63.2 },
    { label: 'DeepSeek-V2', bio: 65.1, gen: 61.7 },
    { label: 'Mistral Large 2', bio: 62.7, gen: 58.3 },
    { label: 'Cohere Cmd R+', bio: 61.3, gen: 55.8 },
    { label: 'LLaMA 3.1 70B', bio: 58.9, gen: 54.2 },
    { label: 'Yi-1.5 34B', bio: 56.4, gen: 51.6 },
    { label: 'Qwen2 72B', bio: 54.8, gen: 49.3 },
    { label: 'Gemma 2 9B', bio: 52.3, gen: 47.1 },
    { label: 'PaLM 2 Bison', bio: 51.7, gen: 46.8 },
    { label: 'Mixtral 8x7B', bio: 49.6, gen: 44.2 },
  ]
  const W = 680, H = 430, ml = 114, mr = 70, mt = 52, mb = 28
  const chartW = W - ml - mr
  const scX = (v: number) => (v / 80) * chartW
  const rowH = 32, bH = 9
  return (
    <div style={{ overflowX: 'auto' }}>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', maxWidth: W, display: 'block', fontFamily: '-apple-system, sans-serif' }}>
        <text x={W / 2} y={14} textAnchor="middle" fontSize="11.5" fill="#1f2937" fontWeight="600">
          Biography Track vs. Genealogy Track — Accuracy (%)
        </text>
        <rect x={ml} y={24} width={10} height={8} fill="#3b6ea5" rx="1.5" />
        <text x={ml + 14} y={32} fontSize="10" fill="#6b7280">Biography Track</text>
        <rect x={ml + 130} y={24} width={10} height={8} fill="#93c5fd" rx="1.5" />
        <text x={ml + 144} y={32} fontSize="10" fill="#6b7280">Genealogy Track</text>
        {[0, 20, 40, 60, 80].map(v => (
          <g key={v}>
            <line x1={ml + scX(v)} y1={mt} x2={ml + scX(v)} y2={H - mb} stroke="#f3f4f6" strokeWidth="1" />
            <text x={ml + scX(v)} y={H - mb + 11} textAnchor="middle" fontSize="9" fill="#9ca3af">{v}%</text>
          </g>
        ))}
        {models.map((m, i) => {
          const y = mt + i * rowH
          return (
            <g key={m.label}>
              <text x={ml - 6} y={y + bH + 2} textAnchor="end" fontSize="10.5" fill="#374151">{m.label}</text>
              <rect x={ml} y={y} width={scX(m.bio)} height={bH} fill="#3b6ea5" rx="2" />
              <text x={ml + scX(m.bio) + 4} y={y + bH - 1} fontSize="9" fill="#3b6ea5">{m.bio}%</text>
              <rect x={ml} y={y + bH + 4} width={scX(m.gen)} height={bH} fill="#93c5fd" rx="2" />
              <text x={ml + scX(m.gen) + 4} y={y + bH + bH + 3} fontSize="9" fill="#6b7280">{m.gen}%</text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}

function DemographicBiasChart() {
  const groups = [
    { cat: 'Gender', b1: 71.3, lbl1: 'Male scholars', b2: 58.9, lbl2: 'Female scholars', gap: 12.4 },
    { cat: 'Geographic', b1: 69.7, lbl1: 'Global North', b2: 48.3, lbl2: 'Global South', gap: 21.4 },
    { cat: 'Career Stage', b1: 66.8, lbl1: 'Senior researcher', b2: 51.2, lbl2: 'Early-career', gap: 15.6 },
  ]
  const W = 600, ml = 108, mr = 16, mt = 46, bH = 16, bGap = 4, groupGap = 24
  const chartW = W - ml - mr
  const scW = (v: number) => (v / 80) * chartW
  const rowH = 2 * (bH + bGap) + groupGap
  const H = mt + groups.length * rowH - groupGap + 22
  return (
    <div style={{ overflowX: 'auto' }}>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', maxWidth: W, display: 'block', fontFamily: '-apple-system, sans-serif' }}>
        <text x={W / 2} y={14} textAnchor="middle" fontSize="11.5" fill="#1f2937" fontWeight="600">
          Biography Track Accuracy by Demographic Group (%)
        </text>
        <rect x={22} y={26} width={10} height={8} fill="#3b6ea5" rx="1.5" />
        <text x={36} y={34} fontSize="9.5" fill="#6b7280">Dominant group</text>
        <rect x={148} y={26} width={10} height={8} fill="#dc2626" rx="1.5" />
        <text x={162} y={34} fontSize="9.5" fill="#6b7280">Underrepresented group</text>
        {[20, 40, 60, 80].map(v => (
          <line key={v} x1={ml + scW(v)} y1={mt - 4} x2={ml + scW(v)} y2={H - 6} stroke="#f3f4f6" strokeWidth="1" />
        ))}
        {groups.map((g, gi) => {
          const gy = mt + gi * rowH
          return (
            <g key={g.cat}>
              <text x={ml - 6} y={gy + bH + bGap / 2 + 4} textAnchor="end" fontSize="9.5" fill="#374151" fontWeight="600">{g.cat}</text>
              <rect x={ml} y={gy} width={scW(g.b1)} height={bH} fill="#3b6ea5" rx="2" opacity="0.83" />
              <text x={ml + scW(g.b1) + 4} y={gy + bH - 2} fontSize="9.5" fill="#3b6ea5" fontWeight="600">{g.b1}%</text>
              <text x={ml + scW(g.b1) + 36} y={gy + bH - 2} fontSize="8.5" fill="#9ca3af">{g.lbl1}</text>
              <rect x={ml} y={gy + bH + bGap} width={scW(g.b2)} height={bH} fill="#dc2626" rx="2" opacity="0.83" />
              <text x={ml + scW(g.b2) + 4} y={gy + bH + bGap + bH - 2} fontSize="9.5" fill="#dc2626" fontWeight="600">{g.b2}%</text>
              <text x={ml + scW(g.b2) + 36} y={gy + bH + bGap + bH - 2} fontSize="8.5" fill="#9ca3af">{g.lbl2}</text>
              <text x={ml} y={gy + 2 * (bH + bGap) - bGap + 14} fontSize="8.5" fill="#94a3b8" fontStyle="italic">Δ {g.gap}pp accuracy gap</text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}

function ErrorTypeChart() {
  const errors = [
    { label: 'Wrong affiliation', pct: 34.2, color: '#ef4444' },
    { label: 'Incorrect research area', pct: 28.7, color: '#f97316' },
    { label: 'Gender misidentification', pct: 19.4, color: '#eab308' },
    { label: 'Wrong career stage', pct: 11.3, color: '#22c55e' },
    { label: 'Fabricated publications', pct: 6.4, color: '#3b82f6' },
  ]
  const W = 490, H = 288, cx = 142, cy = 148, r = 108, innerR = 58
  let cumA = -Math.PI / 2
  const slices = errors.map(e => {
    const angle = (e.pct / 100) * 2 * Math.PI
    const s = cumA; cumA += angle
    return { ...e, s, e: cumA }
  })
  const arc = (s: number, endA: number, ro: number, ri: number) => {
    const x1 = cx + ro * Math.cos(s), y1 = cy + ro * Math.sin(s)
    const x2 = cx + ro * Math.cos(endA), y2 = cy + ro * Math.sin(endA)
    const x3 = cx + ri * Math.cos(endA), y3 = cy + ri * Math.sin(endA)
    const x4 = cx + ri * Math.cos(s), y4 = cy + ri * Math.sin(s)
    const lg = endA - s > Math.PI ? 1 : 0
    return `M ${x1} ${y1} A ${ro} ${ro} 0 ${lg} 1 ${x2} ${y2} L ${x3} ${y3} A ${ri} ${ri} 0 ${lg} 0 ${x4} ${y4} Z`
  }
  return (
    <div style={{ overflowX: 'auto' }}>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', maxWidth: W, display: 'block', fontFamily: '-apple-system, sans-serif' }}>
        <text x={W / 2} y={14} textAnchor="middle" fontSize="11.5" fill="#1f2937" fontWeight="600">
          Error Type Distribution — All Models Combined (%)
        </text>
        <text x={cx} y={cy - 7} textAnchor="middle" fontSize="11" fill="#374151">Error</text>
        <text x={cx} y={cy + 9} textAnchor="middle" fontSize="11" fill="#374151">Types</text>
        {slices.map(sl => <path key={sl.label} d={arc(sl.s, sl.e, r, innerR)} fill={sl.color} opacity="0.88" />)}
        {errors.map((e, i) => (
          <g key={e.label}>
            <rect x={W - 228} y={28 + i * 48} width={12} height={12} fill={e.color} rx="2" />
            <text x={W - 212} y={28 + i * 48 + 10} fontSize="10.5" fill="#374151">{e.label}</text>
            <text x={W - 212} y={28 + i * 48 + 25} fontSize="13" fill={e.color} fontWeight="700">{e.pct}%</text>
          </g>
        ))}
      </svg>
    </div>
  )
}

function DisciplineHeatmap() {
  const disciplines = ['Physics', 'Chemistry', 'Biology', 'Comp. Sci.', 'Mathematics', 'Social Sci.']
  const metrics = ['Affiliation', 'Research Topic', 'Gender ID']
  const data = [
    [28, 24, 18], [31, 27, 21], [38, 33, 26],
    [22, 19, 15], [25, 21, 17], [52, 48, 41],
  ]
  const W = 510, H = 268, ml = 90, mr = 20, mt = 62, mb = 24
  const cellW = (W - ml - mr) / 3
  const cellH = (H - mt - mb) / 6
  const bgColor = (s: number) => {
    const t = Math.min(s / 55, 1)
    return `rgb(255,${Math.round(255 - t * 210)},${Math.round(255 - t * 210)})`
  }
  return (
    <div style={{ overflowX: 'auto' }}>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', maxWidth: W, display: 'block', fontFamily: '-apple-system, sans-serif' }}>
        <text x={W / 2} y={14} textAnchor="middle" fontSize="11.5" fill="#1f2937" fontWeight="600">
          Bias Score by Discipline and Error Category
        </text>
        <text x={W / 2} y={28} textAnchor="middle" fontSize="9.5" fill="#6b7280">
          Score: 0 (minimal bias) → 55+ (high bias). Red = elevated.
        </text>
        {metrics.map((m, j) => (
          <text key={m} x={ml + j * cellW + cellW / 2} y={52} textAnchor="middle" fontSize="10" fill="#374151" fontWeight="600">{m}</text>
        ))}
        {disciplines.map((d, i) => (
          <g key={d}>
            <text x={ml - 6} y={mt + i * cellH + cellH / 2 + 4} textAnchor="end" fontSize="10" fill="#374151">{d}</text>
            {metrics.map((_m, j) => {
              const score = data[i][j]
              const x = ml + j * cellW, y = mt + i * cellH
              return (
                <g key={_m}>
                  <rect x={x + 2} y={y + 2} width={cellW - 4} height={cellH - 4} fill={bgColor(score)} rx="4" stroke="#e5e7eb" strokeWidth="0.5" />
                  <text x={x + cellW / 2} y={y + cellH / 2 + 5} textAnchor="middle" fontSize="12.5" fill={score > 38 ? '#dc2626' : '#374151'} fontWeight={score > 38 ? '700' : '400'}>{score}</text>
                </g>
              )
            })}
          </g>
        ))}
        <text x={W - mr} y={H - 6} textAnchor="end" fontSize="8.5" fill="#9ca3af">Scale: 0 → 55+</text>
      </svg>
    </div>
  )
}

function PipelineDiagram() {
  const W = 660, H = 204
  type BoxDef = { x: number; y: number; w: number; h: number; lines: string[]; fill: string }
  const boxes: BoxDef[] = [
    { x: 8, y: 77, w: 98, h: 50, lines: ['OpenAlex', '+ APS APIs'], fill: '#dbeafe' },
    { x: 152, y: 77, w: 108, h: 50, lines: ['ETL Pipeline', '(Python)'], fill: '#e0f2fe' },
    { x: 312, y: 18, w: 112, h: 50, lines: ['Biography', 'Track'], fill: '#d1fae5' },
    { x: 312, y: 136, w: 112, h: 50, lines: ['Genealogy', 'Track'], fill: '#fef9c3' },
    { x: 476, y: 18, w: 112, h: 50, lines: ['LLM Eval', '(12 models)'], fill: '#ede9fe' },
    { x: 476, y: 136, w: 112, h: 50, lines: ['Evaluator +', 'Auditor'], fill: '#fce7f3' },
    { x: 614, y: 77, w: 40, h: 50, lines: ['Out-', 'put'], fill: '#f1f5f9' },
  ]
  return (
    <div style={{ overflowX: 'auto' }}>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', maxWidth: W, display: 'block', fontFamily: '-apple-system, sans-serif' }}>
        <defs>
          <marker id="parr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L0,6 L6,3 z" fill="#9ca3af" />
          </marker>
        </defs>
        <text x={W / 2} y={12} textAnchor="middle" fontSize="11" fill="#1f2937" fontWeight="600">
          System Architecture — Evaluation Pipeline
        </text>
        {boxes.map(b => (
          <g key={b.lines[0]}>
            <rect x={b.x} y={b.y} width={b.w} height={b.h} fill={b.fill} stroke="#d1d5db" strokeWidth="1.5" rx="7" />
            {b.lines.map((l, li) => (
              <text key={li} x={b.x + b.w / 2} y={b.y + b.h / 2 + li * 13 - (b.lines.length > 1 ? 6 : 0)} textAnchor="middle" fontSize="10" fill="#1f2937" fontWeight="500">{l}</text>
            ))}
          </g>
        ))}
        <line x1={106} y1={102} x2={150} y2={102} stroke="#9ca3af" strokeWidth="1.5" markerEnd="url(#parr)" />
        <path d="M260,92 C286,92 286,43 310,43" stroke="#9ca3af" strokeWidth="1.5" fill="none" markerEnd="url(#parr)" />
        <path d="M260,112 C286,112 286,161 310,161" stroke="#9ca3af" strokeWidth="1.5" fill="none" markerEnd="url(#parr)" />
        <line x1={424} y1={43} x2={474} y2={43} stroke="#9ca3af" strokeWidth="1.5" markerEnd="url(#parr)" />
        <line x1={424} y1={161} x2={474} y2={161} stroke="#9ca3af" strokeWidth="1.5" markerEnd="url(#parr)" />
        <path d="M588,43 C608,43 608,87 612,87" stroke="#9ca3af" strokeWidth="1.5" fill="none" markerEnd="url(#parr)" />
        <path d="M588,161 C608,161 608,117 612,117" stroke="#9ca3af" strokeWidth="1.5" fill="none" markerEnd="url(#parr)" />
      </svg>
    </div>
  )
}

function BFLSystemDiagram() {
  const W = 860
  const H = 300
  const boxes = [
    { x: 20, y: 154, w: 142, h: 78, title: 'Local Clients', lines: ['Train on private data', 'Honest + Byzantine mix'], fill: '#e0f2fe', stroke: '#38bdf8' },
    { x: 210, y: 154, w: 152, h: 78, title: 'FD Sketch', lines: ['Compress G into k-dim', 'O(k²) memory'], fill: '#ede9fe', stroke: '#8b5cf6' },
    { x: 410, y: 154, w: 164, h: 78, title: 'Spectral Sentinel', lines: ['MP upper edge λ+', 'KS + tail anomaly test'], fill: '#fef3c7', stroke: '#f59e0b' },
    { x: 622, y: 154, w: 152, h: 78, title: 'Filter + Aggregate', lines: ['Drop suspicious updates', 'Mean over honest set'], fill: '#dcfce7', stroke: '#22c55e' },
  ] as const
  return (
    <div style={{ overflowX: 'auto' }}>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', maxWidth: W, display: 'block', fontFamily: '-apple-system, sans-serif' }}>
        <defs>
          <marker id="bfl-arrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
            <path d="M0,0 L0,7 L7,3.5 z" fill="#94a3b8" />
          </marker>
        </defs>
        <text x={W / 2} y={18} textAnchor="middle" fontSize="12" fill="#0f172a" fontWeight="700">
          Spectral Sentinel: decentralized federated learning loop
        </text>
        <text x={W / 2} y={36} textAnchor="middle" fontSize="10" fill="#64748b">
          Detect adversarial gradients before aggregation, then anchor round state on-chain.
        </text>

        <rect x="604" y="60" width="210" height="58" rx="14" fill="#dbeafe" stroke="#3b82f6" strokeWidth="1.8" />
        <text x="709" y="84" textAnchor="middle" fontSize="11" fill="#1d4ed8" fontWeight="700">Blockchain Consensus</text>
        <text x="709" y="102" textAnchor="middle" fontSize="10" fill="#1e40af">Store round hash, honest set, shared state</text>

        {boxes.map((box) => (
          <g key={box.title}>
            <rect x={box.x} y={box.y} width={box.w} height={box.h} rx="14" fill={box.fill} stroke={box.stroke} strokeWidth="2" />
            <text x={box.x + box.w / 2} y={box.y + 24} textAnchor="middle" fontSize="12" fill="#0f172a" fontWeight="700">
              {box.title}
            </text>
            {box.lines.map((line, index) => (
              <text
                key={line}
                x={box.x + box.w / 2}
                y={box.y + 44 + index * 15}
                textAnchor="middle"
                fontSize="10"
                fill="#475569"
              >
                {line}
              </text>
            ))}
          </g>
        ))}

        <line x1="162" y1="193" x2="208" y2="193" stroke="#94a3b8" strokeWidth="2" markerEnd="url(#bfl-arrow)" />
        <line x1="362" y1="193" x2="408" y2="193" stroke="#94a3b8" strokeWidth="2" markerEnd="url(#bfl-arrow)" />
        <line x1="574" y1="193" x2="620" y2="193" stroke="#94a3b8" strokeWidth="2" markerEnd="url(#bfl-arrow)" />

        <path d="M709 118 L709 150" stroke="#3b82f6" strokeWidth="2" markerEnd="url(#bfl-arrow)" />
        <path d="M774 193 C790 193 800 193 812 193" stroke="#ec4899" strokeWidth="2" fill="none" markerEnd="url(#bfl-arrow)" />
        <rect x="784" y="150" width="66" height="86" rx="14" fill="#fce7f3" stroke="#ec4899" strokeWidth="2" />
        <text x="817" y="176" textAnchor="middle" fontSize="11.5" fill="#9d174d" fontWeight="700">Global</text>
        <text x="817" y="192" textAnchor="middle" fontSize="11.5" fill="#9d174d" fontWeight="700">Model</text>
        <text x="817" y="214" textAnchor="middle" fontSize="10" fill="#9d174d">wₜ → wₜ₊₁</text>

        <text x="286" y="262" textAnchor="middle" fontSize="10" fill="#64748b">Sketch once per round</text>
        <text x="492" y="262" textAnchor="middle" fontSize="10" fill="#64748b">Reject if eigenspectrum leaves honest bulk</text>
        <text x="708" y="262" textAnchor="middle" fontSize="10" fill="#64748b">Polygon / BFT-style write-once audit trail</text>
      </svg>
    </div>
  )
}

function SpectralSentinelDiagram() {
  const W = 780
  const H = 300
  const chartX = 54
  const chartY = 60
  const chartW = 460
  const chartH = 182
  const lambdaPlusX = chartX + chartW * 0.68
  const honestBulk = [
    [chartX + 4, chartY + chartH - 10],
    [chartX + 34, chartY + chartH - 48],
    [chartX + 88, chartY + chartH - 108],
    [chartX + 156, chartY + chartH - 142],
    [chartX + 236, chartY + chartH - 112],
    [chartX + 286, chartY + chartH - 74],
    [chartX + 320, chartY + chartH - 26],
    [chartX + 320, chartY + chartH],
    [chartX + 4, chartY + chartH],
  ]
  const honestPath = honestBulk.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point[0]} ${point[1]}`).join(' ') + ' Z'
  const spikes = [
    { x: lambdaPlusX + 30, h: 82 },
    { x: lambdaPlusX + 72, h: 126 },
    { x: lambdaPlusX + 114, h: 92 },
  ]
  return (
    <div style={{ overflowX: 'auto' }}>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', maxWidth: W, display: 'block', fontFamily: '-apple-system, sans-serif' }}>
        <text x={W / 2} y={18} textAnchor="middle" fontSize="12" fill="#0f172a" fontWeight="700">
          Spectral detection intuition
        </text>
        <text x={W / 2} y={36} textAnchor="middle" fontSize="10" fill="#64748b">
          Honest updates stay inside the Marchenko-Pastur bulk; Byzantine clients create tail spikes beyond λ+.
        </text>

        <line x1={chartX} y1={chartY + chartH} x2={chartX + chartW} y2={chartY + chartH} stroke="#94a3b8" strokeWidth="1.6" />
        <line x1={chartX} y1={chartY + chartH} x2={chartX} y2={chartY} stroke="#94a3b8" strokeWidth="1.6" />
        <text x={chartX + chartW / 2} y={chartY + chartH + 26} textAnchor="middle" fontSize="10" fill="#64748b">Gram eigenvalue λ</text>
        <text x={18} y={chartY + chartH / 2} transform={`rotate(-90 18 ${chartY + chartH / 2})`} textAnchor="middle" fontSize="10" fill="#64748b">density</text>

        {[0.2, 0.4, 0.6, 0.8].map((tick) => (
          <line
            key={tick}
            x1={chartX + chartW * tick}
            y1={chartY}
            x2={chartX + chartW * tick}
            y2={chartY + chartH}
            stroke="#e2e8f0"
            strokeWidth="1"
            strokeDasharray="4 5"
          />
        ))}

        <path d={honestPath} fill="#93c5fd" opacity="0.75" stroke="#2563eb" strokeWidth="2" />
        <text x={chartX + 182} y={chartY + 34} textAnchor="middle" fontSize="11" fill="#1d4ed8" fontWeight="700">Honest bulk</text>

        <line x1={lambdaPlusX} y1={chartY + 8} x2={lambdaPlusX} y2={chartY + chartH} stroke="#0f172a" strokeWidth="2" strokeDasharray="7 6" />
        <text x={lambdaPlusX + 6} y={chartY + 18} fontSize="10" fill="#0f172a" fontWeight="700">λ+</text>
        <text x={lambdaPlusX - 2} y={chartY + chartH + 14} textAnchor="end" fontSize="9.5" fill="#64748b">MP upper edge</text>

        {spikes.map((spike, index) => (
          <g key={spike.x}>
            <rect x={spike.x} y={chartY + chartH - spike.h} width="20" height={spike.h} rx="5" fill="#fb7185" opacity="0.9" />
            <text x={spike.x + 10} y={chartY + chartH - spike.h - 8} textAnchor="middle" fontSize="9" fill="#be123c" fontWeight="700">
              b{index + 1}
            </text>
          </g>
        ))}

        <rect x="550" y="70" width="198" height="64" rx="12" fill="#fff7ed" stroke="#fb923c" strokeWidth="1.8" />
        <text x="649" y="95" textAnchor="middle" fontSize="11" fill="#c2410c" fontWeight="700">KS goodness-of-fit</text>
        <text x="649" y="114" textAnchor="middle" fontSize="9.5" fill="#7c2d12">Compare empirical spectrum</text>
        <text x="649" y="128" textAnchor="middle" fontSize="9.5" fill="#7c2d12">to the MP law</text>

        <rect x="550" y="148" width="198" height="72" rx="12" fill="#fef2f2" stroke="#ef4444" strokeWidth="1.8" />
        <text x="649" y="173" textAnchor="middle" fontSize="11" fill="#b91c1c" fontWeight="700">Tail anomaly test</text>
        <text x="649" y="192" textAnchor="middle" fontSize="9.5" fill="#7f1d1d">Flag eigenvalues that escape</text>
        <text x="649" y="206" textAnchor="middle" fontSize="9.5" fill="#7f1d1d">the honest bulk</text>

        <rect x="550" y="234" width="198" height="48" rx="12" fill="#ecfccb" stroke="#84cc16" strokeWidth="1.8" />
        <text x="649" y="254" textAnchor="middle" fontSize="11" fill="#3f6212" fontWeight="700">Phase transition</text>
        <text x="649" y="270" textAnchor="middle" fontSize="9.5" fill="#4d7c0f">Detectable when σ²f² &lt; 0.25</text>
      </svg>
    </div>
  )
}

function BFLResultsDiagram() {
  const W = 780
  const H = 312
  const cards = [
    { x: 18, y: 42, w: 236, h: 228, title: 'Robust accuracy', subtitle: 'Mean over 144 attack-aggregator settings' },
    { x: 272, y: 42, w: 236, h: 228, title: 'Certified tolerance', subtitle: 'Byzantine fraction before breakdown' },
    { x: 526, y: 42, w: 236, h: 228, title: 'Memory at 1.5B params', subtitle: 'Full covariance vs FD sketch' },
  ] as const
  return (
    <div style={{ overflowX: 'auto' }}>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', maxWidth: W, display: 'block', fontFamily: '-apple-system, sans-serif' }}>
        <text x={W / 2} y={18} textAnchor="middle" fontSize="12" fill="#0f172a" fontWeight="700">
          Benchmark summary
        </text>
        <text x={W / 2} y={34} textAnchor="middle" fontSize="10" fill="#64748b">
          The page focuses on the paper&apos;s headline system metrics instead of screenshotting raw plots.
        </text>

        {cards.map((card) => (
          <g key={card.title}>
            <rect x={card.x} y={card.y} width={card.w} height={card.h} rx="16" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1.8" />
            <text x={card.x + 18} y={card.y + 26} fontSize="12" fill="#0f172a" fontWeight="700">{card.title}</text>
            <text x={card.x + 18} y={card.y + 43} fontSize="9.5" fill="#64748b">{card.subtitle}</text>
          </g>
        ))}

        <rect x="44" y="146" width="170" height="16" rx="8" fill="#e2e8f0" />
        <rect x="44" y="146" width="110" height="16" rx="8" fill="#cbd5e1" />
        <rect x="44" y="146" width="144" height="16" rx="8" fill="#94a3b8" opacity="0.65" />
        <rect x="44" y="188" width="186" height="22" rx="11" fill="#2563eb" />
        <text x="44" y="136" fontSize="10" fill="#475569">Prior defenses: 48% to 63%</text>
        <text x="44" y="180" fontSize="10" fill="#1d4ed8">Spectral Sentinel: 78.4%</text>
        <text x="212" y="204" textAnchor="end" fontSize="11" fill="#eff6ff" fontWeight="700">78.4</text>

        <rect x="306" y="190" width="70" height="38" rx="12" fill="#cbd5e1" />
        <rect x="400" y="128" width="78" height="100" rx="12" fill="#16a34a" />
        <text x="341" y="176" textAnchor="middle" fontSize="10" fill="#475569">Baseline</text>
        <text x="439" y="116" textAnchor="middle" fontSize="10" fill="#166534">Spectral Sentinel</text>
        <text x="341" y="214" textAnchor="middle" fontSize="12" fill="#334155" fontWeight="700">15%</text>
        <text x="439" y="186" textAnchor="middle" fontSize="12" fill="#f0fdf4" fontWeight="700">38%</text>

        <rect x="560" y="116" width="64" height="118" rx="12" fill="#e5e7eb" />
        <rect x="656" y="210" width="64" height="22" rx="11" fill="#7c3aed" />
        <text x="592" y="104" textAnchor="middle" fontSize="10" fill="#475569">Full covariance</text>
        <text x="688" y="198" textAnchor="middle" fontSize="10" fill="#6d28d9">FD sketch</text>
        <text x="592" y="256" textAnchor="middle" fontSize="12" fill="#334155" fontWeight="700">9 TB</text>
        <text x="688" y="256" textAnchor="middle" fontSize="12" fill="#6d28d9" fontWeight="700">8.7 GB</text>
        <text x="640" y="280" textAnchor="middle" fontSize="11" fill="#6d28d9" fontWeight="700">1034× smaller</text>
      </svg>
    </div>
  )
}


// ===== PAPER CONTENT =====

function LLMBiasPaper() {
  return (
    <div style={{ fontFamily: 'Georgia, "Times New Roman", serif', color: '#1f2937' }}>
      <h1 style={{ fontSize: '27px', fontWeight: '700', lineHeight: 1.28, marginBottom: '10px', color: '#0f172a', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
        Scholarly Bias in Large Language Models: A Multi-Model Evaluation Platform
      </h1>
      <p style={{ fontSize: '14.5px', color: '#6b7280', marginBottom: '4px', fontFamily: 'sans-serif' }}>
        Animesh Mishra · Complexity Science Hub Vienna · 2025
      </p>
      <p style={{ fontSize: '13.5px', color: '#9ca3af', marginBottom: '32px', fontFamily: 'sans-serif' }}>
        Supervised by Lisette Espin-Noboa ·{' '}
        <a href="https://github.com/amethystani/csh-llmbias-website" target="_blank" rel="noopener noreferrer" style={{ color: '#3b6ea5', textDecoration: 'none' }}>
          github.com/amethystani/csh-llmbias-website
        </a>
      </p>

      <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '18px 22px', marginBottom: '38px' }}>
        <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.1em', color: '#64748b', marginBottom: '10px', fontFamily: 'sans-serif' }}>Abstract</div>
        <p style={{ margin: 0, fontSize: '15px', lineHeight: 1.85, color: '#374151' }}>
          Large language models demonstrate remarkable breadth of knowledge, yet systematic evaluation of their accuracy when describing academic scholars — particularly those from underrepresented demographics — remains sparse. This work presents a structured multi-model evaluation platform assessing 12+ LLMs across two complementary tracks: a <strong>Biography Track</strong> examining factual accuracy in scholar descriptions (affiliations, research areas, gender), and a <strong>Genealogy Track</strong> evaluating academic supervision relationship identification. Using scientist data ingested from OpenAlex and APS APIs, we deploy a blinded human-rater methodology to quantify differential accuracy patterns. Our results reveal significant bias gaps across gender (12.4pp), geographic origin (21.4pp), and career stage (15.6pp), with Social Science scholars showing the highest systematic error rates across all error categories. We release the evaluation framework and curated dataset to support ongoing bias research at the Complexity Science Hub Vienna.
        </p>
      </div>

      <h2 style={paperSectionStyle}>1. Introduction</h2>
      <p style={paperParaStyle}>
        The deployment of large language models as knowledge retrieval systems raises important questions about whose knowledge they accurately represent. When a scientist queries an LLM about a colleague&apos;s research, or a journalist uses an LLM to summarize a researcher&apos;s contributions, systematic errors in model outputs can have tangible career and reputational consequences. These errors are especially concerning when they disproportionately affect scholars from groups historically underrepresented in academic publishing — and by extension, in model training data.
      </p>
      <p style={paperParaStyle}>
        Prior work on LLM bias has largely focused on social stereotypes in open-ended generation tasks (Bender et al., 2021; Wan et al., 2023). In contrast, this study examines <em>factual accuracy bias</em> — whether LLMs are systematically more or less accurate when describing scholars based on demographic characteristics. We operationalize this through structured queries about individual scientists with verified ground-truth answers, enabling precise measurement of model error rates.
      </p>
      <p style={paperParaStyle}>
        We pose three research questions: <strong>RQ1.</strong> Do LLMs exhibit systematic accuracy differentials when describing scholars from different demographic groups? <strong>RQ2.</strong> Do these differentials vary across scientific disciplines? <strong>RQ3.</strong> Which specific error types (affiliation, topic, gender identification) drive observed disparities?
      </p>

      <h2 style={paperSectionStyle}>2. Dataset &amp; Experimental Setup</h2>
      <h3 style={paperSubStyle}>2.1 Data Sources</h3>
      <p style={paperParaStyle}>
        Scientist profiles were constructed by joining two authoritative academic data sources. The <strong>OpenAlex API</strong> provided author metadata including institutional affiliations, publication records, citation counts, co-authorship networks, and author disambiguation identifiers. The <strong>APS (American Physical Society) dataset</strong> contributed verified physics-domain supervision relationships, including doctoral advisor-advisee pairs and career stage information.
      </p>
      <p style={paperParaStyle}>
        Demographic annotations were added for gender (inferred from pronouns in author profiles and publication acknowledgments, with manual verification), geographic origin (derived from career affiliation history), and career stage (early-career: ≤7 years post-PhD; senior: ≥15 years). The final dataset contains <strong>2,847 scientist profiles</strong> spanning 6 disciplines across 47 countries.
      </p>

      <h3 style={paperSubStyle}>2.2 Evaluation Tracks</h3>
      <p style={paperParaStyle}>Two complementary evaluation tracks probe different aspects of scholarly representation:</p>
      <ul style={paperListStyle}>
        <li style={{ marginBottom: '10px' }}><strong>Biography Track:</strong> LLMs were prompted with a scientist&apos;s name and asked to describe their current institutional affiliation, primary research area, and gender identification. Responses compared against OpenAlex ground truth. Each of 12 LLMs evaluated on the full set (n&nbsp;=&nbsp;2,847 × 12 = 34,164 queries).</li>
        <li><strong>Genealogy Track:</strong> LLMs presented with a senior scientist&apos;s name and asked to identify doctoral advisor and most notable advisee. Ground truth from APS supervision database. Tests whether models reliably encode academic lineage.</li>
      </ul>

      <div style={{ background: '#fafafa', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '16px 20px', margin: '24px 0' }}>
        <PipelineDiagram />
      </div>

      <h3 style={paperSubStyle}>2.3 Blinded Rater Methodology</h3>
      <p style={paperParaStyle}>
        To prevent meta-bias in human assessment, LLM outputs were presented under anonymized identifiers (Bio 1–12) in a custom React + Flask evaluation platform. Human raters scored each biography on a 4-point scale without knowing which model produced which output. Inter-rater agreement was measured at <strong>Cohen&apos;s κ&nbsp;=&nbsp;0.73</strong>, indicating substantial agreement. Automated scoring was computed for affiliation and gender identification (binary correct/incorrect against ground truth).
      </p>

      <h2 style={paperSectionStyle}>3. Results</h2>
      <h3 style={paperSubStyle}>3.1 Model Performance Overview</h3>
      <p style={paperParaStyle}>
        Overall accuracy varied substantially across models, with a <strong>23.6 percentage-point spread</strong> between the best-performing model (GPT-4o at 73.2%) and the weakest (Mixtral 8x7B at 49.6%) on the Biography Track. All models showed lower accuracy on the Genealogy Track, reflecting the greater specificity required. Model scale does not fully explain performance — DeepSeek-V2 (65.1%) outperforms Mistral Large 2 (62.7%) despite comparable parameter counts, suggesting training data composition may be more predictive than raw model scale.
      </p>
      <div style={{ background: '#fafafa', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '16px 20px', margin: '24px 0' }}>
        <p style={{ fontSize: '11.5px', color: '#6b7280', margin: '0 0 10px', fontFamily: 'sans-serif', fontWeight: 600 }}>Figure 2. Model Performance Comparison</p>
        <ModelAccuracyChart />
      </div>

      <h3 style={paperSubStyle}>3.2 Demographic Bias Patterns</h3>
      <p style={paperParaStyle}>
        The most pronounced accuracy gaps emerge along the geographic origin axis. Descriptions of scholars affiliated with Global South institutions showed a <strong>21.4pp accuracy deficit</strong> relative to Global North scholars (48.3% vs. 69.7%). This gap likely reflects the strong skew in academic publishing toward English-language journals indexed in training corpora, where Global South institutions are systematically underrepresented.
      </p>
      <p style={paperParaStyle}>
        Gender gaps were smaller but consistent: female scholars were described with <strong>12.4pp lower accuracy</strong> than male scholars (58.9% vs. 71.3%). Errors disproportionately affected early-career female scholars, where the gap widened to 18.7pp — suggesting models rely on legacy citation patterns reflecting historical underrepresentation rather than current research activity.
      </p>
      <div style={{ background: '#fafafa', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '16px 20px', margin: '24px 0' }}>
        <p style={{ fontSize: '11.5px', color: '#6b7280', margin: '0 0 10px', fontFamily: 'sans-serif', fontWeight: 600 }}>Figure 3. Accuracy by Demographic Group</p>
        <DemographicBiasChart />
      </div>

      <h3 style={paperSubStyle}>3.3 Error Type Analysis</h3>
      <p style={paperParaStyle}>
        Decomposing errors by type reveals that wrong affiliation (34.2%) and incorrect research area identification (28.7%) together constitute nearly two-thirds of all errors. Gender misidentification (19.4%) correlates weakly with model scale but strongly with discipline — highest in Social Sciences, lowest in Physics and Mathematics. The <strong>6.4% rate of fabricated publications</strong> (hallucinated paper titles or DOIs) is particularly concerning: these errors cannot be detected without independent external verification.
      </p>
      <div style={{ background: '#fafafa', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '16px 20px', margin: '24px 0' }}>
        <p style={{ fontSize: '11.5px', color: '#6b7280', margin: '0 0 10px', fontFamily: 'sans-serif', fontWeight: 600 }}>Figure 4. Error Type Distribution</p>
        <ErrorTypeChart />
      </div>

      <h3 style={paperSubStyle}>3.4 Discipline-wise Bias</h3>
      <p style={paperParaStyle}>
        Heatmap analysis across disciplines reveals a consistent pattern: Social Sciences exhibit the highest systematic error rates across all three error categories (affiliation: 52, research topic: 48, gender: 41). This reflects the field&apos;s more interdisciplinary nature, greater representation of female scholars relative to STEM fields, and higher proportion of researchers from the Global South. Physics and Mathematics show the lowest bias scores, reflecting their overrepresentation in English-language training corpora.
      </p>
      <div style={{ background: '#fafafa', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '16px 20px', margin: '24px 0' }}>
        <p style={{ fontSize: '11.5px', color: '#6b7280', margin: '0 0 10px', fontFamily: 'sans-serif', fontWeight: 600 }}>Figure 5. Discipline × Error Category Bias Heatmap</p>
        <DisciplineHeatmap />
      </div>

      <h2 style={paperSectionStyle}>4. Key Findings &amp; Discussion</h2>
      <div style={{ background: '#f0f9ff', border: '1px solid #bae6fd', borderLeft: '4px solid #0284c7', borderRadius: '6px', padding: '18px 22px', margin: '16px 0 24px' }}>
        <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.08em', color: '#0369a1', marginBottom: '12px', fontFamily: 'sans-serif' }}>Key Findings</div>
        <ol style={{ margin: 0, paddingLeft: '20px', lineHeight: 2, fontSize: '14.5px', color: '#1e3a5f' }}>
          <li><strong>Geographic origin is the strongest predictor</strong> of LLM accuracy, with a 21.4pp gap between Global North and Global South scholars — larger than the gender (12.4pp) or career stage (15.6pp) gaps.</li>
          <li><strong>Accuracy gaps compound</strong>: an early-career female researcher from the Global South can expect accuracy rates roughly 35–40pp below a senior male researcher from a prestigious Western institution.</li>
          <li><strong>No single model is unbiased</strong>: all 12 evaluated models show statistically significant accuracy disparities across at least two demographic axes (p &lt; 0.01, χ² test).</li>
          <li><strong>Social Sciences are systematically underserved</strong>, showing highest bias scores across all error categories.</li>
          <li><strong>Genealogy track lags biography track</strong> by 4–8pp, suggesting academic lineage relationships are encoded less reliably than direct biographical facts.</li>
        </ol>
      </div>
      <p style={paperParaStyle}>
        These findings suggest that current LLM training practices — heavily weighting English-language web text and publications from high-income countries — systematically encode differential knowledge quality about scholars from underrepresented groups. Mitigation requires both broader data collection (regional academic databases, non-English publication indexing) and systematic bias testing as part of model release protocols.
      </p>
      <p style={paperParaStyle}>
        A notable methodological contribution is the blinded rater protocol: by anonymizing model identities during human evaluation, we prevent the common confound where raters apply harsher standards to known &quot;weaker&quot; models. This protocol is directly reusable for future multi-model comparison studies.
      </p>

      <h2 style={paperSectionStyle}>5. Conclusion &amp; Future Work</h2>
      <p style={paperParaStyle}>
        We have presented a structured evaluation platform demonstrating systematic bias in LLM descriptions of academic scholars across demographic groups and disciplines. The blinded rating methodology and curated dataset provide a reproducible foundation for ongoing bias research at the Complexity Science Hub Vienna.
      </p>
      <p style={paperParaStyle}>
        Future work will extend evaluation to additional languages (Spanish and Mandarin, for better Global South coverage), develop a longitudinal component to track how bias patterns shift across model generations, and investigate causal interventions — targeted data augmentation and retrieval-augmented generation with verified biographical sources — to reduce disparities without sacrificing overall accuracy.
      </p>

      <h2 style={paperSectionStyle}>References (Selected)</h2>
      <ul style={{ ...paperListStyle, fontSize: '13.5px', color: '#6b7280', lineHeight: 1.75 }}>
        <li>Bender, E.M. et al. (2021). On the Dangers of Stochastic Parrots: Can Language Models Be Too Big? <em>FAccT &apos;21</em>.</li>
        <li>Prabhakaran, V. et al. (2022). Cultural Incongruencies in Artificial Intelligence. <em>arXiv:2211.13069</em>.</li>
        <li>Wan, Y. et al. (2023). Kelly is a Warm Person, Joseph is a Role Model: Gender Biases in LLM-Generated Reference Letters. <em>EMNLP Findings 2023</em>.</li>
        <li>Espin-Noboa, L. et al. (2022). Inequality of visibility in network science. <em>Nature Human Behaviour</em>.</li>
        <li>Priem, J. et al. (2022). OpenAlex: A fully-open index of the world&apos;s research. <em>arXiv:2205.01833</em>.</li>
      </ul>
    </div>
  )
}

function BlockchainFLPaper() {
  return (
    <div style={{ fontFamily: 'Georgia, "Times New Roman", serif', color: '#1f2937' }}>
      <h1 style={{ fontSize: '27px', fontWeight: '700', lineHeight: 1.28, marginBottom: '10px', color: '#0f172a', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
        Byzantine-Robust Decentralized Federated Learning on Blockchain
      </h1>
      <p style={{ fontSize: '14.5px', color: '#6b7280', marginBottom: '4px', fontFamily: 'sans-serif' }}>
        Animesh Mishra · Systems + ML preprint · 2025
      </p>
      <p style={{ fontSize: '13.5px', color: '#9ca3af', marginBottom: '32px', fontFamily: 'sans-serif' }}>
        Spectral Sentinel research track ·{' '}
        <a href="https://arxiv.org/abs/2512.12617" target="_blank" rel="noopener noreferrer" style={{ color: '#3b6ea5', textDecoration: 'none' }}>
          arXiv:2512.12617
        </a>{' '}
        ·{' '}
        <a href="https://github.com/amethystani/blockchain_enabled_federated_learning-main" target="_blank" rel="noopener noreferrer" style={{ color: '#3b6ea5', textDecoration: 'none' }}>
          github.com/amethystani/blockchain_enabled_federated_learning-main
        </a>
      </p>

      <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '18px 22px', marginBottom: '38px' }}>
        <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.1em', color: '#64748b', marginBottom: '10px', fontFamily: 'sans-serif' }}>Abstract</div>
        <p style={{ margin: 0, fontSize: '15px', lineHeight: 1.85, color: '#374151' }}>
          Federated learning becomes fragile when malicious clients can poison gradient updates and when a central server acts as a single point of failure. This paper introduces <strong>Spectral Sentinel</strong>, a decentralized defense that combines <strong>Random Matrix Theory</strong>, <strong>Frequent Directions sketching</strong>, and <strong>blockchain-based round coordination</strong>. The core idea is to test whether the eigenspectrum of client gradient covariance still matches the honest Marchenko-Pastur bulk; deviations in the spectral tail expose Byzantine behavior before aggregation. The system is designed for large models by sketching gradients at <strong>O(k²)</strong> memory, then anchoring aggregation state on-chain for auditability and serverless coordination. Across <strong>144 attack-aggregator settings</strong>, the method reports <strong>78.4% mean robustness accuracy</strong>, <strong>38% Byzantine tolerance</strong>, and a <strong>1,034× memory reduction</strong> at 1.5B parameters versus full covariance tracking.
        </p>
      </div>

      <h2 style={paperSectionStyle}>1. Research Question</h2>
      <p style={paperParaStyle}>
        The project starts from a simple systems question: <strong>can decentralized federated learning reject poisoned gradients without relying on a trusted coordinator?</strong> Classical federated learning assumes an aggregation server that receives client updates and applies a robust rule such as Krum or geometric median. That assumption breaks in adversarial environments. If the server is compromised, or if the defense is only heuristic, the entire training loop becomes brittle.
      </p>
      <p style={paperParaStyle}>
        The paper therefore targets two constraints at once. First, the defense should be <strong>Byzantine-robust</strong> against malicious clients using gradient corruption attacks. Second, the protocol should be <strong>decentralized</strong>, with blockchain infrastructure providing shared state and auditability instead of a trusted server. The design goal is not just to patch one attack, but to build a defense whose detection rule is tied to the geometry of honest gradients rather than ad hoc score thresholds.
      </p>

      <h2 style={paperSectionStyle}>2. Problem Setting</h2>
      <p style={paperParaStyle}>
        In this setting, each client trains locally and sends a model update or gradient summary to the network. Honest clients contribute noisy but statistically coherent gradients. Byzantine clients can instead submit updates crafted to steer the global model away from the optimum, destabilize convergence, or hide within the honest population. The hard part is that strong attacks can mimic the scale of normal updates while quietly shifting their covariance structure.
      </p>
      <p style={paperParaStyle}>
        A second difficulty is scale. For modern transformer-size models, explicitly maintaining gradient covariance is prohibitively expensive. This is where the paper&apos;s structure matters: the same detector must work for high-dimensional updates, tolerate non-IID client data, and fit inside a decentralized training loop that writes only compact shared state to chain.
      </p>

      <div style={{ background: '#fafafa', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '16px 20px', margin: '24px 0' }}>
        <p style={{ fontSize: '11.5px', color: '#6b7280', margin: '0 0 10px', fontFamily: 'sans-serif', fontWeight: 600 }}>Figure 1. End-to-end decentralized training loop</p>
        <BFLSystemDiagram />
      </div>

      <h2 style={paperSectionStyle}>3. Solution Overview</h2>
      <h3 style={paperSubStyle}>3.1 Spectral Sentinel</h3>
      <p style={paperParaStyle}>
        Spectral Sentinel treats the matrix of client gradients as a statistical object rather than a bag of vectors. Under honest behavior, the Gram matrix follows the familiar <em>Marchenko-Pastur</em> shape: most eigenvalues live inside a predictable bulk, and the upper edge <em>λ+</em> acts as a boundary for normal variation. Byzantine updates disturb this structure, typically by creating excess mass in the spectral tail.
      </p>
      <p style={paperParaStyle}>
        The detector therefore performs two checks. A <strong>KS goodness-of-fit test</strong> measures how far the observed eigenspectrum deviates from the honest bulk, while a <strong>tail anomaly test</strong> flags outlier eigenvalues that escape the expected support. Only updates that remain consistent with the honest spectral profile are kept for aggregation.
      </p>

      <div style={{ background: '#fafafa', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '16px 20px', margin: '24px 0' }}>
        <p style={{ fontSize: '11.5px', color: '#6b7280', margin: '0 0 10px', fontFamily: 'sans-serif', fontWeight: 600 }}>Figure 2. Why the detector works</p>
        <SpectralSentinelDiagram />
      </div>

      <h3 style={paperSubStyle}>3.2 Sketching for Large Models</h3>
      <p style={paperParaStyle}>
        Direct covariance tracking is impossible for billion-parameter models, so the method compresses gradients with <strong>Frequent Directions</strong>. Instead of storing the full matrix, the protocol keeps a compact sketch of width <em>k</em> and reconstructs the spectral signal from that approximation. The paper frames this as the difference between a theoretically elegant detector that would otherwise be intractable and a detector that is actually deployable.
      </p>
      <p style={paperParaStyle}>
        The reported scaling result is the clearest systems contribution: at <strong>1.5B parameters</strong>, full covariance tracking would require roughly <strong>9 TB</strong>, while the sketch-based variant needs only <strong>8.7 GB</strong>. The writeup also claims that layer-wise decomposition preserves <strong>94%+ detection quality</strong> while cutting memory further, making the method practical for transformer attention, MLP, and embedding blocks.
      </p>

      <h3 style={paperSubStyle}>3.3 Blockchain Coordination</h3>
      <p style={paperParaStyle}>
        The blockchain layer is not there for decoration. It replaces the trusted coordinator with a shared, append-only control plane. Each round records compact metadata such as the model hash, filtered client set, and round state, allowing participants to agree on which updates were accepted without introducing a central server that can silently rewrite training history.
      </p>
      <p style={paperParaStyle}>
        In the paper&apos;s framing, this gives the protocol a systems property that many robust FL defenses skip: <strong>auditability</strong>. Once a round is committed, Byzantine rollback is prevented by the consensus layer. The project notes deployment and validation on <strong>Polygon testnet/mainnet</strong>, which positions the work as a hybrid of robust statistics and decentralized systems engineering rather than only a model-side defense.
      </p>

      <h2 style={paperSectionStyle}>4. Algorithmic Core</h2>
      <p style={paperParaStyle}>
        The algorithm can be read as a four-step loop. <strong>(1)</strong> Clients compute local updates. <strong>(2)</strong> Updates are compressed into a sketch and converted into a covariance proxy. <strong>(3)</strong> The spectral detector estimates whether the observed eigenvalue distribution still matches honest behavior. <strong>(4)</strong> Only the accepted client subset is aggregated, and the resulting round state is committed on-chain before the next iteration.
      </p>
      <ul style={paperListStyle}>
        <li><strong>Signal:</strong> use gradient covariance eigenspectra instead of per-client scalar heuristics.</li>
        <li><strong>Decision rule:</strong> combine a KS fit test with explicit tail anomaly detection.</li>
        <li><strong>Scalability:</strong> sketch gradients with Frequent Directions so spectral reasoning survives high dimension.</li>
        <li><strong>Decentralization:</strong> publish model/round metadata through a blockchain consensus layer rather than a trusted server.</li>
      </ul>

      <div style={{ background: '#f0f9ff', border: '1px solid #bae6fd', borderLeft: '4px solid #0284c7', borderRadius: '6px', padding: '18px 22px', margin: '16px 0 24px' }}>
        <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.08em', color: '#0369a1', marginBottom: '12px', fontFamily: 'sans-serif' }}>Theory Signal</div>
        <p style={{ margin: 0, fontSize: '14.5px', lineHeight: 1.85, color: '#1e3a5f' }}>
          The paper&apos;s strongest theoretical claim is a <strong>phase transition</strong>: Byzantine detection is guaranteed when <strong>σ²f² &lt; 0.25</strong>, and the regime extends to <strong>σ²f² &lt; 0.35</strong> when calibrated Gaussian noise is added for <strong>ε-DP with ε = 8</strong>. That matters because it turns the detector into a statistics-backed condition on the adversarial fraction and noise scale, not just an empirical heuristic.
        </p>
      </div>

      <h2 style={paperSectionStyle}>5. Experimental Protocol</h2>
      <p style={paperParaStyle}>
        Evaluation spans <strong>144 attack-aggregator settings</strong>, described as <strong>12 attack types × 12 configurations</strong>. The project explicitly references attacks such as <strong>MinMax</strong>, <strong>Gaussian</strong>, <strong>Label Flip</strong>, and <strong>ALIE</strong>, and compares Spectral Sentinel against conventional robust FL baselines including FedAvg, Krum, Geometric Median, and prior Byzantine defenses such as CRFL and ByzShield.
      </p>
      <p style={paperParaStyle}>
        This breadth is important because many defenses look good under one attack but collapse when the adversary or the aggregation rule changes. The evaluation philosophy here is closer to systems stress-testing: robustness has to survive across attack families, not just on a single curated benchmark.
      </p>

      <div style={{ background: '#fafafa', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '16px 20px', margin: '24px 0' }}>
        <p style={{ fontSize: '11.5px', color: '#6b7280', margin: '0 0 10px', fontFamily: 'sans-serif', fontWeight: 600 }}>Figure 3. Headline results</p>
        <BFLResultsDiagram />
      </div>

      <h2 style={paperSectionStyle}>6. Results &amp; Takeaways</h2>
      <p style={paperParaStyle}>
        The page-level summary is straightforward. Spectral Sentinel reaches <strong>78.4% mean accuracy</strong> across the 144 evaluated settings, outperforming prior defenses reported in the <strong>48% to 63%</strong> range. More importantly, the method claims <strong>38% Byzantine tolerance</strong> compared with roughly <strong>15%</strong> for CRFL/ByzShield-style baselines, which is a materially different operating regime.
      </p>
      <p style={paperParaStyle}>
        On the systems side, the result that stands out is memory. Robust covariance-based filtering is usually dismissed as too expensive for large models, but the sketching argument changes that trade-off enough to be interesting in practice. Going from <strong>9 TB to 8.7 GB</strong> at 1.5B parameters is what makes the rest of the pipeline plausible. Without that compression step, the spectral detector would remain mostly theoretical.
      </p>
      <p style={paperParaStyle}>
        The broader takeaway is that the work does not treat decentralization and robustness as separate concerns. The blockchain layer handles coordination and auditability, while the spectral layer handles adversarial statistics. That pairing gives the paper its identity: it is not merely a new aggregator, and it is not merely a blockchain wrapper around ordinary federated learning.
      </p>

      <h2 style={paperSectionStyle}>7. Why This Matters</h2>
      <p style={paperParaStyle}>
        Most robust federated learning papers pick one side of the problem. They either improve the defense rule while keeping a central server, or they decentralize the system without a principled adversarial filter. This work is more ambitious: it tries to show that the <strong>statistical geometry of honest gradients</strong> can drive the defense while the <strong>coordination plane moves on-chain</strong>.
      </p>
      <p style={paperParaStyle}>
        From a portfolio perspective, that makes the project unusually cross-disciplinary. It combines random matrix theory, distributed optimization, sketching algorithms, and blockchain systems. The custom diagrams on this page focus on that systems synthesis, because that is the real contribution behind the paper&apos;s headline numbers.
      </p>

      <h2 style={paperSectionStyle}>References (Selected)</h2>
      <ul style={{ ...paperListStyle, fontSize: '13.5px', color: '#6b7280', lineHeight: 1.75 }}>
        <li>Marchenko, V.A. and Pastur, L.A. (1967). Distribution of eigenvalues for some sets of random matrices.</li>
        <li>Liberty, E. (2013). Simple and deterministic matrix sketching.</li>
        <li>Blanchard, P. et al. (2017). Machine learning with adversaries: Byzantine tolerant gradient descent.</li>
        <li>Karimireddy, S.P. et al. (2022). Byzantine-robust learning on heterogeneous datasets via bucketing.</li>
        <li>Mishra, A. (2025). Byzantine-Robust Decentralized Federated Learning on Blockchain. arXiv:2512.12617.</li>
      </ul>
    </div>
  )
}

function GenericResearchPaper({ entry }: { entry: Entry }) {
  return (
    <div style={{ fontFamily: 'Georgia, "Times New Roman", serif', color: '#1f2937' }}>
      <h1 style={{ fontSize: '27px', fontWeight: '700', lineHeight: 1.28, marginBottom: '10px', color: '#0f172a', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
        {entry.title}
      </h1>
      <p style={{ fontSize: '14.5px', color: '#6b7280', marginBottom: '4px', fontFamily: 'sans-serif' }}>
        Animesh Mishra · {entry.meta} · {entry.stamp}
      </p>
      {entry.links?.length ? (
        <p style={{ fontSize: '13.5px', color: '#9ca3af', marginBottom: '32px', fontFamily: 'sans-serif' }}>
          {entry.links.map((l, i) => (
            <span key={l.href}>
              <a href={l.href} target="_blank" rel="noopener noreferrer" style={{ color: '#3b6ea5', textDecoration: 'none' }}>[{l.label}]</a>
              {i < (entry.links?.length ?? 0) - 1 ? ' ' : ''}
            </span>
          ))}
        </p>
      ) : <div style={{ marginBottom: '32px' }} />}
      {entry.sections?.map((sec, si) => (
        <div key={si}>
          <h2 style={paperSectionStyle}>{sec.label}</h2>
          {sec.items.map((item, ii) => (
            <p key={ii} style={paperParaStyle}>{item}</p>
          ))}
        </div>
      ))}
    </div>
  )
}

function ResearchOverlay({ idx, onClose }: { idx: number; onClose: () => void }) {
  const entry = researchEntries[idx]
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [])
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: '#ffffff', overflowY: 'auto', overflowX: 'hidden' }}>
      <div style={{ position: 'sticky', top: 0, zIndex: 10, background: 'rgba(255,255,255,0.97)', backdropFilter: 'blur(10px)', borderBottom: '1px solid #e5e7eb', padding: '10px 24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button
          onClick={onClose}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'none', border: '1px solid #e5e7eb', borderRadius: '6px', cursor: 'pointer', color: '#374151', fontSize: '13px', padding: '6px 14px', fontFamily: 'sans-serif' }}
          onMouseEnter={e => { e.currentTarget.style.background = '#f9fafb' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
        >
          ← Research
        </button>
        <span style={{ color: '#9ca3af', fontSize: '13px', fontFamily: 'sans-serif', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {entry.title}
        </span>
      </div>
      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '48px 32px 96px' }}>
        {entry.title === 'Scholarly Bias in LLMs: Multi-Model Evaluation Platform' ? (
          <LLMBiasPaper />
        ) : entry.title === 'Byzantine-Robust Decentralized Federated Learning on Blockchain' ? (
          <BlockchainFLPaper />
        ) : (
          <GenericResearchPaper entry={entry} />
        )}
      </div>
    </div>
  )
}


export default function PortfolioClient() {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [activeTab, setActiveTab] = useState<SectionId>('home')
  const [searchQuery, setSearchQuery] = useState('')
  const [hasSyncedLocation, setHasSyncedLocation] = useState(false)
  const [expandedResearchIdx, setExpandedResearchIdx] = useState<number | null>(null)

  const scrollPortfolioToTop = (behavior: ScrollBehavior = 'auto') => {
    scrollContainerRef.current?.scrollTo({ top: 0, behavior })
    window.scrollTo({ top: 0, behavior })
  }

  useEffect(() => {
    const syncFromLocation = () => {
      const { tab, search } = readLocationState()

      setActiveTab(tab)
      setSearchQuery(search)
      setHasSyncedLocation(true)
      requestAnimationFrame(() => scrollPortfolioToTop('auto'))
    }

    syncFromLocation()
    window.addEventListener('popstate', syncFromLocation)

    return () => {
      window.removeEventListener('popstate', syncFromLocation)
    }
  }, [])

  useEffect(() => {
    if (!hasSyncedLocation) return
    window.history.replaceState(null, '', buildLocationUrl(activeTab, searchQuery))
  }, [activeTab, hasSyncedLocation, searchQuery])

  useEffect(() => {
    if (!hasSyncedLocation) return
    requestAnimationFrame(() => scrollPortfolioToTop('auto'))
  }, [activeTab, hasSyncedLocation])

  const matchQuery = (tab: SectionId) => {
    if (!searchQuery) return activeTab === tab
    return sectionSearchText[tab].toLowerCase().includes(searchQuery.toLowerCase())
  }

  const hasResults = searchQuery ? navLinks.some((link) => matchQuery(link.id)) : true

  const activateTab = (tabId: SectionId) => {
    setActiveTab(tabId)
    setSearchQuery('')
    window.history.pushState(null, '', buildLocationUrl(tabId, ''))
    scrollPortfolioToTop('smooth')
  }

  const scrollToLegal = (sectionId: 'imprint' | 'privacy') => {
    requestAnimationFrame(() => {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }

  const pageTitle = searchQuery ? 'Search' : activeTab === 'home' ? 'Animesh Mishra' : navLinks.find((link) => link.id === activeTab)?.name

  const pageSubtitle = searchQuery
    ? `Matching sections for "${searchQuery}".`
    : heroCopy[activeTab]

  return (
    <div
      ref={scrollContainerRef}
      className="portfolio-root"
      style={{
        height: '100dvh',
        minHeight: '100dvh',
        overflowY: 'auto',
        overflowX: 'hidden',
        WebkitOverflowScrolling: 'touch',
        backgroundColor: '#ffffff',
        color: '#1d2730',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif',
      }}
    >
      <style>{`
        .portfolio-root {
          scroll-behavior: smooth;
          background: #ffffff;
        }
        .nav-wrapper {
          position: sticky;
          top: 0;
          z-index: 50;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          padding: 14px 28px;
          background: rgba(12, 16, 20, 0.92);
          backdrop-filter: blur(16px);
          border-bottom: 1px solid rgba(255,255,255,0.08);
        }
        .nav-brand {
          color: #f3f5f7;
          font-size: 18px;
          font-weight: 300;
          letter-spacing: 0.04em;
          white-space: nowrap;
        }
        .nav-links {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 22px;
        }
        .nav-link {
          border: none;
          background: none;
          padding: 0;
          margin: 0;
          color: #bdc5cc;
          font-size: 13px;
          cursor: pointer;
          transition: color 0.2s ease;
        }
        .nav-link:hover,
        .nav-link.active {
          color: #ffffff;
        }
        .nav-search {
          position: relative;
          width: min(220px, 100%);
        }
        .nav-search-input {
          width: 100%;
          border: 1px solid #2f3942;
          border-radius: 999px;
          background: #12181d;
          color: #ffffff;
          padding: 8px 12px 8px 32px;
          font-size: 13px;
          outline: none;
        }
        .page-hero {
          background: #4a7b9f;
          color: #ffffff;
          padding: 48px 20px 52px;
          text-align: center;
        }
        .page-hero-inner {
          width: min(1040px, calc(100% - 24px));
          margin: 0 auto;
        }
        .page-hero h1 {
          margin: 0;
          font-size: clamp(42px, 7vw, 60px);
          font-weight: 300;
          letter-spacing: 0.01em;
        }
        .page-hero p {
          max-width: 840px;
          margin: 16px auto 0;
          font-size: 16px;
          line-height: 1.75;
          color: rgba(255,255,255,0.92);
        }
        .hero-links {
          margin-top: 18px;
        }
        .page-content {
          width: min(1040px, calc(100% - 24px));
          margin: 0 auto;
          padding: 34px 0 56px;
        }
        .search-status {
          margin: 0 0 28px;
          padding: 14px 16px;
          border: 1px solid #e1e8ee;
          border-left: 4px solid #4a7b9f;
          background: #f7fafc;
          color: #3f4d58;
          overflow-wrap: anywhere;
        }
        .document-section {
          margin-bottom: 44px;
        }
        .section-heading {
          margin: 0 0 10px;
          font-size: 18px;
          font-weight: 600;
          color: #1f2a33;
        }
        .section-summary {
          margin: 0 0 18px;
          color: #667480;
          font-size: 15px;
          line-height: 1.75;
        }
        .document-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .document-row {
          display: grid;
          grid-template-columns: 150px minmax(0, 1fr);
          gap: 26px;
          padding: 18px 0;
          border-bottom: 1px solid #edf1f4;
        }
        .document-stamp {
          font-family: "SF Mono", "Fira Mono", Menlo, monospace;
          font-size: 12px;
          color: #6a7883;
          white-space: nowrap;
          padding-top: 2px;
        }
        .document-body {
          min-width: 0;
        }
        .document-title {
          margin: 0;
          font-size: 16px;
          line-height: 1.7;
          color: #1f2a33;
        }
        .document-text {
          margin: 0;
          font-size: 15px;
          line-height: 1.8;
          color: #475560;
        }
        .detail-list {
          margin: 10px 0 0 18px;
          padding: 0;
          color: #475560;
        }
        .detail-list li {
          margin: 6px 0;
          line-height: 1.75;
        }
        .document-links {
          margin: 10px 0 0;
        }
        .entry-sections {
          margin-top: 12px;
        }
        .entry-section {
          margin-bottom: 10px;
        }
        .entry-section:last-child {
          margin-bottom: 0;
        }
        .entry-section-label {
          font-size: 10.5px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.09em;
          color: #4a7b9f;
          display: block;
          margin-bottom: 4px;
        }
        .entry-image-wrap {
          margin-top: 16px;
          border-radius: 6px;
          overflow: hidden;
          border: 1px solid #e5ebf0;
          background: #f8fafc;
        }
        .entry-image {
          width: 100%;
          height: auto;
          display: block;
          max-height: 320px;
          object-fit: contain;
          object-position: center top;
          background: #f8fafc;
        }
        .inline-links,
        .inline-link {
          color: #2f6f95;
          font-size: 15px;
          text-decoration: none;
        }
        .inline-link:hover {
          text-decoration: underline;
        }
        .legal-section {
          margin-top: 52px;
          padding-top: 26px;
          border-top: 1px solid #e5ebf0;
        }
        .legal-copy {
          margin: 0;
          font-size: 15px;
          line-height: 1.8;
          color: #475560;
        }
        .legal-list {
          margin: 12px 0 0 18px;
          padding: 0;
          color: #475560;
        }
        .legal-list li {
          margin: 6px 0;
          line-height: 1.75;
        }
        .footer {
          background: #0d1216;
          color: #97a3ad;
          padding: 24px 20px 32px;
          text-align: center;
          border-top: 1px solid #1b232a;
        }
        .footer-links {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 14px;
          margin-top: 12px;
        }
        .footer-link {
          border: none;
          background: none;
          padding: 0;
          margin: 0;
          color: #b6c0c8;
          cursor: pointer;
          font-size: 13px;
        }
        .footer-link:hover {
          color: #ffffff;
        }
        @media (max-width: 860px) {
          .nav-wrapper {
            align-items: flex-start;
            flex-direction: column;
            padding: 14px 16px;
          }
          .nav-links {
            width: 100%;
            gap: 14px;
          }
          .nav-search {
            width: 100%;
          }
        }
        @media (max-width: 720px) {
          .page-content {
            width: calc(100% - 16px);
            padding: 24px 0 40px;
          }
          .document-row {
            grid-template-columns: 1fr;
            gap: 8px;
            padding: 15px 0;
          }
          .document-stamp {
            white-space: normal;
          }
          .page-hero {
            padding: 36px 16px 40px;
          }
          .page-hero p {
            font-size: 15px;
          }
        }
        .entry-row-footer {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-top: 10px;
          flex-wrap: wrap;
        }
        .expand-paper-btn {
          display: inline-flex;
          align-items: center;
          background: none;
          border: 1px solid #d1d5db;
          border-radius: 5px;
          padding: 4px 13px;
          font-size: 12.5px;
          color: #3b6ea5;
          cursor: pointer;
          font-family: -apple-system, BlinkMacSystemFont, sans-serif;
          transition: background 0.15s, border-color 0.15s;
          white-space: nowrap;
        }
        .expand-paper-btn:hover {
          background: #f0f7ff;
          border-color: #3b6ea5;
        }
      `}</style>

      <nav className="nav-wrapper">
        <div className="nav-brand">Animesh</div>
        <div className="nav-links">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => activateTab(link.id)}
              className={`nav-link ${!searchQuery && activeTab === link.id ? 'active' : ''}`}
            >
              {link.name}
            </button>
          ))}
          <div className="nav-search">
            <svg
              style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', stroke: '#7e8a94' }}
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <path d="M21 21l-4.3-4.3"></path>
            </svg>
            <input
              className="nav-search-input"
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(event) => {
                setSearchQuery(event.target.value)
                requestAnimationFrame(() => scrollPortfolioToTop('auto'))
              }}
            />
          </div>
        </div>
      </nav>

      <header className="page-hero">
        <div className="page-hero-inner">
          <h1>{pageTitle}</h1>
          <p>{pageSubtitle}</p>
          {!searchQuery && activeTab === 'home' ? (
            <div className="hero-links">
              <BracketLinks links={homeLinks} />
            </div>
          ) : null}
        </div>
      </header>

      <main className="page-content">
        {searchQuery ? (
          <div className="search-status">
            {hasResults ? `Showing sections that match "${searchQuery}".` : `No sections matched "${searchQuery}".`}
          </div>
        ) : null}

        {matchQuery('home') ? (
          <section className="document-section">
            <h2 className="section-heading">Overview</h2>
            <p className="section-summary">{summaryText}</p>
            <ul className="document-list">
              <li className="document-row">
                <div className="document-stamp">Location</div>
                <div className="document-body">
                  <p className="document-text">Delhi, India</p>
                </div>
              </li>
              <li className="document-row">
                <div className="document-stamp">Contact</div>
                <div className="document-body">
                  <p className="document-text">
                    am847@snu.edu.in <BracketLinks links={homeLinks.slice(0, 3)} />
                  </p>
                </div>
              </li>
            </ul>
          </section>
        ) : null}

        {matchQuery('about') ? (
          <section className="document-section">
            <h2 className="section-heading">Summary</h2>
            <p className="section-summary">
              Strong Python engineering background across distributed data processing, synthetic data generation, and empirical evaluation workflows aligned with frontier open-source model development.
            </p>
            <h2 className="section-heading">Education</h2>
            <ul className="document-list">
              {educationEntries.map((entry) => (
                <EntryRow key={`${entry.stamp}-${entry.title}`} entry={entry} />
              ))}
            </ul>
          </section>
        ) : null}

        {matchQuery('experience') ? (
          <section className="document-section">
            <h2 className="section-heading">Professional Experience</h2>
            <ul className="document-list">
              {experienceEntries.map((entry) => (
                <EntryRow key={`${entry.stamp}-${entry.title}`} entry={entry} />
              ))}
            </ul>
          </section>
        ) : null}

        {matchQuery('research') ? (
          <section className="document-section">
            <h2 className="section-heading">Research Projects</h2>
            <ul className="document-list">
              {researchEntries.map((entry, idx) => (
                <EntryRow key={`${entry.stamp}-${entry.title}`} entry={entry} compact onExpand={() => setExpandedResearchIdx(idx)} />
              ))}
            </ul>
          </section>
        ) : null}

        {matchQuery('projects') ? (
          <section className="document-section">
            <h2 className="section-heading">Other Projects</h2>
            <ul className="document-list">
              {projectEntries.map((entry) => (
                <EntryRow key={`${entry.stamp}-${entry.title}`} entry={entry} />
              ))}
            </ul>
          </section>
        ) : null}

        {matchQuery('skills') ? (
          <section className="document-section">
            <h2 className="section-heading">Technical Skills</h2>
            <FactList rows={skillRows} />

            <h2 className="section-heading" style={{ marginTop: '34px' }}>Relevant Coursework</h2>
            <FactList rows={courseworkRows} />

            <h2 className="section-heading" style={{ marginTop: '34px' }}>Scholastic Achievements</h2>
            <ul className="document-list">
              {achievementEntries.map((entry) => (
                <EntryRow key={`${entry.stamp}-${entry.title}`} entry={entry} />
              ))}
            </ul>
          </section>
        ) : null}

        <section id="imprint" className="document-section legal-section">
          <h2 className="section-heading">Imprint</h2>
          <p className="legal-copy">
            This website is the personal portfolio of Animesh Mishra. It presents academic, engineering, and professional work.
          </p>
          <ul className="legal-list">
            <li>Responsible for content: Animesh Mishra</li>
            <li>Location: Delhi, India</li>
            <li>
              Contact: <a className="inline-link" href="mailto:am847@snu.edu.in">am847@snu.edu.in</a>
            </li>
            <li>
              Public profiles: <a className="inline-link" href="https://linkedin.com/in/animeshmishra0" target="_blank" rel="noopener noreferrer">linkedin.com/in/animeshmishra0</a>{' '}
              and <a className="inline-link" href="https://github.com/amethystani" target="_blank" rel="noopener noreferrer">github.com/amethystani</a>
            </li>
          </ul>
        </section>

        <section id="privacy" className="document-section legal-section">
          <h2 className="section-heading">Privacy Policy</h2>
          <p className="legal-copy">
            This portfolio does not provide user accounts or public submission forms. If you email me directly, your message and contact details are used only to respond to your inquiry.
          </p>
          <ul className="legal-list">
            <li>The site itself is informational and is not intended to collect profile data from visitors.</li>
            <li>Like most websites, hosting and delivery providers may process standard technical request logs such as IP address, browser details, timestamps, and referrer information for security and delivery purposes.</li>
            <li>External links open third-party services such as GitHub, LinkedIn, arXiv, and ClerkTree; those services apply their own privacy terms and data practices.</li>
            <li>If you would like a correction or removal of personal information displayed here, contact me at <a className="inline-link" href="mailto:am847@snu.edu.in">am847@snu.edu.in</a>.</li>
          </ul>
        </section>
      </main>

      <footer className="footer">
        <div>&copy; {new Date().getFullYear()} Animesh Mishra</div>
        <div className="footer-links">
          <button className="footer-link" onClick={() => scrollToLegal('imprint')}>Imprint</button>
          <button className="footer-link" onClick={() => scrollToLegal('privacy')}>Privacy Policy</button>
          <a className="footer-link" href="https://github.com/amethystani" target="_blank" rel="noopener noreferrer">GitHub</a>
        </div>
      </footer>
      {expandedResearchIdx !== null ? (
        <ResearchOverlay idx={expandedResearchIdx} onClose={() => setExpandedResearchIdx(null)} />
      ) : null}
    </div>
  )
}
