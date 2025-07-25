import "./App.css";
import Header from "./components/Custom/Header";
import Footer from "./components/Custom/Footer";
import LandingPage from "./pages/LandingPage";
import HomePage from "./pages/HomePage";
import TestPage from "./pages/TestPage";
import AptitudeTraining from "./pages/AptitudeTraining";
import TechnicalQuestions from "./pages/TechnicalQuestions";
import AIPoweredInterviews from "./pages/AIPoweredInterviews";
import { Routes, Route } from "react-router-dom";
import { useState } from "react";
import Profile from "./pages/Profile";
import PrevTests from "./pages/PrevTests";
import ScoreBoard from "./pages/ScoreBoard";
import FavoritesPage from "./components/Custom/FavoritesPage"; // adjust the path

function App() {
  const [userID, setUserId] = useState("");
  return (
    <div className="w-full min-h-[100vh] h-auto bg-gradient-to-r from-gray-900 to-gray-800 flex flex-col justify-between items-center text-white">
      <Header setUserID={setUserId} />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/homepage" element={<HomePage userID={userID} />} />
        <Route path="/testpage" element={<TestPage userID={userID} />} />
        <Route path="/profile" element={<Profile userID={userID} />} />
        <Route path="/previous-tests" element={<PrevTests userID={userID} />} />
        <Route path="/score-board" element={<ScoreBoard />} />
        <Route path="/aptitude-training" element={<AptitudeTraining />} />
        <Route path="/technical-questions" element={<TechnicalQuestions />} />
        <Route path="/ai-interviews" element={<AIPoweredInterviews />} />
        <Route path="/favorites" element={<FavoritesPage userID={userID} />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
