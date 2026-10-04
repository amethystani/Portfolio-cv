/**
 * "Is anyone here?" for decorative animation.
 *
 * Background effects (the footer shader, the orb) only need to run while someone is looking. This
 * reports `true` for ten seconds after any interaction and `false` once the page has been idle, the tab
 * is hidden, the window lost focus, the pointer left the window, or the visitor prefers reduced motion.
 * The first subscriber starts the watching; the last one to leave stops it.
 */

type Listener = (active: boolean) => void;

const IDLE_MS = 10_000;
const ACTIVITY = ['pointermove', 'pointerdown', 'click', 'keydown', 'wheel', 'touchmove', 'scroll', 'resize'];

const listeners = new Set<Listener>();
let active = false;
let stopWatching: (() => void) | undefined;

function setActive(next: boolean) {
  if (active === next) return;
  active = next;
  listeners.forEach((listener) => listener(active));
}

function watch(): () => void {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let idleTimer: ReturnType<typeof setTimeout> | undefined;
  let lastActivity = 0;
  let stopped = false;
  let pointerInWindow = true;
  let windowFocused = true;

  const sleep = () => {
    clearTimeout(idleTimer);
    idleTimer = undefined;
    setActive(false);
  };
  // Re-checks when the idle window is up, since activity keeps pushing it back.
  const checkIdle = () => {
    idleTimer = undefined;
    if (stopped) return;
    const remaining = IDLE_MS - (performance.now() - lastActivity);
    if (remaining > 0) idleTimer = setTimeout(checkIdle, remaining);
    else setActive(false);
  };
  const wake = (event?: Event) => {
    if (event?.type === 'keydown') pointerInWindow = true; // typing means they are here
    if (stopped || document.hidden || reduced.matches || !pointerInWindow || !windowFocused) return;
    lastActivity = performance.now();
    setActive(true);
    idleTimer ??= setTimeout(checkIdle, IDLE_MS);
  };

  const onVisibility = () => (document.hidden || reduced.matches ? sleep() : wake());
  const onPointerOut = (e: PointerEvent) => {
    if (e.relatedTarget !== null) return; // moved to another element, not out of the window
    pointerInWindow = false;
    sleep();
  };
  const onPointerOver = (e: PointerEvent) => {
    if (e.relatedTarget !== null) return;
    pointerInWindow = true;
    wake();
  };
  const onBlur = () => {
    windowFocused = false;
    sleep();
  };
  const onFocus = () => {
    windowFocused = true;
    wake();
  };

  for (const type of ACTIVITY) addEventListener(type, wake, { capture: true, passive: true });
  document.addEventListener('pointerout', onPointerOut, { passive: true });
  document.addEventListener('pointerover', onPointerOver, { passive: true });
  addEventListener('blur', onBlur);
  addEventListener('focus', onFocus);
  document.addEventListener('visibilitychange', onVisibility);
  reduced.addEventListener('change', onVisibility);
  onVisibility();

  return () => {
    stopped = true;
    clearTimeout(idleTimer);
    for (const type of ACTIVITY) removeEventListener(type, wake, true);
    document.removeEventListener('pointerout', onPointerOut);
    document.removeEventListener('pointerover', onPointerOver);
    removeEventListener('blur', onBlur);
    removeEventListener('focus', onFocus);
    document.removeEventListener('visibilitychange', onVisibility);
    reduced.removeEventListener('change', onVisibility);
  };
}

/** Calls `listener` now and whenever the page becomes active or idle. Returns an unsubscribe function. */
export function subscribeAmbientMotion(listener: Listener): () => void {
  if (!listeners.size) stopWatching = watch();
  listeners.add(listener);
  listener(active);
  return () => {
    listeners.delete(listener);
    if (!listeners.size) {
      stopWatching?.();
      stopWatching = undefined;
    }
  };
}
