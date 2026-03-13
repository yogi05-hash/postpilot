import Stripe from 'stripe'
// stripe v20 uses a newer API version than the type expects — ts-ignore avoids build error
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const stripe: Stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '')
