import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/react'
import Script from 'next/script'
import './globals.css'
const inter = Inter({ subsets: ['latin'] })
export const metadata: Metadata = {
  title: 'PostPilot — AI Marketing Co-Pilot',
  description: 'Describe your business once. Get a week of scroll-stopping content every Monday. Approve in one tap.',
  openGraph: { title: 'PostPilot', description: 'Your AI marketing co-pilot', type: 'website' }
}
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-EK5FCX6092"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-EK5FCX6092');
          `}
        </Script>
      </head>
      <body className={inter.className} style={{ background: '#070711', color: '#fff' }}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
