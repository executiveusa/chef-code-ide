export type EventType =
  | 'dinner-party'
  | 'wedding'
  | 'corporate'
  | 'birthday'
  | 'brunch'
  | 'pop-up'
  | 'yacht-charter'
  | 'estate-service'
  | 'weekly-meal-prep'
  | 'catering';

export type DietaryNeed =
  | 'vegan'
  | 'vegetarian'
  | 'gluten-free'
  | 'nut-free'
  | 'soy-free'
  | 'raw'
  | 'keto'
  | 'diabetic-friendly'
  | 'low-sodium';

export interface IntakeForm {
  guestCount: number;
  eventType: EventType;
  location: string;
  dietaryNeeds: DietaryNeed[];
  allergies: string[];
  budgetUsd: number;
  eventDate: string;
  serviceStartTime: string;
  serviceEndTime: string;
  notes?: string;
}

export interface IntakeValidationError {
  field: keyof IntakeForm;
  message: string;
}

export interface IntakeResult {
  valid: boolean;
  errors: IntakeValidationError[];
  data?: IntakeForm;
}

export function validateIntake(raw: Partial<IntakeForm>): IntakeResult {
  const errors: IntakeValidationError[] = [];

  if (!raw.guestCount || raw.guestCount < 1) {
    errors.push({ field: 'guestCount', message: 'Guest count must be at least 1' });
  }
  if (!raw.eventType) {
    errors.push({ field: 'eventType', message: 'Event type is required' });
  }
  if (!raw.location?.trim()) {
    errors.push({ field: 'location', message: 'Location is required' });
  }
  if (!raw.budgetUsd || raw.budgetUsd < 0) {
    errors.push({ field: 'budgetUsd', message: 'Budget must be a positive number' });
  }
  if (!raw.eventDate) {
    errors.push({ field: 'eventDate', message: 'Event date is required' });
  }
  if (!raw.serviceStartTime) {
    errors.push({ field: 'serviceStartTime', message: 'Service start time is required' });
  }
  if (!raw.serviceEndTime) {
    errors.push({ field: 'serviceEndTime', message: 'Service end time is required' });
  }

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  return {
    valid: true,
    errors: [],
    data: raw as IntakeForm,
  };
}

export function mockIntake(): IntakeForm {
  return {
    guestCount: 12,
    eventType: 'dinner-party',
    location: 'Private Residence, Brooklyn NY',
    dietaryNeeds: ['vegan', 'gluten-free'],
    allergies: ['tree nuts'],
    budgetUsd: 1800,
    eventDate: '2026-06-15',
    serviceStartTime: '18:00',
    serviceEndTime: '22:00',
    notes: 'Host prefers Afro-Caribbean cuisine with West African influence.',
  };
}
