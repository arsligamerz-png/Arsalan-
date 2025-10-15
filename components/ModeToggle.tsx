
import React from 'react';
import { ChatMode } from '../types';

interface ModeToggleProps {
    mode: ChatMode;
    setMode: (mode: ChatMode) => void;
}

export const ModeToggle: React.FC<ModeToggleProps> = ({ mode, setMode }) => {
    return (
        <div className="flex justify-center py-2 bg-[#1a1a1a]">
            <div className="flex p-1 rounded-full bg-gray-800 border border-yellow-400/20">
                <button
                    onClick={() => setMode(ChatMode.Fun)}
                    className={`px-4 py-1 text-sm rounded-full transition-colors duration-300 ${mode === ChatMode.Fun ? 'bg-yellow-400 text-black font-semibold' : 'text-gray-400 hover:bg-gray-700'}`}
                >
                    Fun Mode
                </button>
                <button
                    onClick={() => setMode(ChatMode.Focus)}
                    className={`px-4 py-1 text-sm rounded-full transition-colors duration-300 ${mode === ChatMode.Focus ? 'bg-yellow-400 text-black font-semibold' : 'text-gray-400 hover:bg-gray-700'}`}
                >
                    Focus Mode
                </button>
            </div>
        </div>
    );
};
