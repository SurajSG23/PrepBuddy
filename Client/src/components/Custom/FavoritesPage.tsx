
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
      <h2 className="text-2xl text-indigo-400 font-bold mb-4">Favorite Companies</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {favoriteCompanies.map((company) => (
          <div key={company} className="bg-gray-800 p-5 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">{company}</h3>
              <img
                src={`https://logo.clearbit.com/${company.toLowerCase()}.com`}
                alt={company}
                className="w-12 h-12 object-contain rounded-full bg-slate-100 p-0.5 hover:scale-110 transition-transform"
              />
            </div>
            <p className="text-gray-300 mb-3">
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
              className="bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700"
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
      <h2 className="text-2xl text-indigo-400 font-bold mb-4">Bookmarked Notes</h2>
      {bookmarkedNotes.length === 0 ? (
        <p className="text-gray-400">No bookmarked notes yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookmarkedNotes.map((note, i) => (
            <div
              key={i}
              className="bg-gray-800 p-5 rounded-lg shadow-md text-center"
            >
              <img src={note.image} alt={note.title} className="w-20 h-20 mx-auto mb-3" />
              <h3 className="text-lg font-semibold mb-2">{note.title}</h3>
              <div className="flex justify-center gap-3">
                <a
                  href={note.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded flex items-center gap-1"
                >
                  <Eye size={16} /> View
                </a>
                <a
                  href={note.link}
                  download={note.filename}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded flex items-center gap-1"
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
        className="mb-4 text-indigo-400 hover:text-indigo-200 underline"
        onClick={() => navigate("/")}
      >
        ← Back to Home
      </button>

      {!view ? (
        <div className="flex flex-col md:flex-row justify-center items-center gap-8">
          <button
            onClick={() => setView("companies")}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-2xl py-8 px-12 rounded-xl shadow-lg w-full max-w-md"
          >
            🌟 Favorite Companies
          </button>
          <button
            onClick={() => setView("notes")}
            className="bg-blue-600 hover:bg-blue-700 text-white text-2xl py-8 px-12 rounded-xl shadow-lg w-full max-w-md"
          >
            📘 Bookmarked Notes
          </button>
        </div>
      ) : (
        <div>
          <button
            onClick={() => setView(null)}
            className="mb-6 text-sm text-indigo-300 hover:text-indigo-100"
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
