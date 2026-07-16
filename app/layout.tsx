import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: "Shikha's Magic Scrapbook",
  description: "Help us create something magical for Shikha's 25th birthday",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
