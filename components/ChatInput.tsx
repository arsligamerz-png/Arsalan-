
import React, { useState, KeyboardEvent } from 'react';

interface ChatInputProps {
  onSendMessage: (text: string) => void;
  isListening: boolean;
  startListening: () => void;
  stopListening: () => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isListening, startListening, stopListening }) => {
  const [text, setText] = useState('');

  const handleSend = () => {
    if (text.trim()) {
      onSendMessage(text);
      setText('');
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  const handleMicClick = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <div className="p-4 bg-gray-900/50 border-t border-yellow-400/20 backdrop-blur-sm">
      <div className="flex items-center space-x-3 bg-gray-800 rounded-full p-2">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={isListening ? "Listening..." : "Bhai, ask anything..."}
          className="flex-1 bg-transparent focus:outline-none px-4 text-white placeholder-gray-500"
          disabled={isListening}
        />
        <button onClick={handleMicClick} className={`p-3 rounded-full transition-colors duration-300 ${isListening ? 'bg-red-500 animate-pulse' : 'bg-yellow-400 hover:bg-yellow-300'}`}>
          <MicIcon />
        </button>
        <button onClick={handleSend} className="p-3 rounded-full bg-yellow-400 hover:bg-yellow-300 transition-colors duration-300 disabled:bg-gray-600" disabled={!text.trim()}>
          <SendIcon />
        </button>
      </div>
    </div>
  );
};

const MicIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
  </svg>
);

const SendIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
  </svg>
);
