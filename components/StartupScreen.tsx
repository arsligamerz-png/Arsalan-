
import React from 'react';
import { Avatar } from './Avatar';

export const StartupScreen: React.FC = () => {
  return (
    <div className="bg-[#111111] h-screen w-screen flex flex-col items-center justify-center animate-fade-in">
        <div className="flex flex-col items-center space-y-4">
            <Avatar />
            <h1 className="text-3xl font-bold font-goldman tracking-wider text-yellow-400">ARSALAN AI is booting up... ⚡</h1>
        </div>
        <style>{`
            @keyframes fade-in {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            .animate-fade-in { animation: fade-in 1s ease-in-out; }
        `}</style>
    </div>
  );
};
