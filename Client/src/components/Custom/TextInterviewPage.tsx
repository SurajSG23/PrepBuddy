import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Bot, User, Send, RotateCcw } from "lucide-react";
import { AIchatSession } from "../../gemini/AiModel";
import interviewPrompt from "../../gemini/interviewPrompt";

interface InterviewSession {
  questions: string[];
  answers: string[];
  currentQuestionIndex: number;
  feedback: string[];
}

const TextInterviewPage: React.FC = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState<InterviewSession>({
    questions: [],
    answers: [],
    currentQuestionIndex: 0,
    feedback: []
  });
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingQuestion, setIsGeneratingQuestion] = useState(false);
  const [isGeneratingFeedback, setIsGeneratingFeedback] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  // Generate first question on component mount
  useEffect(() => {
    generateNewQuestion();
  }, []);

  const generateNewQuestion = async () => {
    setIsGeneratingQuestion(true);
    try {
      const result = await AIchatSession.sendMessage(interviewPrompt);
      const question = result.response?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
      
      if (question) {
        setSession(prev => ({
          ...prev,
          questions: [...prev.questions, question]
        }));
      } else {
        // Fallback question if AI fails
        setSession(prev => ({
          ...prev,
          questions: [...prev.questions, "Tell me about yourself and your experience in software development."]
        }));
      }
    } catch (error) {
      console.error("Error generating question:", error);
      // Fallback question
      setSession(prev => ({
        ...prev,
        questions: [...prev.questions, "Tell me about yourself and your experience in software development."]
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
        
        Provide brief, constructive feedback on this interview response. Focus on:
        - What was good about the answer
        - Areas for improvement
        - Specific suggestions for better responses
        
        Keep feedback concise, encouraging, and actionable. Limit to 2-3 sentences.
      `;
      
      const result = await AIchatSession.sendMessage(feedbackPrompt);
      const feedback = result.response?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
      
      return feedback || "Good response! Consider providing more specific examples and details to strengthen your answer.";
    } catch (error) {
      console.error("Error generating feedback:", error);
      return "Good response! Consider providing more specific examples and details to strengthen your answer.";
    } finally {
      setIsGeneratingFeedback(false);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!currentAnswer.trim()) return;
    
    setIsLoading(true);
    
    // Save the answer
    const newAnswers = [...session.answers, currentAnswer];
    setSession(prev => ({
      ...prev,
      answers: newAnswers
    }));

    // Generate feedback
    const currentQuestion = session.questions[session.currentQuestionIndex];
    const feedback = await generateFeedback(currentQuestion, currentAnswer);
    
    setSession(prev => ({
      ...prev,
      feedback: [...prev.feedback, feedback]
    }));

    setShowFeedback(true);
    setIsLoading(false);
  };

  const handleNextQuestion = async () => {
    setShowFeedback(false);
    setCurrentAnswer("");
    
    // Move to next question or generate new one
    if (session.currentQuestionIndex < session.questions.length - 1) {
      setSession(prev => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex + 1
      }));
    } else {
      // Generate new question
      await generateNewQuestion();
      setSession(prev => ({
        ...prev,
        currentQuestionIndex: prev.questions.length
      }));
    }
  };

  const handleStartOver = () => {
    setSession({
      questions: [],
      answers: [],
      currentQuestionIndex: 0,
      feedback: []
    });
    setCurrentAnswer("");
    setShowFeedback(false);
    generateNewQuestion();
  };

  const currentQuestion = session.questions[session.currentQuestionIndex];
  const currentFeedback = session.feedback[session.currentQuestionIndex];

  return (
    <div className="text-white min-h-screen p-6 sm:p-10">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft size={20} />
            Back to Interview Options
          </button>
          
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-extrabold text-indigo-400 mb-2">
              AI Interview Practice
            </h1>
            <p className="text-gray-400">
              Question {session.currentQuestionIndex + 1} • Practice with AI-generated questions
            </p>
          </div>
        </div>

        {/* Interview Content */}
        <div className="space-y-6">
          {/* Question Section */}
          <div className="bg-gray-800/60 backdrop-blur-md rounded-2xl p-6 border border-gray-700/40">
            <div className="flex items-start gap-4">
              <div className="bg-indigo-600 p-2 rounded-lg">
                <Bot size={20} />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-white mb-2">AI Interviewer</h3>
                {isGeneratingQuestion ? (
                  <div className="flex items-center gap-3 text-gray-400">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-400"></div>
                    <span>Generating question...</span>
                  </div>
                ) : (
                  <p className="text-gray-300 leading-relaxed">{currentQuestion}</p>
                )}
              </div>
            </div>
          </div>

          {/* Answer Section */}
          {currentQuestion && !showFeedback && (
            <div className="bg-gray-800/60 backdrop-blur-md rounded-2xl p-6 border border-gray-700/40">
              <div className="flex items-start gap-4 mb-4">
                <div className="bg-green-600 p-2 rounded-lg">
                  <User size={20} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-white mb-4">Your Answer</h3>
                  <textarea
                    value={currentAnswer}
                    onChange={(e) => setCurrentAnswer(e.target.value)}
                    placeholder="Type your answer here... Take your time to provide a thoughtful response."
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg p-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[120px] resize-none"
                    disabled={isLoading}
                  />
                  <div className="flex justify-between items-center mt-4">
                    <span className="text-sm text-gray-500">
                      {currentAnswer.length} characters
                    </span>
                    <button
                      onClick={handleSubmitAnswer}
                      disabled={!currentAnswer.trim() || isLoading}
                      className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-all duration-300"
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
              <div className="bg-gray-800/60 backdrop-blur-md rounded-2xl p-6 border border-gray-700/40">
                <div className="flex items-start gap-4">
                  <div className="bg-green-600 p-2 rounded-lg">
                    <User size={20} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-white mb-2">Your Answer</h3>
                    <p className="text-gray-300 leading-relaxed">
                      {session.answers[session.currentQuestionIndex]}
                    </p>
                  </div>
                </div>
              </div>

              {/* AI Feedback */}
              <div className="bg-blue-800/30 backdrop-blur-md rounded-2xl p-6 border border-blue-700/40">
                <div className="flex items-start gap-4">
                  <div className="bg-blue-600 p-2 rounded-lg">
                    <Bot size={20} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-white mb-2">AI Feedback</h3>
                    {isGeneratingFeedback ? (
                      <div className="flex items-center gap-3 text-gray-400">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400"></div>
                        <span>Analyzing your response...</span>
                      </div>
                    ) : (
                      <p className="text-gray-300 leading-relaxed">{currentFeedback}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 justify-center">
                <button
                  onClick={handleNextQuestion}
                  disabled={isGeneratingFeedback}
                  className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300"
                >
                  Next Question
                </button>
                <button
                  onClick={handleStartOver}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2"
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
