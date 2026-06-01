import { json, type ActionFunctionArgs } from '@vercel/remix';
import { getCreem, CREEM_PRODUCTS, type CreemPlanKey } from '~/lib/.server/creem';

export const action = async ({ request }: ActionFunctionArgs) => {
  if (request.method !== 'POST') {
    return json({ error: 'Method not allowed' }, { status: 405 });
  }

  let body: { plan: CreemPlanKey; successUrl: string; cancelUrl: string };
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { plan, successUrl } = body;
  if (!plan || !(plan in CREEM_PRODUCTS)) {
    return json({ error: 'Invalid plan' }, { status: 400 });
  }

  const creem = getCreem();
  if (!creem) {
    // Mock mode — no Creem key configured
    return json({ url: `/nanny/billing?mock=1&provider=creem&plan=${plan}`, mockMode: true });
  }

  const productId = CREEM_PRODUCTS[plan];
  if (!productId) {
    return json({ error: `No product ID for plan: ${plan}` }, { status: 500 });
  }

  const checkout = await creem.checkouts.create({
    productId,
    successUrl,
  });

  return json({ url: checkout.checkoutUrl, mockMode: false });
};
