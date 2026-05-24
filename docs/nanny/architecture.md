# NANNY Architecture

## Overview

Nanny is a premium, white-label, plant-based hospitality operating system built on top of Chef Code IDE (Remix + Convex + Vite).

## Layers

```
┌─────────────────────────────────────────────────────────┐
│  FRONTEND (Remix SSR + React)                           │
│  app/routes/nanny.*.tsx                                 │
│  app/components/nanny/                                  │
│  • No secrets                                           │
│  • Webhook/API calls only                               │
│  • Displays token/cost telemetry from backend           │
├─────────────────────────────────────────────────────────┤
│  WEBHOOK/API BOUNDARY                                   │
│  app/routes/api.nanny.*.ts                              │
│  • Server-only routes                                   │
│  • Mock-first, provider-swappable                       │
├─────────────────────────────────────────────────────────┤
│  AGENT RUNTIME (Server-Only)                            │
│  app/lib/.server/nanny/                                 │
│  • LLM router                                           │
│  • Provider adapters                                    │
│  • Token accounting                                     │
│  • Audit logs                                           │
├─────────────────────────────────────────────────────────┤
│  NANNY MODULES (Shared Types + Logic)                   │
│  app/lib/nanny/                                         │
│  • brand.ts — white-label config                        │
│  • llm-router.ts — task-to-model mapping                │
│  • modules/ — intake, menu, provisioning, etc.          │
├─────────────────────────────────────────────────────────┤
│  CONVEX BACKEND                                         │
│  convex/                                                │
│  • sessions, messages, auth (unchanged from base)       │
│  • Future: nannyEvents, auditLogs tables                │
└─────────────────────────────────────────────────────────┘
```

## Route Map

| Route                            | Handler                       | Description         |
| -------------------------------- | ----------------------------- | ------------------- |
| GET /nanny                       | nanny.\_index.tsx             | Nanny homepage      |
| GET /nanny/menu                  | nanny.menu.tsx                | Menu Studio         |
| GET /nanny/service               | nanny.service.tsx             | Service Mode        |
| GET /nanny/voice                 | nanny.voice.tsx               | Voice Console       |
| GET /nanny/admin                 | nanny.admin.tsx               | Admin / White Label |
| GET /api/nanny/health            | api.nanny.health.ts           | Health check        |
| POST /api/nanny/webhook          | api.nanny.webhook.ts          | Event ingress       |
| POST /api/nanny/llm/route        | api.nanny.llm.route.ts        | Model routing       |
| POST /api/nanny/menu/create      | api.nanny.menu.create.ts      | Menu generation     |
| POST /api/nanny/event/plan       | api.nanny.event.plan.ts       | Event planning      |
| POST /api/nanny/service/runbook  | api.nanny.service.runbook.ts  | Service runbook     |
| POST /api/nanny/voice/transcript | api.nanny.voice.transcript.ts | Voice transcript    |
| POST /api/nanny/vision/analyze   | api.nanny.vision.analyze.ts   | Vision analysis     |
| POST /api/nanny/creative/brief   | api.nanny.creative.brief.ts   | Creative brief      |

## Security Model

- All `process.env.*` access is in `.server` files or server-only routes
- Frontend receives only structured responses, never raw keys
- NANNY_MOCK_MODE=true by default — no real API calls without explicit keys
- Brand config is client-safe (colors, copy, avatar paths — no secrets)

## White-Label Model

```typescript
// Per-restaurant brand override
const myBrand = buildBrand({
  name: 'Ase Kitchen',
  primaryColor: '#2D4A2D',
  avatar: '/brands/ase-kitchen/avatar.svg',
  cuisineFocus: ['West African', 'Vegan'],
});
```

Brand is loaded at request time from environment or config store. The frontend receives it as serialized JSON from the loader.

## LLM Router Task Types

| Task Type             | Default Model    | Rationale             |
| --------------------- | ---------------- | --------------------- |
| quick-answer          | fast/small       | Low latency           |
| deep-reasoning        | large            | Complex planning      |
| menu-generation       | large            | Creative + structured |
| nutrition-reasoning   | medium           | Domain knowledge      |
| vision-analysis       | vision-capable   | Multimodal            |
| voice-cleanup         | fast             | Low latency           |
| creative-copy         | medium           | Creative writing      |
| code-generation       | large            | Precision needed      |
| long-context-planning | large + long ctx | Full event planning   |

## Cuisine Focus (Default Nanny)

- African (West, East, Central)
- Caribbean (Jamaican, Trinidadian, etc.)
- Soul food and diaspora foodways
- Plant-based and vegan remixing
- Premium wellness hospitality
