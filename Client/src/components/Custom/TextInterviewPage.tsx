import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Bot, User, Send, RotateCcw } from "lucide-react";
import { AIchatSession } from "../../gemini/AiModel";
import interviewPrompt from "../../gemini/interviewPrompt";
import { useDarkMode } from "../Custom/DarkModeContext";

interface InterviewSession {
  questions: string[];
  answers: string[];
  currentQuestionIndex: number;
  feedback: string[];
}

const TextInterviewPage: React.FC = () => {
  const navigate = useNavigate();
  const { darkMode } = useDarkMode(); 

  const [session, setSession] = useState<InterviewSession>({
    questions: [],
    answers: [],
    currentQuestionIndex: 0,
    feedback: [],
  });
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingQuestion, setIsGeneratingQuestion] = useState(false);
  const [isGeneratingFeedback, setIsGeneratingFeedback] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  // Generate first question on mount
  useEffect(() => {
    generateNewQuestion();
  }, []);

  const generateNewQuestion = async () => {
    setIsGeneratingQuestion(true);
    try {
      const result = await AIchatSession.sendMessage(interviewPrompt);
      const question =
        result.response?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

      setSession((prev) => ({
        ...prev,
        questions: [
          ...prev.questions,
          question ||
            "Tell me about yourself and your experience in software development.",
        ],
      }));
    } catch (error) {
      console.error("Error generating question:", error);
      setSession((prev) => ({
        ...prev,
        questions: [
          ...prev.questions,
          "Tell me about yourself and your experience in software development.",
        ],
      }));
    } finally {
      setIsGeneratingQuestion(false);
    }
  };

  const generateFeedback = async (question: string, answer: string) => {
    setIsGeneratingFeedback(true);
    try {
      const feedbackPrompt = `
        Interview Question: "${question}"
        Candidate Answer: "${answer}"
        
        Provide brief, constructive feedback (2-3 sentences).
      `;

      const result = await AIchatSession.sendMessage(feedbackPrompt);
      const feedback =
        result.response?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

      return (
        feedback ||
        "Good response! Consider adding specific examples to strengthen your answer."
      );
    } catch (error) {
      console.error("Error generating feedback:", error);
      return "Good response! Consider adding specific examples to strengthen your answer.";
    } finally {
      setIsGeneratingFeedback(false);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!currentAnswer.trim()) return;
    setIsLoading(true);

    const newAnswers = [...session.answers, currentAnswer];
    setSession((prev) => ({ ...prev, answers: newAnswers }));

    const currentQuestion = session.questions[session.currentQuestionIndex];
    const feedback = await generateFeedback(currentQuestion, currentAnswer);

    setSession((prev) => ({
      ...prev,
      feedback: [...prev.feedback, feedback],
    }));

    setShowFeedback(true);
    setIsLoading(false);
  };

  const handleNextQuestion = async () => {
    setShowFeedback(false);
    setCurrentAnswer("");

    if (session.currentQuestionIndex < session.questions.length - 1) {
      setSession((prev) => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex + 1,
      }));
    } else {
      await generateNewQuestion();
      setSession((prev) => ({
        ...prev,
        currentQuestionIndex: prev.questions.length,
      }));
    }
  };

  const handleStartOver = () => {
    setSession({ questions: [], answers: [], currentQuestionIndex: 0, feedback: [] });
    setCurrentAnswer("");
    setShowFeedback(false);
    generateNewQuestion();
  };

  const currentQuestion = session.questions[session.currentQuestionIndex];
  const currentFeedback = session.feedback[session.currentQuestionIndex];

  return (
    <div
      className={`min-h-screen p-6 sm:p-10 transition-colors duration-500 ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className={`flex items-center gap-2 mb-6 transition-colors ${
              darkMode ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-black"
            }`}
          >
            <ArrowLeft size={20} />
            Back to Interview Options
          </button>

          <div className="text-center">
            <h1
              className={`text-3xl md:text-4xl font-extrabold mb-2 ${
                darkMode ? "text-indigo-400" : "text-indigo-600"
              }`}
            >
              AI Interview Practice
            </h1>
            <p className={darkMode ? "text-gray-400" : "text-gray-600"}>
              Question {session.currentQuestionIndex + 1} • Practice with AI-generated questions
            </p>
          </div>
        </div>

        {/* Interview Content */}
        <div className="space-y-6">
          {/* Question Section */}
          <div
            className={`rounded-2xl p-6 border transition-colors ${
              darkMode
                ? "bg-gray-800/60 border-gray-700/40"
                : "bg-white border-gray-200"
            }`}
          >
            <div className="flex items-start gap-4">
              <div className="bg-indigo-600 p-2 rounded-lg text-white">
                <Bot size={20} />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-2">AI Interviewer</h3>
                {isGeneratingQuestion ? (
                  <div className="flex items-center gap-3 text-gray-400">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-400"></div>
                    <span>Generating question...</span>
                  </div>
                ) : (
                  <p className={darkMode ? "text-gray-300" : "text-gray-700"}>
                    {currentQuestion}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Answer Section */}
          {currentQuestion && !showFeedback && (
            <div
              className={`rounded-2xl p-6 border transition-colors ${
                darkMode
                  ? "bg-gray-800/60 border-gray-700/40"
                  : "bg-white border-gray-200"
              }`}
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="bg-green-600 p-2 rounded-lg text-white">
                  <User size={20} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-4">Your Answer</h3>
                  <textarea
                    value={currentAnswer}
                    onChange={(e) => setCurrentAnswer(e.target.value)}
                    placeholder="Type your answer here..."
                    className={`w-full rounded-lg p-4 min-h-[120px] resize-none focus:outline-none focus:ring-2 transition-colors ${
                      darkMode
                        ? "bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:ring-indigo-500"
                        : "bg-gray-100 border border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-indigo-400"
                    }`}
                    disabled={isLoading}
                  />
                  <div className="flex justify-between items-center mt-4">
                    <span className="text-sm opacity-70">
                      {currentAnswer.length} characters
                    </span>
                    <button
                      onClick={handleSubmitAnswer}
                      disabled={!currentAnswer.trim() || isLoading}
                      className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg transition-all duration-300"
                    >
                      {isLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          Processing...
                        </>
                      ) : (
                        <>
                          <Send size={16} />
                          Submit Answer
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Feedback Section */}
          {showFeedback && (
            <div className="space-y-4">
              {/* Your Answer */}
              <div
                className={`rounded-2xl p-6 border transition-colors ${
                  darkMode
                    ? "bg-gray-800/60 border-gray-700/40"
                    : "bg-white border-gray-200"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="bg-green-600 p-2 rounded-lg text-white">
                    <User size={20} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-2">Your Answer</h3>
                    <p className={darkMode ? "text-gray-300" : "text-gray-700"}>
                      {session.answers[session.currentQuestionIndex]}
                    </p>
                  </div>
                </div>
              </div>

              {/* AI Feedback */}
              <div
                className={`rounded-2xl p-6 border transition-colors ${
                  darkMode
                    ? "bg-blue-900/40 border-blue-700/40"
                    : "bg-blue-50 border-blue-200"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="bg-blue-600 p-2 rounded-lg text-white">
                    <Bot size={20} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-2">AI Feedback</h3>
                    {isGeneratingFeedback ? (
                      <div className="flex items-center gap-3 text-gray-400">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400"></div>
                        <span>Analyzing your response...</span>
                      </div>
                    ) : (
                      <p className={darkMode ? "text-gray-300" : "text-gray-700"}>
                        {currentFeedback}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 justify-center">
                <button
                  onClick={handleNextQuestion}
                  disabled={isGeneratingFeedback}
                  className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300"
                >
                  Next Question
                </button>
                <button
                  onClick={handleStartOver}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2 ${
                    darkMode
                      ? "bg-gray-600 hover:bg-gray-700 text-white"
                      : "bg-gray-300 hover:bg-gray-400 text-gray-900"
                  }`}
                >
                  <RotateCcw size={16} />
                  Start Over
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TextInterviewPage;
