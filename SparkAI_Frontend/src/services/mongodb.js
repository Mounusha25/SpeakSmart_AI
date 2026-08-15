/**
 * Hardcoded MongoDB-Style Session Data Service
 * Returns hardcoded conversation data in MongoDB format
 */

// Hardcoded session data matching MongoDB schema
const HARDCODED_SESSION_DATA = {
  "_id": "691514c50229a89907ef70bf",
  "session_id": "efc32e9b-d567-4dc6-9f48-34af40008a0e",
  "count": 12,
  "history": [
    {
      "question": "Hi User! How have you been? How can I help you today?"
    },
    {
      "question": "How do you usually feel about attending social events like an office Christmas party?"
    },
    {
      "question": "What part of the office Christmas party are you most looking forward to?"
    },
    {
      "question": "Are there any aspects of the party that make you feel nervous or uncertain?"
    },
    {
      "question": "How do you typically approach conversations with colleagues you don't know well?"
    },
    {
      "question": "What would make you feel more confident during networking conversations at the party?"
    },
    {
      "question": "How do you usually handle awkward silences in conversations?"
    },
    {
      "question": "What topics do you feel most comfortable discussing at work events?"
    },
    {
      "question": "How do you prefer to end conversations gracefully when you want to move on?"
    },
    {
      "question": "What strategies help you remember people's names and details about them?"
    },
    {
      "question": "How do you balance being social while also taking breaks when you need them?"
    },
    {
      "question": "What would you like to improve about your social interactions at future events?"
    }
  ],
  "takeaways": [
    {
      "quick_tip": "Start your reply with a friendly tone to set a positive atmosphere for the conversation.",
      "feedback": "You introduced the topic naturally and confidently, which helps the AI understand your goal right away.",
      "context": "Hi, I've been good! I wanted to talk about the office Christmas party coming up."
    },
    {
      "quick_tip": "Try pausing slightly before sharing your feelings to show thoughtfulness.",
      "feedback": "You expressed your feelings clearly and honestly, showing awareness of how social events affect you.",
      "context": "I usually feel a bit nervous about attending big office events, but I'm also excited to connect with my colleagues."
    },
    {
      "quick_tip": "Focus on specific details when describing what excites you.",
      "feedback": "You demonstrated genuine enthusiasm while being specific about what appeals to you most.",
      "context": "I'm really looking forward to the informal conversations and maybe learning more about my teammates' interests outside of work."
    },
    {
      "quick_tip": "Acknowledge concerns honestly while showing willingness to work through them.",
      "feedback": "You showed emotional intelligence by recognizing your challenges without letting them overwhelm you.",
      "context": "I do worry about running out of things to say or accidentally saying something awkward, but I know everyone's pretty understanding."
    },
    {
      "quick_tip": "Describe your current approach as a foundation for improvement.",
      "feedback": "You demonstrated self-awareness about your communication style and showed openness to growth.",
      "context": "I usually start with work-related topics since that's common ground, then try to find personal interests we might share."
    },
    {
      "quick_tip": "Connect confidence-building strategies to specific situations.",
      "feedback": "You identified practical approaches that show you're thinking strategically about improvement.",
      "context": "Having a few prepared questions ready and remembering that most people enjoy talking about their interests would really help."
    },
    {
      "quick_tip": "Share your current techniques before asking for new strategies.",
      "feedback": "You showed resourcefulness by explaining how you currently manage challenging moments in conversations.",
      "context": "I try to ask follow-up questions about what the person just said, or sometimes I'll make a comment about the environment around us."
    },
    {
      "quick_tip": "Identify your comfort zones to build from your strengths.",
      "feedback": "You recognized your natural conversation strengths, which is important for building confidence.",
      "context": "I feel most comfortable talking about projects we're working on, travel experiences, and hobbies like cooking or books."
    },
    {
      "quick_tip": "Practice polite transition phrases to end conversations smoothly.",
      "feedback": "You showed consideration for others while prioritizing your own needs in social situations.",
      "context": "I usually say something like 'It's been great talking with you' and mention wanting to catch up with other people or grab some refreshments."
    },
    {
      "quick_tip": "Use memory techniques immediately after meeting someone new.",
      "feedback": "You demonstrated commitment to building meaningful connections through active listening and follow-up.",
      "context": "I try to repeat their name during the conversation and make a mental note connecting their name to something distinctive about them or our conversation."
    },
    {
      "quick_tip": "Plan your social energy management strategy in advance.",
      "feedback": "You showed wisdom in recognizing your limits while still engaging meaningfully with others.",
      "context": "I've learned to step outside for a few minutes of quiet time, or find a less crowded spot to recharge without completely disappearing."
    },
    {
      "quick_tip": "Set specific, achievable goals for future improvement.",
      "feedback": "You closed the conversation gracefully, showing gratitude and readiness to continue learning later.",
      "context": "I'd like to get better at asking more engaging follow-up questions and feeling more natural when introducing myself to new people."
    }
  ],
  "last_quiz": {
    "question": "When discussing your interest in data exploration at a networking event, what's the best approach?",
    "options": [
      "Immediately dive into technical details about your latest project",
      "Ask about their work first, then share your passion when relevant", 
      "Keep it vague to avoid boring them with details",
      "Only mention it if they bring up work topics first"
    ],
    "correct_answer_index": 1,
    "explanation": "Starting with genuine interest in others creates connection, then sharing your passion when relevant keeps the conversation balanced and engaging.",
    "takeaway_reference": "From your practice on Message 1, you learned that introducing topics naturally works best."
  },
  "created_at": "2025-11-12T09:23:09.216Z",
  "updated_at": "2025-11-12T09:31:19.453Z"
};

/**
 * Fetch hardcoded session data (no API call)
 * @param {string} sessionId - The session ID (ignored, returns hardcoded data)
 * @returns {Promise<Object>} Hardcoded session data
 */
export const fetchConversationSession = async (sessionId) => {
  console.log('🔍 Returning hardcoded session data for:', sessionId);
  
  // Simulate API delay for realistic behavior
  await new Promise(resolve => setTimeout(resolve, 100));
  
  console.log('✅ Hardcoded session data loaded:', {
    sessionId: HARDCODED_SESSION_DATA.session_id,
    questionCount: HARDCODED_SESSION_DATA.count,
    hasHistory: !!HARDCODED_SESSION_DATA.history?.length,
    hasTakeaways: !!HARDCODED_SESSION_DATA.takeaways?.length
  });
  
  return { success: true, data: HARDCODED_SESSION_DATA };
};

/**
 * Fetch hardcoded session data for user+character combination (no API call)
 * @param {string} clerkUserId - The Clerk user ID (ignored, returns hardcoded data)
 * @param {string} character - The character name (ignored, returns hardcoded data)
 * @returns {Promise<Object>} Hardcoded session data
 */
export const fetchSessionByUser = async (clerkUserId, character) => {
  console.log('🔍 Returning hardcoded session for user+character:', { clerkUserId, character });
  
  // Simulate API delay for realistic behavior
  await new Promise(resolve => setTimeout(resolve, 150));
  
  console.log('✅ Hardcoded user session data loaded:', {
    sessionId: HARDCODED_SESSION_DATA.session_id,
    questionCount: HARDCODED_SESSION_DATA.count,
    hasHistory: !!HARDCODED_SESSION_DATA.history?.length,
    hasTakeaways: !!HARDCODED_SESSION_DATA.takeaways?.length
  });
  
  return { success: true, data: HARDCODED_SESSION_DATA };
};

/**
 * Create hardcoded session (no API call)
 * @param {string} clerkUserId - The Clerk user ID (ignored, returns hardcoded data)
 * @param {string} character - The character name (ignored, returns hardcoded data)
 * @param {string} topic - The conversation topic (ignored, returns hardcoded data)
 * @returns {Promise<Object>} Hardcoded session data
 */
export const createConversationSession = async (clerkUserId, character, topic = 'General') => {
  console.log('🆕 Returning hardcoded session for:', { clerkUserId, character, topic });
  
  // Simulate API delay for realistic behavior
  await new Promise(resolve => setTimeout(resolve, 200));
  
  console.log('✅ Hardcoded session created:', HARDCODED_SESSION_DATA.session_id);
  return { success: true, data: HARDCODED_SESSION_DATA };
};

/**
 * Get formatted question text with feedback prefix for questions 2+
 * @param {Object} sessionData - The complete session data from MongoDB
 * @param {number} questionIndex - The current question index (0-based)
 * @returns {string} Complete message text to speak
 */
export const getFormattedQuestionText = (sessionData, questionIndex) => {
  if (!sessionData?.history || questionIndex >= sessionData.history.length) {
    console.error('❌ Invalid question index or missing history data');
    return '';
  }

  // Question 1 (index 0): Just the greeting question as-is
  if (questionIndex === 0) {
    const questionText = sessionData.history[0].question;
    console.log('📢 Question 1 (greeting):', questionText.substring(0, 100) + '...');
    return questionText;
  }

  // Questions 2+ (index 1+): Include feedback from previous question
  const previousFeedbackIndex = questionIndex - 1;
  const currentQuestion = sessionData.history[questionIndex].question;
  
  if (sessionData.takeaways && sessionData.takeaways[previousFeedbackIndex]) {
    const previousFeedback = sessionData.takeaways[previousFeedbackIndex].feedback;
    
    // Create natural transition phrases
    const transitionPhrases = [
      'Now, let me ask you:',
      'Here\'s my next question:',
      'Let\'s move on to:',
      'I\'d like to know:',
      'Moving forward:'
    ];
    
    const randomTransition = transitionPhrases[Math.floor(Math.random() * transitionPhrases.length)];
    const completeMessage = `${previousFeedback} ${randomTransition} ${currentQuestion}`;
    
    console.log('📢 Question', questionIndex + 1, 'with feedback:', {
      feedbackLength: previousFeedback.length,
      questionLength: currentQuestion.length,
      totalLength: completeMessage.length
    });
    
    return completeMessage;
  } else {
    // Fallback if no feedback available
    console.warn('⚠️ No feedback available for question', questionIndex + 1, ', using question only');
    return currentQuestion;
  }
};

/**
 * Get final completion message with feedback from last question
 * @param {Object} sessionData - The complete session data from MongoDB
 * @returns {string} Final completion message
 */
export const getFinalCompletionMessage = (sessionData) => {
  if (!sessionData?.takeaways || sessionData.takeaways.length === 0) {
    return "That completes our conversation for today. Thank you for practicing with me! I hope this session was helpful for you.";
  }

  const lastFeedbackIndex = sessionData.takeaways.length - 1;
  const lastFeedback = sessionData.takeaways[lastFeedbackIndex].feedback;
  
  const finalMessage = `${lastFeedback} That completes our conversation for today. Thank you for practicing with me! I hope this session was helpful for you.`;
  
  console.log('📢 Final completion message with feedback:', {
    feedbackLength: lastFeedback.length,
    totalLength: finalMessage.length
  });
  
  return finalMessage;
};

/**
 * Validate session data structure
 * @param {Object} sessionData - Session data to validate
 * @returns {Object} Validation result with details
 */
export const validateSessionData = (sessionData) => {
  const validation = {
    isValid: true,
    errors: [],
    warnings: []
  };

  if (!sessionData) {
    validation.isValid = false;
    validation.errors.push('Session data is null or undefined');
    return validation;
  }

  // Check required fields
  if (!sessionData.session_id) {
    validation.errors.push('Missing session_id');
  }

  if (!sessionData.history || !Array.isArray(sessionData.history)) {
    validation.errors.push('Missing or invalid history array');
  } else if (sessionData.history.length === 0) {
    validation.errors.push('History array is empty');
  }

  if (!sessionData.takeaways || !Array.isArray(sessionData.takeaways)) {
    validation.warnings.push('Missing or invalid takeaways array');
  } else if (sessionData.takeaways.length !== sessionData.history.length) {
    validation.warnings.push(`Takeaways count (${sessionData.takeaways.length}) doesn't match history count (${sessionData.history.length})`);
  }

  if (sessionData.count && sessionData.count !== sessionData.history.length) {
    validation.warnings.push(`Count field (${sessionData.count}) doesn't match actual history length (${sessionData.history.length})`);
  }

  if (validation.errors.length > 0) {
    validation.isValid = false;
  }

  console.log('🔍 Session validation result:', validation);
  return validation;
};