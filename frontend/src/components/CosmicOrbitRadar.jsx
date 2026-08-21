import React, { useState, useEffect } from 'react';
import { 
  Radio, Satellite, Cpu, Zap, Activity, ShieldCheck, 
  Volume2, VolumeX, Sparkles, RefreshCw, Layers, Compass, Globe
} from 'lucide-react';

export default function CosmicOrbitRadar() {
  const [orbitSpeed, setOrbitSpeed] = useState(24);
  const [activeNode, setActiveNode] = useState('SAT-ALPHA-01');
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [pingPulse, setPingPulse] = useState(false);
  const [satellites, setSatellites] = useState([
    { id: 'SAT-ALPHA-01', name: 'Alpha Telemetry', angle: 45, radius: 110, status: 'Online', delay: '12ms', health: '99.8%' },
    { id: 'SAT-BETA-02', name: 'Beta Transit GPS', angle: 160, radius: 85, status: 'Online', delay: '8ms', health: '100%' },
    { id: 'SAT-GAMMA-03', name: 'Gamma HVAC Sensor', angle: 280, radius: 135, status: 'Active', delay: '15ms', health: '97.4%' },
  ]);

  const triggerDiagnosticPing = (nodeId) => {
    setActiveNode(nodeId);
    setPingPulse(true);
    setTimeout(() => setPingPulse(false), 1200);

    if (soundEnabled) {
      try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(440, audioCtx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.15);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.15);
      } catch (e) {
        console.log('Web Audio API synth:', e);
      }
    }
  };

  return (
    <div className="w-full rounded border border-stone-300 dark:border-stone-800 bg-white dark:bg-stone-900 p-5 shadow-sm relative overflow-hidden font-sans">
      
      <div className="relative z-10 space-y-5">
        
        {/* Widget Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-stone-200 dark:border-stone-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#2F4034]/10 border border-[#2F4034]/30 rounded text-[#2F4034] dark:text-[#5C6E3F]">
              <Satellite className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-serif font-bold text-stone-900 dark:text-stone-100 tracking-tight">
                  Live Campus Fleet Tracker
                </h3>
                <span className="px-2 py-0.5 text-[9px] font-mono font-bold uppercase inst-badge-sage">
                  CONNECTED
                </span>
              </div>
              <p className="text-xs text-stone-500 dark:text-stone-400 font-mono">Real-time location, bus status, and room sensor monitoring.</p>
            </div>
          </div>

          {/* Interactive Controls */}
          <div className="flex items-center gap-2 font-mono text-xs">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`p-1.5 px-3 rounded border text-xs transition-colors cursor-pointer flex items-center gap-1.5 ${
                soundEnabled 
                  ? 'bg-[#B5654A]/10 text-[#B5654A] border-[#B5654A]/30 font-bold' 
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 border-stone-300 dark:border-stone-700'
              }`}
              title="Toggle Sound"
            >
              {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
              <span>{soundEnabled ? 'Sound ON' : 'Sound Off'}</span>
            </button>

            <button
              onClick={() => triggerDiagnosticPing(activeNode)}
              className="px-3.5 py-1.5 inst-button-primary text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Radio className="w-3.5 h-3.5" />
              <span>Refresh Status</span>
            </button>
          </div>
        </div>

        {/* Orbit Radar Display Matrix */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
          
          {/* Left: Interactive Orbital Visualizer Graphic */}
          <div className="lg:col-span-2 relative flex items-center justify-center p-8 bg-black/60 border border-white/5 rounded-3xl min-h-[300px] overflow-hidden">
            
            {/* Concentric Radar Orbit Rings */}
            <div className="absolute w-[260px] h-[260px] border border-cyan-500/20 rounded-full animate-spin-slow pointer-events-none" />
            <div className="absolute w-[190px] h-[190px] border border-dashed border-purple-500/30 rounded-full animate-spin-reverse pointer-events-none" />
            <div className="absolute w-[120px] h-[120px] border border-cyan-500/30 rounded-full pointer-events-none" />
            
            {/* Center Core Hub */}
            <div className="relative z-20 w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500 via-blue-600 to-purple-600 p-0.5 shadow-2xl shadow-cyan-500/50 flex items-center justify-center cursor-pointer hover:scale-110 transition-transform"
                 onClick={() => triggerDiagnosticPing('CAMPUS-HUB-CORE')}>
              <div className="w-full h-full bg-slate-950 rounded-full flex items-center justify-center text-cyan-400">
                <Globe className="w-7 h-7 animate-pulse" />
              </div>
            </div>

            {/* Diagnostic Ping Ripple */}
            {pingPulse && (
              <div className="absolute w-24 h-24 rounded-full border-2 border-cyan-400 animate-beacon-ping pointer-events-none z-10" />
            )}

            {/* Orbiting Satellite Nodes */}
            {satellites.map((sat, idx) => {
              const rad = (sat.angle * Math.PI) / 180;
              const x = Math.cos(rad) * sat.radius;
              const y = Math.sin(rad) * sat.radius;
              const isSelected = activeNode === sat.id;

              return (
                <div
                  key={sat.id}
                  onClick={() => triggerDiagnosticPing(sat.id)}
                  style={{ transform: `translate(${x}px, ${y}px)` }}
                  className={`absolute z-30 p-2 rounded-xl border transition-all duration-300 cursor-pointer flex items-center gap-2 group/node ${
                    isSelected 
                      ? 'bg-cyan-500/30 border-cyan-400 text-cyan-200 shadow-xl shadow-cyan-500/30 scale-110' 
                      : 'bg-black/80 border-white/10 text-zinc-400 hover:border-cyan-400/60 hover:text-white'
                  }`}
                >
                  <span className="relative flex h-2.5 w-2.5">
                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isSelected ? 'bg-cyan-400' : 'bg-emerald-400'}`} />
                    <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${isSelected ? 'bg-cyan-400' : 'bg-emerald-500'}`} />
                  </span>
                  <span className="text-[10px] font-mono font-bold whitespace-nowrap">{sat.id}</span>
                </div>
              );
            })}
          </div>

          {/* Right: Selected Node Telemetry Readout Panel */}
          <div className="space-y-4 font-mono">
            <div className="p-4 rounded-2xl bg-black/60 border border-white/5 space-y-3">
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <span className="text-xs text-zinc-400">ACTIVE NODE:</span>
                <span className="text-xs font-bold text-cyan-400">{activeNode}</span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-zinc-500">Node Status:</span>
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Optimal 100%
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-zinc-500">Latency matrix:</span>
                  <span className="text-white font-bold">12ms (Quantum Sync)</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-zinc-500">Orbital Velocity:</span>
                  <span className="text-amber-400 font-bold">{orbitSpeed} rpm</span>
                </div>
              </div>

              {/* Speed Slider */}
              <div className="pt-2 space-y-1">
                <label className="text-[10px] text-zinc-400 flex justify-between">
                  <span>Orbit Sync Speed</span>
                  <span className="text-cyan-300 font-bold">{orbitSpeed} RPM</span>
                </label>
                <input
                  type="range"
                  min="5"
                  max="60"
                  value={orbitSpeed}
                  onChange={(e) => setOrbitSpeed(parseInt(e.target.value))}
                  className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
              </div>
            </div>

            {/* Satellites List Switcher */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-zinc-400">TELEMETRY BEACONS</span>
              <div className="space-y-1.5">
                {satellites.map(s => (
                  <button
                    key={s.id}
                    onClick={() => triggerDiagnosticPing(s.id)}
                    className={`w-full p-2.5 rounded-xl border text-left text-xs transition-all flex items-center justify-between cursor-pointer ${
                      activeNode === s.id
                        ? 'bg-cyan-500/20 border-cyan-500/50 text-white font-bold'
                        : 'bg-white/[0.02] border-white/5 text-zinc-400 hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{s.name}</span>
                    </div>
                    <span className="text-[10px] text-zinc-500">{s.delay}</span>
                  </button>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
