import express from "express";
import quizSessionModel from "../models/quizSessionModel.js";
import userModel from "../models/userModel.js";
import practiceLogModel from "../models/practiceLogModel.js";

const router = express.Router();

// Get server time and remaining duration for timer sync
router.get("/sync/:sessionId", async (req, res) => {
  try {
    const { sessionId } = req.params;
    const session = await quizSessionModel.findById(sessionId);
    
    if (!session) {
      return res.status(404).json({ message: "Quiz session not found" });
    }

    const now = new Date();
    const elapsedSeconds = Math.floor((now - session.startTime) / 1000);
    const remainingSeconds = Math.max(0, session.duration - elapsedSeconds);
    
    res.json({
      serverTime: now,
      remainingSeconds,
      isExpired: remainingSeconds <= 0,
      session: {
        currentQuestion: session.currentQuestion,
        userAnswers: session.userAnswers,
        isCompleted: session.isCompleted
      }
    });
  } catch (error) {
    console.error("Error syncing timer:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Create new quiz session
router.post("/create-session", async (req, res) => {
  try {
    const { userId, topic, title, difficulty, questions, options, correctAnswers, explanations } = req.body;
    
    // Handle anonymous users for aptitude quizzes
    const actualUserId = userId === "anonymous" ? req.user?._id || "anonymous" : userId;
    
    const startTime = new Date();
    const duration = 600; // 10 minutes in seconds
    const endTime = new Date(startTime.getTime() + duration * 1000);
    
    const session = await quizSessionModel.create({
      userId: actualUserId,
      topic,
      title,
      difficulty,
      startTime,
      endTime,
      duration,
      questions,
      options,
      correctAnswers,
      explanations,
      userAnswers: Array(questions.length).fill(null)
    });
    
    res.json({ sessionId: session._id, startTime, endTime, duration });
  } catch (error) {
    console.error("Error creating quiz session:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Save quiz progress
router.post("/save-progress/:sessionId", async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { userAnswers, currentQuestion } = req.body;
    
    const session = await quizSessionModel.findById(sessionId);
    if (!session) {
      return res.status(404).json({ message: "Quiz session not found" });
    }
    
    // Check if session has expired
    const now = new Date();
    const elapsedSeconds = Math.floor((now - session.startTime) / 1000);
    if (elapsedSeconds >= session.duration) {
      return res.status(400).json({ message: "Quiz session has expired" });
    }
    
    session.userAnswers = userAnswers;
    session.currentQuestion = currentQuestion;
    session.lastSaved = now;
    
    await session.save();
    
    res.json({ message: "Progress saved successfully" });
  } catch (error) {
    console.error("Error saving progress:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Submit quiz with server-side validation
router.post("/submit/:sessionId", async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { userAnswers } = req.body;
    
    const session = await quizSessionModel.findById(sessionId);
    if (!session) {
      return res.status(404).json({ message: "Quiz session not found" });
    }
    
    // Server-side time validation
    const now = new Date();
    const elapsedSeconds = Math.floor((now - session.startTime) / 1000);
    
    if (elapsedSeconds > session.duration + 30) { // Allow 30 seconds grace period
      return res.status(400).json({ 
        message: "Quiz submission rejected: Time limit exceeded",
        elapsedSeconds,
        allowedDuration: session.duration
      });
    }
    
    // Calculate score
    const score = userAnswers.reduce((total, answer, index) => {
      return answer?.trim() === session.correctAnswers[index].trim() ? total + 1 : total;
    }, 0);
    
    // Calculate time taken
    const minutes = Math.floor(elapsedSeconds / 60);
    const seconds = elapsedSeconds % 60;
    const timeTaken = `${minutes}m ${seconds}s`;
    
    // Update session
    session.userAnswers = userAnswers;
    session.score = score;
    session.timeTaken = timeTaken;
    session.isCompleted = true;
    session.lastSaved = now;
    
    await session.save();
    
    // Update user score and practice log
    try {
      await userModel.findByIdAndUpdate(
        session.userId,
        {
          $inc: {
            points: score,
            testAttended: 1,
          },
        }
      );
      
      // Log practice activity
      const todaysLog = await practiceLogModel.getTodaysLog(session.userId);
      todaysLog.testsAttempted += 1;
      todaysLog.totalScore += score;
      todaysLog.averageScore = todaysLog.totalScore / todaysLog.testsAttempted;
      todaysLog.bestScore = Math.max(todaysLog.bestScore, score);
      todaysLog.practiceMinutes += Math.ceil(elapsedSeconds / 60);
      
      if (!todaysLog.testTypes.includes(session.topic)) {
        todaysLog.testTypes.push(session.topic);
      }
      
      todaysLog.streak = await practiceLogModel.calculateStreak(session.userId);
      await todaysLog.save();
      
      // Update user's streak and badges
      await updateUserStreak(session.userId, todaysLog.streak);
      
    } catch (logError) {
      console.error("Error updating user data:", logError);
    }
    
    res.json({
      score,
      timeTaken,
      totalQuestions: session.questions.length,
      percentage: (score / session.questions.length) * 100
    });
    
  } catch (error) {
    console.error("Error submitting quiz:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get quiz session for resuming
router.get("/session/:sessionId", async (req, res) => {
  try {
    const { sessionId } = req.params;
    const session = await quizSessionModel.findById(sessionId);
    
    if (!session) {
      return res.status(404).json({ message: "Quiz session not found" });
    }
    
    if (session.isCompleted) {
      return res.status(400).json({ message: "Quiz already completed" });
    }
    
    // Check if session has expired
    const now = new Date();
    const elapsedSeconds = Math.floor((now - session.startTime) / 1000);
    const remainingSeconds = Math.max(0, session.duration - elapsedSeconds);
    
    if (remainingSeconds <= 0) {
      return res.status(400).json({ message: "Quiz session has expired" });
    }
    
    res.json({
      session,
      remainingSeconds,
      serverTime: now
    });
    
  } catch (error) {
    console.error("Error fetching quiz session:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get active quiz sessions for user
router.get("/active-sessions/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const sessions = await quizSessionModel.find({
      userId,
      isCompleted: false
    }).sort({ createdAt: -1 });
    
    res.json(sessions);
  } catch (error) {
    console.error("Error fetching active sessions:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Helper function to update user streak and badges
async function updateUserStreak(userId, currentStreak) {
  try {
    const user = await userModel.findById(userId);
    if (!user) return;
    
    user.currentStreak = currentStreak;
    
    if (currentStreak > user.longestStreak) {
      user.longestStreak = currentStreak;
    }
    
    const badges = user.streakBadges || {};
    
    if (currentStreak >= 1 && !badges.firstStreak) {
      badges.firstStreak = true;
    }
    if (currentStreak >= 7 && !badges.weekWarrior) {
      badges.weekWarrior = true;
    }
    if (currentStreak >= 14 && !badges.twoWeekChamp) {
      badges.twoWeekChamp = true;
    }
    if (currentStreak >= 30 && !badges.monthMaster) {
      badges.monthMaster = true;
    }
    if (currentStreak >= 100 && !badges.streakLegend) {
      badges.streakLegend = true;
    }
    
    user.streakBadges = badges;
    await user.save();
    
  } catch (error) {
    console.error("Error updating user streak:", error);
  }
}

export default router;
