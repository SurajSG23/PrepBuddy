import React, { useState } from "react";
import { useThemeSelector } from "../../store/hooks";
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

// A reusable card component to display content, matching the project's theme.
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
    className={`${darkMode ? "bg-gray-800" : "bg-white"} p-6 rounded-lg shadow-xl flex flex-col ${className}`}
    variants={{
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0 },
    }}
    initial="hidden"
    animate="visible"
    exit="hidden"
    transition={{ duration: 0.3 }}
  >
    <h3 className={`text-xl font-semibold mb-4 flex items-center gap-3 ${darkMode ? "text-indigo-400" : "text-indigo-700"}`}>
      {icon}
      {title}
    </h3>
    <div className={`flex-grow prose max-w-none ${darkMode ? "text-gray-300 prose-invert" : "text-gray-800"}`}>
      {children}
    </div>
  </motion.div>
);

// A reusable button for controls, matching the project's theme.
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
    primary: darkMode
      ? "bg-indigo-600 hover:bg-indigo-700 text-white focus:ring-indigo-500 focus:ring-offset-gray-900"
      : "bg-indigo-100 hover:bg-indigo-200 text-indigo-900 focus:ring-indigo-400 focus:ring-offset-white",
    recording: darkMode
      ? "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500 focus:ring-offset-gray-900"
      : "bg-red-100 hover:bg-red-200 text-red-900 focus:ring-red-400 focus:ring-offset-white",
  };

  const disabledClasses = darkMode
    ? "bg-gray-600 text-gray-400 cursor-not-allowed"
    : "bg-gray-200 text-gray-400 cursor-not-allowed";

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${
        disabled ? disabledClasses : variantClasses[variant]
      }`}
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
    >
      {children}
    </motion.button>
  );
};

const AiInterviewPage: React.FC = () => {
  const darkMode = useThemeSelector((state) => state.theme.darkMode);
  // State machine for interview flow: 'idle' -> 'listening' -> 'recording' -> 'processing' -> 'feedback'
  const [status, setStatus] = useState<
    "idle" | "listening" | "recording" | "processing" | "feedback"
  >("idle");

  // Handlers to transition between states
  const handleStartInterview = () => {
    setStatus("listening");
  };

  const handleRecord = () => {
    setStatus("recording");
  };

  const handleStop = () => {
    setStatus("processing");
    // Simulate AI processing time
    setTimeout(() => {
      setStatus("feedback");
    }, 2500);
  };

  const handleNextQuestion = () => {
    // Reset for the next question
    setStatus("listening");
  };

  return (
    <div
      className={`min-h-screen p-6 sm:p-10 font-sans transition-colors duration-300 ${
        darkMode
          ? "bg-gradient-to-br from-[#0f172a] via-[#111827] to-[#0f172a] text-white"
          : "bg-gradient-to-br from-white via-gray-100 to-white text-gray-900"
      }`}
    >
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-10">
          <motion.h1
            className={`text-4xl md:text-5xl font-extrabold mb-3 drop-shadow-lg tracking-wide ${darkMode ? "text-indigo-400" : "text-indigo-700"}`}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            AI Interview Practice
          </motion.h1>
          <motion.p
            className={`text-lg max-w-3xl mx-auto ${darkMode ? "text-gray-400" : "text-gray-600"}`}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Hone your skills by answering questions and receiving instant, AI-powered feedback.
          </motion.p>
        </header>

  <main className="flex flex-col items-center">
          {/* --- CONTROL BUTTONS --- */}
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
              <ControlButton onClick={handleStop} variant="recording" darkMode={darkMode}>
                <Square size={18} />
                Stop Recording
              </ControlButton>
            )}

            {(status === "processing" || status === "feedback") && (
              <>
                <ControlButton onClick={() => {}} disabled={true} darkMode={darkMode}>
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

          {/* --- INTERVIEW DISPLAY AREA --- */}
          <div className="w-full space-y-8">
            <AnimatePresence>
              {status !== "idle" && (
                <InterviewCard
                  title="AI Question"
                  icon={<Bot size={24} className={darkMode ? "text-indigo-400" : "text-indigo-700"} />}
                  darkMode={darkMode}
                >
                  <p>
                    "Tell me about a challenging project you worked on. What were
                    the technical difficulties, and how did you overcome them?"
                  </p>
                </InterviewCard>
              )}

              {status === "recording" && (
                 <InterviewCard
                    title="Your Answer"
                    icon={<Mic size={24} className="text-red-500 animate-pulse" />}
                    darkMode={darkMode}
                >
                    <p className={darkMode ? "text-gray-400" : "text-gray-600"}>Recording your answer... speak clearly.</p>
                </InterviewCard>
              )}
              
              {status === "processing" && (
                <InterviewCard
                  title="Your Answer"
                  icon={
                    <BrainCircuit size={24} className={darkMode ? "text-indigo-400" : "text-indigo-700"} />
                  }
                  darkMode={darkMode}
                >
                  <div className={`flex items-center gap-3 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                    <div className={`animate-spin rounded-full h-5 w-5 border-b-2 ${darkMode ? "border-indigo-400" : "border-indigo-700"}`}></div>
                    <span>Analyzing your response...</span>
                  </div>
                </InterviewCard>
              )}

              {status === "feedback" && (
                <>
                  <InterviewCard
                    title="Your Transcribed Answer"
                    icon={<Mic size={24} className={darkMode ? "text-indigo-400" : "text-indigo-700"} />}
                    darkMode={darkMode}
                  >
                    <p className="italic">
                      "One of the most challenging projects was developing a real-time analytics dashboard. The main technical difficulty was handling the high-velocity data stream from multiple sources without overwhelming the database. We overcame this by implementing a message queue system with Kafka and processing the data in micro-batches using Spark Streaming before storing the aggregated results."
                    </p>
                  </InterviewCard>

                  <InterviewCard
                    title="AI Feedback"
                    icon={<Lightbulb size={24} className={darkMode ? "text-indigo-400" : "text-indigo-700"} />}
                    darkMode={darkMode}
                  >
                    <p>
                      <strong className="text-green-400">Great job!</strong> You used the STAR method effectively by outlining the situation and task. Your explanation of the technical solution is clear and demonstrates strong problem-solving skills.
                    </p>
                    <p className="mt-2">
                      <strong className="text-yellow-400">For improvement:</strong> Consider also mentioning the team collaboration aspect. How did you coordinate with others to implement this solution? Adding that would provide a more complete picture of your role.
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