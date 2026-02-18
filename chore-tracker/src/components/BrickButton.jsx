import React from 'react';
import { soundManager } from '../utils/SoundManager';

const COLOR_MAP = {
    red:    'bg-lego-red text-white border-b-lego-red-dark border-r-lego-red-dark hover:brightness-110',
    blue:   'bg-lego-blue text-white border-b-lego-blue-dark border-r-lego-blue-dark hover:brightness-110',
    green:  'bg-lego-green text-white border-b-lego-green-dark border-r-lego-green-dark hover:brightness-110',
    yellow: 'bg-lego-yellow text-lego-black border-b-lego-yellow-dark border-r-lego-yellow-dark hover:brightness-105',
    orange: 'bg-lego-orange text-white border-b-lego-orange-dark border-r-lego-orange-dark hover:brightness-110',
    white:  'bg-white text-lego-black border-b-slate-300 border-r-slate-300 hover:bg-slate-50',
};

const BrickButton = ({ children, onClick, color = 'blue', className = '', disabled = false, ...props }) => {
    const handleClick = (e) => {
        soundManager.playSnap();
        if (onClick) onClick(e);
    };

    return (
        <button
            onClick={handleClick}
            disabled={disabled}
            className={`
                lego-interactive
                flex items-center justify-center gap-2
                rounded-lg px-5 py-3
                text-base font-bold uppercase tracking-wide
                border-b-[5px] border-r-[3px]
                select-none cursor-pointer
                disabled:opacity-40 disabled:cursor-not-allowed
                transition-all
                ${COLOR_MAP[color] || COLOR_MAP.blue}
                ${className}
            `}
            {...props}
        >
            {children}
        </button>
    );
};

export default BrickButton;
