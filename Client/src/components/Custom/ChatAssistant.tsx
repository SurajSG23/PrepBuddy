// src/components/Custom/ChatAssistant.tsx
import React, { useState, useRef, useEffect } from "react";
import { IoChatbubblesOutline, IoClose, IoPaperPlaneOutline } from "react-icons/io5";
import axios from 'axios';

// Assuming you have this file created as per previous instructions
import { getResponse } from "../../faqData";

interface Message {
  text: string;
  sender: "user" | "bot";
}

// Props are updated to control visibility from the parent component (App.tsx)
interface ChatAssistantProps {
  userID: string;
  isChatOpen: boolean;
  setIsChatOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const ChatAssistant: React.FC<ChatAssistantProps> = ({ userID, isChatOpen, setIsChatOpen }) => {
  // The component no longer controls its own visibility. `isChatOpen` prop does.
  const [messages, setMessages] = useState<Message[]>([
    { text: "Hi! I'm PrepBuddy's assistant. Ask me about the app, scoring, or ask for a test suggestion!", sender: "bot" }
  ]);
  const [input, setInput] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  // This function now uses the setter from props to toggle the state in App.tsx
  const handleToggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { text: input, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input;
    setInput("");

    // Check for test suggestion keyword
    if (currentInput.toLowerCase().includes("suggest")) {
      setMessages(prev => [...prev, { text: "Sure, let me see...", sender: "bot" }]);
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/test/suggest/${userID}`);
        const suggestionMessage: Message = { text: res.data.suggestion, sender: "bot" };
        setMessages(prev => [...prev, suggestionMessage]);
      } catch (error) {
        const errorMessage: Message = { text: "Sorry, I couldn't fetch a suggestion right now.", sender: "bot"};
        setMessages(prev => [...prev, errorMessage]);
      }
    } else {
      // Get response from static FAQ data
      const botResponse: Message = { text: getResponse(currentInput), sender: "bot" };
      setTimeout(() => {
         setMessages((prev) => [...prev, botResponse]);
      }, 500);
    }
  };

  return (
    <div className="fixed bottom-5 right-4 z-[100]">
      {/* Chat Window's visibility is now controlled by the isChatOpen prop */}
      {isChatOpen && (
        <div className="w-80 h-[28rem] bg-gray-800 border border-indigo-500 rounded-lg shadow-2xl flex flex-col animate-slide-in shadow-indigo-500/20 transition-all duration-300 glowing-border">
          {/* Header */}
          <div className="p-3 bg-gray-900 rounded-t-lg flex justify-between items-center sticky top-0 z-10">
            <h3 className="text-white font-semibold">PrepBuddy Assistant</h3>
            <button onClick={handleToggleChat} className="text-gray-300 hover:text-indigo-400 transition-all duration-200">
              <IoClose size={24} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto">
            {messages.map((msg, index) => (
              <div key={index} className={`mb-3 flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
                <div className={`relative py-2 px-3 rounded-lg max-w-[80%] ${msg.sender === 'user' ? 'bg-indigo-600 text-white shadow-md hover:shadow-indigo-500/30 cursor-pointer' : 'bg-gray-700 text-gray-200'}group transition-all duration-300`}>
                  {msg.text}
                         <div
          className={`absolute ${
            msg.sender === 'user' ? 'right-0 -bottom-2 border-l-8 border-indigo-600' : 'left-0 -bottom-2 border-r-8 border-gray-700'
          } border-b-8 border-transparent`}
        ></div>
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSendMessage} className="p-3 border-t border-gray-700 flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask something..."
              className="flex-1 bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300"
            />
            <button type="submit" className="text-indigo-400 hover:text-white bg-slate-800 hover:bg-indigo-600 p-2 rounded-full transition-all duration-300 hover:scale-105 focus:ring-2 focus:ring-indigo-400"
            aria-label="Send Message">
              <IoPaperPlaneOutline size={22} />
            </button>
          </form>
        </div>
      )}

      {/* Floating Button also uses the isChatOpen prop to determine the icon */}
      <button
        onClick={handleToggleChat}
        className="bg-indigo-600 text-white w-16 h-16 rounded-full flex items-center justify-center shadow-xl 
              hover:bg-indigo-700 transition-all duration-300 hover:scale-110 active:scale-95"
      >
        {isChatOpen ? <IoClose size={32} /> : <IoChatbubblesOutline size={32} />}
      </button>
    </div>
  );
};

export default ChatAssistant;
