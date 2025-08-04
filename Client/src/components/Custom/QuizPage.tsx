import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

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
                  onClick={() => handleOptionClick(opt)}
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
                onClick={handleNext}
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
