import React from 'react';
import { format } from 'date-fns';
import { BsLightbulb, BsQuestionCircle, BsPersonWorkspace } from 'react-icons/bs';

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

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
  isTyping: boolean;
  chatEndRef: React.RefObject<HTMLDivElement>;
}

const MessageList: React.FC<MessageListProps> = ({ messages, isLoading, isTyping, chatEndRef }) => {
  const getModeIcon = (mode?: string) => {
    switch (mode) {
      case 'faq':
        return <BsQuestionCircle className="w-3 h-3 text-blue-400" />;
      case 'study':
        return <BsLightbulb className="w-3 h-3 text-green-400" />;
      case 'mentor':
        return <BsPersonWorkspace className="w-3 h-3 text-purple-400" />;
      default:
        return null;
    }
  };



  const TypingIndicator = () => (
    <div className="flex justify-start mb-3 animate-fade-in">
      <div className="bg-gray-700 text-gray-200 py-2 px-3 rounded-lg max-w-[80%] relative group transition-all duration-300">
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
        <div className="absolute left-0 -bottom-2 border-r-8 border-gray-700 border-b-8 border-transparent"></div>
      </div>
    </div>
  );

  const LoadingIndicator = () => (
    <div className="flex justify-start mb-3 animate-fade-in">
      <div className="bg-gray-700 text-gray-200 py-2 px-3 rounded-lg max-w-[80%] relative group transition-all duration-300">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm">Processing...</span>
        </div>
        <div className="absolute left-0 -bottom-2 border-r-8 border-gray-700 border-b-8 border-transparent"></div>
      </div>
    </div>
  );

  return (
    <div className="flex-1 p-4 overflow-y-auto">
      {messages.length === 0 && !isLoading && (
        <div className="text-center text-gray-400 py-8">
          <div className="text-4xl mb-2">👋</div>
          <p className="text-sm">Hi! I'm PrepBuddy's AI assistant.</p>
          <p className="text-xs mt-1">Ask me anything about the platform or get help with your studies!</p>
        </div>
      )}

      {messages.map((msg) => (
        <div key={msg.id} className={`mb-3 flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
          <div className={`relative py-2 px-3 rounded-lg max-w-[80%] ${
            msg.sender === 'user' 
              ? 'bg-indigo-600 text-white shadow-md hover:shadow-indigo-500/30' 
              : `bg-gray-700 text-gray-200 ${msg.metadata?.escalated ? 'border-l-4 border-purple-500' : ''}`
          } group transition-all duration-300`}>
            
            {/* Mode indicator for bot messages */}
            {msg.sender === 'bot' && msg.metadata?.mode && (
              <div className="flex items-center gap-1 mb-1">
                {getModeIcon(msg.metadata.mode)}
                <span className="text-xs opacity-70">
                  {msg.metadata.mode.toUpperCase()}
                </span>
                {msg.metadata.escalated && (
                  <span className="text-xs text-purple-400">• ESCALATED</span>
                )}
              </div>
            )}

            {/* Message content */}
            <div className="whitespace-pre-wrap">{msg.text}</div>

            {/* Timestamp */}
            <div className={`text-xs mt-1 ${
              msg.sender === 'user' ? 'text-indigo-200' : 'text-gray-400'
            }`}>
              {format(msg.timestamp, 'HH:mm')}
            </div>

            {/* Confidence indicator for bot messages */}
            {msg.sender === 'bot' && msg.metadata?.confidence !== undefined && (
              <div className="mt-1">
                <div className="flex items-center gap-1">
                  <div className="w-12 h-1 bg-gray-600 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-300 ${
                        msg.metadata.confidence > 0.7 ? 'bg-green-400' :
                        msg.metadata.confidence > 0.4 ? 'bg-yellow-400' : 'bg-red-400'
                      }`}
                      style={{ width: `${msg.metadata.confidence * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-400">
                    {Math.round(msg.metadata.confidence * 100)}%
                  </span>
                </div>
              </div>
            )}

            {/* Message tail */}
            <div className={`absolute ${
              msg.sender === 'user' 
                ? 'right-0 -bottom-2 border-l-8 border-indigo-600' 
                : 'left-0 -bottom-2 border-r-8 border-gray-700'
            } border-b-8 border-transparent`}></div>
          </div>
        </div>
      ))}

      {/* Loading indicator */}
      {isLoading && <LoadingIndicator />}

      {/* Typing indicator */}
      {isTyping && !isLoading && <TypingIndicator />}

      {/* Scroll anchor */}
      <div ref={chatEndRef} />
    </div>
  );
};

export default MessageList;
