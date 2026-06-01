import { type ActionFunctionArgs } from '@vercel/remix';
import { getStripe } from '~/lib/.server/stripe';
import type Stripe from 'stripe';

type NannyPlan = 'free' | 'starter' | 'pro' | 'white-label';
type NannyStatus = 'active' | 'canceled' | 'past_due' | 'trialing';

function mapStripePlan(sub: Stripe.Subscription): NannyPlan {
  const priceId = sub.items.data[0]?.price?.id ?? '';
  const starterPriceId = globalThis.process.env.STRIPE_STARTER_PRICE_ID ?? '';
  const proPriceId = globalThis.process.env.STRIPE_PRO_PRICE_ID ?? '';
  const whiteLabelPriceId = globalThis.process.env.STRIPE_WHITELABEL_PRICE_ID ?? '';

  if (priceId && priceId === starterPriceId) {
    return 'starter';
  }
  if (priceId && priceId === proPriceId) {
    return 'pro';
  }
  if (priceId && priceId === whiteLabelPriceId) {
    return 'white-label';
  }
  return 'free';
}

function mapStripeStatus(status: Stripe.Subscription.Status): NannyStatus {
  switch (status) {
    case 'active':
      return 'active';
    case 'canceled':
      return 'canceled';
    case 'past_due':
      return 'past_due';
    case 'trialing':
      return 'trialing';
    default:
      return 'active';
  }
}

async function updateConvexSubscription(payload: {
  sessionId: string;
  stripeCustomerId: string;
  stripeSubscriptionId: string;
  plan: NannyPlan;
  status: NannyStatus;
  trialEndsAt?: number;
}): Promise<void> {
  const convexUrl = globalThis.process.env.CONVEX_URL ?? globalThis.process.env.VITE_CONVEX_URL ?? '';
  if (!convexUrl) {
    return;
  }

  // Convex HTTP actions are available at the site URL (replace .cloud with .site)
  const siteUrl = convexUrl.replace('.cloud', '.site');

  await fetch(`${siteUrl}/nanny/subscription/upsert`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

export const action = async ({ request }: ActionFunctionArgs) => {
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  const webhookSecret = globalThis.process.env.STRIPE_WEBHOOK_SECRET;

  // No-op in dev when webhook secret not configured
  if (!webhookSecret) {
    return new Response('OK', { status: 200 });
  }

  const stripe = getStripe();
  if (!stripe) {
    return new Response('Stripe not configured', { status: 200 });
  }

  const sig = request.headers.get('stripe-signature');
  if (!sig) {
    return new Response('Missing signature', { status: 400 });
  }

  const body = await request.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Webhook error';
    return new Response(`Webhook Error: ${message}`, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        if (session.mode !== 'subscription') {
          break;
        }

        const subscriptionId =
          typeof session.subscription === 'string' ? session.subscription : (session.subscription?.id ?? '');

        if (!subscriptionId) {
          break;
        }

        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        const customerId = typeof session.customer === 'string' ? session.customer : (session.customer?.id ?? '');

        const sessionId = session.metadata?.nannySessionId ?? customerId;

        await updateConvexSubscription({
          sessionId,
          stripeCustomerId: customerId,
          stripeSubscriptionId: subscriptionId,
          plan: mapStripePlan(subscription),
          status: mapStripeStatus(subscription.status),
          trialEndsAt: subscription.trial_end ? subscription.trial_end * 1000 : undefined,
        });
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = typeof subscription.customer === 'string' ? subscription.customer : subscription.customer.id;

        await updateConvexSubscription({
          sessionId: subscription.metadata?.nannySessionId ?? customerId,
          stripeCustomerId: customerId,
          stripeSubscriptionId: subscription.id,
          plan: mapStripePlan(subscription),
          status: mapStripeStatus(subscription.status),
          trialEndsAt: subscription.trial_end ? subscription.trial_end * 1000 : undefined,
        });
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = typeof subscription.customer === 'string' ? subscription.customer : subscription.customer.id;

        await updateConvexSubscription({
          sessionId: subscription.metadata?.nannySessionId ?? customerId,
          stripeCustomerId: customerId,
          stripeSubscriptionId: subscription.id,
          plan: 'free',
          status: 'canceled',
        });
        break;
      }

      default:
        // Unhandled event type — ignore
        break;
    }
  } catch (err) {
    console.error('[Stripe Webhook] Handler error:', err);
    return new Response('Handler error', { status: 500 });
  }

  return new Response('OK', { status: 200 });
};
