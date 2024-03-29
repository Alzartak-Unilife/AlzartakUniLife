import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import RecoilRootProvider from '@/core/modules/nextjs-recoil/RecoilRootProvider'
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from '@vercel/analytics/react';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Alzartak Unilife',
  description: '대학생활 알잘딱',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // Render
  return (
    <html lang="en">
      <body className={inter.className}>
        <RecoilRootProvider>
          {children}
          <SpeedInsights />
          <Analytics />
        </RecoilRootProvider>
      </body>
    </html>
  )
}
