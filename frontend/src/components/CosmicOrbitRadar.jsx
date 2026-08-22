import React, { useState } from 'react';
import { 
  Radio, Satellite, Cpu, ShieldCheck, 
  Volume2, VolumeX, Globe
} from 'lucide-react';

export default function CosmicOrbitRadar() {
  const [orbitSpeed, setOrbitSpeed] = useState(24);
  const [activeNode, setActiveNode] = useState('SAT-ALPHA-01');
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [pingPulse, setPingPulse] = useState(false);
  const [satellites] = useState([
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
    <div className="w-full rounded-2xl border border-[#E2DED4] bg-[#DCD7CC] p-5 shadow-xs relative overflow-hidden font-sans">
      
      <div className="relative z-10 space-y-5">
        
        {/* Widget Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-[#E2DED4]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#3E5C76]/15 border border-[#3E5C76]/30 rounded-lg text-[#3E5C76]">
              <Satellite className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-[#1F2A38] tracking-tight">
                  Live Campus Fleet Tracker
                </h3>
                <span className="px-2 py-0.5 text-xs font-semibold uppercase bg-[#4E7A51]/15 text-[#4E7A51] border border-[#4E7A51]/30 rounded-full">
                  Connected
                </span>
              </div>
              <p className="text-xs text-[#8A8578] font-medium">Real-time location, bus status, and room sensor monitoring.</p>
            </div>
          </div>

          {/* Interactive Controls */}
          <div className="flex items-center gap-2 text-xs">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`p-1.5 px-3 rounded-lg border text-xs transition-colors cursor-pointer flex items-center gap-1.5 ${
                soundEnabled 
                  ? 'bg-[#3E5C76]/15 text-[#3E5C76] border-[#3E5C76]/30 font-semibold' 
                  : 'bg-[#F5F4F0] text-[#8A8578] border-[#E2DED4]'
              }`}
              title="Toggle Sound"
            >
              {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
              <span>{soundEnabled ? 'Sound ON' : 'Sound Off'}</span>
            </button>

            <button
              onClick={() => triggerDiagnosticPing(activeNode)}
              className="px-3.5 py-1.5 inst-button-primary text-xs flex items-center gap-1.5 cursor-pointer rounded-lg font-semibold shadow-xs"
            >
              <Radio className="w-3.5 h-3.5" />
              <span>Refresh Status</span>
            </button>
          </div>
        </div>

        {/* Orbit Radar Display Matrix */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
          
          {/* Left: Interactive Orbital Visualizer Graphic */}
          <div className="lg:col-span-2 relative flex items-center justify-center p-8 bg-[#F5F4F0] border border-[#E2DED4] rounded-2xl min-h-[300px] overflow-hidden">
            
            {/* Concentric Radar Orbit Rings */}
            <div className="absolute w-[260px] h-[260px] border border-[#E2DED4] rounded-full animate-spin-slow pointer-events-none" />
            <div className="absolute w-[190px] h-[190px] border border-dashed border-[#E2DED4] rounded-full animate-spin-reverse pointer-events-none" />
            <div className="absolute w-[120px] h-[120px] border border-[#E2DED4] rounded-full pointer-events-none" />
            
            {/* Center Core Hub */}
            <div className="relative z-20 w-14 h-14 rounded-full bg-[#3E5C76] p-0.5 shadow-xs flex items-center justify-center cursor-pointer hover:scale-105 transition-transform"
                 onClick={() => triggerDiagnosticPing('CAMPUS-HUB-CORE')}>
              <div className="w-full h-full bg-[#3E5C76] rounded-full flex items-center justify-center text-white">
                <Globe className="w-6 h-6 animate-pulse" />
              </div>
            </div>

            {/* Diagnostic Ping Ripple */}
            {pingPulse && (
              <div className="absolute w-24 h-24 rounded-full border-2 border-[#3E5C76] animate-beacon-ping pointer-events-none z-10" />
            )}

            {/* Orbiting Satellite Nodes */}
            {satellites.map((sat) => {
              const rad = (sat.angle * Math.PI) / 180;
              const x = Math.cos(rad) * sat.radius;
              const y = Math.sin(rad) * sat.radius;
              const isSelected = activeNode === sat.id;

              return (
                <div
                  key={sat.id}
                  onClick={() => triggerDiagnosticPing(sat.id)}
                  style={{ transform: `translate(${x}px, ${y}px)` }}
                  className={`absolute z-30 p-2 rounded-xl border transition-all duration-200 cursor-pointer flex items-center gap-2 ${
                    isSelected 
                      ? 'bg-[#DCD7CC] border-[#3E5C76] ring-1 ring-[#3E5C76] text-[#1F2A38] shadow-xs' 
                      : 'bg-[#F5F4F0] border-[#E2DED4] text-[#8A8578] hover:border-[#3E5C76]/50 hover:text-[#1F2A38]'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-[#3E5C76]' : 'bg-[#4E7A51]'}`} />
                  <span className="text-xs font-semibold whitespace-nowrap">{sat.id}</span>
                </div>
              );
            })}
          </div>

          {/* Right: Selected Node Telemetry Readout Panel */}
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-[#F5F4F0] border border-[#E2DED4] space-y-3">
              <div className="flex items-center justify-between border-b border-[#E2DED4] pb-2">
                <span className="text-xs text-[#8A8578] font-medium">Active Node:</span>
                <span className="text-xs font-bold text-[#3E5C76]">{activeNode}</span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#8A8578]">Node Status:</span>
                  <span className="text-[#4E7A51] font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Optimal 100%
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-[#8A8578]">Latency:</span>
                  <span className="text-[#1F2A38] font-semibold">12ms (Direct Sync)</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-[#8A8578]">Sync Velocity:</span>
                  <span className="text-[#3E5C76] font-semibold">{orbitSpeed} rpm</span>
                </div>
              </div>

              {/* Speed Slider */}
              <div className="pt-2 space-y-1">
                <label className="text-xs text-[#8A8578] flex justify-between">
                  <span>Orbit Sync Speed</span>
                  <span className="text-[#3E5C76] font-semibold">{orbitSpeed} RPM</span>
                </label>
                <input
                  type="range"
                  min="5"
                  max="60"
                  value={orbitSpeed}
                  onChange={(e) => setOrbitSpeed(parseInt(e.target.value))}
                  className="w-full h-1 bg-[#E2DED4] rounded-lg appearance-none cursor-pointer accent-[#3E5C76]"
                />
              </div>
            </div>

            {/* Satellites List Switcher */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-[#1F2A38]">Telemetry Beacons</span>
              <div className="space-y-1.5">
                {satellites.map(s => (
                  <button
                    key={s.id}
                    onClick={() => triggerDiagnosticPing(s.id)}
                    className={`w-full p-2.5 rounded-lg border text-left text-xs transition-all flex items-center justify-between cursor-pointer ${
                      activeNode === s.id
                        ? 'bg-[#F5F4F0] border-[#3E5C76] text-[#1F2A38] font-bold shadow-xs'
                        : 'bg-[#F5F4F0] border-[#E2DED4] text-[#8A8578] hover:bg-[#DCD7CC]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Cpu className="w-3.5 h-3.5 text-[#3E5C76]" />
                      <span>{s.name}</span>
                    </div>
                    <span className="text-xs text-[#8A8578]">{s.delay}</span>
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

