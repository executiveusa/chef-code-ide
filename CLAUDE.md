# NANNY — Chef Code IDE Build

## Token Saving Protocol (ALWAYS ACTIVE)

**jCodeMunch principles apply to every session:**

- Never read full files when you only need one symbol
- Use `grep -n` first, then `Read` with `offset` + `limit`
- Never re-read a file you just edited
- Prefer symbol search over file scanning
- Config: tool_profile=core, compact_schemas=true

See: `.claude/skills/JCODEMUNCH-TOKEN-PROTOCOL.md`

## Project

NANNY is a premium plant-based hospitality OS built on Chef Code IDE.

- Framework: Remix + Convex + Vite + TypeScript (strict)
- Package manager: pnpm
- Branch: `claude/eager-lovelace-mRWWB`

## Build Commands

```bash
pnpm install --ignore-scripts  # skip playwright browser download
pnpm typecheck                 # must pass before commit
pnpm lint                      # must pass before commit
pnpm test                      # must pass before commit
pnpm build                     # verify SSR build
```

## Key Directories

- `app/lib/nanny/` — Nanny modules (brand, llm-router, modules/)
- `app/lib/.server/nanny/` — Server-only LLM router
- `app/routes/api.nanny.*` — API route handlers
- `app/components/nanny/` — React UI components
- `prd/` — Ralphy-compatible phase task files
- `_JCP/` — Build progress tracking
- `.claude/skills/` — Lazy-loadable skill files

## Architecture Rules

1. **No secrets in frontend** — all keys live in env vars, server-only
2. **Mock-first** — every external API has a mock mode
3. **Provider-swappable** — LLM provider is never hardcoded
4. **Webhook boundary** — frontend calls `/api/nanny/*` only
5. **White-label ready** — brand config in `app/lib/nanny/brand.ts`

## Skills Registry

Load skills lazily from `.claude/skills/`:

- `SKILLS-INDEX.md` — full registry with when-to-use guide
- `IMPECCABLE-DESIGN.md` — premium UI enforcement (load for all frontend work)
- `GSD-PROTOCOL.md` — focus + anti-drift rules
- `GRAPHIFY.md` — codebase orientation
- `JCODEMUNCH-TOKEN-PROTOCOL.md` — token savings

## Commit Standard

Every commit must pass typecheck + lint + test.
Commit messages: present tense, what changed and why.
Never push secrets. Never skip hooks.
