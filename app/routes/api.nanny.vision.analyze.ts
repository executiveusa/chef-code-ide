import { json, type ActionFunctionArgs } from '@vercel/remix';
import { mockVisionAnalysis } from '~/lib/nanny/modules/vision-console';
import { buildMockTelemetry } from '~/lib/nanny/llm-router';
import { getEnv } from '~/lib/.server/env';

interface VisionResult {
  ingredients: string[];
  suggestedDishes: Array<{ name: string; description: string; cuisineOrigin: string }>;
  pantryNotes: string;
}

export const action = async ({ request }: ActionFunctionArgs) => {
  if (request.method !== 'POST') {
    return json({ error: 'Method not allowed' }, { status: 405 });
  }

  const startMs = Date.now();
  const apiKey = getEnv('ANTHROPIC_API_KEY');
  const contentType = request.headers.get('content-type') ?? '';

  let imageBase64: string | null = null;
  let imageMimeType: 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp' = 'image/jpeg';
  let imageUrl: string | null = null;

  if (contentType.includes('multipart/form-data')) {
    try {
      const formData = await request.formData();
      const imageField = formData.get('image');
      if (imageField && imageField instanceof File) {
        const buffer = await imageField.arrayBuffer();
        imageBase64 = Buffer.from(buffer).toString('base64');
        const mime = imageField.type;
        if (mime === 'image/png' || mime === 'image/gif' || mime === 'image/webp') {
          imageMimeType = mime;
        }
      }
    } catch {
      return json({ error: 'Failed to parse form data' }, { status: 400 });
    }
  } else if (contentType.includes('application/json')) {
    try {
      const body = (await request.json()) as { imageUrl?: string; description?: string };
      imageUrl = body.imageUrl ?? null;
    } catch {
      return json({ error: 'Invalid JSON body' }, { status: 400 });
    }
  }

  // Mock if no API key or no image input
  if (!apiKey || (!imageBase64 && !imageUrl)) {
    const extraction = mockVisionAnalysis('fresh ingredients colorful plant-based food');
    const telemetry = buildMockTelemetry('vision-analysis');
    const mockAnalysis: VisionResult = {
      ingredients: ['plantains', 'scotch bonnet peppers', 'callaloo', 'yam', 'coconut milk', 'thyme', 'allspice'],
      suggestedDishes: [
        {
          name: 'Ackee & Callaloo Stir-Fry',
          description: 'Vibrant sauté of callaloo with ackee and scotch bonnet',
          cuisineOrigin: 'Jamaican',
        },
        {
          name: 'Coconut Plantain Curry',
          description: 'Sweet ripe plantains in fragrant coconut curry',
          cuisineOrigin: 'Caribbean',
        },
        { name: 'Yam Pottage', description: 'Hearty West African yam stew with greens', cuisineOrigin: 'Nigerian' },
      ],
      pantryNotes:
        'Stock scotch bonnets and allspice for authentic Caribbean flavor. Callaloo is a versatile green suitable for most dishes.',
    };
    return json({
      analysis: mockAnalysis,
      extraction,
      telemetry,
      mockMode: true,
    });
  }

  // Build content parts for Anthropic vision
  const { generateText } = await import('ai');
  const { createAnthropic } = await import('@ai-sdk/anthropic');
  const anthropic = createAnthropic({ apiKey });

  const prompt = `You are a culinary expert specializing in plant-based cuisine. Analyze this image and identify: 1) All visible ingredients, 2) Suggested plant-based dishes that could be made, 3) Cuisine origin of ingredients. Return JSON only with no markdown: { "ingredients": ["string"], "suggestedDishes": [{ "name": "string", "description": "string", "cuisineOrigin": "string" }], "pantryNotes": "string" }`;

  try {
    type ContentPart =
      | { type: 'text'; text: string }
      | { type: 'image'; image: string; mimeType: 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp' }
      | { type: 'image'; image: URL };

    const contentParts: ContentPart[] = [];

    if (imageBase64) {
      contentParts.push({ type: 'image', image: imageBase64, mimeType: imageMimeType });
    } else if (imageUrl) {
      contentParts.push({ type: 'image', image: new URL(imageUrl) });
    }
    contentParts.push({ type: 'text', text: prompt });

    const result = await generateText({
      model: anthropic('claude-sonnet-4-6'),
      messages: [{ role: 'user', content: contentParts }],
      maxTokens: 1000,
    });

    const latencyMs = Date.now() - startMs;
    const usage = result.usage;
    const inputTokens = usage?.promptTokens ?? 0;
    const outputTokens = usage?.completionTokens ?? 0;

    let analysis: VisionResult;
    try {
      analysis = JSON.parse(result.text) as VisionResult;
    } catch {
      analysis = {
        ingredients: [],
        suggestedDishes: [],
        pantryNotes: result.text,
      };
    }

    return json({
      analysis,
      telemetry: {
        model: 'claude-sonnet-4-6',
        provider: 'anthropic',
        inputTokens,
        outputTokens,
        totalTokens: inputTokens + outputTokens,
        estimatedCostUsd: (inputTokens / 1000) * 0.003 + (outputTokens / 1000) * 0.015,
        latencyMs,
        cacheHit: false,
        taskType: 'vision-analysis',
        rationale: 'Anthropic Claude vision analysis',
      },
      mockMode: false,
    });
  } catch (err) {
    console.error('[nanny/vision] Analysis failed:', err);
    const extraction = mockVisionAnalysis('fresh ingredients');
    const telemetry = buildMockTelemetry('vision-analysis');
    return json({ analysis: null, extraction, telemetry, mockMode: true });
  }
};
