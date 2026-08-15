import mongoose from 'mongoose';

const QuestionScoreSchema = new mongoose.Schema({
  // Link to the conversation session
  sessionId: {
    type: String,
    required: true,
    index: true
  },
  
  // User information
  clerkUserId: {
    type: String,
    required: true,
    index: true
  },
  
  // Question details
  questionId: {
    type: String,
    required: true
  },
  
  questionNumber: {
    type: Number,
    required: true
  },
  
  questionText: {
    type: String,
    required: true
  },
  
  // User's response
  userResponse: {
    type: String,
    required: true
  },
  
  // Audio metadata if applicable
  audioKey: {
    type: String
  },
  
  audioDuration: {
    type: Number
  },
  
  // AI-generated scores for this specific question
  scores: {
    tone: {
      type: Number,
      min: 0,
      max: 100,
      required: true
    },
    clarity: {
      type: Number,
      min: 0,
      max: 100,
      required: true
    },
    empathy: {
      type: Number,
      min: 0,
      max: 100,
      required: true
    },
    engagement: {
      type: Number,
      min: 0,
      max: 100,
      required: true
    }
  },
  
  // Calculated average for this question
  averageScore: {
    type: Number,
    min: 0,
    max: 100
  },
  
  // Character information
  character: {
    type: String,
    required: true
  },
  
  // Timestamps
  responseTime: {
    type: Number, // Time taken to respond in seconds
    required: true
  },
  
  createdAt: {
    type: Date,
    default: Date.now
  },
  
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Compound index for efficient querying
QuestionScoreSchema.index({ sessionId: 1, questionNumber: 1 });
QuestionScoreSchema.index({ clerkUserId: 1, createdAt: -1 });

// Pre-save middleware to calculate average score
QuestionScoreSchema.pre('save', function(next) {
  if (this.scores) {
    const { tone, clarity, empathy, engagement } = this.scores;
    this.averageScore = Math.round((tone + clarity + empathy + engagement) / 4);
  }
  this.updatedAt = new Date();
  next();
});

export default mongoose.model('QuestionScore', QuestionScoreSchema);