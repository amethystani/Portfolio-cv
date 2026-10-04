import type { CSSProperties, ElementType, ReactNode } from 'react';

/**
 * Typographic building blocks. The site scales type with --nw-u-text, so sizes are written as
 * `max(<px>px, calc(<px> * var(--nw-u-text)))` (never smaller than the pixel value, growing on big screens).
 */
const scaled = (px: number) => `max(${px}px, calc(${px} * var(--nw-u-text)))`;

type Base = { as?: ElementType; className?: string; children?: ReactNode } & Record<string, unknown>;

/** Uppercase monospace label. */
export function Mono({
  as: Tag = 'span',
  size = 13,
  tracking = 0,
  leading = 1.2,
  className = '',
  style,
  ...rest
}: Base & { size?: number; tracking?: number; leading?: number; style?: CSSProperties }) {
  return (
    <Tag
      className={`font-[family-name:var(--font-mono)] font-normal text-inherit uppercase${className ? ` ${className}` : ''}`}
      style={{
        fontSize: scaled(size),
        letterSpacing: scaled(tracking),
        lineHeight: String(leading),
        ...style,
      }}
      {...rest}
    />
  );
}

/** Body copy (Rules). */
export function Body({
  as: Tag = 'p',
  size = 13,
  leading = 1.5,
  className = '',
  ...rest
}: Base & { size?: number; leading?: number }) {
  return (
    <Tag
      className={`font-[family-name:var(--font-rules)] proportional-nums font-normal text-inherit normal-case text-pretty${className ? ` ${className}` : ''}`}
      style={{ fontSize: scaled(size), lineHeight: String(leading) }}
      {...rest}
    />
  );
}

/** Small bold extended caps above a headline. */
export function Eyebrow({ as: Tag = 'p', size = 9, className = '', ...rest }: Base & { size?: number }) {
  return (
    <Tag
      className={`font-[family-name:var(--font-rules-extended)] font-bold text-inherit uppercase leading-[1.4] text-cap-trim cap-rules${className ? ` ${className}` : ''}`}
      style={{ fontSize: scaled(size), letterSpacing: scaled(0) }}
      {...rest}
    />
  );
}

/** Large condensed display heading used for section titles (80px scaled, 27px minimum). */
export function SectionTitle({
  as: Tag = 'h2',
  min = 27,
  size = 80,
  className = '',
  ...rest
}: Base & { min?: number; size?: number }) {
  return (
    <Tag
      className={`font-[family-name:var(--font-rules-gothic-cmp)] font-medium text-inherit uppercase text-cap-trim cap-rules${className ? ` ${className}` : ''}`}
      style={
        {
          fontFamily: 'var(--font-rules-gothic-cmp)',
          '--nw-display-size': `max(${min}px, calc(${size} * var(--nw-u-text)))`,
          fontSize: 'var(--nw-display-size)',
          lineHeight: '1',
        } as CSSProperties
      }
      {...rest}
    />
  );
}

/** Row title in the condensed Rules face (e.g. a release or article name). */
export function RowTitle({
  as: Tag = 'h3',
  size = 20,
  leading = 1.4,
  className = '',
  ...rest
}: Base & { size?: number; leading?: number }) {
  return (
    <Tag
      className={`font-[family-name:var(--font-rules-gothic-cnd)] font-normal text-inherit normal-case${className ? ` ${className}` : ''}`}
      style={{ fontSize: `calc(${size} * var(--nw-u-text))`, lineHeight: String(leading) }}
      {...rest}
    />
  );
}
