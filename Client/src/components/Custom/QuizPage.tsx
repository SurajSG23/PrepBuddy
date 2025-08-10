import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";

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
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [quizEnd, setQuizEnd] = useState(false);
  const [locked, setLocked] = useState(false);
  const hasSubmittedRef = useRef(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/aptitudeQuestions.json");
        if (!res.ok) {
          throw new Error(`Failed to load questions. Status: ${res.status}`);
        }
        const data = await res.json();
        setQuestions(data[decodedTopic] || []);
      } catch (err: any) {
        setError(err?.message || "Failed to load questions.");
      } finally {
        setLoading(false);
      }
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

  if (loading) {
    return (
      <div className="text-white px-6 py-10 min-h-screen bg-[#0f172a]">
        <div className="max-w-xl mx-auto">
          <div className="h-8 w-56 bg-slate-700 rounded mb-6 animate-pulse" />
          <div className="bg-[#1e293b] p-6 rounded-2xl shadow-md">
            <div className="space-y-3 mb-6">
              <div className="h-5 w-3/4 bg-slate-700 rounded animate-pulse" />
              <div className="h-5 w-2/3 bg-slate-700 rounded animate-pulse" />
            </div>
            <ul className="space-y-3">
              {Array.from({ length: 4 }).map((_, idx) => (
                <li key={idx} className="h-10 bg-slate-700 rounded-xl animate-pulse" />
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-white px-6 py-10 min-h-screen bg-[#0f172a] flex flex-col items-center justify-center">
        <p className="text-red-400 mb-4">{error}</p>
        <button
          onClick={() => navigate("/aptitude")}
          className="bg-indigo-600 hover:bg-indigo-700 px-6 py-3 rounded-xl text-white font-medium"
        >
          Back to Topics
        </button>
      </div>
    );
  }

  if (!questions.length) {
    return (
      <div className="text-white px-6 py-10 min-h-screen bg-[#0f172a] flex flex-col items-center justify-center">
        <p className="text-gray-300 mb-4">No questions found for this topic.</p>
        <button
          onClick={() => navigate("/aptitude")}
          className="bg-indigo-600 hover:bg-indigo-700 px-6 py-3 rounded-xl text-white font-medium"
        >
          Choose Another Topic
        </button>
      </div>
    );
  }

  const currentQ = questions[current];

  return (
    <div className="text-white px-6 py-10 min-h-screen bg-[#0f172a]">
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
