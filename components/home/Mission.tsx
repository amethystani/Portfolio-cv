import type { CSSProperties } from 'react';
import { MissionTitle } from '@/components/icons';
import { mission } from '@/content/home';

/** A grayscale image that fades to colour on scroll (the second copy is the colour layer). */
function ColorRevealImage({ src, colorClass }: { src: string; colorClass?: string }) {
  return (
    <>
      <img
        className="nw-mission-image nw-color-reveal"
        src={src}
        alt=""
        aria-hidden="true"
        loading="lazy"
        decoding="async"
      />
      <img
        className={`nw-mission-image ${colorClass ?? 'nw-mission-color'} nw-color-reveal`}
        src={src}
        alt=""
        aria-hidden="true"
        loading="lazy"
        decoding="async"
      />
    </>
  );
}

export function Mission() {
  return (
    <section className="w-full px-[var(--nw-band-inset)] nw-mission-wrap" data-band="mission" id="mission">
      <div className="nw-mission">
        <div className="nw-mission-hero">
          <ColorRevealImage src={mission.heroImage} />
        </div>
        <h2 className="nw-mission-title" aria-label={mission.title}>
          <MissionTitle aria-hidden="true" fill="none" data-el="mission-title" />
          <span
            aria-hidden="true"
            className="font-[family-name:var(--font-rules-gothic-cmp)] font-normal text-inherit uppercase text-cap-trim cap-rules nw-mission-mobile-title"
            style={
              {
                fontFamily: 'var(--font-rules-gothic-cmp)',
                '--nw-display-size': 'max(24px, calc(72 * var(--nw-u-text)))',
                fontSize: 'var(--nw-display-size)',
                lineHeight: '0.92',
              } as CSSProperties
            }
          >
            {mission.title}
          </span>
        </h2>
        {mission.rows.map((row) => (
          <div
            key={row.eyebrow}
            className="nw-mission-row"
            {...('reverse' in row && row.reverse ? { 'data-reverse': 'true' } : {})}
          >
            <div className="nw-mission-copy">
              <span
                className="font-[family-name:var(--font-mono)] font-normal text-inherit uppercase"
                style={{
                  fontSize: 'max(13px, calc(13 * var(--nw-u-text)))',
                  letterSpacing: 'max(0px, calc(0 * var(--nw-u-text)))',
                  lineHeight: '1.2',
                }}
              >
                {row.eyebrow}
              </span>
              <h3
                className="font-[family-name:var(--font-rules-gothic-cmp)] font-normal text-inherit uppercase text-cap-trim cap-rules nw-mission-heading"
                style={
                  {
                    fontFamily: 'var(--font-rules-gothic-cmp)',
                    '--nw-display-size': 'max(16px, calc(48 * var(--nw-u-text)))',
                    fontSize: 'var(--nw-display-size)',
                    lineHeight: '1.1',
                  } as CSSProperties
                }
              >
                {row.heading}
              </h3>
              <p
                className="font-[family-name:var(--font-rules)] proportional-nums font-normal text-inherit normal-case text-pretty"
                style={{ fontSize: 'max(13px, calc(13 * var(--nw-u-text)))', lineHeight: '1.5' }}
              >
                {row.body}
              </p>
            </div>
            <div className="nw-mission-art">
              <ColorRevealImage src={row.image} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
