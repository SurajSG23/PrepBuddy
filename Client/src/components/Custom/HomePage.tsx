import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDarkMode } from "../Custom/DarkModeContext";

interface HeaderProps {
  userID: string;
}

const HomePage: React.FC<HeaderProps> = ({ userID }) => {
  const { darkMode } = useDarkMode();

  const [testType, setTestType] = useState<"predefined" | "custom" | "focus">("predefined");
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("Medium");
  const navigate = useNavigate();
  const [confirmation, setConfirmation] = useState(false);
  const [confirmation2, setConfirmation2] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [favorites, setFavorites] = useState<string[]>([]);

  const maang = ["Meta", "Apple", "Amazon", "Netflix", "Google"];
  const tier1 = ["Microsoft", "Adobe", "VMware", "Cisco", "Uber", "Twitter", "Oracle"];
  const startup = ["Zomato", "Swiggy", "Byjus", "Flipkart", "Paytm", "Razorpay", "PhonePe", "Meesho", "Ola", "Unacademy"];

  const filteredmaang = maang.filter(c => searchQuery.trim() === "" || c.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredTier1 = tier1.filter(c => searchQuery.trim() === "" || c.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredStartup = startup.filter(c => searchQuery.trim() === "" || c.toLowerCase().includes(searchQuery.toLowerCase()));
  const isEmpty = filteredmaang.length === 0 && filteredTier1.length === 0 && filteredStartup.length === 0;

  useEffect(() => {
    const saved = localStorage.getItem("favoriteCompanies");
    if (saved) setFavorites(JSON.parse(saved));
  }, []);

  const toggleFavorite = (company: string) => {
    let updatedFavorites;
    if (favorites.includes(company)) {
      updatedFavorites = favorites.filter((c) => c !== company);
    } else {
      updatedFavorites = [...favorites, company];
    }
    setFavorites(updatedFavorites);
    localStorage.setItem("favoriteCompanies", JSON.stringify(updatedFavorites));
  };

  useEffect(() => {
    if (!userID) {
      setLoading(false);
      return;
    }
    setLoading(false);
  }, [userID]);

  const addTest = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/test/addtest`, {
        title,
        difficulty,
        topic,
        userid: userID,
        createdAt: new Date(),
      });
      navigate("/testpage");
    } catch (error) {
      console.error("Error adding test:", error);
    } finally {
      setLoading(false);
    }
  };

  // Loading screen
  if (loading) {
    return (
      <div className={`flex absolute top-0 justify-center items-center h-screen w-full z-50 ${darkMode ? "bg-black/60" : "bg-white/60"} backdrop-blur-md`}>
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-transparent border-t-indigo-500 border-b-indigo-500 rounded-full animate-spin"></div>
          <p className={`${darkMode ? "text-white" : "text-gray-800"} mt-4 text-lg font-semibold animate-pulse`}>
            Loading Homepage...
          </p>
        </div>
      </div>
    );
  }

  // Confirmation Popup (Predefined)
  if (confirmation) {
    return (
      <div className={`flex absolute top-0 justify-center items-center h-screen w-full z-50 ${darkMode ? "bg-black/60" : "bg-white/70"} backdrop-blur-md`}>
        <div className={`rounded-2xl shadow-2xl p-8 w-[90%] max-w-md text-center transition-transform ${darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"} scale-100 hover:scale-105`}>
          <h1 className="text-2xl font-bold mb-4">Test Confirmation</h1>
          <p className="text-lg mb-2">
            <span className="font-semibold text-indigo-500">Company:</span> {title}
          </p>
          <p className="text-lg mb-6">
            <span className="font-semibold text-indigo-500">Difficulty:</span> {difficulty}
          </p>
          <div className="flex justify-center gap-8">
            <button onClick={() => setConfirmation(false)} className="bg-red-600 hover:bg-red-700 px-5 py-2 rounded-lg font-medium shadow-md hover:shadow-red-700/50 transition-all">
              Cancel
            </button>
            <button onClick={addTest} className="bg-indigo-600 hover:bg-indigo-700 px-5 py-2 rounded-lg font-medium shadow-md hover:shadow-indigo-700/50 transition-all">
              Confirm
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Confirmation Popup (Custom)
  if (confirmation2) {
    return (
      <div className={`flex fixed inset-0 justify-center items-center z-50 ${darkMode ? "bg-black/60" : "bg-white/70"} backdrop-blur-md`}>
        <div className={`rounded-2xl shadow-2xl p-8 w-[90%] max-w-md text-center transform transition-transform hover:scale-105 ${darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"}`}>
          <h1 className="text-3xl font-extrabold mb-6 text-indigo-500">Test Confirmation</h1>
          <p className="text-lg mb-2"><span className="font-semibold text-indigo-400">Topic:</span> {topic}</p>
          <p className="text-lg mb-2"><span className="font-semibold text-indigo-400">Company:</span> {title}</p>
          <p className="text-lg mb-6"><span className="font-semibold text-indigo-400">Difficulty:</span> {difficulty}</p>
          <div className="flex justify-center gap-8">
            <button onClick={() => setConfirmation2(false)} className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded-lg font-semibold shadow-md hover:shadow-red-600/50 transition-all">
              Cancel
            </button>
            <button onClick={addTest} className="bg-indigo-600 hover:bg-indigo-700 px-5 py-2 rounded-lg font-semibold shadow-md hover:shadow-indigo-600/50 transition-all">
              Confirm
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="">
      <main className="container mx-auto px-4 py-6">
        <h1 className="pt-2 text-3xl font-extrabold font-serif mb-8 text-center text-slate-400">
          Welcome <span className="text-indigo-500 capitalize">{userName}</span> to
          PrepBuddy! Get ready to test your skills!
 
        </h1>

        {/* Tab Selector */}
        <div className="mb-10">
          <div className={`flex border-b mb-6 justify-center gap-6 ${darkMode ? "border-gray-700" : "border-gray-300"}`}>
            {["predefined", "custom", "focus"].map((type) => (
              <button
                key={type}
                className={`relative px-5 py-3 text-lg font-semibold transition-all duration-300 ${
                  testType === type
                    ? "text-indigo-500 after:absolute after:left-0 after:bottom-0 after:w-full after:h-0.5 after:bg-indigo-500"
                    : `${darkMode ? "text-gray-400 hover:text-indigo-300" : "text-gray-600 hover:text-indigo-500"}`
                }`}
                onClick={() => setTestType(type as any)}
              >
                {type === "predefined" && "Popular Company Tests"}
                {type === "custom" && "Create Custom Test"}
                {type === "focus" && "Choose Your Focus Area"}
              </button>
            ))}
          </div>

          {/* Predefined Tests */}
          {testType === "predefined" && (
            <>
              <div className="flex justify-center mb-8">
                <input
                  type="text"
                  placeholder="Search for a company..."
                  className={`w-full md:w-1/2 rounded-xl px-5 py-3 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300 ${
                    darkMode ? "bg-gray-700/50 border border-gray-600 text-white placeholder-gray-400 focus:bg-gray-700/80" : "bg-gray-100 border border-gray-300 text-gray-900 placeholder-gray-500 focus:bg-white"
                  }`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              {isEmpty && (
                <p className="text-gray-400 mt-4 text-center">
                  No results found.
                </p>
              )}
              <p
                className={cn(
                  "mt-2 mb-2 flex mx-auto justify-center items-center font-bold text-3xl text-indigo-500 text-center",
                  filteredmaang.length === 0 && "hidden"
                )}
              >
                MAANG Companies
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredmaang.length > 0 &&
                  filteredmaang.map((company) => (
                    <div
                      key={company}
                      className="bg-gray-800 rounded-lg p-6 shadow-lg hover:shadow-xl hover:bg-gray-900 transition "
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-semibold mb-3">
                          {company}
                        </h3>
                        <div className="flex items-center pb-4 space-x-4">
                            <button
                            onClick={() => toggleFavorite(company)}
                            className="text-yellow-400 cursor-pointer text-2xl hover:scale-[1.4] transition-transform"
                            title={favorites.includes(company) ? "Remove from Favorites" : "Add to Favorites"}>

                            {favorites.includes(company) ? "★" : "☆"}
                          </button>
                         
                          
                           <img
                            src={`https://logo.clearbit.com/${company.toLowerCase()}.com`}
                            alt={`${company} logo`}
                            width={50}
                            className="w-12 h-12 object-contain rounded-full bg-slate-100 p-0.5 transition-transform hover:scale-110"
                          />
                        </div>
                      </div>
                      <p className="text-gray-300 mb-4">
                        Take the {company} aptitude test to practice for your
                        interview.
                      </p>
                      <button
                        className="bg-indigo-700 hover:bg-indigo-500 text-white px-4 py-2 rounded-md transition cursor-pointer  hover:scale-[1.03]
                        focus:border-2 focus:border-indigo-600"
                        onClick={() => {
                          setTitle(company);
                          setDifficulty("Medium");
                          setConfirmation(true);
                        }}
                      >
                        Start Test
                      </button>
                    </div>
                  ))}
              </div>
              <p
                className={cn(
                  "mt-7 mb-2 flex mx-auto justify-center items-center font-bold text-3xl text-indigo-500 text-center",
                  filteredTier1.length === 0 && "hidden"
                )}
              >
                Tier-1 Companies
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTier1.length > 0 &&
                  filteredTier1.map((company) => (
                    <div
                      key={company}
                      className="bg-gray-800 rounded-lg p-6 shadow-lg hover:shadow-xl hover:bg-gray-900 transition "
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-semibold mb-3">
                          {company}
                        </h3>
                        <div className="flex items-center pb-3 space-x-4">
                           
                           
                          <button
                            onClick={() => toggleFavorite(company)}
                            className="text-yellow-400 cursor-pointer text-2xl hover:scale-[1.4] transition-transform"
                            title={favorites.includes(company) ? "Remove from Favorites" : "Add to Favorites"}
                          >
                             
                            {favorites.includes(company) ? "★" : "☆"}
                          </button>
                          <img
                            src={`https://logo.clearbit.com/${company.toLowerCase()}.com`}
                            alt={`${company} logo`}
                            width={50}
                            className="w-12 h-12 object-contain rounded-full bg-slate-100 p-0.5 transition-transform hover:scale-110"
                          />
                        </div>
                      </div>
                      <p className="text-gray-300 mb-4">
                        Take the {company} aptitude test to practice for your
                        interview.
                      </p>
                      <button
                        className="bg-indigo-700 hover:bg-indigo-500 text-white px-4 py-2 rounded-md transition cursor-pointer hover:scale-[1.03] focus:border-2 focus:border-indigo-600"
                        onClick={() => {
                          setTitle(company);
                          setDifficulty("Medium");
                          setConfirmation(true);
                        }}
                      >
                        Start Test
                      </button>
                    </div>
                  ))}
              </div>
              <p
                className={cn(
                  "mt-7 mb-2 flex mx-auto justify-center items-center font-bold text-3xl text-indigo-500 text-center",
                  filteredStartup.length === 0 && "hidden"
                )}
              >
                Growing Startups / Unicorns
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredStartup.length > 0 &&
                  filteredStartup.map((company) => (
                    <div
                      key={company}
                      className="bg-gray-800 rounded-lg p-6 shadow-lg hover:shadow-xl hover:bg-gray-900 transition "
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-semibold mb-3">
                          {company}
                        </h3>
                        <div className="flex items-center pb-3 space-x-4"> 
                          <div>
                            <button
                            onClick={() => toggleFavorite(company)}
                            className="text-yellow-400 cursor-pointer text-2xl hover:scale-[1.4] transition-transform "
                            title={favorites.includes(company) ? "Remove from Favorites" : "Add to Favorites"}
                            >
                            {favorites.includes(company) ? "★" : "☆"}
 
                          </button>
                            </div>
                          
                           <img
                            src={`https://logo.clearbit.com/${company.toLowerCase()}.com`}
                            alt={`${company} logo`}
                            width={50}
                            className="w-12 h-12 object-contain rounded-full bg-slate-100 p-0.5 transition-transform hover:scale-110"
                            />
                        </div>
                      </div>
                      <p className="text-gray-300 mb-4">
                        Take the {company} aptitude test to practice for your
                        interview.
                      </p>
                      <button
                        className="bg-indigo-700 hover:bg-indigo-500 text-white px-4 py-2 rounded-md transition cursor-pointer"
                        onClick={() => {
                          setTitle(company);
                          setDifficulty("Medium");
                          setConfirmation(true);
                        }}
                      >
                        Start Test
                      </button>
 
 
                    </div>
                  </div>
                )
              ))}
            </>
          )}

          {/* Custom Tests */}
          {testType === "custom" && (
            <div className={`max-w-2xl mx-auto rounded-2xl p-16 shadow-lg backdrop-blur-md ${darkMode ? "bg-gray-800/60 border border-gray-700/40 text-white" : "bg-gray-100 border border-gray-300 text-gray-900"}`}>
              <h2 className="text-2xl font-bold mb-6">Create Custom Test</h2>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setConfirmation2(true);
                }}
              >
                <div className="mb-4">
                  <label className="block mb-2" htmlFor="topic">Test Topic</label>
                  <input
                    type="text"
                    id="topic"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className={`w-full rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition ${
                      darkMode ? "bg-gray-700 border border-gray-600 text-white" : "bg-white border border-gray-300 text-gray-900"
                    }`}
                    placeholder="e.g. Computer Networks"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block mb-2" htmlFor="title">Company Name</label>
                  <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className={`w-full rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition ${
                      darkMode ? "bg-gray-700 border border-gray-600 text-white" : "bg-white border border-gray-300 text-gray-900"
                    }`}
                    placeholder="e.g. Cisco"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block mb-2" htmlFor="difficulty">Difficulty Level</label>
                  <select
                    id="difficulty"
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    className={`w-full rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition ${
                      darkMode ? "bg-gray-700 border border-gray-600 text-white" : "bg-white border border-gray-300 text-gray-900"
                    }`}
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>

                <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md transition hover:shadow-indigo-500/30 hover:shadow-lg">
                  Generate Test
                </button>
              </form>
            </div>
          )}

          {/* Focus Tests */}
          {testType === "focus" && (
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-extrabold mb-8 text-center text-indigo-500">Select a Practice Area</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
                {[
                  { path: "/aptitude", title: "Aptitude Training 🧠", desc: "Sharpen your logical and quantitative skills." },
                  { path: "/technical-questions", title: "Technical Questions 💻", desc: "Practice questions on core CS subjects." },
                  { path: "/ai-interview-options", title: "AI-Powered Interviews 🤖", desc: "Simulate real interviews with AI feedback." },
                ].map((card, idx) => (
                  <Link to={card.path} key={idx} className="block h-full">
                    <div className={`p-8 rounded-lg shadow-lg transition-all duration-300 cursor-pointer text-center min-h-[160px] flex flex-col justify-center ${
                      darkMode ? "bg-gray-800 hover:bg-gray-700 hover:shadow-indigo-500/30" : "bg-white border border-gray-200 hover:bg-gray-50 hover:shadow-indigo-300/30"
                    }`}>
                      <h3 className={`text-xl font-semibold mb-2 ${darkMode ? "text-white" : "text-gray-900"}`}>{card.title}</h3>
                      <p className={darkMode ? "text-gray-400" : "text-gray-600"}>{card.desc}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default HomePage;
