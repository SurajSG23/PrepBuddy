import React, { useEffect, useState } from 'react';
import { Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import axios from 'axios';
import { Calendar, TrendingUp, Target, Award, BarChart3 } from 'lucide-react';
import { useThemeSelector } from "../../store/hooks";

interface ProgressData {
  date: string;
  day: string;
  testsAttempted: number;
  averageScore: number;
  bestScore: number;
  practiceMinutes: number;
}

interface StreakData {
  currentStreak: number;
  longestStreak: number;
  todaysPractice: {
    testsAttempted: number;
    averageScore: number;
    practiceMinutes: number;
  };
}

interface StatsData {
  totalTests: number;
  totalPoints: number;
  weeklyAverage: number;
  scoreTrend: number;
  rank: number;
  activeDays: number;
}

interface ProgressDashboardProps {
  userID: string;
  viewMode?: '7' | '30';
}

const ProgressDashboard: React.FC<ProgressDashboardProps> = ({ userID, viewMode = '7' }) => {
  const [progressData, setProgressData] = useState<ProgressData[]>([]);
  const [streakData, setStreakData] = useState<StreakData | null>(null);
  const [statsData, setStatsData] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedView, setSelectedView] = useState(viewMode);
  const darkMode = useThemeSelector((state) => state.theme.darkMode);

  useEffect(() => {
    if (!userID) return;
    fetchProgressData();
  }, [userID, selectedView]);

  const fetchProgressData = async () => {
    try {
      setLoading(true);
      const [progressRes, streakRes, statsRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/progress/daily-progress/${userID}?days=${selectedView}`, {
          withCredentials: true
        }),
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/progress/streak/${userID}`, {
          withCredentials: true
        }),
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/progress/stats/${userID}`, {
          withCredentials: true
        })
      ]);

      setProgressData(progressRes.data);
      setStreakData(streakRes.data);
      setStatsData(statsRes.data);
    } catch (error) {
      console.error('Error fetching progress data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStreakMotivation = (streak: number) => {
    if (streak === 0) return { message: "Start your learning journey today! 🚀", color: "text-gray-400" };
    if (streak < 3) return { message: "Great start! Keep it up! 💪", color: "text-blue-400" };
    if (streak < 7) return { message: "You're building momentum! 🔥", color: "text-orange-400" };
    if (streak < 14) return { message: "Impressive consistency! 🌟", color: "text-yellow-400" };
    if (streak < 30) return { message: "Streak master! You're unstoppable! ⚡", color: "text-green-400" };
    return { message: "Legendary dedication! 👑", color: "text-purple-400" };
  };

  // const COLORS = ['#6366f1', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b'];

  if (loading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map(i => (
          <Card key={i} className={darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-indigo-200"}>
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className={darkMode ? "h-4 bg-gray-700 rounded w-1/4 mb-4" : "h-4 bg-indigo-100 rounded w-1/4 mb-4"}></div>
                <div className={darkMode ? "h-32 bg-gray-700 rounded" : "h-32 bg-indigo-100 rounded"}></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const motivation = streakData ? getStreakMotivation(streakData.currentStreak) : null;

  return (
    <div className="space-y-6">
      {/* Header with View Toggle */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>Progress Dashboard</h2>
          <p className={darkMode ? "text-gray-400" : "text-gray-600"}>Track your daily practice and learning streaks</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setSelectedView('7')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${selectedView === '7' ? (darkMode ? 'bg-indigo-600 text-white' : 'bg-indigo-500 text-white') : (darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-indigo-100 text-gray-900 hover:bg-indigo-200')}`}
          >
            7 Days
          </button>
          <button
            onClick={() => setSelectedView('30')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${selectedView === '30' ? (darkMode ? 'bg-indigo-600 text-white' : 'bg-indigo-500 text-white') : (darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-indigo-100 text-gray-900 hover:bg-indigo-200')}`}
          >
            30 Days
          </button>
        </div>
      </div>

      {/* Streak Cards */}
      {streakData && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className={darkMode ? "bg-gradient-to-br from-indigo-900/50 to-purple-900/50 border-indigo-500/30" : "bg-gradient-to-br from-indigo-100/70 to-purple-100/70 border-indigo-200/30"}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className={darkMode ? "text-sm text-gray-300" : "text-sm text-gray-700"}>Current Streak</p>
                  <p className={darkMode ? "text-3xl font-bold text-indigo-400" : "text-3xl font-bold text-indigo-700"}>{streakData.currentStreak}</p>
                  <p className={darkMode ? "text-xs text-gray-400" : "text-xs text-gray-500"}>days</p>
                </div>
                <Calendar className={darkMode ? "h-8 w-8 text-indigo-400" : "h-8 w-8 text-indigo-700"} />
              </div>
              {motivation && (
                <p className={`text-sm mt-2 ${motivation.color}`}>{motivation.message}</p>
              )}
            </CardContent>
          </Card>

          <Card className={darkMode ? "bg-gradient-to-br from-emerald-900/50 to-teal-900/50 border-emerald-500/30" : "bg-gradient-to-br from-emerald-100/70 to-teal-100/70 border-emerald-200/30"}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className={darkMode ? "text-sm text-gray-300" : "text-sm text-gray-700"}>Longest Streak</p>
                  <p className={darkMode ? "text-3xl font-bold text-emerald-400" : "text-3xl font-bold text-emerald-700"}>{streakData.longestStreak}</p>
                  <p className={darkMode ? "text-xs text-gray-400" : "text-xs text-gray-500"}>days</p>
                </div>
                <Award className={darkMode ? "h-8 w-8 text-emerald-400" : "h-8 w-8 text-emerald-700"} />
              </div>
            </CardContent>
          </Card>

          <Card className={darkMode ? "bg-gradient-to-br from-orange-900/50 to-red-900/50 border-orange-500/30" : "bg-gradient-to-br from-orange-100/70 to-red-100/70 border-orange-200/30"}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className={darkMode ? "text-sm text-gray-300" : "text-sm text-gray-700"}>Today's Tests</p>
                  <p className={darkMode ? "text-3xl font-bold text-orange-400" : "text-3xl font-bold text-orange-700"}>{streakData.todaysPractice.testsAttempted}</p>
                  <p className={darkMode ? "text-xs text-gray-400" : "text-xs text-gray-500"}>completed</p>
                </div>
                <Target className={darkMode ? "h-8 w-8 text-orange-400" : "h-8 w-8 text-orange-700"} />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Tests Chart */}
        <Card className={darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-indigo-200"}>
          <CardHeader>
            <CardTitle className={darkMode ? "text-indigo-400 flex items-center gap-2" : "text-indigo-700 flex items-center gap-2"}>
              <BarChart3 className={darkMode ? "h-5 w-5" : "h-5 w-5"} />
              Daily Test Activity
            </CardTitle>
            <CardDescription className={darkMode ? "text-gray-400" : "text-gray-600"}>
              Number of tests attempted each day
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={progressData}>
                <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#374151" : "#c7d2fe"} />
                <XAxis
                  dataKey="day"
                  stroke={darkMode ? "#9ca3af" : "#6366f1"}
                  fontSize={12}
                />
                <YAxis
                  stroke={darkMode ? "#9ca3af" : "#6366f1"}
                  fontSize={12}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: darkMode ? '#1f2937' : '#fff',
                    border: darkMode ? '1px solid #374151' : '1px solid #c7d2fe',
                    borderRadius: '8px',
                    color: darkMode ? '#fff' : '#111'
                  }}
                />
                <Bar
                  dataKey="testsAttempted"
                  fill={darkMode ? "#6366f1" : "#6366f1"}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        {/* Score Trend Chart */}
        <Card className={darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-indigo-200"}>
          <CardHeader>
            <CardTitle className={darkMode ? "text-emerald-400 flex items-center gap-2" : "text-emerald-700 flex items-center gap-2"}>
              <TrendingUp className={darkMode ? "h-5 w-5" : "h-5 w-5"} />
              Score Trend
            </CardTitle>
            <CardDescription className={darkMode ? "text-gray-400" : "text-gray-600"}>
              Average and best scores over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={progressData}>
                <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#374151" : "#c7d2fe"} />
                <XAxis
                  dataKey="day"
                  stroke={darkMode ? "#9ca3af" : "#6366f1"}
                  fontSize={12}
                />
                <YAxis
                  stroke={darkMode ? "#9ca3af" : "#6366f1"}
                  fontSize={12}
                  domain={[0, 10]}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: darkMode ? '#1f2937' : '#fff',
                    border: darkMode ? '1px solid #374151' : '1px solid #c7d2fe',
                    borderRadius: '8px',
                    color: darkMode ? '#fff' : '#111'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="bestScore"
                  stackId="1"
                  stroke={darkMode ? "#10b981" : "#10b981"}
                  fill={darkMode ? "#10b981" : "#10b981"}
                  fillOpacity={0.2}
                />
                <Line
                  type="monotone"
                  dataKey="averageScore"
                  stroke={darkMode ? "#6366f1" : "#6366f1"}
                  strokeWidth={3}
                  dot={{ fill: '#6366f1', strokeWidth: 2, r: 4 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Stats Summary */}
      {statsData && (
        <Card className={darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-indigo-200"}>
          <CardHeader>
            <CardTitle className={darkMode ? "text-yellow-400" : "text-yellow-700"}>Practice Statistics</CardTitle>
            <CardDescription className={darkMode ? "text-gray-400" : "text-gray-600"}>
              Your overall learning progress summary
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <div className={darkMode ? "text-center p-4 bg-gray-700/50 rounded-lg" : "text-center p-4 bg-indigo-100 rounded-lg"}>
                <p className={darkMode ? "text-2xl font-bold text-white" : "text-2xl font-bold text-gray-900"}>{statsData.totalTests}</p>
                <p className={darkMode ? "text-sm text-gray-400" : "text-sm text-gray-600"}>Total Tests</p>
              </div>
              <div className={darkMode ? "text-center p-4 bg-gray-700/50 rounded-lg" : "text-center p-4 bg-indigo-100 rounded-lg"}>
                <p className={darkMode ? "text-2xl font-bold text-indigo-400" : "text-2xl font-bold text-indigo-700"}>{statsData.totalPoints}</p>
                <p className={darkMode ? "text-sm text-gray-400" : "text-sm text-gray-600"}>Total Points</p>
              </div>
              <div className={darkMode ? "text-center p-4 bg-gray-700/50 rounded-lg" : "text-center p-4 bg-indigo-100 rounded-lg"}>
                <p className={darkMode ? "text-2xl font-bold text-emerald-400" : "text-2xl font-bold text-emerald-700"}>#{statsData.rank}</p>
                <p className={darkMode ? "text-sm text-gray-400" : "text-sm text-gray-600"}>Rank</p>
              </div>
              <div className={darkMode ? "text-center p-4 bg-gray-700/50 rounded-lg" : "text-center p-4 bg-indigo-100 rounded-lg"}>
                <p className={darkMode ? "text-2xl font-bold text-orange-400" : "text-2xl font-bold text-orange-700"}>{statsData.weeklyAverage.toFixed(1)}</p>
                <p className={darkMode ? "text-sm text-gray-400" : "text-sm text-gray-600"}>Weekly Avg</p>
              </div>
              <div className={darkMode ? "text-center p-4 bg-gray-700/50 rounded-lg" : "text-center p-4 bg-indigo-100 rounded-lg"}>
                <p className={`text-2xl font-bold ${statsData.scoreTrend >= 0 ? (darkMode ? 'text-green-400' : 'text-green-700') : (darkMode ? 'text-red-400' : 'text-red-700')}`}>
                  {statsData.scoreTrend >= 0 ? '+' : ''}{statsData.scoreTrend.toFixed(1)}
                </p>
                <p className={darkMode ? "text-sm text-gray-400" : "text-sm text-gray-600"}>Score Trend</p>
              </div>
              <div className={darkMode ? "text-center p-4 bg-gray-700/50 rounded-lg" : "text-center p-4 bg-indigo-100 rounded-lg"}>
                <p className={darkMode ? "text-2xl font-bold text-purple-400" : "text-2xl font-bold text-purple-700"}>{statsData.activeDays}</p>
                <p className={darkMode ? "text-sm text-gray-400" : "text-sm text-gray-600"}>Active Days</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProgressDashboard;


