# PRD-02: Backend-for-Agents API Layer

## Phase: 3

## Objective

Clean frontend/backend boundary. All secrets server-only. Mock-first.

## Routes Created

- [x] `GET /api/nanny/health` → `app/routes/api.nanny.health.ts`
- [x] `POST /api/nanny/webhook` → `app/routes/api.nanny.webhook.ts`
- [x] `POST /api/nanny/llm/route` → `app/routes/api.nanny.llm.route.ts`
- [x] `POST /api/nanny/menu/create` → `app/routes/api.nanny.menu.create.ts`
- [x] `POST /api/nanny/event/plan` → `app/routes/api.nanny.event.plan.ts`
- [x] `POST /api/nanny/service/runbook` → `app/routes/api.nanny.service.runbook.ts`
- [x] `POST /api/nanny/voice/transcript` → `app/routes/api.nanny.voice.transcript.ts`
- [x] `POST /api/nanny/vision/analyze` → `app/routes/api.nanny.vision.analyze.ts`
- [x] `POST /api/nanny/creative/brief` → `app/routes/api.nanny.creative.brief.ts`

## Server Runtime

- [x] `app/lib/.server/nanny/router.ts` — server-only router wrapper

## Security checks

- [ ] Grep for `process.env` in non-.server route files — should find none
- [ ] Verify NANNY_MOCK_MODE controls mock vs. live mode
- [ ] Verify health route returns mockMode field

## Acceptance Criteria

- All routes return 200 on valid POST
- No secrets exposed to frontend
- Mock mode active by default
