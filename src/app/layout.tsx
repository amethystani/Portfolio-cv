import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: "Animesh's MacBook — zsh",
  description: 'Portfolio — Animesh',
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
