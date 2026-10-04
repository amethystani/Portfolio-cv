export const THEME_STORAGE_KEY = 'nous-research-theme';
export const SYSTEM_COLOR_SCHEME_QUERY = '(prefers-color-scheme: dark)';

export type Theme = 'light' | 'dark';
export type ThemePreference = Theme | 'system';

/** Turns a stored preference (or nothing) into the theme to show. "system" follows the OS. */
export function resolveThemePreference(
  value: string | null | undefined,
  systemDark = false,
): { preference: ThemePreference; resolvedTheme: Theme } {
  const preference: ThemePreference = value === 'light' || value === 'dark' ? value : 'system';
  return {
    preference,
    resolvedTheme: preference === 'system' ? (systemDark ? 'dark' : 'light') : preference,
  };
}

/** Calls back with the OS dark-mode setting now and whenever it changes. */
export function observeSystemColorScheme(callback: (dark: boolean) => void): () => void {
  const mq = matchMedia(SYSTEM_COLOR_SCHEME_QUERY);
  const onChange = () => callback(mq.matches);
  mq.addEventListener('change', onChange);
  onChange();
  return () => mq.removeEventListener('change', onChange);
}

/**
 * Inline script for <head>: applies the saved theme before first paint so the page never flashes the
 * wrong colours. Keep it free of imports; it is serialised into the HTML.
 */
export const themeInitScript = `(function(){try{var s=null;try{s=localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)})}catch(e){}var d=matchMedia(${JSON.stringify(SYSTEM_COLOR_SCHEME_QUERY)}).matches;document.documentElement.dataset.researchTheme=s==='light'||s==='dark'?s:(d?'dark':'light')}catch(e){}})()`;
