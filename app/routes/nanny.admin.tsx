import type { MetaFunction } from '@vercel/remix';
import { ClientOnly } from 'remix-utils/client-only';
import { NannyAdminPanel } from '~/components/nanny/NannyAdminPanel';

export const meta: MetaFunction = () => [
  { title: 'Nanny Admin — Brand & Settings' },
  { name: 'description', content: 'Configure your white-label Nanny brand' },
];

export default function NannyAdminRoute() {
  return (
    <ClientOnly
      fallback={<div className="flex min-h-screen items-center justify-center text-gray-500">Loading admin…</div>}
    >
      {() => <NannyAdminPanel />}
    </ClientOnly>
  );
}
