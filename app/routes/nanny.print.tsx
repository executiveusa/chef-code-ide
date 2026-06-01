import type { LoaderFunctionArgs, MetaFunction } from '@vercel/remix';
import { json } from '@vercel/remix';
import { useLoaderData } from '@remix-run/react';

export const meta: MetaFunction = () => [{ title: 'Print — Nanny' }];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const type = url.searchParams.get('type') ?? 'menu';
  const dataParam = url.searchParams.get('data');
  let data: unknown = null;
  if (dataParam) {
    try {
      data = JSON.parse(decodeURIComponent(dataParam));
    } catch {
      data = null;
    }
  }
  return json({ type, data });
};

export default function NannyPrintPage() {
  const { type, data } = useLoaderData<typeof loader>();

  return (
    <div className="min-h-screen bg-white p-8 font-sans text-[#1A1A18] ">
      <style>{`
        @media print {
          .no-print { display: none !important; }
          .print-page { padding: 0; }
          body { font-size: 12pt; }
          h1 { font-size: 20pt; }
          h2 { font-size: 14pt; }
        }
        @page { margin: 2cm; }
      `}</style>

      {/* Print header */}
      <div className="mb-8 flex items-start justify-between border-b-2 border-[#2D5016] pb-6">
        <div>
          <div className="mb-1 flex items-center gap-2">
            <img src="/chef.svg" alt="Nanny" className="size-8" />
            <span className="text-lg font-bold text-[#2D5016]">Nanny</span>
          </div>
          <p className="text-xs text-[#1A1A18]/50">Plant-Based Hospitality Intelligence</p>
        </div>
        <div className="text-right text-xs text-[#1A1A18]/50">
          <p>Generated {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
          <p className="mt-0.5 capitalize">{type.replace(/-/g, ' ')}</p>
        </div>
      </div>

      {/* Content */}
      {type === 'menu' && <MenuPrint data={data} />}
      {type === 'runbook' && <RunbookPrint data={data} />}
      {type === 'brief' && <BriefPrint data={data} />}
      {!['menu', 'runbook', 'brief'].includes(type) && (
        <pre className="rounded-lg bg-gray-50 p-4 text-xs">{JSON.stringify(data, null, 2)}</pre>
      )}

      {/* Print button — hidden on print */}
      <div className="mt-12 text-center print:hidden">
        <button
          onClick={() => window.print()}
          className="rounded-xl bg-[#2D5016] px-8 py-3 text-sm font-semibold text-white hover:bg-[#3d6b1e]"
        >
          Print / Save as PDF
        </button>
        <button
          onClick={() => window.history.back()}
          className="ml-4 rounded-xl border border-[#2D5016]/20 px-8 py-3 text-sm font-semibold text-[#2D5016] hover:bg-[#2D5016]/5"
        >
          ← Back
        </button>
      </div>
    </div>
  );
}

function MenuPrint({ data }: { data: unknown }) {
  const menu = data as Record<string, unknown> | null;
  if (!menu) {
    return <p className="text-sm text-gray-400">No menu data provided.</p>;
  }

  return (
    <div>
      <h1 className="mb-2 text-3xl font-bold text-[#2D5016]">{String(menu.title ?? 'Menu')}</h1>
      {Boolean(menu.description) && (
        <p className="mb-8 text-base leading-relaxed text-[#1A1A18]/70">{String(menu.description)}</p>
      )}
      {Array.isArray(menu.courses) &&
        menu.courses.map((course: unknown, i: number) => {
          const c = course as Record<string, unknown>;
          return (
            <div key={i} className="mb-8">
              <h2 className="mb-4 border-b border-[#2D5016]/20 pb-2 text-lg font-bold uppercase tracking-wider text-[#2D5016]">
                {String(c.courseName ?? `Course ${i + 1}`)}
              </h2>
              {Array.isArray(c.dishes) &&
                c.dishes.map((dish: unknown, j: number) => {
                  const d = dish as Record<string, unknown>;
                  return (
                    <div key={j} className="mb-4">
                      <div className="flex items-start justify-between">
                        <p className="font-semibold">{String(d.name ?? '')}</p>
                        {Boolean(d.cuisineOrigin) && (
                          <span className="ml-4 shrink-0 text-xs text-[#2D5016]/60">{String(d.cuisineOrigin)}</span>
                        )}
                      </div>
                      {Boolean(d.description) && (
                        <p className="mt-0.5 text-sm text-[#1A1A18]/60">{String(d.description)}</p>
                      )}
                    </div>
                  );
                })}
            </div>
          );
        })}
      {menu.allergenStatement != null && (
        <div className="mt-8 rounded-lg border border-[#2D5016]/20 p-4 text-sm">
          <p className="font-semibold text-[#2D5016]">Allergen Information</p>
          <p className="mt-1 text-[#1A1A18]/70">{String(menu.allergenStatement)}</p>
        </div>
      )}
    </div>
  );
}

function RunbookPrint({ data }: { data: unknown }) {
  const runbook = data as Record<string, unknown> | null;
  if (!runbook) {
    return <p className="text-sm text-gray-400">No runbook data provided.</p>;
  }

  return (
    <div>
      <h1 className="mb-2 text-3xl font-bold text-[#2D5016]">{String(runbook.title ?? 'Service Runbook')}</h1>
      {Boolean(runbook.date) && <p className="mb-8 text-sm text-[#1A1A18]/50">{String(runbook.date)}</p>}
      {Array.isArray(runbook.phases) &&
        runbook.phases.map((phase: unknown, i: number) => {
          const p = phase as Record<string, unknown>;
          return (
            <div key={i} className="mb-8">
              <h2 className="mb-4 border-b border-[#2D5016]/20 pb-2 text-lg font-bold uppercase tracking-wider text-[#2D5016]">
                {String(p.phaseName ?? `Phase ${i + 1}`)}
              </h2>
              {Array.isArray(p.tasks) &&
                p.tasks.map((task: unknown, j: number) => {
                  const t = task as Record<string, unknown>;
                  return (
                    <div key={j} className="mb-3 flex items-start gap-3">
                      <div className="mt-0.5 size-4 shrink-0 rounded border border-[#2D5016]/40" />
                      <div>
                        <p className="text-sm font-medium">{String(t.taskName ?? t.task ?? '')}</p>
                        {Boolean(t.notes) && <p className="text-xs text-[#1A1A18]/50">{String(t.notes)}</p>}
                      </div>
                    </div>
                  );
                })}
            </div>
          );
        })}
    </div>
  );
}

function BriefPrint({ data }: { data: unknown }) {
  const brief = data as Record<string, unknown> | null;
  if (!brief) {
    return <p className="text-sm text-gray-400">No brief data provided.</p>;
  }

  const rawFields: [string, string][] = [
    ['Headline', String(brief.headline ?? '')],
    ['Subheadline', String(brief.subheadline ?? '')],
    ['Body Copy', String(brief.bodyText ?? '')],
    ['Call to Action', String(brief.callToAction ?? '')],
    ['Tone & Voice', String(brief.toneSummary ?? '')],
    ['Visual Direction', String(brief.imageDirection ?? '')],
    ['Color Guidance', String(brief.colorGuidance ?? '')],
  ];
  const fields = rawFields.filter((pair): pair is [string, string] => pair[1].length > 0);

  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold text-[#2D5016]">
        Creative Brief — {String(((brief.assetType as string) ?? '').replace(/-/g, ' '))}
      </h1>
      <div className="space-y-6">
        {fields.map(([label, value]) => (
          <div key={label} className="border-b border-[#2D5016]/10 pb-6">
            <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-[#2D5016]/50">{label}</p>
            <p className="text-sm leading-relaxed">{value}</p>
          </div>
        ))}
        {Array.isArray(brief.hashtags) && brief.hashtags.length > 0 && (
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#2D5016]/50">Hashtags</p>
            <p className="text-sm">{(brief.hashtags as string[]).join(' ')}</p>
          </div>
        )}
      </div>
    </div>
  );
}
