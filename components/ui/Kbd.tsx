import type { ReactNode } from 'react';

/** A keyboard key cap ("esc", "K"). `compact` is the square variant used for single symbols. */
export function Kbd({ children, compact = false }: { children: ReactNode; compact?: boolean }) {
  return (
    <kbd className="hermes-kbd" data-slot="kbd" data-size="sm" data-variant="ghost" data-compact={compact}>
      <span className="hermes-kbd-label">{children}</span>
    </kbd>
  );
}
