import React, { useState } from 'react';
import SectionHero from '../SectionHero';
import { BACKDROP_IMAGES } from '../../config/backdropImages';
import TicketsSupportLogCard from '../TicketsSupportLogCard';
import LiveCampusTicker from '../LiveCampusTicker';
import { 
  Zap, Sun, CheckCircle2, Gauge, BatteryCharging, Leaf, Check
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
    <div className="space-y-6 font-sans animate-in fade-in duration-300 pb-10 relative">
      
      {/* Toast Alert Banner */}
      {toastMsg && (
        <div className="fixed top-20 right-6 bg-[#2B1D12] text-white font-medium text-xs px-4 py-2.5 rounded-xl shadow-2xl z-50 flex items-center gap-2 border border-[#E8DCC8]">
          <CheckCircle2 className="w-4 h-4 text-[#4E7A51]" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* ================= SECTION HERO: ENERGY & SUSTAINABILITY BACKDROP ================= */}
      <SectionHero
        image={BACKDROP_IMAGES.energy}
        category="Sustainability & Grid"
        categoryIcon={Zap}
        badgeText="Grid Active: 98.6% Efficiency"
        title="Energy & Solar Grid Interface"
        subtitle="Real-time rooftop solar generation, battery storage telemetry, power surge alerts & carbon footprint offset analytics."
      >
        <button
          onClick={() => {
            setSolarOptimizerActive(!solarOptimizerActive);
            showToast(`Solar AI Optimizer ${!solarOptimizerActive ? 'Enabled' : 'Disabled'}`);
          }}
          className="px-4 py-2 rounded-lg border border-white/20 bg-white/10 hover:bg-white/20 text-white text-xs font-medium backdrop-blur-xs transition-colors cursor-pointer flex items-center gap-1.5"
        >
          <Sun className="w-3.5 h-3.5" />
          <span>Solar AI: {solarOptimizerActive ? 'ON' : 'OFF'}</span>
        </button>

        <button
          onClick={() => {
            setPeakShavingActive(!peakShavingActive);
            showToast(`Peak Load Shaving ${!peakShavingActive ? 'Activated' : 'Standby'}`);
          }}
          className="px-4 py-2 rounded-lg border border-white/20 bg-white/10 hover:bg-white/20 text-white text-xs font-medium backdrop-blur-xs transition-colors cursor-pointer flex items-center gap-1.5"
        >
          <BatteryCharging className="w-3.5 h-3.5" />
          <span>Peak Shave: {peakShavingActive ? 'ACTIVE' : 'STANDBY'}</span>
        </button>
      </SectionHero>

      {/* Live Campus Orbit Telemetry Ticker */}
      <LiveCampusTicker />

      {/* Substation & Solar Telemetry Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-[#2B1D12] tracking-tight flex items-center gap-2">
            <Gauge className="w-4 h-4 text-[#BC4800]" />
            Power Grid & Solar Array Telemetry ({powerGrids.length} Sub-Systems)
          </h2>
          <span className="text-xs text-[#2B1D12] font-semibold px-2.5 py-1 bg-[#FDF8F2] border border-[#E8DCC8] rounded-full flex items-center gap-1">
            <Leaf className="w-3.5 h-3.5 text-[#4E7A51]" />
            1.4 Tons CO2 Offset Today
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {powerGrids.map((grid) => {
            const isHigh = grid.status.includes('High Load');
            return (
              <div 
                key={grid.id}
                className="p-4 rounded-xl border border-[#E8DCC8] bg-[#F7EFE4] shadow-xs space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#6B5A4A] font-semibold bg-[#FDF8F2] px-2 py-0.5 rounded border border-[#E8DCC8]">{grid.id}</span>
                  <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${
                    isHigh ? 'bg-[#C48A2E]/15 text-[#C48A2E] border-[#C48A2E]/30' : 'bg-[#4E7A51]/15 text-[#4E7A51] border-[#4E7A51]/30'
                  }`}>
                    {grid.status}
                  </span>
                </div>

                <h3 className="text-xs font-bold text-[#2B1D12] mt-2">{grid.name}</h3>

                <div className="mt-3 flex items-center justify-between text-xs">
                  <span className="text-[#6B5A4A]">Current Output:</span>
                  <span className="text-[#BC4800] font-bold">{grid.output}</span>
                </div>

                <div className="mt-2 w-full bg-[#E8DCC8] h-1.5 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all ${isHigh ? 'bg-[#C48A2E]' : 'bg-[#4E7A51]'}`} 
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
        <div className="w-full rounded-2xl border border-[#E8DCC8] bg-[#F7EFE4] shadow-xs overflow-hidden flex flex-col justify-between">
          <div>
            {/* Header Bar */}
            <div className="p-4 sm:p-5 flex flex-col gap-3 border-b border-[#E8DCC8]">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg border border-[#BC4800]/30 bg-[#BC4800]/15 text-[#BC4800] shrink-0">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#2B1D12] tracking-tight">
                      Active Power Load & Energy Dispatches
                    </h3>
                    <p className="text-xs text-[#6B5A4A] font-medium line-clamp-1">
                      Manage power surge alerts, peak load shaving & solar inverters
                    </p>
                  </div>
                </div>

                <span className="text-xs font-semibold px-2.5 py-0.5 inst-badge-ochre shrink-0">
                  {energyDispatches.filter(d => d.status !== 'Optimized').length} Action Required
                </span>
              </div>
            </div>

            {/* Dispatches List */}
            <div className="p-4 sm:p-5 space-y-3">
              {energyDispatches.map((disp) => (
                <div 
                  key={disp.id}
                  className="p-3.5 rounded-xl bg-[#FDF8F2] border border-[#E8DCC8] space-y-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap text-xs">
                      <span className="font-semibold px-2 py-0.5 bg-[#F7EFE4] text-[#2B1D12] border border-[#E8DCC8] rounded">
                        {disp.id}
                      </span>
                      <span className="font-semibold px-2 py-0.5 bg-[#F7EFE4] text-[#BC4800] border border-[#E8DCC8] rounded">
                        {disp.substation}
                      </span>
                      <span className={`font-semibold px-2.5 py-0.5 rounded-full border ${
                        disp.status === 'Optimized' ? 'bg-[#4E7A51]/15 text-[#4E7A51] border-[#4E7A51]/30' :
                        'bg-[#C48A2E]/15 text-[#C48A2E] border-[#C48A2E]/30'
                      }`}>
                        {disp.status}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-[#2B1D12]">{disp.title}</h4>
                    <p className="text-xs text-[#6B5A4A]">
                      Target Savings: <span className="text-[#4E7A51] font-semibold">{disp.savingImpact}</span> • Date: {disp.date}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {disp.status !== 'Optimized' ? (
                      <button
                        type="button"
                        onClick={() => handleDispatchAction(disp.id, 'Optimized')}
                        className="px-3.5 py-1.5 bg-[#4E7A51] hover:bg-[#3D6140] text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Optimize</span>
                      </button>
                    ) : (
                      <span className="px-2.5 py-1 bg-[#F7EFE4] text-[#6B5A4A] border border-[#E8DCC8] rounded-full text-xs font-semibold">
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

