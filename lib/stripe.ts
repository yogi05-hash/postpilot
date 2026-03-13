import Stripe from 'stripe'

let _stripe: Stripe | null = null

export function getStripe(): Stripe {
  if (!_stripe) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '')
  }
  return _stripe
}

// Keep named export for backwards compat
export const stripe = {
  get customers() { return getStripe().customers },
  get checkout() { return getStripe().checkout },
  get webhooks() { return getStripe().webhooks },
}
