'use client';

import { useSyncExternalStore } from 'react';

/**
 * On-device search for the ⌘K palette (components/research/Composer.tsx). Starts public/ai/worker.js once the
 * page is idle: the passage index (~35 KB) loads first, so keyword search and quick answers work at once; the
 * 3.9 MB word-embedding table for meaning search follows, unless the visitor has Data Saver on or a slow
 * connection, in which case it loads only when they open search. Every query then answers in about a millisecond.
 */
export type AiPassage = { id: string; title: string; url: string; kind: string; text: string };
export type AiResults = {
  results: AiPassage[];
  passages: AiPassage[];
  summary: AiPassage[];
  semantic: boolean;
  ms: number;
};
export type AiStatus = { index: boolean; semantic: 'idle' | 'loading' | 'ready' | 'error' };

const INITIAL: AiStatus = { index: false, semantic: 'idle' };
const EMPTY: AiResults = { results: [], passages: [], summary: [], semantic: false, ms: 0 };
const BASE = '/ai';
let status: AiStatus = INITIAL;
const listeners = new Set<() => void>();
const setStatus = (next: AiStatus) => {
  status = next;
  listeners.forEach((l) => l());
};

let worker: Worker | null = null;
let nextId = 0;
const pending = new Map<number, (value: AiResults) => void>();

const slowNetwork = () => {
  const c = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
  return !!c && (c.saveData === true || /(^|-)(2g|3g)$/.test(c.effectiveType ?? ''));
};

function start(semantic: boolean) {
  if (typeof window === 'undefined' || typeof Worker === 'undefined') return;
  if (worker) {
    if (semantic && status.semantic === 'idle') worker.postMessage({ type: 'loadSemantic', base: BASE });
    return;
  }
  try {
    worker = new Worker(`${BASE}/worker.js`, { type: 'module' });
  } catch {
    return;
  }
  worker.onmessage = ({ data }) => {
    if (data.type === 'status') setStatus({ index: data.passages > 0, semantic: data.semantic });
    else if (data.type === 'results' || data.type === 'error') {
      pending.get(data.id)?.(data.type === 'results' ? data : EMPTY);
      pending.delete(data.id);
    }
  };
  worker.onerror = () => setStatus({ ...status, semantic: 'error' });
  worker.postMessage({ type: 'init', indexUrl: '/api/ai-index', base: BASE, semantic });
}

export const ai = {
  /** Start quietly once the page has settled. */
  warmWhenIdle() {
    if (worker || typeof window === 'undefined') return;
    const idle = (window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number })
      .requestIdleCallback;
    const go = () => start(!slowNetwork());
    const kick = () => (idle ? idle(go, { timeout: 4000 }) : setTimeout(go, 2000));
    if (document.readyState === 'complete') setTimeout(kick, 1500);
    else addEventListener('load', () => setTimeout(kick, 1500), { once: true });
  },
  /** The visitor opened search: start now, meaning search included. */
  warmNow: () => start(true),
  search(query: string): Promise<AiResults> {
    start(true);
    const id = ++nextId;
    if (!worker) return Promise.resolve(EMPTY);
    return new Promise((resolve) => {
      pending.set(id, resolve);
      worker!.postMessage({ type: 'search', id, query });
    });
  },
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
  get: () => status,
};

export function useAiStatus(): AiStatus {
  return useSyncExternalStore(ai.subscribe, ai.get, () => INITIAL);
}
