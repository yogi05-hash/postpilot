import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'
import crypto from 'crypto'

export async function GET(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.redirect(new URL('/login', req.url))

  const clientId = process.env.LINKEDIN_CLIENT_ID
  if (!clientId) {
    return NextResponse.redirect(
      new URL('/dashboard/settings?error=linkedin_not_configured', req.url)
    )
  }

  const state       = crypto.randomBytes(16).toString('hex')
  const redirectUri = `${process.env.NEXT_PUBLIC_BASE_URL}/api/social/linkedin/callback`

  const authUrl = new URL('https://www.linkedin.com/oauth/v2/authorization')
  authUrl.searchParams.set('response_type', 'code')
  authUrl.searchParams.set('client_id',     clientId)
  authUrl.searchParams.set('redirect_uri',  redirectUri)
  authUrl.searchParams.set('scope',         'openid profile w_member_social')
  authUrl.searchParams.set('state',         state)

  const res = NextResponse.redirect(authUrl.toString())
  res.cookies.set('li_oauth_state', state, {
    httpOnly: true, secure: true, maxAge: 600, path: '/',
    sameSite: 'lax',
  })
  return res
}
