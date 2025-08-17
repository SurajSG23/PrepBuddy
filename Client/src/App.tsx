import "./App.css";
import Header from "./components/Custom/Header";
import Footer from "./components/Custom/Footer";
import LandingPage from "./components/Custom/LandingPage";
import HomePage from "./components/Custom/HomePage";
import TestPage from "./components/Custom/TestPage";
import { Routes, Route } from "react-router-dom";
import { useState } from "react";
import Profile from "./components/Custom/Profile";
import PrevTests from "./components/Custom/PrevTests";
import ScoreBoard from "./components/Custom/ScoreBoard";
import FavoritesPage from "./components/Custom/FavoritesPage";
import Notes from "./components/Custom/Notes";
import TechnicalQuestionsPage from "./components/Custom/TechnicalQuestionsPage";
import TopicPracticePage from "./components/Custom/TopicPracticePage";
import MixedQuizPage from "./components/Custom/MixedQuizPage";
import OperatingSystemsPage from "./components/Custom/OperatingSystemsPage";
import AptitudeTrainingPage from "./components/Custom/AptitudeTrainingPage";
import AptitudePracticePage from "./components/Custom/AptitudePracticePage";
import AptitudeResultsPage from "./components/Custom/AptitudeResultsPage";
import OnTopBar from "./components/Custom/OnTopBar";
import ChatAssistant from "./components/Custom/ChatAssistant"; // Import the Chat Assistant
import AptitudePage from "./components/Custom/AptitudePage";
import QuizPage from "./components/Custom/QuizPage";
//import the Contact page
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

function App() {
  const [userID, setUserId] = useState("");
  const [isChatOpen, setIsChatOpen] = useState(false); // State to control chat visibility

  return (
    <div className="w-full min-h-[100vh] h-auto flex flex-col justify-between items-center text-white bg-gradient-to-br from-[#0f1419] via-[#1a1f2e] to-[#0f1419]">
      {/* Pass the chat state setter to the Header */}
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
        <Route path="/ai-interview-options" element={<AiInterviewOptionsPage />} />
        <Route path="/ai-interview/text" element={<TextInterviewPage />} />
        <Route path="/ai-interview/voice" element={<VoiceInterviewPage />} />
        <Route path="/ai-interview/video" element={<VideoInterviewPage />} />
        <Route path="/ai-interview/full" element={<FullInterviewPage />} />
        <Route path="/ai-interview" element={<AiInterviewPage />} />
        {/* Add contact page */}
        <Route path="/contact" element={<Contact/>} />


        {/* Pass userID to pages that need it */}
        <Route path="/favorites" element={<FavoritesPage />} />
        <Route
          path="/technical-questions"
          element={<TechnicalQuestionsPage />}
        />
        <Route path="/mixed-quiz" element={<MixedQuizPage />} />
        <Route path="/operating-systems" element={<OperatingSystemsPage />} />
        <Route path="/dsasheet" element={<DsaSheet />} />
        <Route path="/JavaScriptSheet" element={<JavaScriptSheet />} />
        <Route path ="/CppPractice" element={<CppPractice/>}/>
        <Route path ="/JavaPractice" element={<JavaPractice/>}/>
        <Route path="/PythonPractice" element={<PythonPractice/>}/>
        <Route path="/CPractice" element={<CPractice/>}/>
        <Route path="/HtmlPractice" element={<HtmlPractice/>}/>
        <Route path="/CssPractice" element={<CssPractice/>}/>
        <Route path="/practice/:topicName" element={<TopicPracticePage />} />
        <Route path="/aptitude-training" element={<AptitudeTrainingPage />} />
        <Route path="/aptitude-practice/:difficulty" element={<AptitudePracticePage />} />
        <Route path="/aptitude-results/:difficulty" element={<AptitudeResultsPage />} />
      </Routes>
      
      <OnTopBar />

      {/* Render ChatAssistant if user is logged in */}
      {userID && <ChatAssistant userID={userID} isChatOpen={isChatOpen} setIsChatOpen={setIsChatOpen} />}

      <Footer />
    </div>
  );
}

export default App;
