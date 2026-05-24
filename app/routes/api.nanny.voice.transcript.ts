import { json, type ActionFunctionArgs } from '@vercel/remix';
import { mockTranscriptResult } from '~/lib/nanny/modules/voice-console';

export const action = async ({ request }: ActionFunctionArgs) => {
  if (request.method !== 'POST') {
    return json({ error: 'Method not allowed' }, { status: 405 });
  }

  let body: { transcript?: string; audioUrl?: string };
  try {
    body = (await request.json()) as { transcript?: string; audioUrl?: string };
  } catch {
    return json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const text = body.transcript ?? 'create a menu for 10 guests';
  const result = mockTranscriptResult(text);

  return json({ ...result, mockMode: true });
};
