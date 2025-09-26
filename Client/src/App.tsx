import "./App.css";
import { Routes, Route } from "react-router-dom";
import { useState } from "react";
import Header from "./components/Custom/Header";
import Footer from "./components/Custom/Footer";
import LandingPage from "./components/Custom/LandingPage";
import HomePage from "./components/Custom/HomePage";
import TestPage from "./components/Custom/TestPage";
import Profile from "./components/Custom/Profile";
import PrevTests from "./components/Custom/PrevTests";
import ScoreBoard from "./components/Custom/ScoreBoard";
import FavoritesPage from "./components/Custom/FavoritesPage";
import AboutUsPage from "./components/Custom/aboutus";
import Notes from "./components/Custom/Notes";
import TechnicalQuestionsPage from "./components/Custom/TechnicalQuestionsPage";
import TopicPracticePage from "./components/Custom/TopicPracticePage";
import MixedQuizPage from "./components/Custom/MixedQuizPage";
import OperatingSystemsPage from "./components/Custom/OperatingSystemsPage";
import DBMSPage from "./components/Custom/DBMSPage";
import AptitudeTrainingPage from "./components/Custom/AptitudeTrainingPage";
import AptitudePracticePage from "./components/Custom/AptitudePracticePage";
import AptitudeResultsPage from "./components/Custom/AptitudeResultsPage";
import OnTopBar from "./components/Custom/OnTopBar";
import ChatAssistant from "./components/Custom/ChatAssistant";
import AptitudePage from "./components/Custom/AptitudePage";
import QuizPage from "./components/Custom/QuizPage";
import Contact from "./components/Custom/Contact";
import AiInterviewPage from "./components/Custom/AiInterviewPage";
import AiInterviewOptionsPage from "./components/Custom/AiInterviewOptionsPage";
import TextInterviewPage from "./components/Custom/TextInterviewPage";
import VoiceInterviewPage from "./components/Custom/VoiceInterviewPage";
import VideoInterviewPage from "./components/Custom/VideoInterviewPage";
import FullInterviewPage from "./components/Custom/FullInterviewPage";
import DsaSheet from "./components/Custom/DSASheet";
import JavaScriptSheet from "./components/Custom/JavaScriptSheet";
import CppPractice from "./components/Custom/CppPractice";
import JavaPractice from "./components/Custom/JavaPractice";
import PythonPractice from "./components/Custom/pythonPractice";
import CPractice from "./components/Custom/CPractice";
import HtmlPractice from "./components/Custom/HtmlPractice";
import CssPractice from "./components/Custom/CssPractice";

import {
  DarkModeProvider,
  useDarkMode,
} from "./components/Custom/DarkModeContext";

// ✅ Import Toaster
import { Toaster } from "react-hot-toast";

function AppContent() {
  const { darkMode } = useDarkMode();
  const [userID, setUserId] = useState("");
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div
      className={`w-full min-h-[100vh] h-auto flex flex-col justify-between items-center transition-colors duration-500
      ${
        darkMode
          ? "bg-gradient-to-br from-[#0f1419] via-[#1a1f2e] to-[#0f1419] text-white"
          : "bg-white text-gray-900"
      }`}
    >
      {/* Toast Notifications */}
      <Toaster position="top-right" reverseOrder={false} />

      <Header setUserID={setUserId} setIsChatOpen={setIsChatOpen} />

      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/homepage" element={<HomePage userID={userID} />} />
        <Route path="/testpage" element={<TestPage userID={userID} />} />
        <Route path="/profile" element={<Profile userID={userID} />} />
        <Route path="/notes" element={<Notes />} />
        <Route path="/previous-tests" element={<PrevTests userID={userID} />} />
        <Route path="/score-board" element={<ScoreBoard />} />
        <Route path="/aptitude" element={<AptitudePage />} />
        <Route path="/quiz/:topic" element={<QuizPage />} />
        <Route
          path="/ai-interview-options"
          element={<AiInterviewOptionsPage />}
        />
        <Route path="/about" element={<AboutUsPage />} />
        <Route path="/ai-interview/text" element={<TextInterviewPage />} />
        <Route path="/ai-interview/voice" element={<VoiceInterviewPage />} />
        <Route path="/ai-interview/video" element={<VideoInterviewPage />} />
        <Route path="/ai-interview/full" element={<FullInterviewPage />} />
        <Route path="/ai-interview" element={<AiInterviewPage />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/favorites" element={<FavoritesPage />} />
        <Route
          path="/technical-questions"
          element={<TechnicalQuestionsPage />}
        />
        <Route path="/mixed-quiz" element={<MixedQuizPage />} />
        <Route path="/operating-systems" element={<OperatingSystemsPage />} />
        <Route path="/dbms" element={<DBMSPage />} />
        <Route path="/dsasheet" element={<DsaSheet />} />
        <Route path="/JavaScriptSheet" element={<JavaScriptSheet />} />
        <Route path="/CppPractice" element={<CppPractice />} />
        <Route path="/JavaPractice" element={<JavaPractice />} />
        <Route path="/PythonPractice" element={<PythonPractice />} />
        <Route path="/CPractice" element={<CPractice />} />
        <Route path="/HtmlPractice" element={<HtmlPractice />} />
        <Route path="/CssPractice" element={<CssPractice />} />
        <Route path="/practice/:topicName" element={<TopicPracticePage />} />
        <Route path="/aptitude-training" element={<AptitudeTrainingPage />} />
        <Route
          path="/aptitude-practice/:difficulty"
          element={<AptitudePracticePage />}
        />
        <Route
          path="/aptitude-results/:difficulty"
          element={<AptitudeResultsPage />}
        />
      </Routes>

      <OnTopBar />
      {userID && (
        <ChatAssistant
          userID={userID}
          isChatOpen={isChatOpen}
          setIsChatOpen={setIsChatOpen}
        />
      )}
      <Footer />
    </div>
  );
}

function App() {
  return (
    <DarkModeProvider>
      <AppContent />
    </DarkModeProvider>
  );
}

export default App;
