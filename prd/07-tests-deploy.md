# PRD-07: Tests and Deploy

## Phase: 8

## Test Matrix

### TypeScript

- [ ] `pnpm typecheck` exits 0

### Lint

- [ ] `pnpm lint` exits 0

### Build

- [ ] `pnpm build` exits 0

### Unit Tests

- [ ] Brand tests pass (`__tests__/brand.test.ts`)
- [ ] LLM router tests pass (`__tests__/llm-router.test.ts`)

### Route Tests (manual curl or integration)

- [ ] `GET /api/nanny/health` returns `{"status":"ok"}`
- [ ] `POST /api/nanny/webhook` returns `{"received":true}`
- [ ] `POST /api/nanny/llm/route` with `{"taskType":"menu-generation"}` returns telemetry
- [ ] `POST /api/nanny/menu/create` returns menu + telemetry
- [ ] `POST /api/nanny/event/plan` returns menu + provisioning + runbook + telemetry
- [ ] `POST /api/nanny/service/runbook` returns runbook + telemetry
- [ ] `POST /api/nanny/voice/transcript` returns command + telemetry
- [ ] `POST /api/nanny/vision/analyze` returns extraction + telemetry
- [ ] `POST /api/nanny/creative/brief` returns brief + telemetry

### Security Tests

- [ ] `grep -r "process.env" app/routes/ --include="*.tsx" --include="*.ts" | grep -v ".server"` returns empty
- [ ] Brand config contains no secrets
- [ ] No VITE\_\* secret vars in frontend routes

### UI Tests

- [ ] `/nanny` renders (200)
- [ ] Chef avatar visible on homepage
- [ ] "Plan Service" CTA visible
- [ ] Mobile layout at 375px — no overflow
- [ ] Token telemetry appears after action

### White-Label Test

- [ ] Set `NANNY_BRAND_CONFIG='{"name":"Test Kitchen"}'` → brand name changes
- [ ] Brand colors propagate to frontend

## Deploy Checklist

- [ ] All tests pass
- [ ] PR created on claude/nanny-chef-ide-builder-3PMEb
- [ ] No secrets in committed files
- [ ] pnpm-lock.yaml up to date
