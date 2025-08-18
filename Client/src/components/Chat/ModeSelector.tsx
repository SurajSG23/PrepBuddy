import React from 'react';
import { IoClose } from 'react-icons/io5';
import { BsLightbulb, BsQuestionCircle, BsPersonWorkspace } from 'react-icons/bs';

interface ModeSelectorProps {
  currentMode: 'faq' | 'study' | 'mentor';
  onModeChange: (mode: 'faq' | 'study' | 'mentor') => void;
  onClose: () => void;
}

const ModeSelector: React.FC<ModeSelectorProps> = ({ currentMode, onModeChange, onClose }) => {
  const modes = [
    {
      id: 'faq' as const,
      name: 'FAQ Mode',
      icon: BsQuestionCircle,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/30',
      description: 'Platform navigation, account help, and general questions',
      features: ['Account management', 'Platform navigation', 'Test information', 'General support']
    },
    {
      id: 'study' as const,
      name: 'Study Mode',
      icon: BsLightbulb,
      color: 'text-green-400',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/30',
      description: 'Programming concepts, problem explanations, and learning guidance',
      features: ['Concept explanations', 'Code examples', 'Problem solving', 'Learning resources']
    },
    {
      id: 'mentor' as const,
      name: 'Mentor Mode',
      icon: BsPersonWorkspace,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/30',
      description: 'Advanced guidance, career advice, and complex problem solving',
      features: ['Advanced concepts', 'Career guidance', 'Interview prep', 'Expert insights']
    }
  ];

  return (
    <div className="absolute top-full left-0 right-0 bg-gray-800 border border-gray-600 rounded-b-lg shadow-lg z-20">
      <div className="p-3 border-b border-gray-700 flex justify-between items-center">
        <h4 className="text-white font-semibold text-sm">Select Chat Mode</h4>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white transition-colors duration-200"
        >
          <IoClose size={16} />
        </button>
      </div>

      <div className="p-3 space-y-2">
        {modes.map((mode) => {
          const IconComponent = mode.icon;
          const isActive = currentMode === mode.id;

          return (
            <button
              key={mode.id}
              onClick={() => {
                onModeChange(mode.id);
                onClose();
              }}
              className={`w-full p-3 rounded-lg border transition-all duration-200 text-left ${
                isActive
                  ? `${mode.bgColor} ${mode.borderColor} ${mode.color}`
                  : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600 hover:border-gray-500'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`${mode.color} mt-0.5`}>
                  <IconComponent size={20} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h5 className="font-medium text-sm">{mode.name}</h5>
                    {isActive && (
                      <span className="text-xs bg-current text-gray-800 px-2 py-0.5 rounded-full">
                        ACTIVE
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mb-2">{mode.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {mode.features.map((feature, index) => (
                      <span
                        key={index}
                        className={`text-xs px-2 py-1 rounded-full ${
                          isActive
                            ? 'bg-current text-gray-800'
                            : 'bg-gray-600 text-gray-300'
                        }`}
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Mode switching tips */}
      <div className="p-3 bg-gray-900/50 border-t border-gray-700">
        <div className="text-xs text-gray-400">
          <p className="font-medium mb-1">💡 Tips:</p>
          <ul className="space-y-1">
            <li>• Start with <strong>FAQ</strong> for platform questions</li>
            <li>• Use <strong>Study</strong> for learning programming concepts</li>
            <li>• Switch to <strong>Mentor</strong> for advanced guidance</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ModeSelector;
