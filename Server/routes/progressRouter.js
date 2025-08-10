import express from "express";
import practiceLogModel from "../models/practiceLogModel.js";
import testModel from "../models/testModel.js";
import userModel from "../models/userModel.js";

const router = express.Router();

// Get daily practice data for progress charts
router.get("/daily-progress/:id", async (req, res) => {
  try {
    const { id: userid } = req.params;
    const { days = 7 } = req.query; // Default to 7 days, can request 30
    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));
    startDate.setHours(0, 0, 0, 0);
    
    const logs = await practiceLogModel.find({
      userid: userid,
      date: { $gte: startDate }
    }).sort({ date: 1 });
    
    // Fill in missing days with zero data
    const progressData = [];
    for (let i = 0; i < parseInt(days); i++) {
      const date = new Date();
      date.setDate(date.getDate() - (parseInt(days) - 1 - i));
      date.setHours(0, 0, 0, 0);
      
      const existingLog = logs.find(log => {
        const logDate = new Date(log.date);
        logDate.setHours(0, 0, 0, 0);
        return logDate.getTime() === date.getTime();
      });
      
      progressData.push({
        date: date.toISOString().split('T')[0], // YYYY-MM-DD format
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        testsAttempted: existingLog?.testsAttempted || 0,
        averageScore: existingLog?.averageScore || 0,
        bestScore: existingLog?.bestScore || 0,
        practiceMinutes: existingLog?.practiceMinutes || 0
      });
    }
    
    res.json(progressData);
  } catch (error) {
    console.error("Error fetching daily progress:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get current streak information
router.get("/streak/:id", async (req, res) => {
  try {
    const { id: userid } = req.params;
    
    const currentStreak = await practiceLogModel.calculateStreak(userid);
    
    // Get longest streak
    const allLogs = await practiceLogModel.find({ 
      userid: userid,
      testsAttempted: { $gt: 0 }
    }).sort({ date: 1 });
    
    let longestStreak = 0;
    let currentCount = 0;
    let previousDate = null;
    
    for (const log of allLogs) {
      const logDate = new Date(log.date);
      logDate.setHours(0, 0, 0, 0);
      
      if (previousDate) {
        const expectedDate = new Date(previousDate);
        expectedDate.setDate(expectedDate.getDate() + 1);
        
        if (logDate.getTime() === expectedDate.getTime()) {
          currentCount++;
        } else {
          longestStreak = Math.max(longestStreak, currentCount);
          currentCount = 1;
        }
      } else {
        currentCount = 1;
      }
      
      previousDate = logDate;
    }
    longestStreak = Math.max(longestStreak, currentCount);
    
    // Get today's practice status
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todaysLog = await practiceLogModel.findOne({
      userid: userid,
      date: { $gte: today }
    });
    
    res.json({
      currentStreak,
      longestStreak,
      todaysPractice: {
        testsAttempted: todaysLog?.testsAttempted || 0,
        averageScore: todaysLog?.averageScore || 0,
        practiceMinutes: todaysLog?.practiceMinutes || 0
      }
    });
  } catch (error) {
    console.error("Error fetching streak data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get practice statistics summary
router.get("/stats/:id", async (req, res) => {
  try {
    const { id: userid } = req.params;
    
    // Get total tests from testModel (existing data)
    const totalTests = await testModel.countDocuments({ userid });
    
    // Get user data
    const user = await userModel.findById(userid);
    
    // Get recent practice logs for trend analysis
    const recentLogs = await practiceLogModel.find({
      userid: userid,
      testsAttempted: { $gt: 0 }
    })
    .sort({ date: -1 })
    .limit(30);
    
    // Calculate weekly average
    const weeklyAverage = recentLogs.length > 0 
      ? recentLogs.slice(0, 7).reduce((sum, log) => sum + log.testsAttempted, 0) / 7
      : 0;
    
    // Calculate score trend (last 10 tests)
    const scoreTrend = recentLogs.length >= 2 
      ? recentLogs[0].averageScore - recentLogs[Math.min(9, recentLogs.length - 1)].averageScore
      : 0;
    
    res.json({
      totalTests: user?.testAttended || totalTests,
      totalPoints: user?.points || 0,
      weeklyAverage: Math.round(weeklyAverage * 10) / 10,
      scoreTrend: Math.round(scoreTrend * 10) / 10,
      rank: await getUserRank(userid),
      activeDays: recentLogs.length
    });
  } catch (error) {
    console.error("Error fetching practice stats:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Log practice activity (called when user completes a test)
router.post("/log-practice", async (req, res) => {
  try {
    const { userid, score, testType = 'general', practiceMinutes = 5 } = req.body;
    
    const todaysLog = await practiceLogModel.getTodaysLog(userid);
    
    // Update today's log
    todaysLog.testsAttempted += 1;
    todaysLog.totalScore += score;
    todaysLog.averageScore = todaysLog.totalScore / todaysLog.testsAttempted;
    todaysLog.bestScore = Math.max(todaysLog.bestScore, score);
    todaysLog.practiceMinutes += practiceMinutes;
    
    if (!todaysLog.testTypes.includes(testType)) {
      todaysLog.testTypes.push(testType);
    }
    
    // Calculate and update streak
    todaysLog.streak = await practiceLogModel.calculateStreak(userid);
    
    await todaysLog.save();
    
    // Update user's streak and check for badge achievements
    await updateUserStreak(userid, todaysLog.streak);
    
    res.json({ 
      message: "Practice logged successfully",
      todaysStats: {
        testsAttempted: todaysLog.testsAttempted,
        averageScore: todaysLog.averageScore,
        streak: todaysLog.streak
      }
    });
  } catch (error) {
    console.error("Error logging practice:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Helper function to get user rank
async function getUserRank(userid) {
  try {
    const allUsers = await userModel.find({}).sort({ points: -1 });
    const rankIndex = allUsers.findIndex(user => user._id.toString() === userid);
    return rankIndex === -1 ? 0 : rankIndex + 1;
  } catch (error) {
    return 0;
  }
}

// Helper function to update user streak and badges
async function updateUserStreak(userid, currentStreak) {
  try {
    const user = await userModel.findById(userid);
    if (!user) return;
    
    // Update current streak
    user.currentStreak = currentStreak;
    
    // Update longest streak if current is higher
    if (currentStreak > user.longestStreak) {
      user.longestStreak = currentStreak;
    }
    
    // Check and award streak badges
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
