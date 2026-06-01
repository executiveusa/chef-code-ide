import { json, type ActionFunctionArgs } from '@vercel/remix';
import { sendNannyEmail, buildRunbookEmailHtml, buildMenuEmailHtml } from '~/lib/.server/nanny/email';
import { getNannyBrand } from '~/lib/nanny/brand';

export const action = async ({ request }: ActionFunctionArgs) => {
  if (request.method !== 'POST') {
    return json({ error: 'Method not allowed' }, { status: 405 });
  }

  let body: { to: string; type: 'runbook' | 'menu'; data: Record<string, unknown>; brandOverride?: string };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  if (!body.to || !body.type || !body.data) {
    return json({ error: 'Missing required fields: to, type, data' }, { status: 400 });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(body.to)) {
    return json({ error: 'Invalid email address' }, { status: 400 });
  }

  const brand = getNannyBrand(body.brandOverride ?? globalThis.process.env.NANNY_BRAND_CONFIG);

  let html: string;
  let subject: string;

  if (body.type === 'runbook') {
    html = buildRunbookEmailHtml(body.data, brand.name);
    subject = `${brand.name} — Service Runbook: ${String(body.data.title ?? 'Service Plan')}`;
  } else {
    html = buildMenuEmailHtml(body.data, brand.name);
    subject = `${brand.name} — Menu: ${String(body.data.title ?? 'Plant-Based Menu')}`;
  }

  const result = await sendNannyEmail({ to: body.to, subject, html });

  return json({
    success: result.success,
    mockMode: result.mockMode,
    messageId: result.messageId,
  });
};
