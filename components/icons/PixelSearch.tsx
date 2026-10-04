import type { SVGProps } from 'react';

/** A 12x12 pixel-art magnifying glass, drawn in currentColor. */
export function PixelSearch(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 12 12" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M3 0h4v1h1v1h1v4H8v1H7v1H3V7H2V6H1V2h1V1h1zM3 1v1H2v4h1v1h4V6h1V2H7V1zM8 8h1v1h1v1h1v1h-1v1h-1v-1H9V9H8z" />
    </svg>
  );
}
