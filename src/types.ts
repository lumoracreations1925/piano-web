export interface Track {
  id: string;
  title: string;
  mix: string;
  duration: string;
  durationS: number;
  bpm: number;
  noteDensity: number;
  densityRating: 'LOW DENSITY' | 'MODERATE' | 'HEAVY' | 'ELITE DENSITY';
  complexity: number; // 1 to 4 active blocks
  image: string;
  eventsCount: number;
  sequence: { pitch: number; time: number; duration: number; lane: number }[];
}

export interface NoteMapping {
  pitchIndex: string;
  musicalNote: string;
  keyboardKey: string;
  velocitySensitivity: 'Active' | 'Inactive';
}

export interface AutomationEvent {
  id: string;
  timestamp: string;
  eventType: string;
  driverId: string;
  metric: string;
  status: 'OK' | 'FAIL';
}

export type ViewTab = 'Projects' | 'Library' | 'Automation' | 'Analytics';
export type VisualizerTab = 'Visualizer' | 'MIDI Setup' | 'Sequence' | 'History' | 'Cloud';
