'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { promos } from '@/content/research-navigation';

const TYPE_DELAY = 28; // ms between typed characters
const HOLD_DELAY = 6500; // ms the finished message stays before the next promo

const art = (name: string) => `/assets/nous-web/promotion/promo-banner-${name}.svg`;

const useMediaQuery = (query: string) => {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const mq = matchMedia(query);
    setMatches(mq.matches);
    const onChange = () => setMatches(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [query]);
  return matches;
};

/**
 * The strip at the top of each dropdown: types out a promo message, holds it, then moves to the next one.
 * Hovering or focusing it pauses the rotation; the arrows step through promos manually.
 */
export function PromoBanner({ active, preset }: { active: boolean; preset: string }) {
  const root = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(preset === 'Contact' ? 1 : 0);
  const [typed, setTyped] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(false);
  const reduced = useMediaQuery('(prefers-reduced-motion: reduce)');
  const promo = promos[index];

  // Opening a different panel brings its own promo first (Contact leads with the get-in-touch promo).
  useEffect(() => {
    setIndex(preset === 'Contact' ? 1 : 0);
    setTyped(0);
  }, [preset]);

  useEffect(() => {
    const onVisibility = () => setHidden(document.hidden);
    onVisibility();
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, []);

  const paused = !active || hidden || reduced || focused || (typed === promo.text.length && hovered);

  useEffect(() => {
    if (paused) return;
    const wait = typed === promo.text.length ? HOLD_DELAY : TYPE_DELAY;
    const timer = setTimeout(() => {
      if (typed < promo.text.length) setTyped(typed + 1);
      else go(index + 1);
    }, wait);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paused, typed, index]);

  const go = (to: number) => {
    setIndex((to + promos.length) % promos.length);
    setTyped(0);
  };

  return (
    <div
      ref={root}
      className="nw-menu-promotion"
      data-promo={promo.kind}
      data-paused={String(paused)}
      data-slide={index}
      data-typed-count={typed}
      data-reduced={String(reduced)}
      aria-label="Featured"
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={(e) => !e.currentTarget.contains(e.relatedTarget) && setFocused(false)}
    >
      {promo.external ? (
        <a className="promo-hit" href={promo.href} target="_blank" rel="noopener noreferrer">
          <PromoContent promo={promo} typed={typed} reduced={reduced} />
        </a>
      ) : (
        <Link className="promo-hit" href={promo.href}>
          <PromoContent promo={promo} typed={typed} reduced={reduced} />
        </Link>
      )}
      <div className="promo-controls">
        <button type="button" aria-label="Previous highlight" onClick={() => go(index - 1)}>
          <img alt="" src={art('chevron')} />
        </button>
        <button type="button" aria-label="Next highlight" onClick={() => go(index + 1)}>
          <img alt="" src={art('chevron')} />
        </button>
      </div>
    </div>
  );
}

function PromoContent({
  promo,
  typed,
  reduced,
}: {
  promo: (typeof promos)[number];
  typed: number;
  reduced: boolean;
}) {
  return (
    <>
      <span className="promo-message">
        <span className="promo-more">{promo.label}</span>
        <span>:</span>
        <span className={`promo-spoken${reduced ? '' : ' sr-only'}`}>{promo.text}</span>
        <span className="promo-typed" aria-hidden="true">
          {promo.text.slice(0, typed)}
        </span>
      </span>
    </>
  );
}
