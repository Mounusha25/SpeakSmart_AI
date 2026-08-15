import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Start a new conversation
export const startConversation = mutation({
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
    occasion: v.string(),
  },
  handler: async (ctx, args) => {
    // Get user
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkUserId", args.clerkUserId))
      .unique();

    if (!user) {
      throw new Error("User not found");
    }

    // Get conversation template for the occasion
    const template = await ctx.db
      .query("conversationTemplates")
      .withIndex("by_occasion", (q) => q.eq("occasion", args.occasion))
      .unique();

    const defaultQuestions = [
      { id: 1, text: "What's your role in organizing this festival?" },
      { id: 2, text: "How many people are you expecting?" },
      { id: 3, text: "What's the main challenge you're facing?" },
      { id: 4, text: "Have you prepared your speech points?" },
      { id: 5, text: "What tone do you want to convey?" },
      { id: 6, text: "How confident do you feel about this event?" },
    ];

    const questions = template?.questions || defaultQuestions;

    const conversationId = await ctx.db.insert("conversations", {
      userId: user._id,
      clerkUserId: args.clerkUserId,
      character: args.character,
      occasion: args.occasion,
      questions: questions.map(q => ({
        id: q.id,
        text: q.text,
      })),
      quizResults: [],
      scores: {
        confidence: 0,
        fluency: 0,
        responseQuality: 0,
        overall: 0,
      },
      isCompleted: false,
      createdAt: Date.now(),
    });

    return await ctx.db.get(conversationId);
  },
});

// Submit response to a question
export const submitResponse = mutation({
  args: {
    conversationId: v.id("conversations"),
    questionId: v.number(),
    response: v.string(),
    responseTime: v.number(),
  },
  handler: async (ctx, args) => {
    const conversation = await ctx.db.get(args.conversationId);
    if (!conversation) {
      throw new Error("Conversation not found");
    }

    const updatedQuestions = conversation.questions.map(q => {
      if (q.id === args.questionId) {
        return {
          ...q,
          response: args.response,
          responseLength: args.response.length,
          responseTime: args.responseTime,
        };
      }
      return q;
    });

    await ctx.db.patch(args.conversationId, {
      questions: updatedQuestions,
    });

    return await ctx.db.get(args.conversationId);
  },
});

// Submit quiz result
export const submitQuizResult = mutation({
  args: {
    conversationId: v.id("conversations"),
    quizNumber: v.number(),
    dialogue: v.string(),
    question: v.string(),
    options: v.array(v.string()),
    userAnswer: v.number(),
    correctAnswer: v.number(),
  },
  handler: async (ctx, args) => {
    const conversation = await ctx.db.get(args.conversationId);
    if (!conversation) {
      throw new Error("Conversation not found");
    }

    const isCorrect = args.userAnswer === args.correctAnswer;
    const quizResult = {
      quizNumber: args.quizNumber,
      dialogue: args.dialogue,
      question: args.question,
      options: args.options,
      userAnswer: args.userAnswer,
      correctAnswer: args.correctAnswer,
      isCorrect,
      completedAt: Date.now(),
    };

    const updatedQuizResults = [...conversation.quizResults, quizResult];

    await ctx.db.patch(args.conversationId, {
      quizResults: updatedQuizResults,
    });

    return await ctx.db.get(args.conversationId);
  },
});

// Complete conversation and calculate scores
export const completeConversation = mutation({
  args: {
    conversationId: v.id("conversations"),
  },
  handler: async (ctx, args) => {
    const conversation = await ctx.db.get(args.conversationId);
    if (!conversation) {
      throw new Error("Conversation not found");
    }

    // Calculate scores based on responses and quiz performance
    const answeredQuestions = conversation.questions.filter(q => q.response);
    const correctQuizAnswers = conversation.quizResults.filter(q => q.isCorrect).length;
    
    // Calculate metrics
    const avgResponseLength = answeredQuestions.length > 0 
      ? answeredQuestions.reduce((sum, q) => sum + (q.responseLength || 0), 0) / answeredQuestions.length
      : 0;
    
    const avgResponseTime = answeredQuestions.length > 0
      ? answeredQuestions.reduce((sum, q) => sum + (q.responseTime || 0), 0) / answeredQuestions.length
      : 0;

    // Scoring algorithm
    const confidence = Math.min(100, Math.max(0, 
      (answeredQuestions.length / conversation.questions.length) * 50 +
      (correctQuizAnswers / conversation.quizResults.length) * 50
    ));

    const fluency = Math.min(100, Math.max(0,
      Math.max(0, 100 - (avgResponseTime - 5) * 5) * 0.6 +
      Math.min(100, avgResponseLength / 2) * 0.4
    ));

    const responseQuality = Math.min(100, Math.max(0,
      (avgResponseLength > 20 ? 80 : avgResponseLength * 4) * 0.7 +
      (correctQuizAnswers / conversation.quizResults.length) * 100 * 0.3
    ));

    const overall = Math.round((confidence + fluency + responseQuality) / 3);

    const scores = {
      confidence: Math.round(confidence),
      fluency: Math.round(fluency),
      responseQuality: Math.round(responseQuality),
      overall,
    };

    await ctx.db.patch(args.conversationId, {
      scores,
      isCompleted: true,
      completedAt: Date.now(),
    });

    return await ctx.db.get(args.conversationId);
  },
});

// Get conversation by ID
export const getConversation = query({
  args: { conversationId: v.id("conversations") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.conversationId);
  },
});

// Get user's recent conversations
export const getUserRecentConversations = query({
  args: { clerkUserId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("conversations")
      .withIndex("by_clerk_user", (q) => q.eq("clerkUserId", args.clerkUserId))
      .order("desc")
      .take(5);
  },
});