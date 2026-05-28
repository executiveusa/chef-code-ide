---
name: gsd-protocol
description: Get Shit Done — focus protocol. Anti-drift. Finish phases completely before moving on.
---

# GSD Execution Protocol

## Core Rule

**One phase at a time. Ship it fully. Then move.**

Never leave a phase half-done to start the next.
Never add features not in the current phase spec.
Never refactor surrounding code while fixing a target bug.

## Phase Gate Checklist

Before marking any phase DONE:

- [ ] Code compiles (`pnpm typecheck`)
- [ ] Lint passes (`pnpm lint`)
- [ ] Tests pass (`pnpm test`)
- [ ] The feature is actually reachable in the UI
- [ ] A human could use it (not just "it builds")
- [ ] Committed with a clear message

## Anti-Drift Rules

- Do NOT add error handling for impossible scenarios
- Do NOT abstract until 3+ duplications exist
- Do NOT create helper files for one-use functions
- Do NOT add comments explaining what the code does (names do that)
- Do NOT design for hypothetical future requirements

## Decision Framework

When unsure whether to do something:

1. Is it in the current phase spec? → DO IT
2. Is it blocking the current phase? → FIX IT
3. Is it a "nice to have"? → LOG IT in \_JCP/progress.md, skip it
4. Is it a security issue? → FIX IT immediately regardless of phase

## Momentum Rule

Ship one thing that works completely.
Then ship the next thing.
A working 60% build ships before a perfect 0% build.
