import mongoose from "mongoose";

const practiceLogSchema = new mongoose.Schema({
  userid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
    index: true,
  },
  // Normalized to midnight UTC to ensure one document per day per user
  date: {
    type: Date,
    required: true,
    default: () => {
      const d = new Date();
      d.setHours(0, 0, 0, 0);
      return d;
    },
  },
  testsAttempted: {
    type: Number,
    default: 0,
    min: 0,
  },
  totalScore: {
    type: Number,
    default: 0,
    min: 0,
  },
  averageScore: {
    type: Number,
    default: 0,
    min: 0,
  },
  bestScore: {
    type: Number,
    default: 0,
    min: 0,
  },
  testTypes: {
    type: [String],
    default: [],
  },
  streak: {
    type: Number,
    default: 0,
    min: 0,
  },
  practiceMinutes: {
    type: Number,
    default: 0,
    min: 0,
  },
});

// Ensure date is always normalized to midnight for uniqueness per day
practiceLogSchema.pre("save", function normalizeDate(next) {
  if (this.date) {
    const normalized = new Date(this.date);
    normalized.setHours(0, 0, 0, 0);
    this.date = normalized;
  }
  next();
});

// One log per user per day
practiceLogSchema.index({ userid: 1, date: 1 }, { unique: true });

// Static: Get or create today's log for a user
practiceLogSchema.statics.getTodaysLog = async function getTodaysLog(userid) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const existing = await this.findOne({ userid, date: { $gte: today } });
  if (existing) return existing;

  try {
    return await this.create({ userid, date: today });
  } catch (err) {
    // In case of race condition on unique index, fetch again
    const fallback = await this.findOne({ userid, date: { $gte: today } });
    if (fallback) return fallback;
    throw err;
  }
};

// Static: Calculate current streak (consecutive days ending today with testsAttempted > 0)
practiceLogSchema.statics.calculateStreak = async function calculateStreak(userid) {
  // Fetch last 120 days to compute a meaningful streak window
  const windowDays = 120;
  const start = new Date();
  start.setDate(start.getDate() - windowDays);
  start.setHours(0, 0, 0, 0);

  const logs = await this.find({ userid, date: { $gte: start } })
    .sort({ date: -1 })
    .lean();

  // Map dates to a set of YYYY-MM-DD for quick lookup of active days
  const activeDays = new Set(
    logs
      .filter((l) => (l.testsAttempted || 0) > 0)
      .map((l) => new Date(l.date).toISOString().split("T")[0])
  );

  let streak = 0;
  const cursor = new Date();
  cursor.setHours(0, 0, 0, 0);

  // If today is not active, streak is 0
  if (!activeDays.has(cursor.toISOString().split("T")[0])) {
    return 0;
  }

  // Count consecutive active days backwards starting today
  while (true) {
    const key = cursor.toISOString().split("T")[0];
    if (!activeDays.has(key)) break;
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
};

const practiceLogModel = mongoose.model("practiceLog", practiceLogSchema);
export default practiceLogModel;


