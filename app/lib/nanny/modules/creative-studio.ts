import type { NannyBrand } from '~/lib/nanny/brand';
import type { IntakeForm } from '~/lib/nanny/modules/intake';

export type CreativeAssetType =
  | 'menu-pdf'
  | 'event-flyer'
  | 'social-post'
  | 'email-campaign'
  | 'website-copy'
  | 'instagram-caption'
  | 'press-release';

export interface CreativeBrief {
  assetType: CreativeAssetType;
  headline: string;
  subheadline: string;
  bodyText: string;
  callToAction: string;
  hashtags?: string[];
  colorGuidance: string;
  imageDirection: string;
  toneSummary: string;
}

export function generateCreativeBrief(
  assetType: CreativeAssetType,
  brand: NannyBrand,
  intake?: IntakeForm,
): CreativeBrief {
  const guestLine = intake ? `for ${intake.guestCount} guests` : '';
  const eventLine = intake ? intake.eventType.replace(/-/g, ' ') : 'private dining';

  const briefs: Record<CreativeAssetType, CreativeBrief> = {
    'menu-pdf': {
      assetType: 'menu-pdf',
      headline: `${brand.name} — ${eventLine.charAt(0).toUpperCase() + eventLine.slice(1)} Menu`,
      subheadline: 'Plant-Based · Afro-Caribbean · Premium',
      bodyText: `A curated plant-based menu celebrating diaspora flavors — rooted in West African and Caribbean traditions, elevated for the modern table. ${guestLine ? `Crafted ${guestLine}.` : ''}`,
      callToAction: 'Experience the Menu',
      colorGuidance: `Use ${brand.primaryColor} for headers, ${brand.secondaryColor} for accents. Cream background (#FEFEF8) for body.`,
      imageDirection:
        'Full-bleed photography of finished dishes — moody lighting, natural textures. No artificial food styling.',
      toneSummary: 'Warm, confident, editorial. No generic restaurant copy.',
    },
    'event-flyer': {
      assetType: 'event-flyer',
      headline: `${brand.name} ${intake ? intake.eventType.replace(/-/g, ' ') : 'Pop-Up'}`,
      subheadline: brand.tagline,
      bodyText: `A premium plant-based ${eventLine} experience. ${brand.cuisineFocus.slice(0, 2).join(' · ')} inspired cuisine. Limited seats.`,
      callToAction: brand.ctaCopy.primary,
      colorGuidance: `Bold ${brand.primaryColor} background. ${brand.secondaryColor} headline. White body text. Avoid gradients.`,
      imageDirection: 'Chef avatar (${brand.avatar}) centered. Real food photography behind — no stock imagery.',
      toneSummary: 'Direct, premium, culturally confident.',
    },
    'social-post': {
      assetType: 'social-post',
      headline: '🌿 The future of hospitality is plant-based.',
      subheadline: '',
      bodyText: `${brand.name} brings ${brand.cuisineFocus.slice(0, 2).join(' and ')} flavors to life — fully plant-based, always premium. ${intake ? `${intake.guestCount}-guest ${eventLine} service coming soon.` : ''}`,
      callToAction: `Book with ${brand.name} →`,
      hashtags: [
        '#PlantBased',
        '#AfroCaribbean',
        '#SoulFood',
        '#VeganChef',
        '#DiasporaCuisine',
        `#${brand.name.replace(/\s/g, '')}`,
      ],
      colorGuidance: 'Native post — use brand colors in carousel, not overlay text.',
      imageDirection: 'Carousel: dish photo / process shot / plating detail / chef avatar. Aspect 1:1.',
      toneSummary: 'Conversational but elevated. No food-blogger clichés.',
    },
    'email-campaign': {
      assetType: 'email-campaign',
      headline: `You're invited — ${brand.name} ${eventLine}`,
      subheadline: brand.tagline,
      bodyText: `Dear Guest,\n\nWe are delighted to announce a premium ${eventLine} experience curated by ${brand.name}. Our plant-based menu celebrates ${brand.cuisineFocus.join(', ')} culinary traditions.\n\n${intake ? `Join us for a ${intake.guestCount}-guest service on ${intake.eventDate} at ${intake.location}.` : ''}\n\nSeats are limited.`,
      callToAction: brand.ctaCopy.primary,
      colorGuidance: `Header: ${brand.primaryColor}. Button: ${brand.secondaryColor}. Body: #1A1A1A on white.`,
      imageDirection: 'Hero: signature dish. Footer: chef avatar small.',
      toneSummary: 'Formal but warm. Hospitality-grade language.',
    },
    'website-copy': {
      assetType: 'website-copy',
      headline: brand.name,
      subheadline: brand.tagline,
      bodyText: `${brand.name} is a premium plant-based hospitality service rooted in ${brand.cuisineFocus.slice(0, 3).join(', ')} culinary traditions. We design menus, plan events, and deliver service experiences that celebrate diaspora foodways without compromise.\n\nFor ghost kitchens, private chefs, estate managers, and event operators who demand more.`,
      callToAction: brand.ctaCopy.primary,
      colorGuidance: `Brand palette: primary ${brand.primaryColor}, secondary ${brand.secondaryColor}, background ${brand.backgroundColor}.`,
      imageDirection: 'Above the fold: full-bleed hero with chef in motion. Not posed.',
      toneSummary: 'Premium, confident, culturally specific. No generic "farm-to-table" language.',
    },
    'instagram-caption': {
      assetType: 'instagram-caption',
      headline: '',
      subheadline: '',
      bodyText: `Afro-Caribbean roots. Plant-based future. \n\n${brand.name} brings diaspora flavors to the premium table — jerk jackfruit, egusi bisque, hibiscus sorbet. Crafted with intention.\n\nAvailable for private events and ghost kitchen partnerships.`,
      callToAction: `Book via link in bio — @${brand.name.toLowerCase().replace(/\s/g, '')}`,
      hashtags: [
        '#PlantBased',
        '#VeganCatering',
        '#AfricanCuisine',
        '#CaribbeanFood',
        '#SoulFood',
        '#DiasporaCooks',
        '#BlackFoodMatters',
      ],
      colorGuidance: 'Grid: alternate food close-up / lifestyle / dish overhead.',
      imageDirection: 'Warm natural light. No overhead ring light. Dark moody plates preferred.',
      toneSummary: 'Authentic, culturally fluent, never performative.',
    },
    'press-release': {
      assetType: 'press-release',
      headline: `${brand.name} Launches Premium Plant-Based Hospitality Service Celebrating African and Caribbean Cuisine`,
      subheadline: 'Ghost kitchen and private chef operator brings diaspora flavors to the premium table',
      bodyText: `FOR IMMEDIATE RELEASE\n\n${brand.name}, a premium plant-based hospitality operator, announces its launch as a full-service culinary and event management platform celebrating ${brand.cuisineFocus.join(', ')} foodways.\n\nThe service offers menu design, event planning, provisioning, and service management — purpose-built for ghost kitchens, private chefs, and estate operators.`,
      callToAction: `Contact: hello@${brand.name.toLowerCase().replace(/\s/g, '')}.com`,
      colorGuidance: 'Press release: plain text with letterhead styling.',
      imageDirection: 'Press kit: chef avatar high-res, 3 hero dish photos, brand logo on white.',
      toneSummary: 'Professional, factual, culturally proud.',
    },
  };

  return briefs[assetType];
}
