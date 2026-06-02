import React, { useState, useEffect, useRef } from 'react';
import { Track, NoteMapping } from '../types';
import { playPitch } from '../utils/synth';

interface VisualizerViewProps {
  currentTrack: Track;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  speed: number;
  setSpeed: (speed: number) => void;
  noteMappings: NoteMapping[];
  onPlayKeyboardKey: (pitch: number) => void;
}

export default function VisualizerView({
  currentTrack,
  isPlaying,
  setIsPlaying,
  speed,
  setSpeed,
  noteMappings,
  onPlayKeyboardKey,
}: VisualizerViewProps) {
  const [time, setTime] = useState<number>(0);
  const [activePlayKeys, setActivePlayKeys] = useState<{ [key: number]: boolean }>({});
  const [hitKeys, setHitKeys] = useState<{ [lane: number]: boolean }>({});
  const playedNotesRef = useRef<Set<string>>(new Set());
  const timerRef = useRef<any>(null);

  // Generate real-time oscillating metrics
  const [heartbeat, setHeartbeat] = useState(82);
  const [accuracy, setAccuracy] = useState(99.8);
  const [nps, setNps] = useState(24.2);

  // Animate status metrics slightly to feel active and organic
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setHeartbeat(Math.round(80 + Math.random() * 5));
      setAccuracy(parseFloat((99.5 + Math.random() * 0.4).toFixed(1)));
      setNps(parseFloat((currentTrack.bpm / 5 + Math.random() * 2).toFixed(1)));
    }, 1500);
    return () => clearInterval(interval);
  }, [isPlaying, currentTrack]);

  // Keep track of real-time song timeline clock ticks
  useEffect(() => {
    if (isPlaying) {
      const fps = 60;
      const intervalMs = 1000 / fps;
      timerRef.current = setInterval(() => {
        setTime((prev) => {
          const nextTime = prev + (intervalMs / 1000) * speed;
          if (nextTime >= currentTrack.durationS) {
            playedNotesRef.current.clear();
            return 0; // restart or loop
          }
          return nextTime;
        });
      }, intervalMs);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, speed, currentTrack]);

  // Sync sounds dynamically as falling tiles hit the triggers zone!
  useEffect(() => {
    if (!isPlaying) return;
    const currentSongNotes = currentTrack.sequence;
    const hitZoneTimeThreshold = 0.05; // seconds window
    
    // The visual check zone is located at 80% (top of keyboard roll)
    // Travel time from top (0%) to hit zone is e.g. 2.0 seconds
    const travelTime = 2.0;

    currentSongNotes.forEach((note) => {
      // The note should sound when its target play time is reached
      const noteTargetTime = note.time;
      const keyId = `${note.lane}-${noteTargetTime}`;

      // If the song timeline reaches this note's precise time, play it!
      if (Math.abs(time - noteTargetTime) < hitZoneTimeThreshold && !playedNotesRef.current.has(keyId)) {
        playedNotesRef.current.add(keyId);
        
        // Dynamic volume or pitch scale play helper
        playPitch(note.pitch, note.duration, 'sawtooth');
        
        // Trigger a visual key glow on the lanes and bottom musical keyboards
        setHitKeys((prev) => ({ ...prev, [note.lane]: true }));
        setTimeout(() => {
          setHitKeys((prev) => ({ ...prev, [note.lane]: false }));
        }, 150);
      }
    });

    // Clear buffer when near start of track
    if (time < 0.1) {
      playedNotesRef.current.clear();
    }
  }, [time, currentTrack, isPlaying]);

  // Computer physical keyboard listeners mapping notes
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const char = e.key.toUpperCase();
      const codeIndex = noteMappings.findIndex(
        (m) => m.keyboardKey.toUpperCase() === char
      );
      if (codeIndex !== -1) {
        const pitchNum = parseInt(noteMappings[codeIndex].pitchIndex);
        if (!activePlayKeys[pitchNum]) {
          setActivePlayKeys((prev) => ({ ...prev, [pitchNum]: true }));
          onPlayKeyboardKey(pitchNum);
          
          // Flash key feedback
          setHitKeys((prev) => ({ ...prev, [codeIndex]: true }));
          setTimeout(() => {
            setHitKeys((prev) => ({ ...prev, [codeIndex]: false }));
          }, 150);
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const char = e.key.toUpperCase();
      const codeIndex = noteMappings.findIndex(
        (m) => m.keyboardKey.toUpperCase() === char
      );
      if (codeIndex !== -1) {
        const pitchNum = parseInt(noteMappings[codeIndex].pitchIndex);
        setActivePlayKeys((prev) => {
          const next = { ...prev };
          delete next[pitchNum];
          return next;
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [noteMappings, activePlayKeys, onPlayKeyboardKey]);

  // Helper formatting mm:ss
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const travelTime = 2.0; // seconds for falling tile to reach bottom checkout zone

  return (
    <div id="visualizer-content" className="flex flex-1 h-full select-none">
      {/* 10 Lanes Piano Roll Visualization Channel */}
      <div className="flex-1 relative bg-surface-container-lowest overflow-hidden border-r border-[#3b494c]/50">
        
        {/* Grid Lanes Container */}
        <div className="absolute inset-0 flex justify-center">
          <div className="w-full h-full flex">
            {Array.from({ length: 10 }).map((_, i) => (
              <div 
                key={i} 
                id={`lane-${i}`}
                className={`piano-lane flex-1 h-full transition-colors relative duration-300 ${
                  hitKeys[i] ? 'bg-primary/5 border-r border-primary/20' : ''
                }`}
              >
                {/* Horizontal reference lines for sync grid */}
                <div className="absolute bottom-1/4 left-0 w-full h-[1px] bg-outline-variant/10"></div>
                <div className="absolute bottom-2/4 left-0 w-full h-[1px] bg-outline-variant/10"></div>
                <div className="absolute bottom-3/4 left-0 w-full h-[1px] bg-outline-variant/10"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Dynamic Falling Musical Rectangles */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="w-full h-full relative">
            {currentTrack.sequence
              .filter((note) => {
                // Render note tiles currently in flight
                // Render if note plays up to 2 seconds in future or 0.5s in past
                return note.time > time - 0.5 && note.time < time + travelTime;
              })
              .map((note, index) => {
                // Calculate geometric Y percentage position
                // At note.time: it hits the bottom zone. At note.time - travelTime: it enters at the top.
                const timeDiff = note.time - time;
                const ratio = (travelTime - timeDiff) / travelTime; // 0 to 1
                const yPercent = ratio * 72; // hit-zone sits at 72% height

                // Decide color classes based on lane placement
                let bgClass = 'bg-gradient-to-b from-primary to-primary-container tile-glow-primary text-primary';
                if (note.lane % 3 === 1) {
                  bgClass = 'bg-gradient-to-b from-secondary to-secondary-container tile-glow-secondary text-secondary';
                } else if (note.lane % 3 === 2) {
                  bgClass = 'bg-gradient-to-b from-tertiary to-tertiary-container tile-glow-tertiary text-tertiary';
                }

                // Render falling key block widget
                return (
                  <div
                    key={`${note.lane}-${note.time}-${index}`}
                    className={`absolute rounded-md ${bgClass} opacity-90 transition-all duration-75`}
                    style={{
                      left: `${note.lane * 10 + 0.2}%`,
                      width: '9.6%',
                      top: `${yPercent}%`,
                      height: `${Math.max(24, Math.floor(note.duration * 100))}px`,
                      transform: 'translateY(-100%)',
                    }}
                  />
                );
              })}
          </div>
        </div>

        {/* Dynamic Hit Zone Triggers line */}
        <div className="absolute bottom-32 left-0 w-full flex justify-center h-1 z-20">
          <div className="w-full h-full bg-[#3b494c]/40 relative">
            <div className={`absolute inset-0 bg-primary/25 blur-sm transition-opacity duration-150 ${isPlaying ? 'opacity-100' : 'opacity-30'}`}></div>
            
            {/* Realtime flash target visual cues for active notes */}
            {Array.from({ length: 10 }).map((_, laneIndex) => {
              const active = hitKeys[laneIndex];
              let glowColor = 'bg-primary shadow-[0_0_15px_rgba(195,245,255,1)]';
              
              if (laneIndex % 3 === 1) {
                glowColor = 'bg-secondary shadow-[0_0_15px_rgba(218,185,255,1)]';
              } else if (laneIndex % 3 === 2) {
                glowColor = 'bg-tertiary shadow-[0_0_15px_rgba(149,255,239,1)]';
              }

              return (
                <div
                  key={laneIndex}
                  className={`absolute -top-[4px] h-3 rounded-full transition-all duration-100 ${glowColor}`}
                  style={{
                    left: `${laneIndex * 10 + 0.5}%`,
                    width: '9%',
                    opacity: active ? 1 : 0,
                    transform: 'scaleY(' + (active ? '1.4' : '0.1') + ')',
                  }}
                />
              );
            })}
          </div>
        </div>

        {/* Interactive Synthesizer Piano Keys Bar at bottom */}
        <div className="absolute bottom-0 left-0 w-full h-32 bg-surface-container flex justify-center border-t border-[#3b494c]">
          <div className="w-full flex gap-[2px] p-1">
            {Array.from({ length: 10 }).map((_, i) => {
              const mapping = noteMappings[i] || { musicalNote: 'C' + i, keyboardKey: '' };
              const pitchVal = 60 + i;
              const isKeyPressed = activePlayKeys[pitchVal] || hitKeys[i];

              return (
                <button
                  key={i}
                  id={`piano-key-${i}`}
                  onClick={() => {
                    playPitch(pitchVal, 0.45);
                    setHitKeys((prev) => ({ ...prev, [i]: true }));
                    setTimeout(() => {
                      setHitKeys((prev) => ({ ...prev, [i]: false }));
                    }, 180);
                  }}
                  className={`flex-1 rounded-b-md border-x border-[#3b494c]/20 relative active:scale-95 transition-all duration-150 ${
                    isKeyPressed
                      ? 'bg-primary-container text-[#001f24] shadow-[0_0_20px_rgba(0,229,255,0.4)]'
                      : 'bg-[#e5e2e1] hover:bg-[#c3f5ff]/40 text-[#131313]'
                  }`}
                >
                  <span className="absolute bottom-6 left-1/2 -translate-x-1/2 font-mono text-[10px] font-bold tracking-tight opacity-50">
                    {mapping.musicalNote}
                  </span>
                  {mapping.keyboardKey && (
                    <span className="absolute bottom-2 left-1/2 -translate-x-1/2 font-mono text-[9px] font-bold border border-[#131313]/25 px-1 rounded-sm bg-[#131313]/5">
                      {mapping.keyboardKey}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

      </div>

      {/* Right Real-time Stats & Playback Status Panel */}
      <aside className="w-80 bg-surface-container p-6 flex flex-col gap-6 selection:bg-[#602b9d] select-none text-on-surface">
        <div>
          <h3 className="font-mono text-xs text-on-surface-variant uppercase tracking-widest mb-4">Real-time Playback</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-surface-container-low p-3 rounded-lg border border-[#3b494c]">
              <p className="font-mono text-[10px] text-on-surface-variant mb-1">BPM</p>
              <p className="font-sans text-xl font-bold text-primary">{currentTrack.bpm.toFixed(1)}</p>
            </div>
            <div className="bg-surface-container-low p-3 rounded-lg border border-[#3b494c]">
              <p className="font-mono text-[10px] text-on-surface-variant mb-1">NPS</p>
              <p className="font-sans text-xl font-bold text-secondary">{nps.toFixed(1)}</p>
            </div>
          </div>
        </div>

        {/* Automation Health Card */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="font-mono text-xs text-on-surface-variant">Automation Core</span>
            <span className="flex items-center gap-2 text-[10px] font-mono text-tertiary">
              <span className={`w-2 h-2 rounded-full bg-tertiary ${isPlaying ? 'animate-pulse' : ''}`}></span>
              ACTIVE
            </span>
          </div>
          <div className="bg-surface-container-lowest p-4 rounded-lg border border-[#3b494c] space-y-3">
            <div className="flex justify-between font-mono text-[11px]">
              <span className="text-on-surface-variant">Selenium Heartbeat</span>
              <span className="text-primary">{isPlaying ? heartbeat : 0}ms</span>
            </div>
            <div className="w-full bg-surface-container-high h-[4px] rounded-full overflow-hidden">
              <div 
                className="bg-primary h-full transition-all duration-300"
                style={{ width: `${isPlaying ? (heartbeat / 110) * 100 : 0}%` }}
              ></div>
            </div>
            
            <div className="flex justify-between font-mono text-[11px]">
              <span className="text-on-surface-variant">Sync Accuracy</span>
              <span className="text-tertiary">{isPlaying ? accuracy : 100}%</span>
            </div>
            <div className="w-full bg-surface-container-high h-[4px] rounded-full overflow-hidden">
              <div 
                className="bg-tertiary h-full transition-all duration-300 shadow-[0_0_8px_rgba(149,255,239,0.5)]"
                style={{ width: `${isPlaying ? accuracy : 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Mini Audio Track Player Status Card */}
        <div className="flex-1 flex flex-col justify-end">
          <div className="bg-surface-container-high rounded-xl p-4 border border-[#3b494c] space-y-3">
            
            <div className="flex items-center gap-3">
              <img 
                src={currentTrack.image} 
                alt={currentTrack.title} 
                referrerPolicy="no-referrer"
                className={`w-12 h-12 rounded-lg bg-surface-container-low object-cover border border-[#3b494c] ${isPlaying ? 'animate-[spin_8s_linear_infinite]' : ''}`}
              />
              <div>
                <p className="font-sans font-semibold text-sm text-on-surface tracking-tight">{currentTrack.title}</p>
                <p className="font-mono text-[10px] text-on-surface-variant max-w-[160px] truncate">{currentTrack.mix}</p>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between font-mono text-[10px] text-on-surface-variant">
                <span>{formatTime(time)}</span>
                <span>{currentTrack.duration}</span>
              </div>
              <input 
                type="range"
                min="0"
                max={currentTrack.durationS}
                value={time}
                onChange={(e) => {
                  setTime(parseFloat(e.target.value));
                  playedNotesRef.current.clear();
                }}
                className="w-full h-[6px] rounded-lg accent-primary bg-surface-container cursor-pointer outline-none"
              />
            </div>

            {/* Quick in-card controller keys */}
            <div className="flex justify-center items-center gap-4 pt-1">
              <button 
                title="Restart"
                onClick={() => {
                  setTime(0);
                  playedNotesRef.current.clear();
                }}
                className="text-on-surface-variant hover:text-primary active:scale-90 transition-all p-1"
              >
                <span className="material-symbols-outlined text-xl">first_page</span>
              </button>
              
              <button 
                onClick={() => {
                  setIsPlaying(!isPlaying);
                }}
                className="w-10 h-10 flex items-center justify-center bg-primary text-on-primary rounded-full hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20"
              >
                <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                  {isPlaying ? 'pause' : 'play_arrow'}
                </span>
              </button>
              
              <button 
                title="Loop track reset"
                onClick={() => {
                  setTime(0);
                  playedNotesRef.current.clear();
                }}
                className="text-on-surface-variant hover:text-primary active:scale-90 transition-all p-1"
              >
                <span className="material-symbols-outlined text-xl">sync</span>
              </button>
            </div>

          </div>
        </div>
      </aside>
    </div>
  );
}
