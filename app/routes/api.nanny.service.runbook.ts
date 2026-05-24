import { json, type ActionFunctionArgs } from '@vercel/remix';
import { validateIntake, mockIntake, type IntakeForm } from '~/lib/nanny/modules/intake';
import { generateMockRunbook } from '~/lib/nanny/modules/service-mode';
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
  let intake: IntakeForm;

  if (useMock) {
    intake = mockIntake();
  } else {
    const result = validateIntake(body);
    if (!result.valid) {
      return json({ error: 'Validation failed', details: result.errors }, { status: 400 });
    }
    intake = result.data!;
  }

  const runbook = generateMockRunbook(intake);
  const telemetry = buildMockTelemetry('event-planning');

  return json({ runbook, intake, telemetry, mockMode: useMock });
};
