import type { SVGProps } from 'react';

const rows = (list: [number, number, number][]) =>
  list.map(([y, x, w]) => `M${x} ${y}h${w}v1h-${w}z`).join('');

/** 12x12 pixel-art sun and moon for the theme button, drawn in currentColor. */
const SUN = rows([
  [0, 5, 2],
  [1, 1, 1],
  [1, 5, 2],
  [1, 10, 1],
  [2, 3, 6],
  [3, 3, 6],
  [4, 2, 8],
  [5, 0, 2],
  [5, 2, 8],
  [5, 10, 2],
  [6, 0, 2],
  [6, 2, 8],
  [6, 10, 2],
  [7, 2, 8],
  [8, 3, 6],
  [9, 3, 6],
  [10, 1, 1],
  [10, 5, 2],
  [10, 10, 1],
  [11, 5, 2],
]);
const MOON = rows([
  [1, 5, 3],
  [2, 3, 3],
  [3, 2, 3],
  [4, 2, 2],
  [5, 1, 3],
  [6, 1, 3],
  [7, 1, 3],
  [7, 9, 2],
  [8, 2, 3],
  [8, 8, 3],
  [9, 2, 8],
  [10, 3, 6],
  [11, 5, 2],
]);

export function PixelTheme({ mode, ...props }: { mode: 'sun' | 'moon' } & SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 12 12" fill="currentColor" aria-hidden="true" shapeRendering="crispEdges" {...props}>
      <path d={mode === 'sun' ? SUN : MOON} />
    </svg>
  );
}
