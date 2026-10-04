'use client';

import { useEffect, useState } from 'react';
import { hermesFeatures } from '@/content/home';
import { portfolio } from '@/content/portfolio';

const TYPE_MS = 34; // per character of the command
const HOLD_MS = 2600; // how long a finished project stays up

/**
 * The overlay on the video band: a terminal that types `git clone` for each project in turn and prints what
 * it is, over the red-tinted footage. The projects come from content/home.ts (hermesFeatures), the same ones
 * as the cards above. Reduced motion shows the first project, fully typed, without cycling.
 */
export function WorkTerminal() {
  const [index, setIndex] = useState(0);
  const [typed, setTyped] = useState(Number.POSITIVE_INFINITY); // fully typed in the static HTML
  const project = hermesFeatures[index];
  const command = `git clone github.com/${project.repo}`;
  const done = typed >= command.length;

  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    setTyped(0);
  }, []);

  useEffect(() => {
    if (!Number.isFinite(typed)) return;
    const timer = done
      ? setTimeout(() => {
          setIndex((i) => (i + 1) % hermesFeatures.length);
          setTyped(0);
        }, HOLD_MS)
      : setTimeout(() => setTyped((n) => n + 1), TYPE_MS + (Math.random() * TYPE_MS) / 2);
    return () => clearTimeout(timer);
  }, [typed, done]);

  return (
    <div className="nw-term" aria-hidden="true">
      <div className="nw-term-bar">
        <span className="nw-term-rec" />
        <span>{portfolio.links.github.replace('https://github.com/', '')}@research:~</span>
        <span className="nw-term-count">
          {String(index + 1).padStart(2, '0')} / {String(hermesFeatures.length).padStart(2, '0')}
        </span>
      </div>
      <div className="nw-term-body">
        <p className="nw-term-line">
          <span className="nw-term-prompt">$</span> {command.slice(0, Number.isFinite(typed) ? typed : undefined)}
          {!done && <span className="nw-term-caret" />}
        </p>
        <p className={`nw-term-out${done ? ' is-shown' : ''}`}>
          <span className="nw-term-tag">{project.eyebrow.desktop}</span>
          <span className="nw-term-title">{project.title}</span>
          <span className="nw-term-blurb">{project.blurb}</span>
        </p>
      </div>
    </div>
  );
}
