class SoundManager {
    constructor() {
        this.ctx = null;
        this.enabled = true;
    }

    _getCtx() {
        if (!this.ctx) {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        }
        return this.ctx;
    }

    playSnap() {
        if (!this.enabled) return;
        try {
            const ctx = this._getCtx();
            this._resume(ctx);
            const t = ctx.currentTime;

            const osc1 = ctx.createOscillator();
            const gain1 = ctx.createGain();
            osc1.type = 'square';
            osc1.frequency.setValueAtTime(150, t);
            osc1.frequency.exponentialRampToValueAtTime(40, t + 0.1);
            gain1.gain.setValueAtTime(0.4, t);
            gain1.gain.exponentialRampToValueAtTime(0.01, t + 0.1);
            osc1.connect(gain1);
            gain1.connect(ctx.destination);
            osc1.start(t);
            osc1.stop(t + 0.1);

            const osc2 = ctx.createOscillator();
            const gain2 = ctx.createGain();
            osc2.type = 'triangle';
            osc2.frequency.setValueAtTime(800, t);
            osc2.frequency.exponentialRampToValueAtTime(100, t + 0.05);
            gain2.gain.setValueAtTime(0.25, t);
            gain2.gain.exponentialRampToValueAtTime(0.01, t + 0.05);
            osc2.connect(gain2);
            gain2.connect(ctx.destination);
            osc2.start(t);
            osc2.stop(t + 0.05);
        } catch (e) { /* silently fail if audio not available */ }
    }

    playSuccess() {
        if (!this.enabled) return;
        try {
            const ctx = this._getCtx();
            this._resume(ctx);
            const t = ctx.currentTime;
            this._playTone(ctx, 523.25, 'sine', t, 0.1);
            this._playTone(ctx, 659.25, 'sine', t + 0.1, 0.1);
            this._playTone(ctx, 783.99, 'sine', t + 0.2, 0.2);
            this._playTone(ctx, 1046.50, 'square', t + 0.3, 0.4);
        } catch (e) { /* silently fail */ }
    }

    playPinClick() {
        if (!this.enabled) return;
        try {
            const ctx = this._getCtx();
            this._resume(ctx);
            const t = ctx.currentTime;
            this._playTone(ctx, 440, 'sine', t, 0.06);
        } catch (e) { /* silently fail */ }
    }

    _playTone(ctx, freq, type, startTime, duration) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, startTime);
        gain.gain.setValueAtTime(0.25, startTime);
        gain.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + duration);
    }

    _resume(ctx) {
        if (ctx.state === 'suspended') ctx.resume();
    }
}

export const soundManager = new SoundManager();
