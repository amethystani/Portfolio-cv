import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: "Animesh's MacBook — zsh",
  description: 'Portfolio — Animesh Mishra | Software Engineer',
  icons: {
    icon: '/slowrush.jpg'
  }
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Animesh Mishra",
  "url": "https://animeshmishra.us",
  "image": "https://animeshmishra.us/icon.jpg",
  "jobTitle": "Software Engineer",
  "alumniOf": {
    "@type": "CollegeOrUniversity",
    "name": "Shiv Nadar University"
  },
  "knowsAbout": ["Machine Learning", "Software Engineering", "Computer Science"],
  "sameAs": [
    "https://www.linkedin.com/in/animesh-mishra-in/",
    "https://github.com/amethystani",
    "https://scholar.google.com/citations?user=tRgC6SMAAAAJ",
    "https://www.researchgate.net/profile/Animesh-Mishra-17",
    "https://dev.to/amethystani",
    "https://hashnode.com/@amethystani",
    "https://substack.com/@animeshmishra103526",
    "https://animeshmishra.us"
  ]
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
