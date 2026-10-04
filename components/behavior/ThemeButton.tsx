'use client';

import { PixelTheme } from '@/components/icons';
import { themeControl, useThemeControl } from '@/lib/theme-control';

/**
 * Flips light / dark (the switch itself, with its animation, lives in ThemeToggle).
 *   header: a box the same size as the Search box, at the left end of the desktop nav, so the two mirror each other;
 *   menu:   an icon button in the phone menu's top bar, paired with the close button.
 */
export function ThemeButton({ variant }: { variant: 'header' | 'menu' }) {
  const { theme } = useThemeControl();
  const dark = theme === 'dark';
  const label = dark ? 'Switch to light mode' : 'Switch to dark mode';
  const icon = <PixelTheme mode={dark ? 'moon' : 'sun'} />;

  if (variant === 'menu') {
    return (
      <button
        type="button"
        className="nw-menu-theme grid size-11 cursor-pointer place-items-center"
        aria-label={label}
        aria-pressed={dark}
        title={label}
        onClick={() => themeControl.toggle()}
      >
        {icon}
      </button>
    );
  }
  return (
    <button
      type="button"
      className="nw-search-pill nw-theme-pill px-box max-md:hidden"
      aria-label={label}
      title={label}
      onClick={() => themeControl.toggle()}
    >
      {icon}
      <span>Theme</span>
      <kbd aria-hidden="true">{dark ? 'Dark' : 'Light'}</kbd>
    </button>
  );
}
