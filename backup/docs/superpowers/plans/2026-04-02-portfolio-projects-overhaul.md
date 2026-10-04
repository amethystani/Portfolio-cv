# Portfolio Projects Overhaul Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add 4 new project cards (NSGS, Spectral Sentinel, EVPredAI, LegalNexus), upgrade 2 existing minimal cards (TRM, NewSky) to full cards with pills/bullets, expand the skills section with CV-accurate categories, and add visual polish (type badges, metric chips, link badges, colored top borders) across the projects section.

**Architecture:** Single file change — `src/app/portfolio/PortfolioClient.tsx`. All CSS lives in the `<style>` block (lines 108–378). All projects live in the `matchQuery('projects')` section (lines 636–699). Skills live in `matchQuery('skills')` (lines 701–728). The `contentIndex` object at line 15 drives search — update `contentIndex.projects` to include all new project text.

**Tech Stack:** Next.js 14, React 18, TypeScript, inline CSS-in-JS (no Tailwind in this file).

---

## File Map

| File | Change |
|---|---|
| `src/app/portfolio/PortfolioClient.tsx` | All changes — CSS, contentIndex, projects JSX, skills JSX |

---

### Task 1: Add new CSS classes to the `<style>` block

**Files:**
- Modify: `src/app/portfolio/PortfolioClient.tsx` — insert after the `.project-embed-note` block (after line 254, before `.content-shell`)

- [ ] **Step 1: Insert new CSS after the `.project-embed-note` rule**

Find this line in the `<style>` block:
```css
        .project-embed-note {
          padding: 10px 14px 14px;
          font-size: 12px;
          line-height: 1.55;
          color: #5a6770;
          border-top: 1px solid #e5edf2;
          background: rgba(255,255,255,0.92);
        }
```

Insert immediately after the closing `}`:
```css
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
```

- [ ] **Step 2: Verify the dev server compiles without errors**

```bash
cd /Users/animesh/cmdcv/Portfolio-cv && npm run dev
```
Expected: No TypeScript or CSS errors. Page loads at localhost:3000/portfolio#projects.

- [ ] **Step 3: Commit**

```bash
cd /Users/animesh/cmdcv/Portfolio-cv
git add src/app/portfolio/PortfolioClient.tsx
git commit -m "style: add project badge, metric chip, and link badge CSS classes"
```

---

### Task 2: Update `contentIndex.projects` for search coverage

**Files:**
- Modify: `src/app/portfolio/PortfolioClient.tsx` — line 20, the `projects` key in `contentIndex`

- [ ] **Step 1: Replace the `projects` value in `contentIndex`**

Find:
```ts
  projects: "Other Projects ClerkTree AI-powered workflow automation platform for claims and back-office operations (clerktree.com). Shown with a centered scrollable site snapshot because the live site blocks third-party iframe embedding. Architected an event-driven multi-tenant system on AWS EKS with Apache Kafka and FastAPI. Engineered agentic AI workflows via fine-tuned Mixtral-8x7B and Gemini Pro. Tiny Recursive Models (TRM) Based on arXiv:2510.04871. Re-implemented the Recursive Latent State architecture in PyTorch to handle complex reasoning tasks without increasing model size. Enhanced base implementation by integrating FlashAttention-2 and custom Triton kernels to fuse operations. NewSky Designed a pipeline to ingest and cluster topics from Bluesky API, synthesizing short conversational summaries. Built an automated daily digest generator with category grouping and abstractive summarization. Deployed via Flutter, PostgreSQL, Docker, and Kubernetes.",
```

Replace with:
```ts
  projects: "Other Projects ClerkTree AI-powered workflow automation platform for claims and back-office operations clerktree.com AWS EKS Apache Kafka FastAPI Mixtral Gemini Pro Neuro-Scheduling Graph Segmentation NSGS BIPS-PKD neuromorphic event-driven image segmentation CVPR 26 60.8x speedup EfficientSAM SegFormer Mask2Former SAM2 PIDNet YOLOv8 DINOv3 Android ONNX PyTorch C++ SpikeQueue thermal scheduling knowledge distillation Spectral Sentinel Byzantine-Robust Federated Learning Blockchain Random Matrix Theory Marchenko-Pastur Frequent Directions sketching Polygon arXiv 2512.12617 78.4 accuracy 38 Byzantine tolerance 1034x memory reduction EVPredAI EV charging demand forecasting Exicom XGBoost Bayesian Moran SARIMA BERT LoRA LangChain Ollama NeMo GeoPandas 85 user satisfaction LegalNexus Hyperbolic Graph Networks Poincare ball HGCN court authority multi-agent Nash game-theoretic FAISS legal retrieval 0.92 Precision 49633 cases Tiny Recursive Models TRM arXiv 2510.04871 FlashAttention-2 Triton kernels SmolLM Nemotron FineWebEDU NewSky Bluesky API topic clustering summarization Flutter PostgreSQL Docker Kubernetes",
```

- [ ] **Step 2: Commit**

```bash
cd /Users/animesh/cmdcv/Portfolio-cv
git add src/app/portfolio/PortfolioClient.tsx
git commit -m "feat: expand contentIndex.projects for full search coverage"
```

---

### Task 3: Add NSGS / BIPS-PKD project card

**Files:**
- Modify: `src/app/portfolio/PortfolioClient.tsx` — insert after the closing `</div>` of the ClerkTree card (after line 681)

- [ ] **Step 1: Insert the NSGS card after ClerkTree's closing `</div>`**

Find this exact closing sequence (ClerkTree card end):
```jsx
              </div>

            </div>
          </div>

              <div className="project-card">
                <h3 style={{ fontSize: '18px', margin: '0 0 12px 0', color: '#111' }}>Tiny Recursive Models (TRM)</h3>
```

Replace with:
```jsx
              </div>

            </div>
          </div>

              <div className="project-card type-research">
                <div className="project-card-header">
                  <span className="project-type-badge research">Research</span>
                  <span className="project-venue-badge">CVPR &apos;26 Submission</span>
                </div>
                <h3 style={{ fontSize: '18px', margin: '0 0 8px 0', color: '#111' }}>Neuro-Scheduling for Graph Segmentation (NSGS)</h3>
                <div className="project-metric-row">
                  <span className="project-metric-chip">60.8&times; speedup</span>
                  <span className="project-metric-chip">65.8% mIoU</span>
                  <span className="project-metric-chip">4.4&times; less energy</span>
                </div>
                <div className="project-meta">
                  <span className="project-pill">Neuromorphic Computing</span>
                  <span className="project-pill">Image Segmentation</span>
                  <span className="project-pill">C++ NSGS Runtime</span>
                  <span className="project-pill">ONNX / PyTorch</span>
                  <span className="project-pill">Android</span>
                </div>
                <ul className="project-points">
                  <li>Designed an event-driven neuromorphic framework where image patches act as asynchronous computational units that fire when local activations exceed adaptive thresholds &mdash; eliminating the redundant computation in standard frame-by-frame inference, cutting operations by 38&ndash;62%.</li>
                  <li>Built BIPS-PKD (Backbone-Integrated Partial Split + Progressive Knowledge Distillation): splits any segmentation backbone at a <em>learned</em> intermediate layer and replaces the heavy transformer tail with a distilled student head at inference &mdash; model-family-agnostic, no architecture surgery required.</li>
                  <li>Benchmarked across 9 model families (EfficientSAM, SegFormer, Mask2Former, SAM2, PIDNet, YOLOv8/v12, DINOv3, MobileSAM); top result: EfficientSAM small at 60.8&times; speedup (~16 FPS on 4-thread CPU, no GPU).</li>
                  <li>Ships as a fully offline Android app (~500 MB bundled ONNX models) backed by a C++ lock-free SpikeQueue runtime with thermal-aware scheduling.</li>
                </ul>
                <div className="project-links-row">
                  <a href="https://github.com/amethystani/NSGSAlgorithm" target="_blank" rel="noopener noreferrer" className="project-link-badge">&#8599; GitHub</a>
                </div>
              </div>

              <div className="project-card">
                <h3 style={{ fontSize: '18px', margin: '0 0 12px 0', color: '#111' }}>Tiny Recursive Models (TRM)</h3>
```

- [ ] **Step 2: Verify page renders new card**

Open `localhost:3000/portfolio#projects`. NSGS card should appear in the left column with a purple top border, metric chips, and pills.

- [ ] **Step 3: Commit**

```bash
cd /Users/animesh/cmdcv/Portfolio-cv
git add src/app/portfolio/PortfolioClient.tsx
git commit -m "feat: add NSGS/BIPS-PKD project card"
```

---

### Task 4: Add Spectral Sentinel project card

**Files:**
- Modify: `src/app/portfolio/PortfolioClient.tsx` — insert after NSGS card, before TRM

- [ ] **Step 1: Insert Spectral Sentinel card**

Find:
```jsx
              <div className="project-card">
                <h3 style={{ fontSize: '18px', margin: '0 0 12px 0', color: '#111' }}>Tiny Recursive Models (TRM)</h3>
```

Replace with:
```jsx
              <div className="project-card type-research">
                <div className="project-card-header">
                  <span className="project-type-badge research">Research</span>
                  <span className="project-venue-badge">arXiv:2512.12617</span>
                </div>
                <h3 style={{ fontSize: '18px', margin: '0 0 8px 0', color: '#111' }}>Spectral Sentinel &mdash; Byzantine-Robust Federated Learning</h3>
                <div className="project-metric-row">
                  <span className="project-metric-chip">78.4% accuracy</span>
                  <span className="project-metric-chip">38% Byzantine tolerance</span>
                  <span className="project-metric-chip">1,034&times; memory reduction</span>
                </div>
                <div className="project-meta">
                  <span className="project-pill">Random Matrix Theory</span>
                  <span className="project-pill">Byzantine-Robust FL</span>
                  <span className="project-pill">Frequent Directions Sketching</span>
                  <span className="project-pill">Blockchain / Polygon</span>
                  <span className="project-pill">Federated Learning</span>
                </div>
                <ul className="project-points">
                  <li>Designed the first Byzantine-robust federated learning system grounded in Random Matrix Theory: detects poisoned gradients by comparing gradient covariance eigenspectra against the Marchenko&ndash;Pastur law via KS test + tail anomaly detection &mdash; a theoretical guarantee, not a heuristic filter.</li>
                  <li>Proved a phase transition: detection is guaranteed when &sigma;&sup2;f&sup2; &lt; 0.25; extended to &sigma;&sup2;f&sup2; &lt; 0.35 with &epsilon;-DP (&epsilon;=8). Certified 38% Byzantine tolerance vs. 15% for CRFL/ByzShield baselines.</li>
                  <li>Scaled to billion-parameter models via Frequent Directions sketching at O(k&sup2;) memory &mdash; 1,034&times; reduction at 1.5B params (9 TB &rarr; 8.7 GB). Layer-wise decomposition preserves 94%+ detection at 15&times; lower memory.</li>
                  <li>Validated across 144 attack&ndash;aggregator settings (12 attacks &times; 12 configs); wins all 12 attack types at 78.4% mean accuracy vs. 48&ndash;63% baselines. Deployed and validated on Polygon testnet/mainnet.</li>
                </ul>
                <div className="project-links-row">
                  <a href="https://github.com/amethystani/blockchain_enabled_federated_learning-main" target="_blank" rel="noopener noreferrer" className="project-link-badge">&#8599; GitHub</a>
                  <a href="https://arxiv.org/abs/2512.12617" target="_blank" rel="noopener noreferrer" className="project-link-badge">&#8599; arXiv</a>
                </div>
              </div>

              <div className="project-card">
                <h3 style={{ fontSize: '18px', margin: '0 0 12px 0', color: '#111' }}>Tiny Recursive Models (TRM)</h3>
```

- [ ] **Step 2: Verify**

Spectral Sentinel should appear in the right column (next to NSGS) with purple top border and arXiv link badge.

- [ ] **Step 3: Commit**

```bash
cd /Users/animesh/cmdcv/Portfolio-cv
git add src/app/portfolio/PortfolioClient.tsx
git commit -m "feat: add Spectral Sentinel blockchain FL project card"
```

---

### Task 5: Add EVPredAI project card

**Files:**
- Modify: `src/app/portfolio/PortfolioClient.tsx` — insert after Spectral Sentinel card, before TRM

- [ ] **Step 1: Insert EVPredAI card**

Find:
```jsx
              <div className="project-card">
                <h3 style={{ fontSize: '18px', margin: '0 0 12px 0', color: '#111' }}>Tiny Recursive Models (TRM)</h3>
```

Replace with:
```jsx
              <div className="project-card type-internship">
                <div className="project-card-header">
                  <span className="project-type-badge internship">Internship</span>
                  <span className="project-venue-badge">Exicom Group &middot; DCT-R&amp;D</span>
                </div>
                <h3 style={{ fontSize: '18px', margin: '0 0 8px 0', color: '#111' }}>EVPredAI &mdash; EV Charging Demand Forecasting &amp; Placement</h3>
                <div className="project-metric-row">
                  <span className="project-metric-chip">85% user satisfaction</span>
                  <span className="project-metric-chip">10+ feature dims</span>
                  <span className="project-metric-chip">100+ concurrent queries</span>
                </div>
                <div className="project-meta">
                  <span className="project-pill">XGBoost + Bayesian HPO</span>
                  <span className="project-pill">SARIMA</span>
                  <span className="project-pill">Spatial Autocorrelation</span>
                  <span className="project-pill">BERT / LoRA</span>
                  <span className="project-pill">LangChain / Ollama</span>
                  <span className="project-pill">GeoPandas</span>
                </div>
                <ul className="project-points">
                  <li>Built a multi-modal ensemble for EV charging station placement: XGBoost with Bayesian HPO over 20+ geospatial/temporal features, SARIMA for seasonal demand forecasting, Moran&apos;s I/LISA spatial autocorrelation for hotspot detection, and MCDA weighted overlay scoring.</li>
                  <li>Leveraged NeMo DataDesigner to orchestrate synthetic data generation pipelines for EV demand forecasting &mdash; defining task schemas, configuring generation workflows, and running quality-filtering and deduplication passes to produce curated fine-tuning corpora.</li>
                  <li>Fine-tuned a BERT/RoBERTa chatbot on 15,000+ EV charging conversations and 5,000+ Exicom-specific technical interactions using LoRA, with FAISS vector retrieval and TAPAS for tabular question answering; deployed via Ollama for 100+ concurrent queries.</li>
                  <li>Engineered geospatial feature pipeline using OpenStreetMap/OSMnx, GeoPandas, and Folium; implemented automated feedback loop achieving 85% user satisfaction.</li>
                </ul>
                <div className="project-links-row">
                  <a href="https://github.com/amethystani/EVPredAI" target="_blank" rel="noopener noreferrer" className="project-link-badge">&#8599; GitHub</a>
                </div>
              </div>

              <div className="project-card">
                <h3 style={{ fontSize: '18px', margin: '0 0 12px 0', color: '#111' }}>Tiny Recursive Models (TRM)</h3>
```

- [ ] **Step 2: Verify**

EVPredAI should appear in the left column (row 3) with teal top border.

- [ ] **Step 3: Commit**

```bash
cd /Users/animesh/cmdcv/Portfolio-cv
git add src/app/portfolio/PortfolioClient.tsx
git commit -m "feat: add EVPredAI EV charging prediction project card"
```

---

### Task 6: Add LegalNexus project card

**Files:**
- Modify: `src/app/portfolio/PortfolioClient.tsx` — insert after EVPredAI, before TRM

- [ ] **Step 1: Insert LegalNexus card**

Find:
```jsx
              <div className="project-card">
                <h3 style={{ fontSize: '18px', margin: '0 0 12px 0', color: '#111' }}>Tiny Recursive Models (TRM)</h3>
```

Replace with:
```jsx
              <div className="project-card type-research">
                <div className="project-card-header">
                  <span className="project-type-badge research">Research</span>
                  <span className="project-venue-badge">2025</span>
                </div>
                <h3 style={{ fontSize: '18px', margin: '0 0 8px 0', color: '#111' }}>LegalNexus &mdash; Hyperbolic Multi-Agent Legal Reasoning</h3>
                <div className="project-metric-row">
                  <span className="project-metric-chip">0.92 Precision@5</span>
                  <span className="project-metric-chip">49,633 cases</span>
                  <span className="project-metric-chip">94% conflict resolution</span>
                </div>
                <div className="project-meta">
                  <span className="project-pill">Hyperbolic Graph Networks</span>
                  <span className="project-pill">Poincar&eacute; Ball Embeddings</span>
                  <span className="project-pill">Multi-Agent Pipeline</span>
                  <span className="project-pill">Game Theory</span>
                  <span className="project-pill">Legal AI</span>
                </div>
                <ul className="project-points">
                  <li>Built Hyperbolic Legal Networks (HGCN) embedding 49,633 cases in a Poincar&eacute; ball with radial court-authority encoding &mdash; capturing the hierarchical structure of legal precedent that Euclidean embeddings flatten. Achieved 0.92 Precision@5 on legal case retrieval.</li>
                  <li>Designed a game-theoretic multi-agent pipeline (Linker / Interpreter / Conflict agents) with Nash-style coordination for resolving contradictory citations; achieves 94% citation conflict resolution.</li>
                  <li>Integrated adversarial hybrid retrieval combining dense vector search with sparse BM25 re-ranking for robustness against out-of-distribution legal queries.</li>
                </ul>
                <div className="project-links-row">
                  <a href="https://github.com/amethystani/legalnexus-backend" target="_blank" rel="noopener noreferrer" className="project-link-badge">&#8599; GitHub</a>
                </div>
              </div>

              <div className="project-card">
                <h3 style={{ fontSize: '18px', margin: '0 0 12px 0', color: '#111' }}>Tiny Recursive Models (TRM)</h3>
```

- [ ] **Step 2: Verify**

LegalNexus should appear in the right column (row 3, next to EVPredAI) with purple top border.

- [ ] **Step 3: Commit**

```bash
cd /Users/animesh/cmdcv/Portfolio-cv
git add src/app/portfolio/PortfolioClient.tsx
git commit -m "feat: add LegalNexus hyperbolic legal AI project card"
```

---

### Task 7: Upgrade TRM card from minimal to full

**Files:**
- Modify: `src/app/portfolio/PortfolioClient.tsx` — replace the existing TRM `<div className="project-card">`

- [ ] **Step 1: Replace the TRM minimal card**

Find:
```jsx
              <div className="project-card">
                <h3 style={{ fontSize: '18px', margin: '0 0 12px 0', color: '#111' }}>Tiny Recursive Models (TRM)</h3>
                <p style={{ fontSize: '14px', margin: 0, color: '#555' }}>
                  Based on arXiv:2510.04871. Re-implemented the Recursive Latent State architecture in PyTorch to handle complex reasoning tasks without increasing model size. Enhanced base implementation by integrating FlashAttention-2 and custom Triton kernels to fuse operations.
                </p>
              </div>
```

Replace with:
```jsx
              <div className="project-card type-research">
                <div className="project-card-header">
                  <span className="project-type-badge research">Research</span>
                  <span className="project-venue-badge">arXiv:2510.04871</span>
                </div>
                <h3 style={{ fontSize: '18px', margin: '0 0 8px 0', color: '#111' }}>Tiny Recursive Models (TRM)</h3>
                <div className="project-meta">
                  <span className="project-pill">PyTorch</span>
                  <span className="project-pill">FlashAttention-2</span>
                  <span className="project-pill">Triton Kernels</span>
                  <span className="project-pill">SmolLM / Nemotron</span>
                  <span className="project-pill">FineWebEDU</span>
                </div>
                <ul className="project-points">
                  <li>Re-implemented the Recursive Latent State architecture from arXiv:2510.04871 in PyTorch; confirmed constant VRAM footprint regardless of reasoning depth &mdash; the core property the paper claims.</li>
                  <li>Integrated FlashAttention-2 and custom Triton kernels to fuse element-wise operations inside the recurrence loop, reducing memory bandwidth pressure during deep reasoning chains.</li>
                  <li>Ran pretraining mixture experiments informed by SmolLM and Nemotron data strategies: domain weighting ablations and quality-filter configurations, using FineWebEDU and FinePDFs as reference distributions.</li>
                </ul>
              </div>
```

- [ ] **Step 2: Verify**

TRM card should now have a purple top border, tech pills, and 3 bullet points instead of a single paragraph.

- [ ] **Step 3: Commit**

```bash
cd /Users/animesh/cmdcv/Portfolio-cv
git add src/app/portfolio/PortfolioClient.tsx
git commit -m "feat: upgrade TRM card to full layout with pills and bullet points"
```

---

### Task 8: Upgrade NewSky card from minimal to full

**Files:**
- Modify: `src/app/portfolio/PortfolioClient.tsx` — replace the existing NewSky `<div className="project-card">`

- [ ] **Step 1: Replace the NewSky minimal card**

Find:
```jsx
              <div className="project-card">
                <h3 style={{ fontSize: '18px', margin: '0 0 12px 0', color: '#111' }}>NewSky</h3>
                <p style={{ fontSize: '14px', margin: 0, color: '#555' }}>
                  Designed a pipeline to ingest and cluster topics from Bluesky API, synthesizing short conversational summaries. Built an automated daily digest generator with category grouping and abstractive summarization. Deployed via Flutter, PostgreSQL, Docker, and Kubernetes.
                </p>
              </div>
```

Replace with:
```jsx
              <div className="project-card type-side">
                <div className="project-card-header">
                  <span className="project-type-badge side-project">Project</span>
                </div>
                <h3 style={{ fontSize: '18px', margin: '0 0 8px 0', color: '#111' }}>NewSky</h3>
                <div className="project-meta">
                  <span className="project-pill">Bluesky API</span>
                  <span className="project-pill">NLP Summarization</span>
                  <span className="project-pill">Flutter</span>
                  <span className="project-pill">PostgreSQL</span>
                  <span className="project-pill">Docker / Kubernetes</span>
                </div>
                <ul className="project-points">
                  <li>Designed a pipeline to ingest and cluster topics from the Bluesky API, applying embedding-based clustering to group semantically related posts before synthesis.</li>
                  <li>Built an automated daily digest generator with category grouping and abstractive summarization &mdash; compressing high-volume social feeds into short conversational summaries.</li>
                  <li>Deployed via Flutter frontend, PostgreSQL for persistent storage, containerized with Docker and orchestrated with Kubernetes.</li>
                </ul>
              </div>
```

- [ ] **Step 2: Verify**

NewSky card should have a green top border and pills.

- [ ] **Step 3: Commit**

```bash
cd /Users/animesh/cmdcv/Portfolio-cv
git add src/app/portfolio/PortfolioClient.tsx
git commit -m "feat: upgrade NewSky card to full layout with pills and bullet points"
```

---

### Task 9: Expand skills section with CV-accurate categories

**Files:**
- Modify: `src/app/portfolio/PortfolioClient.tsx` — replace the skills section content (lines 701–728)

- [ ] **Step 1: Update `contentIndex.skills`**

Find in `contentIndex`:
```ts
  skills: "Technical Skills & Achievements Technical Skills Languages: Python, Java, SQL, LaTeX Machine Learning: PyTorch, Scikit-learn, LangChain, Transformers, Gymnasium, Ollama Development: FastAPI, Docker, Kubernetes, AWS, Apache Kafka, Redis, Flutter, Git Data Science: Pandas, NumPy, GeoPandas, Matplotlib, NetworkX Scholastic Achievements Selected among 200 participants for the Bitcoin Talents Program by Frankfurt School Blockchain Center (Jan '25) Selected from over 16,000 global applicants for Harvard Aspire Institute Leadership Program (Nov '24) Achieved a score of 102 in the core test of Test für Ausländische Studierende (TestAS) (Apr '23) Selected for the Harvard College Project for Asian and International Relations (HPAIR) (Aug '23) Awarded Certificate of Appreciation by Defense Minister of India for board exam performance (2020, 2022) Key Courses Computer Science: Data Structures, Design & Analysis of Algorithms, Artificial Intelligence, Reinforcement Learning, Digital Image Processing, Robotics, Social & Information Networks, Parallel & Concurrent Prog., Operating Systems, Database Systems, Computer Networks, Distributed Systems Mathematics: Applied Linear Algebra, Probability & Statistics, Discrete Math, Theory of Computation, Mathematical Methods I"
```

Replace with:
```ts
  skills: "Technical Skills Achievements Languages Python SQL Java LaTeX Pretraining Data Corpus Datatrove FineWeb FineWebEDU FinePDFs NeMo DataDesigner SmolLM Nemotron CommonCrawl deduplication quality filtering Machine Learning PyTorch Triton kernels FlashAttention-2 Scikit-learn XGBoost ONNX Runtime HuggingFace Transformers LangChain Gymnasium Ollama LLM Frameworks Evaluation Ablations multi-model ablation harnesses LLM-as-judge factuality validity ICC ANOVA benchmark design Distributed Data Kafka Dask Spark ETL web scraping Development FastAPI Docker Kubernetes AWS EKS Redis Flutter Git Data Science Pandas NumPy GeoPandas Matplotlib NetworkX Folium Scholastic Achievements Bitcoin Talents Program Frankfurt School Blockchain Center Harvard Aspire Institute Leadership Program TestAS 102 HPAIR Certificate Appreciation Defence Minister India Key Courses Data Structures Algorithms Artificial Intelligence Reinforcement Learning Digital Image Processing Robotics Social Information Networks Operating Systems Database Systems Computer Networks Distributed Systems Applied Linear Algebra Probability Statistics Discrete Math Theory of Computation",
```

- [ ] **Step 2: Replace the skills section JSX**

Find:
```jsx
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
```

Replace with:
```jsx
        {matchQuery('skills') && (
          <section id="skills" className="section-panel">
            <h2 style={{ fontSize: '24px', fontWeight: 600, color: '#111', borderBottom: '2px solid #277093', paddingBottom: '8px', display: 'inline-block', marginBottom: '6px' }}>Technical Skills &amp; Achievements</h2>
            <p style={{ margin: '0 0 28px 0', color: '#666', fontSize: '14px' }}>Languages, frameworks, and tooling across ML engineering, data infrastructure, and systems.</p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px', marginBottom: '36px' }}>

              <div style={{ padding: '18px 20px', borderRadius: '14px', background: '#fafbfc', border: '1px solid #eaeaea' }}>
                <h4 style={{ margin: '0 0 10px 0', fontSize: '13px', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#277093' }}>Languages</h4>
                <p style={{ margin: 0, fontSize: '14px', color: '#444', lineHeight: 1.7 }}>Python (primary) &bull; SQL &bull; Java &bull; LaTeX</p>
              </div>

              <div style={{ padding: '18px 20px', borderRadius: '14px', background: '#fafbfc', border: '1px solid #eaeaea' }}>
                <h4 style={{ margin: '0 0 10px 0', fontSize: '13px', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#277093' }}>ML &amp; LLM Frameworks</h4>
                <p style={{ margin: 0, fontSize: '14px', color: '#444', lineHeight: 1.7 }}>PyTorch &bull; Triton kernels &bull; FlashAttention-2 &bull; HuggingFace Transformers &bull; XGBoost &bull; Scikit-learn &bull; ONNX Runtime &bull; LangChain &bull; Ollama &bull; Gymnasium</p>
              </div>

              <div style={{ padding: '18px 20px', borderRadius: '14px', background: '#fafbfc', border: '1px solid #eaeaea' }}>
                <h4 style={{ margin: '0 0 10px 0', fontSize: '13px', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#277093' }}>Pretraining Data &amp; Corpus</h4>
                <p style={{ margin: 0, fontSize: '14px', color: '#444', lineHeight: 1.7 }}>Datatrove &bull; FineWeb / FineWebEDU / FinePDFs &bull; NeMo DataDesigner &bull; SmolLM / Nemotron data strategies &bull; CommonCrawl processing &bull; Deduplication &amp; quality filtering</p>
              </div>

              <div style={{ padding: '18px 20px', borderRadius: '14px', background: '#fafbfc', border: '1px solid #eaeaea' }}>
                <h4 style={{ margin: '0 0 10px 0', fontSize: '13px', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#277093' }}>Distributed Data Processing</h4>
                <p style={{ margin: 0, fontSize: '14px', color: '#444', lineHeight: 1.7 }}>Apache Kafka &bull; Dask &bull; Spark (familiar) &bull; Large-scale ETL design &bull; Web scraping pipelines at scale</p>
              </div>

              <div style={{ padding: '18px 20px', borderRadius: '14px', background: '#fafbfc', border: '1px solid #eaeaea' }}>
                <h4 style={{ margin: '0 0 10px 0', fontSize: '13px', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#277093' }}>Evaluation &amp; Ablations</h4>
                <p style={{ margin: 0, fontSize: '14px', color: '#444', lineHeight: 1.7 }}>Multi-model ablation harnesses &bull; LLM-as-judge evaluation &bull; Factuality/validity audits &bull; ICC / ANOVA Gauge R&amp;R &bull; Benchmark design</p>
              </div>

              <div style={{ padding: '18px 20px', borderRadius: '14px', background: '#fafbfc', border: '1px solid #eaeaea' }}>
                <h4 style={{ margin: '0 0 10px 0', fontSize: '13px', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#277093' }}>Infrastructure &amp; MLOps</h4>
                <p style={{ margin: 0, fontSize: '14px', color: '#444', lineHeight: 1.7 }}>Docker &bull; Kubernetes &bull; AWS EKS &bull; FastAPI &bull; Redis &bull; Git &bull; Flutter</p>
              </div>

              <div style={{ padding: '18px 20px', borderRadius: '14px', background: '#fafbfc', border: '1px solid #eaeaea' }}>
                <h4 style={{ margin: '0 0 10px 0', fontSize: '13px', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#277093' }}>Data Science</h4>
                <p style={{ margin: 0, fontSize: '14px', color: '#444', lineHeight: 1.7 }}>Pandas &bull; NumPy &bull; GeoPandas &bull; Matplotlib &bull; NetworkX &bull; Folium</p>
              </div>

            </div>

            <h3 style={{ fontSize: '18px', margin: '0 0 14px 0', color: '#111' }}>Scholastic Achievements</h3>
            <ul style={{ margin: '0 0 28px 0', color: '#444', lineHeight: 1.8 }}>
              <li>Selected among 200 participants for the Bitcoin Talents Program by Frankfurt School Blockchain Center (Jan &apos;25)</li>
              <li>Selected from over 16,000 global applicants for Harvard Aspire Institute Leadership Program (Nov &apos;24) &mdash; acceptance rate &lt;0.1%</li>
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
```

- [ ] **Step 3: Verify**

Skills section should now show 7 skill category cards in a responsive grid, followed by achievements and courses.

- [ ] **Step 4: Commit**

```bash
cd /Users/animesh/cmdcv/Portfolio-cv
git add src/app/portfolio/PortfolioClient.tsx
git commit -m "feat: expand skills section into categorized grid with full CV skill categories"
```

---

### Task 10: Add section subtitle and update projects section header

**Files:**
- Modify: `src/app/portfolio/PortfolioClient.tsx` — update the projects section `<h2>` heading

- [ ] **Step 1: Update projects section header**

Find:
```jsx
            <h2 style={{ fontSize: '24px', fontWeight: 600, color: '#111', borderBottom: '2px solid #277093', paddingBottom: '8px', display: 'inline-block', marginBottom: '24px' }}>Other Projects</h2>
```

Replace with:
```jsx
            <h2 style={{ fontSize: '24px', fontWeight: 600, color: '#111', borderBottom: '2px solid #277093', paddingBottom: '8px', display: 'inline-block', marginBottom: '6px' }}>Projects</h2>
            <p style={{ margin: '0 0 28px 0', color: '#666', fontSize: '14px' }}>Research prototypes, internship systems, and side projects &mdash; built end-to-end.</p>
```

- [ ] **Step 2: Commit**

```bash
cd /Users/animesh/cmdcv/Portfolio-cv
git add src/app/portfolio/PortfolioClient.tsx
git commit -m "style: update projects section header and add subtitle"
```

---

## Self-Review

**Spec coverage check:**
- [x] NSGS card — Task 3
- [x] Spectral Sentinel card — Task 4
- [x] EVPredAI card — Task 5
- [x] LegalNexus card — Task 6
- [x] TRM upgraded — Task 7
- [x] NewSky upgraded — Task 8
- [x] CSS badges/chips/borders — Task 1
- [x] contentIndex.projects updated — Task 2
- [x] Skills section expanded — Task 9
- [x] Section subtitle — Task 10

**Placeholder scan:** No TBDs. All JSX is complete.

**Type consistency:** No TypeScript types introduced — all JSX uses existing string/className patterns identical to current code.
