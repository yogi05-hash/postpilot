// eslint-disable-next-line @typescript-eslint/no-require-imports
const Stripe = require('stripe')
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '', {})
