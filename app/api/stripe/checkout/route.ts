import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'

const STRIPE_KEY = () => process.env.STRIPE_SECRET_KEY ?? ''
const STRIPE_BASE = 'https://api.stripe.com/v1'

async function stripePost(path: string, body: Record<string, string | number | Record<string, string | number>>) {
  const params = new URLSearchParams()
  for (const [k, v] of Object.entries(body)) {
    if (typeof v === 'object') {
      for (const [sk, sv] of Object.entries(v)) {
        params.append(`${k}[${sk}]`, String(sv))
      }
    } else {
      params.append(k, String(v))
    }
  }
  const res = await fetch(`${STRIPE_BASE}${path}`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${Buffer.from(STRIPE_KEY() + ':').toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params.toString(),
  })
  return res.json()
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    const origin = req.headers.get('origin') || 'https://postpilot-lovat.vercel.app'

    // Get or create Stripe customer
    let customerId: string
    const { data: profile } = await supabase.from('postpilot_profiles').select('stripe_customer_id').eq('id', user.id).single()

    if (profile?.stripe_customer_id) {
      customerId = profile.stripe_customer_id
    } else {
      const customer = await stripePost('/customers', {
        email: user.email ?? '',
        'metadata[supabase_user_id]': user.id,
      })
      if (customer.error) return NextResponse.json({ error: customer.error.message }, { status: 500 })
      customerId = customer.id
      await supabase.from('postpilot_profiles').update({ stripe_customer_id: customerId }).eq('id', user.id)
    }

    // Create checkout session — flatten nested params for URLSearchParams
    const params = new URLSearchParams()
    params.append('customer', customerId)
    params.append('mode', 'subscription')
    params.append('payment_method_types[0]', 'card')
    params.append('line_items[0][price]', 'price_1TAUybA2q8UNYVztyjGr7Ey1')
    params.append('line_items[0][quantity]', '1')
    params.append('success_url', `${origin}/dashboard?upgraded=true`)
    params.append('cancel_url', `${origin}/pricing`)
    params.append('metadata[supabase_user_id]', user.id)

    const sessionRes = await fetch(`${STRIPE_BASE}/checkout/sessions`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(STRIPE_KEY() + ':').toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    })
    const session = await sessionRes.json()
    if (session.error) return NextResponse.json({ error: session.error.message }, { status: 500 })

    return NextResponse.json({ url: session.url })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
