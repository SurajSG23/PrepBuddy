import { useState, useEffect } from "react";
import { useThemeSelector } from "../../store/hooks";
import { Calendar, Award, Target, TrendingUp } from "lucide-react";

interface QODStats {
  totalAnswered: number;
  correctAnswers: number;
  currentStreak: number;
  longestStreak: number;
  accuracy: number;
}

const QODStatsCard = () => {
  const darkMode = useThemeSelector((state) => state.theme.darkMode);
  const [stats, setStats] = useState<QODStats>({
    totalAnswered: 0,
    correctAnswers: 0,
    currentStreak: 0,
    longestStreak: 0,
    accuracy: 0
  });

  useEffect(() => {
    calculateStats();
  }, []);

  const calculateStats = () => {
    const allKeys = Object.keys(localStorage);
    const qodKeys = allKeys.filter(key => key.startsWith('answeredQOD_'));
    
    let totalAnswered = 0;
    let correctAnswers = 0;
    
    qodKeys.forEach(key => {
      const data = JSON.parse(localStorage.getItem(key) || '{}');
      if (data.answered) {
        totalAnswered++;
        if (data.correct) {
          correctAnswers++;
        }
      }
    });

    const currentStreak = parseInt(localStorage.getItem('qodStreak') || '0');
    const longestStreak = parseInt(localStorage.getItem('qodLongestStreak') || currentStreak.toString());
    const accuracy = totalAnswered > 0 ? Math.round((correctAnswers / totalAnswered) * 100) : 0;

    setStats({
      totalAnswered,
      correctAnswers,
      currentStreak,
      longestStreak,
      accuracy
    });
  };

  return (
    <div
      className={
        `backdrop-blur-md rounded-2xl p-6 shadow-md transition-all duration-300 hover:scale-[1.02] border ` +
        (darkMode
          ? 'bg-gray-800/50 border-gray-700/60 hover:shadow-indigo-500/30'
          : 'bg-white border-indigo-200 hover:shadow-indigo-300/30')
      }
    >
      <h3
        className={
          `text-2xl font-extrabold mb-4 flex items-center gap-3 text-transparent bg-clip-text bg-gradient-to-r ` +
          (darkMode
            ? 'from-indigo-400 via-purple-500 to-pink-400'
            : 'from-indigo-700 via-purple-400 to-pink-400')
        }
      >
        <Calendar className={darkMode ? "text-indigo-400 drop-shadow-md" : "text-indigo-700 drop-shadow-md"} size={22} />
        Question of the Day Stats
      </h3>

      <div className="grid grid-cols-2 gap-5">
        <div className={
          `text-center p-4 rounded-lg border shadow-md transition-all duration-300 cursor-pointer ` +
          (darkMode
            ? 'bg-gray-800 border-gray-700 hover:shadow-indigo-500/20'
            : 'bg-indigo-50 border-indigo-200 hover:shadow-indigo-300/20')
        }>
          <div className="flex items-center justify-center mb-2">
            <Target className={darkMode ? "text-indigo-400 w-5 h-5 group-hover:scale-110 transition-transform" : "text-indigo-700 w-5 h-5 group-hover:scale-110 transition-transform"} size={16} />
          </div>
          <div className={darkMode ? "text-3xl font-bold text-indigo-300" : "text-3xl font-bold text-indigo-700"}>{stats.totalAnswered}</div>
          <div className={darkMode ? "text-sm text-gray-400 mt-1" : "text-sm text-gray-600 mt-1"}>Questions Answered</div>
        </div>

        <div className={
          `text-center p-4 rounded-lg border shadow-md transition-all duration-300 cursor-pointer ` +
          (darkMode
            ? 'bg-gray-800 border-gray-700 hover:shadow-green-500/20'
            : 'bg-green-50 border-green-200 hover:shadow-green-300/20')
        }>
          <div className="flex items-center justify-center mb-3">
            <TrendingUp className={darkMode ? "text-green-400 w-5 h-5 group-hover:scale-110 transition-transform" : "text-green-600 w-5 h-5 group-hover:scale-110 transition-transform"} size={16} />
          </div>
          <div className={darkMode ? "text-3xl font-bold text-green-400" : "text-3xl font-bold text-green-700"}>{stats.accuracy}%</div>
          <div className={darkMode ? "text-sm text-gray-400 mt-1 tracking-wide" : "text-sm text-gray-600 mt-1 tracking-wide"}>Accuracy</div>
        </div>

        <div className={
          `text-center p-4 rounded-lg border shadow-md transition-all duration-300 cursor-pointer ` +
          (darkMode
            ? 'bg-gray-800 border-yellow-500/20 hover:shadow-yellow-500/30'
            : 'bg-yellow-50 border-yellow-200 hover:shadow-yellow-300/30')
        }>
          <div className="flex items-center justify-center mb-3">
            <Award className={darkMode ? "text-yellow-400 w-5 h-5 group-hover:scale-110 transition-transform" : "text-yellow-600 w-5 h-5 group-hover:scale-110 transition-transform"} size={16} />
          </div>
          <div className={darkMode ? "text-3xl font-bold text-yellow-300" : "text-3xl font-bold text-yellow-700"}>{stats.currentStreak}</div>
          <div className={darkMode ? "text-sm text-gray-400 mt-1 tracking-wide" : "text-sm text-gray-600 mt-1 tracking-wide"}>Current Streak</div>
        </div>

        <div className={
          `text-center p-4 rounded-lg border shadow-md transition-all duration-300 cursor-pointer ` +
          (darkMode
            ? 'bg-gray-800 border-yellow-500/20 hover:shadow-yellow-500/30'
            : 'bg-orange-50 border-orange-200 hover:shadow-orange-300/30')
        }>
          <div className="flex items-center justify-center mb-3">
            <Award className={darkMode ? "text-orange-400 w-5 h-5 group-hover:scale-110 transition-transform" : "text-orange-600 w-5 h-5 group-hover:scale-110 transition-transform"} size={16} />
          </div>
          <div className={darkMode ? "text-3xl font-bold text-orange-300" : "text-3xl font-bold text-orange-700"}>{stats.longestStreak}</div>
          <div className={darkMode ? "text-sm text-gray-400 mt-1 tracking-wide" : "text-sm text-gray-600 mt-1 tracking-wide"}>Best Streak</div>
        </div>
      </div>

      {stats.totalAnswered === 0 && (
        <div className={darkMode ? "mt-4 p-4 bg-gradient-to-r from-blue-800/30 to-blue-900/20 border border-blue-700/50 rounded-xl text-center shadow-inner" : "mt-4 p-4 bg-gradient-to-r from-blue-100/30 to-blue-200/20 border border-blue-200/50 rounded-xl text-center shadow-inner"}>
          <p className={darkMode ? "text-blue-300 text-sm tracking-wide animate-pulse" : "text-blue-700 text-sm tracking-wide animate-pulse"}>
            Start answering daily questions to see your stats here!
          </p>
        </div>
      )}

      {stats.currentStreak >= 7 && (
        <div className={darkMode ? "mt-4 p-3 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-lg text-center" : "mt-4 p-3 bg-gradient-to-r from-yellow-100/20 to-orange-100/20 border border-yellow-200/30 rounded-lg text-center"}>
          <p className={darkMode ? "text-yellow-300 text-sm font-semibold tracking-wide animate-bounce" : "text-yellow-700 text-sm font-semibold tracking-wide animate-bounce"}>
            🔥 Amazing! You're on a {stats.currentStreak}-day streak!
          </p>
        </div>
      )}
    </div>
  );
};

export default QODStatsCard;
