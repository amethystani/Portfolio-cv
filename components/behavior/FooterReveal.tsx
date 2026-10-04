'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

// How far down the footer starts to appear and how long the fade takes (as fractions of the viewport),
// and how strongly the page "lifts" off the footer.
const START_VH = 0.72;
const RANGE_VH = 0.38;
const LIFT_K = 3.2;

const clamp = (n: number) => Math.min(1, Math.max(0, n));

/**
 * Drives the footer reveal: as you reach the end of the page the footer fades in
 * (--hw-footer-opacity) and the page content eases upward (--hw-footer-lift).
 * The CSS lives on `.hw-footer-reveal`; this only sets the two variables on scroll.
 * Each route group renders its own footer, so the effect re-runs on every navigation to pick up the new
 * element (otherwise the new footer would stay faded and blurred).
 */
export function FooterReveal() {
  const pathname = usePathname();
  useEffect(() => {
    const el = document.querySelector<HTMLElement>('.hw-footer-reveal');
    if (!el) return;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    let top = 0; // document offset of the footer's reveal start
    let lift = 0; // distance the footer is pulled up over the page
    let frame = 0;
    let lastOpacity = '';
    let lastLift = '';

    const update = () => {
      frame = 0;
      const opacity = reduced.matches
        ? 1
        : clamp((innerHeight * START_VH - (top - scrollY)) / (innerHeight * RANGE_VH));
      const progress = lift > 0 ? clamp(1 - (top - scrollY) / lift) : 1;
      const offset = reduced.matches ? 0 : (lift * (1 - Math.exp(-LIFT_K * (1 - progress)))) / LIFT_K;
      const o = opacity.toFixed(3);
      const l = `${offset.toFixed(1)}px`;
      if (o !== lastOpacity) {
        el.style.setProperty('--hw-footer-opacity', (lastOpacity = o));
        el.style.setProperty('--hw-footer-pe', opacity > 0.98 ? 'auto' : 'none');
      }
      if (l !== lastLift) el.style.setProperty('--hw-footer-lift', (lastLift = l));
    };
    const measure = () => {
      lift = -parseFloat(getComputedStyle(el).marginTop) || 0;
      top = el.getBoundingClientRect().top + scrollY + lift;
      update();
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    const resize = new ResizeObserver(measure);
    resize.observe(document.body);
    resize.observe(el);
    addEventListener('scroll', onScroll, { passive: true });
    addEventListener('resize', measure);
    reduced.addEventListener('change', measure);
    measure();
    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      removeEventListener('scroll', onScroll);
      removeEventListener('resize', measure);
      reduced.removeEventListener('change', measure);
    };
  }, [pathname]);
  return null;
}
