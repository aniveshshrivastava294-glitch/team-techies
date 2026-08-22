import React, { useState } from 'react';
import SectionHero from '../SectionHero';
import { BACKDROP_IMAGES } from '../../config/backdropImages';
import TicketsSupportLogCard from '../TicketsSupportLogCard';
import LiveCampusTicker from '../LiveCampusTicker';
import { 
  Wrench, Check, X, CheckCircle2, Plus, Gauge
} from 'lucide-react';

export default function MaintenanceManagerInterface() {
  const [toastMsg, setToastMsg] = useState(null);

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
    <div className="space-y-6 font-sans animate-in fade-in duration-300">
      
      {/* Toast Alert */}
      {toastMsg && (
        <div className="fixed top-20 right-6 bg-[#2B1D12] text-white font-medium text-xs px-4 py-2.5 rounded-xl shadow-2xl z-50 flex items-center gap-2 border border-[#E8DCC8]">
          <CheckCircle2 className="w-4 h-4 text-[#4E7A51]" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* ================= SECTION HERO: MAINTENANCE & INFRASTRUCTURE BACKDROP ================= */}
      <SectionHero
        image={BACKDROP_IMAGES.maintenance}
        category="Facility & Infrastructure"
        categoryIcon={Wrench}
        badgeText="98.4% System Health"
        title="Facilities & Maintenance Command"
        subtitle="Real-time HVAC climate diagnostics, electrical substation telemetry, elevator safety checks & work order dispatches."
      >
        <button
          onClick={() => setShowCreateWoModal(true)}
          className="px-4 py-2 inst-button-primary text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Create Work Order</span>
        </button>
      </SectionHero>

      {/* Live Campus Telemetry Ticker */}
      <LiveCampusTicker />

      {/* Systems Telemetry Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-[#2B1D12] tracking-tight flex items-center gap-2">
            <Gauge className="w-4 h-4 text-[#BC4800]" />
            Infrastructure Telemetry Matrix ({systems.length} Core Systems)
          </h2>
          <span className="text-xs text-[#2B1D12] font-semibold px-2.5 py-1 bg-[#FDF8F2] border border-[#E8DCC8] rounded-full">
            98.4% Operational Health
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {systems.map((sys) => {
            const isWarning = sys.status.includes('Maintenance') || sys.status.includes('Inspection');
            return (
              <div 
                key={sys.id} 
                className="p-4 rounded-xl border border-[#E8DCC8] bg-[#F7EFE4] shadow-xs space-y-2"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-[#2B1D12]">{sys.name}</h3>
                  <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${
                    isWarning ? 'bg-[#C48A2E]/15 text-[#C48A2E] border-[#C48A2E]/30' : 'bg-[#4E7A51]/15 text-[#4E7A51] border-[#4E7A51]/30'
                  }`}>
                    {sys.status}
                  </span>
                </div>

                <div className="mt-3 flex items-center justify-between text-xs text-[#6B5A4A]">
                  <span>{sys.location}</span>
                  <span className="text-[#2B1D12] font-bold">{sys.metric}</span>
                </div>

                <div className="mt-2 w-full bg-[#E8DCC8] h-1.5 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all ${isWarning ? 'bg-[#C48A2E]' : 'bg-[#4E7A51]'}`} 
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
        <div className="w-full rounded-2xl border border-[#E8DCC8] bg-[#F7EFE4] shadow-xs overflow-hidden flex flex-col justify-between">
          <div>
            {/* Header Bar */}
            <div className="p-4 sm:p-5 flex flex-col gap-3 border-b border-[#E8DCC8]">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg border border-[#BC4800]/30 bg-[#BC4800]/15 text-[#BC4800] shrink-0">
                    <Wrench className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#2B1D12] tracking-tight flex items-center gap-2">
                      Active Work Orders & Maintenance Dispatches
                    </h3>
                    <p className="text-xs text-[#6B5A4A] font-medium line-clamp-1">
                      Approve, reject, or assign technician dispatches
                    </p>
                  </div>
                </div>

                <span className="text-xs font-semibold px-2.5 py-0.5 inst-badge-ochre shrink-0">
                  {workOrders.filter(w => w.status === 'Pending Approval').length} Action Required
                </span>
              </div>
            </div>

            {/* Work Orders List Body */}
            <div className="p-4 sm:p-5 space-y-3">
              {workOrders.map((wo) => (
                <div 
                  key={wo.id}
                  className="p-3.5 rounded-xl bg-[#FDF8F2] border border-[#E8DCC8] space-y-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap text-xs">
                      <span className="font-semibold px-2 py-0.5 bg-[#F7EFE4] text-[#2B1D12] border border-[#E8DCC8] rounded">
                        {wo.id}
                      </span>
                      <span className="font-semibold px-2 py-0.5 bg-[#F7EFE4] text-[#BC4800] border border-[#E8DCC8] rounded">
                        {wo.system}
                      </span>
                      <span className={`font-semibold px-2.5 py-0.5 rounded-full border ${
                        wo.status === 'Approved' ? 'bg-[#4E7A51]/15 text-[#4E7A51] border-[#4E7A51]/30' :
                        wo.status === 'Rejected' ? 'bg-[#A6402F]/15 text-[#A6402F] border-[#A6402F]/30' :
                        'bg-[#C48A2E]/15 text-[#C48A2E] border-[#C48A2E]/30'
                      }`}>
                        {wo.status}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-[#2B1D12]">{wo.title}</h4>
                    <p className="text-xs text-[#6B5A4A]">
                      Location: <span className="text-[#2B1D12] font-semibold">{wo.location}</span> • Tech: <span className="text-[#BC4800] font-semibold">{wo.technician}</span> • Date: {wo.date}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {wo.status === 'Pending Approval' ? (
                      <>
                        <button
                          type="button"
                          onClick={() => handleWoAction(wo.id, 'Approved')}
                          className="px-3.5 py-1.5 bg-[#4E7A51] hover:bg-[#3D6140] text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Approve</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleWoAction(wo.id, 'Rejected')}
                          className="py-1.5 px-3 bg-[#A6402F]/15 hover:bg-[#A6402F]/25 text-[#A6402F] border border-[#A6402F]/30 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>Reject</span>
                        </button>
                      </>
                    ) : (
                      <span className="px-2.5 py-1 bg-[#F7EFE4] text-[#6B5A4A] border border-[#E8DCC8] rounded-full text-xs font-semibold">
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
        <div className="fixed inset-0 bg-[#2B1D12]/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in font-sans">
          <div className="bg-[#F7EFE4] border border-[#E8DCC8] w-full max-w-md rounded-2xl p-6 shadow-2xl space-y-4 relative animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8DCC8]">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-[#BC4800]/15 border border-[#BC4800]/30 rounded-lg text-[#BC4800]">
                  <Wrench className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#2B1D12]">Create Infrastructure Work Order</h3>
                  <p className="text-xs text-[#6B5A4A]">Dispatch maintenance engineer to campus location</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowCreateWoModal(false)}
                className="p-1 rounded-lg hover:bg-[#FDF8F2] text-[#6B5A4A] cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateWoSubmit} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="block font-semibold text-[#2B1D12]">Work Order Title <span className="text-[#BC4800]">*</span></label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Block A Generator Oil Filter Change"
                  value={newWoForm.title}
                  onChange={(e) => setNewWoForm({ ...newWoForm, title: e.target.value })}
                  className="w-full px-3.5 py-2 bg-[#FDF8F2] border border-[#E8DCC8] rounded-lg text-xs text-[#2B1D12] placeholder-[#6B5A4A]/60 focus:outline-none focus:border-[#BC4800]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block font-semibold text-[#2B1D12]">System Domain</label>
                  <select
                    value={newWoForm.system}
                    onChange={(e) => setNewWoForm({ ...newWoForm, system: e.target.value })}
                    className="w-full px-3.5 py-2 bg-[#FDF8F2] border border-[#E8DCC8] rounded-lg text-xs text-[#2B1D12] focus:outline-none focus:border-[#BC4800]"
                  >
                    <option value="HVAC Climate">HVAC Climate</option>
                    <option value="Electrical Grid">Electrical Grid</option>
                    <option value="Elevators & Lifts">Elevators & Lifts</option>
                    <option value="Water & Plumbing">Water & Plumbing</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block font-semibold text-[#2B1D12]">Priority</label>
                  <select
                    value={newWoForm.priority}
                    onChange={(e) => setNewWoForm({ ...newWoForm, priority: e.target.value })}
                    className="w-full px-3.5 py-2 bg-[#FDF8F2] border border-[#E8DCC8] rounded-lg text-xs text-[#2B1D12] focus:outline-none focus:border-[#BC4800]"
                  >
                    <option value="Critical">Critical</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block font-semibold text-[#2B1D12]">Location <span className="text-[#BC4800]">*</span></label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Block C Substation / Elevator #2"
                  value={newWoForm.location}
                  onChange={(e) => setNewWoForm({ ...newWoForm, location: e.target.value })}
                  className="w-full px-3.5 py-2 bg-[#FDF8F2] border border-[#E8DCC8] rounded-lg text-xs text-[#2B1D12] placeholder-[#6B5A4A]/60 focus:outline-none focus:border-[#BC4800]"
                />
              </div>

              <div className="space-y-1">
                <label className="block font-semibold text-[#2B1D12]">Assigned Technician</label>
                <input
                  type="text"
                  placeholder="e.g. Lead Engineer Ramesh"
                  value={newWoForm.technician}
                  onChange={(e) => setNewWoForm({ ...newWoForm, technician: e.target.value })}
                  className="w-full px-3.5 py-2 bg-[#FDF8F2] border border-[#E8DCC8] rounded-lg text-xs text-[#2B1D12] placeholder-[#6B5A4A]/60 focus:outline-none focus:border-[#BC4800]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E8DCC8]">
                <button
                  type="button"
                  onClick={() => setShowCreateWoModal(false)}
                  className="px-4 py-2 bg-[#FDF8F2] hover:bg-[#F7EFE4] text-[#2B1D12] border border-[#E8DCC8] rounded-lg font-semibold cursor-pointer text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 inst-button-primary rounded-lg font-semibold cursor-pointer text-xs"
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

