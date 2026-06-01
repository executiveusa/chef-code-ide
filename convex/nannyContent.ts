import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Durable content storage — blog posts, social posts, recipes, brand assets

export const saveRecipe = mutation({
  args: {
    sessionId: v.string(),
    title: v.string(),
    category: v.string(),
    content: v.string(), // markdown
    pinterestDescription: v.optional(v.string()),
    instagramCaption: v.optional(v.string()),
    hashtags: v.optional(v.array(v.string())),
    publishedAt: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("nannyRecipes", {
      ...args,
      createdAt: Date.now(),
    });
  },
});

export const saveSocialPost = mutation({
  args: {
    sessionId: v.string(),
    platform: v.union(
      v.literal("instagram"),
      v.literal("tiktok"),
      v.literal("pinterest"),
      v.literal("linkedin"),
      v.literal("twitter"),
    ),
    caption: v.string(),
    imageDescription: v.optional(v.string()),
    hashtags: v.array(v.string()),
    scheduledFor: v.optional(v.number()),
    status: v.union(v.literal("draft"), v.literal("scheduled"), v.literal("posted")),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("nannySocialPosts", {
      ...args,
      createdAt: Date.now(),
    });
  },
});

export const getRecipes = query({
  args: { sessionId: v.string(), category: v.optional(v.string()) },
  handler: async (ctx, args) => {
    let q = ctx.db.query("nannyRecipes").withIndex("bySession", (q) => q.eq("sessionId", args.sessionId));
    const results = await q.order("desc").take(50);
    if (args.category) {
      return results.filter((r) => r.category === args.category);
    }
    return results;
  },
});

export const getSocialPosts = query({
  args: { sessionId: v.string(), status: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const posts = await ctx.db
      .query("nannySocialPosts")
      .withIndex("bySession", (q) => q.eq("sessionId", args.sessionId))
      .order("desc")
      .take(100);
    if (args.status) {
      return posts.filter((p) => p.status === args.status);
    }
    return posts;
  },
});
