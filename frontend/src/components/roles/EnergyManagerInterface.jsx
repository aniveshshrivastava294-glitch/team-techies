import React, { useState } from 'react';
import TicketsSupportLogCard from '../TicketsSupportLogCard';
import LiveCampusTicker from '../LiveCampusTicker';
import { 
  Zap, Sun, ShieldAlert, CheckCircle2, AlertTriangle, RefreshCw, 
  Activity, Gauge, BatteryCharging, Leaf, Sparkles, Check, X, Sliders, Cpu, ArrowRight
} from 'lucide-react';

export default function EnergyManagerInterface() {
  const [toastMsg, setToastMsg] = useState(null);
  const [solarOptimizerActive, setSolarOptimizerActive] = useState(true);
  const [peakShavingActive, setPeakShavingActive] = useState(true);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const [powerGrids, setPowerGrids] = useState([
    { id: 'grid-1', name: 'Main Solar Array (Rooftop Block A-D)', output: '148.5 kW', capacity: '160 kW', status: 'Optimal', health: 96, carbonSaved: '2.4 Tons/Day' },
    { id: 'grid-2', name: 'Substation Alpha (High Voltage Grid)', output: '415V Stable', capacity: '500 kVA', status: 'Optimal', health: 99, carbonSaved: 'Grid Feed' },
    { id: 'grid-3', name: 'Battery Storage Bank #1 (LiFePO4)', output: '89.4% Charge', capacity: '250 kWh', status: 'Charging', health: 94, carbonSaved: 'Peak Backup' },
    { id: 'grid-4', name: 'Substation Beta (HVAC Dedicated)', output: '382V Heavy Load', capacity: '400 kVA', status: 'High Load Alert', health: 74, carbonSaved: 'Peak Shave Active' }
  ]);

  const [energyDispatches, setEnergyDispatches] = useState([
    {
      id: 'ENG-102',
      title: 'Block B Chiller Unit 2 Sudden Power Surge (45 kW Spike)',
      substation: 'Substation Beta',
      priority: 'High',
      status: 'Pending Dispatch',
      savingImpact: '12% Grid Savings',
      date: 'Aug 21, 2026'
    },
    {
      id: 'ENG-098',
      title: 'Library Rooftop Solar Inverter #3 Phase Alignment Sync',
      substation: 'Solar Array Alpha',
      priority: 'Medium',
      status: 'In Progress',
      savingImpact: '4.8 kW Restored',
      date: 'Aug 21, 2026'
    },
    {
      id: 'ENG-089',
      title: 'Auditorium Complex Smart Lighting Off-Peak Auto-Dim',
      substation: 'Campus Grid Core',
      priority: 'Low',
      status: 'Optimized',
      savingImpact: '1.2 Tons CO2',
      date: 'Aug 20, 2026'
    }
  ]);

  const handleDispatchAction = (id, newStatus) => {
    setEnergyDispatches(prev => prev.map(d => d.id === id ? { ...d, status: newStatus } : d));
    showToast(`Energy Incident ${id} set to ${newStatus}`);
  };

  return (
    <div className="space-y-6 font-sans pb-10 relative">
      
      <LiveCampusTicker />

      {toastMsg && (
        <div className="fixed top-20 right-6 bg-emerald-800 border border-emerald-900 text-white font-mono text-xs px-4 py-2.5 rounded-md shadow-md z-50 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-white" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header Banner - Executive Obsidian with Emerald Accents */}
      <div className="p-6 rounded-lg bg-[#1C1917] text-[#FAF8F3] border border-emerald-800 shadow-md relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="badge-emerald text-[10px]">
                <Zap className="w-3.5 h-3.5 text-emerald-800" />
                SMART ENERGY & SUSTAINABILITY COMMAND
              </span>
              <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
                Grid Active: 98.6% Efficiency
              </span>
            </div>
            
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              Energy & Solar Grid Interface
              <Sparkles className="w-5 h-5 text-emerald-400" />
            </h1>
            <p className="text-xs text-[#D6CEBE] max-w-2xl font-medium leading-relaxed">
              Real-time rooftop solar generation, battery storage telemetry, power surge alerts & carbon footprint offset analytics.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={() => {
                setSolarOptimizerActive(!solarOptimizerActive);
                showToast(`Solar Optimizer ${!solarOptimizerActive ? 'Enabled' : 'Disabled'}`);
              }}
              className={`btn-secondary text-xs ${solarOptimizerActive ? 'border-emerald-500 text-emerald-800 bg-emerald-50 font-bold' : ''}`}
            >
              <Sun className="w-3.5 h-3.5 text-emerald-600" />
              <span>Solar Optimizer: {solarOptimizerActive ? 'ON' : 'OFF'}</span>
            </button>

            <button
              onClick={() => {
                setPeakShavingActive(!peakShavingActive);
                showToast(`Auto Peak Shaving ${!peakShavingActive ? 'Enabled' : 'Disabled'}`);
              }}
              className={`btn-secondary text-xs ${peakShavingActive ? 'border-emerald-500 text-emerald-800 bg-emerald-50 font-bold' : ''}`}
            >
              <Leaf className="w-3.5 h-3.5 text-emerald-600" />
              <span>Peak Shaving: {peakShavingActive ? 'AUTO' : 'MANUAL'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Solar & Power Grid Telemetry Matrix */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-[#1C1917] tracking-tight flex items-center gap-2">
            <BatteryCharging className="w-4 h-4 text-emerald-600" />
            Solar & Substation Power Grid Matrix ({powerGrids.length} Subsystems)
          </h2>
          <span className="badge-emerald text-xs">
            148.5 kW Active Generation
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {powerGrids.map((grid) => {
            const isHigh = grid.status.includes('High Load');
            return (
              <div 
                key={grid.id} 
                className={`card-surface p-4 shadow-2xs space-y-3 border-l-4 ${isHigh ? 'border-l-rose-600 border-rose-200' : 'border-l-emerald-600 border-emerald-200'}`}
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-[#1C1917] truncate">{grid.name}</h3>
                  <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded border uppercase shrink-0 ${
                    isHigh ? 'badge-error' : 'badge-emerald'
                  }`}>
                    {grid.status}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-[#57534E] font-semibold">{grid.capacity}</span>
                  <span className="text-emerald-700 font-bold">{grid.output}</span>
                </div>

                <div className="w-full bg-[#E6E0D2] h-1.5 rounded-full overflow-hidden border border-[#D6CEBE]">
                  <div 
                    className={`h-full rounded-full transition-all ${isHigh ? 'bg-rose-600' : 'bg-emerald-600'}`} 
                    style={{ width: `${grid.health}%` }} 
                  />
                </div>

                <p className="text-[10px] text-emerald-800 font-mono font-bold flex items-center gap-1">
                  <Leaf className="w-3 h-3 text-emerald-600" />
                  {grid.carbonSaved}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Grid Layout: Power Dispatches & Support Ticket Logger */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        
        {/* Left Column: Power Surge Incident Dispatches */}
        <div className="card-surface p-5 shadow-2xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#E6E0D2] mb-3">
              <div className="flex items-center space-x-2">
                <Zap className="w-4 h-4 text-emerald-600" />
                <h3 className="text-sm font-bold text-[#1C1917]">
                  Power Surge & Grid Load Control Dispatches
                </h3>
              </div>
              <span className="badge-emerald text-[10px]">
                {energyDispatches.length} Events
              </span>
            </div>

            <div className="divide-y divide-[#E6E0D2]">
              {energyDispatches.map((disp) => (
                <div key={disp.id} className="py-3 space-y-1.5">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-xs font-bold text-emerald-800">{disp.id}</span>
                        <span className="badge-emerald text-[9px]">{disp.substation}</span>
                      </div>
                      <h4 className="text-xs font-bold text-[#1C1917] mt-0.5">{disp.title}</h4>
                      <p className="text-[11px] text-emerald-700 font-mono font-bold mt-0.5">
                        Impact: {disp.savingImpact}
                      </p>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      {disp.status === 'Pending Dispatch' ? (
                        <button
                          onClick={() => handleDispatchAction(disp.id, 'Optimized')}
                          className="btn-secondary border-emerald-400 text-emerald-800 hover:bg-emerald-50 text-[10px] py-1 px-2"
                        >
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span>Dispatch Fix</span>
                        </button>
                      ) : (
                        <span className="badge-emerald text-[10px]">
                          {disp.status}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-emerald-50 p-3 rounded border border-emerald-200 text-xs font-mono text-emerald-900 space-y-1">
            <span className="font-bold flex items-center gap-1">
              <Leaf className="w-3.5 h-3.5 text-emerald-700" />
              Sustainability Metric:
            </span>
            <p className="text-emerald-800 font-semibold">
              Today's solar array offset has saved 2.4 Tons of CO2 and reduced grid peak draw by 18.5%.
            </p>
          </div>
        </div>

        {/* Right Column: Support Tickets Logger */}
        <div>
          <TicketsSupportLogCard currentUser={{ role: 'energy_manager', full_name: 'Sub-Admin Energy' }} />
        </div>

      </div>

    </div>
  );
}
