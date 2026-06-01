---
description: Catering operations skill — event costing, staffing, kitchen logistics, service flow, and plated dinner execution for professional catering businesses.
---

# Catering Operations Skill

## When to use this skill

Load when the user asks about:

- Event costing, quoting, or per-head pricing
- Staffing ratios for front-of-house / back-of-house
- Timeline and production schedules
- Equipment lists, rentals, and logistics
- Plated vs buffet vs station service decisions
- Dietary accommodations at scale

## Core Catering Formulas

### Per-Head Costing Model

```
Food Cost % = 28-32% of menu price (plant-based can stretch to 25%)
Labor = 35-40% of total event revenue
Overhead + Profit = 30-37%

Quick formula:
Ingredient cost per person × 3.5 = minimum menu price
Add 20% for complexity premium (private chef, dietary customization)
```

### Staffing Ratios

| Service Style     | Servers per Guest                                |
| ----------------- | ------------------------------------------------ |
| Seated plated     | 1 server per 8-10 guests                         |
| Buffet            | 1 server per 20-25 guests                        |
| Cocktail / passed | 1 server per 15 guests                           |
| Kitchen (BOH)     | 1 cook per 50 guests (plated), 1 per 80 (buffet) |

### Event Timeline Template

```
T-30 days: Contract signed, menu finalized, deposit collected
T-14 days: Final headcount, dietary confirmations
T-7 days: Provisioning list to vendors
T-3 days: Prep begins, equipment confirmed
T-1 day: Final prep, cold storage organized
Event day: Setup -3h, service, breakdown +1h
T+3 days: Invoice final balance, feedback form
```

## Nanny Integration Points

- `POST /api/nanny/event/plan` — generates full event runbook
- `POST /api/nanny/provisioning` — shopping list + vendor breakdown
- `GET /nanny/print?type=runbook` — printable service plan
- Brand kit colors: use for event signage and menus

## Dietary Protocol at Scale

```
Always ask: Vegan ✓ | Gluten-free | Nut-free | Soy-free | Raw
Label everything. Color code: Green=vegan, Yellow=gf, Red=allergen
Minimum 15% of menu items dedicated to each flagged restriction
```
