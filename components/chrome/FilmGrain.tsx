'use client';

import { useEffect, useRef } from 'react';

/** A barely-there layer of speckle over the whole page (see lib/film-grain.ts). */
export function FilmGrain() {
  const canvas = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const el = canvas.current;
    if (!el) return;
    let disposed = false;
    let stop: (() => void) | undefined;
    import('@/lib/film-grain').then(({ mountFilmGrain }) => {
      if (!disposed) stop = mountFilmGrain(el);
    });
    return () => {
      disposed = true;
      stop?.();
    };
  }, []);
  return (
    <canvas
      ref={canvas}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-101 h-full w-full"
      style={{ mixBlendMode: 'normal', opacity: 0.02 }}
    />
  );
}
