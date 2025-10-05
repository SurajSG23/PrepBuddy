import React from "react";
import { motion } from "framer-motion";
import {
  BookCopy,
  ListChecks,
  BrainCircuit,
  Database,
  Shuffle,
  Cpu,
  Coffee,
  FileCode,
  Paintbrush,
  Terminal,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useDarkMode } from "../Custom/DarkModeContext";

const PracticeButton = ({
  children,
  to,
  darkMode,
}: {
  children: React.ReactNode;
  to: string;
  darkMode: boolean;
}) => (
  <Link
    to={to}
    className={`w-full h-full ${
      darkMode ? "bg-indigo-700 hover:bg-indigo-600" : "bg-indigo-600 hover:bg-indigo-700"
    } text-white px-4 py-2 rounded-md transition-colors duration-300 flex items-center justify-center gap-2`}
  >
    {children}
  </Link>
);

const PracticeCard = ({
  title,
  description,
  icon,
  children,
  darkMode,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  darkMode: boolean;
}) => (
  <motion.div
    className={`${
      darkMode ? "bg-gray-800 text-gray-200" : "bg-gray-100 text-gray-900"
    } p-8 rounded-lg shadow-xl flex flex-col transition-transform duration-300`}
    variants={{
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0 },
    }}
    whileHover={{ scale: 1.02 }}
  >
    <h2 className="text-2xl font-semibold mb-3 flex items-center gap-3">
      <span className="text-indigo-400">{icon}</span>
      {title}
    </h2>
    <p className={`${darkMode ? "text-gray-300" : "text-gray-700"} mb-6 flex-grow`}>
      {description}
    </p>
    <div className="mt-auto">{children}</div>
  </motion.div>
);

const TechnicalQuestions: React.FC = () => {
  const { darkMode } = useDarkMode();

  const topics = [
    { name: "Data Structures & Algorithms", icon: <BookCopy size={18} />, slug: "dsasheet" },
    { name: "Operating Systems", icon: <BrainCircuit size={18} />, slug: "operating-systems" },
    { name: "Computer Networks", icon: <ListChecks size={18} />, slug: "practice/computer-networks" },
    { name: "Database Management Systems", icon: <Database size={18} />, slug: "dbms" },
    { name: "Computer Architecture", icon: <Cpu size={18} />, slug: "practice/computer-architecture" },
    { name: "Java Programming", icon: <Coffee size={18} />, slug: "practice/java-programming" },
    { name: "C++ Programming", icon: <FileCode size={18} />, slug: "practice/cpp-programming" },
    { name: "Javascript", icon: <FileCode size={18} />, slug: "practice/javascript" },
    { name: "HTML", icon: <FileCode size={18} />, slug: "practice/html" },
    { name: "CSS", icon: <Paintbrush size={18} />, slug: "practice/css" },
    { name: "Python", icon: <Terminal size={18} />, slug: "pythonpractice" },
    { name: "C Programming", icon: <FileCode size={18} />, slug: "CPractice" },
  ];

  return (
    <div
      className={`${
        darkMode
          ? "bg-gradient-to-br from-[#0f172a] via-[#111827] to-[#0f172a] text-gray-200"
          : "bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 text-gray-900"
      } min-h-screen p-6 sm:p-10 transition-colors duration-500`}
    >
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-14">
          <h1
            className={`text-4xl md:text-5xl font-extrabold mb-3 drop-shadow-lg tracking-wide ${
              darkMode ? "text-indigo-400" : "text-indigo-600"
            }`}
          >
            Technical Questions Practice
          </h1>
          <p className={`${darkMode ? "text-gray-400" : "text-gray-600"} text-lg max-w-3xl mx-auto`}>
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
            icon={<ListChecks size={28} />}
            darkMode={darkMode}
          >
            <div className="grid grid-cols-2 gap-4">
              {topics.map((topic) => (
                <PracticeButton key={topic.name} to={`/${topic.slug}`} darkMode={darkMode}>
                  {topic.icon}
                  <span>{topic.name}</span>
                </PracticeButton>
              ))}
            </div>
          </PracticeCard>

          <PracticeCard
            title="Simulate an Interview"
            description="Take a mixed quiz with questions from all topics to test your overall knowledge and get ready for real-world interviews."
            icon={<Shuffle size={28} />}
            darkMode={darkMode}
          >
            <PracticeButton to="/mixed-quiz" darkMode={darkMode}>
              <Shuffle size={18} />
              <span>Start Mixed Quiz</span>
            </PracticeButton>
          </PracticeCard>
        </motion.main>
      </div>
    </div>
  );
};

export default TechnicalQuestions;
