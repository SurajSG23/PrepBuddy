import React, { useState, useRef, useEffect } from "react";
import { Camera, CameraOff, Play, Square, ArrowRight, RotateCcw, MessageSquare, Volume2, Video } from "lucide-react";
import { AIchatSession } from "../../gemini/AiModel";

type QuestionType = "text" | "voice" | "video";

interface Question {
  id: number;
  type: QuestionType;
  question: string;
}

const FullInterviewPage: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [responses, setResponses] = useState<string[]>([]);
  const [textInput, setTextInput] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const totalQuestions = 10;

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
      const prompt = `Generate exactly 10 diverse interview questions for a software engineering position.
      Mix technical, behavioral, and situational questions.
      Return only the questions, numbered 1-10, one per line.`;
      
      const result = await AIchatSession.sendMessage(prompt);
      const text = result.response.text();
      const questionList = text.split('\n')
        .filter(line => line.trim())
        .map(line => line.replace(/^\d+\.\s*/, '').trim())
        .slice(0, 10);
      
      // Assign question types (mix of text, voice, video)
      const questionTypes: QuestionType[] = [
        "text", "voice", "video", "text", "voice", 
        "video", "text", "voice", "video", "text"
      ];
      
      const formattedQuestions: Question[] = questionList.map((q, i) => ({
        id: i + 1,
        type: questionTypes[i],
        question: q
      }));
      
      setQuestions(formattedQuestions);
    } catch (error) {
      console.error("Error generating questions:", error);
      // Fallback questions
      const fallbackQuestions: Question[] = [
        { id: 1, type: "text", question: "Tell me about your background in software development." },
        { id: 2, type: "voice", question: "Describe a challenging project you worked on recently." },
        { id: 3, type: "video", question: "How do you approach problem-solving in your code?" },
        { id: 4, type: "text", question: "What programming languages are you most comfortable with?" },
        { id: 5, type: "voice", question: "Explain a time when you had to learn something new quickly." },
        { id: 6, type: "video", question: "How do you handle working in a team environment?" },
        { id: 7, type: "text", question: "What's your experience with databases and data modeling?" },
        { id: 8, type: "voice", question: "Describe your debugging process when facing a complex issue." },
        { id: 9, type: "video", question: "Where do you see yourself in your career in 3-5 years?" },
        { id: 10, type: "text", question: "What questions do you have about our company or this role?" }
      ];
      setQuestions(fallbackQuestions);
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
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
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

  const submitTextAnswer = () => {
    if (textInput.trim()) {
      setResponses(prev => {
        const newResponses = [...prev];
        newResponses[currentQuestion] = textInput;
        return newResponses;
      });
      setTextInput("");
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setTextInput("");
      setIsRecording(false);
      if (questions[currentQuestion + 1]?.type !== "video") {
        stopCamera();
      }
    } else {
      generateFeedback();
    }
  };

  const generateFeedback = async () => {
    setIsLoading(true);
    try {
      const prompt = `Based on these interview responses, provide comprehensive feedback (under 150 words):
      
      Questions and Responses:
      ${questions.map((q, i) => `Q${i+1} (${q.type}): ${q.question}\nA${i+1}: ${responses[i] || 'No response provided'}`).join('\n\n')}
      
      Provide overall feedback on communication, technical knowledge, and areas for improvement.`;
      
      const result = await AIchatSession.sendMessage(prompt);
      setFeedback(result.response.text());
      setIsComplete(true);
    } catch (error) {
      console.error("Error generating feedback:", error);
      setFeedback("Thank you for completing the full AI interview session. You've answered questions across text, voice, and video formats. Continue practicing to improve your interview skills!");
      setIsComplete(true);
    }
    setIsLoading(false);
    stopCamera();
  };

  const resetInterview = () => {
    setCurrentQuestion(0);
    setResponses([]);
    setTextInput("");
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
              <h2 className="text-xl font-semibold mb-4">Comprehensive AI Feedback</h2>
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

  const currentQ = questions[currentQuestion];
  
  return (
    <div className="min-h-screen text-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-indigo-400 mb-2">Full AI Interview Session</h1>
          <p className="text-gray-400">Question {currentQuestion + 1} of {totalQuestions}</p>
          {currentQ && (
            <div className="flex items-center justify-center gap-2 mt-2">
              {currentQ.type === "text" && <MessageSquare className="w-5 h-5 text-blue-400" />}
              {currentQ.type === "voice" && <Volume2 className="w-5 h-5 text-green-400" />}
              {currentQ.type === "video" && <Video className="w-5 h-5 text-red-400" />}
              <span className="text-sm capitalize font-medium">{currentQ.type} Question</span>
            </div>
          )}
        </div>

        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500 mx-auto"></div>
            <p className="mt-2 text-gray-400">Generating questions...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Question & Input Section */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Current Question</h2>
              
              {currentQ && (
                <div className="bg-gray-900 rounded-lg p-4 mb-6">
                  <p className="text-lg text-gray-300">{currentQ.question}</p>
                </div>
              )}

              {/* Text Input */}
              {currentQ?.type === "text" && (
                <div className="space-y-4">
                  <textarea
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    placeholder="Type your answer here..."
                    className="w-full bg-gray-900 text-white p-4 rounded-lg resize-none h-32"
                  />
                  <button
                    onClick={submitTextAnswer}
                    disabled={!textInput.trim()}
                    className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg"
                  >
                    Submit Answer
                  </button>
                </div>
              )}

              {/* Voice Controls */}
              {currentQ?.type === "voice" && (
                <div className="space-y-4">
                  <button
                    onClick={isRecording ? stopRecording : startRecording}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                      isRecording ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
                    }`}
                  >
                    {isRecording ? <Square className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                    {isRecording ? 'Stop Recording' : 'Start Recording'}
                  </button>
                  {isRecording && (
                    <p className="text-sm text-green-400">🎤 Recording... Speak your answer</p>
                  )}
                </div>
              )}

              {/* Video Controls */}
              {currentQ?.type === "video" && (
                <div className="space-y-4">
                  <div className="flex gap-2">
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
                  {isRecording && (
                    <p className="text-sm text-red-400">🔴 Recording video response...</p>
                  )}
                </div>
              )}

              {/* Response Display */}
              {responses[currentQuestion] && (
                <div className="bg-gray-900 rounded-lg p-4 mt-4">
                  <h3 className="font-semibold mb-2">Your Response:</h3>
                  <p className="text-gray-300">{responses[currentQuestion]}</p>
                </div>
              )}

              {/* Next Button */}
              {responses[currentQuestion] && !isRecording && (
                <button
                  onClick={nextQuestion}
                  disabled={isLoading}
                  className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                >
                  {currentQuestion === totalQuestions - 1 ? 'Finish Interview' : 'Next Question'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Video Display Section */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">
                {currentQ?.type === "video" ? "Video Response" : "Interview Progress"}
              </h2>
              
              {currentQ?.type === "video" ? (
                <div className="aspect-video bg-gray-900 rounded-lg relative overflow-hidden">
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
              ) : (
                <div className="bg-gray-900 rounded-lg p-6">
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="text-center">
                      <MessageSquare className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                      <p className="text-sm">Text Questions</p>
                      <p className="text-xs text-gray-400">
                        {questions.filter(q => q.type === "text").length} total
                      </p>
                    </div>
                    <div className="text-center">
                      <Volume2 className="w-8 h-8 text-green-400 mx-auto mb-2" />
                      <p className="text-sm">Voice Questions</p>
                      <p className="text-xs text-gray-400">
                        {questions.filter(q => q.type === "voice").length} total
                      </p>
                    </div>
                    <div className="text-center">
                      <Video className="w-8 h-8 text-red-400 mx-auto mb-2" />
                      <p className="text-sm">Video Questions</p>
                      <p className="text-xs text-gray-400">
                        {questions.filter(q => q.type === "video").length} total
                      </p>
                    </div>
                  </div>
                  
                  <div className="w-full bg-gray-700 rounded-full h-3">
                    <div 
                      className="bg-indigo-600 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${((currentQuestion + 1) / totalQuestions) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-center text-sm mt-2 text-gray-400">
                    Progress: {currentQuestion + 1} / {totalQuestions}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FullInterviewPage;
