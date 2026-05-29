import { json, type ActionFunctionArgs } from '@vercel/remix';
import { validateIntake, mockIntake, type IntakeForm } from '~/lib/nanny/modules/intake';
import { generateMockMenu } from '~/lib/nanny/modules/menu-studio';
import { generateMockProvisioning } from '~/lib/nanny/modules/provisioning';
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
      menu: generateMockMenu(intake),
      provisioning: generateMockProvisioning(generateMockMenu(intake), intake),
      runbook: generateMockRunbook(intake),
      intake,
      telemetry: buildMockTelemetry('event-planning'),
      mockMode: true,
    });
  }

  const prompt = `Create a complete event plan for:
Event: ${intake.eventType}
Guests: ${intake.guestCount}
Dietary: ${intake.dietaryNeeds.join(', ') || 'none'}
Allergies: ${intake.allergies.join(', ') || 'none'}
Budget: $${intake.budgetUsd}
Service: ${intake.serviceStartTime} — ${intake.serviceEndTime}

Provide a JSON response with keys: summary (string), keyMilestones (array of {time, task}), staffingNotes (string), riskFactors (array of strings), successCriteria (array of strings).
JSON only, no markdown.`;

  const { text, telemetry } = await runNannyRouter({ taskType: 'event-planning', prompt });

  let eventPlan: unknown;
  try {
    eventPlan = JSON.parse(text);
  } catch {
    eventPlan = { summary: text, keyMilestones: [], staffingNotes: '', riskFactors: [], successCriteria: [] };
  }

  return json({
    eventPlan,
    menu: generateMockMenu(intake),
    runbook: generateMockRunbook(intake),
    intake,
    telemetry,
    mockMode: false,
  });
};
