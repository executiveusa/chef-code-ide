# NANNY Recovery Guide

## If the build breaks

### Typecheck fails

```bash
pnpm typecheck 2>&1 | head -50
```

Fix errors in strict TypeScript — no `any`, no missing types.

### Lint fails

```bash
pnpm lint:fix
```

### Build fails

Check Vite SSR externals in vite.config.ts. Nanny server routes must not import client-only code.

### Route 404

Remix uses file-based routing. Check:

- `app/routes/api.nanny.health.ts` → `/api/nanny/health`
- `app/routes/nanny._index.tsx` → `/nanny`
- Dots in filename = path separators

### Secrets leak check

```bash
grep -r "process.env" app/routes/ --include="*.tsx" --include="*.ts" | grep -v ".server"
```

Any hits in non-.server files = security bug.

### Mock mode verification

All Nanny API routes use `NANNY_MOCK_MODE=true` by default.
Set real keys in `.env.local` for live provider calls.

## Recovery Checkpoints

### Checkpoint 1: Foundation

- All \_JCP/ and docs/nanny/ files exist
- .ralphy/config.yaml exists
- prd/ files exist

### Checkpoint 2: TypeScript

- `pnpm typecheck` exits 0
- No `any` types in nanny lib files

### Checkpoint 3: Backend

- GET /api/nanny/health returns `{"status":"ok"}`
- POST /api/nanny/menu/create returns mock menu

### Checkpoint 4: Frontend

- GET /nanny returns 200
- Homepage renders chef.svg avatar
- "Plan Service" CTA visible on mobile

### Checkpoint 5: Tests

- `pnpm test` passes

## Known Risks

1. **Convex schema** — Nanny does not modify convex/schema.ts yet. Admin/audit features will need schema additions.
2. **Voice input** — Browser MediaRecorder API varies. Test on Chrome/Safari separately.
3. **Vision** — Requires multipart form handling; mock mode avoids real vision API calls.
4. **White-label** — Brand config is client-readable; no secrets in brand.ts.
5. **LLM costs** — Token telemetry is mock in Phase 1; real costs need actual provider keys.
