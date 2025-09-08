import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, CheckCircle, XCircle, LoaderCircle, Clock, Play, Pause } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { usePracticeTimer } from "../../hooks/usePracticeTimer";

interface Question {
  question: string;
  options: string[];
  answer: string;
}

const TopicPracticePage: React.FC = () => {
  const { topicName } = useParams<{ topicName: string }>();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  // Timer hook - 10 minutes for topic practice
  const {
    remainingTime,
    isRunning,
    isExpired,
    formatTime,
    startTimer,
    pauseTimer,
    getElapsedTimeFormatted
  } = usePracticeTimer({
    duration: 600, // 10 minutes
    autoStart: false, // Start manually after questions are loaded
    onTimeUp: () => {
      // Auto-complete quiz when time expires
      if (!isCompleted) {
        setIsCompleted(true);
      }
    }
  });

  useEffect(() => {
    if (!topicName) return;

    const fetchQuestions = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/questions/${topicName}`);

        if (!response.ok) {
          throw new Error(
            `Failed to fetch questions. Status: ${response.status}`
          );
        }
        const data: Question[] = await response.json();

        if (data.length === 0) {
          throw new Error("No questions found for this topic.");
        }

        setQuestions(data);
        // Start timer after questions are loaded
        startTimer();
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "An unknown error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [topicName, startTimer]);

  // Capitalize the topic name for the title
  const title = topicName
    ? topicName
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
    : "Practice";

  if (loading) {
    return (
      <div className="bg-gray-900 text-white min-h-screen flex flex-col items-center justify-center">
        <LoaderCircle size={48} className="animate-spin text-indigo-400" />
        <p className="mt-4 text-lg">Loading Questions...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-900 text-white min-h-screen p-8 flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold text-red-500">Error</h1>
        <p className="text-gray-400 mt-2">{error}</p>
        <Link
          to="/technical-questions"
          className="mt-8 flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md"
        >
          <ArrowLeft size={20} />
          Back to Topics
        </Link>
      </div>
    );
  }

  // Quiz completion screen
  if (isCompleted) {
    const percentage = Math.round((score / questions.length) * 100);
    
    return (
      <div className="bg-gray-900 text-white min-h-screen p-4 sm:p-8 w-full">
        <div className="container mx-auto max-w-3xl">
          <Link
            to="/technical-questions"
            className="flex items-center gap-2 text-indigo-400 hover:text-indigo-300 transition-colors mb-8"
          >
            <ArrowLeft size={20} />
            Back to Technical Questions
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800 p-8 rounded-lg shadow-xl text-center"
          >
            <CheckCircle size={48} className="text-green-400 mx-auto mb-4" />
            <h1 className="text-3xl font-bold mb-4">{title} Practice Completed!</h1>
            <p className="text-xl text-gray-300 mb-4">
              You scored {score} out of {questions.length} ({percentage}%)
            </p>
            <p className="text-lg text-gray-400 mb-6">
              Time taken: {getElapsedTimeFormatted()}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg transition-colors"
              >
                Practice Again
              </button>
              <Link
                to="/technical-questions"
                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg transition-colors text-center"
              >
                Back to Topics
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const isCorrect = selectedOption === currentQuestion.answer;

  const handleOptionSelect = (option: string) => {
    if (showAnswer) return;
    setSelectedOption(option);
    setShowAnswer(true);
    
    // Update score if correct
    if (option === currentQuestion.answer) {
      setScore(score + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
      setShowAnswer(false);
    } else {
      // Handle quiz completion
      setIsCompleted(true);
    }
  };

  if (!currentQuestion) {
    return (
      <div className="bg-gray-900 text-white min-h-screen p-8 flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold text-red-500">No Questions Found</h1>
        <p className="text-gray-400 mt-2">
          Practice questions for "{title}" are not available yet.
        </p>
        <Link
          to="/technical-questions"
          className="mt-8 flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md transition-colors"
        >
          <ArrowLeft size={20} />
          Back to Topics
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 text-white min-h-screen p-4 sm:p-8 w-full">
      <div className="container mx-auto max-w-3xl">
        <Link
          to="/technical-questions"
          className="flex items-center gap-2 text-indigo-400 hover:text-indigo-300 transition-colors mb-8"
        >
          <ArrowLeft size={20} />
          Back to Topics
        </Link>

        <header className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold">{title}</h1>
          <p className="text-lg text-gray-400 mt-2 mb-4">
            Question {currentQuestionIndex + 1} of {questions.length}
          </p>
          
          {/* Timer Display */}
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
              remainingTime <= 180 ? 'bg-red-900/30 text-red-400' : 
              remainingTime <= 300 ? 'bg-yellow-900/30 text-yellow-400' : 
              'bg-green-900/30 text-green-400'
            }`}>
              <Clock size={18} />
              <span className="font-mono text-lg">{formatTime()}</span>
            </div>
            
            <button
              onClick={isRunning ? pauseTimer : startTimer}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
              disabled={isExpired}
            >
              {isRunning ? <Pause size={16} /> : <Play size={16} />}
              <span>{isRunning ? 'Pause' : 'Resume'}</span>
            </button>
            
            <div className="text-sm text-gray-400">
              Score: {score}/{currentQuestionIndex + (showAnswer ? 1 : 0)}
            </div>
          </div>
          
          {isExpired && (
            <div className="text-red-400 font-semibold mb-4">
              ⏰ Time's up! Practice will be completed automatically.
            </div>
          )}
        </header>

        <motion.div
          key={currentQuestionIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="bg-gray-800 p-8 rounded-lg shadow-xl"
        >
          <h2 className="text-2xl font-semibold text-white mb-6">
            {currentQuestion.question}
          </h2>
          <div className="space-y-4">
            {currentQuestion.options.map((option: string) => {
              const isSelected = selectedOption === option;
              let buttonClass = "bg-gray-700 hover:bg-gray-600"; // Default
              if (showAnswer) {
                if (option === currentQuestion.answer) {
                  buttonClass = "bg-green-600"; // Correct answer
                } else if (isSelected && !isCorrect) {
                  buttonClass = "bg-red-600"; // Incorrect selection
                }
              } else if (isSelected) {
                buttonClass = "bg-indigo-600"; // Selected before revealing
              }

              return (
                <button
                  key={option}
                  onClick={() => handleOptionSelect(option)}
                  disabled={showAnswer}
                  className={`w-full text-left p-4 rounded-md transition-colors duration-300 flex items-center justify-between ${buttonClass} ${
                    !showAnswer ? "cursor-pointer" : "cursor-not-allowed"
                  }`}
                >
                  <span>{option}</span>
                  {showAnswer && option === currentQuestion.answer && (
                    <CheckCircle size={20} />
                  )}
                  {showAnswer && isSelected && !isCorrect && (
                    <XCircle size={20} />
                  )}
                </button>
              );
            })}
          </div>

          <AnimatePresence>
            {showAnswer && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-6 text-center"
              >
                <button
                  onClick={handleNextQuestion}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-md transition-colors duration-300"
                >
                  {currentQuestionIndex < questions.length - 1
                    ? "Next Question"
                    : "Finish Quiz"}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default TopicPracticePage;