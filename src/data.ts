import { Track, NoteMapping } from './types';

// Let's establish highly stylized hotlink image resources as indicated by html files
export const TRACK_IMAGES = {
  neonHorizon: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBR3yRsBYYXUumY8T12tLy71yZ3XoYZrTLfg0CG0oFoma4-Kf1j5PECinS3ZbIU7vJ6DR0kQMfNOSywgjU4y_9hrCUeQ_98-b8Actp_P8x5vJHHe-FM8k5i8h9_vZSLyLlaEQvFJEE9SDSaLwkyajIL40-pDZyR9n21RsC2yWCkfuOTV3-10DFEKLWHuR8VaJqowCP5MhbTpt-G2hqsli4-FUgXIS8hRVbVjuzW634ZDxUcBpGgBwwTDEA_b-BA9itYBoA10-je4Ts',
  cyberneticPulse: 'https://lh3.googleusercontent.com/aida-public/AB6AXuADo0nTbmvS644VGoh2BxmKYADkZ90RllX8XrWyppuJU5cmPV3rzs09DUdG-OujazO9EeKBUmfVKtktEd0rUZjhIgEzGEyxhwxY22IdlJI0VSwUCtGU_p9Mj02g4VGrtELKkMyIhdK8uszLvF9wxm8hEZxzaiEKrP0Eh4SHML_HJCbNv0PVCOiyKdUE2HgMDf7xpE5aAqt7U_YfRJz2znSjuc5tMAyhH0l-8Q4LNpq_CH7QHGN8xxkclleh01ggka-gP0ya8PjTf0o',
  midnightQuartz: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDhSvyRh3lKzyR4NBPzodf5NLBbqF4HJvb-noLngo6tT9uZPjgf6u2FbChYWwNHVvFZwWHRM7u943jWrRAi50foCoB4WDj3YIRY7RZnOz1EIeLuQLOo1jWqnKubKwg2kzg3pU64lKNOklZUEmijGKrqBpB2PKX8BDPjXZIAgyb0E1JvgzJ4jjjMvXW1LpiCG_51_COQO4CLgQq2yRLX0FEIm2t4rprMxn-uBHRMZhSuHQTPUE4hivyaT2wHbNfGP2LkuAGcX4XQavI',
  voidEchoes: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC_Sxac4c1JBAdQBNwJyfel0eM0qb1_O4HpHTGZdwxFCIfoxtf8QqoJutCBGbLe7kEi5oACt1qtAvH26X1-G8SJ3TcUAdI6VjR6qQtM0dUYuFMsT54K8U4eQqp0Z19oivs_6Ud-9Dd75JJ0MItmBldddW40s2f4l_XZjz6WeU6LDu102pfNUha_6tJiUGagxhSdjN1_UDAKU4uJAGbAmJa--L-CYso3B5CAwY1G9RwBqZVoXR9mogOvKrqbf9RMC8ar66mD6z56loA',
  digitalGhost: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCx6lntFQDZHJ419dY3VqcSrDsaXFMveDVqPNym8MIVhpQLTFQNIl8TIAxnxmHrfXpaMiXb5a0XYnIu2x57ibzdO7pPulJ9SNXpaEGuY0I5gesk4_TqxK-KdOXWvlIdRJVSus7AxYeRA2ihClFTe0qkhAoudZ-XZyAoP8UQRnMFMrW_J-w_67NdNgl9e3_KjqUvghJVMcDQgFEBvhxXXHLca_VbJIUmrme2MhjE7gFHew3ChZy37aPv561p5PiHblO4T7YwU3tReWI',
  studioPreview: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDzY-kMpN3o36jHDtW-rkeB6d4T3S8Wuro3zBjZJ-TdI7CcRq4riBnP_tZzf-G7DW1DQRqt1JP05mG-N-yVV8NRaS_AyNBpEh9Bq92p2rLETZnW4i_4GlJoucrrgw_Bnh7NqJYS1V2z5kU2lHlI3fmTQ8S2bUQ-O0ahzY2zYi8gQIeaWwL3OrlMqmAXwWo_XJcobyi0z1JcNfB2dZYracCiA8e4lym6Sv8BLjHwTOoSATQrrfkmrwwbjiVMSICvT4ytAyT9anP_RGc',
  atmosphericOverlay: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBKhDSTCMrsRGR5LG2fAJCNlm-q008Z7o90kjZzjZwOgsRSeVoYSHFxST1c2CdpwYMxRfghW_hGLkiHtv9Le8W9zlpucpokwWL7WXEghBGEQSnVua_u2znv84uX87Vr1KWOsTNjrXGhMJ9RogS_BEpv2ivajvN7Lb8KWDJCdBTzQQ3_dJqJmmXiUCYWvSiBmcmLQokk4Eh-XtbL09tyjNCqPUY2n2VsxbK9YdiHSF9lw4YsuSnw4Zjh5539nB5GRkxCQCiwcWvuihk'
};

// Procedural note generator for a tracks
function generateSequence(trackId: string, durationS: number, bpm: number): { pitch: number; time: number; duration: number; lane: number }[] {
  const sequence: { pitch: number; time: number; duration: number; lane: number }[] = [];
  const bps = bpm / 60;
  const beatInterval = 1 / bps; // seconds per beat
  
  // Seed state per track for pseudo-randomness
  let t = 0;
  let counter = 0;
  while (t < durationS - 3) {
    counter++;
    let step = 0.25; // Default sixteenth note or eighth note
    let duration = 0.2;
    
    // Choose lanes and frequencies dynamically based on track flavor
    let lane = 0;
    
    if (trackId === 'neonHorizon') {
      // Steady synthwave arpeggio & bass notes
      const notes = [0, 2, 4, 7, 9, 11]; // Minor scales
      const beatNum = Math.floor(t / beatInterval);
      lane = (beatNum * 3 + (counter % 3)) % 10;
      step = beatInterval * (counter % 2 === 0 ? 0.5 : 0.25);
      duration = step * 0.8;
    } else if (trackId === 'cyberneticPulse') {
      // Speed techno: dense sixteenth steps
      lane = (counter * 3 + Math.floor(Math.sin(counter) * 4 + 4)) % 10;
      step = 0.15;
      duration = 0.12;
    } else if (trackId === 'midnightQuartz') {
      // Ambient slow pad chords
      lane = (counter * 2) % 10;
      step = beatInterval * 2;
      duration = step * 0.95;
    } else if (trackId === 'voidEchoes') {
      // Delays & space echoes
      lane = (counter * 7 + (counter % 4)) % 10;
      step = beatInterval * (counter % 3 === 0 ? 1 : 0.5);
      duration = step * 0.5;
    } else if (trackId === 'digitalGhost') {
      // Heavy dark random notes
      lane = Math.floor(Math.abs(Math.sin(counter * 0.52)) * 10) % 10;
      step = beatInterval * 0.25;
      duration = step * 0.7;
    }

    const pitch = 60 + lane; // C4 is 60, lanes map to pitch indices up to 69
    sequence.push({
      pitch,
      time: parseFloat(t.toFixed(3)),
      duration: parseFloat(duration.toFixed(3)),
      lane,
    });
    
    t += step;
  }
  
  return sequence;
}

export const INITIAL_TRACKS: Track[] = [
  {
    id: 'neonHorizon',
    title: 'Neon Horizon',
    mix: 'Synthwave Automation Mix',
    duration: '04:12',
    durationS: 252,
    bpm: 128.0,
    noteDensity: 942,
    densityRating: 'HEAVY',
    complexity: 3,
    image: TRACK_IMAGES.neonHorizon,
    eventsCount: 942,
    sequence: generateSequence('neonHorizon', 252, 128.0)
  },
  {
    id: 'cyberneticPulse',
    title: 'Cybernetic Pulse',
    mix: 'Generative AI Tech Mix',
    duration: '03:15',
    durationS: 195,
    bpm: 140.0,
    noteDensity: 1102,
    densityRating: 'ELITE DENSITY',
    complexity: 4,
    image: TRACK_IMAGES.cyberneticPulse,
    eventsCount: 1102,
    sequence: generateSequence('cyberneticPulse', 195, 140.0)
  },
  {
    id: 'midnightQuartz',
    title: 'Midnight Quartz',
    mix: 'Lowpass Ambient Drone Mix',
    duration: '05:22',
    durationS: 322,
    bpm: 90.0,
    noteDensity: 321,
    densityRating: 'LOW DENSITY',
    complexity: 1,
    image: TRACK_IMAGES.midnightQuartz,
    eventsCount: 321,
    sequence: generateSequence('midnightQuartz', 322, 90.0)
  },
  {
    id: 'voidEchoes',
    title: 'Void Echoes',
    mix: 'Deep Dub Chamber Mix',
    duration: '08:00',
    durationS: 480,
    bpm: 115.0,
    noteDensity: 654,
    densityRating: 'MODERATE',
    complexity: 2,
    image: TRACK_IMAGES.voidEchoes,
    eventsCount: 654,
    sequence: generateSequence('voidEchoes', 480, 115.0)
  },
  {
    id: 'digitalGhost',
    title: 'Digital Ghost',
    mix: 'Glitch Core Cyber Mix',
    duration: '02:45',
    durationS: 165,
    bpm: 160.0,
    noteDensity: 1280,
    densityRating: 'HEAVY',
    complexity: 4,
    image: TRACK_IMAGES.digitalGhost,
    eventsCount: 1280,
    sequence: generateSequence('digitalGhost', 165, 160.0)
  }
];

export const DEFAULT_MAPPINGS: NoteMapping[] = [
  { pitchIndex: '060', musicalNote: 'C4', keyboardKey: 'A', velocitySensitivity: 'Active' },
  { pitchIndex: '061', musicalNote: 'C#4', keyboardKey: 'W', velocitySensitivity: 'Active' },
  { pitchIndex: '062', musicalNote: 'D4', keyboardKey: 'S', velocitySensitivity: 'Active' },
  { pitchIndex: '063', musicalNote: 'D#4', keyboardKey: 'E', velocitySensitivity: 'Active' },
  { pitchIndex: '064', musicalNote: 'E4', keyboardKey: 'D', velocitySensitivity: 'Active' },
  { pitchIndex: '065', musicalNote: 'F4', keyboardKey: 'F', velocitySensitivity: 'Active' },
  { pitchIndex: '066', musicalNote: 'F#4', keyboardKey: 'T', velocitySensitivity: 'Active' },
  // Pitch 067, 068, 069 are unmapped by default on the MIDI Setup screen in the original screenshot
  // Let's mark them as unmapped or partially mapped to simulate the prompt's warning interaction!
  { pitchIndex: '067', musicalNote: 'G4', keyboardKey: '', velocitySensitivity: 'Active' },
  { pitchIndex: '068', musicalNote: 'G#4', keyboardKey: '', velocitySensitivity: 'Active' },
  { pitchIndex: '069', musicalNote: 'A4', keyboardKey: '', velocitySensitivity: 'Active' }
];

export const INITIAL_EVENTS = [
  { id: '1', timestamp: '12:04:31.002', eventType: 'KEY_TRIG_DOWN', driverId: 'SEL_042', metric: '0.4ms', status: 'OK' as const },
  { id: '2', timestamp: '12:04:31.145', eventType: 'SUSTAIN_EVENT', driverId: 'SEL_042', metric: '--', status: 'OK' as const },
  { id: '3', timestamp: '12:04:31.288', eventType: 'BUFFER_OVERFLOW', driverId: 'SYS_CORE', metric: '82.1ms', status: 'FAIL' as const },
  { id: '4', timestamp: '12:04:31.401', eventType: 'KEY_TRIG_UP', driverId: 'SEL_042', metric: '0.8ms', status: 'OK' as const },
  { id: '5', timestamp: '12:04:31.555', eventType: 'KEY_TRIG_DOWN', driverId: 'SEL_012', metric: '1.2ms', status: 'OK' as const },
  { id: '6', timestamp: '12:04:31.620', eventType: 'API_SYNC_HB', driverId: 'SEL_AUTH', metric: '4ms', status: 'OK' as const }
];
