import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Check, Trash2, Pencil, X, Save } from 'lucide-react';
import { soundManager } from '../utils/SoundManager';

const ChoreItem = ({ chore, onToggle, onDelete, onEdit, isEditing }) => {
    const [editMode, setEditMode] = useState(false);
    const [editText, setEditText] = useState(chore.text);

    const handleToggle = () => {
        if (isEditing) return;
        if (!chore.completed) {
            confetti({
                particleCount: 120,
                spread: 75,
                origin: { y: 0.6 },
                colors: ['#E3000B', '#0055BF', '#FEDD00', '#237841'],
                gravity: 1.2,
                scalar: 1.1,
                shapes: ['square', 'circle'],
            });
            soundManager.playSnap();
        }
        onToggle();
    };

    const handleSaveEdit = () => {
        if (editText.trim()) {
            onEdit(editText.trim());
        }
        setEditMode(false);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') handleSaveEdit();
        if (e.key === 'Escape') { setEditText(chore.text); setEditMode(false); }
    };

    if (editMode) {
        return (
            <div className="flex items-center gap-2 p-3 mb-3 bg-lego-yellow/20 border-2 border-lego-yellow rounded-lg">
                <input
                    autoFocus
                    value={editText}
                    onChange={e => setEditText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="flex-1 px-2 py-1 rounded border-2 border-lego-blue text-slate-800 font-medium text-base outline-none bg-white"
                />
                <button onClick={handleSaveEdit} className="p-1.5 bg-lego-green text-white rounded hover:brightness-110 transition">
                    <Save size={16} />
                </button>
                <button onClick={() => { setEditText(chore.text); setEditMode(false); }} className="p-1.5 bg-slate-200 text-slate-600 rounded hover:bg-slate-300 transition">
                    <X size={16} />
                </button>
            </div>
        );
    }

    return (
        <div
            onClick={handleToggle}
            className={`
                group relative flex items-center justify-between p-4 mb-3
                rounded-lg border-b-[4px] border-r-[2px]
                select-none transition-all duration-75 ease-out
                ${chore.completed
                    ? 'bg-green-50 border-green-300 border-b-green-400 opacity-70 cursor-default'
                    : isEditing
                        ? 'bg-white border-slate-200 border-b-slate-300 cursor-default'
                        : 'bg-white border-slate-200 border-b-slate-300 cursor-pointer hover:border-b-slate-400 hover:brightness-98 active:border-b-[2px] active:translate-y-[2px]'
                }
            `}
        >
            <div className="flex items-center gap-3 flex-1 min-w-0">
                {/* Stud-style checkbox */}
                <div className={`
                    flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2
                    transition-all duration-200
                    ${chore.completed
                        ? 'bg-lego-green border-lego-green-dark shadow-inner'
                        : 'bg-slate-100 border-slate-300 shadow-sm group-hover:bg-slate-50'
                    }
                `}
                    style={{ boxShadow: chore.completed
                        ? 'inset -1px -1px 2px rgba(0,0,0,0.2), inset 1px 1px 2px rgba(255,255,255,0.3)'
                        : 'inset -1px -1px 2px rgba(0,0,0,0.1), 1px 1px 0 rgba(0,0,0,0.08)' }}
                >
                    {chore.completed && <Check size={18} strokeWidth={3} className="text-white" />}
                </div>

                <span className={`
                    text-lg font-medium tracking-tight text-slate-800 flex-1 break-words min-w-0
                    ${chore.completed ? 'line-through text-slate-400' : ''}
                `}>
                    {chore.text}
                </span>
            </div>

            {/* Edit/Delete controls — only visible in edit mode */}
            {isEditing && (
                <div className="flex items-center gap-1 ml-2 shrink-0">
                    <button
                        onClick={e => { e.stopPropagation(); setEditText(chore.text); setEditMode(true); }}
                        className="p-1.5 text-slate-400 hover:text-lego-blue transition-colors rounded"
                        title="Edit chore"
                    >
                        <Pencil size={16} />
                    </button>
                    <button
                        onClick={e => { e.stopPropagation(); if (confirm('Delete this chore?')) onDelete(); }}
                        className="p-1.5 text-slate-400 hover:text-lego-red transition-colors rounded"
                        title="Delete chore"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            )}
        </div>
    );
};

export default ChoreItem;
