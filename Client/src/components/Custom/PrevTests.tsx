import axios from "axios";
import React, { useEffect, useState } from "react";
import { useThemeSelector } from "../../store/hooks";
import { Link, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";

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
  const [loading, setLoading] = useState(true);
  const darkMode = useThemeSelector((state) => state.theme.darkMode);
  const navigate = useNavigate();

  const [userProfileData, setUserProfileData] = useState<{ array: Test[] }>({
    array: [],
  });
  useEffect(() => {
    if (!userID) return;
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/test/getAllTests/${userID}`,
          { withCredentials: true }
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
      <>
        <div
          className={`flex absolute top-0 justify-center items-center h-screen w-full z-99 ${darkMode ? "bg-gray-900" : "bg-gray-100"}`}
        >
          <div className="flex flex-col items-center">
            <div className={`w-16 h-16 border-4 border-transparent rounded-full animate-spin ${darkMode ? "border-t-blue-500 border-b-blue-500" : "border-t-indigo-500 border-b-indigo-500"}`}></div>
            <p className={`mt-4 text-lg font-semibold ${darkMode ? "text-white" : "text-gray-800"}`}>Loading Previous Tests...</p>
          </div>
        </div>
      </>
    );
  }
  return userProfileData.array.length > 0 ? (
    <div className="grid grid-cols-1 gap-8 w-full py-8">
      <div className="lg:col-span-2">
        <Card className={`${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} shadow-xl hover:shadow-2xl transition-all duration-300`}>
          <CardHeader>
            <CardTitle className={darkMode ? "text-white" : "text-gray-900"}>Recent Tests</CardTitle>
            <CardDescription className={darkMode ? "text-gray-400" : "text-gray-600"}>
              Your latest test performances
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {userProfileData.array.map((test) => (
                <div
                  key={test._id}
                  className={`${darkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-100 hover:bg-gray-200"} rounded-lg p-4 flex justify-between items-center transition duration-200 group`}
                >
                  <div>
                    <h4 className={`font-medium transition group-hover:${darkMode ? "text-indigo-400" : "text-indigo-600"}`}>{test.title}</h4>
                    <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                      {new Date(test.createdAt).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-lg font-bold ${
                        test.score * 10 >= 90
                          ? "text-green-400"
                          : test.score * 10 >= 70
                          ? darkMode ? "text-yellow-400" : "text-yellow-600"
                          : darkMode ? "text-red-400" : "text-red-600"
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
    <>
      <div className="text-center mt-10">
        <h2 className={`text-2xl font-semibold mb-4 ${darkMode ? "text-white" : "text-gray-900"}`}>
          🚫 No Tests Taken Yet
        </h2>
        <p className={`mb-6 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
          Looks like you haven’t attempted any tests so far.
          <br className="hidden sm:block" /> Start your journey now!
        </p>
        <Link
          to="/homepage"
          className={`inline-flex items-center gap-2 ${darkMode ? "bg-indigo-600 hover:bg-indigo-700 text-white" : "bg-indigo-500 hover:bg-indigo-600 text-white"} font-medium py-2 px-5 rounded-full transition-transform transform hover:scale-105 duration-300 shadow-md`}
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
    </>
  );
};

export default PrevTests;
