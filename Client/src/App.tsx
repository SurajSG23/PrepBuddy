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
import OnTopBar from "./components/Custom/OnTopBar";
import ChatAssistant from "./components/Custom/ChatAssistant"; // Import the Chat Assistant
import AptitudePage from "./components/Custom/AptitudePage";
import QuizPage from "./components/Custom/QuizPage";
//import the Contact page
import Contact from "./components/Custom/Contact";

function App() {
  const [userID, setUserId] = useState("");
  const [isChatOpen, setIsChatOpen] = useState(false); // State to control chat visibility

  return (
    <div className="w-full min-h-[100vh] h-auto flex flex-col justify-between items-center text-white">
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
        {/* Add contact page */}
        <Route path="/contact" element={<Contact/>} />


        {/* Pass userID to pages that need it */}
        <Route path="/favorites" element={<FavoritesPage />} />
        <Route
          path="/technical-questions"
          element={<TechnicalQuestionsPage />}
        />
        <Route path="/practice/:topicName" element={<TopicPracticePage />} />
      </Routes>
      
      <OnTopBar />

      {/* Render ChatAssistant if user is logged in */}
      {userID && <ChatAssistant userID={userID} isChatOpen={isChatOpen} setIsChatOpen={setIsChatOpen} />}

      <Footer />
    </div>
  );
}

export default App;
