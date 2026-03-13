export default function LaunchPage() {
  return (
    <div style={{ fontFamily:'-apple-system,BlinkMacSystemFont,"Inter",sans-serif', background:'#050510', color:'#fff', minHeight:'100vh' }}>

      {/* NAV */}
      <nav style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'18px 40px', borderBottom:'1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
          <span style={{ fontSize:'20px' }}>🚀</span>
          <span style={{ fontSize:'16px', fontWeight:800, background:'linear-gradient(135deg,#a78bfa,#60a5fa)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>PostPilot</span>
        </div>
        <div style={{ display:'flex', gap:'12px', alignItems:'center' }}>
          <a href="/login" style={{ color:'rgba(255,255,255,0.5)', fontSize:'14px', textDecoration:'none' }}>Sign in</a>
          <a href="/signup" style={{ background:'linear-gradient(135deg,#7c3aed,#2563eb)', color:'#fff', padding:'9px 20px', borderRadius:'8px', fontSize:'14px', fontWeight:700, textDecoration:'none' }}>
            Start free →
          </a>
        </div>
      </nav>

      {/* HERO */}
      <div style={{ textAlign:'center', padding:'80px 40px 60px', maxWidth:'780px', margin:'0 auto' }}>
        <div style={{ display:'inline-block', background:'rgba(124,58,237,0.1)', border:'1px solid rgba(124,58,237,0.25)', borderRadius:'100px', padding:'6px 16px', fontSize:'12px', color:'#a78bfa', fontWeight:700, marginBottom:'24px', letterSpacing:'0.5px', textTransform:'uppercase' }}>
          🎉 Launching on Product Hunt today
        </div>
        <h1 style={{ fontSize:'52px', fontWeight:900, lineHeight:1.1, letterSpacing:'-1.5px', margin:'0 0 20px' }}>
          Stop copy-pasting.<br />
          <span style={{ background:'linear-gradient(135deg,#a78bfa,#60a5fa)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
            Let AI write and post it.
          </span>
        </h1>
        <p style={{ fontSize:'18px', color:'rgba(255,255,255,0.55)', lineHeight:1.6, margin:'0 0 36px', maxWidth:'560px', marginLeft:'auto', marginRight:'auto' }}>
          PostPilot generates a week of content for your business in 30 seconds, then posts it to LinkedIn, Twitter, and Instagram with one click.
        </p>
        <div style={{ display:'flex', gap:'12px', justifyContent:'center', flexWrap:'wrap' }}>
          <a href="/signup" style={{ background:'linear-gradient(135deg,#7c3aed,#2563eb)', color:'#fff', padding:'14px 32px', borderRadius:'10px', fontSize:'15px', fontWeight:800, textDecoration:'none', display:'inline-block' }}>
            Start free — no credit card →
          </a>
          <a href="https://www.producthunt.com/posts/postpilot" target="_blank" rel="noreferrer" style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.1)', color:'rgba(255,255,255,0.7)', padding:'14px 28px', borderRadius:'10px', fontSize:'15px', fontWeight:600, textDecoration:'none', display:'inline-block' }}>
            🔼 Upvote on Product Hunt
          </a>
        </div>
        <p style={{ marginTop:'16px', fontSize:'13px', color:'rgba(255,255,255,0.25)' }}>£14/month Pro · Cancel anytime · Used by 0 businesses (be first)</p>
      </div>

      {/* HOW IT WORKS */}
      <div style={{ maxWidth:'900px', margin:'0 auto', padding:'0 40px 80px' }}>
        <h2 style={{ textAlign:'center', fontSize:'28px', fontWeight:800, marginBottom:'40px' }}>How it works</h2>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'20px' }}>
          {[
            { n:'1', icon:'🏢', title:'Set up your business', body:'Tell PostPilot what you do, who you target, and your brand tone. Takes 2 minutes.' },
            { n:'2', icon:'✨', title:'AI generates your posts', body:'Hit Generate. Get 7 platform-specific posts for LinkedIn, Twitter, and Instagram instantly.' },
            { n:'3', icon:'🚀', title:'Approve and post', body:'Review each post. Approve the ones you like. One click — it goes live on your social accounts.' },
          ].map(s => (
            <div key={s.n} style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:'16px', padding:'28px', textAlign:'center' }}>
              <div style={{ fontSize:'32px', marginBottom:'12px' }}>{s.icon}</div>
              <div style={{ fontSize:'11px', color:'#a78bfa', fontWeight:700, textTransform:'uppercase', letterSpacing:'1px', marginBottom:'8px' }}>Step {s.n}</div>
              <h3 style={{ fontSize:'16px', fontWeight:700, margin:'0 0 10px' }}>{s.title}</h3>
              <p style={{ fontSize:'13px', color:'rgba(255,255,255,0.45)', lineHeight:1.6, margin:0 }}>{s.body}</p>
            </div>
          ))}
        </div>
      </div>

      {/* FEATURES */}
      <div style={{ background:'rgba(255,255,255,0.02)', borderTop:'1px solid rgba(255,255,255,0.05)', borderBottom:'1px solid rgba(255,255,255,0.05)', padding:'60px 40px' }}>
        <div style={{ maxWidth:'900px', margin:'0 auto' }}>
          <h2 style={{ textAlign:'center', fontSize:'28px', fontWeight:800, marginBottom:'40px' }}>Everything you need to stay consistent</h2>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'16px' }}>
            {[
              { icon:'🤖', title:'AI content generation', body:'Claude AI writes posts in your brand voice — not generic templates.' },
              { icon:'📅', title:'Content calendar', body:'See your full week of posts at a glance. Plan and schedule ahead.' },
              { icon:'in', title:'LinkedIn direct posting', body:'Connect once. PostPilot posts to your LinkedIn profile with one click.' },
              { icon:'𝕏', title:'Twitter / X posting', body:'Generate Twitter-optimised hooks under 280 chars. Post instantly.' },
              { icon:'📸', title:'Instagram captions', body:'Ready-to-paste captions with hashtags. Copy and post in seconds.' },
              { icon:'#️⃣', title:'Smart hashtags', body:'Platform-specific hashtag packs added automatically to every post.' },
              { icon:'✓', title:'Approve before posting', body:'Nothing goes live without your review. You stay in full control.' },
              { icon:'📊', title:'Post analytics (coming)', body:'See what\'s getting engagement. Double down on what works.' },
              { icon:'🏢', title:'Business profile', body:'Your niche, audience, and tone saved once — injected into every AI prompt.' },
            ].map(f => (
              <div key={f.title} style={{ background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.06)', borderRadius:'12px', padding:'20px' }}>
                <div style={{ fontSize:'24px', marginBottom:'10px' }}>{f.icon}</div>
                <h4 style={{ fontSize:'14px', fontWeight:700, margin:'0 0 6px' }}>{f.title}</h4>
                <p style={{ fontSize:'12px', color:'rgba(255,255,255,0.4)', lineHeight:1.55, margin:0 }}>{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* PRICING */}
      <div style={{ maxWidth:'700px', margin:'0 auto', padding:'80px 40px', textAlign:'center' }}>
        <h2 style={{ fontSize:'28px', fontWeight:800, marginBottom:'8px' }}>Simple pricing</h2>
        <p style={{ color:'rgba(255,255,255,0.4)', fontSize:'14px', marginBottom:'40px' }}>Less than Netflix. More ROI.</p>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px' }}>
          {[
            {
              name:'Free', price:'£0', period:'forever', highlight:false,
              features:['3 posts per month','LinkedIn posting','Content calendar','Copy posts to clipboard'],
              cta:'Start free', href:'/signup',
            },
            {
              name:'Pro', price:'£14', period:'per month', highlight:true,
              features:['Unlimited post generation','LinkedIn + Twitter posting','Instagram captions & hashtags','Content calendar','Priority support'],
              cta:'Get Pro →', href:'/signup?plan=pro',
            },
          ].map(p => (
            <div key={p.name} style={{ background:p.highlight ? 'rgba(124,58,237,0.08)' : 'rgba(255,255,255,0.02)', border:`1px solid ${p.highlight ? 'rgba(124,58,237,0.3)' : 'rgba(255,255,255,0.07)'}`, borderRadius:'16px', padding:'28px', textAlign:'left' }}>
              {p.highlight && <div style={{ fontSize:'11px', color:'#a78bfa', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:'12px' }}>Most popular</div>}
              <div style={{ fontSize:'13px', fontWeight:600, color:'rgba(255,255,255,0.5)', marginBottom:'8px' }}>{p.name}</div>
              <div style={{ display:'flex', alignItems:'baseline', gap:'4px', marginBottom:'20px' }}>
                <span style={{ fontSize:'36px', fontWeight:900 }}>{p.price}</span>
                <span style={{ fontSize:'13px', color:'rgba(255,255,255,0.35)' }}>/{p.period}</span>
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:'8px', marginBottom:'24px' }}>
                {p.features.map(f => (
                  <div key={f} style={{ display:'flex', gap:'8px', alignItems:'flex-start' }}>
                    <span style={{ color:'#22c55e', fontSize:'12px', marginTop:'2px' }}>✓</span>
                    <span style={{ fontSize:'13px', color:'rgba(255,255,255,0.6)' }}>{f}</span>
                  </div>
                ))}
              </div>
              <a href={p.href} style={{ display:'block', background:p.highlight ? 'linear-gradient(135deg,#7c3aed,#2563eb)' : 'rgba(255,255,255,0.06)', color:'#fff', padding:'12px', borderRadius:'9px', textAlign:'center', fontSize:'13px', fontWeight:700, textDecoration:'none' }}>
                {p.cta}
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* FOOTER CTA */}
      <div style={{ background:'linear-gradient(135deg,rgba(124,58,237,0.15),rgba(37,99,235,0.1))', borderTop:'1px solid rgba(124,58,237,0.2)', padding:'60px 40px', textAlign:'center' }}>
        <h2 style={{ fontSize:'32px', fontWeight:900, marginBottom:'12px' }}>Stop delaying your content.</h2>
        <p style={{ color:'rgba(255,255,255,0.5)', fontSize:'16px', marginBottom:'28px' }}>30 seconds. A week of posts. Ready to approve.</p>
        <a href="/signup" style={{ background:'linear-gradient(135deg,#7c3aed,#2563eb)', color:'#fff', padding:'14px 36px', borderRadius:'10px', fontSize:'15px', fontWeight:800, textDecoration:'none', display:'inline-block' }}>
          Get started free →
        </a>
      </div>

      {/* FOOTER */}
      <div style={{ textAlign:'center', padding:'24px', borderTop:'1px solid rgba(255,255,255,0.04)', fontSize:'12px', color:'rgba(255,255,255,0.2)' }}>
        © 2026 PostPilot · Built by bilabs.ai · <a href="/login" style={{ color:'rgba(255,255,255,0.3)', textDecoration:'none' }}>Sign in</a>
      </div>

    </div>
  )
}
