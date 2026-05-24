import { json, type ActionFunctionArgs } from '@vercel/remix';

interface WebhookEvent {
  type: string;
  payload: unknown;
  source?: string;
  timestamp?: string;
}

export const action = async ({ request }: ActionFunctionArgs) => {
  if (request.method !== 'POST') {
    return json({ error: 'Method not allowed' }, { status: 405 });
  }

  let event: WebhookEvent;
  try {
    event = (await request.json()) as WebhookEvent;
  } catch {
    return json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  if (!event.type) {
    return json({ error: 'Missing event type' }, { status: 400 });
  }

  return json({
    received: true,
    type: event.type,
    processedAt: new Date().toISOString(),
  });
};
