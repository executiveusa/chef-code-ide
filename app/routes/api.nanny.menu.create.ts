import { json, type ActionFunctionArgs } from '@vercel/remix';
import { validateIntake, mockIntake, type IntakeForm } from '~/lib/nanny/modules/intake';
import { generateMockMenu } from '~/lib/nanny/modules/menu-studio';
import { runNannyRouter, getNannyMockMode } from '~/lib/.server/nanny/router';

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
          throw new Response(JSON.stringify({ error: 'Validation failed', details: result.errors }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
          });
        }
        return result.data!;
      })();

  const mockMode = getNannyMockMode();

  if (mockMode) {
    const { buildMockTelemetry } = await import('~/lib/nanny/llm-router');
    const menu = generateMockMenu(intake);
    return json({ menu, intake, telemetry: buildMockTelemetry('menu-generation'), mockMode: true });
  }

  const prompt = `Create a premium plant-based Afro-Caribbean menu for the following event:

Event type: ${intake.eventType}
Guest count: ${intake.guestCount}
Dietary restrictions: ${intake.dietaryNeeds.join(', ') || 'none'}
Allergies: ${intake.allergies.join(', ') || 'none'}
Budget: $${intake.budgetUsd}
Service start: ${intake.serviceStartTime}

Return a JSON object with this exact structure:
{
  "title": "menu title",
  "description": "menu description",
  "courses": [
    {
      "courseName": "course name",
      "dishes": [
        {
          "name": "dish name",
          "description": "description",
          "cuisineOrigin": "origin",
          "isVegan": true,
          "allergens": [],
          "nutritionHighlights": ["highlight"],
          "platingGuidance": "guidance",
          "plantBasedNotes": "notes"
        }
      ]
    }
  ],
  "allergenStatement": "statement",
  "dietaryStatement": "statement",
  "estimatedPrepTime": "time",
  "servingStyle": "style",
  "beveragePairings": ["pairing"]
}

Respond with JSON only. No markdown.`;

  const { text, telemetry } = await runNannyRouter({
    taskType: 'menu-generation',
    prompt,
  });

  let menu;
  try {
    menu = JSON.parse(text) as unknown;
  } catch {
    menu = generateMockMenu(intake);
  }

  return json({ menu, intake, telemetry, mockMode: false });
};
