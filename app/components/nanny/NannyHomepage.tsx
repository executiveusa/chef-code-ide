import { useState } from 'react';
import type { NannyBrand } from '~/lib/nanny/brand';
import { DEFAULT_BRAND } from '~/lib/nanny/brand';
import { NannyAvatar } from './NannyAvatar';
import type { TokenTelemetry } from '~/lib/nanny/llm-router';
import { NannyTokenTelemetry } from './NannyTokenTelemetry';

interface NannyHomepageProps {
  brand?: NannyBrand;
}

type ActiveAction = 'menu' | 'provision' | 'service' | 'flyer' | null;

export function NannyHomepage({ brand = DEFAULT_BRAND }: NannyHomepageProps) {
  const [activeAction, setActiveAction] = useState<ActiveAction>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<unknown>(null);
  const [telemetry, setTelemetry] = useState<TokenTelemetry | null>(null);
  const [error, setError] = useState<string | null>(null);

  const primaryStyle = { backgroundColor: brand.primaryColor };
  const accentStyle = { color: brand.secondaryColor };

  async function handleAction(action: ActiveAction) {
    setActiveAction(action);
    setLoading(true);
    setError(null);
    setResult(null);
    setTelemetry(null);

    const endpoints: Record<NonNullable<ActiveAction>, string> = {
      menu: '/api/nanny/menu/create',
      provision: '/api/nanny/event/plan',
      service: '/api/nanny/service/runbook',
      flyer: '/api/nanny/creative/brief',
    };

    try {
      const res = await fetch(endpoints[action!], {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      const data = (await res.json()) as { telemetry?: TokenTelemetry } & Record<string, unknown>;
      setResult(data);
      if (data.telemetry) {
        setTelemetry(data.telemetry);
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen font-sans" style={{ backgroundColor: brand.backgroundColor }}>
      {/* Hero */}
      <header className="px-6 pb-8 pt-12 text-center">
        <div className="mb-6 flex justify-center">
          <NannyAvatar brand={brand} size="xl" status={loading ? 'thinking' : 'idle'} />
        </div>
        <h1 className="mb-3 text-4xl font-bold tracking-tight" style={{ color: brand.primaryColor }}>
          {brand.name}
        </h1>
        <p className="mx-auto max-w-md text-lg leading-relaxed text-gray-600">{brand.tagline}</p>
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {brand.cuisineFocus.slice(0, 4).map((c) => (
            <span
              key={c}
              className="rounded-full border px-3 py-1 text-xs font-medium"
              style={{ borderColor: brand.secondaryColor, ...accentStyle }}
            >
              {c}
            </span>
          ))}
        </div>
      </header>

      {/* What is this */}
      <section className="mx-auto max-w-lg p-6">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-500">What is {brand.name}?</h2>
          <p className="text-base leading-relaxed text-gray-700">
            A premium hospitality AI for ghost kitchens, private chefs, and event operators who celebrate{' '}
            <span className="font-medium" style={accentStyle}>
              {brand.cuisineFocus.slice(0, 2).join(' and ')}
            </span>{' '}
            cuisine. Design menus, plan events, generate provisioning lists, and run service — all in one place.
          </p>
        </div>
      </section>

      {/* Primary CTA */}
      <section className="mx-auto max-w-lg px-6 py-4">
        <button
          onClick={() => handleAction('service')}
          disabled={loading}
          className="w-full rounded-2xl py-4 text-lg font-semibold text-white shadow-md transition-all active:scale-95 disabled:opacity-60"
          style={primaryStyle}
        >
          {loading && activeAction === 'service' ? 'Planning...' : brand.ctaCopy.primary}
        </button>
        <p className="mt-2 text-center text-xs text-gray-400">Generates a full service runbook instantly</p>
      </section>

      {/* Secondary CTAs */}
      <section className="mx-auto max-w-lg px-6 py-4">
        <div className="grid grid-cols-2 gap-3">
          {brand.ctaCopy.secondary.map((label, i) => {
            const actions: ActiveAction[] = ['menu', 'provision', 'service', 'flyer'];
            const act = actions[i] ?? 'menu';
            return (
              <button
                key={label}
                onClick={() => handleAction(act)}
                disabled={loading}
                className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-left text-sm font-medium text-gray-700 shadow-sm transition-colors hover:border-gray-300 active:bg-gray-50 disabled:opacity-60"
              >
                {loading && activeAction === act ? <span className="text-gray-400">Working...</span> : label}
              </button>
            );
          })}
        </div>
      </section>

      {/* Result Panel */}
      {(result !== null || error) && (
        <section className="mx-auto max-w-lg px-6 py-4">
          {error ? (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>
          ) : (
            <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
              <div className="mb-3 flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                  {activeAction === 'menu' && 'Menu Generated'}
                  {activeAction === 'provision' && 'Event Plan Ready'}
                  {activeAction === 'service' && 'Service Runbook Ready'}
                  {activeAction === 'flyer' && 'Creative Brief Ready'}
                </span>
                <span className="ml-auto rounded-full bg-emerald-100 px-2 py-0.5 text-xs text-emerald-700">
                  Mock Mode
                </span>
              </div>
              <pre className="max-h-64 overflow-auto whitespace-pre-wrap break-words text-xs text-gray-600">
                {JSON.stringify(result, null, 2)}
              </pre>
              {telemetry && (
                <div className="mt-3 border-t border-gray-100 pt-3">
                  <NannyTokenTelemetry telemetry={telemetry} compact />
                </div>
              )}
            </div>
          )}
        </section>
      )}

      {/* Why premium */}
      <section className="mx-auto max-w-lg px-6 py-8">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-500">Why {brand.name}?</h2>
        <div className="space-y-3">
          {[
            ['🌿', 'Cuisine-first', 'Built around African, Caribbean, and diaspora foodways — not generic templates'],
            ['🎯', 'Service-focused', 'Every feature maps to real hospitality work: prep, service, cleanup, creative'],
            ['🔒', 'Secrets-safe', 'Zero API keys in the browser. Clean frontend/backend boundary always'],
            ['📱', 'Mobile-first', 'Designed for chefs and nannies working in service — not just at desks'],
            ['🏷️', 'White-label ready', 'Swap avatar, colors, cuisine, and copy for any ghost kitchen brand'],
          ].map(([icon, title, desc]) => (
            <div key={title} className="flex items-start gap-3 rounded-xl border border-gray-200 bg-white p-4">
              <span className="shrink-0 text-2xl">{icon}</span>
              <div>
                <p className="text-sm font-semibold text-gray-800">{title}</p>
                <p className="mt-0.5 text-xs text-gray-500">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Quick access */}
      <section className="mx-auto max-w-lg px-6 pb-4">
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-gray-400">Quick Access</p>
        <div className="grid grid-cols-2 gap-2">
          {[
            { href: '/nanny/voice', icon: '🎙️', label: 'Voice Console' },
            { href: '/nanny/creative', icon: '🎨', label: 'Creative Studio' },
            { href: '/nanny/service', icon: '📋', label: 'Service Mode' },
            { href: '/nanny/admin', icon: '⚙️', label: 'Brand Admin' },
          ].map(({ href, icon, label }) => (
            <a
              key={href}
              href={href}
              className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:border-gray-300 hover:text-gray-900"
            >
              <span>{icon}</span>
              {label}
            </a>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 px-6 py-8 text-center text-xs text-gray-400">
        <div className="mb-3 flex justify-center">
          <NannyAvatar brand={brand} size="sm" />
        </div>
        <p>
          {brand.name} · {brand.cuisineFocus.join(' · ')}
        </p>
        <p className="mt-1">{brand.tagline}</p>
      </footer>
    </div>
  );
}
