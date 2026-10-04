import type { CSSProperties } from 'react';
import { portfolio } from '@/content/portfolio';
import { HeroNow } from './HeroNow';

/**
 * The portfolio's opening: the role above the name set across the full width, then the poster running
 * edge to edge as the main photo. Edit the words and the picture in content/portfolio.ts.
 */
export function PortfolioHero() {
  const { name, role, poster } = portfolio;
  return (
    <section aria-labelledby="portfolio-name" className="pf-hero">
      <div className="pf-text mx-auto w-full max-w-[calc(var(--hw-teams-col)+2*var(--hw-teams-pad-x))] px-[var(--hw-teams-pad-x)]">
        <p
          className="pf-eyebrow font-[family-name:var(--font-rules-extended)] font-bold text-inherit uppercase leading-[1.4]"
          style={{
            fontSize: 'max(9px, calc(9 * var(--nw-u-text)))',
            letterSpacing: 'max(0.36px, calc(0.36 * var(--nw-u-text)))',
          }}
        >
          {role}
        </p>
        <HeroNow />
        <h1
          id="portfolio-name"
          className="fit-text font-[family-name:var(--font-rules-gothic-cmp)] font-normal text-inherit uppercase text-cap-trim cap-rules w-full"
          style={
            {
              '--fit-max': 'calc(293 * var(--nw-u))',
              '--fit-min': '24px',
              fontFamily: 'var(--font-rules-gothic-cmp)',
              '--fit-box-edge': 'cap alphabetic',
              '--fit-box-trim': 'trim-both',
              lineHeight: '1',
            } as CSSProperties
          }
        >
          <span>
            <span>{name}</span>
          </span>
          <span aria-hidden="true">{name}</span>
        </h1>
      </div>
      <figure className="pf-poster">
        <img
          src={poster.src}
          width={poster.width}
          height={poster.height}
          alt={poster.alt}
          fetchPriority="high"
          decoding="async"
        />
      </figure>
    </section>
  );
}
