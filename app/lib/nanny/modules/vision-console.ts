export type VisionInputType = 'menu-photo' | 'recipe-document' | 'ingredient-label' | 'event-program' | 'unknown';

export interface VisionExtraction {
  inputType: VisionInputType;
  confidence: number;
  extractedData: VisionExtractedData;
  rawDescription: string;
}

export interface VisionExtractedData {
  title?: string;
  dishes?: Array<{ name: string; description: string; price?: string }>;
  ingredients?: Array<{ name: string; quantity?: string; unit?: string }>;
  allergens?: string[];
  dietaryLabels?: string[];
  eventDetails?: {
    date?: string;
    time?: string;
    venue?: string;
    guestCount?: number;
  };
  rawText?: string;
}

export function mockVisionAnalysis(imageDescription: string): VisionExtraction {
  const lower = imageDescription.toLowerCase();

  if (lower.includes('menu') || lower.includes('dish') || lower.includes('food')) {
    return {
      inputType: 'menu-photo',
      confidence: 0.88,
      rawDescription: imageDescription,
      extractedData: {
        title: 'Extracted Menu',
        dishes: [
          { name: 'Jerk Cauliflower', description: 'With coconut rice and peas', price: '$18' },
          { name: 'Akara Fritters', description: 'Black-eyed pea fritters with pepper sauce', price: '$12' },
          { name: 'Plantain Tart', description: 'Rum-soaked ripe plantain in shortcrust', price: '$9' },
        ],
        allergens: ['gluten', 'tree nuts'],
        dietaryLabels: ['vegan', 'gluten-free-available'],
      },
    };
  }

  if (lower.includes('recipe') || lower.includes('ingredient')) {
    return {
      inputType: 'recipe-document',
      confidence: 0.84,
      rawDescription: imageDescription,
      extractedData: {
        title: 'Extracted Recipe',
        ingredients: [
          { name: 'Jackfruit', quantity: '2', unit: 'cans' },
          { name: 'Scotch bonnet', quantity: '2', unit: 'each' },
          { name: 'Allspice', quantity: '1', unit: 'tsp' },
          { name: 'Coconut oil', quantity: '2', unit: 'tbsp' },
        ],
        allergens: [],
        dietaryLabels: ['vegan'],
      },
    };
  }

  return {
    inputType: 'unknown',
    confidence: 0.4,
    rawDescription: imageDescription,
    extractedData: {
      rawText: imageDescription,
    },
  };
}
