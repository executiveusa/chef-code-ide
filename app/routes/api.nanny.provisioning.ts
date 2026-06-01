import { json, type ActionFunctionArgs } from '@vercel/remix';
import { validateIntake, mockIntake, type IntakeForm } from '~/lib/nanny/modules/intake';
import { generateMockProvisioning } from '~/lib/nanny/modules/provisioning';
import { generateMockMenu } from '~/lib/nanny/modules/menu-studio';
import { buildMockTelemetry } from '~/lib/nanny/llm-router';
import { runNannyRouter, getNannyMockMode } from '~/lib/.server/nanny/router';

interface ProvisioningItem {
  ingredient: string;
  quantity: string;
  unit: string;
  estimatedCost: number;
  preferredVendors: string[];
  notes: string;
  cuisineCategory: string;
}

interface PrepTask {
  daysBefore: number;
  task: string;
}

interface LLMProvisioningResult {
  totalEstimatedCost: number;
  items: ProvisioningItem[];
  prepTimeline: PrepTask[];
}

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
    const menu = generateMockMenu(intake);
    const provisioning = generateMockProvisioning(menu, intake);
    return json({
      provisioning,
      intake,
      telemetry: buildMockTelemetry('menu-generation'),
      mockMode: true,
    });
  }

  const prompt = `Create a detailed provisioning list for a plant-based Afro-Caribbean event with these details:

Event type: ${intake.eventType}
Guest count: ${intake.guestCount}
Dietary restrictions: ${intake.dietaryNeeds.join(', ') || 'none'}
Allergies: ${intake.allergies.join(', ') || 'none'}
Budget: $${intake.budgetUsd}
Service start: ${intake.serviceStartTime}

Return JSON only with no markdown:
{
  "totalEstimatedCost": 0,
  "items": [
    {
      "ingredient": "string",
      "quantity": "string",
      "unit": "string",
      "estimatedCost": 0,
      "preferredVendors": ["string"],
      "notes": "string",
      "cuisineCategory": "string"
    }
  ],
  "prepTimeline": [
    { "daysBefore": 0, "task": "string" }
  ]
}

Include 15-25 ingredients. Preferred vendors should be realistic (e.g. "Whole Foods", "Caribbean market", "Costco").
Cuisine categories: produce, protein-alternatives, pantry, spices-herbs, grains-legumes, dairy-alternatives, beverages, specialty.
Prep timeline should cover 7 days before the event.`;

  const { text, telemetry } = await runNannyRouter({
    taskType: 'menu-generation',
    prompt,
  });

  let llmResult: LLMProvisioningResult | null = null;
  try {
    llmResult = JSON.parse(text) as LLMProvisioningResult;
  } catch {
    // Fall back to mock
  }

  if (!llmResult) {
    const menu = generateMockMenu(intake);
    const provisioning = generateMockProvisioning(menu, intake);
    return json({ provisioning, intake, telemetry, mockMode: false });
  }

  return json({
    provisioning: llmResult,
    intake,
    telemetry,
    mockMode: false,
  });
};
