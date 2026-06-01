import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createOrg = mutation({
  args: {
    slug: v.string(),
    name: v.string(),
    restaurantType: v.union(
      v.literal("ghost-kitchen"),
      v.literal("private-chef"),
      v.literal("catering"),
      v.literal("pop-up"),
      v.literal("estate"),
    ),
    brandConfigJson: v.string(),
    ownerId: v.string(),
    plan: v.optional(v.union(v.literal("free"), v.literal("starter"), v.literal("pro"), v.literal("white-label"))),
  },
  returns: v.id("nannyOrganizations"),
  handler: async (ctx, args) => {
    const now = Date.now();
    const trialEndsAt = now + 14 * 24 * 60 * 60 * 1000; // 14-day trial
    return await ctx.db.insert("nannyOrganizations", {
      slug: args.slug,
      name: args.name,
      restaurantType: args.restaurantType,
      brandConfigJson: args.brandConfigJson,
      ownerId: args.ownerId,
      memberIds: [args.ownerId],
      plan: args.plan ?? "free",
      createdAt: now,
      trialEndsAt,
    });
  },
});

export const updateOnboarding = mutation({
  args: {
    sessionId: v.string(),
    step: v.number(),
    kitchenName: v.optional(v.string()),
    restaurantType: v.optional(v.string()),
    cuisineFocus: v.optional(v.array(v.string())),
    teamSize: v.optional(v.string()),
    firstEventDate: v.optional(v.string()),
    completed: v.optional(v.boolean()),
  },
  returns: v.id("nannyOnboarding"),
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("nannyOnboarding")
      .withIndex("bySession", (q) => q.eq("sessionId", args.sessionId))
      .first();

    const patch: {
      step: number;
      completed: boolean;
      kitchenName?: string;
      restaurantType?: string;
      cuisineFocus?: string[];
      teamSize?: string;
      firstEventDate?: string;
    } = {
      step: args.step,
      completed: args.completed ?? false,
    };
    if (args.kitchenName !== undefined) {
      patch.kitchenName = args.kitchenName;
    }
    if (args.restaurantType !== undefined) {
      patch.restaurantType = args.restaurantType;
    }
    if (args.cuisineFocus !== undefined) {
      patch.cuisineFocus = args.cuisineFocus;
    }
    if (args.teamSize !== undefined) {
      patch.teamSize = args.teamSize;
    }
    if (args.firstEventDate !== undefined) {
      patch.firstEventDate = args.firstEventDate;
    }

    if (existing) {
      await ctx.db.patch("nannyOnboarding", existing._id, patch);
      return existing._id;
    } else {
      return await ctx.db.insert("nannyOnboarding", {
        sessionId: args.sessionId,
        createdAt: Date.now(),
        ...patch,
      });
    }
  },
});

export const getOnboarding = query({
  args: { sessionId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("nannyOnboarding")
      .withIndex("bySession", (q) => q.eq("sessionId", args.sessionId))
      .first();
  },
});

export const getOrg = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("nannyOrganizations")
      .withIndex("bySlug", (q) => q.eq("slug", args.slug))
      .first();
  },
});
