import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['user', 'assistant', 'mentor'],
    required: true
  },
  content: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  metadata: {
    mode: {
      type: String,
      enum: ['faq', 'study', 'mentor'],
      default: 'faq'
    },
    confidence: {
      type: Number,
      min: 0,
      max: 1,
      default: 1
    },
    escalated: {
      type: Boolean,
      default: false
    }
  }
});

const chatSessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  sessionId: {
    type: String,
    required: true,
    unique: true
  },
  mode: {
    type: String,
    enum: ['faq', 'study', 'mentor'],
    default: 'faq'
  },
  messages: [messageSchema],
  isActive: {
    type: Boolean,
    default: true
  },
  escalated: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastActivity: {
    type: Date,
    default: Date.now
  },
  context: {
    currentTopic: String,
    difficulty: String,
    subject: String,
    previousQuestions: [String]
  }
});

// Index for efficient queries
chatSessionSchema.index({ userId: 1, isActive: 1 });
chatSessionSchema.index({ sessionId: 1 });
chatSessionSchema.index({ lastActivity: 1 });

// Update lastActivity on save
chatSessionSchema.pre('save', function(next) {
  this.lastActivity = new Date();
  next();
});

export default mongoose.model("ChatSession", chatSessionSchema);
