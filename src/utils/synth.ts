let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function playPitch(pitch: number, durationS = 0.3, type: 'sawtooth' | 'sine' | 'triangle' | 'square' = 'sawtooth') {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    // Convert MIDI pitch number to Frequency
    // 60 = C4 is 261.63 Hz
    const freq = 440 * Math.pow(2, (pitch - 69) / 12);
    
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    // Dynamic clean ADSR/decay volume envelope
    gainNode.gain.setValueAtTime(0.18, ctx.currentTime); // moderate volume scale
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + durationS);

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + durationS);
  } catch (error) {
    console.warn('Audio Context is not supported or was blocked by browser audio policy.', error);
  }
}
