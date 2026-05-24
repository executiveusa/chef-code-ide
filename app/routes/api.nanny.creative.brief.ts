import { json, type ActionFunctionArgs } from '@vercel/remix';
import { generateCreativeBrief, type CreativeAssetType } from '~/lib/nanny/modules/creative-studio';
import { getNannyBrand } from '~/lib/nanny/brand';
import { buildMockTelemetry } from '~/lib/nanny/llm-router';
import type { IntakeForm } from '~/lib/nanny/modules/intake';

export const action = async ({ request }: ActionFunctionArgs) => {
  if (request.method !== 'POST') {
    return json({ error: 'Method not allowed' }, { status: 405 });
  }

  let body: { assetType?: CreativeAssetType; brandOverride?: string; intake?: Partial<IntakeForm> };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const assetType: CreativeAssetType = body.assetType ?? 'social-post';
  const brand = body.brandOverride
    ? getNannyBrand(body.brandOverride)
    : getNannyBrand(globalThis.process.env.NANNY_BRAND_CONFIG);

  const brief = generateCreativeBrief(assetType, brand, body.intake as IntakeForm | undefined);
  const telemetry = buildMockTelemetry('creative-copy');

  return json({ brief, brand: brand.name, telemetry, mockMode: true });
};
