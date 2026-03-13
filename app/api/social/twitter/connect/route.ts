import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'
import crypto from 'crypto'

export async function GET(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.redirect(new URL('/login', req.url))

  const clientId = process.env.TWITTER_CLIENT_ID
  if (!clientId) return NextResponse.json({ error: 'Twitter app not configured' }, { status: 500 })

  // PKCE
  const codeVerifier  = crypto.randomBytes(32).toString('base64url')
  const codeChallenge = crypto.createHash('sha256').update(codeVerifier).digest('base64url')
  const state         = crypto.randomBytes(16).toString('hex')

  // Store in cookie
  const res = NextResponse.redirect(
    `https://twitter.com/i/oauth2/authorize?` +
    `response_type=code&client_id=${clientId}` +
    `&redirect_uri=${encodeURIComponent(process.env.NEXT_PUBLIC_BASE_URL + '/api/social/twitter/callback')}` +
    `&scope=tweet.read%20tweet.write%20users.read%20offline.access` +
    `&state=${state}&code_challenge=${codeChallenge}&code_challenge_method=S256`
  )
  res.cookies.set('tw_code_verifier', codeVerifier, { httpOnly: true, secure: true, maxAge: 600, path: '/' })
  res.cookies.set('tw_oauth_state',   state,         { httpOnly: true, secure: true, maxAge: 600, path: '/' })
  return res
}
