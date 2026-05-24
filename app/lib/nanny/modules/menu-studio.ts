import type { IntakeForm } from './intake.js';

export interface Dish {
  name: string;
  description: string;
  cuisineOrigin: string;
  isVegan: boolean;
  allergens: string[];
  nutritionHighlights: string[];
  platingGuidance: string;
  plantBasedNotes?: string;
}

export interface MenuCourse {
  courseName: string;
  dishes: Dish[];
}

export interface GeneratedMenu {
  title: string;
  description: string;
  courses: MenuCourse[];
  allergenStatement: string;
  dietaryStatement: string;
  estimatedPrepTime: string;
  servingStyle: string;
  beveragePairings: string[];
}

export function generateMockMenu(intake: IntakeForm): GeneratedMenu {
  return {
    title: `${intake.eventType.replace(/-/g, ' ')} — Afro-Caribbean Plant-Based Menu`,
    description: `A curated plant-based menu celebrating West African and Caribbean culinary traditions, crafted for ${intake.guestCount} guests.`,
    courses: [
      {
        courseName: 'Amuse-Bouche',
        dishes: [
          {
            name: 'Plantain Crostini with Mango-Scotch Bonnet Relish',
            description:
              'Crispy ripe plantain rounds topped with a vibrant mango and scotch bonnet relish, finished with micro cilantro.',
            cuisineOrigin: 'Caribbean',
            isVegan: true,
            allergens: [],
            nutritionHighlights: ['Vitamin C', 'Potassium', 'Antioxidants'],
            platingGuidance: 'Arrange 2 per plate in a V shape. Relish should pool in the center, not drip over edges.',
            plantBasedNotes: 'Naturally vegan — no substitutions needed.',
          },
        ],
      },
      {
        courseName: 'First Course',
        dishes: [
          {
            name: 'Egusi Bisque with Coconut Cream',
            description:
              'A rich West African-inspired bisque made with ground egusi seeds, tomatoes, and leafy greens, crowned with a swirl of coconut cream.',
            cuisineOrigin: 'West African',
            isVegan: true,
            allergens: ['seeds'],
            nutritionHighlights: ['Protein', 'Iron', 'Healthy fats'],
            platingGuidance:
              'Serve in shallow bowls. Cream swirl clockwise from center. Garnish with a single fried egusi leaf.',
            plantBasedNotes: 'Traditional egusi uses palm oil — use refined coconut oil for neutral flavor.',
          },
        ],
      },
      {
        courseName: 'Main Course',
        dishes: [
          {
            name: 'Jerk Jackfruit with Callaloo Rice and Peas',
            description:
              'Slow-marinated jackfruit in authentic Jamaican jerk seasoning, served over callaloo rice and coconut-braised kidney beans.',
            cuisineOrigin: 'Jamaican',
            isVegan: true,
            allergens: [],
            nutritionHighlights: ['Fiber', 'Plant Protein', 'Complex Carbs'],
            platingGuidance: 'Mound rice to the left, jackfruit cascading from right. Sauce streaked across plate.',
            plantBasedNotes: 'Jackfruit texture mimics pulled pork when marinated 12+ hours.',
          },
          {
            name: 'Mafé Lentil Stew',
            description:
              'Senegalese groundnut stew reimagined with green lentils, sweet potato, and peanut sauce reduced with tamarind.',
            cuisineOrigin: 'West African',
            isVegan: true,
            allergens: ['peanuts'],
            nutritionHighlights: ['Protein', 'Potassium', 'B Vitamins'],
            platingGuidance: 'Deep bowl presentation. Stew poured tableside. Toasted peanut garnish on top.',
            plantBasedNotes: 'Traditional mafé uses lamb — lentils provide earthiness and protein equivalent.',
          },
        ],
      },
      {
        courseName: 'Dessert',
        dishes: [
          {
            name: 'Hibiscus Sorbet with Coconut Ladyfingers',
            description:
              'Tart hibiscus sorbet with notes of citrus, served alongside coconut flour ladyfingers dipped in dark chocolate.',
            cuisineOrigin: 'Caribbean',
            isVegan: true,
            allergens: intake.dietaryNeeds.includes('gluten-free') ? [] : ['gluten'],
            nutritionHighlights: ['Antioxidants', 'Vitamin C'],
            platingGuidance: 'Two scoops offset on chilled plate. Ladyfingers leaning against scoops at 45°.',
            plantBasedNotes: 'Use aquafaba for ladyfinger structure instead of eggs.',
          },
        ],
      },
    ],
    allergenStatement:
      intake.allergies.length > 0
        ? `This menu has been designed to avoid: ${intake.allergies.join(', ')}. Cross-contamination protocols active.`
        : 'No specific allergen restrictions noted. Standard kitchen protocols apply.',
    dietaryStatement: `All dishes are fully plant-based (vegan). ${intake.dietaryNeeds.includes('gluten-free') ? 'Gluten-free options verified.' : ''}`,
    estimatedPrepTime: '4-5 hours',
    servingStyle: 'Coursed with tableside service',
    beveragePairings: [
      'Hibiscus-ginger agua fresca',
      'Coconut water with mint',
      'Sparkling water with cucumber',
      'Sorrel (Jamaican hibiscus tea)',
    ],
  };
}
