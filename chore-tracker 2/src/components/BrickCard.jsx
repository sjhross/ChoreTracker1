import React from 'react';

// Number of studs across the top per colour
const STUD_COUNT = 4;

const COLOR_MAP = {
    red:    { bg: 'bg-lego-red',    border: 'border-lego-red-dark',    stud: 'bg-red-400',     plate: 'bg-red-800/40',   text: 'text-white' },
    blue:   { bg: 'bg-lego-blue',   border: 'border-lego-blue-dark',   stud: 'bg-blue-400',    plate: 'bg-blue-900/40',  text: 'text-white' },
    yellow: { bg: 'bg-lego-yellow', border: 'border-lego-yellow-dark', stud: 'bg-yellow-300',  plate: 'bg-yellow-600/30',text: 'text-lego-black' },
    green:  { bg: 'bg-lego-green',  border: 'border-lego-green-dark',  stud: 'bg-green-400',   plate: 'bg-green-900/40', text: 'text-white' },
    white:  { bg: 'bg-white',       border: 'border-lego-white-dark',  stud: 'bg-slate-200',   plate: 'bg-slate-200/60', text: 'text-lego-black' },
    orange: { bg: 'bg-lego-orange', border: 'border-lego-orange-dark', stud: 'bg-orange-300',  plate: 'bg-orange-900/40',text: 'text-white' },
};

const BrickCard = ({ children, color = 'white', title, className = '' }) => {
    const s = COLOR_MAP[color] || COLOR_MAP.white;

    return (
        <div className={`relative flex flex-col ${s.bg} ${s.text} ${className} rounded-xl border-b-[10px] border-r-[4px] ${s.border}`}>

            {/* Stud row across the top */}
            <div className={`relative z-10 px-3 pt-3 pb-1 flex justify-center gap-3 ${s.plate} rounded-t-xl`}>
                {Array.from({ length: STUD_COUNT }).map((_, i) => (
                    <div
                        key={i}
                        className={`
                            h-5 w-5 md:h-6 md:w-6 rounded-full ${s.stud}
                            shadow-[inset_-2px_-2px_3px_rgba(0,0,0,0.25),inset_2px_2px_3px_rgba(255,255,255,0.35)]
                            border border-black/10
                        `}
                    />
                ))}
            </div>

            {/* Card body */}
            <div className="relative z-10 p-4 flex-1 flex flex-col">
                {title && (
                    <h2 className="text-center text-xl md:text-2xl font-bold uppercase tracking-wider mb-4 opacity-90"
                        style={{ textShadow: '1px 1px 0 rgba(0,0,0,0.2)' }}>
                        {title}
                    </h2>
                )}
                {children}
            </div>
        </div>
    );
};

export default BrickCard;
