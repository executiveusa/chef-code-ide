import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

const planValidator = v.union(v.literal("free"), v.literal("starter"), v.literal("pro"), v.literal("white-label"));

const statusValidator = v.union(
  v.literal("active"),
  v.literal("canceled"),
  v.literal("past_due"),
  v.literal("trialing"),
);

export const getSubscription = query({
  args: { sessionId: v.string() },
  handler: async (ctx, { sessionId }) => {
    return await ctx.db
      .query("nannySubscriptions")
      .withIndex("bySession", (q) => q.eq("sessionId", sessionId))
      .first();
  },
});

export const createOrUpdateSubscription = mutation({
  args: {
    sessionId: v.string(),
    memberId: v.optional(v.string()),
    stripeCustomerId: v.optional(v.string()),
    stripeSubscriptionId: v.optional(v.string()),
    plan: planValidator,
    status: statusValidator,
    trialEndsAt: v.optional(v.number()),
    currentPeriodEnd: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("nannySubscriptions")
      .withIndex("bySession", (q) => q.eq("sessionId", args.sessionId))
      .first();

    if (existing) {
      await ctx.db.patch("nannySubscriptions", existing._id, {
        memberId: args.memberId,
        stripeCustomerId: args.stripeCustomerId,
        stripeSubscriptionId: args.stripeSubscriptionId,
        plan: args.plan,
        status: args.status,
        trialEndsAt: args.trialEndsAt,
        currentPeriodEnd: args.currentPeriodEnd,
      });
      return existing._id;
    }

    return await ctx.db.insert("nannySubscriptions", {
      sessionId: args.sessionId,
      memberId: args.memberId,
      stripeCustomerId: args.stripeCustomerId,
      stripeSubscriptionId: args.stripeSubscriptionId,
      plan: args.plan,
      status: args.status,
      trialEndsAt: args.trialEndsAt,
      currentPeriodEnd: args.currentPeriodEnd,
      createdAt: Date.now(),
    });
  },
});

export const cancelSubscription = mutation({
  args: { sessionId: v.string() },
  handler: async (ctx, { sessionId }) => {
    const existing = await ctx.db
      .query("nannySubscriptions")
      .withIndex("bySession", (q) => q.eq("sessionId", sessionId))
      .first();

    if (!existing) {
      return null;
    }

    await ctx.db.patch("nannySubscriptions", existing._id, { status: "canceled" });
    return existing._id;
  },
});

export const getSubscriptionByStripeCustomer = query({
  args: { stripeCustomerId: v.string() },
  handler: async (ctx, { stripeCustomerId }) => {
    return await ctx.db
      .query("nannySubscriptions")
      .withIndex("byStripeCustomer", (q) => q.eq("stripeCustomerId", stripeCustomerId))
      .first();
  },
});

export const getSubscriptionByStripeSubscription = query({
  args: { stripeSubscriptionId: v.string() },
  handler: async (ctx, { stripeSubscriptionId }) => {
    return await ctx.db
      .query("nannySubscriptions")
      .withIndex("byStripeSubscription", (q) => q.eq("stripeSubscriptionId", stripeSubscriptionId))
      .first();
  },
});
