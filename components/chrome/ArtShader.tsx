'use client';

import { useEffect, useRef } from 'react';

/**
 * The canvas over the footer picture that animates it (see lib/art-shader.ts). Nothing is downloaded
 * until the footer is within 600px of the viewport, and nothing runs for visitors who prefer reduced
 * motion; in both cases the still picture underneath is simply shown.
 */
export function ArtShader({ className = '', src }: { className?: string; src: string }) {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const el = canvas.current;
    if (!el) return;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    let near = false;
    let loading = false;
    let disposed = false;
    let stop: (() => void) | undefined;

    const start = async () => {
      if (disposed || loading || stop || !near || reduced.matches) return;
      loading = true;
      try {
        const { mountArtShader } = await import('@/lib/art-shader'); // brings in three.js
        loading = false;
        if (disposed || reduced.matches) return;
        stop = mountArtShader(el, src);
        if (stop) proximity.disconnect(); // mounted; no need to keep watching
      } catch (error) {
        loading = false;
        if (!disposed) console.warn('[art-shader] could not load', error);
      }
    };
    const proximity = new IntersectionObserver(
      (entries) => {
        near = entries.at(-1)?.isIntersecting ?? false;
        start();
      },
      { rootMargin: '600px 0px' },
    );
    proximity.observe(el);
    reduced.addEventListener('change', start);
    return () => {
      disposed = true;
      proximity.disconnect();
      reduced.removeEventListener('change', start);
      stop?.();
    };
  }, [src]);

  return <canvas ref={canvas} aria-hidden="true" className={`${className} motion-reduce:invisible`.trim()} />;
}
