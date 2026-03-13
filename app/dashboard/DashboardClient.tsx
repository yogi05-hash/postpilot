'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase-browser'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

type Post = { id: string; platform: string; content: string; status: string; created_at: string }
type Business = { id: string; name: string; description: string; audience: string; niche: string; tone: string }

const PLATFORM_ICON: Record<string, string> = { twitter: '𝕏', linkedin: 'in', instagram: '📸' }
const PLATFORM_COLOR: Record<string, string> = { twitter: 'rgba(29,161,242,0.15)', linkedin: 'rgba(10,102,194,0.15)', instagram: 'rgba(225,48,108,0.15)' }

export default function DashboardClient() {
  const [user, setUser] = useState<{ id: string; email?: string } | null>(null)
  const [plan, setPlan] = useState('free')
  const [business, setBusiness] = useState<Business | null>(null)
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [checkoutLoading, setCheckoutLoading] = useState(false)
  const [upgraded, setUpgraded] = useState(false)
  const [filter, setFilter] = useState('all')
  const supabase = createClient()
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) { router.push('/login'); return }
      setUser(user)
      if (searchParams.get('upgraded') === 'true') setUpgraded(true)

      const [{ data: profile }, { data: biz }, { data: postsData }] = await Promise.all([
        supabase.from('postpilot_profiles').select('plan').eq('id', user.id).single(),
        supabase.from('postpilot_businesses').select('*').eq('user_id', user.id).single(),
        supabase.from('postpilot_posts').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(50)
      ])

      if (profile) setPlan(profile.plan)
      if (biz) setBusiness(biz)
      else { router.push('/dashboard/onboarding'); return }
      if (postsData) setPosts(postsData)
      setLoading(false)
    })
  }, [])

  const generatePosts = async () => {
    if (!business) return
    setGenerating(true)
    try {
      const res = await fetch('/api/generate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ business }) })
      const data = await res.json()
      if (data.posts) {
        const { data: newPosts } = await supabase.from('postpilot_posts').select('*').eq('user_id', user!.id).order('created_at', { ascending: false }).limit(50)
        if (newPosts) setPosts(newPosts)
      }
    } finally {
      setGenerating(false)
    }
  }

  const approvePost = async (id: string) => {
    await supabase.from('postpilot_posts').update({ status: 'approved' }).eq('id', id)
    setPosts(prev => prev.map(p => p.id === id ? { ...p, status: 'approved' } : p))
  }

  const rejectPost = async (id: string) => {
    await supabase.from('postpilot_posts').update({ status: 'rejected' }).eq('id', id)
    setPosts(prev => prev.map(p => p.id === id ? { ...p, status: 'rejected' } : p))
  }

  const handleUpgrade = async () => {
    setCheckoutLoading(true)
    const res = await fetch('/api/stripe/checkout', { method: 'POST' })
    const { url } = await res.json()
    if (url) window.location.href = url
    else setCheckoutLoading(false)
  }

  const logout = async () => { await supabase.auth.signOut(); router.push('/') }

  const filtered = filter === 'all' ? posts : posts.filter(p => p.status === filter)
  const pending = posts.filter(p => p.status === 'pending').length
  const approved = posts.filter(p => p.status === 'approved').length

  if (loading) return <div style={{ background: '#070711', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.4)', fontFamily: 'sans-serif' }}>Loading...</div>

  return (
    <div style={{ fontFamily: '-apple-system,BlinkMacSystemFont,"Inter",sans-serif', background: '#070711', color: '#fff', minHeight: '100vh' }}>
      {/* NAV */}
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 40px', borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(7,7,17,0.95)', backdropFilter: 'blur(20px)', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '18px' }}>🚀</span>
          <span style={{ fontSize: '16px', fontWeight: 800, background: 'linear-gradient(135deg,#a78bfa,#60a5fa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>PostPilot</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {plan === 'pro' && <span style={{ fontSize: '11px', background: 'rgba(124,58,237,0.15)', color: '#a78bfa', border: '1px solid rgba(124,58,237,0.3)', padding: '4px 10px', borderRadius: '100px', fontWeight: 700 }}>PRO</span>}
          {plan === 'free' && <button onClick={handleUpgrade} disabled={checkoutLoading} style={{ background: 'linear-gradient(135deg,#7c3aed,#2563eb)', color: '#fff', border: 'none', padding: '8px 18px', borderRadius: '7px', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}>{checkoutLoading ? 'Loading...' : 'Upgrade — £29/mo'}</button>}
          <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.3)' }}>{user?.email}</span>
          <button onClick={logout} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.35)', padding: '6px 14px', borderRadius: '7px', fontSize: '12px', cursor: 'pointer' }}>Sign out</button>
        </div>
      </nav>

      <div style={{ maxWidth: '960px', margin: '0 auto', padding: '40px' }}>
        {upgraded && (
          <div style={{ background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.25)', borderRadius: '12px', padding: '16px 20px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '20px' }}>🎉</span>
            <p style={{ margin: 0, fontSize: '14px', color: '#a78bfa', fontWeight: 500 }}>Welcome to Pro! Unlimited AI content generation is now active.</p>
          </div>
        )}

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
          <div>
            <h1 style={{ fontSize: '26px', fontWeight: 800, letterSpacing: '-0.5px', margin: '0 0 6px' }}>Content Dashboard</h1>
            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '14px', margin: 0 }}>{business?.name} · {plan === 'pro' ? 'Pro Plan' : 'Free Plan'}</p>
          </div>
          <button onClick={generatePosts} disabled={generating}
            style={{ background: generating ? 'rgba(255,255,255,0.05)' : 'linear-gradient(135deg,#7c3aed,#2563eb)', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '10px', fontWeight: 700, fontSize: '14px', cursor: generating ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
            {generating ? '✨ Generating...' : '✨ Generate this week\'s posts'}
          </button>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '14px', marginBottom: '32px' }}>
          {[
            { label: 'Total posts', value: posts.length.toString() },
            { label: 'Awaiting review', value: pending.toString(), highlight: pending > 0 },
            { label: 'Approved', value: approved.toString() },
            { label: 'This week', value: posts.filter(p => new Date(p.created_at) > new Date(Date.now() - 7*24*60*60*1000)).length.toString() },
          ].map(s => (
            <div key={s.label} style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${s.highlight ? 'rgba(124,58,237,0.3)' : 'rgba(255,255,255,0.06)'}`, borderRadius: '14px', padding: '18px 20px' }}>
              <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{s.label}</p>
              <p style={{ fontSize: '26px', fontWeight: 800, margin: 0, color: s.highlight ? '#a78bfa' : '#fff' }}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Filter */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
          {['all', 'pending', 'approved', 'rejected'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              style={{ background: filter === f ? 'rgba(124,58,237,0.15)' : 'transparent', border: `1px solid ${filter === f ? 'rgba(124,58,237,0.4)' : 'rgba(255,255,255,0.07)'}`, color: filter === f ? '#a78bfa' : 'rgba(255,255,255,0.4)', padding: '7px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: filter === f ? 600 : 400, cursor: 'pointer', textTransform: 'capitalize' }}>
              {f}
            </button>
          ))}
        </div>

        {/* Posts */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px', color: 'rgba(255,255,255,0.2)' }}>
            <p style={{ fontSize: '48px', marginBottom: '16px' }}>✍️</p>
            <p style={{ fontSize: '16px', fontWeight: 500, marginBottom: '8px' }}>{posts.length === 0 ? 'No posts yet' : `No ${filter} posts`}</p>
            {posts.length === 0 && <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.2)' }}>Hit &quot;Generate this week&apos;s posts&quot; to get started</p>}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {filtered.map(post => (
              <div key={post.id} style={{ background: post.status === 'approved' ? 'rgba(124,58,237,0.05)' : 'rgba(255,255,255,0.02)', border: `1px solid ${post.status === 'approved' ? 'rgba(124,58,237,0.2)' : post.status === 'rejected' ? 'rgba(248,113,113,0.15)' : 'rgba(255,255,255,0.07)'}`, borderRadius: '16px', padding: '20px 24px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                  <div style={{ background: PLATFORM_COLOR[post.platform] || 'rgba(255,255,255,0.08)', borderRadius: '8px', padding: '8px 12px', fontSize: '13px', fontWeight: 700, flexShrink: 0, minWidth: '72px', textAlign: 'center' }}>
                    {PLATFORM_ICON[post.platform] || post.platform}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: '14px', color: post.status === 'rejected' ? 'rgba(255,255,255,0.35)' : 'rgba(255,255,255,0.75)', lineHeight: 1.65, margin: '0 0 14px', textDecoration: post.status === 'rejected' ? 'line-through' : 'none' }}>{post.content}</p>
                    {post.status === 'pending' && (
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button onClick={() => approvePost(post.id)} style={{ background: 'linear-gradient(135deg,#7c3aed,#2563eb)', color: '#fff', border: 'none', padding: '8px 18px', borderRadius: '7px', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}>✓ Approve</button>
                        <button onClick={() => rejectPost(post.id)} style={{ background: 'rgba(248,113,113,0.1)', color: '#f87171', border: '1px solid rgba(248,113,113,0.2)', padding: '8px 14px', borderRadius: '7px', fontSize: '13px', cursor: 'pointer' }}>✗ Reject</button>
                      </div>
                    )}
                    {post.status === 'approved' && <span style={{ fontSize: '12px', color: '#a78bfa', fontWeight: 600 }}>✓ Approved — ready to post</span>}
                    {post.status === 'rejected' && <span style={{ fontSize: '12px', color: '#f87171', fontWeight: 500 }}>Rejected</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
