import { useState, useEffect, useMemo } from "react";
import { useThemeSelector } from "../../store/hooks";
import { Calendar, Award, X,CheckCircle, XCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface DailyQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: string;
  date: string;
  category: string;
}

const QuestionOfTheDay = () => {
  const [dailyQuestion, setDailyQuestion] = useState<DailyQuestion | null>(null);
  const darkMode = useThemeSelector((state) => state.theme.darkMode);
  const [showModal, setShowModal] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [hasAnsweredToday, setHasAnsweredToday] = useState(false);
  const [streak, setStreak] = useState(0);

  const sampleQuestions = useMemo(() => [
    {
      question: "What is the time complexity of binary search?",
      options: ["O(n)", "O(log n)", "O(n log n)", "O(1)"],
      correctAnswer: "O(log n)",
      category: "Data Structures & Algorithms"
    },
    {
      question: "Which HTTP method is idempotent?",
      options: ["POST", "PUT", "PATCH", "DELETE"],
      correctAnswer: "PUT",
      category: "Web Development"
    },
    {
      question: "What does REST stand for?",
      options: ["Representational State Transfer", "Remote State Transfer", "Reliable State Transfer", "Responsive State Transfer"],
      correctAnswer: "Representational State Transfer",
      category: "Web Development"
    },
    {
      question: "Which data structure uses LIFO principle?",
      options: ["Queue", "Stack", "Array", "Linked List"],
      correctAnswer: "Stack",
      category: "Data Structures"
    },
    {
      question: "What is the default port for HTTPS?",
      options: ["80", "8080", "443", "3000"],
      correctAnswer: "443",
      category: "Networking"
    },
    {
      question: "Which sorting algorithm has the best average time complexity?",
      options: ["Bubble Sort", "Quick Sort", "Selection Sort", "Insertion Sort"],
      correctAnswer: "Quick Sort",
      category: "Algorithms"
    },
    {
      question: "What does SQL stand for?",
      options: ["Structured Query Language", "Standard Query Language", "Simple Query Language", "Sequential Query Language"],
      correctAnswer: "Structured Query Language",
      category: "Database"
    },
    {
      question: "Which is NOT a JavaScript primitive type?",
      options: ["string", "number", "object", "boolean"],
      correctAnswer: "object",
      category: "JavaScript"
    }
  ], []);

  useEffect(() => {
    const generateDailyQuestion = () => {
      const today = new Date().toDateString();
      const storedQuestion = localStorage.getItem('dailyQuestion');
      
      if (storedQuestion) {
        const parsed = JSON.parse(storedQuestion);
        if (parsed.date === today) {
          setDailyQuestion(parsed);
          return;
        }
      }

      const questionIndex = getDailyQuestionIndex();
      const baseQuestion = sampleQuestions[questionIndex % sampleQuestions.length];
      
      const newDailyQuestion: DailyQuestion = {
        id: questionIndex,
        question: baseQuestion.question,
        options: baseQuestion.options,
        correctAnswer: baseQuestion.correctAnswer,
        date: today,
        category: baseQuestion.category
      };

      setDailyQuestion(newDailyQuestion);
      localStorage.setItem('dailyQuestion', JSON.stringify(newDailyQuestion));
    };

    const checkIfAnsweredToday = () => {
      const today = new Date().toDateString();
      const answered = localStorage.getItem(`answeredQOD_${today}`);
      setHasAnsweredToday(!!answered);
    };

    const loadStreak = () => {
      const storedStreak = localStorage.getItem('qodStreak');
      if (storedStreak) {
        setStreak(parseInt(storedStreak));
      }
    };

    generateDailyQuestion();
    checkIfAnsweredToday();
    loadStreak();
  }, [sampleQuestions]);

  const getDailyQuestionIndex = () => {
    const today = new Date();
    const start = new Date(today.getFullYear(), 0, 1);
    const dayOfYear = Math.floor((today.getTime() - start.getTime()) / (24 * 60 * 60 * 1000));
    return dayOfYear;
  };

  const handleOptionSelect = (option: string) => {
    if (showAnswer || hasAnsweredToday) return;
    
    setSelectedOption(option);
    setShowAnswer(true);
    
    const today = new Date().toDateString();
    const isCorrect = option === dailyQuestion?.correctAnswer;
    
    // Mark as answered today
    localStorage.setItem(`answeredQOD_${today}`, JSON.stringify({
      answered: true,
      correct: isCorrect,
      option: option
    }));
    
    setHasAnsweredToday(true);
    
    // Update streak
    updateStreak(isCorrect);
  };

  const updateStreak = (isCorrect: boolean) => {
    const today = new Date().toDateString();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toDateString();
    
    const lastAnswered = localStorage.getItem('lastQODDate');
    
    if (isCorrect) {
      if (lastAnswered === yesterdayStr) {
        const newStreak = streak + 1;
        setStreak(newStreak);
        localStorage.setItem('qodStreak', newStreak.toString());
        
        const longestStreak = parseInt(localStorage.getItem('qodLongestStreak') || '0');
        if (newStreak > longestStreak) {
          localStorage.setItem('qodLongestStreak', newStreak.toString());
        }
      } else {
        // Start new streak
        setStreak(1);
        localStorage.setItem('qodStreak', '1');
      }
    } else {
      setStreak(0);
      localStorage.setItem('qodStreak', '0');
    }
    
    localStorage.setItem('lastQODDate', today);
  };

  const getPreviousAnswer = () => {
    const today = new Date().toDateString();
    const stored = localStorage.getItem(`answeredQOD_${today}`);
    if (stored) {
      const parsed = JSON.parse(stored);
      setSelectedOption(parsed.option);
      setShowAnswer(true);
    }
  };

  useEffect(() => {
    if (hasAnsweredToday && dailyQuestion) {
      getPreviousAnswer();
    }
  }, [hasAnsweredToday, dailyQuestion]);

  if (!dailyQuestion) return null;

  return (
    <>
      {/* Header Icon */}
      <div className="relative">
        <button
          onClick={() => setShowModal(true)}
          className={`p-2 rounded-full transition-all duration-300 relative shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50 ${darkMode ? "hover:bg-gray-700" : "hover:bg-gray-200"}`}
          title="Question of the Day"
        >
          <Calendar className={`h-6 w-6 transition-colors duration-300 ${darkMode ? "text-indigo-400 hover:text-indigo-300" : "text-indigo-600 hover:text-indigo-400"}`} />
          {!hasAnsweredToday && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping after:content-[''] after:absolute after:inset-0 after:bg-red-500 after:rounded-full after:opacity-75 after:animate-pulse"></div>
          )}
          {streak > 0 && (
            <div className="aabsolute -bottom-1 -right-1 bg-yellow-400 text-xs rounded-full w-5 h-5 flex items-center justify-center text-black font-bold shadow-inner border-2 border-gray-800">
              {streak}
            </div>
          )}
        </button>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className={`${darkMode ? "bg-gray-800" : "bg-white"} rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className={`flex justify-between items-center p-6 border-b rounded-t-xl backdrop-blur-md ${darkMode ? "border-gray-700 bg-gray-900/60" : "border-gray-200 bg-gray-100/60"}`}>
                <div>
                  <h2 className={`text-2xl font-bold flex items-center gap-2 ${darkMode ? "text-indigo-400" : "text-indigo-700"}`}>
                    <Calendar className="h-6 w-6 animate-pulse-slow" />
                    Question of the Day
                  </h2>
                  <p className={`text-sm mt-1 tracking-wide ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                    {dailyQuestion.category} • {new Date().toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className={`transition-colors duration-300 p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500/50 ${darkMode ? "text-gray-400 hover:text-white hover:bg-gray-700" : "text-gray-500 hover:text-black hover:bg-gray-200"}`}
                >
                  <X size={24} />
                </button>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Streak Info */}
                {streak > 0 && (
                  <div className="relative bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-xl p-5 mb-6 shadow-inner overflow-hidden">
                    <div className="flex items-center gap-3 relative z-10">
                      <Award className="h-6 w-6 text-yellow-400 drop-shadow-lg" />
                      <span className="font-semibold text-yellow-400 text-lg tracking-wide">
                        {streak} Day Streak! 🔥
                      </span>
                    </div>
                    <p className={`text-sm mt-2 pl-9 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                      Keep it up! Answer correctly to maintain your streak.
                    </p>
                  </div>
                )}

                {/* Question */}
                <div className={`mb-6 p-5 rounded-xl shadow-lg relative ${darkMode ? "bg-gradient-to-r from-gray-700 via-gray-800 to-gray-700" : "bg-gradient-to-r from-indigo-100 via-white to-indigo-100"}`}>
                  <div className={`absolute inset-0 rounded-xl border pointer-events-none ${darkMode ? "border-gray-600/40" : "border-indigo-200/40"}`}></div>
                  <h3 className={`text-2xl font-bold drop-shadow-md mb-2 ${darkMode ? "text-indigo-300" : "text-indigo-700"}`}>
                    {dailyQuestion.question}
                  </h3>
                  <div className={`h-1 w-16 rounded-full mb-4 ${darkMode ? "bg-indigo-500" : "bg-indigo-300"}`}></div>
                </div>

                {/* Options */}
                <div className="space-y-3">
                  {dailyQuestion.options.map((option, index) => {
                    const isSelected = selectedOption === option;
                    const isCorrect = option === dailyQuestion.correctAnswer;
                    let buttonClass = darkMode ? "bg-gray-700 hover:bg-gray-600 border-gray-600 text-white" : "bg-indigo-100 hover:bg-indigo-200 border-indigo-200 text-gray-900";
                    if (showAnswer) {
                      if (isCorrect) {
                        buttonClass = darkMode
                          ? "bg-green-600 border-green-500 text-white animate-pulse shadow-lg shadow-green-500/40"
                          : "bg-green-200 border-green-400 text-green-900 animate-pulse shadow-lg shadow-green-200/40";
                      } else if (isSelected && !isCorrect) {
                        buttonClass = darkMode
                          ? "bg-red-600 border-red-500 text-white animate-shake shadow-lg shadow-red-500/40"
                          : "bg-red-200 border-red-400 text-red-900 animate-shake shadow-lg shadow-red-200/40";
                      }
                    } else if (isSelected) {
                      buttonClass = darkMode
                        ? "bg-indigo-600 border-indigo-500 text-white shadow-md shadow-indigo-500/30"
                        : "bg-indigo-500 border-indigo-400 text-white shadow-md shadow-indigo-200/30";
                    }
                    return (
                      <button
                        key={index}
                        onClick={() => handleOptionSelect(option)}
                        disabled={showAnswer || hasAnsweredToday}
                        className={`w-full py-3 px-4 rounded-lg text-left font-medium transition-all duration-300  ${buttonClass} ${
                          !showAnswer && !hasAnsweredToday 
                            ? 'cursor-pointer hover:scale-[1.02]' 
                            : 'cursor-not-allowed'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className={darkMode ? "text-white" : "text-gray-900"}>{option}</span>
                          {showAnswer && isCorrect && (
                            <div className={`flex items-center gap-1 font-bold animate-bounce ${darkMode ? "text-green-400" : "text-green-700"}`}> <CheckCircle className="w-5 h-5" /> Correct</div>
                          )}
                          {showAnswer && isSelected && !isCorrect && (
                            <div className={`flex items-center gap-1 font-bold animate-shake ${darkMode ? "text-red-400" : "text-red-700"}`}><XCircle className="w-5 h-5" /> Wrong</div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Result */}
              {showAnswer && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`${darkMode ? "bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 border-gray-600" : "bg-gradient-to-br from-indigo-100 via-white to-indigo-200 border-indigo-200"} rounded-lg p-4 border shadow-lg`}
                >
                  <div className="text-center">
                    {selectedOption === dailyQuestion.correctAnswer ? (
                      <div className={`space-y-2 ${darkMode ? "text-green-400" : "text-green-700"}`}>
                        <CheckCircle className={`mx-auto h-10 w-10 animate-bounce ${darkMode ? "text-green-400" : "text-green-700"}`} />
                        <div className="text-2xl mb-2">🎉</div>
                        <h4 className="font-semibold text-xl">Correct!</h4>
                        <p className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                          Great job! Come back tomorrow for another question.
                        </p>
                      </div>
                    ) : (
                      <div className={`space-y-2 ${darkMode ? "text-red-400" : "text-red-700"}`}>
                        <XCircle className={`mx-auto h-10 w-10 animate-shake ${darkMode ? "text-red-400" : "text-red-700"}`} />
                        <h4 className="font-semibold text-lg">Not quite right</h4>
                        <p className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                          The correct answer is: <strong className={darkMode ? "text-green-400" : "text-green-700"}>{dailyQuestion.correctAnswer}</strong>
                        </p>
                        <p className={`text-sm mt-1 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                          Don't worry! Come back tomorrow for another chance.
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {hasAnsweredToday && !showAnswer && (
                <div className={`${darkMode ? "bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 border-gray-600" : "bg-gradient-to-br from-indigo-100 via-white to-indigo-200 border-indigo-200"} rounded-lg p-4 text-center border shadow-md`}>
                  <Calendar className={`h-8 w-8 animate-pulse ${darkMode ? "text-indigo-400" : "text-indigo-700"}`} />
                  <p className={darkMode ? "text-gray-300" : "text-gray-700"}>
                    You've already answered today's question! Come back tomorrow for a new one.
                  </p>
                </div>
              )}

              {/* Footer */}
              <div className={`px-6 py-4 border-t backdrop-blur-md ${darkMode ? "border-gray-700 bg-gradient-to-r from-gray-800 via-gray-750 to-gray-800" : "border-indigo-200 bg-gradient-to-r from-indigo-100 via-white to-indigo-100"}`}>
                <div className="flex justify-between items-center">
                  <div className={`text-sm italic ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                    🌙 New question every day at midnight
                  </div>
                  <button
                    onClick={() => setShowModal(false)}
                    className={`px-4 py-2 rounded transition ${darkMode ? "bg-indigo-600 hover:bg-indigo-700 text-white" : "bg-indigo-500 hover:bg-indigo-600 text-white"}`}
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default QuestionOfTheDay;
