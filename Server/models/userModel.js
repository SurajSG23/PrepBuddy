import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  password:{
    type: String,
    required: false
  },
  authProvider: {
    type: String,
    enum: ['local', 'google'],
    default: 'local'
  },
  profilepic: {
    type: String,
    required: false,
    default: "/default-profile.jpg"
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
  streakBadges: {
    firstStreak: { type: Boolean, default: false },
    weekWarrior: { type: Boolean, default: false },
    twoWeekChamp: { type: Boolean, default: false },
    monthMaster: { type: Boolean, default: false },
    streakLegend: { type: Boolean, default: false },
  },
  currentStreak: {
    type: Number,
    default: 0,
  },
  longestStreak: {
    type: Number,
    default: 0,
  },
});

userSchema.pre('save', async function(next) {
  const user = this;

  if (!user.isModified('password') || !user.password) return next();
  console.log(user.password);
  try {
    const passwordHashed = await bcrypt.hash(user.password, 10);
    user.password = passwordHashed;
    next();
  } catch (err) {
    return next(err);
  }
});

userSchema.methods.comparePassword = async function(password){
    try{
        return await bcrypt.compare(password, this.password);
    } catch(err){
        throw err;
    }

  }


export default mongoose.model("user", userSchema);;
