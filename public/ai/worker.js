// On-device search and quick answers for the ⌘K palette. Runs off the main thread so typing never stutters.
//
//   1. keyword ranking (BM25 with as-you-type prefixes) over the site's passages: works the moment the index loads;
//   2. meaning search with a static word-embedding table (Model2Vec potion-base-4M, 3.9 MB, plain JS: embed.js),
//      fused with (1) by reciprocal rank, so "how do I reach him" finds the contact answer;
//   3. the answer: if the question matches an entry in the answer bank (content/assistant.ts) by meaning and
//      words, that entry's written answer; otherwise the best sentences from the top passages; otherwise "not found".
//
// Nothing runs on a server and no generative model is involved, so every query answers in about a millisecond.
import { createEmbedder } from './embed.js';

const state = { chunks: [], answers: [], bags: [], answerBags: [], answerVectors: [], known: new Set(), askVectors: null, bm25: null, embed: null, vectors: null, semantic: 'idle' };
const post = (msg) => self.postMessage(msg);
const status = () => post({ type: 'status', passages: state.chunks.length, semantic: state.semantic });

// ------------------------------------------------------------------------------------------- keyword ranking
const STOP = new Set(
  'a an and are as at be but by did do does for from had has have he her his how i if in into is it its me my of on or our she so than that the their them then there these they this to was we were what when where which who why will with you your about can could would should tell much many any anything'.split(
    ' ',
  ),
);
const stem = (t) =>
  t.length > 4 && t.endsWith('ies')
    ? `${t.slice(0, -3)}y`
    : t.length > 3 && t.endsWith('s') && !t.endsWith('ss')
      ? t.slice(0, -1)
      : t;
const words = (text) =>
  text
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .split(/[^a-z0-9+#.]+/)
    .map((t) => t.replace(/^\.+|\.+$/g, ''))
    .filter((t) => t.length > 1 && !STOP.has(t))
    .map(stem);

// Words people use for the same thing. A query word also searches its group (at half weight), which is what lets
// "how do I reach him" find "get in touch" and "did he start a company" find "co-founded".
const GROUPS = [
  'contact reach email mail touch message hire connect write',
  'job role position hiring hire opening opportunity looking next career',
  'start found founded co-founded cofounded founder co-founder startup company venture',
  'study studied education university uni college degree student school',
  'research work working study focus interest',
  'publish published publication paper papers conference venue accepted journal workshop proceedings',
  'resume cv experience background',
  'code github repo repository open-source source',
  'phd doctorate grad graduate',
  'llm language model models nlp',
  'gpu cuda kernel kernels',
  'crypto cryptography post-quantum ml-kem security',
  'based location located live lives city country home delhi india',
];
const SYN = new Map();
for (const g of GROUPS) {
  const ws = g.split(' ').map(stem);
  for (const w of ws) SYN.set(w, [...new Set([...(SYN.get(w) || []), ...ws.filter((x) => x !== w)])]);
}

function buildBm25(chunks) {
  const docs = chunks.map((c) => {
    const tf = new Map();
    // the title counts twice
    for (const t of [...words(c.title), ...words(c.title), ...words(c.text)]) tf.set(t, (tf.get(t) || 0) + 1);
    let len = 0;
    tf.forEach((n) => (len += n));
    return { tf, len };
  });
  const df = new Map();
  docs.forEach((d) => d.tf.forEach((_, t) => df.set(t, (df.get(t) || 0) + 1)));
  const avg = docs.reduce((s, d) => s + d.len, 0) / Math.max(1, docs.length);
  return { docs, df, avg, vocab: [...df.keys()] };
}

function bm25Scores(query) {
  const { docs, df, avg, vocab } = state.bm25;
  const N = docs.length;
  let terms = words(query);
  // as-you-type: the last word may be unfinished, so also match words that start with it
  const last = terms[terms.length - 1];
  if (last && last.length >= 3 && !/\s$/.test(query)) {
    terms = [...terms, ...vocab.filter((v) => v !== last && v.startsWith(last)).slice(0, 6)];
  }
  const weights = new Map(terms.map((t) => [t, 1]));
  for (const t of terms) for (const s of SYN.get(t) || []) if (!weights.has(s)) weights.set(s, 0.5);
  const scores = new Float32Array(N);
  for (const [t, w] of weights) {
    const n = df.get(t);
    if (!n) continue;
    const idf = Math.log(1 + (N - n + 0.5) / (n + 0.5));
    docs.forEach((d, i) => {
      const f = d.tf.get(t);
      if (f) scores[i] += (w * idf * f * 2.2) / (f + 1.2 * (0.25 + (0.75 * d.len) / avg));
    });
  }
  return scores;
}

// ------------------------------------------------------------------------------------------- meaning search
const dot = (a, b) => {
  let s = 0;
  for (let i = 0; i < a.length; i++) s += a[i] * b[i];
  return s;
};

async function loadSemantic(base) {
  if (state.semantic !== 'idle') return;
  state.semantic = 'loading';
  status();
  try {
    const [meta, bin] = await Promise.all([
      fetch(`${base}/potion.json`).then((r) => r.json()),
      fetch(`${base}/potion.bin`).then((r) => r.arrayBuffer()),
    ]);
    state.embed = createEmbedder(meta, bin);
    state.vectors = state.chunks.map((c) => state.embed(`${c.title}. ${c.text}`));
    state.askVectors = state.answers.map((a) => a.ask.map((q) => state.embed(q)).filter(Boolean));
    state.answerVectors = state.answers.map((a) => state.embed(`${a.source}. ${a.answer}`));
    state.semantic = 'ready';
  } catch (e) {
    console.warn('[assistant] meaning search unavailable', e);
    state.semantic = 'error';
  }
  status();
}

// ------------------------------------------------------------------------------------------- search
/** Hybrid ranking: BM25 and vector ranks fused (reciprocal rank fusion). */
function rank(query) {
  const bm = bm25Scores(query);
  const N = state.chunks.length;
  const byBm = [...Array(N).keys()].filter((i) => bm[i] > 0).sort((a, b) => bm[b] - bm[a]);
  const qv = state.semantic === 'ready' ? state.embed(query) : null;
  let byVec = [];
  let cos = null;
  if (qv) {
    cos = state.vectors.map((v) => (v ? dot(v, qv) : -1));
    byVec = [...Array(N).keys()].filter((i) => cos[i] > 0.3).sort((a, b) => cos[b] - cos[a]);
  }
  const fused = new Map();
  byBm.slice(0, 20).forEach((i, r) => fused.set(i, (fused.get(i) || 0) + 1 / (60 + r)));
  byVec.slice(0, 20).forEach((i, r) => fused.set(i, (fused.get(i) || 0) + 1 / (60 + r)));
  return {
    order: [...fused.entries()].sort((a, b) => b[1] - a[1]).map(([i]) => i),
    qv,
    bm,
    cos,
    bmTop: byBm.length ? bm[byBm[0]] : 0,
    cosTop: byVec.length ? cos[byVec[0]] : 0,
  };
}

const sentencesOf = (text) =>
  text
    .split(/(?<=[.!?])\s+(?=[A-Z0-9"“(])/)
    .map((s) => s.trim())
    .filter((s) => s.split(/\s+/).length >= 4);

// ------------------------------------------------------------------------------------------- answer bank
/** Typo tolerance: true when a and b are one edit apart (two for long words), counting a swap as one edit. */
function near(a, b) {
  if (a === b) return true;
  const max = Math.min(a.length, b.length) >= 8 ? 2 : Math.min(a.length, b.length) >= 5 ? 1 : 0;
  if (!max || Math.abs(a.length - b.length) > max) return false;
  const d = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++) {
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
    }
  return d[a.length][b.length] <= max;
}
/** Replaces misspelt words with the closest known word (answer bank and site vocabulary). */
function correct(terms) {
  return terms.map((t) => {
    if (state.known.has(t) || t.length < 5) return t;
    for (const k of state.known) if (near(t, k)) return k;
    return t;
  });
}

/** How well the query matches each answer-bank entry: closest phrasing by meaning, plus shared words. */
function matchAnswer(query, qv) {
  const q = [...new Set(correct(words(query)))];
  if (!q.length && !qv) return null;
  let best = null;
  state.answers.forEach((a, i) => {
    const bag = state.bags[i];
    const said = state.answerBags[i];
    let hits = 0;
    for (const t of q) {
      if (bag.has(t)) hits += 1;
      else if (said.has(t)) hits += 0.8; // a name or term the answer itself mentions (ChemBERTa, Binance, DRDO)
      else if ((SYN.get(t) || []).some((s) => bag.has(s) || said.has(s))) hits += 0.5;
    }
    const lex = q.length ? hits / q.length : 0;
    const askCos = qv ? Math.max(0, ...state.askVectors[i].map((v) => dot(v, qv))) : 0;
    const answerCos = qv && state.answerVectors[i] ? dot(state.answerVectors[i], qv) * 0.95 : 0;
    const cos = Math.max(askCos, answerCos);
    // short questions are mostly filler words ("who is this guy"), so a strong meaning match can carry them alone
    const score = qv ? Math.max(0.6 * cos + 0.4 * lex, cos - 0.12) : lex * 0.85;
    if (!best || score > best.score) best = { i, score, cos, lex };
  });
  return best;
}
// just above the best-scoring off-topic question in tools/test-assistant.mjs (0.46), below nearly every right match
const ANSWER_MIN = 0.48;
const wordSet = (t) => new Set(words(t));
const similar = (a, b) => {
  const A = wordSet(a);
  const B = wordSet(b);
  let shared = 0;
  A.forEach((w) => B.has(w) && shared++);
  return shared / Math.max(1, Math.min(A.size, B.size));
};

/**
 * The fallback answer: the two sentences from the top passages that best answer the query, each with its passage.
 */
function summarize(query, order, qv) {
  const qTerms = new Set(words(query));
  const related = new Set([...qTerms].flatMap((t) => SYN.get(t) || []));
  const candidates = [];
  order.slice(0, 3).forEach((i, place) => {
    const c = state.chunks[i];
    sentencesOf(c.text)
      .filter((s) => !/\?$/.test(s) && !/^(thanks|thank you|acknowledg)/i.test(s))
      .forEach((s) => candidates.push({ s, i, place }));
  });
  for (const c of candidates) {
    const ws = words(c.s);
    c.overlap = ws.filter((t) => qTerms.has(t)).length + 0.5 * ws.filter((t) => related.has(t) && !qTerms.has(t)).length;
    c.sim = qv ? dot(state.embed(c.s) || new Float32Array(qv.length), qv) : 0;
    c.score = c.sim * 3 + c.overlap * 0.35 - c.place * 0.15;
  }
  const picked = [];
  for (const c of candidates.sort((a, b) => b.score - a.score)) {
    if (picked.length === 2) break;
    if (c.sim < 0.45 && (c.overlap < 0.5 || c.sim < 0.2)) continue; // not about the question
    if (picked.some((p) => similar(p.s, c.s) > 0.7)) continue; // says the same thing again
    picked.push(c);
  }
  return picked.map((c) => ({ text: c.s, source: c.i }));
}

const resultOf = (i) => {
  const c = state.chunks[i];
  return { id: c.id, title: c.title, url: c.url, kind: c.kind, text: c.text };
};

function search(id, query) {
  const t0 = performance.now();
  if (!state.bm25) return post({ type: 'results', id, results: [], passages: [], summary: [], semantic: false, ms: 0 });
  const fixed = correct(words(query)).join(' ');
  const ranked = rank(fixed && fixed !== words(query).join(' ') ? `${query} ${fixed}` : query);
  const { qv } = ranked;
  // nothing shares a meaningful word and nothing is close in meaning: say so instead of guessing
  const weak = ranked.bmTop < 2.5 && ranked.cosTop < 0.45;
  const order = weak ? [] : ranked.order;
  // (an answer-bank match below can still answer a question no page matches)
  const seen = new Set();
  const top = [];
  // only pages close in strength to the best match make the list
  const strong = (i) =>
    ranked.bm[i] >= 0.35 * ranked.bmTop || (ranked.cos && ranked.cos[i] >= Math.max(0.4, ranked.cosTop - 0.12));
  for (const i of order) {
    if (!strong(i) || seen.has(state.chunks[i].url)) continue;
    seen.add(state.chunks[i].url);
    top.push(i);
    if (top.length === 6) break;
  }
  const match = matchAnswer(fixed && fixed !== words(query).join(' ') ? fixed : query, qv);
  const bank = match && match.score >= ANSWER_MIN ? state.answers[match.i] : null;
  const summary = bank
    ? [{ id: `answer:${bank.id}`, title: bank.source, url: bank.url, kind: 'answer', text: bank.answer }]
    : summarize(query, order, qv).map((s) => ({ ...resultOf(s.source), text: s.text }));
  // the answer's own page leads the sources
  const results = top.map(resultOf);
  if (bank) {
    const lead = { id: `answer:${bank.id}`, title: bank.source, url: bank.url, kind: 'answer', text: bank.answer };
    results.splice(0, results.length, lead, ...results.filter((r) => r.url !== bank.url).slice(0, 4));
  }
  post({
    type: 'results',
    id,
    results,
    passages: order.slice(0, 4).map(resultOf),
    summary,
    match: match && { id: state.answers[match.i].id, score: +match.score.toFixed(2), cos: +match.cos.toFixed(2), lex: +match.lex.toFixed(2) },
    semantic: state.semantic === 'ready',
    ms: performance.now() - t0,
  });
}

// ------------------------------------------------------------------------------------------- messages
self.onmessage = async ({ data }) => {
  try {
    if (data.type === 'init') {
      if (!state.bm25) {
        const { chunks, answers } = await (await fetch(data.indexUrl)).json();
        state.chunks = chunks;
        state.answers = answers || [];
        state.bags = state.answers.map((a) => new Set(words(a.ask.join(' '))));
        state.answerBags = state.answers.map((a) => new Set(words(`${a.source} ${a.answer}`)));
        state.known = new Set([...state.bags.flatMap((b) => [...b]), ...[...SYN.keys()]]);
        state.bm25 = buildBm25(chunks);
      }
      status();
      if (data.semantic) loadSemantic(data.base);
    } else if (data.type === 'loadSemantic') loadSemantic(data.base);
    else if (data.type === 'search') search(data.id, data.query);
  } catch (e) {
    post({ type: 'error', id: data.id, error: String(e?.message || e) });
  }
};
