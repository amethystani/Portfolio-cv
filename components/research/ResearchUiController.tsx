'use client';

import { useEffect } from 'react';
import type { NavPanelName } from '@/content/research-navigation';
import { researchUi, useResearchUi } from '@/lib/research-ui';

/**
 * Wires the server-rendered header buttons to the research UI (dropdown, ⌘K composer, mobile menu).
 * The buttons carry data attributes (data-research-target, data-composer-target, aria-controls); this
 * listens for clicks on them, handles the ⌘/Ctrl+K shortcut, and keeps aria-expanded in sync.
 */
export function ResearchUiController() {
  const ui = useResearchUi();

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!(e.target instanceof Element)) return;

      const navTrigger = e.target.closest<HTMLElement>('[data-research-target]');
      if (navTrigger) {
        const { nav } = researchUi.get();
        if (nav.open && nav.trigger === navTrigger) researchUi.closeNav();
        else
          researchUi.openNav(navTrigger.dataset.researchTarget as NavPanelName, navTrigger, e.detail === 0);
        return;
      }

      const composerTrigger = e.target.closest<HTMLElement>('[data-composer-target]');
      if (composerTrigger) {
        researchUi.get().composer.open
          ? researchUi.closeComposer()
          : researchUi.openComposer(composerTrigger);
        return;
      }

      if (e.target.closest('button[aria-controls="research-mobile-menu"]')) {
        researchUi.get().menu.open ? researchUi.closeMenu() : researchUi.openMenu();
      }
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        researchUi.get().composer.open
          ? researchUi.closeComposer()
          : researchUi.openComposer(document.querySelector<HTMLElement>('[data-composer-target]'));
      }
    };

    document.addEventListener('click', onClick);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('click', onClick);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, []);

  useEffect(() => {
    document
      .querySelectorAll('[data-research-target]')
      .forEach((el) => el.setAttribute('aria-expanded', String(ui.nav.open && ui.nav.trigger === el)));
    document.querySelectorAll('[data-composer-target]').forEach((el) => {
      el.setAttribute('aria-expanded', String(ui.composer.open));
      el.setAttribute('data-composer-active', String(ui.composer.open));
    });
    document
      .querySelectorAll('button[aria-controls="research-mobile-menu"]')
      .forEach((el) => el.setAttribute('aria-expanded', String(ui.menu.open)));
  }, [ui]);

  return null;
}
