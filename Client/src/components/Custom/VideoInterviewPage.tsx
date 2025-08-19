import React, { useState, useRef, useEffect } from "react";
import { Camera, CameraOff, Play, Square, ArrowRight, RotateCcw } from "lucide-react";
import { useThemeSelector } from "../../store/hooks";
import { AIchatSession } from "../../gemini/AiModel";

const VideoInterviewPage: React.FC = () => {
  const darkMode = useThemeSelector((state) => state.theme.darkMode);
  const [isRecording, setIsRecording] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(false);

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [questions, setQuestions] = useState<string[]>([]);
  const [responses, setResponses] = useState<string[]>([]);
  const [feedback, setFeedback] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);

  const streamRef = useRef<MediaStream | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const totalQuestions = 5;

  useEffect(() => {
    generateQuestions();
    setupSpeechRecognition();
    return () => {
      stopCamera();
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const generateQuestions = async () => {
    setIsLoading(true);
    try {
      const prompt = `Generate exactly 5 interview questions for a software engineering position. 
      Make them diverse covering technical skills, problem-solving, and behavioral aspects.
      Return only the questions, numbered 1-5, one per line.`;
      
      const result = await AIchatSession.sendMessage(prompt);
      const text = result.response.text();
      const questionList = text.split('\n')
        .filter(line => line.trim())
        .map(line => line.replace(/^\d+\.\s*/, '').trim())
        .slice(0, 5);
      
      setQuestions(questionList);
    } catch (error) {
      console.error("Error generating questions:", error);
      setQuestions([
        "Tell me about yourself and your background in software development.",
        "Describe a challenging project you worked on and how you overcame obstacles.",
        "How do you approach debugging complex issues in your code?",
        "Explain a time when you had to learn a new technology quickly.",
        "Where do you see yourself in your career in the next 3-5 years?"
      ]);
    }
    setIsLoading(false);
  };

  const setupSpeechRecognition = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = false;
      
      recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = event.results[event.results.length - 1][0].transcript;
        setResponses(prev => {
          const newResponses = [...prev];
          newResponses[currentQuestion] = transcript;
          return newResponses;
        });
      };
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsCameraOn(true);
    } catch (error) {
      console.error("Error accessing camera:", error);
      alert("Unable to access camera. Please check permissions.");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    setIsCameraOn(false);
  };

  const startRecording = () => {
    if (!streamRef.current) return;
    
    setIsRecording(true);
    if (recognitionRef.current) {
      recognitionRef.current.start();
    }
  };

  const stopRecording = () => {
    setIsRecording(false);
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      generateFeedback();
    }
  };

  const generateFeedback = async () => {
    setIsLoading(true);
    try {
      const prompt = `Based on these interview responses, provide concise feedback (under 100 words):
      
      Questions and Responses:
      ${questions.map((q, i) => `Q${i+1}: ${q}\nA${i+1}: ${responses[i] || 'No response provided'}`).join('\n\n')}
      
      Provide overall feedback on communication, content quality, and suggestions for improvement.`;
      
      const result = await AIchatSession.sendMessage(prompt);
      setFeedback(result.response.text());
      setIsComplete(true);
    } catch (error) {
      console.error("Error generating feedback:", error);
      setFeedback("Thank you for completing the video interview practice. Continue practicing to improve your interview skills!");
      setIsComplete(true);
    }
    setIsLoading(false);
  };

  const resetInterview = () => {
    setCurrentQuestion(0);
    setResponses([]);
    setFeedback("");
    setIsComplete(false);
    setIsRecording(false);
    stopCamera();
  };

  if (isComplete) {
    return (
      <div className={`${darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"} min-h-screen p-6`}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className={`text-3xl font-bold mb-4 ${darkMode ? "text-indigo-400" : "text-indigo-700"}`}>Interview Complete!</h1>
            <div className={`${darkMode ? "bg-gray-800" : "bg-gray-100"} rounded-lg p-6`}>
              <h2 className={`text-xl font-semibold mb-4 ${darkMode ? "text-white" : "text-gray-900"}`}>AI Feedback</h2>
              <p className={`${darkMode ? "text-gray-300" : "text-gray-700"} leading-relaxed`}>{feedback}</p>
            </div>
            <button
              onClick={resetInterview}
              className={`mt-6 px-6 py-3 rounded-lg flex items-center gap-2 mx-auto font-semibold transition-all duration-300 ${darkMode ? "bg-indigo-600 hover:bg-indigo-700 text-white" : "bg-indigo-200 hover:bg-indigo-300 text-indigo-700"}`}
            >
              <RotateCcw className="w-5 h-5" />
              Start New Interview
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"} min-h-screen p-6`}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className={`text-3xl font-bold mb-2 ${darkMode ? "text-indigo-400" : "text-indigo-700"}`}>Video Interview Practice</h1>
          <p className={darkMode ? "text-gray-400" : "text-gray-700"}>Question {currentQuestion + 1} of {totalQuestions}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Video Section */}
          <div className={`${darkMode ? "bg-gray-800" : "bg-gray-100"} rounded-lg p-6`}>
            <div className={`aspect-video rounded-lg mb-4 relative overflow-hidden ${darkMode ? "bg-gray-900" : "bg-white"}`}>
              {isCameraOn ? (
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className={`flex items-center justify-center h-full ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
                  <CameraOff className="w-16 h-16" />
                </div>
              )}
              {isRecording && (
                <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm">
                  Recording...
                </div>
              )}
            </div>

            <div className="flex justify-center gap-4">
              <button
                onClick={isCameraOn ? stopCamera : startCamera}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${isCameraOn
                  ? darkMode
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : 'bg-red-200 hover:bg-red-300 text-red-900'
                  : darkMode
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : 'bg-green-200 hover:bg-green-300 text-green-900'
                }`}
              >
                {isCameraOn ? <CameraOff className="w-5 h-5" /> : <Camera className="w-5 h-5" />}
                {isCameraOn ? 'Stop Camera' : 'Start Camera'}
              </button>

              {isCameraOn && (
                <button
                  onClick={isRecording ? stopRecording : startRecording}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${isRecording
                    ? darkMode
                      ? 'bg-red-600 hover:bg-red-700 text-white'
                      : 'bg-red-200 hover:bg-red-300 text-red-900'
                    : darkMode
                      ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                      : 'bg-indigo-200 hover:bg-indigo-300 text-indigo-700'
                  }`}
                >
                  {isRecording ? <Square className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                  {isRecording ? 'Stop Recording' : 'Start Recording'}
                </button>
              )}
            </div>
          </div>

          {/* Question Section */}
          <div className={`${darkMode ? "bg-gray-800" : "bg-gray-100"} rounded-lg p-6`}>
            <h2 className={`text-xl font-semibold mb-4 ${darkMode ? "text-white" : "text-gray-900"}`}>Current Question</h2>
            
            {isLoading ? (
              <div className="text-center py-8">
                <div className={`animate-spin rounded-full h-8 w-8 border-b-2 mx-auto ${darkMode ? "border-indigo-400" : "border-indigo-700"}`}></div>
                <p className={`mt-2 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Generating questions...</p>
              </div>
            ) : (
              <div className={`${darkMode ? "bg-gray-900" : "bg-white"} rounded-lg p-4 mb-6`}>
                <p className={`text-lg ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                  {questions[currentQuestion] || "Loading question..."}
                </p>
              </div>
            )}

            {responses[currentQuestion] && (
              <div className={`${darkMode ? "bg-gray-900" : "bg-white"} rounded-lg p-4 mb-6`}>
                <h3 className={`font-semibold mb-2 ${darkMode ? "text-white" : "text-gray-900"}`}>Your Response:</h3>
                <p className={`${darkMode ? "text-gray-300" : "text-gray-700"}`}>{responses[currentQuestion]}</p>
              </div>
            )}

            <div className="flex justify-between">
              <div className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                {isRecording ? "Speaking... Your response is being captured." : "Click 'Start Recording' to answer"}
              </div>
              
              {responses[currentQuestion] && !isRecording && (
                <button
                  onClick={nextQuestion}
                  disabled={isLoading}
                  className={`px-4 py-2 rounded-lg flex items-center gap-2 font-semibold transition-all duration-300 ${darkMode ? "bg-indigo-600 hover:bg-indigo-700 text-white" : "bg-indigo-200 hover:bg-indigo-300 text-indigo-700"}`}
                >
                  {currentQuestion === totalQuestions - 1 ? 'Finish Interview' : 'Next Question'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoInterviewPage;
