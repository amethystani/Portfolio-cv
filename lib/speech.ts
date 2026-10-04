'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Read-aloud for an article using the browser's on-device voices (no network, no audio files).
 *
 * The article text is cut into sentence-sized passages and spoken one after another. A watchdog
 * notices a voice that never starts, and changing voice or speed restarts the current passage.
 */

export type SpeechState = 'idle' | 'starting' | 'playing' | 'paused' | 'finished' | 'error';

const MAX_PASSAGE = 240;
const SKIPPED =
  'pre, code, table, svg, img, canvas, video, audio, iframe, script, style, button, input, select, label, nav, sup, [role="group"], [hidden], [aria-hidden="true"]:not([data-aria-hidden]), [data-speech-skip]';
const BLOCKS = 'p, h1, h2, h3, h4, h5, h6, li, blockquote, figcaption, br';

/** Prefer English, then good-sounding named voices. */
function voiceScore(voice: SpeechSynthesisVoice) {
  return (
    (/^en(?:-|_)/i.test(voice.lang) ? 100 : 0) +
    (/natural|premium|enhanced|neural/i.test(voice.name) ? 20 : 0) +
    (/^(Samantha|Alex|Daniel|Karen|Moira|Tessa|Ava|Allison|Zoe)(\s|$)/i.test(voice.name) ? 10 : 0) +
    (voice.default ? 5 : 0)
  );
}

/** The article's text, as passages: title first, then each block, split into sentences and long runs. */
function passagesFrom(prose: HTMLElement, title: string): string[] {
  const copy = prose.cloneNode(true) as HTMLElement;
  copy.querySelectorAll(SKIPPED).forEach((el) => el.remove());
  // Line breaks inside a paragraph are just spaces; only the block markers below separate passages.
  const walker = document.createTreeWalker(copy, NodeFilter.SHOW_TEXT);
  for (let node = walker.nextNode(); node; node = walker.nextNode())
    node.nodeValue = (node.nodeValue ?? '').replace(/\s+/g, ' ');
  copy.querySelectorAll(BLOCKS).forEach((el) => {
    el.before('\n');
    el.after('\n');
  });
  const lines = [title, ...(copy.textContent ?? '').split('\n')]
    .map((l) => l.replace(/\s+/g, ' ').trim())
    .filter(Boolean);
  const segmenter =
    typeof Intl.Segmenter === 'function' ? new Intl.Segmenter('en', { granularity: 'sentence' }) : null;
  return lines.flatMap((line) => {
    const sentences = segmenter
      ? Array.from(segmenter.segment(line), (s) => s.segment.trim())
      : (line.match(/[^.!?]+(?:[.!?]+["')\]]*|$)/g) ?? [line]);
    return sentences.flatMap((sentence) => {
      const out: string[] = [];
      let current = '';
      for (const word of sentence.split(/\s+/)) {
        if (current && current.length + 1 + word.length > MAX_PASSAGE) {
          out.push(current);
          current = '';
        }
        if (word.length > MAX_PASSAGE) {
          if (current) out.push(current);
          current = '';
          out.push(...(word.match(new RegExp(`.{1,${MAX_PASSAGE}}`, 'g')) ?? []));
        } else current = current ? `${current} ${word}` : word;
      }
      if (current) out.push(current);
      return out;
    });
  });
}

type Engine = {
  generation: number; // bumped to invalidate callbacks from an utterance we've abandoned
  passages: string[];
  index: number;
  state: SpeechState;
  utterance: SpeechSynthesisUtterance | null;
  timer: ReturnType<typeof setTimeout> | null;
  watchdog: ReturnType<typeof setTimeout> | null;
};

export function useSpeech(title: string, articleKey: string) {
  const [supported, setSupported] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [voiceURI, setVoiceURI] = useState('');
  const [rate, setRateState] = useState(0.95);
  const [state, setStateValue] = useState<SpeechState>('idle');
  const [error, setError] = useState('');
  const [position, setPosition] = useState({ index: 0, total: 0, text: '' });
  const choice = useRef<{ voice: SpeechSynthesisVoice | null; rate: number }>({ voice: null, rate: 0.95 });
  const engine = useRef<Engine>({
    generation: 0,
    passages: [],
    index: 0,
    state: 'idle',
    utterance: null,
    timer: null,
    watchdog: null,
  });

  const setState = useCallback((next: SpeechState) => {
    engine.current.state = next;
    setStateValue(next);
  }, []);

  /** Stop speaking and forget the current utterance (its callbacks no longer count). */
  const halt = useCallback(() => {
    const e = engine.current;
    e.generation++;
    if (e.timer) clearTimeout(e.timer);
    if (e.watchdog) clearTimeout(e.watchdog);
    e.timer = e.watchdog = null;
    const u = e.utterance;
    e.utterance = null;
    if (u) {
      u.onstart = u.onend = u.onerror = u.onpause = u.onresume = null;
      speechSynthesis.cancel();
    }
  }, []);

  const stop = useCallback(() => {
    halt();
    engine.current.index = 0;
    setState('idle');
    setError('');
    setPosition({ index: 0, total: 0, text: '' });
  }, [halt, setState]);

  const fail = useCallback(
    (message: string) => {
      halt();
      setError(message);
      setState('error');
    },
    [halt, setState],
  );

  const speak = useCallback(
    (index: number) => {
      const e = engine.current;
      const generation = e.generation;
      const text = e.passages[index];
      const voice = choice.current.voice;
      if (!text) return setState('finished');
      if (!voice) return fail('No on-device voice is available in this browser.');

      const utterance = new SpeechSynthesisUtterance(text);
      e.index = index;
      e.utterance = utterance;
      utterance.voice = voice;
      utterance.lang = voice.lang;
      utterance.rate = choice.current.rate;
      const current = () => generation === e.generation && e.utterance === utterance;
      const watch = (ms: number, message: string) => {
        if (e.watchdog) clearTimeout(e.watchdog);
        e.watchdog = setTimeout(() => current() && fail(message), ms);
      };
      const started = () => {
        if (!current()) return;
        if (e.state === 'paused') return void speechSynthesis.pause();
        setState('playing');
        watch(60000, 'The browser voice did not respond. Try another device voice or browser.');
      };
      utterance.onstart = started;
      utterance.onresume = started;
      utterance.onpause = () => {
        if (!current()) return;
        if (e.watchdog) clearTimeout(e.watchdog);
        setState('paused');
      };
      utterance.onend = () => {
        if (!current()) return;
        if (e.watchdog) clearTimeout(e.watchdog);
        e.utterance = null;
        e.index = index + 1;
        if (e.state === 'paused') return;
        if (e.index === e.passages.length) return setState('finished');
        e.timer = setTimeout(() => generation === e.generation && speak(index + 1), 0);
      };
      utterance.onerror = (event) => {
        if (!current()) return;
        fail(
          event.error === 'not-allowed'
            ? 'Your browser blocked playback. Press Play to try again.'
            : 'This browser voice could not read the article. Try another device voice.',
        );
      };
      setPosition({ index, total: e.passages.length, text });
      setState('starting');
      watch(8000, 'The browser voice did not respond. Try another device voice or browser.');
      try {
        if (speechSynthesis.paused) speechSynthesis.resume();
        speechSynthesis.speak(utterance);
      } catch {
        fail('This browser could not start its speech engine. Try another browser.');
      }
    },
    [fail, setState],
  );

  /** Apply a new voice or speed; if it is speaking, carry on from the same passage. */
  const choose = useCallback(
    (voice: SpeechSynthesisVoice | null, nextRate: number) => {
      choice.current = { voice, rate: nextRate };
      setVoiceURI(voice?.voiceURI ?? '');
      setRateState(nextRate);
      const e = engine.current;
      const speaking = e.state === 'playing' || e.state === 'starting';
      if (!speaking && e.state !== 'paused') return;
      halt();
      if (!speaking) return;
      setState('starting');
      const generation = e.generation;
      e.timer = setTimeout(() => generation === e.generation && speak(e.index), 80);
    },
    [halt, setState, speak],
  );

  // Find the on-device voices (they can arrive late) and stop when the page is left.
  useEffect(() => {
    if (!('speechSynthesis' in window) || !('SpeechSynthesisUtterance' in window)) return;
    setSupported(true);
    const refresh = () => {
      const list = Array.from(
        new Map(
          speechSynthesis
            .getVoices()
            .filter((v) => v.localService)
            .map((v) => [v.voiceURI, v]),
        ).values(),
      ).sort((a, b) => voiceScore(b) - voiceScore(a) || a.name.localeCompare(b.name));
      setVoices(list);
      const keep = list.find((v) => v.voiceURI === choice.current.voice?.voiceURI) ?? list[0] ?? null;
      choice.current.voice = keep;
      setVoiceURI(keep?.voiceURI ?? '');
      if (!keep && engine.current.utterance)
        fail('The selected device voice is no longer available. Choose another voice to continue.');
    };
    refresh();
    speechSynthesis.addEventListener('voiceschanged', refresh);
    addEventListener('pagehide', stop);
    return () => {
      speechSynthesis.removeEventListener('voiceschanged', refresh);
      removeEventListener('pagehide', stop);
      halt();
    };
  }, [fail, halt, stop]);

  // A different article starts from scratch.
  useEffect(() => {
    stop();
    return halt;
  }, [articleKey, stop, halt]);

  const play = useCallback(() => {
    const e = engine.current;
    if (e.state === 'paused' && e.utterance) {
      setState('starting');
      e.watchdog = setTimeout(
        () =>
          e.state === 'starting' && fail('The browser could not resume. Press Play to restart the sentence.'),
        8000,
      );
      speechSynthesis.resume();
      return;
    }
    if (e.state === 'playing' || e.state === 'starting') return;
    setError('');
    if (!e.passages.length || e.state === 'finished' || e.state === 'idle') {
      const prose = document.getElementById('article-prose');
      if (!prose) return fail('There is no article text to read.');
      e.passages = passagesFrom(prose, title);
      e.index = 0;
    }
    halt();
    speak(e.index);
  }, [fail, halt, setState, speak, title]);

  const pause = useCallback(() => {
    const e = engine.current;
    if (e.state !== 'playing' && e.state !== 'starting') return;
    if (e.timer) clearTimeout(e.timer);
    if (e.watchdog) clearTimeout(e.watchdog);
    speechSynthesis.pause();
    setState('paused');
  }, [setState]);

  return {
    supported,
    voices,
    voiceURI,
    rate,
    state,
    error,
    position,
    play,
    pause,
    stop,
    setVoice: (uri: string) => choose(voices.find((v) => v.voiceURI === uri) ?? null, choice.current.rate),
    setRate: (value: number) => choose(choice.current.voice, Math.max(0.75, Math.min(1.5, value))),
  };
}
