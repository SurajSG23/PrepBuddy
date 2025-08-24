import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef, useCallback } from "react";
import { useQuizTimer } from "../../hooks/useQuizTimer";
import { quizStorage } from "../../utils/quizStorage";
import axios from "axios";

type Question = {
  question: string;
  options: string[];
  answer: string;
};

const QuizPage = () => {
  const { topic } = useParams();
  const decodedTopic = topic ? decodeURIComponent(topic) : "";
  const navigate = useNavigate();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [quizEnd, setQuizEnd] = useState(false);
  const [locked, setLocked] = useState(false);
  const hasSubmittedRef = useRef(false);
  const [sessionId, setSessionId] = useState<string>("");
  const [userAnswers, setUserAnswers] = useState<(string | null)[]>([]);

  // Timer hook for aptitude quizzes
  const {
    remainingTime,
    isExpired,
    formatTime,
    syncWithServer,
    saveProgress,
    saveCurrentProgress,
    startTimer,
    stopTimer,
    startAutoSave,
    stopAutoSave
  } = useQuizTimer({
    sessionId,
    onTimeUp: () => {
      // Handle time up for aptitude quiz
      if (!hasSubmittedRef.current) {
        hasSubmittedRef.current = true;
        setLocked(true);
        setQuizEnd(true);
      }
    },
    onSyncError: (error) => {
      console.error('Timer sync error:', error);
    }
  });

  // Create quiz session when questions are loaded
  const createQuizSession = useCallback(async (questions: Question[]) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/quiz/create-session`,
        {
          userId: "anonymous", // For aptitude quizzes, we don't have user ID
          topic: decodedTopic,
          title: decodedTopic,
          difficulty: "Medium",
          questions: questions.map(q => q.question),
          options: questions.map(q => q.options),
          correctAnswers: questions.map(q => q.answer),
          explanations: questions.map(() => "Explanation not available for aptitude questions")
        },
        { withCredentials: true }
      );

      const { sessionId: newSessionId } = response.data;
      setSessionId(newSessionId);

      // Start timer and auto-save
      startTimer();
      startAutoSave();

      // Save session data to localStorage
      quizStorage.saveSession({
        sessionId: newSessionId,
        questions: questions.map(q => q.question),
        options: questions.map(q => q.options),
        correctAnswers: questions.map(q => q.answer),
        explanations: questions.map(() => "Explanation not available for aptitude questions"),
        topic: decodedTopic,
        title: decodedTopic
      });

    } catch (error) {
      console.error('Error creating quiz session:', error);
    }
  }, [decodedTopic, startTimer, startAutoSave]);

  useEffect(() => {
    const fetchQuestions = async () => {
      const res = await fetch("/aptitudeQuestions.json");
      const data = await res.json();
      const fetchedQuestions = data[decodedTopic] || [];
      setQuestions(fetchedQuestions);
      setUserAnswers(Array(fetchedQuestions.length).fill(null));
      
      // Create session after questions are loaded
      if (fetchedQuestions.length > 0) {
        createQuizSession(fetchedQuestions);
      }
    };
    fetchQuestions();
  }, [decodedTopic, createQuizSession]);

  // Auto-save effect - saves progress every 10 seconds when session is active
  useEffect(() => {
    if (!sessionId) return;
    
    const autoSaveInterval = setInterval(() => {
      saveCurrentProgress(userAnswers, current);
    }, 10000);
    
    return () => clearInterval(autoSaveInterval);
  }, [sessionId, userAnswers, current, saveCurrentProgress]);

  const handleOptionClick = (option: string) => {
    if (showAnswer) return; // Prevent reselection
    setSelected(option);
    setShowAnswer(true);
    
    // Update user answers
    const newAnswers = [...userAnswers];
    newAnswers[current] = option;
    setUserAnswers(newAnswers);
    
    // Save progress if session exists
    if (sessionId) {
      saveCurrentProgress(newAnswers, current);
      
      // Also save to localStorage as backup
      quizStorage.saveProgress({
        sessionId,
        userAnswers: newAnswers,
        currentQuestion: current,
        lastSaved: Date.now(),
        topic: decodedTopic,
        title: decodedTopic
      });
    }
  };

  const handleNext = () => {
    if (current < questions.length - 1) {
      setCurrent(prev => prev + 1);
      setSelected(null);
      setShowAnswer(false);
    } else {
      if (!hasSubmittedRef.current) {
        hasSubmittedRef.current = true;
        setLocked(true);
      }
      setQuizEnd(true);
    }
  };

  const goToTopics = () => {
    navigate("/aptitude");
  };

  if (!questions.length) {
    return (
      <div className="text-white text-center mt-20">Loading questions...</div>
    );
  }

  const currentQ = questions[current];

  return (
    <div className="text-white px-6 py-10 min-h-screen bg-[#0f172a]">
      {/* Timer Display */}
      {sessionId && (
        <div className="fixed top-4 right-4 bg-gray-800 px-4 py-2 rounded-lg shadow-lg z-50">
          <div className="flex items-center">
            <svg className="h-5 w-5 mr-2 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-mono text-lg">{formatTime(remainingTime)}</span>
          </div>
        </div>
      )}
      
      <h2 className="text-3xl font-bold text-center text-indigo-300 mb-6">
        {decodedTopic} Quiz
      </h2>

      {!quizEnd ? (
        <div className="max-w-xl mx-auto bg-[#1e293b] p-6 rounded-2xl shadow-md">
          <h3 className="text-xl font-semibold mb-4">{currentQ.question}</h3>
          <ul className="space-y-3">
            {currentQ.options.map((opt, idx) => {
              let base =
                "block w-full p-3 rounded-xl border transition-all duration-300 ";
              if (!showAnswer) {
                base += "border-slate-500 hover:bg-slate-700 cursor-pointer";
              } else if (opt === currentQ.answer) {
                base += "bg-green-600 border-green-500";
              } else if (opt === selected) {
                base += "bg-red-600 border-red-500";
              } else {
                base += "bg-slate-600 border-slate-500";
              }

              return (
                <li
                  key={idx}
                  className={base}
                  onClick={() => !locked && handleOptionClick(opt)}
                >
                  {opt}
                </li>
              );
            })}
          </ul>

          {showAnswer && (
            <div className="flex justify-end mt-6">
              <button
                className="bg-indigo-500 hover:bg-indigo-600 px-4 py-2 rounded-xl transition-all"
                onClick={() => !locked && handleNext()}
              >
                {current === questions.length - 1 ? "Finish" : "Next"}
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center mt-10">
          <h3 className="text-2xl text-green-400 font-bold mb-4">Quiz Completed!</h3>
          <button
            onClick={goToTopics}
            className="bg-indigo-600 hover:bg-indigo-700 px-6 py-3 rounded-xl text-white font-medium"
          >
            Go to Topics Page
          </button>
        </div>
      )}
    </div>
  );
};

export default QuizPage;
