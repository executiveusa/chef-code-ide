import { type ActionFunctionArgs, json } from '@vercel/remix';

interface OnboardingPayload {
  sessionId: string;
  step: number;
  data?: {
    kitchenName?: string;
    restaurantType?: string;
    cuisineFocus?: string[];
    teamSize?: string;
    firstEventDate?: string;
  };
  completed?: boolean;
}

export async function action({ request }: ActionFunctionArgs) {
  if (request.method !== 'POST') {
    return json({ error: 'Method not allowed' }, { status: 405 });
  }

  let payload: OnboardingPayload;
  try {
    payload = (await request.json()) as OnboardingPayload;
  } catch {
    return json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { sessionId, step } = payload;

  if (!sessionId || typeof sessionId !== 'string') {
    return json({ error: 'sessionId is required' }, { status: 400 });
  }
  if (typeof step !== 'number' || step < 1 || step > 5) {
    return json({ error: 'step must be a number between 1 and 5' }, { status: 400 });
  }

  // Validate completed onboarding has required fields
  if (payload.completed) {
    const d = payload.data ?? {};
    const missing: string[] = [];
    if (!d.kitchenName) {
      missing.push('kitchenName');
    }
    if (!d.restaurantType) {
      missing.push('restaurantType');
    }
    if (!d.cuisineFocus || d.cuisineFocus.length === 0) {
      missing.push('cuisineFocus');
    }
    if (!d.teamSize) {
      missing.push('teamSize');
    }
    if (!d.firstEventDate) {
      missing.push('firstEventDate');
    }
    if (missing.length > 0) {
      return json({ error: `Missing required fields: ${missing.join(', ')}` }, { status: 400 });
    }
  }

  // The component handles Convex persistence directly via useMutation.
  // This route validates the payload and returns a brand config suggestion.
  const brandConfig = payload.completed
    ? generateBrandConfig(payload.data?.kitchenName ?? '', payload.data?.restaurantType ?? '')
    : null;

  return json({ ok: true, brandConfig });
}

function generateBrandConfig(kitchenName: string, restaurantType: string): Record<string, string> {
  return {
    name: kitchenName,
    tagline: taglineFor(restaurantType),
    primaryColor: '#2D5016',
    accentColor: '#7CB342',
  };
}

function taglineFor(restaurantType: string): string {
  const map: Record<string, string> = {
    'ghost-kitchen': 'Premium Plant-Based Delivery',
    'private-chef': 'Private Plant-Based Dining',
    catering: 'Elevated Plant-Based Catering',
    'pop-up': 'Plant-Based Pop-Up Experiences',
    estate: 'Estate-Grade Plant-Based Hospitality',
  };
  return map[restaurantType] ?? 'Premium Plant-Based Hospitality';
}
