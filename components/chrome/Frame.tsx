'use client';

import { useEffect, useRef } from 'react';

/**
 * The blue picture-frame around the viewport (desktop only). Its glow reacts to scrolling
 * (the bright band slides along the edge, --scroll-y) and to clicks (a cue flashes on the nearest edge).
 */
export function Frame() {
  const frame = useRef<HTMLDivElement>(null);
  const click = useRef<HTMLSpanElement>(null);
  const scroll = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const root = frame.current;
    const cue = click.current;
    const band = scroll.current;
    if (!root || !cue || !band) return;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    let animation: Animation | undefined;
    let scrollTimer: ReturnType<typeof setTimeout>;
    let frameId = 0;
    let lastCue = -Infinity;

    const stop = () => {
      animation?.cancel();
      clearTimeout(scrollTimer);
      cancelAnimationFrame(frameId);
      frameId = 0;
      band.classList.remove('is-scrolling');
    };

    // Clicking anywhere pulses the frame edge closest to the click.
    const onClick = (e: MouseEvent) => {
      if (
        reduced.matches ||
        document.hidden ||
        !root.getClientRects().length ||
        performance.now() - lastCue < 120
      )
        return;
      lastCue = performance.now();
      const box = root.getBoundingClientRect();
      let x = e.clientX - box.left;
      let y = e.clientY - box.top;
      if (e.detail === 0 && e.target instanceof Element) {
        // keyboard activation: use the centre of the focused element
        const r = e.target.getBoundingClientRect();
        x = r.left + r.width / 2 - box.left;
        y = r.top + r.height / 2 - box.top;
      }
      const distances = [x, box.width - x, y, box.height - y];
      const nearest = distances.indexOf(Math.min(...distances));
      if (nearest === 0) x = 0;
      else if (nearest === 1) x = box.width;
      else y = nearest === 2 ? 0 : box.height;
      cue.style.setProperty('--cue-x', `${x}px`);
      cue.style.setProperty('--cue-y', `${y}px`);
      animation?.cancel();
      animation = cue.animate([{ opacity: 0 }, { opacity: 0.38, offset: 0.18 }, { opacity: 0 }], {
        duration: 760,
        easing: 'ease-out',
      });
    };

    // Scrolling slides the bright band: 10% at the top of the page to 90% at the bottom.
    const onScroll = () => {
      if (reduced.matches || document.hidden || frameId || !root.getClientRects().length) return;
      frameId = requestAnimationFrame(() => {
        frameId = 0;
        const doc = document.documentElement;
        const max = doc.scrollHeight - doc.clientHeight;
        const progress = max > 0 ? Math.min(1, Math.max(0, scrollY / max)) : 0;
        band.style.setProperty('--scroll-y', `${10 + 80 * progress}%`);
        band.classList.add('is-scrolling');
        clearTimeout(scrollTimer);
        scrollTimer = setTimeout(() => band.classList.remove('is-scrolling'), 180);
      });
    };

    document.addEventListener('click', onClick, { capture: true, passive: true });
    addEventListener('scroll', onScroll, { passive: true });
    reduced.addEventListener('change', stop);
    return () => {
      stop();
      document.removeEventListener('click', onClick, true);
      removeEventListener('scroll', onScroll);
      reduced.removeEventListener('change', stop);
    };
  }, []);

  return (
    <div ref={frame} aria-hidden="true" className="hw-frame max-md:hidden">
      <span className="hw-frame-ambient top" />
      <span className="hw-frame-ambient right" />
      <span className="hw-frame-ambient bottom" />
      <span className="hw-frame-ambient left" />
      <span ref={click} className="hw-frame-click" />
      <span ref={scroll} className="hw-frame-scroll" />
    </div>
  );
}
