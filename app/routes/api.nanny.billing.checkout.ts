import { json, type ActionFunctionArgs } from '@vercel/remix';
import { getStripe, PLANS, type PlanKey } from '~/lib/.server/stripe';

interface CheckoutBody {
  plan: PlanKey;
  successUrl: string;
  cancelUrl: string;
}

export const action = async ({ request }: ActionFunctionArgs) => {
  if (request.method !== 'POST') {
    return json({ error: 'Method not allowed' }, { status: 405 });
  }

  let body: CheckoutBody;
  try {
    body = (await request.json()) as CheckoutBody;
  } catch {
    return json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { plan, successUrl, cancelUrl } = body;

  if (!plan || !(plan in PLANS)) {
    return json({ error: 'Invalid plan' }, { status: 400 });
  }
  if (!successUrl || !cancelUrl) {
    return json({ error: 'successUrl and cancelUrl are required' }, { status: 400 });
  }

  const stripe = getStripe();

  // Mock mode when no Stripe key configured
  if (!stripe) {
    return json({ url: '/nanny/billing?mock=1', mockMode: true });
  }

  const planConfig = PLANS[plan];

  if (!planConfig.priceId) {
    return json({ error: `No price ID configured for plan: ${plan}` }, { status: 500 });
  }

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    line_items: [{ price: planConfig.priceId, quantity: 1 }],
    success_url: successUrl,
    cancel_url: cancelUrl,
    allow_promotion_codes: true,
  });

  return json({ url: session.url, mockMode: false });
};
