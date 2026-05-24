import { json, type ActionFunctionArgs } from '@vercel/remix';
import { mockVisionAnalysis } from '~/lib/nanny/modules/vision-console';
import { buildMockTelemetry } from '~/lib/nanny/llm-router';

export const action = async ({ request }: ActionFunctionArgs) => {
  if (request.method !== 'POST') {
    return json({ error: 'Method not allowed' }, { status: 405 });
  }

  let description = 'menu photo';
  try {
    const body = (await request.json()) as { description?: string; imageUrl?: string };
    description = body.description ?? body.imageUrl ?? description;
  } catch {
    // FormData fallback for multipart uploads
    try {
      const formData = await request.formData();
      description = (formData.get('description') as string) ?? description;
    } catch {
      // use default description
    }
  }

  const extraction = mockVisionAnalysis(description);
  const telemetry = buildMockTelemetry('vision-analysis');

  return json({ extraction, telemetry, mockMode: true });
};
