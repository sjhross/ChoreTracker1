import { useState, useEffect } from 'react';

const STORAGE_KEY = 'lego-chore-tracker-v6';

const INITIAL_SCHEDULE = {
    Monday: [{ id: 'mon-bins', text: 'Help put the bins out', completed: false }],
    Tuesday: [
        { id: 'tue-room', text: 'Clean bedroom', completed: false },
        { id: 'tue-bins', text: 'Bring in bins', completed: false }
    ],
    Wednesday: [],
    Thursday: [{ id: 'thu-toys', text: 'Clean the toys room', completed: false }],
    Friday: [],
    Saturday: [],
    Sunday: [{ id: 'sun-toys', text: 'Clean the toys room', completed: false }],
};

const INITIAL_STATE = {
    schedule: INITIAL_SCHEDULE,
    bankBalance: 0,
    goal: {
        itemName: 'Avengers Endgame: Final Battle (76323)',
        itemPrice: 150,
        currentSavings: 0,
        imageUrl: 'https://images.brickset.com/sets/images/76323-1.jpg',
    },
};

export function useChoreStore() {
    const [state, setState] = useState(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) return JSON.parse(saved);
        } catch (e) { /* ignore parse errors */ }
        return INITIAL_STATE;
    });

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }, [state]);

    const toggleChore = (day, choreId) => {
        setState(prev => ({
            ...prev,
            schedule: {
                ...prev.schedule,
                [day]: prev.schedule[day].map(c =>
                    c.id === choreId ? { ...c, completed: !c.completed } : c
                ),
            },
        }));
    };

    const addChore = (day, text) => {
        const newChore = { id: `${day}-${Date.now()}`, text, completed: false };
        setState(prev => ({
            ...prev,
            schedule: {
                ...prev.schedule,
                [day]: [...prev.schedule[day], newChore],
            },
        }));
    };

    const deleteChore = (day, choreId) => {
        setState(prev => ({
            ...prev,
            schedule: {
                ...prev.schedule,
                [day]: prev.schedule[day].filter(c => c.id !== choreId),
            },
        }));
    };

    // Bug fix: was missing from WeekView wiring — now properly implemented
    const editChore = (day, choreId, newText) => {
        setState(prev => ({
            ...prev,
            schedule: {
                ...prev.schedule,
                [day]: prev.schedule[day].map(c =>
                    c.id === choreId ? { ...c, text: newText } : c
                ),
            },
        }));
    };

    const updateGoal = (itemName, itemPrice, imageUrl) => {
        setState(prev => ({
            ...prev,
            goal: { ...prev.goal, itemName, itemPrice: Number(itemPrice), imageUrl },
        }));
    };

    const resetWeek = () => {
        setState(prev => {
            const allChores = Object.values(prev.schedule).flat();
            const totalChores = allChores.length;
            const completedChores = allChores.filter(c => c.completed).length;
            // All-or-nothing: only pay $5 if every chore is done
            const pay = (totalChores > 0 && completedChores === totalChores) ? 5 : 0;

            const newSchedule = {};
            Object.keys(prev.schedule).forEach(day => {
                newSchedule[day] = prev.schedule[day].map(c => ({ ...c, completed: false }));
            });

            return { ...prev, bankBalance: prev.bankBalance + pay, schedule: newSchedule };
        });
    };

    // Bug fix: was clearing 'v3' key instead of the correct key
    const hardReset = () => {
        localStorage.removeItem(STORAGE_KEY);
        setState(INITIAL_STATE);
    };

    const setBalance = (amount) => {
        setState(prev => ({ ...prev, bankBalance: amount }));
    };

    const allChores = Object.values(state.schedule).flat();
    const totalChoresCount = allChores.length;
    const completedChoresCount = allChores.filter(c => c.completed).length;

    return {
        state,
        schedule: state.schedule,
        bankBalance: state.bankBalance,
        goal: state.goal,
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
    };
}
