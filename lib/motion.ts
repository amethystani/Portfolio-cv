/**
 * Small scroll-motion helpers shared by the page behaviours. Each returns a cleanup function.
 */

export const PHONE = '(max-width: 767px)';
const REDUCED = '(prefers-reduced-motion: reduce)';

export const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
export const prefersReducedMotion = () => matchMedia(REDUCED).matches;

/**
 * On phones there is no hover, so pictures that normally brighten under the pointer light up while they
 * cross the middle band of the screen instead. `mark` is called as elements enter and leave that band.
 */
export function observeColorBand(
  elements: Iterable<Element>,
  mark: (element: Element, active: boolean) => void,
): () => void {
  const list = [...elements];
  const phone = matchMedia(PHONE);
  let observer: IntersectionObserver | undefined;
  let height = innerHeight;

  const start = () => {
    observer?.disconnect();
    list.forEach((el) => mark(el, false));
    if (!phone.matches) return;
    height = innerHeight;
    observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => mark(e.target, e.isIntersecting)),
      {
        rootMargin: `-${height / 4}px 0px -${(3 * height) / 8}px 0px`,
        threshold: 0,
      },
    );
    list.forEach((el) => observer!.observe(el));
  };
  // Ignore small height changes (mobile URL bar showing/hiding).
  const onResize = () => Math.abs(innerHeight - height) >= height / 4 && start();

  start();
  phone.addEventListener('change', start);
  addEventListener('resize', onResize);
  return () => {
    observer?.disconnect();
    phone.removeEventListener('change', start);
    removeEventListener('resize', onResize);
    list.forEach((el) => mark(el, false));
  };
}

/**
 * Staggered fade-in as elements scroll into view. Adds `<prefix>-reveal` (the animation) and
 * `<prefix>-pending` (hidden) and drops `-pending` when the element appears. With `belowFoldOnly`, elements
 * already on screen at load are left alone.
 */
export function revealOnScroll(
  root: Element,
  selector: string,
  prefix: 'nw-release' | 'nw-blog',
  { belowFoldOnly = false } = {},
): () => void {
  const reduced = matchMedia(REDUCED);
  if (reduced.matches) return () => undefined;
  const pending = `${prefix}-pending`;
  const delayVar = `--${prefix}-delay`;
  const all = [...root.querySelectorAll<HTMLElement>(selector)];
  const targets = belowFoldOnly ? all.filter((el) => el.getBoundingClientRect().top >= innerHeight) : all;

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.remove(pending);
        observer.unobserve(entry.target);
      }
    },
    { threshold: 0.01, rootMargin: '0px 0px -24px 0px' },
  );
  for (const el of targets) {
    const index = [...(el.parentElement?.children ?? [])].indexOf(el);
    el.style.setProperty(delayVar, `${(index % 4) * 45}ms`);
    el.classList.add(`${prefix}-reveal`, pending);
    observer.observe(el);
  }

  // Keyboard focus on something still hidden reveals it straight away.
  const onFocusIn = (e: FocusEvent) => {
    if (!(e.target instanceof Element)) return;
    const hidden = e.target.closest(`.${pending}`);
    if (hidden) {
      hidden.classList.remove(pending);
      observer.unobserve(hidden);
    }
  };
  const onReducedChange = () => {
    if (!reduced.matches) return;
    targets.forEach((el) => el.classList.remove(pending));
    observer.disconnect();
  };
  root.addEventListener('focusin', onFocusIn as EventListener);
  reduced.addEventListener('change', onReducedChange);
  return () => {
    observer.disconnect();
    root.removeEventListener('focusin', onFocusIn as EventListener);
    reduced.removeEventListener('change', onReducedChange);
    for (const el of targets) {
      el.classList.remove(`${prefix}-reveal`, pending);
      el.style.removeProperty(delayVar);
    }
  };
}

/** Runs `update` at most once per animation frame while the page scrolls or resizes. */
export function onScrollFrame(update: () => void, extra: Array<() => void> = []): () => void {
  let frame = 0;
  const schedule = () => {
    if (!frame) frame = requestAnimationFrame(() => ((frame = 0), update()));
  };
  addEventListener('scroll', schedule, { passive: true, capture: true });
  addEventListener('resize', schedule);
  update();
  return () => {
    cancelAnimationFrame(frame);
    removeEventListener('scroll', schedule, true);
    removeEventListener('resize', schedule);
    extra.forEach((fn) => fn());
  };
}
