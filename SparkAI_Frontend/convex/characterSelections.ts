import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Character data mapping
const characterData = {
  'ben-10': {
    name: 'Ben 10',
    dialogue: "It's hero time! Ready to transform your conversation skills? Let me help you become the hero of any discussion!",
    personality: 'Adventurous • Brave • Determined',
    quote: "It's hero time!"
  },
  'black-panther': {
    name: 'Black Panther',
    dialogue: "Greetings. I am T'Challa. Let us prepare you for meaningful dialogue with the wisdom of Wakanda.",
    personality: 'Wise • Diplomatic • Honorable',
    quote: "Wakanda forever!"
  },
  'wanda-vision': {
    name: 'Wanda Vision',
    dialogue: "Hello there. I understand the power of words and emotions. Let's work together to strengthen your communication abilities.",
    personality: 'Empathetic • Powerful • Resilient',
    quote: "I can handle the truth."
  },
  'dora': {
    name: 'Dora',
    dialogue: "¡Hola! I'm Dora! Let's go on an adventure to improve your conversation skills. Are you ready to explore?",
    personality: 'Curious • Helpful • Educational',
    quote: "¡Vamos! Let's go!"
  }
};

// Save character selection with user info
export const saveCharacterSelection = mutation({
  args: {
    clerkUserId: v.string(),
    username: v.string(),
    email: v.string(),
    selectedCharacter: v.union(
      v.literal("ben-10"),
      v.literal("black-panther"),
      v.literal("wanda-vision"),
      v.literal("dora")
    ),
  },
  handler: async (ctx, args) => {
    const { clerkUserId, username, email, selectedCharacter } = args;
    
    // Get character data
    const character = characterData[selectedCharacter];
    if (!character) {
      throw new Error(`Invalid character: ${selectedCharacter}`);
    }

    // Check if user has selected this character before
    const existingSelection = await ctx.db
      .query("characterSelections")
      .withIndex("by_user_and_character", (q) => 
        q.eq("clerkUserId", clerkUserId).eq("selectedCharacter", selectedCharacter)
      )
      .first();

    const now = Date.now();

    if (existingSelection) {
      // Update existing selection
      await ctx.db.patch(existingSelection._id, {
        username, // Update in case name changed
        email, // Update in case email changed
        selectionCount: existingSelection.selectionCount + 1,
        lastSelectedAt: now,
      });
      
      console.log(`Updated character selection for user ${username}: ${character.name}`);
      return existingSelection._id;
    } else {
      // Create new selection record
      const selectionId = await ctx.db.insert("characterSelections", {
        clerkUserId,
        username,
        email,
        selectedCharacter,
        characterName: character.name,
        characterDialogue: character.dialogue,
        characterPersonality: character.personality,
        characterQuote: character.quote,
        selectionCount: 1,
        lastSelectedAt: now,
        createdAt: now,
      });
      
      console.log(`Created new character selection for user ${username}: ${character.name}`);
      return selectionId;
    }
  },
});

// Get character selections by user
export const getUserCharacterSelections = query({
  args: {
    clerkUserId: v.string(),
  },
  handler: async (ctx, args) => {
    const selections = await ctx.db
      .query("characterSelections")
      .withIndex("by_user", (q) => q.eq("clerkUserId", args.clerkUserId))
      .collect();

    return selections.sort((a, b) => b.lastSelectedAt - a.lastSelectedAt);
  },
});

// Get all character selections (admin view)
export const getAllCharacterSelections = query({
  args: {},
  handler: async (ctx) => {
    const selections = await ctx.db
      .query("characterSelections")
      .collect();

    return selections.sort((a, b) => b.lastSelectedAt - a.lastSelectedAt);
  },
});

// Get character selection statistics
export const getCharacterStats = query({
  args: {},
  handler: async (ctx) => {
    const selections = await ctx.db
      .query("characterSelections")
      .collect();

    // Calculate stats
    const stats = {
      totalSelections: selections.length,
      uniqueUsers: new Set(selections.map(s => s.clerkUserId)).size,
      characterPopularity: {} as Record<string, number>,
      recentSelections: selections
        .sort((a, b) => b.lastSelectedAt - a.lastSelectedAt)
        .slice(0, 10)
    };

    // Count selections per character
    selections.forEach(selection => {
      const char = selection.selectedCharacter;
      stats.characterPopularity[char] = (stats.characterPopularity[char] || 0) + selection.selectionCount;
    });

    return stats;
  },
});

// Get user's most recent character selection
export const getLatestCharacterSelection = query({
  args: {
    clerkUserId: v.string(),
  },
  handler: async (ctx, args) => {
    const latestSelection = await ctx.db
      .query("characterSelections")
      .withIndex("by_user", (q) => q.eq("clerkUserId", args.clerkUserId))
      .order("desc")
      .first();

    return latestSelection;
  },
});