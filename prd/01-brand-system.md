# PRD-01: White-Label Brand System

## Phase: 2

## Objective

Implement swappable brand identity for any plant-based hospitality operator.

## Tasks

- [x] Create `app/lib/nanny/brand.ts`
  - [x] `NannyBrand` type with all required fields
  - [x] `DEFAULT_BRAND` constant (Nanny / chef.svg / Afro-Caribbean)
  - [x] `buildBrand(overrides)` function
  - [x] `getNannyBrand(envOverride?)` function
  - [x] `getBrandCssVars(brand)` function
- [x] Write tests: `app/lib/nanny/__tests__/brand.test.ts`
  - [x] DEFAULT_BRAND has required fields
  - [x] buildBrand merges correctly
  - [x] getNannyBrand returns default when no env
  - [x] getNannyBrand parses valid JSON
  - [x] getNannyBrand falls back on invalid JSON
  - [x] CSS vars are correct
  - [x] Brand contains no secrets
- [ ] Verify brand used in NannyHomepage
- [ ] Verify brand used in NannyAvatar
- [ ] Verify NANNY_BRAND_CONFIG env var works end-to-end

## Parallel-safe tasks

- Recipe seed data
- Brand template examples
- Docs

## Acceptance Criteria

- `pnpm test` passes all brand tests
- No secrets in brand.ts
- Avatar is swappable via brand.avatar
