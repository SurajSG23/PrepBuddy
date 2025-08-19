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
        <div className="flex absolute top-0 justify-center items-center h-screen bg-gray-900 w-full z-99">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 border-4 border-transparent border-t-blue-500 border-b-blue-500 rounded-full animate-spin"></div>
            <p className="text-white mt-4 text-lg font-semibold">Loading Previous Tests...</p>
          </div>
        </div>
      </>
    );
  }
  return userProfileData.array.length > 0 ? (
    <div className="grid grid-cols-1 gap-8 w-full py-8">
      <div className="lg:col-span-2">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle>Recent Tests</CardTitle>
            <CardDescription className="text-gray-400">
              Your latest test performances
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {userProfileData.array.map((test) => (
                <div
                  key={test._id}
                  className="bg-gray-700 rounded-lg p-4 flex justify-between items-center"
                >
                  <div>
                    <h4 className="font-medium">{test.title}</h4>
                    <p className="text-sm text-gray-400">
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
                          ? "text-yellow-400"
                          : "text-red-400"
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
        <h2 className="text-2xl font-semibold text-gray-300 mb-4">
          No Tests Taken Yet
        </h2>
        <p className="text-gray-400 mb-6">
          Looks like you haven’t attempted any tests so far.
        </p>
        <Link
          to="/homepage"
          className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition duration-300"
        >
          Take a Test
        </Link>
      </div>
    </>
  );
};

export default PrevTests;
