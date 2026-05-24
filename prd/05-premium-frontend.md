# PRD-05: Premium Frontend

## Phase: 6

## Objective

Apple-like, mobile-first, plant-based luxury UI. No generic SaaS look.

## Components Created

- [x] `app/components/nanny/NannyAvatar.tsx`

  - Size: sm/md/lg/xl
  - Status: idle/thinking/service (with ring animation)
  - Uses brand.avatar (defaults to /chef.svg)

- [x] `app/components/nanny/NannyTokenTelemetry.tsx`

  - Compact mode (one line) and full mode (grid)
  - Shows: model, provider, tokens, cost, latency, cache status, rationale

- [x] `app/components/nanny/NannyHomepage.tsx`

  - Hero with avatar + brand name + tagline + cuisine tags
  - "What is this?" section
  - Primary CTA: "Plan Service" (full-width, brand color)
  - 4 secondary CTAs in grid
  - Result panel with JSON + token telemetry
  - "Why premium?" section with 5 value props
  - Footer with avatar
  - All colors from brand config

- [x] `app/components/nanny/NannyServiceMode.tsx`

  - Mobile-first service runbook view
  - Phase filter (all/prep/service/cleanup)
  - Task cards with check-off
  - Progress bar in sticky header
  - Contingency plan section
  - Staff checklist section

- [x] `app/components/nanny/NannyVoiceConsole.tsx`

  - Mobile-first voice input
  - States: idle/listening/processing/confirming/dispatched
  - Avatar status changes with state
  - Confirmation flow before dispatch
  - Mock API call to /api/nanny/voice/transcript

- [x] `app/routes/nanny._index.tsx`
  - SSR loader returns brand from env
  - ClientOnly wrapper for hydration
  - Loading shell with avatar

## Design Principles Applied

- Steve Krug: "Don't make me think" — every page answers what/who/why/how
- No generic SaaS gradients
- No fake metrics
- Real cuisine names (not "Cuisine A, Cuisine B")
- Colors from brand config — not hardcoded

## Acceptance Criteria

- /nanny renders without errors
- Primary CTA visible above fold on mobile (375px)
- Avatar uses /chef.svg
- Token telemetry displayed after any action
- No secrets in any component file
