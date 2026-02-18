import React, { useState } from 'react';
import { useChoreStore } from './hooks/useChoreStore';
import BuildOMeter from './components/BuildOMeter';
import WeekView from './components/WeekView';
import AdminPanel from './components/AdminPanel';

function App() {
    const [isEditing, setIsEditing] = useState(false);

    const {
        state,
        schedule,
        bankBalance,
        goal,
        toggleChore,
        addChore,
        deleteChore,
        editChore,
        updateGoal,
        resetWeek,
        hardReset,
        setBalance,
        completedChoresCount,
        totalChoresCount,
    } = useChoreStore();

    const isWeekComplete = completedChoresCount > 0 && completedChoresCount === totalChoresCount;

    return (
        <div className="min-h-screen">
            <div className="max-w-6xl mx-auto px-4 md:px-8 py-8 pb-32 space-y-8">

                {/* HEADER */}
                <header className="flex flex-col md:flex-row justify-between items-start gap-6">
                    <div className="text-center md:text-left">
                        <h1
                            className="text-7xl md:text-9xl font-black text-lego-red uppercase tracking-tight leading-none"
                            style={{
                                textShadow: '6px 6px 0px #900000, 7px 7px 0px rgba(0,0,0,0.25)',
                                WebkitTextStroke: '1px rgba(0,0,0,0.1)'
                            }}
                        >
                            ARLO'S
                        </h1>
                        <div className="flex flex-wrap gap-x-4 leading-none mt-1">
                            <h1
                                className="text-7xl md:text-9xl font-black text-lego-blue uppercase tracking-tight leading-none"
                                style={{
                                    textShadow: '6px 6px 0px #002E66, 7px 7px 0px rgba(0,0,0,0.25)',
                                    WebkitTextStroke: '1px rgba(0,0,0,0.1)'
                                }}
                            >
                                CHORE
                            </h1>
                            <h1
                                className="text-7xl md:text-9xl font-black text-lego-yellow uppercase tracking-tight leading-none"
                                style={{
                                    textShadow: '6px 6px 0px #BFA600, 7px 7px 0px rgba(0,0,0,0.25)',
                                    WebkitTextStroke: '2px rgba(0,0,0,0.15)'
                                }}
                            >
                                TRACKER
                            </h1>
                        </div>
                        <p
                            className="text-white font-black text-xl mt-3 uppercase tracking-wide"
                            style={{ textShadow: '2px 2px 0px rgba(0,0,0,0.5)' }}
                        >
                            🧱 Do your chores, build more stuff
                        </p>
                    </div>

                    {/* Weekly progress card */}
                    <div className={`
                        relative rounded-2xl px-8 py-5 text-center transition-all duration-500 min-w-[250px] shrink-0
                        border-b-8 border-r-4
                        ${isWeekComplete
                            ? 'bg-lego-yellow border-lego-yellow-dark gold-pulse'
                            : 'bg-white border-slate-200'
                        }
                    `}>
                        {isWeekComplete && (
                            <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-transparent via-white/30 to-transparent animate-pulse pointer-events-none" />
                        )}
                        <p className="text-xs font-black uppercase tracking-widest opacity-60 mb-1">
                            {isWeekComplete ? '🏆 WEEK COMPLETE!' : 'Weekly Progress'}
                        </p>
                        {isWeekComplete ? (
                            <p className="text-2xl font-black text-lego-black leading-tight">
                                GOLD BRICK<br />STATUS! ✨
                            </p>
                        ) : (
                            <>
                                <p className="text-5xl font-black text-lego-black leading-none">
                                    {completedChoresCount}
                                    <span className="text-2xl text-slate-400 font-black"> / {totalChoresCount}</span>
                                </p>
                                <p className="text-sm font-bold text-slate-500 mt-1">chores done this week</p>
                                <p className="text-xs font-black text-lego-green mt-1 uppercase tracking-wide">
                                    Complete ALL → earn $5 🎉
                                </p>
                            </>
                        )}
                    </div>
                </header>

                {/* BUILD-O-METER */}
                <section>
                    <BuildOMeter
                        currentAmount={bankBalance}
                        goal={goal}
                        onUpdateGoal={updateGoal}
                    />
                </section>

                {/* WEEKLY CHORES */}
                <section>
                    <div className="flex items-center gap-3 mb-5">
                        <h2 className="text-2xl font-black text-white uppercase tracking-wide drop-shadow">
                            This Week's Missions
                        </h2>
                        <div className="flex-1 h-1 bg-white/20 rounded-full" />
                        {isEditing && (
                            <span className="bg-lego-orange text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                Edit Mode
                            </span>
                        )}
                    </div>
                    <WeekView
                        schedule={schedule}
                        onToggleChore={toggleChore}
                        isEditing={isEditing}
                        onAddChore={addChore}
                        onDeleteChore={deleteChore}
                        onEditChore={editChore}
                    />
                </section>
            </div>

            {/* ADMIN PANEL */}
            <AdminPanel
                onResetWeek={resetWeek}
                onHardReset={hardReset}
                bankBalance={bankBalance}
                setBalance={setBalance}
                isEditing={isEditing}
                setIsEditing={setIsEditing}
            />
        </div>
    );
}

export default App;
