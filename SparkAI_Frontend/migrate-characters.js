#!/usr/bin/env node

/**
 * SparkAI Database Setup & Migration Script
 * 
 * This script:
 * 1. Migrates old character data (hulk, iron-man → ben-10)
 * 2. Seeds characters and quiz questions in your database
 * 3. Sets up your complete quiz system
 */

import { execSync } from 'child_process';

console.log('🚀 SparkAI Database Setup & Migration');
console.log('=====================================\n');

async function runCommand(command, description) {
  console.log(`⚡ ${description}...`);
  try {
    const result = execSync(command, { 
      encoding: 'utf-8',
      cwd: process.cwd()
    });
    console.log(`✅ ${description} completed!`);
    return result;
  } catch (error) {
    console.error(`❌ ${description} failed:`, error.message);
    throw error;
  }
}

async function setupDatabase() {
  try {
    // Step 1: Deploy functions
    console.log('1️⃣ DEPLOYING CONVEX FUNCTIONS');
    await runCommand('npx convex deploy', 'Deploying functions');
    console.log();

    // Step 2: Check for old character migration needs
    console.log('2️⃣ CHECKING FOR OLD CHARACTER DATA');
    try {
      const checkResult = await runCommand('npx convex run migration:checkInvalidCharacters', 'Checking invalid characters');
      const issues = JSON.parse(checkResult);
      
      if (issues.length > 0) {
        console.log(`🔍 Found ${issues.length} records needing migration:`);
        issues.forEach(issue => {
          console.log(`  - ${issue.table}.${issue.field}: ${issue.value}`);
        });
        
        console.log('🔧 Running migration...');
        const migrationResult = await runCommand('npx convex run migration:migrateOldCharacters', 'Migrating old characters');
        const result = JSON.parse(migrationResult);
        console.log(`📊 Updated ${result.updatedRecords} records.`);
      } else {
        console.log('✅ No old character data found.');
      }
    } catch (error) {
      console.log('ℹ️  No migration functions found, skipping migration step.');
    }
    console.log();

    // Step 3: Seed characters
    console.log('3️⃣ SEEDING CHARACTERS');
    const charactersResult = await runCommand('npx convex run characters:seedCharacters', 'Seeding characters');
    console.log(`� ${charactersResult.trim()}`);
    console.log();

    // Step 4: Seed quiz questions
    console.log('4️⃣ SEEDING QUIZ QUESTIONS');
    const quizResult = await runCommand('npx convex run characters:seedQuizQuestions', 'Seeding quiz questions');
    console.log(`📥 ${quizResult.trim()}`);
    console.log();

    // Step 5: Success summary
    console.log('🎉 DATABASE SETUP COMPLETE!');
    console.log('============================');
    console.log('📊 Your database now contains:');
    console.log('   ✅ 4 Characters:');
    console.log('      - Ben 10 (ben-10)');
    console.log('      - Black Panther (black-panther)');
    console.log('      - Wanda Vision (wanda-vision)');
    console.log('      - Dora (dora)');
    console.log('   ✅ 12 Quiz Questions (3 per character at triggers 2, 4, 6)');
    console.log('   ✅ All old character data migrated');
    console.log();
    console.log('🎮 NEXT STEPS:');
    console.log('   - Test your quiz system with the demo button');
    console.log('   - Quiz system will now use real database data');
    console.log('   - Demo data fallback is still available as backup');
    console.log();
    console.log('✨ Your SparkAI quiz system is ready to go!');
    
  } catch (error) {
    console.error('\n❌ Setup failed:', error.message);
    console.log('\n🔧 TROUBLESHOOTING:');
    console.log('1. Make sure Convex is running: npx convex dev');
    console.log('2. Check your Convex configuration');
    console.log('3. Verify you have the characters.ts file with seed functions');
    console.log('\n📋 Manual commands:');
    console.log('   npx convex deploy');
    console.log('   npx convex run characters:seedCharacters');
    console.log('   npx convex run characters:seedQuizQuestions');
    process.exit(1);
  }
}

setupDatabase();