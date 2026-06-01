export type NannyPlan = 'free' | 'starter' | 'pro' | 'white-label';

interface RawSubscription {
  plan: NannyPlan;
  status: 'active' | 'canceled' | 'past_due' | 'trialing';
}

function isRawSubscription(v: unknown): v is RawSubscription {
  if (!v || typeof v !== 'object') {
    return false;
  }
  const obj = v as Record<string, unknown>;
  return typeof obj.plan === 'string' && typeof obj.status === 'string';
}

async function fetchSubscriptionFromConvex(sessionId: string): Promise<RawSubscription | null> {
  const convexUrl = globalThis.process.env.CONVEX_URL ?? globalThis.process.env.VITE_CONVEX_URL ?? '';
  if (!convexUrl) {
    return null;
  }

  try {
    const res = await fetch(`${convexUrl}/api/query`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        path: 'nannySubscriptions:getSubscription',
        args: { sessionId },
        format: 'json',
      }),
    });

    if (!res.ok) {
      return null;
    }

    const data = (await res.json()) as { value?: unknown };
    const val = data.value;
    if (!isRawSubscription(val)) {
      return null;
    }
    return val;
  } catch {
    return null;
  }
}

/**
 * Check the subscription plan for a given session.
 * Returns 'pro' (open access) when Stripe is not configured (dev mode).
 */
export async function checkNannySubscription(sessionId: string): Promise<NannyPlan> {
  const stripeKey = globalThis.process.env.STRIPE_SECRET_KEY;

  // Dev / mock mode: no Stripe configured → grant full pro access
  if (!stripeKey) {
    return 'pro';
  }

  try {
    const sub = await fetchSubscriptionFromConvex(sessionId);

    if (!sub) {
      return 'free';
    }
    if (sub.status === 'canceled') {
      return 'free';
    }
    if (sub.status === 'past_due') {
      return 'free';
    }

    return sub.plan;
  } catch (err) {
    console.error('[checkNannySubscription] Error:', err);
    return 'free';
  }
}
