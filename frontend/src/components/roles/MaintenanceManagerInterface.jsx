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
        <div className="fixed top-20 right-6 bg-[#92400E] border border-[#78350F] text-white font-mono text-xs px-4 py-2.5 rounded-md shadow-md z-50 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-white" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header Banner - Executive Obsidian with Amber Accents */}
      <div className="p-6 rounded-lg bg-[#1C1917] text-[#FAF8F3] border border-[#92400E] shadow-md relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="badge-brown text-[10px]">
                <Wrench className="w-3.5 h-3.5 text-[#92400E]" />
                FACILITY & INFRASTRUCTURE COMMAND
              </span>
              <span className="text-xs text-[#FDE68A] font-bold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#F59E0B] animate-ping inline-block" />
                Live Systems Monitor
              </span>
            </div>
            
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              Maintenance Manager Interface
              <Sparkles className="w-5 h-5 text-[#F59E0B]" />
            </h1>
            <p className="text-xs text-[#D6CEBE] max-w-2xl font-medium leading-relaxed">
              Real-time HVAC climate diagnostics, electrical substation telemetry, elevator safety checks & work order dispatches.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setShowCreateWoModal(true)}
              className="btn-primary-brown text-xs"
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
            <Gauge className="w-4 h-4 text-[#92400E]" />
            Infrastructure Telemetry Matrix ({systems.length} Core Systems)
          </h2>
          <span className="badge-brown text-xs">
            98.4% Operational Health
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {systems.map((sys) => {
            const isWarning = sys.status.includes('Maintenance') || sys.status.includes('Inspection');
            return (
              <div 
                key={sys.id} 
                className={`card-surface p-4 shadow-2xs space-y-3 ${isWarning ? 'border-amber-300 bg-amber-50/20' : ''}`}
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-[#1C1917]">{sys.name}</h3>
                  <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded border uppercase ${
                    isWarning ? 'badge-brown' : 'badge-emerald'
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
                    className={`h-full rounded-full transition-all ${isWarning ? 'bg-[#92400E]' : 'bg-emerald-600'}`}
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
            <div className="flex items-center justify-between pb-3 border-b border-[#E6E0D2] mb-3">
              <div className="flex items-center space-x-2">
                <Wrench className="w-4 h-4 text-[#92400E]" />
                <h3 className="text-sm font-bold text-[#1C1917]">
                  Active Work Orders & Maintenance Dispatches
                </h3>
              </div>
              <span className="badge-brown text-[10px]">
                {workOrders.length} Dispatches
              </span>
            </div>

            <div className="divide-y divide-[#E6E0D2]">
              {workOrders.map((wo) => (
                <div key={wo.id} className="py-3 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-xs font-bold text-[#92400E]">{wo.id}</span>
                        <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border ${
                          wo.priority === 'Critical' ? 'badge-error' : wo.priority === 'High' ? 'badge-brown' : 'badge-mono'
                        }`}>
                          {wo.priority}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-[#1C1917] mt-0.5">{wo.title}</h4>
                      <p className="text-[11px] text-[#57534E] font-mono mt-0.5">
                        {wo.location} • {wo.technician}
                      </p>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      {wo.status === 'Pending Approval' ? (
                        <>
                          <button
                            onClick={() => handleWoAction(wo.id, 'Approved')}
                            className="btn-primary-brown text-[10px] py-1 px-2"
                            title="Approve Work Order"
                          >
                            <Check className="w-3 h-3" />
                            <span>Approve</span>
                          </button>
                          <button
                            onClick={() => handleWoAction(wo.id, 'Rejected')}
                            className="btn-secondary text-[10px] py-1 px-2"
                            title="Reject Work Order"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </>
                      ) : (
                        <span className={`text-[10px] font-mono font-bold px-2 py-1 rounded border ${
                          wo.status === 'Approved' ? 'badge-emerald' : 'badge-brown'
                        }`}>
                          {wo.status}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => setShowCreateWoModal(true)}
            className="btn-primary-brown w-full text-xs py-2 mt-2"
          >
            <Plus className="w-4 h-4" />
            <span>Dispatch New Maintenance Work Order</span>
          </button>
        </div>

        {/* Right Column: Support Tickets Logger */}
        <div>
          <TicketsSupportLogCard currentUser={{ role: 'maintenance_manager', full_name: 'Sub-Admin Maintenance' }} />
        </div>

      </div>

      {/* Modal: Create Work Order */}
      {showCreateWoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs font-sans">
          <div className="card-surface w-full max-w-md p-6 rounded-lg border border-[#E6E0D2] shadow-xl relative bg-[#FAF8F3]">
            <div className="flex items-center justify-between pb-3 border-b border-[#E6E0D2] mb-4">
              <h3 className="text-sm font-bold text-[#1C1917] flex items-center gap-2">
                <Wrench className="w-4 h-4 text-[#92400E]" />
                Dispatch New Maintenance Work Order
              </h3>
              <button onClick={() => setShowCreateWoModal(false)} className="text-[#78716C] hover:text-[#1C1917]">×</button>
            </div>

            <form onSubmit={handleCreateWoSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-[#1C1917] font-semibold mb-1">Work Order Title / Description</label>
                <input
                  type="text"
                  value={newWoForm.title}
                  onChange={(e) => setNewWoForm({ ...newWoForm, title: e.target.value })}
                  placeholder="e.g. Science Block HVAC Chiller 2 Coolant Leak Repair"
                  className="w-full bg-white border border-[#E6E0D2] rounded-md px-3 py-2 text-[#1C1917] focus:outline-none focus:border-[#92400E] font-bold"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[#1C1917] font-semibold mb-1">System Category</label>
                  <select
                    value={newWoForm.system}
                    onChange={(e) => setNewWoForm({ ...newWoForm, system: e.target.value })}
                    className="w-full bg-white border border-[#E6E0D2] rounded-md px-3 py-2 text-[#1C1917] focus:outline-none focus:border-[#92400E] font-bold"
                  >
                    <option value="HVAC Climate">HVAC Climate</option>
                    <option value="Electrical Grid">Electrical Grid</option>
                    <option value="Elevators & Lifts">Elevators & Lifts</option>
                    <option value="Plumbing & Pumps">Plumbing & Pumps</option>
                    <option value="AV & Hardware">AV & Hardware</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#1C1917] font-semibold mb-1">Priority</label>
                  <select
                    value={newWoForm.priority}
                    onChange={(e) => setNewWoForm({ ...newWoForm, priority: e.target.value })}
                    className="w-full bg-white border border-[#E6E0D2] rounded-md px-3 py-2 text-[#1C1917] focus:outline-none focus:border-[#92400E] font-bold"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[#1C1917] font-semibold mb-1">Location / Building Room</label>
                <input
                  type="text"
                  value={newWoForm.location}
                  onChange={(e) => setNewWoForm({ ...newWoForm, location: e.target.value })}
                  placeholder="e.g. Block C Basement Plant Room"
                  className="w-full bg-white border border-[#E6E0D2] rounded-md px-3 py-2 text-[#1C1917] focus:outline-none focus:border-[#92400E] font-bold"
                  required
                />
              </div>

              <div>
                <label className="block text-[#1C1917] font-semibold mb-1">Assigned Lead Technician / Vendor</label>
                <input
                  type="text"
                  value={newWoForm.technician}
                  onChange={(e) => setNewWoForm({ ...newWoForm, technician: e.target.value })}
                  placeholder="e.g. Rajesh Kumar (Lead HVAC Engineer)"
                  className="w-full bg-white border border-[#E6E0D2] rounded-md px-3 py-2 text-[#1C1917] focus:outline-none focus:border-[#92400E] font-bold"
                />
              </div>

              <div className="pt-2 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowCreateWoModal(false)}
                  className="btn-secondary text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary-brown text-xs py-2 px-4"
                >
                  Submit Work Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
