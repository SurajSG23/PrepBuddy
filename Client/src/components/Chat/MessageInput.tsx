import React, { useState } from 'react';
import { IoPaperPlaneOutline } from 'react-icons/io5';
import { BsLightbulb, BsQuestionCircle, BsPersonWorkspace } from 'react-icons/bs';

interface MessageInputProps {
  input: string;
  setInput: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  onEscalate: () => void;
  currentMode: 'faq' | 'study' | 'mentor';
}

const MessageInput: React.FC<MessageInputProps> = ({
  input,
  setInput,
  onSubmit,
  isLoading,
  onEscalate,
  currentMode
}) => {
  const [showEscalate, setShowEscalate] = useState(false);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSubmit(e);
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

  const getModeDescription = (mode: string) => {
    switch (mode) {
      case 'faq':
        return 'Platform help & navigation';
      case 'study':
        return 'Learning & problem solving';
      case 'mentor':
        return 'Advanced guidance & career advice';
      default:
        return 'Platform help & navigation';
    }
  };

  const quickPrompts = {
    faq: [
      "How do I create a custom test?",
      "What are badges and how do I earn them?",
      "How does scoring work?",
      "Where can I find my test history?"
    ],
    study: [
      "Explain binary search algorithm",
      "Help me understand recursion",
      "What are time complexity basics?",
      "How do I approach dynamic programming?"
    ],
    mentor: [
      "Career advice for software engineering",
      "Interview preparation strategies",
      "How to improve problem-solving skills",
      "Advanced algorithm concepts"
    ]
  };

  return (
    <div className="p-3 border-t border-gray-700">
      {/* Mode indicator */}
      <div className="flex items-center gap-2 mb-2 text-xs text-gray-400">
        <div className={`${getModeColor(currentMode)}`}>
          {getModeIcon(currentMode)}
        </div>
        <span className="font-medium">{currentMode.toUpperCase()}</span>
        <span>•</span>
        <span>{getModeDescription(currentMode)}</span>
      </div>

      {/* Quick prompts */}
      {input.length === 0 && (
        <div className="mb-2 flex flex-wrap gap-1">
          {quickPrompts[currentMode].slice(0, 2).map((prompt, index) => (
            <button
              key={index}
              onClick={() => setInput(prompt)}
              className="text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 px-2 py-1 rounded-full transition-all duration-200"
            >
              {prompt}
            </button>
          ))}
        </div>
      )}

      {/* Input form */}
      <form onSubmit={onSubmit} className="flex items-center gap-2">
        <div className="flex-1 relative">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={`Ask me about ${currentMode === 'faq' ? 'the platform' : currentMode === 'study' ? 'programming concepts' : 'advanced topics'}...`}
            className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300 resize-none"
            rows={1}
            style={{ minHeight: '40px', maxHeight: '120px' }}
            disabled={isLoading}
          />
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1">
          {/* Escalate button (only in FAQ and Study modes) */}
          {currentMode !== 'mentor' && (
            <button
              type="button"
              onClick={() => setShowEscalate(!showEscalate)}
              className="text-gray-400 hover:text-purple-400 p-2 rounded-full transition-all duration-200"
              title="Escalate to mentor"
            >
              <BsPersonWorkspace size={16} />
            </button>
          )}

          {/* Send button */}
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="text-indigo-400 hover:text-white bg-slate-800 hover:bg-indigo-600 p-2 rounded-full transition-all duration-300 hover:scale-105 focus:ring-2 focus:ring-indigo-400 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            aria-label="Send Message"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <IoPaperPlaneOutline size={18} />
            )}
          </button>
        </div>
      </form>

      {/* Escalate confirmation */}
      {showEscalate && (
        <div className="mt-2 p-2 bg-purple-900/20 border border-purple-500/30 rounded-md">
          <div className="flex items-center justify-between">
            <div className="text-xs text-purple-300">
              <strong>Escalate to Mentor?</strong>
              <p className="text-purple-400 mt-1">Get expert help for complex questions</p>
            </div>
            <div className="flex gap-1">
              <button
                onClick={onEscalate}
                className="text-xs bg-purple-600 hover:bg-purple-700 text-white px-2 py-1 rounded transition-all duration-200"
              >
                Yes
              </button>
              <button
                onClick={() => setShowEscalate(false)}
                className="text-xs bg-gray-600 hover:bg-gray-700 text-white px-2 py-1 rounded transition-all duration-200"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Character count */}
      {input.length > 0 && (
        <div className="text-xs text-gray-500 mt-1 text-right">
          {input.length} characters
        </div>
      )}
    </div>
  );
};

export default MessageInput;
