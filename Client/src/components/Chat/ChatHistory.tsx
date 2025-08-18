import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { IoClose, IoSearch } from 'react-icons/io5';
import { BsLightbulb, BsQuestionCircle, BsPersonWorkspace } from 'react-icons/bs';
import axios from 'axios';

interface ChatSession {
  sessionId: string;
  mode: 'faq' | 'study' | 'mentor';
  messages: Message[];
  createdAt: Date;
  lastActivity: Date;
  isActive: boolean;
  escalated: boolean;
}

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

interface ChatHistoryProps {
  userID: string;
  isOpen: boolean;
  onClose: () => void;
  onLoadSession: (sessionId: string) => void;
}

const ChatHistory: React.FC<ChatHistoryProps> = ({ userID, isOpen, onClose, onLoadSession }) => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'faq' | 'study' | 'mentor'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'activity'>('activity');

  useEffect(() => {
    if (isOpen && userID) {
      loadChatHistory();
    }
  }, [isOpen, userID]);

  const loadChatHistory = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/chat/history/${userID}`, {
        withCredentials: true
      });
      
      if (response.data.success) {
        setSessions(response.data.history);
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
    } finally {
      setLoading(false);
    }
  };

  const getModeIcon = (mode: string) => {
    switch (mode) {
      case 'faq':
        return <BsQuestionCircle className="w-4 h-4 text-blue-400" />;
      case 'study':
        return <BsLightbulb className="w-4 h-4 text-green-400" />;
      case 'mentor':
        return <BsPersonWorkspace className="w-4 h-4 text-purple-400" />;
      default:
        return <BsQuestionCircle className="w-4 h-4" />;
    }
  };

  const getModeColor = (mode: string) => {
    switch (mode) {
      case 'faq':
        return 'text-blue-400 bg-blue-500/10 border-blue-500/30';
      case 'study':
        return 'text-green-400 bg-green-500/10 border-green-500/30';
      case 'mentor':
        return 'text-purple-400 bg-purple-500/10 border-purple-500/30';
      default:
        return 'text-gray-400 bg-gray-500/10 border-gray-500/30';
    }
  };

  const filteredSessions = sessions
    .filter(session => {
      const matchesSearch = searchTerm === '' || 
        session.messages.some(msg => 
          msg.text.toLowerCase().includes(searchTerm.toLowerCase())
        );
      const matchesMode = filterMode === 'all' || session.mode === filterMode;
      return matchesSearch && matchesMode;
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else {
        return new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime();
      }
    });

  const getSessionPreview = (messages: Message[]) => {
    const lastMessage = messages[messages.length - 1];
    if (!lastMessage) return 'No messages';
    
    const preview = lastMessage.text.length > 50 
      ? lastMessage.text.substring(0, 50) + '...'
      : lastMessage.text;
    
    return `${lastMessage.sender === 'user' ? 'You' : 'Assistant'}: ${preview}`;
  };

  const getMessageCount = (messages: Message[]) => {
    return messages.length;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[200]">
      <div className="bg-gray-800 rounded-lg shadow-2xl w-full max-w-4xl h-[80vh] flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-white">Chat History</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors duration-200"
          >
            <IoClose size={24} />
          </button>
        </div>

        {/* Search and Filters */}
        <div className="p-4 border-b border-gray-700 space-y-3">
          {/* Search */}
          <div className="relative">
            <IoSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Filters */}
          <div className="flex gap-2 flex-wrap">
            <select
              value={filterMode}
              onChange={(e) => setFilterMode(e.target.value as any)}
              className="px-3 py-1 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Modes</option>
              <option value="faq">FAQ</option>
              <option value="study">Study</option>
              <option value="mentor">Mentor</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-1 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="activity">Sort by Activity</option>
              <option value="date">Sort by Date</option>
            </select>
          </div>
        </div>

        {/* Sessions List */}
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : filteredSessions.length === 0 ? (
            <div className="text-center text-gray-400 py-8">
              <div className="text-4xl mb-2">📝</div>
              <p className="text-lg">No conversations found</p>
              <p className="text-sm mt-1">Start a new conversation to see it here</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredSessions.map((session) => (
                <div
                  key={session.sessionId}
                  className="bg-gray-700 rounded-lg p-4 hover:bg-gray-600 transition-colors duration-200 cursor-pointer border border-gray-600"
                  onClick={() => {
                    onLoadSession(session.sessionId);
                    onClose();
                  }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getModeIcon(session.mode)}
                      <span className={`text-xs px-2 py-1 rounded-full border ${getModeColor(session.mode)}`}>
                        {session.mode.toUpperCase()}
                      </span>
                      {session.escalated && (
                        <span className="text-xs px-2 py-1 rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30">
                          ESCALATED
                        </span>
                      )}
                      {session.isActive && (
                        <span className="text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-400 border border-green-500/30">
                          ACTIVE
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-gray-400">
                      {format(new Date(session.lastActivity), 'MMM dd, HH:mm')}
                    </div>
                  </div>

                  <p className="text-sm text-gray-300 mb-2">
                    {getSessionPreview(session.messages)}
                  </p>

                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>{getMessageCount(session.messages)} messages</span>
                    <span>Created: {format(new Date(session.createdAt), 'MMM dd, yyyy')}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-700 flex justify-between items-center text-sm text-gray-400">
          <span>{filteredSessions.length} conversation{filteredSessions.length !== 1 ? 's' : ''}</span>
          <button
            onClick={loadChatHistory}
            className="text-indigo-400 hover:text-indigo-300 transition-colors duration-200"
          >
            Refresh
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatHistory;
