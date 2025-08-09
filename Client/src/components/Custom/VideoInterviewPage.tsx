import React, { useState, useRef, useEffect } from "react";
import { Camera, CameraOff, Play, Square, ArrowRight, RotateCcw } from "lucide-react";
import { AIchatSession } from "../../gemini/AiModel";

const VideoInterviewPage: React.FC = () => {
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
      <div className="min-h-screen text-white p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-indigo-400 mb-4">Interview Complete!</h1>
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">AI Feedback</h2>
              <p className="text-gray-300 leading-relaxed">{feedback}</p>
            </div>
            <button
              onClick={resetInterview}
              className="mt-6 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 mx-auto"
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
    <div className="min-h-screen text-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-indigo-400 mb-2">Video Interview Practice</h1>
          <p className="text-gray-400">Question {currentQuestion + 1} of {totalQuestions}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Video Section */}
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="aspect-video bg-gray-900 rounded-lg mb-4 relative overflow-hidden">
              {isCameraOn ? (
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
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
                className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                  isCameraOn ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                {isCameraOn ? <CameraOff className="w-5 h-5" /> : <Camera className="w-5 h-5" />}
                {isCameraOn ? 'Stop Camera' : 'Start Camera'}
              </button>

              {isCameraOn && (
                <button
                  onClick={isRecording ? stopRecording : startRecording}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                    isRecording ? 'bg-red-600 hover:bg-red-700' : 'bg-indigo-600 hover:bg-indigo-700'
                  }`}
                >
                  {isRecording ? <Square className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                  {isRecording ? 'Stop Recording' : 'Start Recording'}
                </button>
              )}
            </div>
          </div>

          {/* Question Section */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Current Question</h2>
            
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500 mx-auto"></div>
                <p className="mt-2 text-gray-400">Generating questions...</p>
              </div>
            ) : (
              <div className="bg-gray-900 rounded-lg p-4 mb-6">
                <p className="text-lg text-gray-300">
                  {questions[currentQuestion] || "Loading question..."}
                </p>
              </div>
            )}

            {responses[currentQuestion] && (
              <div className="bg-gray-900 rounded-lg p-4 mb-6">
                <h3 className="font-semibold mb-2">Your Response:</h3>
                <p className="text-gray-300">{responses[currentQuestion]}</p>
              </div>
            )}

            <div className="flex justify-between">
              <div className="text-sm text-gray-400">
                {isRecording ? "Speaking... Your response is being captured." : "Click 'Start Recording' to answer"}
              </div>
              
              {responses[currentQuestion] && !isRecording && (
                <button
                  onClick={nextQuestion}
                  disabled={isLoading}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
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
