import mongoose from "mongoose";

const quizSessionSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.Mixed, // Allow both ObjectId and String for anonymous users
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
    type: Number, // in seconds
    required: true,
    default: 600, // 10 minutes
  },
  userAnswers: {
    type: [String],
    default: Array(10).fill(null),
  },
  questions: {
    type: [String],
    required: true,
  },
  options: {
    type: [[String]],
    required: true,
  },
  correctAnswers: {
    type: [String],
    required: true,
  },
  explanations: {
    type: [String],
    required: true,
  },
  currentQuestion: {
    type: Number,
    default: 0,
  },
  isCompleted: {
    type: Boolean,
    default: false,
  },
  score: {
    type: Number,
    default: 0,
  },
  timeTaken: {
    type: String,
    default: "",
  },
  lastSaved: {
    type: Date,
    default: Date.now,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt field before saving
quizSessionSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.model("quizSession", quizSessionSchema);
