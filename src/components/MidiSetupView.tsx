import React, { useState } from 'react';
import { NoteMapping } from '../types';
import { playPitch } from '../utils/synth';
import { TRACK_IMAGES } from '../data';

interface MidiSetupViewProps {
  noteMappings: NoteMapping[];
  setNoteMappings: React.Dispatch<React.SetStateAction<NoteMapping[]>>;
  onStartVisualizer: () => void;
}

export default function MidiSetupView({
  noteMappings,
  setNoteMappings,
  onStartVisualizer,
}: MidiSetupViewProps) {
  const [dragActive, setDragActive] = useState(false);
  const [fileMeta, setFileMeta] = useState({
    name: 'Neon_Dreams_v2.mid',
    events: '4,281 Events',
    duration: '2:45',
    bpm: 128,
  });

  // Calculate unmapped elements dynamically
  const unmappedCount = noteMappings.filter((m) => !m.keyboardKey.trim()).length;

  // Handle changing key binding cell
  const handleKeyChange = (index: number, val: string) => {
    // Only accept 1 character or empty
    const keyChar = val.slice(-1).toUpperCase();
    const updated = [...noteMappings];
    updated[index].keyboardKey = keyChar;
    setNoteMappings(updated);

    // Play visual audible note confirmation
    if (keyChar) {
      const pitchNum = parseInt(updated[index].pitchIndex);
      playPitch(pitchNum, 0.2, 'triangle');
    }
  };

  // Delete action mapping
  const handleDeleteMapping = (index: number) => {
    const updated = [...noteMappings];
    updated[index].keyboardKey = '';
    setNoteMappings(updated);
  };

  // Reset defaults action
  const handleResetDefaults = () => {
    const defaults: NoteMapping[] = [
      { pitchIndex: '060', musicalNote: 'C4', keyboardKey: 'A', velocitySensitivity: 'Active' },
      { pitchIndex: '061', musicalNote: 'C#4', keyboardKey: 'W', velocitySensitivity: 'Active' },
      { pitchIndex: '062', musicalNote: 'D4', keyboardKey: 'S', velocitySensitivity: 'Active' },
      { pitchIndex: '063', musicalNote: 'D#4', keyboardKey: 'E', velocitySensitivity: 'Active' },
      { pitchIndex: '064', musicalNote: 'E4', keyboardKey: 'D', velocitySensitivity: 'Active' },
      { pitchIndex: '065', musicalNote: 'F4', keyboardKey: 'F', velocitySensitivity: 'Active' },
      { pitchIndex: '066', musicalNote: 'F#4', keyboardKey: 'T', velocitySensitivity: 'Active' },
      { pitchIndex: '067', musicalNote: 'G4', keyboardKey: '', velocitySensitivity: 'Active' },
      { pitchIndex: '068', musicalNote: 'G#4', keyboardKey: '', velocitySensitivity: 'Active' },
      { pitchIndex: '069', musicalNote: 'A4', keyboardKey: '', velocitySensitivity: 'Active' },
    ];
    setNoteMappings(defaults);
  };

  // Export mappings file helper
  const handleExportMap = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(noteMappings, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'RhythmEngine_Keymap.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Fake file processor triggered by dropping
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      setFileMeta({
        name: droppedFile.name,
        events: `${Math.floor(2000 + Math.random() * 3000)} Events`,
        duration: '03:12',
        bpm: 135,
      });
      // Play brief success sound effect
      playPitch(72, 0.4, 'sine');
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFileMeta({
        name: selectedFile.name,
        events: `${Math.floor(2000 + Math.random() * 3000)} Events`,
        duration: '03:12',
        bpm: 130,
      });
      playPitch(72, 0.4, 'sine');
    }
  };

  const playPreviewChime = () => {
    // Play arpeggio
    const chord = [60, 62, 64, 67, 69, 72];
    chord.forEach((pitch, idx) => {
      setTimeout(() => {
        playPitch(pitch, 0.35, 'triangle');
      }, idx * 120);
    });
  };

  return (
    <div id="midi-setup-content" className="max-w-6xl mx-auto p-margin-desktop space-y-8 select-none text-on-surface">
      {/* Header Section */}
      <section className="flex flex-col gap-2">
        <h1 className="font-sans text-3xl font-bold text-primary tracking-tight md:text-5xl">Sequence Configuration</h1>
        <p className="font-sans text-base text-on-surface-variant max-w-2xl leading-relaxed">
          Upload your MIDI or JSON sequence files to begin the visualization process. Map your hardware keys to specific pitches for live performance simulation.
        </p>
      </section>

      {/* Grid Configuration Panels Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Drag/Drop Area & Core mapping chart */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Drag & Drop Zone */}
          <div
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            className={`relative group h-64 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-4 transition-all overflow-hidden ${
              dragActive 
                ? 'border-primary bg-surface-container-high' 
                : 'border-[#3b494c] bg-surface-container-low hover:border-primary/60 hover:bg-surface-container/50'
            }`}
          >
            <input 
              type="file" 
              id="file-input" 
              accept=".mid,.midi,.json"
              onChange={handleFileSelect}
              className="hidden" 
            />
            
            <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary-container via-transparent to-transparent"></div>
            
            <div className="flex flex-col items-center z-10 p-6 text-center">
              <span className="material-symbols-outlined text-5xl text-primary-container mb-3 group-hover:scale-110 transition-transform">
                upload_file
              </span>
              <h3 className="font-sans text-lg font-bold">Drop sequence files here</h3>
              <p className="font-sans text-xs text-on-surface-variant mt-1.5">Support for .MIDI, .MID, and .JSON formats</p>
              
              <label 
                htmlFor="file-input"
                className="mt-5 px-6 py-2 bg-primary text-on-primary text-sm font-semibold rounded-lg hover:brightness-110 active:scale-95 transition-all cursor-pointer"
              >
                Browse Files
              </label>
            </div>
          </div>

          {/* Note Mapping Table */}
          <div className="bg-surface-container border border-[#3b494c]/80 rounded-xl overflow-hidden shadow-lg">
            <div className="px-6 py-4 border-b border-[#3b494c]/50 flex justify-between items-center bg-surface-container-highest/10">
              <h3 className="font-sans font-semibold text-[#dab9ff]">Note Mapping</h3>
              <div className="flex gap-2">
                <button 
                  onClick={handleResetDefaults}
                  className="px-3 py-1 bg-surface-variant text-on-surface-variant font-mono text-[11px] rounded hover:text-primary hover:bg-surface-container-high transition-colors border border-[#3b494c]/50"
                >
                  Reset Defaults
                </button>
                <button 
                  onClick={handleExportMap}
                  className="px-3 py-1 bg-surface-variant text-on-surface-variant font-mono text-[11px] rounded hover:text-primary hover:bg-surface-container-high transition-colors border border-[#3b494c]/50"
                >
                  Export Map
                </button>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs">
                <thead>
                  <tr className="text-on-surface-variant border-b border-[#3b494c]/60 bg-surface-container-low/40">
                    <th className="px-6 py-3 font-medium tracking-wider">Pitch Index</th>
                    <th className="px-6 py-3 font-medium tracking-wider">Musical Note</th>
                    <th className="px-6 py-3 font-medium tracking-wider">Keyboard Key</th>
                    <th className="px-6 py-3 font-medium tracking-wider">Velocity Sensitivity</th>
                    <th className="px-6 py-3 font-medium tracking-wider text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#3b494c]/30">
                  {noteMappings.map((map, i) => (
                    <tr key={map.pitchIndex} className="hover:bg-surface-container-high/30 transition-colors">
                      <td className="px-6 py-3 text-on-surface-variant">{map.pitchIndex}</td>
                      <td className="px-6 py-3 text-primary font-bold">{map.musicalNote}</td>
                      <td className="px-6 py-3">
                        <input
                          type="text"
                          value={map.keyboardKey}
                          onChange={(e) => handleKeyChange(i, e.target.value)}
                          placeholder="—"
                          className={`w-10 bg-surface-container-lowest border text-center rounded py-1 tracking-wider outline-none text-xs focus:border-primary font-bold uppercase transition-all ${
                            !map.keyboardKey ? 'border-error/40 text-error placeholder-error/40 animate-pulse' : 'border-[#3b494c] text-on-surface'
                          }`}
                        />
                      </td>
                      <td className="px-6 py-3">
                        <span className="px-2 py-0.5 rounded-full bg-on-tertiary-container/10 text-tertiary border border-tertiary/20 text-[10px]">
                          {map.velocitySensitivity}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-right">
                        <button
                          onClick={() => handleDeleteMapping(i)}
                          title="Clear Key"
                          className="material-symbols-outlined text-on-surface-variant hover:text-error text-lg align-middle"
                        >
                          delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* Right Column: Validation Status & Beautiful Media Preview */}
        <div className="space-y-6">
          
          {/* Validation Checklist Panel Card */}
          <div className="bg-surface-container rounded-xl p-6 border border-[#3b494c]">
            <h3 className="font-sans text-lg font-bold text-primary mb-6">Validation Checklist</h3>
            
            <ul className="space-y-5">
              <li className="flex items-start gap-4">
                <span className="material-symbols-outlined text-tertiary select-none" style={{ fontVariationSettings: "'FILL' 1" }}>
                  check_circle
                </span>
                <div className="flex flex-col">
                  <span className="font-sans text-sm font-semibold text-on-surface">File Extension Valid</span>
                  <span className="font-mono text-[10px] text-on-surface-variant opacity-60">Detected: .MIDI</span>
                </div>
              </li>
              
              <li className="flex items-start gap-4">
                <span className="material-symbols-outlined text-tertiary select-none" style={{ fontVariationSettings: "'FILL' 1" }}>
                  check_circle
                </span>
                <div className="flex flex-col">
                  <span className="font-sans text-sm font-semibold text-on-surface">Data Structure Parsing</span>
                  <span className="font-mono text-[10px] text-on-surface-variant opacity-60">Schema match: v2.4</span>
                </div>
              </li>
              
              <li className="flex items-start gap-4 animate-fade-in">
                {unmappedCount > 0 ? (
                  <>
                    <span className="material-symbols-outlined text-error select-none" style={{ fontVariationSettings: "'FILL' 1" }}>
                      error
                    </span>
                    <div className="flex flex-col">
                      <span className="font-sans text-sm font-semibold text-on-surface">Unmapped Key Intervals</span>
                      <span className="font-mono text-[10px] text-error">
                        {unmappedCount} notes lack keyboard bindings
                      </span>
                    </div>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-tertiary select-none" style={{ fontVariationSettings: "'FILL' 1" }}>
                      check_circle
                    </span>
                    <div className="flex flex-col">
                      <span className="font-sans text-sm font-semibold text-on-surface">Unmapped Key Intervals</span>
                      <span className="font-mono text-[10px] text-tertiary">All intervals mapped successfully</span>
                    </div>
                  </>
                )}
              </li>

              <li className="flex items-start gap-4">
                {unmappedCount > 0 ? (
                  <>
                    <span className="material-symbols-outlined text-on-surface-variant">radio_button_unchecked</span>
                    <div className="flex flex-col">
                      <span className="font-sans text-sm font-semibold text-on-surface-variant">Playback Sync Test</span>
                      <span className="font-mono text-[10px] text-on-surface-variant opacity-60">Awaiting map completion</span>
                    </div>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-tertiary select-none" style={{ fontVariationSettings: "'FILL' 1" }}>
                      check_circle
                    </span>
                    <div className="flex flex-col">
                      <span className="font-sans text-sm font-semibold text-on-surface">Playback Sync Test</span>
                      <span className="font-mono text-[10px] text-tertiary">Ready for live visualization</span>
                    </div>
                  </>
                )}
              </li>
            </ul>

            <div className="mt-8 pt-6 border-t border-[#3b494c]">
              <button
                disabled={unmappedCount > 0}
                onClick={onStartVisualizer}
                className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 active:scale-[0.98] transition-all ${
                  unmappedCount > 0
                    ? 'bg-primary-container/20 text-[#00626e]/60 border border-[#00e5ff]/10 opacity-60 cursor-not-allowed'
                    : 'bg-primary-container text-on-primary-container hover:brightness-110 shadow-lg shadow-primary-container/10'
                }`}
              >
                <span className="material-symbols-outlined">play_circle</span>
                START VISUALIZER
              </button>
              
              {unmappedCount > 0 && (
                <p className="text-center font-mono text-[10px] text-error mt-3">
                  Please resolve unmapped intervals in Note Mapping table to start.
                </p>
              )}
            </div>
          </div>

          {/* Visual Preview Studio Monitor Layout */}
          <div className="bg-surface-container rounded-xl overflow-hidden border border-[#3b494c] group">
            <div className="aspect-video relative overflow-hidden bg-black flex items-center justify-center">
              <img 
                src={TRACK_IMAGES.studioPreview} 
                alt="Studio Visualizer Preview" 
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover opacity-50 group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent"></div>
              
              <button 
                onClick={playPreviewChime}
                className="absolute w-12 h-12 rounded-full bg-primary/20 backdrop-blur-sm flex items-center justify-center border border-primary/50 group-hover:bg-primary/40 active:scale-90 transition-all z-10"
              >
                <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
                  play_arrow
                </span>
              </button>

              <div className="absolute bottom-3 left-3 flex gap-2 z-10">
                <span className="px-2 py-0.5 bg-black/80 rounded text-[10px] font-mono text-primary border border-primary/25">PREVIEW</span>
                <span className="px-2 py-0.5 bg-black/80 rounded text-[10px] font-mono text-on-surface-variant">BPM: {fileMeta.bpm}</span>
              </div>
            </div>

            <div className="p-4">
              <h4 className="font-sans font-semibold text-sm tracking-tight text-on-surface">{fileMeta.name}</h4>
              <p className="font-mono text-[10px] text-on-surface-variant mt-1.5 uppercase">
                {fileMeta.duration} • {fileMeta.events}
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
