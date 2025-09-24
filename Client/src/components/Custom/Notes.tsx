
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

  return (
    <div className="w-full min-h-screen px-4 py-10 bg-gray-900 text-white">
      <h2 className="text-4xl font-bold text-center text-indigo-400 mb-6">
        📚 Download Notes
      </h2>

      <div className="max-w-md mx-auto mb-8">
        <div className="relative">
          <input
            type="text"
            placeholder="Search notes..."
            className="w-full bg-gray-800 text-white border border-gray-600 rounded-md py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredNotes.length > 0 ? (
          filteredNotes.map((note, index) => (
            <div
              key={index}
              className="bg-gray-800 border border-gray-700 rounded-xl p-5 hover:shadow-2xl hover:scale-[1.03] transition-all duration-300 text-center relative"
            >
              <button
                onClick={() => toggleFavorite(note)}
                title={
                  isNoteBookmarked(note)
                    ? "Remove from Favorites"
                    : "Add to Favorites"
                }
                className="absolute top-3 right-3 cursor-pointer z-10"
              >
                <Star
                  size={22}
                  className={
                    isNoteBookmarked(note)
                      ? "text-yellow-400 fill-yellow-400 stroke-current hover:scale-125 transition-transform duration-200"
                      : "text-gray-500"
                  }
                />
              </button>

              <img
                src={note.image}
                alt={`${note.title} Icon`}
                className="w-20 h-20 mx-auto mb-4 object-contain"
              />
              <h3 className="text-xl font-semibold mb-1">{note.title}</h3>
              <p className="text-sm text-gray-300 mb-4">PDF Notes Available</p>

              <div className="flex flex-col sm:flex-row gap-2 justify-center">
                <button
                  onClick={() => handlePreview(note.link, note.title)}
                  className="flex items-center justify-center gap-2 bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700 transition text-sm"
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
                  className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-3 py-2 rounded-md hover:bg-indigo-700 transition text-sm"
                  title="Download PDF"
                >
                  <Download size={16} />
                  Download
                </a>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-400 col-span-full">No notes found.</p>
        )}
      </div>

      {/* PDF Preview Modal */}
      {selectedPdf && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4"
          onClick={handleClosePreview}
        >
          <div
            className="bg-gray-800 rounded-lg w-full max-w-6xl h-full max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-4 border-b border-gray-700">
              <h3 className="text-xl font-semibold text-white">
                {selectedTitle} - Preview
              </h3>
              <button
                onClick={handleClosePreview}
                className="text-gray-400 hover:text-white transition p-1"
                title="Close Preview"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 p-4 relative">
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-800 rounded-md z-10">
                  <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-400"></div>
                    <p className="text-gray-300 mt-4">Loading PDF...</p>
                  </div>
                </div>
              )}
              <object
                data={`${selectedPdf}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
                type="application/pdf"
                className="w-full h-full rounded-md"
                onLoad={handleIframeLoad}
              >
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <p className="text-gray-400 mb-4">
                    Unable to display PDF in browser.
                  </p>
                  <a
                    href={selectedPdf}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-400 hover:text-indigo-300 underline bg-gray-700 px-4 py-2 rounded-md"
                  >
                    Open PDF in New Tab
                  </a>
                </div>
              </object>
            </div>

            <div className="p-4 border-t border-gray-700 flex justify-end">
              <a
                href={selectedPdf}
                download={notesData.find((note) => note.link === selectedPdf)?.filename}
                className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition"
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
