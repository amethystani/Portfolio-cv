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
  projects: "Other Projects ClerkTree AI-powered workflow automation platform for claims and back-office operations (clerktree.com). Shown with a centered scrollable site snapshot because the live site blocks third-party iframe embedding. Architected an event-driven multi-tenant system on AWS EKS with Apache Kafka and FastAPI. Engineered agentic AI workflows via fine-tuned Mixtral-8x7B and Gemini Pro. Tiny Recursive Models (TRM) Based on arXiv:2510.04871. Re-implemented the Recursive Latent State architecture in PyTorch to handle complex reasoning tasks without increasing model size. Enhanced base implementation by integrating FlashAttention-2 and custom Triton kernels to fuse operations. NewSky Designed a pipeline to ingest and cluster topics from Bluesky API, synthesizing short conversational summaries. Built an automated daily digest generator with category grouping and abstractive summarization. Deployed via Flutter, PostgreSQL, Docker, and Kubernetes.",
  skills: "Technical Skills & Achievements Technical Skills Languages: Python, Java, SQL, LaTeX Machine Learning: PyTorch, Scikit-learn, LangChain, Transformers, Gymnasium, Ollama Development: FastAPI, Docker, Kubernetes, AWS, Apache Kafka, Redis, Flutter, Git Data Science: Pandas, NumPy, GeoPandas, Matplotlib, NetworkX Scholastic Achievements Selected among 200 participants for the Bitcoin Talents Program by Frankfurt School Blockchain Center (Jan '25) Selected from over 16,000 global applicants for Harvard Aspire Institute Leadership Program (Nov '24) Achieved a score of 102 in the core test of Test für Ausländische Studierende (TestAS) (Apr '23) Selected for the Harvard College Project for Asian and International Relations (HPAIR) (Aug '23) Awarded Certificate of Appreciation by Defense Minister of India for board exam performance (2020, 2022) Key Courses Computer Science: Data Structures, Design & Analysis of Algorithms, Artificial Intelligence, Reinforcement Learning, Digital Image Processing, Robotics, Social & Information Networks, Parallel & Concurrent Prog., Operating Systems, Database Systems, Computer Networks, Distributed Systems Mathematics: Applied Linear Algebra, Probability & Statistics, Discrete Math, Theory of Computation, Mathematical Methods I"
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
          overflow: hidden;
          border-radius: 18px;
          border: 1px solid #dce7ee;
          background: linear-gradient(180deg, #ffffff 0%, #f6fafc 100%);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.9);
        }
        .project-embed-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          padding: 12px 14px;
          background: rgba(255,255,255,0.92);
          border-bottom: 1px solid #e5edf2;
        }
        .project-embed-frame {
          width: 100%;
          height: clamp(320px, 42vw, 430px);
          border: none;
          background: #fff;
        }
        .project-embed-scroll {
          height: clamp(340px, 44vw, 460px);
          overflow: auto;
          background:
            radial-gradient(circle at top, rgba(39, 112, 147, 0.08), transparent 32%),
            linear-gradient(180deg, #eff4f7 0%, #ffffff 100%);
          display: flex;
          justify-content: center;
          padding: 18px;
        }
        .project-embed-image {
          width: min(100%, 760px);
          height: auto;
          display: block;
          border-radius: 16px;
          background: #fff;
          box-shadow: 0 18px 42px rgba(15, 23, 42, 0.14);
        }
        .project-embed-note {
          padding: 10px 14px 14px;
          font-size: 12px;
          line-height: 1.55;
          color: #5a6770;
          border-top: 1px solid #e5edf2;
          background: rgba(255,255,255,0.92);
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
        .contact-links {
          display: flex;
          gap: 16px;
          justify-content: center;
          flex-wrap: wrap;
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
            max-width: 260px;
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
        }
        @media (max-width: 768px) {
          .hero h1 {
            font-size: 32px !important;
          }
          .hero {
            padding: 60px 20px !important;
          }
          .section-panel {
            padding: 22px 18px;
            border-radius: 20px;
          }
          .grid-container {
            grid-template-columns: 1fr !important;
            gap: 18px !important;
          }
          .project-feature-layout {
            grid-template-columns: 1fr;
          }
          .nav-link {
            font-size: 13px;
          }
          .research-frame {
            height: 260px;
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
            <p style={{ margin: '16px auto 0', fontSize: '18px', color: '#e0f0f5', fontWeight: 300, maxWidth: '720px' }}>
              Software, research, and systems work across ML, infrastructure, and product engineering.
            </p>
            <p style={{ marginTop: '12px', fontSize: '16px', color: '#f1f8fb', fontWeight: 400 }}>
              Delhi, India | am847@snu.edu.in
            </p>
          </div>
        </header>
      )}

      {/* Main Content Area */}
      <main className="content-shell" style={{ lineHeight: 1.8, fontSize: '16px', color: '#333' }}>
        
        {searchQuery && (
          <div style={{ padding: '16px 18px', backgroundColor: '#f9f9f9', borderRadius: '14px', border: '1px solid #e2edf3', borderLeft: '4px solid #277093' }}>
            <h2 style={{ fontSize: '18px', margin: 0, fontWeight: 500, color: '#444' }}>
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
            <h2 style={{ fontSize: '24px', fontWeight: 600, color: '#111', borderBottom: '2px solid #277093', paddingBottom: '8px', display: 'inline-block', marginBottom: '24px' }}>Other Projects</h2>
            <div className="grid-container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>

              <div className="project-card project-card-wide">
                <h3 style={{ fontSize: '18px', margin: '0 0 12px 0', color: '#111' }}>ClerkTree</h3>
                <p style={{ fontSize: '14px', margin: 0, color: '#555', lineHeight: 1.7 }}>
                  ClerkTree presents itself publicly as an AI-powered workflow automation platform for claims and back-office operations. The live site highlights intelligent automation for enterprise operations and a faster end-to-end turnaround.
                </p>
                <div className="project-meta">
                  <span className="project-pill">AI Workflow Automation</span>
                  <span className="project-pill">Claims Operations</span>
                  <span className="project-pill">Back-Office Systems</span>
                  <span className="project-pill">Live Site Embed</span>
                </div>
                <div className="project-feature-layout">
                  <div>
                    <ul className="project-points">
                      <li>Built as an enterprise orchestration layer for claims and back-office workflows, matching the positioning currently shown on <a href="https://clerktree.com" target="_blank" rel="noopener noreferrer" className="custom-anchor">clerktree.com</a>.</li>
                      <li>Architected the underlying platform as an event-driven, multi-tenant system on AWS EKS with Apache Kafka and FastAPI for scalable workflow routing and operational automation.</li>
                      <li>Integrated agentic AI pipelines with fine-tuned Mixtral-8x7B and Gemini Pro to automate decision support, document handling, and complex enterprise task flows.</li>
                    </ul>
                  </div>
                  <div className="project-embed-shell">
                    <div className="project-embed-header">
                      <span style={{ fontSize: '13px', fontWeight: 600, color: '#3c5561' }}>clerktree.com</span>
                      <a href="https://clerktree.com" target="_blank" rel="noopener noreferrer" className="custom-anchor" style={{ fontSize: '13px' }}>
                        Open live site
                      </a>
                    </div>
                    <div className="project-embed-scroll">
                      <img
                        src={CLERKTREE_SNAPSHOT_URL}
                        alt="ClerkTree website snapshot"
                        className="project-embed-image"
                        loading="lazy"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="project-embed-note">
                      Scroll inside the preview to inspect the site snapshot. The live page itself cannot render in a third-party iframe because ClerkTree sends <code>X-Frame-Options: SAMEORIGIN</code>.
                    </div>
                  </div>
                </div>
              </div>

              <div className="project-card">
                <h3 style={{ fontSize: '18px', margin: '0 0 12px 0', color: '#111' }}>Tiny Recursive Models (TRM)</h3>
                <p style={{ fontSize: '14px', margin: 0, color: '#555' }}>
                  Based on arXiv:2510.04871. Re-implemented the Recursive Latent State architecture in PyTorch to handle complex reasoning tasks without increasing model size. Enhanced base implementation by integrating FlashAttention-2 and custom Triton kernels to fuse operations.
                </p>
              </div>

              <div className="project-card">
                <h3 style={{ fontSize: '18px', margin: '0 0 12px 0', color: '#111' }}>NewSky</h3>
                <p style={{ fontSize: '14px', margin: 0, color: '#555' }}>
                  Designed a pipeline to ingest and cluster topics from Bluesky API, synthesizing short conversational summaries. Built an automated daily digest generator with category grouping and abstractive summarization. Deployed via Flutter, PostgreSQL, Docker, and Kubernetes.
                </p>
              </div>

            </div>
          </section>
        )}

        {matchQuery('skills') && (
          <section id="skills" className="section-panel">
            <h2 style={{ fontSize: '24px', fontWeight: 600, color: '#111', borderBottom: '2px solid #277093', paddingBottom: '8px', display: 'inline-block', marginBottom: '24px' }}>Technical Skills &amp; Achievements</h2>
            
            <h3 style={{ fontSize: '18px', margin: '0 0 12px 0', color: '#111' }}>Technical Skills</h3>
            <p style={{ margin: '0 0 24px 0' }}>
              <strong>Languages:</strong> Python, Java, SQL, LaTeX<br/>
              <strong>Machine Learning:</strong> PyTorch, Scikit-learn, LangChain, Transformers, Gymnasium, Ollama<br/>
              <strong>Development:</strong> FastAPI, Docker, Kubernetes, AWS, Apache Kafka, Redis, Flutter, Git<br/>
              <strong>Data Science:</strong> Pandas, NumPy, GeoPandas, Matplotlib, NetworkX
            </p>

            <h3 style={{ fontSize: '18px', margin: '0 0 12px 0', color: '#111' }}>Scholastic Achievements</h3>
            <ul style={{ margin: '0 0 24px 0', color: '#444' }}>
              <li>Selected among 200 participants for the Bitcoin Talents Program by Frankfurt School Blockchain Center (Jan &apos;25)</li>
              <li>Selected from over 16,000 global applicants for Harvard Aspire Institute Leadership Program (Nov &apos;24)</li>
              <li>Achieved a score of 102 in the core test of Test f&uuml;r Ausl&auml;ndische Studierende (TestAS) (Apr &apos;23)</li>
              <li>Selected for the Harvard College Project for Asian and International Relations (HPAIR) (Aug &apos;23)</li>
              <li>Awarded Certificate of Appreciation by Defense Minister of India for board exam performance (2020, 2022)</li>
            </ul>

            <h3 style={{ fontSize: '18px', margin: '0 0 12px 0', color: '#111' }}>Key Courses</h3>
            <p style={{ margin: 0 }}>
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
