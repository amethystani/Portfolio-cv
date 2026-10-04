'use client';

import { portfolio } from '@/content/portfolio';
import { type CSSProperties, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Kbd } from '@/components/ui/Kbd';
import { ANSWER_ART, answers, QUESTION_ORDER, QUESTION_PAGES, QUESTIONS_PER_PAGE } from '@/content/composer';
import { researchUi, useResearchUi } from '@/lib/research-ui';
import type { SearchResult } from '@/lib/search';
import { ArrowPixelIcon, ChevronPixelIcon } from './PromptIcons';

const TITLE = 'Ask : About Animesh';
const art = (name: string) => `/assets/nous-web/composer/composer-${name}.webp`;
const MARGIN = 16;

const isInternal = (href: string) => href.startsWith('/');
/** A link that stays in the app for our own pages and opens normally for everything else. */
function PromptLink({
  href,
  className,
  children,
  onClick,
  ...rest
}: React.ComponentProps<'a'> & { href: string }) {
  return isInternal(href) ? (
    <Link href={href} className={className} onClick={onClick} {...(rest as object)}>
      {children}
    </Link>
  ) : (
    <a href={href} className={className} onClick={onClick} {...rest}>
      {children}
    </a>
  );
}

// ------------------------------------------------------------------------------------------ questions
function QuestionsPanel({
  active,
  page,
  answerIndex,
  onPage,
  onAnswer,
}: {
  active: boolean;
  page: number;
  answerIndex: number | null;
  onPage: (p: number) => void;
  onAnswer: (i: number | null) => void;
}) {
  const section = useRef<HTMLElement>(null);
  const answerTitle = useRef<HTMLHeadingElement>(null);
  const current = answerIndex === null ? undefined : answers[answerIndex];

  // Warm the backdrops so switching pages does not flash.
  useEffect(() => {
    if (!active) return;
    for (const name of ['questions', 'questions-two', ...ANSWER_ART]) {
      const img = new Image();
      img.fetchPriority = 'low';
      img.src = art(name);
    }
  }, [active]);

  const openAnswer = (index: number | null) => {
    onAnswer(index);
    requestAnimationFrame(() =>
      (index === null
        ? section.current?.querySelector<HTMLElement>('.nw-prompt-question')
        : answerTitle.current
      )?.focus({ preventScroll: true }),
    );
  };
  const step = (delta: number) => {
    if (answerIndex !== null) openAnswer((answerIndex + delta + answers.length) % answers.length);
    else onPage((page + delta + QUESTION_PAGES) % QUESTION_PAGES);
  };
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
    const items = [...(section.current?.querySelectorAll<HTMLElement>('.nw-prompt-question') ?? [])];
    const index = items.indexOf(document.activeElement as HTMLElement);
    if (index < 0) return;
    e.preventDefault();
    const next = index + (e.key === 'ArrowDown' ? 1 : -1);
    if (next < 0)
      section.current
        ?.closest('[role="dialog"]')
        ?.querySelector<HTMLElement>('.nw-composer-dismiss')
        ?.focus();
    else items[Math.min(next, items.length - 1)]?.focus();
  };

  const backdrop =
    current && answerIndex !== null ? ANSWER_ART[answerIndex] : page ? 'questions-two' : 'questions';
  return (
    <section
      ref={section}
      onKeyDown={onKeyDown}
      className="nw-prompt-study"
      data-answer={current ? answerIndex : undefined}
      data-question-page={page}
    >
      <div className="nw-prompt-art" aria-hidden="true">
        <img alt="" src={art(backdrop)} />
      </div>
      {current ? (
        <div className="nw-prompt-eyebrow">
          <button
            type="button"
            className="nw-composer-hit"
            aria-label="Back to questions"
            onClick={() => openAnswer(null)}
          >
            <ArrowPixelIcon className="nw-prompt-icon" previous />
          </button>
          <span>:</span>
        </div>
      ) : (
        <div className="nw-prompt-eyebrow">
          <span>Popular</span>
          <span>:</span>
        </div>
      )}
      <div className="nw-prompt-layout">
        <PanelTitle>{current ? 'Answer' : 'Questions'}</PanelTitle>
        {current ? (
          <article className="nw-composer-answer">
            <PromptLink className="nw-composer-hit nw-answer-source" href={current.learn}>
              {current.learnSource ?? 'Source'}
            </PromptLink>
            <h3 ref={answerTitle} tabIndex={-1}>
              {current.question}
            </h3>
            <p>{current.answer}</p>
            <small>Curated response · not live AI</small>
          </article>
        ) : (
          <div className="nw-prompt-list">
            {QUESTION_ORDER.slice(
              QUESTIONS_PER_PAGE * page,
              QUESTIONS_PER_PAGE * page + QUESTIONS_PER_PAGE,
            ).map((index) => (
              <button
                key={index}
                type="button"
                className="nw-composer-hit nw-prompt-question"
                onClick={() => openAnswer(index)}
              >
                <span aria-hidden="true">:</span>
                <span>{answers[index].question}</span>
                <span aria-hidden="true">:</span>
                <ArrowPixelIcon className="nw-prompt-icon" />
              </button>
            ))}
          </div>
        )}
      </div>
      <footer className="nw-prompt-footer">
        {current && (
          <div className="nw-answer-actions">
            <Button size="m" variant="secondary" href={current.url}>
              {current.cta}
            </Button>
            <Button size="m" variant="hero-ghost" href={current.learn}>
              {current.learnLabel ?? 'Learn more'}
            </Button>
          </div>
        )}
        <div className="nw-prompt-controls">
          <span className="sr-only">
            {current && answerIndex !== null
              ? `${answerIndex + 1} / ${answers.length}`
              : `${page + 1} / ${QUESTION_PAGES}`}
          </span>
          <button
            type="button"
            className="nw-composer-hit"
            aria-label={`Previous ${current ? 'answer' : 'questions'}`}
            onClick={() => step(-1)}
          >
            <ChevronPixelIcon className="nw-prompt-icon" previous />
          </button>
          <button
            type="button"
            className="nw-composer-hit"
            aria-label={`Next ${current ? 'answer' : 'questions'}`}
            onClick={() => step(1)}
          >
            <ChevronPixelIcon className="nw-prompt-icon" />
          </button>
        </div>
      </footer>
    </section>
  );
}

function PanelTitle({ children }: { children: string }) {
  return (
    <h2
      className="font-[family-name:var(--font-rules-gothic-cmp)] font-medium text-inherit uppercase text-cap-trim cap-rules"
      style={
        {
          fontFamily: 'var(--font-rules-gothic-cmp)',
          '--nw-display-size': 'max(12px, calc(36 * var(--nw-u-text)))',
          fontSize: 'var(--nw-display-size)',
          lineHeight: '1',
        } as CSSProperties
      }
    >
      {children}
    </h2>
  );
}

// ------------------------------------------------------------------------------------------ search
type SearchState = { query: string; pending: boolean; results?: SearchResult[]; error?: string };

/** Debounced (400 ms) search with a small cache; talks to /api/search. */
function useSearch(query: string, enabled: boolean) {
  const [state, setState] = useState<SearchState>({ query: '', pending: false });
  const [retries, setRetries] = useState(0);
  const cache = useRef(new Map<string, SearchResult[]>());
  const trimmed = query.trim();

  useEffect(() => {
    if (!enabled || trimmed.length < 2) return;
    const cached = cache.current.get(trimmed);
    if (cached) {
      setState({ query: trimmed, pending: false, results: cached });
      return;
    }
    const abort = new AbortController();
    setState({ query: trimmed, pending: true });
    const timer = setTimeout(async () => {
      try {
        const response = await fetch('/api/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: trimmed }),
          signal: abort.signal,
        });
        if (!response.ok)
          throw new Error(
            response.status === 429
              ? 'Search is busy. Try again shortly.'
              : 'Search is unavailable. Try again.',
          );
        const { results } = (await response.json()) as { results: SearchResult[] };
        if (abort.signal.aborted) return;
        cache.current.set(trimmed, results);
        if (cache.current.size > 20) cache.current.delete(cache.current.keys().next().value!);
        setState({ query: trimmed, pending: false, results });
      } catch (error) {
        if (!abort.signal.aborted)
          setState({
            query: trimmed,
            pending: false,
            error: error instanceof Error ? error.message : 'Search is unavailable. Try again.',
          });
      }
    }, 400);
    return () => {
      clearTimeout(timer);
      abort.abort();
    };
  }, [trimmed, enabled, retries]);

  return {
    ...state,
    pending: enabled && trimmed.length >= 2 && (state.query !== trimmed || state.pending),
    retry: () => setRetries((n) => n + 1),
  };
}

const LOADING = ['Looking through the site…', 'Finding relevant pages…', 'Looking for a match…'];
function Searching() {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = setInterval(() => !document.hidden && setI((n) => (n + 1) % LOADING.length), 1800);
    return () => clearInterval(id);
  }, []);
  return (
    <span className="nw-search-loading" aria-label="Searching">
      <span className="nw-search-spinner" aria-hidden="true" />
      <span aria-hidden="true">{LOADING[i]}</span>
    </span>
  );
}

function SearchPanel({
  query,
  search,
  onNavigate,
}: {
  query: string;
  search: ReturnType<typeof useSearch>;
  onNavigate: () => void;
}) {
  const results = search.query === query.trim() ? search.results : undefined;
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
    const panel = e.currentTarget.closest('.nw-search-panel');
    if (!panel) return;
    const items = [...panel.querySelectorAll<HTMLElement>('[data-search-result]')];
    const index = items.indexOf(document.activeElement as HTMLElement);
    if (index < 0) return;
    e.preventDefault();
    const next = index + (e.key === 'ArrowDown' ? 1 : -1);
    if (next < 0) {
      e.currentTarget.closest('[role="dialog"]')?.querySelector('input')?.focus({ preventScroll: true });
      return;
    }
    const target = items[Math.min(next, items.length - 1)];
    target?.focus({ preventScroll: true });
    const scroller = e.currentTarget.closest('.nw-composer-results');
    if (target && scroller) {
      const t = target.getBoundingClientRect();
      const s = scroller.getBoundingClientRect();
      if (t.bottom > s.bottom) scroller.scrollTop += t.bottom - s.bottom;
      else if (t.top < s.top) scroller.scrollTop -= s.top - t.top;
    }
  };
  const showStatus = query.trim().length < 2 || search.pending || search.error || !results?.length;
  return (
    <section className="nw-search-panel" aria-label="Site search results" aria-busy={search.pending}>
      <div className="nw-prompt-layout">
        <div className="nw-search-sidebar">
          <PanelTitle>Sources</PanelTitle>
        </div>
        <div className="nw-search-list">
          {showStatus && (
            <div className="nw-search-status" role="status">
              {query.trim().length < 2 ? (
                'Type a little more to search.'
              ) : search.pending ? (
                <Searching />
              ) : search.error ? (
                <>
                  {search.error}{' '}
                  <button type="button" className="nw-composer-hit" onClick={search.retry}>
                    Retry
                  </button>
                </>
              ) : (
                'No matches. Try another search.'
              )}
            </div>
          )}
          {!search.pending &&
            !search.error &&
            results?.map((result) =>
              result.kind === 'career' && result.matches?.length ? (
                <section key={result.id} className="nw-search-group" aria-label={result.title}>
                  <PromptLink
                    href={result.url}
                    className="nw-composer-hit nw-search-result nw-search-group-heading"
                    data-search-result=""
                    onClick={onNavigate}
                    onKeyDown={onKeyDown}
                  >
                    <span className="nw-search-title">{result.title}</span>
                    <ArrowPixelIcon className="nw-prompt-icon" />
                  </PromptLink>
                  <ul className="nw-search-matches">
                    {result.matches.map((match) => (
                      <li key={match.id} className="nw-search-match">
                        <a
                          href={`mailto:${portfolio.email}?subject=${encodeURIComponent(match.title)}`}
                          className="nw-composer-hit nw-search-result nw-search-role"
                          data-search-result=""
                          aria-label={`Apply for ${match.title}`}
                          onClick={onNavigate}
                          onKeyDown={onKeyDown}
                        >
                          <span className="nw-search-match-title">{match.title}</span>
                          <ArrowPixelIcon className="nw-prompt-icon" />
                          <span className="nw-search-excerpt">{match.text}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </section>
              ) : (
                <PromptLink
                  key={result.id}
                  href={result.url}
                  className="nw-composer-hit nw-search-result"
                  data-search-result=""
                  onClick={onNavigate}
                  onKeyDown={onKeyDown}
                >
                  <span className="nw-search-title">{result.title}</span>
                  <ArrowPixelIcon className="nw-prompt-icon" />
                  {result.excerpt && <span className="nw-search-excerpt">{result.excerpt}</span>}
                </PromptLink>
              ),
            )}
        </div>
      </div>
    </section>
  );
}

// ------------------------------------------------------------------------------------------ the palette
/**
 * The ⌘K palette on the home page: a search field with suggested questions (curated answers) beneath it,
 * or live search results once you type. It opens over the "Ask : About Animesh" button, or near the top of
 * the window when that button is off screen.
 */
export function Composer() {
  const { composer } = useResearchUi();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(0);
  const [answerIndex, setAnswerIndex] = useState<number | null>(null);
  const [box, setBox] = useState<{
    left: number;
    top: number;
    width: number;
    maxHeight: number;
    mode: 'static' | 'docked';
  }>();
  const root = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const results = useRef<HTMLDivElement>(null);

  useEffect(() => setMounted(true), []);
  const available = mounted && pathname === '/';
  const open = composer.open && available;
  const search = useSearch(query, open);
  const dismiss = useCallback(() => researchUi.closeComposer(), []);

  // Sit exactly over the hero button, or float near the top when it has scrolled away.
  useLayoutEffect(() => {
    if (!open) return;
    const place = () => {
      const anchor = composer.trigger?.isConnected
        ? composer.trigger
        : document.querySelector<HTMLElement>('[data-composer-target]');
      const rect = anchor?.getBoundingClientRect();
      const visible = rect && rect.top >= 0 && rect.bottom <= innerHeight && rect.width > 0;
      const width = visible ? rect.width : Math.min(720, innerWidth - 2 * MARGIN);
      const left = visible ? rect.left : (innerWidth - width) / 2;
      const top = visible ? rect.top : 96;
      setBox({
        left,
        top,
        width,
        maxHeight: innerHeight - top - MARGIN,
        mode: visible ? 'static' : 'docked',
      });
    };
    place();
    addEventListener('resize', place);
    return () => removeEventListener('resize', place);
  }, [open, composer.trigger]);

  // Focus the field on open; Escape and outside clicks close; scrolling closes the in-place version.
  useLayoutEffect(() => {
    if (!open) return;
    const id = requestAnimationFrame(() => input.current?.focus({ preventScroll: true }));
    return () => cancelAnimationFrame(id);
  }, [open]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      e.preventDefault();
      dismiss();
      composer.trigger?.focus({ preventScroll: true });
    };
    const onPointerDown = (e: PointerEvent) => {
      const target = e.target;
      if (!(target instanceof Element)) return;
      if (root.current?.contains(target) || target.closest('.nw-composer-static')) return;
      dismiss();
    };
    const onScroll = () => box?.mode === 'static' && dismiss();
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onPointerDown);
    addEventListener('scroll', onScroll, { passive: true });
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onPointerDown);
      removeEventListener('scroll', onScroll);
    };
  }, [open, box?.mode, composer.trigger, dismiss]);
  useLayoutEffect(() => {
    if (results.current) results.current.scrollTop = 0;
  }, [page, answerIndex, query, search.results]);

  if (!available) return null;
  return createPortal(
    <div
      ref={root}
      role="dialog"
      id="research-composer"
      aria-labelledby="research-composer-title"
      className="nous-web nw-composer-singleton nw-questions-only"
      data-open={open}
      data-preset="Questions"
      data-surface="composer"
      data-motion={box?.mode ?? 'static'}
      data-direction="down"
      aria-hidden={!open}
      inert={!open}
      tabIndex={-1}
      data-lenis-prevent=""
      onWheel={(e) => e.stopPropagation()}
      style={
        {
          transformOrigin: '50% 0%',
          bottom: 'auto',
          ...(box
            ? {
                left: box.left,
                top: box.top,
                width: box.width,
                '--nw-composer-width': `${box.width}px`,
                maxHeight: box.maxHeight,
              }
            : {}),
        } as CSSProperties
      }
    >
      <h2 id="research-composer-title" className="sr-only">
        {TITLE}
      </h2>
      <div className="nw-composer-bar">
        <div
          className="field-visual-module__wzPR8a__shell flex w-full items-center bg-[var(--hermes-bg-ghost)] transition-shadow duration-150 hover:duration-0 shadow-hermes-outline-secondary hover:shadow-hermes-outline has-[:disabled]:hover:shadow-hermes-outline-secondary has-[:focus-visible]:shadow-hermes-outline has-[:focus-within]:shadow-hermes-outline has-[:disabled]:cursor-not-allowed h-[var(--hermes-field-h)] gap-1.5 px-3 cursor-text has-[:disabled]:opacity-50 nw-composer-search-field"
          data-surface="white"
        >
          <input
            ref={input}
            type="search"
            className="min-w-0 flex-1 self-center bg-transparent text-text-primary outline-none placeholder:text-current placeholder:opacity-40 disabled:cursor-not-allowed font-[family-name:var(--font-rules)] font-normal normal-case tracking-normal text-[length:var(--hpv2-type-14)]/[1.4] field-visual-module__wzPR8a__control nw-composer-search-input"
            aria-label="Search the site"
            placeholder="Search the site…"
            value={query}
            maxLength={512}
            autoComplete="off"
            enterKeyHint="search"
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.nativeEvent.isComposing || e.key !== 'ArrowDown') return;
              e.preventDefault();
              results.current
                ?.querySelector<HTMLElement>('[data-search-result], .nw-prompt-question')
                ?.focus({ preventScroll: true });
            }}
          />
        </div>
        <button
          type="button"
          className="nw-composer-hit nw-composer-dismiss"
          aria-label="Close composer"
          onClick={() => researchUi.closeComposer()}
        >
          <Kbd>esc</Kbd>
        </button>
      </div>
      <div ref={results} className="nw-composer-results" data-lenis-prevent="">
        {query.trim() ? (
          <SearchPanel query={query} search={search} onNavigate={dismiss} />
        ) : (
          <QuestionsPanel
            active={open}
            page={page}
            answerIndex={answerIndex}
            onPage={setPage}
            onAnswer={setAnswerIndex}
          />
        )}
      </div>
    </div>,
    document.body,
  );
}
