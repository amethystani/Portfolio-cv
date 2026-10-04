'use client';

import { type ReactNode, useEffect, useId, useRef, useState } from 'react';
import { ListenIcon, ShareIcon } from '@/components/icons';
import { Button } from '@/components/ui/Button';
import { Dialog, DialogBody, DialogDescription } from '@/components/ui/Dialog';
import { Field, FIELD_INPUT, FIELD_SHELL } from '@/components/ui/Field';
import { Select } from '@/components/ui/Select';
import { useSpeech } from '@/lib/speech';

type Panel = 'listen' | 'share' | null;

const SPEEDS = [0.75, 0.95, 1, 1.15, 1.25, 1.5];
const speedLabel = (speed: number) =>
  `${speed}×${speed === 0.95 ? ' · Relaxed' : speed === 1 ? ' · Normal' : ''}`;

const STATUS: Record<string, string> = {
  idle: 'Ready when you are.',
  starting: 'Starting device voice…',
  playing: 'Reading aloud.',
  paused: 'Paused.',
  finished: 'You’ve reached the end of the article.',
  error: 'Playback stopped.',
};

function TriggerButton({
  label,
  open,
  onClick,
  buttonRef,
  children,
}: {
  label: string;
  open: boolean;
  onClick: () => void;
  buttonRef: React.RefObject<HTMLButtonElement | null>;
  children: ReactNode;
}) {
  return (
    <Button
      ref={buttonRef}
      variant="icon"
      bare
      className="nw-article-icon"
      aria-label={label}
      title={label}
      aria-haspopup="dialog"
      aria-expanded={open}
      data-icon-only="true"
      data-state={open ? 'open' : 'closed'}
      onClick={onClick}
    >
      <span
        aria-hidden="true"
        className="inline-flex shrink-0 items-center justify-center order-first size-[var(--hpv2-icon)]"
      >
        {children}
      </span>
    </Button>
  );
}

function ListenPanel({ title, articleKey }: { title: string; articleKey: string }) {
  const speech = useSpeech(title, articleKey);
  const voiceId = useId();
  const speedId = useId();
  const busy = speech.state === 'playing' || speech.state === 'starting';
  const { position } = speech;
  return (
    <DialogBody className="nw-article-action-body">
      <DialogDescription className="nw-article-action-title">{title}</DialogDescription>
      <p className="nw-article-action-note">
        Read with a voice installed on your device. Voice quality depends on your browser and system.
      </p>
      {!speech.supported ? (
        <p role="status">
          Read-aloud is not supported in this browser. Try a browser with device speech support.
        </p>
      ) : !speech.voices.length ? (
        <p role="status">
          No on-device voices are available. Listen uses local voices only; Chrome on Linux/ChromeOS may offer
          only remote voices. Try a browser with device voices.
        </p>
      ) : (
        <>
          <Field label="Device voice" htmlFor={voiceId}>
            <Select
              id={voiceId}
              label="Device voice"
              value={speech.voiceURI}
              onChange={speech.setVoice}
              options={speech.voices.map((v) => ({ value: v.voiceURI, label: `${v.name} · ${v.lang}` }))}
            />
          </Field>
          <Field label="Reading speed" htmlFor={speedId}>
            <Select
              id={speedId}
              label="Reading speed"
              value={String(speech.rate)}
              onChange={(v) => speech.setRate(Number(v))}
              options={SPEEDS.map((s) => ({ value: String(s), label: speedLabel(s) }))}
            />
          </Field>
          <div className="nw-article-action-controls">
            <Button variant="primary" onClick={busy ? speech.pause : speech.play}>
              {busy
                ? 'Pause'
                : speech.state === 'paused'
                  ? 'Resume'
                  : speech.state === 'finished'
                    ? 'Play again'
                    : 'Play'}
            </Button>
            <Button variant="outline" disabled={speech.state === 'idle'} onClick={speech.stop}>
              Stop
            </Button>
          </div>
          <p role="status" className="nw-article-action-note">
            {speech.error || STATUS[speech.state]}
          </p>
          {position.total > 0 && (
            <div className="nw-article-speech-position">
              <span>
                {speech.state === 'finished' ? position.total : position.index + 1} / {position.total}{' '}
                passages
              </span>
              <p>{position.text}</p>
            </div>
          )}
        </>
      )}
      <p className="nw-article-action-note">
        On-device audio only. Code and tables are skipped. Changing voice or speed restarts the current
        passage. Closing this panel stops playback.
      </p>
    </DialogBody>
  );
}

function SharePanel({ title, url }: { title: string; url: string }) {
  const input = useRef<HTMLInputElement>(null);
  const inputId = useId();
  const [status, setStatus] = useState('');
  const [canShare, setCanShare] = useState(false);
  const [sharing, setSharing] = useState(false);
  useEffect(() => setCanShare(typeof navigator.share === 'function'), []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setStatus('Article link copied.');
    } catch {
      input.current?.focus();
      input.current?.select();
      setStatus('Copy was blocked. The link is selected; copy it manually.');
    }
  };
  const shareNatively = async () => {
    setSharing(true);
    setStatus('');
    try {
      await navigator.share({ title, url });
      setStatus('Shared using your device.');
    } catch (error) {
      if (!(error instanceof DOMException && error.name === 'AbortError'))
        setStatus('Device sharing is unavailable. Copy the link or use an option below.');
    } finally {
      setSharing(false);
    }
  };
  const tweet = `https://twitter.com/intent/tweet?${new URLSearchParams({ text: title, url })}`;
  const mail = `mailto:?${new URLSearchParams({ subject: title, body: `${title}\n\n${url}` }).toString().replace(/\+/g, '%20')}`;

  return (
    <DialogBody className="nw-article-action-body">
      <DialogDescription className="nw-article-action-title">{title}</DialogDescription>
      <Field label="Article link" htmlFor={inputId}>
        <div className={FIELD_SHELL} data-surface="white">
          <input
            ref={input}
            id={inputId}
            className={FIELD_INPUT}
            readOnly
            value={url}
            onFocus={(e) => e.currentTarget.select()}
          />
        </div>
      </Field>
      <Button variant="primary" onClick={copy} disabled={!url}>
        Copy link
      </Button>
      {canShare && (
        <Button variant="outline" onClick={shareNatively} disabled={sharing}>
          Share using your device
        </Button>
      )}
      <div className="nw-article-action-links">
        <Button variant="underline" href={tweet} target="_blank" rel="noopener noreferrer">
          Share on X
        </Button>
        <Button variant="underline" href={mail}>
          Share by email
        </Button>
      </div>
      <p role="status" className="nw-article-action-note nw-article-share-status">
        {status}
      </p>
    </DialogBody>
  );
}

/**
 * The row above an article: "Listen" (read aloud with a device voice), the date, and "Share"
 * (copy link, X, email, or the device share sheet). Each opens a side panel.
 */
export function ArticleToolbar({
  slug,
  title,
  url,
  publishedTime,
  dateLabel,
}: {
  slug: string;
  title: string;
  url: string;
  publishedTime?: string;
  dateLabel?: string;
}) {
  const [panel, setPanel] = useState<Panel>(null);
  const listenButton = useRef<HTMLButtonElement>(null);
  const shareButton = useRef<HTMLButtonElement>(null);
  const toggle = (next: Exclude<Panel, null>) => setPanel((current) => (current === next ? null : next));
  return (
    <div className="nw-article-toolbar">
      <div className="nw-article-audio">
        <TriggerButton
          label="Listen to article"
          open={panel === 'listen'}
          buttonRef={listenButton}
          onClick={() => toggle('listen')}
        >
          <ListenIcon width={16} height={16} fill="currentColor" aria-hidden="true" />
        </TriggerButton>
        <Dialog
          open={panel === 'listen'}
          onOpenChange={(open) => setPanel(open ? 'listen' : null)}
          banner="Listen"
          title="Listen to this article"
          size="md"
          className="nw-article-action-panel"
          returnFocusTo={listenButton}
        >
          <ListenPanel title={title} articleKey={slug} />
        </Dialog>
        <span>Listen</span>
      </div>
      {publishedTime && <time dateTime={publishedTime}>{dateLabel}</time>}
      <div className="nw-article-sharing">
        <span>Share</span>
        <TriggerButton
          label="Share article"
          open={panel === 'share'}
          buttonRef={shareButton}
          onClick={() => toggle('share')}
        >
          <ShareIcon width={16} height={16} fill="currentColor" aria-hidden="true" />
        </TriggerButton>
        <Dialog
          open={panel === 'share'}
          onOpenChange={(open) => setPanel(open ? 'share' : null)}
          banner="Share"
          title="Share this article"
          size="md"
          className="nw-article-action-panel"
          returnFocusTo={shareButton}
        >
          <SharePanel title={title} url={url} />
        </Dialog>
      </div>
    </div>
  );
}
