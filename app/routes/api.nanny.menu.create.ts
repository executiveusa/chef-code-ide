import { json, type ActionFunctionArgs } from '@vercel/remix';
import { validateIntake, mockIntake, type IntakeForm } from '~/lib/nanny/modules/intake';
import { generateMockMenu } from '~/lib/nanny/modules/menu-studio';
import { buildMockTelemetry } from '~/lib/nanny/llm-router';

export const action = async ({ request }: ActionFunctionArgs) => {
  if (request.method !== 'POST') {
    return json({ error: 'Method not allowed' }, { status: 405 });
  }

  let body: Partial<IntakeForm>;
  try {
    body = (await request.json()) as Partial<IntakeForm>;
  } catch {
    return json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const useMock = Object.keys(body).length === 0 || globalThis.process.env.NANNY_MOCK_MODE !== 'false';
  const intake = useMock
    ? mockIntake()
    : ((): IntakeForm => {
        const result = validateIntake(body);
        if (!result.valid) {
          throw new Response(JSON.stringify({ error: 'Validation failed', details: result.errors }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
          });
        }
        return result.data!;
      })();

  const menu = generateMockMenu(intake);
  const telemetry = buildMockTelemetry('menu-generation');

  return json({ menu, intake, telemetry, mockMode: useMock });
};
