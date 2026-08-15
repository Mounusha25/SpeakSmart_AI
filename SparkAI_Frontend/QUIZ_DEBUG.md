# Quiz Issue Debugging Guide

## Issue: "Quiz should show but no quiz data available"

### Symptoms
- Quiz modal tries to open but shows no content
- Error in console: "Quiz should show but no quiz data available"
- QuizModal component receives null/undefined quizData

### Debugging Steps Applied

#### 1. Added Debug Logging
```jsx
// In ConversationInterface.jsx
console.log('ConversationInterface initialized with character:', character);

console.log('Quiz effect:', { 
  showQuiz, 
  getQuizQuestion, 
  currentQuestionIndex, 
  character,
  triggerPoint: currentQuestionIndex + 1 
});
```

#### 2. Enhanced Error Handling
- **ConversationInterface:** Added check for null quizQuestion before rendering QuizModal
- **QuizModal:** Added loading state for when quiz data is not yet available
- **ConversationInterface:** Auto-close quiz if no data found instead of showing error

#### 3. Verified Database Seeds
- Characters: ✅ Already seeded
- Quiz Questions: ✅ Already seeded
- Schema: ✅ No validation errors

#### 4. Common Causes to Check

1. **Character Name Mismatch**
   - Ensure character prop matches database values exactly
   - Valid characters: "ben-10", "black-panther", "wanda-vision", "dora"

2. **Trigger Point Mismatch**
   - Quiz triggers after questions: 2, 4, 6
   - Database expects: `triggerAfterQuestion: 2, 4, 6`

3. **Query Timing**
   - Convex queries may return `undefined` initially
   - Added loading states to handle async data

#### 5. Quick Test Commands
```bash
# Check if quiz questions exist
npx convex run characters:getQuizQuestion '{"character": "ben-10", "triggerAfterQuestion": 2}'

# Verify schema sync
npx convex dev --once
```

### Expected Console Output
When working correctly, you should see:
```
ConversationInterface initialized with character: ben-10
Quiz trigger check: { currentQuestionIndex: 1, questionNumber: 2, shouldShowQuiz: true, character: "ben-10" }
Triggering quiz after question 2
Quiz effect: { showQuiz: true, getQuizQuestion: {data...}, character: "ben-10", triggerPoint: 2 }
Setting quiz question data: {question data object}
```

### Resolution
The fixes include:
- Better null checking before rendering QuizModal
- Loading states for async quiz data
- Enhanced debug logging for troubleshooting
- Graceful fallback when quiz data isn't available