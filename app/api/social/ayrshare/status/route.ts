import { NextResponse } from 'next/server'

const AYRSHARE_KEY = () => process.env.AYRSHARE_API_KEY ?? ''

export async function GET() {
  try {
    const res  = await fetch('https://app.ayrshare.com/api/user', {
      headers: { Authorization: `Bearer ${AYRSHARE_KEY()}` }
    })
    const data = await res.json()
    const platforms = (data.activeSocialAccounts ?? []) as string[]
    return NextResponse.json({ platforms, connected: platforms.length > 0 })
  } catch {
    return NextResponse.json({ platforms: [], connected: false })
  }
}
