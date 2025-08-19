import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { useThemeSelector } from "../../store/hooks";

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
  const darkMode = useThemeSelector((state) => state.theme.darkMode);
  const hasSubmittedRef = useRef(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      const res = await fetch("/aptitudeQuestions.json");
      const data = await res.json();
      setQuestions(data[decodedTopic] || []);
    };
    fetchQuestions();
  }, [decodedTopic]);

  const handleOptionClick = (option: string) => {
    if (showAnswer) return; // Prevent reselection
    setSelected(option);
    setShowAnswer(true);
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
      <div className={`${darkMode ? "text-white bg-[#0f172a]" : "text-gray-900 bg-white"} text-center mt-20 min-h-screen`}>Loading questions...</div>
    );
  }

  const currentQ = questions[current];

  return (
    <div className={`${darkMode ? "text-white bg-[#0f172a]" : "text-gray-900 bg-white"} px-6 py-10 min-h-screen`}>
      <h2 className={`text-3xl font-bold text-center mb-6 ${darkMode ? "text-indigo-300" : "text-indigo-700"}`}>
        {decodedTopic} Quiz
      </h2>
      {!quizEnd ? (
        <div className={`max-w-xl mx-auto p-6 rounded-2xl shadow-md ${darkMode ? "bg-[#1e293b]" : "bg-indigo-50"}`}>
          <h3 className={`text-xl font-semibold mb-4 ${darkMode ? "text-white" : "text-gray-900"}`}>{currentQ.question}</h3>
          <ul className="space-y-3">
            {currentQ.options.map((opt, idx) => {
              let base = "block w-full p-3 rounded-xl border transition-all duration-300 ";
              if (!showAnswer) {
                base += darkMode ? " border-slate-500 hover:bg-slate-700 cursor-pointer" : " border-indigo-300 hover:bg-indigo-100 cursor-pointer";
              } else if (opt === currentQ.answer) {
                base += darkMode ? " bg-green-600 border-green-500 text-white" : " bg-green-200 border-green-400 text-green-900";
              } else if (opt === selected) {
                base += darkMode ? " bg-red-600 border-red-500 text-white" : " bg-red-200 border-red-400 text-red-900";
              } else {
                base += darkMode ? " bg-slate-600 border-slate-500 text-white" : " bg-indigo-100 border-indigo-200 text-gray-900";
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
                className={`px-4 py-2 rounded-xl transition-all ${darkMode ? "bg-indigo-500 hover:bg-indigo-600 text-white" : "bg-indigo-600 hover:bg-indigo-700 text-white"}`}
                onClick={() => !locked && handleNext()}
              >
                {current === questions.length - 1 ? "Finish" : "Next"}
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center mt-10">
          <h3 className={`text-2xl font-bold mb-4 ${darkMode ? "text-green-400" : "text-green-700"}`}>Quiz Completed!</h3>
          <button
            onClick={goToTopics}
            className={`px-6 py-3 rounded-xl font-medium ${darkMode ? "bg-indigo-600 hover:bg-indigo-700 text-white" : "bg-indigo-500 hover:bg-indigo-600 text-white"}`}
          >
            Go to Topics Page
          </button>
        </div>
      )}
    </div>
  );
};

export default QuizPage;
