import { Link } from "react-router-dom";
import { useDarkMode } from "../Custom/DarkModeContext";

const aptitudeTopics = [
  "Quantitative Aptitude",
  "Logical Reasoning",
  "Verbal Ability",
  "Data Interpretation",
  "Arithmetic",
  "Number Series",
  "Time & Work",
  "Profit & Loss",
  "Percentages",
  "Probability",
];

const AptitudePage = () => {
  const { darkMode } = useDarkMode(); 

  return (
    <div
      className={`px-6 py-10 min-h-screen transition-colors duration-500 ${
        darkMode
          ? "bg-gradient-to-br from-[#0f172a] via-[#111827] to-[#0f172a] text-white"
          : "bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-900"
      }`}
    >
      <h1
        className={`text-4xl font-extrabold text-center mb-4 tracking-wide drop-shadow-lg ${
          darkMode ? "text-indigo-400" : "text-indigo-600"
        }`}
      >
        Aptitude Questions Practice
      </h1>
      <p
        className={`text-center mb-10 text-lg ${
          darkMode ? "text-gray-400" : "text-gray-600"
        }`}
      >
        Choose an aptitude area to start practicing and boost your problem-solving skills.
      </p>

      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {aptitudeTopics.map((topic, index) => (
          <Link to={`/quiz/${encodeURIComponent(topic)}`} key={index}>
            <div
              className={`rounded-xl px-6 py-8 shadow-lg text-center cursor-pointer h-full transition-all duration-300 hover:-translate-y-2 hover:scale-[1.03] ${
                darkMode
                  ? "bg-indigo-500/20 backdrop-blur-md border border-indigo-400/30 hover:shadow-indigo-500/40"
                  : "bg-indigo-100 border border-indigo-300 hover:shadow-indigo-400/30 text-gray-900"
              }`}
            >
              {topic}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AptitudePage;
