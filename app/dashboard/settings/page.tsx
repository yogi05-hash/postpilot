'use client'
import { useState, useEffect, Suspense } from 'react'
import { createClient } from '@/lib/supabase-browser'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

function SettingsInner() { return <SettingsPage /> }
export default function SettingsPageWrapper() { return <Suspense><SettingsInner /></Suspense> }

const TONES = [
  { id: 'professional', icon: '🎯', label: 'Professional', desc: 'Authoritative, credible' },
  { id: 'friendly',     icon: '😊', label: 'Friendly',     desc: 'Warm, approachable' },
  { id: 'bold',         icon: '🔥', label: 'Bold',         desc: 'Direct, provocative' },
  { id: 'educational',  icon: '📚', label: 'Educational',  desc: 'Informative, helpful' },
]

type ConnectedAccount = { platform: string; account_name: string }

function SettingsPage() {
  const [user, setUser]     = useState<{ id: string; email?: string } | null>(null)
  const [plan, setPlan]     = useState('free')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving]   = useState(false)
  const [saved, setSaved]     = useState(false)
  const [toast, setToast]     = useState('')
  const [accounts, setAccounts] = useState<ConnectedAccount[]>([])
  const [disconnecting, setDisconnecting] = useState<string | null>(null)
  const [form, setForm] = useState({ name: '', description: '', audience: '', niche: '', tone: 'professional' })
  const supabase = createClient()
  const router   = useRouter()
  const params   = useSearchParams()

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 4000) }

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) { router.push('/login'); return }
      setUser(user)

      const [{ data: profile }, { data: biz }, { data: socialData }] = await Promise.all([
        supabase.from('postpilot_profiles').select('plan').eq('id', user.id).single(),
        supabase.from('postpilot_businesses').select('*').eq('user_id', user.id).single(),
        supabase.from('postpilot_social_accounts').select('platform,account_name').eq('user_id', user.id),
      ])

      if (profile) setPlan(profile.plan)
      if (biz) setForm({ name: biz.name||'', description: biz.description||'', audience: biz.audience||'', niche: biz.niche||'', tone: biz.tone||'professional' })
      if (socialData) setAccounts(socialData)
      setLoading(false)

      // Toast from OAuth callback
      const connected = params.get('connected')
      const error     = params.get('error')
      if (connected === 'linkedin') showToast('✅ LinkedIn connected! You can now post directly.')
      if (connected === 'twitter')  showToast('✅ Twitter/X connected! You can now post tweets.')
      if (error === 'linkedin_denied')         showToast('❌ LinkedIn connection cancelled.')
      if (error === 'linkedin_not_configured') showToast('❌ LinkedIn keys not configured yet.')
      if (error === 'linkedin_token_failed')   showToast('❌ LinkedIn auth failed. Try again.')
      if (error === 'twitter_denied')          showToast('❌ Twitter connection cancelled.')
      if (error === 'twitter_token')           showToast('❌ Twitter auth failed. Try again.')
    })
  }, [])

  const save = async () => {
    if (!user || !form.name || !form.description) return
    setSaving(true)
    await supabase.from('postpilot_businesses').update({
      name: form.name, description: form.description,
      audience: form.audience, niche: form.niche, tone: form.tone,
    }).eq('user_id', user.id)
    setSaving(false); setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const disconnect = async (platform: string) => {
    if (!user) return
    setDisconnecting(platform)
    await supabase.from('postpilot_social_accounts').delete().eq('user_id', user.id).eq('platform', platform)
    setAccounts(a => a.filter(x => x.platform !== platform))
    setDisconnecting(null)
    showToast(`${platform.charAt(0).toUpperCase() + platform.slice(1)} disconnected.`)
  }

  const getAccount = (p: string) => accounts.find(a => a.platform === p)
  const logout     = async () => { await supabase.auth.signOut(); router.push('/') }

  if (loading) return (
    <div style={{ background:'#050510', minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', color:'rgba(255,255,255,0.3)', fontFamily:'sans-serif' }}>
      Loading...
    </div>
  )

  const input: React.CSSProperties = { width:'100%', background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:'10px', padding:'12px 14px', color:'#fff', fontSize:'14px', outline:'none', boxSizing:'border-box' }
  const label: React.CSSProperties = { fontSize:'12px', fontWeight:600, color:'rgba(255,255,255,0.5)', display:'block', marginBottom:'7px', textTransform:'uppercase', letterSpacing:'0.5px' }

  const PLATFORMS = [
    {
      id: 'linkedin', label: 'LinkedIn', icon: 'in',
      color: 'rgba(10,102,194,0.15)', border: 'rgba(10,102,194,0.3)',
      connectUrl: '/api/social/linkedin/connect',
      desc: 'Share posts to your LinkedIn profile',
      live: true,
    },
    {
      id: 'twitter', label: 'Twitter / X', icon: '𝕏',
      color: 'rgba(29,161,242,0.1)', border: 'rgba(29,161,242,0.2)',
      connectUrl: '/api/social/twitter/connect',
      desc: 'Post tweets directly from PostPilot',
      live: false,
    },
    {
      id: 'instagram', label: 'Instagram', icon: '📸',
      color: 'rgba(225,48,108,0.08)', border: 'rgba(225,48,108,0.15)',
      connectUrl: '/api/social/instagram/connect',
      desc: 'Post to Instagram from PostPilot',
      live: false,
    },
  ]

  return (
    <div style={{ fontFamily:'-apple-system,BlinkMacSystemFont,"Inter",sans-serif', background:'#050510', color:'#fff', minHeight:'100vh' }}>

      {/* Toast */}
      {toast && (
        <div style={{ position:'fixed', top:'20px', right:'20px', zIndex:999, background: toast.startsWith('✅') ? 'rgba(34,197,94,0.12)' : 'rgba(239,68,68,0.12)', border:`1px solid ${toast.startsWith('✅') ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}`, color: toast.startsWith('✅') ? '#22c55e' : '#ef4444', padding:'12px 20px', borderRadius:'10px', fontSize:'13px', fontWeight:600, boxShadow:'0 8px 32px rgba(0,0,0,0.4)' }}>
          {toast}
        </div>
      )}

      {/* NAV */}
      <nav style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 32px', borderBottom:'1px solid rgba(255,255,255,0.05)', background:'rgba(5,5,16,0.95)', backdropFilter:'blur(20px)', position:'sticky', top:0, zIndex:100 }}>
        <div style={{ display:'flex', alignItems:'center', gap:'16px' }}>
          <Link href="/dashboard" style={{ textDecoration:'none', display:'flex', alignItems:'center', gap:'8px' }}>
            <span>🚀</span>
            <span style={{ fontSize:'15px', fontWeight:800, background:'linear-gradient(135deg,#a78bfa,#60a5fa)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>PostPilot</span>
          </Link>
          <span style={{ color:'rgba(255,255,255,0.2)' }}>›</span>
          <span style={{ fontSize:'13px', color:'rgba(255,255,255,0.4)' }}>Settings</span>
        </div>
        <div style={{ display:'flex', gap:'8px', alignItems:'center' }}>
          {plan === 'pro' && <span style={{ fontSize:'11px', background:'rgba(124,58,237,0.15)', color:'#a78bfa', border:'1px solid rgba(124,58,237,0.3)', padding:'3px 10px', borderRadius:'100px', fontWeight:700 }}>PRO</span>}
          <Link href="/dashboard" style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.07)', color:'rgba(255,255,255,0.4)', padding:'7px 14px', borderRadius:'7px', fontSize:'12px', textDecoration:'none' }}>← Dashboard</Link>
          <button onClick={logout} style={{ background:'transparent', border:'1px solid rgba(255,255,255,0.07)', color:'rgba(255,255,255,0.3)', padding:'5px 12px', borderRadius:'6px', fontSize:'11px', cursor:'pointer' }}>Sign out</button>
        </div>
      </nav>

      <div style={{ maxWidth:'660px', margin:'0 auto', padding:'40px 28px' }}>

        {/* ── SOCIAL ACCOUNTS ──────────────────────────────────── */}
        <h2 style={{ fontSize:'20px', fontWeight:800, marginBottom:'4px' }}>Social Accounts</h2>
        <p style={{ color:'rgba(255,255,255,0.35)', fontSize:'13px', marginBottom:'24px' }}>
          Connect your accounts. Approve a post in the dashboard → click Post → it goes live instantly.
        </p>

        <div style={{ display:'flex', flexDirection:'column', gap:'10px', marginBottom:'32px' }}>
          {PLATFORMS.map(p => {
            const acct = getAccount(p.id)
            return (
              <div key={p.id} style={{ background: acct ? p.color : 'rgba(255,255,255,0.02)', border:`1px solid ${acct ? p.border : 'rgba(255,255,255,0.06)'}`, borderRadius:'14px', padding:'16px 20px', display:'flex', alignItems:'center', justifyContent:'space-between', gap:'12px', transition:'all 0.2s' }}>
                <div style={{ display:'flex', alignItems:'center', gap:'14px' }}>
                  <div style={{ background:p.color, border:`1px solid ${p.border}`, borderRadius:'9px', width:'40px', height:'40px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'13px', fontWeight:800, flexShrink:0 }}>{p.icon}</div>
                  <div>
                    <p style={{ margin:'0 0 3px', fontWeight:700, fontSize:'14px' }}>{p.label}</p>
                    <p style={{ margin:0, fontSize:'12px', color: acct ? '#86efac' : 'rgba(255,255,255,0.3)' }}>
                      {acct ? `✓ Connected as ${acct.account_name}` : p.desc}
                    </p>
                  </div>
                </div>
                <div style={{ flexShrink:0 }}>
                  {acct ? (
                    <button
                      onClick={() => disconnect(p.id)}
                      disabled={disconnecting === p.id}
                      style={{ background:'rgba(239,68,68,0.08)', border:'1px solid rgba(239,68,68,0.2)', color:'#f87171', padding:'7px 16px', borderRadius:'8px', fontSize:'12px', fontWeight:600, cursor:'pointer' }}>
                      {disconnecting === p.id ? 'Disconnecting...' : 'Disconnect'}
                    </button>
                  ) : p.live ? (
                    <a href={p.connectUrl} style={{ display:'inline-block', background:'linear-gradient(135deg,#7c3aed,#2563eb)', color:'#fff', padding:'8px 18px', borderRadius:'8px', fontSize:'12px', fontWeight:700, textDecoration:'none' }}>
                      Connect →
                    </a>
                  ) : (
                    <a href={p.connectUrl} style={{ display:'inline-block', background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.1)', color:'rgba(255,255,255,0.5)', padding:'8px 18px', borderRadius:'8px', fontSize:'12px', fontWeight:600, textDecoration:'none' }}>
                      Connect →
                    </a>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* How posting works */}
        <div style={{ background:'rgba(124,58,237,0.05)', border:'1px solid rgba(124,58,237,0.12)', borderRadius:'12px', padding:'16px 20px', marginBottom:'40px' }}>
          <p style={{ fontSize:'12px', fontWeight:700, color:'#a78bfa', marginBottom:'10px', textTransform:'uppercase', letterSpacing:'0.5px' }}>How it works</p>
          <div style={{ display:'flex', flexDirection:'column', gap:'8px' }}>
            {[
              { n:'1', t:'AI generates 7 posts for your business every week' },
              { n:'2', t:'You review posts in the dashboard — approve or reject each one' },
              { n:'3', t:'Click "Post to LinkedIn" on any approved post → it goes live instantly' },
              { n:'4', t:'No copying, no pasting, no switching tabs' },
            ].map(s => (
              <div key={s.n} style={{ display:'flex', gap:'10px', alignItems:'flex-start' }}>
                <span style={{ background:'rgba(124,58,237,0.2)', color:'#a78bfa', borderRadius:'50%', width:'20px', height:'20px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'11px', fontWeight:700, flexShrink:0, marginTop:'1px' }}>{s.n}</span>
                <p style={{ fontSize:'13px', color:'rgba(255,255,255,0.55)', margin:0, lineHeight:1.5 }}>{s.t}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── BUSINESS PROFILE ─────────────────────────────────── */}
        <h2 style={{ fontSize:'20px', fontWeight:800, marginBottom:'4px' }}>Business Profile</h2>
        <p style={{ color:'rgba(255,255,255,0.35)', fontSize:'13px', marginBottom:'20px' }}>
          This is what PostPilot reads to write your content. Be specific — generic inputs = generic posts.
        </p>

        <div style={{ display:'flex', flexDirection:'column', gap:'16px' }}>
          <div>
            <label style={label}>Business name</label>
            <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. bilabs.ai" style={input} />
          </div>
          <div>
            <label style={label}>What you do <span style={{ color:'rgba(255,255,255,0.25)', fontWeight:400, textTransform:'none', letterSpacing:0 }}>(most important)</span></label>
            <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="e.g. AI automation agency helping UK small businesses save 10+ hours/week with chatbots, voice assistants and lead generation workflows" rows={3} style={{ ...input, resize:'vertical', lineHeight:1.6 }} />
          </div>
          <div>
            <label style={label}>Target audience</label>
            <input value={form.audience} onChange={e => setForm(f => ({ ...f, audience: e.target.value }))} placeholder="e.g. UK small business owners, recruiters, mortgage brokers" style={input} />
          </div>
          <div>
            <label style={label}>Industry / niche</label>
            <input value={form.niche} onChange={e => setForm(f => ({ ...f, niche: e.target.value }))} placeholder="e.g. AI automation, SaaS, fintech, e-commerce" style={input} />
          </div>
          <div>
            <label style={label}>Brand tone</label>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'8px' }}>
              {TONES.map(t => (
                <button key={t.id} onClick={() => setForm(f => ({ ...f, tone: t.id }))}
                  style={{ background:form.tone === t.id ? 'rgba(124,58,237,0.12)' : 'rgba(255,255,255,0.03)', border:`1px solid ${form.tone === t.id ? 'rgba(124,58,237,0.4)' : 'rgba(255,255,255,0.07)'}`, borderRadius:'10px', padding:'12px 14px', textAlign:'left', cursor:'pointer' }}>
                  <p style={{ fontSize:'13px', fontWeight:600, marginBottom:'2px', color:form.tone === t.id ? '#a78bfa' : '#fff' }}>{t.icon} {t.label}</p>
                  <p style={{ fontSize:'11px', color:'rgba(255,255,255,0.35)', margin:0 }}>{t.desc}</p>
                </button>
              ))}
            </div>
          </div>
          <button onClick={save} disabled={saving || !form.name || !form.description}
            style={{ background:saved ? 'rgba(34,197,94,0.1)' : 'linear-gradient(135deg,#7c3aed,#2563eb)', border:saved ? '1px solid rgba(34,197,94,0.3)' : 'none', color:saved ? '#22c55e' : '#fff', padding:'14px', borderRadius:'10px', fontSize:'14px', fontWeight:700, cursor:'pointer', marginTop:'4px' }}>
            {saving ? 'Saving...' : saved ? '✓ Saved — next generation uses this profile' : 'Save changes'}
          </button>
        </div>

      </div>
    </div>
  )
}
