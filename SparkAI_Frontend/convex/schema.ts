import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // User profiles and preferences
  users: defineTable({
    clerkUserId: v.string(),
    email: v.string(),
    selectedCharacter: v.optional(v.union(
      v.literal("ben-10"),
      v.literal("black-panther"),
      v.literal("wanda-vision"),
      v.literal("dora"),
      // Temporary: old character names for migration
      v.literal("iron-man"),
      v.literal("hulk")
    )),
    totalSessions: v.number(),
    averageScore: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_clerk_id", ["clerkUserId"]),

  // Individual conversation sessions
  conversations: defineTable({
    userId: v.id("users"),
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
    questions: v.array(v.object({
      id: v.number(),
      text: v.string(),
      response: v.optional(v.string()),
      responseLength: v.optional(v.number()),
      responseTime: v.optional(v.number()), // in seconds
    })),
    quizResults: v.array(v.object({
      quizNumber: v.number(),
      dialogue: v.string(),
      question: v.string(),
      options: v.array(v.string()),
      userAnswer: v.number(),
      correctAnswer: v.number(),
      isCorrect: v.boolean(),
      completedAt: v.number(),
    })),
    scores: v.object({
      confidence: v.number(), // 0-100
      fluency: v.number(), // 0-100
      responseQuality: v.number(), // 0-100
      overall: v.number(), // 0-100
    }),
    isCompleted: v.boolean(),
    completedAt: v.optional(v.number()),
    createdAt: v.number(),
  }).index("by_user", ["userId"])
   .index("by_clerk_user", ["clerkUserId"]),

  // Character data and configurations
  characters: defineTable({
    id: v.string(),
    name: v.string(),
    description: v.string(),
    avatar: v.string(),
    personality: v.string(),
    dialogues: v.array(v.object({
      quote: v.string(),
      context: v.string(),
    })),
    greeting: v.string(),
  }),

  // Quiz questions and data
  quizQuestions: defineTable({
    character: v.union(
      v.literal("ben-10"),
      v.literal("black-panther"),
      v.literal("wanda-vision"),
      v.literal("dora"),
      // Temporary: old character names for migration
      v.literal("iron-man"),
      v.literal("hulk")
    ),
    triggerAfterQuestion: v.number(),
    dialogue: v.string(),
    question: v.string(),
    options: v.array(v.string()),
    correctAnswer: v.number(),
    explanation: v.string(),
  }).index("by_character_and_trigger", ["character", "triggerAfterQuestion"]),

  // Conversation templates
  conversationTemplates: defineTable({
    occasion: v.string(),
    questions: v.array(v.object({
      id: v.number(),
      text: v.string(),
      followUp: v.optional(v.string()),
    })),
  }).index("by_occasion", ["occasion"]),

  // Character selections with dialogue history
  characterSelections: defineTable({
    clerkUserId: v.string(),
    username: v.string(), // User's name from Clerk
    email: v.string(), // User's email from Clerk
    selectedCharacter: v.union(
      v.literal("ben-10"),
      v.literal("black-panther"),
      v.literal("wanda-vision"),
      v.literal("dora")
    ),
    characterName: v.string(), // Display name (e.g., "Ben 10", "Black Panther")
    characterDialogue: v.string(), // The character's greeting/dialogue
    characterPersonality: v.string(), // Character's personality traits
    characterQuote: v.string(), // Character's signature quote
    selectionCount: v.number(), // How many times user selected this character
    lastSelectedAt: v.number(), // Timestamp of last selection
    createdAt: v.number(), // First time selected
  }).index("by_user", ["clerkUserId"])
   .index("by_character", ["selectedCharacter"])
   .index("by_user_and_character", ["clerkUserId", "selectedCharacter"]),
});