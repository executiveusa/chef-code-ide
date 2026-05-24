# NANNY — Ralphy PRD

## How to run with Ralphy

```bash
# Single phase
ralphy --prd ./prd/00-foundation.md

# All phases sequentially
ralphy --prd ./prd/

# Parallel (safe tasks only)
ralphy --parallel --max-parallel 3 --prd ./prd/
```

## Phase Dependency Graph

```
00-foundation (must be first)
    ↓
01-brand-system ──────────┐
02-agent-backend           │ (can run in parallel after 00)
03-llm-router ────────────┘
    ↓
04-nanny-modules (depends on 02 + 03)
    ↓
05-premium-frontend (depends on 01 + 04)
    ↓
06-voice-vision (depends on 05)
    ↓
07-tests-deploy (depends on all)
```

## Parallel-safe tasks (within a phase)

These can run simultaneously:

- Writing UI copy
- Creating docs
- Generating recipe seed data
- Creating mock adapters
- Writing test fixtures
- Filling brand templates

## Never parallelize

- Schema migrations (convex/schema.ts changes)
- Agent runtime wiring
- LLM router core logic
- Prompt assembly
- Shared TypeScript type definitions

## Task Format

Each PRD file contains markdown checkboxes:

```markdown
- [ ] Task not started
- [x] Task complete
```

Ralphy tracks completion by updating these checkboxes.

## Feature IDs

Reference `_JCP/features.json` for canonical feature definitions:

- F-001: White-Label Brand System
- F-002: Backend-for-Agents API Layer
- F-003: LLM Router
- F-004: Intake Module
- F-005: Menu Studio
- F-006: Provisioning Module
- F-007: Service Mode
- F-008: Creative Studio
- F-009: Voice Console
- F-010: Vision Console
- F-011: Premium Frontend
- F-012: Admin / White Label Settings
