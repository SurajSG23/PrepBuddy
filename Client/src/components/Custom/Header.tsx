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
import { useThemeSelector } from "../../store/hooks";

// Update props to accept the chat state setter
interface HeaderProps {
  setUserID: React.Dispatch<React.SetStateAction<string>>;
  setIsChatOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Header: React.FC<HeaderProps> = ({ setUserID, setIsChatOpen }) => {
  const darkMode = useThemeSelector((state) => state.theme.darkMode);
  const location = useLocation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const [user, setUser] = useState<string>("");
  const [profilePic, setProfilePic] = useState("");
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log(darkMode)
  })

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
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_API_BASE_URL}/auth/me`,
            { withCredentials: true }
          );
        
          const userData = response.data;
          setUserID(userData._id || "");
          setUser(userData.name || "");
          setProfilePic(userData.profilepic || "");
        } catch (error) {
          console.error("Could not fetch user profile:", error);
          handleLogout();
        }
      } else {
        setUserID("");
        navigate("/");
      }
    });

    return () => unsubscribe();
  }, [navigate, setUserID]); 

  if (loading) {
    return (
      <div className={`flex absolute top-0 justify-center items-center h-screen w-full z-50 transition-colors duration-200 ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
        <div className="flex flex-col items-center">
          <div className={`w-16 h-16 border-4 border-transparent rounded-full animate-spin ${darkMode ? 'border-t-blue-500 border-b-blue-500' : 'border-t-indigo-500 border-b-indigo-500'}`}></div>
          <p className={`mt-4 text-lg font-semibold animate-pulse ${darkMode ? 'text-white' : 'text-gray-900'}`}>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {location.pathname === "/" ? (
        <div
          className={`sticky top-0 z-50 w-full backdrop-blur-xl border-b shadow-md transition-all duration-200 ${darkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-gray-200'}`}
        >
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <Link to="/homepage" className="flex items-center">
              <h1 className={`boxy text-2xl font-bold flex items-center justify-center gap-1 ${darkMode ? 'text-white' : 'text-indigo-900'}`}>
                <img src="/icon.png" alt="icon" width={35} />
                <img src="/logo.png" alt="logo" width={150} />
              </h1>
            </Link>
            <div className="md:hidden">
              <button onClick={toggleMobileMenu} className={darkMode ? "text-white" : "text-indigo-900" + " focus:outline-none"}>
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
              <a
                href="#features"
                className={`transition duration-300 ${darkMode ? "text-white hover:text-indigo-400" : "text-indigo-700 hover:text-indigo-900"}`}
              >
                Features
              </a>
              <a
                href="#how-it-works"
                className={`transition duration-300 ${darkMode ? "text-white hover:text-indigo-400" : "text-indigo-700 hover:text-indigo-900"}`}
              >
                How It Works
              </a>
            </nav>
          </div>
          {isMobileMenuOpen && (
            <div className={`md:hidden backdrop-blur-md pb-4 ${darkMode ? 'bg-zinc-900/90' : 'bg-white/90'}`}>
              <nav className="flex flex-col items-center space-y-4 font-bold">
                <ThemeToggle />
                <a href="#features" className={darkMode ? "text-white hover:text-indigo-400" : "text-indigo-700 hover:text-indigo-900" + " transition duration-300 w-full text-center py-2"} onClick={toggleMobileMenu}>Features</a>
                <a href="#how-it-works" className={darkMode ? "text-white hover:text-indigo-400" : "text-indigo-700 hover:text-indigo-900" + " transition duration-300 w-full text-center py-2"} onClick={toggleMobileMenu}>How It Works</a>
              </nav>
            </div>
          )}
        </div>
      ) : (
        <header className={`shadow-md w-full ${darkMode ? 'bg-zinc-900 border-b border-zinc-800' : 'bg-white border-b border-gray-200'}`}>
          <div className="container mx-auto px-4 py-3 flex justify-between items-center">
            <Link to="/homepage" className="flex items-center">
              <h1 className={`boxy text-2xl font-bold flex items-center justify-center gap-1 ${darkMode ? 'text-white' : 'text-indigo-900'}`}>
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
                  className={`flex items-center space-x-2 px-3 py-2 rounded-full transition cursor-pointer border ${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-white border-gray-600' : 'bg-white hover:bg-gray-100 text-gray-900 border-gray-300'}`}
                >
                  {!profilePic ? (
                    <div className="flex items-center space-x-2">
                      <div className={`w-8 h-8 rounded-full animate-pulse ${darkMode ? 'bg-gray-500' : 'bg-gray-300'}`}></div>
                      <span className={`w-20 h-4 rounded-md animate-pulse hidden sm:inline-block ${darkMode ? 'bg-gray-500' : 'bg-gray-300'}`}></span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <img
                        src={profilePic}
                        alt="Profile Picture"
                        className={`w-8 h-8 rounded-full flex items-center justify-center overflow-hidden object-cover ${darkMode ? 'bg-indigo-500' : 'bg-indigo-300'}`}
                      />
                      <span className={`max-[430px]:hidden sm:inline-block ${darkMode ? 'text-white' : 'text-gray-900'}`}>{user}</span>
                    </div>
                  )}
                  <svg className={`h-4 w-4 transition-transform ${darkMode ? 'text-white' : 'text-gray-900'} ${isDropdownOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
              {isDropdownOpen && (
                <div className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg z-10 transition-colors duration-200 ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900 border border-gray-200'}`}>
                  <div className="py-1">
                    <Link to="/profile" className={`flex px-4 py-2 text-sm gap-1 items-center transition-colors duration-150 ${darkMode ? `hover:bg-gray-700 ${location.pathname === "/profile" ? "bg-gray-700" : ""}` : `hover:bg-gray-100 ${location.pathname === "/profile" ? "bg-gray-100" : ""}`}`} onClick={() => setIsDropdownOpen(false)}>
                      <CgProfile className="text-xl" /> My Profile
                    </Link>
                    <Link to="/homepage" className={`flex px-4 py-2 text-sm gap-1 items-center transition-colors duration-150 ${darkMode ? `hover:bg-gray-700 ${location.pathname === "/homepage" ? "bg-gray-700" : ""}` : `hover:bg-gray-100 ${location.pathname === "/homepage" ? "bg-gray-100" : ""}`}`} onClick={() => setIsDropdownOpen(false)}>
                      <TiHomeOutline className="text-xl" /> Homepage
                    </Link>
                    <Link to="/notes" className={`flex px-4 py-2 text-sm gap-1 items-center transition-colors duration-150 ${darkMode ? `hover:bg-gray-700 ${location.pathname === "/notes" ? "bg-gray-700" : ""}` : `hover:bg-gray-100 ${location.pathname === "/notes" ? "bg-gray-100" : ""}`}`} onClick={() => setIsDropdownOpen(false)}>
                      <FaRegStickyNote className="text-xl" /> Notes
                    </Link>
                    <Link to="/previous-tests" className={`flex px-4 py-2 text-sm gap-1 items-center transition-colors duration-150 ${darkMode ? `hover:bg-gray-700 ${location.pathname === "/previous-tests" ? "bg-gray-700" : ""}` : `hover:bg-gray-100 ${location.pathname === "/previous-tests" ? "bg-gray-100" : ""}`}`} onClick={() => setIsDropdownOpen(false)}>
                      <MdHistoryEdu className="text-xl" /> Previous Tests
                    </Link>
                    <Link to="/score-board" className={`flex px-4 py-2 text-sm gap-1 items-center transition-colors duration-150 ${darkMode ? `hover:bg-gray-700 ${location.pathname === "/score-board" ? "bg-gray-700" : ""}` : `hover:bg-gray-100 ${location.pathname === "/score-board" ? "bg-gray-100" : ""}`}`} onClick={() => setIsDropdownOpen(false)}>
                      <IoTrophyOutline className="text-xl" /> Leader Board
                    </Link>
                    <Link to="/favorites" className={`flex px-4 py-2 text-sm gap-1 items-center transition-colors duration-150 ${darkMode ? `hover:bg-gray-700 ${location.pathname === "/favorites" ? "bg-gray-700" : ""}` : `hover:bg-gray-100 ${location.pathname === "/favorites" ? "bg-gray-100" : ""}`}`} onClick={() => setIsDropdownOpen(false)}>
                      <IoTrophyOutline className="text-xl" /> Favorites
                    </Link>

                    {/* New Chat Option */}
                    <div
                      className={`flex gap-1 w-full text-left px-4 py-2 text-sm cursor-pointer transition-colors duration-150 ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                      onClick={() => {
                        setIsChatOpen(true);
                        setIsDropdownOpen(false);
                      }}
                    >
                      <IoChatbubblesOutline className="text-xl" /> Chat
                    </div>

                    <div
                      className={`flex gap-1 w-full text-left px-4 py-2 text-sm text-red-400 cursor-pointer transition-colors duration-150 ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
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
