import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  RotateCcw,
  BrainCircuit,
} from "lucide-react";
import { AIchatSession } from "../../gemini/AiModel";
import osPrompt from "../../gemini/osPrompt";
import { useThemeSelector } from "../../store/hooks";

interface Question {
  question: string;
  options: string[];
  answer: string;
  explanation: string;
}

interface QuizSession {
  questions: Question[];
  currentQuestionIndex: number;
  selectedAnswers: (string | null)[];
  startTime: number;
  isCompleted: boolean;
}

const OperatingSystemsPage: React.FC = () => {
  const [session, setSession] = useState<QuizSession | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [score, setScore] = useState(0);
  const darkMode = useThemeSelector((state) => state.theme.darkMode);

  const generateQuestions = async () => {
    setIsLoading(true);
    try {
      const result = await AIchatSession.sendMessage(osPrompt);
      const responseText = result.response?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (responseText) {
        // Parse questions
        const questionsMatch = responseText.match(/<questions>(.*?)<\/questions>/s);
        const questions = questionsMatch?.[1]
          ?.split("***")
          .map((q) => q.trim())
          .filter((q) => q.length > 0) || [];

        // Parse options
        const optionsMatch = responseText.match(/<options>(.*?)<\/options>/s);
        const options = optionsMatch?.[1]
          ?.split("***")
          .map((opt) => opt.trim().split("@*@"))
          .filter((opt) => opt.length === 4) || [];

        // Parse answers
        const answersMatch = responseText.match(/<answers>(.*?)<\/answers>/s);
        const answers = answersMatch?.[1]
          ?.split("***")
          .map((ans) => ans.trim())
          .filter((ans) => ans.length > 0) || [];

        // Parse explanations
        const explanationsMatch = responseText.match(/<explanations>(.*?)<\/explanations>/s);
        const explanations = explanationsMatch?.[1]
          ?.split("***")
          .map((exp) => exp.trim())
          .filter((exp) => exp.length > 0) || [];

        // Create question objects
        const generatedQuestions: Question[] = questions.map((question, index) => ({
          question: question,
          options: options[index] || [],
          answer: answers[index] || "",
          explanation: explanations[index] || "",
        }));

        if (generatedQuestions.length > 0) {
          setSession({
            questions: generatedQuestions,
            currentQuestionIndex: 0,
            selectedAnswers: new Array(generatedQuestions.length).fill(null),
            startTime: Date.now(),
            isCompleted: false,
          });
        } else {
          throw new Error("Failed to generate questions");
        }
      } else {
        throw new Error("No response from AI");
      }
    } catch (error) {
      console.error("Error generating OS questions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    generateQuestions();
  }, []);

  const handleOptionSelect = (option: string) => {
    if (!showExplanation) {
      setSelectedOption(option);
    }
  };

  const handleSubmitAnswer = () => {
    if (!selectedOption || !session) return;

    const updatedAnswers = [...session.selectedAnswers];
    updatedAnswers[session.currentQuestionIndex] = selectedOption;
    
    setSession({ ...session, selectedAnswers: updatedAnswers });
    setShowExplanation(true);

    // Update score if correct
    if (selectedOption === session.questions[session.currentQuestionIndex].answer) {
      setScore(score + 1);
    }
  };

  const handleNextQuestion = () => {
    if (!session) return;

    const nextIndex = session.currentQuestionIndex + 1;
    
    if (nextIndex >= session.questions.length) {
      setSession({ ...session, isCompleted: true });
    } else {
      setSession({ ...session, currentQuestionIndex: nextIndex });
      setSelectedOption(null);
      setShowExplanation(false);
    }
  };

  const handleRestartQuiz = () => {
    setScore(0);
    setSelectedOption(null);
    setShowExplanation(false);
    generateQuestions();
  };

  if (isLoading) {
    return (
      <div className={`${darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"} min-h-screen flex items-center justify-center p-4 sm:p-8`}>
        <div className="text-center">
          <div className={`animate-spin rounded-full h-16 w-16 border-b-2 mx-auto mb-4 ${darkMode ? "border-indigo-400" : "border-indigo-600"}`}></div>
          <p className={`text-lg ${darkMode ? "text-gray-300" : "text-gray-600"}`}>Generating Operating Systems questions...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className={`${darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"} min-h-screen flex items-center justify-center p-4 sm:p-8`}>
        <div className="text-center">
          <XCircle size={48} className={darkMode ? "text-red-400 mx-auto mb-4" : "text-red-600 mx-auto mb-4"} />
          <p className={`text-lg mb-4 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>Failed to generate questions</p>
          <button
            onClick={generateQuestions}
            className={`bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg transition-colors`}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (session.isCompleted) {
    const percentage = Math.round((score / session.questions.length) * 100);
    return (
      <div className={`${darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"} min-h-screen p-4 sm:p-8 w-full`}>
        <div className="container mx-auto max-w-3xl">
          <Link
            to="/technical-questions"
            className={`flex items-center gap-2 mb-8 transition-colors ${darkMode ? "text-indigo-400 hover:text-indigo-300" : "text-indigo-600 hover:text-indigo-400"}`}
          >
            <ArrowLeft size={20} />
            Back to Technical Questions
          </Link>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`${darkMode ? "bg-gray-800" : "bg-indigo-50"} p-8 rounded-lg shadow-xl text-center`}
          >
            <CheckCircle size={48} className={darkMode ? "text-green-400 mx-auto mb-4" : "text-green-600 mx-auto mb-4"} />
            <h1 className="text-3xl font-bold mb-4">Operating Systems Quiz Completed!</h1>
            <p className={`text-xl mb-6 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
              You scored {score} out of {session.questions.length} ({percentage}%)
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleRestartQuiz}
                className={`bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg transition-colors flex items-center gap-2 justify-center`}
              >
                <RotateCcw size={18} />
                Take Another Quiz
              </button>
              <Link
                to="/technical-questions"
                className={`${darkMode ? "bg-gray-600 hover:bg-gray-700 text-white" : "bg-gray-200 hover:bg-gray-300 text-gray-900"} px-6 py-3 rounded-lg transition-colors text-center`}
              >
                Back to Topics
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  const currentQuestion = session.questions[session.currentQuestionIndex];
  const isCorrect = selectedOption === currentQuestion.answer;

  return (
    <div className={`${darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"} min-h-screen p-4 sm:p-8 w-full`}>
      <div className="container mx-auto max-w-3xl">
        <Link
          to="/technical-questions"
          className={`flex items-center gap-2 mb-8 transition-colors ${darkMode ? "text-indigo-400 hover:text-indigo-300" : "text-indigo-600 hover:text-indigo-400"}`}
        >
          <ArrowLeft size={20} />
          Back to Technical Questions
        </Link>
        <header className="text-center mb-10">
          <div className="flex items-center justify-center gap-2 mb-2">
            <BrainCircuit className={darkMode ? "text-indigo-400" : "text-indigo-600"} size={32} />
            <h1 className="text-3xl md:text-4xl font-bold">Operating Systems</h1>
          </div>
          <p className={`text-lg ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
            Question {session.currentQuestionIndex + 1} of {session.questions.length}
          </p>
        </header>
        <motion.div
          key={session.currentQuestionIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className={`${darkMode ? "bg-gray-800" : "bg-indigo-50"} p-8 rounded-lg shadow-xl`}
        >
          <h2 className={`text-2xl font-semibold mb-6 ${darkMode ? "text-white" : "text-gray-900"}`}>{currentQuestion.question}</h2>
          <div className="space-y-4">
            {currentQuestion.options.map((option, index) => {
              const isSelected = selectedOption === option;
              let buttonClass = darkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-indigo-100 hover:bg-indigo-200";
              if (showExplanation) {
                if (option === currentQuestion.answer) {
                  buttonClass = darkMode ? "bg-green-600 text-white" : "bg-green-200 text-green-900";
                } else if (isSelected && !isCorrect) {
                  buttonClass = darkMode ? "bg-red-600 text-white" : "bg-red-200 text-red-900";
                }
              } else if (isSelected) {
                buttonClass = darkMode ? "bg-indigo-600 text-white" : "bg-indigo-500 text-white";
              }
              return (
                <button
                  key={index}
                  onClick={() => handleOptionSelect(option)}
                  disabled={showExplanation}
                  className={`w-full text-left p-4 rounded-md transition-colors duration-300 flex items-center justify-between ${buttonClass} ${!showExplanation ? "cursor-pointer" : "cursor-not-allowed"}`}
                >
                  <span>{option}</span>
                  {showExplanation && (
                    <div className="flex items-center gap-2">
                      {option === currentQuestion.answer ? (
                        <CheckCircle size={20} className={darkMode ? "text-green-200" : "text-green-700"} />
                      ) : isSelected ? (
                        <XCircle size={20} className={darkMode ? "text-red-200" : "text-red-700"} />
                      ) : null}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
          <AnimatePresence>
            {showExplanation && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className={`mt-6 p-4 rounded-lg ${darkMode ? "bg-gray-700" : "bg-indigo-100"}`}
              >
                <p className={darkMode ? "text-gray-300" : "text-gray-700"}>
                  <strong>Explanation:</strong> {currentQuestion.explanation}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
          <div className="mt-8 flex justify-between items-center">
            <div className={darkMode ? "text-sm text-gray-400" : "text-sm text-gray-600"}>
              Score: {score}/{session.currentQuestionIndex + (showExplanation ? 1 : 0)}
            </div>
            {!showExplanation ? (
              <button
                onClick={handleSubmitAnswer}
                disabled={!selectedOption}
                className={`px-6 py-3 rounded-lg transition-colors ${darkMode ? "bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white" : "bg-indigo-500 hover:bg-indigo-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white"}`}
              >
                Submit Answer
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                className={`px-6 py-3 rounded-lg transition-colors ${darkMode ? "bg-green-600 hover:bg-green-700 text-white" : "bg-green-500 hover:bg-green-600 text-white"}`}
              >
                {session.currentQuestionIndex === session.questions.length - 1 ? "Finish Quiz" : "Next Question"}
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default OperatingSystemsPage;
