import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  profilepic: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  badges: {
    type: Number,
    default: 0,
  },
  points: {
    type: Number,
    default: 0,
  },
  testAttended: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  creditsUsed: {
    type: Number,
    default: 0,
  },
  maxCredits: {
    type: Number,
    default: 5,
  },
});

export default mongoose.model("user", userSchema);
