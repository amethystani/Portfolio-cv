import type { SVGProps } from 'react';

const PIXELS = {
  arrow: [
    'M10.6667 8.66667V7.33333L9.33333 7.33333V8.66667L10.6667 8.66667Z',
    'M9.33333 7.33333L9.33333 6L8 6L8 7.33333H9.33333Z',
    'M9.33333 10V8.66667H8V10H9.33333Z',
    'M8 6V4.66667L6.66667 4.66667L6.66667 6H8Z',
    'M8 11.3333V10H6.66667V11.3333H8Z',
    'M6.66667 4.66667V3.33333L5.33333 3.33333L5.33333 4.66667H6.66667Z',
    'M6.66667 12.6667L6.66667 11.3333H5.33333L5.33333 12.6667H6.66667Z',
  ],
  go: [
    'M2.66667 7.33333L2.66667 8.66667L13.3333 8.66667V7.33333L2.66667 7.33333Z',
    'M10.6667 8.66667L10.6667 10H12V8.66667H10.6667Z',
    'M9.33333 10V11.3333H10.6667V10L9.33333 10Z',
    'M8 11.3333L8 12.6667H9.33333V11.3333H8Z',
    'M10.6667 7.33333V6L12 6V7.33333H10.6667Z',
    'M9.33333 10L9.33333 4.66667H10.6667V10L9.33333 10Z',
    'M8 11.3333L8 3.33333L9.33333 3.33333L9.33333 11.3333H8Z',
  ],
};

type IconProps = Omit<SVGProps<SVGSVGElement>, 'children'> & { previous?: boolean };

const icon = (paths: string[], dim: boolean) =>
  function PixelIcon({ previous, ...props }: IconProps) {
    return (
      <svg
        aria-hidden="true"
        data-previous={previous || undefined}
        viewBox="0 0 16 16"
        fill="none"
        {...(dim ? { opacity: '0.6' } : {})}
        {...props}
      >
        {paths.map((d) => (
          <path key={d} d={d} fill="currentColor" fillOpacity="0.98" />
        ))}
      </svg>
    );
  };

/** Pixel-art chevron used on the previous / next controls. */
export const ChevronPixelIcon = icon(PIXELS.arrow, false);
/** Pixel-art arrow shown on questions and search results (also the "back" arrow when `previous`). */
export const ArrowPixelIcon = icon(PIXELS.go, true);
