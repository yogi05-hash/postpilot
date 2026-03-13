'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase-browser'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

type Post = { id: string; platform: string; content: string; status: string; created_at: string }
type Business = { id: string; name: string; description: string; audience: string; niche: string; tone: string }

const P_ICON: Record<string,string>  = { twitter:'𝕏', linkedin:'in', instagram:'📸' }
const P_COLOR: Record<string,string> = { twitter:'rgba(29,161,242,0.15)', linkedin:'rgba(10,102,194,0.15)', instagram:'rgba(225,48,108,0.15)' }
const P_LABEL: Record<string,string> = { twitter:'Twitter/X', linkedin:'LinkedIn', instagram:'Instagram' }
const P_MAX: Record<string,number>   = { twitter:280, linkedin:3000, instagram:2200 }

const HASHTAGS: Record<string,string[]> = {
  twitter:   ['#AI','#SmallBusiness','#Entrepreneur','#GrowthHacking','#StartupLife'],
  linkedin:  ['#AIAutomation','#SmallBusiness','#BusinessGrowth','#Entrepreneurship','#DigitalMarketing'],
  instagram: ['#aiautomation','#smallbusiness','#entrepreneur','#businesstips','#growthhacking','#digitalmarketing','#startup'],
}

export default function DashboardClient() {
  const [user, setUser]             = useState<{ id:string; email?:string }|null>(null)
  const [plan, setPlan]             = useState('free')
  const [business, setBusiness]     = useState<Business|null>(null)
  const [posts, setPosts]           = useState<Post[]>([])
  const [loading, setLoading]       = useState(true)
  const [generating, setGenerating] = useState(false)
  const [upgraded, setUpgraded]     = useState(false)
  const [filter, setFilter]         = useState<string>('all')
  const [view, setView]             = useState<'list'|'calendar'>('list')
  const [copied, setCopied]         = useState<string|null>(null)
  const [expanding, setExpanding]   = useState<string|null>(null)
  const supabase = createClient()
  const router   = useRouter()
  const params   = useSearchParams()

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) { router.push('/login'); return }
      setUser(user)
      if (params.get('upgraded') === 'true') setUpgraded(true)
      const [{ data: profile }, { data: biz }, { data: postsData }] = await Promise.all([
        supabase.from('postpilot_profiles').select('plan').eq('id', user.id).single(),
        supabase.from('postpilot_businesses').select('*').eq('user_id', user.id).single(),
        supabase.from('postpilot_posts').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(60),
      ])
      if (profile) setPlan(profile.plan)
      if (biz) setBusiness(biz)
      else { router.push('/dashboard/onboarding'); return }
      if (postsData) setPosts(postsData)
      setLoading(false)
    })
  }, [])

  const generate = async () => {
    if (!business) return
    setGenerating(true)
    try {
      const res  = await fetch('/api/generate', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ business }) })
      const data = await res.json()
      if (data.posts) {
        const { data: fresh } = await supabase.from('postpilot_posts').select('*').eq('user_id', user!.id).order('created_at', { ascending:false }).limit(60)
        if (fresh) setPosts(fresh)
      }
    } finally { setGenerating(false) }
  }

  const updateStatus = async (id: string, status: string) => {
    await supabase.from('postpilot_posts').update({ status }).eq('id', id)
    setPosts(p => p.map(x => x.id === id ? { ...x, status } : x))
  }

  const copyPost = (id: string, content: string) => {
    navigator.clipboard?.writeText(content)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  const logout = async () => { await supabase.auth.signOut(); router.push('/') }

  const addHashtags = async (id: string, platform: string, content: string) => {
    const tags = HASHTAGS[platform] ?? HASHTAGS.twitter
    const newContent = content + '\n\n' + tags.join(' ')
    await supabase.from('postpilot_posts').update({ content: newContent }).eq('id', id)
    setPosts(p => p.map(x => x.id === id ? { ...x, content: newContent } : x))
  }

  const handleUpgrade = async () => {
    const res   = await fetch('/api/stripe/checkout', { method:'POST' })
    const { url } = await res.json()
    if (url) window.location.href = url
  }

  const filtered  = filter === 'all' ? posts : posts.filter(p => p.status === filter)
  const pending   = posts.filter(p => p.status === 'pending').length
  const approved  = posts.filter(p => p.status === 'approved').length
  const thisWeek  = posts.filter(p => new Date(p.created_at) > new Date(Date.now() - 7*24*60*60*1000)).length

  // ── Calendar grouping by day ───────────────────────────────────────────────
  const calendarPosts: Record<string,Post[]> = {}
  posts.filter(p => p.status !== 'rejected').forEach(p => {
    const day = new Date(p.created_at).toLocaleDateString('en-GB',{ weekday:'short', day:'numeric', month:'short' })
    if (!calendarPosts[day]) calendarPosts[day] = []
    calendarPosts[day].push(p)
  })

  if (loading) return <div style={{ background:'#050510', minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', color:'rgba(255,255,255,0.3)', fontFamily:'sans-serif' }}>Loading PostPilot...</div>

  return (
    <div style={{ fontFamily:'-apple-system,BlinkMacSystemFont,"Inter",sans-serif', background:'#050510', color:'#fff', minHeight:'100vh' }}>
      {/* NAV */}
      <nav style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 32px', borderBottom:'1px solid rgba(255,255,255,0.05)', background:'rgba(5,5,16,0.95)', backdropFilter:'blur(20px)', position:'sticky', top:0, zIndex:100 }}>
        <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
          <span style={{ fontSize:'16px' }}>🚀</span>
          <span style={{ fontSize:'15px', fontWeight:800, background:'linear-gradient(135deg,#a78bfa,#60a5fa)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>PostPilot</span>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
          {plan === 'pro'
            ? <span style={{ fontSize:'11px', background:'rgba(124,58,237,0.15)', color:'#a78bfa', border:'1px solid rgba(124,58,237,0.3)', padding:'3px 10px', borderRadius:'100px', fontWeight:700 }}>PRO</span>
            : <button onClick={handleUpgrade} style={{ background:'linear-gradient(135deg,#7c3aed,#2563eb)', color:'#fff', border:'none', padding:'7px 16px', borderRadius:'7px', fontSize:'12px', fontWeight:700, cursor:'pointer' }}>Upgrade £14/mo</button>
          }
          <span style={{ fontSize:'12px', color:'rgba(255,255,255,0.3)' }}>{user?.email}</span>
          <button onClick={logout} style={{ background:'transparent', border:'1px solid rgba(255,255,255,0.07)', color:'rgba(255,255,255,0.3)', padding:'5px 12px', borderRadius:'6px', fontSize:'11px', cursor:'pointer' }}>Sign out</button>
        </div>
      </nav>

      <div style={{ maxWidth:'980px', margin:'0 auto', padding:'32px 28px' }}>
        {upgraded && (
          <div style={{ background:'rgba(124,58,237,0.08)', border:'1px solid rgba(124,58,237,0.2)', borderRadius:'12px', padding:'14px 18px', marginBottom:'20px', display:'flex', alignItems:'center', gap:'10px' }}>
            <span style={{ fontSize:'18px' }}>🎉</span>
            <p style={{ margin:0, fontSize:'13px', color:'#a78bfa', fontWeight:500 }}>Welcome to Pro! Unlimited generation active.</p>
          </div>
        )}

        {/* Header */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'24px', flexWrap:'wrap', gap:'12px' }}>
          <div>
            <h1 style={{ fontSize:'22px', fontWeight:800, letterSpacing:'-0.5px', margin:'0 0 4px' }}>Content Dashboard</h1>
            <p style={{ color:'rgba(255,255,255,0.35)', fontSize:'13px', margin:0 }}>{business?.name} · {plan === 'pro' ? 'Pro Plan' : 'Free Plan'}</p>
          </div>
          <div style={{ display:'flex', gap:'8px' }}>
            <button onClick={() => setView(v => v === 'list' ? 'calendar' : 'list')}
              style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.07)', color:'rgba(255,255,255,0.5)', padding:'9px 16px', borderRadius:'9px', fontSize:'13px', cursor:'pointer' }}>
              {view === 'list' ? '📅 Calendar' : '📋 List'}
            </button>
            <button onClick={generate} disabled={generating}
              style={{ background:generating ? 'rgba(255,255,255,0.04)' : 'linear-gradient(135deg,#7c3aed,#2563eb)', color:'#fff', border:'none', padding:'9px 20px', borderRadius:'9px', fontWeight:700, fontSize:'13px', cursor:generating ? 'not-allowed' : 'pointer', display:'flex', alignItems:'center', gap:'6px' }}>
              {generating ? '✨ Generating...' : '✨ Generate posts'}
            </button>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'12px', marginBottom:'24px' }}>
          {[
            { label:'Total posts', value:posts.length, highlight:false },
            { label:'Awaiting review', value:pending, highlight:pending > 0 },
            { label:'Approved', value:approved, highlight:false },
            { label:'This week', value:thisWeek, highlight:false },
          ].map(s => (
            <div key={s.label} style={{ background:'rgba(255,255,255,0.03)', border:`1px solid ${s.highlight ? 'rgba(124,58,237,0.3)' : 'rgba(255,255,255,0.05)'}`, borderRadius:'12px', padding:'16px' }}>
              <p style={{ fontSize:'10px', color:'rgba(255,255,255,0.3)', margin:'0 0 6px', textTransform:'uppercase', letterSpacing:'0.5px' }}>{s.label}</p>
              <p style={{ fontSize:'24px', fontWeight:800, margin:0, color:s.highlight ? '#a78bfa' : '#fff' }}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* ── CALENDAR VIEW ────────────────────────────────────────────────── */}
        {view === 'calendar' && (
          <div>
            <p style={{ fontSize:'13px', color:'rgba(255,255,255,0.35)', marginBottom:'16px' }}>Posts grouped by date — approved and pending</p>
            {Object.entries(calendarPosts).length === 0
              ? <div style={{ textAlign:'center', padding:'60px', color:'rgba(255,255,255,0.2)' }}><p style={{ fontSize:'40px', marginBottom:'12px' }}>📅</p><p>No posts yet. Generate your first batch.</p></div>
              : Object.entries(calendarPosts).map(([day, dayPosts]) => (
                <div key={day} style={{ marginBottom:'20px' }}>
                  <p style={{ fontSize:'12px', color:'rgba(255,255,255,0.4)', fontWeight:700, letterSpacing:'0.5px', marginBottom:'8px', textTransform:'uppercase' }}>{day}</p>
                  <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'10px' }}>
                    {dayPosts.map(p => (
                      <div key={p.id} style={{ background:'rgba(255,255,255,0.02)', border:`1px solid ${p.status === 'approved' ? 'rgba(34,197,94,0.2)' : 'rgba(255,255,255,0.06)'}`, borderRadius:'12px', padding:'14px' }}>
                        <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'8px' }}>
                          <span style={{ fontSize:'11px', fontWeight:700, color:'rgba(255,255,255,0.4)' }}>{P_LABEL[p.platform] || p.platform}</span>
                          <span style={{ fontSize:'10px', color:p.status === 'approved' ? '#22c55e' : p.status === 'rejected' ? '#ef4444' : '#f59e0b', fontWeight:600, textTransform:'uppercase' }}>{p.status}</span>
                        </div>
                        <p style={{ fontSize:'12px', color:'rgba(255,255,255,0.6)', lineHeight:1.55, margin:'0 0 10px', display:'-webkit-box', WebkitLineClamp:3, WebkitBoxOrient:'vertical', overflow:'hidden' } as React.CSSProperties}>{p.content}</p>
                        {p.status === 'pending' && (
                          <div style={{ display:'flex', gap:'6px' }}>
                            <button onClick={() => updateStatus(p.id,'approved')} style={{ flex:1, background:'rgba(34,197,94,0.1)', border:'1px solid rgba(34,197,94,0.2)', color:'#22c55e', padding:'5px', borderRadius:'6px', fontSize:'11px', fontWeight:700, cursor:'pointer' }}>✓</button>
                            <button onClick={() => updateStatus(p.id,'rejected')} style={{ flex:1, background:'rgba(239,68,68,0.08)', border:'1px solid rgba(239,68,68,0.15)', color:'#ef4444', padding:'5px', borderRadius:'6px', fontSize:'11px', cursor:'pointer' }}>✗</button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))
            }
          </div>
        )}

        {/* ── LIST VIEW ────────────────────────────────────────────────────── */}
        {view === 'list' && (
          <>
            {/* Filter tabs */}
            <div style={{ display:'flex', gap:'6px', marginBottom:'16px' }}>
              {['all','pending','approved','rejected'].map(f => (
                <button key={f} onClick={() => setFilter(f)}
                  style={{ background:filter === f ? 'rgba(124,58,237,0.15)' : 'transparent', border:`1px solid ${filter === f ? 'rgba(124,58,237,0.35)' : 'rgba(255,255,255,0.06)'}`, color:filter === f ? '#a78bfa' : 'rgba(255,255,255,0.35)', padding:'6px 14px', borderRadius:'8px', fontSize:'12px', fontWeight:filter === f ? 600 : 400, cursor:'pointer', textTransform:'capitalize' }}>
                  {f}
                </button>
              ))}
            </div>

            {filtered.length === 0 ? (
              <div style={{ textAlign:'center', padding:'70px', color:'rgba(255,255,255,0.2)' }}>
                <p style={{ fontSize:'40px', marginBottom:'12px' }}>✍️</p>
                <p style={{ fontSize:'15px', fontWeight:500, marginBottom:'6px' }}>{posts.length === 0 ? 'No posts yet' : `No ${filter} posts`}</p>
                {posts.length === 0 && <p style={{ fontSize:'13px' }}>Hit &quot;Generate posts&quot; to get your first week of content</p>}
              </div>
            ) : (
              <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
                {filtered.map(post => {
                  const isExpanded = expanding === post.id
                  const charCount  = post.content.length
                  const maxChars   = P_MAX[post.platform] || 3000
                  const charPct    = Math.min(100, (charCount / maxChars) * 100)
                  return (
                    <div key={post.id} style={{ background:post.status === 'approved' ? 'rgba(124,58,237,0.04)' : 'rgba(255,255,255,0.02)', border:`1px solid ${post.status === 'approved' ? 'rgba(124,58,237,0.15)' : post.status === 'rejected' ? 'rgba(248,113,113,0.1)' : 'rgba(255,255,255,0.06)'}`, borderRadius:'14px', padding:'16px 18px' }}>
                      <div style={{ display:'flex', alignItems:'flex-start', gap:'12px' }}>
                        {/* Platform badge */}
                        <div style={{ background:P_COLOR[post.platform] || 'rgba(255,255,255,0.07)', borderRadius:'8px', padding:'7px 10px', fontSize:'12px', fontWeight:700, flexShrink:0, minWidth:'68px', textAlign:'center' }}>
                          {P_ICON[post.platform] || post.platform}
                          <div style={{ fontSize:'9px', color:'rgba(255,255,255,0.35)', marginTop:'2px', fontWeight:400 }}>{P_LABEL[post.platform]}</div>
                        </div>

                        <div style={{ flex:1, minWidth:0 }}>
                          {/* Content */}
                          <p style={{ fontSize:'13px', color:post.status === 'rejected' ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.75)', lineHeight:1.65, margin:'0 0 10px', textDecoration:post.status === 'rejected' ? 'line-through' : 'none', display:isExpanded ? 'block' : '-webkit-box', WebkitLineClamp:isExpanded ? undefined : 3, WebkitBoxOrient:'vertical', overflow:isExpanded ? 'visible' : 'hidden' } as React.CSSProperties}>
                            {post.content}
                          </p>

                          {/* Char counter */}
                          <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'10px' }}>
                            <div style={{ flex:1, height:'2px', background:'rgba(255,255,255,0.06)', borderRadius:'1px', overflow:'hidden' }}>
                              <div style={{ height:'100%', width:`${charPct}%`, background:charPct > 90 ? '#ef4444' : '#7c3aed', borderRadius:'1px' }} />
                            </div>
                            <span style={{ fontSize:'10px', color:'rgba(255,255,255,0.25)', whiteSpace:'nowrap' }}>{charCount}/{maxChars}</span>
                          </div>

                          {/* Actions */}
                          <div style={{ display:'flex', gap:'6px', flexWrap:'wrap' }}>
                            {post.status === 'pending' && <>
                              <button onClick={() => updateStatus(post.id,'approved')} style={{ background:'linear-gradient(135deg,#7c3aed,#2563eb)', color:'#fff', border:'none', padding:'6px 14px', borderRadius:'7px', fontSize:'12px', fontWeight:700, cursor:'pointer' }}>✓ Approve</button>
                              <button onClick={() => updateStatus(post.id,'rejected')} style={{ background:'rgba(239,68,68,0.08)', color:'#ef4444', border:'1px solid rgba(239,68,68,0.15)', padding:'6px 12px', borderRadius:'7px', fontSize:'12px', cursor:'pointer' }}>✗ Reject</button>
                            </>}
                            {post.status === 'approved' && <span style={{ fontSize:'11px', color:'#a78bfa', fontWeight:600, alignSelf:'center' }}>✓ Approved</span>}
                            {post.status === 'rejected' && <button onClick={() => updateStatus(post.id,'pending')} style={{ background:'transparent', color:'rgba(255,255,255,0.3)', border:'1px solid rgba(255,255,255,0.08)', padding:'6px 12px', borderRadius:'7px', fontSize:'12px', cursor:'pointer' }}>Restore</button>}

                            <button onClick={() => copyPost(post.id, post.content)}
                              style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', color:copied === post.id ? '#22c55e' : 'rgba(255,255,255,0.4)', padding:'6px 12px', borderRadius:'7px', fontSize:'12px', cursor:'pointer' }}>
                              {copied === post.id ? '✓ Copied' : '📋 Copy'}
                            </button>
                            <button onClick={() => addHashtags(post.id, post.platform, post.content)}
                              style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', color:'rgba(255,255,255,0.4)', padding:'6px 12px', borderRadius:'7px', fontSize:'12px', cursor:'pointer' }}>
                              #️⃣ Add hashtags
                            </button>
                            <button onClick={() => setExpanding(expanding === post.id ? null : post.id)}
                              style={{ background:'transparent', border:'none', color:'rgba(255,255,255,0.3)', padding:'6px 8px', fontSize:'11px', cursor:'pointer' }}>
                              {isExpanded ? '▲ Less' : '▼ More'}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </>
        )}

        {/* Platform tips footer */}
        <div style={{ marginTop:'32px', display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'10px' }}>
          {[
            { icon:'𝕏', platform:'Twitter/X', tip:'Best time: 8am & 6pm. Hooks in first line. No hashtag spam.' },
            { icon:'in', platform:'LinkedIn', tip:'Long-form gets 3× reach. Ask questions. Post Tue-Thu.' },
            { icon:'📸', platform:'Instagram', tip:'Line breaks matter. 5-10 hashtags. Stories drive profile visits.' },
          ].map(t => (
            <div key={t.platform} style={{ background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.05)', borderRadius:'12px', padding:'14px' }}>
              <p style={{ fontSize:'12px', fontWeight:700, marginBottom:'4px' }}>{t.icon} {t.platform}</p>
              <p style={{ fontSize:'11px', color:'rgba(255,255,255,0.35)', lineHeight:1.5 }}>{t.tip}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
