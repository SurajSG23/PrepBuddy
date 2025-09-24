import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bot,
  Mic,
  Lightbulb,
  Play,
  Square,
  SkipForward,
  BrainCircuit,
} from "lucide-react";
import { useDarkMode } from "../Custom/DarkModeContext";

// Reusable card
const InterviewCard = ({
  title,
  icon,
  children,
  className,
  darkMode,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  darkMode: boolean;
}) => (
  <motion.div
    className={`p-6 rounded-lg shadow-xl flex flex-col transition-colors ${
      darkMode ? "bg-gray-800 text-gray-300" : "bg-white text-gray-700 border border-gray-200"
    } ${className}`}
    variants={{
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0 },
    }}
    initial="hidden"
    animate="visible"
    exit="hidden"
    transition={{ duration: 0.3 }}
  >
    <h3
      className={`text-xl font-semibold mb-4 flex items-center gap-3 ${
        darkMode ? "text-indigo-400" : "text-indigo-600"
      }`}
    >
      {icon}
      {title}
    </h3>
    <div className="flex-grow prose max-w-none">{children}</div>
  </motion.div>
);

// Reusable button
const ControlButton = ({
  onClick,
  children,
  disabled = false,
  variant = "primary",
  darkMode,
}: {
  onClick: () => void;
  children: React.ReactNode;
  disabled?: boolean;
  variant?: "primary" | "recording";
  darkMode: boolean;
}) => {
  const baseClasses =
    "flex items-center justify-center gap-2 px-5 py-3 w-48 rounded-md font-semibold transition-all duration-300 shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2";

  const variantClasses = {
    primary: "bg-indigo-600 hover:bg-indigo-700 text-white focus:ring-indigo-500",
    recording: "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500",
  };

  const disabledClasses = darkMode
    ? "bg-gray-700 text-gray-400 cursor-not-allowed"
    : "bg-gray-300 text-gray-400 cursor-not-allowed";

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${
        disabled ? disabledClasses : variantClasses[variant]
      } ${darkMode ? "focus:ring-offset-gray-900" : "focus:ring-offset-white"}`}
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
    >
      {children}
    </motion.button>
  );
};

const AiInterviewPage: React.FC = () => {
  const { darkMode } = useDarkMode();

  const [status, setStatus] = useState<
    "idle" | "listening" | "recording" | "processing" | "feedback"
  >("idle");

  // Handlers
  const handleStartInterview = () => setStatus("listening");
  const handleRecord = () => setStatus("recording");
  const handleStop = () => {
    setStatus("processing");
    setTimeout(() => setStatus("feedback"), 2500);
  };
  const handleNextQuestion = () => setStatus("listening");

  return (
    <div
      className={`min-h-screen p-6 sm:p-10 font-sans transition-colors ${
        darkMode
          ? "bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900 text-white"
          : "bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-900"
      }`}
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="text-center mb-10">
          <motion.h1
            className={`text-4xl md:text-5xl font-extrabold mb-3 drop-shadow-lg tracking-wide ${
              darkMode ? "text-indigo-400" : "text-indigo-600"
            }`}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            AI Interview Practice
          </motion.h1>
          <motion.p
            className={`text-lg max-w-3xl mx-auto ${
              darkMode ? "text-gray-400" : "text-gray-600"
            }`}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Hone your skills by answering questions and receiving instant,
            AI-powered feedback.
          </motion.p>
        </header>

        {/* Controls */}
        <main className="flex flex-col items-center">
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {status === "idle" && (
              <ControlButton onClick={handleStartInterview} darkMode={darkMode}>
                <Play size={18} />
                Start Interview
              </ControlButton>
            )}
            {status === "listening" && (
              <ControlButton onClick={handleRecord} darkMode={darkMode}>
                <Mic size={18} />
                Record Answer
              </ControlButton>
            )}
            {status === "recording" && (
              <ControlButton
                onClick={handleStop}
                variant="recording"
                darkMode={darkMode}
              >
                <Square size={18} />
                Stop Recording
              </ControlButton>
            )}
            {(status === "processing" || status === "feedback") && (
              <>
                <ControlButton onClick={() => {}} disabled darkMode={darkMode}>
                  <Mic size={18} />
                  Record Answer
                </ControlButton>
                <ControlButton
                  onClick={handleNextQuestion}
                  disabled={status !== "feedback"}
                  darkMode={darkMode}
                >
                  <SkipForward size={18} />
                  Next Question
                </ControlButton>
              </>
            )}
          </div>

          {/* Display */}
          <div className="w-full space-y-8">
            <AnimatePresence>
              {status !== "idle" && (
                <InterviewCard
                  title="AI Question"
                  icon={<Bot size={24} className="text-indigo-400" />}
                  darkMode={darkMode}
                >
                  <p>
                    "Tell me about a challenging project you worked on. What
                    were the technical difficulties, and how did you overcome
                    them?"
                  </p>
                </InterviewCard>
              )}

              {status === "recording" && (
                <InterviewCard
                  title="Your Answer"
                  icon={<Mic size={24} className="text-red-500 animate-pulse" />}
                  darkMode={darkMode}
                >
                  <p className="opacity-80">Recording your answer... speak clearly.</p>
                </InterviewCard>
              )}

              {status === "processing" && (
                <InterviewCard
                  title="Your Answer"
                  icon={<BrainCircuit size={24} className="text-indigo-400" />}
                  darkMode={darkMode}
                >
                  <div className="flex items-center gap-3 opacity-80">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-400"></div>
                    <span>Analyzing your response...</span>
                  </div>
                </InterviewCard>
              )}

              {status === "feedback" && (
                <>
                  <InterviewCard
                    title="Your Transcribed Answer"
                    icon={<Mic size={24} className="text-indigo-400" />}
                    darkMode={darkMode}
                  >
                    <p className="italic">
                      "One of the most challenging projects was developing a
                      real-time analytics dashboard. The main difficulty was
                      handling a high-velocity data stream without overwhelming
                      the DB. We solved this with Kafka + Spark Streaming for
                      batching before storage."
                    </p>
                  </InterviewCard>

                  <InterviewCard
                    title="AI Feedback"
                    icon={<Lightbulb size={24} className="text-indigo-400" />}
                    darkMode={darkMode}
                  >
                    <p>
                      <strong className="text-green-500">Great job!</strong> You
                      applied the STAR method well and explained your technical
                      solution clearly.
                    </p>
                    <p className="mt-2">
                      <strong className="text-yellow-500">Tip:</strong> Add how
                      you collaborated with your team. That would give a more
                      complete picture of your role.
                    </p>
                  </InterviewCard>
                </>
              )}
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AiInterviewPage;
