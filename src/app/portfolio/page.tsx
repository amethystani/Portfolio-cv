import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Animesh Mishra | Portfolio',
  description: 'Animesh Mishra - Researcher & Software Engineer',
};

const navLinks = [
  { name: 'About', href: '#about' },
  { name: 'Experience', href: '#experience' },
  { name: 'Research', href: '#research' },
  { name: 'Projects', href: '#projects' },
  { name: 'Skills', href: '#skills' },
];

export default function PortfolioReplica() {
  return (
    <div className={inter.className} style={{ minHeight: '100vh', backgroundColor: '#fcfcfc', color: '#222', scrollBehavior: 'smooth' }}>
      <style>{`
        html { scroll-behavior: smooth; }
        .nav-link { color: #a0a0a0; text-decoration: none; font-weight: 500; transition: color 0.2s ease; font-size: 14px; }
        .nav-link:hover { color: #fff; }
        .nav-link.active { color: #fff; font-weight: 600; }
        .custom-anchor { color: #0a4b78; text-decoration: none; border-bottom: 1px solid transparent; transition: border-bottom 0.2s; font-weight: 500; }
        .custom-anchor:hover { border-bottom: 1px solid #0a4b78; }
        .section-title { font-size: 26px; font-weight: 700; color: #111; border-bottom: 2px solid #0a4b78; padding-bottom: 8px; display: inline-block; margin-bottom: 28px; }
        .entry-block { margin-bottom: 36px; }
        .entry-header { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 4px; flex-wrap: wrap; }
        .entry-title { font-weight: 600; font-size: 18px; color: #111; }
        .entry-meta { color: #555; margin-bottom: 12px; font-size: 15px; font-weight: 500; }
        .entry-date { font-size: 14px; color: #555; font-weight: 500; white-space: nowrap; }
        .bullet-list { padding-left: 20px; margin: 0; color: #444; line-height: 1.6; }
        .bullet-list li { margin-bottom: 8px; }
        .project-card { padding: 24px; border-radius: 8px; border: 1px solid #eaeaea; background: #fff; transition: transform 0.2s, box-shadow 0.2s; height: 100%; display: flex; flex-direction: column; }
        .project-card:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.06); }
        .contact-link { display: inline-flex; align-items: center; gap: 8px; color: #e0f0f5; text-decoration: none; font-size: 15px; transition: color 0.2s; }
        .contact-link:hover { color: #fff; }
        @media (max-width: 768px) {
          .nav-wrapper { display: none !important; }
        }
      `}</style>

      {/* Top Navbar */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#000', color: '#fff', padding: '16px 32px', position: 'sticky', top: 0, zIndex: 50 }}>
        <div>
          <span style={{ fontSize: '20px', fontWeight: 500, letterSpacing: '0.5px' }}>Animesh Mishra</span>
        </div>
        <div className="nav-wrapper" style={{ display: 'flex', gap: '28px', alignItems: 'center' }}>
          {navLinks.map((link, idx) => (
            <a key={link.name} href={link.href} className={`nav-link ${idx === 0 ? 'active' : ''}`}>{link.name}</a>
          ))}
        </div>
      </nav>

      {/* Hero Banner */}
      <header style={{ backgroundColor: '#0a4b78', color: '#fff', textAlign: 'center', padding: '80px 20px' }}>
        <h1 style={{ fontSize: '48px', fontWeight: 600, margin: 0, letterSpacing: '-0.02em' }}>Animesh Mishra</h1>
        <p style={{ marginTop: '16px', fontSize: '18px', color: '#e0f0f5', fontWeight: 300 }}>Delhi, India • Researcher &amp; Software Engineer</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', marginTop: '24px', flexWrap: 'wrap' }}>
          <a href="mailto:am847@snu.edu.in" className="contact-link">📧 am847@snu.edu.in</a>
          <a href="https://linkedin.com/in/animeshmishra0" target="_blank" rel="noopener noreferrer" className="contact-link">🔗 LinkedIn</a>
          <a href="https://github.com/amethystani" target="_blank" rel="noopener noreferrer" className="contact-link">💻 GitHub</a>
        </div>
      </header>

      {/* Main Content Area */}
      <main style={{ maxWidth: '900px', margin: '0 auto', padding: '60px 20px', lineHeight: 1.8, fontSize: '16px', color: '#333' }}>
        
        {/* Education Section */}
        <section id="about" style={{ marginBottom: '60px' }}>
          <h2 className="section-title">Education</h2>
          <div style={{ padding: '24px', backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #eaeaea' }}>
            <div className="entry-header">
              <span className="entry-title">B.Tech in Computer Science and Engineering</span>
              <span className="entry-date">Expected 2026</span>
            </div>
            <div className="entry-meta">Shiv Nadar Institution of Eminence • CGPA: 7.34</div>
            
            <div className="entry-header" style={{ marginTop: '20px' }}>
              <span className="entry-title">Class XII (ISC)</span>
              <span className="entry-date">2022</span>
            </div>
            <div className="entry-meta">City Montessori School • 91.25%</div>

            <div className="entry-header" style={{ marginTop: '20px' }}>
              <span className="entry-title">Class X (ICSE)</span>
              <span className="entry-date">2020</span>
            </div>
            <div className="entry-meta" style={{ marginBottom: 0 }}>City Montessori School • 94.00%</div>
          </div>
        </section>

        {/* Experience Section */}
        <section id="experience" style={{ marginBottom: '60px' }}>
          <h2 className="section-title">Professional Experience</h2>
          
          <div className="entry-block">
            <div className="entry-header">
              <span className="entry-title">Student Researcher (Part-time)</span>
              <span className="entry-date">May 2025 – Sep 2025</span>
            </div>
            <div className="entry-meta">Complexity Science Hub • Vienna, Austria (Remote)</div>
            <ul className="bullet-list">
              <li>Engineered a reproducible Python ETL to ingest and enrich physics-literature data from OpenAlex and APS APIs. Built joined research-graph tables across authors, institutions, fields, and time. Added demographic annotations for downstream bias slicing.</li>
              <li>Built a batched LLM evaluation harness to run parallel factuality and validity audits across 3 open-source models (Gemma 2 9B, LLaMA 3, Mixtral 8x7B). Standardized prompts and outputs to enable apples-to-apples comparisons. Produced model-level scorecards on a shared dataset.</li>
              <li>Implemented Evaluator and Auditor modules to compute error-rate and consistency metrics and graph-based similarity features from co-authorship networks. Generated discipline-wise statistical plots to quantify representation and performance disparities across demographic groups.</li>
            </ul>
          </div>

          <div className="entry-block">
            <div className="entry-header">
              <span className="entry-title">Quant Research Analyst Intern</span>
              <span className="entry-date">Jun 2025 – Aug 2025</span>
            </div>
            <div className="entry-meta">ConsultAdd Services Pvt. Ltd. • Pune, Maharashtra</div>
            <ul className="bullet-list">
              <li>Designed and deployed high-volume data scraping pipelines for market intelligence, extracting over 500K records on unpartnered staffing firms and operationalizing an analytical framework for identifying niche hiring trends across competitive tech roles.</li>
              <li>Constructed and backtested time-series predictive models (Prophet, XGBoost) to forecast staffing demand and role saturation over a 12-month horizon, providing the business team with 8% more accurate resource allocation insights compared to prior heuristic forecasting.</li>
            </ul>
          </div>

          <div className="entry-block">
            <div className="entry-header">
              <span className="entry-title">Intern (DCT-R&D Department)</span>
              <span className="entry-date">Sep 2024 – Dec 2024</span>
            </div>
            <div className="entry-meta">Exicom Group</div>
            <ul className="bullet-list">
              <li>Developed Time-Series Predictive Models and an AI Assistant (EVAI) to forecast Electric Vehicle (EV) charging demand; integrated an automated continuous feedback loop that improved model accuracy based on 85% user satisfaction metrics.</li>
              <li>Engineered a comprehensive Geospatial Feature Engineering Pipeline using OpenStreetMap, Folium, and GeoPandas to analyze charger placement optimization by correlating charging station data with 10+ urban amenity density factors within a 2.5km radius.</li>
              <li>Implemented an efficient MLOps workflow, including LangChain integration and containerized deployment via Ollama, enabling batched inference and hyperparameter tuning for 100+ concurrent queries per iteration.</li>
            </ul>
          </div>

          <div className="entry-block">
            <div className="entry-header">
              <span className="entry-title">Research Intern (Institute for Systems Studies and Analyses)</span>
              <span className="entry-date">May 2024 – Jul 2024</span>
            </div>
            <div className="entry-meta">Defence Research & Development Organisation (DRDO)</div>
            <ul className="bullet-list">
              <li>Designed and implemented a custom Genetic Algorithm (GA) with specialized fitness functions and mutation operators to solve a high-dimensional, constrained Vehicle Routing Problem (VRP), optimizing logistics strategies and achieving a 15% cost reduction over heuristic-based baseline methods.</li>
              <li>Used DBSCAN/K-Means clustering to segment complex mobility patterns, generating geospatial heatmap visualizations and statistical plots to provide actionable insights into resource allocation and fleet movements.</li>
            </ul>
          </div>
        </section>

        {/* Research Section */}
        <section id="research" style={{ marginBottom: '60px' }}>
          <h2 className="section-title">Research &amp; Publications</h2>

          <div className="entry-block">
            <div className="entry-header">
              <span className="entry-title">Spectral Sentinel: Scalable Byzantine-Robust Decentralized Federated Learning via Sketched Random Matrix Theory on Blockchain</span>
              <span className="entry-date">2025</span>
            </div>
            <div className="entry-meta">Preprint / Systems + ML</div>
            <ul className="bullet-list">
              <li>Designed an RMT-driven Byzantine detector by tracking gradient covariance eigenspectra against the Marchenko–Pastur law (KS test + tail anomalies), and scaled detection via Frequent Directions sketching with O(k²) memory for k≪d.</li>
              <li>Proved (ε,δ)-Byzantine resilience with minimax-optimal convergence O(σf/√T + f²/T), and validated on Polygon testnet/mainnet across 144 attack–aggregator settings, achieving 78.4% avg. accuracy vs. 48–63% baselines.</li>
            </ul>
            <div style={{ marginTop: '16px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #eaeaea', backgroundColor: '#fafafa', boxShadow: 'inset 0 0 10px rgba(0,0,0,0.02)' }}>
              <div style={{ padding: '12px 16px', backgroundColor: '#f1f1f1', borderBottom: '1px solid #eaeaea', fontSize: '14px', fontWeight: 600, color: '#333', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>📄 arXiv:2512.12617v1</span>
                <a href="https://arxiv.org/abs/2512.12617v1" target="_blank" rel="noopener noreferrer" style={{ color: '#0a4b78', textDecoration: 'none' }}>View Abstract On arXiv →</a>
              </div>
              {/* Using arXiv's experimental HTML paper view */}
              <iframe 
                src="https://arxiv.org/html/2512.12617v1" 
                style={{ width: '100%', height: '500px', border: 'none' }}
                title="arXiv Preprint: Spectral Sentinel"
              ></iframe>
            </div>
          </div>

          <div className="entry-block">
            <div className="entry-header">
              <span className="entry-title">Reliability Analysis of Non-Bonded/Re-usable PZT Sensors for EMI-based SHM</span>
              <span className="entry-date">2024</span>
            </div>
            <div className="entry-meta">Elsevier Measurement (In Review) / Structural Health Monitoring</div>
            <ul className="bullet-list">
              <li>Built a reliability/measurement-system framework for electromechanical impedance (EMI) signals across surface-bonded vs clamp-based PZT attachments, combining ANOVA Gauge R&R, ICC, I2C2, discriminability, fingerprinting index, and multivariate rank-sum tests.</li>
              <li>Quantified clamp-tightening regimes (free-free/open/partial/fully bonded), showing fully bonded clamp achieves ICC = 0.993 meeting AIAG acceptance, delivering &gt;5× reliability improvement.</li>
            </ul>
            <div style={{ marginTop: '16px', padding: '16px', borderRadius: '8px', border: '1px solid #e1e8ed', backgroundColor: '#f5f8fa', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <h4 style={{ margin: '0', color: '#111', fontSize: '15px' }}>ScienceDirect Publication Link</h4>
              <p style={{ margin: '0', fontSize: '14px', color: '#555' }}>Access the complete research article and methodology online.</p>
              <a href="https://www.sciencedirect.com/science/article/abs/pii/S026322412600730X?via%3Dihub" target="_blank" rel="noopener noreferrer" className="custom-anchor" style={{ alignSelf: 'flex-start', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                View Article on ScienceDirect
              </a>
            </div>
          </div>

          <div className="entry-block">
            <div className="entry-header">
              <span className="entry-title">A Multi-Agent Hyperbolic Framework for Legal Reasoning and Retrieval</span>
              <span className="entry-date">2025</span>
            </div>
            <div className="entry-meta">Research Paper / Legal AI, Geometric Deep Learning</div>
            <ul className="bullet-list">
              <li>Built Hyperbolic Legal Networks (HGCN) by embedding 49,633 cases in a Poincaré ball to encode court authority radially, achieving 0.92 Precision@5 on legal retrieval.</li>
              <li>Designed a game-theoretic multi-agent pipeline with Nash-style coordination to resolve contradictory citations, and integrated adversarial hybrid retrieval with a Prosecutor–Defense–Judge debate to resolve 94% of citation conflicts.</li>
            </ul>
          </div>

          <div className="entry-block">
            <div className="entry-header">
              <span className="entry-title">Neuro-Scheduling for Graph Segmentation (NSGS)</span>
              <span className="entry-date">2024</span>
            </div>
            <div className="entry-meta">CVPR &apos;26 Submission / Neuromorphic Computing</div>
            <ul className="bullet-list">
              <li>Designed an event-driven neuromorphic graph segmentation (NSGS) framework that models image regions as asynchronous computational units, facilitating inherent parallelism and reducing redundant operations by 38–62%.</li>
              <li>Achieved a 17.5x speedup and superior accuracy (65.8% avg. mIoU) over state-of-the-art models (YOLOv8m-seg), while demonstrating exceptional resource efficiency with 4.4x less energy consumption.</li>
            </ul>
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" style={{ marginBottom: '60px' }}>
          <h2 className="section-title">Other Projects</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
            
            <div className="project-card">
              <h3 style={{ fontSize: '18px', margin: '0 0 8px 0', color: '#111' }}>Tiny Recursive Models (TRM)</h3>
              <div style={{ fontSize: '13px', color: '#666', marginBottom: '12px', fontWeight: 500 }}>Implementation Based on arXiv:2510.04871</div>
              <ul className="bullet-list" style={{ fontSize: '14px', margin: 0, flexGrow: 1 }}>
                <li>Re-implemented the Recursive Latent State architecture in PyTorch to handle complex reasoning tasks without increasing model size.</li>
                <li>Enhanced base implementation by integrating FlashAttention-2 and custom Triton kernels to fuse operations.</li>
                <li>Achieved constant VRAM footprint regardless of reasoning depth during inference.</li>
              </ul>
            </div>

            <div className="project-card">
              <h3 style={{ fontSize: '18px', margin: '0 0 8px 0', color: '#111' }}>ClerkTree</h3>
              <div style={{ fontSize: '13px', color: '#666', marginBottom: '12px', fontWeight: 500 }}>Enterprise AI Claims Orchestration Platform</div>
              <ul className="bullet-list" style={{ fontSize: '14px', margin: 0, flexGrow: 1 }}>
                <li>Architected an event-driven multi-tenant system on AWS EKS with Apache Kafka and FastAPI.</li>
                <li>Engineered Agentic AI workflows via fine-tuned Mixtral-8x7B and Gemini Pro, orchestrating Twilio interrupts and database mutations based on real-time sentiment.</li>
              </ul>
              <a href="https://clerktree.com" target="_blank" rel="noopener noreferrer" className="custom-anchor" style={{ display: 'block', marginTop: '16px', fontSize: '14px', fontWeight: 600 }}>Visit clerktree.com →</a>
            </div>

            <div className="project-card">
              <h3 style={{ fontSize: '18px', margin: '0 0 8px 0', color: '#111' }}>NewSky</h3>
              <div style={{ fontSize: '13px', color: '#666', marginBottom: '12px', fontWeight: 500 }}>Mobile + ML Code</div>
              <ul className="bullet-list" style={{ fontSize: '14px', margin: 0, flexGrow: 1 }}>
                <li>Designed a pipeline to ingest and cluster topics from Bluesky API, synthesizing short conversational summaries.</li>
                <li>Built automated daily digest generators using PEGASUS.</li>
                <li>Deployed production-ready architecture via Flutter, PostgreSQL, Redis, Docker, and Kubernetes.</li>
              </ul>
            </div>

          </div>
        </section>

        {/* Skills & Achievements */}
        <section id="skills" style={{ marginBottom: '60px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: '40px' }}>
            
            <div>
              <h2 className="section-title">Technical Skills</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <strong style={{ minWidth: '150px' }}>Languages</strong>
                  <span style={{ color: '#444' }}>Python, Java, SQL, LaTeX</span>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <strong style={{ minWidth: '150px' }}>Machine Learning</strong>
                  <span style={{ color: '#444' }}>PyTorch, Scikit-learn, LangChain, Transformers, Gymnasium, Ollama</span>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <strong style={{ minWidth: '150px' }}>Development</strong>
                  <span style={{ color: '#444' }}>FastAPI, Docker, Kubernetes, AWS, Apache Kafka, Redis, Flutter, Git</span>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <strong style={{ minWidth: '150px' }}>Data Science</strong>
                  <span style={{ color: '#444' }}>Pandas, NumPy, GeoPandas, Matplotlib, NetworkX</span>
                </div>
              </div>
            </div>

            <div>
              <h2 className="section-title">Scholastic Achievements</h2>
              <ul className="bullet-list">
                <li>Selected among 200 participants for the Bitcoin Talents Program by Frankfurt School Blockchain Center (Jan &apos;25)</li>
                <li>Selected from over 16,000 global applicants for Harvard Aspire Institute Leadership Program (Nov &apos;24)</li>
                <li>Achieved a score of 102 in the core test of Test für Ausländische Studierende (TestAS) (Apr &apos;23)</li>
                <li>Selected for the Harvard College Project for Asian and International Relations (HPAIR) - highly selective program with ~2-3% acceptance (Aug &apos;23)</li>
                <li>Awarded Certificate of Appreciation by Defense Minister of India for board exam performance (&apos;20, &apos;22)</li>
              </ul>
            </div>

            <div>
              <h2 className="section-title">Key Courses</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <strong style={{ minWidth: '150px' }}>Computer Science</strong>
                  <span style={{ color: '#444', lineHeight: 1.6 }}>Data Structures, Design &amp; Analysis of Algorithms, Artificial Intelligence, Intro to Reinforcement Learning, Digital Image Processing, Introduction to Robotics, Social &amp; Information Networks, Parallel &amp; Concurrent Programming, Operating Systems, Database Systems, Computer Networks, Distributed Systems</span>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <strong style={{ minWidth: '150px' }}>Mathematics</strong>
                  <span style={{ color: '#444', lineHeight: 1.6 }}>Applied Linear Algebra, Intro to Probability &amp; Statistics, Discrete Mathematics, Theory of Computation, Mathematical Methods I</span>
                </div>
              </div>
            </div>

          </div>
        </section>

        <div style={{ textAlign: 'center', margin: '60px 0 40px 0' }}>
          <Link href="/" className="custom-anchor" style={{ fontSize: '15px', fontWeight: 600, padding: '12px 24px', backgroundColor: '#eef3f6', borderRadius: '30px', display: 'inline-block' }}>
            ← Return to macOS Terminal
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer style={{ backgroundColor: '#0a0a0a', color: '#888', padding: '40px 20px', textAlign: 'center', fontSize: '13px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center' }}>
          <p style={{ margin: 0, fontSize: '15px' }}>&copy; {new Date().getFullYear()} Animesh Mishra.</p>
          <div style={{ display: 'flex', gap: '20px', marginTop: '4px' }}>
            <a href="https://github.com/amethystani" target="_blank" rel="noopener noreferrer" style={{ color: '#aaa', textDecoration: 'none' }}>GitHub</a>
            <a href="https://linkedin.com/in/animeshmishra0" target="_blank" rel="noopener noreferrer" style={{ color: '#aaa', textDecoration: 'none' }}>LinkedIn</a>
            <a href="mailto:am847@snu.edu.in" style={{ color: '#aaa', textDecoration: 'none' }}>Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
