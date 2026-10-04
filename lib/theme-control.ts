'use client';

import { useSyncExternalStore } from 'react';
import type { Theme } from './theme';

/**
 * The bridge between ThemeToggle (which owns the theme and its switch animation) and the buttons that flip it:
 * one at the left end of the desktop header, one in the phone menu. ThemeToggle publishes the current theme and
 * registers its toggle; ThemeButton reads and calls them.
 */
type State = { theme: Theme; ready: boolean };

const SERVER: State = { theme: 'light', ready: false };
let state: State = SERVER;
let toggler: (() => void) | null = null;
const listeners = new Set<() => void>();

export const themeControl = {
  get: () => state,
  set(next: State) {
    if (next.theme === state.theme && next.ready === state.ready) return;
    state = next;
    listeners.forEach((l) => l());
  },
  register(fn: () => void) {
    toggler = fn;
  },
  toggle() {
    toggler?.();
  },
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
};

export function useThemeControl(): State {
  return useSyncExternalStore(themeControl.subscribe, themeControl.get, () => SERVER);
}
