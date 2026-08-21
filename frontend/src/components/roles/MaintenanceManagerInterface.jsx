import React, { useState } from 'react';
import TicketsSupportLogCard from '../TicketsSupportLogCard';
import LiveCampusTicker from '../LiveCampusTicker';
import { 
  Wrench, ShieldAlert, Check, X, RefreshCw, Zap, Cpu, Wind, 
  Droplets, Flame, AlertTriangle, CheckCircle2, Clock, Plus, Search,
  Gauge, Activity, ArrowRight, Sparkles, Building2
} from 'lucide-react';

export default function MaintenanceManagerInterface() {
  const [toastMsg, setToastMsg] = useState(null);
  const [filterSystem, setFilterSystem] = useState('ALL');

  // Work Orders state
  const [workOrders, setWorkOrders] = useState([
    {
      id: 'WO-401',
      title: 'Main Science Block Chiller 2 Coolant Flush & Pressure Calibration',
      system: 'HVAC Climate',
      location: 'Block C Basement',
      priority: 'High',
      technician: 'Rajesh Kumar (Lead Engineer)',
      status: 'Pending Approval',
      date: 'Aug 21, 2026'
    },
    {
      id: 'WO-398',
      title: 'Academic Tower B Passenger Lift #3 Cable Tension Inspection',
      system: 'Elevators & Lifts',
      location: 'Tower B',
      priority: 'Critical',
      technician: 'OTIS Service Team',
      status: 'Approved',
      date: 'Aug 21, 2026'
    },
    {
      id: 'WO-392',
      title: 'Central Library DG Set #1 Battery Bank Replenishment',
      system: 'Electrical Grid',
      location: 'Substation Alpha',
      priority: 'Medium',
      technician: 'Sunil Sharma',
      status: 'In Progress',
      date: 'Aug 20, 2026'
    }
  ]);

  // Infrastructure Systems Telemetry state
  const [systems, setSystems] = useState([
    { id: 'sys-1', name: 'HVAC Chiller Unit 1', location: 'Main Audi', status: 'Optimal', health: 98, metric: '21.5°C Airflow' },
    { id: 'sys-2', name: 'HVAC Chiller Unit 2', location: 'Block C', status: 'Maintenance Required', health: 64, metric: 'Low Pressure Alert' },
    { id: 'sys-3', name: 'UPS Substation Alpha', location: 'Data Center', status: 'Optimal', health: 100, metric: '415V Stable' },
    { id: 'sys-4', name: 'DG Power Generator #1', location: 'Power House', status: 'Optimal', health: 95, metric: '88% Fuel Level' },
    { id: 'sys-5', name: 'Tower B Passenger Lift #3', location: 'Tower B', status: 'Inspection Due', health: 78, metric: '14,200 Cycles' },
    { id: 'sys-6', name: 'Hydro Water Pump Matrix', location: 'Pumping Station', status: 'Optimal', health: 92, metric: '4.2 Bar Pressure' }
  ]);

  const [showCreateWoModal, setShowCreateWoModal] = useState(false);
  const [newWoForm, setNewWoForm] = useState({
    title: '',
    system: 'HVAC Climate',
    location: '',
    priority: 'Medium',
    technician: ''
  });

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const handleWoAction = (id, action) => {
    setWorkOrders(prev => prev.map(wo => wo.id === id ? { ...wo, status: action } : wo));
    showToast(`Work Order ${id} set to ${action}`);
  };

  const handleCreateWoSubmit = (e) => {
    e.preventDefault();
    if (!newWoForm.title.trim() || !newWoForm.location.trim()) return;

    const newWo = {
      id: `WO-${Math.floor(400 + Math.random() * 99)}`,
      title: newWoForm.title.trim(),
      system: newWoForm.system,
      location: newWoForm.location.trim(),
      priority: newWoForm.priority,
      technician: newWoForm.technician.trim() || 'Unassigned Maintenance Tech',
      status: 'Pending Approval',
      date: 'Aug 21, 2026'
    };

    setWorkOrders(prev => [newWo, ...prev]);
    setShowCreateWoModal(false);
    setNewWoForm({ title: '', system: 'HVAC Climate', location: '', priority: 'Medium', technician: '' });
    showToast(`Registered Work Order ${newWo.id}`);
  };

  return (
    <div className="space-y-6 font-sans animate-in fade-in duration-500">
      
      {/* Live Campus Telemetry Ticker */}
      <LiveCampusTicker />

      {/* Toast Alert */}
      {toastMsg && (
        <div className="fixed top-20 right-6 bg-black/90 border border-amber-500/40 text-amber-300 font-mono text-xs px-4 py-2.5 rounded-2xl shadow-2xl z-50 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-amber-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header Banner - Borderless Galaxy */}
      <div className="p-6 rounded-3xl bg-slate-950 text-white border border-amber-500/30 shadow-2xl relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/90 to-amber-950/40 pointer-events-none rounded-3xl" />
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 text-[10px] font-mono font-extrabold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-full flex items-center gap-1.5 shadow-sm">
                <Wrench className="w-3.5 h-3.5 text-amber-400" />
                FACILITY & INFRASTRUCTURE COMMAND
              </span>
              <span className="text-xs text-amber-200/80 font-bold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
                Live Systems Monitor
              </span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white drop-shadow-sm flex items-center gap-2">
              Maintenance Manager Interface
              <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl font-medium leading-relaxed">
              Real-time HVAC climate diagnostics, electrical substation telemetry, elevator safety checks & work order dispatches.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setShowCreateWoModal(true)}
              className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-black text-xs font-black rounded-xl transition-all shadow-lg shadow-amber-950/50 flex items-center gap-1.5 cursor-pointer border border-amber-400/50 hover:scale-105 active:scale-95"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Create Work Order</span>
            </button>
          </div>
        </div>
      </div>

      {/* Systems Telemetry Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
            <Gauge className="w-4 h-4 text-amber-400" />
            Infrastructure Telemetry Matrix ({systems.length} Core Systems)
          </h2>
          <span className="text-xs font-mono text-emerald-400 font-bold px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded-full">
            98.4% Operational Health
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {systems.map((sys) => {
            const isWarning = sys.status.includes('Maintenance') || sys.status.includes('Inspection');
            return (
              <div 
                key={sys.id} 
                className={`p-4 rounded-2xl border transition-all duration-300 ${
                  isWarning 
                    ? 'bg-amber-500/5 border-amber-500/40 hover:border-amber-400' 
                    : 'bg-white/[0.02] border-white/5 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-white">{sys.name}</h3>
                  <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full border uppercase ${
                    isWarning ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  }`}>
                    {sys.status}
                  </span>
                </div>

                <div className="mt-3 flex items-center justify-between text-[11px] font-mono">
                  <span className="text-zinc-400">{sys.location}</span>
                  <span className="text-white font-bold">{sys.metric}</span>
                </div>

                <div className="mt-2.5 w-full bg-black/60 h-1.5 rounded-full overflow-hidden border border-white/5">
                  <div 
                    className={`h-full rounded-full transition-all ${isWarning ? 'bg-amber-400' : 'bg-emerald-400'}`} 
                    style={{ width: `${sys.health}%` }} 
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Side-by-Side Grid for Active Work Orders & Support Tickets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch font-sans">
        
        {/* Left Column: Active Work Orders & Maintenance Dispatches */}
        <div className="w-full rounded-3xl border border-white/5 bg-white/[0.02] backdrop-blur-2xl transition-all duration-300 overflow-hidden shadow-2xl flex flex-col justify-between">
          <div>
            {/* Header Bar */}
            <div className="p-4 sm:p-5 flex flex-col gap-3 border-b border-white/5 bg-gradient-to-r from-amber-500/5 via-transparent to-transparent">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-400 shrink-0">
                    <Wrench className="w-4 h-4 stroke-[1.5]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                      Active Work Orders & Maintenance Dispatches
                    </h3>
                    <p className="text-[11px] text-zinc-400 font-medium font-mono line-clamp-1">
                      Approve, reject, or assign technician dispatches
                    </p>
                  </div>
                </div>

                <span className="text-[10px] font-mono font-bold px-2.5 py-1 bg-amber-500/20 text-amber-300 rounded-full border border-amber-500/40 shrink-0 uppercase">
                  {workOrders.filter(w => w.status === 'Pending Approval').length} Action Required
                </span>
              </div>
            </div>

            {/* Work Orders List Body */}
            <div className="p-4 sm:p-5 space-y-3 font-mono">
              {workOrders.map((wo) => (
                <div 
                  key={wo.id}
                  className="p-4 rounded-2xl bg-black/40 border border-white/5 hover:border-white/15 transition-all space-y-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-bold px-2 py-0.5 bg-white/5 text-amber-300 rounded-full border border-white/10">
                        {wo.id}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 bg-white/5 text-cyan-300 rounded-full border border-white/10">
                        {wo.system}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase ${
                        wo.status === 'Approved' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' :
                        wo.status === 'Rejected' ? 'bg-rose-500/20 text-rose-300 border-rose-500/40' :
                        'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      }`}>
                        {wo.status}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-white font-sans">{wo.title}</h4>
                    <p className="text-[10px] text-zinc-500">
                      Location: <span className="text-zinc-300">{wo.location}</span> • Tech: <span className="text-amber-400">{wo.technician}</span> • Date: {wo.date}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 font-sans">
                    {wo.status === 'Pending Approval' ? (
                      <>
                        <button
                          type="button"
                          onClick={() => handleWoAction(wo.id, 'Approved')}
                          className="px-3 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Approve</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleWoAction(wo.id, 'Rejected')}
                          className="px-3 py-1.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>Reject</span>
                        </button>
                      </>
                    ) : (
                      <span className="px-3 py-1 bg-white/5 text-zinc-400 border border-white/10 rounded-full text-[11px] font-mono font-bold">
                        Processed
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Support Tickets Logger */}
        <TicketsSupportLogCard 
          adminDomain="maintenance" 
          title="Maintenance & Infrastructure Support Tickets" 
          subtitle="Track HVAC repairs, electrical substation alerts & plumbing tickets" 
        />

      </div>

      {/* Create Work Order Modal */}
      {showCreateWoModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-black/90 border border-white/10 w-full max-w-md rounded-3xl p-6 shadow-2xl space-y-4 relative animate-in zoom-in-95 backdrop-blur-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400">
                  <Wrench className="w-4 h-4 stroke-[1.5]" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Create Infrastructure Work Order</h3>
                  <p className="text-[11px] text-zinc-400 font-mono">Dispatch maintenance engineer to campus location</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowCreateWoModal(false)}
                className="p-1 rounded-full hover:bg-white/10 text-zinc-400 cursor-pointer transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateWoSubmit} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="block font-mono font-bold text-zinc-300">Work Order Title <span className="text-amber-400">*</span></label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Block A Generator Oil Filter Change"
                  value={newWoForm.title}
                  onChange={(e) => setNewWoForm({ ...newWoForm, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-black/60 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400/60"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block font-mono font-bold text-zinc-300">System Domain</label>
                  <select
                    value={newWoForm.system}
                    onChange={(e) => setNewWoForm({ ...newWoForm, system: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-black/60 border border-white/10 rounded-xl text-xs text-white focus:outline-none"
                  >
                    <option value="HVAC Climate">HVAC Climate</option>
                    <option value="Electrical Grid">Electrical Grid</option>
                    <option value="Elevators & Lifts">Elevators & Lifts</option>
                    <option value="Water & Plumbing">Water & Plumbing</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block font-mono font-bold text-zinc-300">Priority</label>
                  <select
                    value={newWoForm.priority}
                    onChange={(e) => setNewWoForm({ ...newWoForm, priority: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-black/60 border border-white/10 rounded-xl text-xs text-white focus:outline-none"
                  >
                    <option value="Critical">Critical</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block font-mono font-bold text-zinc-300">Location <span className="text-amber-400">*</span></label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Block C Substation / Elevator #2"
                  value={newWoForm.location}
                  onChange={(e) => setNewWoForm({ ...newWoForm, location: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-black/60 border border-white/10 rounded-xl text-xs text-white focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="block font-mono font-bold text-zinc-300">Assigned Technician</label>
                <input
                  type="text"
                  placeholder="e.g. Lead Engineer Ramesh"
                  value={newWoForm.technician}
                  onChange={(e) => setNewWoForm({ ...newWoForm, technician: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-black/60 border border-white/10 rounded-xl text-xs text-white focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setShowCreateWoModal(false)}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 text-zinc-400 rounded-full font-mono font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-full cursor-pointer"
                >
                  Dispatch Work Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
