import BackgroundBeamsWithCollision from "../ui/background-beams-with-collision";
import { useDarkMode } from "../Custom/DarkModeContext";
import React, { useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import TextGenerateEffect from "../ui/text-generate-effect";
import TypewriterEffect from "../ui/typewriter-effect";
import { auth } from "../../firebase/firebaseConfig";
import { signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const LandingPage: React.FC = () => {
  const { darkMode } = useDarkMode();
  const navigate = useNavigate();
  const provider = new GoogleAuthProvider();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) navigate("/homepage");
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const { displayName: name, email, photoURL: profilepic, uid } = result.user;

      try {
        await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/google`, {
          name, email, profilepic, firebaseUid: uid,
        });
        navigate("/homepage");
      } catch (error) {
        console.error("Error sending data:", error);
      }
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const GoogleLoginButton = ({ className = "" }) => (
    <button
      onClick={handleGoogleLogin}
      className={`relative inline-flex items-center justify-center transition-colors 
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 
        focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none
        ${className}`}
    >
      <div className="flex items-center">
        <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
        Login with Google
      </div>
    </button>
  );

  const features = [
    {
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
            </svg>,
      title: "Aptitude Training",
      description: "Practice with hundreds of aptitude questions organized by topic and difficulty.",
    },
    {
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
            </svg>,
      title: "AI-Powered Interviews",
      description: "Experience real-time face-to-face interviews with AI that adapts to your responses.",
    },
    {
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/>
            </svg>,
      title: "Personalized Feedback",
      description: "Receive detailed feedback and suggestions to improve your interview performance.",
    },
  ];

  useGSAP(() => {
    gsap.from("#box", { duration: 1, y: 5, repeat: -1, yoyo: true, ease: "sine.inOut" });
  }, []);
interface Props {
  words: string;
  className?: string;
}

const TextGenerateEffect: React.FC<Props> = ({ words, className }) => {
  return <p className={className}>{words}</p>;
};

  return (
    <div className={`min-h-screen flex flex-col w-full transition-colors duration-500 ${darkMode ? "bg-gray-900 text-gray-200" : "bg-white text-gray-900"}`}>
 <BackgroundBeamsWithCollision
  className={`relative flex-grow flex items-center min-h-[90vh] h-auto transition-colors duration-500 ${
    darkMode ? "from-gray-800 via-gray-900 to-black" : "bg-zinc-100 text-gray-900"
  }`}
>
  <div
    className={`absolute inset-0 bg-gradient-to-r transition-colors duration-500 ${
      darkMode ? "from-gray-800 via-gray-900 to-black" : "from-gray-100 via-gray-200 to-white"
    } -z-10`}
  ></div>

  <div className="container mx-auto px-4 py-20 md:py-32 mt-15 ">
    <div className="grid md:grid-cols-2 gap-12 items-center">
      {/* Left Content */}
      <div className="space-y-8">
        <TypewriterEffect
          className="text-4xl md:text-5xl lg:text-6xl font-bold text-indigo-500 leading-tight"
          words={[
            { text: "Ace" },
            { text: "Your" },
            { text: "Next" },
            { text: "Aptitude" },
            { text: "Test" },
            { text: "With" },
            { text: "AI-Powered" },
            { text: "Practice" },
          ]}
        />
        <TextGenerateEffect
          className={`text-2xl font-thin transition-colors duration-500 ${
            darkMode ? "text-gray-100" : "text-gray-700"
          }`}
          words="Master technical and aptitude questions while practicing real-time interviews with our AI assistant."
        />
        <div
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          onClick={handleGoogleLogin}
        >
          <GoogleLoginButton className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-6 rounded-lg text-lg cursor-pointer transition-colors duration-300" />
        </div>
      </div>

      {/* Right Content */}
      <div className="relative" id="box">
        <div
          className={`p-6 rounded-xl shadow-xl border transition-colors duration-500 ${
            darkMode ? "bg- border-gray-700" : "bg-white border-gray-200"
          }`}
        >
          <div className="mb-4 rounded-lg bg-indigo-600 p-4">
            <p className="font-medium text-white">Aptitude Test Session</p>
          </div>

          <div className="space-y-4 mb-4">
            <div
              className={`p-4 rounded-lg transition-colors duration-500 ${
                darkMode ? "bg-gray-700" : "bg-gray-100"
              }`}
            >
              <p className="font-medium text-indigo-300 mb-2">Question 3 of 10:</p>
              <p className={darkMode ? "text-gray-200" : "text-gray-900"}>
                If a train travels at a speed of 60 km/hr and crosses a platform in 30 seconds, what is the length of the platform?
              </p>
            </div>

            <div className="space-y-2">
              {["300 meters", "400 meters", "500 meters", "600 meters"].map((ans, idx) => (
                <div key={idx} className="flex items-center">
                  <div
                    className={`w-5 h-5 rounded-full border-2 mr-3 flex-shrink-0 transition-colors duration-300 ${
                      ans === "500 meters"
                        ? "border-indigo-500 bg-indigo-600"
                        : darkMode
                        ? "border-gray-500"
                        : "border-gray-400"
                    }`}
                  ></div>
                  <p
                    className={`${
                      ans === "500 meters"
                        ? "font-medium "
                        : darkMode
                        ? "text-gray-200"
                        : "text-gray-900"
                    }`}
                  >
                    {ans}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center">
            <button
              className={`cursor-pointer transition-colors duration-300 ${
                darkMode ? "text-indigo-300 hover:text-indigo-200" : "text-indigo-600 hover:text-indigo-500"
              }`}
            >
              Previous
            </button>
            <div className={darkMode ? "text-gray-400 text-xs" : "text-gray-500 text-xs"}>Time remaining: 1:45</div>
            <button
              className={`cursor-pointer font-medium transition-colors duration-300 ${
                darkMode ? "text-indigo-300 hover:text-indigo-200" : "text-indigo-600 hover:text-indigo-500"
              }`}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</BackgroundBeamsWithCollision>


  {/* Features Section */}
  <section id="features" className={`py-20 transition-colors duration-500 ${darkMode ? "bg-gray-900" : "bg-white"}`}>
    <div className="container mx-auto px-4">
      <div className="text-center mb-16">
        <h2 className={`text-3xl md:text-4xl font-bold mb-4 transition-colors duration-500 ${darkMode ? "text-gray-200" : "text-gray-800"}`}>Why Choose PrepBuddy?</h2>
        <p className={`text-lg max-w-2xl mx-auto transition-colors duration-500 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
          Our platform combines cutting-edge AI with proven interview techniques to help you land your dream job.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-10">
        {features.map((feature, index) => (
          <div key={index} className={`p-6 rounded-xl border shadow-lg hover:shadow-xl hover:scale-[1.03] transition-all duration-300 ease-in-out transform group transition-colors duration-500 ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
            <div className="mb-4 p-3 rounded-full bg-indigo-100 inline-block">{feature.icon}</div>
            <h3 className="text-xl font-semibold mb-3 group-hover:text-indigo-600 transition-colors duration-300">{feature.title}</h3>
            <p className={darkMode ? "text-gray-400" : "text-gray-600"}>{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  </section>

  {/* How It Works Section */}
  <section id="how-it-works" className={`py-20 transition-colors duration-500 ${darkMode ? "bg-gray-900" : "bg-zinc-100"}`}>
    <div className="container mx-auto px-4">
      <div className="text-center mb-16">
        <h2 className={`text-3xl md:text-4xl font-bold mb-4 transition-colors duration-500 ${darkMode ? "text-gray-200" : "text-gray-800"}`}>How It Works</h2>
        <p className={`text-lg max-w-2xl mx-auto transition-colors duration-500 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
          Get started in minutes and improve your interview skills today.
        </p>
      </div>

      <div className="max-w-3xl mx-auto space-y-8">
        {[{ step: "1", title: "Sign in with Google", description: "Quick and secure authentication with your Google account." },
          { step: "2", title: "Choose Your Focus Area", description: "Select from technical questions, aptitude training, or mock interviews." },
          { step: "3", title: "Practice and Get Feedback", description: "Engage in interactive sessions and receive instant AI-powered feedback." }].map((item, idx) => (
          <div key={idx} className="flex items-start">
            <div className="bg-indigo-600 text-white rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0 mt-1">{item.step}</div>
            <div className="ml-4">
              <h3 className={`text-xl font-semibold transition-colors duration-500 ${darkMode ? "text-gray-200" : "text-gray-900"}`}>{item.title}</h3>
              <p className={`transition-colors duration-500 ${darkMode ? "text-gray-400 mt-1" : "text-gray-600 mt-1"}`}>{item.description}</p>
            </div>
          </div>
        ))}
        <div className="mt-12 text-center">
          <GoogleLoginButton className="bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-8 rounded-lg text-lg cursor-pointer transition-colors duration-300" />
        </div>
      </div>
    </div>
  </section>
</div>

  );
};

export default LandingPage;
