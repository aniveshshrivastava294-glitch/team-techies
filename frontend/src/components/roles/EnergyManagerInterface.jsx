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
        <div className="fixed top-20 right-6 bg-[#1C1917] border border-[#292524] text-[#FAF8F3] font-mono text-xs px-4 py-2.5 rounded-md shadow-md z-50 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-white" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header Banner - Executive Obsidian */}
      <div className="p-6 rounded-lg bg-[#1C1917] text-[#FAF8F3] border border-[#292524] shadow-md relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="badge-mono-dark text-[10px]">
                <Zap className="w-3.5 h-3.5 text-white" />
                SMART ENERGY & SUSTAINABILITY COMMAND
              </span>
              <span className="text-xs text-[#D6CEBE] font-bold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-white animate-ping inline-block" />
                Grid Active: 98.6% Efficiency
              </span>
            </div>
            
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              Energy & Solar Grid Interface
              <Sparkles className="w-5 h-5 text-white" />
            </h1>
            <p className="text-xs text-[#D6CEBE] max-w-2xl font-medium leading-relaxed">
              Real-time rooftop solar generation, battery storage telemetry, power surge alerts & carbon footprint offset analytics.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={() => {
                setSolarOptimizerActive(!solarOptimizerActive);
                showToast(`Solar AI Optimizer ${!solarOptimizerActive ? 'Enabled' : 'Disabled'}`);
              }}
              className={`btn-secondary text-xs ${solarOptimizerActive ? 'bg-[#1C1917] text-white' : ''}`}
            >
              <Sun className="w-4 h-4" />
              <span>Solar AI: {solarOptimizerActive ? 'ON' : 'OFF'}</span>
            </button>

            <button
              onClick={() => {
                setPeakShavingActive(!peakShavingActive);
                showToast(`Peak Load Shaving ${!peakShavingActive ? 'Activated' : 'Standby'}`);
              }}
              className={`btn-secondary text-xs ${peakShavingActive ? 'bg-[#1C1917] text-white' : ''}`}
            >
              <BatteryCharging className="w-4 h-4" />
              <span>Peak Shave: {peakShavingActive ? 'ACTIVE' : 'STANDBY'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Substation & Solar Telemetry Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-[#1C1917] tracking-tight flex items-center gap-2">
            <Gauge className="w-4 h-4 text-[#1C1917]" />
            Power Grid & Solar Array Telemetry ({powerGrids.length} Sub-Systems)
          </h2>
          <span className="badge-mono-dark text-xs flex items-center gap-1">
            <Leaf className="w-3.5 h-3.5" />
            1.4 Tons CO2 Offset Today
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 font-mono">
          {powerGrids.map((grid) => {
            const isHigh = grid.status.includes('High Load');
            return (
              <div 
                key={grid.id}
                className="card-surface p-4 shadow-2xs space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-[#57534E] uppercase font-bold">{grid.id}</span>
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded border uppercase ${
                    isHigh ? 'badge-mono-dark' : 'badge-mono'
                  }`}>
                    {grid.status}
                  </span>
                </div>

                <h3 className="text-xs font-bold text-[#1C1917] font-sans">{grid.name}</h3>

                <div className="mt-2 flex items-center justify-between text-[11px]">
                  <span className="text-[#57534E] font-semibold">Current Output:</span>
                  <span className="text-[#1C1917] font-bold">{grid.output}</span>
                </div>

                <div className="w-full bg-[#E6E0D2] h-1.5 rounded-full overflow-hidden border border-[#D6CEBE]">
                  <div 
                    className="h-full rounded-full transition-all bg-[#1C1917]" 
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
        <div className="card-surface p-5 shadow-2xs flex flex-col justify-between space-y-4">
          <div>
            <div className="pb-3 border-b border-[#E6E0D2] flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-md bg-[#F0EBE1] border border-[#E6E0D2] text-[#1C1917]">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#1C1917] tracking-tight">
                    Active Power Load & Energy Dispatches
                  </h3>
                  <p className="text-[11px] text-[#57534E] font-medium font-mono">
                    Manage power surge alerts, peak load shaving & solar inverters
                  </p>
                </div>
              </div>

              <span className="badge-mono-dark text-[10px]">
                {energyDispatches.filter(d => d.status !== 'Optimized').length} PENDING
              </span>
            </div>

            <div className="space-y-3 pt-3 font-mono">
              {energyDispatches.map((disp) => (
                <div 
                  key={disp.id}
                  className="p-3.5 rounded-lg bg-[#FAF8F3] border border-[#E6E0D2] hover:border-[#1C1917] transition-all space-y-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="badge-mono text-[10px]">
                        {disp.id}
                      </span>
                      <span className="badge-mono text-[10px]">
                        {disp.substation}
                      </span>
                      <span className={`text-[10px] ${
                        disp.status === 'Optimized' ? 'badge-mono-dark' : 'badge-mono'
                      }`}>
                        {disp.status}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-[#1C1917] font-sans">{disp.title}</h4>
                    <p className="text-[10px] text-[#57534E]">
                      Target Savings: <span className="text-[#1C1917] font-bold">{disp.savingImpact}</span> • Date: {disp.date}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 font-sans">
                    {disp.status !== 'Optimized' ? (
                      <button
                        type="button"
                        onClick={() => handleDispatchAction(disp.id, 'Optimized')}
                        className="btn-primary text-xs py-1 px-3"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Optimize</span>
                      </button>
                    ) : (
                      <span className="badge-mono text-[10px]">
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
