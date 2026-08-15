import express from 'express';
import QuizQuestion from '../models/QuizQuestion.js';

const router = express.Router();

// Get quiz question by question number for specific character
router.get('/quiz-by-number/:character/:questionNumber', async (req, res) => {
  try {
    const { character, questionNumber } = req.params;
    
    // Validate character
    const validCharacters = ['ben-10', 'black-panther', 'wanda-vision', 'dora'];
    if (!validCharacters.includes(character)) {
      return res.status(400).json({
        success: false,
        message: `Invalid character. Must be one of: ${validCharacters.join(', ')}`
      });
    }
    
    const qNumber = parseInt(questionNumber);
    if (isNaN(qNumber) || qNumber < 1) {
      return res.status(400).json({
        success: false,
        message: 'questionNumber must be a positive number'
      });
    }
    
    const quizQuestion = await QuizQuestion.findOne({
      character,
      questionNumber: qNumber
    });
    
    if (!quizQuestion) {
      return res.status(404).json({
        success: false,
        message: `No quiz question found for character ${character} at question number ${qNumber}`
      });
    }
    
    res.json({
      success: true,
      data: quizQuestion
    });
    
  } catch (error) {
    console.error('❌ Error fetching quiz question by number:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch quiz question',
      error: error.message
    });
  }
});

// Get quiz question for specific character and trigger point (legacy endpoint)
router.get('/quiz-question/:character/:triggerAfterQuestion', async (req, res) => {
  try {
    const { character, triggerAfterQuestion } = req.params;
    
    // Validate character
    const validCharacters = ['ben-10', 'black-panther', 'wanda-vision', 'dora'];
    if (!validCharacters.includes(character)) {
      return res.status(400).json({
        success: false,
        message: `Invalid character. Must be one of: ${validCharacters.join(', ')}`
      });
    }
    
    const triggerNumber = parseInt(triggerAfterQuestion);
    if (isNaN(triggerNumber) || triggerNumber < 1) {
      return res.status(400).json({
        success: false,
        message: 'triggerAfterQuestion must be a positive number'
      });
    }
    
    const quizQuestion = await QuizQuestion.findOne({
      character,
      triggerAfterQuestion: triggerNumber
    });
    
    if (!quizQuestion) {
      return res.status(404).json({
        success: false,
        message: `No quiz question found for character ${character} at trigger point ${triggerNumber}`
      });
    }
    
    res.json({
      success: true,
      data: quizQuestion
    });
    
  } catch (error) {
    console.error('❌ Error fetching quiz question:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch quiz question',
      error: error.message
    });
  }
});

// Get all quiz questions for a character
router.get('/character-quizzes/:character', async (req, res) => {
  try {
    const { character } = req.params;
    
    const validCharacters = ['ben-10', 'black-panther', 'wanda-vision', 'dora'];
    if (!validCharacters.includes(character)) {
      return res.status(400).json({
        success: false,
        message: `Invalid character. Must be one of: ${validCharacters.join(', ')}`
      });
    }
    
    const quizQuestions = await QuizQuestion.find({ character })
      .sort({ triggerAfterQuestion: 1 });
    
    res.json({
      success: true,
      data: quizQuestions
    });
    
  } catch (error) {
    console.error('❌ Error fetching character quizzes:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch character quizzes',
      error: error.message
    });
  }
});

// Get all quiz questions
router.get('/all-quizzes', async (req, res) => {
  try {
    const quizQuestions = await QuizQuestion.find()
      .sort({ character: 1, triggerAfterQuestion: 1 });
    
    res.json({
      success: true,
      data: quizQuestions
    });
    
  } catch (error) {
    console.error('❌ Error fetching all quizzes:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch quiz questions',
      error: error.message
    });
  }
});

// Seed quiz questions (admin endpoint)
router.post('/seed', async (req, res) => {
  try {
    console.log('🌱 Starting quiz questions seeding...');
    const result = await QuizQuestion.seedQuizQuestions();
    
    res.json({
      success: true,
      message: 'Quiz questions seeded successfully',
      data: {
        count: result.length,
        questions: result
      }
    });
    
  } catch (error) {
    console.error('❌ Error seeding quiz questions:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to seed quiz questions',
      error: error.message
    });
  }
});

export default router;