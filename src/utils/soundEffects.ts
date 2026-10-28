// Tactile sound synthesizer using Web Audio API with zero external dependencies

class SoundManager {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;
  private ambientSource: AudioNode | null = null;
  private ambientGain: GainNode | null = null;
  private tickingInterval: number | null = null;

  constructor() {
    const saved = localStorage.getItem('km_sound_enabled');
    if (saved !== null) {
      this.enabled = saved === 'true';
    }
  }

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public toggleSound(val?: boolean) {
    this.enabled = val !== undefined ? val : !this.enabled;
    localStorage.setItem('km_sound_enabled', String(this.enabled));
    if (!this.enabled) {
      this.stopAmbient();
    }
    return this.enabled;
  }

  // Tactile "Task Popper" audio feedback: an energetic, bright, percussive pop & resonant ping
  public playTaskPop() {
    if (!this.enabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    // Pop impulse
    const oscPop = ctx.createOscillator();
    const gainPop = ctx.createGain();
    oscPop.type = 'sine';
    oscPop.frequency.setValueAtTime(440, now);
    oscPop.frequency.exponentialRampToValueAtTime(880, now + 0.08);

    gainPop.gain.setValueAtTime(0.35, now);
    gainPop.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

    oscPop.connect(gainPop);
    gainPop.connect(ctx.destination);
    oscPop.start(now);
    oscPop.stop(now + 0.1);

    // Warm high chime (E6 ~ 1318Hz -> G6 ~ 1567Hz)
    const oscChime = ctx.createOscillator();
    const gainChime = ctx.createGain();
    oscChime.type = 'triangle';
    oscChime.frequency.setValueAtTime(1046.5, now + 0.04);
    oscChime.frequency.exponentialRampToValueAtTime(1567.98, now + 0.15);

    gainChime.gain.setValueAtTime(0.001, now);
    gainChime.gain.setValueAtTime(0.2, now + 0.04);
    gainChime.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);

    oscChime.connect(gainChime);
    gainChime.connect(ctx.destination);
    oscChime.start(now + 0.04);
    oscChime.stop(now + 0.35);
  }

  // Soft tactile mechanical click for buttons
  public playClick() {
    if (!this.enabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(120, now + 0.03);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.04);
  }

  // Victorious streak reward sound
  public playStreakFanfare() {
    if (!this.enabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    const now = ctx.currentTime;

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const startTime = now + idx * 0.07;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.25, startTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.45);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(startTime);
      osc.stop(startTime + 0.5);
    });
  }

  // Timer complete chime
  public playTimerComplete() {
    if (!this.enabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const notes = [659.25, 880, 1174.66]; // E5, A5, D6
    const now = ctx.currentTime;

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const startTime = now + idx * 0.12;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.3, startTime + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.8);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(startTime);
      osc.stop(startTime + 0.85);
    });
  }

  // Ambient focus sound generators
  public setAmbient(type: 'none' | 'whitenoise' | 'rain' | 'ticking', volume = 0.15) {
    this.stopAmbient();
    if (type === 'none' || !this.enabled) return;

    const ctx = this.getContext();
    if (!ctx) return;

    if (type === 'whitenoise' || type === 'rain') {
      const bufferSize = 2 * ctx.sampleRate;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        if (type === 'rain') {
          // Pink/brown filtered noise
          output[i] = (lastOut + 0.02 * white) / 1.02;
          lastOut = output[i];
          output[i] *= 3.5;
        } else {
          output[i] = white * 0.3;
        }
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = type === 'rain' ? 'lowpass' : 'bandpass';
      filter.frequency.setValueAtTime(type === 'rain' ? 800 : 1200, ctx.currentTime);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(volume * (type === 'rain' ? 0.3 : 0.15), ctx.currentTime);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      whiteNoise.start();
      this.ambientSource = whiteNoise;
      this.ambientGain = gain;
    } else if (type === 'ticking') {
      // Soft rhythmic mechanical clock tick
      const tick = () => {
        if (!this.enabled) return;
        const c = this.getContext();
        if (!c) return;
        const t = c.currentTime;
        const osc = c.createOscillator();
        const g = c.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(600, t);
        osc.frequency.exponentialRampToValueAtTime(150, t + 0.015);
        g.gain.setValueAtTime(volume * 0.25, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.02);
        osc.connect(g);
        g.connect(c.destination);
        osc.start(t);
        osc.stop(t + 0.025);
      };
      tick();
      this.tickingInterval = window.setInterval(tick, 1000);
    }
  }

  public stopAmbient() {
    if (this.ambientSource) {
      try {
        (this.ambientSource as AudioBufferSourceNode).stop();
        this.ambientSource.disconnect();
      } catch {
        // ignore
      }
      this.ambientSource = null;
    }
    if (this.tickingInterval) {
      clearInterval(this.tickingInterval);
      this.tickingInterval = null;
    }
  }
}

export const sounds = new SoundManager();
