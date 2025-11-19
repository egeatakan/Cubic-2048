import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Cubic 2048',
  description: 'A 3D version of the 2048 game',
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
