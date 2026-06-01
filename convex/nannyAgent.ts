import { v } from "convex/values";
import { internalMutation, internalQuery, mutation, query } from "./_generated/server";

// Durable agent job queue — tasks that run in the background
// to generate content, send emails, pin to Pinterest, post to social, etc.

export const enqueueJob = mutation({
  args: {
    sessionId: v.string(),
    jobType: v.union(
      v.literal("generate-menu"),
      v.literal("generate-social-post"),
      v.literal("pin-to-pinterest"),
      v.literal("send-email"),
      v.literal("generate-runbook"),
      v.literal("generate-blog-post"),
      v.literal("schedule-post"),
    ),
    payload: v.any(),
    scheduledFor: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("nannyAgentJobs", {
      sessionId: args.sessionId,
      jobType: args.jobType,
      payload: args.payload,
      status: "pending",
      scheduledFor: args.scheduledFor ?? Date.now(),
      createdAt: Date.now(),
      attempts: 0,
    });
  },
});

export const getPendingJobs = internalQuery({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("nannyAgentJobs")
      .withIndex("byStatus", (q) => q.eq("status", "pending"))
      .order("asc")
      .take(args.limit ?? 10);
  },
});

export const markJobComplete = internalMutation({
  args: { jobId: v.id("nannyAgentJobs"), result: v.optional(v.any()) },
  handler: async (ctx, args) => {
    await ctx.db.patch("nannyAgentJobs", args.jobId, {
      status: "done",
      completedAt: Date.now(),
      result: args.result,
    });
  },
});

export const markJobFailed = internalMutation({
  args: { jobId: v.id("nannyAgentJobs"), error: v.string() },
  handler: async (ctx, args) => {
    const job = await ctx.db.get("nannyAgentJobs", args.jobId);
    if (!job) {
      return;
    }
    await ctx.db.patch("nannyAgentJobs", args.jobId, {
      status: job.attempts >= 3 ? "dead" : "pending",
      attempts: job.attempts + 1,
      lastError: args.error,
      scheduledFor: Date.now() + 60_000 * Math.pow(2, job.attempts), // exponential backoff
    });
  },
});

export const getJobsBySession = query({
  args: { sessionId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("nannyAgentJobs")
      .withIndex("bySession", (q) => q.eq("sessionId", args.sessionId))
      .order("desc")
      .take(50);
  },
});
