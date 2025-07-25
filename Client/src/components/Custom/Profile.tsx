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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

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
      img: "/badges/bronze.png",
      achieved: false,
    },
    {
      id: 2,
      name: "Flawless Victory",
      description: "Scored 100% on a test",
      img: "/badges/silver.png",
      achieved: false,
    },
    {
      id: 3,
      name: "Century Club",
      description: "Achieve total of 100 points",
      img: "/badges/gold.png",
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
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // When file changes, generate preview
  useEffect(() => {
    if (selectedFile) {
      const objectUrl = URL.createObjectURL(selectedFile);
      setPreviewUrl(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    } else {
      setPreviewUrl(null);
    }
  }, [selectedFile]);

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
    if (!newName) return;
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
        <div className="fixed inset-0 flex justify-center items-center bg-gray-950 bg-opacity-80 z-50">
          <div className="flex flex-col items-center p-6 rounded-lg bg-gray-900 shadow-2xl">
            <div className="w-20 h-20 border-4 border-transparent border-t-indigo-500 border-b-indigo-500 rounded-full animate-spin"></div>
            <p className="text-white mt-6 text-xl font-semibold tracking-wide">
              Loading Profile...
            </p>
          </div>
        </div>
      </>
    );
  }
  if (confirmation) {
    return (
      <Dialog open={confirmation} onOpenChange={setConfirmation}>
        <DialogContent className="bg-gray-900 text-white rounded-2xl shadow-xl p-8 max-w-md w-[90%] border border-indigo-700">
          <DialogHeader>
            <DialogTitle className="text-3xl font-extrabold mb-4 text-center text-indigo-400">
              Change Your Display Name
            </DialogTitle>
          </DialogHeader>

          <div className="w-full flex justify-center mb-6">
            <Input
              required
              value={newName}
              type="text"
              id="newName"
              placeholder="Enter your new name"
              className="w-full bg-gray-700 border-2 border-indigo-600 text-white placeholder:text-gray-300 px-4 py-3 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
              onChange={(e) => setNewName(e.target.value)}
            />
          </div>

          <div className="flex justify-center gap-6">
            <Button
              type="button"
              variant="destructive"
              onClick={() => setConfirmation(false)}
              className="px-6 py-3 font-semibold text-lg rounded-xl transition-all duration-300 bg-red-700 hover:bg-red-800 shadow-lg"
            >
              Cancel
            </Button>
            <Button
              className="bg-indigo-600 hover:bg-indigo-700 px-6 py-3 font-semibold text-lg rounded-xl transition-all duration-300 shadow-lg"
              onClick={() => {
                changeName();
                setConfirmation(false);
              }}
            >
              Confirm
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (confirmation2) {
    return (
      <Dialog open={confirmation2} onOpenChange={setConfirmation2}>
        <DialogContent className="bg-gray-900 text-white rounded-2xl shadow-xl p-8 max-w-md w-[90%] border border-indigo-700">
          <DialogHeader>
            <DialogTitle className="text-3xl font-extrabold mb-4 text-center text-indigo-400">
              Change Your Avatar
            </DialogTitle>
          </DialogHeader>

          {previewUrl && (
            <div className="flex justify-center mb-6">
              <img
                src={previewUrl}
                alt="Selected Preview"
                className="w-40 h-40 rounded-full object-cover border-4 border-indigo-500 shadow-xl ring-2 ring-white ring-opacity-20"
              />
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (selectedFile) {
                handleUpload();
                setConfirmation2(false);
              }
            }}
            className="flex flex-col gap-8 justify-center items-center"
          >
            <Input
              type="file"
              required
              onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
              className="w-full cursor-pointer px-4 py-2 border-2 border-white  text-white rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <div className="flex justify-center gap-6">
              <Button
                type="button"
                variant="destructive"
                onClick={() => {
                  setSelectedFile(null);
                  setConfirmation2(false);
                }}
                className="px-6 py-3 rounded-xl font-semibold text-lg bg-red-700 hover:bg-red-800 transition-all duration-300 shadow-lg"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 px-6 py-3 rounded-xl font-semibold text-lg transition-all duration-300 shadow-lg"
              >
                Confirm
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 to-gray-800 text-white w-full py-12">
      <main className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          {/* User Profile Header */}
          <div className="bg-gray-900 rounded-3xl p-8 shadow-2xl mb-12 flex flex-col md:flex-row items-center gap-8 border border-indigo-800 transform transition-all duration-300 hover:scale-[1.01]">
            <Avatar className="h-36 w-36 rounded-full border-4 border-indigo-600 shadow-lg group relative overflow-hidden flex-shrink-0">
              <AvatarImage
                src={profilePic || ""}
                alt={user || "User"}
                className="object-cover"
              />
              <AvatarFallback className="bg-indigo-700 text-3xl font-bold text-white flex items-center justify-center">
                {user ? user.charAt(0).toUpperCase() : "U"}
              </AvatarFallback>
              <div
                className="absolute inset-0 flex items-center justify-center rounded-full bg-black bg-opacity-60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
                onClick={() => {
                  setConfirmation2(true);
                }}
                title="Change Profile Picture"
              >
                <FaRegEdit className="text-3xl text-indigo-300" />
              </div>
            </Avatar>

            <div className="flex-1 text-center md:text-left">
              {!user ? (
                <div className="flex flex-col gap-4 items-center md:items-start">
                  <div className="w-48 h-10 bg-gray-700 rounded-full animate-pulse"></div>
                  <div className="w-64 h-6 bg-gray-700 rounded-full animate-pulse"></div>
                </div>
              ) : (
                <>
                  <span className="flex items-center gap-3 justify-center md:justify-start mb-2">
                    <h2 className="text-4xl font-extrabold text-indigo-300 leading-tight">
                      {user || "User"}
                    </h2>{" "}
                    <FaRegEdit
                      className="text-2xl text-gray-500 cursor-pointer hover:text-indigo-400 transition-colors duration-300"
                      title="Change display name"
                      onClick={() => {
                        setConfirmation(true);
                      }}
                    />
                  </span>
                  <p className="text-gray-400 text-lg mb-6">{email}</p>
                </>
              )}

              <div className="flex flex-wrap justify-center md:justify-start gap-6 mt-4">
                <div className="bg-gray-800 px-6 py-3 rounded-xl flex flex-col items-center border border-indigo-700 shadow-md transform hover:translate-y-[-4px] transition-transform duration-200">
                  <span className="text-2xl font-bold text-green-400">
                    {userProfileData.testsAttended}
                  </span>
                  <span className="text-sm text-gray-300 mt-1">
                    Tests Attended
                  </span>
                </div>

                <div className="bg-gray-800 px-6 py-3 rounded-xl flex flex-col items-center border border-indigo-700 shadow-md transform hover:translate-y-[-4px] transition-transform duration-200">
                  <span className="text-2xl font-bold text-yellow-400">
                    {userProfileData.totalPoints}
                  </span>
                  <span className="text-sm text-gray-300 mt-1">
                    Total Points
                  </span>
                </div>
                <div className="bg-gray-800 px-6 py-3 rounded-xl flex flex-col items-center border border-indigo-700 shadow-md transform hover:translate-y-[-4px] transition-transform duration-200">
                  <span className="text-2xl font-bold text-blue-400">
                    #{userProfileData.rank}
                  </span>
                  <span className="text-sm text-gray-300 mt-1">
                    Leaderboard Rank
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Badges and Recent Tests Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Badges Card */}
            <div>
              <Card className="bg-gray-900 border border-indigo-800 text-white rounded-3xl shadow-xl p-6 h-full flex flex-col">
                <CardHeader className="pb-4">
                  <CardTitle className="text-3xl font-extrabold text-indigo-400">
                    Badges
                  </CardTitle>
                  <CardDescription className="text-gray-400 text-md mt-2">
                    Achievements you've earned
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <div className="space-y-6">
                    {userProfileData.badges.map((badge) => (
                      <div
                        key={badge.id}
                        className="bg-gray-800 rounded-xl p-4 flex items-center gap-4 relative overflow-hidden border border-gray-700 transition-all duration-300 hover:shadow-lg hover:border-indigo-600"
                      >
                        <div className="h-16 w-16 rounded-full flex items-center justify-center flex-shrink-0">
                          <img
                            src={badge.img}
                            alt={badge.name}
                            className="h-full w-full object-contain"
                          />
                        </div>
                        <div>
                          <h4 className="font-bold text-xl text-white">
                            {badge.name}
                          </h4>
                          <p className="text-sm text-gray-400 mt-1">
                            {badge.description}
                          </p>
                        </div>
                        {!badge.achieved && (
                          <div
                            className="absolute inset-0 bg-black bg-opacity-85 flex justify-center items-center backdrop-blur-sm"
                            title={`Locked: ${badge.description}`}
                          >
                            <FaLock className="text-indigo-500 text-4xl animate-pulse" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Tests Card */}
            <div className="lg:col-span-2">
              <Card className="bg-gray-900 border border-indigo-800 text-white rounded-3xl shadow-xl p-6 h-full flex flex-col">
                <CardHeader className="pb-4">
                  <CardTitle className="text-3xl font-extrabold text-indigo-400">
                    Recent Tests
                  </CardTitle>
                  <CardDescription className="text-gray-400 text-md mt-2">
                    Your latest test performances
                  </CardDescription>
                </CardHeader>
                {userProfileData.recentTests.length > 0 ? (
                  <CardContent className="flex-grow">
                    <div className="space-y-6">
                      {userProfileData.recentTests.map((test, index) => (
                        <div
                          key={index} // Using index as key for simplicity, consider unique IDs if available
                          className="bg-gray-800 bg-opacity-70 rounded-xl p-5 flex justify-between items-center border border-gray-700 shadow-md transition-all duration-300 hover:shadow-lg hover:bg-opacity-90 hover:border-indigo-600"
                        >
                          <div>
                            <h4 className="font-semibold text-xl text-white">
                              {test.name}
                            </h4>
                            <p className="text-sm text-gray-400 mt-1">
                              {test.date}
                            </p>
                          </div>
                          <div className="flex items-center gap-3">
                            <span
                              className={`text-2xl font-extrabold ${
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
                  <div className="flex-grow flex items-center justify-center p-8">
                    <div className="text-center p-8 bg-gray-800 rounded-2xl shadow-inner border border-gray-700">
                      <h3 className="text-2xl font-bold text-white mb-3">
                        No Tests to Display
                      </h3>
                      <p className="text-gray-400 mb-6 text-lg">
                        You haven't taken any tests yet. Let's get started!
                      </p>
                      <Link
                        to="/homepage"
                        className="inline-block bg-indigo-600 text-white px-8 py-3 rounded-xl hover:bg-indigo-700 transition-all duration-300 text-lg font-semibold shadow-lg transform hover:scale-105"
                      >
                        Take Your First Test
                      </Link>
                    </div>
                  </div>
                )}

                <CardFooter className="border-t border-gray-700 pt-6 mt-6 flex justify-end">
                  <Link
                    to="/previous-tests"
                    className="text-indigo-400 hover:text-indigo-300 transition-colors duration-300 text-md font-medium flex items-center gap-2 group"
                  >
                    View all test history{" "}
                    <span className="group-hover:translate-x-1 transition-transform duration-200">
                      →
                    </span>
                  </Link>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
