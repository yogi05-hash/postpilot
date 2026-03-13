import Link from 'next/link'

const f = (style: React.CSSProperties) => style

export default function Home() {
  return (
    <div style={{ fontFamily: '-apple-system,BlinkMacSystemFont,"Inter",sans-serif', background: '#070711', color: '#fff', minHeight: '100vh' }}>

      {/* NAV */}
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 64px', borderBottom: '1px solid rgba(255,255,255,0.05)', position: 'sticky', top: 0, background: 'rgba(7,7,17,0.85)', backdropFilter: 'blur(24px)', zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '22px' }}>🚀</span>
          <span style={{ fontSize: '18px', fontWeight: 800, letterSpacing: '-0.5px', background: 'linear-gradient(135deg,#a78bfa,#60a5fa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>PostPilot</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
          <Link href="#how" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none', fontSize: '14px' }}>How it works</Link>
          <Link href="/pricing" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none', fontSize: '14px' }}>Pricing</Link>
          <Link href="/login" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none', fontSize: '14px' }}>Sign in</Link>
          <Link href="/signup" style={{ background: 'linear-gradient(135deg,#7c3aed,#2563eb)', color: '#fff', padding: '9px 20px', borderRadius: '8px', textDecoration: 'none', fontSize: '14px', fontWeight: 600 }}>Get started free</Link>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ maxWidth: '900px', margin: '0 auto', padding: '110px 40px 80px', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.3)', borderRadius: '100px', padding: '6px 16px', marginBottom: '32px' }}>
          <span style={{ width: '6px', height: '6px', background: '#a78bfa', borderRadius: '50%', display: 'inline-block' }}></span>
          <span style={{ fontSize: '12px', color: '#a78bfa', fontWeight: 600 }}>AI-powered · Learns from your engagement · All platforms</span>
        </div>

        <h1 style={{ fontSize: '72px', fontWeight: 900, lineHeight: 1.0, letterSpacing: '-3px', marginBottom: '28px' }}>
          <span style={{ background: 'linear-gradient(180deg,#fff 0%,rgba(255,255,255,0.6) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Stop writing content.</span>
          <br />
          <span style={{ background: 'linear-gradient(135deg,#a78bfa,#60a5fa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Start approving it.</span>
        </h1>

        <p style={{ fontSize: '21px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.7, maxWidth: '560px', margin: '0 auto 52px' }}>
          Describe your business once. PostPilot researches your niche, writes a week of content for Twitter, LinkedIn & Instagram, and drops it in your inbox every Monday.
        </p>

        <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/signup" style={{ background: 'linear-gradient(135deg,#7c3aed,#2563eb)', color: '#fff', padding: '15px 32px', borderRadius: '10px', textDecoration: 'none', fontSize: '16px', fontWeight: 700, letterSpacing: '-0.3px', boxShadow: '0 0 40px rgba(124,58,237,0.4)' }}>
            Start free — no credit card →
          </Link>
          <Link href="/dashboard" style={{ border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.7)', padding: '15px 32px', borderRadius: '10px', textDecoration: 'none', fontSize: '16px', fontWeight: 500 }}>
            See demo
          </Link>
        </div>

        {/* Social proof */}
        <div style={{ display: 'flex', gap: '40px', justifyContent: 'center', marginTop: '60px', flexWrap: 'wrap' }}>
          {['✦ 3 hours/week saved', '✦ Works for any niche', '✦ Posts improve weekly'].map(t => (
            <span key={t} style={{ fontSize: '13px', color: 'rgba(255,255,255,0.35)', fontWeight: 500 }}>{t}</span>
          ))}
        </div>
      </section>

      {/* PRODUCT MOCKUP */}
      <section style={{ maxWidth: '960px', margin: '0 auto 100px', padding: '0 40px' }}>
        <div style={{ background: 'linear-gradient(135deg,rgba(124,58,237,0.08),rgba(37,99,235,0.08))', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 40px 120px rgba(124,58,237,0.15)' }}>
          {/* Window chrome */}
          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '14px 20px', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ff5f57' }}></div>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#febc2e' }}></div>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#28c840' }}></div>
            <div style={{ flex: 1, textAlign: 'center' }}>
              <span style={{ background: 'rgba(255,255,255,0.05)', padding: '4px 16px', borderRadius: '6px', fontSize: '12px', color: 'rgba(255,255,255,0.35)' }}>postpilot.ai/dashboard</span>
            </div>
          </div>

          {/* Dashboard preview */}
          <div style={{ padding: '32px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
            {/* Stats */}
            {[
              { label: 'Posts this week', value: '7', icon: '✍️' },
              { label: 'Platforms covered', value: '3', icon: '📡' },
              { label: 'Time saved', value: '4.2h', icon: '⚡' },
            ].map(s => (
              <div key={s.label} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', padding: '18px 20px' }}>
                <span style={{ fontSize: '24px' }}>{s.icon}</span>
                <p style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '-1px', margin: '8px 0 4px' }}>{s.value}</p>
                <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>{s.label}</p>
              </div>
            ))}

            {/* Post cards */}
            <div style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { platform: '𝕏 Twitter', content: 'AI adoption in recruitment is accelerating faster than expected. Companies using AI-powered screening are seeing 60% reduction in time-to-hire. The shift is real.', status: 'pending' },
                { platform: 'in LinkedIn', content: 'Most small businesses think AI automation is "for big companies". Here\'s why that\'s exactly backwards — and how we\'re helping a 3-person mortgage broker generate 11 qualified leads/week on autopilot.', status: 'approved' },
                { platform: '📸 Instagram', content: 'Before AI: manually responding to 40 reviews/month. After PostPilot: one click approve. Average reply time: 2 minutes/week. ✨', status: 'pending' },
              ].map(post => (
                <div key={post.platform} style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${post.status === 'approved' ? 'rgba(34,197,94,0.2)' : 'rgba(255,255,255,0.07)'}`, borderRadius: '12px', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', minWidth: '90px', fontWeight: 600 }}>{post.platform}</span>
                  <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.65)', flex: 1, lineHeight: 1.5 }}>{post.content}</p>
                  <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                    {post.status === 'approved'
                      ? <span style={{ fontSize: '11px', color: '#22c55e', fontWeight: 700 }}>✓ Approved</span>
                      : <>
                          <div style={{ background: 'linear-gradient(135deg,#7c3aed,#2563eb)', padding: '6px 14px', borderRadius: '7px', fontSize: '12px', fontWeight: 700 }}>✓ Approve</div>
                          <div style={{ border: '1px solid rgba(255,255,255,0.1)', padding: '6px 14px', borderRadius: '7px', fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>Edit</div>
                        </>
                    }
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" style={{ maxWidth: '900px', margin: '0 auto 100px', padding: '0 40px' }}>
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <h2 style={{ fontSize: '44px', fontWeight: 800, letterSpacing: '-1.5px', marginBottom: '16px' }}>How it works</h2>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '18px' }}>Three steps. Five minutes of your time per week.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '24px' }}>
          {[
            { step: '01', title: 'Tell us about your business', desc: 'Name, audience, niche, tone. Takes 5 minutes once. PostPilot never forgets.' },
            { step: '02', title: 'Get your weekly content drop', desc: 'Every Monday: 7 posts, 3 platforms, all researched and written by AI. Ready in your inbox.' },
            { step: '03', title: 'Approve in one tap', desc: 'Review each post. Hit approve and it goes out. Edit if you want. Reject and regenerate. Your call.' },
          ].map(s => (
            <div key={s.step} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '20px', padding: '32px' }}>
              <span style={{ fontSize: '12px', color: '#7c3aed', fontWeight: 800, letterSpacing: '1px' }}>{s.step}</span>
              <h3 style={{ fontSize: '18px', fontWeight: 700, margin: '12px 0 10px', letterSpacing: '-0.3px' }}>{s.title}</h3>
              <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.65 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ maxWidth: '900px', margin: '0 auto 100px', padding: '0 40px', display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '16px' }}>
        {[
          { icon: '🧠', title: 'Learns from engagement', desc: 'PostPilot tracks what gets likes and shares. Every week the content gets sharper.' },
          { icon: '📡', title: 'Twitter, LinkedIn & Instagram', desc: 'Platform-native writing. Twitter threads. LinkedIn thought leadership. Instagram captions.' },
          { icon: '🔍', title: 'Researches trending topics', desc: 'AI scans your niche every week. Your content is always timely and relevant.' },
          { icon: '✏️', title: 'Edit before approving', desc: 'AI writes the draft. You have the final word. Always.' },
          { icon: '📊', title: 'Weekly analytics', desc: 'See what\'s working. Engagement, reach, follower growth. One clean dashboard.' },
          { icon: '⚡', title: 'Twitter auto-post', desc: 'Approved posts go live on Twitter/X instantly. No copy-paste.' },
        ].map(f => (
          <div key={f.title} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', padding: '24px' }}>
            <span style={{ fontSize: '28px' }}>{f.icon}</span>
            <h3 style={{ fontSize: '15px', fontWeight: 600, margin: '12px 0 8px' }}>{f.title}</h3>
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', lineHeight: 1.6 }}>{f.desc}</p>
          </div>
        ))}
      </section>

      {/* CTA */}
      <section style={{ maxWidth: '700px', margin: '0 auto 100px', padding: '0 40px', textAlign: 'center' }}>
        <div style={{ background: 'linear-gradient(135deg,rgba(124,58,237,0.12),rgba(37,99,235,0.12))', border: '1px solid rgba(124,58,237,0.2)', borderRadius: '28px', padding: '72px 48px' }}>
          <h2 style={{ fontSize: '44px', fontWeight: 800, letterSpacing: '-1.5px', marginBottom: '16px' }}>Ready to stop writing?</h2>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '17px', marginBottom: '40px', lineHeight: 1.6 }}>3 AI posts free every week. No credit card. Cancel anytime.</p>
          <Link href="/signup" style={{ background: 'linear-gradient(135deg,#7c3aed,#2563eb)', color: '#fff', padding: '15px 36px', borderRadius: '10px', textDecoration: 'none', fontSize: '16px', fontWeight: 700, display: 'inline-block', boxShadow: '0 0 60px rgba(124,58,237,0.3)' }}>
            Start for free →
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.05)', padding: '32px 64px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.25)' }}>© 2026 PostPilot · by <a href="https://bilabs.ai" style={{ color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}>bilabs.ai</a></span>
        <div style={{ display: 'flex', gap: '24px' }}>
          {[['Pricing', '/pricing'], ['Dashboard', '/dashboard'], ['Contact', 'mailto:hello@bilabs.ai']].map(([label, href]) => (
            <Link key={label} href={href} style={{ fontSize: '13px', color: 'rgba(255,255,255,0.3)', textDecoration: 'none' }}>{label}</Link>
          ))}
        </div>
      </footer>
    </div>
  )
}
