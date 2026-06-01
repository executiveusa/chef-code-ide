import Stripe from 'stripe';

export function getStripe(): Stripe | null {
  const key = globalThis.process.env.STRIPE_SECRET_KEY;
  if (!key) {
    return null;
  }
  return new Stripe(key, { apiVersion: '2026-05-27.dahlia' });
}

export const PLANS = {
  starter: {
    priceId: globalThis.process.env.STRIPE_STARTER_PRICE_ID ?? '',
    amount: 4900,
    label: 'Starter',
    interval: 'month' as const,
  },
  pro: {
    priceId: globalThis.process.env.STRIPE_PRO_PRICE_ID ?? '',
    amount: 9900,
    label: 'Pro',
    interval: 'month' as const,
  },
  'white-label': {
    priceId: globalThis.process.env.STRIPE_WHITELABEL_PRICE_ID ?? '',
    amount: 29900,
    label: 'White-Label',
    interval: 'month' as const,
  },
} as const;

export type PlanKey = keyof typeof PLANS;
