import { internalMutation, internalQuery } from "./_generated/server";

// Migration function to clean up old character data
export const migrateOldCharacters = internalMutation({
  handler: async (ctx) => {
    const invalidCharacters = ["hulk", "iron-man"];
    const defaultCharacter = "ben-10";
    let updated = 0;

    // Update users table
    const users = await ctx.db.query("users").collect();
    for (const user of users) {
      if (user.selectedCharacter && invalidCharacters.includes(user.selectedCharacter)) {
        await ctx.db.patch(user._id, {
          selectedCharacter: defaultCharacter,
          updatedAt: Date.now(),
        });
        updated++;
        console.log(`Updated user ${user.clerkUserId} character from ${user.selectedCharacter} to ${defaultCharacter}`);
      }
    }

    // Update conversations table
    const conversations = await ctx.db.query("conversations").collect();
    for (const conversation of conversations) {
      if (invalidCharacters.includes(conversation.character)) {
        await ctx.db.patch(conversation._id, {
          character: defaultCharacter,
        });
        updated++;
        console.log(`Updated conversation ${conversation._id} character from ${conversation.character} to ${defaultCharacter}`);
      }
    }

    // Update quizQuestions table
    const quizQuestions = await ctx.db.query("quizQuestions").collect();
    for (const quiz of quizQuestions) {
      if (invalidCharacters.includes(quiz.character)) {
        await ctx.db.patch(quiz._id, {
          character: defaultCharacter,
        });
        updated++;
        console.log(`Updated quiz question ${quiz._id} character from ${quiz.character} to ${defaultCharacter}`);
      }
    }

    console.log(`Migration complete. Updated ${updated} records.`);
    return { success: true, updatedRecords: updated };
  },
});

// Function to check for invalid character data
export const checkInvalidCharacters = internalQuery({
  handler: async (ctx) => {
    const invalidCharacters = ["hulk", "iron-man"];
    const issues = [];

    // Check users table
    const users = await ctx.db.query("users").collect();
    for (const user of users) {
      if (user.selectedCharacter && invalidCharacters.includes(user.selectedCharacter)) {
        issues.push({
          table: "users",
          id: user._id,
          field: "selectedCharacter",
          value: user.selectedCharacter,
        });
      }
    }

    // Check conversations table
    const conversations = await ctx.db.query("conversations").collect();
    for (const conversation of conversations) {
      if (invalidCharacters.includes(conversation.character)) {
        issues.push({
          table: "conversations",
          id: conversation._id,
          field: "character",
          value: conversation.character,
        });
      }
    }

    // Check quizQuestions table
    const quizQuestions = await ctx.db.query("quizQuestions").collect();
    for (const quiz of quizQuestions) {
      if (invalidCharacters.includes(quiz.character)) {
        issues.push({
          table: "quizQuestions",
          id: quiz._id,
          field: "character",
          value: quiz.character,
        });
      }
    }

    return issues;
  },
});