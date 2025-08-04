import { useState, useEffect } from "react";
import { Calendar, Award, Target, TrendingUp } from "lucide-react";

interface QODStats {
  totalAnswered: number;
  correctAnswers: number;
  currentStreak: number;
  longestStreak: number;
  accuracy: number;
}

const QODStatsCard = () => {
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
    <div className="bg-gray-800/50 backdrop-blur-md border border-gray-700/60 rounded-2xl p-6 shadow-md hover:shadow-indigo-500/30 transition-all duration-300 hover:scale-[1.02]">
      <h3 className="text-2xl font-extrabold mb-4 flex items-center gap-3 text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-400">
        <Calendar className="text-indigo-400 drop-shadow-md" size={22} />
        Question of the Day Stats
      </h3>
      
      <div className="grid grid-cols-2 gap-5">
        <div className="text-center p-4 bg-gray-800 rounded-lg border border-gray-700 shadow-md hover:shadow-indigo-500/20 hover:scale-[1.03] transition-all duration-300 cursor-pointer">
          <div className="flex items-center justify-center mb-2">
            <Target className="text-indigo-400 w-5 h-5 group-hover:scale-110 transition-transform" size={16} />
          </div>
          <div className="text-3xl font-bold text-indigo-300">{stats.totalAnswered}</div>
          <div className="text-sm text-gray-400 mt-1">Questions Answered</div>
        </div>
        
        <div className="text-center p-4 bg-gray-800 rounded-lg border border-gray-700 shadow-md hover:shadow-green-500/20 hover:scale-[1.03] transition-all duration-300 cursor-pointer">
          <div className="flex items-center justify-center mb-3">
            <TrendingUp className="text-green-400 w-5 h-5 group-hover:scale-110 transition-transform" size={16} />
          </div>
          <div className="text-3xl font-bold text-green-403">{stats.accuracy}%</div>
          <div className="text-sm text-gray-400 mt-1 tracking-wide">Accuracy</div>
        </div>
        
        <div className="text-center p-4 bg-gray-800 rounded-lg border border-yellow-500/20 shadow-md hover:shadow-yellow-500/30 hover:scale-[1.03] transition-all duration-300 cursor-pointer">
          <div className="flex items-center justify-center mb-3">
            <Award className="text-yellow-400 w-5 h-5 group-hover:scale-110 transition-transform" size={16} />
          </div>
          <div className="text-3xl font-bold text-yellow-300">{stats.currentStreak}</div>
          <div className="text-sm text-gray-400 mt-1 tracking-wide">Current Streak</div>
        </div>
        
        <div className="text-center p-4 bg-gray-800 rounded-lg border border-yellow-500/20 shadow-md hover:shadow-yellow-500/30 hover:scale-[1.03] transition-all duration-300 cursor-pointer">
          <div className="flex items-center justify-center mb-3">
            <Award className="text-orange-400  w-5 h-5 group-hover:scale-110 transition-transform" size={16} />
          </div>
          <div className="text-3xl font-bold text-orange-300">{stats.longestStreak}</div>
          <div className="text-sm text-gray-400 mt-1 tracking-wide">Best Streak</div>
        </div>
      </div>

      {stats.totalAnswered === 0 && (
        <div className="mt-4 p-4 bg-gradient-to-r from-blue-800/30 to-blue-900/20 border border-blue-700/50 rounded-xl text-center shadow-inner">
          <p className="text-blue-300 text-sm tracking-wide animate-pulse">
            Start answering daily questions to see your stats here!
          </p>
        </div>
      )}

      {stats.currentStreak >= 7 && (
        <div className="mt-4 p-3 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-lg text-center">
          <p className="text-yellow-300 text-sm font-semibold tracking-wide animate-bounce">
            🔥 Amazing! You're on a {stats.currentStreak}-day streak!
          </p>
        </div>
      )}
    </div>
  );
};

export default QODStatsCard;
