import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner"; // Assuming 'sonner' is available for toasts

// --- Self-Contained Components & Logic ---

// This prompt is now inside the component, removing a file dependency.
// It asks the AI to return a clean JSON object, which is much more reliable to parse.
const geminiPrompt = `
  You are an expert test creator. Generate a 10-question multiple-choice test based on the following criteria.
  Topic and Context: for the topic \${topic}
  Difficulty: \${difficulty}

  Provide the output ONLY in a valid JSON format. The JSON object should have a single key "test" which is an array of 10 question objects. Each object must have the following keys: "question" (string), "options" (an array of exactly 4 strings), "answer" (the correct option string), and "explanation" (a brief explanation for the correct answer).

  Do not include any other text, greetings, or markdown formatting like \`\`\`json outside of the JSON object itself.
`;

// This hook is now implemented directly in the component.
const useDetectTabSwitch = () => {
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        toast.warning("Switching tabs is not allowed during the test.");
        // You could add logic here to automatically submit the test if needed.
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);
};

interface HeaderProps {
  userID: string;
}

const TestPage: React.FC<HeaderProps> = ({ userID }) => {
  useDetectTabSwitch();
  const [currentTime, setCurrentTime] = useState(10 * 60);
  const [submitted, setSubmitted] = useState(false);
  const hasSubmittedRef = useRef(false);
  const timerRef = useRef<number | null>(null);
  const [userAnswers, setUserAnswers] = useState<(string | null)[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [geminiQuestions, setGeminiQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [title, setTitle] = useState<string>("");
  const [quitConfirmation, setQuitConfirmation] = useState(false);
  const [submitConfirmation, setSubmitConfirmation] = useState(false);
  const [scoreBoard, setScoreBoard] = useState(false);
  const [score, setScore] = useState<number>(0);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [timeTaken, setTimeTaken] = useState<string>("");
  const [currentTestId, setCurrentTestId] = useState<string | null>(null);

  useEffect(() => {
    if (submitted || currentTime <= 0) return;
    timerRef.current = window.setInterval(() => {
      setCurrentTime((prevTime) => {
        if (prevTime <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          if (!hasSubmittedRef.current) {
            toast.warning("Time's up! Your test is being submitted.");
            handleSubmitTest();
          }
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [submitted, currentTime]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  const handleSelectOption = (option: string) => {
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestionIndex] = option;
    setUserAnswers(newAnswers);
  };

  const handleSubmitTest = async () => {
    if (hasSubmittedRef.current || submitted) return;
    hasSubmittedRef.current = true;
    setSubmitted(true);
    if (timerRef.current) clearInterval(timerRef.current);

    const calculatedScore = userAnswers.reduce((total, answer, index) => {
      return answer?.trim() === geminiQuestions[index]?.answer?.trim()
        ? total + 1
        : total;
    }, 0);
    setScore(calculatedScore);
    setScoreBoard(true);

    if (startTime) {
      const endTime = new Date();
      const diffSeconds = Math.floor(
        (endTime.getTime() - startTime.getTime()) / 1000
      );
      const minutes = Math.floor(diffSeconds / 60);
      const seconds = diffSeconds % 60;
      setTimeTaken(`${minutes}m ${seconds}s`);
    }

    try {
      await axios.post(
        `${
          import.meta.env.VITE_API_BASE_URL
        }/test/updateScoreInTestModel/${currentTestId}`,
        { score: calculatedScore },
        { withCredentials: true }
      );
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/progress/log-practice`,
        {
          userid: userID,
          score: calculatedScore,
          testType: title || "general",
          practiceMinutes: Math.floor((10 * 60 - currentTime) / 60),
        },
        { withCredentials: true }
      );
    } catch (error) {
      console.error("Error updating score:", error);
    }
  };

  const goToNextQuestion = () =>
    setCurrentQuestionIndex((prev) =>
      Math.min(prev + 1, geminiQuestions.length - 1)
    );
  const goToPreviousQuestion = () =>
    setCurrentQuestionIndex((prev) => Math.max(prev - 1, 0));

  useEffect(() => {
    const fetchTestDataAndGenerateQuestions = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/test/gettest/${userID}`,
          { withCredentials: true }
        );
        const testData = response.data;
        setTitle(testData.title);
        setCurrentTestId(testData._id);

        let promptContext = `on the topic of "${testData.topic}"`;
        if (!testData.topic || testData.topic.trim() === "") {
          promptContext = `that are most frequently asked in ${testData.title} company interviews`;
        }
        const updatedPrompt = geminiPrompt
          .replace("${topic}", promptContext)
          .replace("${difficulty}", testData.difficulty);
        await generateQuestionsFromApi(updatedPrompt);
      } catch (error) {
        console.error("Error fetching test data:", error);
        toast.error("Failed to load test. Navigating back home.");
        navigate("/homepage");
      }
    };
    fetchTestDataAndGenerateQuestions();
  }, [userID, navigate]);

  const generateQuestionsFromApi = async (prompt: string) => {
    setLoading(true);
    setStartTime(new Date());

    const apiKey = import.meta.env.VITE_GOOGLE_AI_API_KEY;
    if (!apiKey) {
      console.error("Gemini API key is not configured.");
      toast.error("API key is missing. Please contact support.");
      setLoading(false);
      navigate("/homepage");
      return; // Stop execution if key is missing
    }
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
    const payload = {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { responseMimeType: "application/json" },
    };

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok)
        throw new Error(`API call failed: ${response.statusText}`);

      const result = await response.json();
      const textResponse = result.candidates[0].content.parts[0].text;
      const data = JSON.parse(textResponse);
      const questionsArray = data.test;

      if (!Array.isArray(questionsArray) || questionsArray.length === 0) {
        throw new Error("Invalid question format received from AI.");
      }

      setGeminiQuestions(questionsArray);
      setUserAnswers(Array(questionsArray.length).fill(null));
    } catch (error) {
      console.error("Error generating questions:", error);
      toast.error("Error generating questions. Please try again.");
      navigate("/homepage");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex absolute top-0 justify-center items-center h-screen bg-gray-900 w-full z-50">
               {" "}
        <div className="flex flex-col items-center">
                   {" "}
          <div className="w-16 h-16 border-4 border-transparent border-t-blue-500 border-b-blue-500 rounded-full animate-spin"></div>
                   {" "}
          <p className="text-white mt-4 text-lg font-semibold">
            Generating Your Test...
          </p>
                 {" "}
        </div>
             {" "}
      </div>
    );
  }

  if (scoreBoard) {
    return (
      <div className="fixed inset-0 flex justify-center items-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 z-50 p-4">
               {" "}
        <div className="bg-gray-900 rounded-3xl shadow-2xl p-6 md:p-10 text-white w-full max-w-4xl h-full max-h-[90vh] overflow-y-auto border border-indigo-500/30">
                   {" "}
          <h1 className="text-3xl font-extrabold mb-6 text-indigo-400 text-center">
            🎉 Test Completed!
          </h1>
                   {" "}
          <div className="text-center space-y-4 text-lg mb-8">
                       {" "}
            <p>
              <span className="text-indigo-400 font-semibold">
                Total Points:
              </span>{" "}
              {score} / {geminiQuestions.length}
            </p>
                       {" "}
            <p>
              <span className="text-indigo-400 font-semibold">Percentage:</span>{" "}
              {geminiQuestions.length > 0
                ? ((score / geminiQuestions.length) * 100).toFixed(0)
                : 0}
              %
            </p>
                       {" "}
            <p>
              <span className="text-indigo-400 font-semibold">Time Taken:</span>{" "}
              {timeTaken}
            </p>
                     {" "}
          </div>
          {/* Review Section */}
          <div className="space-y-4">
            {geminiQuestions.map((q, index) => {
              const userAnswer = userAnswers[index];
              const isCorrect = userAnswer?.trim() === q.answer?.trim();
              return (
                <div
                  key={index}
                  className={`p-4 rounded-lg border ${
                    isCorrect
                      ? "border-green-500/30 bg-gray-800"
                      : "border-red-500/30 bg-gray-800"
                  }`}
                >
                  <p className="font-semibold mb-2">
                    Question {index + 1}: {q.question}
                  </p>
                  <p className={isCorrect ? "text-green-400" : "text-red-400"}>
                    Your Answer: {userAnswer || "Not Answered"}
                  </p>
                  {!isCorrect && (
                    <p className="text-green-400">Correct Answer: {q.answer}</p>
                  )}
                  <p className="text-gray-400 mt-2 text-sm">
                    Explanation: {q.explanation}
                  </p>
                </div>
              );
            })}
          </div>
                   {" "}
          <div className="mt-10 flex justify-center">
                       {" "}
            <button
              onClick={() => navigate("/homepage")}
              className="bg-indigo-600 hover:bg-indigo-700 px-6 py-3 rounded-xl font-medium"
            >
              Go to Homepage
            </button>
                     {" "}
          </div>
                 {" "}
        </div>
             {" "}
      </div>
    );
  }

  if (submitConfirmation) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md">
        <div className="w-full max-w-md rounded-lg bg-gray-800 p-6 text-center shadow-lg">
          <h2 className="mb-4 text-2xl font-bold text-white">
            Confirm Submission
          </h2>
          <p className="mb-6 text-gray-300">
            Are you sure you want to submit your test? You will not be able to
            change your answers.
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => setSubmitConfirmation(false)}
              className="rounded-md bg-gray-600 px-6 py-2 font-medium text-white hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                setSubmitConfirmation(false); // Close modal
                handleSubmitTest(); // Submit the test
              }}
              className="rounded-md bg-indigo-600 px-6 py-2 font-medium text-white hover:bg-indigo-700"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    );
  }

  return geminiQuestions.length > 0 ? (
    <div className="min-h-screen bg-gray-900 text-white w-full absolute top-0 left-0 flex flex-col">
      {" "}
      <header className="bg-gray-800 shadow-md">
        {" "}
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="text-lg font-bold">{title} Test</div>         {" "}
          <div className="bg-gray-700 px-4 py-2 rounded-md flex items-center">
                       {" "}
            <span className="font-mono">{formatTime(currentTime)}</span>       
             {" "}
          </div>
                 {" "}
        </div>
             {" "}
      </header>
           {" "}
      <div className="bg-gray-800 py-2 px-4">
               {" "}
        <div className="container mx-auto">
                   {" "}
          <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-gray-300">Progress</span> 
                     {" "}
            <span className="text-sm text-gray-300">
              {userAnswers.filter((ans) => ans !== null).length} /{" "}
              {geminiQuestions.length} answered
            </span>
                     {" "}
          </div>
                   {" "}
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className="bg-indigo-600 h-2 rounded-full"
              style={{
                width: `${
                  (userAnswers.filter((ans) => ans !== null).length /
                    geminiQuestions.length) *
                  100
                }%`,
              }}
            ></div>
          </div>
                 {" "}
        </div>
             {" "}
      </div>
           {" "}
      <main className="container mx-auto px-4 py-8 flex-grow pb-16 overflow-y-auto">
        <div className="w-full max-w-4xl mx-auto">
          {/* Question Display */}
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-indigo-500">
                Question {currentQuestionIndex + 1}
              </h3>
              <span className="bg-gray-700 px-2 py-1 rounded text-sm">
                {currentQuestionIndex + 1} of {geminiQuestions.length}
              </span>
            </div>
            <p className="text-lg mb-6">
              {geminiQuestions[currentQuestionIndex]?.question}
            </p>
            <div className="space-y-3">
              {geminiQuestions[currentQuestionIndex]?.options.map(
                (option: string, index: number) => (
                  <div
                    key={index}
                    className={`border rounded-md p-3 cursor-pointer transition-colors ${
                      userAnswers[currentQuestionIndex] === option
                        ? "bg-indigo-600 border-indigo-500"
                        : "border-gray-700 hover:bg-gray-700"
                    }`}
                    onClick={() => handleSelectOption(option)}
                  >
                    {option}
                  </div>
                )
              )}
            </div>
          </div>
          {/* Navigation Buttons */}
          <div className="flex justify-between items-center mt-6">
            <button
              onClick={goToPreviousQuestion}
              disabled={currentQuestionIndex === 0}
              className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-md disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={goToNextQuestion}
              disabled={currentQuestionIndex === geminiQuestions.length - 1}
              className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-md disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>{" "}
        <div className="mt-8 max-w-4xl mx-auto w-full">
          {" "}
          <h3 className="text-lg font-semibold mb-3">
            Questions Navigator
          </h3>{" "}
          <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
            {" "}
            {geminiQuestions.map((_, index) => (
              <button
                key={index}
                className={`h-10 w-10 rounded-md flex items-center justify-center text-sm ${
                  currentQuestionIndex === index ? "ring-2 ring-indigo-500" : ""
                } ${
                  userAnswers[index] !== null
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-800 text-gray-300 border border-gray-700"
                } cursor-pointer hover:bg-gray-700`}
                onClick={() => setCurrentQuestionIndex(index)}
              >
                                {index + 1}             {" "}
              </button>
            ))}{" "}
          </div>{" "}
          <div className="flex justify-center gap-4 mt-6">
            <button
              onClick={() => setQuitConfirmation(true)}
              className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md"
            >
              Quit Test
            </button>{" "}
            <button
              onClick={() => setSubmitConfirmation(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md"
            >
              Submit Test
            </button>{" "}
          </div>{" "}
        </div>{" "}
      </main>{" "}
    </div>
  ) : null;
};

export default TestPage;
