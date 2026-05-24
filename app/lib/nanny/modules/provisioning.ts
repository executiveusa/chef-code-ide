import type { GeneratedMenu } from './menu-studio.js';
import type { IntakeForm } from './intake.js';

export type VendorCategory =
  | 'produce'
  | 'pantry'
  | 'protein-alternatives'
  | 'dairy-alternatives'
  | 'spices-herbs'
  | 'grains-legumes'
  | 'beverages'
  | 'specialty';

export interface ProvisioningItem {
  name: string;
  quantity: string;
  unit: string;
  vendorCategory: VendorCategory;
  estimatedCostUsd: number;
  notes?: string;
  substitutions?: string[];
}

export interface VendorGroup {
  category: VendorCategory;
  items: ProvisioningItem[];
  subtotalUsd: number;
}

export interface ProvisioningList {
  eventId: string;
  guestCount: number;
  vendorGroups: VendorGroup[];
  totalEstimatedCostUsd: number;
  budgetUsd: number;
  budgetStatus: 'within' | 'over' | 'under';
  notes: string[];
}

export function generateMockProvisioning(menu: GeneratedMenu, intake: IntakeForm): ProvisioningList {
  const g = intake.guestCount;

  const groups: VendorGroup[] = [
    {
      category: 'produce',
      items: [
        {
          name: 'Ripe plantains',
          quantity: String(Math.ceil(g * 0.5)),
          unit: 'lbs',
          vendorCategory: 'produce',
          estimatedCostUsd: Math.ceil(g * 0.5) * 1.5,
        },
        {
          name: 'Mango',
          quantity: String(Math.ceil(g * 0.25)),
          unit: 'lbs',
          vendorCategory: 'produce',
          estimatedCostUsd: Math.ceil(g * 0.25) * 2.0,
        },
        {
          name: 'Sweet potato',
          quantity: String(Math.ceil(g * 0.4)),
          unit: 'lbs',
          vendorCategory: 'produce',
          estimatedCostUsd: Math.ceil(g * 0.4) * 1.2,
        },
        {
          name: 'Callaloo leaves',
          quantity: String(Math.ceil(g * 0.2)),
          unit: 'lbs',
          vendorCategory: 'produce',
          estimatedCostUsd: Math.ceil(g * 0.2) * 3.5,
          notes: 'Spinach if unavailable',
        },
        {
          name: 'Scotch bonnet peppers',
          quantity: '6',
          unit: 'each',
          vendorCategory: 'produce',
          estimatedCostUsd: 3.0,
        },
      ],
      subtotalUsd: 0,
    },
    {
      category: 'protein-alternatives',
      items: [
        {
          name: 'Young jackfruit (canned in brine)',
          quantity: String(Math.ceil(g * 0.3)),
          unit: 'cans (20oz)',
          vendorCategory: 'protein-alternatives',
          estimatedCostUsd: Math.ceil(g * 0.3) * 3.5,
        },
        {
          name: 'Green lentils',
          quantity: String(Math.ceil(g * 0.15)),
          unit: 'lbs',
          vendorCategory: 'protein-alternatives',
          estimatedCostUsd: Math.ceil(g * 0.15) * 2.5,
        },
        {
          name: 'Egusi seeds (ground)',
          quantity: '1',
          unit: 'lb',
          vendorCategory: 'protein-alternatives',
          estimatedCostUsd: 8.0,
          notes: 'Specialty African market preferred',
        },
      ],
      subtotalUsd: 0,
    },
    {
      category: 'grains-legumes',
      items: [
        {
          name: 'Jasmine rice',
          quantity: String(Math.ceil(g * 0.25)),
          unit: 'lbs',
          vendorCategory: 'grains-legumes',
          estimatedCostUsd: Math.ceil(g * 0.25) * 1.5,
        },
        {
          name: 'Kidney beans (dried)',
          quantity: String(Math.ceil(g * 0.1)),
          unit: 'lbs',
          vendorCategory: 'grains-legumes',
          estimatedCostUsd: Math.ceil(g * 0.1) * 2.0,
        },
        { name: 'Coconut flour', quantity: '1', unit: 'lb', vendorCategory: 'grains-legumes', estimatedCostUsd: 6.5 },
      ],
      subtotalUsd: 0,
    },
    {
      category: 'dairy-alternatives',
      items: [
        {
          name: 'Coconut cream (full-fat)',
          quantity: String(Math.ceil(g * 0.15)),
          unit: 'cans (13.5oz)',
          vendorCategory: 'dairy-alternatives',
          estimatedCostUsd: Math.ceil(g * 0.15) * 3.0,
        },
        {
          name: 'Coconut milk',
          quantity: String(Math.ceil(g * 0.1)),
          unit: 'cans',
          vendorCategory: 'dairy-alternatives',
          estimatedCostUsd: Math.ceil(g * 0.1) * 2.5,
        },
      ],
      subtotalUsd: 0,
    },
    {
      category: 'spices-herbs',
      items: [
        {
          name: 'Jerk seasoning (dry)',
          quantity: '4',
          unit: 'oz',
          vendorCategory: 'spices-herbs',
          estimatedCostUsd: 5.5,
        },
        { name: 'Allspice berries', quantity: '2', unit: 'oz', vendorCategory: 'spices-herbs', estimatedCostUsd: 3.5 },
        {
          name: 'Dried hibiscus flowers',
          quantity: '4',
          unit: 'oz',
          vendorCategory: 'spices-herbs',
          estimatedCostUsd: 6.0,
        },
        { name: 'Tamarind paste', quantity: '8', unit: 'oz', vendorCategory: 'spices-herbs', estimatedCostUsd: 4.5 },
        { name: 'Fresh thyme', quantity: '1', unit: 'bunch', vendorCategory: 'spices-herbs', estimatedCostUsd: 2.5 },
      ],
      subtotalUsd: 0,
    },
    {
      category: 'pantry',
      items: [
        { name: 'Natural peanut butter', quantity: '16', unit: 'oz', vendorCategory: 'pantry', estimatedCostUsd: 7.0 },
        {
          name: 'Aquafaba (reserved chickpea liquid)',
          quantity: '2',
          unit: 'cups',
          vendorCategory: 'pantry',
          estimatedCostUsd: 0.5,
          notes: 'From canned chickpeas — save liquid',
        },
        { name: 'Dark chocolate (70%+)', quantity: '8', unit: 'oz', vendorCategory: 'pantry', estimatedCostUsd: 8.0 },
        { name: 'Coconut oil (refined)', quantity: '16', unit: 'oz', vendorCategory: 'pantry', estimatedCostUsd: 9.0 },
      ],
      subtotalUsd: 0,
    },
  ];

  let total = 0;
  for (const group of groups) {
    group.subtotalUsd = group.items.reduce((sum, item) => sum + item.estimatedCostUsd, 0);
    total += group.subtotalUsd;
  }

  const ingredientCost = Math.round(total * 100) / 100;
  const totalWithLabor = ingredientCost * 1.15;

  return {
    eventId: crypto.randomUUID(),
    guestCount: g,
    vendorGroups: groups,
    totalEstimatedCostUsd: Math.round(totalWithLabor * 100) / 100,
    budgetUsd: intake.budgetUsd,
    budgetStatus: totalWithLabor <= intake.budgetUsd ? 'within' : 'over',
    notes: [
      `Ingredient cost: $${ingredientCost.toFixed(2)} — 15% handling included in total`,
      'Specialty items (egusi, callaloo) may require African market sourcing — order 5 days ahead',
      `Scaled for ${g} guests — adjust quantities if final count changes`,
      menu.allergenStatement,
    ],
  };
}
