import { useState, useEffect } from 'react';

interface Plan {
  key: 'free' | 'starter' | 'pro' | 'white-label';
  label: string;
  price: string;
  features: string[];
  highlighted?: boolean;
}

const PLANS: Plan[] = [
  {
    key: 'free',
    label: 'Free',
    price: '$0 / mo',
    features: ['1 event plan / month', 'Basic menu generation', 'Community support'],
  },
  {
    key: 'starter',
    label: 'Starter',
    price: '$49 / mo',
    features: ['10 event plans / month', 'Menu + runbook generation', 'Email support'],
  },
  {
    key: 'pro',
    label: 'Pro',
    price: '$99 / mo',
    features: ['Unlimited event plans', 'All AI modules', 'Voice console', 'Priority support'],
    highlighted: true,
  },
  {
    key: 'white-label',
    label: 'White-Label',
    price: '$299 / mo',
    features: ['Everything in Pro', 'Custom branding', 'Custom domain', 'Dedicated support'],
  },
];

interface NannyBillingPageProps {
  mockMode: boolean;
}

export function NannyBillingPage({ mockMode }: NannyBillingPageProps) {
  const [currentPlan, setCurrentPlan] = useState<string>('free');
  const [stripeCustomerId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    // Check for mock success query param
    const params = new URLSearchParams(window.location.search);
    if (params.get('mock') === '1') {
      setStatusMessage('Mock mode: billing portal would open here in production.');
    }
    if (params.get('success') === '1') {
      setStatusMessage('Subscription activated! Your plan has been updated.');
      setCurrentPlan('pro');
    }
  }, []);

  const handleUpgrade = async (planKey: 'starter' | 'pro' | 'white-label') => {
    setLoading(true);
    setStatusMessage(null);

    try {
      const origin = window.location.origin;
      const res = await fetch('/api/nanny/billing/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan: planKey,
          successUrl: `${origin}/nanny/billing?success=1`,
          cancelUrl: `${origin}/nanny/billing?canceled=1`,
        }),
      });

      const data = (await res.json()) as { url?: string; mockMode?: boolean; error?: string };

      if (data.error) {
        setStatusMessage(`Error: ${data.error}`);
        return;
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (_err) {
      setStatusMessage('Failed to start checkout. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleManage = async () => {
    if (!stripeCustomerId) {
      setStatusMessage('No active subscription found. Please upgrade first.');
      return;
    }

    setLoading(true);
    setStatusMessage(null);

    try {
      const origin = window.location.origin;
      const res = await fetch('/api/nanny/billing/portal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId: stripeCustomerId,
          returnUrl: `${origin}/nanny/billing`,
        }),
      });

      const data = (await res.json()) as { url?: string; mockMode?: boolean; error?: string };

      if (data.error) {
        setStatusMessage(`Error: ${data.error}`);
        return;
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (_err) {
      setStatusMessage('Failed to open billing portal. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 px-4 py-12 text-white">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="mb-3 text-4xl font-bold tracking-tight">Nanny Billing & Plans</h1>
          <p className="text-lg text-gray-400">Choose the plan that fits your kitchen</p>
          {mockMode && (
            <div className="mt-4 inline-block rounded-lg border border-amber-700 bg-amber-900/40 px-4 py-2 text-sm text-amber-300">
              Mock Mode — Stripe not configured. All billing actions simulate success.
            </div>
          )}
        </div>

        {/* Current plan banner */}
        <div className="mb-8 flex items-center justify-between rounded-xl border border-gray-800 bg-gray-900 p-4">
          <div>
            <span className="text-sm text-gray-400">Current plan:</span>{' '}
            <span className="font-semibold capitalize">{currentPlan}</span>
          </div>
          {currentPlan !== 'free' && (
            <button
              onClick={handleManage}
              disabled={loading}
              className="rounded-lg bg-gray-800 px-4 py-2 text-sm transition-colors hover:bg-gray-700 disabled:opacity-50"
            >
              Manage Subscription
            </button>
          )}
        </div>

        {/* Status message */}
        {statusMessage && (
          <div className="mb-6 rounded-lg border border-green-700 bg-green-900/40 p-3 text-sm text-green-300">
            {statusMessage}
          </div>
        )}

        {/* Plans grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {PLANS.map((plan) => {
            const isActive = plan.key === currentPlan;
            return (
              <div
                key={plan.key}
                className={[
                  'flex flex-col rounded-2xl border p-6 transition-all',
                  plan.highlighted
                    ? 'border-emerald-500 bg-emerald-950/30 shadow-lg shadow-emerald-900/20'
                    : 'border-gray-800 bg-gray-900',
                ].join(' ')}
              >
                {plan.highlighted && (
                  <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-emerald-400">
                    Most Popular
                  </div>
                )}
                <h2 className="mb-1 text-xl font-bold">{plan.label}</h2>
                <p className="mb-4 text-2xl font-semibold text-gray-200">{plan.price}</p>
                <ul className="mb-6 flex-1 space-y-2">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-gray-300">
                      <span className="mt-0.5 text-emerald-400">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>

                {plan.key === 'free' ? (
                  <div
                    className={[
                      'text-center py-2 rounded-lg text-sm font-medium',
                      isActive
                        ? 'bg-gray-700 text-gray-400 cursor-default'
                        : 'bg-gray-800 text-gray-400 cursor-default',
                    ].join(' ')}
                  >
                    {isActive ? 'Current Plan' : 'Free Forever'}
                  </div>
                ) : (
                  <button
                    onClick={() => void handleUpgrade(plan.key as 'starter' | 'pro' | 'white-label')}
                    disabled={loading || isActive}
                    className={[
                      'py-2 rounded-lg text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed',
                      isActive
                        ? 'bg-gray-700 text-gray-400 cursor-default'
                        : plan.highlighted
                          ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                          : 'bg-gray-700 hover:bg-gray-600 text-white',
                    ].join(' ')}
                  >
                    {isActive ? 'Current Plan' : loading ? 'Loading…' : `Upgrade to ${plan.label}`}
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer note */}
        <p className="mt-10 text-center text-xs text-gray-600">
          Payments are processed securely by Stripe. Cancel anytime.
          {mockMode && ' (Mock mode — no real charges in development)'}
        </p>
      </div>
    </div>
  );
}
