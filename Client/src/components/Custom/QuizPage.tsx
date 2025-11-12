import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef, useCallback } from "react";
import { useQuizTimer } from "../../hooks/useQuizTimer";
import { quizStorage } from "../../utils/quizStorage";
import axios from "axios";
import { useDarkMode } from "../Custom/DarkModeContext";

type Question = {
  question: string;
  options: string[];
  answer: string;
};

const QuizPage = () => {
  const { topic } = useParams();
  const decodedTopic = topic ? decodeURIComponent(topic) : "";
  const navigate = useNavigate();
  const { darkMode } = useDarkMode(); // ✅ theme

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
    formatTime,
    saveCurrentProgress,
    startTimer,
    startAutoSave,
  } = useQuizTimer({
    sessionId,
    onTimeUp: () => {
      if (!hasSubmittedRef.current) {
        hasSubmittedRef.current = true;
        setLocked(true);
        setQuizEnd(true);
      }
    },
    onSyncError: (error) => {
      console.error("Timer sync error:", error);
    },
  });

  // Create quiz session
  const createQuizSession = useCallback(
    async (questions: Question[]) => {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/quiz/create-session`,
          {
            userId: "anonymous",
            topic: decodedTopic,
            title: decodedTopic,
            difficulty: "Medium",
            questions: questions.map((q) => q.question),
            options: questions.map((q) => q.options),
            correctAnswers: questions.map((q) => q.answer),
            explanations: questions.map(
              () => "Explanation not available for aptitude questions"
            ),
          },
          { withCredentials: true }
        );

        const { sessionId: newSessionId } = response.data;
        setSessionId(newSessionId);
        startTimer();
        startAutoSave();

        quizStorage.saveSession({
          sessionId: newSessionId,
          questions: questions.map((q) => q.question),
          options: questions.map((q) => q.options),
          correctAnswers: questions.map((q) => q.answer),
          explanations: questions.map(
            () => "Explanation not available for aptitude questions"
          ),
          topic: decodedTopic,
          title: decodedTopic,
        });
      } catch (error) {
        console.error("Error creating quiz session:", error);
      }
    },
    [decodedTopic, startTimer, startAutoSave]
  );

  // Fetch questions
  useEffect(() => {
    const fetchQuestions = async () => {
      const res = await fetch("/aptitudeQuestions.json");
      const data = await res.json();
      const fetchedQuestions = data[decodedTopic] || [];
      setQuestions(fetchedQuestions);
      setUserAnswers(Array(fetchedQuestions.length).fill(null));

      if (fetchedQuestions.length > 0) {
        createQuizSession(fetchedQuestions);
      }
    };
    fetchQuestions();
  }, [decodedTopic, createQuizSession]);

  // Auto-save effect
  useEffect(() => {
    if (!sessionId) return;
    const autoSaveInterval = setInterval(() => {
      saveCurrentProgress(userAnswers, current);
    }, 10000);
    return () => clearInterval(autoSaveInterval);
  }, [sessionId, userAnswers, current, saveCurrentProgress]);

  const handleOptionClick = (option: string) => {
    if (showAnswer) return;
    setSelected(option);
    setShowAnswer(true);

    const newAnswers = [...userAnswers];
    newAnswers[current] = option;
    setUserAnswers(newAnswers);

    if (sessionId) {
      saveCurrentProgress(newAnswers, current);
      quizStorage.saveProgress({
        sessionId,
        userAnswers: newAnswers,
        currentQuestion: current,
        lastSaved: Date.now(),
        topic: decodedTopic,
        title: decodedTopic,
      });
    }
  };

  const handleNext = () => {
    if (current < questions.length - 1) {
      setCurrent((prev) => prev + 1);
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

  const goToTopics = () => navigate("/aptitude");

  if (!questions.length) {
    return (
      <div
        className={`text-center mt-20 ${
          darkMode ? "text-white" : "text-gray-800"
        }`}
      >
        Loading questions...
      </div>
    );
  }

  const currentQ = questions[current];

  return (
    <div
      className={`px-6 py-10 min-h-screen transition-colors duration-500 ${
        darkMode ? "bg-[#0f172a] text-white" : "bg-gray-100 text-gray-900"
      }`}
    >
      {/* Timer Display */}
      {sessionId && (
        <div
          className={`fixed top-4 right-4 px-4 py-2 rounded-lg shadow-lg z-50 ${
            darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
          }`}
        >
          <div className="flex items-center">
            <svg
              className={`h-5 w-5 mr-2 ${
                darkMode ? "text-indigo-400" : "text-indigo-600"
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="font-mono text-lg">
              {formatTime(remainingTime)}
            </span>
          </div>
        </div>
      )}

      <h2
        className={`text-3xl font-bold text-center mb-6 ${
          darkMode ? "text-indigo-300" : "text-indigo-600"
        }`}
      >
        {decodedTopic} Quiz
      </h2>

      {!quizEnd ? (
        <div
          className={`max-w-xl mx-auto p-6 rounded-2xl shadow-md transition-colors ${
            darkMode ? "bg-[#1e293b]" : "bg-white border border-gray-200"
          }`}
        >
          <h3
            className={`text-xl font-semibold mb-4 ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            {currentQ.question}
          </h3>
          <ul className="space-y-3">
            {currentQ.options.map((opt, idx) => {
              let base =
                "block w-full p-3 rounded-xl border transition-all duration-300 ";
              if (!showAnswer) {
                base += darkMode
                  ? "border-slate-500 hover:bg-slate-700 cursor-pointer"
                  : "border-gray-400 hover:bg-gray-100 cursor-pointer";
              } else if (opt === currentQ.answer) {
                base += "bg-green-600 border-green-500 text-white";
              } else if (opt === selected) {
                base += "bg-red-600 border-red-500 text-white";
              } else {
                base += darkMode
                  ? "bg-slate-600 border-slate-500 text-white"
                  : "bg-gray-200 border-gray-400 text-gray-800";
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
                className={`px-4 py-2 rounded-xl transition-all ${
                  darkMode
                    ? "bg-indigo-500 hover:bg-indigo-600 text-white"
                    : "bg-indigo-600 hover:bg-indigo-700 text-white"
                }`}
                onClick={() => !locked && handleNext()}
              >
                {current === questions.length - 1 ? "Finish" : "Next"}
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center mt-10">
          <h3
            className={`text-2xl font-bold mb-4 ${
              darkMode ? "text-green-400" : "text-green-600"
            }`}
          >
            Quiz Completed!
          </h3>
          <button
            onClick={goToTopics}
            className={`px-6 py-3 rounded-xl font-medium transition ${
              darkMode
                ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                : "bg-indigo-500 hover:bg-indigo-600 text-white"
            }`}
          >
            Go to Topics Page
          </button>
        </div>
      )}
    </div>
  );
};

export default QuizPage;
