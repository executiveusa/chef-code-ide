import type { LoaderFunctionArgs, MetaFunction } from '@vercel/remix';
import { json } from '@vercel/remix';
import { useLoaderData } from '@remix-run/react';
import { ClientOnly } from 'remix-utils/client-only';
import { getNannyBrand, type NannyBrand } from '~/lib/nanny/brand';
import { NannyHomepage } from '~/components/nanny/NannyHomepage';

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  const name = data?.brand.name ?? 'Nanny';
  const tagline = data?.brand.tagline ?? 'Premium Plant-Based Hospitality Intelligence';
  return [{ title: `${name} | ${tagline}` }, { name: 'description', content: tagline }];
};

export const loader = async (_args: LoaderFunctionArgs) => {
  const brand = getNannyBrand(globalThis.process.env.NANNY_BRAND_CONFIG);
  return json({ brand });
};

export default function NannyRoute() {
  const { brand } = useLoaderData<typeof loader>();

  return (
    <ClientOnly fallback={<NannyLoadingShell brand={brand} />}>
      {() => <NannyHomepage brand={brand as NannyBrand} />}
    </ClientOnly>
  );
}

function NannyLoadingShell({ brand }: { brand: NannyBrand }) {
  return (
    <div className="flex min-h-screen items-center justify-center" style={{ backgroundColor: brand.backgroundColor }}>
      <div className="text-center">
        <img src={brand.avatar} alt={brand.name} className="mx-auto mb-4 size-16" />
        <p className="text-sm text-gray-500">Loading {brand.name}...</p>
      </div>
    </div>
  );
}
