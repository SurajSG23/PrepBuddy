import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Brain, Target, TrendingUp, Clock, Award, BarChart3, Play, BookOpen, Zap, Star 
} from "lucide-react";
import { useDarkMode } from "../Custom/DarkModeContext";

interface AptitudeStats {
  totalQuestions: number;
  correctAnswers: number;
  averageTime: number;
  bestScore: number;
  categories: {
    numerical: number;
    logical: number;
    verbal: number;
  };
}

const AptitudeTrainingPage: React.FC = () => {
  const navigate = useNavigate();
  const { darkMode } = useDarkMode(); // <--- useDarkMode hook
  const [stats, setStats] = useState<AptitudeStats>({
    totalQuestions: 0,
    correctAnswers: 0,
    averageTime: 0,
    bestScore: 0,
    categories: { numerical: 0, logical: 0, verbal: 0 }
  });

  useEffect(() => {
    const savedStats = localStorage.getItem("aptitudeStats");
    if (savedStats) setStats(JSON.parse(savedStats));
  }, []);

  const difficulties = [
    { level: "easy", title: "Easy", description: "Perfect for beginners", icon: <BookOpen className="w-8 h-8" />, color: "from-green-500 to-emerald-600", questions: 10, timeLimit: 15 },
    { level: "medium", title: "Medium", description: "For intermediate learners", icon: <Target className="w-8 h-8" />, color: "from-yellow-500 to-orange-600", questions: 10, timeLimit: 12 },
    { level: "hard", title: "Hard", description: "Advanced level challenges", icon: <Zap className="w-8 h-8" />, color: "from-red-500 to-pink-600", questions: 10, timeLimit: 10 }
  ];

  const handleStartPractice = (difficulty: string) => navigate(`/aptitude-practice/${difficulty}`);

  const getAccuracy = () => stats.totalQuestions === 0 ? 0 : Math.round((stats.correctAnswers / stats.totalQuestions) * 100);
  const getCategoryProgress = (category: keyof typeof stats.categories) => stats.totalQuestions === 0 ? 0 : Math.round((stats.categories[category] / stats.totalQuestions) * 100);

  // Conditional classes based on darkMode
  const bgPage = darkMode ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white" : "bg-gray-100 text-gray-900";
  const cardBg = darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-300";
  const textGray = darkMode ? "text-gray-300" : "text-gray-700";

  return (
    <div className={`min-h-screen transition-colors duration-500 ${bgPage}`}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Brain className={`w-12 h-12 mr-3 ${darkMode ? "text-indigo-400" : "text-indigo-600"}`} />
            <h1 className={`text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent`}>
              Aptitude Training
            </h1>
          </div>
          <p className={`text-xl max-w-2xl mx-auto transition-colors duration-500 ${textGray}`}>
            Sharpen your logical thinking, numerical reasoning, and verbal abilities with our comprehensive aptitude training program.
          </p>
        </motion.div>

        {/* Stats Overview */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            { title: "Total Questions", value: stats.totalQuestions, icon: BarChart3, color: "text-indigo-400" },
            { title: "Accuracy", value: `${getAccuracy()}%`, icon: Target, color: "text-green-400" },
            { title: "Best Score", value: `${stats.bestScore}/10`, icon: Award, color: "text-yellow-400" },
            { title: "Avg. Time", value: `${stats.averageTime}s`, icon: Clock, color: "text-purple-400" }
          ].map((stat) => (
            <div key={stat.title} className={`rounded-lg p-6 border ${cardBg}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm ${textGray}`}>{stat.title}</p>
                  <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                </div>
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
              </div>
            </div>
          ))}
        </motion.div>

        {/* Category Progress */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className={`rounded-lg p-6 border ${cardBg} mb-12`}>
          <h3 className={`text-xl font-semibold mb-4 flex items-center ${textGray}`}><TrendingUp className="w-5 h-5 mr-2" /> Category Progress</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(["numerical","logical","verbal"] as const).map((cat) => (
              <div key={cat}>
                <div className="flex justify-between mb-2">
                  <span className={textGray}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</span>
                  <span className={cat === "numerical" ? "text-blue-400" : cat === "logical" ? "text-green-400" : "text-purple-400"}>{getCategoryProgress(cat)}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className={`${cat === "numerical" ? "bg-blue-500" : cat === "logical" ? "bg-green-500" : "bg-purple-500"} h-2 rounded-full transition-all duration-300`} style={{ width: `${getCategoryProgress(cat)}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Difficulty Selection */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mb-12">
          <h2 className={`text-3xl font-bold text-center mb-8 transition-colors duration-500 ${textGray}`}>Choose Your Difficulty Level</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {difficulties.map((difficulty, index) => (
              <motion.div key={difficulty.level} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 + index * 0.1 }} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                className={`relative bg-gradient-to-br ${difficulty.color} rounded-xl p-8 cursor-pointer transform transition-all duration-300 hover:shadow-2xl`}
                onClick={() => handleStartPractice(difficulty.level)}
              >
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">{difficulty.icon}</div>
                  <h3 className="text-2xl font-bold mb-2">{difficulty.title}</h3>
                  <p className="text-white/80 mb-6">{difficulty.description}</p>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between"><span>Questions:</span><span className="font-semibold">{difficulty.questions}</span></div>
                    <div className="flex justify-between"><span>Time Limit:</span><span className="font-semibold">{difficulty.timeLimit}s per question</span></div>
                  </div>
                  <button className="mt-6 w-full bg-white/20 hover:bg-white/30 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center"><Play className="w-5 h-5 mr-2" /> Start Practice</button>
                </div>
                <div className="absolute -top-3 -right-3">
                  <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-semibold">{difficulty.level.toUpperCase()}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Features */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className={`rounded-lg p-8 border ${cardBg}`}>
          <h3 className={`text-2xl font-bold text-center mb-8 transition-colors duration-500 ${textGray}`}>Why Choose Our Aptitude Training?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Brain, color: "text-indigo-400/80", title: "Comprehensive Coverage", desc: "Numerical, logical, and verbal reasoning" },
              { icon: Clock, color: "text-green-400/80", title: "Time Management", desc: "Practice with realistic time constraints" },
              { icon: TrendingUp, color: "text-yellow-400/80", title: "Progress Tracking", desc: "Monitor your improvement over time" },
              { icon: Star, color: "text-purple-400/80", title: "Adaptive Learning", desc: "Questions tailored to your skill level" }
            ].map((feature) => (
              <div key={feature.title} className="text-center">
                <div className={`w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 ${feature.color}`}><feature.icon className="w-6 h-6" /></div>
                <h4 className="font-semibold mb-2 transition-colors duration-500">{feature.title}</h4>
                <p className={`text-sm transition-colors duration-500 ${textGray}`}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AptitudeTrainingPage;
