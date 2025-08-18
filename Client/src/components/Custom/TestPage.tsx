import { useState, useEffect, useRef } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import { toast } from "sonner";
import geminiPrompt from "../../gemini/prompt";
import { AIchatSession } from "../../gemini/AiModel";
import questionsData from "../../gemini/sampleSet";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import useDetectTabSwitch from "../Custom/useDetectTabSwitch";
import { useQuizTimer } from "../../hooks/useQuizTimer";
import { quizStorage } from "../../utils/quizStorage";

interface HeaderProps {
  userID: string;
}

const TestPage: React.FC<HeaderProps> = ({ userID }) => {
  useDetectTabSwitch();
  const [sessionId, setSessionId] = useState<string>("");
  const [userAnswers, setUserAnswers] = useState<(string | null)[]>(
    Array(10).fill(null)
  );
  const [currentSlide, setCurrentSlide] = useState(1);
  const nextRef = useRef<HTMLButtonElement>(null);
  const prevRef = useRef<HTMLButtonElement>(null);
  const [geminiQuestions, setGeminiQuestions] = useState<string[]>([]);
  const [geminiOptions, setGeminiOptions] = useState<string[][]>([]);
  const [geminiAnswers, setGeminiAnswers] = useState<string[]>([]);
  const [geminiExplaination, setGeminiExplaination] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [newPrompt, setNewPrompt] = useState<string>(geminiPrompt);
  const [confirmation, setConfirmation] = useState(true);
  const [title, setTitle] = useState<string>("");
  const [difficulty, setDifficulty] = useState<string>("");
  const [quitConfirmation, setQuitConfirmation] = useState(false);
  const [submitConfirmation, setSubmitConfirmation] = useState(false);
  const [scoreBoard, setScoreBoard] = useState(false);
  const [score, setScore] = useState<number>(0);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [timeTaken, setTimeTaken] = useState<string>("");
  const [resumeSession, setResumeSession] = useState<any>(null);

  // Timer hook
  const {
    remainingTime,
    isExpired,
    formatTime,
    syncWithServer,
    saveProgress,
    saveCurrentProgress,
    startTimer,
    stopTimer,
    startAutoSave,
    stopAutoSave
  } = useQuizTimer({
    sessionId,
    onTimeUp: () => {
      toast.warning("Time's up! Your test is being submitted.");
      handleSubmitTest();
    },
    onSyncError: (error) => {
      toast.error(error);
    }
  });

  // Check for existing session on component mount
  useEffect(() => {
    const checkExistingSession = async () => {
      try {
        // Check localStorage first
        const localProgress = quizStorage.loadProgress();
        const localSession = quizStorage.loadSession();
        
        if (localProgress && localSession) {
          const sessionAge = quizStorage.getSessionAge();
          if (sessionAge < 10) { // Less than 10 minutes old
            setResumeSession({ localProgress, localSession });
            return;
          }
        }
        
        // Check server for active sessions
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/quiz/active-sessions/${userID}`,
          { withCredentials: true }
        );
        
        if (response.data.length > 0) {
          const activeSession = response.data[0];
          setResumeSession({ serverSession: activeSession });
        }
      } catch (error) {
        console.error('Error checking existing sessions:', error);
      }
    };
    
    checkExistingSession();
  }, [userID]);

  // Auto-save effect - saves progress every 10 seconds when session is active
  useEffect(() => {
    if (!sessionId) return;
    
    const autoSaveInterval = setInterval(() => {
      saveCurrentProgress(userAnswers, currentSlide - 1);
    }, 10000);
    
    return () => clearInterval(autoSaveInterval);
  }, [sessionId, userAnswers, currentSlide, saveCurrentProgress]);

  // Remove the old formatTime function since it's now provided by the hook

  const handleSelectOption = (questionIndex: number, option: string) => {
    const newAnswers = [...userAnswers];
    newAnswers[questionIndex] = option;
    setUserAnswers(newAnswers);
    
    // Save progress immediately when user selects an answer
    if (sessionId) {
      saveCurrentProgress(newAnswers, currentSlide - 1);
      
      // Also save to localStorage as backup
      quizStorage.saveProgress({
        sessionId,
        userAnswers: newAnswers,
        currentQuestion: currentSlide - 1,
        lastSaved: Date.now(),
        topic: title,
        title: title
      });
    }
  };

  const handleSubmitTest = async () => {
    if (!sessionId) {
      toast.error("No active quiz session found");
      return;
    }

    try {
      stopTimer();
      stopAutoSave();
      
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/quiz/submit/${sessionId}`,
        {
          userAnswers
        },
        { withCredentials: true }
      );

      const { score: serverScore, timeTaken: serverTimeTaken } = response.data;
      setScore(serverScore);
      setTimeTaken(serverTimeTaken);
      setScoreBoard(true);

      // Clear local storage
      quizStorage.clearProgress();

      // Handle perfect score badge
      if (serverScore === 10) {
        try {
          await axios.post(
            `${import.meta.env.VITE_API_BASE_URL}/test/updateBadge/${userID}`,
            {
              badges: 1,
            },
            { withCredentials: true }
          );
        } catch (error) {
          console.error("Error updating badge:", error);
        }
      }
    } catch (error: any) {
      console.error("Error submitting test:", error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to submit test. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const incrementSlideNo = () => {
    const newValue = currentSlide + 1;
    setCurrentSlide(newValue);
  };
  const decrementSlideNo = () => {
    const newValue = currentSlide - 1;
    setCurrentSlide(newValue);
  };

  const changeSlide = (targetIndex: number) => {
    if (targetIndex + 1 > currentSlide) {
      for (let i = currentSlide; i < targetIndex + 1; i++) {
        nextRef.current?.click();
      }
    } else if (targetIndex + 1 < currentSlide) {
      for (let i = currentSlide; i > targetIndex + 1; i--) {
        prevRef.current?.click();
      }
    } else {
      return;
    }
    const newValue = targetIndex + 1;
    setCurrentSlide(newValue);
  };

  useEffect(() => {
    const fetchTestData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/test/gettest/${userID}`,
          { withCredentials: true }
        );
        const updatedPrompt = geminiPrompt
          .replace(
            "for the topic ${topic}",
            `most frequently asked in ${response.data.title} company on ${response.data.topic} topic`
          )
          .replace("${difficulty}", "hard");
        setNewPrompt(updatedPrompt);
        setTitle(response.data.title);
        setDifficulty(response.data.difficulty);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTestData();
  }, [navigate]);

  //Calling Gemini
  const GenerateQuestions = async () => {
    setLoading(true);
    setStartTime(new Date());
    try {
      const result = await AIchatSession.sendMessage(newPrompt);
      const geminiQues =
        result.response?.candidates?.[0]?.content?.parts?.[0]?.text
          ?.split("<questions>")[1]
          .split("***")
          .map((question) => question.trim());
      setGeminiQuestions(geminiQues ?? []);

      const geminiOps =
        result.response?.candidates?.[0]?.content?.parts?.[0]?.text
          ?.split("<options>")[1]
          .split("***")
          .map((option) => option.trim().split("@*@"));
      setGeminiOptions(geminiOps ?? []);

      if (
        !Array.isArray(geminiOptions) ||
        !geminiOptions.every((opt) => Array.isArray(opt))
      ) {
        alert("Error generation questions. Please try again.");
        navigate("/homepage");
        return null;
      }

      const geminiAns =
        result.response?.candidates?.[0]?.content?.parts?.[0]?.text
          ?.split("<answers>")[1]
          .split("***")
          .map((answer) => answer.trim());
      setGeminiAnswers(geminiAns ?? []);

      const geminiExp =
        result.response?.candidates?.[0]?.content?.parts?.[0]?.text
          ?.split("<explaination>")[1]
          .split("***")
          .map((answer) => answer.trim());
      setGeminiExplaination(geminiExp ?? []);

      // Create quiz session on server
      const sessionResponse = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/quiz/create-session`,
        {
          userId: userID,
          topic: title,
          title: title,
          difficulty: difficulty,
          questions: geminiQues,
          options: geminiOps,
          correctAnswers: geminiAns,
          explanations: geminiExp
        },
        { withCredentials: true }
      );

      const { sessionId: newSessionId } = sessionResponse.data;
      setSessionId(newSessionId);

      // Start timer and auto-save
      startTimer();
      startAutoSave();

      // Save session data to localStorage
      quizStorage.saveSession({
        sessionId: newSessionId,
        questions: geminiQues,
        options: geminiOps,
        correctAnswers: geminiAns,
        explanations: geminiExp,
        topic: title,
        title: title
      });

    } catch (error) {
      console.error("Error generating questions:", error);
      toast.error("Failed to generate questions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const preventRefresh = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", preventRefresh);

    return () => {
      window.removeEventListener("beforeunload", preventRefresh);
    };
  }, []);

  useEffect(() => {
    const handleBack = () => {
      window.history.pushState(null, "", window.location.href);
    };

    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", handleBack);

    return () => {
      window.removeEventListener("popstate", handleBack);
    };
  }, []);
  // Resume session function
  const resumeExistingSession = async (sessionData: any) => {
    try {
      setLoading(true);
      
      // Stop any existing timers first
      stopTimer();
      stopAutoSave();
      
      if (sessionData.localProgress && sessionData.localSession) {
        // Resume from localStorage
        const { localProgress, localSession } = sessionData;
        
        setSessionId(localProgress.sessionId);
        setUserAnswers(localProgress.userAnswers);
        setCurrentSlide(localProgress.currentQuestion + 1);
        setGeminiQuestions(localSession.questions);
        setGeminiOptions(localSession.options);
        setGeminiAnswers(localSession.correctAnswers);
        setGeminiExplaination(localSession.explanations);
        setTitle(localSession.title);
        setDifficulty("Hard"); // Default for AI-generated tests
        
        // Start timer and auto-save
        startTimer();
        startAutoSave();
        
        setConfirmation(false);
        setStartTime(new Date());
        
      } else if (sessionData.serverSession) {
        // Resume from server
        const serverSession = sessionData.serverSession;
        
        setSessionId(serverSession._id);
        setUserAnswers(serverSession.userAnswers);
        setCurrentSlide(serverSession.currentQuestion + 1);
        setGeminiQuestions(serverSession.questions);
        setGeminiOptions(serverSession.options);
        setGeminiAnswers(serverSession.correctAnswers);
        setGeminiExplaination(serverSession.explanations);
        setTitle(serverSession.title);
        setDifficulty(serverSession.difficulty);
        
        // Start timer and auto-save
        startTimer();
        startAutoSave();
        
        setConfirmation(false);
        setStartTime(new Date(serverSession.startTime));
      }
    } catch (error) {
      console.error('Error resuming session:', error);
      toast.error('Failed to resume session. Starting new test.');
      setResumeSession(null);
    } finally {
      setLoading(false);
    }
  };

  if (confirmation) {
    return (
      <div className="fixed inset-0 flex justify-center items-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 z-50 backdrop-blur-sm">
        <div className="bg-gray-900 rounded-3xl shadow-2xl p-10 text-white w-[90%] max-w-lg border border-indigo-500/30 transition-all duration-300">
          <h1 className="text-3xl font-extrabold mb-6 text-indigo-400 tracking-wide text-center">
            📋 Test Instructions
          </h1>

          {resumeSession && (
            <div className="mb-6 p-4 bg-yellow-900/30 border border-yellow-500/50 rounded-lg">
              <h3 className="text-yellow-400 font-semibold mb-2">🔄 Resume Previous Session</h3>
              <p className="text-sm text-gray-300 mb-3">
                We found an incomplete test session. You can resume where you left off or start a new test.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => resumeExistingSession(resumeSession)}
                  className="bg-yellow-600 hover:bg-yellow-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Resume Test
                </button>
                <button
                  onClick={() => {
                    quizStorage.clearProgress();
                    setResumeSession(null);
                  }}
                  className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Start New
                </button>
              </div>
            </div>
          )}

          <ul className="text-left list-disc list-inside space-y-4 text-white text-base leading-relaxed">
            <li>
              Company:{" "}
              <span className="text-indigo-500 font-semibold">{title}</span>
            </li>
            <li>
              Difficulty:{" "}
              <span className="text-indigo-500 font-semibold">
                {difficulty}
              </span>
            </li>
            <li>
              Test duration is{" "}
              <span className="text-indigo-500 font-semibold">10 minutes</span>.
            </li>
            <li>
              Each correct answer gives{" "}
              <span className="text-indigo-500 font-semibold">1 point</span>.
            </li>
            <li>
              <span className="text-indigo-500 font-semibold">
                No negative marking
              </span>
              .
            </li>
            <li>
              Attempt{" "}
              <span className="text-indigo-500 font-semibold">
                all questions
              </span>
              .
            </li>
            <li>
              <span className="text-green-400 font-semibold">
                Progress is automatically saved
              </span>
              .
            </li>
          </ul>
          <span className="font-semibold text-2xl text-center text-indigo-300 flex justify-center items-center">
            All The Best
          </span>
          <div className="mt-8 flex justify-center gap-6">
            <button
              onClick={() => {
                GenerateQuestions();
                setConfirmation(false);
              }}
              className="bg-indigo-600 cursor-pointer hover:bg-indigo-700 px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-md hover:shadow-indigo-700/40"
            >
              Start New Test
            </button>
          </div>
        </div>
      </div>
    );
  }
  if (submitConfirmation) {
    return (
      <div className="fixed inset-0 flex justify-center items-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 z-50 backdrop-blur-sm">
        <div className="bg-gray-900 rounded-3xl shadow-2xl p-10 text-white w-[90%] max-w-lg border border-indigo-500/30 transition-all duration-300">
          <h1 className="text-3xl font-extrabold mb-6 text-indigo-400 tracking-wide text-center">
            Are you sure you want to submit?
          </h1>
          <p className="text-center">
            You have attended{" "}
            <span className="text-indigo-300">
              {userAnswers.filter((answer) => answer !== null).length}
            </span>{" "}
            / 10 Questions
          </p>
          <p className="text-center">
            <span className="text-indigo-300">
              {10 - userAnswers.filter((answer) => answer !== null).length}
            </span>{" "}
            remaining
          </p>
          <div className="mt-8 flex justify-center gap-6">
            <button
              onClick={() => {
                setSubmitConfirmation(false);
              }}
              className="bg-red-600 cursor-pointer hover:bg-red-700 px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-md hover:shadow-red-700/40"
            >
              No
            </button>
            <button
              onClick={() => {
                handleSubmitTest();
                setSubmitConfirmation(false);
              }}
              className="bg-indigo-600 cursor-pointer hover:bg-indigo-700 px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-md hover:shadow-indigo-700/40"
            >
              Yes
            </button>
          </div>
        </div>
      </div>
    );
  }
  if (scoreBoard) {
    return (
      <div className="fixed inset-0 flex justify-center items-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 z-50 backdrop-blur-sm">
        <div className="bg-gray-900 rounded-3xl shadow-2xl p-10 text-white w-full h-full overflow-y-auto border border-indigo-500/30 transition-all duration-300">
          <h1 className="text-3xl font-extrabold mb-6 text-indigo-400 tracking-wide text-center">
            🎉 Test Completed!
          </h1>

          <div className="text-center space-y-4 text-lg">
            <p>
              <span className="text-indigo-400 font-semibold">
                Total Points:
              </span>{" "}
              {score} / 10
            </p>
            <p>
              <span className="text-indigo-400 font-semibold">Percentage:</span>{" "}
              {score * 10}%
            </p>
            <p>
              <span className="text-indigo-400 font-semibold">Time Taken:</span>{" "}
              {timeTaken}
            </p>
            <p className="text-green-400 font-medium">
              {score == 10
                ? "Perfect Score!"
                : score >= 7
                ? "Great Job!"
                : score >= 4
                ? "Good Effort!"
                : "Keep Practicing!"}
            </p>
          </div>

          {score < 10 && (
            <div className="mt-10">
              <h2 className="text-2xl font-semibold text-red-400 text-center mb-4">
                Your Mistakes
              </h2>
              <ul className="space-y-4 max-w-3xl mx-auto px-4">
                {geminiAnswers.map((correct, index) => {
                  const user = userAnswers[index];
                  if (user && user.trim() !== correct.trim()) {
                    return (
                      <li
                        key={index}
                        className="bg-gray-800 p-4 rounded-xl shadow-md border border-red-500/30"
                      >
                        <p className="text-white font-medium mb-1">
                          ❌ Question {index + 1}
                        </p>
                        <p className="text-red-400">
                          Your Answer:{" "}
                          <span className="font-semibold">{user}</span>
                        </p>
                        <p className="text-green-400">
                          Correct Answer:{" "}
                          <span className="font-semibold">{correct}</span>
                        </p>

                        <p className="text-white">
                          Explaination:{" "}
                          <span className="font-semibold">
                            {geminiExplaination[index]}
                          </span>
                        </p>
                      </li>
                    );
                  } else {
                    return null;
                  }
                })}
              </ul>
              <h2 className="text-2xl font-semibold text-green-400 text-center m-4">
                Correct Answers
              </h2>
              <ul className="space-y-4 max-w-3xl mx-auto px-4">
                {geminiAnswers.map((correct, index) => {
                  const user = userAnswers[index];
                  if (user && user.trim() === correct.trim()) {
                    return (
                      <li
                        key={index}
                        className="bg-gray-800 p-4 rounded-xl shadow-md border border-red-500/30"
                      >
                        <p className="text-white font-medium mb-1">
                          ✔️ Question {index + 1}
                        </p>
                        <p className="text-green-400">
                          Your Answer:{" "}
                          <span className="font-semibold">{user}</span>
                        </p>
                        <p className="text-white">
                          Explaination:{" "}
                          <span className="font-semibold">
                            {geminiExplaination[index]}
                          </span>
                        </p>
                      </li>
                    );
                  } else {
                    return null;
                  }
                })}
              </ul>
            </div>
          )}

          <div className="mt-10 flex justify-center gap-6">
            <button
              onClick={() => navigate("/homepage")}
              className="bg-indigo-600 cursor-pointer hover:bg-indigo-700 px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-md hover:shadow-indigo-700/40"
            >
              Go to Homepage
            </button>
          </div>
        </div>
      </div>
    );
  }
  if (quitConfirmation) {
    return (
      <div className="fixed inset-0 flex justify-center items-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 z-50 backdrop-blur-sm">
        <div className="bg-gray-900 rounded-3xl shadow-2xl p-10 text-white w-[90%] max-w-lg border border-indigo-500/30 transition-all duration-300">
          <h1 className="text-3xl font-extrabold mb-6 text-indigo-400 tracking-wide text-center">
            Are you sure you want to quit?
          </h1>
          <div className="mt-8 flex justify-center gap-6">
            <button
              onClick={() => {
                setQuitConfirmation(false);
              }}
              className="bg-indigo-600 cursor-pointer hover:bg-indigo-700 px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-md hover:shadow-indigo-700/40"
            >
              No
            </button>
            <button
              onClick={() => {
                setQuitConfirmation(false);
                navigate("/homepage");
              }}
              className="bg-red-600 cursor-pointer hover:bg-red-700 px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-md hover:shadow-red-700/40"
            >
              Yes
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <>
        <div className="flex absolute top-0 justify-center items-center h-screen bg-gray-900 w-full z-99">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 border-4 border-transparent border-t-blue-500 border-b-blue-500 rounded-full animate-spin"></div>
            <p className="text-white mt-4 text-lg font-semibold">
              Generating Questions...
            </p>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white w-full absolute">
      {/* Header */}
      <header className="bg-gray-800 shadow-md">
        <div className="container mx-auto px-4 py-3 flex justify-end items-center">
          <div className="flex items-center">
            <div className="bg-gray-700 px-4 py-2 rounded-md flex items-center">
              <svg
                className="h-5 w-5 mr-2 text-indigo-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="font-mono">{formatTime(remainingTime)}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="bg-gray-800 py-2 px-4">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm text-gray-300">Progress</span>
            <span className="text-sm text-gray-300">
              {userAnswers.filter((ans) => ans !== null).length} /{" "}
              {geminiQuestions.length} answered
            </span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
            <div
              className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
              style={{
                width: `${
                  (userAnswers.filter((ans) => ans !== null).length /
                    geminiQuestions.length) *
                  100
                }%`,
              }}
            ></div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="container mx-auto px-4 py-8">
        <Carousel className="w-full max-w-4xl mx-auto">
          <CarouselContent>
            {geminiQuestions.map((question, index) => (
              <CarouselItem key={index}>
                <div className="bg-gray-800 rounded-lg p-6 shadow-lg h-full">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-indigo-500">
                      Question {index + 1}
                    </h3>
                    <span className="bg-gray-700 px-2 py-1 rounded text-sm">
                      {index + 1} of {geminiQuestions.length}
                    </span>
                  </div>

                  <p className="text-lg mb-6">{question}</p>

                  <div className="space-y-3">
                    {geminiOptions[index].map((option, optionIndex) => (
                      <div
                        key={optionIndex}
                        className={`border border-gray-700 rounded-md p-3 cursor-pointer transition-colors ${
                          userAnswers[index] === option
                            ? "bg-indigo-600 border-indigo-500"
                            : "hover:bg-gray-700"
                        }`}
                        onClick={() => handleSelectOption(index, option)}
                      >
                        {option}
                      </div>
                    ))}
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="flex justify-between items-center mt-6">
            <div
              aria-disabled={currentSlide <= 1}
              onClick={() => {
                decrementSlideNo();
              }}
            >
              <CarouselPrevious
                className="relative right-0 left-auto bg-gray-800 border-gray-700 hover:bg-gray-700 text-white cursor-pointer"
                ref={prevRef}
              />
            </div>
            <div
              aria-disabled={currentSlide === 10}
              onClick={() => {
                incrementSlideNo();
              }}
            >
              <CarouselNext
                className="relative right-0 left-auto bg-gray-800 border-gray-700 hover:bg-gray-700 text-white cursor-pointer"
                ref={nextRef}
              />
            </div>
          </div>
        </Carousel>

        {/* Question navigator */}
        <div className="mt-8 max-w-4xl mx-auto">
          <h3 className="text-lg font-semibold mb-3">Questions Navigator</h3>
          <div className="grid grid-cols-5 gap-2 sm:grid-cols-10">
            {questionsData.map((_, index) => (
              <button
                key={index}
                className={`h-10 w-10 rounded-md flex items-center justify-center ${
                  userAnswers[index] !== null
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-800 text-gray-300 border border-gray-700"
                } cursor-pointer hover:bg-gray-700`}
                onClick={() => {
                  changeSlide(index);
                }}
              >
                {index + 1}
              </button>
            ))}
          </div>
          <div className="flex justify-center ">
            <div
              onClick={() => {
                setQuitConfirmation(true);
              }}
              className="relative w-[120px] mt-6 mx-auto"
            >
              <p className=" bg-red-600 hover:bg-red-700 text-white text-center font-medium py-2 px-4 rounded-md transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
                {" "}
                Quit Test
              </p>
            </div>
            <div
              onClick={() => {
                setSubmitConfirmation(true);
              }}
              className="relative w-[120px] mt-6 mx-auto"
            >
              <button className=" bg-indigo-600 hover:bg-indigo-700 text-center text-white font-medium py-2 px-4 rounded-md transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
                {" "}
                Submit Test
              </button>
            </div>
          </div>
          <p className="text-center m-3">
            {" "}
            <span className="font-semibold text-indigo-400">Notice:</span> If
            you encounter any errors in generating questions or options, <br />{" "}
            please click{" "}
            <span
              className="text-red-400 cursor-pointer hover:text-red-500"
              onClick={GenerateQuestions}
            >
              {" "}
              here{" "}
            </span>{" "}
            to regenerate them.{" "}
          </p>
        </div>
      </main>
    </div>
  );
};

export default TestPage;
