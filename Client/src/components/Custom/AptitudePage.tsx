import { Link } from "react-router-dom";
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
  return (
    <div className="text-white px-6 py-10 min-h-screen bg-gradient-to-br from-[#0f172a] via-[#111827] to-[#0f172a]">
      <h1 className="text-4xl font-extrabold text-center text-indigo-400 mb-4 tracking-wide drop-shadow-lg">
        Aptitude Questions Practice
      </h1>
      <p className="text-center text-gray-400 mb-10 text-lg">
        Choose an aptitude area to start practicing and boost your problem-solving skills.
      </p>

      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {aptitudeTopics.map((topic, index) => (
          <Link to={`/quiz/${encodeURIComponent(topic)}`} key={index}>
            <div className="bg-indigo-500/20 backdrop-blur-md border border-indigo-400/30 rounded-xl px-6 py-8 shadow-lg hover:shadow-indigo-500/40 hover:-translate-y-2 hover:scale-[1.03] transition-all duration-300 text-center cursor-pointer h-full">
              {topic}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
 export default AptitudePage;
