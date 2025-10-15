
import React from 'react';

export const Avatar: React.FC = () => {
    return (
        <div className="relative flex items-center justify-center w-14 h-14 rounded-full bg-black">
            <div className="absolute inset-0 rounded-full bg-yellow-400 animate-pulse opacity-20 blur-lg"></div>
            <span className="font-goldman text-3xl font-bold text-yellow-400 z-10">A</span>
        </div>
    );
};
