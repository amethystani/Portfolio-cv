'use client';

import { useEffect, useState } from 'react';
import { portfolio } from '@/content/portfolio';

/** "● Open to research roles · 8:41 PM in New Delhi": a status and his local time, ticking. Edit in content/portfolio.ts. */
export function HeroNow() {
  const { status, city, timeZone } = portfolio.now;
  const [time, setTime] = useState<string>();
  useEffect(() => {
    const format = new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit', timeZone });
    const tick = () => setTime(format.format(new Date()));
    tick();
    const id = setInterval(tick, 15_000);
    return () => clearInterval(id);
  }, [timeZone]);
  return (
    <p className="pf-now">
      <span className="pf-now-dot" aria-hidden="true" />
      <span>{status}</span>
      <span aria-hidden="true">·</span>
      {/* the time only exists in the browser (it would be stale in the static HTML) */}
      <span suppressHydrationWarning>{time ? `${time} in ${city}` : city}</span>
    </p>
  );
}
