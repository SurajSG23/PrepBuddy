import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
interface HeaderProps {
  userID: string;
}

const HomePage: React.FC<HeaderProps> = ({ userID }) => {
  const [testType, setTestType] = useState<"predefined" | "custom">(
    "predefined"
  );
  const [userName, setUserName] = useState();
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("Medium");
  const navigate = useNavigate();
  const [confirmation, setConfirmation] = useState(false);
  const [confirmation2, setConfirmation2] = useState(false);

  useEffect(() => {
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
  }, [userID,navigate]);

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
      <>
        <div className="flex absolute top-0 justify-center items-center h-screen bg-gray-900 w-full z-99">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 border-4 border-transparent border-t-blue-500 border-b-blue-500 rounded-full animate-spin"></div>
            <p className="text-white mt-4 text-lg font-semibold">Loading Homepage...</p>
          </div>
        </div>
      </>
    );
  }
  if (confirmation) {
    return (
      <div className="flex absolute top-0 justify-center items-center h-screen bg-gray-900 w-full z-50">
        <div className="bg-gray-800 rounded-2xl shadow-lg p-8 text-white w-[90%] max-w-md text-center">
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
              className="bg-red-600 hover:bg-red-700 px-5 py-2 rounded-lg cursor-pointer font-medium transition"
            >
              Cancel
            </button>
            <button
              onClick={addTest}
              className="bg-indigo-600 hover:bg-indigo-700 px-5 py-2 rounded-lg cursor-pointer font-medium transition"
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
      <div className="flex absolute top-0 justify-center items-center h-screen bg-gray-900 w-full z-50">
        <div className="bg-gray-800 rounded-2xl shadow-lg p-8 text-white w-[90%] max-w-md text-center">
          <h1 className="text-2xl font-bold mb-4">Test Confirmation</h1>
          <p className="text-lg mb-2">
            <span className="font-semibold text-indigo-400">Topic:</span>{" "}
            {topic}
          </p>
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
                setConfirmation2(false);
              }}
              className="bg-red-600 hover:bg-red-700 px-5 py-2 rounded-lg cursor-pointer font-medium transition"
            >
              Cancel
            </button>
            <button
              onClick={addTest}
              className="bg-indigo-600 hover:bg-indigo-700 px-5 py-2 rounded-lg cursor-pointer font-medium transition"
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
        <h1 className="text-3xl font-bold mb-8 text-center">
          Welcome <span className="text-indigo-500">{userName}</span> to
          PrepBuddy! Get ready to test your skills!
        </h1>

        <div className="mb-8">
          <div className="flex border-b border-gray-700 mb-6">
            <button
              className={`px-4 py-2 ${
                testType === "predefined"
                  ? "border-b-2 border-indigo-500 text-indigo-400"
                  : "text-gray-400"
              } cursor-pointer`}
              onClick={() => setTestType("predefined")}
            >
              Popular Company Tests
            </button>
            <button
              className={`px-4 py-2 ${
                testType === "custom"
                  ? "border-b-2 border-indigo-500 text-indigo-400"
                  : "text-gray-400"
              } cursor-pointer`}
              onClick={() => setTestType("custom")}
            >
              Create Custom Test
            </button>
          </div>

          {testType === "predefined" ? (
            <>
              <p className="mt-2 mb-2 flex mx-auto justify-center items-center font-bold text-3xl text-indigo-500 text-center">
                MAANG Companies
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {["Meta", "Apple", "Amazon", "Netflix", "Google"].map(
                  (company) => (
                    <div
                      key={company}
                      className="bg-gray-800 rounded-lg p-6 shadow-lg hover:shadow-xl hover:bg-gray-900 transition "
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-semibold mb-3">
                          {company}
                        </h3>
                        <div>
                          <img
                            src={`https://logo.clearbit.com/${company.toLowerCase()}.com`}
                            alt={`${company} logo`}
                            width={50}
                          />
                        </div>
                      </div>
                      <p className="text-gray-300 mb-4">
                        Take the {company} aptitude test to practice for your
                        interview.
                      </p>
                      <button
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md transition cursor-pointer"
                        onClick={() => {
                          setTitle(company);
                          setDifficulty("Medium");
                          setConfirmation(true);
                        }}
                      >
                        Start Test
                      </button>
                    </div>
                  )
                )}
              </div>
              <p className="mt-7 mb-2 flex mx-auto justify-center items-center font-bold text-3xl text-indigo-500 text-center">
                Tier-1 Companies
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  "Microsoft",
                  "Adobe",
                  "VMware",
                  "Cisco",
                  "Uber",
                  "Twitter",
                  "Oracle",
                ].map((company) => (
                  <div
                    key={company}
                    className="bg-gray-800 rounded-lg p-6 shadow-lg hover:shadow-xl hover:bg-gray-900 transition "
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-semibold mb-3">{company}</h3>
                      <div>
                        <img
                          src={`https://logo.clearbit.com/${company.toLowerCase()}.com`}
                          alt={`${company} logo`}
                          width={50}
                        />
                      </div>
                    </div>
                    <p className="text-gray-300 mb-4">
                      Take the {company} aptitude test to practice for your
                      interview.
                    </p>
                    <button
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md transition cursor-pointer"
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
              <p className="mt-7 mb-2 flex mx-auto justify-center items-center font-bold text-3xl text-indigo-500 text-center">
                Growing Startups / Unicorns
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
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
                ].map((company) => (
                  <div
                    key={company}
                    className="bg-gray-800 rounded-lg p-6 shadow-lg hover:shadow-xl hover:bg-gray-900 transition "
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-semibold mb-3">{company}</h3>
                      <div>
                        <img
                          src={`https://logo.clearbit.com/${company.toLowerCase()}.com`}
                          alt={`${company} logo`}
                          width={50}
                        />
                      </div>
                    </div>
                    <p className="text-gray-300 mb-4">
                      Take the {company} aptitude test to practice for your
                      interview.
                    </p>
                    <button
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md transition cursor-pointer"
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
          ) : (
            <div className="max-w-2xl mx-auto bg-gray-800 rounded-lg p-16 shadow-lg">
              <h2 className="text-2xl font-bold mb-6">Create Custom Test</h2>
              <form
                onSubmit={() => {
                  setConfirmation2(true);
                }}
              >
                <div className="mb-4">
                  <label className="block text-gray-300 mb-2" htmlFor="title">
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
                    className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="e.g. Computer Networks"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-300 mb-2" htmlFor="title">
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
                    className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                    className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md transition"
                >
                  Generate Test
                </button>
              </form>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default HomePage;
