import { json, type LoaderFunctionArgs, type MetaFunction } from '@vercel/remix';
import { useLoaderData } from '@remix-run/react';
import { ClientOnly } from 'remix-utils/client-only';
import { NannyBillingPage } from '~/components/nanny/NannyBillingPage';

export const meta: MetaFunction = () => [
  { title: 'Nanny — Billing & Plans' },
  { name: 'description', content: 'Manage your Nanny subscription' },
];

export const loader = async (_args: LoaderFunctionArgs) => {
  const mockMode = !globalThis.process.env.STRIPE_SECRET_KEY;
  return json({ mockMode });
};

export default function NannyBillingRoute() {
  const { mockMode } = useLoaderData<typeof loader>();

  return (
    <ClientOnly
      fallback={<div className="flex min-h-screen items-center justify-center text-gray-500">Loading billing…</div>}
    >
      {() => <NannyBillingPage mockMode={mockMode} />}
    </ClientOnly>
  );
}
