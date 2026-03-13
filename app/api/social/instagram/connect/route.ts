import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'

export async function GET(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.redirect(new URL('/login', req.url))

  // Instagram requires Meta Business verification (2-3 week approval).
  // Until activated, show a "coming soon" page with the copy+open workaround.
  return new NextResponse(`
    <!DOCTYPE html>
    <html>
    <head><title>Instagram — PostPilot</title>
    <style>body{font-family:-apple-system,sans-serif;background:#050510;color:#fff;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0}
    .box{text-align:center;max-width:420px;padding:40px}.icon{font-size:48px;margin-bottom:20px}
    h2{font-size:22px;font-weight:800;margin:0 0 10px}p{color:rgba(255,255,255,0.5);font-size:14px;line-height:1.6;margin:0 0 16px}
    .tip{background:rgba(225,48,108,0.08);border:1px solid rgba(225,48,108,0.15);border-radius:12px;padding:16px;margin-bottom:24px;text-align:left}
    .tip p{margin:0;color:rgba(255,255,255,0.6);font-size:13px}
    a{display:inline-block;background:linear-gradient(135deg,#7c3aed,#2563eb);color:#fff;padding:12px 24px;border-radius:10px;text-decoration:none;font-weight:700;font-size:14px}
    </style></head>
    <body><div class="box">
      <div class="icon">📸</div>
      <h2>Instagram — Direct API Coming Soon</h2>
      <p>We're going through Meta's Business Verification to enable direct Instagram posting. Usually takes 2-3 weeks.</p>
      <div class="tip">
        <p><strong>✅ What works right now:</strong><br/>On any approved Instagram post in your dashboard, click <strong>"📸 Copy &amp; Open Instagram"</strong> — your caption is copied to clipboard, Instagram opens in a new tab, just paste and post.</p>
      </div>
      <a href="/dashboard/settings">← Back to Settings</a>
    </div></body></html>
  `, { headers: { 'Content-Type': 'text/html' } })
}
