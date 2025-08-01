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

function App() {
  const [userID, setUserId] = useState("");
  return (
     <div className="Header"> 
      {/* Pass the chat state setter to the Header */}
      <Header setUserID={setUserId} />
      
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/homepage" element={<HomePage userID={userID} />} />
        <Route path="/testpage" element={<TestPage userID={userID} />} />
        <Route path="/profile" element={<Profile userID={userID} />} />
        <Route path="/notes" element={<Notes />} />
        <Route path="/previous-tests" element={<PrevTests userID={userID} />} />
        <Route path="/score-board" element={<ScoreBoard />} />
        <Route path="/favorites" element={<FavoritesPage userID={userID} />} />
        <Route
          path="/technical-questions"
          element={<TechnicalQuestionsPage />}
        />
        <Route path="/practice/:topicName" element={<TopicPracticePage />} />
      </Routes>
      <OnTopBar />
      <Footer />
    </div>
  );
}

export default App;
