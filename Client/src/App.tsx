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
        <Route path="/score-board" element={<ScoreBoard/>} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
