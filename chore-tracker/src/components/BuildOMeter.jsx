import React, { useState } from 'react';
import { Edit2, Trophy } from 'lucide-react';
import BrickCard from './BrickCard';
import BrickButton from './BrickButton';

const BuildOMeter = ({ currentAmount, goal, onUpdateGoal }) => {
        const [isEditing, setIsEditing] = useState(false);
        const [tempName, setTempName] = useState(goal.itemName);
        const [tempPrice, setTempPrice] = useState(goal.itemPrice);
        const [tempImage, setTempImage] = useState(goal.imageUrl || '');

        const percentage = goal.itemPrice > 0 ? Math.min(100, Math.max(0, (currentAmount / goal.itemPrice) * 100)) : 0;
        const totalStuds = 12;
        const filledStuds = currentAmount > 0 ? Math.max(1, Math.floor((percentage / 100) * totalStuds)) : 0;

        const handleSave = () => {
                    if (tempName && tempPrice) {
                                    onUpdateGoal(tempName, tempPrice, tempImage);
                                    setIsEditing(false);
                    }
        };

        return (
                    <BrickCard color="yellow" className="border-t-0">
                                <div className="flex flex-col gap-5 md:flex-row md:items-start">
                                    {goal.imageUrl && !isEditing && (
                                            <div className="shrink-0 mx-auto md:mx-0">
                                                                    <img
                                                                                                    src={goal.imageUrl}
                                                                                                    alt="Goal"
                                                                                                    className="h-28 w-28 rounded-xl border-4 border-lego-yellow-dark object-cover shadow-lg"
                                                                                                />
                                            </div>div>
                                                )}
                                
                                                <div className="flex-1 space-y-4">
                                                                    <div className="flex items-start justify-between gap-2">
                                                                                            <h3 className="text-xl font-bold text-lego-black leading-tight">{goal.itemName}</h3>h3>
                                                                                            <span className="text-base font-bold text-lego-black/60 shrink-0 mt-0.5">
                                                                                                                        ${currentAmount} / ${goal.itemPrice}
                                                                                                </span>span>
                                                                    </div>div>
                                                
                                                                    <div>
                                                                                            <p className="text-xs font-bold text-lego-black/50 uppercase tracking-widest mb-2">Build Progress</p>p>
                                                                                            <div className="flex gap-1.5 p-2 bg-lego-yellow-dark/30 rounded-lg w-fit">
                                                                                                {Array.from({ length: totalStuds }).map((_, i) => (
                                                        <div
                                                                                                key={i}
                                                                                                className={`h-5 w-5 rounded-full transition-all duration-500 ${i < filledStuds
                                                                                                                                                                                                       ? 'bg-lego-green shadow-[inset_-1px_-1px_2px_rgba(0,0,0,0.25),inset_1px_1px_2px_rgba(255,255,255,0.4)] scale-110'
                                                                                                                                                                                                       : 'bg-lego-black/20 shadow-inner'
                                                                                                                                                               }`}
                                                                                            />
                                                    ))}
                                                                                                </div>div>
                                                                    </div>div>
                                                
                                                                    <div className="relative h-8 w-full overflow-hidden rounded-full bg-lego-yellow-dark/30 shadow-inner">
                                                                                            <div
                                                                                                                            className="absolute top-0 left-0 h-full bg-lego-green stud-texture transition-all duration-1000 ease-out"
                                                                                                                            style={{ width: `${percentage}%` }}
                                                                                                                        >
                                                                                                                        <div className="absolute top-0 left-0 h-1/2 w-full bg-white/20" />
                                                                                                </div>div>
                                                                                            <span className="absolute inset-0 flex items-center justify-center text-sm font-black text-lego-black drop-shadow z-10">
                                                                                                {Math.round(percentage)}%
                                                                                                </span>span>
                                                                    </div>div>
                                                
                                                    {percentage >= 100 && (
                                                <div className="flex items-center justify-center gap-2 text-lego-green font-bold animate-bounce">
                                                                            <Trophy size={18} />
                                                                            <span>Goal Reached! Time to build!</span>span>
                                                                            <Trophy size={18} />
                                                </div>div>
                                                                    )}
                                                </div>div>
                                
                                                <div className="shrink-0">
                                                    {isEditing ? (
                                                <div className="flex flex-col gap-2 rounded-xl bg-white/60 p-3 min-w-[180px]">
                                                                            <input
                                                                                                                className="rounded-lg border-2 border-slate-200 px-2 py-1.5 text-sm font-medium text-slate-800 outline-none focus:border-lego-blue"
                                                                                                                value={tempName}
                                                                                                                onChange={e => setTempName(e.target.value)}
                                                                                                                placeholder="Goal name"
                                                                                                            />
                                                                            <input
                                                                                                                className="rounded-lg border-2 border-slate-200 px-2 py-1.5 text-sm font-medium text-slate-800 outline-none focus:border-lego-blue"
                                                                                                                type="number"
                                                                                                                value={tempPrice}
                                                                                                                onChange={e => setTempPrice(e.target.value)}
                                                                                                                placeholder="Price ($)"
                                                                                                            />
                                                                            <input
                                                                                                                className="rounded-lg border-2 border-slate-200 px-2 py-1.5 text-sm font-medium text-slate-800 outline-none focus:border-lego-blue"
                                                                                                                value={tempImage}
                                                                                                                onChange={e => setTempImage(e.target.value)}
                                                                                                                placeholder="Image URL"
                                                                                                            />
                                                                            <BrickButton color="green" onClick={handleSave} className="w-full text-sm py-2">
                                                                                                            Save
                                                                                </BrickButton>BrickButton>
                                                                            <button onClick={() => setIsEditing(false)} className="text-xs text-slate-500 hover:text-slate-700 text-center">
                                                                                                            Cancel
                                                                                </button>button>
                                                </div>div>
                                            ) : (
                                                <button
                                                                                onClick={() => setIsEditing(true)}
                                                                                className="flex items-center gap-2 rounded-lg bg-lego-yellow-dark/30 hover:bg-lego-yellow-dark/50 px-3 py-2 text-sm font-bold text-lego-black transition"
                                                                            >
                                                                            <Edit2 size={15} /> Edit Goal
                                                </button>button>
                                                                    )}
                                                </div>div>
                                </div>div>
                    </BrickCard>BrickCard>
                );
};

export default BuildOMeter;</BrickCard>
