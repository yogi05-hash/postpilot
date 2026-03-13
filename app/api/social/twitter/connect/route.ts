import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'
import crypto from 'crypto'

export async function GET(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.redirect(new URL('/login', req.url))

  const clientId = process.env.TWITTER_CLIENT_ID
  if (!clientId) {
    // Graceful "coming soon" page
    return new NextResponse(`
      <!DOCTYPE html>
      <html>
      <head><title>Twitter / X — PostPilot</title>
      <style>body{font-family:-apple-system,sans-serif;background:#050510;color:#fff;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0}
      .box{text-align:center;max-width:400px;padding:40px}.icon{font-size:48px;margin-bottom:20px}
      h2{font-size:22px;font-weight:800;margin:0 0 10px}p{color:rgba(255,255,255,0.5);font-size:14px;line-height:1.6;margin:0 0 24px}
      a{display:inline-block;background:linear-gradient(135deg,#7c3aed,#2563eb);color:#fff;padding:12px 24px;border-radius:10px;text-decoration:none;font-weight:700;font-size:14px}
      </style></head>
      <body><div class="box">
        <div class="icon">𝕏</div>
        <h2>Twitter / X — Coming Soon</h2>
        <p>We're activating Twitter posting. It'll be live in the next update. LinkedIn is available now — connect that in the meantime.</p>
        <a href="/dashboard/settings">← Back to Settings</a>
      </div></body></html>
    `, { headers: { 'Content-Type': 'text/html' } })
  }

  // PKCE
  const codeVerifier  = crypto.randomBytes(32).toString('base64url')
  const codeChallenge = crypto.createHash('sha256').update(codeVerifier).digest('base64url')
  const state         = crypto.randomBytes(16).toString('hex')
  const redirectUri   = `${process.env.NEXT_PUBLIC_BASE_URL}/api/social/twitter/callback`

  const authUrl = new URL('https://twitter.com/i/oauth2/authorize')
  authUrl.searchParams.set('response_type',          'code')
  authUrl.searchParams.set('client_id',              clientId)
  authUrl.searchParams.set('redirect_uri',           redirectUri)
  authUrl.searchParams.set('scope',                  'tweet.read tweet.write users.read offline.access')
  authUrl.searchParams.set('state',                  state)
  authUrl.searchParams.set('code_challenge',         codeChallenge)
  authUrl.searchParams.set('code_challenge_method',  'S256')

  const res = NextResponse.redirect(authUrl.toString())
  res.cookies.set('tw_oauth_state',    state,        { httpOnly:true, secure:true, maxAge:600, path:'/', sameSite:'lax' })
  res.cookies.set('tw_code_verifier',  codeVerifier, { httpOnly:true, secure:true, maxAge:600, path:'/', sameSite:'lax' })
  return res
}
