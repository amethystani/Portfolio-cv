import { createHash } from 'node:crypto';
import { assistant } from '@/content/assistant';
import { buildAiCorpus } from '@/lib/ai-corpus';

// Built once at build time; the browser downloads it when the assistant warms up.
export const dynamic = 'force-static';

/** GET -> { version, answers, chunks }: the answer bank (content/assistant.ts) and the site's passages. */
export async function GET() {
  const chunks = buildAiCorpus();
  const version = createHash('sha1').update(JSON.stringify([assistant, chunks])).digest('hex').slice(0, 12);
  return Response.json({ version, answers: assistant, chunks });
}
