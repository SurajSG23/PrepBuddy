import React from "react";
import { useNavigate } from "react-router-dom";
import { MessageSquareText, Volume2, BarChart3 } from "lucide-react";

const AiInterviewOptionsPage: React.FC = () => {
  const navigate = useNavigate();

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
    <div className="text-white min-h-screen p-6 sm:p-10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <h1 className="text-4xl md:text-5xl font-extrabold text-indigo-400 mb-3 drop-shadow-lg tracking-wide">
            AI-Powered Interview Practice
          </h1>
          <p className="text-lg text-gray-400 max-w-3xl mx-auto">
            Master your interview skills with AI-powered question generation and instant feedback. 
            Choose your preferred practice mode to get started.
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Practice by Mode */}
          <div className="bg-gray-800/60 backdrop-blur-md rounded-2xl p-8 shadow-lg border border-gray-700/40">
            <div className="flex items-center gap-3 mb-6">
              <MessageSquareText className="w-8 h-8 text-indigo-400" />
              <h2 className="text-2xl font-bold text-white">Practice by Mode</h2>
            </div>
            <p className="text-gray-400 mb-8">
              Choose from different interview modes based on your preference and skill level.
            </p>
            
            <div className="grid grid-cols-1 gap-4">
              <button
                onClick={() => handleOptionSelect("text-interview")}
                className="bg-indigo-600 hover:bg-indigo-700 text-white p-4 rounded-lg transition-all duration-300 text-left flex items-center gap-3"
              >
                <MessageSquareText className="w-6 h-6" />
                <div>
                  <h3 className="font-semibold">Text-Based Practice</h3>
                  <p className="text-sm text-indigo-200">Practice with text-based responses</p>
                </div>
              </button>
              
              <button
                onClick={() => handleOptionSelect("voice-interview")}
                className="bg-indigo-600 hover:bg-indigo-700 text-white p-4 rounded-lg transition-all duration-300 text-left flex items-center gap-3"
              >
                <Volume2 className="w-6 h-6" />
                <div>
                  <h3 className="font-semibold">Voice-Based Practice</h3>
                  <p className="text-sm text-indigo-200">Speak your answers naturally</p>
                </div>
              </button>
              
              <button
                onClick={() => handleOptionSelect("video-interview")}
                className="bg-indigo-600 hover:bg-indigo-700 text-white p-4 rounded-lg transition-all duration-300 text-left flex items-center gap-3"
              >
                <BarChart3 className="w-6 h-6" />
                <div>
                  <h3 className="font-semibold">Video Interview Practice</h3>
                  <p className="text-sm text-indigo-200">Video-based interview practice</p>
                </div>
              </button>
            </div>
          </div>

          {/* Simulate an Interview */}
          <div className="bg-gray-800/60 backdrop-blur-md rounded-2xl p-8 shadow-lg border border-gray-700/40">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 text-indigo-400">🤖</div>
              <h2 className="text-2xl font-bold text-white">Simulate an Interview</h2>
            </div>
            <p className="text-gray-400 mb-8">
              Take a comprehensive AI-powered interview simulation to test your overall 
              readiness and get detailed feedback on your performance.
            </p>
            
            <button
              onClick={() => alert("Full AI Interview Session coming soon! Use Practice by Mode for text-based interview practice.")}
              className="w-full bg-gray-600 hover:bg-gray-700 text-white py-4 px-6 rounded-lg font-semibold transition-all duration-300 opacity-60"
            >
              Start AI Interview Session (Coming Soon)
            </button>
            
            <div className="mt-6 text-sm text-gray-500">
              <p>✓ AI-generated questions tailored to your experience</p>
              <p>✓ Real-time feedback and scoring</p>
              <p>✓ Detailed performance analysis</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiInterviewOptionsPage;
