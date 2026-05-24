# PRD-03: LLM Router

## Phase: 4

## Objective

Task-aware model routing with full token telemetry. No hardcoded secrets.

## Tasks

- [x] Create `app/lib/nanny/llm-router.ts`
  - [x] `TaskType` union type (11 task types)
  - [x] `ModelTier` union type (5 tiers)
  - [x] `RoutingDecision` interface
  - [x] `TokenTelemetry` interface (model, provider, tokens, cost, latency, cache, task, rationale)
  - [x] `TASK_ROUTING` map (all task types → decisions)
  - [x] `TOKEN_COST_PER_1K` rates by tier
  - [x] `MODEL_NAMES` by tier
  - [x] `routeTask(taskType)` function
  - [x] `estimateCost(tier, inputTokens, outputTokens)` function
  - [x] `buildMockTelemetry(taskType, latencyMs?)` function
- [x] Write tests: `app/lib/nanny/__tests__/llm-router.test.ts`
- [x] Wire router to `POST /api/nanny/llm/route`

## Future: Live Provider Integration

- Connect to existing chef-agent provider.ts
- Route fast→Haiku, medium→Sonnet, large→Opus
- Track actual usage in Convex

## Acceptance Criteria

- All task types covered
- Telemetry has all required fields
- Fast < large in cost estimates
- No provider secrets in llm-router.ts
