import express from 'express';
import { ConversationResponse } from '../models/ConversationResponse.js';

const router = express.Router();

// Submit a conversation response
router.post('/submit-response', async (req, res) => {
  try {
    const {
      conversationId,
      questionId,
      response,
      responseTime,
      inputType,
      audioDuration,
      audioKey
    } = req.body;

    // Validate required fields
    if (!conversationId || !questionId || !response) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: conversationId, questionId, and response are required'
      });
    }

    // Create new conversation response
    const conversationResponse = new ConversationResponse({
      conversationId,
      questionId,
      response,
      responseTime: responseTime || 0,
      inputType: inputType || 'audio',
      audioDuration: audioDuration || 0,
      audioKey: audioKey || null,
      submittedAt: new Date()
    });

    const savedResponse = await conversationResponse.save();

    console.log('✅ Conversation response saved:', {
      id: savedResponse._id,
      conversationId,
      questionId,
      inputType,
      audioDuration: `${audioDuration}s`
    });

    res.json({
      success: true,
      message: 'Response submitted successfully',
      data: savedResponse
    });

  } catch (error) {
    console.error('❌ Error submitting conversation response:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit response',
      error: error.message
    });
  }
});

// Get responses for a conversation
router.get('/responses/:conversationId', async (req, res) => {
  try {
    const { conversationId } = req.params;

    const responses = await ConversationResponse.find({ conversationId })
      .sort({ questionId: 1, submittedAt: 1 });

    res.json({
      success: true,
      data: responses,
      count: responses.length
    });

  } catch (error) {
    console.error('❌ Error fetching conversation responses:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch responses',
      error: error.message
    });
  }
});

// Get response by question ID
router.get('/response/:conversationId/:questionId', async (req, res) => {
  try {
    const { conversationId, questionId } = req.params;

    const response = await ConversationResponse.findOne({
      conversationId,
      questionId: parseInt(questionId)
    });

    if (!response) {
      return res.status(404).json({
        success: false,
        message: 'Response not found'
      });
    }

    res.json({
      success: true,
      data: response
    });

  } catch (error) {
    console.error('❌ Error fetching response:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch response',
      error: error.message
    });
  }
});

export default router;