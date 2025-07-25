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

interface HeaderProps {
  userID: string;
}

const TestPage: React.FC<HeaderProps> = ({ userID }) => {
  useDetectTabSwitch();
  const [currentTime, setCurrentTime] = useState(10 * 60);
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

  useEffect(() => {
    if (currentTime <= 0) return;
    const timer = setInterval(() => {
      setCurrentTime((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          toast.warning("Time's up! Your test is being submitted.");
          handleSubmitTest();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [currentTime, geminiQuestions, geminiOptions, geminiAnswers]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  const handleSelectOption = (questionIndex: number, option: string) => {
    const newAnswers = [...userAnswers];
    newAnswers[questionIndex] = option;
    setUserAnswers(newAnswers);
  };

  const handleSubmitTest = async () => {
    const score = userAnswers.reduce((total, answer, index) => {
      return answer?.trim() === geminiAnswers[index].trim() ? total + 1 : total;
    }, 0);
    setScore(score);
    setScoreBoard(true);
    if (score == 10) {
      try {
        await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/test/updateBadge/${userID}`,
          {
            badges: 1,
          },
          { withCredentials: true }
        );
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }
    try {
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/test/updateScore/${userID}`,
        {
          points: score,
        },
        { withCredentials: true }
      );
      await axios.post(
        `${
          import.meta.env.VITE_API_BASE_URL
        }/test/updateScoreInTestModel/${userID}`,
        {
          score: score,
        },
        { withCredentials: true }
      );
    } catch (error) {
      console.error("Error fetching data:", error);
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
    } catch (error) {
      console.error("Error generating questions:", error);
    } finally {
      setCurrentTime(10 * 60);
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
  if (confirmation) {
    return (
      <div className="fixed inset-0 flex justify-center items-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 z-50 backdrop-blur-sm">
        <div className="bg-gray-900 rounded-3xl shadow-2xl p-10 text-white w-[90%] max-w-lg border border-indigo-500/30 transition-all duration-300">
          <h1 className="text-3xl font-extrabold mb-6 text-indigo-400 tracking-wide text-center">
            📋 Test Instructions
          </h1>

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
              Start Test
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
              <span className="font-mono">{formatTime(currentTime)}</span>
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
