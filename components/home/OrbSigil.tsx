'use client';

import { useEffect, useRef } from 'react';

const ORBITS = ['Workspaces', 'Source', 'Source1', 'Source2', 'Source3'];
const STAMP_ALT = 'Decorative seal artwork.';

/**
 * The seal at the end of the home page. The server renders a flat picture of it (the "fallback" stamps);
 * once it is near the viewport the interactive 3D medal (lib/orb.ts, three.js) is loaded and takes its place.
 */
export function OrbSigil() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const abort = new AbortController();
    let teardown: (() => void) | undefined;
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        observer.disconnect();
        import('@/lib/orb')
          .then(({ mountOrbSigil }) => (abort.signal.aborted ? undefined : mountOrbSigil(root, abort.signal)))
          .then((stop) => (abort.signal.aborted ? stop?.() : (teardown = stop)))
          .catch(() => {
            /* no WebGL: the flat stamp stays */
          });
      },
      { rootMargin: '250px' },
    );
    observer.observe(root);
    return () => {
      abort.abort();
      observer.disconnect();
      teardown?.();
    };
  }, []);

  return (
    <div ref={ref} className="nw-orb-sigil">
      <div className="nw-orb-orbits" aria-hidden="true">
        {ORBITS.map((name, i) => (
          <img
            key={name}
            src={`/assets/nous-web/orbit-img${name}.svg`}
            alt=""
            loading="lazy"
            decoding="async"
            className={`nw-orb-layer nw-orb-layer-${i}`}
          />
        ))}
      </div>
      {(['light', 'dark'] as const).map((theme) => (
        <img
          key={theme}
          className="nw-orb-fallback"
          data-stamp={theme}
          src={`/assets/brand/logo-stamp-${theme}.png`}
          crossOrigin="anonymous"
          alt={STAMP_ALT}
          loading="lazy"
          decoding="async"
        />
      ))}
      <div
        className="nw-orb-stage"
        role="img"
        tabIndex={-1}
        aria-label="Decorative medal. Drag to rotate, use arrow keys to turn, or Home to reset."
        title="Drag to rotate; arrow keys turn; Home resets"
      />
    </div>
  );
}
