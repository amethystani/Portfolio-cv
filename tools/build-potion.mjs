// Converts a Model2Vec "potion" static embedding model into the two small files the on-device search uses:
//   public/ai/potion.bin   per-row Float32 scales, then the Int8 embedding table (rows in token-id order)
//   public/ai/potion.json  { model, dim, vocab: [token by id] }
// Usage: node tools/build-potion.mjs [minishlab/potion-base-4M]
import fs from 'node:fs';
import path from 'node:path';

const model = process.argv[2] || 'minishlab/potion-base-4M';
const out = path.join(path.dirname(new URL(import.meta.url).pathname), '..', 'public', 'ai');
const get = async (file) => {
  const res = await fetch(`https://huggingface.co/${model}/resolve/main/${file}`);
  if (!res.ok) throw new Error(`${file}: ${res.status}`);
  return Buffer.from(await res.arrayBuffer());
};

const st = await get('model.safetensors');
const headerLen = Number(st.readBigUInt64LE(0));
const header = JSON.parse(st.subarray(8, 8 + headerLen).toString());
const { dtype, shape, data_offsets: [start, end] } = header.embeddings;
if (dtype !== 'F32') throw new Error(`unexpected dtype ${dtype}`);
const [rows, dim] = shape;
const base = 8 + headerLen + start;
const table = new Float32Array(st.buffer.slice(st.byteOffset + base, st.byteOffset + 8 + headerLen + end));

const scales = new Float32Array(rows);
const q = new Int8Array(rows * dim);
for (let r = 0; r < rows; r++) {
  let max = 0;
  for (let c = 0; c < dim; c++) max = Math.max(max, Math.abs(table[r * dim + c]));
  const s = max / 127 || 1;
  scales[r] = s;
  for (let c = 0; c < dim; c++) q[r * dim + c] = Math.round(table[r * dim + c] / s);
}

const tok = JSON.parse((await get('tokenizer.json')).toString());
if (tok.model.type !== 'WordPiece') throw new Error('expected a WordPiece tokenizer');
const vocab = new Array(rows);
for (const [t, id] of Object.entries(tok.model.vocab)) if (id < rows) vocab[id] = t;

fs.mkdirSync(out, { recursive: true });
fs.writeFileSync(path.join(out, 'potion.bin'), Buffer.concat([Buffer.from(scales.buffer), Buffer.from(q.buffer)]));
fs.writeFileSync(path.join(out, 'potion.json'), JSON.stringify({ model, dim, rows, unk: tok.model.unk_token, vocab }));
console.log(`${model}: ${rows} x ${dim} -> potion.bin ${((rows * 4 + rows * dim) / 1e6).toFixed(2)} MB, potion.json written`);
