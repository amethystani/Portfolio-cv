import { NextResponse } from 'next/server';
import { searchSite } from '@/lib/search';

/** POST { query } -> { results }. Used by the ⌘K palette. */
export async function POST(request: Request) {
  let query = '';
  try {
    query = String((await request.json()).query ?? '').slice(0, 512);
  } catch {
    return NextResponse.json({ error: 'Bad request' }, { status: 400 });
  }
  return NextResponse.json({ results: query.trim().length >= 2 ? searchSite(query) : [] });
}
