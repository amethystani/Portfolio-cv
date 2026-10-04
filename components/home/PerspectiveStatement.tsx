'use client';

import { useEffect, useRef } from 'react';

/**
 * Perspective text scroll, after Skiper UI's "Skiper 28 PerspectiveTextScroll".
 * The original uses framer-motion; this version drives the same transform with
 * a scroll listener and one CSS variable, so no extra dependency is needed.
 *
 * The text starts tipped back (rotateX 30deg) and 487px low, and rises into place as the section scrolls past.
 * Edit the words in content/home.ts (`statement`).
 */
const START_OFFSET = 487; // px the text starts below its resting place (capped to the screen height, see below)

export function PerspectiveStatement({ label, text }: { label: string; text: string }) {
  const root = useRef<HTMLElement>(null);
  const body = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = root.current;
    const target = body.current;
    if (!section || !target) return;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;

    const update = () => {
      frame = 0;
      if (reduced.matches) {
        target.style.setProperty('--ps-y', '0px');
        return;
      }
      // The section is pinned while it scrolls past (its sticky stage). The text starts rising as soon as the
      // section is half on screen and has settled about 60% of the way through the pinned stretch, so there
      // is no long empty run before it appears.
      const rect = section.getBoundingClientRect();
      const pinned = Math.max(1, rect.height - innerHeight);
      const p = Math.min(1, Math.max(0, (innerHeight * 0.5 - rect.top) / (innerHeight * 0.5 + pinned * 0.9)));
      const start = Math.min(START_OFFSET, innerHeight * 0.4);
      target.style.setProperty('--ps-y', `${(start * (1 - p)).toFixed(1)}px`);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    addEventListener('scroll', onScroll, { passive: true });
    addEventListener('resize', onScroll);
    reduced.addEventListener('change', onScroll);
    update();
    return () => {
      cancelAnimationFrame(frame);
      removeEventListener('scroll', onScroll);
      removeEventListener('resize', onScroll);
      reduced.removeEventListener('change', onScroll);
    };
  }, []);

  return (
    <section ref={root} className="ps" data-band="statement" aria-label={label}>
      <div className="ps-stage">
        <p className="ps-label">{label}</p>
        <div ref={body} className="ps-text">
          {text}
          <span className="ps-fade" aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}
