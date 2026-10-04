'use client';

import { useState, type ReactNode } from 'react';
import Link from 'next/link';
import { affiliations, venues, type Badge, type GlyphKind } from '@/content/affiliations';

/** Small line drawings, one per panel, in the panel's text colour. */
function Glyph({ kind }: { kind: GlyphKind }) {
  const shapes: Record<GlyphKind, ReactNode> = {
    rings: (
      <>
        <circle cx="24" cy="24" r="20" />
        <circle cx="24" cy="24" r="13" />
        <circle cx="24" cy="24" r="6" />
      </>
    ),
    grid: [8, 24, 40].flatMap((x) =>
      [8, 24, 40].map((y) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r="2.4" fill="currentColor" stroke="none" />
      )),
    ),
    hatch: [4, 14, 24, 34, 44].map((o) => <path key={o} d={`M${o - 16} 44L${o + 4} 4`} />),
    squares: (
      <>
        <rect x="6" y="6" width="36" height="36" />
        <rect x="14" y="14" width="20" height="20" transform="rotate(45 24 24)" />
        <rect x="19" y="19" width="10" height="10" />
      </>
    ),
    wave: [14, 24, 34].map((y) => (
      <path key={y} d={`M4 ${y}C12 ${y - 10} 18 ${y - 10} 24 ${y}S36 ${y + 10} 44 ${y}`} />
    )),
    cross: (
      <>
        <circle cx="24" cy="24" r="14" />
        <path d="M24 2V46M2 24H46" />
        <circle cx="24" cy="24" r="2.4" fill="currentColor" stroke="none" />
      </>
    ),
    steps: <path d="M4 44H14V34H24V24H34V14H44V4" />,
    orbit: (
      <>
        <circle cx="24" cy="24" r="5" />
        <ellipse cx="24" cy="24" rx="20" ry="9" transform="rotate(-28 24 24)" />
        <circle cx="39" cy="15" r="2.4" fill="currentColor" stroke="none" />
      </>
    ),
  };
  return (
    <svg
      viewBox="0 0 48 48"
      width="40"
      height="40"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      {shapes[kind]}
    </svg>
  );
}

/**
 * Horizontal expand-on-hover strip, after Skiper UI's "Skiper 52 HoverExpand_001".
 * The original animates widths with framer-motion; here the same effect is CSS
 * (flex-grow transitions), so no extra dependency. Hover, focus or tap a strip to open it; on phones the strips
 * stack and open downwards.
 */
function HoverExpand({ label, badges, first = 0 }: { label: string; badges: Badge[]; first?: number }) {
  const [active, setActive] = useState(first);
  return (
    <div className="af-block">
      <div className="mx-auto w-full max-w-[calc(var(--hw-teams-col)+2*var(--hw-teams-pad-x))] px-[var(--hw-teams-pad-x)]">
        <p className="af-label">{label}</p>
        <div className="ex-row" role="list">
          {badges.map((b, i) => {
            const open = active === i;
            return (
              <div
                key={b.name}
                role="listitem"
                className="ex-item"
                data-active={open}
                tabIndex={0}
                aria-label={`${b.name}: ${b.note}`}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onClick={() => setActive(i)}
              >
                <span className="ex-rail" aria-hidden={open}>
                  <span className="ex-rail-name">{b.name}</span>
                  <Glyph kind={b.glyph} />
                </span>
                <span className="ex-body" aria-hidden={!open}>
                  <span className="ex-top">
                    <span className="ex-kind">{b.kind}</span>
                    <Glyph kind={b.glyph} />
                  </span>
                  <span className="ex-name">{b.name}</span>
                  <span className="ex-note">{b.note}</span>
                  <span className="ex-foot">
                    <span>{b.when}</span>
                    <span className="ex-status">{b.status}</span>
                    <Link href={b.href} className="ex-open" tabIndex={open ? 0 : -1}>
                      Open →
                    </Link>
                  </span>
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/** Venues the work appeared at, and the places it was done. Edit content/affiliations.ts. */
export function Affiliations() {
  return (
    <section className="af" data-band="affiliations" aria-labelledby="af-heading">
      <div className="mx-auto w-full max-w-[calc(var(--hw-teams-col)+2*var(--hw-teams-pad-x))] px-[var(--hw-teams-pad-x)]">
        <h2
          id="af-heading"
          className="font-[family-name:var(--font-rules-gothic-cmp)] font-medium text-inherit uppercase text-cap-trim cap-rules"
          style={{
            fontFamily: 'var(--font-rules-gothic-cmp)',
            fontSize: 'max(40px, calc(80 * var(--nw-u-text)))',
            lineHeight: '1',
          }}
        >
          Venues &amp; Places
        </h2>
      </div>
      <HoverExpand label="Published and presented" badges={venues} />
      <HoverExpand label="Worked and studied with" badges={affiliations} />
    </section>
  );
}
