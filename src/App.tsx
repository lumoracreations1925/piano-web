import React, { useState, useEffect } from 'react';
import { Track, NoteMapping, ViewTab, VisualizerTab } from './types';
import { INITIAL_TRACKS, DEFAULT_MAPPINGS } from './data';
import { playPitch } from './utils/synth';

import VisualizerView from './components/VisualizerView';
import MidiSetupView from './components/MidiSetupView';
import LibraryView from './components/LibraryView';
import AnalyticsView from './components/AnalyticsView';

export default function App() {
  // Global Workspace navigation state
  const [activeTab, setActiveTab] = useState<ViewTab>('Projects');
  const [sidebarTab, setSidebarTab] = useState<VisualizerTab>('Visualizer');

  // Load initial MIDI track to visualizer engine (DEFAULT: Neon Horizon)
  const [currentTrack, setCurrentTrack] = useState<Track>(INITIAL_TRACKS[0]);
  
  // Custom interactive note pitch keymap mapping definitions
  const [noteMappings, setNoteMappings] = useState<NoteMapping[]>(DEFAULT_MAPPINGS);

  // High-fidelity synchronized playback clock state variables
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(1.0);

  // Global overlay feedback toast message state
  const [toast, setToast] = useState<string | null>(null);

  // Trigger brief visual toasts when configuration changes
  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => {
      setToast(null);
    }, 2500);
  };

  // Keyboard trigger play auditory chime effect confirmation
  const handlePlayKeyboardKey = (pitch: number) => {
    playPitch(pitch, 0.45, 'sawtooth');
    
    const noteName = noteMappings.find((m) => parseInt(m.pitchIndex) === pitch)?.musicalNote || `Note ${pitch}`;
    // Optionally trigger trace logging or active feed feedback
  };

  // Load a track from the library into the active visualizer, updating player
  const handleSelectTrack = (track: Track) => {
    setCurrentTrack(track);
    setIsPlaying(false); // pause first
    showToast(`Loaded track: "${track.title}" into workspace engine.`);
    
    // Automatically switch tabs back to the active Piano Visualizer page model
    setActiveTab('Projects');
    setSidebarTab('Visualizer');
  };

  const handleStartVisualizerCommand = () => {
    // If all key interval validations have passed, successfully mount the active playback visualization
    setActiveTab('Projects');
    setSidebarTab('Visualizer');
    setIsPlaying(true);
    showToast('MIDI keymaps validation successful. Active visualizer started.');
    
    // Play active launch chord chime
    const scale = [60, 64, 67, 72];
    scale.forEach((pit, idx) => {
      setTimeout(() => {
        playPitch(pit, 0.3, 'sine');
      }, idx * 100);
    });
  };

  // Synchronize top category nav switches and sidebar selections safely
  const selectTopTab = (tab: ViewTab) => {
    setActiveTab(tab);
    playPitch(64, 0.1, 'triangle');
    
    if (tab === 'Library') {
      setSidebarTab('Cloud');
    } else if (tab === 'Analytics') {
      setSidebarTab('History');
    } else if (tab === 'Automation') {
      setSidebarTab('MIDI Setup');
    } else {
      setSidebarTab('Visualizer');
    }
  };

  const selectSidebarTab = (tab: VisualizerTab) => {
    setSidebarTab(tab);
    playPitch(62, 0.1, 'triangle');
    
    if (tab === 'Cloud') {
      setActiveTab('Library');
    } else if (tab === 'History') {
      setActiveTab('Analytics');
    } else if (tab === 'MIDI Setup') {
      setActiveTab('Projects'); // mappings edit
    } else if (tab === 'Visualizer') {
      setActiveTab('Projects'); // active visualizer
    } else if (tab === 'Sequence') {
      setActiveTab('Automation'); // sequencing
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#131313]">
      
      {/* Top Application Header Navigation Bar */}
      <nav className="flex justify-between items-center h-16 px-margin-desktop w-full z-50 bg-surface-container-low border-b border-outline-variant fixed top-0 select-none">
        
        {/* Left Side: Brand Logo & Interactive Tab buttons */}
        <div className="flex items-center gap-8">
          <span className="font-sans text-xl font-bold text-primary tracking-tight md:text-2xl hover:brightness-110 cursor-pointer active:scale-95 transition-transform" onClick={() => selectTopTab('Projects')}>
            RhythmEngine
          </span>
          <div className="hidden md:flex gap-6 items-center">
            {(['Projects', 'Library', 'Automation', 'Analytics'] as ViewTab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => selectTopTab(tab)}
                className={`font-sans text-sm font-semibold tracking-wide transition-all cursor-pointer pb-1 ${
                  activeTab === tab
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Center: High-Fidelity Transport Controls connected to playback timeline state */}
        <div className="flex items-center gap-3 bg-surface-container p-1 rounded-lg border border-outline-variant">
          <button 
            title="Rewind Song Timeline"
            onClick={() => {
              playPitch(55, 0.2, 'sine');
              // triggers elements reset using a custom document query or state manipulation
              const progressEl = document.querySelector('input[type="range"]') as HTMLInputElement;
              if (progressEl) {
                progressEl.value = '0';
                progressEl.dispatchEvent(new Event('change', { bubbles: true }));
              }
              showToast('Rewinding track to beginning.');
            }}
            className="p-2 hover:bg-surface-container-high rounded text-on-surface hover:text-primary transition-all active:scale-90"
          >
            <span className="material-symbols-outlined text-lg align-middle">first_page</span>
          </button>
          
          <button 
            title={isPlaying ? 'Pause Visualizer' : 'Start Visualizer'}
            onClick={() => {
              setIsPlaying(!isPlaying);
              playPitch(isPlaying ? 55 : 72, 0.2, 'sine');
            }}
            className="w-10 h-10 flex items-center justify-center bg-primary text-[#00363d] rounded-full hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20"
          >
            <span className="material-symbols-outlined text-xl align-middle" style={{ fontVariationSettings: "'FILL' 1" }}>
              {isPlaying ? 'pause' : 'play_arrow'}
            </span>
          </button>
          
          <button 
            title="Pause Clock"
            onClick={() => {
              setIsPlaying(false);
              playPitch(55, 0.2, 'sine');
            }}
            className="p-2 hover:bg-surface-container-high rounded text-on-surface hover:text-primary transition-all active:scale-90"
          >
            <span className="material-symbols-outlined text-lg align-middle">pause</span>
          </button>
          
          <div className="h-6 w-[1px] bg-outline-variant mx-2"></div>
          
          <div className="flex items-center gap-3 px-2">
            <span className="font-mono text-[10px] text-on-surface-variant font-bold">SPEED</span>
            <input 
              type="range"
              min="0.5"
              max="2.0"
              step="0.1"
              value={speed}
              onChange={(e) => {
                setSpeed(parseFloat(e.target.value));
                playPitch(62 + parseFloat(e.target.value) * 4, 0.1, 'triangle');
              }}
              className="w-24 h-1 bg-surface-container-high rounded-lg appearance-none cursor-pointer accent-primary" 
            />
            <span className="font-mono text-[10px] text-primary w-8 font-bold text-right">
              {speed.toFixed(1)}x
            </span>
          </div>
        </div>

        {/* Right Side Settings & User Icons */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => {
              playPitch(64, 0.2, 'sine');
              alert('Control Center parameters settings modal. Custom driver and velocity thresholds adjusted here. Current version: v2.4.0-Stable.');
            }}
            className="p-2 text-on-surface-variant hover:bg-surface-variant hover:text-primary transition-all active:scale-95 rounded-full"
            title="Settings Controller"
          >
            <span className="material-symbols-outlined text-xl align-middle">settings</span>
          </button>
          <button 
            onClick={() => {
              playPitch(67, 0.2, 'sine');
              alert(`Profile Session: lumoracreations1925@gmail.com\nActive Project workspace: RhythmEngine Automation Hub.`);
            }}
            className="p-2 text-on-surface-variant hover:bg-surface-variant hover:text-primary transition-all active:scale-95 rounded-full"
            title="User Profile Profile"
          >
            <span className="material-symbols-outlined text-xl align-middle">account_circle</span>
          </button>
        </div>
      </nav>

      {/* Main Workspace Column container */}
      <div className="flex h-screen pt-16">
        
        {/* Left Side Navigation Panel (Unified Control Dashboard) */}
        <aside className="w-80 bg-surface-container border-r border-[#3b494c]/60 flex flex-col py-5 select-none text-on-surface">
          <div className="px-6 mb-4">
            <h2 className="font-sans text-lg font-bold text-[#e5e2e1] tracking-tight">Control Panel</h2>
            <p className="font-mono text-[11px] text-on-surface-variant tracking-wider uppercase font-bold opacity-75">v2.4.0-Stable</p>
          </div>

          <nav className="flex-1 space-y-1.5 px-3 pt-3">
            {[
              { id: 'Visualizer', icon: 'equalizer', label: 'Visualizer' },
              { id: 'MIDI Setup', icon: 'settings_input_component', label: 'MIDI Setup' },
              { id: 'Sequence', icon: 'reorder', label: 'Sequence' },
              { id: 'History', icon: 'history', label: 'History' },
              { id: 'Cloud', icon: 'cloud_done', label: 'Cloud' },
            ].map((sideTab) => {
              const active = sidebarTab === sideTab.id;
              return (
                <button
                  key={sideTab.id}
                  onClick={() => selectSidebarTab(sideTab.id as any)}
                  className={`w-full flex items-center gap-4 px-4 py-3 cursor-pointer text-left transition-all rounded-xl focus:outline-none ${
                    active
                      ? 'bg-secondary-container text-[#eedbff] font-bold shadow-md shadow-[#602b9d]/10 border border-[#eedbff]/5'
                      : 'text-on-surface-variant hover:bg-surface-container-high hover:text-[#e5e2e1]'
                  }`}
                >
                  <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: active ? "'FILL' 1" : "'FILL' 0" }}>
                    {sideTab.icon}
                  </span>
                  <span className="font-mono text-xs font-bold tracking-tight uppercase">
                    {sideTab.label}
                  </span>
                </button>
              );
            })}
          </nav>

          {/* Bottom Sidebar Help / Logs indicators */}
          <div className="mt-auto border-t border-outline-variant/30 pt-4 px-3 space-y-1.5">
            <button
              onClick={() => {
                playPitch(64, 0.25, 'triangle');
                alert('Support center connection: Documentation is linked in footer. Custom automation rules can be configured via metadata settings underProjects config.');
              }}
              className="w-full text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-all flex items-center gap-4 px-4 py-3 rounded-xl font-mono text-xs font-bold uppercase"
            >
              <span className="material-symbols-outlined text-lg">help</span>
              Support Center
            </button>
            <button
              onClick={() => {
                playPitch(55, 0.2, 'sawtooth');
                showToast('API logs buffer cleared.');
              }}
              className="w-full text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-all flex items-center gap-4 px-4 py-3 rounded-xl font-mono text-xs font-bold uppercase"
            >
              <span className="material-symbols-outlined text-lg">terminal</span>
              Clear Logs
            </button>
          </div>
        </aside>

        {/* Dynamic Context Tabs Views Loader */}
        <main className="flex-1 overflow-y-auto bg-background pb-16">
          {activeTab === 'Projects' && sidebarTab === 'Visualizer' && (
            <VisualizerView
              currentTrack={currentTrack}
              isPlaying={isPlaying}
              setIsPlaying={setIsPlaying}
              speed={speed}
              setSpeed={setSpeed}
              noteMappings={noteMappings}
              onPlayKeyboardKey={handlePlayKeyboardKey}
            />
          )}

          {activeTab === 'Projects' && sidebarTab === 'MIDI Setup' && (
            <MidiSetupView
              noteMappings={noteMappings}
              setNoteMappings={setNoteMappings}
              onStartVisualizer={handleStartVisualizerCommand}
            />
          )}

          {activeTab === 'Projects' && sidebarTab === 'Sequence' && (
            <MidiSetupView
              noteMappings={noteMappings}
              setNoteMappings={setNoteMappings}
              onStartVisualizer={handleStartVisualizerCommand}
            />
          )}

          {activeTab === 'Library' && (
            <LibraryView 
              currentTrack={currentTrack}
              onSelectTrack={handleSelectTrack} 
            />
          )}

          {activeTab === 'Analytics' && (
            <AnalyticsView />
          )}

          {/* Fallback to visualizer setup for empty index routes */}
          {activeTab === 'Automation' && (
            <MidiSetupView
              noteMappings={noteMappings}
              setNoteMappings={setNoteMappings}
              onStartVisualizer={handleStartVisualizerCommand}
            />
          )}
        </main>

      </div>

      {/* Global Toast System banner loop */}
      {toast && (
        <div className="fixed bottom-14 left-1/2 -translate-x-1/2 bg-surface-container-high text-[#00e5ff] border border-[#00edf3]/40 px-5 py-2.5 rounded-xl z-50 flex items-center gap-3.5 shadow-2xl backdrop-blur-md animate-bounce">
          <span className="w-2 h-2 rounded-full bg-[#00e5ff] animate-pulse"></span>
          <span className="font-mono text-xs font-bold tracking-tight uppercase">{toast}</span>
        </div>
      )}

      {/* System Workspace Footer Bar connected to active selenium status */}
      <footer className="fixed bottom-0 w-full h-10 bg-surface-container-lowest border-t border-outline-variant px-margin-desktop flex justify-between items-center z-50 select-none">
        <span className="font-mono text-[10px] text-tertiary-fixed font-bold">
          © 2024 RhythmEngine Automation. Selenium Connected.
        </span>
        <div className="flex gap-6">
          <a 
            href="#" 
            onClick={(e) => { e.preventDefault(); alert('Redirecting to Workspace API Markdown documentation.'); }}
            className="font-mono text-[10px] text-on-surface-variant hover:text-tertiary transition-colors duration-200"
          >
            Documentation
          </a>
          <a 
            href="#" 
            onClick={(e) => { e.preventDefault(); alert('API gateway response latency: 4.8ms. All channels stable and sync-active.'); }}
            className="font-mono text-[10px] text-on-surface-variant hover:text-tertiary transition-colors duration-200"
          >
            API Status
          </a>
          <a 
            href="#" 
            onClick={(e) => { e.preventDefault(); alert('RhythmEngine client automation workspace secure session protocol: TLSv1.3. Your credentials are fully protected.'); }}
            className="font-mono text-[10px] text-on-surface-variant hover:text-tertiary transition-colors duration-200"
          >
            Privacy
          </a>
        </div>
      </footer>

    </div>
  );
}
