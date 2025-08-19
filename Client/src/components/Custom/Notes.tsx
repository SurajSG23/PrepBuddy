
const notesData = [
  {
    title: "Data Structures & Algorithms",
    image: "https://www.codewithharry.com/img/notes/dsa.webp",
    link: "/notes/dsa.pdf",
    filename: "DSA_Notes.pdf",
  },
  {
    title: "Operating Systems",
    image: "https://img.icons8.com/color/96/monitor.png",
    link: "/notes/os.pdf",
    filename: "Operating_Systems.pdf",
  },
  {
    title: "Computer Networks",
    image: "https://img.icons8.com/fluency/96/network-cable.png",
    link: "/notes/cn.pdf",
    filename: "Computer_Networks.pdf",
  },
  {
    title: "Database Management Systems",
    image: "https://img.icons8.com/fluency/96/database.png",
    link: "/notes/dbms.pdf",
    filename: "DBMS.pdf",
  },
  {
    title: "Computer Architecture",
    image: "https://img.icons8.com/color/96/motherboard.png",
    link: "/notes/ca.pdf",
    filename: "Computer_Architecture.pdf",
  },
  {
    title: "Java Programming",
    image: "https://img.icons8.com/color/96/java-coffee-cup-logo.png",
    link: "/notes/java.pdf",
    filename: "Java_Notes.pdf",
  },
  {
    title: "C++ Programming",
    image: "https://img.icons8.com/color/96/c-plus-plus-logo.png",
    link: "/notes/cpp.pdf",
    filename: "CPP_Notes.pdf",
  },
  {
    title: "JavaScript",
    image: "https://img.icons8.com/color/96/javascript.png",
    link: "/notes/javascript.pdf",
    filename: "JavaScript_Notes.pdf",
  },
  {
    title: "HTML",
    image: "https://img.icons8.com/color/96/html-5.png",
    link: "/notes/html.pdf",
    filename: "HTML_Notes.pdf",
  },
  {
    title: "CSS",
    image: "https://img.icons8.com/color/96/css3.png",
    link: "/notes/css.pdf",
    filename: "CSS_Notes.pdf",
  },
  {
    title: "Python",
    image: "https://www.codewithharry.com/img/notes/python.webp",
    link: "/notes/python.pdf",
    filename: "Python_Notes.pdf",
  },
  {
    title: "C",
    image: "https://img.icons8.com/color/96/c-programming.png",
    link: "/notes/c.pdf",
    filename: "C_Notes.pdf",
  },
];

import { useState, useEffect, useMemo } from "react";
import { useThemeSelector } from "../../store/hooks";
import { Eye, Download, X, Search, Star } from "lucide-react";

const Notes = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPdf, setSelectedPdf] = useState<string | null>(null);
  const [selectedTitle, setSelectedTitle] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  // Bookmarked notes from localStorage (which stores an array of full note objects)
  const [favorites, setFavorites] = useState<any[]>([]);

  // Load bookmarkedNotes from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("bookmarkedNotes");
    if (saved) {
      try {
        setFavorites(JSON.parse(saved));
      } catch (err) {
        console.error("Failed to parse bookmarkedNotes", err);
      }
    }
  }, []);

  const isNoteBookmarked = (note: any) => {
    return favorites.some((fav) => fav.title === note.title);
  };

  const toggleFavorite = (note: any) => {
    let updated;
    if (isNoteBookmarked(note)) {
      updated = favorites.filter((fav) => fav.title !== note.title);
    } else {
      updated = [...favorites, note];
    }
    setFavorites(updated);
    localStorage.setItem("bookmarkedNotes", JSON.stringify(updated));
  };


  const handlePreview = (pdfLink: string, title: string) => {
    setIsLoading(true);
    setSelectedPdf(pdfLink);
    setSelectedTitle(title);
    document.body.style.overflow = "hidden";
  };

  const handleClosePreview = () => {
    setSelectedPdf(null);
    setSelectedTitle("");
    setIsLoading(false);
    document.body.style.overflow = "unset";
  };

  const handleIframeLoad = () => {
    setTimeout(() => setIsLoading(false), 200);
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && selectedPdf) {
        handleClosePreview();
      }
    };
    if (selectedPdf) {
      document.addEventListener("keydown", handleEscape);
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [selectedPdf]);

  const filteredNotes = useMemo(() => {
    return notesData.filter((note) =>
      note.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const darkMode = useThemeSelector((state) => state.theme.darkMode);
  return (
    <div className={`w-full min-h-screen px-4 py-10 transition-colors duration-300 ${darkMode ? 'bg-gradient-to-b from-gray-900 to-black text-white' : 'bg-gradient-to-b from-gray-100 to-white text-gray-900'}`}>
      <h2 className="text-4xl font-bold text-center text-indigo-400 mb-10 drop-shadow-md">
        📚 Download Notes
      </h2>

      <div className="max-w-md mx-auto mb-12">
        <div className={`relative backdrop-blur-md rounded-xl shadow-xl transition duration-300 border ${darkMode ? 'bg-gradient-to-br from-gray-800/80 to-gray-700/80 border-gray-600 hover:shadow-indigo-500/20' : 'bg-gradient-to-br from-white/90 to-gray-100/90 border-gray-300 hover:shadow-indigo-200/20'}`}>
          <input
            type="text"
            placeholder="Search notes..."
            className={`w-full bg-transparent rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-200 ${darkMode ? 'text-white placeholder-gray-400' : 'text-gray-900 placeholder-gray-500'}`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className={`absolute left-4 top-1/2 transform -translate-y-1/2 transition ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`} size={18} />
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {filteredNotes.length > 0 ? (
          filteredNotes.map((note, index) => (
            <div
              key={index}
              className={`rounded-2xl p-6 text-center relative overflow-hidden transition-all duration-300 border backdrop-blur-md hover:scale-105 ${darkMode ? 'bg-gradient-to-br from-gray-800/70 to-gray-700/70 border-gray-600 hover:shadow-indigo-500/20' : 'bg-gradient-to-br from-white/80 to-gray-100/80 border-gray-300 hover:shadow-indigo-200/20'}`}
            >
              <button
                onClick={() => toggleFavorite(note)}
                title={
                  isNoteBookmarked(note)
                    ? "Remove from Favorites"
                    : "Add to Favorites"
                }
                className="absolute top-3 right-3  hover:scale-110 transition"
              >
                <Star
                  size={22}
                  className={
                    isNoteBookmarked(note)
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-500"
                  }
                />
              </button>

              <img
                src={note.image}
                alt={`${note.title} Icon`}
                className="w-20 h-20 mx-auto mb-4 object-contain  drop-shadow-md"
              />
              <h3 className={`text-xl font-semibold mb-1 ${darkMode ? 'text-indigo-300' : 'text-indigo-600'}`}>{note.title}</h3>
              <p className={`text-sm mb-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>PDF Notes Available</p>

              <div className="flex flex-col sm:flex-row gap-2 justify-center">
                <button
                  onClick={() => handlePreview(note.link, note.title)}
                  className={`flex items-center justify-center gap-2 px-4 py-2 rounded-md transition-all duration-200 hover:shadow-lg ${darkMode ? 'bg-blue-600/80 hover:bg-blue-700 text-white' : 'bg-blue-100 hover:bg-blue-200 text-blue-900'}`}
                  title="Preview PDF"
                >
                  <Eye size={16} />
                  Preview
                </button>

                <a
                  href={note.link}
                  download={note.filename}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center justify-center gap-2 px-4 py-2 rounded-md transition-all duration-200 hover:shadow-lg ${darkMode ? 'bg-indigo-600/80 hover:bg-indigo-700 text-white' : 'bg-indigo-100 hover:bg-indigo-200 text-indigo-900'}`}
                  title="Download PDF"
                >
                  <Download size={16} />
                  Download
                </a>
              </div>
            </div>
          ))
        ) : (
          <p className={`text-center col-span-full ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>No notes found.</p>
        )}
      </div>

      {/* PDF Preview Modal */}
      {selectedPdf && (
        <div
          className={`fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-colors duration-200 ${darkMode ? 'bg-black bg-opacity-80' : 'bg-white bg-opacity-80'}`}
          onClick={handleClosePreview}
        >
          <div
            className={`w-full max-w-6xl h-full max-h-[90vh] flex flex-col shadow-2xl rounded-xl ${darkMode ? 'bg-gray-900' : 'bg-white border border-gray-300'}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={`flex justify-between items-center p-4 border-b rounded-t-xl ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-100'}`}>
              <h3 className={`text-xl font-bold truncate ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {selectedTitle} - Preview
              </h3>
              <button
                onClick={handleClosePreview}
                className={`transition p-2 rounded-full ${darkMode ? 'text-gray-400 hover:text-indigo-400 hover:bg-gray-700' : 'text-gray-500 hover:text-indigo-600 hover:bg-gray-200'}`}
                title="Close Preview"
              >
                <X size={22} />
              </button>
            </div>

            <div className="flex-1 p-4 relative">
              {isLoading && (
                <div className={`absolute inset-0 flex items-center justify-center rounded-md z-10 transition-all ${darkMode ? 'bg-gray-900 bg-opacity-80' : 'bg-white bg-opacity-80'}`}>
                  <div className="flex flex-col items-center">
                    <div className={`w-12 h-12 border-4 border-transparent rounded-full animate-spin ${darkMode ? 'border-t-indigo-500 border-b-indigo-500' : 'border-t-indigo-400 border-b-indigo-400'}`}></div>
                    <p className={`mt-4 text-sm font-medium tracking-wide ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Loading PDF...</p>
                  </div>
                </div>
              )}
              <object
                data={`${selectedPdf}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
                type="application/pdf"
                className={`w-full h-full rounded-md shadow-inner border-2 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}
                onLoad={handleIframeLoad}
              >
                <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Unable to display PDF in browser.</p>
                  <a
                    href={selectedPdf}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center gap-2 underline px-4 py-2 rounded-md transition ${darkMode ? 'text-indigo-400 hover:text-indigo-300 bg-gray-800 hover:bg-gray-700' : 'text-indigo-600 hover:text-indigo-800 bg-gray-100 hover:bg-gray-200'}`}
                  >
                    Open PDF in New Tab
                  </a>
                </div>
              </object>
            </div>

            <div className={`p-4 flex justify-end rounded-b-lg border-t ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-100 border-gray-200'}`}>
              <a
                href={selectedPdf}
                download={notesData.find((note) => note.link === selectedPdf)?.filename}
                className={`inline-flex items-center gap-2 font-medium px-4 py-2 rounded-md shadow transition-all duration-200 ${darkMode ? 'bg-indigo-600 hover:bg-indigo-700 text-white' : 'bg-indigo-100 hover:bg-indigo-200 text-indigo-900'}`}
              >
                <Download size={16} />
                Download PDF
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notes;
