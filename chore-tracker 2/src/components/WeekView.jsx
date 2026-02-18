import React from 'react';
import { Plus } from 'lucide-react';
import BrickCard from './BrickCard';
import ChoreItem from './ChoreItem';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const DAY_COLORS = {
    Monday: 'red',
    Tuesday: 'blue',
    Wednesday: 'orange',
    Thursday: 'green',
    Friday: 'red',
    Saturday: 'yellow',
    Sunday: 'orange',
};

const WeekView = ({ schedule, onToggleChore, isEditing, onAddChore, onDeleteChore, onEditChore }) => {
    const activeDays = isEditing
        ? DAYS
        : DAYS.filter(day => schedule[day]?.length > 0);

    return (
        <div className="flex flex-wrap justify-center gap-5 pb-20">
            {activeDays.map(day => {
                const chores = schedule[day] || [];
                const isAllDone = chores.length > 0 && chores.every(c => c.completed);
                const cardColor = isAllDone ? 'green' : DAY_COLORS[day] || 'blue';

                return (
                    <div key={day} className="w-full md:w-[calc(50%-10px)] lg:w-[calc(25%-15px)] min-h-[220px] flex">
                        <BrickCard title={day} color={cardColor} className="w-full">
                            <div className="flex flex-col">
                                {chores.length === 0 && !isEditing && (
                                    <p className="opacity-60 italic text-sm font-medium text-center py-4">
                                        No chores today!
                                    </p>
                                )}

                                {chores.map(chore => (
                                    <ChoreItem
                                        key={chore.id}
                                        chore={chore}
                                        onToggle={() => onToggleChore(day, chore.id)}
                                        onDelete={() => onDeleteChore(day, chore.id)}
                                        onEdit={(newText) => onEditChore(day, chore.id, newText)}
                                        isEditing={isEditing}
                                    />
                                ))}

                                {/* Add chore form — edit mode only */}
                                {isEditing && (
                                    <form
                                        onSubmit={e => {
                                            e.preventDefault();
                                            const input = e.target.elements.choreText;
                                            if (input.value.trim()) {
                                                onAddChore(day, input.value.trim());
                                                input.value = '';
                                            }
                                        }}
                                        className="mt-2 flex gap-2"
                                    >
                                        <input
                                            name="choreText"
                                            type="text"
                                            placeholder="Add chore..."
                                            className="flex-1 rounded-lg px-3 py-2 text-sm border-2 border-slate-300 bg-white text-slate-800 font-medium shadow-inner outline-none focus:border-lego-yellow"
                                        />
                                        <button
                                            type="submit"
                                            className="bg-lego-green hover:brightness-110 text-white p-2 rounded-lg shadow border-b-2 border-lego-green-dark transition"
                                        >
                                            <Plus size={16} />
                                        </button>
                                    </form>
                                )}

                                {isAllDone && chores.length > 0 && !isEditing && (
                                    <div className="mt-3 text-center text-sm font-bold uppercase tracking-wider opacity-90 animate-pulse">
                                        ⭐ Day Complete! ⭐
                                    </div>
                                )}
                            </div>
                        </BrickCard>
                    </div>
                );
            })}
        </div>
    );
};

export default WeekView;
