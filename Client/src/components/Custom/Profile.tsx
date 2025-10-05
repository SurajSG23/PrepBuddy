import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import ProgressDashboard from "./ProgressDashboard";
import StreakBadges from "./StreakBadges";
import QODStatsCard from "./QODStatsCard";
import axios from "axios";
import { FaLock, FaRegEdit } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useDarkMode } from "../Custom/DarkModeContext";

interface ProfileProps {
  userID: string;
}

const userProfileData = {
  testsAttended: 12,
  totalPoints: 875,
  rank: 5,
  recentTests: [] as { name: string; score: number; date: string }[],
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

const Profile: React.FC<ProfileProps> = ({ userID }) => {
  const { darkMode } = useDarkMode();

  const [user, setUser] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [profilePic, setProfilePic] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [confirmation, setConfirmation] = useState<boolean>(false); // change name modal
  const [confirmation2, setConfirmation2] = useState<boolean>(false); // upload avatar modal
  const [deleteConfirmation, setDeleteConfirmation] = useState<boolean>(false);
  const [newName, setNewName] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [currentStreak, setCurrentStreak] = useState<number>(0);

  const navigate = useNavigate();

  useEffect(() => {
    // fetch user data
    async function fetchData() {
      setLoading(true);
      try {
        if (!userID) {
          setLoading(false);
          return;
        }
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
        userProfileData.recentTests = response2.data.map((test: any) => ({
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

        const streakResponse = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/progress/streak/${userID}`,
          { withCredentials: true }
        );
        setCurrentStreak(streakResponse.data.currentStreak || 0);
      } catch (err) {
        console.error("Error fetching profile data:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [userID]);

  // change display name
  const changeName = async () => {
    if (!newName.trim() || !userID) return;
    try {
      setLoading(true);
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/register/updateName`,
        { id: userID, name: newName },
        { withCredentials: true }
      );
      setUser(newName);
      setNewName("");
    } catch (err) {
      console.error("Error updating name:", err);
    } finally {
      setLoading(false);
    }
  };

  // upload avatar
  const handleUpload = async () => {
    if (!selectedFile || !userID) return;
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("image", selectedFile);
      formData.append("id", userID);
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/register/uploadProfilePic`,
        formData,
        { withCredentials: true }
      );
      setProfilePic(res.data.profilepic || "");
      setSelectedFile(null);
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setLoading(false);
    }
  };

  // delete account
  const handleDeleteAccount = async () => {
    if (!userID) return;
    try {
      setLoading(true);
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/register/deleteAccount`,
        { id: userID },
        { withCredentials: true }
      );
      // after delete redirect to landing or login
      navigate("/");
    } catch (err) {
      console.error("Error deleting account:", err);
    } finally {
      setLoading(false);
    }
  };

  // ---------- UI RENDERING ----------
  // Loading overlay
  if (loading) {
    return (
      <>
        <div
          className={`flex absolute top-0 justify-center items-center h-screen w-full z-[99] backdrop-blur-md transition-colors duration-300 ${
            darkMode ? "bg-gray-900/80" : "bg-white/70"
          }`}
        >
          <div className="flex flex-col items-center animate-fadeIn">
            <div
              className={`w-16 h-16 border-4 border-transparent rounded-full animate-spin shadow-xl ${
                darkMode
                  ? "border-t-indigo-500 border-b-indigo-500"
                  : "border-t-indigo-600 border-b-indigo-600"
              }`}
            ></div>
            <p className={`${darkMode ? "text-white" : "text-gray-800"} mt-4 text-lg font-semibold animate-pulse`}>
              Loading Profile...
            </p>
          </div>
        </div>
      </>
    );
  }

  // Change name modal
  if (confirmation) {
    return (
      <div
        className={`flex absolute top-0 justify-center items-center h-screen w-full z-50 backdrop-blur-md transition-colors duration-300 ${
          darkMode ? "bg-black/60" : "bg-white/60"
        }`}
      >
        <div
          className={`rounded-2xl shadow-2xl p-8 w-[90%] max-w-md text-center flex flex-col gap-6 animate-fadeIn transition-colors duration-300 ${
            darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
          }`}
        >
          <h1 className={`text-2xl font-bold mb-2 ${darkMode ? "text-indigo-300" : "text-indigo-600"}`}>
            Change Your Display Name
          </h1>

          <div className="flex justify-center items-center my-4">
            <input
              value={newName}
              type="text"
              name="newName"
              id="newName"
              placeholder="Enter your new name"
              className={`w-2/3 px-4 py-2 rounded-md focus:outline-none focus:ring-2 transition-all duration-200 ${
                darkMode
                  ? "border border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:ring-indigo-400"
                  : "border border-gray-300 bg-gray-50 text-gray-900 placeholder-gray-500 focus:ring-indigo-500"
              }`}
              onChange={(e) => setNewName(e.target.value)}
            />
          </div>

          <div className="flex justify-center gap-8">
            <button
              onClick={() => setConfirmation(false)}
              className={`px-5 py-2 rounded-lg font-medium transition-transform duration-150 shadow-md w-36 ${
                darkMode
                  ? "bg-red-600 hover:bg-red-700 text-white"
                  : "bg-red-500 hover:bg-red-600 text-white"
              }`}
            >
              Cancel
            </button>

            <button
              onClick={() => {
                changeName();
                setConfirmation(false);
              }}
              className={`px-5 py-2 rounded-lg font-medium transition-transform duration-150 shadow-md w-36 ${
                darkMode
                  ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                  : "bg-indigo-600 hover:bg-indigo-700 text-white"
              }`}
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Upload avatar modal
  if (confirmation2) {
    return (
      <div
        className={`flex absolute top-0 justify-center items-center h-screen w-full z-50 backdrop-blur-md transition-colors duration-300 ${
          darkMode ? "bg-black/60" : "bg-white/60"
        }`}
      >
        <div
          className={`rounded-2xl shadow-2xl p-8 w-[90%] max-w-md text-center flex flex-col gap-6 animate-fadeIn transition-colors duration-300 ${
            darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
          }`}
        >
          <h1 className={`text-2xl font-bold mb-2 ${darkMode ? "text-indigo-300" : "text-indigo-600"}`}>Change Your Avatar</h1>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (selectedFile) {
                handleUpload();
                setConfirmation2(false);
              }
            }}
            className="flex flex-col gap-6 justify-center items-center my-4 w-full"
          >
            <input
              type="file"
              className={`w-full cursor-pointer px-4 py-2 rounded-md transition-colors duration-200 ${
                darkMode
                  ? "border border-gray-600 bg-gray-700 text-white"
                  : "border border-gray-300 bg-white text-gray-900"
              }`}
              onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
              required
            />

            <div className="flex justify-center gap-4 w-full">
              <button
                type="button"
                onClick={() => setConfirmation2(false)}
                className={`px-4 py-2 rounded-lg font-medium transition-transform duration-150 shadow-md w-1/2 ${
                  darkMode ? "bg-gray-600 hover:bg-gray-700 text-white" : "bg-gray-200 hover:bg-gray-300 text-gray-900"
                }`}
              >
                Cancel
              </button>

              <button
                type="submit"
                className={`px-4 py-2 rounded-lg font-medium transition-transform duration-150 shadow-md w-1/2 ${
                  darkMode ? "bg-indigo-600 hover:bg-indigo-700 text-white" : "bg-indigo-600 hover:bg-indigo-700 text-white"
                }`}
              >
                Confirm
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // Delete confirmation modal
  if (deleteConfirmation) {
    return (
      <div
        className={`flex absolute top-0 justify-center items-center h-screen w-full z-50 backdrop-blur-md transition-colors duration-300 ${
          darkMode ? "bg-black/60" : "bg-white/60"
        }`}
      >
        <div
          className={`rounded-2xl shadow-2xl p-8 w-[90%] max-w-md text-center flex flex-col gap-6 animate-fadeIn transition-colors duration-300 ${
            darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
          }`}
        >
          <h1 className={`text-2xl font-bold mb-2 ${darkMode ? "text-red-400" : "text-red-600"}`}>Delete Account</h1>
          <p className={`mb-4 leading-relaxed ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
            Are you sure you want to{" "}
            <span className={`${darkMode ? "text-red-400 font-semibold" : "text-red-600 font-semibold"}`}>delete your account</span>?
            <br />
            This action is <span className={`${darkMode ? "font-bold text-white" : "font-bold text-gray-900"}`}>irreversible</span> and will remove all your data.
          </p>

          <div className="flex justify-center gap-4 w-full">
            <button
              onClick={() => setDeleteConfirmation(false)}
              className={`px-4 py-2 rounded-lg font-medium transition-transform duration-150 shadow-md w-1/2 ${
                darkMode ? "bg-gray-600 hover:bg-gray-700 text-white" : "bg-gray-200 hover:bg-gray-300 text-gray-900"
              }`}
            >
              Cancel
            </button>

            <button
              onClick={handleDeleteAccount}
              className={`px-4 py-2 rounded-lg font-medium transition-transform duration-150 shadow-md w-1/2 ${
                darkMode ? "bg-red-600 hover:bg-red-700 text-white" : "bg-red-600 hover:bg-red-700 text-white"
              }`}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Main Profile Page (no modals)
  return (
    <div
      className={`min-h-screen w-full transition-colors duration-300 ${
        darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"
      }`}
    >
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Profile Card */}
          <div
            className={`rounded-lg p-6 shadow-lg mb-8 flex flex-col md:flex-row items-center gap-6 transition-colors duration-300 ${
              darkMode ? "bg-gray-800 border border-gray-700" : "bg-gray-50 border border-gray-200"
            }`}
          >
            <Avatar className="h-32 w-32 border-2 border-indigo-500 relative group">
              <AvatarImage src={profilePic || ""} alt={user || "User"} />
              <AvatarFallback className={`${darkMode ? "bg-indigo-600 text-white" : "bg-indigo-100 text-gray-800"} text-xl`}>
                {user ? user.charAt(0).toUpperCase() : "U"}
              </AvatarFallback>

              <div
                className={`absolute inset-0 rounded-full flex justify-center items-center transition-opacity duration-300 cursor-pointer ${
                  darkMode ? "bg-black/50 opacity-0 group-hover:opacity-100" : "bg-white/40 opacity-0 group-hover:opacity-100"
                }`}
                onClick={() => setConfirmation2(true)}
                title="Change avatar"
              >
                <FaRegEdit className={`${darkMode ? "text-white" : "text-gray-900"} text-3xl`} />
              </div>
            </Avatar>

            <div className="flex-1 text-center md:text-left">
              {!user ? (
                <div className="flex flex-col gap-3">
                  <div className={`${darkMode ? "bg-gray-700" : "bg-gray-300"} w-28 h-8 rounded-full animate-pulse`} />
                  <div className={`${darkMode ? "bg-gray-700" : "bg-gray-300"} w-40 h-4 rounded-full animate-pulse`} />
                </div>
              ) : (
                <>
                  <span className="flex items-center gap-2 justify-center md:justify-start">
                    <h2 className={`${darkMode ? "text-indigo-300" : "text-indigo-600"} text-2xl font-bold`}>{user}</h2>
                    <FaRegEdit
                      className={`text-xl opacity-30 cursor-pointer hover:opacity-100 transition duration-300 ${darkMode ? "hover:text-indigo-300" : "hover:text-indigo-600"}`}
                      title="Change display name"
                      onClick={() => setConfirmation(true)}
                    />
                  </span>
                  <p className={`${darkMode ? "text-gray-300" : "text-gray-600"} mt-1`}>{email}</p>
                </>
              )}

              <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-4">
                <div className={`px-6 py-3 rounded-xl flex flex-col items-center ${darkMode ? "bg-gray-700" : "bg-gray-100"}`}>
                  <span className="text-xl font-bold">{userProfileData.testsAttended}</span>
                  <span className={`${darkMode ? "text-gray-300" : "text-gray-600"} text-sm`}>Tests Attended</span>
                </div>

                <div className={`px-4 py-2 rounded-lg flex flex-col items-center ${darkMode ? "bg-gray-700" : "bg-gray-100"}`}>
                  <span className={`${darkMode ? "text-indigo-300" : "text-indigo-600"} text-2xl font-bold`}>{userProfileData.totalPoints}</span>
                  <span className={`${darkMode ? "text-gray-300" : "text-gray-600"} text-sm`}>Total Points</span>
                </div>

                <div className={`px-4 py-2 rounded-lg flex flex-col items-center ${darkMode ? "bg-gray-700" : "bg-gray-100"}`}>
                  <span className={`${darkMode ? "text-indigo-300" : "text-indigo-600"} text-2xl font-bold`}>#{userProfileData.rank}</span>
                  <span className={`${darkMode ? "text-gray-300" : "text-gray-600"} text-sm`}>Leader Board Rank</span>
                </div>
              </div>
            </div>
          </div>

          {/* Progress Dashboard */}
          <div className="mb-8">
            <ProgressDashboard userID={userID} />
          </div>

          {/* Streak Badges */}
          <div className="mb-8">
            <StreakBadges userID={userID} currentStreak={currentStreak} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 flex flex-col gap-8">
              <Card className={`${darkMode ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-200"} shadow-lg hover:shadow-indigo-500/20 transition`}>
                <CardHeader>
                  <CardTitle className={`${darkMode ? "text-indigo-300" : "text-indigo-600"} text-xl`}>Recent Tests</CardTitle>
                  <CardDescription className={`${darkMode ? "text-gray-300" : "text-gray-600"}`}>Your latest test performances</CardDescription>
                </CardHeader>

                {userProfileData.recentTests.length > 0 ? (
                  <CardContent>
                    <div className="space-y-4">
                      {userProfileData.recentTests.map((test, index) => (
                        <div key={index} className={`${darkMode ? "bg-gray-700" : "bg-gray-50"} rounded-lg p-4 flex justify-between items-center transition`}>
                          <div>
                            <h4 className={`${darkMode ? "text-white" : "text-gray-900"} font-medium`}>{test.name}</h4>
                            <p className={`${darkMode ? "text-gray-300" : "text-gray-500"} text-sm`}>{test.date}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-lg font-bold ${
                                test.score * 10 >= 90 ? "text-green-400" : test.score * 10 >= 70 ? "text-yellow-400" : "text-red-400"
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
                  <CardContent>
                    <div className={`${darkMode ? "bg-gray-700" : "bg-gray-50"} text-center p-6 rounded-lg`}>
                      <h3 className={`${darkMode ? "text-white" : "text-gray-900"} text-xl font-semibold mb-2`}>No Tests to Display</h3>
                      <p className={`${darkMode ? "text-gray-300" : "text-gray-600"} mb-4`}>You haven't taken any tests yet.</p>
                      <Link to="/homepage" className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md transition">Take Your First Test</Link>
                    </div>
                  </CardContent>
                )}

                <CardFooter className={`pt-4 border-t ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
                  <Link to="/previous-tests" className={`${darkMode ? "text-indigo-300" : "text-indigo-600"} text-sm`}>View all test history →</Link>
                </CardFooter>
              </Card>

              {/* Delete Account Card */}
              <Card className={`${darkMode ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-200"} shadow-lg transition`}>
                <CardHeader>
                  <CardTitle className={`${darkMode ? "text-red-400" : "text-red-600"} text-xl`}>Delete Account</CardTitle>
                  <CardDescription className={`${darkMode ? "text-gray-300" : "text-gray-600"}`}>Permanently remove your account and all data.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center gap-6">
                    <p className={`${darkMode ? "text-gray-300" : "text-gray-700"} text-center`}>
                      This action is <span className={`${darkMode ? "text-red-400 font-semibold" : "text-red-600 font-semibold"}`}>irreversible</span>. All your data will be deleted.
                    </p>
                    <button
                      onClick={() => setDeleteConfirmation(true)}
                      className={`px-5 py-2 rounded-lg font-medium transition shadow-md ${darkMode ? "bg-red-600 hover:bg-red-700 text-white" : "bg-red-600 hover:bg-red-700 text-white"}`}
                    >
                      Delete Account
                    </button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card className={`${darkMode ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-200"} shadow-lg transition`}>
                <CardHeader>
                  <CardTitle className={`${darkMode ? "text-indigo-300" : "text-indigo-600"} text-xl`}>Badges</CardTitle>
                  <CardDescription className={`${darkMode ? "text-gray-300" : "text-gray-600"}`}>Achievements you've earned</CardDescription>
                </CardHeader>

                <CardContent>
                  <div className="space-y-4">
                    {userProfileData.badges.map((badge) => (
                      <React.Fragment key={badge.id}>
                        <p className={`${darkMode ? "text-xs text-gray-400 italic text-center" : "text-xs text-gray-500 italic text-center"}`}>
                          {badge.description}
                        </p>

                        <div className={`${darkMode ? "bg-gray-700" : "bg-gray-50"} rounded-lg p-3 flex items-center gap-4 relative overflow-hidden transition transform hover:scale-[1.02]`}>
                          <div className="h-14 w-14 rounded-full flex items-center justify-center bg-gray-600 border-2 border-indigo-500 overflow-hidden">
                            <img src={`${badge.img}`} alt={badge.name} className="h-full w-full object-cover" />
                          </div>

                          <div>
                            <h4 className={`${darkMode ? "text-white" : "text-gray-900"} font-semibold`}>{badge.name}</h4>
                          </div>

                          {!badge.achieved && (
                            <div className="absolute inset-0 bg-black/80 flex justify-center items-center">
                              <FaLock className="text-indigo-500 text-3xl animate-pulse" />
                            </div>
                          )}
                        </div>
                      </React.Fragment>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <div className="mt-6">
                <QODStatsCard />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
