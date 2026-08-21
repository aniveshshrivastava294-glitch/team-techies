import React, { useState } from 'react';
import { Satellite, Radio, ShieldCheck, Volume2, VolumeX, Cpu, Wifi } from 'lucide-react';

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
    <div className="card-enterprise p-5 font-sans space-y-4">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E2E8F0]">
        <div className="flex items-center space-x-2.5">
          <Satellite className="w-5 h-5 text-[#2563EB]" />
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900">Live Campus Fleet & Telemetry Tracker</h3>
              <span className="badge-pill badge-success">Connected</span>
            </div>
            <p className="text-xs text-slate-500">Real-time GPS tracking for campus shuttles and IoT sensors.</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="btn-secondary text-xs"
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-[#2563EB]" /> : <VolumeX className="w-3.5 h-3.5 text-slate-400" />}
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

      {/* Fleet Telemetry Data Table (REQUIRED Pattern #1) */}
      <div className="overflow-x-auto border border-[#E2E8F0] rounded-md">
        <table className="table-enterprise">
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
                  className={`cursor-pointer transition-colors ${isSelected ? 'bg-blue-50/60 font-semibold' : ''}`}
                >
                  <td className="font-mono text-slate-900 font-bold">{sat.id}</td>
                  <td className="text-slate-900">{sat.name}</td>
                  <td className="text-slate-500 font-mono text-xs">{sat.category}</td>
                  <td className="font-mono text-slate-700">{sat.delay}</td>
                  <td className="font-mono text-emerald-600 font-semibold">{sat.health}</td>
                  <td>
                    <span className="badge-pill badge-success">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]" />
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
