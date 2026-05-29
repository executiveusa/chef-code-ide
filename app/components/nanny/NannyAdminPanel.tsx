import { useState } from 'react';
import { DEFAULT_BRAND, type NannyBrand } from '~/lib/nanny/brand';
import { NannyAvatar } from './NannyAvatar';

type BrandDraft = Partial<NannyBrand> & { name: string };

const CUISINE_OPTIONS = [
  'African',
  'Caribbean',
  'Soul Food',
  'Diaspora',
  'Vegan',
  'Plant-Based',
  'Mediterranean',
  'Latin',
  'Asian Fusion',
  'New American',
];

export function NannyAdminPanel() {
  const [draft, setDraft] = useState<BrandDraft>({
    name: DEFAULT_BRAND.name,
    tagline: DEFAULT_BRAND.tagline,
    primaryColor: DEFAULT_BRAND.primaryColor,
    secondaryColor: DEFAULT_BRAND.secondaryColor,
    backgroundColor: DEFAULT_BRAND.backgroundColor,
    avatar: DEFAULT_BRAND.avatar,
    cuisineFocus: DEFAULT_BRAND.cuisineFocus,
    ctaCopy: DEFAULT_BRAND.ctaCopy,
    restaurantType: DEFAULT_BRAND.restaurantType,
  });
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const previewBrand: NannyBrand = {
    ...DEFAULT_BRAND,
    ...draft,
    ctaCopy: draft.ctaCopy ?? DEFAULT_BRAND.ctaCopy,
    cuisineFocus: draft.cuisineFocus ?? DEFAULT_BRAND.cuisineFocus,
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetch('/api/nanny/webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event: 'brand.update', payload: draft }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  const set = <K extends keyof BrandDraft>(key: K, val: BrandDraft[K]) => setDraft((d) => ({ ...d, [key]: val }));

  const toggleCuisine = (c: string) => {
    const cur = draft.cuisineFocus ?? [];
    set('cuisineFocus', cur.includes(c) ? cur.filter((x) => x !== c) : [...cur, c]);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: DEFAULT_BRAND.backgroundColor }}>
      {/* Top bar */}
      <header className="flex items-center gap-3 border-b border-gray-200 bg-white px-6 py-4">
        <a href="/nanny" className="text-sm text-gray-500 hover:text-gray-800">
          ← Back to Nanny
        </a>
        <span className="text-gray-300">|</span>
        <h1 className="text-base font-semibold text-gray-900">Brand &amp; Settings</h1>
        <div className="ml-auto">
          <button
            onClick={handleSave}
            disabled={saving}
            className="rounded-lg px-4 py-2 text-sm font-semibold text-white transition-colors disabled:opacity-50"
            style={{ backgroundColor: DEFAULT_BRAND.primaryColor }}
          >
            {saving ? 'Saving…' : saved ? '✓ Saved' : 'Save Changes'}
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Left: Settings form */}
          <div className="space-y-6">
            <Section title="Identity">
              <Field label="Brand Name">
                <input
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-green-700 focus:ring-1 focus:ring-green-700"
                  value={draft.name}
                  onChange={(e) => set('name', e.target.value)}
                  placeholder="Nanny"
                />
              </Field>
              <Field label="Tagline">
                <input
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-green-700 focus:ring-1 focus:ring-green-700"
                  value={draft.tagline ?? ''}
                  onChange={(e) => set('tagline', e.target.value)}
                  placeholder="Premium Plant-Based Hospitality Intelligence"
                />
              </Field>
              <Field label="Restaurant Type">
                <select
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-green-700 focus:ring-1 focus:ring-green-700"
                  value={draft.restaurantType ?? DEFAULT_BRAND.restaurantType}
                  onChange={(e) => set('restaurantType', e.target.value as NannyBrand['restaurantType'])}
                >
                  {[
                    'ghost-kitchen',
                    'restaurant',
                    'catering',
                    'private-chef',
                    'event-operator',
                    'household-manager',
                  ].map((t) => (
                    <option key={t} value={t}>
                      {t.replace(/-/g, ' ')}
                    </option>
                  ))}
                </select>
              </Field>
            </Section>

            <Section title="Colors">
              <Field label="Primary Color">
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={draft.primaryColor ?? DEFAULT_BRAND.primaryColor}
                    onChange={(e) => set('primaryColor', e.target.value)}
                    className="size-10 cursor-pointer rounded border border-gray-200"
                  />
                  <input
                    className="w-full flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-green-700 focus:ring-1 focus:ring-green-700"
                    value={draft.primaryColor ?? DEFAULT_BRAND.primaryColor}
                    onChange={(e) => set('primaryColor', e.target.value)}
                  />
                </div>
              </Field>
              <Field label="Accent Color">
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={draft.secondaryColor ?? DEFAULT_BRAND.secondaryColor}
                    onChange={(e) => set('secondaryColor', e.target.value)}
                    className="size-10 cursor-pointer rounded border border-gray-200"
                  />
                  <input
                    className="w-full flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-green-700 focus:ring-1 focus:ring-green-700"
                    value={draft.secondaryColor ?? DEFAULT_BRAND.secondaryColor}
                    onChange={(e) => set('secondaryColor', e.target.value)}
                  />
                </div>
              </Field>
              <Field label="Background Color">
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={draft.backgroundColor ?? DEFAULT_BRAND.backgroundColor}
                    onChange={(e) => set('backgroundColor', e.target.value)}
                    className="size-10 cursor-pointer rounded border border-gray-200"
                  />
                  <input
                    className="w-full flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-green-700 focus:ring-1 focus:ring-green-700"
                    value={draft.backgroundColor ?? DEFAULT_BRAND.backgroundColor}
                    onChange={(e) => set('backgroundColor', e.target.value)}
                  />
                </div>
              </Field>
            </Section>

            <Section title="Cuisine Focus">
              <div className="flex flex-wrap gap-2">
                {CUISINE_OPTIONS.map((c) => {
                  const selected = (draft.cuisineFocus ?? []).includes(c);
                  return (
                    <button
                      key={c}
                      onClick={() => toggleCuisine(c)}
                      className="rounded-full border px-3 py-1 text-xs font-medium transition-colors"
                      style={
                        selected
                          ? {
                              backgroundColor: draft.primaryColor ?? DEFAULT_BRAND.primaryColor,
                              color: '#fff',
                              borderColor: 'transparent',
                            }
                          : {}
                      }
                    >
                      {c}
                    </button>
                  );
                })}
              </div>
            </Section>

            <Section title="Primary CTA Copy">
              <Field label="Main Button">
                <input
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-green-700 focus:ring-1 focus:ring-green-700"
                  value={draft.ctaCopy?.primary ?? DEFAULT_BRAND.ctaCopy.primary}
                  onChange={(e) =>
                    set('ctaCopy', { ...(draft.ctaCopy ?? DEFAULT_BRAND.ctaCopy), primary: e.target.value })
                  }
                  placeholder="Plan Service"
                />
              </Field>
            </Section>
          </div>

          {/* Right: Live preview */}
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Live Preview</p>
            <div
              className="overflow-hidden rounded-2xl border border-gray-200 shadow-sm"
              style={{ backgroundColor: previewBrand.backgroundColor }}
            >
              <div className="flex flex-col items-center px-6 py-8 text-center">
                <NannyAvatar brand={previewBrand} size="lg" status="idle" />
                <h2 className="mt-4 text-2xl font-bold tracking-tight" style={{ color: previewBrand.primaryColor }}>
                  {previewBrand.name}
                </h2>
                <p className="mt-2 text-sm text-gray-600">{previewBrand.tagline}</p>
                <div className="mt-3 flex flex-wrap justify-center gap-1">
                  {previewBrand.cuisineFocus.slice(0, 4).map((c) => (
                    <span
                      key={c}
                      className="rounded-full border px-2 py-0.5 text-xs"
                      style={{ borderColor: previewBrand.secondaryColor, color: previewBrand.secondaryColor }}
                    >
                      {c}
                    </span>
                  ))}
                </div>
                <button
                  className="mt-6 w-full rounded-xl py-3 text-sm font-semibold text-white"
                  style={{ backgroundColor: previewBrand.primaryColor }}
                >
                  {previewBrand.ctaCopy.primary}
                </button>
              </div>
            </div>

            <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
              <strong>White-label tip:</strong> Changes here are per-session. To persist across users, integrate with
              your Convex backend via the brand config mutation.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5">
      <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-gray-500">{title}</h3>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-gray-700">{label}</label>
      {children}
    </div>
  );
}
