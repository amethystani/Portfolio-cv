'use client'

import Image from 'next/image'
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
  summary?: string
  details?: string[]
  sections?: EntrySection[]
  image?: string
  logo?: string
  logoScale?: number
  links?: LinkItem[]
}

type FactRow = {
  label: string
  text: string
}

type LegalPage = 'imprint' | 'privacy'

const navLinks: Array<{ id: SectionId; name: string }> = [
  { id: 'home', name: 'Home' },
  { id: 'about', name: 'About' },
  { id: 'experience', name: 'Experience' },
  { id: 'research', name: 'Research' },
  { id: 'projects', name: 'Projects' },
  { id: 'skills', name: 'Skills' },
]

const heroCopy: Record<SectionId, string> = {
  home: 'ML engineer working across AI systems, software, and research-oriented products.',
  about: 'Background, education, and the kind of engineering and research work I like doing.',
  experience: 'Professional experience across research engineering, large-scale data pipelines, synthetic data generation, and applied ML systems.',
  research: 'Research across LLM evaluation, statistical modeling, legal reasoning, edge inference, and distributed learning.',
  projects: 'Selected applied systems spanning forecasting, legal AI, enterprise automation, and social-data tooling.',
  skills: 'Technical stack across machine learning, data infrastructure, evaluation, and distributed systems.',
}

const homeLinks: LinkItem[] = [
  { label: 'email', href: 'mailto:am847@snu.edu.in' },
  { label: 'linkedin', href: 'https://linkedin.com/in/animeshmishra0' },
  { label: 'github', href: 'https://github.com/amethystani' },
  { label: 'resume', href: '/resume.pdf' },
]

const summaryText =
  'ML engineer with experience across software systems, applied machine learning, and research-driven development. Interested in building reliable tools, scalable workflows, and practical AI products.'

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
    stamp: 'May 2025 - Sep 2025',
    title: 'Student Researcher',
    meta: 'Complexity Science Hub',
    summary: 'Built the data and evaluation stack for multi-model scholarly-bias research.',
    logo: '/complexity_science_hub_logo.jpeg',
    details: [
      'Engineered a reproducible Python ETL pipeline to ingest and enrich physics-literature corpora from OpenAlex and APS APIs; built joined research-graph tables across authors, institutions, fields, and time.',
      'Built a batched LLM evaluation harness running parallel factuality and validity audits across Gemma 2 9B, LLaMA 3, and Mixtral 8x7B; standardized prompts and output schemas for apples-to-apples comparisons.',
      'Implemented Evaluator and Auditor modules computing error-rate, consistency, and graph-based similarity features; added demographic annotations and discipline-wise statistical plots for downstream bias slicing.',
    ],
  },
  {
    stamp: 'Jun 2025 - Aug 2025',
    title: 'Quant Research Analyst Intern',
    meta: 'ConsultAdd Services',
    summary: 'Worked on large-scale data extraction, filtering, and forecasting pipelines.',
    logo: '/consultadd_inc_logo.jpeg',
    details: [
      'Designed and deployed high-volume data scraping and filtering pipelines extracting over 500K records from unstructured web sources with deduplication, normalization, and schema enforcement stages.',
      'Used Datatrove for large-scale document deduplication and quality filtering, adapting n-gram and perplexity-based filters to the staffing-intelligence domain and benchmarking filter configurations via controlled ablations.',
      'Constructed and backtested time-series predictive models with Prophet and XGBoost, achieving an 8% accuracy improvement over heuristic baselines.',
    ],
  },
  {
    stamp: 'Sep 2024 - Dec 2024',
    title: 'Intern',
    meta: 'Exicom Group',
    summary: 'Built synthetic-data and geospatial workflows for EV demand forecasting.',
    logo: '/exicom.jpg',
    logoScale: 2.6,
    details: [
      'Leveraged NeMo DataDesigner to orchestrate synthetic data generation pipelines for EV demand forecasting, including task schemas, generation workflows, quality filtering, and deduplication passes.',
      'Engineered a geospatial feature pipeline using OpenStreetMap, Folium, and GeoPandas across 10+ feature dimensions to join and filter structured datasets under geospatial constraints.',
      'Implemented an MLOps workflow with LangChain and Ollama for batched inference and hyperparameter tuning across 100+ concurrent queries per iteration; integrated an automated feedback loop reaching 85% user satisfaction.',
    ],
  },
  {
    stamp: 'May 2024 - Jul 2024',
    title: 'Research Intern',
    meta: 'DRDO-ISSA',
    summary: 'Worked on routing optimization and mobility clustering for defense logistics analysis.',
    logo: '/DRDO-logo.png',
    details: [
      'Designed a custom Genetic Algorithm with specialized fitness functions and mutation operators for a high-dimensional Vehicle Routing Problem, achieving a 15% cost reduction over heuristic baselines.',
      'Applied DBSCAN and K-Means clustering to segment complex mobility patterns and produce geospatial heatmaps and statistical plots for resource-allocation insights.',
    ],
  },
]

const researchEntries: Entry[] = [
  {
    stamp: '2026',
    title: 'Comprehensive Measurement System Analysis for Statistical Repeatability',
    meta: 'Elsevier publication · Statistical modeling for engineering measurements',
    sections: [
      {
        label: 'Problem',
        items: [
          'This work studies a harder measurement question than standard repeatability reporting usually does: when a measurement system operates in noisy, small-magnitude engineering settings, how do you tell whether it is truly distinguishing specimens or only reproducing instrument noise? That matters in applications such as vibration analysis, material testing, and precision engineering, where classical Gage R&R summaries can miss the structure of modern datasets.',
        ],
      },
      {
        label: 'Modeling Setup',
        items: [
          'The repository implements a full Measurement System Analysis framework rather than one headline metric. The pipeline combines discriminability (D_hat), fingerprint index, I2C2, rank-sum statistics, ICC, CCDM, ANOVA-based variance decomposition, and X-bar control charts so repeatability is evaluated from multiple statistical angles instead of being reduced to a single correlation value.',
          'The codebase is built around repeated-measurement tables where specimen-level variation and repetition-level noise are separated explicitly. It supports datasets with very small variation, high-dimensional measurement structure, and non-Gaussian behavior, which is exactly the regime where naive reliability summaries tend to become unstable or misleading.',
        ],
      },
      {
        label: 'Statistical Analysis',
        items: [
          'The strongest part of the project is the variance-centric modeling. The implementation uses one-way ANOVA and Expected Mean Squares to decompose total variation into between-part and within-part components, then converts those into interpretable Gage R&R quantities such as EV, AV, GRR, PV percentages, and number of distinct categories. That makes the analysis useful for deciding whether a system can reliably separate real part differences from measurement error.',
          'It also goes beyond classical ICC reporting. The discriminability and fingerprinting routines compare within-subject and between-subject distances directly, rank-sum methods handle non-normal settings more robustly, and the power-analysis simulation module tests how sensitive each metric is under changing sample sizes and variance conditions. In the repo, that statistical layer is supported with control charts, variance-component plots, cross-metric relationship plots, and power curves, so the paper reads like a serious measurement-modeling study rather than a one-off script collection.',
        ],
      },
      {
        label: 'Results',
        items: [
          'The repository positions the outcome as a comprehensive repeatability evaluation framework: multiple reliability metrics, variance-component summaries, control-chart diagnostics, and simulation-based power analysis under one analysis stack. That makes it useful for engineering datasets where measurement credibility itself is the central research question.',
        ],
      },
    ],
    links: [
      { label: 'elsevier', href: 'https://www.sciencedirect.com/science/article/abs/pii/S026322412600730X' },
      { label: 'github', href: 'https://github.com/amethystani/Statistical-Repeatability' },
    ],
  },
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
          'Embedded 49,634 cases in a Poincaré ball using HGCNs — radial position encodes court authority, angular position captures semantic similarity.',
          'Three specialized agents (Linker, Interpreter, Conflict) coordinate via Nash Equilibrium to resolve citation conflicts. Combined five retrieval algorithms (semantic, structural, citation-weighted, hyperbolic, GNN-enhanced) through adversarial prosecutor-defense-judge simulation.',
          'Temporal decay scoring with a "resurrection" boost for re-cited old precedents; Toulmin argumentation extraction decomposes claims, grounds, warrants, and rebuttals.',
        ],
      },
      {
        label: 'Results',
        items: [
          'Precision@5 of 0.896; 98.3% citation conflict resolution; Gromov delta of 0.029 — 13.7× better hierarchical structure capture vs. Euclidean baseline, with a +62.4% resurrection effect for re-cited precedents.',
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
    stamp: '2026',
    title: 'NeMoSynthRust',
    meta: 'Synthetic Rust dataset generation with NeMo, Bonsai judging, and cargo-grounded evaluation',
    sections: [
      {
        label: 'Problem',
        items: [
          'Synthetic code data is easy to generate but hard to trust. High style quality does not necessarily mean a snippet compiles, passes tests, or teaches correct dependency semantics.',
        ],
      },
      {
        label: 'Approach',
        items: [
          'Built a four-stage pipeline: NeMo Data Designer generation, Bonsai-8B scoring and refinement, Tokio-based Rust evaluation with cargo, and HuggingFace-ready parquet export.',
          'Tracked domain/complexity mixtures, weighted judge scores across safety, performance, and idiomatic style, and preserved compile/test outcomes as first-class dataset fields.',
        ],
      },
      {
        label: 'Results',
        items: [
          'Generated and evaluated 30 structured Rust samples; average Bonsai score 8.33/10, compile rate 16.7%, test pass rate 6.7%, exposing the real gap between LLM code quality judgments and cargo reality.',
        ],
      },
    ],
  },
  {
    stamp: '2026',
    title: 'PocketHarvey: Offline Indian Legal Corpus Pipeline',
    meta: 'Indian legal corpus preprocessing, curriculum tiering, and synthetic instruction data',
    sections: [
      {
        label: 'Problem',
        items: [
          'PocketHarvey needed a domain-specialized legal corpus that could support both continued pretraining and supervised fine-tuning without relying on paid APIs or opaque proprietary data sources.',
        ],
      },
      {
        label: 'Approach',
        items: [
          'Built a notebook-driven pipeline over Indian judgments, legal educational web text, and manually authored statute summaries; applied normalization, multilingual filtering, FineWeb-style heuristics, exact SHA-256 deduplication, and MinHash-LSH near-deduplication.',
          'Added composite educational scoring, three-tier curriculum assignment, synthetic Q&A generation with grounded answer spans and NALSA disclaimers, and final Parquet export for Bonsai-8B adaptation.',
        ],
      },
      {
        label: 'Outputs',
        items: [
          'Produced pretraining and SFT-ready datasets with reproducible metadata, staged mixing ratios, and a documented legal-domain preprocessing recipe designed for offline model adaptation.',
        ],
      },
    ],
  },
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
    meta: 'Geospatial EV charging siting and operator-assistance system',
    sections: [
      {
        label: 'Problem',
        items: [
          'Charging-network expansion is expensive and location mistakes are hard to unwind. Operators need a way to compare candidate sites, nearby amenities, and user-facing charging queries in one decision loop.',
        ],
      },
      {
        label: 'Approach',
        items: [
          'Repo-grounded prototype combines OpenStreetMap amenity-distance extraction, OpenCage geocoding, GeoPandas land checks, Folium maps, weighted proximity scoring, and RandomForest-based suitability estimation.',
          'An Ollama-backed EV assistant layers on top for query answering, while the project README outlines a broader Exicom-facing forecasting stack with richer spatial and temporal demand modeling.',
        ],
      },
      {
        label: 'Results',
        items: [
          'Interactive map, dashboard, amenity analysis, and assistant surfaces packaged into a decision-support workflow for EV charging-site review.',
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
    meta: 'Conversational trend and digest product for social and news streams',
    sections: [
      {
        label: 'Problem',
        items: [
          'High-volume trend streams are fragmented, noisy, and hard to read on mobile. The product aims to turn that firehose into something that feels conversational, browsable, and category-aware.',
        ],
      },
      {
        label: 'Approach',
        items: [
          'Repo materials combine a mobile-first conversational reader concept with a real ingestion pipeline that scrapes and categorizes multi-source feeds, stores structured outputs, and generates daily summaries with Pegasus-based seq2seq tooling.',
          'Architecture notes include content services, AI transformation, analytics, notifications, and offline-oriented mobile surfaces.',
        ],
      },
      {
        label: 'Results',
        items: [
          'Working repo assets include multi-screen mobile mockups, analytics dashboards, and digest-generation scripts that turn categorized content into publishable summaries.',
        ],
      },
    ],
    links: [{ label: 'github', href: 'https://github.com/amethystani/NewSky' }],
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
  home: `${summaryText} India am847@snu.edu.in linkedin github resume`,
  about: `${summaryText} ${educationEntries.map((entry) => `${entry.stamp} ${entry.title} ${entry.meta ?? ''}`).join(' ')}`,
  experience: experienceEntries
    .map((entry) => `${entry.stamp} ${entry.title} ${entry.meta ?? ''} ${entry.summary ?? ''} ${(entry.details ?? []).join(' ')}`)
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

function shouldOpenInNewTab(href: string) {
  return href.startsWith('http') || href.startsWith('/resume')
}

function getDisplayLabel(label: string) {
  return label === 'linkedin' ? 'LinkedIn' : label === 'github' ? 'GitHub' : label.charAt(0).toUpperCase() + label.slice(1)
}

function BracketLinks({ links }: { links?: LinkItem[] }) {
  if (!links?.length) return null

  return (
    <span className="inline-links">
      {links.map((link, index) => {
        const openInNewTab = shouldOpenInNewTab(link.href)
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

function HeroActionLinks({ links }: { links?: LinkItem[] }) {
  if (!links?.length) return null

  return (
    <div className="hero-links">
      {links.map((link, index) => {
        const openInNewTab = shouldOpenInNewTab(link.href)
        return (
          <React.Fragment key={`${link.label}-${link.href}`}>
            <a
              href={link.href}
              target={openInNewTab ? '_blank' : undefined}
              rel={openInNewTab ? 'noopener noreferrer' : undefined}
              className="hero-link-item"
            >
              {getDisplayLabel(link.label)}
            </a>
            {index < links.length - 1 ? <span className="hero-link-separator">·</span> : null}
          </React.Fragment>
        )
      })}
    </div>
  )
}

function EntryRow({
  entry,
  onExpand,
  compact = false,
  titleOnly = false,
  expandLabel = 'View full paper →',
}: {
  entry: Entry
  onExpand?: () => void
  compact?: boolean
  titleOnly?: boolean
  expandLabel?: string
}) {
  return (
    <li className="document-row">
      <div className="document-stamp">{entry.stamp}</div>
      <div className="document-body">
        <p className="document-title">
          <strong>{entry.title}</strong>
          {!titleOnly && entry.meta ? `, ${entry.meta}` : ''}
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
          {!titleOnly && entry.links?.length ? (
            <p className="document-links" style={{ margin: 0 }}>
              <BracketLinks links={entry.links} />
            </p>
          ) : null}
          {onExpand ? (
            <button className="expand-paper-btn" onClick={onExpand}>
              {expandLabel}
            </button>
          ) : null}
        </div>
      </div>
    </li>
  )
}

function ExperienceCard({ entry }: { entry: Entry }) {
  return (
    <article className="experience-card">
      <div className="experience-card-top">
        <div className="experience-logo-wrap">
          {entry.logo ? (
            <Image
              src={entry.logo}
              alt={`${entry.meta ?? entry.title} logo`}
              width={96}
              height={96}
              className="experience-logo"
              style={{ transform: `scale(${entry.logoScale ?? 1})` }}
            />
          ) : null}
        </div>
        <div className="experience-card-heading">
          {entry.meta ? <p className="experience-company">{entry.meta}</p> : null}
          <h3 className="experience-role">{entry.title}</h3>
        </div>
        <div className="experience-timeline">{entry.stamp}</div>
      </div>
      {entry.summary ? <p className="experience-summary-copy">{entry.summary}</p> : null}
    </article>
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

const paperFigureStyle: React.CSSProperties = {
  background: '#fafafa',
  border: '1px solid #e5e7eb',
  borderRadius: '8px',
  padding: '16px 20px',
  margin: '24px 0',
}

const paperFigureLabelStyle: React.CSSProperties = {
  fontSize: '11.5px',
  color: '#6b7280',
  margin: '0 0 10px',
  fontFamily: 'sans-serif',
  fontWeight: 600,
}

type ProjectScreenshot = {
  src: string
  alt: string
  label: string
  width: number
  height: number
}

function ProjectScreenshotGrid({ items }: { items: ProjectScreenshot[] }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
        gap: '16px',
        alignItems: 'start',
      }}
    >
      {items.map((item) => (
        <figure
          key={item.src}
          style={{
            margin: 0,
            background: '#ffffff',
            border: '1px solid #e5e7eb',
            borderRadius: '14px',
            padding: '14px',
            boxShadow: '0 10px 28px rgba(15, 23, 42, 0.06)',
          }}
        >
          <Image
            src={item.src}
            alt={item.alt}
            width={item.width}
            height={item.height}
            style={{
              width: '100%',
              height: 'auto',
              display: 'block',
              borderRadius: '12px',
              border: '1px solid #e5e7eb',
              background: '#f8fafc',
            }}
          />
          <figcaption
            style={{
              marginTop: '10px',
              fontSize: '12px',
              color: '#64748b',
              textAlign: 'center',
              fontFamily: 'sans-serif',
              fontWeight: 600,
            }}
          >
            {item.label}
          </figcaption>
        </figure>
      ))}
    </div>
  )
}

function EVPredAIFlowDiagram() {
  return (
    <div style={{ overflowX: 'auto' }}>
      <svg viewBox="0 0 820 240" style={{ width: '100%', minWidth: 760, display: 'block', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
        <text x="410" y="22" textAnchor="middle" fontSize="15" fontWeight="700" fill="#0f172a">
          EVPredAI geospatial siting workflow
        </text>
        <text x="410" y="42" textAnchor="middle" fontSize="11.5" fill="#64748b">
          Candidate coordinates are geocoded, enriched with amenity distances, ranked into a suitability score, and surfaced through operator tools.
        </text>

        <rect x="26" y="74" width="164" height="112" rx="22" fill="#eff6ff" stroke="#60a5fa" strokeWidth="2" />
        <text x="108" y="103" textAnchor="middle" fontSize="13" fontWeight="700" fill="#1d4ed8">Candidate site</text>
        <text x="108" y="125" textAnchor="middle" fontSize="11.5" fill="#475569">lat / lon lookup</text>
        <text x="108" y="144" textAnchor="middle" fontSize="11.5" fill="#475569">OpenCage geocoding</text>
        <text x="108" y="163" textAnchor="middle" fontSize="11.5" fill="#475569">GeoPandas land check</text>

        <rect x="222" y="62" width="190" height="136" rx="22" fill="#f8fafc" stroke="#94a3b8" strokeWidth="2" />
        <text x="317" y="92" textAnchor="middle" fontSize="13" fontWeight="700" fill="#0f172a">Feature enrichment</text>
        <rect x="246" y="108" width="142" height="24" rx="12" fill="#dbeafe" stroke="#60a5fa" />
        <text x="317" y="124" textAnchor="middle" fontSize="11.5" fill="#1d4ed8">OSMnx amenity distances</text>
        <rect x="246" y="140" width="142" height="24" rx="12" fill="#dcfce7" stroke="#4ade80" />
        <text x="317" y="156" textAnchor="middle" fontSize="11.5" fill="#166534">parking, mall, hotel, station</text>
        <rect x="246" y="172" width="142" height="24" rx="12" fill="#fef3c7" stroke="#f59e0b" />
        <text x="317" y="188" textAnchor="middle" fontSize="11.5" fill="#92400e">distance → proximity transform</text>

        <rect x="444" y="62" width="176" height="136" rx="22" fill="#fff7ed" stroke="#fb923c" strokeWidth="2" />
        <text x="532" y="92" textAnchor="middle" fontSize="13" fontWeight="700" fill="#9a3412">Suitability model</text>
        <text x="532" y="118" textAnchor="middle" fontSize="11.5" fill="#7c2d12">weighted amenity priors</text>
        <text x="532" y="137" textAnchor="middle" fontSize="11.5" fill="#7c2d12">StandardScaler + RandomForest</text>
        <text x="532" y="156" textAnchor="middle" fontSize="11.5" fill="#7c2d12">feature importance output</text>
        <rect x="483" y="170" width="98" height="24" rx="12" fill="#ffedd5" stroke="#fb923c" />
        <text x="532" y="186" textAnchor="middle" fontSize="11.5" fill="#9a3412">score 0–100</text>

        <rect x="652" y="74" width="142" height="112" rx="22" fill="#f0fdf4" stroke="#4ade80" strokeWidth="2" />
        <text x="723" y="103" textAnchor="middle" fontSize="13" fontWeight="700" fill="#166534">Operator surface</text>
        <text x="723" y="125" textAnchor="middle" fontSize="11.5" fill="#166534">Folium map output</text>
        <text x="723" y="144" textAnchor="middle" fontSize="11.5" fill="#166534">dashboard comparison</text>
        <text x="723" y="163" textAnchor="middle" fontSize="11.5" fill="#166534">EVAI query assistant</text>

        <path d="M190 130 L222 130" stroke="#94a3b8" strokeWidth="3" fill="none" />
        <polygon points="222,130 210,122 210,138" fill="#94a3b8" />
        <path d="M412 130 L444 130" stroke="#94a3b8" strokeWidth="3" fill="none" />
        <polygon points="444,130 432,122 432,138" fill="#94a3b8" />
        <path d="M620 130 L652 130" stroke="#94a3b8" strokeWidth="3" fill="none" />
        <polygon points="652,130 640,122 640,138" fill="#94a3b8" />
      </svg>
    </div>
  )
}

function NewSkyFlowDiagram() {
  return (
    <div style={{ overflowX: 'auto' }}>
      <svg viewBox="0 0 820 250" style={{ width: '100%', minWidth: 760, display: 'block', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
        <text x="410" y="22" textAnchor="middle" fontSize="15" fontWeight="700" fill="#0f172a">
          NewSky content and digest pipeline
        </text>
        <text x="410" y="42" textAnchor="middle" fontSize="11.5" fill="#64748b">
          The repo combines broad feed ingestion, structured metadata export, Pegasus summarization, and a mobile-first conversational reading surface.
        </text>

        <rect x="24" y="78" width="158" height="118" rx="22" fill="#eff6ff" stroke="#60a5fa" strokeWidth="2" />
        <text x="103" y="108" textAnchor="middle" fontSize="13" fontWeight="700" fill="#1d4ed8">Source intake</text>
        <text x="103" y="130" textAnchor="middle" fontSize="11.5" fill="#475569">RSS feeds</text>
        <text x="103" y="149" textAnchor="middle" fontSize="11.5" fill="#475569">news pages + scraping</text>
        <text x="103" y="168" textAnchor="middle" fontSize="11.5" fill="#475569">politics, tech, science, world</text>

        <rect x="214" y="64" width="188" height="146" rx="22" fill="#f8fafc" stroke="#94a3b8" strokeWidth="2" />
        <text x="308" y="94" textAnchor="middle" fontSize="13" fontWeight="700" fill="#0f172a">Normalization and export</text>
        <rect x="238" y="109" width="140" height="24" rx="12" fill="#dbeafe" stroke="#60a5fa" />
        <text x="308" y="125" textAnchor="middle" fontSize="11.5" fill="#1d4ed8">title / summary cleanup</text>
        <rect x="238" y="141" width="140" height="24" rx="12" fill="#dcfce7" stroke="#4ade80" />
        <text x="308" y="157" textAnchor="middle" fontSize="11.5" fill="#166534">category CSV + JSON outputs</text>
        <rect x="238" y="173" width="140" height="24" rx="12" fill="#fef3c7" stroke="#f59e0b" />
        <text x="308" y="189" textAnchor="middle" fontSize="11.5" fill="#92400e">sentiment / reading metrics</text>

        <rect x="434" y="64" width="176" height="146" rx="22" fill="#fff7ed" stroke="#fb923c" strokeWidth="2" />
        <text x="522" y="94" textAnchor="middle" fontSize="13" fontWeight="700" fill="#9a3412">Summarization layer</text>
        <text x="522" y="119" textAnchor="middle" fontSize="11.5" fill="#7c2d12">google/pegasus-cnn_dailymail</text>
        <text x="522" y="138" textAnchor="middle" fontSize="11.5" fill="#7c2d12">daily digest generation</text>
        <text x="522" y="157" textAnchor="middle" fontSize="11.5" fill="#7c2d12">conversational rewrite target</text>
        <rect x="475" y="172" width="94" height="24" rx="12" fill="#ffedd5" stroke="#fb923c" />
        <text x="522" y="188" textAnchor="middle" fontSize="11.5" fill="#9a3412">digest-only run</text>

        <rect x="642" y="78" width="154" height="118" rx="22" fill="#f0fdf4" stroke="#4ade80" strokeWidth="2" />
        <text x="719" y="108" textAnchor="middle" fontSize="13" fontWeight="700" fill="#166534">Mobile surface</text>
        <text x="719" y="130" textAnchor="middle" fontSize="11.5" fill="#166534">home / topics / top news</text>
        <text x="719" y="149" textAnchor="middle" fontSize="11.5" fill="#166534">analytics and personalization</text>
        <text x="719" y="168" textAnchor="middle" fontSize="11.5" fill="#166534">offline-friendly reading flow</text>

        <path d="M182 136 L214 136" stroke="#94a3b8" strokeWidth="3" fill="none" />
        <polygon points="214,136 202,128 202,144" fill="#94a3b8" />
        <path d="M402 136 L434 136" stroke="#94a3b8" strokeWidth="3" fill="none" />
        <polygon points="434,136 422,128 422,144" fill="#94a3b8" />
        <path d="M610 136 L642 136" stroke="#94a3b8" strokeWidth="3" fill="none" />
        <polygon points="642,136 630,128 630,144" fill="#94a3b8" />
      </svg>
    </div>
  )
}

function NeMoSynthRustPipelineDiagram() {
  return (
    <div style={{ overflowX: 'auto' }}>
      <svg viewBox="0 0 840 260" style={{ width: '100%', minWidth: 780, display: 'block', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
        <text x="420" y="22" textAnchor="middle" fontSize="15" fontWeight="700" fill="#0f172a">
          NeMoSynthRust dataset pipeline
        </text>
        <text x="420" y="42" textAnchor="middle" fontSize="11.5" fill="#64748b">
          Synthetic Rust code moves through generation, judging, cargo validation, and parquet export instead of stopping at raw model output.
        </text>

        <rect x="18" y="82" width="176" height="126" rx="22" fill="#eff6ff" stroke="#60a5fa" strokeWidth="2" />
        <text x="106" y="112" textAnchor="middle" fontSize="13" fontWeight="700" fill="#1d4ed8">NeMo generation</text>
        <text x="106" y="134" textAnchor="middle" fontSize="11.5" fill="#475569">DataDesigner samplers</text>
        <text x="106" y="153" textAnchor="middle" fontSize="11.5" fill="#475569">domain + complexity mix</text>
        <text x="106" y="172" textAnchor="middle" fontSize="11.5" fill="#475569">Rust prompt + code column</text>
        <text x="106" y="191" textAnchor="middle" fontSize="11.5" fill="#475569">JSONL raw samples</text>

        <rect x="222" y="68" width="182" height="154" rx="22" fill="#fff7ed" stroke="#fb923c" strokeWidth="2" />
        <text x="313" y="98" textAnchor="middle" fontSize="13" fontWeight="700" fill="#9a3412">Bonsai judge / refiner</text>
        <rect x="246" y="113" width="134" height="24" rx="12" fill="#ffedd5" stroke="#fb923c" />
        <text x="313" y="129" textAnchor="middle" fontSize="11.5" fill="#9a3412">safety × 0.4</text>
        <rect x="246" y="145" width="134" height="24" rx="12" fill="#ffedd5" stroke="#fb923c" />
        <text x="313" y="161" textAnchor="middle" fontSize="11.5" fill="#9a3412">performance × 0.3</text>
        <rect x="246" y="177" width="134" height="24" rx="12" fill="#ffedd5" stroke="#fb923c" />
        <text x="313" y="193" textAnchor="middle" fontSize="11.5" fill="#9a3412">idiomatic × 0.3</text>
        <text x="313" y="212" textAnchor="middle" fontSize="11.5" fill="#7c2d12">refine below 6.0, drop below 4.0</text>

        <rect x="432" y="68" width="188" height="154" rx="22" fill="#f0fdf4" stroke="#4ade80" strokeWidth="2" />
        <text x="526" y="98" textAnchor="middle" fontSize="13" fontWeight="700" fill="#166534">Rust harness</text>
        <text x="526" y="122" textAnchor="middle" fontSize="11.5" fill="#166534">Tokio parallel workers</text>
        <text x="526" y="141" textAnchor="middle" fontSize="11.5" fill="#166534">cargo check / test / clippy</text>
        <text x="526" y="160" textAnchor="middle" fontSize="11.5" fill="#166534">optional miri / bench / fuzz</text>
        <text x="526" y="179" textAnchor="middle" fontSize="11.5" fill="#166534">isolated temp Cargo projects</text>
        <text x="526" y="198" textAnchor="middle" fontSize="11.5" fill="#166534">evaluation JSONL</text>

        <rect x="648" y="82" width="174" height="126" rx="22" fill="#f8fafc" stroke="#94a3b8" strokeWidth="2" />
        <text x="735" y="112" textAnchor="middle" fontSize="13" fontWeight="700" fill="#0f172a">Dataset export</text>
        <text x="735" y="134" textAnchor="middle" fontSize="11.5" fill="#475569">train.parquet</text>
        <text x="735" y="153" textAnchor="middle" fontSize="11.5" fill="#475569">HF-ready schema</text>
        <text x="735" y="172" textAnchor="middle" fontSize="11.5" fill="#475569">quality + compile labels</text>
        <text x="735" y="191" textAnchor="middle" fontSize="11.5" fill="#475569">gold-data filtering</text>

        <path d="M194 145 L222 145" stroke="#94a3b8" strokeWidth="3" fill="none" />
        <polygon points="222,145 210,137 210,153" fill="#94a3b8" />
        <path d="M404 145 L432 145" stroke="#94a3b8" strokeWidth="3" fill="none" />
        <polygon points="432,145 420,137 420,153" fill="#94a3b8" />
        <path d="M620 145 L648 145" stroke="#94a3b8" strokeWidth="3" fill="none" />
        <polygon points="648,145 636,137 636,153" fill="#94a3b8" />
      </svg>
    </div>
  )
}

function NeMoJudgeRealityChart() {
  const bars = [
    { label: 'Bonsai avg score', value: 83.3, color: '#3b82f6', display: '8.33 / 10' },
    { label: 'Compile rate', value: 16.7, color: '#f97316', display: '16.7%' },
    { label: 'Test pass rate', value: 6.7, color: '#22c55e', display: '6.7%' },
  ]
  const W = 680, H = 250, ml = 144, mr = 52, mt = 48, rowH = 52, barH = 24
  const chartW = W - ml - mr
  const sx = (v: number) => (v / 100) * chartW
  return (
    <div style={{ overflowX: 'auto' }}>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', maxWidth: W, display: 'block', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
        <text x={W / 2} y={18} textAnchor="middle" fontSize="14" fontWeight="700" fill="#0f172a">
          Judge score versus cargo reality
        </text>
        <text x={W / 2} y={36} textAnchor="middle" fontSize="11.5" fill="#64748b">
          The main finding is the gap: judged code looks strong, but compilation and tests remain much harder.
        </text>
        {[0, 25, 50, 75, 100].map((v) => (
          <g key={v}>
            <line x1={ml + sx(v)} y1={mt} x2={ml + sx(v)} y2={H - 20} stroke="#f1f5f9" strokeWidth="1" />
            <text x={ml + sx(v)} y={H - 6} textAnchor="middle" fontSize="9.5" fill="#94a3b8">{v}</text>
          </g>
        ))}
        {bars.map((bar, i) => {
          const y = mt + i * rowH
          return (
            <g key={bar.label}>
              <text x={ml - 10} y={y + 16} textAnchor="end" fontSize="11.5" fill="#334155" fontWeight="600">{bar.label}</text>
              <rect x={ml} y={y} width={sx(bar.value)} height={barH} fill={bar.color} rx="8" />
              <text x={ml + sx(bar.value) + 8} y={y + 16} fontSize="11.5" fill={bar.color} fontWeight="700">{bar.display}</text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}

function NeMoDomainOutcomeChart() {
  const rows = [
    { domain: 'error-handling', samples: 7, compile: 28.6, test: 14.3 },
    { domain: 'algorithms', samples: 5, compile: 40.0, test: 20.0 },
    { domain: 'async', samples: 7, compile: 0.0, test: 0.0 },
    { domain: 'crates', samples: 6, compile: 0.0, test: 0.0 },
    { domain: 'concurrency', samples: 3, compile: 0.0, test: 0.0 },
    { domain: 'wasm', samples: 1, compile: 0.0, test: 0.0 },
    { domain: 'systems', samples: 1, compile: 100.0, test: 0.0 },
  ]
  const W = 760, H = 360, ml = 170, mr = 54, mt = 54, rowH = 38, barH = 10
  const chartW = W - ml - mr
  const sx = (v: number) => (v / 100) * chartW
  return (
    <div style={{ overflowX: 'auto' }}>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', maxWidth: W, display: 'block', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
        <text x={W / 2} y={18} textAnchor="middle" fontSize="14" fontWeight="700" fill="#0f172a">
          Domain-level compile and test outcomes
        </text>
        <text x={W / 2} y={36} textAnchor="middle" fontSize="11.5" fill="#64748b">
          Simpler domains survive better; dependency-heavy async, crates, and wasm cases are where synthetic code falls apart.
        </text>
        <rect x={ml} y={44} width={10} height={8} fill="#f97316" rx="2" />
        <text x={ml + 14} y={51} fontSize="10" fill="#64748b">Compile rate</text>
        <rect x={ml + 112} y={44} width={10} height={8} fill="#22c55e" rx="2" />
        <text x={ml + 126} y={51} fontSize="10" fill="#64748b">Test rate</text>
        {[0, 25, 50, 75, 100].map((v) => (
          <g key={v}>
            <line x1={ml + sx(v)} y1={mt} x2={ml + sx(v)} y2={H - 18} stroke="#f1f5f9" strokeWidth="1" />
            <text x={ml + sx(v)} y={H - 4} textAnchor="middle" fontSize="9.5" fill="#94a3b8">{v}%</text>
          </g>
        ))}
        {rows.map((row, i) => {
          const y = mt + i * rowH
          return (
            <g key={row.domain}>
              <text x={ml - 10} y={y + 13} textAnchor="end" fontSize="11" fill="#334155" fontWeight="600">
                {row.domain} ({row.samples})
              </text>
              <rect x={ml} y={y} width={sx(row.compile)} height={barH} fill="#f97316" rx="5" />
              <text x={ml + sx(row.compile) + 6} y={y + 9} fontSize="9.5" fill="#f97316">{row.compile.toFixed(1)}%</text>
              <rect x={ml} y={y + 15} width={sx(row.test)} height={barH} fill="#22c55e" rx="5" />
              <text x={ml + sx(row.test) + 6} y={y + 24} fontSize="9.5" fill="#22c55e">{row.test.toFixed(1)}%</text>
            </g>
          )
        })}
      </svg>
    </div>
  )
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

function LegalHyperbolicDiagram() {
  const W = 920
  const H = 340
  const cx = 585
  const cy = 202
  const r = 84
  const courtPoints = [
    { x: cx - 14, y: cy - 10, label: 'Supreme', color: '#2563eb', tx: cx + 18, ty: cy - 2 },
    { x: cx + 26, y: cy - 40, label: 'High', color: '#7c3aed', tx: cx + 46, ty: cy - 34 },
    { x: cx - 80, y: cy + 24, label: 'District', color: '#ec4899', tx: cx - 62, ty: cy + 30 },
  ] as const
  return (
    <div style={{ overflowX: 'auto' }}>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', maxWidth: W, display: 'block', fontFamily: '-apple-system, sans-serif' }}>
        <text x={W / 2} y={18} textAnchor="middle" fontSize="12" fill="#0f172a" fontWeight="700">
          Why hyperbolic geometry fits legal precedent
        </text>
        <text x={W / 2} y={36} textAnchor="middle" fontSize="10" fill="#64748b">
          LegalNexus maps authority to radius and semantic similarity to angle, instead of flattening everything into one Euclidean neighborhood.
        </text>

        <rect x="34" y="74" width="296" height="214" rx="18" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.8" />
        <text x="176" y="92" textAnchor="middle" fontSize="12" fill="#334155" fontWeight="700">Flat Euclidean space</text>
        <text x="176" y="110" textAnchor="middle" fontSize="9.5" fill="#64748b">Authority and semantic context mix together</text>
        <circle cx="110" cy="170" r="13" fill="#2563eb" opacity="0.9" />
        <circle cx="162" cy="148" r="13" fill="#7c3aed" opacity="0.82" />
        <circle cx="198" cy="188" r="13" fill="#ec4899" opacity="0.82" />
        <circle cx="236" cy="156" r="13" fill="#ec4899" opacity="0.62" />
        <circle cx="138" cy="210" r="13" fill="#2563eb" opacity="0.5" />
        <path d="M110 170 C142 160 168 154 198 188" stroke="#94a3b8" strokeWidth="1.8" fill="none" strokeDasharray="5 6" />
        <path d="M162 148 C190 130 216 132 236 156" stroke="#94a3b8" strokeWidth="1.8" fill="none" strokeDasharray="5 6" />
        <text x="182" y="252" textAnchor="middle" fontSize="10" fill="#64748b">Hierarchy becomes noisy and hard to preserve</text>

        <rect x="360" y="74" width="526" height="214" rx="18" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.8" />
        <text x="623" y="92" textAnchor="middle" fontSize="12" fill="#334155" fontWeight="700">Poincaré ball representation</text>
        <text x="623" y="110" textAnchor="middle" fontSize="9.5" fill="#64748b">Small radius = higher authority, angle = semantic neighborhood</text>
        <circle cx={cx} cy={cy} r={r} fill="#eff6ff" stroke="#60a5fa" strokeWidth="2" />
        <circle cx={cx} cy={cy} r="62" fill="none" stroke="#93c5fd" strokeWidth="1.5" strokeDasharray="4 5" />
        <circle cx={cx} cy={cy} r="32" fill="none" stroke="#bfdbfe" strokeWidth="1.5" strokeDasharray="4 5" />
        <line x1={cx} y1={cy} x2={cx + 60} y2={cy - 42} stroke="#94a3b8" strokeWidth="1.2" strokeDasharray="4 4" />
        <line x1={cx} y1={cy} x2={cx} y2={cy - 84} stroke="#94a3b8" strokeWidth="1.2" strokeDasharray="4 4" />

        <rect x="390" y="132" width="118" height="36" rx="12" fill="#ffffff" stroke="#dbeafe" strokeWidth="1.4" />
        <text x="449" y="147" textAnchor="middle" fontSize="9.5" fill="#475569">radius</text>
        <text x="449" y="160" textAnchor="middle" fontSize="9.5" fill="#475569">encodes authority</text>

        <rect x="692" y="118" width="150" height="36" rx="12" fill="#ffffff" stroke="#e9d5ff" strokeWidth="1.4" />
        <text x="767" y="133" textAnchor="middle" fontSize="9.5" fill="#475569">angle preserves</text>
        <text x="767" y="146" textAnchor="middle" fontSize="9.5" fill="#475569">semantic neighborhoods</text>

        {courtPoints.map((point) => (
          <g key={`${point.label}-${point.x}-${point.y}`}>
            <circle cx={point.x} cy={point.y} r="10" fill={point.color} />
            <text x={point.tx} y={point.ty} fontSize="9.5" fill="#334155">{point.label}</text>
          </g>
        ))}

        <circle cx={cx + 70} cy={cy + 38} r="8" fill="#ec4899" opacity="0.8" />
        <circle cx={cx + 16} cy={cy + 72} r="8" fill="#ec4899" opacity="0.55" />

        <rect x="708" y="174" width="146" height="74" rx="14" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
        <text x="781" y="194" textAnchor="middle" fontSize="10" fill="#64748b">validation radii</text>
        <text x="781" y="212" textAnchor="middle" fontSize="9.5" fill="#2563eb">Supreme 0.540</text>
        <text x="781" y="228" textAnchor="middle" fontSize="9.5" fill="#7c3aed">High 0.575</text>
        <text x="781" y="244" textAnchor="middle" fontSize="9.5" fill="#ec4899">District 0.619</text>
      </svg>
    </div>
  )
}

function LegalAgentDebateDiagram() {
  const W = 900
  const H = 360
  return (
    <div style={{ overflowX: 'auto' }}>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', maxWidth: W, display: 'block', fontFamily: '-apple-system, sans-serif' }}>
        <defs>
          <marker id="legal-arrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
            <path d="M0,0 L0,7 L7,3.5 z" fill="#94a3b8" />
          </marker>
        </defs>
        <text x={W / 2} y={18} textAnchor="middle" fontSize="12" fill="#0f172a" fontWeight="700">
          Multi-agent debate loop for graph construction
        </text>
        <text x={W / 2} y={36} textAnchor="middle" fontSize="10" fill="#64748b">
          Linker proposes edges, Interpreter labels them, Conflict removes cycles and contradictions until the graph stabilizes.
        </text>

        <rect x="58" y="92" width="190" height="96" rx="18" fill="#dbeafe" stroke="#3b82f6" strokeWidth="2" />
        <text x="153" y="119" textAnchor="middle" fontSize="12" fill="#1e3a8a" fontWeight="700">Linker Agent</text>
        <text x="153" y="140" textAnchor="middle" fontSize="9.5" fill="#1e40af">7 regex patterns + LLM reasoning</text>
        <text x="153" y="157" textAnchor="middle" fontSize="9.5" fill="#1e40af">proposes citation candidates</text>

        <rect x="355" y="74" width="190" height="112" rx="18" fill="#ede9fe" stroke="#8b5cf6" strokeWidth="2" />
        <text x="450" y="101" textAnchor="middle" fontSize="12" fill="#5b21b6" fontWeight="700">Interpreter Agent</text>
        <text x="450" y="122" textAnchor="middle" fontSize="9.5" fill="#6d28d9">classifies edge semantics</text>
        <text x="450" y="139" textAnchor="middle" fontSize="9.5" fill="#6d28d9">FOLLOW · DISTINGUISH</text>
        <text x="450" y="156" textAnchor="middle" fontSize="9.5" fill="#6d28d9">OVERRULE</text>

        <rect x="652" y="92" width="190" height="96" rx="18" fill="#fee2e2" stroke="#ef4444" strokeWidth="2" />
        <text x="747" y="119" textAnchor="middle" fontSize="12" fill="#991b1b" fontWeight="700">Conflict Agent</text>
        <text x="747" y="140" textAnchor="middle" fontSize="9.5" fill="#b91c1c">detects cycles, contradictions,</text>
        <text x="747" y="157" textAnchor="middle" fontSize="9.5" fill="#b91c1c">authority inversions</text>

        <circle cx="450" cy="224" r="38" fill="#f8fafc" stroke="#94a3b8" strokeWidth="2" />
        <text x="450" y="217" textAnchor="middle" fontSize="11" fill="#334155" fontWeight="700">Shared</text>
        <text x="450" y="233" textAnchor="middle" fontSize="11" fill="#334155" fontWeight="700">Graph State</text>

        <rect x="280" y="286" width="340" height="56" rx="16" fill="#dcfce7" stroke="#22c55e" strokeWidth="2" />
        <text x="450" y="308" textAnchor="middle" fontSize="12" fill="#166534" fontWeight="700">Stable precedent graph</text>
        <text x="450" y="326" textAnchor="middle" fontSize="10" fill="#15803d">Conflict-resolved knowledge graph used for retrieval</text>

        <line x1="248" y1="144" x2="410" y2="213" stroke="#94a3b8" strokeWidth="2" markerEnd="url(#legal-arrow)" />
        <line x1="450" y1="186" x2="450" y2="175" stroke="#94a3b8" strokeWidth="2" markerEnd="url(#legal-arrow)" />
        <line x1="652" y1="144" x2="490" y2="213" stroke="#94a3b8" strokeWidth="2" markerEnd="url(#legal-arrow)" />
        <line x1="450" y1="262" x2="450" y2="285" stroke="#22c55e" strokeWidth="2" markerEnd="url(#legal-arrow)" />

        <path d="M410 250 C348 266 272 266 205 197" stroke="#cbd5e1" strokeWidth="1.8" fill="none" strokeDasharray="5 5" markerEnd="url(#legal-arrow)" />
        <path d="M490 250 C552 266 628 266 695 197" stroke="#cbd5e1" strokeWidth="1.8" fill="none" strokeDasharray="5 5" markerEnd="url(#legal-arrow)" />
        <text x="228" y="266" fontSize="9.5" fill="#64748b">payoff feedback</text>
        <text x="640" y="266" fontSize="9.5" fill="#64748b">best-response update</text>

        <text x="450" y="356" textAnchor="middle" fontSize="10" fill="#64748b">
          Repo docs describe the loop as a Nash-style equilibrium process over graph quality, precision, and conflict penalties.
        </text>
      </svg>
    </div>
  )
}

function LegalRetrievalDiagram() {
  const W = 980
  const H = 360
  const signalCards = [
    { x: 250, y: 88, w: 154, h: 44, label: 'Semantic', sub: 'embedding similarity', fill: '#dbeafe', stroke: '#3b82f6' },
    { x: 250, y: 150, w: 154, h: 44, label: 'Structural', sub: 'graph traversal', fill: '#ede9fe', stroke: '#8b5cf6' },
    { x: 335, y: 212, w: 154, h: 44, label: 'Citation', sub: 'authority weighting', fill: '#fee2e2', stroke: '#ef4444' },
    { x: 430, y: 88, w: 154, h: 44, label: 'Hyperbolic', sub: 'Poincaré distance', fill: '#fef3c7', stroke: '#f59e0b' },
    { x: 430, y: 150, w: 154, h: 44, label: 'GNN', sub: 'message-passing refinement', fill: '#dcfce7', stroke: '#22c55e' },
  ] as const
  return (
    <div style={{ overflowX: 'auto' }}>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', maxWidth: W, display: 'block', fontFamily: '-apple-system, sans-serif' }}>
        <defs>
          <marker id="retr-arrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
            <path d="M0,0 L0,7 L7,3.5 z" fill="#94a3b8" />
          </marker>
        </defs>
        <text x={W / 2} y={18} textAnchor="middle" fontSize="12" fill="#0f172a" fontWeight="700">
          Retrieval, argumentation, and validation stack
        </text>
        <text x={W / 2} y={36} textAnchor="middle" fontSize="10" fill="#64748b">
          LegalNexus combines multiple search signals, then layers temporal scoring and Toulmin extraction on top of the ranked cases.
        </text>

        <rect x="42" y="138" width="160" height="84" rx="18" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="2" />
        <text x="122" y="168" textAnchor="middle" fontSize="12" fill="#0f172a" fontWeight="700">Legal query</text>
        <text x="122" y="188" textAnchor="middle" fontSize="10" fill="#64748b">facts, issue,</text>
        <text x="122" y="204" textAnchor="middle" fontSize="10" fill="#64748b">precedent need</text>

        {signalCards.map((card) => (
          <g key={card.label}>
            <rect x={card.x} y={card.y} width={card.w} height={card.h} rx="14" fill={card.fill} stroke={card.stroke} strokeWidth="1.8" />
            <text x={card.x + card.w / 2} y={card.y + 18} textAnchor="middle" fontSize="10.5" fill="#0f172a" fontWeight="700">{card.label}</text>
            <text x={card.x + card.w / 2} y={card.y + 33} textAnchor="middle" fontSize="9" fill="#475569">{card.sub}</text>
          </g>
        ))}

        <rect x="642" y="126" width="176" height="108" rx="20" fill="#eff6ff" stroke="#60a5fa" strokeWidth="2" />
        <text x="730" y="156" textAnchor="middle" fontSize="12" fill="#1d4ed8" fontWeight="700">Hybrid ranker</text>
        <text x="730" y="176" textAnchor="middle" fontSize="10" fill="#2563eb">fuses 5 signals into</text>
        <text x="730" y="192" textAnchor="middle" fontSize="10" fill="#2563eb">top-k candidate precedents</text>

        <rect x="846" y="92" width="110" height="70" rx="16" fill="#f3e8ff" stroke="#a855f7" strokeWidth="2" />
        <text x="901" y="119" textAnchor="middle" fontSize="11" fill="#7e22ce" fontWeight="700">Toulmin layer</text>
        <text x="901" y="138" textAnchor="middle" fontSize="9.2" fill="#7e22ce">claim · ground · warrant</text>

        <rect x="846" y="176" width="110" height="70" rx="16" fill="#ecfccb" stroke="#84cc16" strokeWidth="2" />
        <text x="901" y="203" textAnchor="middle" fontSize="11" fill="#3f6212" fontWeight="700">Temporal scorer</text>
        <text x="901" y="222" textAnchor="middle" fontSize="9.2" fill="#4d7c0f">decay + resurrection boost</text>

        <rect x="846" y="260" width="110" height="56" rx="16" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="2" />
        <text x="901" y="282" textAnchor="middle" fontSize="11" fill="#334155" fontWeight="700">Validated output</text>
        <text x="901" y="300" textAnchor="middle" fontSize="9.2" fill="#64748b">interpretable precedents</text>

        <line x1="202" y1="180" x2="248" y2="180" stroke="#94a3b8" strokeWidth="2" markerEnd="url(#retr-arrow)" />
        <line x1="404" y1="110" x2="642" y2="158" stroke="#94a3b8" strokeWidth="1.8" markerEnd="url(#retr-arrow)" />
        <line x1="404" y1="172" x2="642" y2="180" stroke="#94a3b8" strokeWidth="1.8" markerEnd="url(#retr-arrow)" />
        <line x1="489" y1="234" x2="642" y2="202" stroke="#94a3b8" strokeWidth="1.8" markerEnd="url(#retr-arrow)" />
        <line x1="584" y1="110" x2="642" y2="170" stroke="#94a3b8" strokeWidth="1.8" markerEnd="url(#retr-arrow)" />
        <line x1="584" y1="172" x2="642" y2="188" stroke="#94a3b8" strokeWidth="1.8" markerEnd="url(#retr-arrow)" />
        <line x1="818" y1="160" x2="846" y2="127" stroke="#94a3b8" strokeWidth="1.8" markerEnd="url(#retr-arrow)" />
        <line x1="818" y1="188" x2="846" y2="211" stroke="#94a3b8" strokeWidth="1.8" markerEnd="url(#retr-arrow)" />
        <line x1="901" y1="246" x2="901" y2="260" stroke="#94a3b8" strokeWidth="1.8" markerEnd="url(#retr-arrow)" />

        <text x="296" y="330" textAnchor="middle" fontSize="10" fill="#64748b">49,634 cases · 768-dim embeddings · 3 court levels · 4 legal topics</text>
        <text x="738" y="330" textAnchor="middle" fontSize="10" fill="#64748b">P@5 0.896 · NDCG@10 0.893 · conflict resolution 98.3% · Gromov δ 0.029</text>
      </svg>
    </div>
  )
}

function BipsSplitDiagram() {
  const W = 920
  const H = 372
  return (
    <div style={{ overflowX: 'auto' }}>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', maxWidth: W, display: 'block', fontFamily: '-apple-system, sans-serif' }}>
        <defs>
          <marker id="bips-arrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
            <path d="M0,0 L0,7 L7,3.5 z" fill="#94a3b8" />
          </marker>
        </defs>
        <text x={W / 2} y={18} textAnchor="middle" fontSize="12" fill="#0f172a" fontWeight="700">
          Backbone-integrated partial split
        </text>
        <text x={W / 2} y={36} textAnchor="middle" fontSize="10" fill="#64748b">
          Keep the shared early backbone, split at a learned layer, distill the heavy teacher tail into a compact student head, then deploy only the cheap branch.
        </text>

        <rect x="24" y="70" width="872" height="126" rx="18" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5" />
        <rect x="24" y="214" width="872" height="126" rx="18" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5" />
        <text x="48" y="95" fontSize="11" fill="#475569" fontWeight="700">Training</text>
        <text x="48" y="239" fontSize="11" fill="#475569" fontWeight="700">Inference</text>

        <rect x="72" y="106" width="92" height="56" rx="14" fill="#e0f2fe" stroke="#38bdf8" strokeWidth="1.8" />
        <text x="118" y="129" textAnchor="middle" fontSize="11" fill="#0f172a" fontWeight="700">Input image</text>
        <text x="118" y="146" textAnchor="middle" fontSize="9.5" fill="#475569">any segmentation task</text>

        <rect x="204" y="96" width="186" height="76" rx="16" fill="#ede9fe" stroke="#8b5cf6" strokeWidth="1.8" />
        <text x="297" y="123" textAnchor="middle" fontSize="12" fill="#312e81" fontWeight="700">Shared backbone stem</text>
        <text x="297" y="142" textAnchor="middle" fontSize="9.5" fill="#5b21b6">early + mid blocks kept intact</text>
        <text x="297" y="157" textAnchor="middle" fontSize="9.5" fill="#5b21b6">works across model families</text>

        <rect x="430" y="106" width="86" height="56" rx="14" fill="#fef3c7" stroke="#f59e0b" strokeWidth="1.8" />
        <text x="473" y="129" textAnchor="middle" fontSize="11" fill="#7c2d12" fontWeight="700">Learned split</text>
        <text x="473" y="146" textAnchor="middle" fontSize="9.5" fill="#92400e">choose the cut layer</text>

        <rect x="564" y="84" width="148" height="56" rx="14" fill="#dbeafe" stroke="#3b82f6" strokeWidth="1.8" />
        <text x="638" y="107" textAnchor="middle" fontSize="11.5" fill="#1d4ed8" fontWeight="700">Teacher tail</text>
        <text x="638" y="124" textAnchor="middle" fontSize="9.5" fill="#1e40af">full-capacity late backbone</text>

        <rect x="564" y="146" width="148" height="56" rx="14" fill="#dcfce7" stroke="#22c55e" strokeWidth="1.8" />
        <text x="638" y="169" textAnchor="middle" fontSize="11.5" fill="#166534" fontWeight="700">Student head</text>
        <text x="638" y="186" textAnchor="middle" fontSize="9.5" fill="#15803d">compact distilled replacement</text>

        <rect x="756" y="106" width="110" height="56" rx="14" fill="#fce7f3" stroke="#ec4899" strokeWidth="1.8" />
        <text x="811" y="129" textAnchor="middle" fontSize="11.5" fill="#9d174d" fontWeight="700">PKD objective</text>
        <text x="811" y="146" textAnchor="middle" fontSize="9.5" fill="#9d174d">tighten mimicry in stages</text>

        <line x1="164" y1="134" x2="202" y2="134" stroke="#94a3b8" strokeWidth="2" markerEnd="url(#bips-arrow)" />
        <line x1="390" y1="134" x2="428" y2="134" stroke="#94a3b8" strokeWidth="2" markerEnd="url(#bips-arrow)" />
        <line x1="516" y1="134" x2="562" y2="112" stroke="#94a3b8" strokeWidth="2" markerEnd="url(#bips-arrow)" />
        <line x1="516" y1="134" x2="562" y2="174" stroke="#94a3b8" strokeWidth="2" markerEnd="url(#bips-arrow)" />
        <line x1="712" y1="112" x2="756" y2="128" stroke="#3b82f6" strokeWidth="1.8" strokeDasharray="5 5" markerEnd="url(#bips-arrow)" />
        <line x1="712" y1="174" x2="756" y2="140" stroke="#22c55e" strokeWidth="1.8" markerEnd="url(#bips-arrow)" />
        <path d="M638 140 L638 146" stroke="#0f766e" strokeWidth="1.6" strokeDasharray="4 4" markerEnd="url(#bips-arrow)" />
        <text x="728" y="92" fontSize="9.5" fill="#475569">teacher features supervise student</text>

        <rect x="72" y="250" width="92" height="56" rx="14" fill="#e0f2fe" stroke="#38bdf8" strokeWidth="1.8" />
        <text x="118" y="273" textAnchor="middle" fontSize="11" fill="#0f172a" fontWeight="700">Input image</text>
        <text x="118" y="290" textAnchor="middle" fontSize="9.5" fill="#475569">same front-end path</text>

        <rect x="204" y="240" width="186" height="76" rx="16" fill="#ede9fe" stroke="#8b5cf6" strokeWidth="1.8" />
        <text x="297" y="267" textAnchor="middle" fontSize="12" fill="#312e81" fontWeight="700">Shared backbone stem</text>
        <text x="297" y="286" textAnchor="middle" fontSize="9.5" fill="#5b21b6">reuse early representation</text>
        <text x="297" y="301" textAnchor="middle" fontSize="9.5" fill="#5b21b6">no backbone surgery required</text>

        <rect x="430" y="250" width="86" height="56" rx="14" fill="#fef3c7" stroke="#f59e0b" strokeWidth="1.8" />
        <text x="473" y="273" textAnchor="middle" fontSize="11" fill="#7c2d12" fontWeight="700">Same split</text>
        <text x="473" y="290" textAnchor="middle" fontSize="9.5" fill="#92400e">cached cut point</text>

        <rect x="564" y="250" width="148" height="56" rx="14" fill="#dcfce7" stroke="#22c55e" strokeWidth="1.8" />
        <text x="638" y="273" textAnchor="middle" fontSize="11.5" fill="#166534" fontWeight="700">Student head only</text>
        <text x="638" y="290" textAnchor="middle" fontSize="9.5" fill="#15803d">teacher tail removed at runtime</text>

        <rect x="756" y="250" width="110" height="56" rx="14" fill="#f8fafc" stroke="#94a3b8" strokeWidth="1.8" />
        <text x="811" y="273" textAnchor="middle" fontSize="11.5" fill="#334155" fontWeight="700">Segmentation</text>
        <text x="811" y="290" textAnchor="middle" fontSize="9.5" fill="#64748b">fast edge output</text>

        <line x1="164" y1="278" x2="202" y2="278" stroke="#94a3b8" strokeWidth="2" markerEnd="url(#bips-arrow)" />
        <line x1="390" y1="278" x2="428" y2="278" stroke="#94a3b8" strokeWidth="2" markerEnd="url(#bips-arrow)" />
        <line x1="516" y1="278" x2="562" y2="278" stroke="#94a3b8" strokeWidth="2" markerEnd="url(#bips-arrow)" />
        <line x1="712" y1="278" x2="754" y2="278" stroke="#94a3b8" strokeWidth="2" markerEnd="url(#bips-arrow)" />

        <text x="460" y="354" textAnchor="middle" fontSize="10" fill="#64748b">
          Conceptually: keep the universal early representation, replace the expensive late computation, and preserve accuracy through progressive distillation before deployment.
        </text>
      </svg>
    </div>
  )
}

function NSGSRuntimeDiagram() {
  const W = 1120
  const H = 374
  return (
    <div style={{ overflowX: 'auto' }}>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', maxWidth: W, display: 'block', fontFamily: '-apple-system, sans-serif' }}>
        <defs>
          <marker id="nsgs-arrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
            <path d="M0,0 L0,7 L7,3.5 z" fill="#94a3b8" />
          </marker>
        </defs>
        <text x={W / 2} y={18} textAnchor="middle" fontSize="12" fill="#0f172a" fontWeight="700">
          NSGS event-driven runtime
        </text>
        <text x={W / 2} y={36} textAnchor="middle" fontSize="10" fill="#64748b">
          Patches fire only when activations exceed adaptive thresholds, then a lock-free SpikeQueue dispatches work across CPU threads with thermal-aware pacing.
        </text>

        <rect x="28" y="78" width="188" height="196" rx="18" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.6" />
        <text x="122" y="102" textAnchor="middle" fontSize="12" fill="#334155" fontWeight="700">Patch field</text>
        <text x="122" y="119" textAnchor="middle" fontSize="9.5" fill="#64748b">dense image becomes local work units</text>
        {[
          [44, 138, '#f8fafc'], [88, 138, '#dbeafe'], [132, 138, '#f8fafc'],
          [44, 182, '#fde68a'], [88, 182, '#f8fafc'], [132, 182, '#dbeafe'],
          [44, 226, '#f8fafc'], [88, 226, '#dcfce7'], [132, 226, '#f8fafc'],
        ].map(([x, y, fill], idx) => (
          <rect key={idx} x={x as number} y={y as number} width="34" height="34" rx="6" fill={fill as string} stroke="#94a3b8" strokeWidth="1" />
        ))}
        <text x="122" y="294" textAnchor="middle" fontSize="9.5" fill="#475569">Only high-change patches wake up</text>

        <rect x="260" y="112" width="190" height="136" rx="18" fill="#fff7ed" stroke="#fb923c" strokeWidth="1.8" />
        <text x="355" y="137" textAnchor="middle" fontSize="12" fill="#9a3412" fontWeight="700">Adaptive threshold gate</text>
        <text x="355" y="157" textAnchor="middle" fontSize="9.5" fill="#7c2d12">activation &gt; local threshold</text>
        <rect x="299" y="180" width="112" height="26" rx="13" fill="#fb923c" opacity="0.15" stroke="#fb923c" strokeWidth="1.4" />
        <text x="355" y="197" textAnchor="middle" fontSize="10" fill="#9a3412">emit spike event</text>
        <text x="355" y="228" textAnchor="middle" fontSize="9.5" fill="#7c2d12">skip quiet regions entirely</text>

        <rect x="500" y="78" width="320" height="196" rx="18" fill="#eff6ff" stroke="#60a5fa" strokeWidth="1.8" />
        <text x="660" y="102" textAnchor="middle" fontSize="12" fill="#1d4ed8" fontWeight="700">Lock-free SpikeQueue runtime</text>
        <text x="660" y="119" textAnchor="middle" fontSize="9.5" fill="#2563eb">asynchronous dispatch with minimal synchronization</text>
        {['spike 1', 'spike 2', 'spike 3', 'spike 4'].map((label, idx) => (
          <rect key={label} x={548 + idx * 54} y="146" width="42" height="18" rx="6" fill="#bfdbfe" stroke="#3b82f6" strokeWidth="1.2" />
        ))}
        {['Core 0', 'Core 1', 'Core 2', 'Core 3'].map((label, idx) => (
          <g key={label}>
            <rect x={538 + (idx % 2) * 92} y={188 + Math.floor(idx / 2) * 42} width="76" height="28" rx="10" fill="#ffffff" stroke="#93c5fd" strokeWidth="1.2" />
            <text x={576 + (idx % 2) * 92} y={206 + Math.floor(idx / 2) * 42} textAnchor="middle" fontSize="9.5" fill="#1e40af">{label}</text>
          </g>
        ))}
        <rect x="714" y="184" width="84" height="88" rx="14" fill="#dbeafe" stroke="#3b82f6" strokeWidth="1.2" />
        <text x="756" y="208" textAnchor="middle" fontSize="9.5" fill="#1d4ed8" fontWeight="700">Queue</text>
        <text x="756" y="223" textAnchor="middle" fontSize="9.5" fill="#1d4ed8" fontWeight="700">depth</text>
        <text x="756" y="244" textAnchor="middle" fontSize="8.5" fill="#475569">bursty work</text>
        <text x="756" y="257" textAnchor="middle" fontSize="8.5" fill="#475569">backlog monitor</text>

        <rect x="860" y="88" width="232" height="176" rx="18" fill="#f0fdf4" stroke="#22c55e" strokeWidth="1.8" />
        <text x="976" y="112" textAnchor="middle" fontSize="12" fill="#166534" fontWeight="700">Edge device execution</text>
        <text x="976" y="129" textAnchor="middle" fontSize="9.5" fill="#15803d">4-thread CPU, offline Android deployment</text>
        <rect x="890" y="154" width="106" height="84" rx="14" fill="#ffffff" stroke="#86efac" strokeWidth="1.2" />
        <text x="943" y="178" textAnchor="middle" fontSize="9.6" fill="#166534" fontWeight="700">
          <tspan x="943" dy="0">Thermal</tspan>
          <tspan x="943" dy="13">scheduler</tspan>
        </text>
        <text x="943" y="205" textAnchor="middle" fontSize="8.8" fill="#15803d">
          <tspan x="943" dy="0">backs off when hot</tspan>
          <tspan x="943" dy="12">keeps throughput stable</tspan>
        </text>
        <rect x="1012" y="154" width="62" height="84" rx="14" fill="#ffffff" stroke="#86efac" strokeWidth="1.2" />
        <text x="1043" y="178" textAnchor="middle" fontSize="9.6" fill="#166534" fontWeight="700">
          <tspan x="1043" dy="0">Output</tspan>
          <tspan x="1043" dy="13">mask</tspan>
        </text>
        <path d="M1026 205 L1040 191 L1050 199 L1061 184" stroke="#7c3aed" strokeWidth="2" fill="none" />
        <path d="M1025 220 L1038 230 L1052 218 L1064 224" stroke="#22c55e" strokeWidth="2" fill="none" />
        <text x="1043" y="254" textAnchor="middle" fontSize="9" fill="#475569">result</text>

        <line x1="216" y1="176" x2="258" y2="176" stroke="#94a3b8" strokeWidth="2" markerEnd="url(#nsgs-arrow)" />
        <line x1="450" y1="176" x2="498" y2="176" stroke="#94a3b8" strokeWidth="2" markerEnd="url(#nsgs-arrow)" />
        <line x1="820" y1="176" x2="858" y2="176" stroke="#94a3b8" strokeWidth="2" markerEnd="url(#nsgs-arrow)" />

        <text x={W / 2} y="324" textAnchor="middle" fontSize="9.5" fill="#64748b">
          <tspan x={W / 2} dy="0">Reported effect: 38-62% fewer redundant operations than dense frame-by-frame execution.</tspan>
          <tspan x={W / 2} dy="14">NSGS pairs deployable ONNX inference with a C++ lock-free queue and thermal-aware pacing.</tspan>
        </text>
      </svg>
    </div>
  )
}

function BipsResultsDiagram() {
  const W = 920
  const H = 336
  const bars = [
    { label: 'EfficientSAM-S', value: 60.8, color: '#2563eb' },
    { label: 'EfficientSAM-T', value: 50.3, color: '#3b82f6' },
    { label: 'SegFormer-B5', value: 15.3, color: '#60a5fa' },
  ] as const
  const maxValue = 65
  return (
    <div style={{ overflowX: 'auto' }}>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', maxWidth: W, display: 'block', fontFamily: '-apple-system, sans-serif' }}>
        <text x={W / 2} y={18} textAnchor="middle" fontSize="12" fill="#0f172a" fontWeight="700">
          Benchmark summary
        </text>
        <text x={W / 2} y={36} textAnchor="middle" fontSize="10" fill="#64748b">
          The project positions BIPS-PKD as a systems result: large latency cuts, broad backbone coverage, and edge deployment constraints handled together.
        </text>

        <rect x="18" y="56" width="286" height="236" rx="18" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1.8" />
        <text x="38" y="82" fontSize="12" fill="#0f172a" fontWeight="700">Speedup over baseline CPU inference</text>
        <text x="38" y="99" fontSize="9.5" fill="#64748b">Reported headline wins on representative backbones</text>
        {bars.map((bar, idx) => {
          const y = 130 + idx * 54
          const width = (bar.value / maxValue) * 198
          return (
            <g key={bar.label}>
              <text x="38" y={y - 8} fontSize="10" fill="#475569">{bar.label}</text>
              <rect x="38" y={y} width="210" height="20" rx="10" fill="#eff6ff" />
              <rect x="38" y={y} width={width} height="20" rx="10" fill={bar.color} />
              <text x={38 + width + 8} y={y + 14} fontSize="11" fill={bar.color} fontWeight="700">{bar.value}x</text>
            </g>
          )
        })}
        <text x="38" y="276" fontSize="10" fill="#64748b">EfficientSAM-S: 3612 ms to 59 ms on 4-thread CPU</text>

        <rect x="320" y="56" width="286" height="236" rx="18" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1.8" />
        <text x="340" y="82" fontSize="12" fill="#0f172a" fontWeight="700">Coverage across 9 model families</text>
        <text x="340" y="99" fontSize="9.5" fill="#64748b">Model-family-agnostic split instead of one-off surgery</text>
        {[
          ['EfficientSAM', 0, 0], ['SegFormer', 1, 0], ['Mask2Former', 2, 0],
          ['SAM2', 0, 1], ['PIDNet', 1, 1], ['YOLOv8', 2, 1],
          ['YOLOv12', 0, 2], ['DINOv3', 1, 2], ['MobileSAM', 2, 2],
        ].map(([label, col, row]) => (
          <g key={label}>
            <rect x={342 + Number(col) * 82} y={122 + Number(row) * 44} width="70" height="28" rx="12" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.2" />
            <text x={377 + Number(col) * 82} y={140 + Number(row) * 44} textAnchor="middle" fontSize="9.5" fill="#334155">{label}</text>
          </g>
        ))}
        <rect x="342" y="256" width="242" height="20" rx="10" fill="#ede9fe" />
        <text x="463" y="270" textAnchor="middle" fontSize="10" fill="#5b21b6" fontWeight="700">single split-and-distill recipe, many backbones</text>

        <rect x="622" y="56" width="280" height="236" rx="18" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1.8" />
        <text x="642" y="82" fontSize="12" fill="#0f172a" fontWeight="700">Edge deployment headline metrics</text>
        <text x="642" y="99" fontSize="9.5" fill="#64748b">Quality, energy, and packaging all matter on-device</text>

        <rect x="642" y="122" width="110" height="64" rx="14" fill="#eff6ff" stroke="#60a5fa" strokeWidth="1.6" />
        <text x="697" y="145" textAnchor="middle" fontSize="11" fill="#1d4ed8" fontWeight="700">65.8%</text>
        <text x="697" y="163" textAnchor="middle" fontSize="9.5" fill="#2563eb">average mIoU</text>

        <rect x="770" y="122" width="110" height="64" rx="14" fill="#f0fdf4" stroke="#22c55e" strokeWidth="1.6" />
        <text x="825" y="145" textAnchor="middle" fontSize="11" fill="#166534" fontWeight="700">4.4x</text>
        <text x="825" y="163" textAnchor="middle" fontSize="9.5" fill="#15803d">less energy</text>

        <rect x="642" y="202" width="110" height="64" rx="14" fill="#fff7ed" stroke="#fb923c" strokeWidth="1.6" />
        <text x="697" y="225" textAnchor="middle" fontSize="11" fill="#9a3412" fontWeight="700">~16 FPS</text>
        <text x="697" y="243" textAnchor="middle" fontSize="9.5" fill="#c2410c">EfficientSAM-S</text>

        <rect x="770" y="202" width="110" height="64" rx="14" fill="#fdf2f8" stroke="#ec4899" strokeWidth="1.6" />
        <text x="825" y="225" textAnchor="middle" fontSize="11" fill="#9d174d" fontWeight="700">~500 MB</text>
        <text x="825" y="243" textAnchor="middle" fontSize="9.5" fill="#be185d">offline Android app</text>
      </svg>
    </div>
  )
}

function RepeatabilityPipelineDiagram() {
  const W = 980
  const H = 326
  const metricCards = [
    { label: 'Discriminability', x: 484, y: 136, fill: '#dbeafe', stroke: '#1d4ed8' },
    { label: 'Fingerprint index', x: 618, y: 136, fill: '#dbeafe', stroke: '#1d4ed8' },
    { label: 'ICC / I2C2', x: 484, y: 178, fill: '#eef2ff', stroke: '#4338ca' },
    { label: 'Rank sum / CCDM', x: 618, y: 178, fill: '#eef2ff', stroke: '#4338ca' },
    { label: 'Variance components', x: 484, y: 220, fill: '#dcfce7', stroke: '#166534' },
    { label: 'X-bar + power', x: 618, y: 220, fill: '#dcfce7', stroke: '#166534' },
  ]

  return (
    <div style={{ overflowX: 'auto' }}>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', maxWidth: W, display: 'block', fontFamily: '-apple-system, sans-serif' }}>
        <defs>
          <marker id="repeatability-pipeline-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
            <path d="M0,0 L0,7 L7,3.5 z" fill="#94a3b8" />
          </marker>
        </defs>
        <text x={W / 2} y="18" textAnchor="middle" fontSize="12" fill="#0f172a" fontWeight="700">
          Repeatability analysis workflow
        </text>
        <text x={W / 2} y="36" textAnchor="middle" fontSize="10" fill="#64748b">
          Engineering measurements move from repeated observations to metric families, variance decomposition, and decision-ready diagnostics.
        </text>

        <rect x="28" y="82" width="176" height="178" rx="20" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.8" />
        <text x="116" y="108" textAnchor="middle" fontSize="12" fill="#334155" fontWeight="700">Repeated measurements</text>
        <text x="116" y="126" textAnchor="middle" fontSize="9.5" fill="#64748b">frequency / specimen rows</text>
        {[0, 1, 2, 3].map((row) => (
          <g key={row}>
            <rect x="56" y={146 + row * 32} width="122" height="16" rx="7" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
            <rect x="56" y={146 + row * 32} width={48 + row * 18} height="16" rx="7" fill={row % 2 === 0 ? '#bfdbfe' : '#c7f9cc'} />
          </g>
        ))}
        <text x="116" y="242" textAnchor="middle" fontSize="9.5" fill="#475569">small-magnitude, noisy repetitions</text>

        <rect x="246" y="96" width="168" height="150" rx="20" fill="#fff7ed" stroke="#fb923c" strokeWidth="1.8" />
        <text x="330" y="124" textAnchor="middle" fontSize="12" fill="#9a3412" fontWeight="700">Preprocessing</text>
        <text x="330" y="146" textAnchor="middle" fontSize="9.5" fill="#7c2d12">organize parts and repetitions</text>
        <text x="330" y="166" textAnchor="middle" fontSize="9.5" fill="#7c2d12">stabilize tiny variance regimes</text>
        <rect x="284" y="182" width="92" height="26" rx="13" fill="#fed7aa" stroke="#fb923c" strokeWidth="1.2" />
        <text x="330" y="199" textAnchor="middle" fontSize="9.4" fill="#9a3412">EMS / ANOVA-ready</text>
        <text x="330" y="224" textAnchor="middle" fontSize="9.5" fill="#7c2d12">supports non-Gaussian cases</text>

        <rect x="456" y="60" width="300" height="222" rx="22" fill="#eff6ff" stroke="#60a5fa" strokeWidth="1.8" />
        <text x="606" y="88" textAnchor="middle" fontSize="12" fill="#1d4ed8" fontWeight="700">Metric engine</text>
        <text x="606" y="106" textAnchor="middle" fontSize="9.5" fill="#2563eb">multiple statistical lenses instead of one score</text>
        {metricCards.map((card) => (
          <g key={card.label}>
            <rect x={card.x} y={card.y} width="110" height="30" rx="13" fill={card.fill} stroke={card.stroke} strokeWidth="1.2" />
            <text x={card.x + 55} y={card.y + 19} textAnchor="middle" fontSize="9.1" fill={card.stroke}>
              {card.label}
            </text>
          </g>
        ))}
        <text x="606" y="262" textAnchor="middle" fontSize="9.4" fill="#475569">cross-check metrics before trusting repeatability</text>

        <rect x="798" y="88" width="154" height="166" rx="20" fill="#f0fdf4" stroke="#22c55e" strokeWidth="1.8" />
        <text x="875" y="116" textAnchor="middle" fontSize="12" fill="#166534" fontWeight="700">Decision layer</text>
        <text x="875" y="136" textAnchor="middle" fontSize="9.5" fill="#15803d">is the system trustworthy?</text>
        <rect x="822" y="150" width="106" height="38" rx="14" fill="#ffffff" stroke="#93c5fd" strokeWidth="1.2" />
        <text x="875" y="167" textAnchor="middle" fontSize="9.7" fill="#1d4ed8" fontWeight="700">ICC &gt; 0.75</text>
        <text x="875" y="181" textAnchor="middle" fontSize="8.5" fill="#475569">good repeatability</text>
        <rect x="822" y="196" width="106" height="38" rx="14" fill="#ffffff" stroke="#86efac" strokeWidth="1.2" />
        <text x="875" y="213" textAnchor="middle" fontSize="9.7" fill="#166534" fontWeight="700">GRR &lt; 30%</text>
        <text x="875" y="227" textAnchor="middle" fontSize="8.5" fill="#475569">usable measurement</text>
        <text x="875" y="244" textAnchor="middle" fontSize="9" fill="#475569">ndc + variance share</text>

        <line x1="204" y1="171" x2="244" y2="171" stroke="#94a3b8" strokeWidth="2.4" markerEnd="url(#repeatability-pipeline-arrow)" />
        <line x1="414" y1="171" x2="454" y2="171" stroke="#94a3b8" strokeWidth="2.4" markerEnd="url(#repeatability-pipeline-arrow)" />
        <line x1="756" y1="171" x2="796" y2="171" stroke="#94a3b8" strokeWidth="2.4" markerEnd="url(#repeatability-pipeline-arrow)" />
      </svg>
    </div>
  )
}

function RepeatabilityVarianceDiagram() {
  const W = 980
  const H = 338
  const metricFamilies = [
    { title: 'Reliability', subtitle: 'ICC · I2C2', x: 372, y: 132, fill: '#ede9fe', stroke: '#5b21b6' },
    { title: 'Separation', subtitle: 'D_hat · fingerprinting', x: 506, y: 132, fill: '#dbeafe', stroke: '#1d4ed8' },
    { title: 'Robustness', subtitle: 'rank sum · CCDM', x: 372, y: 204, fill: '#fff7ed', stroke: '#c2410c' },
    { title: 'Diagnostics', subtitle: 'X-bar · power curves', x: 506, y: 204, fill: '#dcfce7', stroke: '#166534' },
  ]

  return (
    <div style={{ overflowX: 'auto' }}>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', maxWidth: W, display: 'block', fontFamily: '-apple-system, sans-serif' }}>
        <defs>
          <marker id="repeatability-variance-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
            <path d="M0,0 L0,7 L7,3.5 z" fill="#94a3b8" />
          </marker>
        </defs>
        <text x={W / 2} y="18" textAnchor="middle" fontSize="12" fill="#0f172a" fontWeight="700">
          Variance decomposition and metric interpretation
        </text>
        <text x={W / 2} y="36" textAnchor="middle" fontSize="10" fill="#64748b">
          The analysis separates real part-to-part variation from measurement error, then cross-checks that separation with reliability and power metrics.
        </text>

        <rect x="28" y="64" width="272" height="228" rx="20" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1.8" />
        <text x="164" y="92" textAnchor="middle" fontSize="12" fill="#0f172a" fontWeight="700">Variance breakdown</text>
        <text x="164" y="110" textAnchor="middle" fontSize="9.5" fill="#64748b">ANOVA / EMS view of repeatability</text>
        <rect x="76" y="136" width="46" height="118" rx="16" fill="#e2e8f0" />
        <rect x="76" y="174" width="46" height="80" rx="16" fill="#93c5fd" />
        <rect x="76" y="220" width="46" height="34" rx="16" fill="#fca5a5" />
        <text x="148" y="174" fontSize="9.5" fill="#2563eb">part-to-part variance</text>
        <text x="148" y="192" fontSize="9" fill="#64748b">signal you want to preserve</text>
        <text x="148" y="232" fontSize="9.5" fill="#dc2626">within-part error</text>
        <text x="148" y="250" fontSize="9" fill="#64748b">repeatability burden</text>
        <text x="164" y="270" textAnchor="middle" fontSize="9.5" fill="#475569">TV = PV + GRR view</text>

        <rect x="354" y="64" width="272" height="228" rx="20" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1.8" />
        <text x="490" y="92" textAnchor="middle" fontSize="12" fill="#0f172a" fontWeight="700">Complementary metric families</text>
        <text x="490" y="110" textAnchor="middle" fontSize="9.5" fill="#64748b">each family checks a different failure mode</text>
        {metricFamilies.map((family) => (
          <g key={family.title}>
            <rect x={family.x} y={family.y} width="102" height="50" rx="15" fill={family.fill} stroke={family.stroke} strokeWidth="1.4" />
            <text x={family.x + 51} y={family.y + 21} textAnchor="middle" fontSize="10" fill={family.stroke} fontWeight="700">
              {family.title}
            </text>
            <text x={family.x + 51} y={family.y + 37} textAnchor="middle" fontSize="8.4" fill="#475569">
              {family.subtitle}
            </text>
          </g>
        ))}
        <circle cx="490" cy="194" r="16" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.3" />
        <text x="490" y="198" textAnchor="middle" fontSize="9" fill="#475569">MSA</text>

        <rect x="680" y="64" width="272" height="228" rx="20" fill="#f0fdf4" stroke="#bbf7d0" strokeWidth="1.8" />
        <text x="816" y="92" textAnchor="middle" fontSize="12" fill="#166534" fontWeight="700">Interpretation panel</text>
        <text x="816" y="110" textAnchor="middle" fontSize="9.5" fill="#15803d">what the analyst can conclude</text>
        <path d="M712 226 C738 172 766 144 796 150 C822 156 848 188 884 172 C904 164 920 146 934 124" stroke="#2563eb" strokeWidth="3" fill="none" />
        <text x="814" y="138" textAnchor="middle" fontSize="9" fill="#64748b">power rises with sample size</text>
        <rect x="714" y="176" width="110" height="44" rx="15" fill="#ffffff" stroke="#93c5fd" strokeWidth="1.2" />
        <text x="769" y="195" textAnchor="middle" fontSize="9.8" fill="#1d4ed8" fontWeight="700">ICC &gt; 0.75</text>
        <text x="769" y="210" textAnchor="middle" fontSize="8.7" fill="#475569">good repeatability</text>
        <rect x="838" y="176" width="92" height="44" rx="15" fill="#ffffff" stroke="#86efac" strokeWidth="1.2" />
        <text x="884" y="195" textAnchor="middle" fontSize="9.8" fill="#166534" fontWeight="700">GRR &lt; 30%</text>
        <text x="884" y="210" textAnchor="middle" fontSize="8.7" fill="#475569">usable system</text>
        <text x="816" y="252" textAnchor="middle" fontSize="9.2" fill="#475569">cross-metric agreement</text>
        <text x="816" y="267" textAnchor="middle" fontSize="9.2" fill="#475569">is the real validation signal</text>

        <line x1="302" y1="178" x2="350" y2="178" stroke="#94a3b8" strokeWidth="2.4" markerEnd="url(#repeatability-variance-arrow)" />
        <line x1="628" y1="178" x2="676" y2="178" stroke="#94a3b8" strokeWidth="2.4" markerEnd="url(#repeatability-variance-arrow)" />
      </svg>
    </div>
  )
}

function PocketHarveyPipelineDiagram() {
  const W = 980
  const H = 360
  return (
    <div style={{ overflowX: 'auto' }}>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', maxWidth: W, display: 'block', fontFamily: '-apple-system, sans-serif' }}>
        <defs>
          <marker id="pocketharvey-pipeline-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
            <path d="M0,0 L0,7 L7,3.5 z" fill="#94a3b8" />
          </marker>
        </defs>
        <text x={W / 2} y="18" textAnchor="middle" fontSize="12" fill="#0f172a" fontWeight="700">
          PocketHarvey corpus construction pipeline
        </text>
        <text x={W / 2} y="36" textAnchor="middle" fontSize="10" fill="#64748b">
          The notebook moves from licensed Indian legal sources to a deduplicated curriculum-ready corpus and grounded SFT pairs.
        </text>

        <rect x="28" y="72" width="214" height="226" rx="20" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.8" />
        <text x="135" y="98" textAnchor="middle" fontSize="12" fill="#334155" fontWeight="700">Source acquisition</text>
        <text x="135" y="116" textAnchor="middle" fontSize="9.5" fill="#64748b">public, licensed, and manually curated</text>
        {[
          ['Indian judgments', 'joelniklaus / ILDC', 96, '#dbeafe', '#1d4ed8'],
          ['FineWebEdu slice', 'keyword-filtered legal text', 146, '#eef2ff', '#4338ca'],
          ['Seed statute notes', 'RTI / labour / tenancy / DV', 196, '#dcfce7', '#166534'],
          ['Offline constraint', 'no paid APIs in the loop', 246, '#fff7ed', '#c2410c'],
        ].map(([title, subtitle, y, fill, stroke]) => (
          <g key={String(title)}>
            <rect x="52" y={Number(y)} width="166" height="36" rx="12" fill={String(fill)} stroke={String(stroke)} strokeWidth="1.2" />
            <text x="135" y={Number(y) + 15} textAnchor="middle" fontSize="9.6" fill={String(stroke)} fontWeight="700">{title}</text>
            <text x="135" y={Number(y) + 27} textAnchor="middle" fontSize="8.4" fill="#475569">{subtitle}</text>
          </g>
        ))}

        <rect x="286" y="92" width="176" height="186" rx="20" fill="#fff7ed" stroke="#fb923c" strokeWidth="1.8" />
        <text x="374" y="118" textAnchor="middle" fontSize="12" fill="#9a3412" fontWeight="700">Preprocessing</text>
        <text x="374" y="140" textAnchor="middle" fontSize="9.4" fill="#7c2d12">ftfy cleanup · whitespace normalization</text>
        <text x="374" y="160" textAnchor="middle" fontSize="9.4" fill="#7c2d12">language filter: English / Hindi / Marathi</text>
        <text x="374" y="180" textAnchor="middle" fontSize="9.4" fill="#7c2d12">minimum-length and alpha-ratio gates</text>
        <rect x="322" y="198" width="104" height="28" rx="14" fill="#fed7aa" stroke="#fb923c" strokeWidth="1.1" />
        <text x="374" y="216" textAnchor="middle" fontSize="9.2" fill="#9a3412">FineWeb-style heuristics</text>
        <text x="374" y="246" textAnchor="middle" fontSize="9.2" fill="#7c2d12">anchor terms · TTR · digit / bullet / symbol checks</text>

        <rect x="506" y="74" width="198" height="222" rx="20" fill="#eff6ff" stroke="#60a5fa" strokeWidth="1.8" />
        <text x="605" y="100" textAnchor="middle" fontSize="12" fill="#1d4ed8" fontWeight="700">Dedup and scoring</text>
        <text x="605" y="122" textAnchor="middle" fontSize="9.4" fill="#2563eb">remove repetition before training</text>
        <rect x="536" y="142" width="138" height="34" rx="13" fill="#ffffff" stroke="#93c5fd" strokeWidth="1.2" />
        <text x="605" y="157" textAnchor="middle" fontSize="9.5" fill="#1d4ed8" fontWeight="700">SHA-256 exact dedup</text>
        <text x="605" y="169" textAnchor="middle" fontSize="8.4" fill="#475569">cheap first-pass duplicate removal</text>
        <rect x="536" y="188" width="138" height="34" rx="13" fill="#ffffff" stroke="#93c5fd" strokeWidth="1.2" />
        <text x="605" y="203" textAnchor="middle" fontSize="9.5" fill="#1d4ed8" fontWeight="700">MinHash LSH</text>
        <text x="605" y="215" textAnchor="middle" fontSize="8.4" fill="#475569">128 perms · Jaccard 0.7</text>
        <rect x="536" y="234" width="138" height="34" rx="13" fill="#dbeafe" stroke="#2563eb" strokeWidth="1.2" />
        <text x="605" y="249" textAnchor="middle" fontSize="9.5" fill="#1d4ed8" fontWeight="700">Educational score</text>
        <text x="605" y="261" textAnchor="middle" fontSize="8.4" fill="#475569">plain-language proxy + readability</text>

        <rect x="748" y="92" width="204" height="188" rx="20" fill="#f0fdf4" stroke="#22c55e" strokeWidth="1.8" />
        <text x="850" y="118" textAnchor="middle" fontSize="12" fill="#166534" fontWeight="700">Training outputs</text>
        <text x="850" y="140" textAnchor="middle" fontSize="9.4" fill="#15803d">curriculum tiers plus synthetic SFT data</text>
        {[
          ['Tier 1', 'high-quality legal explanations', 170, '#dcfce7', '#166534'],
          ['Tier 2', 'moderately readable judgments', 212, '#ecfccb', '#3f6212'],
          ['Tier 3', 'dense procedural legal text', 254, '#fef3c7', '#92400e'],
        ].map(([title, subtitle, y, fill, stroke]) => (
          <g key={String(title)}>
            <rect x="774" y={Number(y)} width="152" height="28" rx="12" fill={String(fill)} stroke={String(stroke)} strokeWidth="1.1" />
            <text x="850" y={Number(y) + 13} textAnchor="middle" fontSize="9.3" fill={String(stroke)} fontWeight="700">{title}</text>
            <text x="850" y={Number(y) + 23} textAnchor="middle" fontSize="8.1" fill="#475569">{subtitle}</text>
          </g>
        ))}
        <text x="850" y="308" textAnchor="middle" fontSize="9.1" fill="#475569">pretrain_corpus.parquet · sft_corpus.parquet · dataset_card.json</text>

        <line x1="244" y1="185" x2="284" y2="185" stroke="#94a3b8" strokeWidth="2.4" markerEnd="url(#pocketharvey-pipeline-arrow)" />
        <line x1="464" y1="185" x2="504" y2="185" stroke="#94a3b8" strokeWidth="2.4" markerEnd="url(#pocketharvey-pipeline-arrow)" />
        <line x1="706" y1="185" x2="746" y2="185" stroke="#94a3b8" strokeWidth="2.4" markerEnd="url(#pocketharvey-pipeline-arrow)" />
      </svg>
    </div>
  )
}

function PocketHarveyCurriculumDiagram() {
  const W = 980
  const H = 350
  return (
    <div style={{ overflowX: 'auto' }}>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', maxWidth: W, display: 'block', fontFamily: '-apple-system, sans-serif' }}>
        <text x={W / 2} y="18" textAnchor="middle" fontSize="12" fill="#0f172a" fontWeight="700">
          Curriculum tiers and downstream export strategy
        </text>
        <text x={W / 2} y="36" textAnchor="middle" fontSize="10" fill="#64748b">
          PocketHarvey separates continued pretraining data from synthetic SFT data and mixes quality tiers deliberately instead of flattening them.
        </text>

        <rect x="32" y="64" width="274" height="236" rx="20" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1.8" />
        <text x="169" y="92" textAnchor="middle" fontSize="12" fill="#0f172a" fontWeight="700">Tier assignment</text>
        <text x="169" y="110" textAnchor="middle" fontSize="9.5" fill="#64748b">composite educational score drives the split</text>
        <rect x="74" y="138" width="44" height="108" rx="16" fill="#e5e7eb" />
        <rect x="74" y="138" width="44" height="54" rx="16" fill="#86efac" />
        <rect x="74" y="192" width="44" height="38" rx="0" fill="#bfdbfe" />
        <rect x="74" y="230" width="44" height="16" rx="0" fill="#fde68a" />
        <text x="140" y="154" fontSize="9.5" fill="#166534">Tier 1: score ≥ 0.65</text>
        <text x="140" y="172" fontSize="8.7" fill="#475569">plain-language legal explanations</text>
        <text x="140" y="206" fontSize="9.5" fill="#1d4ed8">Tier 2: 0.40 to 0.65</text>
        <text x="140" y="224" fontSize="8.7" fill="#475569">moderate readability judgments</text>
        <text x="140" y="252" fontSize="9.5" fill="#92400e">Tier 3: score &lt; 0.40</text>
        <text x="140" y="270" fontSize="8.7" fill="#475569">dense procedural text kept in smaller share</text>

        <rect x="352" y="64" width="274" height="236" rx="20" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1.8" />
        <text x="489" y="92" textAnchor="middle" fontSize="12" fill="#0f172a" fontWeight="700">Pretraining mix</text>
        <text x="489" y="110" textAnchor="middle" fontSize="9.5" fill="#64748b">SmolLM / Nemotron-style staged curriculum</text>
        <rect x="402" y="144" width="174" height="26" rx="12" fill="#dcfce7" />
        <rect x="402" y="178" width="122" height="26" rx="12" fill="#dbeafe" />
        <rect x="402" y="212" width="52" height="26" rx="12" fill="#fef3c7" />
        <text x="586" y="161" fontSize="9.5" fill="#166534" fontWeight="700">Tier 1 · 50%</text>
        <text x="534" y="195" fontSize="9.5" fill="#1d4ed8" fontWeight="700">Tier 2 · 35%</text>
        <text x="464" y="229" fontSize="9.5" fill="#92400e" fontWeight="700">Tier 3 · 15%</text>
        <text x="489" y="262" textAnchor="middle" fontSize="8.9" fill="#475569">interleaved shuffle avoids</text>
        <text x="489" y="276" textAnchor="middle" fontSize="8.9" fill="#475569">sharp tier transitions in training</text>

        <rect x="672" y="64" width="276" height="236" rx="20" fill="#f0fdf4" stroke="#bbf7d0" strokeWidth="1.8" />
        <text x="810" y="92" textAnchor="middle" fontSize="12" fill="#166534" fontWeight="700">Synthetic SFT branch</text>
        <text x="810" y="110" textAnchor="middle" fontSize="9.5" fill="#15803d">grounded question-answer generation</text>
        <rect x="706" y="136" width="208" height="42" rx="14" fill="#ffffff" stroke="#86efac" strokeWidth="1.2" />
        <text x="810" y="154" textAnchor="middle" fontSize="9.4" fill="#166534" fontWeight="700">Tier 1 docs → 2 Q&A pairs each</text>
        <text x="810" y="168" textAnchor="middle" fontSize="8.5" fill="#475569">rights, procedure, definition, penalty templates</text>
        <rect x="706" y="188" width="208" height="42" rx="14" fill="#ffffff" stroke="#86efac" strokeWidth="1.2" />
        <text x="810" y="206" textAnchor="middle" fontSize="9.4" fill="#166534" fontWeight="700">Tier 2 sample → 1 pair each</text>
        <text x="810" y="220" textAnchor="middle" fontSize="8.5" fill="#475569">up to 500 sampled docs with NALSA disclaimer</text>
        <text x="810" y="258" textAnchor="middle" fontSize="8.8" fill="#475569">final export: Alpaca-style SFT Parquet</text>
        <text x="810" y="272" textAnchor="middle" fontSize="8.8" fill="#475569">with source and domain metadata</text>
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

function LegalNexusPaper() {
  return (
    <div style={{ fontFamily: 'Georgia, "Times New Roman", serif', color: '#1f2937' }}>
      <h1 style={{ fontSize: '27px', fontWeight: '700', lineHeight: 1.28, marginBottom: '10px', color: '#0f172a', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
        Multi-Agent Hyperbolic Framework for Legal Reasoning &amp; Retrieval
      </h1>
      <p style={{ fontSize: '14.5px', color: '#6b7280', marginBottom: '4px', fontFamily: 'sans-serif' }}>
        Animesh Mishra · Legal AI, Geometric Deep Learning · 2025
      </p>
      <p style={{ fontSize: '13.5px', color: '#9ca3af', marginBottom: '32px', fontFamily: 'sans-serif' }}>
        Repo-grounded research page ·{' '}
        <a href="https://github.com/amethystani/legalnexus-backend" target="_blank" rel="noopener noreferrer" style={{ color: '#3b6ea5', textDecoration: 'none' }}>
          github.com/amethystani/legalnexus-backend
        </a>
      </p>

      <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '18px 22px', marginBottom: '38px' }}>
        <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.1em', color: '#64748b', marginBottom: '10px', fontFamily: 'sans-serif' }}>Abstract</div>
        <p style={{ margin: 0, fontSize: '15px', lineHeight: 1.85, color: '#374151' }}>
          LegalNexus is a research-grade legal retrieval and reasoning system built around a simple claim: <strong>legal precedent is hierarchical, relational, and adversarial</strong>, so the retrieval stack should reflect that structure explicitly. The framework combines <strong>Hyperbolic Graph Convolutional Networks</strong> in a <strong>Poincaré ball</strong>, a <strong>three-agent graph construction loop</strong>, a <strong>five-signal hybrid retrieval system</strong>, <strong>Toulmin argument extraction</strong>, and <strong>temporal resurrection scoring</strong> for older but still-cited precedents. The repository README and validation reports describe evaluation on <strong>49,634 legal cases</strong> with <strong>768-dimensional embeddings</strong>, reporting <strong>Precision@5 = 0.896</strong>, <strong>NDCG@10 = 0.893</strong>, <strong>MAP@100 = 0.816</strong>, <strong>Gromov δ = 0.029</strong>, <strong>98.3% citation conflict resolution</strong>, and a <strong>+62.4% resurrection effect</strong> for re-cited old cases.
        </p>
      </div>

      <h2 style={paperSectionStyle}>1. Research Question</h2>
      <p style={paperParaStyle}>
        Traditional legal search systems collapse a hard problem into vector similarity: embed a query, embed a case, and rank by closeness. That misses the actual shape of legal reasoning. Courts operate in authority hierarchies, precedents cite and override each other, and good legal research requires not only finding similar text but also surfacing the strongest supporting and opposing authorities.
      </p>
      <p style={paperParaStyle}>
        This project therefore asks a sharper question: <strong>can legal retrieval become materially better if the model encodes hierarchy, argument structure, and citation conflict directly rather than treating cases as flat documents?</strong> LegalNexus answers that by combining geometric deep learning with multi-agent graph refinement and retrieval fusion.
      </p>

      <h2 style={paperSectionStyle}>2. Dataset And Problem Setting</h2>
      <p style={paperParaStyle}>
        The repo documents a corpus of <strong>49,634 legal cases</strong> embedded into a <strong>768-dimensional space</strong>, with metadata spanning <strong>three court levels</strong> and <strong>four legal topic clusters</strong> across a long time range. The working assumption is that legal citation networks are not random graphs. They behave more like structured hierarchies: higher courts sit nearer the center of authority, while lower courts branch outward.
      </p>
      <p style={paperParaStyle}>
        That matters because the retrieval problem is not only about topical similarity. A useful system has to respect <strong>court authority</strong>, <strong>citation structure</strong>, <strong>temporal relevance</strong>, and <strong>argument semantics</strong> at the same time. The framework uses all four.
      </p>

      <div style={{ background: '#fafafa', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '16px 20px', margin: '24px 0' }}>
        <p style={{ fontSize: '11.5px', color: '#6b7280', margin: '0 0 10px', fontFamily: 'sans-serif', fontWeight: 600 }}>Figure 1. Hyperbolic hierarchy encoding</p>
        <LegalHyperbolicDiagram />
      </div>

      <h2 style={paperSectionStyle}>3. Hyperbolic Representation</h2>
      <p style={paperParaStyle}>
        The first core move is geometric. Instead of forcing legal precedent into Euclidean space, LegalNexus uses <strong>Hyperbolic GCNs</strong> and embeds cases inside a <strong>Poincaré ball</strong>. The repo README describes the intuition directly: the <strong>radial coordinate</strong> captures authority, while the <strong>angular coordinate</strong> captures semantic similarity. In other words, being close to the center means being institutionally important; being close by angle means being about similar legal issues.
      </p>
      <p style={paperParaStyle}>
        The validation report backs that story with a concrete court-radius ordering: <strong>Supreme Court = 0.540</strong>, <strong>High Court = 0.575</strong>, <strong>District Court = 0.619</strong>. That monotonic pattern is exactly what the geometry is supposed to recover. The same report gives <strong>Gromov δ = 0.029</strong> versus a random baseline of <strong>0.404</strong>, which the project interprets as <strong>13.7× better tree-likeness</strong> than the baseline comparison.
      </p>
      <p style={paperParaStyle}>
        The technical implication is important: hierarchy is not bolted on as a metadata feature after retrieval. It is built into the space itself. That gives the downstream search and reasoning modules a representation that already “knows” something about judicial structure before the first ranking step happens.
      </p>

      <h2 style={paperSectionStyle}>4. Multi-Agent Graph Construction</h2>
      <p style={paperParaStyle}>
        The repo does not stop at embeddings. It also treats citation graph construction as a coordination problem between specialized agents. The documented design uses three roles: a <strong>Linker</strong> that proposes candidate citations, an <strong>Interpreter</strong> that labels the edge semantics, and a <strong>Conflict</strong> agent that detects cycles, contradictions, and authority inversions.
      </p>
      <p style={paperParaStyle}>
        The architecture docs frame this as a <strong>Nash-style best-response loop</strong>. Each agent updates its output with reference to the shared graph state until no single player can improve the joint state alone. Whether or not one wants to take the game-theoretic formalism literally, the engineering point is clear: the graph is refined through repeated critique rather than a single extraction pass.
      </p>

      <div style={{ background: '#fafafa', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '16px 20px', margin: '24px 0' }}>
        <p style={{ fontSize: '11.5px', color: '#6b7280', margin: '0 0 10px', fontFamily: 'sans-serif', fontWeight: 600 }}>Figure 2. Three-agent graph refinement loop</p>
        <LegalAgentDebateDiagram />
      </div>

      <p style={paperParaStyle}>
        The repository materials assign concrete jobs to those agents. Linker uses citation pattern extraction and model reasoning to propose candidate edges. Interpreter assigns legal relationship types such as <strong>FOLLOW</strong>, <strong>DISTINGUISH</strong>, and <strong>OVERRULE</strong>. Conflict acts as a critic, removing logical inconsistencies. In the validation report, this machinery resolves <strong>1,193 of 1,214 detected conflicts</strong>, a <strong>98.3%</strong> success rate.
      </p>

      <h2 style={paperSectionStyle}>5. Hybrid Retrieval And Legal Reasoning</h2>
      <p style={paperParaStyle}>
        Retrieval is also intentionally plural. The main README describes a <strong>five-part hybrid retriever</strong>: semantic search, structural graph search, citation-weighted authority scoring, hyperbolic nearest-neighbor search, and GNN-enhanced retrieval. The point is not merely to ensemble more models; it is to assemble different legal signals that matter for precedent.
      </p>
      <p style={paperParaStyle}>
        On top of that, the system layers two reasoning-oriented modules. The first is a <strong>Toulmin extractor</strong> that decomposes legal text into claims, grounds, warrants, backing, and rebuttals. The second is a <strong>temporal scorer</strong> that discounts stale authority but boosts old cases that continue to receive citations. This “resurrection” mechanism reflects something real about law: some precedents age out, while others become canonical and return to relevance.
      </p>

      <div style={{ background: '#fafafa', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '16px 20px', margin: '24px 0' }}>
        <p style={{ fontSize: '11.5px', color: '#6b7280', margin: '0 0 10px', fontFamily: 'sans-serif', fontWeight: 600 }}>Figure 3. Retrieval and reasoning stack</p>
        <LegalRetrievalDiagram />
      </div>

      <h2 style={paperSectionStyle}>6. Algorithmic Notes</h2>
      <p style={paperParaStyle}>
        The repo README exposes the retrieval internals more concretely than most portfolio pages do. The GNN pipeline is described as a <strong>4-layer graph network</strong> with <strong>k = 150 neighbors</strong> and skip-connected message aggregation. The evaluation stack then computes Precision, NDCG, MAP, hierarchy validation, Gromov hyperbolicity, Toulmin extraction accuracy, temporal scoring effects, and citation conflict resolution under one consolidated evaluation run.
      </p>
      <ul style={paperListStyle}>
        <li><strong>Geometry:</strong> Poincaré distance and Möbius operations support message passing in hyperbolic space.</li>
        <li><strong>Retrieval:</strong> multiple legal signals are fused rather than trusting one similarity function.</li>
        <li><strong>Argument structure:</strong> Toulmin extraction makes the returned precedent set more inspectable.</li>
        <li><strong>Time-awareness:</strong> old but still-cited cases are boosted through resurrection scoring instead of being discarded by age alone.</li>
      </ul>

      <div style={{ background: '#f0f9ff', border: '1px solid #bae6fd', borderLeft: '4px solid #0284c7', borderRadius: '6px', padding: '18px 22px', margin: '16px 0 24px' }}>
        <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.08em', color: '#0369a1', marginBottom: '12px', fontFamily: 'sans-serif' }}>Key Validation Metrics</div>
        <p style={{ margin: 0, fontSize: '14.5px', lineHeight: 1.95, color: '#1e3a5f' }}>
          <strong>Precision@5:</strong> 0.896 · <strong>Precision@10:</strong> 0.889 · <strong>NDCG@10:</strong> 0.893 · <strong>MAP@100:</strong> 0.816 · <strong>Gromov δ:</strong> 0.029 · <strong>Toulmin accuracy:</strong> 100% · <strong>Conflict resolution:</strong> 98.3% · <strong>Resurrection effect:</strong> +62.4%
        </p>
      </div>

      <h2 style={paperSectionStyle}>7. Results And Interpretation</h2>
      <p style={paperParaStyle}>
        The retrieval metrics are strong enough to make the system interesting on their own: <strong>Precision@5 = 0.896</strong> means nearly nine of every ten cases surfaced in the top five are relevant under the project&apos;s evaluation setup. But the more distinctive result is how many different properties are validated together. The repo does not present LegalNexus as “just” another reranker. It presents it as a system where <strong>hierarchy preservation</strong>, <strong>citation consistency</strong>, <strong>argument extraction</strong>, and <strong>temporal relevance</strong> are all first-class objectives.
      </p>
      <p style={paperParaStyle}>
        That bundled framing is what separates the project from ordinary legal search demos. A Euclidean embedding model might recover semantic neighbors. A citation graph might recover authority. A text parser might recover argument spans. LegalNexus tries to make those pieces reinforce each other rather than live in separate pipelines.
      </p>

      <h2 style={paperSectionStyle}>8. Why This Research Matters</h2>
      <p style={paperParaStyle}>
        Legal retrieval is one of the clearest cases where geometry and systems design both matter. A search result is only useful if it is not just semantically similar, but procedurally defensible: authority must be respected, contradictions need to be surfaced, and the legal theory behind a result should be inspectable. Hyperbolic geometry helps with the first part, while the agent loop and Toulmin layer help with the second.
      </p>
      <p style={paperParaStyle}>
        From a research perspective, the project is compelling because it sits at the boundary of <strong>Legal AI</strong>, <strong>Geometric Deep Learning</strong>, <strong>information retrieval</strong>, and <strong>multi-agent reasoning</strong>. It is the kind of work that is interesting not only for benchmark scores, but because it proposes a structured way to think about legal precedent as a hierarchy-plus-argument problem rather than a document search problem.
      </p>

      <h2 style={paperSectionStyle}>References (Selected)</h2>
      <ul style={{ ...paperListStyle, fontSize: '13.5px', color: '#6b7280', lineHeight: 1.75 }}>
        <li>LegalNexus Backend README and validation materials in the public repository.</li>
        <li>Nickel, M. and Kiela, D. (2017). Poincaré Embeddings for Learning Hierarchical Representations.</li>
        <li>Ganea, O.-E., Becigneul, G., and Hofmann, T. (2018). Hyperbolic Neural Networks.</li>
        <li>Nash, J. (1951). Non-Cooperative Games.</li>
        <li>Toulmin, S. (1958). The Uses of Argument.</li>
      </ul>
    </div>
  )
}

function BipsPkdPaper() {
  return (
    <div style={{ fontFamily: 'Georgia, "Times New Roman", serif', color: '#1f2937' }}>
      <h1 style={{ fontSize: '27px', fontWeight: '700', lineHeight: 1.28, marginBottom: '10px', color: '#0f172a', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
        BIPS-PKD: Backbone-Integrated Partial Split with Progressive Knowledge Distillation
      </h1>
      <p style={{ fontSize: '14.5px', color: '#6b7280', marginBottom: '4px', fontFamily: 'sans-serif' }}>
        Animesh Mishra · Edge Inference Acceleration, NSGS Runtime · 2025
      </p>
      <p style={{ fontSize: '13.5px', color: '#9ca3af', marginBottom: '32px', fontFamily: 'sans-serif' }}>
        CVPR &apos;26 submission context ·{' '}
        <a href="https://github.com/amethystani/NSGSAlgorithm" target="_blank" rel="noopener noreferrer" style={{ color: '#3b6ea5', textDecoration: 'none' }}>
          github.com/amethystani/NSGSAlgorithm
        </a>
      </p>

      <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '18px 22px', marginBottom: '38px' }}>
        <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.1em', color: '#64748b', marginBottom: '10px', fontFamily: 'sans-serif' }}>Abstract</div>
        <p style={{ margin: 0, fontSize: '15px', lineHeight: 1.85, color: '#374151' }}>
          BIPS-PKD targets a practical but stubborn problem in vision systems: <strong>modern segmentation backbones are accurate, but too slow and too wasteful for real edge deployment</strong>. The project combines two ideas. First, <strong>BIPS</strong> splits a backbone at a learned intermediate layer so the expensive late-stage teacher tail is replaced by a compact student head at inference time. Second, <strong>PKD</strong> progressively distills the student so the cheap branch stays close to the teacher without paying the teacher&apos;s runtime cost after training. Around that model-side idea, the work builds <strong>NSGS</strong>, an event-driven runtime where image patches fire asynchronously when local activations exceed adaptive thresholds, dispatching work through a <strong>lock-free SpikeQueue</strong> with <strong>thermal-aware scheduling</strong> on CPU. Across nine model families, the reported headline result is <strong>60.8x speedup</strong> on EfficientSAM small (<strong>3612 ms to 59 ms</strong>, about <strong>16 FPS</strong> on a 4-thread CPU), while retaining <strong>65.8% average mIoU</strong> and using <strong>4.4x less energy</strong> than the cited YOLOv8m-seg baseline.
        </p>
      </div>

      <h2 style={paperSectionStyle}>1. Research Question</h2>
      <p style={paperParaStyle}>
        The page is built around one clear systems question: <strong>can segmentation backbones that are normally too heavy for mobile or CPU-only execution be restructured so they remain accurate enough while becoming genuinely deployable on-device?</strong> That is harder than simply pruning parameters. Segmentation models carry expensive late-stage computation, dense frame-by-frame execution wastes cycles on inactive regions, and mobile deployment imposes strict limits on latency, thermal stability, model size, and synchronization overhead.
      </p>
      <p style={paperParaStyle}>
        BIPS-PKD answers that question by treating the problem as both a <strong>model architecture</strong> issue and a <strong>runtime scheduling</strong> issue. The work does not rely on a single handcrafted backbone rewrite. Instead, it tries to define a reusable recipe that can travel across multiple model families.
      </p>

      <h2 style={paperSectionStyle}>2. Problem Setting</h2>
      <p style={paperParaStyle}>
        The motivating baseline is blunt: edge segmentation is slow enough to break the product experience. The project notes that <strong>EfficientSAM takes 3.6 seconds per image on a 4-thread CPU</strong>, which immediately rules out interactive use on commodity devices. The same bottleneck appears across other families such as <strong>SegFormer</strong>, <strong>Mask2Former</strong>, <strong>SAM2</strong>, <strong>PIDNet</strong>, <strong>YOLOv8 / YOLOv12</strong>, <strong>DINOv3</strong>, and <strong>MobileSAM</strong>.
      </p>
      <p style={paperParaStyle}>
        The important framing is that this is not only a raw FLOPs problem. Dense segmentation inference repeatedly computes over quiet image regions and pushes all patches through the same late backbone path even when only a small subset of the scene actually changes. That is why the project couples a cheaper head with an event-driven runtime rather than betting on only one optimization.
      </p>

      <div style={paperFigureStyle}>
        <p style={paperFigureLabelStyle}>Figure 1. Backbone-integrated partial split</p>
        <BipsSplitDiagram />
      </div>

      <h2 style={paperSectionStyle}>3. BIPS-PKD Method</h2>
      <p style={paperParaStyle}>
        The architectural move is straightforward but strong. <strong>BIPS</strong> keeps the early and middle portion of the original backbone, then inserts a <strong>learned split point</strong> before the expensive late computation. During training, the original teacher tail is still available, but the student head learns to reproduce enough of the teacher&apos;s behavior that the teacher branch can be discarded at deployment time.
      </p>
      <p style={paperParaStyle}>
        <strong>PKD</strong>, the distillation half of the method, is described as a <strong>progressive</strong> process rather than a single-shot mimicry loss. The point of that schedule is not just to compress features, but to make the cheap head close the quality gap gradually so that the final inference graph consists only of the shared stem plus the student head. The page emphasizes this because it is the core reason the method is <strong>model-family agnostic</strong>: the recipe operates on the cut between backbone stages instead of requiring architecture-specific surgery for every model.
      </p>
      <ul style={paperListStyle}>
        <li><strong>Backbone reuse:</strong> preserve the strongest early representation rather than redesigning the whole network.</li>
        <li><strong>Learned split:</strong> move the cut to an intermediate layer instead of hardcoding one global breakpoint.</li>
        <li><strong>Student replacement:</strong> late expensive computation is distilled into a compact inference head.</li>
        <li><strong>Deployment path:</strong> only the shared stem and student branch survive at runtime.</li>
      </ul>

      <div style={{ background: '#f0f9ff', border: '1px solid #bae6fd', borderLeft: '4px solid #0284c7', borderRadius: '6px', padding: '18px 22px', margin: '16px 0 24px' }}>
        <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.08em', color: '#0369a1', marginBottom: '12px', fontFamily: 'sans-serif' }}>Why This Structure Matters</div>
        <p style={{ margin: 0, fontSize: '14.5px', lineHeight: 1.85, color: '#1e3a5f' }}>
          Many edge-vision optimizations win only on one architecture. BIPS-PKD is interesting because the split-and-distill logic is presented as a <strong>portable recipe</strong>: keep the universal front half of the backbone, compress the costly tail, and let the runtime exploit sparsity so the deployment graph is both smaller and cheaper to schedule.
        </p>
      </div>

      <h2 style={paperSectionStyle}>4. NSGS Runtime</h2>
      <p style={paperParaStyle}>
        The model change alone is not the full story. The project also builds <strong>NSGS</strong>, an event-driven execution layer where <strong>image patches become computational units</strong>. Instead of scanning every patch with the same dense schedule, local regions <strong>fire asynchronously</strong> only when activations exceed adaptive thresholds. In the project notes, this cuts redundant computation by <strong>38-62%</strong> relative to frame-by-frame execution.
      </p>
      <p style={paperParaStyle}>
        The systems engineering around that idea matters. The runtime is described as a <strong>C++ lock-free SpikeQueue</strong> that dispatches these patch events across CPU threads with <strong>minimal synchronization</strong>. A separate <strong>thermal-aware scheduler</strong> keeps the pipeline usable under sustained mobile constraints instead of chasing a single short-burst benchmark number that collapses once the device heats up.
      </p>

      <div style={paperFigureStyle}>
        <p style={paperFigureLabelStyle}>Figure 2. Event-driven NSGS runtime</p>
        <NSGSRuntimeDiagram />
      </div>

      <h2 style={paperSectionStyle}>5. Experimental Scope</h2>
      <p style={paperParaStyle}>
        The benchmark framing is broader than a single-model acceleration demo. The project reports evaluation across <strong>nine model families</strong>: EfficientSAM, SegFormer, Mask2Former, SAM2, PIDNet, YOLOv8, YOLOv12, DINOv3, and MobileSAM. That matters because it tests whether the split-and-distill recipe generalizes beyond the one backbone it was designed around.
      </p>
      <p style={paperParaStyle}>
        The result spread in the current portfolio notes highlights three representative wins: <strong>60.8x</strong> on EfficientSAM small, <strong>50.3x</strong> on EfficientSAM tiny, and <strong>15.3x</strong> on SegFormer-B5. These are paired with <strong>65.8% average mIoU</strong> and a <strong>4.4x energy reduction</strong> against the YOLOv8m-seg comparison. The page reads those numbers as a systems tradeoff, not just a single latency boast.
      </p>

      <div style={paperFigureStyle}>
        <p style={paperFigureLabelStyle}>Figure 3. Cross-family benchmark summary</p>
        <BipsResultsDiagram />
      </div>

      <h2 style={paperSectionStyle}>6. Qualitative Model Comparison</h2>
      <p style={paperParaStyle}>
        The qualitative comparison artifact is worth showing directly because it makes the project&apos;s argument visual: NSGS-augmented variants can stay competitive or improve on mask quality while reducing latency materially on the same sample. The figure below compares standard baselines against NSGS-enhanced versions using the reported <strong>mIoU</strong> and per-image <strong>time</strong> annotations rendered in the project asset.
      </p>

      <div style={paperFigureStyle}>
        <p style={paperFigureLabelStyle}>Figure 4. Public qualitative comparison artifact</p>
        <img
          src="/modelcomparison_qualitative.png"
          alt="Qualitative comparison between baseline segmentation models and NSGS-enhanced variants"
          style={{ display: 'block', width: '100%', height: 'auto', borderRadius: '8px', border: '1px solid #e5e7eb', background: '#ffffff' }}
        />
        <p style={{ ...paperParaStyle, margin: '14px 0 0', fontSize: '14px' }}>
          On this example, the displayed overlays show <strong>YOLOv8m-seg</strong> at <strong>mIoU 0.912 / 124.5 ms</strong>, <strong>YOLOv12n-seg</strong> at <strong>0.895 / 45.2 ms</strong>, and <strong>DINOv3-Best</strong> at <strong>0.842 / 612.0 ms</strong>, while the NSGS variants shown in the same artifact reach <strong>NSGS+YOLOv8m: 0.958 / 88.4 ms</strong>, <strong>NSGS+YOLOv12n: 0.932 / 32.1 ms</strong>, <strong>NSGS+DINOv3-Best: 0.974 / 645.0 ms</strong>, <strong>NSGS+MobileSAM: 0.982 / 2180.0 ms</strong>, and <strong>NSGS+YOLOv12x: 0.965 / 112.5 ms</strong>. The point is not that every model wins on every dimension equally, but that the framework is trying to move the <strong>quality-latency frontier</strong> rather than optimizing only one axis.
        </p>
      </div>

      <h2 style={paperSectionStyle}>7. Systems Interpretation</h2>
      <p style={paperParaStyle}>
        The strongest part of the project is that the three layers line up. <strong>BIPS</strong> removes expensive late computation. <strong>PKD</strong> tries to preserve quality after that removal. <strong>NSGS</strong> then makes the surviving graph cheaper to execute by treating the input as sparse event traffic rather than a uniformly active frame. None of those pieces is sufficient alone; together they make the deployment claim believable.
      </p>
      <p style={paperParaStyle}>
        That is also why the page emphasizes the deployment note that the system ships as a <strong>fully offline Android app</strong> with roughly <strong>500 MB of bundled ONNX models</strong>. This forces the research to answer a product question, not just a benchmark question. A method that looks good in a notebook but cannot run offline, cannot survive thermal throttling, or requires GPU-only execution would not satisfy the goal this project sets for itself.
      </p>

      <h2 style={paperSectionStyle}>8. Why This Matters</h2>
      <p style={paperParaStyle}>
        There are two reasons this work stands out. First, it treats <strong>edge vision as a full-stack problem</strong>. Many papers optimize the network and ignore the scheduler, or optimize the runtime and ignore the representation. Here the architecture and runtime are designed to reinforce each other. Second, it avoids the common trap of making an acceleration claim on one model only. The broad model-family coverage is what makes the method interesting as a reusable research contribution rather than a one-off engineering trick.
      </p>
      <p style={paperParaStyle}>
        From a portfolio perspective, this is a strong example of systems-minded ML research: neuromorphic-style event scheduling, backbone-aware compression, knowledge distillation, CPU inference optimization, and mobile deployment all pushed into the same project. That synthesis is the real story behind the headline speedups.
      </p>

      <h2 style={paperSectionStyle}>References (Selected)</h2>
      <ul style={{ ...paperListStyle, fontSize: '13.5px', color: '#6b7280', lineHeight: 1.75 }}>
        <li>NSGS / BIPS-PKD project notes and portfolio spec materials in this repository.</li>
        <li>Public project artifact: <code>public/modelcomparison_qualitative.png</code>.</li>
        <li>EfficientSAM, SegFormer, Mask2Former, SAM2, PIDNet, MobileSAM, DINOv3, and YOLO segmentation model families as referenced by the project benchmarks.</li>
      </ul>
    </div>
  )
}

function StatisticalRepeatabilityPaper() {
  return (
    <div style={{ fontFamily: 'Georgia, "Times New Roman", serif', color: '#1f2937' }}>
      <h1 style={{ fontSize: '27px', fontWeight: '700', lineHeight: 1.28, marginBottom: '10px', color: '#0f172a', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
        Comprehensive Measurement System Analysis for Statistical Repeatability
      </h1>
      <p style={{ fontSize: '14.5px', color: '#6b7280', marginBottom: '4px', fontFamily: 'sans-serif' }}>
        Animesh Mishra · Statistical modeling for engineering measurements · 2026
      </p>
      <p style={{ fontSize: '13.5px', color: '#9ca3af', marginBottom: '32px', fontFamily: 'sans-serif' }}>
        Published link ·{' '}
        <a href="https://www.sciencedirect.com/science/article/abs/pii/S026322412600730X" target="_blank" rel="noopener noreferrer" style={{ color: '#3b6ea5', textDecoration: 'none' }}>
          sciencedirect.com/science/article/abs/pii/S026322412600730X
        </a>{' '}
        ·{' '}
        <a href="https://github.com/amethystani/Statistical-Repeatability" target="_blank" rel="noopener noreferrer" style={{ color: '#3b6ea5', textDecoration: 'none' }}>
          github.com/amethystani/Statistical-Repeatability
        </a>
      </p>

      <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '18px 22px', marginBottom: '38px' }}>
        <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.1em', color: '#64748b', marginBottom: '10px', fontFamily: 'sans-serif' }}>Abstract</div>
        <p style={{ margin: 0, fontSize: '15px', lineHeight: 1.85, color: '#374151' }}>
          This work builds a comprehensive <strong>Measurement System Analysis (MSA)</strong> framework for engineering datasets where repeatability is not obvious from a single reliability coefficient. The implementation combines <strong>discriminability</strong>, <strong>fingerprint index</strong>, <strong>I2C2</strong>, <strong>rank-sum statistics</strong>, <strong>ICC</strong>, <strong>CCDM</strong>, <strong>ANOVA-based variance decomposition</strong>, and <strong>X-bar control charts</strong>, then layers on simulation-based power analysis to test how those measures behave under changing sample sizes and variance conditions. The result is a more inspectable repeatability study for noisy, small-magnitude measurements in settings such as vibration analysis, material testing, and precision engineering.
        </p>
      </div>

      <h2 style={paperSectionStyle}>1. Research Question</h2>
      <p style={paperParaStyle}>
        The central question is simple but important: <strong>when repeated engineering measurements look stable, are they reflecting true specimen differences or only a measurement process that repeats its own noise consistently?</strong> In many practical settings, the measurement values are small, the noise floor is nontrivial, and a single repeatability score can hide whether the system is genuinely useful for discrimination.
      </p>
      <p style={paperParaStyle}>
        That is why this project does not stop at conventional Gage R&amp;R language. It treats repeatability as a statistical-modeling problem where variance structure, distance structure, identification power, and stability diagnostics all need to line up before the measurement system can be trusted.
      </p>

      <h2 style={paperSectionStyle}>2. Analysis Workflow</h2>
      <p style={paperParaStyle}>
        The repository is organized like a full analysis stack rather than a single notebook. Repeated-measurement tables are ingested specimen by specimen, transformed into a part-versus-repetition representation, then pushed through multiple metric families. The point is to examine the same dataset from several statistical directions so weak assumptions in one method do not dominate the whole conclusion.
      </p>

      <div style={paperFigureStyle}>
        <p style={paperFigureLabelStyle}>Figure 1. Measurement repeatability workflow</p>
        <RepeatabilityPipelineDiagram />
      </div>

      <h2 style={paperSectionStyle}>3. Statistical Modeling Core</h2>
      <p style={paperParaStyle}>
        The strongest part of the work is the <strong>variance-centric backbone</strong>. The implementation uses one-way <strong>ANOVA</strong> and <strong>Expected Mean Squares</strong> to break total variation into between-part and within-part components, then derives interpretable quantities such as <strong>EV</strong>, <strong>AV</strong>, <strong>GRR</strong>, <strong>PV</strong>, and the <strong>number of distinct categories</strong>. That lets the analysis answer a practical question: is the observed spread coming from the parts themselves, or from the measurement process?
      </p>
      <p style={paperParaStyle}>
        But the project does not rely only on ANOVA-era summaries. The code also implements <strong>discriminability</strong> through within-part versus between-part distance comparisons, <strong>fingerprinting</strong> as an identification-style uniqueness check, <strong>I2C2</strong> for structured measurement data, <strong>rank-sum</strong> methods for more robust non-parametric comparison, and <strong>CCDM</strong> to test consistency of correlation structure across repetitions. Together, those methods make the system much less brittle than a pipeline that reports ICC and stops there.
      </p>

      <div style={paperFigureStyle}>
        <p style={paperFigureLabelStyle}>Figure 2. Variance decomposition and metric families</p>
        <RepeatabilityVarianceDiagram />
      </div>

      <h2 style={paperSectionStyle}>4. Diagnostics And Interpretation</h2>
      <p style={paperParaStyle}>
        The visual diagnostics in the repository matter as much as the metrics themselves. <strong>X-bar control charts</strong> check whether repeated measurements remain stable, cross-metric relationship plots show how discriminability and ICC move together, and <strong>power-analysis simulations</strong> test how sensitive each measure is as sample size and variance assumptions change. That makes the framework useful for planning studies, not only auditing them after the fact.
      </p>
      <p style={paperParaStyle}>
        This is particularly valuable when the data live in the awkward middle ground where the signal is real but small. In that regime, floating-point sensitivity, non-Gaussian behavior, or weak part-to-part spread can distort naive conclusions. The repository explicitly addresses those cases with high-precision handling, variance guards, and simulation-based checks.
      </p>

      <h2 style={paperSectionStyle}>5. Why This Paper Matters</h2>
      <p style={paperParaStyle}>
        A lot of engineering analyses treat the measurement system as a background assumption. This work treats it as the primary object of study. That is the right framing whenever downstream conclusions depend on whether repeated observations are truly repeatable, distinguishable, and statistically interpretable.
      </p>
      <p style={paperParaStyle}>
        From a research perspective, the contribution is not just another metric implementation. It is the <strong>combination</strong> of metric families, variance decomposition, process-control style visualization, and power analysis into one coherent repeatability framework. That makes it much more representable as a research system and much closer to the style of the other in-depth sections on the site.
      </p>

      <h2 style={paperSectionStyle}>References (Selected)</h2>
      <ul style={{ ...paperListStyle, fontSize: '13.5px', color: '#6b7280', lineHeight: 1.75 }}>
        <li>Statistical-Repeatability repository README and implementation materials.</li>
        <li>Koo, T. K., and Li, M. Y. (2016). A Guideline of Selecting and Reporting Intraclass Correlation Coefficients for Reliability Research.</li>
        <li>AIAG (2010). Measurement Systems Analysis Reference Manual, 4th edition.</li>
        <li>Wheeler, D. J., and Lyday, R. W. (1989). Evaluating the Measurement Process.</li>
      </ul>
    </div>
  )
}

function NeMoSynthRustProject() {
  return (
    <div style={{ fontFamily: 'Georgia, "Times New Roman", serif', color: '#1f2937' }}>
      <h1 style={{ fontSize: '27px', fontWeight: '700', lineHeight: 1.28, marginBottom: '10px', color: '#0f172a', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
        NeMoSynthRust
      </h1>
      <p style={{ fontSize: '14.5px', color: '#6b7280', marginBottom: '4px', fontFamily: 'sans-serif' }}>
        Animesh Mishra · synthetic Rust data generation, LLM judging, and cargo-grounded evaluation · 2026
      </p>
      <p style={{ fontSize: '13.5px', color: '#9ca3af', marginBottom: '32px', fontFamily: 'sans-serif' }}>
        Built from the local NeMo pipeline repo and exported as a HuggingFace-ready parquet dataset.
      </p>

      <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '18px 22px', marginBottom: '38px' }}>
        <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.1em', color: '#64748b', marginBottom: '10px', fontFamily: 'sans-serif' }}>Abstract</div>
        <p style={{ margin: 0, fontSize: '15px', lineHeight: 1.85, color: '#374151' }}>
          NeMoSynthRust is an end-to-end <strong>synthetic Rust dataset generation and evaluation system</strong> built around a simple but important idea: <strong>generated code should not be trusted until it survives real toolchain checks</strong>. The pipeline uses <strong>NVIDIA NeMo Data Designer</strong> to generate structured Rust tasks and code, runs a <strong>Bonsai-8B-based LLM judge</strong> to score safety, performance, and idiomatic quality, then pushes every sample through a <strong>Tokio-powered Rust harness</strong> that runs <strong>cargo check</strong>, <strong>cargo test</strong>, <strong>clippy</strong>, and optional <strong>miri / fuzz / benchmark</strong> stages before exporting a final <strong>train.parquet</strong> dataset. On the current 30-sample run, the pipeline reports an average <strong>Bonsai score of 8.33 / 10</strong> but only a <strong>16.7% compile rate</strong> and <strong>6.7% test pass rate</strong>, which is exactly the result that makes the project valuable: it exposes the gap between LLM-perceived quality and actual compiler reality.
        </p>
      </div>

      <div style={{ background: '#f0f9ff', border: '1px solid #bae6fd', borderLeft: '4px solid #0284c7', borderRadius: '6px', padding: '18px 22px', margin: '0 0 28px' }}>
        <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.08em', color: '#0369a1', marginBottom: '12px', fontFamily: 'sans-serif' }}>Key Metrics</div>
        <p style={{ margin: 0, fontSize: '14.5px', lineHeight: 1.95, color: '#1e3a5f' }}>
          <strong>Samples:</strong> 30 · <strong>Domains:</strong> 7 observed in export · <strong>Avg Bonsai score:</strong> 8.33 / 10 · <strong>Compile rate:</strong> 16.7% · <strong>Test pass rate:</strong> 6.7% · <strong>Score range:</strong> 7.1 to 8.9
        </p>
      </div>

      <h2 style={paperSectionStyle}>1. Project Goal</h2>
      <p style={paperParaStyle}>
        Most synthetic-code pipelines stop too early. They generate code, maybe rank it with another model, and then call the dataset “high quality.” That is not enough for a language like Rust, where correctness depends on the borrow checker, crate feature flags, dependency setup, target architecture, and the actual behavior of <code>cargo</code>. NeMoSynthRust was built to turn that weakness into the central design principle.
      </p>
      <p style={paperParaStyle}>
        The goal is therefore not just to produce Rust snippets. It is to produce a dataset where every record carries <strong>generation metadata</strong>, <strong>judge scores</strong>, and <strong>real toolchain outcomes</strong>. That makes the export useful for multiple training regimes: you can train on style-rich data, filter down to “gold” compiling examples, or explicitly study the failure modes of synthetic code models.
      </p>

      <div style={paperFigureStyle}>
        <p style={paperFigureLabelStyle}>Figure 1. NeMoSynthRust dataset pipeline</p>
        <NeMoSynthRustPipelineDiagram />
      </div>

      <h2 style={paperSectionStyle}>2. Generation with NeMo Data Designer</h2>
      <p style={paperParaStyle}>
        The generation stage lives in <code>nemo-gen/generate.py</code> and is more structured than a loose prompt loop. It uses <strong>nemo_curator.synthetic.DataDesigner</strong> with <strong>categorical samplers</strong> for both <strong>domain</strong> and <strong>complexity</strong>, then builds a dedicated code-generation column configured for Rust. Domains are sampled across areas like <strong>algorithms</strong>, <strong>systems</strong>, <strong>wasm</strong>, <strong>async</strong>, <strong>error-handling</strong>, <strong>crates</strong>, <strong>concurrency</strong>, and <strong>unsafe</strong>, while complexity is distributed across beginner, intermediate, and advanced tasks.
      </p>
      <p style={paperParaStyle}>
        That matters because the project is deliberately targeting <strong>coverage</strong>, not just volume. The generator does not only say “write some Rust.” It creates a structured sample with a task prompt, code, domain label, complexity label, and dependency list. If NeMo Curator is unavailable, the pipeline falls back to an <strong>OpenAI-compatible backend</strong>, which makes the system usable with NVIDIA NIM or other drop-in inference endpoints.
      </p>
      <ul style={paperListStyle}>
        <li><strong>Structured schema:</strong> every sample is validated against a typed record model before it lands in JSONL.</li>
        <li><strong>Prompt discipline:</strong> the system prompt requires idiomatic Rust, doc comments, and at least one unit test.</li>
        <li><strong>Dependency awareness:</strong> sampled tasks carry crate requirements so the downstream evaluator can expose Cargo-level issues.</li>
      </ul>

      <h2 style={paperSectionStyle}>3. Bonsai-8B as Judge and Refiner</h2>
      <p style={paperParaStyle}>
        The second stage is what makes the pipeline more than raw NeMo generation. In <code>bonsai-judge</code>, each sample is scored by an LLM judge along three axes: <strong>safety</strong>, <strong>performance</strong>, and <strong>idiomatic style</strong>. The judge combines those with a weighted overall formula of <strong>0.4 / 0.3 / 0.3</strong>. If a sample falls below the configured threshold, the refiner can iterate on it up to <strong>three times</strong>. Records below the minimum keep threshold are dropped entirely.
      </p>
      <p style={paperParaStyle}>
        This stage is useful for two reasons. First, it turns free-form synthetic generation into a <strong>curated dataset construction process</strong>. Second, it gives the final export a soft notion of quality that can later be compared against hard compiler outcomes. In the current run, the judge is fairly generous: the average score is <strong>8.33</strong>, with values between <strong>7.1</strong> and <strong>8.9</strong>. That looks good on paper, and that is exactly why the later cargo results are so revealing.
      </p>

      <div style={paperFigureStyle}>
        <p style={paperFigureLabelStyle}>Figure 2. Judge score versus cargo reality</p>
        <NeMoJudgeRealityChart />
      </div>

      <h2 style={paperSectionStyle}>4. Cargo-Grounded Evaluation Harness</h2>
      <p style={paperParaStyle}>
        The strongest engineering move is the Rust harness. The <code>nemo-eval</code> CLI in <code>rust-harness</code> is not a wrapper around one shell command; it is a proper tool with subcommands for <strong>eval</strong>, <strong>bench</strong>, <strong>fuzz</strong>, <strong>export</strong>, and <strong>stats</strong>. The evaluation stage uses <strong>Tokio concurrency</strong> plus a semaphore to run multiple snippet checks in parallel, writes isolated temporary Cargo projects for each sample, and then applies the results back onto the record fields.
      </p>
      <p style={paperParaStyle}>
        That means every exported record can carry not only a prompt and code body, but also whether it <strong>compiles</strong>, whether tests <strong>pass</strong>, whether <strong>miri</strong> detects undefined behavior, what the <strong>cargo errors</strong> were, and how many <strong>clippy warnings</strong> appeared. That is the piece that makes the dataset genuinely interesting for model training and evaluation. It changes the project from “synthetic Rust generation” into <strong>compiler-supervised dataset curation</strong>.
      </p>

      <h2 style={paperSectionStyle}>5. Empirical Findings</h2>
      <p style={paperParaStyle}>
        The current export contains <strong>30 samples</strong>. The domain mix is led by <strong>async</strong> and <strong>error-handling</strong> with <strong>7 samples each</strong>, followed by <strong>crates</strong> with <strong>6</strong>, <strong>algorithms</strong> with <strong>5</strong>, <strong>concurrency</strong> with <strong>3</strong>, and single examples in <strong>systems</strong> and <strong>wasm</strong>. Complexity is distributed across <strong>13 intermediate</strong>, <strong>9 beginner</strong>, and <strong>8 advanced</strong> tasks.
      </p>
      <p style={paperParaStyle}>
        The most important result is the mismatch between judged quality and compiler success. Although the judge assigns a strong average score, only <strong>5 of 30</strong> samples compile and only <strong>2 of 30</strong> pass tests. At the domain level, <strong>algorithms</strong> reach a <strong>40%</strong> compile rate and <strong>20%</strong> test rate, while <strong>error-handling</strong> reaches <strong>28.6%</strong> compile and <strong>14.3%</strong> test. By contrast, <strong>async</strong>, <strong>crates</strong>, <strong>concurrency</strong>, and <strong>wasm</strong> all collapse to <strong>0%</strong> compile success in this run. The one <strong>systems</strong> sample compiles but still fails tests.
      </p>

      <div style={paperFigureStyle}>
        <p style={paperFigureLabelStyle}>Figure 3. Domain-level compile and test outcomes</p>
        <NeMoDomainOutcomeChart />
      </div>

      <h2 style={paperSectionStyle}>6. Failure Analysis</h2>
      <p style={paperParaStyle}>
        The report and pipeline notes make the failure modes concrete. The model often produces code that looks polished but relies on <strong>outdated crate APIs</strong>, omits required <strong>Cargo feature flags</strong>, assumes the wrong <strong>architecture</strong>, or breaks under classic Rust pain points like <strong>trait bounds</strong> and the <strong>borrow checker</strong>. Heavy dependency stacks also create timeout and cold-build problems for domains like wasm. This is precisely the kind of insight that vanishes if you only keep a judge score.
      </p>
      <ul style={paperListStyle}>
        <li><strong>Outdated APIs:</strong> legacy imports and old crate interfaces still look “good” to the judge but fail immediately under cargo.</li>
        <li><strong>Dependency semantics:</strong> missing Cargo feature flags are a major failure mode in async and crates-heavy tasks.</li>
        <li><strong>Toolchain mismatch:</strong> some snippets assume x86-specific capabilities or platform-specific behavior.</li>
        <li><strong>Rust semantics:</strong> ownership, lifetimes, and trait constraints remain much harder than stylistic fluency.</li>
      </ul>

      <h2 style={paperSectionStyle}>7. Why This Project Matters</h2>
      <p style={paperParaStyle}>
        NeMoSynthRust matters because it captures something a lot of synthetic-data projects miss: <strong>evaluation should sit inside the data pipeline, not after it</strong>. If you are training a code model, raw generations and soft judge scores are not enough. You need a way to distinguish style-only samples from semantically trustworthy ones. This pipeline gives you exactly that separation.
      </p>
      <p style={paperParaStyle}>
        From a portfolio standpoint, this is a flagship project because it shows three different strengths at once. It demonstrates <strong>data generation system design</strong>, <strong>LLM-based automated curation</strong>, and <strong>compiler-anchored evaluation infrastructure</strong>. It also produces a final asset that is actually usable: a HuggingFace-ready parquet dataset where training can be filtered by real quality signals instead of hand-wavy confidence scores.
      </p>

      <h2 style={paperSectionStyle}>References (Selected)</h2>
      <ul style={{ ...paperListStyle, fontSize: '13.5px', color: '#6b7280', lineHeight: 1.75 }}>
        <li>Local NeMoSynthRust experiment report, Makefile, Docker Compose pipeline, and design spec in <code>/Users/animesh/nemo</code>.</li>
        <li><code>nemo-gen/generate.py</code> for NeMo Data Designer generation and fallback OpenAI-compatible inference.</li>
        <li><code>bonsai-judge/pipeline.py</code> and <code>judge.py</code> for weighted scoring, refinement thresholds, and sample filtering.</li>
        <li><code>rust-harness/src/main.rs</code> and the exported parquet dataset for compiler-grounded evaluation results.</li>
      </ul>
    </div>
  )
}

function PocketHarveyProject() {
  return (
    <div style={{ fontFamily: 'Georgia, "Times New Roman", serif', color: '#1f2937' }}>
      <h1 style={{ fontSize: '27px', fontWeight: '700', lineHeight: 1.28, marginBottom: '10px', color: '#0f172a', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
        PocketHarvey: Offline Indian Legal Corpus Pipeline
      </h1>
      <p style={{ fontSize: '14.5px', color: '#6b7280', marginBottom: '4px', fontFamily: 'sans-serif' }}>
        Animesh Mishra · Legal-domain data preprocessing and curriculum design · 2026
      </p>
      <p style={{ fontSize: '13.5px', color: '#9ca3af', marginBottom: '32px', fontFamily: 'sans-serif' }}>
        Built from a local Colab notebook preprocessing pipeline for Bonsai-8B legal adaptation.
      </p>

      <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '18px 22px', marginBottom: '38px' }}>
        <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.1em', color: '#64748b', marginBottom: '10px', fontFamily: 'sans-serif' }}>Abstract</div>
        <p style={{ margin: 0, fontSize: '15px', lineHeight: 1.85, color: '#374151' }}>
          PocketHarvey is a full preprocessing and dataset-construction pipeline for an <strong>offline Indian legal corpus</strong> intended to specialize <strong>Bonsai-8B-mlx-1bit</strong>. The notebook does more than collect documents: it selects licensed sources, normalizes multilingual text, applies <strong>FineWeb-style quality heuristics</strong>, removes duplicates with <strong>SHA-256</strong> and <strong>MinHash LSH</strong>, assigns documents to a staged curriculum, generates grounded synthetic instruction pairs, and exports both pretraining and SFT-ready <strong>Parquet</strong> artifacts.
        </p>
      </div>

      <h2 style={paperSectionStyle}>1. Project Goal</h2>
      <p style={paperParaStyle}>
        The project targets a specific bottleneck in legal-domain model building: finding a path from messy public legal text to a <strong>usable, auditable, training-ready corpus</strong> without depending on commercial APIs or hidden internal datasets. The intended downstream use is not just retrieval, but actual <strong>continued pretraining and instruction tuning</strong> for an offline legal assistant.
      </p>
      <p style={paperParaStyle}>
        That makes the data pipeline itself the core contribution. Instead of treating preprocessing as a short cleanup step before modeling, the notebook treats it as a systems problem involving source quality, domain fit, deduplication, curriculum design, and export format discipline.
      </p>

      <h2 style={paperSectionStyle}>2. Source Strategy</h2>
      <p style={paperParaStyle}>
        The corpus is assembled from four source types. First, Indian judgments are pulled from <strong>joelniklaus/indian_legal_dataset</strong> and <strong>law-ai/ildc_multi</strong> to provide factual legal grounding from Supreme Court and High Court material. Second, a streamed sample from <strong>FineWebEdu</strong> is keyword-filtered for Indian legal topics so the corpus includes educational web explanations rather than only dense judgments. Third, manually authored seed texts are added for topics like <strong>RTI, tenancy, labour law, domestic violence, and police procedure</strong>, where plain-language public guidance matters. The notebook explicitly avoids data sources that are hard to reproduce or questionable to scrape.
      </p>
      <p style={paperParaStyle}>
        I like this source strategy because it balances legal authority with usability. Court text alone gives domain specificity but can be too dense for public-facing answers; educational text alone is easier to read but often less grounded. PocketHarvey tries to keep both.
      </p>

      <div style={paperFigureStyle}>
        <p style={paperFigureLabelStyle}>Figure 1. PocketHarvey preprocessing pipeline</p>
        <PocketHarveyPipelineDiagram />
      </div>

      <h2 style={paperSectionStyle}>3. Cleaning, Filtering, and Deduplication</h2>
      <p style={paperParaStyle}>
        The lower half of the notebook is built like a serious corpus recipe. It begins with <strong>ftfy-based unicode repair</strong>, whitespace normalization, minimum-length thresholds, and language filtering for <strong>English, Hindi, and Marathi</strong>. It then applies rule-based <strong>FineWeb-style quality heuristics</strong> such as symbol ratio, bullet ratio, short-line ratio, digit ratio, type-token ratio, and the presence of legal anchor terms. Those checks are important because court PDFs and scraped legal pages contain a lot of OCR debris, repeated headers, and semi-structured junk that can quietly poison training data.
      </p>
      <p style={paperParaStyle}>
        After quality filtering, the pipeline performs exact deduplication with <strong>SHA-256 hashes</strong> and then a second pass of near-deduplication using <strong>128-permutation MinHash</strong> with an <strong>LSH Jaccard threshold of 0.7</strong>. That is a practical adaptation of the same design philosophy behind Datatrove and FineWeb: first remove obvious copies cheaply, then remove fuzzy near-duplicates that would otherwise cause repeated judgments or mirrored statute pages to dominate the corpus.
      </p>

      <h2 style={paperSectionStyle}>4. Educational Scoring and Curriculum Design</h2>
      <p style={paperParaStyle}>
        A strong part of the notebook is the move from binary filtering to <strong>curriculum-aware scoring</strong>. Instead of only deciding whether a document survives, the pipeline computes a composite educational score from lexical diversity, explanatory vocabulary density, sentence-length behavior, common-word ratio, and document length. That score is then used to assign documents into three curriculum tiers.
      </p>
      <p style={paperParaStyle}>
        The interpretation is clear: <strong>Tier 1</strong> captures the most directly useful explanatory legal text, <strong>Tier 2</strong> captures moderately readable judgments and supporting material, and <strong>Tier 3</strong> keeps denser legal text in smaller volume so the model still sees real legal language without being overwhelmed by it. The final mix is explicitly staged at <strong>50% / 35% / 15%</strong>, which mirrors the notebook&apos;s SmolLM / Nemotron-inspired curriculum logic rather than using a uniform sample.
      </p>

      <div style={paperFigureStyle}>
        <p style={paperFigureLabelStyle}>Figure 2. Curriculum tiering and export logic</p>
        <PocketHarveyCurriculumDiagram />
      </div>

      <h2 style={paperSectionStyle}>5. Synthetic Instruction Data</h2>
      <p style={paperParaStyle}>
        The notebook does not stop at pretraining text. It also generates <strong>grounded synthetic instruction-response pairs</strong> for supervised fine-tuning. The synthetic step is intentionally conservative: it uses question templates tied to domains like RTI, consumer rights, labour law, tenancy, and arrest procedure; extracts answer spans directly from source documents; and appends a consistent <strong>NALSA legal disclaimer</strong>. Tier 1 documents generate two pairs each, while a capped sample of Tier 2 documents generates one pair each.
      </p>
      <p style={paperParaStyle}>
        That is a sensible compromise. It avoids hallucination-prone open-ended synthetic generation while still converting the corpus into a form usable for legal-help style SFT. In other words, the project understands that <strong>domain adaptation needs both a corpus and an interaction format</strong>.
      </p>

      <h2 style={paperSectionStyle}>6. Final Outputs</h2>
      <p style={paperParaStyle}>
        The notebook exports three final artifacts: <strong>pretrain_corpus.parquet</strong>, <strong>sft_corpus.parquet</strong>, and a <strong>dataset_card.json</strong> containing provenance, tier distribution, source distribution, and the mixing ratios used in the run. That matters because it turns the work into a reproducible pipeline rather than a notebook that only prints intermediate stats.
      </p>
      <p style={paperParaStyle}>
        From a portfolio perspective, this project is valuable because it shows a broader systems skill than model training alone. It combines dataset sourcing, document processing, heuristic filtering, approximate deduplication, scoring, synthetic data generation, and final export design into one coherent training-data pipeline. That is exactly the kind of work that decides whether a domain model can actually be trained responsibly.
      </p>

      <h2 style={paperSectionStyle}>7. Notebook</h2>
      <p style={paperParaStyle}>
        The full preprocessing notebook is embedded below so the actual pipeline can be inspected end to end. That includes the source-loading cells, heuristic filters, MinHash-LSH deduplication, scoring logic, synthetic-pair generation, and final export steps.
      </p>
      <p style={{ fontSize: '13.5px', color: '#9ca3af', marginBottom: '18px', fontFamily: 'sans-serif' }}>
        <a href="/pocketharvey-preprocessing-pipeline.html" target="_blank" rel="noopener noreferrer" style={{ color: '#3b6ea5', textDecoration: 'none' }}>
          Open rendered notebook
        </a>{' '}
        ·{' '}
        <a href="/pocketharvey-preprocessing-pipeline.ipynb" target="_blank" rel="noopener noreferrer" style={{ color: '#3b6ea5', textDecoration: 'none' }}>
          Download raw .ipynb
        </a>
      </p>

      <div style={paperFigureStyle}>
        <p style={paperFigureLabelStyle}>Embedded notebook</p>
        <iframe
          title="PocketHarvey preprocessing notebook"
          src="/pocketharvey-preprocessing-pipeline.html"
          loading="lazy"
          style={{ width: '100%', height: '840px', border: '1px solid #e5e7eb', borderRadius: '10px', background: '#ffffff' }}
        />
      </div>

      <h2 style={paperSectionStyle}>References (Selected)</h2>
      <ul style={{ ...paperListStyle, fontSize: '13.5px', color: '#6b7280', lineHeight: 1.75 }}>
        <li>PocketHarvey preprocessing notebook provided locally by the user.</li>
        <li>FineWeb / FineWebEdu data-filtering design as adapted in the notebook.</li>
        <li>Datatrove-style MinHash LSH deduplication and staged curriculum ideas from SmolLM / Nemotron-style recipes.</li>
      </ul>
    </div>
  )
}

function EVPredAIProject() {
  const screenshots: ProjectScreenshot[] = [
    {
      src: '/projects/evpredai-3.png',
      alt: 'EVPredAI dashboard screenshot',
      label: 'Dashboard',
      width: 2940,
      height: 1652,
    },
    {
      src: '/projects/evpredai-1.png',
      alt: 'EVPredAI proximity analysis screenshot',
      label: 'Proximity analysis',
      width: 2324,
      height: 1400,
    },
    {
      src: '/projects/evpredai-2.png',
      alt: 'EVPredAI chatbot screenshot',
      label: 'EVAI assistant',
      width: 1306,
      height: 1548,
    },
    {
      src: '/projects/evpredai-4.png',
      alt: 'EVPredAI amenities selection screenshot',
      label: 'Amenity selection',
      width: 770,
      height: 640,
    },
  ]

  return (
    <div style={{ fontFamily: 'Georgia, "Times New Roman", serif', color: '#1f2937' }}>
      <h1 style={{ fontSize: '27px', fontWeight: '700', lineHeight: 1.28, marginBottom: '10px', color: '#0f172a', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
        EVPredAI
      </h1>
      <p style={{ fontSize: '14.5px', color: '#6b7280', marginBottom: '4px', fontFamily: 'sans-serif' }}>
        Animesh Mishra · EV charging siting, geospatial scoring, and operator tooling · 2024
      </p>
      <p style={{ fontSize: '13.5px', color: '#9ca3af', marginBottom: '32px', fontFamily: 'sans-serif' }}>
        Repo-grounded project page ·{' '}
        <a href="https://github.com/amethystani/EVPredAI" target="_blank" rel="noopener noreferrer" style={{ color: '#3b6ea5', textDecoration: 'none' }}>
          github.com/amethystani/EVPredAI
        </a>
      </p>

      <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '18px 22px', marginBottom: '38px' }}>
        <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.1em', color: '#64748b', marginBottom: '10px', fontFamily: 'sans-serif' }}>Abstract</div>
        <p style={{ margin: 0, fontSize: '15px', lineHeight: 1.85, color: '#374151' }}>
          EVPredAI is an <strong>EV charging-site decision support system</strong> built around a practical question: how do you rank candidate charger locations in a way an operator can actually inspect? The public repository exposes a concrete geospatial prototype with <strong>OpenStreetMap amenity extraction</strong>, <strong>OpenCage geocoding</strong>, <strong>GeoPandas land filtering</strong>, <strong>weighted proximity scoring</strong>, <strong>RandomForest-based suitability estimation</strong>, <strong>Folium map generation</strong>, and an <strong>Ollama-backed EV assistant</strong>. The repository README also frames a broader Exicom-facing roadmap with richer forecasting, spatial-statistics analysis, and dashboard surfaces, which makes the project read as both a working siting engine and a larger product prototype.
        </p>
      </div>

      <div style={{ background: '#f0f9ff', border: '1px solid #bae6fd', borderLeft: '4px solid #0284c7', borderRadius: '6px', padding: '18px 22px', margin: '0 0 28px' }}>
        <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.08em', color: '#0369a1', marginBottom: '12px', fontFamily: 'sans-serif' }}>Repository Reading</div>
        <p style={{ margin: 0, fontSize: '14.5px', lineHeight: 1.85, color: '#1e3a5f' }}>
          The public code and the README sit at slightly different levels. The <strong>codebase</strong> implements the amenity-distance scoring prototype directly, while the <strong>README</strong> describes a broader Exicom product direction with forecasting, spatial clustering, and a fuller NLP stack. This page keeps that distinction explicit instead of flattening both into one generic claim.
        </p>
      </div>

      <h2 style={paperSectionStyle}>1. System Framing</h2>
      <p style={paperParaStyle}>
        EVPredAI is strongest when viewed as a <strong>site-review workflow</strong> rather than only a predictive model. The user does not just need one score; they need a chain of evidence. A charger operator wants to know whether a candidate location is on land, what amenities sit nearby, how strongly those amenities should matter, how the location compares against alternatives, and how that reasoning can be surfaced through a map or assistant interface.
      </p>
      <p style={paperParaStyle}>
        That is why the repository mixes geospatial code, model training, interactive mapping, and a conversational assistant. It is trying to turn a siting judgment into something <strong>inspectable and explainable</strong> instead of a hidden spreadsheet formula.
      </p>

      <div style={paperFigureStyle}>
        <p style={paperFigureLabelStyle}>Figure 1. EVPredAI geospatial siting workflow</p>
        <EVPredAIFlowDiagram />
      </div>

      <h2 style={paperSectionStyle}>2. Geospatial Feature Stack</h2>
      <p style={paperParaStyle}>
        The clearest implementation details live in <code>predictor.py</code>. The scoring engine starts from a fixed amenity vocabulary: <strong>restaurant</strong>, <strong>cafe</strong>, <strong>fast food</strong>, <strong>parking</strong>, <strong>bicycle parking</strong>, <strong>mall</strong>, <strong>supermarket</strong>, <strong>hotel</strong>, <strong>station</strong>, and <strong>highway service</strong>. For a candidate point, the code geocodes the location, queries nearby OpenStreetMap features with <strong>OSMnx</strong>, computes nearest-distance values, and rejects invalid ocean points using a <strong>GeoPandas world-land mask</strong>.
      </p>
      <p style={paperParaStyle}>
        Those raw distances are then converted into smoother proximity features with an <strong>exp(-distance / 1000)</strong> transform. That is a pragmatic design choice. It keeps very close amenities highly influential while avoiding a hard threshold that would make the score jump discontinuously. In practice, it turns “how far is the nearest parking or mall?” into a feature family the model can use much more gracefully.
      </p>
      <ul style={paperListStyle}>
        <li><strong>Geocoding:</strong> OpenCage resolves named locations into coordinates.</li>
        <li><strong>Spatial retrieval:</strong> OSMnx pulls amenity and shop features within a search radius.</li>
        <li><strong>Geometric validation:</strong> GeoPandas checks whether a candidate lies on land.</li>
        <li><strong>Map output:</strong> Folium renders the analyzed point, circles, and amenity proximity overlays for review.</li>
      </ul>

      <h2 style={paperSectionStyle}>3. Scoring and Training Logic</h2>
      <p style={paperParaStyle}>
        The public implementation uses a <strong>weighted amenity prior</strong> plus a <strong>RandomForestRegressor</strong>. Feature weights in the code bias the system toward things like <strong>parking</strong>, <strong>malls</strong>, and <strong>restaurants</strong>, then normalize those weights based on which features the operator chooses to include in a run. Training proceeds by building a suitability target from the weighted proximity representation, splitting the data into train and test sets, scaling inputs, fitting the forest, and returning <strong>feature importances</strong> along with train and test scores.
      </p>
      <p style={paperParaStyle}>
        The README describes a more ambitious top layer around that core: <strong>Bayesian-tuned boosted models</strong>, <strong>SARIMA-style temporal forecasting</strong>, and <strong>Moran&apos;s I / LISA spatial statistics</strong> for demand structure. Even though those pieces are more visible in the repo narrative than in the public predictor code, they are still useful context because they show where the siting engine was intended to grow: from amenity-sensitive suitability ranking into a fuller demand-forecasting platform.
      </p>

      <div style={paperFigureStyle}>
        <p style={paperFigureLabelStyle}>Figure 2. EVPredAI repo screenshots</p>
        <ProjectScreenshotGrid items={screenshots} />
      </div>

      <h2 style={paperSectionStyle}>4. Operator Assistant and Product Surface</h2>
      <p style={paperParaStyle}>
        The second half of the repo is the <strong>EVAI assistant</strong>. In <code>chat.py</code>, the system loads tabular EV data, batches it into context records, and sends user questions through a <strong>LangChain + Ollama</strong> wrapper with structured prompting. The prompt explicitly asks for markdown formatting, clear caveats, and region-level guidance when exact coordinates are missing. It also records helpfulness feedback into a CSV log, which turns the assistant into a lightweight human-in-the-loop interface rather than a one-shot demo.
      </p>
      <p style={paperParaStyle}>
        The README rounds that out with a product stack spanning <strong>React 18</strong>, <strong>TailwindCSS</strong>, <strong>Shadcn UI</strong>, <strong>Python services</strong>, geospatial tooling, and visualization libraries. That combination matters because EVPredAI is not just a notebook model. It is shaped like a deployable internal tool where maps, filters, and natural-language explanation all sit next to the ranking engine.
      </p>

      <h2 style={paperSectionStyle}>5. Why This Project Works</h2>
      <p style={paperParaStyle}>
        What makes EVPredAI interesting is not that it uses one exotic model. It is that it treats infrastructure placement as a <strong>compound engineering problem</strong>: geospatial enrichment, ranking logic, explainability, and operator UX all have to align. Even the current public implementation shows that mindset. It uses a simple enough feature space to remain interpretable, but packages it in a way that can still support a real siting workflow.
      </p>
      <p style={paperParaStyle}>
        That blend is valuable in practice. Site-placement tooling only becomes trusted when the output is easy to inspect and defend. EVPredAI moves in that direction by pairing score generation with map evidence and a conversational interface, which is exactly the kind of systems thinking that is more useful than a standalone benchmark number.
      </p>

      <h2 style={paperSectionStyle}>References (Selected)</h2>
      <ul style={{ ...paperListStyle, fontSize: '13.5px', color: '#6b7280', lineHeight: 1.75 }}>
        <li>EVPredAI README, <code>predictor.py</code>, and <code>chat.py</code> in the public repository.</li>
        <li>Repo screenshots from <code>public/image.png</code>, <code>image2.png</code>, <code>image3.png</code>, and <code>image4.png</code>.</li>
        <li>OpenStreetMap / OSMnx, GeoPandas, Folium, and LangChain/Ollama as implemented or documented in the repo materials.</li>
      </ul>
    </div>
  )
}

function NewSkyProject() {
  const screenshots: ProjectScreenshot[] = [
    {
      src: '/projects/newsky/home.png',
      alt: 'NewSky home screen screenshot',
      label: 'Home feed',
      width: 598,
      height: 1286,
    },
    {
      src: '/projects/newsky/topics.png',
      alt: 'NewSky topics screen screenshot',
      label: 'Topics',
      width: 596,
      height: 1288,
    },
    {
      src: '/projects/newsky/topnews.png',
      alt: 'NewSky top news screenshot',
      label: 'Top news',
      width: 596,
      height: 1290,
    },
    {
      src: '/projects/newsky/analytics.png',
      alt: 'NewSky analytics dashboard screenshot',
      label: 'Analytics',
      width: 600,
      height: 1294,
    },
  ]

  return (
    <div style={{ fontFamily: 'Georgia, "Times New Roman", serif', color: '#1f2937' }}>
      <h1 style={{ fontSize: '27px', fontWeight: '700', lineHeight: 1.28, marginBottom: '10px', color: '#0f172a', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
        NewSky / ClearSky
      </h1>
      <p style={{ fontSize: '14.5px', color: '#6b7280', marginBottom: '4px', fontFamily: 'sans-serif' }}>
        Animesh Mishra · conversational trend reader, digest generation, and mobile delivery · 2025
      </p>
      <p style={{ fontSize: '13.5px', color: '#9ca3af', marginBottom: '32px', fontFamily: 'sans-serif' }}>
        Repo-grounded project page ·{' '}
        <a href="https://github.com/amethystani/NewSky" target="_blank" rel="noopener noreferrer" style={{ color: '#3b6ea5', textDecoration: 'none' }}>
          github.com/amethystani/NewSky
        </a>
      </p>

      <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '18px 22px', marginBottom: '38px' }}>
        <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.1em', color: '#64748b', marginBottom: '10px', fontFamily: 'sans-serif' }}>Abstract</div>
        <p style={{ margin: 0, fontSize: '15px', lineHeight: 1.85, color: '#374151' }}>
          NewSky, branded as <strong>ClearSky</strong> in the repo materials, is a <strong>mobile-first conversational content product</strong> aimed at turning fast-moving trend streams into something readable. The interesting part is that the repository contains <strong>both</strong> a product narrative and a fairly substantial content pipeline: multi-category feed ingestion, metadata extraction, category-wise CSV and JSON export, <strong>Pegasus-based summarization</strong>, digest generation, and mobile UI / analytics mockups. That makes it more than a UI concept. It is part ingestion system, part summarization workflow, and part mobile reading experience.
        </p>
      </div>

      <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderLeft: '4px solid #22c55e', borderRadius: '6px', padding: '18px 22px', margin: '0 0 28px' }}>
        <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.08em', color: '#15803d', marginBottom: '12px', fontFamily: 'sans-serif' }}>Repository Reading</div>
        <p style={{ margin: 0, fontSize: '14.5px', lineHeight: 1.85, color: '#166534' }}>
          The repo’s README talks in BlueSky and conversational-trend terms, while the actual scripts implement a broader <strong>news and feed ingestion stack</strong>. I kept that tension visible on purpose because it shows the real shape of the project: a mobile reading product built on top of a serious content-collection and digest pipeline.
        </p>
      </div>

      <h2 style={paperSectionStyle}>1. Product Idea</h2>
      <p style={paperParaStyle}>
        The core idea is simple and good: people do not always want to read trends as formal articles. They want something closer to a friend catching them up. The repo README makes that positioning explicit by framing the product as a conversational interface over what is trending, with personalization, lightweight interaction, and a mobile-first reading flow.
      </p>
      <p style={paperParaStyle}>
        That framing matters because it changes what the system has to optimize for. It is not enough to ingest content; the output has to feel compact, legible, and intentionally rewritten for mobile consumption. NewSky therefore sits at the intersection of <strong>content engineering</strong>, <strong>summarization</strong>, and <strong>consumer product design</strong>.
      </p>

      <div style={paperFigureStyle}>
        <p style={paperFigureLabelStyle}>Figure 1. NewSky content and digest pipeline</p>
        <NewSkyFlowDiagram />
      </div>

      <h2 style={paperSectionStyle}>2. Ingestion and Structuring Layer</h2>
      <p style={paperParaStyle}>
        The most substantial implementation work appears in <code>webscraper.py</code>. That script is not a toy fetcher. It uses <strong>feedparser</strong> and <strong>cloudscraper</strong>, walks a large categorized source list, extracts article metadata and cleaned content, and saves multiple output forms per category. The source map spans politics, business, technology, science, health, entertainment, sports, world, environment, and education, with feeds from outlets such as <strong>Reuters</strong>, <strong>AP</strong>, <strong>BBC</strong>, <strong>TechCrunch</strong>, <strong>Nature</strong>, and <strong>The Guardian</strong>.
      </p>
      <p style={paperParaStyle}>
        The script also does the unglamorous but important work that makes downstream summarization usable: publication-date recovery, summary cleanup, extraction-success tracking, reading-time estimates, word-count statistics, sentiment fields, and category-level reports. The result is not just one merged blob of text. It is a structured corpus written out as <strong>full CSVs</strong>, <strong>simplified CSVs</strong>, <strong>JSON content files</strong>, and a generated <strong>summary report</strong>.
      </p>

      <h2 style={paperSectionStyle}>3. Summarization and Daily Digest</h2>
      <p style={paperParaStyle}>
        The summarization stack is visible in <code>train_model.py</code> and <code>generate_digest.py</code>. The project uses <strong>google/pegasus-cnn_dailymail</strong> as its seq2seq base, loads all category JSON files recursively, and even includes repair logic for malformed JSON before assembling the training or digest dataset. That detail is useful because it shows the repo was built around messy scraped content rather than idealized benchmark inputs.
      </p>
      <p style={paperParaStyle}>
        The digest launcher itself is simple but clear: it shells into a <strong>digest-only</strong> run that writes timestamped outputs into a target directory. The README then describes the intended user-facing layer on top of that infrastructure: categorized daily summaries with source attribution, publication timestamps, and a friendlier conversational tone than a traditional news app. In effect, the project is using a classic content-pipeline backbone to support a much softer consumer interface.
      </p>

      <div style={paperFigureStyle}>
        <p style={paperFigureLabelStyle}>Figure 2. NewSky mobile and analytics screens from the repo</p>
        <ProjectScreenshotGrid items={screenshots} />
      </div>

      <h2 style={paperSectionStyle}>4. Mobile Product Surface</h2>
      <p style={paperParaStyle}>
        The repo materials present a fairly complete app surface: home feed, topic browsing, top-news views, settings, analytics, notifications, offline state, and user personalization. The architecture notes describe services for <strong>authentication</strong>, <strong>content delivery</strong>, <strong>AI transformation</strong>, <strong>analytics</strong>, and <strong>push notifications</strong>, plus local storage and offline-friendly behavior on the client side. Even where the implementation notes mix Flutter-style and React-Native-style language, the high-level intent is consistent: this is designed as a mobile product, not just a script folder.
      </p>
      <p style={paperParaStyle}>
        The screenshots strengthen that story. They show that the project was thinking beyond ingestion and summarization into how trends should actually be presented, navigated, and measured once they reach a user. That analytics layer is especially important because it turns content formatting into something that can be iterated on rather than guessed.
      </p>

      <h2 style={paperSectionStyle}>5. Why This Project Matters</h2>
      <p style={paperParaStyle}>
        A lot of “AI news” projects stop at the prompt. NewSky is more interesting because it handles the steps around the prompt: ingestion, category organization, content cleanup, summarization, digest formatting, and mobile presentation. That is what makes the idea legible as a product instead of only a demo.
      </p>
      <p style={paperParaStyle}>
        From a portfolio standpoint, it is valuable because it shows systems breadth. The project spans data acquisition, content normalization, summarization-model tooling, reporting outputs, and user-facing mobile design. That is the kind of end-to-end build where the value comes from the pipeline as much as from the model.
      </p>

      <h2 style={paperSectionStyle}>References (Selected)</h2>
      <ul style={{ ...paperListStyle, fontSize: '13.5px', color: '#6b7280', lineHeight: 1.75 }}>
        <li>NewSky README, <code>project_structure.md</code>, <code>webscraper.py</code>, <code>train_model.py</code>, and <code>generate_digest.py</code> in the public repository.</li>
        <li>Repo screenshots from <code>assets/screenshots/home.png</code>, <code>topics.png</code>, <code>topnews.png</code>, and <code>analytics.png</code>.</li>
        <li>Pegasus summarization tooling and the categorized feed-ingestion/export pipeline documented in the repo.</li>
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
        {entry.title === 'Comprehensive Measurement System Analysis for Statistical Repeatability' ? (
          <StatisticalRepeatabilityPaper />
        ) : entry.title === 'Scholarly Bias in LLMs: Multi-Model Evaluation Platform' ? (
          <LLMBiasPaper />
        ) : entry.title === 'Byzantine-Robust Decentralized Federated Learning on Blockchain' ? (
          <BlockchainFLPaper />
        ) : entry.title === 'Multi-Agent Hyperbolic Framework for Legal Reasoning & Retrieval' ? (
          <LegalNexusPaper />
        ) : entry.title === 'BIPS-PKD: Backbone-Integrated Partial Split with Progressive Knowledge Distillation' ? (
          <BipsPkdPaper />
        ) : (
          <GenericResearchPaper entry={entry} />
        )}
      </div>
    </div>
  )
}

function ProjectOverlay({ idx, onClose }: { idx: number; onClose: () => void }) {
  const entry = projectEntries[idx]
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
          ← Projects
        </button>
        <span style={{ color: '#9ca3af', fontSize: '13px', fontFamily: 'sans-serif', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {entry.title}
        </span>
      </div>
      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '48px 32px 96px' }}>
        {entry.title === 'NeMoSynthRust' ? (
          <NeMoSynthRustProject />
        ) : entry.title === 'PocketHarvey: Offline Indian Legal Corpus Pipeline' ? (
          <PocketHarveyProject />
        ) : entry.title === 'EVPredAI' ? (
          <EVPredAIProject />
        ) : entry.title === 'NewSky' ? (
          <NewSkyProject />
        ) : (
          <GenericResearchPaper entry={entry} />
        )}
      </div>
    </div>
  )
}

function LegalOverlay({
  page,
  onClose,
  onSwitch,
}: {
  page: LegalPage
  onClose: () => void
  onSwitch: (nextPage: LegalPage) => void
}) {
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [])

  const title = page === 'imprint' ? 'Imprint' : 'Privacy Policy'

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: '#ffffff', overflowY: 'auto', overflowX: 'hidden' }}>
      <div
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 10,
          background: 'rgba(255,255,255,0.97)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid #e5e7eb',
          padding: '10px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          flexWrap: 'wrap',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
          <button
            onClick={onClose}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: 'none',
              border: '1px solid #e5e7eb',
              borderRadius: '6px',
              cursor: 'pointer',
              color: '#374151',
              fontSize: '13px',
              padding: '6px 14px',
              fontFamily: 'sans-serif',
            }}
          >
            ← Back
          </button>
          <span style={{ color: '#9ca3af', fontSize: '13px', fontFamily: 'sans-serif', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {title}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontFamily: 'sans-serif' }}>
          <button
            onClick={() => onSwitch('imprint')}
            style={{
              border: '1px solid #d1d5db',
              borderRadius: '999px',
              padding: '6px 12px',
              background: page === 'imprint' ? '#eff6ff' : 'transparent',
              color: page === 'imprint' ? '#1d4ed8' : '#475569',
              fontSize: '12px',
              cursor: 'pointer',
            }}
          >
            Imprint
          </button>
          <button
            onClick={() => onSwitch('privacy')}
            style={{
              border: '1px solid #d1d5db',
              borderRadius: '999px',
              padding: '6px 12px',
              background: page === 'privacy' ? '#eff6ff' : 'transparent',
              color: page === 'privacy' ? '#1d4ed8' : '#475569',
              fontSize: '12px',
              cursor: 'pointer',
            }}
          >
            Privacy Policy
          </button>
        </div>
      </div>

      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '48px 32px 96px', fontFamily: 'Georgia, "Times New Roman", serif', color: '#1f2937' }}>
        <h1 style={{ fontSize: '27px', fontWeight: '700', lineHeight: 1.28, marginBottom: '10px', color: '#0f172a', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
          {title}
        </h1>
        <p style={{ fontSize: '14.5px', color: '#6b7280', marginBottom: '4px', fontFamily: 'sans-serif' }}>
          Animesh Mishra · Personal portfolio website
        </p>
        <p style={{ fontSize: '13.5px', color: '#9ca3af', marginBottom: '32px', fontFamily: 'sans-serif' }}>
          Last updated for the current portfolio build.
        </p>

        {page === 'imprint' ? (
          <>
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '18px 22px', marginBottom: '38px' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.1em', color: '#64748b', marginBottom: '10px', fontFamily: 'sans-serif' }}>Operator Notice</div>
              <p style={{ margin: 0, fontSize: '15px', lineHeight: 1.85, color: '#374151' }}>
                This website is operated as a personal portfolio and research showcase. It is intended to present academic work, engineering projects, public profiles, and contact information in a structured format for recruiters, collaborators, and other professional visitors.
              </p>
            </div>

            <h2 style={paperSectionStyle}>1. Site Operator</h2>
            <p style={paperParaStyle}>
              The person responsible for this website and its editorial content is <strong>Animesh Mishra</strong>, based in <strong>Delhi, India</strong>. The portfolio is maintained directly by the site operator and is used to publish information about research, software engineering work, publications, project links, and selected professional background details.
            </p>
            <p style={paperParaStyle}>
              Primary contact: <a className="inline-link" href="mailto:am847@snu.edu.in">am847@snu.edu.in</a>. Public professional profiles linked from this website include{' '}
              <a className="inline-link" href="https://linkedin.com/in/animeshmishra0" target="_blank" rel="noopener noreferrer">LinkedIn</a> and{' '}
              <a className="inline-link" href="https://github.com/amethystani" target="_blank" rel="noopener noreferrer">GitHub</a>.
            </p>

            <h2 style={paperSectionStyle}>2. Scope Of The Website</h2>
            <p style={paperParaStyle}>
              This site is informational in nature. It does not offer paid subscriptions, public user accounts, community posting features, or transactional services. Its purpose is limited to presenting portfolio content and enabling direct contact through external links or the operator&apos;s published email address.
            </p>
            <p style={paperParaStyle}>
              Content on the website may include project descriptions, research summaries, links to third-party repositories, publication pages, resumes, and other professional materials. Some of that content necessarily reflects ongoing work, experiments, preprints, or public-facing summaries that may evolve over time.
            </p>

            <h2 style={paperSectionStyle}>3. Responsibility For Content</h2>
            <p style={paperParaStyle}>
              The operator is responsible for original content published directly on this website. Reasonable care is taken to keep technical and professional information current, but no guarantee is made that every page, date, metric, or external link will always remain complete, current, or error-free. Research summaries, in particular, may simplify methods or ongoing results for presentation purposes.
            </p>
            <p style={paperParaStyle}>
              If you believe any statement on this website is materially inaccurate, infringes rights, or should be clarified or removed, contact the operator using the email address above. Legitimate correction requests will be reviewed in good faith.
            </p>

            <h2 style={paperSectionStyle}>4. External Links And Third-Party Destinations</h2>
            <p style={paperParaStyle}>
              This website links to third-party platforms including GitHub, LinkedIn, arXiv, and other externally hosted destinations. Those sites are operated independently and maintain their own terms, availability, privacy practices, and data collection behavior. Following a link from this portfolio transfers you to the respective third-party service.
            </p>
            <p style={paperParaStyle}>
              The presence of an external link is intended as a reference or portfolio citation only. It should not be read as an endorsement of all content, security posture, or policies of the linked service.
            </p>

            <h2 style={paperSectionStyle}>5. Intellectual Property And Reuse</h2>
            <p style={paperParaStyle}>
              Unless otherwise indicated, the original text, layout decisions, portfolio summaries, and custom explanatory diagrams on this website are created for this portfolio and should not be reproduced at scale or republished as if authored by another party. Project names, research titles, repository names, third-party logos, and externally hosted assets remain subject to the rights of their respective owners.
            </p>
            <p style={paperParaStyle}>
              If you wish to reference or quote material from this site for professional or academic purposes, the preferred approach is to cite the relevant public repository, publication link, or contact the operator directly for permission where appropriate.
            </p>

            <h2 style={paperSectionStyle}>6. Technical Delivery</h2>
            <p style={paperParaStyle}>
              The site is delivered as a web application and may rely on hosting, CDN, or infrastructure providers to serve pages and static assets. Those providers may process ordinary network-level technical data required for secure delivery, such as IP address, request path, timestamp, user agent, and related server log information.
            </p>
            <p style={paperParaStyle}>
              This imprint page is meant to identify the operator and explain the editorial nature of the site. It is not intended to replace jurisdiction-specific legal advice. If a specific legal notice is required for a collaboration, removal request, or compliance inquiry, contact the operator directly.
            </p>
          </>
        ) : (
          <>
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '18px 22px', marginBottom: '38px' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.1em', color: '#64748b', marginBottom: '10px', fontFamily: 'sans-serif' }}>Privacy Summary</div>
              <p style={{ margin: 0, fontSize: '15px', lineHeight: 1.85, color: '#374151' }}>
                The portfolio is primarily informational. The application code for this site does not intentionally add analytics trackers, ad scripts, public user accounts, or portfolio-page cookie banners. The main personal data flow occurs if you choose to contact the operator or visit third-party links.
              </p>
            </div>

            <h2 style={paperSectionStyle}>1. What This Website Does</h2>
            <p style={paperParaStyle}>
              This website is a personal portfolio used to display professional information, research summaries, project links, a resume, and related materials. Visitors can browse content without creating an account and without submitting data through a public contact form on the portfolio page itself.
            </p>
            <p style={paperParaStyle}>
              Some interactive elements exist for navigation and presentation, such as tab switching, search filtering within the portfolio, and modal-style overlays for research pages and legal pages. These interactions are handled client-side for user experience and do not, by themselves, create a public profile for the visitor.
            </p>

            <h2 style={paperSectionStyle}>2. Data Processed When You Visit</h2>
            <p style={paperParaStyle}>
              Like most websites, technical request data may be processed by the hosting or delivery infrastructure in order to serve the page and maintain basic security. This can include information such as IP address, browser type, operating system, request time, referrer, requested URL, and similar log-level metadata.
            </p>
            <p style={paperParaStyle}>
              This site may also expose ordinary URL-level state when you use built-in navigation, such as the currently selected section hash or a search query string used to filter content on the portfolio page. That URL state is part of the browser request context and can therefore appear in standard access logs maintained by infrastructure providers.
            </p>

            <h2 style={paperSectionStyle}>3. Cookies, Tracking, And Analytics</h2>
            <p style={paperParaStyle}>
              Based on the current portfolio application code, this website does <strong>not intentionally deploy third-party analytics scripts, advertising trackers, or portfolio-page cookie consent tooling</strong>. It also does not intentionally create visitor accounts or persist personal marketing profiles.
            </p>
            <p style={paperParaStyle}>
              That said, standard browser behavior, hosting-layer caching, and third-party destinations you choose to open from this site may still involve their own cookies or logging mechanisms once you leave this portfolio or interact with external services.
            </p>

            <h2 style={paperSectionStyle}>4. Contact By Email</h2>
            <p style={paperParaStyle}>
              If you contact the operator through the published email address, the personal data you provide in that email will be processed for the purpose of reviewing and responding to your message. This can include your name, email address, organization, message content, attachments, and any other information you choose to include.
            </p>
            <p style={paperParaStyle}>
              Email communication is handled outside the portfolio application itself and will be subject to the practices of the mail providers and clients involved in sending and receiving the message.
            </p>

            <h2 style={paperSectionStyle}>5. External Links And Embedded Destinations</h2>
            <p style={paperParaStyle}>
              This portfolio contains links to third-party services such as GitHub, LinkedIn, arXiv, and other external resources. When you click those links, you leave this site and interact directly with the destination service. That service may collect usage data according to its own policies and technical setup.
            </p>
            <p style={paperParaStyle}>
              Visitors should review the privacy and terms documentation of the relevant third-party platform when using those services. This website does not control third-party processing once you move outside the portfolio domain.
            </p>

            <h2 style={paperSectionStyle}>6. Data Retention And Correction Requests</h2>
            <p style={paperParaStyle}>
              The portfolio itself is designed to minimize personal data collection. Any data retained by the operator will usually arise only from direct communications, administrative follow-up, or ordinary technical hosting logs maintained for reliability and abuse prevention.
            </p>
            <p style={paperParaStyle}>
              If you want to request correction or removal of personal information displayed on the site, or if you want to ask how a direct communication has been handled, contact <a className="inline-link" href="mailto:am847@snu.edu.in">am847@snu.edu.in</a>. Requests will be reviewed in good faith and addressed where appropriate.
            </p>

            <h2 style={paperSectionStyle}>7. Policy Scope</h2>
            <p style={paperParaStyle}>
              This privacy policy describes the portfolio as it is currently implemented in this codebase. If the application later adds analytics, forms, authentication, newsletters, file uploads, or other new processing features, this notice should be updated to reflect those changes before relying on it as a complete statement of data handling.
            </p>
          </>
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
  const [expandedProjectIdx, setExpandedProjectIdx] = useState<number | null>(null)
  const [expandedLegalPage, setExpandedLegalPage] = useState<LegalPage | null>(null)

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

  const pageTitle = searchQuery ? 'Search' : activeTab === 'home' ? 'Animesh Mishra' : navLinks.find((link) => link.id === activeTab)?.name

  const pageSubtitle = searchQuery
    ? `Matching sections for "${searchQuery}".`
    : heroCopy[activeTab]

  return (
    <div
      ref={scrollContainerRef}
      className="portfolio-root"
      style={{
        display: 'flex',
        flexDirection: 'column',
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
          justify-content: center;
          background: rgba(12, 16, 20, 0.92);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-bottom: 1px solid rgba(255,255,255,0.08);
          width: 100%;
        }
        .nav-inner {
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
          align-items: center;
          width: min(1040px, calc(100% - 24px));
          gap: 20px;
          padding: 14px 0;
        }
        .nav-brand {
          justify-self: start;
          color: #ffffff;
          font-size: 18px;
          font-weight: 500;
          letter-spacing: -0.01em;
          white-space: nowrap;
        }
        .nav-links {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: center;
          gap: 24px;
        }
        .nav-link {
          border: none;
          background: none;
          padding: 0;
          margin: 0;
          color: #97a3ad;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: color 0.2s ease, transform 0.2s ease;
        }
        .nav-link:hover {
          color: #ffffff;
          transform: translateY(-1px);
        }
        .nav-link.active {
          color: #ffffff;
          font-weight: 600;
        }
        .nav-search {
          position: relative;
          justify-self: end;
          width: min(220px, 100%);
        }
        .nav-search-input {
          width: 100%;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 6px;
          background: rgba(255, 255, 255, 0.06);
          color: #ffffff;
          padding: 8px 12px 8px 32px;
          font-size: 13px;
          outline: none;
          transition: background 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
        }
        .nav-search-input:focus {
          background: rgba(255, 255, 255, 0.1);
          border-color: #3b82f6;
          box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
        }
        .page-hero {
          background: #567c9a;
          color: #ffffff;
          padding: 52px 20px 56px;
          text-align: center;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }
        .page-hero-inner {
          width: min(1040px, calc(100% - 24px));
          margin: 0 auto;
        }
        .page-hero h1 {
          margin: 0;
          font-size: clamp(42px, 7vw, 60px);
          font-weight: 300;
          letter-spacing: -0.01em;
        }
        .page-hero p {
          max-width: 740px;
          margin: 16px auto 0;
          font-size: 16px;
          line-height: 1.75;
          color: rgba(255, 255, 255, 0.92);
          font-weight: 400;
        }
        .hero-links {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 18px;
        }
        .hero-link-item {
          color: rgba(255, 255, 255, 0.96);
          font-size: 13px;
          font-weight: 600;
          text-decoration: none;
          transition: opacity 0.18s ease;
        }
        .hero-link-item:hover {
          opacity: 0.8;
          text-decoration: underline;
          text-underline-offset: 3px;
        }
        .hero-link-separator {
          color: rgba(255, 255, 255, 0.55);
          font-size: 13px;
        }
        .page-content {
          flex: 1 0 auto;
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
        .experience-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 22px;
        }
        .experience-card {
          display: flex;
          flex-direction: column;
          gap: 18px;
          min-height: 214px;
          padding: 22px;
          border: 1px solid #e5ebf0;
          border-radius: 20px;
          background: linear-gradient(180deg, #ffffff 0%, #f7fafc 100%);
          box-shadow: 0 12px 28px rgba(15, 23, 42, 0.06);
        }
        .experience-card-top {
          display: grid;
          grid-template-columns: 78px minmax(0, 1fr) auto;
          align-items: center;
          gap: 16px;
        }
        .experience-logo-wrap {
          width: 78px;
          height: 78px;
          padding: 12px;
          border-radius: 18px;
          border: 1px solid #e2e8f0;
          background: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }
        .experience-logo {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
        .experience-card-heading {
          min-width: 0;
        }
        .experience-company {
          margin: 0 0 6px;
          color: #4a7b9f;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }
        .experience-role {
          margin: 0;
          color: #1f2a33;
          font-size: 18px;
          line-height: 1.4;
          font-weight: 600;
        }
        .experience-timeline {
          align-self: start;
          justify-self: end;
          padding: 8px 12px;
          border-radius: 999px;
          border: 1px solid #d8e3ec;
          background: #eef4f8;
          color: #48657a;
          font-size: 11.5px;
          font-weight: 600;
          white-space: nowrap;
          font-family: "SF Mono", "Fira Mono", Menlo, monospace;
        }
        .experience-summary-copy {
          margin: auto 0 0;
          padding-top: 16px;
          border-top: 1px solid #e8eef3;
          color: #52616d;
          font-size: 14px;
          line-height: 1.7;
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
          color: #2563eb;
          font-size: 15px;
          text-decoration: none;
          transition: color 0.15s ease;
        }
        .inline-link:hover {
          color: #1d4ed8;
          text-decoration: underline;
          text-underline-offset: 3px;
        }
        .footer {
          margin-top: auto;
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
          .nav-inner {
            display: flex;
            flex-direction: column;
            align-items: stretch;
            padding: 14px 12px;
          }
          .nav-brand {
            align-self: flex-start;
          }
          .nav-links {
            width: 100%;
            justify-content: flex-start;
            gap: 14px;
          }
          .nav-search {
            width: 100%;
            justify-self: auto;
          }
          .experience-grid {
            grid-template-columns: 1fr;
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
            padding: 40px 16px 44px;
          }
          .page-hero p {
            font-size: 15px;
          }
          .experience-card {
            min-height: 0;
            padding: 18px;
          }
          .experience-card-top {
            grid-template-columns: 72px minmax(0, 1fr);
            align-items: start;
          }
          .experience-logo-wrap {
            width: 72px;
            height: 72px;
          }
          .experience-timeline {
            grid-column: 1 / -1;
            justify-self: start;
            margin-top: 2px;
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
        <div className="nav-inner">
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
          </div>
          <div className="nav-search">
            <svg
              style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', stroke: '#a0aec0' }}
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
            <HeroActionLinks links={homeLinks} />
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
                  <p className="document-text">India</p>
                </div>
              </li>
              <li className="document-row">
                <div className="document-stamp">Email</div>
                <div className="document-body">
                  <p className="document-text">
                    <a className="inline-link" href="mailto:am847@snu.edu.in">am847@snu.edu.in</a>
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
              I work at the intersection of machine learning systems, data engineering, and research implementation. Most of my work has focused on building end-to-end pipelines, evaluation-heavy workflows, and applied AI systems that have to be useful outside a notebook.
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
            <div className="experience-grid">
              {experienceEntries.map((entry) => (
                <ExperienceCard key={`${entry.stamp}-${entry.title}`} entry={entry} />
              ))}
            </div>
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
              {projectEntries.map((entry, idx) => (
                <EntryRow
                  key={`${entry.stamp}-${entry.title}`}
                  entry={entry}
                  compact
                  titleOnly
                  expandLabel="Open project →"
                  onExpand={() => setExpandedProjectIdx(idx)}
                />
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
      </main>

      <footer className="footer">
        <div>&copy; {new Date().getFullYear()} Animesh Mishra</div>
        <div className="footer-links">
          <button className="footer-link" onClick={() => setExpandedLegalPage('imprint')}>Imprint</button>
          <button className="footer-link" onClick={() => setExpandedLegalPage('privacy')}>Privacy Policy</button>
          <a className="footer-link" href="https://github.com/amethystani" target="_blank" rel="noopener noreferrer">GitHub</a>
        </div>
      </footer>
      {expandedResearchIdx !== null ? (
        <ResearchOverlay idx={expandedResearchIdx} onClose={() => setExpandedResearchIdx(null)} />
      ) : null}
      {expandedProjectIdx !== null ? (
        <ProjectOverlay idx={expandedProjectIdx} onClose={() => setExpandedProjectIdx(null)} />
      ) : null}
      {expandedLegalPage !== null ? (
        <LegalOverlay page={expandedLegalPage} onClose={() => setExpandedLegalPage(null)} onSwitch={setExpandedLegalPage} />
      ) : null}
    </div>
  )
}
