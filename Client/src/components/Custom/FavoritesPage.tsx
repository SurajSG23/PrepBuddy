
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, Download } from "lucide-react";
  
const FavoritesPage = () => {
  const [view, setView] = useState<"companies" | "notes" | null>(null);
  const [favoriteCompanies, setFavoriteCompanies] = useState<string[]>([]);
  const [bookmarkedNotes, setBookmarkedNotes] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const savedCompanies = localStorage.getItem("favoriteCompanies");
    const savedNotes = localStorage.getItem("bookmarkedNotes");

    if (savedCompanies) setFavoriteCompanies(JSON.parse(savedCompanies));
    if (savedNotes) setBookmarkedNotes(JSON.parse(savedNotes));
  }, []);

  const renderCompanies = () => (
    <>
      <h2 className="text-3xl font-extrabold text-indigo-400 mb-6 text-center sm:text-left">🌟 Favorite Companies</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {favoriteCompanies.map((company) => (
          <div key={company} className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl shadow-lg border border-gray-700 hover:shadow-indigo-500/20 transition-transform duration-300 transform hover:scale-105">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-semibold text-white">{company}</h3>
              <img
                src={`https://logo.clearbit.com/${company.toLowerCase()}.com`}
                alt={company}
                className="w-12 h-12 object-contain  grayscale hover:grayscale-0 transition duration-300"
              />
            </div>
            <p className="text-gray-400 mb-4 text-sm sm:text-base">
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
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg font-medium transition shadow-md hover:shadow-indigo-500/30"
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
      <h2 className="text-3xl font-extrabold text-indigo-400 mb-6 text-center sm:text-left">📘 Bookmarked Notes</h2>
      {bookmarkedNotes.length === 0 ? (
        <p className="text-gray-400 text-center">No bookmarked notes yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {bookmarkedNotes.map((note, i) => (
            <div
              key={i}
              className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl shadow-lg border border-gray-700 hover:shadow-blue-500/20 transition-transform duration-300 transform hover:scale-105 text-center"
            >
              <img src={note.image} alt={note.title} className="w-20 h-20 mx-auto mb-4 object-contain drop-shadow-md hover:drop-shadow-xl transition duration-300" />
              <h3 className="text-xl font-semibold text-white mb-3">{note.title}</h3>
              <div className="flex justify-center gap-4">
                <a
                  href={note.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2  rounded-lg font-medium flex items-center gap-2 shadow hover:shadow-blue-500/30 transition"
                >
                  <Eye size={16} /> View
                </a>
                <a
                  href={note.link}
                  download={note.filename}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2  rounded-lg font-medium flex items-center gap-2 shadow hover:shadow-indigo-500/30 transition"
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
    <div className="container mx-auto px-4 py-6">
      <button
        className="mb-6 text-indigo-400 hover:text-indigo-200 underline text-sm transition duration-300"
        onClick={() => navigate("/")}
      >
        ← Back to Home
      </button>

      {!view ? (
        <div className="flex flex-col md:flex-row justify-center items-center gap-10">
          <button
            onClick={() => setView("companies")}
            className="relative bg-indigo-600 hover:bg-indigo-700 text-white text-2xl py-8 px-12 rounded-2xl shadow-xl w-full max-w-md transition transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-indigo-500/50"
          >
            🌟 Favorite Companies
          </button>
          <button
            onClick={() => setView("notes")}
            className="relative bg-indigo-600 hover:bg-indigo-700 text-white text-2xl py-8 px-12 rounded-2xl shadow-xl w-full max-w-md transition transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-indigo-500/50"
          >
            📘 Bookmarked Notes
          </button>
        </div>
      ) : (
        <div>
          <button
            onClick={() => setView(null)}
            className="mb-6 text-sm text-indigo-300 hover:text-indigo-100 underline transition duration-300"
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
