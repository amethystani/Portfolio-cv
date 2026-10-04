import type { CSSProperties, ReactNode } from 'react';
import { Eyebrow } from '@/components/ui/Type';

export const WRAP = 'mx-auto w-[calc(100%-2*var(--hw-teams-pad-x))] max-w-[var(--hw-teams-col)]';

/** Page header used by blog / releases / careers: small eyebrow line plus a full-width fitted title. */
export function CatalogueHero({
  eyebrow,
  title,
  className = '',
  children,
}: {
  eyebrow: ReactNode;
  title: string;
  className?: string;
  children?: ReactNode;
}) {
  return (
    <header className={`${WRAP} nw-catalogue-hero${className ? ` ${className}` : ''}`}>
      <Eyebrow className="nw-catalogue-eyebrow">{eyebrow}</Eyebrow>
      <h1
        className="fit-text w-full font-[family-name:var(--font-rules-gothic-cmp)] font-normal text-inherit uppercase text-cap-trim cap-rules nw-catalogue-title"
        style={
          {
            '--fit-max': 'var(--nw-catalogue-hero-size)',
            '--fit-min': '24px',
            fontFamily: 'var(--font-rules-gothic-cmp)',
            '--fit-box-edge': 'cap alphabetic',
            '--fit-box-trim': 'trim-both',
            lineHeight: 'var(--nw-catalogue-hero-leading)',
          } as CSSProperties
        }
      >
        {/* Two copies: the fitted one is measured by the fit-text script; the other keeps text selectable. */}
        <span>
          <span>{title}</span>
        </span>
        <span aria-hidden="true">{title}</span>
      </h1>
      {children}
    </header>
  );
}
