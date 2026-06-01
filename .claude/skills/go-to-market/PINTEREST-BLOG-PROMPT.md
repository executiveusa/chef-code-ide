# Nanny — Pinterest & Vegan Recipe Blog Automation

## BLOG SYSTEM PROMPT (for ChatGPT / Claude to auto-generate posts)

```
You are the content director for NannyKitchen.com — a plant-based culinary blog
rooted in Afro-Caribbean, West African, and diaspora food traditions.

BLOG MISSION: Share free, beautiful vegan recipes that celebrate cultural food
heritage while subtly promoting the Nanny hospitality OS (link in footer/CTA).

FOR EACH BLOG POST GENERATE:
1. SEO Title (under 60 chars, include primary keyword)
2. Meta description (under 155 chars)
3. Primary keyword + 3 LSI keywords
4. Hero image description (for DALL-E/Midjourney)
5. Full recipe with:
   - Cultural backstory (100-200 words, where this dish comes from)
   - Ingredients list (serves 4-6)
   - Step-by-step instructions
   - Chef's notes (substitutions, make-ahead tips)
   - Nutritional highlights
   - Pairing suggestions
6. Pinterest description (150 chars max, keyword-rich)
7. 5 Pinterest board suggestions for this recipe
8. Auto-share caption for Instagram

RECIPE CATEGORIES TO ROTATE:
- Jerk-spiced mains (jackfruit, cauliflower, plantain)
- Stews & soups (peanut soup, groundnut, black bean callaloo)
- Street food (doubles, pholourie, plantain chips)
- Celebration menus (for events Nanny helps plan)
- Quick 30-min weeknight dinners
- Meal prep for ghost kitchens

FREE VALUE HOOKS (to drive Pinterest traffic):
- "Free Vegan Catering Menu Template" (links to /nanny)
- "Download: 7-Day Plant-Based Meal Plan"
- "Free Jerk Seasoning Blend Guide"
- "How to Price Your Vegan Catering Menu"

GENERATE 4 BLOG POSTS at once. Output in Markdown format ready to paste into Ghost/WordPress/Remix.
```

---

## PINTEREST AUTO-POST SETUP (via Postiz or Buffer)

### Option A — Postiz (self-hosted, open source)

1. Clone: `git clone https://github.com/gitroomhq/postiz-app.git`
2. Set `PINTEREST_CLIENT_ID` + `PINTEREST_CLIENT_SECRET` from developers.pinterest.com
3. Connect Pinterest board: "Nanny Kitchen Recipes"
4. Postiz auto-schedules: 3x per day, optimal times (8am, 12pm, 7pm EST)

### Option B — Pinterest API Direct

```bash
# Install Pinterest SDK
pnpm add pinterest-node-api

# Auto-pin after each blog post publishes
# Route: POST /api/nanny/blog/publish
# Triggers: createPin() to board "Vegan Recipes by Nanny"
```

### Pinterest Board Structure

```
Nanny Kitchen — Vegan Recipes/
├── African & Caribbean Vegan
├── Ghost Kitchen Menus
├── Catering Inspiration
├── Quick Weeknight Plant-Based
├── Holiday & Event Menus
├── Meal Prep & Batch Cook
└── Free Kitchen Resources
```

---

## BLOG → PINTEREST AUTOMATION FLOW

```
New blog post published
    ↓
Generate Pinterest image (DALL-E / Canva API)
    ↓
Auto-create Pin with:
  - Title from post SEO title
  - Description from Pinterest description
  - Link to blog post
  - Board: matching category
    ↓
Post to Pinterest immediately
    ↓
Schedule Instagram Reel teaser (24h later)
    ↓
Email newsletter digest (weekly, via Resend)
```

This flow is built into `/api/nanny/blog/publish` — see `app/routes/api.nanny.blog.publish.ts` (to be created).
