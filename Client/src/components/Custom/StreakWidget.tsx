import React, { useEffect, useState } from 'react';
import { Card, CardContent } from "../ui/card";
import axios from 'axios';
import { Flame, Calendar, Trophy } from 'lucide-react';

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
}

const StreakWidget: React.FC<StreakWidgetProps> = ({ userID }) => {
  const [streakData, setStreakData] = useState<StreakData | null>(null);
  const [loading, setLoading] = useState(true);

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
    if (streak === 0) return { 
      level: 'Starter', 
      color: 'from-gray-600 to-gray-700',
      textColor: 'text-gray-400',
      message: 'Start your journey! 🚀'
    };
    if (streak < 7) return { 
      level: 'Beginner', 
      color: 'from-blue-500 to-blue-600',
      textColor: 'text-blue-400',
      message: 'Building momentum! 💪'
    };
    if (streak < 14) return { 
      level: 'Rising', 
      color: 'from-orange-500 to-red-500',
      textColor: 'text-orange-400',
      message: 'On fire! 🔥'
    };
    if (streak < 30) return { 
      level: 'Consistent', 
      color: 'from-yellow-500 to-orange-500',
      textColor: 'text-yellow-400',
      message: 'Unstoppable! ⚡'
    };
    if (streak < 100) return { 
      level: 'Master', 
      color: 'from-purple-500 to-pink-500',
      textColor: 'text-purple-400',
      message: 'Incredible dedication! 🌟'
    };
    return { 
      level: 'Legend', 
      color: 'from-pink-500 to-purple-600',
      textColor: 'text-pink-400',
      message: 'Legendary! 👑'
    };
  };

  if (loading) {
    return (
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-4">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-700 rounded w-1/2 mb-2"></div>
            <div className="h-8 bg-gray-700 rounded w-1/4"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!streakData) return null;

  const streakLevel = getStreakLevel(streakData.currentStreak);

  return (
    <Card className={`bg-gradient-to-br ${streakLevel.color} border-none shadow-lg hover:shadow-xl transition-all`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Flame className="h-5 w-5 text-white" />
              <span className="text-xs font-medium text-white/90">Current Streak</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-white">
                {streakData.currentStreak}
              </span>
              <span className="text-sm text-white/80">days</span>
            </div>
            <p className="text-xs text-white/90 mt-1">{streakLevel.message}</p>
          </div>
          
          <div className="flex flex-col gap-2 items-end">
            <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm rounded-lg px-2 py-1">
              <Calendar className="h-3 w-3 text-white" />
              <span className="text-xs font-semibold text-white">
                {streakData.todaysPractice.testsAttempted}
              </span>
              <span className="text-xs text-white/80">today</span>
            </div>
            <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm rounded-lg px-2 py-1">
              <Trophy className="h-3 w-3 text-white" />
              <span className="text-xs font-semibold text-white">
                {streakData.longestStreak}
              </span>
              <span className="text-xs text-white/80">best</span>
            </div>
          </div>
        </div>
        
        {/* Streak Level Badge */}
        <div className="mt-2 pt-2 border-t border-white/20">
          <div className="flex items-center justify-between">
            <span className="text-xs text-white/70">Level</span>
            <span className="text-xs font-bold text-white bg-white/20 px-2 py-0.5 rounded-full">
              {streakLevel.level}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StreakWidget;
