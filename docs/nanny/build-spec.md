# NANNY Build Specification

## Stack

- Framework: Remix (Vite + @vercel/remix)
- Backend: Convex
- TypeScript: strict mode, verbatimModuleSyntax
- Styles: Tailwind CSS + @convex-dev/design-system
- Testing: Vitest
- Package manager: pnpm

## File Structure

```
chef-code-ide/
├── _JCP/                    # Ralphy build tracking
│   ├── features.json
│   ├── progress.md
│   └── recovery.md
├── .ralphy/
│   └── config.yaml
├── prd/                     # Ralphy PRD task files
│   ├── 00-foundation.md
│   ├── 01-brand-system.md
│   ├── 02-agent-backend.md
│   ├── 03-llm-router.md
│   ├── 04-nanny-modules.md
│   ├── 05-premium-frontend.md
│   ├── 06-voice-vision.md
│   └── 07-tests-deploy.md
├── docs/nanny/              # Architecture docs
│   ├── architecture.md
│   ├── build-spec.md
│   ├── whitelabel.md
│   └── ralphy-prd.md
├── app/
│   ├── lib/
│   │   ├── nanny/           # Shared Nanny types + logic (no secrets)
│   │   │   ├── brand.ts
│   │   │   ├── llm-router.ts
│   │   │   ├── __tests__/
│   │   │   │   ├── brand.test.ts
│   │   │   │   └── llm-router.test.ts
│   │   │   └── modules/
│   │   │       ├── intake.ts
│   │   │       ├── menu-studio.ts
│   │   │       ├── provisioning.ts
│   │   │       ├── service-mode.ts
│   │   │       ├── creative-studio.ts
│   │   │       ├── voice-console.ts
│   │   │       └── vision-console.ts
│   │   └── .server/
│   │       └── nanny/       # Server-only Nanny runtime
│   │           └── router.ts
│   ├── routes/
│   │   ├── nanny._index.tsx           # GET /nanny
│   │   ├── api.nanny.health.ts        # GET /api/nanny/health
│   │   ├── api.nanny.webhook.ts       # POST /api/nanny/webhook
│   │   ├── api.nanny.llm.route.ts     # POST /api/nanny/llm/route
│   │   ├── api.nanny.menu.create.ts   # POST /api/nanny/menu/create
│   │   ├── api.nanny.event.plan.ts    # POST /api/nanny/event/plan
│   │   ├── api.nanny.service.runbook.ts # POST /api/nanny/service/runbook
│   │   ├── api.nanny.voice.transcript.ts # POST /api/nanny/voice/transcript
│   │   ├── api.nanny.vision.analyze.ts   # POST /api/nanny/vision/analyze
│   │   └── api.nanny.creative.brief.ts   # POST /api/nanny/creative/brief
│   └── components/
│       └── nanny/
│           ├── NannyAvatar.tsx
│           ├── NannyHomepage.tsx
│           ├── NannyServiceMode.tsx
│           ├── NannyTokenTelemetry.tsx
│           └── NannyVoiceConsole.tsx
```

## Environment Variables

| Variable             | Required           | Description                            |
| -------------------- | ------------------ | -------------------------------------- |
| `NANNY_MOCK_MODE`    | No (default: true) | Set to 'false' for live provider calls |
| `NANNY_BRAND_CONFIG` | No                 | JSON string to override default brand  |

## Security Rules

1. `process.env` access → only in `.server` files or Remix loaders/actions
2. No `VITE_*` secrets → VITE\_ vars are exposed to the browser
3. Brand config → client-safe (colors, copy, avatar paths, no keys)
4. LLM API keys → never in route files, only in `.server/nanny/`

## Naming Conventions

- Nanny lib files: `app/lib/nanny/` (no leading underscore)
- Server-only: `app/lib/.server/nanny/`
- Components: PascalCase, prefix `Nanny`
- Routes: Remix flat route convention (dots = path separators)
- Tests: `__tests__/*.test.ts` colocated with source
