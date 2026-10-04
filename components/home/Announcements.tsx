import type { CSSProperties } from 'react';
import { LinkedInIcon } from '@/components/icons';
import { DragScroll } from '@/components/behavior/DragScroll';
import { announcements, type Announcement } from '@/content/announcements';

const MONO =
  'font-[family-name:var(--font-mono)] font-normal text-inherit uppercase leading-none text-cap-trim cap-mono';

function AnnouncementCard({ url, image, width, height, handle, text, date }: Announcement) {
  return (
    <a
      className="grid justify-items-start gap-[var(--nw-seam-item)] nw-announcement-card group"
      href={url}
      rel="noopener noreferrer"
      style={{ '--nw-card-tail': 'calc(10 * var(--nw-u))' } as CSSProperties}
      target="_blank"
    >
      <div
        className="relative overflow-clip bg-[var(--nw-ink)] nw-announcement-media rounded-t-md"
        style={{ aspectRatio: `${width} / ${height}` }}
      >
        <img
          src={image}
          width={width}
          height={height}
          alt=""
          className="nw-color-reveal"
          loading="lazy"
          decoding="async"
          draggable="false"
        />
        <img
          src={image}
          width={width}
          height={height}
          alt=""
          className="nw-announcement-color nw-color-reveal"
          aria-hidden="true"
          loading="lazy"
          decoding="async"
          draggable="false"
        />
      </div>
      <span
        className={MONO}
        style={{
          fontSize: 'max(11px, calc(11 * var(--nw-u-text)))',
          letterSpacing: 'max(0.44px, calc(0.44 * var(--nw-u-text)))',
        }}
      >
        {handle}
      </span>
      <div className="w-full">
        <p
          className="font-[family-name:var(--font-rules)] proportional-nums font-normal text-inherit normal-case text-pretty nw-announcement-copy"
          style={{ fontSize: 'max(13px, calc(13 * var(--nw-u-text)))', lineHeight: '1.3' }}
        >
          {text}
        </p>
      </div>
      <span
        className={`${MONO} pt-[var(--nw-card-tail)] opacity-[var(--nw-faint)]`}
        style={{
          fontSize: 'max(12px, calc(12 * var(--nw-u-text)))',
          letterSpacing: 'max(0.48px, calc(0.48 * var(--nw-u-text)))',
        }}
      >
        {date}
      </span>
    </a>
  );
}

/** Horizontally scrolling strip of recent posts. Edit content/announcements.ts to change the cards. */
export function Announcements() {
  return (
    <div className="w-full nw-announcements" data-band="announcements">
      <div className="mx-auto w-full max-w-[calc(var(--hw-teams-col)+2*var(--hw-teams-pad-x))] px-[var(--hw-teams-pad-x)]">
        <div className="flex items-start gap-[var(--nw-seam-micro)]">
          <h2
            className="font-[family-name:var(--font-rules-gothic-cmp)] font-medium text-inherit uppercase text-cap-trim cap-rules"
            style={
              {
                fontFamily: 'var(--font-rules-gothic-cmp)',
                '--nw-display-size': 'max(40px, calc(80 * var(--nw-u-text)))',
                fontSize: 'var(--nw-display-size)',
                lineHeight: '1',
              } as CSSProperties
            }
          >
            Updates
          </h2>
          <a
            href="https://www.linkedin.com/in/animesh-mishra-in/"
            aria-label="Animesh Mishra on LinkedIn"
            className="inline-flex shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current"
          >
            <span aria-hidden="true">
              <LinkedInIcon className="size-6" fill="none" />
            </span>
          </a>
        </div>
      </div>
      <div
        className="nw-announcement-scroll"
        role="region"
        aria-label="Recent updates"
        aria-busy="false"
        tabIndex={0}
        data-lenis-prevent-horizontal=""
      >
        {announcements.map((card) => (
          <AnnouncementCard key={card.url} {...card} />
        ))}
      </div>
      <DragScroll selector=".nw-announcement-scroll" />
      <span className="sr-only" role="status">
        {announcements.length} updates loaded
      </span>
    </div>
  );
}
