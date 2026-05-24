import type { IntakeForm } from './intake.js';

export interface ServiceTask {
  time: string;
  duration: string;
  task: string;
  assignee: 'chef' | 'server' | 'all' | 'client';
  phase: 'prep' | 'service' | 'cleanup';
  critical: boolean;
  contingency?: string;
}

export interface ServiceRunbook {
  eventId: string;
  eventType: string;
  location: string;
  guestCount: number;
  timeline: ServiceTask[];
  staffChecklist: string[];
  contingencyPlan: string[];
  serviceNotes: string[];
}

export function generateMockRunbook(intake: IntakeForm): ServiceRunbook {
  const startHour = parseInt(intake.serviceStartTime.split(':')[0], 10);
  const prepStart = startHour - 4;

  function t(hoursFromPrepStart: number): string {
    const h = prepStart + hoursFromPrepStart;
    const suffix = h < 12 ? 'AM' : 'PM';
    const display = h > 12 ? h - 12 : h;
    return `${display}:00 ${suffix}`;
  }

  return {
    eventId: crypto.randomUUID(),
    eventType: intake.eventType,
    location: intake.location,
    guestCount: intake.guestCount,
    timeline: [
      {
        time: t(0),
        duration: '30 min',
        task: 'Arrive at venue, equipment check, mise en place layout',
        assignee: 'chef',
        phase: 'prep',
        critical: true,
      },
      {
        time: t(0.5),
        duration: '60 min',
        task: 'Soak and prep lentils, marinate jackfruit in jerk seasoning',
        assignee: 'chef',
        phase: 'prep',
        critical: true,
        contingency: 'If jackfruit not marinated ahead, increase jerk seasoning by 25%',
      },
      {
        time: t(1.5),
        duration: '30 min',
        task: 'Prep all produce: slice plantains, dice mango, chop scotch bonnet',
        assignee: 'chef',
        phase: 'prep',
        critical: false,
      },
      {
        time: t(2),
        duration: '60 min',
        task: 'Cook rice and peas, start mafé lentil stew base',
        assignee: 'chef',
        phase: 'prep',
        critical: true,
      },
      {
        time: t(3),
        duration: '30 min',
        task: 'Make hibiscus sorbet base, freeze (or confirm pre-frozen)',
        assignee: 'chef',
        phase: 'prep',
        critical: false,
        contingency: 'If sorbet unavailable, substitute coconut mango sorbet',
      },
      {
        time: t(3.5),
        duration: '15 min',
        task: 'Set tables, plate ware warm, review allergen assignments',
        assignee: 'server',
        phase: 'prep',
        critical: true,
      },
      {
        time: t(4),
        duration: '10 min',
        task: 'Guest arrival — offer beverages',
        assignee: 'server',
        phase: 'service',
        critical: false,
      },
      {
        time: t(4.25),
        duration: '15 min',
        task: 'Plate and serve amuse-bouche (plantain crostini)',
        assignee: 'all',
        phase: 'service',
        critical: false,
      },
      {
        time: t(4.5),
        duration: '20 min',
        task: 'Plate and serve egusi bisque — pour tableside',
        assignee: 'all',
        phase: 'service',
        critical: false,
      },
      {
        time: t(5),
        duration: '10 min',
        task: 'Clear first course, fire main course proteins',
        assignee: 'all',
        phase: 'service',
        critical: true,
      },
      {
        time: t(5.25),
        duration: '25 min',
        task: 'Plate and serve main course (jerk jackfruit + mafé)',
        assignee: 'all',
        phase: 'service',
        critical: true,
        contingency: 'If jackfruit dry, add 2 tbsp coconut oil and cover for 5 min',
      },
      {
        time: t(5.75),
        duration: '20 min',
        task: 'Clear mains, plate dessert (sorbet + ladyfingers)',
        assignee: 'all',
        phase: 'service',
        critical: false,
      },
      {
        time: t(6.25),
        duration: '15 min',
        task: 'Coffee/tea service, client feedback',
        assignee: 'server',
        phase: 'service',
        critical: false,
      },
      {
        time: t(6.5),
        duration: '45 min',
        task: 'Full kitchen cleanup, equipment pack, venue walkthrough',
        assignee: 'all',
        phase: 'cleanup',
        critical: true,
      },
      {
        time: t(7.25),
        duration: '15 min',
        task: 'Final venue check, tip and departure',
        assignee: 'chef',
        phase: 'cleanup',
        critical: false,
      },
    ],
    staffChecklist: [
      '[ ] Allergen list reviewed with all staff',
      '[ ] Jerk jackfruit marinated minimum 4 hours',
      '[ ] Sorbet pre-frozen or purchased',
      '[ ] Serving platters and bowls warmed',
      '[ ] Aquafaba reserved for ladyfingers',
      '[ ] Scotch bonnet handled with gloves',
      `[ ] ${intake.guestCount} place settings confirmed`,
      '[ ] Beverages chilled: hibiscus agua fresca, coconut water',
      '[ ] Backup protein: extra lentils or pre-cooked chickpeas on standby',
      '[ ] Emergency contacts: client, venue, backup supplier',
    ],
    contingencyPlan: [
      'Jackfruit dry/stringy → add coconut oil, deglaze with citrus, cover and steam 5 min',
      'Sorbet not set → serve as granite or swap for coconut milk panna cotta (pre-made)',
      'Guest allergy revealed on arrival → omit peanuts from mafé, serve plain braised lentils',
      'Stove unavailable → jerk jackfruit can be served chilled as a tartare-style dish',
      'Late arrival → amuse-bouche can be held 30 min uncovered at room temp',
    ],
    serviceNotes: [
      `Service for ${intake.guestCount} — all dietary needs: ${intake.dietaryNeeds.join(', ')}`,
      `Allergen avoidance: ${intake.allergies.length > 0 ? intake.allergies.join(', ') : 'none specified'}`,
      `Budget: $${intake.budgetUsd} — stay within ingredients budget`,
      intake.notes ?? '',
    ].filter(Boolean),
  };
}
