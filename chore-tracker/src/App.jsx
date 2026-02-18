import React, { useState } from 'react';
import { useChoreStore } from './hooks/useChoreStore';
import BrickCard from './components/BrickCard';
import WeekView from './components/WeekView';
import BuildOMeter from './components/BuildOMeter';
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

    const progressPercent = goal.itemPrice > 0
        ? Math.min((state.goal.currentSavings / state.goal.itemPrice) * 100, 100)
        : 0;

    const savingsPercent = goal.itemPrice > 0
        ? Math.min((bankBalance / goal.itemPrice) * 100, 100)
        : 0;

    const isWeekComplete = completedChoresCount > 0 && completedChoresCount === totalChoresCount;

    return (
        <div className="min-h-screen">
            {/* Inner page wrapper — sits on top of the baseplate background */}
            <div className="max-w-6xl mx-auto px-4 md:px-8 py-8 pb-32 space-y-8">

                {/* ── HEADER ─────────────────────────────────────────────────── */}
                <header className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="text-center md:text-left">
                        <h1
                            className="text-5xl md:text-7xl font-black text-lego-red uppercase tracking-tight leading-none"
                            style={{ textShadow: '4px 4px 0px rgba(0,0,0,0.15), -1px -1px 0 rgba(0,0,0,0.05)' }}
                        >
                            ARLO'S
                        </h1>
                        <h1
                            className="text-5xl md:text-7xl font-black text-lego-blue uppercase tracking-tight leading-none"
                            style={{ textShadow: '4px 4px 0px rgba(0,0,0,0.15)' }}
                        >
                            CHORE <span className="text-lego-yellow" style={{ WebkitTextStroke: '2px rgba(0,0,0,0.15)' }}>TRACKER</span>
                        </h1>
                        <p className="text-white/80 font-bold text-base mt-2 tracking-wider drop-shadow">
                            Earn bricks. Build your world. 🧱
                        </p>
                    </div>

                    {/* Weekly earnings status — becomes Gold Brick when complete */}
                    <div className={`
                        rounded-2xl px-8 py-5 text-center transition-all duration-500 min-w-[220px]
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
                            {isWeekComplete ? '🏆 WEEK COMPLETE!' : 'Weekly Earnings'}
                        </p>
                        {isWeekComplete ? (
                            <p className="text-2xl font-black text-lego-black leading-tight">
                                GOLD BRICK<br/>STATUS! ✨
                            </p>
                        ) : (
                            <>
                                <p className="text-4xl font-black text-lego-black">
                                    {completedChoresCount}<span className="text-xl opacity-40">/{totalChoresCount}</span>
                                </p>
                                <p className="text-xs font-bold text-slate-500 mt-1">
                                    Complete ALL for <span className="text-lego-green font-black">$5</span>
                                </p>
                            </>
                        )}
                    </div>
                </header>

                {/* ── BUILD-O-METER ───────────────────────────────────────────── */}
                <section>
                    <BuildOMeter
                        currentAmount={bankBalance}
                        goal={goal}
                        onUpdateGoal={updateGoal}
                    />
                </section>

                {/* ── WEEKLY CHORES ───────────────────────────────────────────── */}
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

            {/* ── ADMIN PANEL (floating) ──────────────────────────────────────── */}
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
