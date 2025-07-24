import React from "react";

const TechnicalQuestions: React.FC = () => {
  return (
    <div className="bg-gray-900 text-white min-h-screen p-8">
      <div className="container mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-indigo-400 mb-2">
            Technical Questions Practice
          </h1>
          <p className="text-lg text-gray-400">
            Master core CS fundamentals and domain-specific knowledge.
          </p>
        </header>

        <main>
          <div className="bg-gray-800 p-8 rounded-lg shadow-xl text-center">
            <h2 className="text-2xl font-semibold text-white mb-4">
              Coming Soon! 💻
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Get ready! This area will soon be populated with a vast library of
              technical questions covering Data Structures, Algorithms, OS, DBMS,
              and more. Practice topic-wise or take mixed quizzes to simulate real
              interview scenarios.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default TechnicalQuestions;