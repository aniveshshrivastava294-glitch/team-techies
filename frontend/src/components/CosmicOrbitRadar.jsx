import React, { useState } from 'react';
import { Satellite, Radio, Volume2, VolumeX } from 'lucide-react';

export default function CosmicOrbitRadar() {
  const [activeNode, setActiveNode] = useState('SAT-ALPHA-01');
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [satellites, setSatellites] = useState([
    { id: 'SAT-ALPHA-01', name: 'Alpha Telemetry Hub', category: 'Transit GPS', delay: '12ms', health: '99.8%', status: 'Online' },
    { id: 'SAT-BETA-02', name: 'Beta Transit GPS', category: 'Bus Fleet', delay: '8ms', health: '100%', status: 'Online' },
    { id: 'SAT-GAMMA-03', name: 'Gamma HVAC Telemetry', category: 'Facility Sensor', delay: '15ms', health: '97.4%', status: 'Active' },
  ]);

  const triggerDiagnosticPing = (nodeId) => {
    setActiveNode(nodeId);
    if (soundEnabled) {
      try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(440, audioCtx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.15);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.15);
      } catch (e) {
        console.log('Audio API:', e);
      }
    }
  };

  return (
    <div className="card-surface p-5 font-sans space-y-4 shadow-2xs">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E6E0D2]">
        <div className="flex items-center space-x-2.5">
          <Satellite className="w-5 h-5 text-[#1C1917]" />
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-[#1C1917]">Campus Fleet & Telemetry Tracker</h3>
              <span className="badge-mono-dark text-[10px]">Connected</span>
            </div>
            <p className="text-xs text-[#57534E] font-medium">Real-time GPS tracking for campus shuttles and IoT sensors.</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="btn-secondary text-xs"
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-[#1C1917]" /> : <VolumeX className="w-3.5 h-3.5 text-[#78716C]" />}
            <span>{soundEnabled ? 'Audio ON' : 'Audio Muted'}</span>
          </button>
          <button
            onClick={() => triggerDiagnosticPing(activeNode)}
            className="btn-primary text-xs"
          >
            <Radio className="w-3.5 h-3.5" />
            <span>Ping Telemetry</span>
          </button>
        </div>
      </div>

      {/* Fleet Telemetry Data Table */}
      <div className="overflow-x-auto border border-[#E6E0D2] rounded-lg">
        <table className="table-mono">
          <thead>
            <tr>
              <th>Node Identifier</th>
              <th>Telemetry Beacon</th>
              <th>Category</th>
              <th>Latency</th>
              <th>System Health</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {satellites.map((sat) => {
              const isSelected = activeNode === sat.id;
              return (
                <tr
                  key={sat.id}
                  onClick={() => triggerDiagnosticPing(sat.id)}
                  className={`cursor-pointer transition-colors ${isSelected ? 'bg-[#F0EBE1] font-bold' : ''}`}
                >
                  <td className="font-mono text-[#1C1917] font-bold">{sat.id}</td>
                  <td className="text-[#1C1917] font-bold">{sat.name}</td>
                  <td className="text-[#57534E] font-mono text-xs font-semibold">{sat.category}</td>
                  <td className="font-mono text-[#57534E] font-semibold">{sat.delay}</td>
                  <td className="font-mono text-[#1C1917] font-bold">{sat.health}</td>
                  <td>
                    <span className="badge-mono text-[10px]">
                      <span>{sat.status}</span>
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

    </div>
  );
}
