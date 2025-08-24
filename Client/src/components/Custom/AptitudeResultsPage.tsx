import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
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
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-400 mx-auto mb-4"></div>
          <p className="text-gray-300">Loading results...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate("/aptitude-training")}
            className="flex items-center text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Training
          </button>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowDetailedResults(!showDetailedResults)}
              className="bg-gray-800 hover:bg-gray-700 rounded-lg px-4 py-2 transition-colors flex items-center"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              {showDetailedResults ? "Hide Details" : "Show Details"}
            </button>
          </div>
        </div>

        {/* Main Results Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800 rounded-xl p-8 border border-gray-700 mb-8"
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
            <div className="bg-gray-700 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-indigo-400 mb-2">
                {results.correctAnswers}/{results.totalQuestions}
              </div>
              <p className="text-gray-400">Score</p>
            </div>

            <div className="bg-gray-700 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">
                {results.accuracy}%
              </div>
              <p className="text-gray-400">Accuracy</p>
            </div>

            <div className="bg-gray-700 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-purple-400 mb-2">
                {formatTime(results.totalTime)}
              </div>
              <p className="text-gray-400">Total Time</p>
            </div>

            <div className="bg-gray-700 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-yellow-400 mb-2">
                {formatTime(results.averageTime)}
              </div>
              <p className="text-gray-400">Avg. Time</p>
            </div>
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
                  <div key={category} className="bg-gray-700 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className={`font-semibold capitalize ${getCategoryColor(category)}`}>
                        {category}
                      </span>
                      <span className="text-sm text-gray-400">
                        {data.correct}/{data.total}
                      </span>
                    </div>
                    <div className="w-full bg-gray-600 rounded-full h-2 mb-2">
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
                    <div className="text-right">
                      <span className="text-sm font-semibold">{percentage}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleRetry}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center"
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              Try Again
            </button>
            <button
              onClick={handleNewDifficulty}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center"
            >
              <TrendingUp className="w-5 h-5 mr-2" />
              Try Different Level
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
              className="bg-gray-800 rounded-xl p-8 border border-gray-700 mb-8"
            >
              <h3 className="text-xl font-semibold mb-6 flex items-center">
                <BarChart3 className="w-5 h-5 mr-2" />
                Detailed Results
              </h3>
              
              <div className="space-y-4">
                {results.questions.map((question, index) => (
                  <div key={index} className="bg-gray-700 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center">
                        <span className="text-sm text-gray-400 mr-3">Q{index + 1}</span>
                        <span className={`text-xs px-2 py-1 rounded ${getCategoryColor(question.category)} bg-gray-600`}>
                          {question.category}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {question.isCorrect ? (
                          <CheckCircle className="w-5 h-5 text-green-400" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-400" />
                        )}
                        <span className="text-sm text-gray-400">
                          {formatTime(question.timeSpent)}
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-gray-300 mb-2">{question.question}</p>
                    
                    <div className="text-sm space-y-1">
                      <div className="flex items-center">
                        <span className="text-gray-400 w-20">Your Answer:</span>
                        <span className={question.isCorrect ? "text-green-400" : "text-red-400"}>
                          {question.userAnswer || "Not answered"}
                        </span>
                      </div>
                      {!question.isCorrect && (
                        <div className="flex items-center">
                          <span className="text-gray-400 w-20">Correct:</span>
                          <span className="text-green-400">{question.correctAnswer}</span>
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
          className="bg-gray-800 rounded-xl p-8 border border-gray-700"
        >
          <h3 className="text-xl font-semibold mb-6 flex items-center">
            <Star className="w-5 h-5 mr-2" />
            Recommendations for Improvement
          </h3>
          
          <div className="space-y-4">
            {getRecommendations().map((recommendation, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="flex items-start space-x-3 p-4 bg-gray-700 rounded-lg"
              >
                <div className="w-2 h-2 bg-indigo-400 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-gray-300">{recommendation}</p>
              </motion.div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-indigo-600/20 border border-indigo-500/30 rounded-lg">
            <p className="text-indigo-300 text-sm">
              💡 <strong>Tip:</strong> Regular practice is key to improving your aptitude skills. 
              Try to practice for at least 15-20 minutes daily to see significant improvement over time.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
export default AptitudeResultsPage; 