'use client';

import { useSyncExternalStore } from 'react';
import type { NavPanelName } from '@/content/research-navigation';

/**
 * Open/closed state shared by the header triggers, the dropdown panels, the ⌘K composer and the
 * mobile menu. Only one of them is open at a time.
 */
export type ResearchUiState = {
  nav: {
    open: boolean;
    panel: NavPanelName;
    trigger: HTMLElement | null;
    /** moved here by keyboard, so focus the first link */ focus: boolean;
  };
  composer: { open: boolean; trigger: HTMLElement | null };
  menu: { open: boolean };
};

const initial: ResearchUiState = {
  nav: { open: false, panel: 'About', trigger: null, focus: false },
  composer: { open: false, trigger: null },
  menu: { open: false },
};

let state = initial;
const listeners = new Set<() => void>();

function set(next: ResearchUiState) {
  state = next;
  listeners.forEach((l) => l());
}

export const researchUi = {
  get: () => state,
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  openNav(panel: NavPanelName, trigger: HTMLElement | null, focus = false) {
    set({
      nav: { open: true, panel, trigger, focus },
      composer: { ...state.composer, open: false },
      menu: { open: false },
    });
  },
  closeNav() {
    if (state.nav.open) set({ ...state, nav: { ...state.nav, open: false, focus: false } });
  },
  openComposer(trigger: HTMLElement | null = null) {
    set({
      nav: { ...state.nav, open: false, focus: false },
      composer: { open: true, trigger },
      menu: { open: false },
    });
  },
  closeComposer() {
    if (state.composer.open) set({ ...state, composer: { ...state.composer, open: false } });
  },
  openMenu() {
    set({
      nav: { ...state.nav, open: false, focus: false },
      composer: { ...state.composer, open: false },
      menu: { open: true },
    });
  },
  closeMenu() {
    if (state.menu.open) set({ ...state, menu: { open: false } });
  },
  closeAll() {
    if (state.nav.open || state.composer.open || state.menu.open)
      set({
        nav: { ...state.nav, open: false, focus: false },
        composer: { ...state.composer, open: false },
        menu: { open: false },
      });
  },
};

export function useResearchUi(): ResearchUiState {
  return useSyncExternalStore(researchUi.subscribe, researchUi.get, () => initial);
}
