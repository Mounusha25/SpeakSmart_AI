import mongoose from 'mongoose';

const SessionSummarySchema = new mongoose.Schema({
  // Session identification
  sessionId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  
  // User information
  clerkUserId: {
    type: String,
    required: true,
    index: true
  },
  
  // Session metadata
  character: {
    type: String,
    required: true
  },
  
  totalQuestions: {
    type: Number,
    required: true
  },
  
  questionsCompleted: {
    type: Number,
    required: true
  },
  
  // Session averages
  sessionAverages: {
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
    },
    overall: {
      type: Number,
      min: 0,
      max: 100,
      required: true
    }
  },
  
  // Session metrics
  totalDuration: {
    type: Number, // Total session time in seconds
    required: true
  },
  
  averageResponseTime: {
    type: Number, // Average response time per question
    required: true
  },
  
  // Session status
  status: {
    type: String,
    enum: ['in-progress', 'completed', 'abandoned'],
    default: 'in-progress'
  },
  
  // Timestamps
  startedAt: {
    type: Date,
    required: true
  },
  
  completedAt: {
    type: Date
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

// Index for efficient querying
SessionSummarySchema.index({ clerkUserId: 1, completedAt: -1 });
SessionSummarySchema.index({ clerkUserId: 1, createdAt: -1 });

// Pre-save middleware
SessionSummarySchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.model('SessionSummary', SessionSummarySchema);