'use client';

import { useMemo, useState } from 'react';

/**
 * "Unicode lens" for the WMT 2026 article. It models the one tokeniser step the article is about:
 * the SentencePiece `nmt_nfkc` normaliser shared by XLM-R and mT5. The mapping below is the set of
 * code points that were measured to be rewritten to an ASCII space (the other probed code points pass
 * through unchanged); after that, extra whitespace is collapsed and the ends are trimmed. It is a
 * model of that one step, not a tokeniser: the article's probe is the real check.
 */
const MAPPED_TO_SPACE = new Set([0x00a0, 0x202f, 0x3000, 0xfeff, 0x200b, 0x200c, 0x200d, 0x200e, 0x200f]);

type Corruption = { id: string; label: string; cp: string; apply: (s: string) => string };

const midWord = (s: string, ch: string) => {
  const m = /[A-Za-zÀ-ÿ]{4,}/.exec(s);
  if (!m) return s;
  const i = m.index + 2;
  return s.slice(0, i) + ch + s.slice(i);
};

const CLASSES: Corruption[] = [
  { id: 'nbsp', label: 'No-break space', cp: 'U+00A0', apply: (s) => s.replace(/ /g, ' ') },
  { id: 'nnbsp', label: 'Narrow no-break space', cp: 'U+202F', apply: (s) => s.replace(/ /g, ' ') },
  { id: 'idsp', label: 'Ideographic space', cp: 'U+3000', apply: (s) => s.replace(/ /g, '　') },
  { id: 'bom0', label: 'BOM at start', cp: 'U+FEFF', apply: (s) => '﻿' + s },
  { id: 'bom1', label: 'BOM inside a word', cp: 'U+FEFF', apply: (s) => midWord(s, '﻿') },
  { id: 'zwsp', label: 'Zero-width space', cp: 'U+200B', apply: (s) => midWord(s, '​') },
  { id: 'lrm', label: 'Left-to-right mark', cp: 'U+200E', apply: (s) => midWord(s, '‎') },
  { id: 'wj', label: 'Word joiner', cp: 'U+2060', apply: (s) => midWord(s, '⁠') },
  { id: 'shy', label: 'Soft hyphen', cp: 'U+00AD', apply: (s) => midWord(s, '­') },
  { id: 'cgj', label: 'Combining grapheme joiner', cp: 'U+034F', apply: (s) => midWord(s, '͏') },
  { id: 'homo', label: 'Cyrillic homoglyph', cp: 'U+043E', apply: (s) => s.replace('o', 'о') },
];

/** Same-looking text, with each invisible or look-alike character made visible as a small tag. */
function reveal(s: string): string {
  return Array.from(s)
    .map((c) => {
      const cp = c.codePointAt(0)!;
      const hidden =
        cp !== 0x20 && (/[\p{Cf}\p{Zs}\p{Cc}]/u.test(c) || cp === 0x34f || (cp >= 0x370 && cp <= 0x52f));
      return hidden ? `⟦${cp.toString(16).toUpperCase().padStart(4, '0')}⟧` : c;
    })
    .join('');
}

/** The measured `nmt_nfkc` behaviour for the probed code points, plus `remove_extra_whitespaces`. */
function normalise(s: string): string {
  const mapped = Array.from(s)
    .map((c) => (MAPPED_TO_SPACE.has(c.codePointAt(0)!) ? ' ' : c))
    .join('');
  return mapped.replace(/ +/g, ' ').trim();
}

const SAMPLE = 'Der Vertrag wird automatisch verlängert.';

export function UnicodeLens() {
  const [sentence, setSentence] = useState(SAMPLE);
  const [pick, setPick] = useState('nbsp');
  const cls = CLASSES.find((c) => c.id === pick) ?? CLASSES[0];

  const { corrupted, seen, clean, same, applicable } = useMemo(() => {
    const corruptedText = cls.apply(sentence);
    return {
      corrupted: corruptedText,
      seen: normalise(corruptedText),
      clean: normalise(sentence),
      same: normalise(corruptedText) === normalise(sentence),
      applicable: corruptedText !== sentence,
    };
  }, [cls, sentence]);

  return (
    <>
      <div className="w-head">
        <span>Unicode lens</span>
        <span>model of the XLM-R / mT5 normaliser</span>
      </div>
      <div className="w-body">
        <label>
          <span className="src-line">Clean sentence (type your own)</span>
          <input
            type="text"
            value={sentence}
            onChange={(e) => setSentence(e.target.value)}
            spellCheck={false}
            aria-label="Clean sentence"
          />
        </label>
        <div role="group" aria-label="Corruption class" style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {CLASSES.map((c) => (
            <button
              key={c.id}
              type="button"
              className="w-chip"
              aria-pressed={c.id === pick}
              onClick={() => setPick(c.id)}
            >
              {c.label}
            </button>
          ))}
        </div>
        <div className="w-row">
          <div>
            <span className="src-line">Corrupted string ({cls.cp}), invisible characters shown as tags</span>
            <p
              className="font-[family-name:var(--font-mono)]"
              style={{ margin: '6px 0 0', fontSize: 13, wordBreak: 'break-word' }}
            >
              {applicable
                ? reveal(corrupted)
                : 'this class does not apply to that sentence (needs a word of 4+ letters, or a letter “o”)'}
            </p>
          </div>
          <div>
            <span className="src-line">What the encoder receives after normalisation</span>
            <p
              className="font-[family-name:var(--font-mono)]"
              style={{ margin: '6px 0 0', fontSize: 13, wordBreak: 'break-word' }}
            >
              {applicable ? reveal(seen) : '—'}
            </p>
          </div>
        </div>
        <p
          role="status"
          className="font-[family-name:var(--font-mono)]"
          style={{
            margin: 0,
            padding: '10px 12px',
            border: '1px solid var(--dg-ink)',
            background: same && applicable ? 'var(--dg-ink)' : 'var(--dg-paper)',
            color: same && applicable ? 'var(--dg-paper)' : 'var(--dg-text)',
            fontSize: 13,
          }}
        >
          {!applicable
            ? 'Nothing to compare.'
            : same
              ? `Identical to the clean sentence (“${reveal(clean)}”): the metric cannot tell the pair apart.`
              : 'Different from the clean sentence: the encoder receives a different token sequence, so a metric can in principle react.'}
        </p>
        <p className="src-line">
          Rules modelled (measured on the real tokenisers): U+00A0, U+202F, U+3000, U+FEFF, U+200B, U+200C,
          U+200D, U+200E and U+200F become an ASCII space, then repeated spaces collapse and the ends are
          trimmed. U+2060, U+00AD, U+034F and U+043E pass through. Other code points are not modelled and are
          treated as pass-through.
        </p>
      </div>
    </>
  );
}
