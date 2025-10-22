import BackgroundBeamsWithCollision from "../ui/background-beams-with-collision";
import { useDarkMode } from "../Custom/DarkModeContext";
import React, { useEffect } from "react";

import {
  Users,
  Target,
  Lightbulb,
  Award,
  ArrowRight,
  Star,
  BookOpen,
  Brain,
  Zap,
} from "lucide-react";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import TypewriterEffect from "../ui/typewriter-effect";
import { auth } from "../../firebase/firebaseConfig";
import {
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const LandingPage: React.FC = () => {
  const { darkMode } = useDarkMode();
  const navigate = useNavigate();
  const provider = new GoogleAuthProvider();
  const values = [
    {
      icon: <Target className="w-8 h-8" />,
      title: "Mission-Driven",
      description:
        "Democratizing interview preparation through cutting-edge AI technology",
    },
    {
      icon: <Lightbulb className="w-8 h-8" />,
      title: "Innovation First",
      description:
        "Continuously evolving our AI to provide the most realistic practice experience",
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Student-Centric",
      description:
        "Every feature is designed with student success and learning outcomes in mind",
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "Excellence",
      description:
        "Maintaining the highest standards in AI training and educational content",
    },
  ];

  const stats = [
    { number: "50K+", label: "Students Trained" },
    { number: "95%", label: "Success Rate" },
    { number: "500+", label: "Companies Hiring" },
    { number: "24/7", label: "AI Support" },
  ];
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) navigate("/homepage");
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const {
        displayName: name,
        email,
        photoURL: profilepic,
        uid,
      } = result.user;

      try {
        await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/google`, {
          name,
          email,
          profilepic,
          firebaseUid: uid,
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
        <svg
          className="mr-2 h-5 w-5"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            fill="#4285F4"
          />
          <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
          />
          <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            fill="#FBBC05"
          />
          <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#EA4335"
          />
        </svg>
        Login with Google
      </div>
    </button>
  );

  const features = [
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-indigo-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
          />
        </svg>
      ),
      title: "Aptitude Training",
      description:
        "Practice with hundreds of aptitude questions organized by topic and difficulty.",
    },
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-indigo-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      ),
      title: "AI-Powered Interviews",
      description:
        "Experience real-time face-to-face interviews with AI that adapts to your responses.",
    },
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-indigo-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
          />
        </svg>
      ),
      title: "Personalized Feedback",
      description:
        "Receive detailed feedback and suggestions to improve your interview performance.",
    },
  ];

  useGSAP(() => {
    gsap.from("#box", {
      duration: 1,
      y: 5,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });
  }, []);
  interface Props {
    words: string;
    className?: string;
  }

  const TextGenerateEffect: React.FC<Props> = ({ words, className }) => {
    return <p className={className}>{words}</p>;
  };

  return (
    <div className="min-h-screen flex flex-col w-full">
      <BackgroundBeamsWithCollision
        className={`flex-grow flex items-center  min-h-[90vh] h-auto ${
          darkMode ? "bg-gray-950" : "bg-gray-50"
        }`}
      >
        <div className="absolute top-0 left-0 right-0 bottom-0 opacity-100 inset-0 z-77"></div>
        <div className="container mx-auto px-4 py-20 md:py-32 mt-1">
          <div className="grid md:grid-cols-2 gap-14 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <TypewriterEffect
                className={`text-3xl md:text-4xl lg:text-5xl font-bold leading-tight ${
                  darkMode ? "text-gray-100" : "text-indigo-500"
                }`}
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
                className={`text-lg sm:text-xl lg:text-2xl text-center font-thin transition-colors duration-500 ${
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
                  <p className="font-medium text-white">
                    Aptitude Test Session
                  </p>
                </div>

                <div className="space-y-4 mb-4">
                  <div
                    className={`p-4 rounded-lg transition-colors duration-500 ${
                      darkMode ? "bg-gray-700" : "bg-gray-100"
                    }`}
                  >
                    <p className="font-medium text-indigo-300 mb-2">
                      Question 3 of 10:
                    </p>
                    <p className={darkMode ? "text-gray-200" : "text-gray-900"}>
                      If a train travels at a speed of 60 km/hr and crosses a
                      platform in 30 seconds, what is the length of the
                      platform?
                    </p>
                  </div>

                  <div className="space-y-2">
                    {[
                      "300 meters",
                      "400 meters",
                      "500 meters",
                      "600 meters",
                    ].map((ans, idx) => (
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
                      darkMode
                        ? "text-indigo-300 hover:text-indigo-200"
                        : "text-indigo-600 hover:text-indigo-500"
                    }`}
                  >
                    Previous
                  </button>
                  <div
                    className={
                      darkMode
                        ? "text-gray-400 text-xs"
                        : "text-gray-500 text-xs"
                    }
                  >
                    Time remaining: 1:45
                  </div>
                  <button
                    className={`cursor-pointer font-medium transition-colors duration-300 ${
                      darkMode
                        ? "text-indigo-300 hover:text-indigo-200"
                        : "text-indigo-600 hover:text-indigo-500"
                    }`}
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>{" "}
        {/**container */}
      </BackgroundBeamsWithCollision>

      {/* Features Section */}
      <section
        id="features"
        className={`py-20 transition-colors duration-500 ${
          darkMode ? "bg-gray-900" : "bg-white"
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2
              className={`text-3xl md:text-4xl font-bold mb-4 transition-colors duration-500 ${
                darkMode ? "text-gray-200" : "text-gray-800"
              }`}
            >
              Why Choose PrepBuddy?
            </h2>
            <p
              className={`text-lg max-w-2xl mx-auto transition-colors duration-500 ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Our platform combines cutting-edge AI with proven interview
              techniques to help you land your dream job.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`p-6 rounded-xl border shadow-lg hover:shadow-xl hover:scale-[1.03] transition-all duration-300 ease-in-out transform group transition-colors duration-500 ${
                  darkMode
                    ? "bg-gray-800 border-gray-700"
                    : "bg-white border-gray-200"
                }`}
              >
                <div className="mb-4 p-3 rounded-full bg-indigo-100 inline-block">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3 group-hover:text-indigo-600 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className={darkMode ? "text-gray-400" : "text-gray-600"}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced About Us Section */}
      <div
        className={`min-h-screen transition-colors duration-500 ${
          darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"
        }`}
      >
        {/* Hero Section */}
        <section className="relative overflow-hidden py-20 px-6">
          <div
            className={`absolute inset-0 ${
              darkMode
                ? "bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-gray-900"
                : "bg-gradient-to-br from-blue-100/40 via-purple-100/40 to-gray-100"
            }`}
          ></div>
          <div className="relative max-w-6xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-blue-600 bg-clip-text text-transparent">
                About PrepBuddy
              </span>
            </h1>
            <p
              className={`text-xl md:text-2xl max-w-4xl mx-auto leading-relaxed ${
                darkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              We're on a mission to revolutionize interview preparation through
              artificial intelligence, making world-class training accessible to
              every aspiring professional.
            </p>

            {/* Stats Section */}
            <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                    {stat.number}
                  </div>
                  <div
                    className={`mt-2 ${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-20 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                  Our Story
                </h2>
                <div
                  className={`space-y-6 text-lg ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  <p>
                    PrepBuddy was born from a simple observation: too many
                    talented individuals were missing out on dream opportunities
                    simply because they weren't prepared for the interview
                    process.
                  </p>
                  <p>
                    Founded in 2024 by a team of former tech executives and AI
                    researchers, we set out to democratize access to
                    high-quality interview preparation. Our founders experienced
                    firsthand the challenges of traditional prep methods -
                    expensive courses, limited availability, and
                    one-size-fits-all approaches.
                  </p>
                  <p>
                    Today, PrepBuddy combines cutting-edge artificial
                    intelligence with proven educational methodologies to create
                    personalized, adaptive learning experiences that scale to
                    millions of users worldwide.
                  </p>
                </div>
              </div>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur-3xl"></div>
                <div
                  className={`relative backdrop-blur-sm rounded-2xl p-8 border transition-colors duration-500 ${
                    darkMode
                      ? "bg-gray-800/50 border-gray-700"
                      : "bg-white/80 border-gray-300"
                  }`}
                >
                  <div className="grid grid-cols-3 gap-6">
                    <div className="text-center">
                      <Brain className="w-12 h-12 mx-auto mb-4 text-blue-400" />
                      <div
                        className={`text-sm ${
                          darkMode ? "text-gray-300" : "text-gray-600"
                        }`}
                      >
                        AI-Powered
                      </div>
                    </div>
                    <div className="text-center">
                      <Zap className="w-12 h-12 mx-auto mb-4 text-purple-400" />
                      <div
                        className={`text-sm ${
                          darkMode ? "text-gray-300" : "text-gray-600"
                        }`}
                      >
                        Real-time
                      </div>
                    </div>
                    <div className="text-center">
                      <Star className="w-12 h-12 mx-auto mb-4 text-yellow-400" />
                      <div
                        className={`text-sm ${
                          darkMode ? "text-gray-300" : "text-gray-600"
                        }`}
                      >
                        Personalized
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section
          className={`py-20 px-6 transition-colors duration-500 ${
            darkMode ? "bg-gray-800/30" : "bg-gray-50"
          }`}
        >
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                Our Values
              </h2>
              <p
                className={`text-xl max-w-3xl mx-auto ${
                  darkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                The principles that guide everything we do at PrepBuddy
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <div key={index} className="text-center group">
                  <div
                    className={`mb-6 inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl border group-hover:from-blue-500/30 group-hover:to-purple-500/30 transition-all duration-300 ${
                      darkMode ? "border-gray-700" : "border-gray-300"
                    }`}
                  >
                    <div className="text-blue-400 group-hover:scale-110 transition-transform duration-300">
                      {value.icon}
                    </div>
                  </div>
                  <h3
                    className={`text-xl font-semibold mb-3 ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {value.title}
                  </h3>
                  <p className={darkMode ? "text-gray-300" : "text-gray-600"}>
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section
          className={`py-20 px-6 transition-colors duration-500 ${
            darkMode
              ? "bg-gradient-to-r from-blue-900/30 to-purple-900/30"
              : "bg-gradient-to-r from-blue-100/50 to-purple-100/50"
          }`}
        >
          <div className="max-w-4xl mx-auto text-center">
            <h2
              className={`text-4xl font-bold mb-6 ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Ready to Transform Your Interview Game?
            </h2>
            <p
              className={`text-xl mb-8 max-w-2xl mx-auto ${
                darkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Join thousands of successful candidates who've aced their
              interviews with PrepBuddy's AI-powered training.
            </p>
            <button className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105">
              <span>Get Started Today</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </section>
      </div>

      {/* How It Works Section */}
<section
  id="how-it-works"
  className={`py-24 transition-colors duration-500 ${
    darkMode ? "bg-gray-900" : "bg-zinc-50"
  }`}
>
  <div className="container mx-auto px-4">
    {/* Header */}
    <div className="text-center mb-20">
      <h2
        className={`text-3xl md:text-4xl font-extrabold mb-4 transition-colors duration-500 ${
          darkMode ? "text-white" : "text-gray-900"
        }`}
      >
        How It Works
      </h2>
      <p
        className={`text-lg max-w-2xl mx-auto transition-colors duration-500 ${
          darkMode ? "text-gray-400" : "text-gray-600"
        }`}
      >
        Get started in minutes and improve your interview skills with guided practice and instant feedback.
      </p>
    </div>

    {/* Steps */}
    <div className="max-w-3xl mx-auto space-y-10">
      {[
        {
          step: "1",
          title: "Sign in with Google",
          description:
            "Quick and secure authentication with your Google account.",
        },
        {
          step: "2",
          title: "Choose Your Focus Area",
          description:
            "Select from technical questions, aptitude training, or mock interviews.",
        },
        {
          step: "3",
          title: "Practice and Get Feedback",
          description:
            "Engage in interactive sessions and receive instant AI-powered feedback.",
        },
      ].map((item, idx) => (
        <div
          key={idx}
          className={`flex items-start p-5 rounded-xl transition-all duration-300 transform hover:scale-[1.025] hover:shadow-xl cursor-pointer ${
            darkMode ? "bg-gray-800 hover:bg-gray-700" : "bg-white hover:bg-gray-100"
          }`}
        >
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-indigo-600 text-white rounded-full flex items-center justify-center text-lg font-bold shadow-md">
              {item.step}
            </div>
          </div>
          <div className="ml-5">
            <h3
              className={`text-xl font-semibold mb-1 transition-colors duration-500 ${
                darkMode ? "text-gray-100" : "text-gray-800"
              }`}
            >
              {item.title}
            </h3>
            <p
              className={`text-base transition-colors duration-500 ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              {item.description}
            </p>
          </div>
        </div>
      ))}

      {/* CTA Button */}
      <div className="mt-16 text-center">
        <GoogleLoginButton className="bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-8 rounded-lg text-lg shadow-md transition-all duration-300" />
      </div>
    </div>
  </div>
</section>

    </div>
  );
};

export default LandingPage;
