import type { LoaderFunctionArgs, MetaFunction } from '@vercel/remix';
import { json, redirect } from '@vercel/remix';
import { useLoaderData } from '@remix-run/react';
import { ClientOnly } from 'remix-utils/client-only';
import { getNannyBrand } from '~/lib/nanny/brand';
import { NannyOnboarding, type OnboardingData } from '~/components/nanny/NannyOnboarding';

export const meta: MetaFunction = () => [{ title: 'Welcome to Nanny | Set Up Your Kitchen' }];

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);

  // If already completed via query param, redirect to main app
  if (url.searchParams.get('done') === '1') {
    return redirect('/nanny');
  }

  const brand = getNannyBrand(globalThis.process.env.NANNY_BRAND_CONFIG);
  // Session ID passed as query param from the client app bootstrap
  const sessionId = url.searchParams.get('sessionId') ?? '';

  return json({ brand, sessionId });
}

export default function NannyOnboardingRoute() {
  const { brand, sessionId } = useLoaderData<typeof loader>();

  const handleComplete = (_data: OnboardingData) => {
    // After completion, redirect to main nanny app
    // Use a small delay to let step 5 animation play
    setTimeout(() => {
      window.location.href = '/nanny';
    }, 2000);
  };

  // If no sessionId provided, generate one client-side
  const resolvedSessionId =
    sessionId ||
    (typeof window !== 'undefined'
      ? (localStorage.getItem('nanny_session_id') ??
        (() => {
          const id = crypto.randomUUID();
          localStorage.setItem('nanny_session_id', id);
          return id;
        })())
      : 'ssr-placeholder');

  return (
    <div className="min-h-screen" style={{ backgroundColor: brand.backgroundColor ?? '#FAFAF7' }}>
      <ClientOnly
        fallback={
          <div className="flex min-h-screen items-center justify-center">
            <p className="text-sm text-[#1A1A18]/50">Loading…</p>
          </div>
        }
      >
        {() => <NannyOnboarding sessionId={resolvedSessionId} onComplete={handleComplete} />}
      </ClientOnly>
    </div>
  );
}
