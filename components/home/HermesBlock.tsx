import type { CSSProperties } from 'react';
import { hermesFeatures, work } from '@/content/home';
import { Button } from '@/components/ui/Button';
import { DemoVideo } from './DemoVideo';
import { WorkTerminal } from './WorkTerminal';

export function HermesBlock() {
  return (
    <div className="w-full px-[var(--nw-band-inset)] flex flex-col" data-band="hermes" id="work">
      <div
        data-el="hermes-title"
        className="grid h-[var(--nw-hermes-title-h)] content-start justify-items-center gap-[var(--nw-seam-block)] pt-[calc(120*var(--nw-u))] max-lg:h-auto max-lg:px-[var(--nw-gutter)] max-lg:py-[var(--nw-seam-band)]"
      >
        <p
          data-el="hermes-eyebrow"
          className="font-[family-name:var(--font-rules-extended)] font-bold text-inherit uppercase leading-[1.4] text-cap-trim cap-rules"
          style={{
            fontSize: 'max(11px, calc(11 * var(--nw-u-text)))',
            letterSpacing: 'max(0.44px, calc(0.44 * var(--nw-u-text)))',
          }}
        >
          {work.eyebrow}
        </p>
        <div className="w-[calc(1067.23*var(--nw-u))] max-lg:w-full" data-el="hermes-headline">
          <h2
            className="fit-text w-full font-[family-name:var(--font-rules-gothic-cmp)] font-normal text-inherit uppercase text-cap-trim cap-rules"
            style={
              {
                '--fit-max': 'calc(331.7 * var(--nw-u))',
                '--fit-min': '24px',
                fontFamily: 'var(--font-rules-gothic-cmp)',
                '--fit-box-edge': 'cap alphabetic',
                '--fit-box-trim': 'trim-both',
                lineHeight: '1',
              } as CSSProperties
            }
          >
            <span>
              <span>{work.title}</span>
            </span>
            <span aria-hidden="true">{work.title}</span>
          </h2>
        </div>
        <div
          className="flex w-[calc(960*var(--nw-u))] justify-center gap-[calc(80*var(--nw-u))] leading-[calc(30*var(--nw-u))] max-lg:w-full max-lg:flex-col max-lg:gap-[var(--nw-seam-micro)]"
          data-el="hermes-duo"
        >
          {work.intro.map((line) => (
            <p
              key={line}
              className="font-[family-name:var(--font-rules)] proportional-nums font-normal text-inherit normal-case text-pretty w-[calc(410*var(--nw-u))] max-lg:w-full"
              style={{ fontSize: 'max(13px, calc(13 * var(--nw-u-text)))', lineHeight: '1.15' }}
            >
              {line}
            </p>
          ))}
        </div>
        <div className="flex items-start gap-[var(--nw-cta-gap)]" data-el="hermes-ctas">
          <Button variant="secondary" density="cta" href={work.secondary.href}>
            {work.secondary.label}
          </Button>
          <Button variant="primary" density="cta" href={work.primary.href}>
            {work.primary.label}
          </Button>
        </div>
      </div>
      <div className="relative overflow-clip h-[var(--nw-demo-h)] w-full nw-term-band" data-el="hermes-demo">
        <DemoVideo poster={work.band.poster} sources={work.band.sources} />
        {/* recolours the footage to the site's red, then scanlines and a vignette so the text reads */}
        <div className="nw-term-tint" aria-hidden="true" />
        <WorkTerminal />
        <a className="nw-term-link" href={work.secondary.href} target="_blank" rel="noopener noreferrer">
          View code on GitHub <span aria-hidden="true">↗</span>
        </a>
      </div>
      <div
        data-el="hermes-products"
        className="flex h-[var(--nw-hermes-products-h)] items-center px-[var(--nw-section-pad)] max-lg:h-auto max-lg:py-[var(--nw-seam-band)]"
      >
        <div className="grid w-full grid-cols-3 max-lg:grid-cols-2 max-lg:gap-[var(--nw-seam-section)] max-sm:grid-cols-1">
          {hermesFeatures.map((feature, i) => (
            <div
              key={feature.id}
              className="flex h-[var(--nw-feature-h)] flex-col items-center justify-center gap-[var(--nw-seam-item)] px-[var(--nw-seam-item)] max-lg:h-auto max-lg:px-0"
              data-el={`feature-${i}`}
            >
              <div className="flex w-full flex-col gap-[var(--nw-seam-micro)]">
                <span
                  className="font-[family-name:var(--font-mono)] font-normal text-inherit uppercase leading-none text-cap-trim cap-mono"
                  style={{
                    fontSize: 'max(11px, calc(11 * var(--nw-u-text)))',
                    letterSpacing: 'max(0.44px, calc(0.44 * var(--nw-u-text)))',
                  }}
                >
                  <span className="nw-desktop-only">{feature.eyebrow.desktop}</span>
                  <span className="nw-mobile-only">{feature.eyebrow.mobile}</span>
                </span>
                <h3
                  className="font-[family-name:var(--font-rules-gothic-cmp)] font-medium text-inherit text-cap-trim cap-rules normal-case"
                  style={
                    {
                      fontFamily: 'var(--font-rules-gothic-cmp)',
                      '--nw-display-size': 'max(11px, calc(32 * var(--nw-u-text)))',
                      fontSize: 'var(--nw-display-size)',
                      lineHeight: '1.2',
                    } as CSSProperties
                  }
                >
                  {feature.title}
                </h3>
              </div>
              <div className="relative overflow-clip h-[var(--nw-feature-art-h)] w-full max-lg:aspect-[347/313] max-lg:h-auto">
                {/* the project in one line, set like a printed card */}
                <a
                  className={`nw-work-card${feature.art ? ' nw-work-card-has-art' : ''}`}
                  href={`https://github.com/${feature.repo}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {feature.art && (
                    <img
                      className="nw-work-card-img"
                      src={feature.art}
                      alt=""
                      loading="lazy"
                      decoding="async"
                    />
                  )}
                  <span className="nw-work-card-blurb">{feature.blurb}</span>
                  <span className="nw-work-card-repo">github.com/{feature.repo}</span>
                </a>
              </div>
              <div className="w-full">
                <Button variant="secondary" className="nw-desktop-only" href={feature.cta.desktop.href}>
                  {feature.cta.desktop.label}
                </Button>
                <Button variant="secondary" className="nw-mobile-only" href={feature.cta.mobile.href}>
                  {feature.cta.mobile.label}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
