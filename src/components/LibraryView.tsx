import React, { useState } from 'react';
import { Track } from '../types';
import { INITIAL_TRACKS } from '../data';
import { playPitch } from '../utils/synth';

interface LibraryViewProps {
  currentTrack: Track;
  onSelectTrack: (track: Track) => void;
}

export default function LibraryView({ currentTrack, onSelectTrack }: LibraryViewProps) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'ALL' | 'FAVORITES' | 'SEQUENCES'>('ALL');
  const [favorites, setFavorites] = useState<string[]>(['neonHorizon', 'voidEchoes']);
  const [loadingTrackId, setLoadingTrackId] = useState<string | null>(null);

  // Dynamic search and filter logic
  const tracksToRender = INITIAL_TRACKS.filter((track) => {
    const matchesSearch = track.title.toLowerCase().includes(search.toLowerCase()) || 
                          track.mix.toLowerCase().includes(search.toLowerCase());
    
    if (filter === 'FAVORITES') {
      return matchesSearch && favorites.includes(track.id);
    }
    // Sequences category represents high density songs e.g. bpm > 120
    if (filter === 'SEQUENCES') {
      return matchesSearch && track.bpm >= 120;
    }
    return matchesSearch;
  });

  const toggleFavorite = (trackId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (favorites.includes(trackId)) {
      setFavorites(favorites.filter((f) => f !== trackId));
      playPitch(55, 0.15, 'sawtooth');
    } else {
      setFavorites([...favorites, trackId]);
      playPitch(67, 0.2, 'sine');
    }
  };

  const handleLoadTrack = (track: Track) => {
    setLoadingTrackId(track.id);
    
    // Play synthesis chord sequence as a loading confirmation chime!
    const chord = [64, 67, 71, 76];
    chord.forEach((note, index) => {
      setTimeout(() => {
        playPitch(note, 0.4, 'sine');
      }, index * 100);
    });

    setTimeout(() => {
      onSelectTrack(track);
      setLoadingTrackId(null);
    }, 1200);
  };

  return (
    <div id="library-content" className="max-w-7xl mx-auto p-margin-desktop space-y-8 select-none text-on-surface">
      
      {/* Header & Filter Controls Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <h1 className="font-sans text-3xl font-bold text-primary tracking-tight md:text-5xl">Song Library</h1>
          <p className="text-on-surface-variant text-base mt-2 max-w-2xl">
            Access your high-performance MIDI sequences and uploaded waveforms. Calibrated for real-time visualization at 60FPS.
          </p>
        </div>
        
        {/* Actions row */}
        <div className="flex flex-wrap gap-4 items-center">
          {/* Search Bar matching screenshot */}
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg">
              search
            </span>
            <input
              type="text"
              placeholder="Search library... "
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-surface-container-high text-on-surface text-sm pl-10 pr-4 py-2 rounded-lg w-64 border border-[#3b494c]/50 focus:ring-1 focus:ring-primary outline-none transition-all"
            />
          </div>

          <button 
            onClick={() => {
              playPitch(72, 0.35, 'triangle');
              alert('New MIDI Sequence upload workflow trigger. Drag & Drop folder files inside MIDI Setup in "Projects" of workspace.');
            }}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-on-primary text-sm font-bold rounded-lg hover:brightness-110 active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-sm">upload_file</span>
            UPLOAD NEW
          </button>
          
          <div className="flex items-center bg-surface-container-high rounded-lg p-1 border border-[#3b494c]/60">
            {['ALL', 'FAVORITES', 'SEQUENCES'].map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setFilter(cat as any);
                  playPitch(62, 0.15, 'triangle');
                }}
                className={`px-3 py-1 rounded text-xs font-mono tracking-wider transition-colors uppercase ${
                  filter === cat 
                    ? 'bg-surface-variant text-primary font-bold' 
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid Layout Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Card 1: Recently Played Large Horizontal (Featured) */}
        {tracksToRender.some((t) => t.id === 'neonHorizon') && (
          <div className="col-span-1 md:col-span-2 bg-surface-container rounded-xl overflow-hidden border border-[#3b494c] hover:border-primary/50 transition-all group flex flex-col md:flex-row">
            <div className="w-full md:w-2/5 relative h-48 md:h-auto overflow-hidden bg-black select-none">
              <img
                src={INITIAL_TRACKS[0].image}
                alt="Keyboard synthesize mockup"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-105 group-hover:scale-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-surface-container/90 via-surface-container/20 to-transparent"></div>
              
              <div className="absolute top-4 left-4 bg-primary/25 backdrop-blur-md border border-primary/30 px-3 py-1 rounded-full flex items-center gap-2">
                <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
                <span className="text-primary font-mono text-[9px] uppercase tracking-widest font-bold">Recently Played</span>
              </div>
            </div>
            
            <div className="p-6 flex flex-col justify-between flex-1">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="font-sans text-xl font-bold group-hover:text-primary transition-colors">
                      {INITIAL_TRACKS[0].title} - Extended Mix
                    </h4>
                    <span className="text-on-surface-variant text-xs font-mono">{INITIAL_TRACKS[0].mix}</span>
                  </div>
                  
                  <button
                    onClick={(e) => toggleFavorite('neonHorizon', e)}
                    className="text-primary hover:scale-110 active:scale-90 transition-all"
                  >
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: favorites.includes('neonHorizon') ? "'FILL' 1" : "'FILL' 0" }}>
                      star
                    </span>
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="flex flex-col">
                    <span className="font-mono text-[10px] text-on-surface-variant uppercase">Duration</span>
                    <span className="font-mono text-sm text-primary font-semibold">{INITIAL_TRACKS[0].duration}</span>
                  </div>
                  
                  <div className="flex flex-col">
                    <span className="font-mono text-[10px] text-on-surface-variant uppercase">Note Density</span>
                    <span className="font-mono text-sm text-tertiary font-semibold">{INITIAL_TRACKS[0].noteDensity} BPM-N</span>
                  </div>
                  
                  <div className="flex flex-col col-span-2">
                    <span className="font-mono text-[10px] text-on-surface-variant uppercase mb-1.5">Complexity</span>
                    <div className="flex gap-1">
                      {Array.from({ length: 4 }).map((_, bIdx) => (
                        <div 
                          key={bIdx}
                          className={`h-1.5 w-5 rounded-full ${
                            bIdx < INITIAL_TRACKS[0].complexity ? 'bg-primary' : 'bg-primary/20'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <button
                disabled={loadingTrackId === 'neonHorizon'}
                onClick={() => handleLoadTrack(INITIAL_TRACKS[0])}
                className={`w-full py-3 bg-primary text-on-primary text-sm font-bold rounded-lg hover:shadow-[0_0_20px_rgba(0,218,243,0.3)] hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 ${
                  loadingTrackId === 'neonHorizon' ? 'opacity-80' : ''
                }`}
              >
                {loadingTrackId === 'neonHorizon' ? (
                  <>
                    <span className="material-symbols-outlined animate-spin text-lg">refresh</span>
                    BUFFERING SEQUENCEDATA...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-lg">play_circle</span>
                    LOAD TO ENGINE
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Outer tracks list standard cards matching Screenshot 3 */}
        {tracksToRender
          .filter((t) => t.id !== 'neonHorizon')
          .map((track) => {
            const isFav = favorites.includes(track.id);
            const isLoading = loadingTrackId === track.id;
            
            // Assign custom tags based on metadata inside mockups
            let densityStyle = 'text-tertiary';
            if (track.densityRating === 'ELITE DENSITY' || track.densityRating === 'HEAVY') {
              densityStyle = 'text-error italic font-bold';
            } else if (track.densityRating === 'LOW DENSITY') {
              densityStyle = 'text-on-tertiary-container font-semibold';
            }

            return (
              <div 
                key={track.id}
                className="bg-surface-container rounded-xl overflow-hidden border border-[#3b494c] hover:border-primary/50 transition-all group flex flex-col"
              >
                <div className="h-40 relative overflow-hidden bg-black select-none">
                  <img 
                    src={track.image} 
                    alt={track.title} 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover brightness-50 group-hover:brightness-75 group-hover:scale-105 transition-all duration-500"
                  />
                  
                  <div className="absolute top-3 right-3 z-10">
                    <button
                      onClick={(e) => toggleFavorite(track.id, e)}
                      className="text-primary hover:scale-110 active:scale-90 transition-all bg-black/40 p-1.5 rounded-full backdrop-blur-sm border border-[#3b494c]/40"
                    >
                      <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: isFav ? "'FILL' 1" : "'FILL' 0" }}>
                        star
                      </span>
                    </button>
                  </div>

                  <div className="absolute bottom-4 left-4">
                    <span className="bg-tertiary/10 text-tertiary px-2 py-0.5 rounded font-mono text-[9px] border border-tertiary/30 uppercase tracking-wider font-bold">
                      MIDI {track.id === 'cyberneticPulse' ? 'GEN-2' : 'PRO-CORE'}
                    </span>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col">
                  <div className="mb-2">
                    <h4 className="text-base font-bold text-on-surface line-clamp-1">{track.title}</h4>
                    <p className="text-mono text-[10px] text-on-surface-variant opacity-75 mt-0.5">Sequence ID: #{track.id.slice(0, 4).toUpperCase()}-{(track.bpm * 1.5).toFixed(0)}</p>
                  </div>
                  
                  <div className="mt-auto pt-4 space-y-4">
                    <div className="flex justify-between items-center text-xs font-mono">
                      <span className="text-on-surface-variant">{track.duration} min</span>
                      <span className={`${densityStyle} text-[10px] uppercase tracking-wider`}>
                        {track.densityRating}
                      </span>
                    </div>

                    <button
                      disabled={isLoading}
                      onClick={() => handleLoadTrack(track)}
                      className={`w-full py-2 bg-transparent hover:bg-primary/5 border border-primary text-primary font-bold text-xs rounded-lg active:scale-95 transition-all flex items-center justify-center gap-2 ${
                        isLoading ? 'opacity-80' : ''
                      }`}
                    >
                      {isLoading ? (
                        <>
                          <span className="material-symbols-outlined animate-spin text-sm">refresh</span>
                          BUFFERING...
                        </>
                      ) : (
                        <>
                          <span className="material-symbols-outlined text-sm">
                            {track.densityRating === 'ELITE DENSITY' ? 'bolt' : 'play_arrow'}
                          </span>
                          {track.densityRating === 'ELITE DENSITY' ? 'FAST LOAD' : 'LOAD TO WORKSPACE'}
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

      </div>
    </div>
  );
}
