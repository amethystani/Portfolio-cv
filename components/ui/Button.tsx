import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode, Ref } from 'react';
import styles from './button-styles.json';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'ghost'
  | 'outline'
  | 'icon'
  | 'editorial-disclosure'
  | 'hero-ghost'
  | 'underline';
export type ButtonSize = 'm' | 's';
/** `cta` = display-size label (hero and section calls to action); `compact` = small UI button. */
export type ButtonDensity = 'cta' | 'compact';

type Common = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  density?: ButtonDensity;
  /** Render children as-is instead of wrapping them in the cap-trimmed label span. */
  bare?: boolean;
  children?: ReactNode;
};

type AsLink = Common & { href: string } & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'children'>;
type AsButton = Common & { href?: undefined; ref?: Ref<HTMLButtonElement> } & Omit<
    ButtonHTMLAttributes<HTMLButtonElement>,
    'children'
  >;

const LABEL: Partial<Record<ButtonVariant, string>> = {
  'editorial-disclosure': styles.labelNoTrim,
  underline: styles.labelUnderline,
};

export function buttonClassName({
  variant = 'secondary',
  size = 'm',
  density = 'compact',
  className,
}: Pick<Common, 'variant' | 'size' | 'density'> & { className?: string }) {
  return [
    styles.base,
    styles.variants[variant],
    variant !== 'icon' && styles.sizes[size],
    variant !== 'icon' && size === 'm' && styles.density[density],
    className,
  ]
    .filter(Boolean)
    .join(' ');
}

/**
 * The site's one button: `primary` (solid), `secondary` (paper), `ghost`, `outline`,
 * `icon` and `editorial-disclosure` (the "show more" toggles). Renders an <a> when given an href.
 */
export function Button(props: AsLink | AsButton) {
  const {
    variant = 'secondary',
    size = 'm',
    density = 'compact',
    bare,
    className,
    children,
    ...rest
  } = props;
  const cls = buttonClassName({ variant, size, density, className });
  const disabled = 'disabled' in rest && Boolean(rest.disabled);
  const inner = (
    <>
      {bare ? children : <span className={LABEL[variant] ?? styles.label}>{children}</span>}
      {variant !== 'underline' && !disabled && (
        <span aria-hidden="true" className="hermes-button-hover-border" />
      )}
    </>
  );
  if ('href' in rest && rest.href !== undefined) {
    return (
      <a
        role="link"
        tabIndex={0}
        data-slot="button"
        data-variant={variant}
        data-size={size}
        className={cls}
        {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {inner}
      </a>
    );
  }
  return (
    <button
      type="button"
      tabIndex={0}
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cls}
      {...(disabled ? { 'data-disabled': '' } : {})}
      {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {inner}
    </button>
  );
}
