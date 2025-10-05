import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { useDarkMode } from "../Custom/DarkModeContext";

interface HeaderProps {
  userID: string;
}
interface Test {
  _id: string;
  title: string;
  createdAt: string;
  score: number;
}

const PrevTests: React.FC<HeaderProps> = ({ userID }) => {
  const { darkMode } = useDarkMode();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [userProfileData, setUserProfileData] = useState<{ array: Test[] }>({
    array: [],
  });

  useEffect(() => {
    if (!userID) return;
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/test/getAllTests/${userID}`
        );
        setUserProfileData({ array: response.data });
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userID, navigate]);

  if (loading) {
    return (
      <div
        className={`flex absolute top-0 justify-center items-center h-screen w-full z-50 ${
          darkMode ? "bg-gray-900/90" : "bg-gray-100/80"
        } backdrop-blur-md`}
      >
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-transparent border-t-indigo-500 border-b-indigo-500 rounded-full animate-spin"></div>
          <p
            className={`mt-4 text-lg font-semibold ${
              darkMode ? "text-white" : "text-gray-800"
            }`}
          >
            Loading Previous Tests...
          </p>
        </div>
      </div>
    );
  }

  return userProfileData.array.length > 0 ? (
    <div className="grid grid-cols-1 gap-8 w-full py-8">
      <div className="lg:col-span-2">
        <Card
          className={`shadow-xl hover:shadow-2xl transition-all duration-300 ${
            darkMode
              ? "bg-gray-800 border border-gray-700"
              : "bg-white border border-gray-300"
          }`}
        >
          <CardHeader>
            <CardTitle className={darkMode ? "text-white" : "text-gray-900"}>
              Recent Tests
            </CardTitle>
            <CardDescription
              className={darkMode ? "text-gray-400" : "text-gray-600"}
            >
              Your latest test performances
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {userProfileData.array.map((test) => (
                <div
                  key={test._id}
                  className={`rounded-lg p-4 flex justify-between items-center transition duration-200 group ${
                    darkMode
                      ? "bg-gray-700 hover:bg-gray-600"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  <div>
                    <h4
                      className={`font-medium transition ${
                        darkMode
                          ? "group-hover:text-indigo-400 text-white"
                          : "group-hover:text-indigo-600 text-gray-900"
                      }`}
                    >
                      {test.title}
                    </h4>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-lg font-bold ${
                        test.score * 10 >= 90
                          ? "text-green-500"
                          : test.score * 10 >= 70
                          ? "text-yellow-500"
                          : "text-red-500"
                      }`}
                    >
                      {test.score * 10}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  ) : (
    <div className="text-center mt-10">
      <h2
        className={`text-2xl font-semibold mb-4 ${
          darkMode ? "text-white" : "text-gray-900"
        }`}
      >
        🚫 No Tests Taken Yet
      </h2>
      <p
        className={`mb-6 ${
          darkMode ? "text-gray-400" : "text-gray-600"
        }`}
      >
        Looks like you haven’t attempted any tests so far.
        <br className="hidden sm:block" /> Start your journey now!
      </p>
      <Link
        to="/homepage"
        className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-5 rounded-full transition-transform transform hover:scale-105 duration-300 shadow-md"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        Take a Test
      </Link>
    </div>
  );
};

export default PrevTests;
