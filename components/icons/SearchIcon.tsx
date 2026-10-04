import type { SVGProps } from 'react';

/**
 * A vector magnifying glass drawn on the same 16x16 grid as the menu icon
 * (public/assets/nous-web/mobile-menu/pixel-menu.svg): 1.333 stroke, square ends, spanning 2.67–13.33,
 * so the two read as one matched pair at any size.
 */
export function SearchIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.3333}
      strokeLinecap="square"
      aria-hidden="true"
      {...props}
    >
      <circle cx="7" cy="7" r="3.9" />
      <path d="M10 10l3 3" />
    </svg>
  );
}
