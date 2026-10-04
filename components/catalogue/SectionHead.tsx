import type { ReactNode } from 'react';
import { SectionTitle } from '@/components/ui/Type';

type Props = {
  id?: string;
  title: string;
  /** Small icon at the right of the heading. */
  icon: string;
  /** Turns the icon into a link (e.g. a jump link or mailto:). */
  link?: { href: string; label: string };
  className?: string;
  children?: ReactNode;
} & Record<string, unknown>;

/** Section heading with a trailing icon, shared by the catalogue pages. */
export function SectionHead({ id, title, icon, link, className = '', children, ...rest }: Props) {
  const img = <img src={icon} alt="" className="nw-catalogue-section-icon" width={24} height={24} />;
  return (
    <div className={`nw-catalogue-section-head${className ? ` ${className}` : ''}`} {...rest}>
      <SectionTitle id={id}>{title}</SectionTitle>
      {link ? (
        <a href={link.href} aria-label={link.label} className="nw-release-jump">
          {img}
        </a>
      ) : (
        img
      )}
      {children}
    </div>
  );
}
