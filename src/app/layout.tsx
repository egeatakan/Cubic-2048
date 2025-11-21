import type { Metadata } from 'next'
import './globals.css'
// 1. İMPORT BURAYA EKLENDİ
import { Analytics } from "@vercel/analytics/react"

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
      <body>
        {children}
        {/* 2. BİLEŞEN BURAYA EKLENDİ */}
        <Analytics />
      </body>
    </html>
  )
}