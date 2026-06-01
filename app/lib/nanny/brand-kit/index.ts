// Nanny Brand Kit — Plant-Based Hospitality OS
// Full brand system: colors, typography, voice, logo specs, social assets

export const BRAND = {
  name: 'Nanny',
  tagline: 'Plant-Based Hospitality Intelligence',
  mission:
    'Empowering ghost kitchens, private chefs, and estate operators with AI-driven hospitality rooted in Afro-Caribbean and diaspora culinary traditions.',
  url: 'https://nanny.kitchen',
  email: 'hello@nanny.kitchen',
  social: {
    instagram: '@nanny.kitchen',
    tiktok: '@nanny.kitchen',
    pinterest: 'nanny-kitchen',
    twitter: '@nannykitchen',
    linkedin: 'nanny-kitchen',
  },
} as const;

export const COLORS = {
  // Primary — Forest Green (Afro-Caribbean botanical depth)
  primary: '#2D5016',
  primaryLight: '#3d6b1e',
  primaryXLight: '#f0f5e8',
  // Secondary — Lime Growth
  secondary: '#7CB342',
  secondaryLight: '#8ec449',
  // Neutrals
  background: '#FAFAF7',
  surface: '#FFFFFF',
  text: '#1A1A18',
  textMuted: 'rgba(26,26,24,0.5)',
  border: '#E5E5E0',
  // Accent — warm earth
  accent: '#C4853A',
  accentLight: '#f5e6d3',
  // Status
  success: '#2D5016',
  warning: '#C4853A',
  error: '#C0392B',
} as const;

export const TYPOGRAPHY = {
  fontFamily: "'Inter', 'system-ui', sans-serif",
  fontFamilyDisplay: "'Cal Sans', 'Inter', sans-serif",
  scale: {
    xs: '0.75rem', // 12px
    sm: '0.875rem', // 14px
    base: '1rem', // 16px
    lg: '1.125rem', // 18px
    xl: '1.25rem', // 20px
    '2xl': '1.5rem', // 24px
    '3xl': '1.875rem',
    '4xl': '2.25rem',
    '5xl': '3rem',
  },
} as const;

export const LOGO = {
  icon: '/chef.svg',
  wordmark: 'Nanny',
  clearspace: '1x height of the N',
  minSize: '24px icon / 80px wordmark',
  doNot: [
    'Do not rotate or distort the icon',
    'Do not use on busy backgrounds without contrast layer',
    'Do not change the green color in official contexts',
    'Do not add drop shadows or outlines',
  ],
} as const;

export const VOICE = {
  tone: 'Warm, authoritative, culturally grounded. Never corporate. Never basic.',
  vocabulary: [
    'provisions',
    'service',
    'craft',
    'estate',
    'kitchen',
    'lineage',
    'diaspora',
    'plant-forward',
    'hospitality',
    'curation',
    'season',
    'ceremony',
  ],
  avoid: ['cheap', 'easy', 'fast food', 'instant', 'generic', 'basic'],
  examples: {
    headline: 'Menus that remember where food comes from.',
    subheadline: 'AI-powered hospitality OS for chefs who lead with culture.',
    cta: 'Plan your next service',
    social: 'Every dish tells a story. Nanny helps you tell it right.',
  },
} as const;

export const SOCIAL_SPECS = {
  instagram: {
    post: { width: 1080, height: 1080 },
    story: { width: 1080, height: 1920 },
    reel: { width: 1080, height: 1920 },
    carousel: { width: 1080, height: 1080, slides: '3-10' },
  },
  pinterest: {
    standard: { width: 1000, height: 1500 },
    square: { width: 1000, height: 1000 },
    infographic: { width: 1000, height: 2100 },
  },
  tiktok: { width: 1080, height: 1920 },
  twitter: {
    post: { width: 1200, height: 675 },
    header: { width: 1500, height: 500 },
    avatar: { width: 400, height: 400 },
  },
  linkedin: {
    post: { width: 1200, height: 627 },
    cover: { width: 1584, height: 396 },
  },
  facebook: {
    post: { width: 1200, height: 630 },
    story: { width: 1080, height: 1920 },
  },
  youtube: {
    thumbnail: { width: 1280, height: 720 },
    banner: { width: 2560, height: 1440 },
  },
} as const;

export const HASHTAGS = {
  core: ['#NannyKitchen', '#PlantBasedHospitality', '#VeganChef', '#GhostKitchen'],
  cultural: ['#AfroCaribbeanFood', '#DiasporaFood', '#BlackVegan', '#CaribbeanVegan', '#WestAfricanFood'],
  hospitality: ['#PrivateChef', '#CateringLife', '#EventCatering', '#EstateChef', '#FineVegan'],
  seasonal: ['#PlantForward', '#VeganMenu', '#VeganCatering', '#SustainableKitchen'],
  trending: ['#VeganFoodPorn', '#PlantBased', '#BlackFoodMovement', '#ChefLife'],
} as const;
