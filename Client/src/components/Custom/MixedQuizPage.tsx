// import React, { useState, useEffect, useCallback } from "react";
// import { Link } from "react-router-dom";
// import { motion, AnimatePresence } from "framer-motion";
// <<<<<<< HEAD
// import { ArrowLeft, CheckCircle, XCircle, RotateCcw } from "lucide-react";
// import { AIchatSession } from "../../gemini/AiModel";
// import technicalPrompt from "../../gemini/technicalPrompt";
// import { useDarkMode } from "../Custom/DarkModeContext";
// =======
// import {
//   ArrowLeft,
//   CheckCircle,
//   XCircle,
//   RotateCcw,
//   Clock,
//   Play,
//   Pause,
// } from "lucide-react";
// import { AIchatSession } from "../../gemini/AiModel";
// import technicalPrompt from "../../gemini/technicalPrompt";
// import { usePracticeTimer } from "../../hooks/usePracticeTimer";
// >>>>>>> upstream/main

// interface Question {
//   question: string;
//   options: string[];
//   answer: string;
//   explanation: string;
// }

// interface QuizSession {
//   questions: Question[];
//   currentQuestionIndex: number;
//   selectedAnswers: (string | null)[];
//   startTime: number;
//   isCompleted: boolean;
// }

// const MixedQuizPage: React.FC = () => {
//   const { darkMode } = useDarkMode();
//   const [session, setSession] = useState<QuizSession | null>(null);
//   const [selectedOption, setSelectedOption] = useState<string | null>(null);
//   const [showExplanation, setShowExplanation] = useState(false);
//   const [isLoading, setIsLoading] = useState(true);
//   const [score, setScore] = useState(0);

//   // Timer hook - 15 minutes for mixed quiz
//   const {
//     remainingTime,
//     isRunning,
//     isExpired,
//     formatTime,
//     startTimer,
//     pauseTimer,
//     getElapsedTimeFormatted
//   } = usePracticeTimer({
//     duration: 900, // 15 minutes
//     autoStart: false, // Start manually after questions are loaded
//     onTimeUp: () => {
//       // Auto-complete quiz when time expires
//       if (session && !session.isCompleted) {
//         setSession({ ...session, isCompleted: true });
//       }
//     }
//   });

//   const generateQuestions = useCallback(async () => {
//     setIsLoading(true);
//     try {
//       const result = await AIchatSession.sendMessage(technicalPrompt);
//       const responseText = result.response?.candidates?.[0]?.content?.parts?.[0]?.text;

//       if (responseText) {
//         const questionsMatch = responseText.match(/<questions>(.*?)<\/questions>/s);
//         const questions = questionsMatch?.[1]
//           ?.split("***")
//           .map((q) => q.trim())
//           .filter((q) => q.length > 0) || [];

//         const optionsMatch = responseText.match(/<options>(.*?)<\/options>/s);
//         const options = optionsMatch?.[1]
//           ?.split("***")
//           .map((opt) => opt.trim().split("@*@"))
//           .filter((opt) => opt.length === 4) || [];

//         const answersMatch = responseText.match(/<answers>(.*?)<\/answers>/s);
//         const answers = answersMatch?.[1]
//           ?.split("***")
//           .map((ans) => ans.trim())
//           .filter((ans) => ans.length > 0) || [];

//         const explanationsMatch = responseText.match(/<explanations>(.*?)<\/explanations>/s);
//         const explanations = explanationsMatch?.[1]
//           ?.split("***")
//           .map((exp) => exp.trim())
//           .filter((exp) => exp.length > 0) || [];

//         const generatedQuestions: Question[] = questions.map((question, index) => ({
//           question: question,
//           options: options[index] || [],
//           answer: answers[index] || "",
//           explanation: explanations[index] || "",
//         }));

//         if (generatedQuestions.length > 0) {
//           setSession({
//             questions: generatedQuestions,
//             currentQuestionIndex: 0,
//             selectedAnswers: new Array(generatedQuestions.length).fill(null),
//             startTime: Date.now(),
//             isCompleted: false,
//           });
// <<<<<<< HEAD
//         } else throw new Error("Failed to generate questions");
//       } else throw new Error("No response from AI");
// =======
//           // Start timer after questions are loaded
//           startTimer();
//         } else {
//           throw new Error("Failed to generate questions");
//         }
//       } else {
//         throw new Error("No response from AI");
//       }
// >>>>>>> upstream/main
//     } catch (error) {
//       console.error("Error generating questions:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   }, [startTimer]);

//   useEffect(() => {
//     generateQuestions();
//   }, [generateQuestions]);

//   const handleOptionSelect = (option: string) => {
//     if (!showExplanation) setSelectedOption(option);
//   };

//   const handleSubmitAnswer = () => {
//     if (!selectedOption || !session) return;

//     const updatedAnswers = [...session.selectedAnswers];
//     updatedAnswers[session.currentQuestionIndex] = selectedOption;

//     setSession({ ...session, selectedAnswers: updatedAnswers });
//     setShowExplanation(true);

//     if (selectedOption === session.questions[session.currentQuestionIndex].answer) {
//       setScore(score + 1);
//     }
//   };

//   const handleNextQuestion = () => {
//     if (!session) return;
//     const nextIndex = session.currentQuestionIndex + 1;
//     if (nextIndex >= session.questions.length) {
//       setSession({ ...session, isCompleted: true });
//     } else {
//       setSession({ ...session, currentQuestionIndex: nextIndex });
//       setSelectedOption(null);
//       setShowExplanation(false);
//     }
//   };

//   const handleRestartQuiz = () => {
//     setScore(0);
//     setSelectedOption(null);
//     setShowExplanation(false);
//     generateQuestions();
//   };

//   const bgClass = darkMode ? "bg-gray-900" : "bg-gray-100";
//   const cardClass = darkMode ? "bg-gray-800 text-gray-200" : "bg-white text-gray-900";
//   const textClass = darkMode ? "text-gray-200" : "text-gray-900";
//   const subTextClass = darkMode ? "text-gray-400" : "text-gray-600";

//   if (isLoading) {
//     return (
//       <div className={`${bgClass} min-h-screen flex items-center justify-center p-4 sm:p-8 transition-colors duration-500`}>
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-400 mx-auto mb-4"></div>
//           <p className={`${subTextClass} text-lg`}>Generating your mixed quiz...</p>
//         </div>
//       </div>
//     );
//   }

//   if (!session) {
//     return (
//       <div className={`${bgClass} min-h-screen flex items-center justify-center p-4 sm:p-8 transition-colors duration-500`}>
//         <div className="text-center">
//           <XCircle size={48} className="text-red-400 mx-auto mb-4" />
//           <p className={`${subTextClass} text-lg mb-4`}>Failed to generate questions</p>
//           <button
//             onClick={generateQuestions}
//             className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg transition-colors"
//           >
//             Try Again
//           </button>
//         </div>
//       </div>
//     );
//   }

//   if (session.isCompleted) {
//     const percentage = Math.round((score / session.questions.length) * 100);

//     return (
//       <div className={`${bgClass} min-h-screen p-4 sm:p-8 transition-colors duration-500`}>
//         <div className="container mx-auto max-w-3xl">
//           <Link
//             to="/technical-questions"
//             className={`flex items-center gap-2 ${darkMode ? "text-indigo-400 hover:text-indigo-300" : "text-indigo-600 hover:text-indigo-500"} transition-colors mb-8`}
//           >
//             <ArrowLeft size={20} />
//             Back to Technical Questions
//           </Link>

//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             className={`${cardClass} p-8 rounded-lg shadow-xl text-center`}
//           >
//             <CheckCircle size={48} className="text-green-400 mx-auto mb-4" />
//             <h1 className="text-3xl font-bold mb-4">Quiz Completed!</h1>
// <<<<<<< HEAD
//             <p className={`${subTextClass} text-xl mb-6`}>
//               You scored {score} out of {session.questions.length} ({percentage}%)
//             </p>

// =======
//             <p className="text-xl text-gray-300 mb-4">
//               You scored {score} out of {session.questions.length} ({percentage}%)
//             </p>
//             <p className="text-lg text-gray-400 mb-6">
//               Time taken: {getElapsedTimeFormatted()}
//             </p>
            
// >>>>>>> upstream/main
//             <div className="flex flex-col sm:flex-row gap-4 justify-center">
//               <button
//                 onClick={handleRestartQuiz}
//                 className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg transition-colors flex items-center gap-2 justify-center"
//               >
//                 <RotateCcw size={18} />
//                 Take Another Quiz
//               </button>
//               <Link
//                 to="/technical-questions"
//                 className={`${darkMode ? "bg-gray-700 hover:bg-gray-600 text-white" : "bg-gray-200 hover:bg-gray-300 text-gray-900"} px-6 py-3 rounded-lg transition-colors text-center`}
//               >
//                 Back to Topics
//               </Link>
//             </div>
//           </motion.div>
//         </div>
//       </div>
//     );
//   }

//   const currentQuestion = session.questions[session.currentQuestionIndex];
//   const isCorrect = selectedOption === currentQuestion.answer;

//   return (
//     <div className={`${bgClass} min-h-screen p-4 sm:p-8 transition-colors duration-500`}>
//       <div className="container mx-auto max-w-3xl">
//         <Link
//           to="/technical-questions"
//           className={`flex items-center gap-2 ${darkMode ? "text-indigo-400 hover:text-indigo-300" : "text-indigo-600 hover:text-indigo-500"} transition-colors mb-8`}
//         >
//           <ArrowLeft size={20} />
//           Back to Technical Questions
//         </Link>

//         <header className="text-center mb-10">
// <<<<<<< HEAD
//           <h1 className={`text-3xl md:text-4xl font-bold mb-2 ${textClass}`}>Mixed Technical Quiz</h1>
//           <p className={subTextClass}>
// =======
//           <h1 className="text-3xl md:text-4xl font-bold mb-2">Mixed Technical Quiz</h1>
//           <p className="text-lg text-gray-400 mb-4">
// >>>>>>> upstream/main
//             Question {session.currentQuestionIndex + 1} of {session.questions.length}
//           </p>
          
//           {/* Timer Display */}
//           <div className="flex items-center justify-center gap-4 mb-4">
//             <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
//               remainingTime <= 300 ? 'bg-red-900/30 text-red-400' : 
//               remainingTime <= 600 ? 'bg-yellow-900/30 text-yellow-400' : 
//               'bg-green-900/30 text-green-400'
//             }`}>
//               <Clock size={18} />
//               <span className="font-mono text-lg">{formatTime()}</span>
//             </div>
            
//             <button
//               onClick={isRunning ? pauseTimer : startTimer}
//               className="flex items-center gap-2 px-3 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
//               disabled={isExpired}
//             >
//               {isRunning ? <Pause size={16} /> : <Play size={16} />}
//               <span>{isRunning ? 'Pause' : 'Resume'}</span>
//             </button>
//           </div>
          
//           {isExpired && (
//             <div className="text-red-400 font-semibold mb-4">
//               ⏰ Time's up! Quiz will be completed automatically.
//             </div>
//           )}
//         </header>

//         <motion.div
//           key={session.currentQuestionIndex}
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           exit={{ opacity: 0, y: -20 }}
//           transition={{ duration: 0.3 }}
//           className={`${cardClass} p-8 rounded-lg shadow-xl transition-colors duration-500`}
//         >
//           <h2 className={`text-2xl font-semibold mb-6 ${textClass}`}>
//             {currentQuestion.question}
//           </h2>

//           <div className="space-y-4">
//             {currentQuestion.options.map((option, index) => {
//               const isSelected = selectedOption === option;
//               let buttonClass = darkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-200 hover:bg-gray-300";

//               if (showExplanation) {
//                 if (option === currentQuestion.answer) buttonClass = "bg-green-600 text-white";
//                 else if (isSelected && !isCorrect) buttonClass = "bg-red-600 text-white";
//               } else if (isSelected) {
//                 buttonClass = "bg-indigo-600 text-white";
//               }

//               return (
//                 <button
//                   key={index}
//                   onClick={() => handleOptionSelect(option)}
//                   disabled={showExplanation}
//                   className={`w-full text-left p-4 rounded-md transition-colors duration-300 flex items-center justify-between ${buttonClass} ${
//                     !showExplanation ? "cursor-pointer" : "cursor-not-allowed"
//                   }`}
//                 >
//                   <span>{option}</span>
//                   {showExplanation && (
//                     <div className="flex items-center gap-2">
//                       {option === currentQuestion.answer ? (
//                         <CheckCircle size={20} className="text-green-200" />
//                       ) : isSelected ? (
//                         <XCircle size={20} className="text-red-200" />
//                       ) : null}
//                     </div>
//                   )}
//                 </button>
//               );
//             })}
//           </div>

//           <AnimatePresence>
//             {showExplanation && (
//               <motion.div
//                 initial={{ opacity: 0, height: 0 }}
//                 animate={{ opacity: 1, height: "auto" }}
//                 exit={{ opacity: 0, height: 0 }}
//                 className={`${darkMode ? "bg-gray-700" : "bg-gray-200"} mt-6 p-4 rounded-lg transition-colors duration-500`}
//               >
//                 <p className={darkMode ? "text-gray-300" : "text-gray-800"}>
//                   <strong>Explanation:</strong> {currentQuestion.explanation}
//                 </p>
//               </motion.div>
//             )}
//           </AnimatePresence>

//           <div className="mt-8 flex justify-between items-center">
//             <div className={subTextClass}>
//               Score: {score}/{session.currentQuestionIndex + (showExplanation ? 1 : 0)}
//             </div>

//             {!showExplanation ? (
//               <button
//                 onClick={handleSubmitAnswer}
//                 disabled={!selectedOption}
//                 className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg transition-colors"
//               >
//                 Submit Answer
//               </button>
//             ) : (
//               <button
//                 onClick={handleNextQuestion}
//                 className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors"
//               >
//                 {session.currentQuestionIndex === session.questions.length - 1 ? "Finish Quiz" : "Next Question"}
//               </button>
//             )}
//           </div>
//         </motion.div>
//       </div>
//     </div>
//   );
// };

// export default MixedQuizPage;



import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  RotateCcw,
  Clock,
  Play,
  Pause,
} from "lucide-react";
import { AIchatSession } from "../../gemini/AiModel";
import technicalPrompt from "../../gemini/technicalPrompt";
import { usePracticeTimer } from "../../hooks/usePracticeTimer";

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

const MixedQuizPage: React.FC = () => {
  const [session, setSession] = useState<QuizSession | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [score, setScore] = useState(0);

  // Timer hook - 15 minutes for mixed quiz
  const {
    remainingTime,
    isRunning,
    isExpired,
    formatTime,
    startTimer,
    pauseTimer,
    getElapsedTimeFormatted
  } = usePracticeTimer({
    duration: 900, // 15 minutes
    autoStart: false, // Start manually after questions are loaded
    onTimeUp: () => {
      // Auto-complete quiz when time expires
      if (session && !session.isCompleted) {
        setSession({ ...session, isCompleted: true });
      }
    }
  });

  const generateQuestions = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await AIchatSession.sendMessage(technicalPrompt);
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
          // Start timer after questions are loaded
          startTimer();
        } else {
          throw new Error("Failed to generate questions");
        }
      } else {
        throw new Error("No response from AI");
      }
    } catch (error) {
      console.error("Error generating questions:", error);
      // You could add a fallback or error handling here
    } finally {
      setIsLoading(false);
    }
  }, [startTimer]);

  useEffect(() => {
    generateQuestions();
  }, [generateQuestions]);

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
      <div className="bg-gray-900 text-white min-h-screen flex items-center justify-center p-4 sm:p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-400 mx-auto mb-4"></div>
          <p className="text-lg text-gray-300">Generating your mixed quiz...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="bg-gray-900 text-white min-h-screen flex items-center justify-center p-4 sm:p-8">
        <div className="text-center">
          <XCircle size={48} className="text-red-400 mx-auto mb-4" />
          <p className="text-lg text-gray-300 mb-4">Failed to generate questions</p>
          <button
            onClick={generateQuestions}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg transition-colors"
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
            <h1 className="text-3xl font-bold mb-4">Quiz Completed!</h1>
            <p className="text-xl text-gray-300 mb-4">
              You scored {score} out of {session.questions.length} ({percentage}%)
            </p>
            <p className="text-lg text-gray-400 mb-6">
              Time taken: {getElapsedTimeFormatted()}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleRestartQuiz}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg transition-colors flex items-center gap-2 justify-center"
              >
                <RotateCcw size={18} />
                Take Another Quiz
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

  const currentQuestion = session.questions[session.currentQuestionIndex];
  const isCorrect = selectedOption === currentQuestion.answer;

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

        <header className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Mixed Technical Quiz</h1>
          <p className="text-lg text-gray-400 mb-4">
            Question {session.currentQuestionIndex + 1} of {session.questions.length}
          </p>
          
          {/* Timer Display */}
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
              remainingTime <= 300 ? 'bg-red-900/30 text-red-400' : 
              remainingTime <= 600 ? 'bg-yellow-900/30 text-yellow-400' : 
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
          </div>
          
          {isExpired && (
            <div className="text-red-400 font-semibold mb-4">
              ⏰ Time's up! Quiz will be completed automatically.
            </div>
          )}
        </header>

        <motion.div
          key={session.currentQuestionIndex}
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
            {currentQuestion.options.map((option, index) => {
              const isSelected = selectedOption === option;
              let buttonClass = "bg-gray-700 hover:bg-gray-600";
              
              if (showExplanation) {
                if (option === currentQuestion.answer) {
                  buttonClass = "bg-green-600";
                } else if (isSelected && !isCorrect) {
                  buttonClass = "bg-red-600";
                }
              } else if (isSelected) {
                buttonClass = "bg-indigo-600";
              }

              return (
                <button
                  key={index}
                  onClick={() => handleOptionSelect(option)}
                  disabled={showExplanation}
                  className={`w-full text-left p-4 rounded-md transition-colors duration-300 flex items-center justify-between ${buttonClass} ${
                    !showExplanation ? "cursor-pointer" : "cursor-not-allowed"
                  }`}
                >
                  <span>{option}</span>
                  {showExplanation && (
                    <div className="flex items-center gap-2">
                      {option === currentQuestion.answer ? (
                        <CheckCircle size={20} className="text-green-200" />
                      ) : isSelected ? (
                        <XCircle size={20} className="text-red-200" />
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
                className="mt-6 p-4 bg-gray-700 rounded-lg"
              >
                <p className="text-gray-300">
                  <strong>Explanation:</strong> {currentQuestion.explanation}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-8 flex justify-between items-center">
            <div className="text-sm text-gray-400">
              Score: {score}/{session.currentQuestionIndex + (showExplanation ? 1 : 0)}
            </div>
            
            {!showExplanation ? (
              <button
                onClick={handleSubmitAnswer}
                disabled={!selectedOption}
                className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg transition-colors"
              >
                Submit Answer
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors"
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

export default MixedQuizPage;