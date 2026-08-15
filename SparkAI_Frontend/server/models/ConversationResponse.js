import mongoose from 'mongoose';

const conversationResponseSchema = new mongoose.Schema({
  conversationId: {
    type: String,
    required: true,
    index: true
  },
  questionId: {
    type: Number,
    required: true,
    min: 1
  },
  response: {
    type: String,
    required: true
  },
  responseTime: {
    type: Number,
    default: 0,
    min: 0
  },
  inputType: {
    type: String,
    enum: ['text', 'audio'],
    default: 'audio'
  },
  audioDuration: {
    type: Number,
    default: 0,
    min: 0
  },
  audioKey: {
    type: String,
    default: null
  },
  submittedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Compound index for efficient querying
conversationResponseSchema.index({ conversationId: 1, questionId: 1 });
conversationResponseSchema.index({ conversationId: 1, submittedAt: -1 });

// Create model
const ConversationResponse = mongoose.model('ConversationResponse', conversationResponseSchema);

export { ConversationResponse };