import { OrbSigil } from './OrbSigil';
import { SignoffFooter } from '@/components/chrome/SignoffFooter';

export function Signoff() {
  return (
    <div className="nw-home-signoff-group flex flex-col gap-[var(--nw-seam-section)]">
      <section className="w-full relative h-[calc(590*var(--nw-u))]" data-band="orb">
        <OrbSigil />
      </section>
      <SignoffFooter home />
    </div>
  );
}
