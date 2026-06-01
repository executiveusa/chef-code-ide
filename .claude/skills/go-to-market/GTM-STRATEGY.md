# Nanny — Go-To-Market Strategy

## Revenue Model (Make Money While You Sleep)

### Tier 1: Direct Subscriptions (Creem.io + Stripe)

```
Free       $0/mo  — 5 menus, 3 events, mock mode
Starter   $49/mo  — 50 menus, unlimited events, real LLM
Pro       $99/mo  — Unlimited everything, vision, team of 5
White-Label $299/mo — Full rebrand, multi-org, custom domain
```

**LTV Target**: Average customer $99/mo × 18 months = $1,782 LTV
**CAC Target**: <$50 (organic content + Pinterest SEO)

### Tier 2: Recipe Blog / Content SEO (Pinterest → Blog → Nanny trial)

- 3 recipe posts/week → 12/month → 144/year
- Pinterest SEO: 6-12 months to 50k monthly impressions
- Conversion: 2% to free trial → 10% to paid = $200-$1,000/mo passive

### Tier 3: White-Label Licensing (B2B)

- Sell to catering companies, culinary schools, estate management firms
- $299-$999/mo per org depending on size
- Target: 10 white-label accounts = $3k-$10k MRR passive

### Tier 4: Digital Products (One-time)

- "Vegan Catering Starter Kit" — $29 Gumroad/Creem
- "30 Afro-Caribbean Plant-Based Recipes PDF" — $19
- "Ghost Kitchen Launch Playbook" — $49
- These fund Creem.io passive sales 24/7

## GTM Channels

### 1. Pinterest SEO (Highest ROI, 0 ad spend)

- Post 15x/week (3x/day via Postiz)
- Focus: recipe tutorials, kitchen tips, menu templates
- Target keywords: "vegan catering menu", "plant-based wedding food", "Caribbean vegan recipes"
- Timeline: 0 → 50k monthly views in 6-9 months

### 2. TikTok / Instagram Reels

- 1 cooking Reel per week (60-90 sec)
- 3 stories/day (behind the scenes, tips, polls)
- Hashtag stack: 5 niche + 5 mid + 5 broad

### 3. Private Chef / Catering Facebook Groups

- Don't sell — share value (free menu templates, free runbook)
- Nanny free tier as the lead magnet
- Target groups: "Private Chefs Network", "Vegan Chefs Collective", "Ghost Kitchen Operators"

### 4. Email Newsletter

- "The Kitchen Brief" — weekly digest via Resend
- Include: 1 recipe, 1 tip, 1 industry news, 1 Nanny feature spotlight
- Build to 5k subscribers → 3% paid conversion = 150 paid users = $7,500 MRR

## Launch Sequence (12-Week Sprint)

```
Weeks 1-2:   Set up Pinterest + Instagram, post first 14 pieces of content
Weeks 3-4:   Launch free tier publicly, collect 50 beta users
Weeks 5-6:   Email waitlist + Product Hunt launch
Weeks 7-8:   First white-label pilot (1 catering company, free 30 days)
Weeks 9-10:  Paid tiers live (Creem.io), convert beta users
Weeks 11-12: Affiliate program launch ($20/referral for Starter+)
```

## Payment Providers (Both Active, Redundant)

| Provider     | Use Case                                  | Keys Needed                                  |
| ------------ | ----------------------------------------- | -------------------------------------------- |
| **Creem.io** | Primary — simpler, lower fees globally    | `CREEM_API_KEY`, `CREEM_*_PRODUCT_ID`        |
| **Stripe**   | Fallback — enterprise/white-label clients | `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` |

Both routes are live:

- `/api/nanny/creem/checkout` — Creem.io checkout
- `/api/nanny/billing/checkout` — Stripe checkout
- UI: show Creem as primary, Stripe as "enterprise billing"

## Metrics to Track (Convex DB)

- MRR (monthly recurring revenue)
- Free → paid conversion rate (target 8%)
- Pinterest monthly views (target 50k by month 6)
- Email open rate (target 35%+)
- Churn rate (target <5%/month)
- Average revenue per user (ARPU)
