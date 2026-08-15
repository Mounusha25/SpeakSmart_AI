import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Get all characters
export const getCharacters = query({
  handler: async (ctx) => {
    return await ctx.db.query("characters").collect();
  },
});

// Get character by ID
export const getCharacter = query({
  args: { characterId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("characters")
      .filter((q) => q.eq(q.field("id"), args.characterId))
      .unique();
  },
});

// Seed initial character data
export const seedCharacters = mutation({
  handler: async (ctx) => {
    // Clear existing characters first
    const existing = await ctx.db.query("characters").collect();
    for (const char of existing) {
      await ctx.db.delete(char._id);
    }
    console.log(`Cleared ${existing.length} existing characters`);

    const characters = [
      {
        id: "ben-10",
        name: "Ben 10",
        description: "Young hero with the power to transform into different aliens",
        avatar: "⌚",
        personality: "Adventurous, brave, determined, and quick-thinking. Always ready for action.",
        dialogues: [
          { quote: "It's hero time!", context: "Ready to face challenges" },
          { quote: "I can handle this!", context: "Showing confidence and determination" },
          { quote: "Let's save the day!", context: "Taking on responsibility" },
        ],
        greeting: "It's hero time! Ready to transform your conversation skills? Let me help you become the hero of any discussion!",
      },
      {
        id: "black-panther",
        name: "Black Panther",
        description: "T'Challa, the wise and noble king of Wakanda",
        avatar: "�",
        personality: "Wise, diplomatic, honorable, and thoughtful. Speaks with purpose and dignity.",
        dialogues: [
          { quote: "Wakanda forever!", context: "Unity and strength in community" },
          { quote: "In times of crisis, the wise build bridges while the foolish build barriers.", context: "Leadership wisdom" },
          { quote: "The world is changing. Soon there will only be the conquered and the conquerors.", context: "Strategic thinking" },
        ],
        greeting: "Greetings. I am T'Challa. Let us prepare you for meaningful dialogue with the wisdom of Wakanda.",
      },
      {
        id: "wanda-vision",
        name: "Wanda Vision",
        description: "Scarlet Witch with reality-altering powers and deep emotional strength",
        avatar: "�",
        personality: "Empathetic, powerful, resilient, and emotionally intelligent. Transforms challenges into strength.",
        dialogues: [
          { quote: "I can handle the truth.", context: "Facing difficult realities" },
          { quote: "You don't know what you've unleashed.", context: "Warning about hidden potential" },
          { quote: "I'm not a monster. I'm a mother.", context: "Showing compassion and protective instincts" },
        ],
        greeting: "Hello there. I understand the power of words and emotions. Let's work together to strengthen your communication abilities.",
      },
      {
        id: "dora",
        name: "Dora",
        description: "Young explorer who teaches through adventure and discovery",
        avatar: "🎒",
        personality: "Curious, helpful, educational, and encouraging. Makes learning fun and interactive.",
        dialogues: [
          { quote: "¡Vamos! Let's go!", context: "Encouraging forward movement" },
          { quote: "We did it! ¡Lo hicimos!", context: "Celebrating success" },
          { quote: "Come on! ¡Vámonos!", context: "Motivating to take action" },
        ],
        greeting: "¡Hola! I'm Dora! Let's go on an adventure to improve your conversation skills. Are you ready to explore?",
      },
    ];

    for (const character of characters) {
      await ctx.db.insert("characters", character);
    }

    return "Characters seeded successfully";
  },
});

// Seed quiz questions
export const seedQuizQuestions = mutation({
  handler: async (ctx) => {
    // Clear existing quiz questions first
    const existing = await ctx.db.query("quizQuestions").collect();
    for (const quiz of existing) {
      await ctx.db.delete(quiz._id);
    }
    console.log(`Cleared ${existing.length} existing quiz questions`);

    const quizQuestions = [
      // Ben 10 Quizzes
      {
        character: "ben-10" as const,
        triggerAfterQuestion: 2,
        dialogue: "It's hero time!",
        question: "Based on your role and guest count, what's the most heroic approach to preparation?",
        options: [
          "Creating a detailed timeline and delegate responsibilities",
          "Just winging it and hoping for the best", 
          "Focusing only on decorations",
          "Avoiding all planning until last minute"
        ],
        correctAnswer: 0,
        explanation: "Like Ben 10, true heroes prepare thoroughly and work as a team to handle any challenge."
      },
      {
        character: "ben-10" as const,
        triggerAfterQuestion: 4,
        dialogue: "I can handle this!",
        question: "How will you handle unexpected challenges during the festival?",
        options: [
          "Panic and abandon the plan",
          "Stay flexible and adapt quickly with backup solutions",
          "Ignore problems and hope they resolve themselves",
          "Blame others for not preventing issues"
        ],
        correctAnswer: 1,
        explanation: "Ben 10's heroic nature teaches us to stay adaptable and confident when facing unexpected situations."
      },
      {
        character: "ben-10" as const,
        triggerAfterQuestion: 6,
        dialogue: "Let's save the day!",
        question: "What's your key takeaway for delivering a heroic message?",
        options: [
          "Speak quietly and hope people listen",
          "Own your message with conviction and clear purpose",
          "Apologize before saying anything important",
          "Focus on what might go wrong"
        ],
        correctAnswer: 1,
        explanation: "Ben 10's heroism comes from speaking with confidence and taking responsibility for positive outcomes."
      },
      // Wanda Vision Quizzes
      {
        character: "wanda-vision" as const,
        triggerAfterQuestion: 2,
        dialogue: "I can handle the truth.",
        question: "Based on your role and guest count, what shows emotional intelligence in leadership?",
        options: [
          "Doing everything yourself to avoid emotions",
          "Understanding people's needs and building connections",
          "Making all decisions without considering feelings",
          "Avoiding difficult emotional conversations"
        ],
        correctAnswer: 1,
        explanation: "Wanda's emotional strength teaches us that true power comes from understanding and connecting with others."
      },
      {
        character: "wanda-vision" as const,
        triggerAfterQuestion: 4,
        dialogue: "You don't know what you've unleashed.",
        question: "How should you handle festival challenges with emotional wisdom?",
        options: [
          "Suppress all emotions and be robotic",
          "Channel emotions constructively while staying focused on solutions",
          "Let emotions overwhelm decision-making",
          "Hide from emotional challenges"
        ],
        correctAnswer: 1,
        explanation: "Wanda's journey shows us how to harness emotional power constructively while maintaining focus on our goals."
      },
      {
        character: "wanda-vision" as const,
        triggerAfterQuestion: 6,
        dialogue: "I'm not a monster. I'm a mother.",
        question: "What does it mean to communicate with Wanda's compassionate strength?",
        options: [
          "Always put others' needs before your own message",
          "Balance compassion with clear, honest communication",
          "Avoid difficult truths to protect feelings",
          "Never show vulnerability in your message"
        ],
        correctAnswer: 1,
        explanation: "Wanda's wisdom teaches us that true strength comes from balancing compassion with honest, clear communication."
      },
      // Black Panther Quizzes
      {
        character: "black-panther" as const,
        triggerAfterQuestion: 2,
        dialogue: "Wakanda forever!",
        question: "Based on your role and guest count, what demonstrates true leadership wisdom?",
        options: [
          "Making decisions in isolation",
          "Building unity and considering community impact",
          "Focusing only on personal gain",
          "Following others without question"
        ],
        correctAnswer: 1,
        explanation: "T'Challa's leadership focuses on unity and considering the greater good of the community."
      },
      {
        character: "black-panther" as const,
        triggerAfterQuestion: 4,
        dialogue: "In times of crisis, the wise build bridges while the foolish build barriers.",
        question: "How should you approach festival challenges with wisdom?",
        options: [
          "Create divisions to assign blame",
          "Build connections and collaborative solutions",
          "Isolate yourself from the problems",
          "Point out everyone else's mistakes"
        ],
        correctAnswer: 1,
        explanation: "Black Panther's wisdom teaches us to build bridges and find collaborative solutions during challenges."
      },
      {
        character: "black-panther" as const,
        triggerAfterQuestion: 6,
        dialogue: "The world is changing. Soon there will only be the conquered and the conquerors.",
        question: "What does Wakandan wisdom teach about confident communication?",
        options: [
          "Dominate every conversation",
          "Lead with purpose, honor, and strategic thinking",
          "Conquer others through manipulation",
          "Always be the loudest voice"
        ],
        correctAnswer: 1,
        explanation: "T'Challa's approach combines strategic thinking with honor and purposeful communication."
      },
      // Dora Quizzes
      {
        character: "dora" as const,
        triggerAfterQuestion: 2,
        dialogue: "¡Vamos! Let's go!",
        question: "Based on your role and guest count, what's the most exploratory approach to preparation?",
        options: [
          "Making a map and planning the adventure step by step",
          "Just wandering around without direction",
          "Focusing only on the destination",
          "Avoiding all planning and exploration"
        ],
        correctAnswer: 0,
        explanation: "Like Dora, successful exploration requires careful planning and step-by-step preparation for the journey ahead."
      },
      {
        character: "dora" as const,
        triggerAfterQuestion: 4,
        dialogue: "We did it! ¡Lo hicimos!",
        question: "How should you handle festival challenges with Dora's adventurous spirit?",
        options: [
          "Give up when things get difficult",
          "Celebrate small wins and keep exploring solutions",
          "Rush through problems without learning",
          "Avoid challenges completely"
        ],
        correctAnswer: 1,
        explanation: "Dora teaches us to celebrate progress and maintain a positive, solution-focused attitude during challenges."
      },
      {
        character: "dora" as const,
        triggerAfterQuestion: 6,
        dialogue: "Come on! ¡Vámonos!",
        question: "What does Dora's teaching style show about effective communication?",
        options: [
          "Always speak in multiple languages",
          "Make learning interactive and encourage participation",
          "Talk at people without waiting for responses",
          "Keep all knowledge to yourself"
        ],
        correctAnswer: 1,
        explanation: "Dora's approach shows that the best communication is interactive, encouraging, and helps others learn and grow."
      },
    ];

    for (const quiz of quizQuestions) {
      await ctx.db.insert("quizQuestions", quiz);
    }

    return "Quiz questions seeded successfully";
  },
});

// Get quiz questions for character and trigger point
export const getQuizQuestion = query({
  args: {
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
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("quizQuestions")
      .withIndex("by_character_and_trigger", (q) =>
        q.eq("character", args.character).eq("triggerAfterQuestion", args.triggerAfterQuestion)
      )
      .unique();
  },
});