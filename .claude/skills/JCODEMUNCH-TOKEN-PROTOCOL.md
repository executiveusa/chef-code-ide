---
name: jcodemunch-token-protocol
description: Token saving protocol. 95%+ reduction via symbol-level retrieval. ALWAYS ACTIVE.
---

# jCodeMunch Token Saving Protocol

> Source: https://github.com/jgravelle/jcodemunch-mcp
> Principle: Never read full files when you can search symbols.

## THE RULE (Non-Negotiable)

**Never `cat` a full file to find one function.**
**Never `Read` an entire file when you only need one section.**
**Never scan 700 lines to find a 20-line function.**

## Retrieval Hierarchy (use in this order)

1. `grep -n "symbol_name"` → find the exact line
2. `Read file_path offset:LINE limit:30` → read only that section
3. Only read full file if the entire file is the unit of work

## Token Budget Per Operation

| Operation           | Max Lines to Read          | Method                     |
| ------------------- | -------------------------- | -------------------------- |
| Find a function     | 0 full reads               | grep → targeted Read       |
| Understand a module | 30-50 lines                | Read with offset+limit     |
| Review a component  | 50-100 lines               | Read with offset+limit     |
| Fix a bug           | Only the affected function | grep → targeted Read       |
| Full file review    | Entire file                | Only when file IS the task |

## Anti-Patterns (BANNED)

- `cat entire_file.ts` → BANNED
- `Read /path/to/file` with no limit on a large file → BANNED
- Reading surrounding context "just in case" → BANNED
- Re-reading a file you just edited → BANNED (Edit/Write confirms success)

## Active Protocol

Before every Read: ask "do I need the whole file, or just the symbol?"
Before every grep: use `-n` flag to get line numbers for targeted reads.
Before every edit: grep first, read 30 lines around target, edit precisely.

## Config Profile

```jsonc
{
  "tool_profile": "core",
  "compact_schemas": true,
  "disabled_tools": [],
}
```
