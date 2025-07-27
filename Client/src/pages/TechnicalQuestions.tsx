import React from "react";
import { motion } from "framer-motion";
import {
  BookCopy,
  ListChecks,
  BrainCircuit,
  Database,
  Shuffle,
} from "lucide-react";

const ComingSoonButton = ({ children }: { children: React.ReactNode }) => (
  <div className="relative group">
    <button
      disabled
      className="w-full bg-gray-700 text-gray-400 px-4 py-2 rounded-md cursor-not-allowed transition-colors duration-300 flex items-center justify-center gap-2"
    >
      {children}
    </button>
    <div
      className="absolute bottom-full mb-2 w-max px-3 py-1.5 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      style={{ left: "50%", transform: "translateX(-50%)" }}
    >
      Coming Soon!
      <div
        className="tooltip-arrow"
        data-popper-arrow
        style={{
          position: "absolute",
          left: "50%",
          bottom: "-4px",
          width: "8px",
          height: "8px",
          backgroundColor: "#111827",
          transform: "translateX(-50%) rotate(45deg)",
        }}
      ></div>
    </div>
  </div>
);

const PracticeCard = ({
  title,
  description,
  icon,
  children,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) => (
  <motion.div
    className="bg-gray-800 p-8 rounded-lg shadow-xl flex flex-col transition-transform duration-300"
    variants={{
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0 },
    }}
    whileHover={{ scale: 1.02 }}
  >
    <h2 className="text-2xl font-semibold text-white mb-3 flex items-center gap-3">
      {icon}
      {title}
    </h2>
    <p className="text-gray-300 mb-6 flex-grow">{description}</p>
    <div className="mt-auto">{children}</div>
  </motion.div>
);

const TechnicalQuestions: React.FC = () => {
  const topics = [
    { name: "Data Structures", icon: <BookCopy size={18} /> },
    { name: "Algorithms", icon: <BrainCircuit size={18} /> },
    { name: "Operating Systems", icon: <ListChecks size={18} /> },
    { name: "DBMS", icon: <Database size={18} /> },
  ];

  return (
    <div className="bg-gray-900 text-white min-h-screen p-4 sm:p-8">
      <div className="container mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-indigo-400 mb-2">
            Technical Questions Practice
          </h1>
          <p className="text-lg text-gray-400 max-w-3xl mx-auto">
            Master core CS fundamentals and domain-specific knowledge. Get ready
            to practice topic-wise or take mixed quizzes to simulate real
            interview scenarios.
          </p>
        </header>

        <motion.main
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto"
          initial="hidden"
          animate="visible"
          transition={{ staggerChildren: 0.1 }}
        >
          <PracticeCard
            title="Practice by Topic"
            description="Focus on specific areas by choosing from our library of core computer science topics."
            icon={<ListChecks size={24} className="text-indigo-400" />}
          >
            <div className="grid grid-cols-2 gap-4">
              {topics.map((topic) => (
                <ComingSoonButton key={topic.name}>
                  {topic.icon}
                  <span>{topic.name}</span>
                </ComingSoonButton>
              ))}
            </div>
          </PracticeCard>

          <PracticeCard
            title="Simulate an Interview"
            description="Take a mixed quiz with questions from all topics to test your overall knowledge and get ready for real-world interviews."
            icon={<Shuffle size={24} className="text-indigo-400" />}
          >
            <ComingSoonButton>Start Mixed Quiz</ComingSoonButton>
          </PracticeCard>
        </motion.main>
      </div>
    </div>
  );
};

export default TechnicalQuestions;
