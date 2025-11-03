import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'VisualDx API - Lesion Analysis Example',
  description: 'Analyze a picture of your skin to find cosmetic product recommendations.',
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