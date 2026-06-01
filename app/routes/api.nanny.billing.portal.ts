import { json, type ActionFunctionArgs } from '@vercel/remix';
import { getStripe } from '~/lib/.server/stripe';

interface PortalBody {
  customerId: string;
  returnUrl: string;
}

export const action = async ({ request }: ActionFunctionArgs) => {
  if (request.method !== 'POST') {
    return json({ error: 'Method not allowed' }, { status: 405 });
  }

  let body: PortalBody;
  try {
    body = (await request.json()) as PortalBody;
  } catch {
    return json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { customerId, returnUrl } = body;

  if (!returnUrl) {
    return json({ error: 'returnUrl is required' }, { status: 400 });
  }

  const stripe = getStripe();

  // Mock mode when no Stripe key configured
  if (!stripe) {
    return json({ url: '/nanny/billing?mock=1', mockMode: true });
  }

  if (!customerId) {
    return json({ error: 'customerId is required' }, { status: 400 });
  }

  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  });

  return json({ url: session.url, mockMode: false });
};
