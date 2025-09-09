import React from "react";
import { useNavigate } from "react-router-dom";
import { MessageSquareText, Volume2, BarChart3 } from "lucide-react";
import { useDarkMode } from "../Custom/DarkModeContext";

const AiInterviewOptionsPage: React.FC = () => {
  const navigate = useNavigate();
  const { darkMode } = useDarkMode();

  const handleOptionSelect = (optionId: string) => {
    if (optionId === "text-interview") {
      navigate("/ai-interview/text");
    } else if (optionId === "voice-interview") {
      navigate("/ai-interview/voice");
    } else if (optionId === "video-interview") {
      navigate("/ai-interview/video");
    } else {
      alert("This feature is coming soon!");
    }
  };

  return (
    <div
      className={`min-h-screen p-6 sm:p-10 transition-colors duration-500 ${
        darkMode
          ? "bg-gradient-to-br from-gray-900 via-gray-950 to-black text-white"
          : "bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-900"
      }`}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <h1
            className={`text-4xl md:text-5xl font-extrabold mb-3 drop-shadow-lg tracking-wide ${
              darkMode ? "text-indigo-400" : "text-indigo-600"
            }`}
          >
            AI-Powered Interview Practice
          </h1>
          <p
            className={`text-lg max-w-3xl mx-auto ${
              darkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Master your interview skills with AI-powered question generation and
            instant feedback. Choose your preferred practice mode to get
            started.
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Practice by Mode */}
          <div
            className={`rounded-2xl p-8 shadow-lg backdrop-blur-md transition-colors border ${
              darkMode
                ? "bg-gray-800/70 border-gray-700/40"
                : "bg-white border-gray-200"
            }`}
          >
            <div className="flex items-center gap-3 mb-6">
              <MessageSquareText
                className={`w-8 h-8 ${
                  darkMode ? "text-indigo-400" : "text-indigo-600"
                }`}
              />
              <h2
                className={`text-2xl font-bold ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Practice by Mode
              </h2>
            </div>
            <p className={darkMode ? "text-gray-400 mb-8" : "text-gray-600 mb-8"}>
              Choose from different interview modes based on your preference and
              skill level.
            </p>

            <div className="grid grid-cols-1 gap-4">
              <button
                onClick={() => handleOptionSelect("text-interview")}
                className={`p-4 rounded-lg transition-all duration-300 text-left flex items-center gap-3 ${
                  darkMode
                    ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                    : "bg-indigo-500 hover:bg-indigo-600 text-white"
                }`}
              >
                <MessageSquareText className="w-6 h-6" />
                <div>
                  <h3 className="font-semibold">Text-Based Practice</h3>
                  <p className="text-sm opacity-80">
                    Practice with text-based responses
                  </p>
                </div>
              </button>

              <button
                onClick={() => handleOptionSelect("voice-interview")}
                className={`p-4 rounded-lg transition-all duration-300 text-left flex items-center gap-3 ${
                  darkMode
                    ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                    : "bg-indigo-500 hover:bg-indigo-600 text-white"
                }`}
              >
                <Volume2 className="w-6 h-6" />
                <div>
                  <h3 className="font-semibold">Voice-Based Practice</h3>
                  <p className="text-sm opacity-80">Speak your answers naturally</p>
                </div>
              </button>

              <button
                onClick={() => handleOptionSelect("video-interview")}
                className={`p-4 rounded-lg transition-all duration-300 text-left flex items-center gap-3 ${
                  darkMode
                    ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                    : "bg-indigo-500 hover:bg-indigo-600 text-white"
                }`}
              >
                <BarChart3 className="w-6 h-6" />
                <div>
                  <h3 className="font-semibold">Video Interview Practice</h3>
                  <p className="text-sm opacity-80">Video-based interview practice</p>
                </div>
              </button>
            </div>
          </div>

          {/* Simulate an Interview */}
          <div
            className={`rounded-2xl p-8 shadow-lg backdrop-blur-md transition-colors border ${
              darkMode
                ? "bg-gray-800/70 border-gray-700/40"
                : "bg-white border-gray-200"
            }`}
          >
            <div className="flex items-center gap-3 mb-6">
              <div
                className={`w-8 h-8 ${
                  darkMode ? "text-indigo-400" : "text-indigo-600"
                }`}
              >
                🤖
              </div>
              <h2
                className={`text-2xl font-bold ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Simulate an Interview
              </h2>
            </div>
            <p className={darkMode ? "text-gray-400 mb-8" : "text-gray-600 mb-8"}>
              Take a comprehensive AI-powered interview simulation to test your
              overall readiness and get detailed feedback on your performance.
            </p>

            <button
              onClick={() => navigate("/ai-interview/full")}
              className={`w-full py-4 px-6 rounded-lg font-semibold transition-all duration-300 ${
                darkMode
                  ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                  : "bg-indigo-500 hover:bg-indigo-600 text-white"
              }`}
            >
              Start AI Interview Session
            </button>

            <div
              className={`mt-6 text-sm ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              <p>✓ Mixed format: Text, Voice & Video questions</p>
              <p>✓ 10 comprehensive interview questions</p>
              <p>✓ Detailed AI feedback and analysis</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiInterviewOptionsPage;
