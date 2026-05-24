# PRD-04: Nanny Modules

## Phase: 5

## Objective

All 7 core Nanny modules implemented and wired to API routes.

## Modules

### 1. Intake

- [x] `app/lib/nanny/modules/intake.ts`
- [x] `IntakeForm` type
- [x] `validateIntake(raw)` — returns errors per field
- [x] `mockIntake()` — realistic 12-guest Afro-Caribbean dinner party

### 2. Menu Studio

- [x] `app/lib/nanny/modules/menu-studio.ts`
- [x] `Dish`, `MenuCourse`, `GeneratedMenu` types
- [x] `generateMockMenu(intake)` — 4-course Afro-Caribbean vegan menu
- [x] Allergen + dietary statements
- [x] Plating guidance per dish
- [x] Plant-based substitution notes

### 3. Provisioning

- [x] `app/lib/nanny/modules/provisioning.ts`
- [x] `ProvisioningItem`, `VendorGroup`, `ProvisioningList` types
- [x] `generateMockProvisioning(menu, intake)` — scaled to guest count
- [x] Budget status (within/over/under)
- [x] Vendor grouping by category

### 4. Service Mode

- [x] `app/lib/nanny/modules/service-mode.ts`
- [x] `ServiceTask`, `ServiceRunbook` types
- [x] `generateMockRunbook(intake)` — timeline from prep to cleanup
- [x] Staff checklist
- [x] Contingency plan

### 5. Creative Studio

- [x] `app/lib/nanny/modules/creative-studio.ts`
- [x] 7 asset types: menu-pdf, event-flyer, social-post, email-campaign, website-copy, instagram-caption, press-release
- [x] `generateCreativeBrief(assetType, brand, intake?)` — brand-aware copy
- [x] No generic SaaS copy

### 6. Voice Console

- [x] `app/lib/nanny/modules/voice-console.ts`
- [x] `parseVoiceTranscript(text)` — 5 command types
- [x] `mockTranscriptResult(text)` — with telemetry

### 7. Vision Console

- [x] `app/lib/nanny/modules/vision-console.ts`
- [x] `mockVisionAnalysis(description)` — 3 input types
- [x] Structured extraction (dishes, ingredients, allergens)

## Parallel-safe

- Recipe seed data
- More mock menus
- Brand templates

## Acceptance Criteria

- All modules export correctly typed functions
- Mock data reflects authentic Afro-Caribbean cuisine
- No generic placeholder names
