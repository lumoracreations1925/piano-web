import React, { useState, useEffect, useRef } from 'react';
import { AutomationEvent } from '../types';
import { INITIAL_EVENTS, TRACK_IMAGES } from '../data';
import { playPitch } from '../utils/synth';

export default function AnalyticsView() {
  const [logs, setLogs] = useState<AutomationEvent[]>(INITIAL_EVENTS);
  const [latency, setLatency] = useState(4.8);
  const [jitter, setJitter] = useState(1.2);
  const [ops, setOps] = useState(124.8);
  const [errorRate, setErrorRate] = useState(0.02);
  const [bufLoad, setBufLoad] = useState(14);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Oscillating metrics to simulate a live automated trigger system
  useEffect(() => {
    const timer = setInterval(() => {
      setLatency(parseFloat((4.2 + Math.random() * 1.2).toFixed(1)));
      setJitter(parseFloat((0.9 + Math.random() * 0.5).toFixed(1)));
      setOps(parseFloat((122 + Math.random() * 5).toFixed(1)));
      setBufLoad(Math.round(12 + Math.random() * 6));
      
      // Keep error rate stable but vary slightly
      if (Math.random() > 0.95) {
        setErrorRate(parseFloat((0.01 + Math.random() * 0.03).toFixed(2)));
      }

      // Append live ticker trigger log event procedurally
      const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false }) + '.' + 
                        Math.floor(Math.random() * 1000).toString().padStart(3, '0');
      const driverId = 'SEL_0' + Math.floor(10 + Math.random() * 89);
      const metricsList = ['0.5ms', '1.1ms', '0.8ms', '1.6ms', '--', '2.1ms'];
      const eventTypes = ['KEY_TRIG_DOWN', 'KEY_TRIG_UP', 'SUSTAIN_EVENT', 'API_SYNC_HB'];
      
      const randomEvent = eventTypes[Math.floor(Math.random() * eventTypes.length)];
      const randomMetric = metricsList[Math.floor(Math.random() * metricsList.length)];
      const isFail = Math.random() > 0.97;

      const newLog: AutomationEvent = {
        id: Math.random().toString(),
        timestamp,
        eventType: isFail ? 'BUFFER_OVERFLOW' : randomEvent,
        driverId: isFail ? 'SYS_CORE' : driverId,
        metric: isFail ? '88.4ms' : randomMetric,
        status: isFail ? 'FAIL' : 'OK',
      };

      setLogs((prev) => {
        const next = [newLog, ...prev];
        return next.slice(0, 30); // keep max 30 records
      });

      // Play very quiet clicks on events if authorized
      if (Math.random() > 0.8) {
        playPitch(76, 0.05, 'sine');
      }

    }, 3000);

    return () => clearInterval(timer);
  }, []);

  const handleExportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + ["TIMESTAMP,EVENT_TYPE,DRIVER_ID,METRIC,STATUS", 
         ...logs.map(l => `${l.timestamp},${l.eventType},${l.driverId},${l.metric},${l.status}`)]
        .join("\n");
    const encodedUri = encodeURI(csvContent);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', encodedUri);
    downloadAnchor.setAttribute('download', 'rhythm_engine_automation_analytics.csv');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div id="analytics-content" className="max-w-7xl mx-auto p-margin-desktop space-y-8 select-none text-on-surface">
      
      {/* Dashboard Title & Top Active Badges */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <h1 className="font-sans text-3xl font-bold text-primary tracking-tight md:text-5xl">Automation Analytics</h1>
          <p className="font-sans text-base text-on-surface-variant mt-2 max-w-2xl">
            Real-time performance metrics for the Selenium-driven keyboard trigger engine. Monitoring jitter, latency, and polyphonic distribution.
          </p>
        </div>
        
        <div className="flex gap-2.5">
          <div className="bg-surface-container px-4 py-2 rounded-lg border border-outline-variant flex items-center gap-2 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-tertiary-fixed shadow-[0_0_8px_rgba(79,251,230,0.6)]"></span>
            <span className="font-mono text-tertiary tracking-tight font-bold uppercase">MIDI Connected</span>
          </div>
          <div className="bg-surface-container px-4 py-2 rounded-lg border border-outline-variant flex items-center gap-2 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-error shadow-[0_0_8px_rgba(255,180,171,0.6)] animate-pulse"></span>
            <span className="font-mono text-error tracking-tight font-bold uppercase">Sel-Sync Active</span>
          </div>
        </div>
      </div>

      {/* Bento Grid layout matching screenshot 4 */}
      <div className="grid grid-cols-12 gap-6">
        
        {/* Timing Accuracy Line Chart */}
        <div className="col-span-12 lg:col-span-8 bg-surface-container border border-outline-variant rounded-xl p-6 flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary">timer</span>
              <h3 className="font-sans font-bold text-[#e5e2e1]">Timing Accuracy (ms)</h3>
            </div>
            <div className="flex gap-3 text-[10px] font-mono font-bold">
              <span className="text-on-surface-variant">JITTER: <span className="text-primary">{jitter}ms</span></span>
              <span className="text-on-surface-variant">LATENCY: <span className="text-secondary">{latency}ms</span></span>
            </div>
          </div>

          <div className="h-64 relative flex items-end px-2 border-b border-l border-[#3b494c]/30">
            {/* SVG Chart Background grid lines */}
            <div className="absolute inset-0 grid grid-rows-4 grid-cols-12 pointer-events-none opacity-5">
              {Array.from({ length: 4 }).map((_, rIdx) => (
                <div key={rIdx} className="border-t border-[#849396] col-span-12 row-span-1"></div>
              ))}
            </div>

            {/* Glowing SVG Coordinate Path representing precision sync line graph */}
            <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 1000 100">
              <defs>
                <linearGradient id="glowLineGradient" x1="0%" x2="100%" y1="0%" y2="0%">
                  <stop offset="0%" stopColor="#00daf3" />
                  <stop offset="50%" stopColor="#cfa7ff" />
                  <stop offset="100%" stopColor="#30e8d4" />
                </linearGradient>
              </defs>
              {/* Dynamic Line with smooth cubic markers */}
              <path 
                d="M 0 75 Q 70 85 100 60 T 200 45 T 300 20 T 400 40 T 500 15 T 600 35 T 700 15 T 800 55 T 900 12 T 950 25 T 1000 5" 
                fill="none" 
                stroke="url(#glowLineGradient)" 
                strokeWidth="2.5" 
              />
              {/* Diffuse aesthetic backglow overlay */}
              <path 
                d="M 0 75 Q 70 85 100 60 T 200 45 T 300 20 T 400 40 T 500 15 T 600 35 T 700 15 T 800 55 T 900 12 T 950 25 T 1000 5" 
                fill="none" 
                filter="blur(4px)" 
                stroke="url(#glowLineGradient)" 
                strokeOpacity="0.3" 
                strokeWidth="7" 
              />
            </svg>
          </div>

          <div className="flex justify-between font-mono text-[9px] text-on-surface-variant font-semibold tracking-wider px-2 uppercase">
            <span>-60s</span>
            <span>-45s</span>
            <span>-30s</span>
            <span>-15s</span>
            <span>Now</span>
          </div>
        </div>

        {/* Dynamic Key Performance Chips */}
        <div className="col-span-12 lg:col-span-4 grid grid-cols-2 gap-4">
          <div className="bg-surface-container p-5 rounded-xl border border-outline-variant flex flex-col justify-between">
            <span className="font-mono text-[10px] text-on-surface-variant uppercase font-bold tracking-widest">Ops / Sec</span>
            <span className="font-sans text-3xl font-bold text-primary">{ops.toFixed(1)}</span>
          </div>
          
          <div className="bg-surface-container p-5 rounded-xl border border-outline-variant flex flex-col justify-between">
            <span className="font-mono text-[10px] text-on-surface-variant uppercase font-bold tracking-widest">Error Rate</span>
            <span className="font-sans text-3xl font-bold text-error">{errorRate}%</span>
          </div>
          
          <div className="bg-surface-container p-5 rounded-xl border border-outline-variant flex flex-col justify-between">
            <span className="font-mono text-[10px] text-on-surface-variant uppercase font-bold tracking-widest">Threads</span>
            <span className="font-sans text-3xl font-bold text-tertiary">32</span>
          </div>
          
          <div className="bg-surface-container p-5 rounded-xl border border-outline-variant flex flex-col justify-between">
            <span className="font-mono text-[10px] text-on-surface-variant uppercase font-bold tracking-widest">Buf Load</span>
            <span className="font-sans text-3xl font-bold text-secondary">{bufLoad}%</span>
          </div>
        </div>

        {/* Note Distribution Bar Chart Octaves */}
        <div className="col-span-12 lg:col-span-4 bg-surface-container border border-outline-variant rounded-xl p-6 flex flex-col gap-4 shadow-md">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-secondary">bar_chart</span>
            <h3 className="font-sans font-bold text-[#e5e2e1]">Note Distribution</h3>
          </div>
          
          <div className="flex-grow flex items-end gap-2.5 h-48 border-b border-[#3b494c]/20 pb-1">
            {[40, 65, 90, 75, 30, 15].map((height, idx) => (
              <div 
                key={idx}
                title={`Octave C${idx+1}: frequency strength ${height}%`}
                className="flex-1 bg-secondary/10 hover:bg-secondary/35 border-t-2 border-secondary rounded-t transition-all cursor-pointer relative group"
                style={{ height: `${height}%` }}
              >
                {/* Micro tech info overlay */}
                <span className="absolute -top-7 left-1/2 -translate-x-1/2 scale-0 group-hover:scale-100 transition-all text-[8px] bg-black border border-outline-variant px-1 rounded font-mono text-primary font-bold">
                  {height}%
                </span>
              </div>
            ))}
          </div>

          <div className="flex justify-between font-mono text-[10px] font-bold text-on-surface-variant px-1">
            <span>C1</span>
            <span>C2</span>
            <span>C3</span>
            <span>C4</span>
            <span>C5</span>
            <span>C6</span>
          </div>
        </div>

        {/* Event Logs List Table */}
        <div className="col-span-12 lg:col-span-8 bg-surface-container border border-outline-variant rounded-xl p-6 flex flex-col gap-4 shadow-md">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-tertiary">list_alt</span>
              <h3 className="font-sans font-bold text-[#e5e2e1]">Automation Events</h3>
            </div>
            
            <button 
              onClick={handleExportCSV}
              className="bg-surface-container-high text-on-surface hover:text-primary border border-outline-variant font-mono text-[10px] font-bold px-3 py-1 rounded transition-colors uppercase tracking-wider"
            >
              Export CSV
            </button>
          </div>

          <div className="overflow-y-auto max-h-[190px] border border-[#3b494c]/30 rounded-lg">
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 bg-surface-container-high z-10">
                <tr className="font-mono text-[10px] text-on-surface-variant border-b border-[#3b494c]/50">
                  <th className="p-3 font-semibold uppercase tracking-wider">Timestamp</th>
                  <th className="p-3 font-semibold uppercase tracking-wider">Event Type</th>
                  <th className="p-3 font-semibold uppercase tracking-wider">Driver ID</th>
                  <th className="p-3 font-semibold uppercase tracking-wider">Metric</th>
                  <th className="p-3 font-semibold uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="font-mono text-xs">
                {logs.map((log) => {
                  const isFail = log.status === 'FAIL';
                  return (
                    <tr 
                      key={log.id} 
                      className={`border-b border-[#3b494c]/25 hover:bg-surface-variant/20 transition-colors ${
                        isFail ? 'bg-error-container/10' : ''
                      }`}
                    >
                      <td className="p-3 text-on-surface-variant font-medium">{log.timestamp}</td>
                      <td className={`p-3 font-bold ${
                        isFail ? 'text-error' : log.eventType.includes('DOWN') ? 'text-primary' : 'text-secondary'
                      }`}>
                        {log.eventType}
                      </td>
                      <td className="p-3 text-on-surface-variant opacity-80">{log.driverId}</td>
                      <td className="p-3 text-on-surface-variant opacity-80">{log.metric}</td>
                      <td className="p-3 font-bold">
                        <span className={`px-1.5 py-0.5 rounded text-[10px] ${
                          isFail ? 'bg-error-container/20 text-error' : 'bg-tertiary/10 text-tertiary'
                        }`}>
                          {log.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Live Feed Render Layer preview container matching screenshot 3/4 */}
        <div className="col-span-12 bg-surface-container border border-outline-variant rounded-xl overflow-hidden relative group shadow-md select-none">
          
          <div className="absolute top-4 left-4 z-10 bg-surface-container-low/95 border border-[#3b494c]/60 px-4 py-2 rounded-lg backdrop-blur shadow-md">
            <h4 className="font-mono text-xs text-primary font-bold flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 bg-primary rounded-full animate-pulse"></span>
              Live Feed: Render Layer A
            </h4>
          </div>

          <div className="h-96 w-full bg-[#0e0e0e] relative flex items-center justify-center overflow-hidden">
            {/* Visual Grid Lines */}
            <div className="absolute inset-0 grid grid-cols-12 pointer-events-none border-x border-[#3b494c]/10 opacity-20">
              {Array.from({ length: 11 }).map((_, colIdx) => (
                <div key={colIdx} className="border-r border-[#3b494c]/15 h-full"></div>
              ))}
            </div>

            {/* Bouncing simulated rectangles representative of notes falling and active triggers */}
            <div className="absolute top-10 left-[12%] w-[8%] h-36 bg-gradient-to-b from-primary to-primary-container/20 rounded-lg tile-glow-primary animate-[bounce_3s_infinite_ease-in-out]"></div>
            <div className="absolute top-36 left-[30%] w-[8%] h-48 bg-gradient-to-b from-secondary to-secondary-container/20 rounded-lg tile-glow-secondary animate-[bounce_4s_infinite_ease-in-out] opacity-80"></div>
            <div className="absolute top-16 left-[50%] w-[8%] h-28 bg-gradient-to-b from-tertiary to-tertiary-container/20 rounded-lg tile-glow-tertiary animate-[bounce_2.5s_infinite_ease-in-out] opacity-90"></div>
            <div className="absolute top-48 left-[70%] w-[8%] h-40 bg-gradient-to-b from-primary to-primary-container/20 rounded-lg tile-glow-primary animate-[bounce_3.5s_infinite_ease-in-out]"></div>
            <div className="absolute top-24 left-[85%] w-[8%] h-20 bg-gradient-to-b from-secondary to-secondary-container/20 rounded-lg tile-glow-secondary animate-[bounce_5s_infinite_ease-in-out] opacity-75"></div>

            {/* Hit Zone floor indicator */}
            <div className="absolute bottom-0 w-full h-12 bg-[#201f1f]/30 border-t border-[#00e5ff]/35 flex items-center justify-around px-6">
              <div className="w-[8%] h-1 bg-primary-container/20 rounded-full"></div>
              <div className="w-[8%] h-1.5 bg-primary shadow-[0_0_15px_rgba(0,218,243,0.8)] rounded-full animate-pulse"></div>
              <div className="w-[8%] h-1 bg-primary-container/20 rounded-full"></div>
              <div className="w-[8%] h-1 bg-primary-container/20 rounded-full"></div>
              <div className="w-[8%] h-1 bg-primary-container/20 rounded-full"></div>
              <div className="w-[8%] h-1.5 bg-secondary shadow-[0_0_15px_rgba(218,185,255,0.8)] rounded-full animate-bounce"></div>
              <div className="w-[8%] h-1 bg-primary-container/20 rounded-full"></div>
              <div className="w-[8%] h-1 bg-primary-container/20 rounded-full"></div>
              <div className="w-[8%] h-1 bg-primary-container/20 rounded-full"></div>
            </div>

            {/* Ambient image filter overlay */}
            <div className="absolute inset-0 opacity-[0.14] mix-blend-screen pointer-events-none">
              <img 
                src={TRACK_IMAGES.atmosphericOverlay} 
                alt="Synthesizer console outline background" 
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover scale-105"
              />
            </div>
            
          </div>
        </div>

      </div>
    </div>
  );
}
