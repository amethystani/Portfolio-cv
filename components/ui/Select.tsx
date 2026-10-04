'use client';

import { type CSSProperties, type KeyboardEvent, useEffect, useId, useRef, useState } from 'react';
import { FIELD_TEXT } from './Field';

export type SelectOption = { value: string; label: string };

const TRIGGER =
  'field-visual-module__wzPR8a__shell flex w-full items-center bg-[var(--hermes-bg-ghost)] text-left transition-[background-color,box-shadow] duration-150 hover:duration-0 enabled:hover:shadow-hermes-outline enabled:focus-visible:outline-none enabled:focus-visible:shadow-hermes-outline enabled:active:bg-[var(--hermes-bg-secondary)] aria-expanded:bg-[color-mix(in_srgb,var(--hermes-bg-secondary)_55%,var(--hermes-bg))] rounded-t-md disabled:cursor-not-allowed cursor-pointer h-[var(--hermes-field-h)] gap-1.5 px-3';
const OPTION =
  'group flex w-full items-center gap-0 text-left text-[var(--hermes-dropdown-fg)] transition-colors duration-150 hover:duration-0 cursor-pointer hover:bg-[var(--hermes-dropdown-hover)] active:bg-[var(--hermes-dropdown-hover)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-midground/30 aria-disabled:cursor-not-allowed aria-disabled:opacity-50 overflow-x-hidden min-h-[var(--hermes-field-h)]';
const PANEL_SCALE =
  '[--u-anchor:var(--hpv2-u-anchor)] [--u:max(calc(100vw/2360),var(--u-anchor))] max-md:[--u:min(calc(100vw/500),calc(1.2*var(--u-anchor)))]';
const MENU_VARS = {
  '--hermes-dropdown-action-hover': 'var(--hermes-bg-primary-pressed)',
  '--hermes-dropdown-bg': 'var(--hermes-bg)',
  '--hermes-dropdown-fg': 'var(--hermes-fg)',
  '--hermes-dropdown-fg-muted': 'var(--hermes-fg-secondary)',
  '--hermes-dropdown-hover': 'color-mix(in srgb, var(--hermes-bg-pressed) 55%, var(--hermes-dropdown-bg))',
  '--hermes-dropdown-px': '10.65px',
} as CSSProperties;

const Glyph = ({ d, className }: { d: string; className: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    className={className}
  >
    <path d={d} />
  </svg>
);
const CHEVRON =
  'M13 16h-2v-2h2v2Zm-2-2H9v-2h2v2Zm4 0h-2v-2h2v2Zm-6-2H7v-2h2v2Zm8 0h-2v-2h2v2ZM7 10H5V8h2v2Zm12 0h-2V8h2v2Z';
const CHECK =
  'M10 18H8v-2h2v2Zm-2-2H6v-2h2v2Zm4-2v2h-2v-2h2Zm-6 0H4v-2h2v2Zm8 0h-2v-2h2v2Zm2-2h-2v-2h2v2Zm2-2h-2V8h2v2Zm2-2h-2V6h2v2Z';

type Props = {
  /** Id for the trigger, so a <Field> label can point at it. */
  id: string;
  label: string;
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
};

/**
 * A dropdown list. The menu opens directly below the button at its width; arrow keys move through
 * the options, Enter or Space picks one, and a click elsewhere closes it.
 */
export function Select({ id, label, value, options, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const [box, setBox] = useState<{ left: number; top: number; width: number; height: number }>();
  const trigger = useRef<HTMLButtonElement>(null);
  const list = useRef<HTMLDivElement>(null);
  const menuId = useId();
  const selected = options.find((o) => o.value === value) ?? options[0];

  const show = () => {
    const rect = trigger.current?.getBoundingClientRect();
    if (!rect) return;
    setBox({ left: rect.left, top: rect.bottom, width: rect.width, height: innerHeight - rect.bottom });
    setOpen(true);
  };
  const hide = (refocus = false) => {
    setOpen(false);
    if (refocus) trigger.current?.focus();
  };

  // Start on the chosen option once the menu exists.
  useEffect(() => {
    if (open)
      list.current?.querySelector<HTMLElement>('[aria-selected="true"]')?.focus({ preventScroll: true });
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!(e.target instanceof Node)) return;
      if (list.current?.contains(e.target) || trigger.current?.contains(e.target)) return;
      hide();
    };
    const onResize = () => hide();
    document.addEventListener('pointerdown', onDown);
    addEventListener('resize', onResize);
    return () => {
      document.removeEventListener('pointerdown', onDown);
      removeEventListener('resize', onResize);
    };
  }, [open]);

  const pick = (option: SelectOption) => {
    onChange(option.value);
    hide(true);
  };
  const onTriggerKey = (e: KeyboardEvent) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      show();
    }
  };
  const onOptionKey = (e: KeyboardEvent, index: number) => {
    const items = [...(list.current?.querySelectorAll<HTMLElement>('[role="option"]') ?? [])];
    const go = (i: number) => {
      e.preventDefault();
      items[(i + items.length) % items.length]?.focus({ preventScroll: true });
      items[(i + items.length) % items.length]?.scrollIntoView({ block: 'nearest' });
    };
    if (e.key === 'ArrowDown') go(index + 1);
    else if (e.key === 'ArrowUp') go(index - 1);
    else if (e.key === 'Home') go(0);
    else if (e.key === 'End') go(items.length - 1);
    else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      pick(options[index]);
    } else if (e.key === 'Tab') hide();
  };

  return (
    <div className="relative">
      <button
        ref={trigger}
        id={id}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={label}
        {...(open ? { 'aria-controls': menuId } : {})}
        data-surface="white"
        className={`${TRIGGER} ${open ? 'shadow-hermes-outline relative z-[2]' : 'shadow-hermes-outline-secondary'}`}
        onClick={() => (open ? hide() : show())}
        onKeyDown={onTriggerKey}
      >
        <span
          className={`min-w-0 flex-1 truncate ${FIELD_TEXT} field-visual-module__wzPR8a__control text-text-primary`}
        >
          {selected?.label}
        </span>
        <span className="inline-flex shrink-0 items-center justify-center text-text-primary">
          <Glyph
            d={CHEVRON}
            className={`block shrink-0 size-[var(--hpv2-field-glyph)] transition-transform${open ? ' rotate-180' : ''}`}
          />
        </span>
      </button>
      {open && box && (
        <div
          className={`fixed z-[250] ${PANEL_SCALE}`}
          style={
            {
              left: box.left,
              top: box.top,
              width: box.width,
              maxHeight: box.height,
              '--hermes-dropdown-available-height': `${box.height}px`,
            } as CSSProperties
          }
        >
          <div
            className="bg-[var(--hermes-dropdown-bg)] shadow-hermes-outline text-[var(--hermes-dropdown-fg)]"
            style={MENU_VARS}
          >
            <div
              ref={list}
              id={menuId}
              role="listbox"
              data-surface="dropdown"
              className="max-h-[min(calc(var(--spacing)*60),var(--hermes-dropdown-available-height,100vh))] overflow-auto overscroll-contain [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
            >
              {options.map((option, i) => (
                <div
                  key={option.value}
                  id={`${menuId}-option-${i}`}
                  role="option"
                  aria-selected={option.value === selected?.value}
                  tabIndex={-1}
                  className={OPTION}
                  onClick={() => pick(option)}
                  onKeyDown={(e) => onOptionKey(e, i)}
                >
                  <span className="flex min-w-0 flex-1 items-center px-[var(--hermes-dropdown-px,var(--space-m))] py-[var(--space-s)] gap-[var(--space-s)]">
                    <span
                      className={`min-w-0 flex-1 truncate text-left ${FIELD_TEXT} field-visual-module__wzPR8a__control`}
                    >
                      {option.label}
                    </span>
                  </span>
                  {option.value === selected?.value && (
                    <span className="inline-flex shrink-0 items-center justify-center pr-[var(--hermes-dropdown-px,var(--space-m))]">
                      <Glyph d={CHECK} className="block shrink-0 size-[var(--hpv2-field-glyph)]" />
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
