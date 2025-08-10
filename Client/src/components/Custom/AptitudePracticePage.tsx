import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Brain,
  Timer,
  Play,
  Pause,
} from "lucide-react";
import aptitudeQuestions from "./aptitudeQuestions.json";
import aptitudePrompt from "../../gemini/aptitudePrompt";
import { AIchatSession } from "../../gemini/AiModel";

interface Question {
  question: string;
  options: string[];
  answer: string;
  explanation: string;
  category: string;
}

interface PracticeSession {
  difficulty: string;
  questions: Question[];
  currentQuestionIndex: number;
  selectedAnswers: (string | null)[];
  timeSpent: number[];
  startTime: number;
  isCompleted: boolean;
}

const AptitudePracticePage: React.FC = () => {
  const { difficulty } = useParams<{ difficulty: string }>();
  const navigate = useNavigate();
  
  const [session, setSession] = useState<PracticeSession | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize session
  useEffect(() => {
    if (!difficulty) {
      navigate("/aptitude-training");
      return;
    }

    const generateQuestions = async () => {
      setIsLoading(true);
      try {
        // Try to generate questions using Gemini AI
        const newPrompt = aptitudePrompt
          .replace('${category}', 'logical')
          .replace('${difficulty}', difficulty);

        const result = await AIchatSession.sendMessage(newPrompt);
        const responseText = result.response?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (responseText) {
          // Parse questions
          const questions = responseText
            .split("<questions>")[1]
            .split("***")
            .map((question) => question.trim())
            .filter(q => q.length > 0);

          // Parse options
          const options = responseText
            .split("<options>")[1]
            .split("***")
            .map((option) => option.trim().split("@*@"))
            .filter(opt => opt.length === 4);

          // Parse answers
          const answers = responseText
            .split("<answers>")[1]
            .split("***")
            .map((answer) => answer.trim())
            .filter(a => a.length > 0);

          // Parse explanations
          const explanations = responseText
            .split("<explanations>")[1]
            .split("***")
            .map((explanation) => explanation.trim())
            .filter(e => e.length > 0);

          // Create question objects
          const generatedQuestions: Question[] = questions.map((question, index) => ({
            question: question,
            options: options[index] || [],
            answer: answers[index] || "",
            explanation: explanations[index] || "",
            category: "logical"
          }));

          if (generatedQuestions.length >= 10) {
            setSession({
              difficulty,
              questions: generatedQuestions.slice(0, 10),
              currentQuestionIndex: 0,
              selectedAnswers: new Array(10).fill(null),
              timeSpent: new Array(10).fill(0),
              startTime: Date.now(),
              isCompleted: false
            });
            return;
          }
        }
      } catch (error) {
        console.error("Error generating questions with Gemini:", error);
      } finally {
        setIsLoading(false);
      }

      // Fallback to static questions
      if (aptitudeQuestions[difficulty as keyof typeof aptitudeQuestions]) {
        const questions = aptitudeQuestions[difficulty as keyof typeof aptitudeQuestions] as Question[];
        const shuffledQuestions = questions.sort(() => Math.random() - 0.5).slice(0, 10);

        setSession({
          difficulty,
          questions: shuffledQuestions,
          currentQuestionIndex: 0,
          selectedAnswers: new Array(10).fill(null),
          timeSpent: new Array(10).fill(0),
          startTime: Date.now(),
          isCompleted: false
        });
      } else {
        navigate("/aptitude-training");
      }
    };

    generateQuestions();
  }, [difficulty, navigate]);

  // Timer effect
  useEffect(() => {
    if (!session || session.isCompleted || isPaused) return;

    const interval = setInterval(() => {
      setCurrentTime(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [session, isPaused]);

  // Auto-submit when time runs out
  useEffect(() => {
    if (!session) return;

    const timeLimit = difficulty === "easy" ? 15 : difficulty === "medium" ? 12 : 10;
    
    if (currentTime >= timeLimit && !isAnswerSubmitted) {
      handleSubmitAnswer(null);
    }
  }, [currentTime, session, difficulty, isAnswerSubmitted]);

  const handleOptionSelect = (option: string) => {
    if (isAnswerSubmitted) return;
    setSelectedOption(option);
  };

  const handleSubmitAnswer = useCallback((answer: string | null) => {
    if (!session || isAnswerSubmitted) return;

    const finalAnswer = answer || selectedOption;
    if (!finalAnswer) return;

    setIsAnswerSubmitted(true);
    setShowExplanation(true);

    // Update session
    const newSelectedAnswers = [...session.selectedAnswers];
    newSelectedAnswers[session.currentQuestionIndex] = finalAnswer;

    const newTimeSpent = [...session.timeSpent];
    newTimeSpent[session.currentQuestionIndex] = currentTime;

    setSession(prev => prev ? {
      ...prev,
      selectedAnswers: newSelectedAnswers,
      timeSpent: newTimeSpent
    } : null);
  }, [session, selectedOption, currentTime, isAnswerSubmitted]);

  const handleNextQuestion = () => {
    if (!session) return;

    if (session.currentQuestionIndex < session.questions.length - 1) {
      setSession(prev => prev ? {
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex + 1
      } : null);
      
      // Reset question state
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
      setShowExplanation(false);
      setCurrentTime(0);
    } else {
      // Complete session
      setSession(prev => prev ? { ...prev, isCompleted: true } : null);
      
      // Save results
      saveResults();
      
      // Navigate to results
      navigate(`/aptitude-results/${difficulty}`);
    }
  };

  const saveResults = () => {
    if (!session) return;

    const correctAnswers = session.selectedAnswers.filter((answer, index) => 
      answer === session.questions[index].answer
    ).length;

    const totalTime = session.timeSpent.reduce((sum, time) => sum + time, 0);
    const averageTime = Math.round(totalTime / session.questions.length);

    // Create results object
    const results = {
      difficulty: session.difficulty,
      totalQuestions: session.questions.length,
      correctAnswers,
      totalTime,
      averageTime,
      accuracy: Math.round((correctAnswers / session.questions.length) * 100),
      questions: session.questions.map((question, index) => ({
        question: question.question,
        userAnswer: session.selectedAnswers[index],
        correctAnswer: question.answer,
        isCorrect: session.selectedAnswers[index] === question.answer,
        timeSpent: session.timeSpent[index],
        category: question.category
      })),
      categoryBreakdown: {
        numerical: { correct: 0, total: 0 },
        logical: { correct: 0, total: 0 },
        verbal: { correct: 0, total: 0 }
      }
    };

    // Calculate category breakdown
    session.questions.forEach((question, index) => {
      const category = question.category as keyof typeof results.categoryBreakdown;
      results.categoryBreakdown[category].total++;
      if (session.selectedAnswers[index] === question.answer) {
        results.categoryBreakdown[category].correct++;
      }
    });

    // Save results
    localStorage.setItem("aptitudeResults", JSON.stringify(results));

    // Update stats
    const existingStats = localStorage.getItem("aptitudeStats");
    const stats = existingStats ? JSON.parse(existingStats) : {
      totalQuestions: 0,
      correctAnswers: 0,
      averageTime: 0,
      bestScore: 0,
      categories: { numerical: 0, logical: 0, verbal: 0 }
    };

    // Update category counts
    session.questions.forEach((question, index) => {
      if (session.selectedAnswers[index] === question.answer) {
        stats.categories[question.category as keyof typeof stats.categories]++;
      }
    });

    stats.totalQuestions += session.questions.length;
    stats.correctAnswers += correctAnswers;
    stats.averageTime = Math.round((stats.averageTime * (stats.totalQuestions - session.questions.length) + totalTime) / stats.totalQuestions);
    stats.bestScore = Math.max(stats.bestScore, correctAnswers);

    localStorage.setItem("aptitudeStats", JSON.stringify(stats));
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimeLimit = () => {
    return difficulty === "easy" ? 15 : difficulty === "medium" ? 12 : 10;
  };

  const getProgressPercentage = () => {
    if (!session) return 0;
    return ((session.currentQuestionIndex + 1) / session.questions.length) * 100;
  };

  const getCurrentQuestion = () => {
    if (!session) return null;
    return session.questions[session.currentQuestionIndex];
  };

  const isCorrect = (option: string) => {
    const question = getCurrentQuestion();
    return question && option === question.answer;
  };

  const isSelected = (option: string) => {
    return selectedOption === option;
  };

  const isWrong = (option: string) => {
    const question = getCurrentQuestion();
    return question && isAnswerSubmitted && option === selectedOption && option !== question.answer;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-8 w-full">
        <div className="container mx-auto max-w-3xl">
          <div className="h-6 w-40 bg-gray-700 rounded mb-8 animate-pulse" />
          <header className="text-center mb-10">
            <div className="h-10 w-64 bg-gray-700 rounded mx-auto animate-pulse" />
            <div className="h-5 w-48 bg-gray-700 rounded mx-auto mt-3 animate-pulse" />
          </header>
          <div className="bg-gray-800 p-8 rounded-lg shadow-xl">
            <div className="space-y-3 mb-6">
              <div className="h-5 w-3/4 bg-gray-700 rounded animate-pulse" />
              <div className="h-5 w-2/3 bg-gray-700 rounded animate-pulse" />
            </div>
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, idx) => (
                <div key={idx} className="w-full h-12 bg-gray-700 rounded-md animate-pulse" />
              ))}
            </div>
            <p className="text-gray-400 text-center mt-6">Generating questions with AI...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!session || !getCurrentQuestion()) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-8 w-full">
        <div className="container mx-auto max-w-3xl">
          <div className="h-6 w-40 bg-gray-700 rounded mb-8 animate-pulse" />
          <header className="text-center mb-10">
            <div className="h-10 w-64 bg-gray-700 rounded mx-auto animate-pulse" />
            <div className="h-5 w-48 bg-gray-700 rounded mx-auto mt-3 animate-pulse" />
          </header>
          <div className="bg-gray-800 p-8 rounded-lg shadow-xl">
            <div className="space-y-3 mb-6">
              <div className="h-5 w-3/4 bg-gray-700 rounded animate-pulse" />
              <div className="h-5 w-2/3 bg-gray-700 rounded animate-pulse" />
            </div>
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, idx) => (
                <div key={idx} className="w-full h-12 bg-gray-700 rounded-md animate-pulse" />
              ))}
            </div>
            <p className="text-gray-400 text-center mt-6">Loading questions...</p>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = getCurrentQuestion()!;
  const timeLimit = getTimeLimit();
  const timeRemaining = timeLimit - currentTime;
  const progressPercentage = getProgressPercentage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="container mx-auto px-4 py-6">
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
            <div className="flex items-center bg-gray-800 rounded-lg px-4 py-2">
              <Brain className="w-5 h-5 mr-2 text-indigo-400" />
              <span className="text-sm font-medium">
                {session.currentQuestionIndex + 1} / {session.questions.length}
              </span>
            </div>

            <div className="flex items-center bg-gray-800 rounded-lg px-4 py-2">
              <Timer className="w-5 h-5 mr-2 text-red-400" />
              <span className={`text-sm font-medium ${timeRemaining <= 5 ? 'text-red-400' : 'text-gray-300'}`}>
                {formatTime(timeRemaining)}
              </span>
            </div>

            <button
              onClick={() => setIsPaused(!isPaused)}
              className="bg-gray-800 hover:bg-gray-700 rounded-lg p-2 transition-colors"
            >
              {isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-400 mb-2">
            <span>Progress</span>
            <span>{Math.round(progressPercentage)}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Question Card */}
        <motion.div
          key={session.currentQuestionIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="bg-gray-800 rounded-xl p-8 border border-gray-700 mb-8"
        >
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-400 uppercase tracking-wide">
                {currentQuestion.category} • {difficulty}
              </span>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-400">
                  {formatTime(session.timeSpent[session.currentQuestionIndex] || currentTime)}
                </span>
              </div>
            </div>
            
            <h2 className="text-2xl font-semibold leading-relaxed">
              {currentQuestion.question}
            </h2>
          </div>

          {/* Options */}
          <div className="space-y-4 mb-8">
            {currentQuestion.options.map((option, index) => (
              <motion.button
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => handleOptionSelect(option)}
                disabled={isAnswerSubmitted}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-300 ${
                  isAnswerSubmitted
                    ? isCorrect(option)
                      ? 'bg-green-600/20 border-green-500 text-green-100'
                      : isWrong(option)
                      ? 'bg-red-600/20 border-red-500 text-red-100'
                      : 'bg-gray-700/50 border-gray-600 text-gray-300'
                    : isSelected(option)
                    ? 'bg-indigo-600/20 border-indigo-500 text-indigo-100'
                    : 'bg-gray-700/50 border-gray-600 text-gray-300 hover:bg-gray-700 hover:border-gray-500'
                } ${!isAnswerSubmitted ? 'cursor-pointer' : 'cursor-not-allowed'}`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-lg">{option}</span>
                  {isAnswerSubmitted && (
                    <div className="flex items-center">
                      {isCorrect(option) && <CheckCircle className="w-5 h-5 text-green-400" />}
                      {isWrong(option) && <XCircle className="w-5 h-5 text-red-400" />}
                    </div>
                  )}
                </div>
              </motion.button>
            ))}
          </div>

          {/* Submit Button */}
          {!isAnswerSubmitted && selectedOption && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={() => handleSubmitAnswer(selectedOption)}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Submit Answer
            </motion.button>
          )}

          {/* Explanation */}
          <AnimatePresence>
            {showExplanation && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-6 p-4 bg-gray-700/50 rounded-lg border border-gray-600"
              >
                <h4 className="font-semibold text-indigo-400 mb-2">Explanation:</h4>
                <p className="text-gray-300">{currentQuestion.explanation}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Next Button */}
          <AnimatePresence>
            {isAnswerSubmitted && (
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={handleNextQuestion}
                className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                {session.currentQuestionIndex < session.questions.length - 1 ? 'Next Question' : 'Finish Practice'}
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Timer Warning */}
        {timeRemaining <= 5 && timeRemaining > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="fixed top-4 right-4 bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg"
          >
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              <span className="font-semibold">{timeRemaining}s remaining!</span>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AptitudePracticePage; 