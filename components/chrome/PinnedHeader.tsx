'use client';

import { useEffect, useState } from 'react';
import { NavBar } from './NavBar';

/**
 * A compact copy of the nav that slides in once you scroll past the header and tucks away again at the
 * footer. It is `inert` (unfocusable) while hidden. Visibility follows the page body crossing the top
 * edge of the window.
 */
export function PinnedHeader() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const body = document.querySelector('.nw-page-body');
    if (!body) return;
    // A zero-height observation line along the top edge: "visible" while the page body spans it.
    const observer = new IntersectionObserver(([entry]) => setVisible(entry?.isIntersecting ?? false), {
      rootMargin: '0px 0px -100% 0px',
    });
    observer.observe(body);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      className={`bg-hermes-paper fixed inset-x-0 top-0 z-50 text-[var(--hermes-primary)] shadow-[var(--hw-teams-paper-nav-rule)] transition-[translate,visibility] duration-300 ease-out motion-reduce:transition-none md:inset-x-[var(--hw-teams-page-inset)] md:top-[calc(var(--hw-frame)-1px)] ${visible ? 'translate-y-0' : 'invisible -translate-y-full'}`}
      inert={!visible}
    >
      <NavBar variant="pinned" />
    </div>
  );
}
