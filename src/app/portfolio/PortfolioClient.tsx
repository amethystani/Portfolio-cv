'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

const navLinks = [
  { name: 'Home', id: 'home' },
  { name: 'About', id: 'about' },
  { name: 'Experience', id: 'experience' },
  { name: 'Research', id: 'research' },
  { name: 'Projects', id: 'projects' },
  { name: 'Skills', id: 'skills' }
];

const contentIndex = {
  home: "Welcome Hi, I'm Animesh! Click on the navigation tabs above to explore my background, experience, research, and projects in a distinct sub-view without scrolling endlessly. I am always open to interesting projects, collaborations, and opportunities. You can reach out to me directly at: am847@snu.edu.in LinkedIn Profile GitHub Account Animesh Mishra Delhi, India",
  about: "Education B.Tech in Computer Science and Engineering Expected 2026 Shiv Nadar Institution of Eminence CGPA: 7.34 Class XII (ISC) 2022 City Montessori School 91.25% Class X (ICSE) 2020 City Montessori School 94.00%",
  experience: "Experience Student Researcher (Part-time) May 2025 – Sep 2025 Complexity Science Hub Vienna, Austria (Remote) Engineered a reproducible Python ETL to ingest and enrich physics-literature data from OpenAlex and APS APIs. Built joined research-graph tables across authors, institutions, fields, and time. Added demographic annotations for downstream bias slicing. Built a batched LLM evaluation harness to run parallel factuality and validity audits across 3 open-source models (Gemma 2 9B, LLaMA 3, Mixtral 8x7B). Standardized prompts and outputs to enable apples-to-apples comparisons. Implemented Evaluator and Auditor modules to compute error-rate and consistency metrics and graph-based similarity features from co-authorship networks. Quant Research Analyst Intern Jun 2025 – Aug 2025 ConsultAdd Services Pvt. Ltd. Pune, Maharashtra Designed and deployed high-volume data scraping pipelines for market intelligence, extracting over 500K records on unpartnered staffing firms. Constructed and backtested time-series predictive models (Prophet, XGBoost) to forecast staffing demand and role saturation over a 12-month horizon. Intern (DCT-R&D Department) Sep 2024 – Dec 2024 Exicom Group Developed Time-Series Predictive Models and an AI Assistant (EVAI) to forecast Electric Vehicle (EV) charging demand. Engineered a comprehensive Geospatial Feature Engineering Pipeline using OpenStreetMap, Folium, and GeoPandas to analyze charger placement optimization. Implemented an efficient MLOps workflow, including LangChain integration and containerized deployment via Ollama. Research Intern (Institute for Systems Studies and Analyses) May 2024 – Jul 2024 Defence Research & Development Organisation Designed and implemented a custom Genetic Algorithm (GA) with specialized fitness functions and mutation operators to solve a high-dimensional, constrained Vehicle Routing Problem (VRP). Used DBSCAN/K-Means clustering to segment complex mobility patterns, generating geospatial heatmap visualizations.",
  research: "Research & Publications Spectral Sentinel: Scalable Byzantine-Robust Decentralized Federated Learning via Sketched Random Matrix Theory on Blockchain 2025 Preprint / Systems + ML Designed an RMT-driven Byzantine detector by tracking gradient covariance eigenspectra against the Marchenko–Pastur law (KS test + tail anomalies), and scaled detection via Frequent Directions sketching with O(k²) memory for k<d. Proved (ε, δ)-Byzantine resilience with minimax-optimal convergence O(σf/√T + f²/T), and validated on Polygon testnet/mainnet. Reliability Analysis of Non-Bonded/Re-usable PZT Sensors for EMI-based SHM 2024 Elsevier Measurement (In Review) / Structural Health Monitoring Built a reliability/measurement-system framework for electromechanical impedance (EMI) signals across surface-bonded vs clamp-based PZT attachments. Quantified clamp-tightening regimes (free-free/open/partial/fully bonded), showing fully bonded clamp achieves ICC = 0.993 meeting AIAG acceptance. A Multi-Agent Hyperbolic Framework for Legal Reasoning and Retrieval 2025 Research Paper / Legal AI, Geometric Deep Learning Built Hyperbolic Legal Networks (HGCN) by embedding 49,633 cases in a Poincaré ball to encode court authority radially, achieving 0.92 Precision@5 on legal retrieval. Designed a game-theoretic multi-agent pipeline with Nash-style coordination to resolve contradictory citations, and integrated adversarial hybrid retrieval. Neuro-Scheduling for Graph Segmentation (NSGS) 2024 CVPR '26 Submission / Neuromorphic Computing Designed an event-driven neuromorphic graph segmentation (NSGS) framework that models image regions as asynchronous computational units, facilitating inherent parallelism and reducing redundant operations by 38–62%. Achieved a 17.5x speedup and superior accuracy (65.8% avg. mIoU) over state-of-the-art models (YOLOv8m-seg).",
  projects: "Other Projects Tiny Recursive Models (TRM) Based on arXiv:2510.04871. Re-implemented the Recursive Latent State architecture in PyTorch to handle complex reasoning tasks without increasing model size. Enhanced base implementation by integrating FlashAttention-2 and custom Triton kernels to fuse operations. ClerkTree Enterprise AI Claims Orchestration Platform (clerktree.com). Architected an event-driven multi-tenant system on AWS EKS with Apache Kafka and FastAPI. Engineered Agentic AI workflows via fine-tuned Mixtral-8x7B and Gemini Pro. NewSky Designed a pipeline to ingest and cluster topics from Bluesky API, synthesizing short conversational summaries. Built an automated daily digest generator with category grouping and abstractive summarization. Deployed via Flutter, PostgreSQL, Docker, and Kubernetes.",
  skills: "Technical Skills & Achievements Technical Skills Languages: Python, Java, SQL, LaTeX Machine Learning: PyTorch, Scikit-learn, LangChain, Transformers, Gymnasium, Ollama Development: FastAPI, Docker, Kubernetes, AWS, Apache Kafka, Redis, Flutter, Git Data Science: Pandas, NumPy, GeoPandas, Matplotlib, NetworkX Scholastic Achievements Selected among 200 participants for the Bitcoin Talents Program by Frankfurt School Blockchain Center (Jan '25) Selected from over 16,000 global applicants for Harvard Aspire Institute Leadership Program (Nov '24) Achieved a score of 102 in the core test of Test für Ausländische Studierende (TestAS) (Apr '23) Selected for the Harvard College Project for Asian and International Relations (HPAIR) (Aug '23) Awarded Certificate of Appreciation by Defense Minister of India for board exam performance (2020, 2022) Key Courses Computer Science: Data Structures, Design & Analysis of Algorithms, Artificial Intelligence, Reinforcement Learning, Digital Image Processing, Robotics, Social & Information Networks, Parallel & Concurrent Prog., Operating Systems, Database Systems, Computer Networks, Distributed Systems Mathematics: Applied Linear Algebra, Probability & Statistics, Discrete Math, Theory of Computation, Mathematical Methods I"
};

const validTabs = new Set(navLinks.map((link) => link.id));

function getTabFromHash(hash: string): string {
  const normalized = hash.replace(/^#/, '').trim().toLowerCase();
  return validTabs.has(normalized) ? normalized : 'home';
}

export default function PortfolioClient() {
  const [activeTab, setActiveTab] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [hasSyncedLocation, setHasSyncedLocation] = useState(false);

  useEffect(() => {
    const syncFromLocation = () => {
      const nextTab = getTabFromHash(window.location.hash);
      const nextSearch = new URLSearchParams(window.location.search).get('q') ?? '';

      setActiveTab(nextTab);
      setSearchQuery(nextSearch);
      setHasSyncedLocation(true);
      window.scrollTo({ top: 0, behavior: 'auto' });
    };

    syncFromLocation();
    window.addEventListener('hashchange', syncFromLocation);

    return () => {
      window.removeEventListener('hashchange', syncFromLocation);
    };
  }, []);

  useEffect(() => {
    if (!hasSyncedLocation) return;

    const params = new URLSearchParams(window.location.search);

    if (searchQuery) params.set('q', searchQuery);
    else params.delete('q');

    const nextSearch = params.toString();
    const nextUrl = `${window.location.pathname}${nextSearch ? `?${nextSearch}` : ''}${window.location.hash}`;
    window.history.replaceState(null, '', nextUrl);
  }, [hasSyncedLocation, searchQuery]);

  const matchQuery = (tab: string) => {
    if (!searchQuery) return activeTab === tab;
    return contentIndex[tab as keyof typeof contentIndex].toLowerCase().includes(searchQuery.toLowerCase());
  };

  const hasResults = searchQuery ? navLinks.some(link => matchQuery(link.id)) : true;

  const activateTab = (tabId: string) => {
    setActiveTab(tabId);
    setSearchQuery('');

    if (window.location.hash !== `#${tabId}`) {
      window.location.hash = tabId;
    }

    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  return (
    <div className={inter.className} style={{ height: '100vh', overflowY: 'auto', WebkitOverflowScrolling: 'touch', backgroundColor: '#fff', color: '#333' }}>
      <style>{`
        .nav-link {
          color: #bebebe;
          text-decoration: none;
          font-weight: 400;
          transition: color 0.2s ease, text-shadow 0.2s ease;
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
        }
        .nav-link.active {
          color: #fff;
          font-weight: 600;
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
          border-radius: 8px;
          border: 1px solid #eaeaea;
          background: #fafafa;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .project-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(0,0,0,0.05);
        }
        .footer-link {
          color: #aaa;
          text-decoration: none;
          transition: color 0.2s;
        }
        .footer-link:hover {
          color: #fff;
        }
        .nav-icon {
          stroke: #aaa;
          transition: stroke 0.2s ease;
        }
        .nav-icon:hover {
          stroke: #fff;
        }
        @media (max-width: 768px) {
          .nav-wrapper {
            flex-direction: column;
            padding: 16px;
            gap: 16px;
          }
          .nav-links {
            flex-wrap: wrap;
            justify-content: center;
          }
          .hero h1 {
            font-size: 32px !important;
          }
          .grid-container {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>

      {/* Top Navbar */}
      <nav className="nav-wrapper" style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        backgroundColor: '#000', 
        color: '#fff', 
        padding: '16px 32px',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
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
          <div style={{ position: 'relative' }}>
            <svg style={{ position: 'absolute', left: '8px', top: '50%', transform: 'translateY(-50%)', stroke: '#888' }} width="14" height="14" viewBox="0 0 24 24" fill="none" strokeWidth="2">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="M21 21l-4.3-4.3"></path>
            </svg>
            <input 
              type="text" 
              placeholder="Search..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                backgroundColor: '#1a1a1a',
                border: '1px solid #333',
                borderRadius: '16px',
                padding: '4px 8px 4px 28px',
                color: '#fff',
                fontSize: '13px',
                width: '120px',
                outline: 'none',
                transition: 'width 0.2s, border-color 0.2s'
              }}
              onFocus={(e) => { e.currentTarget.style.width = '160px'; e.currentTarget.style.borderColor = '#555'; }}
              onBlur={(e) => { if (!searchQuery) { e.currentTarget.style.width = '120px'; e.currentTarget.style.borderColor = '#333'; } }}
            />
          </div>
        </div>
      </nav>

      {/* Hero Banner (Always partially visible or only on 'home'?) Let's make it only on 'home' or always visible but smaller for other tabs */}
      {matchQuery('home') && (
        <header className="hero" style={{ 
          backgroundColor: '#277093', 
          color: '#fff', 
          textAlign: 'center', 
          padding: '80px 20px',
          boxShadow: 'inset 0 -10px 20px auto'
        }}>
          <h1 style={{ fontSize: '48px', fontWeight: 300, margin: 0, letterSpacing: '0.02em', textShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>Animesh Mishra</h1>
          <p style={{ marginTop: '16px', fontSize: '18px', color: '#e0f0f5', fontWeight: 300 }}>
            Delhi, India | am847@snu.edu.in
          </p>
        </header>
      )}

      {/* Main Content Area */}
      <main style={{ maxWidth: '900px', margin: '0 auto', padding: '60px 20px', lineHeight: 1.8, fontSize: '16px', color: '#333' }}>
        
        {searchQuery && (
          <div style={{ marginBottom: '40px', padding: '16px', backgroundColor: '#f9f9f9', borderRadius: '8px', borderLeft: '4px solid #277093' }}>
            <h2 style={{ fontSize: '18px', margin: 0, fontWeight: 500, color: '#444' }}>
              {hasResults ? `Search Results for "${searchQuery}"` : `No results found for "${searchQuery}"`}
            </h2>
          </div>
        )}

        {matchQuery('home') && (
          <section id="contact" style={{ marginBottom: '60px', textAlign: 'center' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 600, color: '#111', borderBottom: '2px solid #277093', paddingBottom: '8px', display: 'inline-block', marginBottom: '24px' }}>Welcome</h2>
            <p style={{ maxWidth: '600px', margin: '0 auto' }}>
              Hi, I&apos;m Animesh! Click on the navigation tabs above to explore my background, experience, research, and projects in a distinct sub-view without scrolling endlessly. 
            </p>
            <div style={{ marginTop: '24px' }}>
              I am always open to interesting projects, collaborations, and opportunities. You can reach out to me directly at: <br/>
              <a href="mailto:am847@snu.edu.in" className="custom-anchor" style={{ fontWeight: 600, fontSize: '18px', marginTop: '12px', display: 'inline-block' }}>am847@snu.edu.in</a>
            </div>
            <div style={{ marginTop: '24px', display: 'flex', gap: '16px', justifyContent: 'center' }}>
              <a href="https://linkedin.com/in/animeshmishra0" target="_blank" rel="noopener noreferrer" className="custom-anchor">LinkedIn Profile</a>
              <a href="https://github.com/amethystani" target="_blank" rel="noopener noreferrer" className="custom-anchor">GitHub Account</a>
            </div>
          </section>
        )}

        {matchQuery('about') && (
          <section id="about">
            <h2 style={{ fontSize: '24px', fontWeight: 600, color: '#111', borderBottom: '2px solid #277093', paddingBottom: '8px', display: 'inline-block', marginBottom: '24px' }}>Education</h2>
            <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
              <li style={{ marginBottom: '32px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '8px' }}>
                  <strong>B.Tech in Computer Science and Engineering</strong>
                  <span style={{ fontSize: '14px', color: '#666' }}>Expected 2026</span>
                </div>
                <p style={{ margin: 0, color: '#444' }}>Shiv Nadar Institution of Eminence &bull; CGPA: 7.34</p>
              </li>
              <li style={{ marginBottom: '32px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '8px' }}>
                  <strong>Class XII (ISC)</strong>
                  <span style={{ fontSize: '14px', color: '#666' }}>2022</span>
                </div>
                <p style={{ margin: 0, color: '#444' }}>City Montessori School &bull; 91.25%</p>
              </li>
              <li>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '8px' }}>
                  <strong>Class X (ICSE)</strong>
                  <span style={{ fontSize: '14px', color: '#666' }}>2020</span>
                </div>
                <p style={{ margin: 0, color: '#444' }}>City Montessori School &bull; 94.00%</p>
              </li>
            </ul>
          </section>
        )}

        {matchQuery('experience') && (
          <section id="experience">
            <h2 style={{ fontSize: '24px', fontWeight: 600, color: '#111', borderBottom: '2px solid #277093', paddingBottom: '8px', display: 'inline-block', marginBottom: '24px' }}>Experience</h2>
            <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
              <li style={{ marginBottom: '40px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '8px' }}>
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
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '8px' }}>
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
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '8px' }}>
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
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '8px' }}>
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
          <section id="research">
            <h2 style={{ fontSize: '24px', fontWeight: 600, color: '#111', borderBottom: '2px solid #277093', paddingBottom: '8px', display: 'inline-block', marginBottom: '24px' }}>Research &amp; Publications</h2>
            <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
              
              <li style={{ marginBottom: '48px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '8px' }}>
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
                    <a href="https://arxiv.org/abs/2512.12617v1" target="_blank" rel="noopener noreferrer" className="custom-anchor">arXiv:2512.12617v1</a> &rarr; Interactive Document
                  </div>
                  <iframe 
                    src="https://arxiv.org/html/2512.12617v1" 
                    style={{ width: '100%', height: '400px', border: 'none' }}
                    title="arXiv Preprint"
                  ></iframe>
                </div>
              </li>

              <li style={{ marginBottom: '48px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '8px' }}>
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
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '8px' }}>
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
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '8px' }}>
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
          <section id="projects">
            <h2 style={{ fontSize: '24px', fontWeight: 600, color: '#111', borderBottom: '2px solid #277093', paddingBottom: '8px', display: 'inline-block', marginBottom: '24px' }}>Other Projects</h2>
            <div className="grid-container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              
              <div className="project-card">
                <h3 style={{ fontSize: '18px', margin: '0 0 12px 0', color: '#111' }}>Tiny Recursive Models (TRM)</h3>
                <p style={{ fontSize: '14px', margin: 0, color: '#555' }}>
                  Based on arXiv:2510.04871. Re-implemented the Recursive Latent State architecture in PyTorch to handle complex reasoning tasks without increasing model size. Enhanced base implementation by integrating FlashAttention-2 and custom Triton kernels to fuse operations.
                </p>
              </div>

              <div className="project-card">
                <h3 style={{ fontSize: '18px', margin: '0 0 12px 0', color: '#111' }}>ClerkTree</h3>
                <p style={{ fontSize: '14px', margin: 0, color: '#555' }}>
                  Enterprise AI Claims Orchestration Platform (clerktree.com). Architected an event-driven multi-tenant system on AWS EKS with Apache Kafka and FastAPI. Engineered Agentic AI workflows via fine-tuned Mixtral-8x7B and Gemini Pro.
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
          <section id="skills">
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
        
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <Link href="/" className="custom-anchor" style={{ fontSize: '15px', fontWeight: 600, padding: '12px 24px', backgroundColor: '#f0f5f8', borderRadius: '30px', display: 'inline-block' }}>
            &larr; Return to macOS Terminal
          </Link>
        </div>
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
          <div style={{ display: 'flex', gap: '16px', marginTop: '8px' }}>
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
