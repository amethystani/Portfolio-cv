'use client';

import {
  Children,
  type ReactNode,
  type Ref,
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react';
import { Button } from './Button';

type Props = {
  children: ReactNode;
  /** id of the list element (the button's aria-controls points at it). */
  id: string;
  /** How many items show at first, and how many each "Show more" adds. */
  pageSize: number;
  /** Noun for the screen-reader status, e.g. "releases". */
  itemLabel: string;
  listRef?: Ref<HTMLDivElement>;
  buttonClassName?: string;
  /** Wraps the button + status in a div with these props. */
  controlsProps?: { id?: string; className?: string; tabIndex?: number };
  /**
   * Only paginate while this media query matches (e.g. on phones); otherwise everything shows.
   * Items past the current page then get `overflowClassName` (CSS decides how to hide them).
   */
  paginationMedia?: { query: string; overflowClassName: string };
};

/**
 * A list that shows `pageSize` items and a "Show more (n)" button for the rest.
 * The server renders the paginated state; with `paginationMedia` the client then expands the list
 * on screens where pagination is switched off.
 */
export function ListDisclosure({
  children,
  id,
  pageSize,
  itemLabel,
  listRef,
  buttonClassName = 'nw-catalogue-more',
  controlsProps,
  paginationMedia,
}: Props) {
  const items = Children.toArray(children);
  const [limit, setLimit] = useState(pageSize);
  const ownRef = useRef<HTMLDivElement>(null);
  const list = (listRef as React.RefObject<HTMLDivElement | null> | undefined) ?? ownRef;
  const focusIndex = useRef<number | null>(null);
  const query = paginationMedia?.query;

  const subscribe = useCallback(
    (onChange: () => void) => {
      if (!query) return () => {};
      const mq = matchMedia(query);
      mq.addEventListener('change', onChange);
      return () => mq.removeEventListener('change', onChange);
    },
    [query],
  );
  const getSnapshot = useCallback(() => !query || matchMedia(query).matches, [query]);
  const paginated = useSyncExternalStore(subscribe, getSnapshot, () => true);

  const visible = paginated ? Math.min(limit, items.length) : items.length;
  const remaining = items.length - visible;

  // After "Show more", move focus to the first newly revealed item.
  useEffect(() => {
    if (focusIndex.current === null) return;
    const el = list.current?.children[focusIndex.current];
    if (el instanceof HTMLElement)
      (el.querySelector<HTMLElement>('a[href], button:not([disabled]), [tabindex="0"]') ?? el).focus();
    focusIndex.current = null;
  }, [limit, list]);

  const controls = (
    <>
      {remaining > 0 && (
        <Button
          type="button"
          variant="editorial-disclosure"
          size="m"
          className={buttonClassName}
          aria-controls={id}
          onClick={() => {
            focusIndex.current = visible;
            setLimit((n) => n + pageSize);
          }}
        >
          Show more ({remaining})
        </Button>
      )}
      <span className="sr-only" role="status" aria-atomic="true">
        Showing {visible} of {items.length} {itemLabel}
      </span>
    </>
  );

  return (
    <>
      <div id={id} ref={list}>
        {items.map((child, i) => (
          <div
            key={i}
            tabIndex={-1}
            hidden={!paginationMedia && i >= visible}
            className={paginationMedia && i >= limit ? paginationMedia.overflowClassName : undefined}
          >
            {child}
          </div>
        ))}
      </div>
      {controlsProps ? <div {...controlsProps}>{controls}</div> : controls}
    </>
  );
}
