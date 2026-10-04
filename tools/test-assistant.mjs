// Checks the ⌘K assistant (public/ai/worker.js) against questions visitors might type.
// Needs the dev server running:  npm run dev  &&  node tools/test-assistant.mjs [--show] [--holdout]
// or test the live site:          node tools/test-assistant.mjs --base=https://www.animeshmishra.us
//
// Each case: [question, expected]. expected is an answer-bank id (content/assistant.ts), or
//   'none'  the site cannot answer it: no bank answer and no made-up reply.
const CASES = [
  // who / about
  ['who is animesh', 'who'],
  ['who is this guy', 'who'],
  ['tell me about yourself', 'who'],
  ['give me a quick intro', 'who'],
  ['what does animesh do', 'who'],
  ['animesh mishra', 'who'],
  // research
  ['what is his research', 'research'],
  ['what does he research?', 'research'],
  ['what are you working on', 'research'],
  ['research interests', 'research'],
  ['what area of AI does he focus on', 'research'],
  // location / education
  ['where is he based', 'location'],
  ['where does he live', 'location'],
  ['is he in india', 'location'],
  ['where did he go to college', 'education'],
  ['what did he study', 'education'],
  ['which uni', 'education'],
  ['does he have a degree', 'education'],
  // publications
  ['papers', 'publications'],
  ['what has he published', 'publications'],
  ['list of publications', 'publications'],
  ['which venues has he published at', 'publications'],
  ['has he got any conference papers', 'publications'],
  // specific papers
  ['emnlp paper', 'emnlp'],
  ['tell me about evirag', 'emnlp'],
  ['what is evirag bench', 'emnlp'],
  ['disagreement in scientific RAG', 'emnlp'],
  ['wmt paper', 'wmt'],
  ['translation metrics', 'wmt'],
  ['palimpsest', 'wmt'],
  ['ligatur dataset', 'wmt'],
  ['chemistry paper', 'chemistry'],
  ['notation matters', 'chemistry'],
  ['smiles vs iupac', 'chemistry'],
  ['hindi politeness paper', 'hindi'],
  ['interpretability work', 'hindi'],
  ['llm fairness', 'fairness'],
  ['bias in llms', 'fairness'],
  ['what did he do at complexity science hub', 'fairness'],
  ['gpu kernels', 'gpu'],
  ['does he know cuda', 'gpu'],
  ['flashattention', 'gpu'],
  ['post quantum crypto', 'crypto'],
  ['ml-kem side channel', 'crypto'],
  // experience
  ['where has he worked', 'experience'],
  ['work experience', 'experience'],
  ['resume', 'experience'],
  ['previous jobs', 'experience'],
  ['what did he do at nous research', 'nous'],
  ['nous', 'nous'],
  ['did he start a company', 'clerktree'],
  ['is he a founder', 'clerktree'],
  ['what is clerktree', 'clerktree'],
  ['machina', 'clerktree'],
  ['internships', 'internships'],
  ['consultadd', 'internships'],
  ['what did he do at hfcl', 'internships'],
  ['ibm vakra', 'vakra'],
  ['any awards or rankings', 'vakra'],
  // next / contact / links
  ['is he looking for a job', 'next'],
  ['open to work?', 'next'],
  ['can i hire him', 'next'],
  ['is he doing a phd', 'next'],
  ['how do i reach him', 'contact'],
  ['email address', 'contact'],
  ['contact info', 'contact'],
  ['github', 'links'],
  ['linkedin profile', 'links'],
  ['where is the code', 'links'],
  // projects / misc
  ['what has he built', 'projects'],
  ['side projects', 'projects'],
  ['fruit fly trading bot', 'fruitfly'],
  ['what are his skills', 'skills'],
  ['tech stack', 'skills'],
  ['does he have a blog', 'writing'],
  ['who are his advisors', 'collaborators'],
  ['who does he collaborate with', 'collaborators'],
  ['acl volunteer', 'acl'],
  // asked as if to him
  ['which languages do you code in?', 'skills'],
  ['where did you work?', 'experience'],
  ['what do you research', 'research'],
  ['how can i contact you', 'contact'],
  // typos
  ['whos animesh', 'who'],
  ['publicatons', 'publications'],
  ['contcat', 'contact'],
  // out of scope: must not invent an answer
  ['favourite food', 'none'],
  ['what is the weather', 'none'],
  ['does he play football', 'none'],
  ['what is his salary', 'none'],
  ['how old is he', 'none'],
  ['is he married', 'none'],
];

// Written after the answer bank was tuned and never used to tune it: an honest read of how well it generalises.
const HOLDOUT = [
  ['hi, who am i talking about here', 'who'],
  ['summarise his profile', 'who'],
  ['whats his deal', 'who'],
  ['what kind of researcher is he', 'research'],
  ['main research topic', 'research'],
  ['what questions does his research ask', 'research'],
  ['what city', 'location'],
  ['where in the world is he', 'location'],
  ['what university', 'education'],
  ['btech?', 'education'],
  ['did he graduate', 'education'],
  ['how many publications', 'publications'],
  ['published work', 'publications'],
  ['any journal papers', 'publications'],
  ['what is beyond epistemic collapse', 'emnlp'],
  ['rag benchmark', 'emnlp'],
  ['the budapest emnlp work', 'emnlp'],
  ['what is aegis', 'wmt'],
  ['unicode corruption', 'wmt'],
  ['molecules', 'chemistry'],
  ['chemberta', 'chemistry'],
  ['sparse autoencoders', 'hindi'],
  ['debiasing', 'fairness'],
  ['partial identification', 'fairness'],
  ['hopper blackwell kernels', 'gpu'],
  ['kyber', 'crypto'],
  ['companies he worked for', 'experience'],
  ['drdo', 'experience'],
  ['agent cli work', 'nous'],
  ['his startup', 'clerktree'],
  ['industrial ai', 'clerktree'],
  ['ev charging', 'internships'],
  ['demand forecasting', 'internships'],
  ['juris agent', 'vakra'],
  ['is he available for roles', 'next'],
  ['future plans', 'next'],
  ['how can i message him', 'contact'],
  ['orcid', 'links'],
  ['open source code', 'links'],
  ['cool projects', 'projects'],
  ['binance bot', 'fruitfly'],
  ['what can he do', 'skills'],
  ['what languages does he code in', 'skills'],
  ['articles he wrote', 'writing'],
  ['krishang sharma', 'collaborators'],
  ['what is his favourite movie', 'none'],
  ['bitcoin price', 'none'],
  ['who won the world cup', 'none'],
  ['does he have pets', 'none'],
];

const show = process.argv.includes('--show');
const holdout = process.argv.includes('--holdout');
if (holdout) CASES.splice(0, CASES.length, ...HOLDOUT);
const out = [];
globalThis.self = { postMessage: (m) => out.push(m) };
const worker = new URL('../public/ai/worker.js', import.meta.url).href;
await import(`${worker}?${Date.now()}`);
const send = (m) => self.onmessage({ data: m });
const site = (process.argv.find((a) => a.startsWith('--base=')) || '--base=http://localhost:3000').slice(7).replace(/\/$/, '');
await send({ type: 'init', indexUrl: `${site}/api/ai-index`, base: `${site}/ai`, semantic: true });
while (!out.some((m) => m.type === 'status' && m.semantic === 'ready')) await new Promise((r) => setTimeout(r, 50));

let pass = 0;
const fails = [];
for (const [q, expected] of CASES) {
  out.length = 0;
  await send({ type: 'search', id: 1, query: q });
  const r = out.find((m) => m.type === 'results');
  const bank = r.summary[0]?.kind === 'answer' ? r.summary[0].id.replace('answer:', '') : null;
  const got = bank ?? (r.summary.length ? 'fallback' : 'none');
  const ok = expected === 'none' ? !bank && !r.summary.length : got === expected;
  if (ok) pass++;
  else fails.push({ q, expected, got, match: r.match, text: r.summary.map((s) => s.text).join(' ').slice(0, 160) });
  if (show) console.log(`${ok ? 'ok  ' : 'FAIL'} ${q.padEnd(42)} -> ${got.padEnd(13)} ${JSON.stringify(r.match)}\n       ${r.summary.map((s) => s.text).join(' ').slice(0, 200)}`);
}
console.log(`\n${pass}/${CASES.length} passed`);
for (const f of fails) console.log(`FAIL "${f.q}": expected ${f.expected}, got ${f.got} ${JSON.stringify(f.match)}\n     ${f.text}`);
