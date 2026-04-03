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
    .map((entry) => `${entry.stamp} ${entry.title} ${entry.meta ?? ''} ${(entry.details ?? []).join(' ')} ${(entry.links ?? []).map((link) => link.label).join(' ')}`)
    .join(' '),
  projects: projectEntries
    .map((entry) => `${entry.stamp} ${entry.title} ${entry.meta ?? ''} ${(entry.details ?? []).join(' ')} ${(entry.links ?? []).map((link) => link.label).join(' ')}`)
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

function EntryRow({ entry }: { entry: Entry }) {
  return (
    <li className="document-row">
      <div className="document-stamp">{entry.stamp}</div>
      <div className="document-body">
        <p className="document-title">
          <strong>{entry.title}</strong>
          {entry.meta ? `, ${entry.meta}` : ''}
        </p>
        {entry.details?.length ? (
          <ul className="detail-list">
            {entry.details.map((detail) => (
              <li key={detail}>{detail}</li>
            ))}
          </ul>
        ) : null}
        {entry.sections?.length ? (
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
        {entry.image ? (
          <div className="entry-image-wrap">
            <img src={entry.image} alt={entry.title} className="entry-image" loading="lazy" />
          </div>
        ) : null}
        {entry.links?.length ? (
          <p className="document-links">
            <BracketLinks links={entry.links} />
          </p>
        ) : null}
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

export default function PortfolioClient() {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [activeTab, setActiveTab] = useState<SectionId>('home')
  const [searchQuery, setSearchQuery] = useState('')
  const [hasSyncedLocation, setHasSyncedLocation] = useState(false)

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
              {researchEntries.map((entry) => (
                <EntryRow key={`${entry.stamp}-${entry.title}`} entry={entry} />
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
    </div>
  )
}
