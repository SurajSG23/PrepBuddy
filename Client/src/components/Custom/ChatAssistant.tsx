import React, { useState, useRef, useEffect } from "react";
import { IoChatbubblesOutline, IoClose, IoPaperPlaneOutline } from "react-icons/io5";
import axios from "axios";
import { getResponse } from "../../faqData";
import { useDarkMode } from "../Custom/DarkModeContext";

interface Message {
  text: string;
  sender: "user" | "bot";
}

interface ChatAssistantProps {
  userID: string;
  isChatOpen: boolean;
  setIsChatOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const ChatAssistant: React.FC<ChatAssistantProps> = ({ userID, isChatOpen, setIsChatOpen }) => {
  const { darkMode } = useDarkMode();
  const [messages, setMessages] = useState<Message[]>([
    { text: "Hi! I'm PrepBuddy's assistant. Ask me about the app, scoring, or ask for a test suggestion!", sender: "bot" }
  ]);
  const [input, setInput] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleToggleChat = () => setIsChatOpen(!isChatOpen);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { text: input, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input;
    setInput("");

    if (currentInput.toLowerCase().includes("suggest")) {
      setMessages(prev => [...prev, { text: "Sure, let me see...", sender: "bot" }]);
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/test/suggest/${userID}`);
        const suggestionMessage: Message = { text: res.data.suggestion, sender: "bot" };
        setMessages(prev => [...prev, suggestionMessage]);
      } catch (error) {
        const errorMessage: Message = { text: "Sorry, I couldn't fetch a suggestion right now.", sender: "bot",};
        setMessages(prev => [...prev, errorMessage]);

      }
    } else {
      const botResponse: Message = { text: getResponse(currentInput), sender: "bot" };
      setTimeout(() => setMessages(prev => [...prev, botResponse]), 500);
    }
  };

  return (
    <div className="fixed bottom-5 right-4 z-[100]">
      {isChatOpen && (
        <div className={`w-80 h-[28rem] rounded-lg flex flex-col shadow-2xl animate-slide-in transition-all duration-300 glowing-border
                        ${darkMode ? "bg-gray-800 border border-indigo-500" : "bg-white border border-gray-300"}`}>
          {/* Header */}
          <div className={`p-3 rounded-t-lg flex justify-between items-center sticky top-0 z-10 transition-colors duration-500
                          ${darkMode ? "bg-gray-900" : "bg-gray-100"}`}>
            <h3 className={`${darkMode ? "text-white" : "text-gray-900"} font-semibold`}>PrepBuddy Assistant</h3>
            <button onClick={handleToggleChat} className={`transition-all duration-200 ${darkMode ? "text-gray-300 hover:text-indigo-400" : "text-gray-700 hover:text-indigo-600"}`}>
              <IoClose size={24} />
            </button>
          </div>

          {/* Messages */}
          <div className={`flex-1 p-4 overflow-y-auto transition-colors duration-500 ${darkMode ? "bg-gray-800" : "bg-gray-50"}`}>
            {messages.map((msg, index) => (
              <div key={index} className={`mb-3 flex ${msg.sender === "user" ? "justify-end" : "justify-start"} animate-fade-in`}>
                <div className={`relative py-2 px-3 rounded-lg max-w-[80%] group transition-all duration-500
                                ${msg.sender === "user"
                                  ? `${darkMode ? "bg-indigo-600 text-white shadow-md hover:shadow-indigo-500/30 cursor-pointer" : "bg-indigo-500 text-white shadow-md hover:shadow-indigo-400/30 cursor-pointer"}`
                                  : `${darkMode ? "bg-gray-700 text-gray-200" : "bg-gray-200 text-gray-900"}`}`}>
                  {msg.text}
                  <div className={`absolute ${msg.sender === "user" ? "right-0 -bottom-2 border-l-8" : "left-0 -bottom-2 border-r-8"} border-b-8 border-transparent
                                   ${msg.sender === "user" ? (darkMode ? "border-indigo-600" : "border-indigo-500") : (darkMode ? "border-gray-700" : "border-gray-200")}`}></div>
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSendMessage} className={`p-3 flex items-center gap-2 border-t transition-colors duration-500 ${darkMode ? "border-gray-700" : "border-gray-300"}`}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask something..."
              className={`flex-1 rounded-md px-3 py-2 focus:outline-none focus:ring-2 transition-all duration-500
                          ${darkMode ? "bg-gray-700 border border-gray-600 text-white focus:ring-indigo-500" : "bg-gray-100 border border-gray-300 text-gray-900 focus:ring-indigo-400"}`}
            />
            <button type="submit" aria-label="Send Message"
              className={`p-2 rounded-full transition-all duration-300 hover:scale-105 focus:ring-2
                          ${darkMode ? "text-indigo-400 hover:text-white bg-slate-800 hover:bg-indigo-600 focus:ring-indigo-400" : "text-indigo-600 hover:text-white bg-gray-200 hover:bg-indigo-400 focus:ring-indigo-400"}`}>
              <IoPaperPlaneOutline size={22} />
            </button>
          </form>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={handleToggleChat}
        className="w-16 h-16 rounded-full flex items-center justify-center shadow-xl transition-all duration-300 hover:scale-110 active:scale-95 bg-indigo-600 text-white hover:bg-indigo-700"
      >
        {isChatOpen ? <IoClose size={32} /> : <IoChatbubblesOutline size={32} />}
      </button>
    </div>
  );
};

export default ChatAssistant;
