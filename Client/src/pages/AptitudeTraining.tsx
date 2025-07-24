import React from "react";

const AptitudeTraining: React.FC = () => {
  return (
    <div className="bg-gray-900 text-white min-h-screen p-8">
      <div className="container mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-indigo-400 mb-2">
            Aptitude Training Hub
          </h1>
          <p className="text-lg text-gray-400">
            Sharpen your logical, quantitative, and verbal reasoning skills.
          </p>
        </header>

        <main>
          <div className="bg-gray-800 p-8 rounded-lg shadow-xl text-center">
            <h2 className="text-2xl font-semibold text-white mb-4">
              Coming Soon! 🧠
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              This section is under active development. Soon, you'll find a
              comprehensive set of practice tests, tutorials, and performance
              analytics to help you ace the aptitude rounds of your dream
              company.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AptitudeTraining;