import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useDarkMode } from "../Custom/DarkModeContext";

import { 
  ArrowLeft, 
  Trophy, 
  Brain,
  TrendingUp,
  BarChart3,
  RotateCcw,
  Star,
  CheckCircle,
  XCircle
} from "lucide-react";
import { AnimatePresence } from "framer-motion";

interface QuestionResult {
  question: string;
  userAnswer: string | null;
  correctAnswer: string;
  isCorrect: boolean;
  timeSpent: number;
  category: string;
}

interface SessionResults {
  difficulty: string;
  totalQuestions: number;
  correctAnswers: number;
  totalTime: number;
  averageTime: number;
  accuracy: number;
  questions: QuestionResult[];
  categoryBreakdown: {
    numerical: { correct: number; total: number };
    logical: { correct: number; total: number };
    verbal: { correct: number; total: number };
  };
}

const AptitudeResultsPage: React.FC = () => {
  const { darkMode } = useDarkMode();
  const { difficulty } = useParams<{ difficulty: string }>();
  const navigate = useNavigate();
  const [results, setResults] = useState<SessionResults | null>(null);
  const [showDetailedResults, setShowDetailedResults] = useState(false);

  useEffect(() => {
    // Load results from localStorage
    const savedResults = localStorage.getItem("aptitudeResults");
    if (savedResults) {
      setResults(JSON.parse(savedResults));
    } else {
      navigate("/aptitude-training");
    }
  }, [navigate]);

  const getPerformanceMessage = () => {
    if (!results) return "";
    
    if (results.accuracy >= 90) return "Excellent! You're a natural problem solver!";
    if (results.accuracy >= 80) return "Great job! You're showing strong aptitude skills!";
    if (results.accuracy >= 70) return "Good work! Keep practicing to improve further!";
    if (results.accuracy >= 60) return "Not bad! Focus on your weak areas to get better!";
    return "Keep practicing! Every attempt makes you stronger!";
  };

  const getPerformanceColor = () => {
    if (!results) return "text-gray-400";
    
    if (results.accuracy >= 90) return "text-green-400";
    if (results.accuracy >= 80) return "text-blue-400";
    if (results.accuracy >= 70) return "text-yellow-400";
    if (results.accuracy >= 60) return "text-orange-400";
    return "text-red-400";
  };



  const getCategoryColor = (category: string) => {
    switch (category) {
      case "numerical": return "text-blue-400";
      case "logical": return "text-green-400";
      case "verbal": return "text-purple-400";
      default: return "text-gray-400";
    }
  };

  const getRecommendations = () => {
    if (!results) return [];

    const recommendations = [];
    
    if (results.categoryBreakdown.numerical.correct / results.categoryBreakdown.numerical.total < 0.7) {
      recommendations.push("Practice more numerical reasoning questions to improve calculation speed and accuracy.");
    }
    
    if (results.categoryBreakdown.logical.correct / results.categoryBreakdown.logical.total < 0.7) {
      recommendations.push("Focus on logical reasoning patterns and sequence problems.");
    }
    
    if (results.categoryBreakdown.verbal.correct / results.categoryBreakdown.verbal.total < 0.7) {
      recommendations.push("Work on vocabulary and verbal analogies to enhance language skills.");
    }

    if (results.averageTime > 12) {
      recommendations.push("Try to improve your time management skills - practice with time constraints.");
    }

    if (recommendations.length === 0) {
      recommendations.push("Excellent performance across all categories! Consider trying a higher difficulty level.");
    }

    return recommendations;
  };

  const handleRetry = () => {
    navigate(`/aptitude-practice/${difficulty}`);
  };

  const handleNewDifficulty = () => {
    navigate("/aptitude-training");
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };


  if (!results) {
    return (
      <div className={`${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"} min-h-screen flex items-center justify-center`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-400 mx-auto mb-4"></div>
          <p className={darkMode ? "text-gray-300" : "text-gray-700"}>Loading results...</p>
        </div>
      </div>
    );
  }

  return (
  <div className={`${darkMode ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white" : "bg-gray-100 text-gray-900"} min-h-screen`}>
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => navigate("/aptitude-training")}
          className={`flex items-center transition-colors ${darkMode ? "text-indigo-400 hover:text-indigo-300" : "text-indigo-600 hover:text-indigo-500"}`}
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Training
        </button>

        <button
          onClick={() => setShowDetailedResults(!showDetailedResults)}
          className={`rounded-lg px-4 py-2 flex items-center transition-colors ${darkMode ? "bg-gray-800 hover:bg-gray-700" : "bg-white hover:bg-gray-100"} border ${darkMode ? "border-gray-700" : "border-gray-300"}`}
        >
          <BarChart3 className="w-4 h-4 mr-2" />
          {showDetailedResults ? "Hide Details" : "Show Details"}
        </button>
      </div>

      {/* Main Results Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`rounded-xl p-8 border mb-8 ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-300"}`}
      >
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Trophy className="w-12 h-12 text-yellow-400 mr-3" />
            <h1 className="text-4xl font-bold">Practice Complete!</h1>
          </div>
          <p className={`text-xl ${getPerformanceColor()}`}>
            {getPerformanceMessage()}
          </p>
        </div>

        {/* Score Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { value: `${results.correctAnswers}/${results.totalQuestions}`, label: "Score", color: "text-indigo-400" },
            { value: `${results.accuracy}%`, label: "Accuracy", color: "text-green-400" },
            { value: formatTime(results.totalTime), label: "Total Time", color: "text-purple-400" },
            { value: formatTime(results.averageTime), label: "Avg. Time", color: "text-yellow-400" },
          ].map((item, idx) => (
            <div key={idx} className={`rounded-lg p-6 text-center ${darkMode ? "bg-gray-700" : "bg-gray-200"}`}>
              <div className={`text-3xl font-bold mb-2 ${item.color}`}>{item.value}</div>
              <p className={darkMode ? "text-gray-400" : "text-gray-700"}>{item.label}</p>
            </div>
          ))}
        </div>

        {/* Category Breakdown */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4 flex items-center">
            <Brain className="w-5 h-5 mr-2" />
            Category Performance
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.entries(results.categoryBreakdown).map(([category, data]) => {
              const percentage = Math.round((data.correct / data.total) * 100);
              return (
                <div key={category} className={`rounded-lg p-4 ${darkMode ? "bg-gray-700" : "bg-gray-200"}`}>
                  <div className="flex justify-between items-center mb-2">
                    <span className={`font-semibold capitalize ${getCategoryColor(category)}`}>
                      {category}
                    </span>
                    <span className={darkMode ? "text-gray-400" : "text-gray-700"}>{data.correct}/{data.total}</span>
                  </div>
                  <div className={`${darkMode ? "bg-gray-600" : "bg-gray-300"} rounded-full h-2 mb-2`}>
                    <motion.div
                      className={`h-2 rounded-full ${
                        percentage >= 80 ? 'bg-green-500' :
                        percentage >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                    />
                  </div>
                  <div className="text-right text-sm font-semibold">{percentage}%</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={handleRetry}
            className="flex-1 flex items-center justify-center font-semibold py-3 px-6 rounded-lg transition-colors bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            <RotateCcw className="w-5 h-5 mr-2" /> Try Again
          </button>
          <button
            onClick={handleNewDifficulty}
            className="flex-1 flex items-center justify-center font-semibold py-3 px-6 rounded-lg transition-colors bg-green-600 hover:bg-green-700 text-white"
          >
            <TrendingUp className="w-5 h-5 mr-2" /> Try Different Level
          </button>
        </div>
      </motion.div>

      {/* Detailed Results */}
      <AnimatePresence>
        {showDetailedResults && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className={`rounded-xl p-8 border mb-8 ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-300"}`}
          >
            <h3 className="text-xl font-semibold mb-6 flex items-center">
              <BarChart3 className="w-5 h-5 mr-2" />
              Detailed Results
            </h3>
            <div className="space-y-4">
              {results.questions.map((q, i) => (
                <div key={i} className={`rounded-lg p-4 ${darkMode ? "bg-gray-700" : "bg-gray-200"}`}>
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center">
                      <span className={darkMode ? "text-gray-400 mr-3" : "text-gray-700 mr-3"}>Q{i+1}</span>
                      <span className={`text-xs px-2 py-1 rounded ${getCategoryColor(q.category)} ${darkMode ? "bg-gray-600" : "bg-gray-300"}`}>{q.category}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {q.isCorrect ? <CheckCircle className="w-5 h-5 text-green-400"/> : <XCircle className="w-5 h-5 text-red-400"/>}
                      <span className={darkMode ? "text-gray-400" : "text-gray-700"}>{formatTime(q.timeSpent)}</span>
                    </div>
                  </div>
                  <p className={darkMode ? "text-gray-300 mb-2" : "text-gray-900 mb-2"}>{q.question}</p>
                  <div className="text-sm space-y-1">
                    <div className="flex items-center">
                      <span className={darkMode ? "text-gray-400 w-20" : "text-gray-700 w-20"}>Your Answer:</span>
                      <span className={q.isCorrect ? "text-green-400" : "text-red-400"}>{q.userAnswer || "Not answered"}</span>
                    </div>
                    {!q.isCorrect && (
                      <div className="flex items-center">
                        <span className={darkMode ? "text-gray-400 w-20" : "text-gray-700 w-20"}>Correct:</span>
                        <span className="text-green-400">{q.correctAnswer}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className={`rounded-xl p-8 border ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-300"}`}
      >
        <h3 className="text-xl font-semibold mb-6 flex items-center">
          <Star className="w-5 h-5 mr-2" />
          Recommendations for Improvement
        </h3>
        <div className="space-y-4">
          {getRecommendations().map((rec, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + idx * 0.1 }}
              className={`flex items-start space-x-3 p-4 rounded-lg ${darkMode ? "bg-gray-700" : "bg-gray-200"}`}
            >
              <div className="w-2 h-2 bg-indigo-400 rounded-full mt-2 flex-shrink-0"></div>
              <p className={darkMode ? "text-gray-300" : "text-gray-900"}>{rec}</p>
            </motion.div>
          ))}
        </div>
        <div className={`mt-6 p-4 rounded-lg border ${darkMode ? "bg-indigo-600/20 border-indigo-500/30" : "bg-indigo-100/40 border-indigo-200/30"}`}>
          <p className={darkMode ? "text-indigo-300 text-sm" : "text-indigo-800 text-sm"}>
            💡 <strong>Tip:</strong> Regular practice is key to improving your aptitude skills. Try to practice for at least 15-20 minutes daily to see significant improvement over time.
          </p>
        </div>
      </motion.div>
    </div>
  </div>
);

};
export default AptitudeResultsPage; 
