import type { ReactNode } from 'react';

export const FIELD_TEXT =
  'font-[family-name:var(--font-rules)] font-normal normal-case tracking-normal text-[length:var(--hpv2-type-14)]/[1.4]';
/** Visible frame of a text field; the ring follows hover and focus. */
export const FIELD_SHELL =
  'field-visual-module__wzPR8a__shell flex w-full items-center bg-[var(--hermes-bg-ghost)] transition-shadow duration-150 hover:duration-0 shadow-hermes-outline-secondary hover:shadow-hermes-outline has-[:disabled]:hover:shadow-hermes-outline-secondary has-[:focus-visible]:shadow-hermes-outline has-[:focus-within]:shadow-hermes-outline has-[:disabled]:cursor-not-allowed h-[var(--hermes-field-h)] gap-1.5 px-3 cursor-text';
export const FIELD_INPUT = `min-w-0 flex-1 self-center bg-transparent text-text-primary outline-none placeholder:text-current placeholder:opacity-40 disabled:cursor-not-allowed ${FIELD_TEXT} field-visual-module__wzPR8a__control`;

/** A label above a control. */
export function Field({ label, htmlFor, children }: { label: string; htmlFor: string; children: ReactNode }) {
  return (
    <div
      data-field-group=""
      className="grid min-w-0 gap-1.5 has-[:disabled]:opacity-50 grid-rows-[auto_auto_auto]"
    >
      <label
        data-field-label=""
        className={`${FIELD_TEXT} field-visual-module__wzPR8a__caption text-[var(--hpv2-ink,var(--text-primary))] cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70 has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-70`}
        htmlFor={htmlFor}
      >
        {label}
      </label>
      {children}
      <span />
    </div>
  );
}
