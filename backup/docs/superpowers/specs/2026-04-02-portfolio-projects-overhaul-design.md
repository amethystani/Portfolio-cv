# Portfolio Projects Overhaul — Design Spec
**Date:** 2026-04-02  
**File:** `src/app/portfolio/PortfolioClient.tsx`

---

## Goal

Add 4 new project cards (NSGS, Spectral Sentinel/Blockchain FL, EVPredAI, LegalNexus), upgrade 2 existing minimal cards (TRM, NewSky) to full cards, and apply a visual overhaul to the projects section and the rest of the portfolio. Content must read in the author's technical voice, matching how they described it in READMEs and CV.

---

## Visual Design Changes

### New CSS classes to add (inside the existing `<style>` block)

**Project type/venue badges:**
```css
.project-type-badge   /* colored pill: RESEARCH (#4f5bd5 bg), INTERNSHIP (#277093), STARTUP (#c47e1a) */
.project-venue-badge  /* secondary pill: CVPR '26, arXiv, etc. — lighter tint of same color */
```

**Metric callout row:**
```css
.project-metric-row   /* monospace font, #f0f4f8 pill background, gap between metrics */
.project-metric-chip  /* individual metric: e.g. "60.8×", "78.4% acc" */
```

**Link badges:**
```css
.project-link-badge   /* compact [↗ GitHub] / [↗ arXiv] — teal border, hover fill */
```

**Enhanced hover:**  
Update `.project-card:hover` to also add `border-left: 3px solid <type-color>` — the color matches the badge type.

**Section header subtitle:**  
Add `<p class="section-subtitle">` below section `<h2>` with a short descriptor line.

---

## Projects Grid Layout

Order (top to bottom, left to right):
1. **ClerkTree** — wide card spanning full grid (unchanged, already full-featured)
2. **NSGS / BIPS-PKD** — left column  
3. **Spectral Sentinel** — right column  
4. **EVPredAI** — left column  
5. **LegalNexus** — right column  
6. **TRM** — left column (upgraded)  
7. **NewSky** — right column (upgraded)  

---

## Project Card Content

### 1. NSGS / BIPS-PKD
**Type badge:** `RESEARCH`  
**Venue badge:** `CVPR '26 Submission`  
**Metric row:** `60.8×` · `65.8% mIoU` · `4.4× less energy`  
**Pills:** Neuromorphic Computing · Image Segmentation · C++ Event-Driven Runtime · ONNX/PyTorch · Android  
**Links:** GitHub  
**Bullets:**
- Designed an event-driven neuromorphic framework (NSGS) where image patches are computational units that fire asynchronously when local activations exceed adaptive thresholds — reducing redundant operations by 38–62% vs. frame-by-frame inference.
- Built BIPS-PKD (Backbone-Integrated Partial Split + Progressive Knowledge Distillation): splits any segmentation backbone at a *learned* intermediate layer, replacing the heavy transformer tail with a distilled student head at inference time — model-family-agnostic, no backbone surgery required.
- Benchmarked across 9 model families (EfficientSAM, SegFormer, Mask2Former, SAM2, PIDNet, YOLOv8/12, DINOv3, MobileSAM); top result: EfficientSAM small at 60.8× speedup (~16 FPS on 4-thread CPU, no GPU).
- Ships as a fully offline Android app (~500 MB bundled ONNX models) with a C++ lock-free SpikeQueue runtime featuring thermal-aware scheduling.

### 2. Spectral Sentinel (Blockchain FL)
**Type badge:** `RESEARCH`  
**Venue badge:** `arXiv:2512.12617`  
**Metric row:** `78.4% accuracy` · `38% Byzantine tolerance` · `1,034× memory reduction`  
**Pills:** Byzantine-Robust FL · Random Matrix Theory · Frequent Directions Sketching · Blockchain/Polygon · Federated Learning  
**Links:** GitHub · arXiv  
**Bullets:**
- Designed the first Byzantine-robust federated learning system grounded in Random Matrix Theory: detects poisoned gradients by tracking gradient covariance eigenspectra against the Marchenko–Pastur law via KS test + tail anomaly detection — theoretical rather than heuristic.
- Proved an information-theoretic phase transition: Byzantine detection is guaranteed when σ²f² < 0.25; extended to σ²f² < 0.35 with ε-DP (ε=8) calibrated Gaussian noise. Certified 38% Byzantine tolerance vs. 15% for CRFL/ByzShield baselines.
- Scaled detection to billion-parameter models via Frequent Directions sketching at O(k²) memory (k=512 sketch): 1,034× memory reduction at 1.5B params (9 TB → 8.7 GB). Layer-wise decomposition for transformer attention/MLP/embedding heads preserves 94%+ detection at 15× lower memory.
- Validated across 144 attack–aggregator settings (12 attacks × 12 configurations); Spectral Sentinel wins all 12 attack types at 78.4% mean accuracy vs. 48–63% for FedAvg/Krum/Geometric Median baselines.

### 3. EVPredAI
**Type badge:** `INTERNSHIP`  
**Venue badge:** `Exicom Group · DCT-R&D`  
**Metric row:** `85% user satisfaction` · `10+ feature dimensions` · `100+ concurrent queries`  
**Pills:** XGBoost + Bayesian HPO · SARIMA · Spatial Autocorrelation · BERT/LoRA · LangChain/Ollama · GeoPandas  
**Links:** GitHub  
**Bullets:**
- Built a multi-modal ensemble for EV charging station placement: XGBoost with Bayesian hyperparameter optimization over 20+ geospatial/temporal features, SARIMA for seasonal demand forecasting, Moran's I/LISA spatial autocorrelation for hotspot detection, and MCDA weighted overlay scoring.
- Leveraged NeMo DataDesigner to orchestrate synthetic data generation pipelines for EV demand forecasting — defining task schemas, configuring generation workflows, and running quality-filtering and deduplication passes to produce curated fine-tuning corpora.
- Fine-tuned a BERT/RoBERTa chatbot on 15,000+ EV charging conversations and 5,000+ Exicom-specific interactions using LoRA, with FAISS vector retrieval and TAPAS for tabular question answering; deployed via Ollama with batched inference for 100+ concurrent queries.
- Engineered geospatial feature pipeline using OpenStreetMap/OSMnx, GeoPandas, and Folium; implemented automated feedback loop achieving 85% user satisfaction.

### 4. LegalNexus
**Type badge:** `RESEARCH`  
**Venue badge:** `2025`  
**Metric row:** `0.92 Precision@5` · `49,633 cases` · `94% conflict resolution`  
**Pills:** Hyperbolic Graph Networks · Poincaré Ball Embeddings · Multi-Agent Pipeline · Game Theory · Legal AI  
**Links:** GitHub  
**Bullets:**
- Built Hyperbolic Legal Networks (HGCN) embedding 49,633 cases in a Poincaré ball with radial court-authority encoding — capturing the inherent hierarchical structure of legal precedent that Euclidean embeddings flatten. Achieved 0.92 Precision@5 on legal case retrieval.
- Designed a game-theoretic multi-agent pipeline (Linker / Interpreter / Conflict agents) with Nash-style coordination for resolving contradictory citations; achieves 94% citation conflict resolution.
- Integrated adversarial hybrid retrieval combining dense vector search with sparse BM25 re-ranking for robustness against out-of-distribution legal queries.

### 5. TRM — Tiny Recursive Models (upgraded)
**Type badge:** `RESEARCH`  
**Venue badge:** `arXiv:2510.04871`  
**Pills:** PyTorch · FlashAttention-2 · Triton Kernels · SmolLM · Nemotron · FineWebEDU  
**Bullets:**
- Re-implemented the Recursive Latent State architecture from arXiv:2510.04871 in PyTorch; confirmed constant VRAM footprint regardless of reasoning depth — the key property claimed in the paper.
- Integrated FlashAttention-2 and custom Triton kernels to fuse element-wise operations inside the recurrence loop, reducing memory bandwidth pressure during deep reasoning chains.
- Ran pretraining mixture experiments informed by SmolLM and Nemotron data strategies: domain weighting ablations, quality-filter configurations, with FineWebEDU and FinePDFs as reference distributions.

### 6. NewSky (upgraded)
**Type badge:** `PROJECT`  
**Pills:** Bluesky API · NLP Summarization · Flutter · PostgreSQL · Docker · Kubernetes  
**Bullets:**
- Designed a pipeline to ingest and cluster topics from the Bluesky API, applying embedding-based clustering to group semantically related posts before synthesis.
- Built an automated daily digest generator with category grouping and abstractive summarization — compressing high-volume social feeds into short conversational summaries.
- Deployed via Flutter frontend, PostgreSQL for persistent storage, Docker for containerization, and Kubernetes for orchestration.

---

## Skills Section Upgrade

Replace the flat paragraph with a proper categorized grid. Add the following categories from the CV that are missing:

- **Pretraining Data & Corpus Tools:** Datatrove, FineWeb/FineWebEDU/FinePDFs, NeMo DataDesigner, SmolLM/Nemotron data strategies, CommonCrawl processing, dataset deduplication & quality filtering
- **ML & LLM Frameworks:** expand with Triton kernels, FlashAttention-2, HuggingFace Transformers, XGBoost, ONNX Runtime
- **Infrastructure & MLOps:** expand with Redis, AWS EKS, Kubernetes already listed — add Kafka
- **Evaluation & Ablations:** multi-model ablation harnesses, LLM-as-judge evaluation, ICC/ANOVA Gauge R&R, benchmark design

---

## contentIndex Update

The `contentIndex.projects` string must be updated to include searchable text for all 6 projects (NSGS, Spectral Sentinel, EVPredAI, LegalNexus, TRM, NewSky) so search works across them.

---

## Files to Modify

| File | Change |
|---|---|
| `src/app/portfolio/PortfolioClient.tsx` | All changes — CSS additions, projects JSX, skills section, contentIndex |

No new files. No data layer. Preserve existing CSS-in-JS approach.

---

## Out of Scope

- No changes to terminal/Finder/Safari components
- No changes to the home, about, experience, research tabs (research tab already has Spectral Sentinel and NSGS as papers — the projects tab is separate "built things")
- No routing changes
