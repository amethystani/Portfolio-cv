// A Model2Vec static embedder in plain JavaScript: BERT word-piece tokenizer + a lookup table + a mean.
// No neural-network runtime, so a query embeds in well under a millisecond. Files: tools/build-potion.mjs.

/** BertNormalizer (lowercase, strip accents, drop control characters) + BertPreTokenizer (split words and punctuation). */
function pieces(text) {
  const clean = text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[\u0000-\u001f\u007f-\u009f]/g, ' ')
    .toLowerCase();
  return clean.match(/[\p{L}\p{N}\p{M}]+|[^\s\p{L}\p{N}\p{M}]/gu) || [];
}

export function createEmbedder({ dim, vocab }, buffer) {
  const rows = vocab.length;
  const scales = new Float32Array(buffer, 0, rows);
  const table = new Int8Array(buffer, rows * 4, rows * dim);
  const ids = new Map(vocab.map((t, i) => [t, i]));
  const cache = new Map();

  /** Greedy longest-match-first word pieces; a word that cannot be split is dropped (Model2Vec drops [UNK]). */
  function wordIds(word) {
    const hit = cache.get(word);
    if (hit) return hit;
    const out = [];
    if (word.length <= 100) {
      let start = 0;
      while (start < word.length) {
        let end = word.length;
        let id;
        while (start < end) {
          id = ids.get(start > 0 ? `##${word.slice(start, end)}` : word.slice(start, end));
          if (id !== undefined) break;
          end--;
        }
        if (id === undefined) {
          out.length = 0;
          break;
        }
        out.push(id);
        start = end;
      }
    }
    if (cache.size < 50000) cache.set(word, out);
    return out;
  }

  /** Mean of the token vectors, L2-normalised. Returns null for text with no known tokens. */
  return function embed(text) {
    const v = new Float32Array(dim);
    let n = 0;
    for (const w of pieces(text)) {
      for (const id of wordIds(w)) {
        const s = scales[id];
        const o = id * dim;
        for (let c = 0; c < dim; c++) v[c] += table[o + c] * s;
        n++;
        if (n >= 512) break;
      }
      if (n >= 512) break;
    }
    if (!n) return null;
    let norm = 0;
    for (let c = 0; c < dim; c++) norm += v[c] * v[c];
    norm = Math.sqrt(norm) || 1;
    for (let c = 0; c < dim; c++) v[c] /= norm;
    return v;
  };
}
