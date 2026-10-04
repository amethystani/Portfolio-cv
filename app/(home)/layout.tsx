import type { ReactNode } from 'react';
import { Footer } from '@/components/chrome/Footer';
import { Header } from '@/components/chrome/Header';
import { PinnedHeader } from '@/components/chrome/PinnedHeader';

/** Home page frame: header, the page itself (its own <main>), then the revealing footer. */
export default function HomeLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      <PinnedHeader />
      {children}
      <Footer />
    </>
  );
}
