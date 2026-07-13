class NeonAudioSystem {
  constructor() {
    this.ctx = null;
    this.isActive = false;
  }

  init() {
    if (this.ctx) return;
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    this.ctx = new AudioContextClass();
  }

  // Synthesizes an ultra-delicate, high-frequency electrostatic "snap" (the spark contact)
  // Shifted to the extreme highs (4kHz-6kHz) and shortened to 5ms for an incredibly clean, subtle pop
  createElectricSnap(time, volume, pitch) {
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(pitch, time);
    osc.frequency.exponentialRampToValueAtTime(pitch * 0.5, time + 0.005); // Ultra-fast 5ms sweep
    
    // Sharp highpass to keep the snap extremely airy and subtle (removes all low/mid clicks)
    const hp = this.ctx.createBiquadFilter();
    hp.type = 'highpass';
    hp.frequency.setValueAtTime(3800, time);

    gain.gain.setValueAtTime(volume, time);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.005);

    osc.connect(hp);
    hp.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(time);
    osc.stop(time + 0.006);
  }

  // Synthesizes a delicate electrostatic "sizzle" using highly sparse noise
  // Utilizes dual highpass filters in series (24dB/octave slope) in the extreme high-end
  // Replaced continuous sputtering with microscopic, sparse static impulses
  createElectricSizzle(time, duration, volume, highpassFreq) {
    if (!this.ctx) return;

    const sampleRate = this.ctx.sampleRate;
    const bufferLen = Math.floor(sampleRate * duration);
    const buffer = this.ctx.createBuffer(1, bufferLen, sampleRate);
    const data = buffer.getChannelData(0);

    // Synthesize ultra-sparse microscopic static discharges
    let lastValue = 0;
    for (let i = 0; i < bufferLen; i++) {
      const t = i / bufferLen;
      const decay = Math.pow(1 - t, 4.0); // Extremely steep decay for tight transients
      
      // High sparsity (only 3.5% chance per sample to trigger a micro-discharge)
      if (Math.random() < 0.035) {
        data[i] = (Math.random() * 2 - 1) * decay;
      } else {
        // Fast dampening of the micro-discharge to keep it crisp
        data[i] = lastValue * 0.35 * decay;
      }
      lastValue = data[i];
    }

    const source = this.ctx.createBufferSource();
    source.buffer = buffer;

    // Double highpass filters in series set very high to preserve only the absolute airy crackle
    const hp1 = this.ctx.createBiquadFilter();
    hp1.type = 'highpass';
    hp1.frequency.setValueAtTime(highpassFreq, time);

    const hp2 = this.ctx.createBiquadFilter();
    hp2.type = 'highpass';
    hp2.frequency.setValueAtTime(highpassFreq, time);

    // Gently roll off extreme digital sizzles above 8.5kHz
    const lowpass = this.ctx.createBiquadFilter();
    lowpass.type = 'lowpass';
    lowpass.frequency.setValueAtTime(8500, time);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(volume, time);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

    source.connect(hp1);
    hp1.connect(hp2);
    hp2.connect(lowpass);
    lowpass.connect(gain);
    gain.connect(this.ctx.destination);

    source.start(time);
    source.stop(time + duration);
  }

  // Deep, ultra-subtle sub-bass thump to anchor the activation with high-end taptic feel
  createSubThump(time, volume) {
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(45, time);
    osc.frequency.exponentialRampToValueAtTime(20, time + 0.15);

    gain.gain.setValueAtTime(0, time);
    gain.gain.linearRampToValueAtTime(volume, time + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.16);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(time);
    osc.stop(time + 0.16);
  }

  triggerOn() {
    this.init();
    if (!this.ctx) return;
    
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    this.isActive = true;
    const now = this.ctx.currentTime;

    // 1. Extremely quiet sub-tactile base (very subtle, gives warm grounding)
    this.createSubThump(now + 0.01, 0.045);

    // --- Tight, Ultra-Delicate, High-Frequency Electrostatic Spark Sequence ---
    // Total duration is compressed to under 250ms for a highly subtle, airy crackle
    // Mid-frequency hum has been completely removed to ensure pure, clean, premium transparency
    const jitter = () => (Math.random() - 0.5) * 0.003;

    // Spark 1: Tiny high-frequency pre-spark
    const t1 = now + 0.015 + jitter();
    this.createElectricSnap(t1, 0.03, 5600);
    this.createElectricSizzle(t1, 0.018, 0.025, 4500);

    // Spark 2: Immediate micro-crackle
    const t2 = now + 0.03 + jitter();
    this.createElectricSnap(t2, 0.025, 5200);
    this.createElectricSizzle(t2, 0.02, 0.02, 4200);

    // Spark 3: Sputter build-up
    const t3 = now + 0.07 + jitter();
    this.createElectricSnap(t3, 0.035, 4800);
    this.createElectricSizzle(t3, 0.03, 0.03, 3800);

    // Spark 4: Main ignition catch spark (highly dampened, brief, pure crisp static)
    const t4 = now + 0.12 + jitter();
    this.createElectricSnap(t4, 0.05, 4200);
    this.createElectricSizzle(t4, 0.07, 0.045, 3500);

    // Spark 5: Final tiny settling pop (extremely delicate and airy)
    const t5 = now + 0.21 + jitter();
    this.createElectricSnap(t5, 0.02, 5000);
    this.createElectricSizzle(t5, 0.02, 0.012, 4500);
  }

  triggerOff() {
    // Ultra-delicate static release pop
    this.init();
    if (!this.ctx) return;

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    this.isActive = false;
    const now = this.ctx.currentTime;

    // A single, microscopic electrostatic discharge click
    this.createElectricSnap(now, 0.025, 4800);
    this.createElectricSizzle(now, 0.02, 0.015, 4000);
  }
}

export const neonAudio = new NeonAudioSystem();
