'use client';

import {
  createContext,
  type ReactNode,
  type RefObject,
  useCallback,
  useContext,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';

const OVERLAY = 'fixed inset-0 z-[200] bg-black/40 backdrop-blur-md';
const PANEL_SCALE =
  '[--u-anchor:var(--hpv2-u-anchor)] [--u:max(calc(100vw/2360),var(--u-anchor))] max-md:[--u:min(calc(100vw/500),calc(1.2*var(--u-anchor)))]';
const CRUMB =
  'popout-crumb font-[family-name:var(--font-mono)] text-xs leading-none uppercase [text-box-edge:cap_alphabetic] [text-box-trim:trim-both]';
const CLOSE =
  'popout-close shrink-0 cursor-pointer opacity-60 transition-opacity duration-150 ease-out hover:duration-0 hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-current disabled:pointer-events-none';
const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select, [tabindex]:not([tabindex="-1"])';

const ENTER_MS = 350;
const EXIT_MS = 180;
const EASE = 'cubic-bezier(0.23, 1, 0.32, 1)';

const reducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

const DialogIds = createContext({ title: '', description: '' });

type DialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Small label in the top bar, e.g. "Share". */
  banner: string;
  title: string;
  size?: 'md' | 'lg' | 'xl' | 'wide';
  className?: string;
  /** Element to focus when the dialog closes (normally the button that opened it). */
  returnFocusTo?: RefObject<HTMLElement | null>;
  children: ReactNode;
};

/**
 * A side panel that slides in from the right over a blurred page. While it is open the page behind
 * it is inert, Tab stays inside it, and Escape or a click outside closes it.
 */
export function Dialog({
  open,
  onOpenChange,
  banner,
  title,
  size = 'lg',
  className = '',
  returnFocusTo,
  children,
}: DialogProps) {
  const base = useId();
  const ids = { title: `${base}-title`, description: `${base}-description` };
  const [mounted, setMounted] = useState(false); // portals need the client
  const [present, setPresent] = useState(false); // in the DOM, including during the exit animation
  const overlay = useRef<HTMLDivElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const close = useCallback(() => onOpenChange(false), [onOpenChange]);

  useEffect(() => setMounted(true), []);
  useEffect(() => {
    if (open) setPresent(true);
  }, [open]);

  // Slide in / out.
  useLayoutEffect(() => {
    const o = overlay.current;
    const p = panel.current;
    if (!present || !o || !p) return;
    const still = reducedMotion();
    if (open) {
      o.animate({ opacity: [0, 1] }, { duration: 200 });
      p.animate(still ? { opacity: [0, 1] } : { transform: ['translateX(110%)', 'translateX(0)'] }, {
        duration: still ? 100 : ENTER_MS,
        easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
      });
      return;
    }
    const duration = still ? 100 : EXIT_MS;
    o.animate({ opacity: [1, 0] }, { duration, easing: EASE, fill: 'forwards' });
    const out = p.animate(
      still ? { opacity: [1, 0] } : { transform: ['translateX(0)', 'translateX(110%)'] },
      { duration, easing: EASE, fill: 'forwards' },
    );
    out.onfinish = () => setPresent(false);
    return () => out.cancel();
  }, [open, present]);

  // While open: the page is inert, focus moves in, Tab loops, Escape and outside clicks close.
  useEffect(() => {
    if (!open || !present) return;
    const dialog = panel.current;
    if (!dialog) return;
    const ownParts = [overlay.current, dialog];
    const page = [...document.body.children].filter((el) => !ownParts.includes(el as HTMLDivElement));
    page.forEach((el) => el.setAttribute('inert', ''));
    const html = document.documentElement;
    const overflow = html.style.overflow;
    html.style.overflow = 'hidden';
    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    (dialog.querySelector<HTMLElement>(FOCUSABLE) ?? dialog).focus({ preventScroll: true });

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        close();
        return;
      }
      if (e.key !== 'Tab') return;
      const items = [...dialog.querySelectorAll<HTMLElement>(FOCUSABLE)].filter(
        (el) => el.getClientRects().length,
      );
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && (document.activeElement === first || document.activeElement === dialog)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    const onPointerDown = (e: PointerEvent) => {
      if (e.target instanceof Node && !dialog.contains(e.target)) close();
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onPointerDown);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onPointerDown);
      page.forEach((el) => el.removeAttribute('inert'));
      html.style.overflow = overflow;
      (returnFocusTo?.current ?? opener)?.focus({ preventScroll: true });
    };
  }, [open, present, close, returnFocusTo]);

  if (!mounted || !present) return null;
  return createPortal(
    <>
      <div ref={overlay} className={OVERLAY} aria-hidden="true" data-state={open ? 'open' : 'closed'} />
      <div
        ref={panel}
        role="dialog"
        aria-labelledby={ids.title}
        aria-describedby={ids.description}
        tabIndex={-1}
        data-state={open ? 'open' : 'closed'}
        data-surface="white"
        data-size={size}
        data-lenis-prevent=""
        className={`${PANEL_SCALE} dialog-chrome-module__z6635G__formPanel ${className}`}
      >
        <div className="relative shrink-0">
          <div>
            <div className="relative z-10 flex shrink-0 items-center gap-1.5 px-7.5 pt-7.5 dialog-chrome-module__z6635G__formBanner">
              <span aria-hidden="true" className={CRUMB}>
                //
              </span>
              <span className={`${CRUMB} min-w-0 flex-1 truncate`}>{banner}</span>
              <button aria-label="Close" className={CLOSE} type="button" onClick={close}>
                <svg className="size-4" fill="none" viewBox="0 0 24 24">
                  <path
                    d="M6 6l12 12M18 6L6 18"
                    stroke="currentColor"
                    strokeLinecap="square"
                    strokeWidth="1.5"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
        <div className="popout-body dialog-chrome-module__z6635G__formBody">
          <div className="flex items-center gap-2">
            <h2 className="dialog-chrome-module__z6635G__formTitle" id={ids.title}>
              {title}
            </h2>
          </div>
          <DialogIds.Provider value={ids}>{children}</DialogIds.Provider>
        </div>
      </div>
    </>,
    document.body,
  );
}

/** Content column of a dialog. */
export function DialogBody({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`font-[family-name:var(--font-rules)] text-[length:var(--hpv2-type-body)] leading-[1.6] font-normal [font-stretch:100%] [font-variation-settings:&quot;wdth&quot;_100] tracking-normal normal-case text-inherit flex flex-col gap-4 ${className}`}
    >
      {children}
    </div>
  );
}

/** The line under the title; screen readers announce it with the dialog. */
export function DialogDescription({ children, className }: { children: ReactNode; className?: string }) {
  const { description } = useContext(DialogIds);
  return (
    <p id={description} className={className}>
      {children}
    </p>
  );
}
