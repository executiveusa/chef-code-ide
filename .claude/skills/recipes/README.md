# Nanny Recipe Library

This folder is seeded and ready to populate. Add recipe skill files here.

## Folder Structure

```
recipes/
├── README.md                    ← you are here
├── african/
│   ├── jollof-rice.md
│   ├── egusi-soup.md
│   └── jerk-cauliflower.md
├── caribbean/
│   ├── callaloo.md
│   ├── doubles.md
│   └── plantain-porridge.md
├── event-menus/
│   ├── summer-tasting.md
│   └── wedding-buffet.md
└── ghost-kitchen/
    └── weekly-rotation.md
```

## Recipe File Format

Each recipe file should follow this template:

```markdown
---
title: Jerk Cauliflower Steaks
category: caribbean
servings: 4
prepTime: 20min
cookTime: 35min
allergens: [soy-optional]
tags: [main, gf, nut-free, crowd-pleaser]
---

## Cultural Origin

[100-200 words on where this dish comes from]

## Ingredients

- ...

## Method

1. ...

## Chef's Notes

- Make-ahead: ...
- Substitutions: ...
- Catering scale: multiply by X for 50 guests

## Nanny Pairings

- Event type: dinner party, wedding reception
- Wine/beverage: ...
- Menu position: main course / family style
```

## How to Use with Nanny

- Recipes here feed into `POST /api/nanny/menu/create` as seed inspiration
- The LLM router uses these as in-context examples for culturally grounded menus
- Pinterest auto-post pipeline reads from this folder for blog content
