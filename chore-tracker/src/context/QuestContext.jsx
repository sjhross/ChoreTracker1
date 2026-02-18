import React, { createContext, useContext, useState, useEffect } from 'react';

const QuestContext = createContext();

export const useQuest = () => useContext(QuestContext);

export const QuestProvider = ({ children }) => {
    const [role, setRole] = useState(() => localStorage.getItem('quest_role') || 'KID');
    const [gold, setGold] = useState(() => parseInt(localStorage.getItem('quest_gold')) || 0);
    const [xp, setXP] = useState(() => parseInt(localStorage.getItem('quest_xp')) || 0);

    const [quests, setQuests] = useState(() => {
        const saved = localStorage.getItem('quest_list');
        return saved ? JSON.parse(saved) : [
            { id: 1, title: 'Clean Room', reward: 50, xp: 100, status: 'active' },
            { id: 2, title: 'Brush Teeth', reward: 10, xp: 20, status: 'active' },
        ];
    });

    useEffect(() => {
        localStorage.setItem('quest_role', role);
        localStorage.setItem('quest_gold', gold);
        localStorage.setItem('quest_xp', xp);
        localStorage.setItem('quest_list', JSON.stringify(quests));
    }, [role, gold, xp, quests]);

    const addQuest = (quest) => setQuests([...quests, { ...quest, id: Date.now(), status: 'active' }]);

    const completeQuest = (id) =>
        setQuests(quests.map(q => q.id === id ? { ...q, status: 'pending' } : q));

    const approveQuest = (id) => {
        const quest = quests.find(q => q.id === id);
        if (quest?.status === 'pending') {
            setGold(prev => prev + quest.reward);
            setXP(prev => prev + quest.xp);
            setQuests(quests.map(q => q.id === id ? { ...q, status: 'completed' } : q));
        }
    };

    const deleteQuest = (id) => setQuests(quests.filter(q => q.id !== id));

    const resetProgress = () => {
        setGold(0);
        setXP(0);
        setQuests(quests.map(q => ({ ...q, status: 'active' })));
    };

    return (
        <QuestContext.Provider value={{
            role, setRole,
            gold, setGold,
            xp, qs: quests,
            addQuest, completeQuest, approveQuest, deleteQuest, resetProgress
        }}>
            {children}
        </QuestContext.Provider>
    );
};
