'use client';

import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { Button } from '@/components/ui/Button';
import type { Constellation } from '@/lib/constellation';
import { neuronStats, type NeuronRecord } from '@/lib/neurons';

type Subset = 'positive' | 'all' | 'negative';
type Status = 'waiting' | 'loading' | 'ready' | 'failed';

/** The standalone, full-page version of this visualization. */
const SOURCE = '/neuron-steering/constellation.html';

const FALLBACK: Record<Exclude<Status, 'ready'>, string> = {
  waiting: 'The neuron constellation loads as you scroll into view.',
  loading: 'Loading neuron constellation…',
  failed: 'The interactive constellation is unavailable in this browser.',
};

/**
 * The interactive neuron scatter in the "Neuron steering" article: stats, a subset filter, zoom
 * buttons, the 3D scene, and a picker that describes one neuron. The scene (and three.js) loads only
 * when the widget is within 250px of the viewport.
 */
export function ArticleConstellation() {
  const root = useRef<HTMLDivElement>(null);
  const scene = useRef<HTMLDivElement>(null);
  const plot = useRef<Constellation | null>(null);
  const [records, setRecords] = useState<NeuronRecord[]>([]);
  const [subset, setSubset] = useState<Subset>('positive');
  const [picked, setPicked] = useState<number | null>(null);
  const [status, setStatus] = useState<Status>('waiting');
  const helpId = useId();

  const visible = useMemo(
    () => records.filter((r) => subset === 'all' || (subset === 'positive' ? r.delta > 0 : r.delta < 0)),
    [records, subset],
  );
  const inspected = visible.find((r) => r.rank === picked) ?? visible[0];
  const ready = status === 'ready';

  // Load the scene when the widget approaches the screen.
  useEffect(() => {
    const el = root.current;
    const host = scene.current;
    if (!el || !host) return;
    let disposed = false;
    let started = false;
    let mounted: Constellation | undefined;

    const start = async () => {
      if (started) return;
      started = true;
      setStatus('loading');
      try {
        const { mountConstellation } = await import('@/lib/constellation');
        if (disposed) return;
        mounted = mountConstellation(host, setPicked, () => {
          plot.current = null;
          if (!disposed) setStatus('failed');
        });
        plot.current = mounted;
        setRecords(mounted.records);
        setStatus('ready');
      } catch {
        if (!disposed) setStatus('failed');
      }
    };
    const proximity =
      typeof IntersectionObserver === 'undefined'
        ? undefined
        : new IntersectionObserver(
            (entries) => {
              if (entries.some((e) => e.isIntersecting)) {
                proximity?.disconnect();
                start();
              }
            },
            { rootMargin: '250px' },
          );
    if (proximity) proximity.observe(el);
    else start();
    return () => {
      disposed = true;
      proximity?.disconnect();
      mounted?.dispose();
      if (plot.current === mounted) plot.current = null;
    };
  }, []);

  // Keep the plot in step with the filter.
  useEffect(() => {
    plot.current?.show(visible);
  }, [visible]);

  const stats = neuronStats;
  return (
    <div ref={root} className="nw-constellation" role="group" aria-label="Neuron constellation">
      <div className="nw-neuron-stats">
        <div>
          <strong>{stats.total}</strong>
          <span>Sample neurons</span>
        </div>
        <div>
          <strong>{stats.distinctLayers}</strong>
          <span>Sample layers</span>
        </div>
        <div>
          <strong>
            {stats.firstLayer}–{stats.lastLayer}
          </strong>
          <span>Sample range</span>
        </div>
        <div>
          <strong>{stats.percentOfMlp.toFixed(3)}%</strong>
          <span>Sample / model MLP</span>
        </div>
      </div>
      <div className="nw-neuron-tools">
        <label>
          View
          <select
            aria-label="Neuron subset"
            value={subset}
            disabled={!ready}
            onChange={(e) => {
              setSubset(e.target.value as Subset);
              setPicked(null);
            }}
          >
            <option value="positive">Positive delta</option>
            <option value="all">All neurons</option>
            <option value="negative">Negative delta</option>
          </select>
        </label>
        <span className="nw-neuron-count" aria-live="polite">
          {ready ? `${visible.length} shown` : ''}
        </span>
        <div>
          <Button
            variant="ghost"
            size="s"
            disabled={!ready}
            aria-label="Zoom in"
            title="Zoom in"
            onClick={() => plot.current?.zoom(0.85)}
          >
            +
          </Button>
          <Button
            variant="ghost"
            size="s"
            disabled={!ready}
            aria-label="Zoom out"
            title="Zoom out"
            onClick={() => plot.current?.zoom(1.15)}
          >
            −
          </Button>
          <Button variant="ghost" size="s" disabled={!ready} onClick={() => plot.current?.reset()}>
            Reset view
          </Button>
        </div>
      </div>
      <div className="nw-neuron-viewport">
        <div
          ref={scene}
          className="nw-neuron-scene"
          tabIndex={ready ? 0 : -1}
          role="application"
          aria-label="Interactive neuron constellation"
          aria-describedby={helpId}
          aria-busy={status === 'loading'}
        />
        {!ready && (
          <div className="nw-neuron-fallback" role="status">
            <span>{FALLBACK[status]}</span>
            <a href={SOURCE} target="_blank" rel="noopener noreferrer">
              Open source visualization
            </a>
          </div>
        )}
      </div>
      <p id={helpId} className="nw-neuron-help">
        Drag to orbit. Arrow keys rotate; + / − zoom; Home resets. Hover a neuron or choose one below to
        inspect.
      </p>
      <div className="nw-neuron-details">
        <label>
          Inspect
          <select
            aria-label="Inspect neuron"
            value={inspected?.rank ?? ''}
            disabled={!ready}
            onChange={(e) => setPicked(Number(e.target.value))}
          >
            {!visible.length && <option value="">Loading neurons</option>}
            {visible.map((r) => (
              <option key={r.rank} value={r.rank}>
                L{r.layer} / N{r.neuron}
              </option>
            ))}
          </select>
        </label>
        <output aria-live="polite" aria-atomic="true">
          {inspected &&
            `Layer ${inspected.layer} · Neuron ${inspected.neuron} · Rank ${inspected.rank} · Delta ${inspected.delta.toFixed(4)}`}
        </output>
      </div>
      <div className="nw-neuron-source">
        <span>
          Statistics describe the plotted sample: {stats.total} records, against 32 × 14,336 model neurons.
          They are not the article’s reported analysis statistics.
        </span>
        <a href={SOURCE} target="_blank" rel="noopener noreferrer">
          Source visualization
        </a>
      </div>
    </div>
  );
}
