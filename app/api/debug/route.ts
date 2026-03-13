import { NextResponse } from 'next/server'
export async function GET() {
  return NextResponse.json({
    stripe_key_prefix: (process.env.STRIPE_SECRET_KEY ?? '').slice(0,15),
    stripe_set: !!process.env.STRIPE_SECRET_KEY,
  })
}
