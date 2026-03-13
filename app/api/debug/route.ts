import { NextResponse } from 'next/server'
export async function GET() {
  return NextResponse.json({
    stripe_key_prefix: (process.env.STRIPE_SECRET_KEY ?? '').slice(0,15),
    anthropic_key_prefix: (process.env.ANTHROPIC_API_KEY ?? '').slice(0,15),
    anthropic_set: !!process.env.ANTHROPIC_API_KEY,
  })
}
