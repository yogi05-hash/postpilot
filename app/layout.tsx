import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
const inter = Inter({ subsets: ['latin'] })
export const metadata: Metadata = {
  title: 'PostPilot — AI Marketing Co-Pilot',
  description: 'Describe your business once. Get a week of scroll-stopping content every Monday. Approve in one tap.',
  openGraph: { title: 'PostPilot', description: 'Your AI marketing co-pilot', type: 'website' }
}
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body className={inter.className} style={{ background: '#070711', color: '#fff' }}>{children}</body></html>
}
