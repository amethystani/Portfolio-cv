'use client';

import { useEffect, useRef } from 'react';

/**
 * The video band under Selected Work: a muted loop that plays only while it is on screen, the tab is visible
 * and the visitor has not asked for reduced motion. Until then (and for reduced motion) the poster shows.
 * `sources` are tried in order. MP4 (H.264) goes first because Safari plays and loops it reliably, while it
 * can stall on a WebM that lacks a seek index; WebM stays as the fallback for browsers without H.264.
 * Safari also pauses autoplaying video on its own (Low Power Mode, tab and scroll changes), so the player resumes
 * whenever it is paused while it should be playing, and restarts by hand if the native loop fails.
 */
export function DemoVideo({ poster, sources }: { poster: string; sources: { src: string; type: string }[] }) {
  const video = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = video.current;
    if (!el) return;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    let onScreen = false;
    let disposed = false;
    // Safari only autoplays when the element is muted *as an attribute*; React sets the property only.
    el.muted = true;
    el.defaultMuted = true;
    el.setAttribute('muted', '');
    el.setAttribute('playsinline', '');
    el.setAttribute('webkit-playsinline', '');

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
    // resume if the browser paused it behind our back, and restart by hand if the native loop stalls
    const resume = () => {
      if (!disposed && onScreen && !document.hidden && !reduced.matches) el.play().catch(() => {});
    };
    const restart = () => {
      el.currentTime = 0;
      resume();
    };
    el.addEventListener('pause', resume);
    el.addEventListener('ended', restart);
    el.addEventListener('stalled', resume);
    el.addEventListener('suspend', resume);
    el.addEventListener('canplay', resume);
    reduced.addEventListener('change', sync);
    document.addEventListener('visibilitychange', sync);
    return () => {
      disposed = true;
      visibility.disconnect();
      el.removeEventListener('pause', resume);
      el.removeEventListener('ended', restart);
      el.removeEventListener('stalled', resume);
      el.removeEventListener('suspend', resume);
      el.removeEventListener('canplay', resume);
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
