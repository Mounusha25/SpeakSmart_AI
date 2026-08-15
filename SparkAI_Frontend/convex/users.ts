import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Get or create user based on Clerk user ID
export const getOrCreateUser = mutation({
  args: {
    clerkUserId: v.string(),
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkUserId", args.clerkUserId))
      .unique();

    if (existingUser) {
      return existingUser;
    }

    const userId = await ctx.db.insert("users", {
      clerkUserId: args.clerkUserId,
      email: args.email,
      totalSessions: 0,
      averageScore: 0,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return await ctx.db.get(userId);
  },
});

// Update user's selected character
export const updateSelectedCharacter = mutation({
  args: {
    clerkUserId: v.string(),
    character: v.union(
      v.literal("ben-10"),
      v.literal("black-panther"),
      v.literal("wanda-vision"),
      v.literal("dora"),
      // Temporary: old character names for migration
      v.literal("iron-man"),
      v.literal("hulk")
    ),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkUserId", args.clerkUserId))
      .unique();

    if (!user) {
      throw new Error("User not found");
    }

    await ctx.db.patch(user._id, {
      selectedCharacter: args.character,
      updatedAt: Date.now(),
    });

    return await ctx.db.get(user._id);
  },
});

// Get user by Clerk ID
export const getUserByClerkId = query({
  args: { clerkUserId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkUserId", args.clerkUserId))
      .unique();
  },
});

// Update user stats after conversation completion
export const updateUserStats = mutation({
  args: {
    clerkUserId: v.string(),
    newScore: v.number(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkUserId", args.clerkUserId))
      .unique();

    if (!user) {
      throw new Error("User not found");
    }

    const newTotalSessions = user.totalSessions + 1;
    const newAverageScore = (
      (user.averageScore * user.totalSessions + args.newScore) /
      newTotalSessions
    );

    await ctx.db.patch(user._id, {
      totalSessions: newTotalSessions,
      averageScore: Math.round(newAverageScore * 100) / 100,
      updatedAt: Date.now(),
    });

    return await ctx.db.get(user._id);
  },
});

// Get user's conversation history
export const getUserConversations = query({
  args: { clerkUserId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("conversations")
      .withIndex("by_clerk_user", (q) => q.eq("clerkUserId", args.clerkUserId))
      .order("desc")
      .take(10);
  },
});