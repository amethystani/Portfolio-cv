'use client';
import React, { useEffect, useRef, useState } from 'react';

const navLinks = [
  { name: 'Home', id: 'home' },
  { name: 'About', id: 'about' },
  { name: 'Experience', id: 'experience' },
  { name: 'Research', id: 'research' },
  { name: 'Projects', id: 'projects' },
  { name: 'Skills', id: 'skills' }
];

const CLERKTREE_SNAPSHOT_URL = 'https://image.thum.io/get/width/1400/crop/2200/https://clerktree.com';

const contentIndex = {
  home: "Welcome Hi, I'm Animesh! Click on the navigation tabs above to explore my background, experience, research, and projects in a distinct sub-view without scrolling endlessly. I am always open to interesting projects, collaborations, and opportunities. You can reach out to me directly at: am847@snu.edu.in LinkedIn Profile GitHub Account Animesh Mishra Delhi, India",
  about: "Education B.Tech in Computer Science and Engineering Expected 2026 Shiv Nadar Institution of Eminence CGPA: 7.34 Class XII (ISC) 2022 City Montessori School 91.25% Class X (ICSE) 2020 City Montessori School 94.00%",
  experience: "Experience Student Researcher (Part-time) May 2025 – Sep 2025 Complexity Science Hub Vienna, Austria (Remote) Engineered a reproducible Python ETL to ingest and enrich physics-literature data from OpenAlex and APS APIs. Built joined research-graph tables across authors, institutions, fields, and time. Added demographic annotations for downstream bias slicing. Built a batched LLM evaluation harness to run parallel factuality and validity audits across 3 open-source models (Gemma 2 9B, LLaMA 3, Mixtral 8x7B). Standardized prompts and outputs to enable apples-to-apples comparisons. Implemented Evaluator and Auditor modules to compute error-rate and consistency metrics and graph-based similarity features from co-authorship networks. Quant Research Analyst Intern Jun 2025 – Aug 2025 ConsultAdd Services Pvt. Ltd. Pune, Maharashtra Designed and deployed high-volume data scraping pipelines for market intelligence, extracting over 500K records on unpartnered staffing firms. Constructed and backtested time-series predictive models (Prophet, XGBoost) to forecast staffing demand and role saturation over a 12-month horizon. Intern (DCT-R&D Department) Sep 2024 – Dec 2024 Exicom Group Developed Time-Series Predictive Models and an AI Assistant (EVAI) to forecast Electric Vehicle (EV) charging demand. Engineered a comprehensive Geospatial Feature Engineering Pipeline using OpenStreetMap, Folium, and GeoPandas to analyze charger placement optimization. Implemented an efficient MLOps workflow, including LangChain integration and containerized deployment via Ollama. Research Intern (Institute for Systems Studies and Analyses) May 2024 – Jul 2024 Defence Research & Development Organisation Designed and implemented a custom Genetic Algorithm (GA) with specialized fitness functions and mutation operators to solve a high-dimensional, constrained Vehicle Routing Problem (VRP). Used DBSCAN/K-Means clustering to segment complex mobility patterns, generating geospatial heatmap visualizations.",
  research: "Research & Publications Spectral Sentinel: Scalable Byzantine-Robust Decentralized Federated Learning via Sketched Random Matrix Theory on Blockchain 2025 Preprint / Systems + ML Designed an RMT-driven Byzantine detector by tracking gradient covariance eigenspectra against the Marchenko–Pastur law (KS test + tail anomalies), and scaled detection via Frequent Directions sketching with O(k²) memory for k<d. Proved (ε, δ)-Byzantine resilience with minimax-optimal convergence O(σf/√T + f²/T), and validated on Polygon testnet/mainnet. Reliability Analysis of Non-Bonded/Re-usable PZT Sensors for EMI-based SHM 2024 Elsevier Measurement (In Review) / Structural Health Monitoring Built a reliability/measurement-system framework for electromechanical impedance (EMI) signals across surface-bonded vs clamp-based PZT attachments. Quantified clamp-tightening regimes (free-free/open/partial/fully bonded), showing fully bonded clamp achieves ICC = 0.993 meeting AIAG acceptance. A Multi-Agent Hyperbolic Framework for Legal Reasoning and Retrieval 2025 Research Paper / Legal AI, Geometric Deep Learning Built Hyperbolic Legal Networks (HGCN) by embedding 49,633 cases in a Poincaré ball to encode court authority radially, achieving 0.92 Precision@5 on legal retrieval. Designed a game-theoretic multi-agent pipeline with Nash-style coordination to resolve contradictory citations, and integrated adversarial hybrid retrieval. Neuro-Scheduling for Graph Segmentation (NSGS) 2024 CVPR '26 Submission / Neuromorphic Computing Designed an event-driven neuromorphic graph segmentation (NSGS) framework that models image regions as asynchronous computational units, facilitating inherent parallelism and reducing redundant operations by 38–62%. Achieved a 17.5x speedup and superior accuracy (65.8% avg. mIoU) over state-of-the-art models (YOLOv8m-seg).",
  projects: "Projects ClerkTree AI-powered workflow automation platform claims back-office operations clerktree.com AWS EKS Apache Kafka FastAPI Mixtral Gemini Pro agentic workflows Neuro-Scheduling Graph Segmentation NSGS BIPS-PKD neuromorphic event-driven image segmentation CVPR 26 60.8x speedup EfficientSAM SegFormer Mask2Former SAM2 PIDNet YOLOv8 DINOv3 Android ONNX PyTorch C++ SpikeQueue thermal scheduling knowledge distillation backbone split progressive Spectral Sentinel Byzantine-Robust Federated Learning Blockchain Random Matrix Theory Marchenko-Pastur Frequent Directions sketching Polygon arXiv 2512.12617 78.4 accuracy 38 Byzantine tolerance 1034x memory reduction phase transition sigma federated EVPredAI EV charging demand forecasting placement Exicom XGBoost Bayesian Moran SARIMA BERT LoRA LangChain Ollama NeMo DataDesigner GeoPandas Folium FAISS TAPAS 85 user satisfaction 10 feature dimensions 100 concurrent queries LegalNexus Hyperbolic Graph Networks Poincare ball HGCN court authority multi-agent Nash game-theoretic BM25 legal retrieval 0.92 Precision 49633 cases 94 conflict resolution Tiny Recursive Models TRM arXiv 2510.04871 FlashAttention-2 Triton kernels SmolLM Nemotron FineWebEDU FinePDFs constant VRAM recurrence NewSky Bluesky API topic clustering summarization Flutter PostgreSQL Docker Kubernetes daily digest",
  skills: "Technical Skills Achievements Languages Python SQL Java LaTeX Pretraining Data Corpus Datatrove FineWeb FineWebEDU FinePDFs NeMo DataDesigner SmolLM Nemotron CommonCrawl deduplication quality filtering Machine Learning PyTorch Triton kernels FlashAttention-2 Scikit-learn XGBoost ONNX Runtime HuggingFace Transformers LangChain Gymnasium Ollama LLM Frameworks Evaluation Ablations multi-model ablation harnesses LLM-as-judge factuality validity ICC ANOVA benchmark design Distributed Data Kafka Dask Spark ETL web scraping Development FastAPI Docker Kubernetes AWS EKS Redis Flutter Git Data Science Pandas NumPy GeoPandas Matplotlib NetworkX Folium Scholastic Achievements Bitcoin Talents Program Frankfurt School Blockchain Center Harvard Aspire Institute Leadership Program TestAS 102 HPAIR Certificate Appreciation Defence Minister India Key Courses Data Structures Algorithms Artificial Intelligence Reinforcement Learning Digital Image Processing Robotics Social Information Networks Operating Systems Database Systems Computer Networks Distributed Systems Applied Linear Algebra Probability Statistics Discrete Math Theory of Computation"
};

const validTabs = new Set(navLinks.map((link) => link.id));

function getTabFromHash(hash: string): string {
  const normalized = hash.replace(/^#/, '').trim().toLowerCase();
  return validTabs.has(normalized) ? normalized : 'home';
}

function readLocationState(): { tab: string; search: string } {
  return {
    tab: getTabFromHash(window.location.hash),
    search: new URLSearchParams(window.location.search).get('q') ?? '',
  };
}

function buildLocationUrl(tab: string, search: string): string {
  const params = new URLSearchParams(window.location.search);

  if (search) params.set('q', search);
  else params.delete('q');

  const nextSearch = params.toString();
  return `${window.location.pathname}${nextSearch ? `?${nextSearch}` : ''}#${tab}`;
}

export default function PortfolioClient() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [hasSyncedLocation, setHasSyncedLocation] = useState(false);

  const scrollPortfolioToTop = (behavior: ScrollBehavior = 'auto') => {
    scrollContainerRef.current?.scrollTo({ top: 0, behavior });
    window.scrollTo({ top: 0, behavior });
  };

  useEffect(() => {
    const syncFromLocation = () => {
      const { tab, search } = readLocationState();

      setActiveTab(tab);
      setSearchQuery(search);
      setHasSyncedLocation(true);
      requestAnimationFrame(() => scrollPortfolioToTop('auto'));
    };

    syncFromLocation();
    window.addEventListener('popstate', syncFromLocation);

    return () => {
      window.removeEventListener('popstate', syncFromLocation);
    };
  }, []);

  useEffect(() => {
    if (!hasSyncedLocation) return;

    window.history.replaceState(null, '', buildLocationUrl(activeTab, searchQuery));
  }, [activeTab, hasSyncedLocation, searchQuery]);

  useEffect(() => {
    if (!hasSyncedLocation) return;
    requestAnimationFrame(() => scrollPortfolioToTop('auto'));
  }, [activeTab, hasSyncedLocation]);

  const matchQuery = (tab: string) => {
    if (!searchQuery) return activeTab === tab;
    return contentIndex[tab as keyof typeof contentIndex].toLowerCase().includes(searchQuery.toLowerCase());
  };

  const hasResults = searchQuery ? navLinks.some(link => matchQuery(link.id)) : true;

  const activateTab = (tabId: string) => {
    setActiveTab(tabId);
    setSearchQuery('');
    window.history.pushState(null, '', buildLocationUrl(tabId, ''));
    scrollPortfolioToTop('smooth');
  };

  return (
    <div
      ref={scrollContainerRef}
      className="portfolio-root"
      style={{ height: '100dvh', minHeight: '100dvh', overflowY: 'auto', overflowX: 'hidden', WebkitOverflowScrolling: 'touch', backgroundColor: '#fff', color: '#333', fontFamily: '-apple-system, BlinkMacSystemFont, \"Segoe UI\", Helvetica, Arial, sans-serif' }}
    >
      <style>{`
        .portfolio-root {
          scroll-behavior: smooth;
          overscroll-behavior-y: contain;
          background:
            radial-gradient(circle at top, rgba(39, 112, 147, 0.12), transparent 28%),
            linear-gradient(180deg, #f7fbfd 0%, #ffffff 24%, #f8fafb 100%);
        }
        .nav-link {
          color: #bebebe;
          text-decoration: none;
          font-weight: 400;
          transition: color 0.2s ease, text-shadow 0.2s ease, transform 0.2s ease;
          font-size: 14px;
          background: none;
          border: none;
          cursor: pointer;
          outline: none;
          padding: 0;
        }
        .nav-link:hover {
          color: #fff;
          text-shadow: 0 0 8px rgba(255,255,255,0.4);
          transform: translateY(-1px);
        }
        .nav-link.active {
          color: #fff;
          font-weight: 600;
        }
        .nav-search-input {
          background-color: #1a1a1a;
          border: 1px solid #333;
          border-radius: 16px;
          padding: 8px 10px 8px 32px;
          color: #fff;
          font-size: 13px;
          width: clamp(132px, 17vw, 188px);
          outline: none;
          transition: width 0.24s ease, border-color 0.24s ease, background-color 0.24s ease;
        }
        .nav-search-input:focus {
          width: clamp(172px, 24vw, 240px);
          border-color: #555;
          background-color: #111;
        }
        .custom-anchor {
          color: #277093;
          text-decoration: none;
          border-bottom: 1px solid transparent;
          transition: border-bottom 0.2s;
          font-weight: 500;
        }
        .custom-anchor:hover {
          border-bottom: 1px solid #277093;
        }
        .search-status {
          overflow-wrap: anywhere;
          word-break: break-word;
        }
        .project-card {
          padding: 24px;
          border-radius: 16px;
          border: 1px solid #eaeaea;
          background: linear-gradient(180deg, #fbfbfb 0%, #f4f6f8 100%);
          transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
        }
        .project-card-wide {
          grid-column: 1 / -1;
        }
        .project-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 16px 30px rgba(0,0,0,0.07);
          border-color: #d9e5ec;
        }
        .project-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin: 14px 0 18px;
        }
        .project-pill {
          padding: 6px 10px;
          border-radius: 999px;
          background: #eef4f8;
          color: #44606d;
          font-size: 12px;
          font-weight: 600;
          white-space: normal;
          overflow-wrap: anywhere;
        }
        .project-feature-layout {
          display: grid;
          grid-template-columns: minmax(0, 1.05fr) minmax(320px, 0.95fr);
          gap: 22px;
          align-items: start;
        }
        .project-points {
          margin: 0;
          padding-left: 18px;
          color: #44515a;
          line-height: 1.7;
        }
        .project-points li + li {
          margin-top: 10px;
        }
        .project-embed-shell {
          border-radius: 18px;
          border: 1px solid #dce7ee;
          background: linear-gradient(180deg, #f6fafc 0%, #ffffff 100%);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.9);
          display: flex;
          justify-content: center;
          padding: 18px;
        }
        .project-embed-image {
          width: 100%;
          max-width: 760px;
          height: auto;
          display: block;
          border-radius: 16px;
          background: #fff;
          box-shadow: 0 18px 42px rgba(15, 23, 42, 0.14);
        }
        .project-card-header {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
          margin-bottom: 12px;
        }
        .project-type-badge {
          display: inline-flex;
          align-items: center;
          padding: 3px 9px;
          border-radius: 999px;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.07em;
          text-transform: uppercase;
          white-space: normal;
          overflow-wrap: anywhere;
        }
        .project-type-badge.research {
          background: rgba(79, 91, 213, 0.1);
          color: #4f5bd5;
        }
        .project-type-badge.internship {
          background: rgba(39, 112, 147, 0.1);
          color: #277093;
        }
        .project-type-badge.startup {
          background: rgba(196, 126, 26, 0.1);
          color: #c47e1a;
        }
        .project-type-badge.side-project {
          background: rgba(74, 124, 89, 0.1);
          color: #4a7c59;
        }
        .project-venue-badge {
          display: inline-flex;
          align-items: center;
          padding: 3px 9px;
          border-radius: 999px;
          font-size: 11px;
          font-weight: 500;
          background: #f0f4f8;
          color: #556677;
          white-space: normal;
          overflow-wrap: anywhere;
        }
        .project-metric-row {
          display: flex;
          flex-wrap: wrap;
          gap: 7px;
          margin: 8px 0 14px;
        }
        .project-metric-chip {
          font-family: 'SF Mono', 'Fira Mono', 'Cascadia Code', monospace;
          font-size: 12px;
          font-weight: 600;
          padding: 4px 10px;
          border-radius: 6px;
          background: #f0f4f8;
          color: #2d4a5a;
          border: 1px solid #dce7ee;
          white-space: normal;
          overflow-wrap: anywhere;
        }
        .project-link-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 5px 11px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 500;
          color: #277093;
          border: 1px solid #c0d9e6;
          text-decoration: none;
          transition: background 0.18s, color 0.18s;
          white-space: normal;
          overflow-wrap: anywhere;
        }
        .project-link-badge:hover {
          background: #277093;
          color: #fff;
          border-color: #277093;
        }
        .project-links-row {
          display: flex;
          gap: 8px;
          margin-top: 16px;
          flex-wrap: wrap;
        }
        .project-card.type-research {
          border-top: 3px solid #4f5bd5;
        }
        .project-card.type-internship {
          border-top: 3px solid #277093;
        }
        .project-card.type-startup {
          border-top: 3px solid #c47e1a;
        }
        .project-card.type-side {
          border-top: 3px solid #4a7c59;
        }
        .content-shell {
          width: min(1100px, calc(100% - 32px));
          margin: 0 auto;
          padding: clamp(32px, 4vw, 60px) clamp(8px, 2vw, 20px) 72px;
          display: flex;
          flex-direction: column;
          gap: 32px;
        }
        .section-panel {
          padding: clamp(24px, 3vw, 36px);
          border-radius: 24px;
          background: linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(247,250,252,0.96) 100%);
          border: 1px solid rgba(210, 223, 232, 0.8);
          box-shadow: 0 18px 44px rgba(16, 24, 40, 0.06);
          animation: panel-enter 0.28s ease;
        }
        .section-list {
          list-style-type: none;
          padding: 0;
          margin: 0;
        }
        .hero-inner {
          width: min(980px, calc(100% - 40px));
          margin: 0 auto;
        }
        .hero-subtitle {
          margin: 16px auto 0;
          font-size: 18px;
          color: #e0f0f5;
          font-weight: 300;
          max-width: 720px;
        }
        .hero-location {
          margin-top: 12px;
          font-size: 16px;
          color: #f1f8fb;
          font-weight: 400;
        }
        .contact-links {
          display: flex;
          gap: 16px;
          justify-content: center;
          flex-wrap: wrap;
        }
        .skills-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(min(100%, 240px), 1fr));
          gap: 16px;
          margin-bottom: 36px;
        }
        .skill-card {
          padding: 18px 20px;
          border-radius: 14px;
          background: #fafbfc;
          border: 1px solid #eaeaea;
          min-width: 0;
        }
        .research-frame {
          width: 100%;
          height: clamp(280px, 48vw, 400px);
          border: none;
        }
        @keyframes panel-enter {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .footer-link {
          color: #aaa;
          text-decoration: none;
          transition: color 0.2s;
        }
        .footer-link:hover {
          color: #fff;
        }
        .footer-links {
          display: flex;
          gap: 16px;
          margin-top: 8px;
        }
        .nav-icon {
          stroke: #aaa;
          transition: stroke 0.2s ease;
        }
        .nav-icon:hover {
          stroke: #fff;
        }
        @media (max-width: 960px) {
          .nav-wrapper {
            flex-direction: column;
            align-items: flex-start !important;
            padding: 16px 20px !important;
            gap: 16px;
          }
          .nav-links {
            flex-wrap: wrap;
            justify-content: flex-start !important;
            gap: 18px !important;
            width: 100%;
          }
          .nav-search {
            width: 100%;
            max-width: none;
          }
          .nav-search-input,
          .nav-search-input:focus {
            width: 100%;
          }
          .content-shell {
            width: min(100%, calc(100% - 20px));
            padding-top: 28px;
            gap: 22px;
          }
          .timeline-row {
            flex-direction: column;
            align-items: flex-start !important;
            gap: 4px;
          }
          .footer-links {
            flex-wrap: wrap;
            justify-content: center;
          }
          .project-embed-shell {
            padding: 16px;
          }
        }
        @media (max-width: 768px) {
          .nav-wrapper {
            padding: 14px 14px !important;
            gap: 12px;
          }
          .nav-links {
            gap: 10px 14px !important;
          }
          .hero h1 {
            font-size: 32px !important;
          }
          .hero-subtitle {
            font-size: 16px;
            margin-top: 14px;
          }
          .hero-location {
            font-size: 14px;
          }
          .hero {
            padding: 56px 16px !important;
          }
          .content-shell {
            width: min(100%, calc(100% - 12px));
            padding: 18px 0 52px;
            gap: 16px;
          }
          .section-panel {
            padding: 20px 16px;
            border-radius: 18px;
          }
          .grid-container {
            grid-template-columns: 1fr !important;
            gap: 18px !important;
          }
          .project-feature-layout {
            grid-template-columns: 1fr;
          }
          .nav-link {
            font-size: 12px;
          }
          .project-pill,
          .project-metric-chip,
          .project-link-badge,
          .project-venue-badge {
            font-size: 11px;
            padding: 5px 8px;
          }
          .project-type-badge {
            font-size: 9px;
            letter-spacing: 0.05em;
          }
          .project-embed-shell {
            padding: 12px;
            border-radius: 14px;
          }
          .project-embed-image {
            border-radius: 12px;
          }
          .skills-grid {
            grid-template-columns: 1fr;
            gap: 12px;
            margin-bottom: 28px;
          }
          .skill-card {
            padding: 16px;
          }
          .research-frame {
            height: 220px;
          }
          .footer-links span {
            display: none;
          }
        }
        @media (max-width: 520px) {
          .nav-wrapper {
            padding: 12px !important;
          }
          .nav-links {
            gap: 8px 12px !important;
          }
          .content-shell {
            width: calc(100% - 8px);
            padding-top: 14px;
          }
          .section-panel {
            padding: 18px 12px;
            border-radius: 16px;
          }
          .hero h1 {
            font-size: 28px !important;
          }
          .hero-subtitle {
            font-size: 15px;
          }
          .project-meta,
          .project-metric-row,
          .project-links-row,
          .contact-links,
          .footer-links {
            gap: 6px;
          }
          .project-embed-shell {
            padding: 10px;
          }
        }
      `}</style>

      {/* Top Navbar */}
      <nav className="nav-wrapper" style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        backgroundColor: 'rgba(8, 10, 14, 0.88)', 
        color: '#fff', 
        padding: '16px 32px',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        boxShadow: '0 12px 28px rgba(0,0,0,0.12)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div>
          <span style={{ fontSize: '20px', fontWeight: 300, color: '#f0f0f0', letterSpacing: '0.5px' }}>Animesh</span>
        </div>
        <div className="nav-links" style={{ display: 'flex', gap: '28px', alignItems: 'center' }}>
          {navLinks.map((link) => (
            <button 
              key={link.id} 
              onClick={() => activateTab(link.id)} 
              className={`nav-link ${(!searchQuery && activeTab === link.id) ? 'active' : ''}`}
            >
              {link.name}
            </button>
          ))}
          {/* Search Box */}
          <div className="nav-search" style={{ position: 'relative' }}>
            <svg style={{ position: 'absolute', left: '8px', top: '50%', transform: 'translateY(-50%)', stroke: '#888' }} width="14" height="14" viewBox="0 0 24 24" fill="none" strokeWidth="2">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="M21 21l-4.3-4.3"></path>
            </svg>
            <input 
              className="nav-search-input"
              type="text" 
              placeholder="Search..." 
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                requestAnimationFrame(() => scrollPortfolioToTop('auto'));
              }}
            />
          </div>
        </div>
      </nav>

      {/* Hero Banner (Always partially visible or only on 'home'?) Let's make it only on 'home' or always visible but smaller for other tabs */}
      {matchQuery('home') && (
        <header className="hero" style={{ 
          background: 'linear-gradient(135deg, #2b6e96 0%, #4e83aa 50%, #6b9fc4 100%)',
          color: '#fff', 
          textAlign: 'center', 
          padding: '80px 20px',
          boxShadow: 'inset 0 -20px 50px rgba(5, 27, 41, 0.14)'
        }}>
          <div className="hero-inner">
            <h1 style={{ fontSize: '48px', fontWeight: 300, margin: 0, letterSpacing: '0.02em', textShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>Animesh Mishra</h1>
            <p className="hero-subtitle">
              Software, research, and systems work across ML, infrastructure, and product engineering.
            </p>
            <p className="hero-location">
              Delhi, India | am847@snu.edu.in
            </p>
          </div>
        </header>
      )}

      {/* Main Content Area */}
      <main className="content-shell" style={{ lineHeight: 1.8, fontSize: '16px', color: '#333' }}>
        
        {searchQuery && (
          <div style={{ padding: '16px 18px', backgroundColor: '#f9f9f9', borderRadius: '14px', border: '1px solid #e2edf3', borderLeft: '4px solid #277093' }}>
            <h2 className="search-status" style={{ fontSize: '18px', margin: 0, fontWeight: 500, color: '#444' }}>
              {hasResults ? `Search Results for "${searchQuery}"` : `No results found for "${searchQuery}"`}
            </h2>
          </div>
        )}

        {matchQuery('home') && (
          <section id="contact" className="section-panel" style={{ marginBottom: '60px', textAlign: 'center' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 600, color: '#111', borderBottom: '2px solid #277093', paddingBottom: '8px', display: 'inline-block', marginBottom: '24px' }}>Welcome</h2>
            <p style={{ maxWidth: '600px', margin: '0 auto' }}>
              Hi, I&apos;m Animesh! Click on the navigation tabs above to explore my background, experience, research, and projects in a distinct sub-view without scrolling endlessly. 
            </p>
            <div style={{ marginTop: '24px' }}>
              I am always open to interesting projects, collaborations, and opportunities. You can reach out to me directly at: <br/>
              <a href="mailto:am847@snu.edu.in" className="custom-anchor" style={{ fontWeight: 600, fontSize: '18px', marginTop: '12px', display: 'inline-block' }}>am847@snu.edu.in</a>
            </div>
            <div className="contact-links" style={{ marginTop: '24px' }}>
              <a href="https://linkedin.com/in/animeshmishra0" target="_blank" rel="noopener noreferrer" className="custom-anchor">LinkedIn Profile</a>
              <a href="https://github.com/amethystani" target="_blank" rel="noopener noreferrer" className="custom-anchor">GitHub Account</a>
            </div>
          </section>
        )}

        {matchQuery('about') && (
          <section id="about" className="section-panel">
            <h2 style={{ fontSize: '24px', fontWeight: 600, color: '#111', borderBottom: '2px solid #277093', paddingBottom: '8px', display: 'inline-block', marginBottom: '24px' }}>Education</h2>
            <ul className="section-list">
              <li style={{ marginBottom: '32px' }}>
                <div className="timeline-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '8px' }}>
                  <strong>B.Tech in Computer Science and Engineering</strong>
                  <span style={{ fontSize: '14px', color: '#666' }}>Expected 2026</span>
                </div>
                <p style={{ margin: 0, color: '#444' }}>Shiv Nadar Institution of Eminence &bull; CGPA: 7.34</p>
              </li>
              <li style={{ marginBottom: '32px' }}>
                <div className="timeline-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '8px' }}>
                  <strong>Class XII (ISC)</strong>
                  <span style={{ fontSize: '14px', color: '#666' }}>2022</span>
                </div>
                <p style={{ margin: 0, color: '#444' }}>City Montessori School &bull; 91.25%</p>
              </li>
              <li>
                <div className="timeline-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '8px' }}>
                  <strong>Class X (ICSE)</strong>
                  <span style={{ fontSize: '14px', color: '#666' }}>2020</span>
                </div>
                <p style={{ margin: 0, color: '#444' }}>City Montessori School &bull; 94.00%</p>
              </li>
            </ul>
          </section>
        )}

        {matchQuery('experience') && (
          <section id="experience" className="section-panel">
            <h2 style={{ fontSize: '24px', fontWeight: 600, color: '#111', borderBottom: '2px solid #277093', paddingBottom: '8px', display: 'inline-block', marginBottom: '24px' }}>Experience</h2>
            <ul className="section-list">
              <li style={{ marginBottom: '40px' }}>
                <div className="timeline-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '8px' }}>
                  <strong>Student Researcher (Part-time)</strong>
                  <span style={{ fontSize: '14px', color: '#666' }}>May 2025 – Sep 2025</span>
                </div>
                <p style={{ margin: '0 0 12px 0', color: '#444', fontStyle: 'italic' }}>Complexity Science Hub &bull; Vienna, Austria (Remote)</p>
                <ul style={{ margin: 0, color: '#444' }}>
                  <li>Engineered a reproducible Python ETL to ingest and enrich physics-literature data from OpenAlex and APS APIs. Built joined research-graph tables across authors, institutions, fields, and time. Added demographic annotations for downstream bias slicing.</li>
                  <li>Built a batched LLM evaluation harness to run parallel factuality and validity audits across 3 open-source models (Gemma 2 9B, LLaMA 3, Mixtral 8x7B). Standardized prompts and outputs to enable apples-to-apples comparisons.</li>
                  <li>Implemented Evaluator and Auditor modules to compute error-rate and consistency metrics and graph-based similarity features from co-authorship networks.</li>
                </ul>
              </li>
              
              <li style={{ marginBottom: '40px' }}>
                <div className="timeline-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '8px' }}>
                  <strong>Quant Research Analyst Intern</strong>
                  <span style={{ fontSize: '14px', color: '#666' }}>Jun 2025 – Aug 2025</span>
                </div>
                <p style={{ margin: '0 0 12px 0', color: '#444', fontStyle: 'italic' }}>ConsultAdd Services Pvt. Ltd. &bull; Pune, Maharashtra</p>
                <ul style={{ margin: 0, color: '#444' }}>
                  <li>Designed and deployed high-volume data scraping pipelines for market intelligence, extracting over 500K records on unpartnered staffing firms.</li>
                  <li>Constructed and backtested time-series predictive models (Prophet, XGBoost) to forecast staffing demand and role saturation over a 12-month horizon.</li>
                </ul>
              </li>

              <li style={{ marginBottom: '40px' }}>
                <div className="timeline-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '8px' }}>
                  <strong>Intern (DCT-R&D Department)</strong>
                  <span style={{ fontSize: '14px', color: '#666' }}>Sep 2024 – Dec 2024</span>
                </div>
                <p style={{ margin: '0 0 12px 0', color: '#444', fontStyle: 'italic' }}>Exicom Group</p>
                <ul style={{ margin: 0, color: '#444' }}>
                  <li>Developed Time-Series Predictive Models and an AI Assistant (EVAI) to forecast Electric Vehicle (EV) charging demand.</li>
                  <li>Engineered a comprehensive Geospatial Feature Engineering Pipeline using OpenStreetMap, Folium, and GeoPandas to analyze charger placement optimization.</li>
                  <li>Implemented an efficient MLOps workflow, including LangChain integration and containerized deployment via Ollama.</li>
                </ul>
              </li>

              <li>
                <div className="timeline-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '8px' }}>
                  <strong>Research Intern (Institute for Systems Studies and Analyses)</strong>
                  <span style={{ fontSize: '14px', color: '#666' }}>May 2024 – Jul 2024</span>
                </div>
                <p style={{ margin: '0 0 12px 0', color: '#444', fontStyle: 'italic' }}>Defence Research &amp; Development Organisation</p>
                <ul style={{ margin: 0, color: '#444' }}>
                  <li>Designed and implemented a custom Genetic Algorithm (GA) with specialized fitness functions and mutation operators to solve a high-dimensional, constrained Vehicle Routing Problem (VRP).</li>
                  <li>Used DBSCAN/K-Means clustering to segment complex mobility patterns, generating geospatial heatmap visualizations.</li>
                </ul>
              </li>
            </ul>
          </section>
        )}

        {matchQuery('research') && (
          <section id="research" className="section-panel">
            <h2 style={{ fontSize: '24px', fontWeight: 600, color: '#111', borderBottom: '2px solid #277093', paddingBottom: '8px', display: 'inline-block', marginBottom: '24px' }}>Research &amp; Publications</h2>
            <ul className="section-list">
              
              <li style={{ marginBottom: '48px' }}>
                <div className="timeline-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '8px' }}>
                  <strong style={{ fontSize: '18px' }}>Spectral Sentinel: Scalable Byzantine-Robust Decentralized Federated Learning via Sketched Random Matrix Theory on Blockchain</strong>
                  <span style={{ fontSize: '14px', color: '#666' }}>2025</span>
                </div>
                <p style={{ margin: '0 0 12px 0', color: '#444', fontStyle: 'italic' }}>Preprint / Systems + ML</p>
                <ul style={{ margin: '0 0 16px 0', color: '#444' }}>
                  <li>Designed an RMT-driven Byzantine detector by tracking gradient covariance eigenspectra against the Marchenko–Pastur law (KS test + tail anomalies), and scaled detection via Frequent Directions sketching with O(k&sup2;) memory for k&Lt;d.</li>
                  <li>Proved (&epsilon;, &delta;)-Byzantine resilience with minimax-optimal convergence O(&sigma;f/&radic;T + f&sup2;/T), and validated on Polygon testnet/mainnet.</li>
                </ul>
                <div style={{ borderRadius: '8px', overflow: 'hidden', border: '1px solid #eaeaea', background: '#fafafa' }}>
                  <div style={{ padding: '12px 16px', backgroundColor: '#f5f5f5', borderBottom: '1px solid #eaeaea', fontSize: '14px', fontWeight: 600 }}>
                    <a href="https://arxiv.org/abs/2512.12617v1" target="_blank" rel="noopener noreferrer" className="custom-anchor">arXiv:2512.12617v1</a>
                  </div>
                  <iframe 
                    src="https://arxiv.org/html/2512.12617v1" 
                    className="research-frame"
                    title="arXiv Preprint"
                  ></iframe>
                </div>
              </li>

              <li style={{ marginBottom: '48px' }}>
                <div className="timeline-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '8px' }}>
                  <strong style={{ fontSize: '18px' }}>Reliability Analysis of Non-Bonded/Re-usable PZT Sensors for EMI-based SHM</strong>
                  <span style={{ fontSize: '14px', color: '#666' }}>2024</span>
                </div>
                <p style={{ margin: '0 0 12px 0', color: '#444', fontStyle: 'italic' }}>Elsevier Measurement (In Review) / Structural Health Monitoring</p>
                <ul style={{ margin: '0 0 16px 0', color: '#444' }}>
                  <li>Built a reliability/measurement-system framework for electromechanical impedance (EMI) signals across surface-bonded vs clamp-based PZT attachments.</li>
                  <li>Quantified clamp-tightening regimes (free-free/open/partial/fully bonded), showing fully bonded clamp achieves ICC = 0.993 meeting AIAG acceptance.</li>
                </ul>
                <div style={{ padding: '16px', background: '#fcfcfc', border: '1px solid #eaeaea', borderRadius: '8px', borderLeft: '4px solid #277093' }}>
                  <p style={{ margin: '0 0 8px 0', fontWeight: 500 }}>ScienceDirect Output</p>
                  <a href="https://www.sciencedirect.com/science/article/abs/pii/S026322412600730X" target="_blank" rel="noopener noreferrer" className="custom-anchor">
                    View Published Abstract on ScienceDirect.com &rarr;
                  </a>
                </div>
              </li>

              <li style={{ marginBottom: '40px' }}>
                <div className="timeline-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '8px' }}>
                  <strong style={{ fontSize: '18px' }}>A Multi-Agent Hyperbolic Framework for Legal Reasoning and Retrieval</strong>
                  <span style={{ fontSize: '14px', color: '#666' }}>2025</span>
                </div>
                <p style={{ margin: '0 0 12px 0', color: '#444', fontStyle: 'italic' }}>Research Paper / Legal AI, Geometric Deep Learning</p>
                <ul style={{ margin: 0, color: '#444' }}>
                  <li>Built Hyperbolic Legal Networks (HGCN) by embedding 49,633 cases in a Poincar&eacute; ball to encode court authority radially, achieving 0.92 Precision@5 on legal retrieval.</li>
                  <li>Designed a game-theoretic multi-agent pipeline with Nash-style coordination to resolve contradictory citations, and integrated adversarial hybrid retrieval.</li>
                </ul>
              </li>

              <li>
                <div className="timeline-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '8px' }}>
                  <strong style={{ fontSize: '18px' }}>Neuro-Scheduling for Graph Segmentation (NSGS)</strong>
                  <span style={{ fontSize: '14px', color: '#666' }}>2024</span>
                </div>
                <p style={{ margin: '0 0 12px 0', color: '#444', fontStyle: 'italic' }}>CVPR &apos;26 Submission / Neuromorphic Computing</p>
                <ul style={{ margin: 0, color: '#444' }}>
                  <li>Designed an event-driven neuromorphic graph segmentation (NSGS) framework that models image regions as asynchronous computational units, facilitating inherent parallelism and reducing redundant operations by 38&ndash;62%.</li>
                  <li>Achieved a 17.5x speedup and superior accuracy (65.8% avg. mIoU) over state-of-the-art models (YOLOv8m-seg).</li>
                </ul>
              </li>

            </ul>
          </section>
        )}

        {matchQuery('projects') && (
          <section id="projects" className="section-panel">
            <h2 style={{ fontSize: '24px', fontWeight: 600, color: '#111', borderBottom: '2px solid #277093', paddingBottom: '8px', display: 'inline-block', marginBottom: '6px' }}>Projects</h2>
            <p style={{ margin: '0 0 36px 0', color: '#666', fontSize: '14px' }}>Research prototypes, internship systems, and side projects &mdash; built end-to-end.</p>
            <ul className="section-list">

              <li style={{ marginBottom: '48px', paddingBottom: '48px', borderBottom: '1px solid #eaeaea' }}>
                <div className="timeline-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', flexWrap: 'wrap', gap: '8px' }}>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <span className="project-type-badge startup">Startup</span>
                    <span className="project-venue-badge">clerktree.com</span>
                  </div>
                </div>
                <strong style={{ fontSize: '18px', color: '#111', display: 'block', marginBottom: '12px' }}>ClerkTree</strong>
                <ul style={{ margin: '0 0 16px 0', color: '#44515a', lineHeight: 1.7, paddingLeft: '18px' }}>
                  <li>Built as an enterprise orchestration layer for claims and back-office workflows, matching the positioning currently shown on <a href="https://clerktree.com" target="_blank" rel="noopener noreferrer" className="custom-anchor">clerktree.com</a>.</li>
                  <li>Architected the underlying platform as an event-driven, multi-tenant system on AWS EKS with Apache Kafka and FastAPI for scalable workflow routing and operational automation.</li>
                  <li>Integrated agentic AI pipelines with fine-tuned Mixtral-8x7B and Gemini Pro to automate decision support, document handling, and complex enterprise task flows.</li>
                </ul>
                <div className="project-meta" style={{ marginBottom: '20px' }}>
                  <span className="project-pill">AI Workflow Automation</span>
                  <span className="project-pill">Claims Operations</span>
                  <span className="project-pill">AWS EKS / Kafka</span>
                  <span className="project-pill">Mixtral-8x7B</span>
                  <span className="project-pill">FastAPI</span>
                </div>
                <div className="project-embed-shell">
                  <img src={CLERKTREE_SNAPSHOT_URL} alt="ClerkTree website snapshot" className="project-embed-image" loading="lazy" referrerPolicy="no-referrer" />
                </div>
              </li>

              <li style={{ marginBottom: '48px', paddingBottom: '48px', borderBottom: '1px solid #eaeaea' }}>
                <div className="timeline-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', flexWrap: 'wrap', gap: '8px' }}>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <span className="project-type-badge research">Research</span>
                    <span className="project-venue-badge">CVPR &apos;26 Submission</span>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <a href="https://github.com/amethystani/NSGSAlgorithm" target="_blank" rel="noopener noreferrer" className="project-link-badge">&#8599; GitHub</a>
                  </div>
                </div>
                <strong style={{ fontSize: '18px', color: '#111', display: 'block', marginBottom: '8px' }}>Neuro-Scheduling for Graph Segmentation (NSGS)</strong>
                <div className="project-metric-row">
                  <span className="project-metric-chip">60.8&times; speedup</span>
                  <span className="project-metric-chip">65.8% mIoU</span>
                  <span className="project-metric-chip">4.4&times; less energy</span>
                </div>
                <ul style={{ margin: '0 0 16px 0', color: '#44515a', lineHeight: 1.7, paddingLeft: '18px' }}>
                  <li>Designed an event-driven neuromorphic framework where image patches act as asynchronous computational units that fire when local activations exceed adaptive thresholds &mdash; eliminating the redundant computation in standard frame-by-frame inference, cutting operations by 38&ndash;62%.</li>
                  <li>Built BIPS-PKD (Backbone-Integrated Partial Split + Progressive Knowledge Distillation): splits any segmentation backbone at a <em>learned</em> intermediate layer and replaces the heavy transformer tail with a distilled student head at inference &mdash; model-family-agnostic, no architecture surgery required.</li>
                  <li>Benchmarked across 9 model families (EfficientSAM, SegFormer, Mask2Former, SAM2, PIDNet, YOLOv8/v12, DINOv3, MobileSAM); top result: EfficientSAM small at 60.8&times; speedup (~16 FPS on a 4-thread CPU, no GPU).</li>
                  <li>Ships as a fully offline Android app (~500 MB bundled ONNX models) backed by a C++ lock-free SpikeQueue runtime with thermal-aware scheduling.</li>
                </ul>
                <div className="project-meta">
                  <span className="project-pill">Neuromorphic Computing</span>
                  <span className="project-pill">Image Segmentation</span>
                  <span className="project-pill">C++ NSGS Runtime</span>
                  <span className="project-pill">ONNX / PyTorch</span>
                  <span className="project-pill">Android</span>
                </div>
              </li>

              <li style={{ marginBottom: '48px', paddingBottom: '48px', borderBottom: '1px solid #eaeaea' }}>
                <div className="timeline-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', flexWrap: 'wrap', gap: '8px' }}>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <span className="project-type-badge research">Research</span>
                    <span className="project-venue-badge">arXiv:2512.12617</span>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <a href="https://github.com/amethystani/blockchain_enabled_federated_learning-main" target="_blank" rel="noopener noreferrer" className="project-link-badge">&#8599; GitHub</a>
                    <a href="https://arxiv.org/abs/2512.12617" target="_blank" rel="noopener noreferrer" className="project-link-badge">&#8599; arXiv</a>
                  </div>
                </div>
                <strong style={{ fontSize: '18px', color: '#111', display: 'block', marginBottom: '8px' }}>Spectral Sentinel &mdash; Byzantine-Robust Federated Learning</strong>
                <div className="project-metric-row">
                  <span className="project-metric-chip">78.4% accuracy</span>
                  <span className="project-metric-chip">38% Byzantine tolerance</span>
                  <span className="project-metric-chip">1,034&times; memory reduction</span>
                </div>
                <ul style={{ margin: '0 0 16px 0', color: '#44515a', lineHeight: 1.7, paddingLeft: '18px' }}>
                  <li>Designed the first Byzantine-robust federated learning system grounded in Random Matrix Theory: detects poisoned gradients by comparing gradient covariance eigenspectra against the Marchenko&ndash;Pastur law via KS test + tail anomaly detection &mdash; a theoretical guarantee, not a heuristic filter.</li>
                  <li>Proved a phase transition: detection is guaranteed when &sigma;&sup2;f&sup2; &lt; 0.25; extended to &sigma;&sup2;f&sup2; &lt; 0.35 with &epsilon;-DP (&epsilon;=8). Certified 38% Byzantine tolerance vs. 15% for CRFL/ByzShield baselines.</li>
                  <li>Scaled to billion-parameter models via Frequent Directions sketching at O(k&sup2;) memory &mdash; 1,034&times; reduction at 1.5B params (9 TB &rarr; 8.7 GB). Layer-wise decomposition preserves 94%+ detection at 15&times; lower memory.</li>
                  <li>Validated across 144 attack&ndash;aggregator settings (12 attacks &times; 12 configs); wins all 12 attack types at 78.4% mean accuracy vs. 48&ndash;63% baselines. Deployed and validated on Polygon testnet/mainnet.</li>
                </ul>
                <div className="project-meta">
                  <span className="project-pill">Random Matrix Theory</span>
                  <span className="project-pill">Byzantine-Robust FL</span>
                  <span className="project-pill">Frequent Directions Sketching</span>
                  <span className="project-pill">Blockchain / Polygon</span>
                  <span className="project-pill">Federated Learning</span>
                </div>
              </li>

              <li style={{ marginBottom: '48px', paddingBottom: '48px', borderBottom: '1px solid #eaeaea' }}>
                <div className="timeline-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', flexWrap: 'wrap', gap: '8px' }}>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <span className="project-type-badge internship">Internship</span>
                    <span className="project-venue-badge">Exicom Group &middot; DCT-R&amp;D</span>
                  </div>
                  <a href="https://github.com/amethystani/EVPredAI" target="_blank" rel="noopener noreferrer" className="project-link-badge">&#8599; GitHub</a>
                </div>
                <strong style={{ fontSize: '18px', color: '#111', display: 'block', marginBottom: '8px' }}>EVPredAI &mdash; EV Charging Demand Forecasting &amp; Placement</strong>
                <div className="project-metric-row">
                  <span className="project-metric-chip">85% user satisfaction</span>
                  <span className="project-metric-chip">10+ feature dims</span>
                  <span className="project-metric-chip">100+ concurrent queries</span>
                </div>
                <ul style={{ margin: '0 0 16px 0', color: '#44515a', lineHeight: 1.7, paddingLeft: '18px' }}>
                  <li>Built a multi-modal ensemble for EV charging station placement: XGBoost with Bayesian HPO over 20+ geospatial/temporal features, SARIMA for seasonal demand forecasting, Moran&apos;s I/LISA spatial autocorrelation for hotspot detection, and MCDA weighted overlay scoring.</li>
                  <li>Leveraged NeMo DataDesigner to orchestrate synthetic data generation pipelines for EV demand forecasting &mdash; defining task schemas, configuring generation workflows, and running quality-filtering and deduplication passes to produce curated fine-tuning corpora.</li>
                  <li>Fine-tuned a BERT/RoBERTa chatbot on 15,000+ EV charging conversations and 5,000+ Exicom-specific technical interactions using LoRA, with FAISS vector retrieval and TAPAS for tabular question answering; deployed via Ollama for 100+ concurrent queries.</li>
                  <li>Engineered geospatial feature pipeline using OpenStreetMap/OSMnx, GeoPandas, and Folium; implemented automated feedback loop achieving 85% user satisfaction.</li>
                </ul>
                <div className="project-meta">
                  <span className="project-pill">XGBoost + Bayesian HPO</span>
                  <span className="project-pill">SARIMA</span>
                  <span className="project-pill">Spatial Autocorrelation</span>
                  <span className="project-pill">BERT / LoRA</span>
                  <span className="project-pill">LangChain / Ollama</span>
                  <span className="project-pill">GeoPandas</span>
                </div>
              </li>

              <li style={{ marginBottom: '48px', paddingBottom: '48px', borderBottom: '1px solid #eaeaea' }}>
                <div className="timeline-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', flexWrap: 'wrap', gap: '8px' }}>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <span className="project-type-badge research">Research</span>
                    <span className="project-venue-badge">2025</span>
                  </div>
                  <a href="https://github.com/amethystani/legalnexus-backend" target="_blank" rel="noopener noreferrer" className="project-link-badge">&#8599; GitHub</a>
                </div>
                <strong style={{ fontSize: '18px', color: '#111', display: 'block', marginBottom: '8px' }}>LegalNexus &mdash; Hyperbolic Multi-Agent Legal Reasoning</strong>
                <div className="project-metric-row">
                  <span className="project-metric-chip">0.92 Precision@5</span>
                  <span className="project-metric-chip">49,633 cases</span>
                  <span className="project-metric-chip">94% conflict resolution</span>
                </div>
                <ul style={{ margin: '0 0 16px 0', color: '#44515a', lineHeight: 1.7, paddingLeft: '18px' }}>
                  <li>Built Hyperbolic Legal Networks (HGCN) embedding 49,633 cases in a Poincar&eacute; ball with radial court-authority encoding &mdash; capturing the hierarchical structure of legal precedent that Euclidean embeddings flatten. Achieved 0.92 Precision@5 on legal case retrieval.</li>
                  <li>Designed a game-theoretic multi-agent pipeline (Linker / Interpreter / Conflict agents) with Nash-style coordination for resolving contradictory citations; achieves 94% citation conflict resolution.</li>
                  <li>Integrated adversarial hybrid retrieval combining dense vector search with sparse BM25 re-ranking for robustness against out-of-distribution legal queries.</li>
                </ul>
                <div className="project-meta">
                  <span className="project-pill">Hyperbolic Graph Networks</span>
                  <span className="project-pill">Poincar&eacute; Ball Embeddings</span>
                  <span className="project-pill">Multi-Agent Pipeline</span>
                  <span className="project-pill">Game Theory</span>
                  <span className="project-pill">Legal AI</span>
                </div>
              </li>

              <li style={{ marginBottom: '48px', paddingBottom: '48px', borderBottom: '1px solid #eaeaea' }}>
                <div className="timeline-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', flexWrap: 'wrap', gap: '8px' }}>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <span className="project-type-badge research">Research</span>
                    <span className="project-venue-badge">arXiv:2510.04871</span>
                  </div>
                </div>
                <strong style={{ fontSize: '18px', color: '#111', display: 'block', marginBottom: '12px' }}>Tiny Recursive Models (TRM)</strong>
                <ul style={{ margin: '0 0 16px 0', color: '#44515a', lineHeight: 1.7, paddingLeft: '18px' }}>
                  <li>Re-implemented the Recursive Latent State architecture from arXiv:2510.04871 in PyTorch; confirmed constant VRAM footprint regardless of reasoning depth &mdash; the core property the paper claims.</li>
                  <li>Integrated FlashAttention-2 and custom Triton kernels to fuse element-wise operations inside the recurrence loop, reducing memory bandwidth pressure during deep reasoning chains.</li>
                  <li>Ran pretraining mixture experiments informed by SmolLM and Nemotron data strategies: domain weighting ablations and quality-filter configurations, using FineWebEDU and FinePDFs as reference distributions.</li>
                </ul>
                <div className="project-meta">
                  <span className="project-pill">PyTorch</span>
                  <span className="project-pill">FlashAttention-2</span>
                  <span className="project-pill">Triton Kernels</span>
                  <span className="project-pill">SmolLM / Nemotron</span>
                  <span className="project-pill">FineWebEDU</span>
                </div>
              </li>

              <li>
                <div className="timeline-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', flexWrap: 'wrap', gap: '8px' }}>
                  <span className="project-type-badge side-project">Project</span>
                </div>
                <strong style={{ fontSize: '18px', color: '#111', display: 'block', marginBottom: '12px' }}>NewSky</strong>
                <ul style={{ margin: '0 0 16px 0', color: '#44515a', lineHeight: 1.7, paddingLeft: '18px' }}>
                  <li>Designed a pipeline to ingest and cluster topics from the Bluesky API, applying embedding-based clustering to group semantically related posts before synthesis.</li>
                  <li>Built an automated daily digest generator with category grouping and abstractive summarization &mdash; compressing high-volume social feeds into short conversational summaries.</li>
                  <li>Deployed via Flutter frontend, PostgreSQL for persistent storage, containerized with Docker and orchestrated with Kubernetes.</li>
                </ul>
                <div className="project-meta">
                  <span className="project-pill">Bluesky API</span>
                  <span className="project-pill">NLP Summarization</span>
                  <span className="project-pill">Flutter</span>
                  <span className="project-pill">PostgreSQL</span>
                  <span className="project-pill">Docker / Kubernetes</span>
                </div>
              </li>

            </ul>
          </section>
        )}

        {matchQuery('skills') && (
          <section id="skills" className="section-panel">
            <h2 style={{ fontSize: '24px', fontWeight: 600, color: '#111', borderBottom: '2px solid #277093', paddingBottom: '8px', display: 'inline-block', marginBottom: '6px' }}>Technical Skills &amp; Achievements</h2>
            <p style={{ margin: '0 0 28px 0', color: '#666', fontSize: '14px' }}>Languages, frameworks, and tooling across ML engineering, data infrastructure, and systems.</p>

            <div className="skills-grid">
              <div className="skill-card">
                <h4 style={{ margin: '0 0 10px 0', fontSize: '12px', fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: '#277093' }}>Languages</h4>
                <p style={{ margin: 0, fontSize: '14px', color: '#444', lineHeight: 1.7 }}>Python (primary) &bull; SQL &bull; Java &bull; LaTeX</p>
              </div>
              <div className="skill-card">
                <h4 style={{ margin: '0 0 10px 0', fontSize: '12px', fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: '#277093' }}>ML &amp; LLM Frameworks</h4>
                <p style={{ margin: 0, fontSize: '14px', color: '#444', lineHeight: 1.7 }}>PyTorch &bull; Triton kernels &bull; FlashAttention-2 &bull; HuggingFace Transformers &bull; XGBoost &bull; Scikit-learn &bull; ONNX Runtime &bull; LangChain &bull; Ollama &bull; Gymnasium</p>
              </div>
              <div className="skill-card">
                <h4 style={{ margin: '0 0 10px 0', fontSize: '12px', fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: '#277093' }}>Pretraining Data &amp; Corpus</h4>
                <p style={{ margin: 0, fontSize: '14px', color: '#444', lineHeight: 1.7 }}>Datatrove &bull; FineWeb / FineWebEDU / FinePDFs &bull; NeMo DataDesigner &bull; SmolLM / Nemotron data strategies &bull; CommonCrawl processing &bull; Deduplication &amp; quality filtering</p>
              </div>
              <div className="skill-card">
                <h4 style={{ margin: '0 0 10px 0', fontSize: '12px', fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: '#277093' }}>Distributed Data Processing</h4>
                <p style={{ margin: 0, fontSize: '14px', color: '#444', lineHeight: 1.7 }}>Apache Kafka &bull; Dask &bull; Spark (familiar) &bull; Large-scale ETL design &bull; Web scraping pipelines at scale</p>
              </div>
              <div className="skill-card">
                <h4 style={{ margin: '0 0 10px 0', fontSize: '12px', fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: '#277093' }}>Evaluation &amp; Ablations</h4>
                <p style={{ margin: 0, fontSize: '14px', color: '#444', lineHeight: 1.7 }}>Multi-model ablation harnesses &bull; LLM-as-judge evaluation &bull; Factuality/validity audits &bull; ICC / ANOVA Gauge R&amp;R &bull; Benchmark design</p>
              </div>
              <div className="skill-card">
                <h4 style={{ margin: '0 0 10px 0', fontSize: '12px', fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: '#277093' }}>Infrastructure &amp; MLOps</h4>
                <p style={{ margin: 0, fontSize: '14px', color: '#444', lineHeight: 1.7 }}>Docker &bull; Kubernetes &bull; AWS EKS &bull; FastAPI &bull; Redis &bull; Git &bull; Flutter</p>
              </div>
              <div className="skill-card">
                <h4 style={{ margin: '0 0 10px 0', fontSize: '12px', fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: '#277093' }}>Data Science</h4>
                <p style={{ margin: 0, fontSize: '14px', color: '#444', lineHeight: 1.7 }}>Pandas &bull; NumPy &bull; GeoPandas &bull; Matplotlib &bull; NetworkX &bull; Folium</p>
              </div>
            </div>

            <h3 style={{ fontSize: '18px', margin: '0 0 14px 0', color: '#111' }}>Scholastic Achievements</h3>
            <ul style={{ margin: '0 0 28px 0', color: '#444', lineHeight: 1.9 }}>
              <li>Selected among 200 participants for the Bitcoin Talents Program by Frankfurt School Blockchain Center (Jan &apos;25)</li>
              <li>Selected from over 16,000 global applicants for Harvard Aspire Institute Leadership Program (Nov &apos;24)</li>
              <li>Selected for HPAIR (Harvard College Project for Asian and International Relations) (Aug &apos;23) &mdash; 2&ndash;3% acceptance from 50,000+ applicants across 70+ countries</li>
              <li>TestAS score: 102/130 (Apr &apos;23)</li>
              <li>Certificate of Appreciation by Defence Minister of India for Class X and XII board performance (2020, 2022)</li>
            </ul>

            <h3 style={{ fontSize: '18px', margin: '0 0 12px 0', color: '#111' }}>Key Courses</h3>
            <p style={{ margin: 0, color: '#444', lineHeight: 1.8 }}>
              <strong>Computer Science:</strong> Data Structures, Design &amp; Analysis of Algorithms, Artificial Intelligence, Reinforcement Learning, Digital Image Processing, Robotics, Social &amp; Information Networks, Parallel &amp; Concurrent Prog., Operating Systems, Database Systems, Computer Networks, Distributed Systems<br/><br/>
              <strong>Mathematics:</strong> Applied Linear Algebra, Probability &amp; Statistics, Discrete Math, Theory of Computation, Mathematical Methods I
            </p>
          </section>
        )}

        <hr style={{ border: 0, borderTop: '1px solid #e0e0e0', margin: '40px 0' }} />
      </main>

      {/* Footer */}
      <footer id="privacy" style={{ 
        backgroundColor: '#0a0a0a', 
        color: '#888', 
        padding: '32px 20px', 
        textAlign: 'center',
        fontSize: '13px',
        borderTop: '1px solid #222'
      }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
          <p style={{ margin: 0 }}>&copy; {new Date().getFullYear()} Animesh Mishra. All rights reserved.</p>
          <div className="footer-links">
            <a href="#" className="footer-link">Imprint</a>
            <span style={{ color: '#444' }}>|</span>
            <a href="#" className="footer-link">Privacy Policy</a>
            <span style={{ color: '#444' }}>|</span>
            <a href="https://github.com/amethystani" target="_blank" rel="noopener noreferrer" className="footer-link">GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
