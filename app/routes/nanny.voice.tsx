import type { MetaFunction } from '@vercel/remix';
import { ClientOnly } from 'remix-utils/client-only';
import { NannyVoiceConsole } from '~/components/nanny/NannyVoiceConsole';
import { getNannyBrand } from '~/lib/nanny/brand';

export const meta: MetaFunction = () => [{ title: 'Nanny Voice Console' }];

export default function NannyVoiceRoute() {
  const brand = getNannyBrand();
  return (
    <div className="min-h-screen" style={{ backgroundColor: brand.backgroundColor }}>
      <header className="flex items-center gap-3 border-b border-gray-200 bg-white px-6 py-4">
        <a href="/nanny" className="text-sm text-gray-500 hover:text-gray-800">
          ← Nanny
        </a>
        <span className="text-gray-300">|</span>
        <h1 className="text-base font-semibold text-gray-900">Voice Console</h1>
      </header>
      <ClientOnly
        fallback={<div className="flex min-h-[400px] items-center justify-center text-gray-400">Loading…</div>}
      >
        {() => <NannyVoiceConsole brand={brand} />}
      </ClientOnly>
    </div>
  );
}
