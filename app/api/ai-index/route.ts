import { createHash } from 'node:crypto';
import { buildAiCorpus } from '@/lib/ai-corpus';

// Built once at build time; the browser downloads it when the assistant warms up.
export const dynamic = 'force-static';

/** GET -> { version, chunks }. The version changes whenever the content does, so cached vectors are rebuilt. */
export async function GET() {
  const chunks = buildAiCorpus();
  const version = createHash('sha1').update(JSON.stringify(chunks)).digest('hex').slice(0, 12);
  return Response.json({ version, chunks });
}
