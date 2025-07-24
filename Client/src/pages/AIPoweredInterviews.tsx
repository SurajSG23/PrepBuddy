import React from "react";

const AIPoweredInterviews: React.FC = () => {
  return (
    <div className="bg-gray-900 text-white min-h-screen p-8">
      <div className="container mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-indigo-400 mb-2">
            AI-Powered Mock Interviews
          </h1>
          <p className="text-lg text-gray-400">
            Build confidence with realistic, AI-driven interview simulations.
          </p>
        </header>

        <main>
          <div className="bg-gray-800 p-8 rounded-lg shadow-xl text-center">
            <h2 className="text-2xl font-semibold text-white mb-4">
              Coming Soon! 🤖
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              The future of interview prep is almost here. Our AI interviewer will
              conduct mock interviews, ask relevant questions based on your target
              role, and provide instant, detailed feedback on your communication,
              technical accuracy, and problem-solving approach.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AIPoweredInterviews;