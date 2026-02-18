import React, { useState } from 'react';
import { Settings, RefreshCw, DollarSign, X, Lock, Delete } from 'lucide-react';
import BrickCard from './BrickCard';
import BrickButton from './BrickButton';
import { soundManager } from '../utils/SoundManager';

const DEFAULT_PIN = '1234';
const PIN_STORAGE_KEY = 'lego-tracker-pin';

function getStoredPin() {
    return localStorage.getItem(PIN_STORAGE_KEY) || DEFAULT_PIN;
}

// ── PIN Pad ──────────────────────────────────────────────────────────────────
const PinPad = ({ onSuccess, onClose }) => {
    const [entry, setEntry] = useState('');
    const [shaking, setShaking] = useState(false);
    const [error, setError] = useState('');

    const press = (digit) => {
        soundManager.playPinClick();
        if (entry.length >= 4) return;
        const next = entry + digit;
        setEntry(next);
        setError('');
        if (next.length === 4) {
            setTimeout(() => checkPin(next), 150);
        }
    };

    const del = () => {
        soundManager.playPinClick();
        setEntry(e => e.slice(0, -1));
        setError('');
    };

    const checkPin = (pin) => {
        if (pin === getStoredPin()) {
            onSuccess();
        } else {
            setShaking(true);
            setError('Wrong PIN — try again');
            setEntry('');
            setTimeout(() => setShaking(false), 500);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xs overflow-hidden border-b-8 border-r-4 border-lego-blue-dark">
                {/* Header */}
                <div className="bg-lego-blue px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-white font-bold text-lg">
                        <Lock size={20} /> Parent Login
                    </div>
                    <button onClick={onClose} className="text-white/70 hover:text-white transition">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6">
                    {/* PIN dots */}
                    <div className={`flex justify-center gap-4 mb-6 ${shaking ? 'shake' : ''}`}>
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div
                                key={i}
                                className={`h-5 w-5 rounded-full border-2 transition-all duration-150 ${
                                    i < entry.length
                                        ? 'bg-lego-blue border-lego-blue-dark scale-110'
                                        : 'bg-slate-100 border-slate-300'
                                }`}
                                style={i < entry.length ? {
                                    boxShadow: 'inset -1px -1px 2px rgba(0,0,0,0.2), inset 1px 1px 2px rgba(255,255,255,0.4)'
                                } : {}}
                            />
                        ))}
                    </div>

                    {/* Error */}
                    <p className={`text-center text-sm text-lego-red font-bold mb-4 min-h-[20px] transition-opacity ${error ? 'opacity-100' : 'opacity-0'}`}>
                        {error || ' '}
                    </p>

                    {/* Number grid */}
                    <div className="grid grid-cols-3 gap-3">
                        {[1,2,3,4,5,6,7,8,9].map(n => (
                            <button
                                key={n}
                                onClick={() => press(String(n))}
                                className="
                                    lego-interactive
                                    aspect-square rounded-xl text-xl font-bold text-slate-800
                                    bg-slate-100 hover:bg-slate-200
                                    border-b-4 border-r-2 border-slate-300
                                    transition-colors
                                "
                            >
                                {n}
                            </button>
                        ))}
                        {/* Delete */}
                        <button
                            onClick={del}
                            className="lego-interactive aspect-square rounded-xl text-lego-red bg-red-50 hover:bg-red-100 border-b-4 border-r-2 border-red-200 flex items-center justify-center transition-colors"
                        >
                            <Delete size={20} />
                        </button>
                        {/* 0 */}
                        <button
                            onClick={() => press('0')}
                            className="lego-interactive aspect-square rounded-xl text-xl font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 border-b-4 border-r-2 border-slate-300 transition-colors"
                        >
                            0
                        </button>
                        {/* Empty */}
                        <div />
                    </div>

                    <p className="text-center text-xs text-slate-400 mt-4 font-medium">Default PIN: 1234</p>
                </div>
            </div>
        </div>
    );
};

// ── Confirm Dialog ────────────────────────────────────────────────────────────
const ConfirmDialog = ({ title, message, onConfirm, onCancel }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden border-b-8 border-r-4 border-lego-red-dark">
            <div className="bg-lego-red px-6 py-4">
                <h3 className="text-white font-bold text-lg">{title}</h3>
            </div>
            <div className="p-6 space-y-4">
                <p className="text-slate-600 font-medium">{message}</p>
                <div className="flex gap-3">
                    <BrickButton color="red" onClick={onConfirm} className="flex-1">Yes, do it</BrickButton>
                    <BrickButton color="white" onClick={onCancel} className="flex-1">Cancel</BrickButton>
                </div>
            </div>
        </div>
    </div>
);

// ── Main Admin Panel ──────────────────────────────────────────────────────────
const AdminPanel = ({ onResetWeek, onHardReset, bankBalance, setBalance, isEditing, setIsEditing }) => {
    const [panelState, setPanelState] = useState('closed'); // 'closed' | 'pin' | 'open'
    const [manualAmount, setManualAmount] = useState('');
    const [confirm, setConfirm] = useState(null); // { title, message, action }
    const [pinTab, setPinTab] = useState({ changing: false, p1: '', p2: '', msg: '' });

    const openAdmin = () => setPanelState('pin');
    const closePanel = () => { setPanelState('closed'); setIsEditing(false); };

    const handleManualAdd = () => {
        const n = Number(manualAmount);
        if (!manualAmount || isNaN(n)) return;
        setBalance(bankBalance + n);
        setManualAmount('');
    };

    const handleChangePin = () => {
        const { p1, p2 } = pinTab;
        if (!/^\d{4}$/.test(p1)) { setPinTab(t => ({ ...t, msg: 'PIN must be exactly 4 digits' })); return; }
        if (p1 !== p2) { setPinTab(t => ({ ...t, msg: "PINs don't match" })); return; }
        localStorage.setItem(PIN_STORAGE_KEY, p1);
        setPinTab({ changing: false, p1: '', p2: '', msg: 'PIN updated! ✅' });
    };

    if (panelState === 'pin') {
        return <PinPad onSuccess={() => setPanelState('open')} onClose={() => setPanelState('closed')} />;
    }

    if (panelState === 'closed') {
        return (
            <button
                onClick={openAdmin}
                className="fixed bottom-5 right-5 flex h-12 w-12 items-center justify-center rounded-full bg-white text-slate-500 shadow-lg border-b-4 border-r-2 border-slate-200 opacity-60 hover:opacity-100 hover:text-lego-blue transition-all lego-interactive"
                title="Admin panel"
            >
                <Settings size={22} />
            </button>
        );
    }

    // Open panel
    return (
        <>
            {confirm && (
                <ConfirmDialog
                    title={confirm.title}
                    message={confirm.message}
                    onConfirm={() => { confirm.action(); setConfirm(null); }}
                    onCancel={() => setConfirm(null)}
                />
            )}

            <div className="fixed bottom-5 right-5 z-40 w-80">
                <BrickCard color="white" className="shadow-2xl border-2 border-slate-200">
                    <div className="flex items-center justify-between mb-4">
                        <span className="font-bold text-slate-700 flex items-center gap-2">
                            <Settings size={16} /> Parent Controls
                        </span>
                        <button onClick={closePanel} className="text-slate-400 hover:text-slate-600 transition">
                            <X size={18} />
                        </button>
                    </div>

                    <div className="space-y-3">
                        {/* Bank balance */}
                        <div className="bg-lego-yellow/20 rounded-lg p-3 text-center border border-lego-yellow-dark/20">
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Bank Balance</p>
                            <p className="text-3xl font-black text-lego-black">${bankBalance.toFixed(2)}</p>
                        </div>

                        {/* Info box */}
                        <div className="rounded-lg bg-blue-50 border border-blue-200 p-3 text-sm text-blue-800 font-medium">
                            <p className="font-bold mb-0.5">End of Week:</p>
                            <p>Arlo earns <strong>$5</strong> only if ALL chores are done. "Start New Week" resets everything.</p>
                        </div>

                        <BrickButton color="blue" onClick={() => setConfirm({
                            title: '🔄 Start New Week?',
                            message: 'This will check if Arlo earned $5, reset all chores, and start fresh. Ready?',
                            action: onResetWeek,
                        })} className="w-full">
                            <RefreshCw size={16} /> Start New Week
                        </BrickButton>

                        <button
                            onClick={() => setIsEditing(!isEditing)}
                            className={`w-full rounded-lg px-4 py-2.5 font-bold text-white uppercase tracking-wide border-b-4 border-r-2 transition-all lego-interactive ${
                                isEditing
                                    ? 'bg-lego-orange border-lego-orange-dark'
                                    : 'bg-slate-500 border-slate-700'
                            }`}
                        >
                            {isEditing ? '✅ Done Editing' : '✏️ Edit Chores'}
                        </button>

                        <hr className="border-slate-200" />

                        {/* Manual balance adjustment */}
                        <div>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Adjust Balance</p>
                            <div className="flex gap-2">
                                <div className="relative flex-1">
                                    <DollarSign size={14} className="absolute top-3 left-2.5 text-slate-400" />
                                    <input
                                        type="number"
                                        value={manualAmount}
                                        onChange={e => setManualAmount(e.target.value)}
                                        className="w-full rounded-lg border-2 border-slate-200 py-2 pl-7 pr-2 text-sm font-medium text-slate-800 outline-none focus:border-lego-blue"
                                        placeholder="Amount"
                                    />
                                </div>
                                <BrickButton color="green" onClick={handleManualAdd} className="text-sm px-3 py-2">
                                    Add
                                </BrickButton>
                            </div>
                        </div>

                        <hr className="border-slate-200" />

                        {/* Change PIN */}
                        {pinTab.changing ? (
                            <div className="space-y-2">
                                <input
                                    type="password"
                                    maxLength={4}
                                    placeholder="New PIN (4 digits)"
                                    value={pinTab.p1}
                                    onChange={e => setPinTab(t => ({ ...t, p1: e.target.value, msg: '' }))}
                                    className="w-full rounded-lg border-2 border-slate-200 px-3 py-2 text-sm font-medium outline-none focus:border-lego-blue"
                                />
                                <input
                                    type="password"
                                    maxLength={4}
                                    placeholder="Confirm PIN"
                                    value={pinTab.p2}
                                    onChange={e => setPinTab(t => ({ ...t, p2: e.target.value, msg: '' }))}
                                    className="w-full rounded-lg border-2 border-slate-200 px-3 py-2 text-sm font-medium outline-none focus:border-lego-blue"
                                />
                                {pinTab.msg && <p className={`text-xs font-bold ${pinTab.msg.includes('✅') ? 'text-lego-green' : 'text-lego-red'}`}>{pinTab.msg}</p>}
                                <div className="flex gap-2">
                                    <BrickButton color="blue" onClick={handleChangePin} className="flex-1 text-sm py-2">Save PIN</BrickButton>
                                    <BrickButton color="white" onClick={() => setPinTab({ changing: false, p1: '', p2: '', msg: '' })} className="flex-1 text-sm py-2">Cancel</BrickButton>
                                </div>
                            </div>
                        ) : (
                            <button
                                onClick={() => setPinTab(t => ({ ...t, changing: true }))}
                                className="w-full text-sm text-slate-500 hover:text-lego-blue font-bold text-left transition"
                            >
                                🔐 Change PIN
                            </button>
                        )}

                        {/* Hard reset */}
                        <button
                            onClick={() => setConfirm({
                                title: '⚠️ Reset Everything?',
                                message: 'This deletes ALL data including savings and custom chores. This cannot be undone!',
                                action: onHardReset,
                            })}
                            className="w-full rounded-lg border-2 border-red-200 bg-red-50 p-2 text-xs font-bold text-red-600 hover:bg-red-100 transition"
                        >
                            Reset All App Data
                        </button>
                    </div>
                </BrickCard>
            </div>
        </>
    );
};

export default AdminPanel;
