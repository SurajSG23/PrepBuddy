import mongoose from "mongoose";

const quizSessionSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  topic: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  difficulty: {
    type: String,
    required: true,
  },
  startTime: {
    type: Date,
    required: true,
  },
  endTime: {
    type: Date,
    required: true,
  },
  duration: {
    type: Number,
    required: true, // in seconds
  },
  questions: [{
    type: String,
    required: true,
  }],
  options: [[{
    type: String,
    required: true,
  }]],
  correctAnswers: [{
    type: String,
    required: true,
  }],
  explanations: [{
    type: String,
  }],
  userAnswers: [{
    type: String,
    default: null,
  }],
  currentQuestion: {
    type: Number,
    default: 0,
  },
  score: {
    type: Number,
    default: 0,
  },
  timeTaken: {
    type: String,
  },
  isCompleted: {
    type: Boolean,
    default: false,
  },
  lastSaved: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

export default mongoose.model("quizSession", quizSessionSchema);
