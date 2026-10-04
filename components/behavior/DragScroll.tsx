'use client';

import { useEffect } from 'react';

/**
 * Lets mouse users drag a horizontally scrolling strip (like the announcements) instead of reaching for
 * the scrollbar. Touch and trackpad scrolling keep working natively. A drag past 6px swallows the click
 * that would otherwise follow, so you don't open a card by letting go of it.
 */
export function DragScroll({ selector }: { selector: string }) {
  useEffect(() => {
    const strip = document.querySelector<HTMLElement>(selector);
    if (!strip) return;
    let press: { id: number; x: number; scroll: number; active: boolean } | undefined;
    let dragged = false;

    const end = () => {
      if (!press) return;
      const { id, active } = press;
      press = undefined;
      strip.removeAttribute('data-dragging');
      if (strip.hasPointerCapture(id)) strip.releasePointerCapture(id);
      dragged = active;
    };
    const onDown = (e: PointerEvent) => {
      dragged = false;
      if (
        e.pointerType !== 'mouse' ||
        e.button !== 0 ||
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey ||
        e.altKey ||
        strip.scrollWidth <= strip.clientWidth
      )
        return;
      press = { id: e.pointerId, x: e.clientX, scroll: strip.scrollLeft, active: false };
    };
    const onMove = (e: PointerEvent) => {
      if (!press || e.pointerId !== press.id) return;
      if (!(e.buttons & 1)) return end();
      const dx = e.clientX - press.x;
      if (!press.active && Math.abs(dx) < 6) return;
      if (!press.active) {
        press.active = true;
        strip.setPointerCapture(press.id);
        strip.setAttribute('data-dragging', '');
        getSelection()?.removeAllRanges();
      }
      e.preventDefault();
      strip.scrollLeft = press.scroll - dx;
    };
    const onClick = (e: MouseEvent) => {
      if (dragged && e.detail !== 0) {
        e.preventDefault();
        e.stopPropagation();
        dragged = false;
      }
    };
    const onDragStart = (e: Event) => e.preventDefault();

    strip.addEventListener('pointerdown', onDown);
    strip.addEventListener('pointermove', onMove);
    addEventListener('pointerup', end);
    addEventListener('pointercancel', end);
    strip.addEventListener('lostpointercapture', end);
    strip.addEventListener('click', onClick, true);
    strip.addEventListener('dragstart', onDragStart);
    addEventListener('blur', end);
    return () => {
      end();
      strip.removeEventListener('pointerdown', onDown);
      strip.removeEventListener('pointermove', onMove);
      removeEventListener('pointerup', end);
      removeEventListener('pointercancel', end);
      strip.removeEventListener('lostpointercapture', end);
      strip.removeEventListener('click', onClick, true);
      strip.removeEventListener('dragstart', onDragStart);
      removeEventListener('blur', end);
    };
  }, [selector]);
  return null;
}
