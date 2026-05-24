# PRD-00: Foundation Hardening

## Phase: 0 + 1

## Objective

Establish the Nanny build foundation on Chef Code IDE.

## Tasks

- [x] Clone/open repo at executiveusa/chef-code-ide
- [x] Confirm branch: claude/nanny-chef-ide-builder-3PMEb
- [x] Search for patch files (nanny-chef-ide.patch / nanny-chef-ide-patch.zip)
- [x] **Finding**: No patch files found — building from scratch
- [x] Explore codebase architecture (Remix + Convex + Vite + TypeScript strict)
- [x] Create `_JCP/features.json` with all 12 features, acceptance criteria, test steps
- [x] Create `_JCP/progress.md`
- [x] Create `_JCP/recovery.md`
- [x] Create `.ralphy/config.yaml`
- [x] Create `docs/nanny/architecture.md`
- [x] Create `docs/nanny/whitelabel.md`
- [x] Create `docs/nanny/build-spec.md`
- [x] Create `docs/nanny/ralphy-prd.md`
- [ ] Run `pnpm install` — verify passes
- [ ] Run `pnpm typecheck` — verify passes
- [ ] Run `pnpm lint` — verify passes
- [ ] Run `pnpm test` — verify passes
- [ ] Run `pnpm build` — verify passes

## Acceptance Criteria

- All foundation files exist
- `pnpm typecheck` exits 0
- `pnpm lint` exits 0
- `pnpm test` passes brand and llm-router tests
- `pnpm build` produces valid output

## Evidence

- Files: \_JCP/, .ralphy/, docs/nanny/, prd/
- Branch: claude/nanny-chef-ide-builder-3PMEb
