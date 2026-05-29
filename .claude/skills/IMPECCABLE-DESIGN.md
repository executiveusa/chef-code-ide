---
name: impeccable-design
description: Premium UI/UX quality enforcement for NANNY. Anti-slop rules. Apple-like output only.
---

# Impeccable Design Skill

> Source: https://github.com/pbakaus/impeccable
> Apply to ALL NANNY frontend work.

## The 7 Domains (enforce all)

1. **Typography** — Use Geist or Inter. Modular scale. No system defaults.
2. **Color** — OKLCH color space. Tinted neutrals. No pure black (#000). No pure gray.
3. **Spatial Design** — 8pt grid. Consistent spacing tokens. Visual hierarchy.
4. **Motion** — ease-out curves only. No bounce/elastic. Respect prefers-reduced-motion.
5. **Interaction** — Clear focus states. Loading skeletons. Error states with recovery.
6. **Responsive** — Mobile-first. Container queries. 320px minimum viewport.
7. **UX Writing** — Every label is a verb+noun. No "Submit". Use "Plan Service" / "Create Menu".

## NANNY Brand Constraints

- Primary: warm green (#2D5016 dark, #7CB342 accent)
- Background: warm off-white (#FAFAF7), not pure white
- Text: near-black with warm tint (#1A1A18), not #000000
- Avatar: chef.svg — centered, never stretched
- Font: Geist Sans (headings), system-ui (body)
- Motion: subtle fade-ins only, 150-300ms

## Anti-Slop Checklist (run before every PR)

- [ ] No generic SaaS gradient backgrounds
- [ ] No fake metrics or placeholder stats
- [ ] No "AI-powered" vague copy
- [ ] No mystery meat navigation
- [ ] Every page has one clear primary action
- [ ] Mobile layout tested at 375px width
- [ ] All interactive elements have focus rings
- [ ] Loading states exist for all async actions
- [ ] Error states exist for all form submissions

## Audit Commands

```
/audit [component]     # Check design quality
/polish [screen]       # Pre-ship review
/critique [flow]       # UX flow review
/clarify [copy]        # Sharpen microcopy
```
