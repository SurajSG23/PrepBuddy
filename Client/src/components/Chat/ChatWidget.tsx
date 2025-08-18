import React, { useState, useRef, useEffect } from 'react';
import { IoChatbubblesOutline, IoClose, IoTime } from 'react-icons/io5';
import { IoMdSettings } from 'react-icons/io';
import { BsLightbulb, BsQuestionCircle, BsPersonWorkspace } from 'react-icons/bs';
import axios from 'axios';

import MessageList from './MessageList';
import MessageInput from './MessageInput';
import ModeSelector from './ModeSelector';
import ChatHistory from './ChatHistory';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  metadata?: {
    mode?: string;
    confidence?: number;
    escalated?: boolean;
  };
}

interface ChatWidgetProps {
  userID: string;
  isChatOpen: boolean;
  setIsChatOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const ChatWidget: React.FC<ChatWidgetProps> = ({ userID, isChatOpen, setIsChatOpen }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentMode, setCurrentMode] = useState<'faq' | 'study' | 'mentor'>('faq');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [showModeSelector, setShowModeSelector] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);


  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isChatOpen && userID) {
      loadChatHistory();
    }
  }, [isChatOpen, userID]);

  const loadChatHistory = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/chat/history/${userID}`, {
        withCredentials: true
      });
      
      if (response.data.success && response.data.history.length > 0) {
        const latestSession = response.data.history[0];
        if (latestSession.isActive) {
          setSessionId(latestSession.sessionId);
          setCurrentMode(latestSession.mode);
          setMessages(latestSession.messages);
        }
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setIsLoading(true);
    setIsTyping(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/chat/send`,
        {
          message: currentInput,
          mode: currentMode,
          sessionId
        },
        { withCredentials: true }
      );

      if (response.data.success) {
        const botMessage: Message = {
          id: response.data.messageId || Date.now().toString(),
          text: response.data.response,
          sender: 'bot',
          timestamp: new Date(),
          metadata: {
            mode: response.data.mode,
            confidence: response.data.confidence,
            escalated: response.data.escalated
          }
        };

        setSessionId(response.data.sessionId);
        setCurrentMode(response.data.mode);
        setMessages(prev => [...prev, botMessage]);

        // Show escalation notification if needed
        if (response.data.escalated) {
          // You can add a toast notification here
          console.log('Message escalated to mentor');
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: Date.now().toString(),
        text: 'Sorry, I encountered an error. Please try again.',
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
  };

  const handleModeChange = async (newMode: 'faq' | 'study' | 'mentor') => {
    if (newMode === currentMode) return;

    setCurrentMode(newMode);
    setShowModeSelector(false);

    if (sessionId) {
      try {
        await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/chat/mode/switch`,
          {
            sessionId,
            mode: newMode
          },
          { withCredentials: true }
        );

        // Add mode change message
        const modeMessage: Message = {
          id: Date.now().toString(),
          text: `Switched to ${newMode.toUpperCase()} mode`,
          sender: 'bot',
          timestamp: new Date(),
          metadata: { mode: newMode }
        };
        setMessages(prev => [...prev, modeMessage]);
      } catch (error) {
        console.error('Error switching mode:', error);
      }
    }
  };

  const handleEscalate = async () => {
    if (!sessionId) return;

    try {
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/chat/escalate`,
        {
          sessionId,
          reason: 'User requested mentor assistance'
        },
        { withCredentials: true }
      );

      const escalationMessage: Message = {
        id: Date.now().toString(),
        text: 'Your request has been escalated to a human mentor. They will respond shortly.',
        sender: 'bot',
        timestamp: new Date(),
        metadata: { mode: 'mentor', escalated: true }
      };
      setMessages(prev => [...prev, escalationMessage]);
    } catch (error) {
      console.error('Error escalating:', error);
    }
  };

  const handleCloseChat = async () => {
    if (sessionId) {
      try {
        await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/chat/session/close`,
          { sessionId },
          { withCredentials: true }
        );
      } catch (error) {
        console.error('Error closing session:', error);
      }
    }
    setIsChatOpen(false);
  };

  const handleLoadSession = async (sessionId: string) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/chat/context/${sessionId}`,
        { withCredentials: true }
      );
      
      if (response.data.success) {
        setSessionId(sessionId);
        setCurrentMode(response.data.session.mode);
        setMessages(response.data.context.map((msg: any) => ({
          id: msg.id || Date.now().toString(),
          text: msg.content,
          sender: msg.role === 'user' ? 'user' : 'bot',
          timestamp: new Date(msg.timestamp),
          metadata: msg.metadata
        })));
      }
    } catch (error) {
      console.error('Error loading session:', error);
    }
  };

  const getModeIcon = (mode: string) => {
    switch (mode) {
      case 'faq':
        return <BsQuestionCircle className="w-4 h-4" />;
      case 'study':
        return <BsLightbulb className="w-4 h-4" />;
      case 'mentor':
        return <BsPersonWorkspace className="w-4 h-4" />;
      default:
        return <BsQuestionCircle className="w-4 h-4" />;
    }
  };

  const getModeColor = (mode: string) => {
    switch (mode) {
      case 'faq':
        return 'text-blue-400';
      case 'study':
        return 'text-green-400';
      case 'mentor':
        return 'text-purple-400';
      default:
        return 'text-blue-400';
    }
  };

  return (
    <div className="fixed bottom-5 right-4 z-[100]">
      {isChatOpen && (
        <div className="w-80 h-[28rem] bg-gray-800 border border-indigo-500 rounded-lg shadow-2xl flex flex-col animate-slide-in shadow-indigo-500/20 transition-all duration-300 glowing-border">
          {/* Header */}
          <div className="p-3 bg-gray-900 rounded-t-lg flex justify-between items-center sticky top-0 z-10">
            <div className="flex items-center gap-2">
              <div className={`${getModeColor(currentMode)}`}>
                {getModeIcon(currentMode)}
              </div>
              <h3 className="text-white font-semibold">PrepBuddy Assistant</h3>
              <span className={`text-xs px-2 py-1 rounded-full ${getModeColor(currentMode)} bg-opacity-20`}>
                {currentMode.toUpperCase()}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setShowHistory(true)}
                className="text-gray-300 hover:text-indigo-400 transition-all duration-200 p-1"
                title="Chat History"
              >
                <IoTime size={16} />
              </button>
              <button
                onClick={() => setShowModeSelector(!showModeSelector)}
                className="text-gray-300 hover:text-indigo-400 transition-all duration-200 p-1"
                title="Settings"
              >
                <IoMdSettings size={16} />
              </button>
              <button
                onClick={handleCloseChat}
                className="text-gray-300 hover:text-indigo-400 transition-all duration-200 p-1"
                title="Close Chat"
              >
                <IoClose size={16} />
              </button>
            </div>
          </div>

          {/* Mode Selector */}
          {showModeSelector && (
            <ModeSelector
              currentMode={currentMode}
              onModeChange={handleModeChange}
              onClose={() => setShowModeSelector(false)}
            />
          )}

          {/* Messages */}
          <MessageList
            messages={messages}
            isLoading={isLoading}
            isTyping={isTyping}
            chatEndRef={chatEndRef as React.RefObject<HTMLDivElement>}
          />

          {/* Input */}
          <MessageInput
            input={input}
            setInput={setInput}
            onSubmit={handleSendMessage}
            isLoading={isLoading}
            onEscalate={handleEscalate}
            currentMode={currentMode}
          />
        </div>
      )}

      {/* Chat History Modal */}
      <ChatHistory
        userID={userID}
        isOpen={showHistory}
        onClose={() => setShowHistory(false)}
        onLoadSession={handleLoadSession}
      />

      {/* Floating Button */}
      <button
        onClick={() => setIsChatOpen(!isChatOpen)}
        className="bg-indigo-600 text-white w-16 h-16 rounded-full flex items-center justify-center shadow-xl 
              hover:bg-indigo-700 transition-all duration-300 hover:scale-110 active:scale-95"
      >
        {isChatOpen ? <IoClose size={32} /> : <IoChatbubblesOutline size={32} />}
      </button>
    </div>
  );
};

export default ChatWidget;
