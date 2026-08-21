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

  // Substation & Power Grid Telemetry State
  const [powerGrids, setPowerGrids] = useState([
    { id: 'grid-1', name: 'Main Solar Array (Rooftop Block A-D)', output: '148.5 kW', capacity: '160 kW', status: 'Optimal', health: 96, carbonSaved: '2.4 Tons/Day' },
    { id: 'grid-2', name: 'Substation Alpha (High Voltage Grid)', output: '415V Stable', capacity: '500 kVA', status: 'Optimal', health: 99, carbonSaved: 'Grid Feed' },
    { id: 'grid-3', name: 'Battery Storage Bank #1 (LiFePO4)', output: '89.4% Charge', capacity: '250 kWh', status: 'Charging', health: 94, carbonSaved: 'Peak Backup' },
    { id: 'grid-4', name: 'Substation Beta (HVAC Dedicated)', output: '382V Heavy Load', capacity: '400 kVA', status: 'High Load Alert', health: 74, carbonSaved: 'Peak Shave Active' }
  ]);

  // Active Energy Anomaly Dispatches
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
    <div className="space-y-6 font-sans animate-in fade-in duration-500 pb-10 relative">
      
      {/* Live Campus Orbit Telemetry Ticker */}
      <LiveCampusTicker />

      {/* Toast Alert Banner */}
      {toastMsg && (
        <div className="fixed top-20 right-6 bg-black/90 border border-emerald-500/40 text-emerald-300 font-mono text-xs px-4 py-2.5 rounded-2xl shadow-2xl z-50 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header Banner - Borderless Galaxy Emerald */}
      <div className="p-6 rounded-3xl bg-slate-950 text-white border border-emerald-500/30 shadow-2xl relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/90 to-emerald-950/40 pointer-events-none rounded-3xl" />
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 text-[10px] font-mono font-extrabold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-full flex items-center gap-1.5 shadow-sm">
                <Zap className="w-3.5 h-3.5 text-emerald-400" />
                SMART ENERGY & SUSTAINABILITY COMMAND
              </span>
              <span className="text-xs text-emerald-200/80 font-bold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
                Grid Active: 98.6% Efficiency
              </span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white drop-shadow-sm flex items-center gap-2">
              Energy & Solar Grid Interface
              <Sparkles className="w-5 h-5 text-emerald-400 animate-pulse" />
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl font-medium leading-relaxed">
              Real-time rooftop solar generation, battery storage telemetry, power surge alerts & carbon footprint offset analytics.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={() => {
                setSolarOptimizerActive(!solarOptimizerActive);
                showToast(`Solar AI Optimizer ${!solarOptimizerActive ? 'Enabled' : 'Disabled'}`);
              }}
              className={`px-3.5 py-2 rounded-xl border text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                solarOptimizerActive 
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' 
                  : 'bg-white/5 text-zinc-400 border-white/10 hover:text-white'
              }`}
            >
              <Sun className="w-4 h-4 text-emerald-400" />
              <span>Solar AI: {solarOptimizerActive ? 'ON' : 'OFF'}</span>
            </button>

            <button
              onClick={() => {
                setPeakShavingActive(!peakShavingActive);
                showToast(`Peak Load Shaving ${!peakShavingActive ? 'Activated' : 'Standby'}`);
              }}
              className={`px-3.5 py-2 rounded-xl border text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                peakShavingActive 
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' 
                  : 'bg-white/5 text-zinc-400 border-white/10'
              }`}
            >
              <BatteryCharging className="w-4 h-4 text-cyan-400" />
              <span>Peak Shave: {peakShavingActive ? 'ACTIVE' : 'STANDBY'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Substation & Solar Telemetry Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
            <Gauge className="w-4 h-4 text-emerald-400" />
            Power Grid & Solar Array Telemetry ({powerGrids.length} Sub-Systems)
          </h2>
          <span className="text-xs font-mono text-emerald-400 font-bold px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center gap-1">
            <Leaf className="w-3.5 h-3.5 text-emerald-400" />
            1.4 Tons CO2 Offset Today
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 font-mono">
          {powerGrids.map((grid) => {
            const isHigh = grid.status.includes('High Load');
            return (
              <div 
                key={grid.id}
                className={`p-4 rounded-2xl border transition-all duration-300 ${
                  isHigh 
                    ? 'bg-amber-500/5 border-amber-500/40 hover:border-amber-400' 
                    : 'bg-white/[0.02] border-white/5 hover:border-emerald-500/30'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-zinc-500 uppercase">{grid.id}</span>
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border uppercase ${
                    isHigh ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  }`}>
                    {grid.status}
                  </span>
                </div>

                <h3 className="text-xs font-bold text-white mt-2 font-sans">{grid.name}</h3>

                <div className="mt-3 flex items-center justify-between text-[11px]">
                  <span className="text-zinc-400">Current Output:</span>
                  <span className="text-emerald-400 font-bold">{grid.output}</span>
                </div>

                <div className="mt-2.5 w-full bg-black/60 h-1.5 rounded-full overflow-hidden border border-white/5">
                  <div 
                    className={`h-full rounded-full transition-all ${isHigh ? 'bg-amber-400' : 'bg-emerald-400'}`} 
                    style={{ width: `${grid.health}%` }} 
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Side-by-Side Grid: Active Energy Dispatches & Energy Support Tickets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch font-sans">
        
        {/* Left Box: Energy Load Control Dispatches */}
        <div className="w-full rounded-3xl border border-white/5 bg-white/[0.02] backdrop-blur-2xl transition-all duration-300 overflow-hidden shadow-2xl flex flex-col justify-between">
          <div>
            {/* Header Bar */}
            <div className="p-4 sm:p-5 flex flex-col gap-3 border-b border-white/5 bg-gradient-to-r from-emerald-500/5 via-transparent to-transparent">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 shrink-0">
                    <Zap className="w-4 h-4 stroke-[1.5]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white tracking-tight">
                      Active Power Load & Energy Dispatches
                    </h3>
                    <p className="text-[11px] text-zinc-400 font-medium font-mono line-clamp-1">
                      Manage power surge alerts, peak load shaving & solar inverters
                    </p>
                  </div>
                </div>

                <span className="text-[10px] font-mono font-bold px-2.5 py-1 bg-emerald-500/20 text-emerald-300 rounded-full border border-emerald-500/40 shrink-0 uppercase">
                  {energyDispatches.filter(d => d.status !== 'Optimized').length} PENDING
                </span>
              </div>
            </div>

            {/* Dispatches List */}
            <div className="p-4 sm:p-5 space-y-3 font-mono">
              {energyDispatches.map((disp) => (
                <div 
                  key={disp.id}
                  className="p-4 rounded-2xl bg-black/40 border border-white/5 hover:border-white/15 transition-all space-y-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-bold px-2 py-0.5 bg-white/5 text-emerald-300 rounded-full border border-white/10">
                        {disp.id}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 bg-white/5 text-cyan-300 rounded-full border border-white/10">
                        {disp.substation}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase ${
                        disp.status === 'Optimized' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' :
                        'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      }`}>
                        {disp.status}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-white font-sans">{disp.title}</h4>
                    <p className="text-[10px] text-zinc-500">
                      Target Savings: <span className="text-emerald-400 font-bold">{disp.savingImpact}</span> • Date: {disp.date}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 font-sans">
                    {disp.status !== 'Optimized' ? (
                      <button
                        type="button"
                        onClick={() => handleDispatchAction(disp.id, 'Optimized')}
                        className="px-3 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Optimize</span>
                      </button>
                    ) : (
                      <span className="px-3 py-1 bg-white/5 text-zinc-400 border border-white/10 rounded-full text-[11px] font-mono font-bold">
                        Optimized
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Box: Energy Support Tickets */}
        <TicketsSupportLogCard 
          adminDomain="energy" 
          title="Energy & Solar Support Tickets" 
          subtitle="Track solar inverter faults, substation maintenance & power meter calibration" 
        />

      </div>
    </div>
  );
}
