import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { useEffect, useState } from "react";
import axios from "axios";
import { FaLock } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { FaRegEdit } from "react-icons/fa";

interface HeaderProps {
  userID: string;
}

const userProfileData = {
  testsAttended: 12,
  totalPoints: 875,
  rank: 5,
  recentTests: [
    { id: 1, name: "JavaScript Fundamentals", score: 85, date: "2025-03-28" },
    { id: 2, name: "React Concepts", score: 92, date: "2025-03-21" },
    { id: 3, name: "Data Structures", score: 78, date: "2025-03-15" },
  ],
  badges: [
    {
      id: 1,
      name: "Tenacious Ten",
      description: "Completed 10 tests",
      img: "bronze.png",
      achieved: false,
    },
    {
      id: 2,
      name: "Flawless Victory",
      description: "Scored 100% on a test",
      img: "silver.png",
      achieved: false,
    },
    {
      id: 3,
      name: "Century Club",
      description: "Achieve total of 100 points",
      img: "gold.png",
      achieved: false,
    },
  ],
};

const Profile: React.FC<HeaderProps> = ({ userID }) => {
  const [user, setUser] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [profilePic, setProfilePic] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [confirmation, setConfirmation] = useState(false);
  const [confirmation2, setConfirmation2] = useState(false);
  const [newName, setNewName] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    setLoading(true);
    if (!userID) return;
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/register/getuser2/${userID}`,
          { withCredentials: true }
        );
        setUser(response.data.name || "");
        setProfilePic(response.data.profilepic || "");
        setEmail(response.data.email || "");
        userProfileData.testsAttended = response.data.testAttended || 0;
        userProfileData.totalPoints = response.data.points || 0;

        const response2 = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/test/getTop3Tests/${userID}`,
          { withCredentials: true }
        );
        interface Test {
          title: string;
          score: number;
          createdAt: string;
        }

        userProfileData.recentTests = response2.data.map((test: Test) => ({
          name: test.title,
          score: test.score,
          date: new Date(test.createdAt).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          }),
        }));

        if (response.data.testAttended >= 10) {
          userProfileData.badges[0].achieved = true;
        }
        if (response.data.points >= 100) {
          userProfileData.badges[2].achieved = true;
        }
        if (response.data.badges === 1) {
          userProfileData.badges[1].achieved = true;
        }
        const response3 = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/register/getRank/${userID}`,
          { withCredentials: true }
        );
        userProfileData.rank = response3.data.rank || 0;
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userID, navigate]);

  const changeName = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/register/changeName/${userID}`,
        { name: newName },
        { withCredentials: true }
      );
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      window.location.reload();
      setLoading(false);
    }
  };

  const handleUpload = async () => {
    setLoading(true);
    if (!selectedFile) return;
    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("upload_preset", import.meta.env.VITE_CLOUD_PRESET_NAME);
    formData.append("cloud_name", import.meta.env.VITE_CLOUD_NAME);
    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${
          import.meta.env.VITE_CLOUD_NAME
        }/image/upload`,
        formData
      );
      await axios.post(
        `${
          import.meta.env.VITE_API_BASE_URL
        }/register/changeProfilePic/${userID}`,
        { profilepic: response.data.secure_url },
        { withCredentials: true }
      );
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setLoading(false);
      window.location.reload();
    }
  };

  if (loading) {
    return (
      <>
        <div className="flex absolute top-0 justify-center items-center h-screen bg-gray-900 w-full z-99">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 border-4 border-transparent border-t-blue-500 border-b-blue-500 rounded-full animate-spin"></div>
            <p className="text-white mt-4 text-lg font-semibold">
              Loading Profile...
            </p>
          </div>
        </div>
      </>
    );
  }
  if (confirmation) {
    return (
      <div className="flex absolute top-0 justify-center items-center h-screen bg-gray-900 w-full z-50">
        <div className="bg-gray-800 rounded-2xl shadow-lg p-8 text-white w-[90%] max-w-md text-center flex flex-col gap-6">
          <h1 className="text-2xl font-bold mb-2">Change Your Dislplay Name</h1>
          <div className="flex justify-center items-center my-4">
            <input
              value={newName}
              type="text"
              name="newName"
              id="newName"
              placeholder="Enter your new name"
              className="w-1/2 px-4 py-2 border-2 border-white bg-transparent text-white rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              onChange={(e) => setNewName(e.target.value)}
            />
          </div>
          <div className="flex justify-center gap-8">
            <button
              onClick={() => {
                setConfirmation(false);
              }}
              className="bg-red-600 hover:bg-red-700 px-5 py-2 rounded-lg cursor-pointer font-medium transition"
            >
              Cancel
            </button>
            <button
              className="bg-indigo-600 hover:bg-indigo-700 px-5 py-2 rounded-lg cursor-pointer font-medium transition"
              onClick={() => {
                changeName();
                setConfirmation(false);
              }}
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    );
  }
  if (confirmation2) {
    return (
      <div className="flex absolute top-0 justify-center items-center h-screen bg-gray-900 w-full z-50">
        <div className="bg-gray-800 rounded-2xl shadow-lg p-8 text-white w-[90%] max-w-md text-center flex flex-col gap-6">
          <h1 className="text-2xl font-bold mb-2">Change Your Avatar</h1>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (selectedFile) {
                handleUpload();
                setConfirmation2(false);
              }
            }}
            className="flex flex-col gap-8 justify-center items-center my-4"
          >
            <input
              type="file"
              className="w-full cursor-pointer px-4 py-2 border-2 border-white bg-indigo-500 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
              required
            />

            <div className="flex justify-center gap-8">
              <button
                type="button"
                onClick={() => setConfirmation2(false)}
                className="bg-red-600 hover:bg-red-700 px-5 py-2 rounded-lg cursor-pointer font-medium transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 px-5 py-2 rounded-lg cursor-pointer font-medium transition"
              >
                Confirm
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-900 text-white w-full">
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg mb-8 flex flex-col md:flex-row items-center gap-6">
            <Avatar className="h-32 w-32 border-2 border-indigo-500">
              <AvatarImage src={profilePic || ""} alt={user || "User"} />
              <AvatarFallback className="bg-indigo-600 text-xl">
                {user ? user.charAt(0).toUpperCase() : "U"}
              </AvatarFallback>
              <div
                className="absolute bg-black w-full h-full opacity-0 cursor-pointer transition duration-200 hover:opacity-50 flex justify-center items-center"
                onClick={() => {
                  setConfirmation2(true);
                }}
              >
                <FaRegEdit className="text-2xl" />
              </div>
            </Avatar>

            <div className="flex-1 text-center md:text-left">
              {!user ? (
                <div className="flex flex-col gap-3">
                  <div className="w-28 h-8 bg-gray-500 rounded-full animate-pulse"></div>
                  <div className="w-40 h-4 bg-gray-500 rounded-full animate-pulse"></div>
                </div>
              ) : (
                <>
                  <span className="flex items-center gap-2 justify-center md:justify-start">
                    <h2 className="text-2xl font-bold">{user || "User"}</h2>{" "}
                    <FaRegEdit
                      className="text-xl opacity-25 cursor-pointer hover:opacity-100 transition duration-300"
                      title="Change display name"
                      onClick={() => {
                        setConfirmation(true);
                      }}
                    />
                  </span>
                  <p className="text-gray-400">{email}</p>
                </>
              )}

              <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-4">
                <div className="bg-gray-700 px-4 py-2 rounded-lg flex flex-col items-center">
                  <span className="text-xl font-bold">
                    {userProfileData.testsAttended}
                  </span>
                  <span className="text-sm text-gray-300">Tests Attended</span>
                </div>

                <div className="bg-gray-700 px-4 py-2 rounded-lg flex flex-col items-center">
                  <span className="text-xl font-bold">
                    {userProfileData.totalPoints}
                  </span>
                  <span className="text-sm text-gray-300">Total Points</span>
                </div>
                <div className="bg-gray-700 px-4 py-2 rounded-lg flex flex-col items-center">
                  <span className="text-xl font-bold">
                    #{userProfileData.rank}
                  </span>
                  <span className="text-sm text-gray-300">
                    Leader Board Rank
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle>Recent Tests</CardTitle>
                  <CardDescription className="text-gray-400">
                    Your latest test performances
                  </CardDescription>
                </CardHeader>
                {userProfileData.recentTests.length > 0 ? (
                  <CardContent>
                    <div className="space-y-4">
                      {userProfileData.recentTests.map((test) => (
                        <div
                          key={test.id}
                          className="bg-gray-700 rounded-lg p-4 flex justify-between items-center"
                        >
                          <div>
                            <h4 className="font-medium">{test.name}</h4>
                            <p className="text-sm text-gray-400">{test.date}</p>
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
                ) : (
                  <>
                    <div className="text-center p-6 bg-gray-800 rounded-lg shadow-md">
                      <h3 className="text-xl font-semibold text-white mb-2">
                        No Tests to Display
                      </h3>
                      <p className="text-gray-400 mb-4">
                        You haven't taken any tests yet.
                      </p>
                      <Link
                        to="/homepage"
                        className="inline-block bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-500 transition"
                      >
                        Take Your First Test
                      </Link>
                    </div>
                  </>
                )}

                <CardFooter className="border-t border-gray-700 pt-4">
                  <Link
                    to="/previous-tests"
                    className="text-indigo-400 hover:text-indigo-300 transition text-sm"
                  >
                    View all test history →
                  </Link>
                </CardFooter>
              </Card>
            </div>

            <div>
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle>Badges</CardTitle>
                  <CardDescription className="text-gray-400">
                    Achievements you've earned
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {userProfileData.badges.map((badge) => (
                      <>
                        <p className="text-xs text-center text-gray-400">
                          {badge.description}
                        </p>
                        <div
                          key={badge.id}
                          className="bg-gray-700 rounded-lg p-3 flex items-center gap-3 relative overflow-hidden"
                        >
                          <div className="h-12 w-12 rounded-full flex items-center justify-center ">
                            <img
                              src={`${badge.img}`}
                              alt={badge.name}
                              className="h-full w-full"
                            />
                          </div>
                          <div>
                            <h4 className="font-medium">{badge.name}</h4>
                          </div>
                          {!badge.achieved && (
                            <div
                              className="absolute inset-0 bg-black opacity-80 flex justify-center items-center"
                              title={`${badge.description}`}
                            >
                              <FaLock className="text-indigo-500 text-3xl" />
                            </div>
                          )}
                        </div>
                      </>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
