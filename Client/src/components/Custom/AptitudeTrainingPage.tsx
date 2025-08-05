import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Brain, 
  Target, 
  TrendingUp, 
  Clock, 
  Award, 
  BarChart3,
  Play,
  BookOpen,
  Zap,
  Star
} from "lucide-react";

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
  // const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);
  const [stats, setStats] = useState<AptitudeStats>({
    totalQuestions: 0,
    correctAnswers: 0,
    averageTime: 0,
    bestScore: 0,
    categories: {
      numerical: 0,
      logical: 0,
      verbal: 0
    }
  });

  useEffect(() => {
    // Load user stats from localStorage
    const savedStats = localStorage.getItem("aptitudeStats");
    if (savedStats) {
      setStats(JSON.parse(savedStats));
    }
  }, []);

  const difficulties = [
    {
      level: "easy",
      title: "Easy",
      description: "Perfect for beginners",
      icon: <BookOpen className="w-8 h-8" />,
      color: "from-green-500 to-emerald-600",
      questions: 10,
      timeLimit: 15
    },
    {
      level: "medium",
      title: "Medium",
      description: "For intermediate learners",
      icon: <Target className="w-8 h-8" />,
      color: "from-yellow-500 to-orange-600",
      questions: 10,
      timeLimit: 12
    },
    {
      level: "hard",
      title: "Hard",
      description: "Advanced level challenges",
      icon: <Zap className="w-8 h-8" />,
      color: "from-red-500 to-pink-600",
      questions: 10,
      timeLimit: 10
    }
  ];

  const handleStartPractice = (difficulty: string) => {
    navigate(`/aptitude-practice/${difficulty}`);
  };

  const getAccuracy = () => {
    if (stats.totalQuestions === 0) return 0;
    return Math.round((stats.correctAnswers / stats.totalQuestions) * 100);
  };

  const getCategoryProgress = (category: keyof typeof stats.categories) => {
    if (stats.totalQuestions === 0) return 0;
    return Math.round((stats.categories[category] / stats.totalQuestions) * 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-4">
            <Brain className="w-12 h-12 text-indigo-400 mr-3" />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Aptitude Training
            </h1>
          </div>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Sharpen your logical thinking, numerical reasoning, and verbal abilities with our comprehensive aptitude training program.
          </p>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Questions</p>
                <p className="text-2xl font-bold text-indigo-400">{stats.totalQuestions}</p>
              </div>
              <BarChart3 className="w-8 h-8 text-indigo-400" />
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Accuracy</p>
                <p className="text-2xl font-bold text-green-400">{getAccuracy()}%</p>
              </div>
              <Target className="w-8 h-8 text-green-400" />
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Best Score</p>
                <p className="text-2xl font-bold text-yellow-400">{stats.bestScore}/10</p>
              </div>
              <Award className="w-8 h-8 text-yellow-400" />
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Avg. Time</p>
                <p className="text-2xl font-bold text-purple-400">{stats.averageTime}s</p>
              </div>
              <Clock className="w-8 h-8 text-purple-400" />
            </div>
          </div>
        </motion.div>

        {/* Category Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gray-800 rounded-lg p-6 border border-gray-700 mb-12"
        >
          <h3 className="text-xl font-semibold mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2" />
            Category Progress
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-300">Numerical</span>
                <span className="text-blue-400">{getCategoryProgress('numerical')}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${getCategoryProgress('numerical')}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-300">Logical</span>
                <span className="text-green-400">{getCategoryProgress('logical')}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${getCategoryProgress('logical')}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-300">Verbal</span>
                <span className="text-purple-400">{getCategoryProgress('verbal')}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${getCategoryProgress('verbal')}%` }}
                ></div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Difficulty Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold text-center mb-8">Choose Your Difficulty Level</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {difficulties.map((difficulty, index) => (
              <motion.div
                key={difficulty.level}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`relative bg-gradient-to-br ${difficulty.color} rounded-xl p-8 cursor-pointer transform transition-all duration-300 hover:shadow-2xl`}
                onClick={() => handleStartPractice(difficulty.level)}
              >
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
                    {difficulty.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-2">{difficulty.title}</h3>
                  <p className="text-white/80 mb-6">{difficulty.description}</p>
                  
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span>Questions:</span>
                      <span className="font-semibold">{difficulty.questions}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Time Limit:</span>
                      <span className="font-semibold">{difficulty.timeLimit}s per question</span>
                    </div>
                  </div>

                  <button className="mt-6 w-full bg-white/20 hover:bg-white/30 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center">
                    <Play className="w-5 h-5 mr-2" />
                    Start Practice
                  </button>
                </div>

                {/* Difficulty Badge */}
                <div className="absolute -top-3 -right-3">
                  <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-semibold">
                    {difficulty.level.toUpperCase()}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Features */}
        <motion.div

          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gray-800 rounded-lg p-8 border border-gray-700"
        >
          <h3 className="text-2xl font-bold text-center mb-8">Why Choose Our Aptitude Training?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-indigo-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="w-6 h-6 text-indigo-400" />
              </div>
              <h4 className="font-semibold mb-2">Comprehensive Coverage</h4>
              <p className="text-gray-400 text-sm">Numerical, logical, and verbal reasoning</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-6 h-6 text-green-400" />
              </div>
              <h4 className="font-semibold mb-2">Time Management</h4>
              <p className="text-gray-400 text-sm">Practice with realistic time constraints</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-6 h-6 text-yellow-400" />
              </div>
              <h4 className="font-semibold mb-2">Progress Tracking</h4>
              <p className="text-gray-400 text-sm">Monitor your improvement over time</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-6 h-6 text-purple-400" />
              </div>
              <h4 className="font-semibold mb-2">Adaptive Learning</h4>
              <p className="text-gray-400 text-sm">Questions tailored to your skill level</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AptitudeTrainingPage;
