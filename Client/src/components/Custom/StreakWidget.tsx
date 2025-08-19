import React, { useEffect, useState } from 'react';
import { Card, CardContent } from "../ui/card";
import axios from 'axios';
import { Flame, Calendar, TrendingUp, Target } from 'lucide-react';
import { useThemeSelector } from "../../store/hooks";

interface StreakData {
  currentStreak: number;
  longestStreak: number;
  todaysPractice: {
    testsAttempted: number;
    averageScore: number;
    practiceMinutes: number;
  };
}

interface StreakWidgetProps {
  userID: string;
  compact?: boolean;
}

const StreakWidget: React.FC<StreakWidgetProps> = ({ userID, compact = false }) => {
  const [streakData, setStreakData] = useState<StreakData | null>(null);
  const [loading, setLoading] = useState(true);
  const darkMode = useThemeSelector((state) => state.theme.darkMode);

  useEffect(() => {
    if (!userID) return;
    fetchStreakData();
  }, [userID]);

  const fetchStreakData = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/progress/streak/${userID}`,
        { withCredentials: true }
      );
      setStreakData(response.data);
    } catch (error) {
      console.error('Error fetching streak data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStreakLevel = (streak: number) => {
    if (streak === 0) return { level: "Starter", color: "text-gray-400", bgColor: "from-gray-600 to-gray-700" };
    if (streak < 3) return { level: "Beginner", color: "text-blue-400", bgColor: "from-blue-600 to-blue-700" };
    if (streak < 7) return { level: "Getting Hot", color: "text-orange-400", bgColor: "from-orange-600 to-red-600" };
    if (streak < 14) return { level: "On Fire", color: "text-red-400", bgColor: "from-red-600 to-red-700" };
    if (streak < 30) return { level: "Blazing", color: "text-yellow-400", bgColor: "from-yellow-600 to-orange-600" };
    return { level: "Legendary", color: "text-purple-400", bgColor: "from-purple-600 to-pink-600" };
  };

  const getMotivationalMessage = (streak: number, todayTests: number) => {
    if (todayTests === 0) {
      if (streak === 0) return "Start your journey today! Take your first test! 🚀";
      return `Don't break your ${streak}-day streak! Take a test now! 🔥`;
    }
    if (streak === 0 && todayTests > 0) return "Great start! Come back tomorrow to build your streak! 💪";
    return `Amazing! Keep your ${streak}-day streak alive! 🌟`;
  };

  if (loading) {
    if (compact) {
      return (
        <Card className={darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-indigo-200"}>
          <CardContent className="p-4">
            <div className="animate-pulse flex items-center gap-4">
              <div className={darkMode ? "h-8 w-8 bg-gray-700 rounded-full" : "h-8 w-8 bg-indigo-100 rounded-full"}></div>
              <div className={darkMode ? "h-4 w-24 bg-gray-700 rounded" : "h-4 w-24 bg-indigo-100 rounded"}></div>
            </div>
          </CardContent>
        </Card>
      );
    }
    return (
      <Card className={darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-indigo-200"}>
        <CardContent className="p-4">
          <div className="animate-pulse">
            <div className={darkMode ? "h-4 bg-gray-700 rounded w-3/4 mb-2" : "h-4 bg-indigo-100 rounded w-3/4 mb-2"}></div>
            <div className={darkMode ? "h-8 bg-gray-700 rounded w-1/2" : "h-8 bg-indigo-100 rounded w-1/2"}></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!streakData) return null;

  const streakLevel = getStreakLevel(streakData.currentStreak);
  const motivation = getMotivationalMessage(streakData.currentStreak, streakData.todaysPractice.testsAttempted);

  if (compact) {
    return (
      <Card className={`bg-gradient-to-r ${streakLevel.bgColor} ${darkMode ? "border-gray-600" : "border-indigo-200"}`}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Flame className="h-6 w-6 text-orange-400" />
              <div>
                <p className={`text-sm ${darkMode ? "text-gray-200" : "text-gray-700"}`}>{streakLevel.level}</p>
                <p className={`text-xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>{streakData.currentStreak} days</p>
              </div>
            </div>
            <div className="text-right">
              <p className={`text-sm ${darkMode ? "text-gray-200" : "text-gray-700"}`}>Today</p>
              <p className={`text-lg font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>{streakData.todaysPractice.testsAttempted} tests</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`${darkMode ? "bg-gray-800 border-gray-700 hover:shadow-lg hover:shadow-indigo-500/20" : "bg-white border-indigo-200 hover:shadow-lg hover:shadow-indigo-200/20"} transition-all`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className={`text-lg font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>Practice Streak</h3>
          <Flame className={`h-6 w-6 ${streakLevel.color}`} />
        </div>
        <div className="space-y-4">
          {/* Current Streak */}
          <div className={`bg-gradient-to-r ${streakLevel.bgColor} rounded-lg p-4`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm opacity-90 ${darkMode ? "text-gray-200" : "text-gray-700"}`}>{streakLevel.level}</p>
                <p className={`text-3xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>{streakData.currentStreak}</p>
                <p className={`text-sm opacity-75 ${darkMode ? "text-gray-200" : "text-gray-700"}`}>day streak</p>
              </div>
              <Calendar className={`h-8 w-8 ${darkMode ? "text-white opacity-80" : "text-gray-900 opacity-80"}`} />
            </div>
          </div>
          {/* Today's Progress */}
          <div className="grid grid-cols-2 gap-3">
            <div className={darkMode ? "bg-gray-700/50 rounded-lg p-3 text-center" : "bg-indigo-100 rounded-lg p-3 text-center"}>
              <Target className={darkMode ? "h-5 w-5 text-indigo-400 mx-auto mb-1" : "h-5 w-5 text-indigo-600 mx-auto mb-1"} />
              <p className={`text-lg font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>{streakData.todaysPractice.testsAttempted}</p>
              <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-700"}`}>Tests Today</p>
            </div>
            <div className={darkMode ? "bg-gray-700/50 rounded-lg p-3 text-center" : "bg-indigo-100 rounded-lg p-3 text-center"}>
              <TrendingUp className={darkMode ? "h-5 w-5 text-emerald-400 mx-auto mb-1" : "h-5 w-5 text-emerald-600 mx-auto mb-1"} />
              <p className={`text-lg font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>{streakData.todaysPractice.averageScore.toFixed(1)}</p>
              <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-700"}`}>Avg Score</p>
            </div>
          </div>
          {/* Longest Streak Badge */}
          <div className={darkMode ? "flex items-center justify-between bg-gray-700/30 rounded-lg p-3" : "flex items-center justify-between bg-indigo-50 rounded-lg p-3"}>
            <span className={darkMode ? "text-sm text-gray-300" : "text-sm text-gray-700"}>Best Streak</span>
            <span className={darkMode ? "text-sm font-semibold text-emerald-400" : "text-sm font-semibold text-emerald-700"}>{streakData.longestStreak} days</span>
          </div>
          {/* Motivational Message */}
          <div className={darkMode ? "bg-indigo-900/30 border border-indigo-500/30 rounded-lg p-3" : "bg-indigo-100 border border-indigo-200 rounded-lg p-3"}>
            <p className={`text-sm text-center leading-relaxed ${darkMode ? "text-indigo-300" : "text-indigo-700"}`}>
              {motivation}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StreakWidget;


