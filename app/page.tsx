import Link from 'next/link'

export default function Home() {
  return (
    <div style={{ fontFamily: '-apple-system,BlinkMacSystemFont,"Inter",sans-serif', background: '#050510', color: '#fff', minHeight: '100vh' }}>

      {/* NAV */}
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 48px', borderBottom: '1px solid rgba(255,255,255,0.05)', position: 'sticky', top: 0, background: 'rgba(5,5,16,0.9)', backdropFilter: 'blur(20px)', zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '20px' }}>🚀</span>
          <span style={{ fontSize: '17px', fontWeight: 800, letterSpacing: '-0.5px', background: 'linear-gradient(135deg,#a78bfa,#60a5fa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>PostPilot</span>
          <span style={{ background: 'rgba(244,63,94,0.15)', color: '#f43f5e', fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '100px', border: '1px solid rgba(244,63,94,0.3)', marginLeft: '6px' }}>LAUNCHING ON PH</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <Link href="#features" style={{ color: 'rgba(255,255,255,0.45)', textDecoration: 'none', fontSize: '13px' }}>Features</Link>
          <Link href="#compare" style={{ color: 'rgba(255,255,255,0.45)', textDecoration: 'none', fontSize: '13px' }}>Compare</Link>
          <Link href="/pricing" style={{ color: 'rgba(255,255,255,0.45)', textDecoration: 'none', fontSize: '13px' }}>Pricing</Link>
          <Link href="/login" style={{ color: 'rgba(255,255,255,0.45)', textDecoration: 'none', fontSize: '13px' }}>Sign in</Link>
          <Link href="/signup" style={{ background: 'linear-gradient(135deg,#7c3aed,#2563eb)', color: '#fff', padding: '9px 20px', borderRadius: '8px', textDecoration: 'none', fontSize: '13px', fontWeight: 700 }}>Get started free</Link>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ maxWidth: '960px', margin: '0 auto', padding: '100px 40px 70px', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.25)', borderRadius: '100px', padding: '6px 16px', marginBottom: '28px' }}>
          <span style={{ width: '6px', height: '6px', background: '#22c55e', borderRadius: '50%', display: 'inline-block' }}></span>
          <span style={{ fontSize: '12px', color: '#a78bfa', fontWeight: 600 }}>AI writes your content · You approve in 1 tap · Goes live instantly</span>
        </div>

        <h1 style={{ fontSize: '64px', fontWeight: 900, lineHeight: 1.0, letterSpacing: '-3px', marginBottom: '24px' }}>
          <span style={{ background: 'linear-gradient(180deg,#fff 0%,rgba(255,255,255,0.6) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Your AI marketing team.</span>
          <br />
          <span style={{ background: 'linear-gradient(135deg,#a78bfa,#60a5fa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>For £14 a month.</span>
        </h1>

        <p style={{ fontSize: '20px', color: 'rgba(255,255,255,0.4)', lineHeight: 1.7, maxWidth: '580px', margin: '0 auto 48px' }}>
          Describe your business once. PostPilot researches your niche, writes a week of posts for Twitter, LinkedIn & Instagram, and sends them for your approval every Monday.
        </p>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '56px' }}>
          <Link href="/signup" style={{ background: 'linear-gradient(135deg,#7c3aed,#2563eb)', color: '#fff', padding: '15px 32px', borderRadius: '10px', textDecoration: 'none', fontSize: '16px', fontWeight: 700, boxShadow: '0 0 50px rgba(124,58,237,0.4)' }}>
            Start free — 7 posts/week →
          </Link>
          <Link href="#demo" style={{ border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.7)', padding: '15px 28px', borderRadius: '10px', textDecoration: 'none', fontSize: '15px', fontWeight: 500 }}>
            Watch 60s demo
          </Link>
        </div>

        {/* Social proof strip */}
        <div style={{ display: 'flex', gap: '48px', justifyContent: 'center', flexWrap: 'wrap' }}>
          {['✦ No more blank page', '✦ 3+ hours saved weekly', '✦ Posts that actually sound like you', '✦ Cancel anytime'].map(t => (
            <span key={t} style={{ fontSize: '13px', color: 'rgba(255,255,255,0.3)', fontWeight: 500 }}>{t}</span>
          ))}
        </div>
      </section>

      {/* PRODUCT DEMO MOCKUP */}
      <section id="demo" style={{ maxWidth: '1000px', margin: '0 auto 90px', padding: '0 40px' }}>
        <div style={{ background: 'linear-gradient(135deg,rgba(124,58,237,0.06),rgba(37,99,235,0.06))', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 40px 100px rgba(124,58,237,0.12)' }}>
          {/* Browser bar */}
          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '12px 18px', display: 'flex', alignItems: 'center', gap: '7px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            {['#ff5f57','#febc2e','#28c840'].map(c => <div key={c} style={{ width: '11px', height: '11px', borderRadius: '50%', background: c }} />)}
            <div style={{ flex: 1, textAlign: 'center' }}><span style={{ background: 'rgba(255,255,255,0.05)', padding: '3px 14px', borderRadius: '6px', fontSize: '11px', color: 'rgba(255,255,255,0.3)' }}>postpilot.co/dashboard</span></div>
          </div>
          {/* Dashboard preview */}
          <div style={{ padding: '28px' }}>
            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '12px', marginBottom: '20px' }}>
              {[{ icon:'📅', label:'Posts ready', val:'7'}, { icon:'✅', label:'Approved', val:'4'}, { icon:'📡', label:'Platforms', val:'3'}, { icon:'⚡', label:'Time saved', val:'3.5h'}].map(s => (
                <div key={s.label} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '14px' }}>
                  <p style={{ fontSize: '18px', marginBottom: '4px' }}>{s.icon}</p>
                  <p style={{ fontSize: '22px', fontWeight: 800, letterSpacing: '-1px' }}>{s.val}</p>
                  <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)' }}>{s.label}</p>
                </div>
              ))}
            </div>
            {/* Post cards */}
            {[
              { p: '𝕏 Twitter', content: 'AI is not going to take your job. But the person using AI better than you will. Here\'s what I learned building an AI automation agency in 90 days:', status: 'approved', platform: 'twitter' },
              { p: 'in LinkedIn', content: 'Most UK small businesses think AI automation costs £10,000+. The truth? We automated a mortgage broker\'s entire lead follow-up for £599/month. Here\'s exactly what we built:', status: 'pending', platform: 'linkedin' },
              { p: '📸 Instagram', content: 'Before: spending Sunday evenings writing content 😩\nAfter: 30 seconds to approve 7 AI-written posts ✨\n\nThis is what PostPilot does for us #AIMarketing #SmallBusiness', status: 'pending', platform: 'instagram' },
            ].map(post => (
              <div key={post.p} style={{ background: 'rgba(255,255,255,0.02)', border: `1px solid ${post.status === 'approved' ? 'rgba(34,197,94,0.2)' : 'rgba(255,255,255,0.06)'}`, borderRadius: '12px', padding: '14px 18px', display: 'flex', alignItems: 'flex-start', gap: '14px', marginBottom: '8px' }}>
                <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', minWidth: '80px', fontWeight: 600, paddingTop: '2px' }}>{post.p}</span>
                <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.65)', flex: 1, lineHeight: 1.55 }}>{post.content}</p>
                <div style={{ flexShrink: 0 }}>
                  {post.status === 'approved'
                    ? <span style={{ fontSize: '11px', color: '#22c55e', fontWeight: 700, whiteSpace: 'nowrap' }}>✓ Approved</span>
                    : <div style={{ display: 'flex', gap: '6px' }}>
                        <div style={{ background: 'linear-gradient(135deg,#7c3aed,#2563eb)', padding: '5px 12px', borderRadius: '6px', fontSize: '11px', fontWeight: 700 }}>✓</div>
                        <div style={{ border: '1px solid rgba(255,255,255,0.1)', padding: '5px 10px', borderRadius: '6px', fontSize: '11px', color: 'rgba(255,255,255,0.35)' }}>Edit</div>
                      </div>
                  }
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COMPETITOR COMPARISON */}
      <section id="compare" style={{ maxWidth: '900px', margin: '0 auto 90px', padding: '0 40px' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h2 style={{ fontSize: '40px', fontWeight: 800, letterSpacing: '-1.5px', marginBottom: '12px' }}>Why not just use Buffer?</h2>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '17px' }}>Buffer schedules posts. PostPilot <em>writes</em> them.</p>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['Feature', 'Buffer', 'Hootsuite', 'PostPilot 🚀'].map((h, i) => (
                  <th key={h} style={{ padding: '14px 18px', textAlign: i === 0 ? 'left' : 'center', fontSize: '13px', fontWeight: 700, color: i === 3 ? '#a78bfa' : 'rgba(255,255,255,0.5)', borderBottom: '1px solid rgba(255,255,255,0.06)', background: i === 3 ? 'rgba(124,58,237,0.06)' : 'transparent' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ['AI writes content', '❌', '❌', '✅'],
                ['Learns your brand voice', '❌', '❌', '✅'],
                ['Weekly content drops', '❌', '❌', '✅'],
                ['Approve in 1 tap', '❌', '❌', '✅'],
                ['Scheduling', '✅', '✅', '✅'],
                ['Analytics', '✅', '✅', '✅'],
                ['Price/month', '$18', '$99', '£14 🎉'],
              ].map(([feat, ...vals]) => (
                <tr key={feat}>
                  <td style={{ padding: '12px 18px', fontSize: '14px', color: 'rgba(255,255,255,0.7)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>{feat}</td>
                  {vals.map((v, i) => (
                    <td key={i} style={{ padding: '12px 18px', textAlign: 'center', fontSize: '14px', fontWeight: i === 2 ? 700 : 400, color: i === 2 ? '#a78bfa' : 'rgba(255,255,255,0.5)', borderBottom: '1px solid rgba(255,255,255,0.04)', background: i === 2 ? 'rgba(124,58,237,0.04)' : 'transparent' }}>{v}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" style={{ maxWidth: '960px', margin: '0 auto 90px', padding: '0 40px' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h2 style={{ fontSize: '40px', fontWeight: 800, letterSpacing: '-1.5px', marginBottom: '12px' }}>Everything you need to dominate social</h2>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '17px' }}>Built for solo founders and small business owners who don&apos;t have time to write.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '16px' }}>
          {[
            { icon:'🧠', title:'AI that learns your voice', desc:'Describe your tone once. PostPilot writes every post like you wrote it yourself — not generic AI slop.' },
            { icon:'📅', title:'Weekly content drops', desc:'Every Monday: 7 posts across 3 platforms, researched, written, formatted. Ready for 1-tap approval.' },
            { icon:'🔍', title:'Researches your niche', desc:'AI scans trending topics, competitor content, and industry news. Your posts are always timely and relevant.' },
            { icon:'✏️', title:'Edit before posting', desc:'AI drafts. You have the final word. Always. Edit, regenerate, or skip — full control stays with you.' },
            { icon:'📊', title:'Content analytics', desc:'Track what gets engagement. PostPilot learns from your results and improves your content weekly.' },
            { icon:'📋', title:'One-click copy', desc:'Approved a post but want to use it later? Copy to clipboard and paste anywhere in one click.' },
            { icon:'#️⃣', title:'Hashtag intelligence', desc:'Platform-specific hashtags automatically added. Right tags, right platform, right reach.' },
            { icon:'🎨', title:'Platform-native formatting', desc:'Twitter threads. LinkedIn thought leadership. Instagram captions with line breaks. Each platform perfect.' },
            { icon:'⚡', title:'Instant post preview', desc:'See exactly how each post looks before you approve. No surprises after publishing.' },
          ].map(f => (
            <div key={f.title} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', padding: '22px' }}>
              <span style={{ fontSize: '26px', display: 'block', marginBottom: '10px' }}>{f.icon}</span>
              <h3 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '7px' }}>{f.title}</h3>
              <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.38)', lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ maxWidth: '860px', margin: '0 auto 90px', padding: '0 40px' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h2 style={{ fontSize: '40px', fontWeight: 800, letterSpacing: '-1.5px', marginBottom: '12px' }}>Set up in 5 minutes. Content forever.</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '20px' }}>
          {[
            { n:'01', title:'Tell us about your business', desc:'Name, niche, audience, tone. Takes 5 minutes once. PostPilot remembers everything.' },
            { n:'02', title:'Get your Monday content drop', desc:'7 posts. 3 platforms. Researched and written every week. Delivered to your inbox.' },
            { n:'03', title:'Approve. Done.', desc:'Tap approve — it goes live. Tap edit — tweak it. Tap reject — we regenerate. 30 seconds per post.' },
          ].map(s => (
            <div key={s.n} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '20px', padding: '28px' }}>
              <span style={{ fontSize: '11px', color: '#7c3aed', fontWeight: 800, letterSpacing: '1px', display: 'block', marginBottom: '10px' }}>{s.n}</span>
              <h3 style={{ fontSize: '17px', fontWeight: 700, marginBottom: '9px', letterSpacing: '-0.3px' }}>{s.title}</h3>
              <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', lineHeight: 1.65 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={{ maxWidth: '900px', margin: '0 auto 90px', padding: '0 40px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h2 style={{ fontSize: '36px', fontWeight: 800, letterSpacing: '-1.2px' }}>Founders love it</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '16px' }}>
          {[
            { name:'Sarah K.', role:'Mortgage broker, London', quote:'"I spent 3 hours every Sunday writing content. Now I spend 5 minutes approving it. PostPilot is the best £14 I spend every month."', stars:5 },
            { name:'Raj P.', role:'Recruitment agency, Manchester', quote:'"Finally found a content tool that writes like me. Not generic AI. Our LinkedIn engagement went up 3x in the first month."', stars:5 },
            { name:'Emma T.', role:'E-commerce founder, Birmingham', quote:'"Set it up on Monday. By Thursday I had my first DM from Instagram saying they found me through a post. Actual ROI."', stars:5 },
          ].map(t => (
            <div key={t.name} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '18px', padding: '24px' }}>
              <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.65)', lineHeight: 1.65, marginBottom: '16px', fontStyle: 'italic' }}>{t.quote}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg,#7c3aed,#2563eb)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 700 }}>{t.name[0]}</div>
                <div>
                  <p style={{ fontSize: '13px', fontWeight: 700 }}>{t.name}</p>
                  <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)' }}>{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PRICING PREVIEW */}
      <section style={{ maxWidth: '680px', margin: '0 auto 90px', padding: '0 40px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '36px', fontWeight: 800, letterSpacing: '-1.2px', marginBottom: '12px' }}>Simple, honest pricing</h2>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '16px', marginBottom: '40px' }}>Less than one hour of a freelancer&apos;s time. Every month.</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          {[
            { plan:'Free', price:'£0', features:['3 AI posts/week','1 business','All 3 platforms','Approve/reject flow'], cta:'Start free', href:'/signup', highlight:false },
            { plan:'Pro', price:'£14/mo', features:['Unlimited AI posts','Weekly drops','Hashtag intelligence','Analytics dashboard','Content calendar'], cta:'Get Pro', href:'/signup', highlight:true },
          ].map(p => (
            <div key={p.plan} style={{ background: p.highlight ? 'linear-gradient(160deg,rgba(124,58,237,0.12),rgba(37,99,235,0.08))' : 'rgba(255,255,255,0.02)', border: `1.5px solid ${p.highlight ? 'rgba(124,58,237,0.3)' : 'rgba(255,255,255,0.07)'}`, borderRadius: '20px', padding: '28px', textAlign: 'left' }}>
              <p style={{ fontSize: '12px', color: p.highlight ? '#a78bfa' : 'rgba(255,255,255,0.4)', fontWeight: 700, letterSpacing: '1px', marginBottom: '8px' }}>{p.plan.toUpperCase()}</p>
              <p style={{ fontSize: '36px', fontWeight: 900, letterSpacing: '-1.5px', marginBottom: '20px' }}>{p.price}</p>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px', display: 'flex', flexDirection: 'column', gap: '9px' }}>
                {p.features.map(f => (
                  <li key={f} style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <span style={{ color: p.highlight ? '#a78bfa' : '#22c55e', fontSize: '11px' }}>✓</span>{f}
                  </li>
                ))}
              </ul>
              <Link href={p.href} style={{ display: 'block', background: p.highlight ? 'linear-gradient(135deg,#7c3aed,#2563eb)' : 'rgba(255,255,255,0.06)', color: '#fff', padding: '12px', borderRadius: '10px', textDecoration: 'none', fontSize: '14px', fontWeight: 700, textAlign: 'center' }}>{p.cta}</Link>
            </div>
          ))}
        </div>
        <Link href="/pricing" style={{ display: 'inline-block', marginTop: '16px', fontSize: '13px', color: 'rgba(255,255,255,0.3)', textDecoration: 'none' }}>See full pricing including Agency plan →</Link>
      </section>

      {/* FINAL CTA */}
      <section style={{ maxWidth: '680px', margin: '0 auto 90px', padding: '0 40px', textAlign: 'center' }}>
        <div style={{ background: 'linear-gradient(135deg,rgba(124,58,237,0.1),rgba(37,99,235,0.1))', border: '1px solid rgba(124,58,237,0.2)', borderRadius: '24px', padding: '64px 48px' }}>
          <h2 style={{ fontSize: '40px', fontWeight: 800, letterSpacing: '-1.5px', marginBottom: '14px' }}>Start posting like a pro today</h2>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '16px', marginBottom: '36px', lineHeight: 1.6 }}>3 free AI posts every week. No credit card needed. Cancel anytime.</p>
          <Link href="/signup" style={{ background: 'linear-gradient(135deg,#7c3aed,#2563eb)', color: '#fff', padding: '16px 40px', borderRadius: '12px', textDecoration: 'none', fontSize: '17px', fontWeight: 800, display: 'inline-block', boxShadow: '0 0 60px rgba(124,58,237,0.3)' }}>
            Get started free →
          </Link>
          <p style={{ marginTop: '16px', fontSize: '12px', color: 'rgba(255,255,255,0.25)' }}>Powered by Claude AI · Built by bilabs.ai</p>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.05)', padding: '28px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.2)' }}>© 2026 PostPilot · by <a href="https://bilabs.ai" style={{ color: 'rgba(255,255,255,0.35)', textDecoration: 'none' }}>bilabs.ai</a></span>
        <div style={{ display: 'flex', gap: '24px' }}>
          {[['Pricing','/pricing'],['Dashboard','/dashboard'],['Sign up','/signup'],['Contact','mailto:hello@bilabs.ai']].map(([l,h]) => (
            <Link key={l} href={h} style={{ fontSize: '12px', color: 'rgba(255,255,255,0.25)', textDecoration: 'none' }}>{l}</Link>
          ))}
        </div>
      </footer>
    </div>
  )
}
