import { socials } from '@/content/navigation';
import { NavBar } from './NavBar';

/** The nav at the top of the page. */
export function Header() {
  return (
    <header className="relative z-[90] bg-[var(--nw-stage)] text-[var(--nw-ink)]">
      <NavBar variant="main" socials={[...socials]} />
    </header>
  );
}
