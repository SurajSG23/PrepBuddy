import { useEffect, useState } from "react";
import { useThemeSelector } from "../../store/hooks";
import { useNavigate } from "react-router-dom";
import { Eye, Download } from "lucide-react";
  
const FavoritesPage = () => {
  const [view, setView] = useState<"companies" | "notes" | null>(null);
  const [favoriteCompanies, setFavoriteCompanies] = useState<string[]>([]);
  const [bookmarkedNotes, setBookmarkedNotes] = useState<any[]>([]);
  const navigate = useNavigate();
  const darkMode = useThemeSelector((state) => state.theme.darkMode);

  useEffect(() => {
    const savedCompanies = localStorage.getItem("favoriteCompanies");
    const savedNotes = localStorage.getItem("bookmarkedNotes");

    if (savedCompanies) setFavoriteCompanies(JSON.parse(savedCompanies));
    if (savedNotes) setBookmarkedNotes(JSON.parse(savedNotes));
  }, []);

  const renderCompanies = () => (
    <>
      <h2 className={`text-3xl font-extrabold mb-6 text-center sm:text-left ${darkMode ? "text-indigo-400" : "text-indigo-600"}`}>🌟 Favorite Companies</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {favoriteCompanies.map((company) => (
          <div
            key={company}
            className={`p-6 rounded-xl shadow-lg border transition-transform duration-300 transform hover:scale-105 ${
              darkMode
                ? "bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 hover:shadow-indigo-500/20"
                : "bg-gradient-to-br from-indigo-50 to-white border-indigo-200 hover:shadow-indigo-300/20"
            }`}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className={`text-2xl font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>{company}</h3>
              <img
                src={`https://logo.clearbit.com/${company.toLowerCase()}.com`}
                alt={company}
                className="w-12 h-12 object-contain  grayscale hover:grayscale-0 transition duration-300"
              />
            </div>
            <p className={`mb-4 text-sm sm:text-base ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
              Practice {company} aptitude test for interview.
            </p>
            <button
              onClick={() => {
                localStorage.setItem("currentTest", JSON.stringify({
                  title: company,
                  difficulty: "Medium",
                  createdAt: new Date(),
                }));
                navigate("/testpage");
              }}
              className={`w-full py-2 px-4 rounded-lg font-medium transition shadow-md ${
                darkMode
                  ? "bg-indigo-600 hover:bg-indigo-700 text-white hover:shadow-indigo-500/30"
                  : "bg-indigo-500 hover:bg-indigo-600 text-white hover:shadow-indigo-300/30"
              }`}
            >
              Start Test
            </button>
          </div>
        ))}
      </div>
    </>
  );

  const renderNotes = () => (
    <>
      <h2 className={`text-3xl font-extrabold mb-6 text-center sm:text-left ${darkMode ? "text-indigo-400" : "text-indigo-600"}`}>📘 Bookmarked Notes</h2>
      {bookmarkedNotes.length === 0 ? (
        <p className={`${darkMode ? "text-gray-400" : "text-gray-600"} text-center`}>No bookmarked notes yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {bookmarkedNotes.map((note, i) => (
            <div
              key={i}
              className={`p-6 rounded-xl shadow-lg border transition-transform duration-300 transform hover:scale-105 text-center ${
                darkMode
                  ? "bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 hover:shadow-blue-500/20"
                  : "bg-gradient-to-br from-indigo-50 to-white border-indigo-200 hover:shadow-blue-300/20"
              }`}
            >
              <img src={note.image} alt={note.title} className="w-20 h-20 mx-auto mb-4 object-contain drop-shadow-md hover:drop-shadow-xl transition duration-300" />
              <h3 className={`text-xl font-semibold mb-3 ${darkMode ? "text-white" : "text-gray-900"}`}>{note.title}</h3>
              <div className="flex justify-center gap-4">
                <a
                  href={note.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`px-5 py-2 rounded-lg font-medium flex items-center gap-2 shadow transition ${
                    darkMode
                      ? "bg-blue-600 hover:bg-blue-700 text-white hover:shadow-blue-500/30"
                      : "bg-blue-500 hover:bg-blue-600 text-white hover:shadow-blue-300/30"
                  }`}
                >
                  <Eye size={16} /> View
                </a>
                <a
                  href={note.link}
                  download={note.filename}
                  className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 shadow transition ${
                    darkMode
                      ? "bg-indigo-600 hover:bg-indigo-700 text-white hover:shadow-indigo-500/30"
                      : "bg-indigo-500 hover:bg-indigo-600 text-white hover:shadow-indigo-300/30"
                  }`}
                >
                  <Download size={16} /> Download
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );

  return (
    <div className={`container mx-auto px-4 py-6 ${darkMode ? "bg-gray-950 min-h-screen" : "bg-white min-h-screen"}`}>
      <button
        className={`mb-6 underline text-sm transition duration-300 ${darkMode ? "text-indigo-400 hover:text-indigo-200" : "text-indigo-600 hover:text-indigo-400"}`}
        onClick={() => navigate("/")}
      >
        ← Back to Home
      </button>

      {!view ? (
        <div className="flex flex-col md:flex-row justify-center items-center gap-10">
          <button
            onClick={() => setView("companies")}
            className={`relative text-2xl py-8 px-12 rounded-2xl shadow-xl w-full max-w-md transition transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-indigo-500/50 ${
              darkMode
                ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                : "bg-indigo-500 hover:bg-indigo-600 text-white"
            }`}
          >
            🌟 Favorite Companies
          </button>
          <button
            onClick={() => setView("notes")}
            className={`relative text-2xl py-8 px-12 rounded-2xl shadow-xl w-full max-w-md transition transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-indigo-500/50 ${
              darkMode
                ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                : "bg-indigo-500 hover:bg-indigo-600 text-white"
            }`}
          >
            📘 Bookmarked Notes
          </button>
        </div>
      ) : (
        <div>
          <button
            onClick={() => setView(null)}
            className={`mb-6 text-sm underline transition duration-300 ${darkMode ? "text-indigo-300 hover:text-indigo-100" : "text-indigo-500 hover:text-indigo-700"}`}
          >
            ← Back to Favorites Menu
          </button>
          {view === "companies" ? renderCompanies() : renderNotes()}
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;
