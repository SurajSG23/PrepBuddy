import { Link } from "react-router-dom";
import { useThemeSelector } from "../../store/hooks";
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
  const darkMode = useThemeSelector((state) => state.theme.darkMode);
  return (
    <div
      className={`px-6 py-10 min-h-screen transition-colors duration-300 ${
        darkMode
          ? "bg-gradient-to-br from-[#0f172a] via-[#111827] to-[#0f172a] text-white"
          : "bg-gradient-to-br from-white via-gray-100 to-white text-gray-900"
      }`}
    >
      <h1
        className={`text-4xl font-extrabold text-center mb-4 tracking-wide drop-shadow-lg ${
          darkMode ? "text-indigo-400" : "text-indigo-700"
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
              className={`backdrop-blur-md rounded-xl px-6 py-8 shadow-lg transition-all duration-300 text-center cursor-pointer h-full border ${
                darkMode
                  ? "bg-indigo-500/20 border-indigo-400/30 hover:shadow-indigo-500/40 hover:-translate-y-2 hover:scale-[1.03] text-white"
                  : "bg-indigo-100 border-indigo-200 hover:shadow-indigo-300/40 hover:-translate-y-2 hover:scale-[1.03] text-indigo-900"
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
