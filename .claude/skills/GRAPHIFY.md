---
name: graphify
description: Knowledge graph for NANNY codebase. Use for orientation and impact analysis.
---

# Graphify Skill

> Source: https://github.com/safishamsi/graphify
> 71.5x fewer tokens per query vs reading raw files on large codebases.

## When to Use

- Before starting a new phase to understand what already exists
- Before refactoring to understand blast radius
- When a new developer (or session) needs orientation

## NANNY Codebase Map (Pre-built)

Key dependency chains for NANNY:

```
app/routes/nanny._index.tsx
  → app/components/nanny/NannyHomepage.tsx
      → app/components/nanny/NannyAvatar.tsx
      → app/components/nanny/NannyTokenTelemetry.tsx

app/routes/api.nanny.menu.create.ts
  → app/lib/.server/nanny/router.ts
      → app/lib/nanny/llm-router.ts
          → app/lib/nanny/modules/menu-studio.ts

app/lib/nanny/brand.ts
  → consumed by: NannyHomepage, NannyAvatar, NannyServiceMode
```

## Commands

```bash
/graphify .                    # Build full graph
/graphify ./app/lib/nanny      # Graph just Nanny modules
/graphify --mode deep          # Deep relationship extraction
/graphify query "menu studio"  # Search the graph
/graphify path "brand" "homepage"  # Trace connection
```

## Token Impact

Use graph queries instead of file reads when:

- Asking "what uses this module?"
- Asking "what breaks if I change X?"
- Asking "where is this type defined?"
