import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'PDF AcroForm Filler',
  description: 'Automated PDF form filling application with Korean support',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko">
      <body className="antialiased">{children}</body>
    </html>
  )
}
