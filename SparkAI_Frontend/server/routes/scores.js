import express from 'express';
import QuestionScore from '../models/QuestionScore.js';
import SessionSummary from '../models/SessionSummary.js';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Submit a question score
router.post('/submit-score', async (req, res) => {
  try {
    const {
      sessionId,
      clerkUserId,
      questionId,
      questionNumber,
      questionText,
      userResponse,
      audioKey,
      audioDuration,
      scores, // { tone: 80, clarity: 90, empathy: 40, engagement: 50 }
      character,
      responseTime
    } = req.body;

    // Validate required fields
    if (!sessionId || !clerkUserId || !questionId || !questionNumber || 
        !questionText || !userResponse || !scores || !character || !responseTime) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        required: ['sessionId', 'clerkUserId', 'questionId', 'questionNumber', 
                  'questionText', 'userResponse', 'scores', 'character', 'responseTime']
      });
    }

    // Validate scores
    const requiredScoreFields = ['tone', 'clarity', 'empathy', 'engagement'];
    for (const field of requiredScoreFields) {
      if (typeof scores[field] !== 'number' || scores[field] < 0 || scores[field] > 100) {
        return res.status(400).json({ 
          error: `Invalid ${field} score. Must be a number between 0 and 100` 
        });
      }
    }

    // Create question score entry
    const questionScore = new QuestionScore({
      sessionId,
      clerkUserId,
      questionId,
      questionNumber,
      questionText,
      userResponse,
      audioKey,
      audioDuration,
      scores,
      character,
      responseTime
    });

    await questionScore.save();

    // Update or create session summary
    await updateSessionSummary(sessionId, clerkUserId, character);

    res.status(201).json({
      success: true,
      data: questionScore,
      message: 'Question score submitted successfully'
    });

  } catch (error) {
    console.error('Error submitting question score:', error);
    res.status(500).json({ 
      error: 'Failed to submit question score',
      details: error.message 
    });
  }
});

// Get session summary with all question scores
router.get('/session/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { clerkUserId } = req.query;

    if (!clerkUserId) {
      return res.status(400).json({ error: 'clerkUserId is required' });
    }

    // Get session summary
    const sessionSummary = await SessionSummary.findOne({ 
      sessionId, 
      clerkUserId 
    });

    if (!sessionSummary) {
      return res.status(404).json({ error: 'Session not found' });
    }

    // Get all question scores for this session
    const questionScores = await QuestionScore.find({ 
      sessionId, 
      clerkUserId 
    }).sort({ questionNumber: 1 });

    res.json({
      success: true,
      data: {
        session: sessionSummary,
        questionScores
      }
    });

  } catch (error) {
    console.error('Error fetching session data:', error);
    res.status(500).json({ 
      error: 'Failed to fetch session data',
      details: error.message 
    });
  }
});

// Get user's recent sessions
router.get('/user-sessions/:clerkUserId', async (req, res) => {
  try {
    const { clerkUserId } = req.params;
    const { limit = 10, offset = 0 } = req.query;

    const sessions = await SessionSummary.find({ clerkUserId })
      .sort({ completedAt: -1, createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(offset));

    const totalSessions = await SessionSummary.countDocuments({ clerkUserId });

    res.json({
      success: true,
      data: {
        sessions,
        totalSessions,
        hasMore: totalSessions > (parseInt(offset) + sessions.length)
      }
    });

  } catch (error) {
    console.error('Error fetching user sessions:', error);
    res.status(500).json({ 
      error: 'Failed to fetch user sessions',
      details: error.message 
    });
  }
});

// Start a new session
router.post('/start-session', async (req, res) => {
  try {
    const { clerkUserId, character, totalQuestions } = req.body;

    if (!clerkUserId || !character || !totalQuestions) {
      return res.status(400).json({ 
        error: 'Missing required fields: clerkUserId, character, totalQuestions' 
      });
    }

    const sessionId = uuidv4();

    const sessionSummary = new SessionSummary({
      sessionId,
      clerkUserId,
      character,
      totalQuestions,
      questionsCompleted: 0,
      sessionAverages: {
        tone: 0,
        clarity: 0,
        empathy: 0,
        engagement: 0,
        overall: 0
      },
      totalDuration: 0,
      averageResponseTime: 0,
      status: 'in-progress',
      startedAt: new Date()
    });

    await sessionSummary.save();

    res.status(201).json({
      success: true,
      data: { sessionId, session: sessionSummary },
      message: 'Session started successfully'
    });

  } catch (error) {
    console.error('Error starting session:', error);
    res.status(500).json({ 
      error: 'Failed to start session',
      details: error.message 
    });
  }
});

// Complete a session
router.post('/complete-session', async (req, res) => {
  try {
    const { sessionId, clerkUserId, totalDuration } = req.body;

    if (!sessionId || !clerkUserId) {
      return res.status(400).json({ 
        error: 'Missing required fields: sessionId, clerkUserId' 
      });
    }

    const session = await SessionSummary.findOneAndUpdate(
      { sessionId, clerkUserId },
      { 
        status: 'completed',
        completedAt: new Date(),
        ...(totalDuration && { totalDuration })
      },
      { new: true }
    );

    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    // Recalculate final averages
    await updateSessionSummary(sessionId, clerkUserId, session.character);

    res.json({
      success: true,
      data: session,
      message: 'Session completed successfully'
    });

  } catch (error) {
    console.error('Error completing session:', error);
    res.status(500).json({ 
      error: 'Failed to complete session',
      details: error.message 
    });
  }
});

// Helper function to update session summary with latest averages
async function updateSessionSummary(sessionId, clerkUserId, character) {
  try {
    // Get all question scores for this session
    const questionScores = await QuestionScore.find({ sessionId, clerkUserId });
    
    if (questionScores.length === 0) {
      return;
    }

    // Calculate averages
    const totals = questionScores.reduce((acc, score) => {
      acc.tone += score.scores.tone;
      acc.clarity += score.scores.clarity;
      acc.empathy += score.scores.empathy;
      acc.engagement += score.scores.engagement;
      acc.responseTime += score.responseTime;
      return acc;
    }, { tone: 0, clarity: 0, empathy: 0, engagement: 0, responseTime: 0 });

    const count = questionScores.length;
    const sessionAverages = {
      tone: Math.round(totals.tone / count),
      clarity: Math.round(totals.clarity / count),
      empathy: Math.round(totals.empathy / count),
      engagement: Math.round(totals.engagement / count),
      overall: Math.round((totals.tone + totals.clarity + totals.empathy + totals.engagement) / (count * 4))
    };

    const averageResponseTime = Math.round(totals.responseTime / count);

    // Update session summary
    await SessionSummary.findOneAndUpdate(
      { sessionId, clerkUserId },
      {
        questionsCompleted: count,
        sessionAverages,
        averageResponseTime,
        updatedAt: new Date()
      },
      { upsert: true, new: true }
    );

  } catch (error) {
    console.error('Error updating session summary:', error);
  }
}

export default router;