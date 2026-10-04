/**
 * Site-wide settings. Change these first when adapting the project: name, description, share image
 * and the public URL (set NEXT_PUBLIC_SITE_URL in production).
 */
export const site = {
  name: 'Animesh Mishra',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
  description:
    'Animesh Mishra is an ML/NLP researcher working on evaluation, retrieval and scientific AI. Papers at EMNLP 2026 Main, WMT 2026 and Digital Discovery.',
  /** The longer line used for the home page's description and share cards. */
  homeDescription:
    'Animesh Mishra is an ML/NLP researcher working on evaluation, retrieval and scientific AI, with papers at EMNLP 2026 Main, WMT 2026 and Digital Discovery. Looking for the next research role before a PhD.',
  ogImage: '/assets/brand/social-card.png',
  favicon: '/signature-favicon.png',
  faviconIco: '/favicon.ico',
  appleIcon: '/signature-apple-icon.png',
  sameAs: [
    'https://github.com/amethystani',
    'https://www.linkedin.com/in/animesh-mishra-in/',
    'https://orcid.org/0009-0009-1770-6329',
  ],
} as const;
