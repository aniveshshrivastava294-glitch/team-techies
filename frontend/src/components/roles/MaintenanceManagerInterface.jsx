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
    <div className="space-y-6 font-sans pb-10 relative">
      
      {/* Live Campus Telemetry Ticker */}
      <LiveCampusTicker />

      {/* Toast Alert */}
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
                <Wrench className="w-3.5 h-3.5 text-white" />
                FACILITY & INFRASTRUCTURE COMMAND
              </span>
              <span className="text-xs text-[#D6CEBE] font-bold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-white animate-ping inline-block" />
                Live Systems Monitor
              </span>
            </div>
            
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              Maintenance Manager Interface
              <Sparkles className="w-5 h-5 text-white" />
            </h1>
            <p className="text-xs text-[#D6CEBE] max-w-2xl font-medium leading-relaxed">
              Real-time HVAC climate diagnostics, electrical substation telemetry, elevator safety checks & work order dispatches.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setShowCreateWoModal(true)}
              className="btn-primary text-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Create Work Order</span>
            </button>
          </div>
        </div>
      </div>

      {/* Systems Telemetry Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-[#1C1917] tracking-tight flex items-center gap-2">
            <Gauge className="w-4 h-4 text-[#1C1917]" />
            Infrastructure Telemetry Matrix ({systems.length} Core Systems)
          </h2>
          <span className="badge-mono-dark text-xs">
            98.4% Operational Health
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {systems.map((sys) => {
            const isWarning = sys.status.includes('Maintenance') || sys.status.includes('Inspection');
            return (
              <div 
                key={sys.id} 
                className="card-surface p-4 shadow-2xs space-y-3"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-[#1C1917]">{sys.name}</h3>
                  <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded border uppercase ${
                    isWarning ? 'badge-mono-dark' : 'badge-mono'
                  }`}>
                    {sys.status}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-[#57534E] font-semibold">{sys.location}</span>
                  <span className="text-[#1C1917] font-bold">{sys.metric}</span>
                </div>

                <div className="w-full bg-[#E6E0D2] h-1.5 rounded-full overflow-hidden border border-[#D6CEBE]">
                  <div 
                    className="h-full rounded-full transition-all bg-[#1C1917]" 
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
        <div className="card-surface p-5 shadow-2xs flex flex-col justify-between space-y-4">
          <div>
            {/* Header Bar */}
            <div className="pb-3 border-b border-[#E6E0D2] flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-md bg-[#F0EBE1] border border-[#E6E0D2] text-[#1C1917]">
                  <Wrench className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#1C1917] tracking-tight">
                    Active Work Orders & Maintenance Dispatches
                  </h3>
                  <p className="text-[11px] text-[#57534E] font-medium font-mono">
                    Approve, reject, or assign technician dispatches
                  </p>
                </div>
              </div>

              <span className="badge-mono-dark text-[10px]">
                {workOrders.filter(w => w.status === 'Pending Approval').length} Action Required
              </span>
            </div>

            {/* Work Orders List Body */}
            <div className="space-y-3 pt-3">
              {workOrders.map((wo) => (
                <div 
                  key={wo.id}
                  className="p-3.5 rounded-lg bg-[#FAF8F3] border border-[#E6E0D2] hover:border-[#1C1917] transition-all space-y-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="badge-mono text-[10px]">
                        {wo.id}
                      </span>
                      <span className="badge-mono text-[10px]">
                        {wo.system}
                      </span>
                      <span className={`text-[10px] ${
                        wo.status === 'Approved' ? 'badge-mono-dark' :
                        wo.status === 'Rejected' ? 'badge-mono' :
                        'badge-mono-dark'
                      }`}>
                        {wo.status}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-[#1C1917]">{wo.title}</h4>
                    <p className="text-[10px] text-[#57534E] font-mono">
                      Location: <span className="text-[#1C1917] font-bold">{wo.location}</span> • Tech: <span className="text-[#1C1917] font-bold">{wo.technician}</span> • Date: {wo.date}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 font-sans">
                    {wo.status === 'Pending Approval' ? (
                      <>
                        <button
                          type="button"
                          onClick={() => handleWoAction(wo.id, 'Approved')}
                          className="btn-primary text-xs py-1 px-3"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Approve</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleWoAction(wo.id, 'Rejected')}
                          className="btn-secondary text-xs py-1 px-2.5 text-[#1C1917]"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>Reject</span>
                        </button>
                      </>
                    ) : (
                      <span className="badge-mono text-[10px]">
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
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-[#FAF8F3] border border-[#E6E0D2] w-full max-w-md rounded-lg p-6 shadow-xl space-y-4 relative">
            <div className="flex items-center justify-between pb-3 border-b border-[#E6E0D2]">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-[#F0EBE1] border border-[#E6E0D2] rounded-md text-[#1C1917]">
                  <Wrench className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#1C1917]">Create Infrastructure Work Order</h3>
                  <p className="text-[11px] text-[#57534E] font-mono">Dispatch maintenance engineer to campus location</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowCreateWoModal(false)}
                className="p-1 rounded text-[#78716C] hover:text-[#1C1917] hover:bg-[#F0EBE1]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateWoSubmit} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="block font-semibold text-[#1C1917]">Work Order Title <span className="text-[#1C1917]">*</span></label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Block A Generator Oil Filter Change"
                  value={newWoForm.title}
                  onChange={(e) => setNewWoForm({ ...newWoForm, title: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-[#E6E0D2] rounded-md text-xs text-[#1C1917] focus:outline-none focus:border-[#1C1917] font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block font-semibold text-[#1C1917]">System Domain</label>
                  <select
                    value={newWoForm.system}
                    onChange={(e) => setNewWoForm({ ...newWoForm, system: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-[#E6E0D2] rounded-md text-xs text-[#1C1917] focus:outline-none font-medium"
                  >
                    <option value="HVAC Climate">HVAC Climate</option>
                    <option value="Electrical Grid">Electrical Grid</option>
                    <option value="Elevators & Lifts">Elevators & Lifts</option>
                    <option value="Water & Plumbing">Water & Plumbing</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block font-semibold text-[#1C1917]">Priority</label>
                  <select
                    value={newWoForm.priority}
                    onChange={(e) => setNewWoForm({ ...newWoForm, priority: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-[#E6E0D2] rounded-md text-xs text-[#1C1917] focus:outline-none font-medium"
                  >
                    <option value="Critical">Critical</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block font-semibold text-[#1C1917]">Location <span className="text-[#1C1917]">*</span></label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Block C Substation / Elevator #2"
                  value={newWoForm.location}
                  onChange={(e) => setNewWoForm({ ...newWoForm, location: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-[#E6E0D2] rounded-md text-xs text-[#1C1917] focus:outline-none font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="block font-semibold text-[#1C1917]">Assigned Technician</label>
                <input
                  type="text"
                  placeholder="e.g. Lead Engineer Ramesh"
                  value={newWoForm.technician}
                  onChange={(e) => setNewWoForm({ ...newWoForm, technician: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-[#E6E0D2] rounded-md text-xs text-[#1C1917] focus:outline-none font-medium"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E6E0D2]">
                <button
                  type="button"
                  onClick={() => setShowCreateWoModal(false)}
                  className="btn-secondary text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary text-xs"
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
