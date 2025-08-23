import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Bot, Mic, Volume2, VolumeX, RotateCcw, Square } from "lucide-react";
import { useThemeSelector } from "../../store/hooks";
import { AIchatSession } from "../../gemini/AiModel";

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
  const darkMode = useThemeSelector((state) => state.theme.darkMode);
  const [session, setSession] = useState<VoiceInterviewSession>({
    questions: [],
    answers: [],
    transcripts: [],
    currentQuestionIndex: 0,
    isCompleted: false,
    finalFeedback: ""
  });

  // Voice states
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);

  // Loading states
  const [isGeneratingQuestions, setIsGeneratingQuestions] = useState(false);
  const [isGeneratingFeedback, setIsGeneratingFeedback] = useState(false);

  // Refs
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Check for speech recognition support
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition && 'speechSynthesis' in window) {
      setSpeechSupported(true);
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';
      recognitionRef.current = recognition;

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        if (finalTranscript) {
          setTranscript(prev => prev + finalTranscript + ' ');
        }
      };

      recognition.onend = () => {
        if (isRecording) {
          setIsRecording(false);
        }
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('Speech recognition error:', event.error);
        setIsRecording(false);
      };
    }

    // Generate all 5 questions on mount
    const initializeInterview = async () => {
      await generateAllQuestions();
    };
    initializeInterview();

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (speechRef.current) {
        speechSynthesis.cancel();
      }
    };
  }, []);

  const generateAllQuestions = async () => {
    setIsGeneratingQuestions(true);
    
    const fallbacks = [
      "Tell me about yourself and your experience in software development.",
      "Describe a challenging project you worked on and how you overcame the difficulties.", 
      "How do you approach debugging a complex issue in production?",
      "What would you do if you disagreed with a technical decision made by your team lead?",
      "Explain a time when you had to learn a new technology quickly for a project."
    ];
    
    try {
      const batchPrompt = `Generate exactly 5 distinct interview questions. Each question should be open-ended and suitable for a technical or behavioral interview. Return them as a numbered list (1. 2. 3. 4. 5.) with each question on a new line.`;
      
      const result = await AIchatSession.sendMessage(batchPrompt);
      const response = result.response?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
      
      if (response) {
        const questions = response
          .split('\n')
          .map(line => line.replace(/^\d+\.\s*/, '').trim())
          .filter(q => q.length > 10)
          .slice(0, 5);
        
        if (questions.length === 5) {
          setSession(prev => ({ ...prev, questions }));
          if (speechSupported) {
            speakText(questions[0]);
          }
          return;
        }
      }
      
      // Fallback if AI response is invalid
      setSession(prev => ({ ...prev, questions: fallbacks }));
      if (speechSupported) {
        speakText(fallbacks[0]);
      }
    } catch {
      setSession(prev => ({ ...prev, questions: fallbacks }));
      if (speechSupported) {
        speakText(fallbacks[0]);
      }
    } finally {
      setIsGeneratingQuestions(false);
    }
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window && text) {
      speechSynthesis.cancel(); // Cancel any ongoing speech
      speechRef.current = new SpeechSynthesisUtterance(text);
      speechRef.current.rate = 0.9;
      speechRef.current.pitch = 1;
      speechRef.current.volume = 0.8;
      
      speechRef.current.onstart = () => setIsSpeaking(true);
      speechRef.current.onend = () => setIsSpeaking(false);
      speechRef.current.onerror = () => setIsSpeaking(false);
      
      speechSynthesis.speak(speechRef.current);
    }
  };

  const startListening = () => {
    if (recognitionRef.current && speechSupported) {
      setTranscript("");
      setIsRecording(true);
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!transcript.trim()) {
      alert("Please record your answer first.");
      return;
    }

    // Save the answer and transcript
    const newAnswers = [...session.answers, transcript];
    const newTranscripts = [...session.transcripts, transcript];
    
    setSession(prev => ({
      ...prev,
      answers: newAnswers,
      transcripts: newTranscripts
    }));

    // Check if this is the last question
    if (session.currentQuestionIndex >= 4) {
      // Generate final feedback for all answers
      await generateFinalFeedback(newAnswers);
    } else {
      // Move to next question
      handleNextQuestion();
    }
  };

  const generateFinalFeedback = async (answers: string[]) => {
    setIsGeneratingFeedback(true);
    try {
      const feedbackPrompt = `
        Analyze this interview performance based on 5 responses:
        
        ${session.questions.map((q, i) => `Q${i + 1}: ${q}\nA${i + 1}: ${answers[i] || 'No answer'}`).join('\n\n')}
        
        Provide concise feedback focusing on:
        - Key strengths shown
        - Main areas to improve  
        - 2-3 specific actionable tips
        
        Keep it encouraging, direct, and under 100 words.
      `;
      
      const result = await AIchatSession.sendMessage(feedbackPrompt);
      const feedback = result.response?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() 
        || "Good interview performance! Your responses showed clear thinking. Focus on providing more specific examples and structured answers using the STAR method for stronger impact.";
      
      setSession(prev => ({
        ...prev,
        finalFeedback: feedback,
        isCompleted: true
      }));

      if (speechSupported) {
        speakText("Interview complete! " + feedback);
      }
    } catch {
      const fallbackFeedback = "Good interview performance! Your responses showed clear thinking. Focus on providing more specific examples and structured answers using the STAR method for stronger impact.";
      setSession(prev => ({
        ...prev,
        finalFeedback: fallbackFeedback,
        isCompleted: true
      }));
      if (speechSupported) {
        speakText("Interview complete! " + fallbackFeedback);
      }
    } finally {
      setIsGeneratingFeedback(false);
    }
  };

  const handleNextQuestion = () => {
    setTranscript("");
    
    // Move to next question
    setSession(prev => ({
      ...prev,
      currentQuestionIndex: prev.currentQuestionIndex + 1
    }));
    
    // Speak the next question
    const nextQuestion = session.questions[session.currentQuestionIndex + 1];
    if (speechSupported && nextQuestion) {
      speakText(nextQuestion);
    }
  };

  const handleStartOver = () => {
    speechSynthesis.cancel();
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    
    setSession({
      questions: [],
      answers: [],
      transcripts: [],
      currentQuestionIndex: 0,
      isCompleted: false,
      finalFeedback: ""
    });
    setTranscript("");
    setIsRecording(false);
    setIsSpeaking(false);
    
    generateAllQuestions();
  };

  const currentQuestion = session.questions[session.currentQuestionIndex];

  if (!speechSupported) {
    return (
      <div className={`${darkMode ? "text-white bg-gray-900" : "text-gray-900 bg-white"} min-h-screen p-6 sm:p-10 flex items-center justify-center`}>
        <div className="max-w-md text-center">
          <h1 className="text-2xl font-bold text-red-400 mb-4">Speech Not Supported</h1>
          <p className={`${darkMode ? "text-gray-400" : "text-gray-600"} mb-6`}>
            Your browser doesn't support speech recognition or text-to-speech. 
            Please use a modern browser like Chrome or Edge for voice features.
          </p>
          <button
            onClick={() => navigate(-1)}
            className={`flex items-center gap-2 mx-auto ${darkMode ? "bg-indigo-600 hover:bg-indigo-700 text-white" : "bg-indigo-200 hover:bg-indigo-300 text-indigo-700"} px-4 py-2 rounded-lg transition-all duration-300`}
          >
            <ArrowLeft size={20} />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`${darkMode ? "text-white bg-gray-900" : "text-gray-900 bg-white"} min-h-screen p-6 sm:p-10`}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className={`flex items-center gap-2 ${darkMode ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-indigo-700"} transition-colors mb-6`}
          >
            <ArrowLeft size={20} />
            Back to Interview Options
          </button>
          <div className="text-center">
            <h1 className={`text-3xl md:text-4xl font-extrabold mb-2 ${darkMode ? "text-indigo-400" : "text-indigo-700"}`}>
              Voice AI Interview Practice
            </h1>
            <p className={darkMode ? "text-gray-400" : "text-gray-700"}>
              {session.isCompleted ? 
                "Interview Complete" : 
                `Question ${session.currentQuestionIndex + 1} of 5`
              }
            </p>
          </div>
        </div>

        {/* Interview Content */}
  <div className="space-y-6">
          {/* Question Section */}
          <div className={`${darkMode ? "bg-gray-800/60 border-gray-700/40" : "bg-white/80 border-gray-300"} backdrop-blur-md rounded-2xl p-6 border`}>
            <div className="flex items-start gap-4">
              <div className={`${darkMode ? "bg-indigo-600" : "bg-indigo-200"} p-2 rounded-lg`}>
                <Bot size={20} />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className={`font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>AI Interviewer</h3>
                  <div className="flex gap-2">
                    {isSpeaking ? (
                      <button
                        onClick={stopSpeaking}
                        className={`${darkMode ? "bg-red-600 hover:bg-red-700" : "bg-red-200 hover:bg-red-300"} p-2 rounded-lg transition-colors`}
                        title="Stop speaking"
                      >
                        <VolumeX size={16} />
                      </button>
                    ) : (
                      currentQuestion && (
                        <button
                          onClick={() => speakText(currentQuestion)}
                          className={`${darkMode ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-200 hover:bg-blue-300"} p-2 rounded-lg transition-colors`}
                          title="Repeat question"
                        >
                          <Volume2 size={16} />
                        </button>
                      )
                    )}
                  </div>
                </div>
                {isGeneratingQuestions ? (
                  <div className={`flex items-center gap-3 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                    <div className={`animate-spin rounded-full h-4 w-4 border-b-2 ${darkMode ? "border-indigo-400" : "border-indigo-700"}`}></div>
                    <span>Loading...</span>
                  </div>
                ) : (
                  <p className={`${darkMode ? "text-gray-300" : "text-gray-700"} leading-relaxed`}>{currentQuestion}</p>
                )}
              </div>
            </div>
          </div>

          {/* Voice Controls */}
          {currentQuestion && !session.isCompleted && (
            <div className={`${darkMode ? "bg-gray-800/60 border-gray-700/40" : "bg-white/80 border-gray-300"} backdrop-blur-md rounded-2xl p-6 border`}>
              <div className="text-center">
                <h3 className={`font-semibold mb-4 ${darkMode ? "text-white" : "text-gray-900"}`}>Record Your Answer</h3>
                
                {/* Voice Recording Button */}
                <div className="mb-6">
                  {!isRecording ? (
                    <button
                      onClick={startListening}
                      className={`${darkMode ? "bg-green-600 hover:bg-green-700 text-white" : "bg-green-200 hover:bg-green-300 text-green-900"} p-4 rounded-full transition-all duration-300 transform hover:scale-105`}
                      title="Start recording"
                    >
                      <Mic size={24} />
                    </button>
                  ) : (
                    <button
                      onClick={stopListening}
                      className={`${darkMode ? "bg-red-600 hover:bg-red-700 text-white" : "bg-red-200 hover:bg-red-300 text-red-900"} p-4 rounded-full transition-all duration-300 animate-pulse`}
                      title="Stop recording"
                    >
                      <Square size={24} />
                    </button>
                  )}
                </div>
                {/* Recording Status */}
                <div className="mb-4">
                  {isRecording ? (
                    <p className="text-red-400 flex items-center justify-center gap-2">
                      <div className="animate-pulse w-2 h-2 bg-red-400 rounded-full"></div>
                      Recording...
                    </p>
                  ) : transcript ? (
                    <p className="text-green-400">Ready to submit</p>
                  ) : (
                    <p className={darkMode ? "text-gray-400" : "text-gray-500"}>Click to record</p>
                  )}
                </div>

                {/* Transcript Display */}
                {transcript && (
                  <div className={`${darkMode ? "bg-gray-700" : "bg-gray-100"} p-4 rounded-lg mb-4 text-left`}>
                    <h4 className={`text-sm font-semibold mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>Response:</h4>
                    <p className={darkMode ? "text-white" : "text-gray-900"}>{transcript}</p>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  onClick={handleSubmitAnswer}
                  disabled={!transcript.trim() || isGeneratingFeedback}
                  className={`px-6 py-3 rounded-lg transition-all duration-300 disabled:cursor-not-allowed font-semibold ${darkMode ? "bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-600 text-white" : "bg-indigo-200 hover:bg-indigo-300 disabled:bg-gray-300 text-indigo-700"}`}
                >
                  {isGeneratingFeedback ? "Processing..." : 
                   session.currentQuestionIndex >= 4 ? "Finish Interview" : "Next Question"}
                </button>
              </div>
            </div>
          )}

          {/* Interview Complete */}
          {session.isCompleted && (
            <div className="space-y-6">
              {/* AI Feedback */}
              <div className={`${darkMode ? "bg-blue-800/30 border-blue-700/40" : "bg-blue-100/80 border-blue-300"} backdrop-blur-md rounded-2xl p-6 border`}>
                <div className="flex items-start gap-4">
                  <div className={`${darkMode ? "bg-blue-600" : "bg-blue-200"} p-2 rounded-lg`}>
                    <Bot size={20} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className={`font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>Interview Feedback</h3>
                      {session.finalFeedback && (
                        <button
                          onClick={() => speakText(session.finalFeedback)}
                          className={`${darkMode ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-200 hover:bg-blue-300"} p-2 rounded-lg transition-colors`}
                          title="Listen to feedback"
                        >
                          <Volume2 size={16} />
                        </button>
                      )}
                    </div>
                    {isGeneratingFeedback ? (
                      <div className={`flex items-center gap-3 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                        <div className={`animate-spin rounded-full h-4 w-4 border-b-2 ${darkMode ? "border-blue-400" : "border-blue-700"}`}></div>
                        <span>Analyzing...</span>
                      </div>
                    ) : (
                      <p className={`${darkMode ? "text-gray-300" : "text-gray-700"} leading-relaxed`}>
                        {session.finalFeedback}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 justify-center">
                <button
                  onClick={handleStartOver}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2 ${darkMode ? "bg-indigo-600 hover:bg-indigo-700 text-white" : "bg-indigo-200 hover:bg-indigo-300 text-indigo-700"}`}
                >
                  <RotateCcw size={16} />
                  Try Again
                </button>
                <button
                  onClick={() => navigate(-1)}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${darkMode ? "bg-gray-600 hover:bg-gray-700 text-white" : "bg-gray-200 hover:bg-gray-300 text-gray-900"}`}
                >
                  Back
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VoiceInterviewPage;
