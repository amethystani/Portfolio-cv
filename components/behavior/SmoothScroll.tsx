'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';

/** Inertial ("smooth") scrolling for wheel and trackpad, as on the original site. Skipped for reduced motion. */
export function SmoothScroll() {
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const lenis = new Lenis({ lerp: 0.09, anchors: true });
    let frame = requestAnimationFrame(function tick(time) {
      lenis.raf(time);
      frame = requestAnimationFrame(tick);
    });
    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, []);
  return null;
}
