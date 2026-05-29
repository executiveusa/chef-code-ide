import { ClientOnly } from 'remix-utils/client-only';
import { getNannyBrand } from '~/lib/nanny/brand';
import { NannyCreativeStudio } from '~/components/nanny/NannyCreativeStudio';
import { json, type LoaderFunctionArgs } from '@vercel/remix';
import { useLoaderData } from '@remix-run/react';

export const loader = async (_: LoaderFunctionArgs) => {
  const brand = getNannyBrand(globalThis.process.env.NANNY_BRAND_CONFIG);
  return json({ brand });
};

export default function NannyCreativePage() {
  const { brand } = useLoaderData<typeof loader>();

  return (
    <div>
      <div className="sticky top-0 z-20 flex items-center gap-3 border-b border-[#2D5016]/10 bg-[#FAFAF7]/95 px-4 py-3 backdrop-blur-sm">
        <a href="/nanny" className="text-sm font-medium text-[#2D5016]/70 transition-colors hover:text-[#2D5016]">
          ← Nanny
        </a>
      </div>
      <ClientOnly
        fallback={
          <div className="flex min-h-[60vh] items-center justify-center">
            <div className="size-8 animate-spin rounded-full border-2 border-[#2D5016]/20 border-t-[#2D5016]" />
          </div>
        }
      >
        {() => <NannyCreativeStudio brand={brand} />}
      </ClientOnly>
    </div>
  );
}
