'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { clamp, observeColorBand, onScrollFrame, revealOnScroll } from '@/lib/motion';

type Kind = 'home' | 'blog' | 'catalogue' | 'article';

/** Elements the catalogue pages (releases, careers, jobs) fade in on scroll. */
const CATALOGUE_REVEAL =
  '.nw-catalogue-hero > *, .nw-catalogue-section-head, .nw-catalogue-row > :not(.nw-catalogue-tags), .nw-catalogue-tags > *, .nw-career-art, .nw-catalogue-message, .nw-career-apply-copy > *';

/** What an article fades in as it scrolls into view (the wide figures stay put). */
const ARTICLE_REVEAL =
  '.nw-article-hero > *, .nw-article-prose > section > :not(.nw-article-wide), .nw-article-attribution, .nw-blog-related-row';

function articleMotion(): () => void {
  const main = document.querySelector('main');
  const cleanups = [
    observeColorBand(
      document.querySelectorAll('.nw-article-color-frame'),
      toggleClass('nw-article-color-active'),
    ),
  ];
  if (main) cleanups.push(revealOnScroll(main, ARTICLE_REVEAL, 'nw-blog', { belowFoldOnly: true }));
  return () => cleanups.forEach((fn) => fn());
}

function toggleClass(name: string) {
  return (el: Element, active: boolean) => el.classList.toggle(name, active);
}
const toggleAttribute = (el: Element, active: boolean) => el.toggleAttribute('data-color-active', active);

/** Scroll position as 0..1 across the part of the page that can be scrolled. */
const smoothstepSquared = (t: number) => clamp(t, 0, 1) ** 2;

function homeMotion(): () => void {
  const cleanups: Array<() => void> = [];

  // Pictures brighten while in the middle of the screen (phones).
  cleanups.push(
    observeColorBand(
      document.querySelectorAll('.nw-mission-hero, .nw-mission-art, .nw-mobile-product-preview'),
      toggleAttribute,
    ),
  );

  // Mission copy and art fade up as they arrive; ones already visible are never hidden.
  const mission = [
    ...document.querySelectorAll<HTMLElement>('.nw-mission-title, .nw-mission-art, .nw-mission-copy > *'),
  ];
  const revealer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.removeAttribute('data-pending');
        revealer.unobserve(entry.target);
      }
    },
    { threshold: 0.01, rootMargin: '0px 0px -24px 0px' },
  );
  for (const el of mission) {
    const index = [...(el.parentElement?.children ?? [])].indexOf(el);
    el.style.setProperty('--nw-reveal-delay', `${45 * Math.min(index % 4, 3)}ms`);
    el.classList.add('nw-mission-reveal');
    if (el.getBoundingClientRect().top >= innerHeight - 24) el.setAttribute('data-pending', '');
    revealer.observe(el);
  }
  cleanups.push(() => {
    revealer.disconnect();
    mission.forEach((el) => {
      el.classList.remove('nw-mission-reveal');
      el.removeAttribute('data-pending');
    });
  });

  // Scroll-linked parallax (skipped for reduced motion).
  if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const heroFade = document.querySelector<HTMLElement>('.nw-hero-fade');
    const parallax = [...document.querySelectorAll<HTMLElement>('.nw-parallax')].map((el) => ({
      el,
      top: 0,
      h: 0,
      last: '',
    }));
    const missionArt = [...document.querySelectorAll<HTMLElement>('.nw-mission-hero, .nw-mission-art')].map(
      (el) => ({ el, top: 0, h: 0, last: '' }),
    );
    let height = innerHeight;
    let maxScroll = 1;
    let fadeEnd = 1;
    let lastProgress = '';

    const measure = () => {
      height = innerHeight;
      maxScroll = Math.max(1, document.documentElement.scrollHeight - height);
      if (heroFade) fadeEnd = heroFade.getBoundingClientRect().bottom + scrollY + 0.9 * height;
      for (const p of parallax) {
        const box = p.el.parentElement!.getBoundingClientRect();
        p.top = box.top + scrollY;
        p.h = box.height;
      }
      for (const m of missionArt) {
        const box = m.el.getBoundingClientRect();
        const translated = parseFloat(getComputedStyle(m.el).translate.split(' ')[1] ?? '0') || 0; // remove our own shift
        m.top = box.top + scrollY - translated;
        m.h = box.height;
      }
    };
    const update = () => {
      const y = clamp(scrollY, 0, maxScroll);
      if (heroFade) {
        const progress = smoothstepSquared(y / fadeEnd).toFixed(3);
        if (progress !== lastProgress)
          heroFade.style.setProperty('--nw-hero-progress', (lastProgress = progress));
      }
      for (const p of parallax) {
        const ratio = clamp((p.top - y + p.h / 2 - height / 2) / (height / 2 + p.h / 2), -1, 1);
        const value = `${(-(ratio * p.h * 0.1)).toFixed(1)}px`;
        if (value !== p.last) p.el.style.setProperty('--nw-py-img', (p.last = value));
      }
      for (const m of missionArt) {
        if (m.top - y > height + 100 || m.top + m.h - y < -100) continue; // far off screen
        const ratio = clamp((m.top - y + m.h / 2 - height / 2) / ((height + m.h) / 2), -1, 1);
        const value = `${(-ratio * Math.min(14, 0.035 * m.h)).toFixed(2)}px`;
        if (value !== m.last) m.el.style.setProperty('--nw-mission-shift', (m.last = value));
      }
    };
    measure();
    update();
    const onResize = () => {
      measure();
      update();
    };
    const images = [...document.querySelectorAll('img')].filter((img) => !img.complete);
    images.forEach((img) => img.addEventListener('load', onResize, { once: true }));
    document.fonts?.ready.then(onResize);
    cleanups.push(onScrollFrame(update, [() => removeEventListener('resize', onResize)]));
    addEventListener('resize', onResize);
  }
  return () => cleanups.forEach((fn) => fn());
}

function blogMotion(): () => void {
  const main = document.querySelector('main');
  if (!main) return () => undefined;
  const art = [...main.querySelectorAll<HTMLElement>('.nw-blog-feature-art')];
  const cleanups = [
    revealOnScroll(main, '[data-blog-reveal]', 'nw-blog', { belowFoldOnly: true }),
    observeColorBand(art, toggleClass('nw-blog-color-active')),
  ];

  // The feature pictures drift slightly against the scroll while on screen.
  if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const visible = new Set<HTMLElement>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) visible.add(e.target as HTMLElement);
          else visible.delete(e.target as HTMLElement);
        }
        update();
      },
      { rootMargin: '100px' },
    );
    art.forEach((el) => observer.observe(el));
    const update = () => {
      for (const el of visible) {
        const box = el.getBoundingClientRect();
        const ratio = clamp(
          (box.top + box.height / 2 - innerHeight / 2) / ((innerHeight + box.height) / 2),
          -1,
          1,
        );
        el.style.setProperty(
          '--nw-blog-image-shift',
          `${(-ratio * Math.min(14, 0.035 * box.height)).toFixed(2)}px`,
        );
      }
    };
    cleanups.push(
      onScrollFrame(update, [
        () => observer.disconnect(),
        () => art.forEach((el) => el.style.removeProperty('--nw-blog-image-shift')),
      ]),
    );
  }
  return () => cleanups.forEach((fn) => fn());
}

/**
 * Scroll-driven motion for a page, chosen by `kind`:
 *  - home:      hero fade, parallax, mission reveal, colour-on-scroll for phones
 *  - blog:      staggered reveal, colour-on-scroll, drifting feature pictures
 *  - catalogue: staggered reveal for releases / careers / job pages
 *  - article:   staggered reveal, plus colour-on-scroll for pictures on phones
 * Renders nothing; it acts on the server-rendered markup after hydration.
 */
export function PageMotion({ kind }: { kind: Kind }) {
  const pathname = usePathname();
  useEffect(() => {
    const run = () => {
      if (kind === 'home') return homeMotion();
      if (kind === 'blog') return blogMotion();
      if (kind === 'article') return articleMotion();
      const main = document.querySelector('main');
      return main ? revealOnScroll(main, CATALOGUE_REVEAL, 'nw-release') : () => undefined;
    };
    // Wait for the page to be fully laid out so measurements are right.
    let cleanup: (() => void) | undefined;
    let cancelled = false;
    const start = () => {
      if (!cancelled) cleanup = run();
    };
    if (document.readyState === 'complete') start();
    else addEventListener('load', start, { once: true });
    return () => {
      cancelled = true;
      removeEventListener('load', start);
      cleanup?.();
    };
  }, [kind, pathname]);
  return null;
}
