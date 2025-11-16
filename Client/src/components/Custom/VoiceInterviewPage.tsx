import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Bot,
  Mic,
  Volume2,
  VolumeX,
  RotateCcw,
  Square,
} from "lucide-react";
import { AIchatSession } from "../../gemini/AiModel";
import { useDarkMode } from "../Custom/DarkModeContext";

interface VoiceInterviewSession {
  questions: string[];
  answers: string[];
  transcripts: string[];
  currentQuestionIndex: number;
  isCompleted: boolean;
  finalFeedback: string;
}

const VoiceInterviewPage: React.FC = () => {
  const navigate = useNavigate();
  const { darkMode } = useDarkMode(); 

  const [session, setSession] = useState<VoiceInterviewSession>({
    questions: [],
    answers: [],
    transcripts: [],
    currentQuestionIndex: 0,
    isCompleted: false,
    finalFeedback: "",
  });

  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);

  const [isGeneratingQuestions, setIsGeneratingQuestions] = useState(false);
  const [isGeneratingFeedback, setIsGeneratingFeedback] = useState(false);

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Speech setup
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition && "speechSynthesis" in window) {
      setSpeechSupported(true);
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";
      recognitionRef.current = recognition;

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let finalTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        if (finalTranscript) {
          setTranscript((prev) => prev + finalTranscript + " ");
        }
      };

      recognition.onend = () => {
        if (isRecording) setIsRecording(false);
      };

      recognition.onerror = () => setIsRecording(false);
    }

    generateAllQuestions();

    return () => {
      recognitionRef.current?.stop();
      speechSynthesis.cancel();
    };
  }, []);

  const generateAllQuestions = async () => {
    setIsGeneratingQuestions(true);
    const fallbacks = [
      "Tell me about yourself and your experience in software development.",
      "Describe a challenging project you worked on and how you overcame the difficulties.",
      "How do you approach debugging a complex issue in production?",
      "What would you do if you disagreed with a technical decision made by your team lead?",
      "Explain a time when you had to learn a new technology quickly for a project.",
    ];

    try {
      const prompt = `Generate 5 interview questions (open-ended). Numbered list.`;
      const result = await AIchatSession.sendMessage(prompt);
      const text =
        result.response?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
      const questions =
        text
          ?.split("\n")
          .map((line) => line.replace(/^\d+\.\s*/, "").trim())
          .filter((q) => q.length > 10)
          .slice(0, 5) || [];

      setSession((prev) => ({
        ...prev,
        questions: questions.length === 5 ? questions : fallbacks,
      }));

      if (speechSupported) speakText(questions[0] || fallbacks[0]);
    } catch {
      setSession((prev) => ({ ...prev, questions: fallbacks }));
      if (speechSupported) speakText(fallbacks[0]);
    } finally {
      setIsGeneratingQuestions(false);
    }
  };

  const speakText = (text: string) => {
    if ("speechSynthesis" in window && text) {
      speechSynthesis.cancel();
      speechRef.current = new SpeechSynthesisUtterance(text);
      speechRef.current.rate = 0.9;
      speechRef.current.onstart = () => setIsSpeaking(true);
      speechRef.current.onend = () => setIsSpeaking(false);
      speechSynthesis.speak(speechRef.current);
    }
  };

  const startListening = () => {
    setTranscript("");
    recognitionRef.current?.start();
    setIsRecording(true);
  };
  const stopListening = () => {
    recognitionRef.current?.stop();
    setIsRecording(false);
  };

  const stopSpeaking = () => {
    speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  const handleSubmitAnswer = async () => {
    if (!transcript.trim()) return;

    const newAnswers = [...session.answers, transcript];
    const newTranscripts = [...session.transcripts, transcript];

    setSession((prev) => ({
      ...prev,
      answers: newAnswers,
      transcripts: newTranscripts,
    }));

    if (session.currentQuestionIndex >= 4) {
      await generateFinalFeedback(newAnswers);
    } else {
      handleNextQuestion();
    }
  };

  const generateFinalFeedback = async (answers: string[]) => {
    setIsGeneratingFeedback(true);
    try {
      const feedbackPrompt = `
        Interview summary: 
        ${session.questions
          .map((q, i) => `Q${i + 1}: ${q}\nA${i + 1}: ${answers[i] || "No answer"}`)
          .join("\n\n")}
        Provide short feedback: strengths, improvements, 3 tips. <100 words.
      `;
      const result = await AIchatSession.sendMessage(feedbackPrompt);
      const feedback =
        result.response?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ||
        "Strong answers overall. Work on providing structured, specific examples using STAR method.";

      setSession((prev) => ({ ...prev, finalFeedback: feedback, isCompleted: true }));
      if (speechSupported) speakText("Interview complete! " + feedback);
    } catch {
      const fb =
        "Strong answers overall. Work on providing structured, specific examples using STAR method.";
      setSession((prev) => ({ ...prev, finalFeedback: fb, isCompleted: true }));
      if (speechSupported) speakText("Interview complete! " + fb);
    } finally {
      setIsGeneratingFeedback(false);
    }
  };

  const handleNextQuestion = () => {
    setTranscript("");
    setSession((prev) => ({
      ...prev,
      currentQuestionIndex: prev.currentQuestionIndex + 1,
    }));
    const nextQ = session.questions[session.currentQuestionIndex + 1];
    if (speechSupported && nextQ) speakText(nextQ);
  };

  const handleStartOver = () => {
    speechSynthesis.cancel();
    recognitionRef.current?.stop();
    setSession({
      questions: [],
      answers: [],
      transcripts: [],
      currentQuestionIndex: 0,
      isCompleted: false,
      finalFeedback: "",
    });
    setTranscript("");
    setIsRecording(false);
    setIsSpeaking(false);
    generateAllQuestions();
  };

  const currentQuestion = session.questions[session.currentQuestionIndex];

  if (!speechSupported) {
    return (
      <div
        className={`min-h-screen p-6 sm:p-10 flex items-center justify-center ${
          darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
        }`}
      >
        <div className="max-w-md text-center">
          <h1
            className={`text-2xl font-bold mb-4 ${
              darkMode ? "text-red-400" : "text-red-600"
            }`}
          >
            Speech Not Supported
          </h1>
          <p className={darkMode ? "text-gray-400" : "text-gray-600"}>
            Your browser doesn’t support speech recognition. Use Chrome/Edge.
          </p>
          <button
            onClick={() => navigate(-1)}
            className="mt-6 flex items-center gap-2 mx-auto bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg"
          >
            <ArrowLeft size={20} /> Go Back
          </button>
        </div>
      </div>
    );
  }

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
            className={`flex items-center gap-2 mb-6 ${
              darkMode
                ? "text-gray-400 hover:text-white"
                : "text-gray-600 hover:text-black"
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
              Voice AI Interview Practice
            </h1>
            <p className={darkMode ? "text-gray-400" : "text-gray-600"}>
              {session.isCompleted
                ? "Interview Complete"
                : `Question ${session.currentQuestionIndex + 1} of 5`}
            </p>
          </div>
        </div>

        {/* Question */}
        <div
          className={`rounded-2xl p-6 border mb-6 ${
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
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold">AI Interviewer</h3>
                {isSpeaking ? (
                  <button
                    onClick={stopSpeaking}
                    className="bg-red-600 hover:bg-red-700 p-2 rounded-lg"
                  >
                    <VolumeX size={16} />
                  </button>
                ) : (
                  currentQuestion && (
                    <button
                      onClick={() => speakText(currentQuestion)}
                      className="bg-blue-600 hover:bg-blue-700 p-2 rounded-lg text-white"
                    >
                      <Volume2 size={16} />
                    </button>
                  )
                )}
              </div>
              {isGeneratingQuestions ? (
                <p className={darkMode ? "text-gray-400" : "text-gray-500"}>
                  Loading question...
                </p>
              ) : (
                <p className={darkMode ? "text-gray-300" : "text-gray-700"}>
                  {currentQuestion}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Recording Controls */}
        {!session.isCompleted && currentQuestion && (
          <div
            className={`rounded-2xl p-6 border mb-6 ${
              darkMode
                ? "bg-gray-800/60 border-gray-700/40"
                : "bg-white border-gray-200"
            }`}
          >
            <div className="text-center">
              <h3 className="font-semibold mb-4">Record Your Answer</h3>

              {!isRecording ? (
                <button
                  onClick={startListening}
                  className="bg-green-600 hover:bg-green-700 text-white p-4 rounded-full"
                >
                  <Mic size={24} />
                </button>
              ) : (
                <button
                  onClick={stopListening}
                  className="bg-red-600 hover:bg-red-700 text-white p-4 rounded-full animate-pulse"
                >
                  <Square size={24} />
                </button>
              )}

              <div className="mt-4">
                {isRecording ? (
                  <p className="text-red-500">Recording...</p>
                ) : transcript ? (
                  <p className="text-green-500">Ready to submit</p>
                ) : (
                  <p className={darkMode ? "text-gray-400" : "text-gray-500"}>
                    Click to record
                  </p>
                )}
              </div>

              {transcript && (
                <div
                  className={`mt-4 rounded-lg p-4 text-left ${
                    darkMode ? "bg-gray-700" : "bg-gray-100"
                  }`}
                >
                  <h4 className="text-sm font-semibold mb-2">Response:</h4>
                  <p>{transcript}</p>
                </div>
              )}

              <button
                onClick={handleSubmitAnswer}
                disabled={!transcript.trim() || isGeneratingFeedback}
                className="mt-6 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg"
              >
                {isGeneratingFeedback
                  ? "Processing..."
                  : session.currentQuestionIndex >= 4
                  ? "Finish Interview"
                  : "Next Question"}
              </button>
            </div>
          </div>
        )}

        {/* Final Feedback */}
        {session.isCompleted && (
          <div
            className={`rounded-2xl p-6 border mb-6 ${
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
                <h3 className="font-semibold mb-4">Interview Feedback</h3>
                {isGeneratingFeedback ? (
                  <p className={darkMode ? "text-gray-400" : "text-gray-600"}>
                    Analyzing...
                  </p>
                ) : (
                  <p className={darkMode ? "text-gray-300" : "text-gray-700"}>
                    {session.finalFeedback}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Buttons */}
        {session.isCompleted && (
          <div className="flex gap-4 justify-center">
            <button
              onClick={handleStartOver}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg flex items-center gap-2"
            >
              <RotateCcw size={16} /> Try Again
            </button>
            <button
              onClick={() => navigate(-1)}
              className={`px-6 py-3 rounded-lg font-semibold ${
                darkMode
                  ? "bg-gray-600 hover:bg-gray-700 text-white"
                  : "bg-gray-300 hover:bg-gray-400 text-gray-900"
              }`}
            >
              Back
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VoiceInterviewPage;
