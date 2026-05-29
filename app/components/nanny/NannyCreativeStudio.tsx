import { useState } from 'react';
import type { NannyBrand } from '~/lib/nanny/brand';
import { DEFAULT_BRAND } from '~/lib/nanny/brand';
import { NannyAvatar } from './NannyAvatar';
import { NannyTokenTelemetry } from './NannyTokenTelemetry';
import type { TokenTelemetry } from '~/lib/nanny/llm-router';
import type { CreativeAssetType, CreativeBrief } from '~/lib/nanny/modules/creative-studio';

interface NannyCreativeStudioProps {
  brand?: NannyBrand;
}

const ASSET_TYPES: { type: CreativeAssetType; label: string; icon: string; description: string }[] = [
  { type: 'social-post', label: 'Social Post', icon: '📲', description: 'Instagram / LinkedIn ready' },
  { type: 'instagram-caption', label: 'Caption', icon: '✍️', description: 'Grid-native storytelling' },
  { type: 'event-flyer', label: 'Event Flyer', icon: '📋', description: 'Print & digital ready' },
  { type: 'menu-pdf', label: 'Menu PDF', icon: '🍽️', description: 'Guest-facing menu copy' },
  { type: 'email-campaign', label: 'Email', icon: '📧', description: 'Invite & announcement' },
  { type: 'website-copy', label: 'Website Copy', icon: '🌐', description: 'Homepage & about sections' },
  { type: 'press-release', label: 'Press Release', icon: '📰', description: 'Media & PR outreach' },
];

export function NannyCreativeStudio({ brand = DEFAULT_BRAND }: NannyCreativeStudioProps) {
  const [selectedType, setSelectedType] = useState<CreativeAssetType>('social-post');
  const [brief, setBrief] = useState<CreativeBrief | null>(null);
  const [telemetry, setTelemetry] = useState<TokenTelemetry | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  async function generateBrief() {
    setLoading(true);
    setError(null);
    setBrief(null);
    setTelemetry(null);
    setCopied(false);
    try {
      const res = await fetch('/api/nanny/creative/brief', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assetType: selectedType }),
      });
      if (!res.ok) {
        throw new Error(`Request failed: ${res.status}`);
      }
      const data = (await res.json()) as { brief: CreativeBrief; telemetry: TokenTelemetry; mockMode: boolean };
      setBrief(data.brief);
      setTelemetry(data.telemetry);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  }

  async function copyBrief() {
    if (!brief) {
      return;
    }
    const text = [
      brief.headline && `HEADLINE\n${brief.headline}`,
      brief.subheadline && `\nSUBHEADLINE\n${brief.subheadline}`,
      brief.bodyText && `\nBODY\n${brief.bodyText}`,
      brief.callToAction && `\nCTA\n${brief.callToAction}`,
      brief.hashtags?.length && `\nHASHTAGS\n${brief.hashtags.join(' ')}`,
      brief.toneSummary && `\nTONE\n${brief.toneSummary}`,
      brief.imageDirection && `\nVISUAL DIRECTION\n${brief.imageDirection}`,
    ]
      .filter(Boolean)
      .join('\n');
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const selected = ASSET_TYPES.find((a) => a.type === selectedType);

  return (
    <div className="min-h-screen" style={{ background: '#FAFAF7' }}>
      {/* Header */}
      <div className="sticky top-0 z-10 border-b border-[#2D5016]/10 bg-[#FAFAF7]/95 backdrop-blur-sm">
        <div className="mx-auto max-w-2xl p-4">
          <div className="flex items-center gap-3">
            <NannyAvatar brand={brand} size="sm" status="idle" />
            <div>
              <p className="text-xs font-medium uppercase tracking-widest text-[#2D5016]/60">{brand.name}</p>
              <h1 className="text-lg font-semibold leading-tight" style={{ color: '#1A1A18' }}>
                Creative Studio
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-2xl space-y-8 px-4 py-8">
        {/* Asset type picker */}
        <section>
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[#2D5016]/60">Choose Asset Type</p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
            {ASSET_TYPES.map(({ type, label, icon, description }) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={[
                  'flex flex-col items-start gap-1 rounded-xl border-2 p-3 text-left transition-all duration-150',
                  'focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7CB342] focus-visible:ring-offset-2',
                  selectedType === type
                    ? 'border-[#2D5016] bg-[#2D5016] text-white shadow-sm'
                    : 'border-[#2D5016]/15 bg-white text-[#1A1A18] hover:border-[#2D5016]/40',
                ].join(' ')}
              >
                <span className="text-xl">{icon}</span>
                <span className="text-sm font-semibold">{label}</span>
                <span
                  className={`text-xs leading-tight ${selectedType === type ? 'text-white/70' : 'text-[#1A1A18]/50'}`}
                >
                  {description}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* Generate CTA */}
        <section>
          <button
            onClick={generateBrief}
            disabled={loading}
            className={[
              'w-full rounded-2xl py-4 text-base font-semibold tracking-wide transition-all duration-150',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7CB342] focus-visible:ring-offset-2',
              loading
                ? 'cursor-not-allowed bg-[#2D5016]/40 text-white/60'
                : 'bg-[#2D5016] text-white shadow-sm hover:bg-[#3d6b1e] active:scale-[0.98]',
            ].join(' ')}
            aria-busy={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="inline-block size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Generating {selected?.label}…
              </span>
            ) : (
              `Generate ${selected?.label ?? 'Brief'} →`
            )}
          </button>
        </section>

        {/* Error state */}
        {error && (
          <section className="rounded-2xl border border-red-200 bg-red-50 p-4" role="alert">
            <p className="text-sm font-medium text-red-700">{error}</p>
            <button
              onClick={generateBrief}
              className="mt-2 text-xs font-semibold text-red-600 underline underline-offset-2"
            >
              Try again
            </button>
          </section>
        )}

        {/* Brief result */}
        {brief && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-widest text-[#2D5016]/60">
                {selected?.icon} {selected?.label} Brief
              </p>
              <button
                onClick={copyBrief}
                className="rounded-lg bg-[#2D5016]/10 px-3 py-1.5 text-xs font-semibold text-[#2D5016] transition-colors hover:bg-[#2D5016]/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7CB342]"
              >
                {copied ? '✓ Copied' : 'Copy All'}
              </button>
            </div>

            <div className="space-y-3">
              {brief.headline && <BriefField label="Headline" value={brief.headline} large />}
              {brief.subheadline && <BriefField label="Subheadline" value={brief.subheadline} />}
              {brief.bodyText && <BriefField label="Body Copy" value={brief.bodyText} multiline />}
              {brief.callToAction && <BriefField label="Call to Action" value={brief.callToAction} highlight />}
              {brief.hashtags && brief.hashtags.length > 0 && (
                <div className="rounded-2xl border border-[#2D5016]/10 bg-white p-4">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#2D5016]/50">Hashtags</p>
                  <div className="flex flex-wrap gap-2">
                    {brief.hashtags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-[#2D5016]/10 px-2.5 py-1 text-xs font-medium text-[#2D5016]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {brief.toneSummary && <BriefField label="Tone & Voice" value={brief.toneSummary} />}
              {brief.imageDirection && <BriefField label="Visual Direction" value={brief.imageDirection} />}
              {brief.colorGuidance && <BriefField label="Color Guidance" value={brief.colorGuidance} />}
            </div>

            {telemetry && <NannyTokenTelemetry telemetry={telemetry} compact />}
          </section>
        )}
      </div>
    </div>
  );
}

function BriefField({
  label,
  value,
  large,
  multiline,
  highlight,
}: {
  label: string;
  value: string;
  large?: boolean;
  multiline?: boolean;
  highlight?: boolean;
}) {
  return (
    <div
      className={[
        'rounded-2xl border p-4',
        highlight ? 'border-[#7CB342]/40 bg-[#7CB342]/10' : 'border-[#2D5016]/10 bg-white',
      ].join(' ')}
    >
      <p className="mb-1.5 text-xs font-semibold uppercase tracking-widest text-[#2D5016]/50">{label}</p>
      <p
        className={[
          'leading-relaxed',
          large ? 'text-lg font-semibold text-[#1A1A18]' : 'text-sm text-[#1A1A18]/80',
          multiline ? 'whitespace-pre-line' : '',
        ].join(' ')}
      >
        {value}
      </p>
    </div>
  );
}
