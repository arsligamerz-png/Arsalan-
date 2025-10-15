
import React from 'react';
import { Avatar } from './Avatar';

export const Header: React.FC = () => {
  return (
    <header className="flex flex-col items-center justify-center p-4 border-b border-yellow-400/20 bg-[#111111] z-10">
        <div className="flex items-center space-x-4">
            <Avatar />
            <div>
                <h1 className="text-3xl font-bold font-goldman tracking-wider text-yellow-400">ARSALAN AI</h1>
                <p className="text-sm text-yellow-400/70 text-center">Your Smart Digital Twin ⚡</p>
            </div>
        </div>
    </header>
  );
};
