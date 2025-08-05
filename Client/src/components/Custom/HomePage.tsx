import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "../../../lib/utils";
import { Link } from "react-router-dom";


interface HeaderProps {
  userID: string;
}

const HomePage: React.FC<HeaderProps> = ({ userID }) => {
  const [testType, setTestType] = useState<"predefined" | "custom" | "focus">(
    "predefined"
  );
  const [userName, setUserName] = useState("");
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
  const tier1 = [
    "Microsoft",
    "Adobe",
    "VMware",
    "Cisco",
    "Uber",
    "Twitter",
    "Oracle",
  ];
  const startup = [
    "Zomato",
    "Swiggy",
    "Byjus",
    "Flipkart",
    "Paytm",
    "Razorpay",
    "PhonePe",
    "Meesho",
    "Ola",
    "Unacademy",
  ];

  const filteredmaang = maang.filter(
    (company) =>
      searchQuery.trim() === "" ||
      company.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredTier1 = tier1.filter(
    (company) =>
      searchQuery.trim() === "" ||
      company.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredStartup = startup.filter(
    (company) =>
      searchQuery.trim() === "" ||
      company.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const isEmpty =
    filteredmaang.length === 0 &&
    filteredTier1.length === 0 &&
    filteredStartup.length === 0;

  useEffect(() => {
    const saved = localStorage.getItem("favoriteCompanies");
    if (saved) {
      setFavorites(JSON.parse(saved));
    }
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
    if (!userID) return;
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/register/getuser2/${userID}`,
          { withCredentials: true }
        );
        setUserName(response.data.name);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [userID, navigate]);

  const addTest = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/test/addtest`,
        {
          title: title,
          difficulty: difficulty,
          topic: topic,
          userid: userID,
          createdAt: new Date(),
        },
        { withCredentials: true }
      );
      navigate("/testpage");
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex absolute top-0 justify-center items-center h-screen bg-black/60 backdrop-blur-md w-full z-50">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-transparent border-t-indigo-500 border-b-indigo-500 rounded-full animate-spin"></div>
          <p className="text-white mt-4 text-lg font-semibold  animate-pulse">
            Loading Homepage...
          </p>
        </div>
      </div>
    );
  }

  if (confirmation) {
    return (
      <div className="flex absolute top-0 justify-center items-center h-screen bg-black/60 backdrop-blur-md w-full z-50">
        <div className="bg-gray-800 rounded-2xl shadow-2xl p-8 text-white w-[90%] max-w-md text-center scale-100 hover:scale-105 transition-transform">
          <h1 className="text-2xl font-bold mb-4">Test Confirmation</h1>
          <p className="text-lg mb-2">
            <span className="font-semibold text-indigo-400">Company:</span>{" "}
            {title}
          </p>
          <p className="text-lg mb-6">
            <span className="font-semibold text-indigo-400">Difficulty:</span>{" "}
            {difficulty}
          </p>
          <div className="flex justify-center gap-8">
            <button
              onClick={() => {
                setConfirmation(false);
              }}
              className="bg-red-600 hover:bg-red-700 px-5 py-2 rounded-lg font-medium shadow-md hover:shadow-red-700/50 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={addTest}
              className="bg-indigo-600 hover:bg-indigo-700 px-5 py-2 rounded-lg font-medium shadow-md hover:shadow-indigo-700/50 transition-all"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (confirmation2) {
    return (
      <div className="flex fixed inset-0 justify-center items-center bg-black/60 backdrop-blur-md z-50">
        <div className="bg-gray-800 rounded-2xl shadow-2xl p-8 text-white w-[90%] max-w-md text-center transform transition-transform duration-300 hover:scale-105">
          <h1 className="text-3xl font-extrabold mb-6 text-indigo-400">Test Confirmation</h1>
          <p className="text-lg mb-2">
            <span className="font-semibold text-indigo-300">Topic:</span>{" "}
            {topic}
          </p>
          <p className="text-lg mb-2">
            <span className="font-semibold text-indigo-300">Company:</span>{" "}
            {title}
          </p>
          <p className="text-lg mb-6">
            <span className="font-semibold text-indigo-300">Difficulty:</span>{" "}
            {difficulty}
          </p>
          <div className="flex justify-center gap-8">
            <button
              onClick={() => {
                setConfirmation2(false);
              }}
              className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded-lg font-semibold shadow-md hover:shadow-red-600/50 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={addTest}
              className="bg-indigo-600 hover:bg-indigo-700 px-5 py-2 rounded-lg font-semibold shadow-md hover:shadow-indigo-600/50 transition-all"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <main className="container mx-auto px-4 py-6">
        <h1 className="text-4xl font-extrabold mb-10 text-center text-gray-100">
          Welcome <span className="text-indigo-500">{userName}</span> to
          PrepBuddy! Get ready to test your skills!
        </h1>

        <div className="mb-10">
          <div className="flex border-b border-gray-700 mb-6 justify-center gap-6">
            <button
              className={`relative px-5 py-3 text-lg font-semibold transition-all duration-300 ${testType === "predefined"
                  ? "text-indigo-400 after:absolute after:left-0 after:bottom-0 after:w-full after:h-0.5 after:bg-indigo-500"
                  : "text-gray-400 hover:text-indigo-300"
                } cursor-pointer`}
              onClick={() => setTestType("predefined")}
            >
              Popular Company Tests
            </button>
            <button
              className={`relative px-5 py-3 text-lg font-semibold transition-all duration-300 ${testType === "custom"
                  ? "text-indigo-400 after:absolute after:left-0 after:bottom-0 after:w-full after:h-0.5 after:bg-indigo-500"
                  : "text-gray-400 hover:text-indigo-300"
                } cursor-pointer`}
              onClick={() => setTestType("custom")}
            >
              Create Custom Test
            </button>
            <button
              className={`relative px-5 py-3 text-lg font-semibold transition-all duration-300 ${testType === "focus"
                  ? "text-indigo-400 after:absolute after:left-0 after:bottom-0 after:w-full after:h-0.5 after:bg-indigo-500"
                  : "text-gray-400 hover:text-indigo-300"
                } cursor-pointer`}
              onClick={() => setTestType("focus")}
            >
              Choose Your Focus Area
            </button>
          </div>

          {testType === "predefined" && (
            <>
              <div className="flex justify-center mb-8">
                <input
                  type="text"
                  placeholder="Search for a company..."
                  className="w-full md:w-1/2 bg-gray-700/50 backdrop-blur-md border border-gray-600 rounded-xl px-5 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-gray-700/80 transition-all duration-300"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              {isEmpty && (
                <p className="text-gray-400 mt-6 text-center text-lg animate-pulse">
                  No results found.
                </p>
              )}
              <p
                className={cn(
                  "mt-2 mb-2 flex mx-auto justify-center items-center font-extrabold text-3xl text-indigo-500 tracking-wide relative after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-20 after:h-1 after:bg-indigo-500 after:rounded-full",
                  filteredmaang.length === 0 && "hidden"
                )}
              >
                MAANG Companies
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredmaang.length > 0 &&
                  filteredmaang.map((company) => (
                    <div
                      key={company}
                      className="bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-indigo-500/30 transform hover:-translate-y-2 transition-all duration-300 group relative overflow-hidden"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-semibold mb-3 group-hover:text-indigo-400 transition">
                          {company}
                        </h3>
                        <div className="flex items-center">
                          <img
                            src={`https://logo.clearbit.com/${company.toLowerCase()}.com`}
                            alt={`${company} logo`}
                            className="w-12 h-12 object-contain rounded-full border border-gray-700 group-hover:scale-110 transition duration-300"
                           />
                          <button
                            onClick={() => toggleFavorite(company)}
                            className="ml-2 text-yellow-400 text-2xl hover:scale-125 transition duration-200"
                            title={favorites.includes(company) ? "Remove from Favorites" : "Add to Favorites"}>

                            {favorites.includes(company) ? "★" : "☆"}
                          </button>
                        </div>
                      </div>
                      <p className="text-gray-300 mb-6">
                        Take the {company} aptitude test to practice for your
                        interview.
                      </p>
                      <button
                        className="w-full bg-indigo-600/80 hover:bg-indigo-600 text-white font-medium py-2 rounded-lg transition-all duration-300 backdrop-blur-md hover:shadow-indigo-500/40 shadow-md"
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredTier1.length > 0 &&
                  filteredTier1.map((company) => (
                    <div
                      key={company}
                      className="bg-gray-800/70 rounded-xl p-6 shadow-lg hover:shadow-indigo-500/30 transform hover:-translate-y-2 transition-all duration-300 group backdrop-blur-md border border-gray-700/40"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-semibold mb-3 group-hover:text-indigo-400 transition">
                          {company}
                        </h3>
                        <div className="flex items-center">
                          <img
                            src={`https://logo.clearbit.com/${company.toLowerCase()}.com`}
                            alt={`${company} logo`}
                           className="w-12 h-12 object-contain rounded-full border border-gray-700 group-hover:scale-110 transition duration-300"
                          />
                          <button
                            onClick={() => toggleFavorite(company)}
                            className="ml-2 text-yellow-400 text-2xl hover:scale-125 transition duration-200"
                            title={favorites.includes(company) ? "Remove from Favorites" : "Add to Favorites"}
                          >
                            {favorites.includes(company) ? "★" : "☆"}
                          </button>
                        </div>
                      </div>
                      <p className="text-gray-300 mb-6">
                        Take the {company} aptitude test to practice for your
                        interview.
                      </p>
                      <button
                        className="w-full bg-indigo-600/80 hover:bg-indigo-600 text-white font-medium py-2 rounded-lg transition-all duration-300 backdrop-blur-md hover:shadow-indigo-500/40 shadow-md"
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
                  "mt-7 mb-2 flex mx-auto justify-center items-center font-bold text-3xl text-indigo-400 text-center tracking-wide",
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
                      className="bg-gray-800/60 backdrop-blur-md rounded-xl p-6 shadow-lg border border-gray-700/40 hover:shadow-indigo-500/30 hover:-translate-y-2 transition-all duration-300 "
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-semibold mb-3 group-hover:text-indigo-400 transition">
                          {company}
                        </h3>
                        <div>
                          <img
                            src={`https://logo.clearbit.com/${company.toLowerCase()}.com`}
                            alt={`${company} logo`}
                            width={50}
                            className="rounded-full border border-gray-600 hover:scale-105 transition"
                          />
                          <button
                            onClick={() => toggleFavorite(company)}
                            className="ml-2 text-yellow-400 text-2xl hover:scale-125 transition"
                            title={favorites.includes(company) ? "Remove from Favorites" : "Add to Favorites"}
                          >
                            {favorites.includes(company) ? "★" : "☆"}
                          </button>
                        </div>
                      </div>
                      <p className="text-gray-300 mb-4">
                        Take the {company} aptitude test to practice for your
                        interview.
                      </p>
                      <button
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md transition-all hover:shadow-md hover:shadow-indigo-500/40"
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
            </>
          )}

          {testType === "custom" && (
            <div className="max-w-2xl mx-auto bg-gray-800/60 backdrop-blur-md rounded-2xl p-16 shadow-lg border border-gray-700/40">
              <h2 className="text-2xl font-bold mb-6 text-white">Create Custom Test</h2>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setConfirmation2(true);
                }}
              >
                <div className="mb-4">
                  <label
                    className="block text-gray-300 mb-2"
                    htmlFor="title"
                  >
                    Test Topic
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={topic}
                    onChange={(e) => {
                      setTopic(e.target.value);
                    }}
                    className="w-full bg-gray-700/50 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                    placeholder="e.g. Computer Networks"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label
                    className="block text-gray-300 mb-2"
                    htmlFor="title"
                  >
                    Company Name
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={title}
                    onChange={(e) => {
                      setTitle(e.target.value);
                    }}
                    className="w-full bg-gray-700/50 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                    placeholder="e.g. Cisco"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label
                    className="block text-gray-300 mb-2"
                    htmlFor="difficulty"
                  >
                    Difficulty Level
                  </label>
                  <select
                    id="difficulty"
                    name="difficulty"
                    value={difficulty}
                    onChange={(e) => {
                      setDifficulty(e.target.value);
                    }}
                    className="w-full bg-gray-700/50 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md transition-all hover:shadow-indigo-500/30 hover:shadow-lg"
                >
                  Generate Test
                </button>
              </form>
            </div>
          )}

          {testType === "focus" && (
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-extrabold mb-8 text-center text-indigo-400 tracking-wide">
                Select a Practice Area
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                <Link to="/aptitude" className="block h-full">
                  <div className="bg-gray-800 p-8 rounded-lg shadow-lg hover:bg-gray-700 hover:shadow-indigo-500/30 transition-all duration-300 cursor-pointer text-center">
                    <h3 className="text-xl font-semibold text-white mb-2">
                      Aptitude Training 🧠
                    </h3>
                    <p className="text-gray-400">
                      Sharpen your logical and quantitative skills.
                    </p>
                  </div>
                </Link>

              <Link to="/technical-questions" className="block h-full">
                <div
                  className="bg-gray-800 p-8 rounded-lg shadow-lg hover:bg-gray-700 hover:shadow-indigo-500/30 transition-all duration-300 cursor-pointer text-center" onClick={() => navigate('/technical-questions')}
                >
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Technical Questions 💻
                  </h3>
                  <p className="text-gray-400">
                    Practice questions on core CS subjects.
                  </p>
                </div>
              </Link>

              
                <div
                  className="bg-gray-800 p-8 rounded-lg shadow-lg hover:bg-gray-700 hover:shadow-indigo-500/30 transition-all duration-300 cursor-pointer text-center"
                >
                  <h3 className="text-xl font-semibold text-white mb-2">
                    AI-Powered Interviews 🤖
                  </h3>
                  <p className="text-gray-400">
                    Simulate real interviews with AI feedback.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default HomePage;