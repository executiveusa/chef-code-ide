import { json, type ActionFunctionArgs } from '@vercel/remix';
import { validateIntake, mockIntake, type IntakeForm } from '~/lib/nanny/modules/intake';
import { generateMockRunbook } from '~/lib/nanny/modules/service-mode';
import { runNannyRouter, getNannyMockMode } from '~/lib/.server/nanny/router';
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

  const isMockBody = Object.keys(body).length === 0;
  const intake = isMockBody
    ? mockIntake()
    : ((): IntakeForm => {
        const result = validateIntake(body);
        if (!result.valid) {
          return mockIntake();
        }
        return result.data!;
      })();

  if (getNannyMockMode()) {
    return json({
      runbook: generateMockRunbook(intake),
      intake,
      telemetry: buildMockTelemetry('event-planning'),
      mockMode: true,
    });
  }

  const prompt = `Create a detailed service runbook for:
Event: ${intake.eventType}, ${intake.guestCount} guests
Service: ${intake.serviceStartTime} — ${intake.serviceEndTime}
Location: ${intake.location}

Return JSON with: prepPhases (array of {phase, startTime, duration, tasks: string[], assignee}), servicePhases (same), cleanupPhases (same), contingencies (array of {risk, mitigation}), staffChecklist (string[]).
JSON only.`;

  const { text, telemetry } = await runNannyRouter({ taskType: 'event-planning', prompt });

  let runbook: unknown;
  try {
    runbook = JSON.parse(text);
  } catch {
    runbook = generateMockRunbook(intake);
  }

  return json({ runbook, intake, telemetry, mockMode: false });
};
