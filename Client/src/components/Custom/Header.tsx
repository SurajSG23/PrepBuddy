import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import React from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { auth } from "../../firebase/firebaseConfig";
import { onAuthStateChanged, signOut } from "firebase/auth";
import axios from "axios";
import { CgProfile } from "react-icons/cg";
import { TiHomeOutline } from "react-icons/ti";
import { FaRegNoteSticky } from "react-icons/fa6";
import { IoTrophyOutline } from "react-icons/io5";
import { MdLogout } from "react-icons/md";

interface HeaderProps {
  setUserID: React.Dispatch<React.SetStateAction<string>>;
}

const Header: React.FC<HeaderProps> = ({ setUserID }) => {
  const location = useLocation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const [user, setUser] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [profilePic, setProfilePic] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      setLoading(false);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  useGSAP(() => {
    gsap.from(".boxy", {
      opacity: 0,
      duration: 0.5,
      y: 50,
      stagger: 0.4,
    });
  });

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setEmail(currentUser?.email || "");
      setUserID("");
      if (!currentUser) {
        navigate("/");
      }
    });
    return () => unsubscribe();
  }, [auth, navigate]);


  useEffect(() => {
    setIsDropdownOpen(false);
    if (email) {
      const fetchData = async () => {
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_API_BASE_URL}/register/getuser/${email}`,
            { withCredentials: true }
          );
          setUserID(response.data._id || "");
          setUser(response.data.name || "");
          setProfilePic(response.data.profilepic || "");
          setEmail(response.data.email || "");
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };

      fetchData();
    }
  }, [email, navigate]);

  if (loading) {
    return (
      <>
        <div className="flex absolute top-0 justify-center items-center h-screen bg-gray-900 w-full z-99">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 border-4 border-transparent border-t-blue-500 border-b-blue-500 rounded-full animate-spin"></div>
            <p className="text-white mt-4 text-lg font-semibold">Loading...</p>
          </div>
        </div>
      </>
    );
  }
  return (
    <>
      {location.pathname === "/" ? (
        <div
          className={`sticky top-0 z-50 w-full transition-all duration-200 ${"bg-white shadow-md"} invert overflow-y-hidden`}
        >
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <Link to="/homepage" className="flex items-center">
              <h1 className="boxy text-2xl font-bold text-black invert flex items-center justify-center gap-1">
                <img src="icon.png" alt="icon" width={35} />
                <img src="logo.png" alt="logo" width={150} />
              </h1>
            </Link>
            <nav className="boxy hidden md:flex space-x-8 items-center">
              <a
                href="#features"
                className=" text-gray-800 hover:text-indigo-600 transition"
              >
                Features
              </a>
              <a
                href="#how-it-works"
                className="text-gray-800 hover:text-indigo-600 transition"
              >
                How It Works
              </a>
            </nav>
          </div>
        </div>
      ) : (
        <header className="bg-black shadow-md w-full">
          <div className="container mx-auto px-4 py-3 flex justify-between items-center">
            <Link to="/homepage" className="flex items-center">
              <h1 className="boxy text-2xl font-bold text-black flex items-center justify-center gap-1">
                <img src="icon.png" alt="icon" width={35} />
                <img src="logo.png" alt="logo" width={150} />
              </h1>
            </Link>

            <div className="relative">
              <button
                onClick={toggleDropdown}
                className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded-md transition cursor-pointer"
              >
                {!profilePic ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gray-500 rounded-full animate-pulse"></div>
                    <span className="w-20 h-4 bg-gray-500 rounded-md animate-pulse"></span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <img
                      src={profilePic || "default-profile.jpg"}
                      alt="Profile Picture"
                      className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center overflow-hidden"
                      onError={(e) =>
                        (e.currentTarget.src = "default-profile.jpg")
                      }
                    />
                    <span className="max-[430px]:hidden">{user}</span>
                  </div>
                )}

                <svg
                  className={`h-4 w-4 transition-transform ${
                    isDropdownOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg z-10">
                  <div className="py-1">
                    <Link
                      to="/profile"
                      className={`flex px-4 py-2 text-sm hover:bg-gray-700 gap-1 items-center ${
                        location.pathname === "/profile" ? "bg-gray-700" : ""
                      }`}
                    >
                      <CgProfile className="text-xl" /> My Profile
                    </Link>

                    <Link
                      to="/homepage"
                      className={`flex px-4 py-2 text-sm hover:bg-gray-700 gap-1 items-center ${
                        location.pathname === "/homepage" ? "bg-gray-700" : ""
                      }`}
                    >
                      <TiHomeOutline className="text-xl" /> Homepage
                    </Link>

                    <Link
                      to="/previous-tests"
                      className={`flex px-4 py-2 text-sm hover:bg-gray-700 gap-1 items-center ${
                        location.pathname === "/previous-tests"
                          ? "bg-gray-700"
                          : ""
                      }`}
                    >
                      <FaRegNoteSticky className="text-xl" /> Previous Tests
                    </Link>
                    <Link
                      to="/score-board"
                      className={`flex px-4 py-2 text-sm hover:bg-gray-700 gap-1 items-center ${
                        location.pathname === "/score-board"
                          ? "bg-gray-700"
                          : ""
                      }`}
                    >
                      <IoTrophyOutline className="text-xl" /> Leader Board
                    </Link>
                    <div
                      className="flex gap-1 w-full text-left px-4 py-2 text-sm hover:bg-gray-700 text-red-400 cursor-pointer"
                      onClick={() => {
                        setIsDropdownOpen(!isDropdownOpen);
                        handleLogout();
                      }}
                    >
                      <MdLogout className="text-xl" /> Logout
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>
      )}
    </>
  );
};

export default Header;
