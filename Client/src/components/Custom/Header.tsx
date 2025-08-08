import { useEffect, useState, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import * as React from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { auth } from "../../firebase/firebaseConfig";
import { onAuthStateChanged, signOut } from "firebase/auth";
import axios from "axios";
import { CgProfile } from "react-icons/cg";
import { TiHomeOutline } from "react-icons/ti";
import { FaRegStickyNote } from "react-icons/fa";
import { IoTrophyOutline, IoChatbubblesOutline } from "react-icons/io5"; // Import Chat icon
import { MdLogout } from "react-icons/md";
import { MdHistoryEdu } from "react-icons/md";
import ThemeToggle from "./ThemeToggle";
import QuestionOfTheDay from "./QuestionOfTheDay";

// Update props to accept the chat state setter
interface HeaderProps {
  setUserID: React.Dispatch<React.SetStateAction<string>>;
  setIsChatOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Header: React.FC<HeaderProps> = ({ setUserID, setIsChatOpen }) => {
  const location = useLocation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const [user, setUser] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [profilePic, setProfilePic] = useState("");
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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
      x: 50,
      stagger: 0,
    });
  });

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setEmail(currentUser?.email || "");
      if (!currentUser) {
        setUserID(""); // Clear user ID on logout
        navigate("/");
      }
    });
    return () => unsubscribe();
  }, [navigate, setUserID]);

  useEffect(() => {
    console.log("Trying to fetch user with email:", email);
    if (email) {
      const fetchData = async () => {
        try {

          const response = await axios.get(
            `${import.meta.env.VITE_API_BASE_URL}/register/getuser/${email}`,
            { withCredentials: true }
          );
          console.log("Fetched user:", response.data);

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
  }, [email, navigate, setUserID]);

  if (loading) {
    return (
      <div className="flex absolute top-0 justify-center items-center h-screen bg-gray-900 w-full z-50">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-transparent border-t-blue-500 border-b-blue-500 rounded-full animate-spin"></div>
          <p className="text-white mt-4 text-lg font-semibold">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {location.pathname === "/" ? (
        <div
          className={`sticky top-0 z-50 w-full backdrop-blur-xl bg-white/10 dark:bg-black/10 border-b border-white/10 dark:border-black/20 shadow-md transition-all duration-200`}
        >
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <Link to="/homepage" className="flex items-center">
              <h1 className="boxy text-2xl font-bold flex items-center justify-center gap-1">
                <img src="/icon.png" alt="icon" width={35} />
                <img src="/logo.png" alt="logo" width={150} />
              </h1>
            </Link>
            <div className="md:hidden">
              <button onClick={toggleMobileMenu} className="text-white focus:outline-none">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {isMobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
            <nav className="boxy hidden md:flex space-x-8 items-center font-bold">
              <ThemeToggle />
              <a href="#features" className="text-white hover:text-indigo-600 transition duration-300">Features</a>
              <a href="#how-it-works" className="text-white hover:text-indigo-600 transition duration-300">How It Works</a>
            </nav>
          </div>
          {isMobileMenuOpen && (
            <div className="md:hidden bg-white/5 dark:bg-black/5 backdrop-blur-md pb-4">
              <nav className="flex flex-col items-center space-y-4 font-bold">
                <ThemeToggle />
                <a href="#features" className="text-white hover:text-indigo-600 transition duration-300 w-full text-center py-2" onClick={toggleMobileMenu}>Features</a>
                <a href="#how-it-works" className="text-white hover:text-indigo-600 transition duration-300 w-full text-center py-2" onClick={toggleMobileMenu}>How It Works</a>
              </nav>
            </div>
          )}
        </div>
      ) : (
        <header className="shadow-md w-full">
          <div className="container mx-auto px-4 py-3 flex justify-between items-center">
            <Link to="/homepage" className="flex items-center">
              <h1 className="boxy text-2xl font-bold text-white flex items-center justify-center gap-1">
                <img src="/icon.png" alt="icon" width={35} />
                <img src="/logo.png" alt="logo" width={150} />
              </h1>
            </Link>

            
            <div className="relative" ref={dropdownRef}>
              <div className="flex items-center gap-2">
                 <ThemeToggle />
                <QuestionOfTheDay />
               
                <button
                  onClick={toggleDropdown}
                  className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded-full transition cursor-pointer text-white"
                >
                  {!profilePic ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-gray-500 rounded-full animate-pulse"></div>
                      <span className="w-20 h-4 bg-gray-500 rounded-md animate-pulse hidden sm:inline-block"></span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <img
                        src={profilePic}
                        alt="Profile Picture"
                        className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center overflow-hidden object-cover"
                      />
                      <span className="max-[430px]:hidden sm:inline-block text-white">{user}</span>
                    </div>
                  )}
                  <svg className={`h-4 w-4 transition-transform text-white ${isDropdownOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg z-10 text-white">
                  <div className="py-1">
                    <Link to="/profile" className={`flex px-4 py-2 text-sm hover:bg-gray-700 gap-1 items-center ${location.pathname === "/profile" ? "bg-gray-700" : ""}`} onClick={() => setIsDropdownOpen(false)}>
                      <CgProfile className="text-xl" /> My Profile
                    </Link>
                    <Link to="/homepage" className={`flex px-4 py-2 text-sm hover:bg-gray-700 gap-1 items-center ${location.pathname === "/homepage" ? "bg-gray-700" : ""}`} onClick={() => setIsDropdownOpen(false)}>
                      <TiHomeOutline className="text-xl" /> Homepage
                    </Link>
                    <Link to="/notes" className={`flex px-4 py-2 text-sm hover:bg-gray-700 gap-1 items-center ${location.pathname === "/notes" ? "bg-gray-700" : ""}`} onClick={() => setIsDropdownOpen(false)}>
                      <FaRegStickyNote className="text-xl" /> Notes
                    </Link>
                    <Link to="/previous-tests" className={`flex px-4 py-2 text-sm hover:bg-gray-700 gap-1 items-center ${location.pathname === "/previous-tests" ? "bg-gray-700" : ""}`} onClick={() => setIsDropdownOpen(false)}>
                      <MdHistoryEdu className="text-xl" /> Previous Tests
                    </Link>
                    <Link to="/score-board" className={`flex px-4 py-2 text-sm hover:bg-gray-700 gap-1 items-center ${location.pathname === "/score-board" ? "bg-gray-700" : ""}`} onClick={() => setIsDropdownOpen(false)}>
                      <IoTrophyOutline className="text-xl" /> Leader Board
                    </Link>
                    <Link to="/favorites" className={`flex px-4 py-2 text-sm hover:bg-gray-700 gap-1 items-center ${location.pathname === "/favorites" ? "bg-gray-700" : ""}`} onClick={() => setIsDropdownOpen(false)}>
                      <IoTrophyOutline className="text-xl" /> Favorites
                    </Link>
                    
                    {/* New Chat Option */}
                    <div
                      className="flex gap-1 w-full text-left px-4 py-2 text-sm hover:bg-gray-700 cursor-pointer"
                      onClick={() => {
                        setIsChatOpen(true);
                        setIsDropdownOpen(false);
                      }}
                    >
                      <IoChatbubblesOutline className="text-xl" /> Chat
                    </div>

                    <div
                      className="flex gap-1 w-full text-left px-4 py-2 text-sm hover:bg-gray-700 text-red-400 cursor-pointer"
                      onClick={() => {
                        setIsDropdownOpen(false);
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
