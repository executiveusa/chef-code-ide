import type { MetaFunction } from '@vercel/remix';

export const meta: MetaFunction = () => [
  { title: 'Pricing — Nanny Plant-Based Hospitality OS' },
  {
    name: 'description',
    content: 'Simple, transparent pricing for ghost kitchens, private chefs, and estate operators.',
  },
];

const PLANS = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Try Nanny with no commitment.',
    color: 'border-[#2D5016]/15 bg-white',
    badge: null,
    features: [
      '5 menu generations / month',
      '3 event plans / month',
      'Creative briefs (2 / month)',
      'Mock mode only',
      'Community support',
    ],
    cta: 'Start Free',
    ctaHref: '/nanny',
    ctaStyle: 'border-2 border-[#2D5016] text-[#2D5016] bg-white hover:bg-[#2D5016]/5',
  },
  {
    name: 'Starter',
    price: '$49',
    period: 'per month',
    description: 'For solo chefs running regular events.',
    color: 'border-[#2D5016]/30 bg-white',
    badge: null,
    features: [
      '50 menu generations / month',
      'Unlimited event plans',
      'Unlimited creative briefs',
      'Real LLM (Claude Haiku)',
      'Voice console',
      'PDF export',
      'Email support',
    ],
    cta: 'Start 14-Day Trial',
    ctaHref: '/nanny/billing?plan=starter',
    ctaStyle: 'bg-[#2D5016] text-white hover:bg-[#3d6b1e]',
  },
  {
    name: 'Pro',
    price: '$99',
    period: 'per month',
    description: 'For growing kitchens with a team.',
    color: 'border-[#2D5016] bg-[#2D5016]/3',
    badge: 'Most Popular',
    features: [
      'Unlimited everything',
      'Real LLM (Claude Sonnet)',
      'Vision console (photo → menu)',
      'Provisioning lists',
      'Team workspace (up to 5)',
      'Priority email + chat support',
      'Custom brand config',
    ],
    cta: 'Start 14-Day Trial',
    ctaHref: '/nanny/billing?plan=pro',
    ctaStyle: 'bg-[#2D5016] text-white hover:bg-[#3d6b1e]',
  },
  {
    name: 'White-Label',
    price: '$299',
    period: 'per month',
    description: 'Your brand. Your clients. Your kitchen OS.',
    color: 'border-[#7CB342] bg-white',
    badge: 'For Operators',
    features: [
      'Everything in Pro',
      'Full white-label branding',
      'Unlimited team members',
      'Multi-organization support',
      'Brand kit export',
      'Custom domain support',
      'Dedicated onboarding call',
      'SLA + priority support',
    ],
    cta: 'Contact Us',
    ctaHref: 'mailto:hello@nanny.kitchen',
    ctaStyle: 'bg-[#7CB342] text-white hover:bg-[#6aa832]',
  },
];

const FAQS = [
  {
    q: 'What is Nanny?',
    a: 'Nanny is a plant-based hospitality OS for ghost kitchens, private chefs, caterers, and estate operators. It generates menus, event plans, service runbooks, provisioning lists, and creative assets — all rooted in Afro-Caribbean and diaspora culinary traditions.',
  },
  {
    q: 'Can I use Nanny without an Anthropic API key?',
    a: 'Yes. Free and Starter plans use Nanny-hosted LLM access. You never need to manage API keys.',
  },
  {
    q: 'What does "white-label" mean?',
    a: 'White-label means Nanny runs under your brand name, logo, colors, and domain. Your clients see "Zuri\'s Kitchen OS" — not Nanny. Perfect for consultants and operators managing multiple brands.',
  },
  {
    q: 'Is my kitchen data private?',
    a: 'Yes. Your menus, event plans, and brand config are stored in your isolated workspace. Prompts sent to Claude are processed by Anthropic under their data processing agreement. We never sell your data.',
  },
  {
    q: 'Can I cancel anytime?',
    a: "Yes, cancel any time. Your data stays accessible until the end of your billing period. We don't do annual lock-ins on monthly plans.",
  },
];

export default function NannyPricingPage() {
  return (
    <div className="min-h-screen" style={{ background: '#FAFAF7' }}>
      {/* Nav */}
      <div className="border-b border-[#2D5016]/10 bg-[#FAFAF7]/95 px-4 py-3">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <a href="/nanny" className="flex items-center gap-2 text-sm font-semibold text-[#2D5016]">
            <img src="/chef.svg" alt="Nanny" className="size-6" />
            Nanny
          </a>
          <a href="/nanny" className="text-sm font-medium text-[#2D5016]/70 hover:text-[#2D5016]">
            ← Back
          </a>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-16">
        {/* Hero */}
        <div className="mb-16 text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[#2D5016]/60">Pricing</p>
          <h1 className="mb-4 text-4xl font-bold" style={{ color: '#1A1A18' }}>
            Simple pricing for serious kitchens
          </h1>
          <p className="mx-auto max-w-xl text-lg" style={{ color: '#1A1A18', opacity: 0.6 }}>
            Start free. Upgrade when you&apos;re ready. Cancel anytime.
          </p>
        </div>

        {/* Plans grid */}
        <div className="mb-20 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PLANS.map((plan) => (
            <div key={plan.name} className={`relative flex flex-col rounded-2xl border-2 p-6 ${plan.color}`}>
              {plan.badge && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#2D5016] px-3 py-1 text-xs font-semibold text-white">
                  {plan.badge}
                </span>
              )}

              <div className="mb-6">
                <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-[#2D5016]/60">{plan.name}</p>
                <div className="mb-2 flex items-baseline gap-1">
                  <span className="text-3xl font-bold" style={{ color: '#1A1A18' }}>
                    {plan.price}
                  </span>
                  <span className="text-sm" style={{ color: '#1A1A18', opacity: 0.5 }}>
                    /{plan.period}
                  </span>
                </div>
                <p className="text-sm" style={{ color: '#1A1A18', opacity: 0.6 }}>
                  {plan.description}
                </p>
              </div>

              <ul className="mb-8 flex-1 space-y-2.5">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm" style={{ color: '#1A1A18', opacity: 0.8 }}>
                    <span className="mt-0.5 shrink-0 text-[#2D5016]">✓</span>
                    {f}
                  </li>
                ))}
              </ul>

              <a
                href={plan.ctaHref}
                className={`block w-full rounded-xl py-3 text-center text-sm font-semibold transition-colors ${plan.ctaStyle}`}
              >
                {plan.cta}
              </a>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="mb-16">
          <h2 className="mb-8 text-center text-2xl font-bold" style={{ color: '#1A1A18' }}>
            Frequently Asked Questions
          </h2>
          <div className="mx-auto max-w-2xl space-y-6">
            {FAQS.map(({ q, a }) => (
              <div key={q} className="rounded-2xl border border-[#2D5016]/10 bg-white p-6">
                <p className="mb-2 font-semibold" style={{ color: '#1A1A18' }}>
                  {q}
                </p>
                <p className="text-sm leading-relaxed" style={{ color: '#1A1A18', opacity: 0.7 }}>
                  {a}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer CTA */}
        <div className="rounded-3xl bg-[#2D5016] p-10 text-center text-white">
          <h2 className="mb-3 text-2xl font-bold">Ready to upgrade your kitchen?</h2>
          <p className="mb-8 text-white/70">Join plant-based operators running better service with Nanny.</p>
          <a
            href="/nanny?demo=1"
            className="inline-block rounded-xl bg-white px-8 py-3 text-sm font-semibold text-[#2D5016] transition-colors hover:bg-white/90"
          >
            Try Demo — No Login Required
          </a>
        </div>
      </div>

      {/* Footer links */}
      <div className="border-t border-[#2D5016]/10 py-8 text-center">
        <div className="flex items-center justify-center gap-6 text-xs text-[#1A1A18]/40">
          <a href="/nanny/terms" className="hover:text-[#2D5016]">
            Terms
          </a>
          <a href="/nanny/privacy" className="hover:text-[#2D5016]">
            Privacy
          </a>
          <a href="mailto:hello@nanny.kitchen" className="hover:text-[#2D5016]">
            hello@nanny.kitchen
          </a>
        </div>
      </div>
    </div>
  );
}
