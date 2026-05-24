export type RestaurantType =
  | 'ghost-kitchen'
  | 'restaurant'
  | 'caterer'
  | 'private-chef'
  | 'yacht-estate'
  | 'event-operator'
  | 'household-manager';

export type FontStrategy = 'editorial' | 'modern' | 'warm';
export type ToneProfile = 'warm' | 'professional' | 'playful' | 'luxury';
export type MenuStyle = 'editorial' | 'rustic' | 'modern' | 'minimal';
export type ServiceStyle = 'fine-dining' | 'family-style' | 'buffet' | 'stations' | 'coursed';

export type CuisineFocus =
  | 'African'
  | 'West African'
  | 'East African'
  | 'Caribbean'
  | 'Jamaican'
  | 'Trinidadian'
  | 'Soul Food'
  | 'Diaspora'
  | 'Vegan'
  | 'Plant-Based'
  | 'Wellness'
  | string;

export interface NannyCtaCopy {
  primary: string;
  secondary: string[];
}

export interface NannyBrand {
  name: string;
  tagline: string;
  cuisineFocus: CuisineFocus[];
  restaurantType: RestaurantType;
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  fontStrategy: FontStrategy;
  avatar: string;
  logo: string;
  ctaCopy: NannyCtaCopy;
  toneProfile: ToneProfile;
  defaultMenuStyle: MenuStyle;
  defaultServiceStyle: ServiceStyle;
}

export const DEFAULT_BRAND: NannyBrand = {
  name: 'Nanny',
  tagline: 'Premium Plant-Based Hospitality Intelligence',
  cuisineFocus: ['African', 'Caribbean', 'Soul Food', 'Vegan'],
  restaurantType: 'ghost-kitchen',
  primaryColor: '#1A3A1A',
  secondaryColor: '#D4A853',
  backgroundColor: '#FAFAF7',
  fontStrategy: 'editorial',
  avatar: '/chef.svg',
  logo: '/chef.svg',
  ctaCopy: {
    primary: 'Plan Service',
    secondary: ['Create Menu', 'Build Provisioning List', 'Run Service Mode', 'Generate Flyer'],
  },
  toneProfile: 'warm',
  defaultMenuStyle: 'editorial',
  defaultServiceStyle: 'family-style',
};

export function buildBrand(overrides: Partial<NannyBrand>): NannyBrand {
  return { ...DEFAULT_BRAND, ...overrides };
}

export function getNannyBrand(envOverride?: string): NannyBrand {
  if (!envOverride) {
    return DEFAULT_BRAND;
  }
  try {
    const parsed = JSON.parse(envOverride) as Partial<NannyBrand>;
    return buildBrand(parsed);
  } catch {
    return DEFAULT_BRAND;
  }
}

export function getBrandCssVars(brand: NannyBrand): Record<string, string> {
  return {
    '--nanny-primary': brand.primaryColor,
    '--nanny-secondary': brand.secondaryColor,
    '--nanny-bg': brand.backgroundColor,
  };
}
