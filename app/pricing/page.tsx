'use client'
import Link from 'next/link'
import { useState } from 'react'
import { createClient } from '@/lib/supabase-browser'
import { useRouter } from 'next/navigation'

export default function Pricing() {
  const [loading, setLoading] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  const handleUpgrade = async () => {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/signup?redirect=pricing'); return }
    const res = await fetch('/api/stripe/checkout', { method: 'POST' })
    const { url } = await res.json()
    if (url) window.location.href = url
    else setLoading(false)
  }

  return (
    <div style={{ fontFamily: '-apple-system,sans-serif', background: '#070711', color: '#fff', minHeight: '100vh' }}>
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 64px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', color: '#fff' }}>
          <span>🚀</span>
          <span style={{ fontWeight: 800, fontSize: '18px', background: 'linear-gradient(135deg,#a78bfa,#60a5fa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>PostPilot</span>
        </Link>
        <Link href="/signup" style={{ background: 'linear-gradient(135deg,#7c3aed,#2563eb)', color: '#fff', padding: '9px 20px', borderRadius: '8px', textDecoration: 'none', fontSize: '14px', fontWeight: 600 }}>Get started free</Link>
      </nav>

      <section style={{ maxWidth: '860px', margin: '0 auto', padding: '80px 40px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '52px', fontWeight: 900, letterSpacing: '-2px', marginBottom: '16px' }}>Simple pricing</h1>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '18px', marginBottom: '64px' }}>Start free. Upgrade when you&apos;re ready.</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '20px', alignItems: 'start' }}>
          {/* Free */}
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '36px 28px', textAlign: 'left' }}>
            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', margin: '0 0 20px' }}>Free</p>
            <p style={{ fontSize: '48px', fontWeight: 900, letterSpacing: '-2px', margin: '0 0 6px' }}>£0</p>
            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '14px', margin: '0 0 28px' }}>Forever free</p>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {['3 AI posts/week', '1 business profile', 'Twitter + LinkedIn + Instagram drafts', 'Approve/reject flow'].map(f => (
                <li key={f} style={{ fontSize: '14px', color: 'rgba(255,255,255,0.55)', display: 'flex', gap: '10px', alignItems: 'center' }}><span style={{ color: '#22c55e', fontSize: '12px' }}>✓</span>{f}</li>
              ))}
              {['Unlimited posts', 'Twitter auto-post', 'Analytics'].map(f => (
                <li key={f} style={{ fontSize: '14px', color: 'rgba(255,255,255,0.2)', display: 'flex', gap: '10px', alignItems: 'center' }}><span style={{ fontSize: '12px' }}>✗</span>{f}</li>
              ))}
            </ul>
            <Link href="/signup" style={{ display: 'block', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.6)', padding: '12px', borderRadius: '10px', textDecoration: 'none', fontSize: '14px', fontWeight: 600, textAlign: 'center' }}>Start free</Link>
          </div>

          {/* Pro */}
          <div style={{ background: 'linear-gradient(160deg,rgba(124,58,237,0.15),rgba(37,99,235,0.15))', border: '1px solid rgba(124,58,237,0.35)', borderRadius: '20px', padding: '36px 28px', textAlign: 'left', position: 'relative' }}>
            <span style={{ position: 'absolute', top: '-13px', left: '50%', transform: 'translateX(-50%)', background: 'linear-gradient(135deg,#7c3aed,#2563eb)', color: '#fff', fontSize: '11px', fontWeight: 700, padding: '4px 14px', borderRadius: '100px', whiteSpace: 'nowrap' }}>MOST POPULAR</span>
            <p style={{ fontSize: '12px', color: '#a78bfa', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', margin: '0 0 20px' }}>Pro</p>
            <p style={{ fontSize: '48px', fontWeight: 900, letterSpacing: '-2px', margin: '0 0 6px' }}>£14</p>
            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '14px', margin: '0 0 28px' }}>per month</p>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {['Unlimited AI posts', 'All 3 platforms', 'Twitter auto-post', 'Weekly content drops', 'Engagement analytics', 'AI learns from your data', 'Priority support'].map(f => (
                <li key={f} style={{ fontSize: '14px', color: 'rgba(255,255,255,0.75)', display: 'flex', gap: '10px', alignItems: 'center' }}><span style={{ color: '#a78bfa', fontSize: '12px' }}>✓</span>{f}</li>
              ))}
            </ul>
            <button onClick={handleUpgrade} disabled={loading}
              style={{ display: 'block', width: '100%', background: 'linear-gradient(135deg,#7c3aed,#2563eb)', color: '#fff', border: 'none', padding: '13px', borderRadius: '10px', fontSize: '15px', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}>
              {loading ? 'Loading...' : 'Start Pro — £14/mo'}
            </button>
          </div>

          {/* Agency */}
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '36px 28px', textAlign: 'left' }}>
            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', margin: '0 0 20px' }}>Agency</p>
            <p style={{ fontSize: '48px', fontWeight: 900, letterSpacing: '-2px', margin: '0 0 6px' }}>£49</p>
            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '14px', margin: '0 0 28px' }}>per month</p>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {['Everything in Pro', '10 client workspaces', 'White-label dashboard', 'Client reporting', 'Dedicated support'].map(f => (
                <li key={f} style={{ fontSize: '14px', color: 'rgba(255,255,255,0.55)', display: 'flex', gap: '10px', alignItems: 'center' }}><span style={{ color: '#22c55e', fontSize: '12px' }}>✓</span>{f}</li>
              ))}
            </ul>
            <Link href="mailto:hello@bilabs.ai" style={{ display: 'block', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.6)', padding: '12px', borderRadius: '10px', textDecoration: 'none', fontSize: '14px', fontWeight: 600, textAlign: 'center' }}>Contact us</Link>
          </div>
        </div>
      </section>
    </div>
  )
}
