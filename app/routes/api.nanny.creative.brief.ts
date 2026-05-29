import { json, type ActionFunctionArgs } from '@vercel/remix';
import { generateCreativeBrief, type CreativeAssetType } from '~/lib/nanny/modules/creative-studio';
import { getNannyBrand } from '~/lib/nanny/brand';
import { runNannyRouter, getNannyMockMode } from '~/lib/.server/nanny/router';
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

  const mockMode = getNannyMockMode();

  if (mockMode) {
    const { buildMockTelemetry } = await import('~/lib/nanny/llm-router');
    const brief = generateCreativeBrief(assetType, brand, body.intake as IntakeForm | undefined);
    return json({ brief, brand: brand.name, telemetry: buildMockTelemetry('creative-copy'), mockMode: true });
  }

  const intake = body.intake as IntakeForm | undefined;
  const guestLine = intake ? `for ${intake.guestCount} guests` : '';
  const eventLine = intake ? intake.eventType.replace(/-/g, ' ') : 'private dining event';

  const prompt = `Generate a premium creative brief for a plant-based Afro-Caribbean hospitality brand.

Brand: ${brand.name}
Tagline: ${brand.tagline}
Cuisine focus: ${brand.cuisineFocus.join(', ')}
Asset type: ${assetType}
Event: ${eventLine} ${guestLine}
Primary color: ${brand.primaryColor}
Secondary color: ${brand.secondaryColor}

Return a JSON object with this exact structure:
{
  "assetType": "${assetType}",
  "headline": "compelling headline",
  "subheadline": "supporting subheadline",
  "bodyText": "2-3 sentences of premium body copy celebrating diaspora foodways",
  "callToAction": "action-oriented CTA verb+noun",
  "hashtags": ["#relevant", "#tags"],
  "colorGuidance": "specific color usage instructions",
  "imageDirection": "specific photography/visual direction",
  "toneSummary": "tone and voice guidance"
}

Write in a warm, confident, culturally fluent tone. No generic hospitality clichés. Respond with JSON only.`;

  const { text, telemetry } = await runNannyRouter({
    taskType: 'creative-copy',
    prompt,
  });

  let brief;
  try {
    brief = JSON.parse(text) as unknown;
  } catch {
    brief = generateCreativeBrief(assetType, brand, intake);
  }

  return json({ brief, brand: brand.name, telemetry, mockMode: false });
};
