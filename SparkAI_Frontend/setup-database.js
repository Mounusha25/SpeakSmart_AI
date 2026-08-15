#!/usr/bin/env node

/**
 * Database Setup Script for SparkAI Character Quiz System
 * 
 * This script helps you populate your Convex database with characters and quiz questions.
 * Run this script to set up your database with all the necessary data.
 */

console.log("🚀 SparkAI Database Setup Script");
console.log("=================================\n");

console.log("📋 Here's how to update your Convex database:\n");

console.log("1️⃣  DEPLOY YOUR CONVEX FUNCTIONS:");
console.log("   Run: npx convex deploy");
console.log("   This will deploy all your mutation and query functions.\n");

console.log("2️⃣  SEED CHARACTERS:");
console.log("   In your Convex dashboard (https://dashboard.convex.dev):");
console.log("   - Go to your project");
console.log("   - Navigate to 'Functions' tab");
console.log("   - Find 'characters:seedCharacters'");
console.log("   - Click 'Run' to execute the mutation");
console.log("   - This will create all 4 characters: Ben 10, Black Panther, Wanda Vision, Dora\n");

console.log("3️⃣  SEED QUIZ QUESTIONS:");
console.log("   In the same Functions tab:");
console.log("   - Find 'characters:seedQuizQuestions'");
console.log("   - Click 'Run' to execute the mutation");
console.log("   - This will create 12 quiz questions (3 per character)\n");

console.log("4️⃣  VERIFY DATA:");
console.log("   Check your data using these queries:");
console.log("   - 'characters:getCharacters' - Should show 4 characters");
console.log("   - Run query with character='ben-10' and triggerAfterQuestion=2 to test quiz questions\n");

console.log("🔧 ALTERNATIVE - COMMAND LINE METHOD:");
console.log("   You can also run these commands in your terminal:");
console.log("   npx convex run characters:seedCharacters");
console.log("   npx convex run characters:seedQuizQuestions\n");

console.log("✅ WHAT WILL BE CREATED:");
console.log("   Characters:");
console.log("   - Ben 10: Young hero with transformation powers");
console.log("   - Black Panther: Wise king of Wakanda");
console.log("   - Wanda Vision: Reality-altering Scarlet Witch");
console.log("   - Dora: Educational explorer");
console.log("");
console.log("   Quiz Questions:");
console.log("   - 3 questions per character (triggered at questions 2, 4, 6)");
console.log("   - Each with multiple choice options and explanations");
console.log("   - Themed around each character's personality\n");

console.log("🎮 TESTING:");
console.log("   After setup, test the demo quiz button in your app!");
console.log("   It should now use real database data instead of demo data.\n");

console.log("❓ TROUBLESHOOTING:");
console.log("   - If functions don't appear, run 'npx convex deploy' first");
console.log("   - If seeding says 'already seeded', your data is already there");
console.log("   - Check the Convex dashboard Data tab to see your tables\n");

console.log("🎯 Ready to set up your database? Follow the steps above!");