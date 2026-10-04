'use client';

import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { PixelSearch } from '@/components/icons';
import { ListDisclosure } from '@/components/ui/ListDisclosure';
import '@/styles/pixel-ui.css';

export type FilterItem = {
  key: string;
  /** The row to show (rendered on the server). */
  node: ReactNode;
  /** Which filter chip it belongs to (publication type, kind of role, ...). */
  group: string;
  title: string;
  /** Everything the text box searches: title, description, place, and so on. */
  text: string;
  /** Larger = newer. */
  order: number;
};

type Sort = 'new' | 'old' | 'az';
const SORTS: { value: Sort; label: string }[] = [
  { value: 'new', label: 'Newest first' },
  { value: 'old', label: 'Oldest first' },
  { value: 'az', label: 'A to Z' },
];

type ListProps = Omit<React.ComponentProps<typeof ListDisclosure>, 'children'>;

/**
 * A filter bar (text box, chips, sort) above a paginated list. Filters live in the address bar
 * (?q=...&g=...&s=...) so a filtered view can be linked to, and "/" jumps to the text box.
 */
export function FilteredList({
  items,
  noun,
  groupLabel,
  listProps,
  id,
}: {
  items: FilterItem[];
  /** Plural noun for counts and placeholders: "publications", "roles", "posts". */
  noun: string;
  /** Name of the chip row: "Type", "Kind". */
  groupLabel: string;
  listProps: ListProps;
  /** id of the filter bar (the section's icon links to it). */
  id: string;
}) {
  const [q, setQ] = useState('');
  const [groups, setGroups] = useState<string[]>([]);
  const [sort, setSort] = useState<Sort>('new');
  const ready = useRef(false);
  const input = useRef<HTMLInputElement>(null);

  // Read the filters from the address once, after hydration.
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setQ(params.get('q') ?? '');
    setGroups((params.get('g') ?? '').split(',').filter(Boolean));
    const s = params.get('s');
    if (s === 'old' || s === 'az') setSort(s);
    ready.current = true;
  }, []);

  // Keep the address in step (without adding history entries).
  useEffect(() => {
    if (!ready.current) return;
    const params = new URLSearchParams();
    if (q) params.set('q', q);
    if (groups.length) params.set('g', groups.join(','));
    if (sort !== 'new') params.set('s', sort);
    const qs = params.toString();
    history.replaceState(history.state, '', `${location.pathname}${qs ? `?${qs}` : ''}${location.hash}`);
  }, [q, groups, sort]);

  // "/" focuses the text box (unless you are already typing somewhere).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== '/' || e.metaKey || e.ctrlKey || e.altKey) return;
      const t = e.target as HTMLElement | null;
      if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
      e.preventDefault();
      input.current?.focus();
      input.current?.scrollIntoView({ block: 'center', behavior: 'smooth' });
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  const words = useMemo(() => q.toLowerCase().split(/\s+/).filter(Boolean), [q]);
  const matchesText = useCallback(
    (item: FilterItem) =>
      words.every((w) => `${item.title} ${item.text} ${item.group}`.toLowerCase().includes(w)),
    [words],
  );

  // Chips and their counts follow the text box, so a count is what you would get by choosing that chip.
  const groupNames = useMemo(() => [...new Set(items.map((i) => i.group))], [items]);
  const searched = useMemo(() => items.filter(matchesText), [items, matchesText]);
  const counts = useMemo(
    () => Object.fromEntries(groupNames.map((g) => [g, searched.filter((i) => i.group === g).length])),
    [groupNames, searched],
  );

  const shown = useMemo(() => {
    const list = groups.length ? searched.filter((i) => groups.includes(i.group)) : searched;
    return [...list].sort((a, b) =>
      sort === 'az' ? a.title.localeCompare(b.title) : sort === 'old' ? a.order - b.order : b.order - a.order,
    );
  }, [searched, groups, sort]);

  const active = Boolean(q || groups.length || sort !== 'new');
  const reset = () => {
    setQ('');
    setGroups([]);
    setSort('new');
  };
  const toggle = (g: string) =>
    setGroups((cur) => (cur.includes(g) ? cur.filter((x) => x !== g) : [...cur, g]));

  return (
    <>
      <div className="fl" id={id} role="search" aria-label={`Filter ${noun}`}>
        <label className="fl-search px-box">
          <PixelSearch />
          <input
            ref={input}
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => e.key === 'Escape' && q && (e.preventDefault(), setQ(''))}
            placeholder={`Filter ${noun}...`}
            aria-label={`Filter ${noun}`}
            autoComplete="off"
            spellCheck={false}
          />
          {q ? (
            <button
              type="button"
              className="fl-clear px-box"
              onClick={() => (setQ(''), input.current?.focus())}
              aria-label="Clear the text box"
            >
              ×
            </button>
          ) : (
            <span className="fl-key" aria-hidden="true">
              /
            </span>
          )}
        </label>
        <div className="fl-chips" role="group" aria-label={groupLabel}>
          <button
            type="button"
            className="fl-chip px-box"
            aria-pressed={groups.length === 0}
            onClick={() => setGroups([])}
          >
            All <small>{searched.length}</small>
          </button>
          {groupNames.map((g) => (
            <button
              key={g}
              type="button"
              className="fl-chip px-box"
              aria-pressed={groups.includes(g)}
              onClick={() => toggle(g)}
              disabled={counts[g] === 0 && !groups.includes(g)}
              style={counts[g] === 0 && !groups.includes(g) ? { opacity: 0.4 } : undefined}
            >
              {g} <small>{counts[g]}</small>
            </button>
          ))}
        </div>
        <div className="fl-meta">
          <span className="fl-count" role="status" aria-live="polite">
            {shown.length} of {items.length} {noun}
          </span>
          <div className="fl-tools">
            <label>
              Sort
              <select
                className="fl-select px-box"
                value={sort}
                onChange={(e) => setSort(e.target.value as Sort)}
              >
                {SORTS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </label>
            {active && (
              <button type="button" className="fl-reset px-box" onClick={reset}>
                Reset
              </button>
            )}
          </div>
        </div>
      </div>
      {shown.length ? (
        <ListDisclosure key={`${q}|${groups.join(',')}|${sort}`} {...listProps}>
          {shown.map((i) => (
            <div key={i.key} style={{ display: 'contents' }}>
              {i.node}
            </div>
          ))}
        </ListDisclosure>
      ) : (
        <div className="fl-empty">
          <p>
            No {noun} match{q ? ` "${q}"` : ' those filters'}.
          </p>
          <button type="button" className="px-box" onClick={reset}>
            Clear filters
          </button>
        </div>
      )}
    </>
  );
}
