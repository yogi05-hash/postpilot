'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase-browser'
import { useRouter } from 'next/navigation'

export default function Onboarding() {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({ name: '', description: '', audience: '', niche: '', tone: 'professional' })
  const [loading, setLoading] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  const save = async () => {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }
    await supabase.from('postpilot_businesses').upsert({ user_id: user.id, ...form })
    router.push('/dashboard')
  }

  const inp: React.CSSProperties = { width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '9px', padding: '12px 16px', color: '#fff', fontSize: '15px', boxSizing: 'border-box', fontFamily: 'inherit' }
  const ta: React.CSSProperties = { ...inp, resize: 'vertical', minHeight: '90px' }

  return (
    <div style={{ fontFamily: '-apple-system,sans-serif', background: '#070711', color: '#fff', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
      <div style={{ width: '100%', maxWidth: '520px' }}>
        {/* Progress */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '40px', justifyContent: 'center' }}>
          {[1,2,3].map(i => (
            <div key={i} style={{ height: '3px', flex: 1, borderRadius: '100px', background: i <= step ? 'linear-gradient(135deg,#7c3aed,#2563eb)' : 'rgba(255,255,255,0.1)' }}></div>
          ))}
        </div>

        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '24px', padding: '48px' }}>
          {step === 1 && (
            <>
              <p style={{ fontSize: '12px', color: '#7c3aed', fontWeight: 700, letterSpacing: '1px', marginBottom: '12px' }}>STEP 1 OF 3</p>
              <h1 style={{ fontSize: '26px', fontWeight: 800, letterSpacing: '-0.5px', marginBottom: '8px' }}>Tell us about your business</h1>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px', marginBottom: '32px' }}>This is the foundation. PostPilot never forgets it.</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                <div>
                  <label style={{ fontSize: '12px', color: 'rgba(255,255,255,0.45)', display: 'block', marginBottom: '7px', fontWeight: 500 }}>Business name</label>
                  <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="e.g. bilabs.ai" style={inp} />
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: 'rgba(255,255,255,0.45)', display: 'block', marginBottom: '7px', fontWeight: 500 }}>What do you do? (be specific)</label>
                  <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="e.g. AI automation agency helping UK small businesses save time with chatbots, voice assistants and workflow automation" style={ta} />
                </div>
              </div>
              <button onClick={() => form.name && form.description && setStep(2)} disabled={!form.name || !form.description}
                style={{ marginTop: '28px', background: 'linear-gradient(135deg,#7c3aed,#2563eb)', color: '#fff', border: 'none', padding: '13px 28px', borderRadius: '9px', fontWeight: 700, fontSize: '15px', cursor: !form.name || !form.description ? 'not-allowed' : 'pointer', opacity: !form.name || !form.description ? 0.5 : 1 }}>
                Continue →
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <p style={{ fontSize: '12px', color: '#7c3aed', fontWeight: 700, letterSpacing: '1px', marginBottom: '12px' }}>STEP 2 OF 3</p>
              <h1 style={{ fontSize: '26px', fontWeight: 800, letterSpacing: '-0.5px', marginBottom: '8px' }}>Who are you talking to?</h1>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px', marginBottom: '32px' }}>The more specific, the better the content.</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                <div>
                  <label style={{ fontSize: '12px', color: 'rgba(255,255,255,0.45)', display: 'block', marginBottom: '7px', fontWeight: 500 }}>Your target audience</label>
                  <textarea value={form.audience} onChange={e => setForm(p => ({ ...p, audience: e.target.value }))} placeholder="e.g. UK small business owners (5-50 staff), particularly recruiters, mortgage brokers, insurance brokers" style={ta} />
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: 'rgba(255,255,255,0.45)', display: 'block', marginBottom: '7px', fontWeight: 500 }}>Your niche / industry</label>
                  <input value={form.niche} onChange={e => setForm(p => ({ ...p, niche: e.target.value }))} placeholder="e.g. AI automation, SaaS, fintech, e-commerce" style={inp} />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '28px' }}>
                <button onClick={() => setStep(1)} style={{ border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: 'rgba(255,255,255,0.5)', padding: '13px 20px', borderRadius: '9px', fontWeight: 600, fontSize: '14px', cursor: 'pointer' }}>← Back</button>
                <button onClick={() => form.audience && form.niche && setStep(3)} disabled={!form.audience || !form.niche}
                  style={{ flex: 1, background: 'linear-gradient(135deg,#7c3aed,#2563eb)', color: '#fff', border: 'none', padding: '13px', borderRadius: '9px', fontWeight: 700, fontSize: '15px', cursor: !form.audience || !form.niche ? 'not-allowed' : 'pointer', opacity: !form.audience || !form.niche ? 0.5 : 1 }}>
                  Continue →
                </button>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <p style={{ fontSize: '12px', color: '#7c3aed', fontWeight: 700, letterSpacing: '1px', marginBottom: '12px' }}>STEP 3 OF 3</p>
              <h1 style={{ fontSize: '26px', fontWeight: 800, letterSpacing: '-0.5px', marginBottom: '8px' }}>What&apos;s your tone?</h1>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px', marginBottom: '32px' }}>PostPilot will write in your voice every time.</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                {[
                  { value: 'professional', label: '🎯 Professional', desc: 'Authoritative, credible' },
                  { value: 'friendly', label: '😊 Friendly', desc: 'Warm, approachable' },
                  { value: 'bold', label: '🔥 Bold', desc: 'Direct, provocative' },
                  { value: 'educational', label: '📚 Educational', desc: 'Informative, helpful' },
                ].map(t => (
                  <button key={t.value} onClick={() => setForm(p => ({ ...p, tone: t.value }))}
                    style={{ background: form.tone === t.value ? 'rgba(124,58,237,0.2)' : 'rgba(255,255,255,0.03)', border: `1px solid ${form.tone === t.value ? '#7c3aed' : 'rgba(255,255,255,0.08)'}`, borderRadius: '12px', padding: '16px', textAlign: 'left', cursor: 'pointer', color: '#fff' }}>
                    <p style={{ fontSize: '15px', fontWeight: 600, marginBottom: '4px' }}>{t.label}</p>
                    <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>{t.desc}</p>
                  </button>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '28px' }}>
                <button onClick={() => setStep(2)} style={{ border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: 'rgba(255,255,255,0.5)', padding: '13px 20px', borderRadius: '9px', fontWeight: 600, fontSize: '14px', cursor: 'pointer' }}>← Back</button>
                <button onClick={save} disabled={loading}
                  style={{ flex: 1, background: 'linear-gradient(135deg,#7c3aed,#2563eb)', color: '#fff', border: 'none', padding: '13px', borderRadius: '9px', fontWeight: 700, fontSize: '15px', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}>
                  {loading ? 'Setting up...' : '🚀 Generate my first posts'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
