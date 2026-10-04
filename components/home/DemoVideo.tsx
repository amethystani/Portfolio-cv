'use client';

import { useEffect, useRef } from 'react';

/**
 * The video band under Selected Work: a muted loop that plays only while it is on screen, the tab is visible
 * and the visitor has not asked for reduced motion. Until then (and for reduced motion) the poster shows.
 * `sources` are tried in order (WebM first: smaller), so list the fallback last.
 */
export function DemoVideo({ poster, sources }: { poster: string; sources: { src: string; type: string }[] }) {
  const video = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = video.current;
    if (!el) return;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    let onScreen = false;
    let disposed = false;

    const sync = () => {
      if (disposed) return;
      if (!onScreen || document.hidden || reduced.matches) el.pause();
      else el.play().catch(() => {}); // autoplay can be refused; the poster stays
    };
    const visibility = new IntersectionObserver((entries) => {
      const last = entries.at(-1);
      if (!last) return;
      onScreen = last.isIntersecting;
      sync();
    });
    visibility.observe(el);
    sync();
    reduced.addEventListener('change', sync);
    document.addEventListener('visibilitychange', sync);
    return () => {
      disposed = true;
      visibility.disconnect();
      reduced.removeEventListener('change', sync);
      document.removeEventListener('visibilitychange', sync);
      el.pause();
    };
  }, [sources]);

  return (
    <video
      ref={video}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 size-full object-cover object-center"
      loop
      muted
      playsInline
      poster={poster}
      preload="metadata"
    >
      {sources.map((s) => (
        <source key={s.src} src={s.src} type={s.type} />
      ))}
    </video>
  );
}
