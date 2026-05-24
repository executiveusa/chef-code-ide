# NANNY White-Label Guide

## Overview

Nanny is designed to be white-labeled for any plant-based or diaspora hospitality brand. The brand system is the `NannyBrand` type in `app/lib/nanny/brand.ts`.

## What Is Swappable

| Element         | How to Swap                 | Example                                  |
| --------------- | --------------------------- | ---------------------------------------- |
| Brand name      | `brand.name`                | "Ase Kitchen"                            |
| Tagline         | `brand.tagline`             | "West African Roots, Plant-Based Future" |
| Avatar          | `brand.avatar`              | "/brands/ase/avatar.svg"                 |
| Logo            | `brand.logo`                | "/brands/ase/logo.svg"                   |
| Primary color   | `brand.primaryColor`        | "#2D4A2D"                                |
| Secondary color | `brand.secondaryColor`      | "#F5E6C8"                                |
| Background      | `brand.backgroundColor`     | "#FAFAF7"                                |
| Font strategy   | `brand.fontStrategy`        | "editorial" \| "modern" \| "warm"        |
| Cuisine focus   | `brand.cuisineFocus`        | ["West African", "Vegan"]                |
| Restaurant type | `brand.restaurantType`      | "ghost-kitchen"                          |
| CTA copy        | `brand.ctaCopy`             | "Book a Tasting"                         |
| Tone profile    | `brand.toneProfile`         | "warm" \| "professional" \| "playful"    |
| Menu style      | `brand.defaultMenuStyle`    | "editorial" \| "rustic" \| "modern"      |
| Service style   | `brand.defaultServiceStyle` | "fine-dining" \| "family-style"          |

## What Is NOT Swappable Per Brand

- Core Nanny agent capabilities
- LLM provider routing logic
- Security boundaries
- Token accounting

## Implementation

### Option 1: Environment Variable

```bash
NANNY_BRAND_CONFIG='{"name":"Ase Kitchen","primaryColor":"#2D4A2D"}'
```

### Option 2: Config File

```
brands/ase-kitchen.json
```

### Option 3: Admin UI

`/nanny/admin` → Brand Settings panel

## Default Brand

```typescript
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
```

## Brand-Aware Components

All Nanny UI components accept an optional `brand` prop:

```tsx
<NannyHomepage brand={brand} />
<NannyAvatar brand={brand} size="lg" />
<NannyTokenTelemetry telemetry={telemetry} brand={brand} />
```

If no `brand` prop is provided, `DEFAULT_BRAND` is used.

## Ghost Kitchen Persona Example

```typescript
const myGhostKitchen = buildBrand({
  name: 'Calabash Catering',
  tagline: 'Soulful Plant-Based Catering for Every Occasion',
  cuisineFocus: ['Soul Food', 'Caribbean', 'Vegan'],
  restaurantType: 'caterer',
  primaryColor: '#5C2D0E',
  secondaryColor: '#F9D56E',
  avatar: '/brands/calabash/avatar.svg',
  ctaCopy: {
    primary: 'Book a Catering',
    secondary: ['View Menu', 'Plan Event', 'Get Quote'],
  },
  toneProfile: 'warm',
});
```
