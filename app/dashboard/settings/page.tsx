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

type SocialAccount = { platform: string; account_name: string }

function SettingsPage() {
  const [user, setUser]           = useState<{ id: string; email?: string } | null>(null)
  const [plan, setPlan]           = useState('free')
  const [loading, setLoading]     = useState(true)
  const [saving, setSaving]       = useState(false)
  const [saved, setSaved]         = useState(false)
  const [toast, setToast]         = useState('')
  const [socials, setSocials]     = useState<SocialAccount[]>([])
  const [connectedPlatforms, setConnectedPlatforms] = useState<string[]>([])
  const [form, setForm]           = useState({ name: '', description: '', audience: '', niche: '', tone: 'professional' })
  const supabase = createClient()
  const router   = useRouter()
  const params   = useSearchParams()

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
      if (socialData) setSocials(socialData)

      // Check Ayrshare connected platforms
      const statusRes = await fetch('/api/social/ayrshare/status')
      const statusData = await statusRes.json()
      if (statusData.platforms) setConnectedPlatforms(statusData.platforms)

      setLoading(false)

      // Show connection toasts
      const connected = params.get('connected')
      const error     = params.get('error')
      if (connected === 'social') setToast('✅ Social accounts connected!')
      if (connected === 'twitter')  setToast('✅ Twitter/X connected!')
      if (connected === 'linkedin') setToast('✅ LinkedIn connected!')
      if (error) setToast(`❌ ${error.replace(/_/g,' ')}`)
      if (connected || error) setTimeout(() => setToast(''), 4000)
    })
  }, [])

  const save = async () => {
    if (!user || !form.name || !form.description) return
    setSaving(true)
    await supabase.from('postpilot_businesses').update({ name: form.name, description: form.description, audience: form.audience, niche: form.niche, tone: form.tone }).eq('user_id', user.id)
    setSaving(false); setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const disconnect = async (platform: string) => {
    await supabase.from('postpilot_social_accounts').delete().eq('user_id', user!.id).eq('platform', platform)
    setSocials(s => s.filter(x => x.platform !== platform))
  }

  const getAccount = (p: string) => socials.find(s => s.platform === p)
  const logout = async () => { await supabase.auth.signOut(); router.push('/') }

  if (loading) return <div style={{ background:'#050510', minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', color:'rgba(255,255,255,0.3)', fontFamily:'sans-serif' }}>Loading...</div>

  const inputStyle: React.CSSProperties = { width:'100%', background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:'10px', padding:'12px 14px', color:'#fff', fontSize:'14px', outline:'none', boxSizing:'border-box' }
  const labelStyle: React.CSSProperties = { fontSize:'12px', fontWeight:600, color:'rgba(255,255,255,0.5)', display:'block', marginBottom:'7px', textTransform:'uppercase', letterSpacing:'0.5px' }

  const PLATFORMS = [
    { id: 'twitter',   label: 'Twitter / X', icon: '𝕏',  color: 'rgba(29,161,242,0.12)',  border: 'rgba(29,161,242,0.25)' },
    { id: 'linkedin',  label: 'LinkedIn',    icon: 'in',  color: 'rgba(10,102,194,0.12)',  border: 'rgba(10,102,194,0.25)' },
    { id: 'instagram', label: 'Instagram',   icon: '📸', color: 'rgba(225,48,108,0.08)', border: 'rgba(225,48,108,0.2)' },
    { id: 'facebook',  label: 'Facebook',    icon: 'f',   color: 'rgba(24,119,242,0.08)',  border: 'rgba(24,119,242,0.2)' },
  ]

  return (
    <div style={{ fontFamily:'-apple-system,BlinkMacSystemFont,"Inter",sans-serif', background:'#050510', color:'#fff', minHeight:'100vh' }}>
      {/* Toast */}
      {toast && (
        <div style={{ position:'fixed', top:'20px', right:'20px', background:toast.startsWith('✅') ? 'rgba(34,197,94,0.12)' : 'rgba(239,68,68,0.12)', border:`1px solid ${toast.startsWith('✅') ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}`, color:toast.startsWith('✅') ? '#22c55e' : '#ef4444', padding:'12px 18px', borderRadius:'10px', fontSize:'13px', fontWeight:600, zIndex:999 }}>
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
        <div style={{ display:'flex', gap:'8px' }}>
          {plan === 'pro' && <span style={{ fontSize:'11px', background:'rgba(124,58,237,0.15)', color:'#a78bfa', border:'1px solid rgba(124,58,237,0.3)', padding:'3px 10px', borderRadius:'100px', fontWeight:700 }}>PRO</span>}
          <Link href="/dashboard" style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.07)', color:'rgba(255,255,255,0.4)', padding:'7px 14px', borderRadius:'7px', fontSize:'12px', textDecoration:'none' }}>← Dashboard</Link>
          <button onClick={logout} style={{ background:'transparent', border:'1px solid rgba(255,255,255,0.07)', color:'rgba(255,255,255,0.3)', padding:'5px 12px', borderRadius:'6px', fontSize:'11px', cursor:'pointer' }}>Sign out</button>
        </div>
      </nav>

      <div style={{ maxWidth:'680px', margin:'0 auto', padding:'40px 28px' }}>

        {/* ── SOCIAL ACCOUNTS ─────────────────────────────────────────── */}
        <h2 style={{ fontSize:'18px', fontWeight:800, marginBottom:'6px' }}>Social Accounts</h2>
        <p style={{ color:'rgba(255,255,255,0.35)', fontSize:'13px', marginBottom:'20px' }}>Connect your accounts to post directly from PostPilot.</p>

        {/* Platform status grid */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'8px', marginBottom:'16px' }}>
          {PLATFORMS.map(p => {
            const isConnected = connectedPlatforms.map(x => x.toLowerCase()).includes(p.id)
            return (
              <div key={p.id} style={{ background: isConnected ? p.color : 'rgba(255,255,255,0.02)', border:`1px solid ${isConnected ? p.border : 'rgba(255,255,255,0.05)'}`, borderRadius:'12px', padding:'14px 16px', display:'flex', alignItems:'center', gap:'10px' }}>
                <div style={{ background:p.color, border:`1px solid ${p.border}`, borderRadius:'7px', width:'32px', height:'32px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'12px', fontWeight:800, flexShrink:0 }}>{p.icon}</div>
                <div>
                  <p style={{ margin:'0 0 2px', fontWeight:600, fontSize:'13px' }}>{p.label}</p>
                  <p style={{ margin:0, fontSize:'11px', color: isConnected ? '#a3e635' : 'rgba(255,255,255,0.25)' }}>
                    {isConnected ? '✓ Connected' : 'Not connected'}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Single connect button via Ayrshare */}
        <div style={{ background:'rgba(124,58,237,0.06)', border:'1px solid rgba(124,58,237,0.15)', borderRadius:'14px', padding:'20px', marginBottom:'36px' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'12px', marginBottom:'12px' }}>
            <span style={{ fontSize:'22px' }}>🔗</span>
            <div>
              <p style={{ margin:'0 0 2px', fontWeight:700, fontSize:'14px' }}>Connect your social accounts</p>
              <p style={{ margin:0, fontSize:'12px', color:'rgba(255,255,255,0.4)' }}>Login to Twitter, LinkedIn, Instagram and Facebook in one step</p>
            </div>
          </div>
          <a href="https://app.ayrshare.com/dashboard/social-accounts" target="_blank" rel="noreferrer"
            style={{ display:'inline-block', background:'linear-gradient(135deg,#7c3aed,#2563eb)', color:'#fff', padding:'11px 24px', borderRadius:'9px', fontWeight:700, fontSize:'13px', textDecoration:'none' }}>
            {connectedPlatforms.length > 0 ? '⚙️ Manage connected accounts ↗' : '🔗 Connect accounts ↗'}
          </a>
          <p style={{ margin:'8px 0 0', fontSize:'11px', color:'rgba(255,255,255,0.25)' }}>Opens Ayrshare — connect Twitter, LinkedIn, Instagram once. PostPilot posts for you.</p>
          {connectedPlatforms.length > 0 && (
            <p style={{ margin:'10px 0 0', fontSize:'12px', color:'rgba(255,255,255,0.35)' }}>
              {connectedPlatforms.length} platform{connectedPlatforms.length !== 1 ? 's' : ''} connected: {connectedPlatforms.join(', ')}
            </p>
          )}
        </div>

        {/* ── BUSINESS PROFILE ────────────────────────────────────────── */}
        <h2 style={{ fontSize:'18px', fontWeight:800, marginBottom:'6px' }}>Business Profile</h2>
        <p style={{ color:'rgba(255,255,255,0.35)', fontSize:'13px', marginBottom:'20px', lineHeight:1.6 }}>
          PostPilot reads this every time it generates content. The more specific, the better the posts.
        </p>

        <div style={{ background:'rgba(124,58,237,0.06)', border:'1px solid rgba(124,58,237,0.15)', borderRadius:'12px', padding:'14px 18px', marginBottom:'24px', display:'flex', gap:'12px' }}>
          <span style={{ fontSize:'18px', flexShrink:0 }}>🤖</span>
          <p style={{ fontSize:'12px', color:'rgba(255,255,255,0.45)', lineHeight:1.65, margin:0 }}>
            Your description, audience and tone are injected directly into the AI prompt. Every post is written for your brand. Update anytime — next generation reflects it instantly.
          </p>
        </div>

        <div style={{ display:'flex', flexDirection:'column', gap:'16px' }}>
          <div>
            <label style={labelStyle}>Business name</label>
            <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. bilabs.ai" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>What you do <span style={{ color:'rgba(255,255,255,0.25)', fontWeight:400, textTransform:'none' }}>(most important field)</span></label>
            <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="e.g. AI automation agency helping UK small businesses save 10+ hours/week with chatbots, voice assistants and workflow automation" rows={3} style={{ ...inputStyle, resize:'vertical', lineHeight:1.6 }} />
          </div>
          <div>
            <label style={labelStyle}>Target audience</label>
            <input value={form.audience} onChange={e => setForm(f => ({ ...f, audience: e.target.value }))} placeholder="e.g. UK small business owners, recruiters, mortgage brokers" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Industry / niche</label>
            <input value={form.niche} onChange={e => setForm(f => ({ ...f, niche: e.target.value }))} placeholder="e.g. AI automation, SaaS, fintech, e-commerce" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Brand tone</label>
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
            style={{ background:saved ? 'rgba(34,197,94,0.1)' : 'linear-gradient(135deg,#7c3aed,#2563eb)', border:saved ? '1px solid rgba(34,197,94,0.3)' : 'none', color:saved ? '#22c55e' : '#fff', padding:'14px', borderRadius:'10px', fontSize:'14px', fontWeight:700, cursor:'pointer' }}>
            {saving ? 'Saving...' : saved ? '✓ Saved! Next generation uses updated profile.' : 'Save changes'}
          </button>
        </div>
      </div>
    </div>
  )
}
