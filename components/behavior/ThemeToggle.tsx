'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal, flushSync } from 'react-dom';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { observeSystemColorScheme, resolveThemePreference, THEME_STORAGE_KEY, type Theme } from '@/lib/theme';

type Running = { next: Theme; cancel: () => void };

const STEPS = [0, 0.03, 0.13, 0.31, 0.57, 0.79, 0.94, 1];
const OFFSETS = [0, 0.08, 0.2, 0.34, 0.51, 0.68, 0.86, 1];

/** Jagged horizontal "scan line" polygon that sweeps down the screen, revealing the new theme. */
function wipe(progress: number, which: 'old' | 'new'): string {
  const y = progress * innerHeight;
  const s = Math.sin(progress * Math.PI);
  const edge = [
    `0 ${y - 7 * s}px`,
    `100% ${y - 7 * s}px`,
    `100% ${y - 5 * s}px`,
    `0 ${y - 5 * s}px`,
    `0 ${y - 2 * s}px`,
    `100% ${y - 2 * s}px`,
    `100% ${y + s}px`,
    `0 ${y + s}px`,
    `0 ${y + 5 * s}px`,
    `100% ${y + 5 * s}px`,
  ];
  return which === 'new'
    ? `polygon(0 0, 100% 0, ${[...edge].reverse().join(', ')})`
    : `polygon(${edge.join(', ')}, 100% 100%, 0 100%)`;
}

/**
 * Runs `apply` inside a View Transition and plays the CRT-style wipe over it. Falls back to applying
 * immediately when View Transitions are unavailable or motion is reduced.
 */
function retune(apply: () => void): { finished: Promise<unknown>; cancel: () => void } {
  const html = document.documentElement;
  if (!document.startViewTransition || matchMedia('(prefers-reduced-motion: reduce)').matches) {
    apply();
    return { finished: Promise.resolve(), cancel: () => undefined };
  }
  html.dataset.researchRetuning = '';
  let cancelled = false;
  const animations: Animation[] = [];
  const transition = document.startViewTransition(() => {
    if (!cancelled) apply();
  });
  const cleanup = () => {
    animations.forEach((a) => a.cancel());
    delete html.dataset.researchRetuning;
  };

  const play = async () => {
    if (cancelled) return;
    const opts = { duration: 560, easing: 'linear', fill: 'both' as const };
    for (const which of ['old', 'new'] as const) {
      animations.push(
        html.animate(
          STEPS.map((p, i) => ({ clipPath: wipe(p, which), offset: OFFSETS[i] })),
          { ...opts, pseudoElement: `::view-transition-${which}(root)` },
        ),
      );
    }
    // a brief horizontal glitch on the outgoing frame
    animations.push(
      html.animate(
        [
          { transform: 'translateX(0)', filter: 'none' },
          { transform: 'translateX(-1px)', filter: 'url(#research-crt-channels)', offset: 0.08 },
          { transform: 'translateX(.75px)', filter: 'url(#research-crt-channels)', offset: 0.18 },
          { transform: 'translateX(0)', filter: 'none', offset: 0.38 },
          { transform: 'translateX(0)', filter: 'none' },
        ],
        { ...opts, pseudoElement: '::view-transition-old(root)' },
      ),
    );
    // the glowing line that rides the wipe edge
    animations.push(
      html.animate(
        STEPS.map((p, i) => ({
          transform: `translateY(${p * innerHeight - 12}px)`,
          opacity: 0.6 * Number(i !== 0 && i !== STEPS.length - 1),
          offset: OFFSETS[i],
        })),
        { ...opts, pseudoElement: '::view-transition-group(research-signal)' },
      ),
    );
    await Promise.allSettled(animations.map((a) => a.finished));
  };

  return {
    finished: Promise.allSettled([
      transition.ready.then(play).catch(() => undefined),
      transition.finished,
    ]).then(cleanup),
    cancel: () => {
      cancelled = true;
      transition.skipTransition();
      cleanup();
    },
  };
}

/**
 * The folded page corner at the top right that flips the site between light and dark.
 * The choice is saved in localStorage; with nothing saved the OS setting decides.
 */
export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('light');
  const [ready, setReady] = useState(false);
  const [viewport, setViewport] = useState<Element | null>(null);
  const pathname = usePathname();
  const preference = useRef<string>('system');
  const systemDark = useRef(false);
  const running = useRef<Running | null>(null);

  const apply = (value: string, save = true) => {
    preference.current = value;
    const { resolvedTheme } = resolveThemePreference(value, systemDark.current);
    if (document.documentElement.dataset.researchTheme !== resolvedTheme)
      document.documentElement.dataset.researchTheme = resolvedTheme;
    setTheme(resolvedTheme);
    if (save) {
      try {
        localStorage.setItem(THEME_STORAGE_KEY, value);
      } catch {
        /* storage unavailable: the choice just won't persist */
      }
    }
  };
  const abort = () => {
    const current = running.current;
    running.current = null;
    current?.cancel();
  };

  useLayoutEffect(() => {
    try {
      preference.current = resolveThemePreference(localStorage.getItem(THEME_STORAGE_KEY)).preference;
    } catch {
      /* ignore */
    }
    const stopObserving = observeSystemColorScheme((dark) => {
      systemDark.current = dark;
      if (!running.current) apply(preference.current, false);
    });
    setReady(true);

    // Another tab changed the theme.
    const onStorage = (e: StorageEvent) => {
      if (e.key !== THEME_STORAGE_KEY && e.key !== null) return;
      abort();
      apply(resolveThemePreference(e.newValue).preference, false);
    };
    // Interrupting the animation (resize, wheel, tab switch) jumps straight to the end state.
    const finishNow = () => {
      if (!running.current) return;
      const { next } = running.current;
      abort();
      apply(next);
    };
    const onVisibility = () => document.hidden && finishNow();
    addEventListener('storage', onStorage);
    addEventListener('resize', finishNow);
    addEventListener('wheel', finishNow, { passive: true });
    addEventListener('touchmove', finishNow, { passive: true });
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      stopObserving();
      removeEventListener('storage', onStorage);
      removeEventListener('resize', finishNow);
      removeEventListener('wheel', finishNow);
      removeEventListener('touchmove', finishNow);
      document.removeEventListener('visibilitychange', onVisibility);
      abort();
      delete document.documentElement.dataset.researchTheme;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useLayoutEffect(() => setViewport(document.querySelector('.nous-web-viewport')), [pathname]);

  useEffect(() => {
    document.documentElement.dataset.hydrated = 'true';
  }, []);

  const toggle = () => {
    const next: Theme =
      (running.current?.next ?? document.documentElement.dataset.researchTheme) === 'dark' ? 'light' : 'dark';
    abort();
    const transition = retune(() => flushSync(() => apply(next)));
    const entry: Running = { next, cancel: transition.cancel };
    running.current = entry;
    transition.finished.then(() => {
      if (running.current === entry) running.current = null;
    });
  };

  if (!ready) return null;
  const label = theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';
  return (
    <>
      {viewport &&
        createPortal(
          <Button
            variant="icon"
            bare
            className="nw-research-theme-fold"
            aria-label={label}
            aria-pressed={theme === 'dark'}
            title={label}
            data-icon-only="true"
            onClick={toggle}
          >
            <img
              className="nw-research-fold-front"
              src="/assets/nous-web/theme/theme-fold-front.svg"
              alt=""
              width={12}
              height={12}
              draggable={false}
            />
            <img
              className="nw-research-fold-back"
              src="/assets/nous-web/theme/theme-fold-back.svg"
              alt=""
              width={12}
              height={12}
              draggable={false}
            />
          </Button>,
          viewport,
        )}
      {createPortal(
        <>
          <div className="nw-research-theme-signal" aria-hidden="true" />
          <svg className="nw-research-theme-filters" aria-hidden="true" width="0" height="0">
            <defs>
              <filter
                id="research-crt-channels"
                x="-2%"
                y="0%"
                width="104%"
                height="100%"
                colorInterpolationFilters="sRGB"
              >
                <feTurbulence
                  type="fractalNoise"
                  baseFrequency="0 .12"
                  numOctaves="1"
                  seed="7"
                  result="rows"
                />
                <feColorMatrix
                  in="rows"
                  type="matrix"
                  values="1 0 0 0 0  0 0 0 0 .5  0 0 0 0 0  0 0 0 1 0"
                  result="horizontal-noise"
                />
                <feDisplacementMap
                  in="SourceGraphic"
                  in2="horizontal-noise"
                  scale="9"
                  xChannelSelector="R"
                  yChannelSelector="G"
                  result="signal"
                />
                <feOffset in="signal" dx="1.25" result="red-shift" />
                <feColorMatrix
                  in="red-shift"
                  type="matrix"
                  values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0"
                  result="red"
                />
                <feOffset in="signal" dx="-1.25" result="cyan-shift" />
                <feColorMatrix
                  in="cyan-shift"
                  type="matrix"
                  values="0 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1 0"
                  result="cyan"
                />
                <feComposite in="red" in2="cyan" operator="arithmetic" k2="1" k3="1" />
              </filter>
            </defs>
          </svg>
        </>,
        document.body,
      )}
    </>
  );
}
