
import React from 'react';
import { Message, Role } from '../types';
import { Avatar } from './Avatar';

interface ChatMessageProps {
  message: Message;
  isTyping?: boolean;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, isTyping = false }) => {
  const isUser = message.role === Role.User;

  if (isTyping) {
    return (
      <div className="flex items-end space-x-3">
        <div className="flex-shrink-0">
            <Avatar />
        </div>
        <div className="bg-gray-800 p-3 rounded-lg rounded-bl-none max-w-lg">
          <div className="flex space-x-1">
            <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse delay-75"></span>
            <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse delay-150"></span>
            <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse delay-300"></span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-end space-x-3 ${isUser ? 'justify-end' : ''}`}>
      {!isUser && (
        <div className="flex-shrink-0">
           <Avatar />
        </div>
      )}
      <div
        className={`p-3 rounded-lg max-w-lg animate-fade-in-up ${
          isUser
            ? 'bg-yellow-400 text-black rounded-br-none'
            : 'bg-gray-800 text-white rounded-bl-none'
        }`}
      >
        <p className="whitespace-pre-wrap">{message.text}</p>
        <p className={`text-xs mt-1 ${isUser ? 'text-black/60 text-right' : 'text-white/40'}`}>
          {message.timestamp}
        </p>
      </div>
    </div>
  );
};

// Add keyframes for animation in a style tag or your global CSS.
// Since we can't add a global CSS file, we use a simple component.
const StyleInjector: React.FC = () => (
  <style>{`
    @keyframes fade-in-up {
      from {
        opacity: 0;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    .animate-fade-in-up {
      animation: fade-in-up 0.3s ease-out forwards;
    }
  `}</style>
);

// To ensure styles are injected, you can render this once in your App.
// For simplicity, it's defined here. In a larger app, manage this globally.
(function() {
  if (!document.getElementById('chat-message-styles')) {
    const style = document.createElement('style');
    style.id = 'chat-message-styles';
    style.innerHTML = `
      @keyframes fade-in-up {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }
      .animate-fade-in-up { animation: fade-in-up 0.3s ease-out forwards; }
    `;
    document.head.appendChild(style);
  }
})();
