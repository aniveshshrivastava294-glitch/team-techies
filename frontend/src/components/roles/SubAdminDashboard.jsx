import React, { useState, useEffect } from 'react';
import ChatWidget from '../ChatWidget';
import TransportManagerInterface from './TransportManagerInterface';
import MaintenanceManagerInterface from './MaintenanceManagerInterface';
import EnergyManagerInterface from './EnergyManagerInterface';
import ClassroomManagerInterface from './ClassroomManagerInterface';
import TicketsSupportLogCard from '../TicketsSupportLogCard';
import LiveCampusTicker from '../LiveCampusTicker';
import { 
  Building2, Check, X, Calendar as CalendarIcon, Clock, 
  Search, Plus, Tv, Wind, Mic, Volume2, ShieldAlert, Wrench, 
  Bus, Radio, CheckCircle2, RefreshCw, Zap, Users, Sliders, ArrowRight,
  Send, Activity, Cpu, Gauge, HelpCircle, FileText
} from 'lucide-react';

export default function SubAdminDashboard({ currentUser, activeTab: propActiveTab, setActiveTab: propSetActiveTab }) {
  const rawDomain = currentUser?.department_domain || 'events';
  const domain = rawDomain;

  if (propActiveTab === 'transport') {
    return <TransportManagerInterface />;
  }

  if (propActiveTab === 'maintenance') {
    return <MaintenanceManagerInterface />;
  }

  if (propActiveTab === 'anomalies') {
    return <EnergyManagerInterface />;
  }

  if (propActiveTab === 'matrix') {
    return <ClassroomManagerInterface />;
  }

  if (!propActiveTab || propActiveTab === 'overview') {
    if (domain === 'transport') return <TransportManagerInterface />;
    if (domain === 'maintenance') return <MaintenanceManagerInterface />;
    if (domain === 'energy') return <EnergyManagerInterface />;
    if (domain === 'classroom' || domain === 'classes' || domain === 'class') return <ClassroomManagerInterface />;
  }

  const [activeTab, setActiveTab] = useState(
    domain === 'transport' ? 'transport' :
    domain === 'maintenance' ? 'maintenance' :
    'auditorium'
  );

  const [selectedAudi, setSelectedAudi] = useState(null);
  const [searchLookup, setSearchLookup] = useState('');
  const [acMasterToggle, setAcMasterToggle] = useState(true);
  const [selectedDate, setSelectedDate] = useState('2026-08-26');
  const [activeCalendarSlot, setActiveCalendarSlot] = useState(3);
  const [toastMsg, setToastMsg] = useState(null);

  const [showAddAudiModal, setShowAddAudiModal] = useState(false);
  const [newAudiForm, setNewAudiForm] = useState({
    name: '',
    capacity: '',
    features: '4K Dual Projector, Dolby Surround Audio, Stage Lighting Grid',
    acStatus: 'STANDBY'
  });

  const [assistantQuery, setAssistantQuery] = useState('');
  const [assistantResponse, setAssistantResponse] = useState(null);
  const [isQuerying, setIsQuerying] = useState(false);

  const [auditoriums, setAuditoriums] = useState([
    { id: 'audi-1', name: 'Audi 1', capacity: 500, features: '4K Projector, Dolby Audio, Stage Lighting', status: 'Booked', acStatus: 'ON', currentEvent: 'CS-402 Cloud Computing' },
    { id: 'audi-2', name: 'Audi 2', capacity: 400, features: 'Dual Displays, Wireless Mics, Climate AC', status: 'Available', acStatus: 'STANDBY', currentEvent: 'Vacant' },
    { id: 'audi-3', name: 'Audi 3', capacity: 100, features: 'Interactive Smart Board, HD Audio', status: 'Available', acStatus: 'STANDBY', currentEvent: 'Vacant' },
    { id: 'audi-4', name: 'Audi 4', capacity: 50, features: 'Conference Screen, Podiums, HVAC', status: 'Available', acStatus: 'STANDBY', currentEvent: 'Vacant' },
    { id: 'audi-5', name: 'Audi 5', capacity: 100, features: 'Laser Projection, Wireless Mics', status: 'Available', acStatus: 'STANDBY', currentEvent: 'Vacant' },
  ]);

  const [approvalRequests, setApprovalRequests] = useState([
    {
      id: 'req-1',
      requestor: 'Prof. Chakraborty',
      department: 'Computer Science & Eng',
      details: 'Audi 1 (2:00 PM - 3:00 PM)',
      purpose: 'Guest Lecture on Quantum Computing',
      status: 'Pending'
    },
    {
      id: 'req-2',
      requestor: 'Dr. Prashad',
      department: 'Auditorium Management',
      details: 'Audi 2 (10:00 AM - 12:00 PM)',
      purpose: 'Annual Departmental Symposium',
      status: 'Pending'
    }
  ]);

  const [tickets, setTickets] = useState([]);
  const [buses, setBuses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchSubAdminData();
  }, [domain]);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const fetchSubAdminData = async () => {
    setIsLoading(true);
    try {
      if (domain === 'maintenance') {
        const res = await fetch('/api/tickets?domain=maintenance');
        const data = await res.json();
        if (data.status === 'success') setTickets(data.tickets || []);
      }
      if (domain === 'transport') {
        const res = await fetch('/api/domains/transportation');
        const data = await res.json();
        if (data.status === 'success') setBuses(data.records || []);
      }
    } catch (e) {
      console.error('SubAdmin fetch error:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApproveRequest = (reqId, action) => {
    setApprovalRequests(prev => prev.map(req => {
      if (req.id === reqId) {
        return { ...req, status: action };
      }
      return req;
    }));
    showToast(`Request ${action === 'Approved' ? 'Approved' : 'Rejected'}.`);
  };

  const handleAddAudiSubmit = (e) => {
    e.preventDefault();
    if (!newAudiForm.name.trim() || !newAudiForm.capacity) {
      showToast('Please specify Hall Name & Capacity!');
      return;
    }

    const newHall = {
      id: `audi-${Date.now()}`,
      name: newAudiForm.name.trim(),
      capacity: parseInt(newAudiForm.capacity, 10) || 100,
      features: newAudiForm.features.trim() || '4K Projector, Surround Audio, HVAC Climate',
      status: 'Available',
      acStatus: newAudiForm.acStatus || 'STANDBY',
      currentEvent: 'Vacant'
    };

    setAuditoriums(prev => [...prev, newHall]);
    setShowAddAudiModal(false);
    setNewAudiForm({
      name: '',
      capacity: '',
      features: '4K Dual Projector, Dolby Surround Audio, Stage Lighting Grid',
      acStatus: 'STANDBY'
    });
    showToast(`Successfully added ${newHall.name} (Cap: ${newHall.capacity})`);
  };

  const handleAssistantQuerySubmit = (e) => {
    e?.preventDefault();
    if (!assistantQuery.trim()) return;

    setIsQuerying(true);
    setAssistantResponse(null);

    setTimeout(() => {
      const q = assistantQuery.toLowerCase();
      let reply = "";
      if (q.includes('ac') || q.includes('climate')) {
        reply = "Audi 1 AC is active (22°C). Audi 2 to 5 climate controls are set to Eco Standby mode.";
      } else if (q.includes('projector') || q.includes('hardware') || q.includes('av')) {
        reply = "4 of 5 projectors are operational. Audi 3 projector bulb is healthy (88% lifespan remaining). 8 of 10 wireless mics are available.";
      } else if (q.includes('request') || q.includes('approval') || q.includes('pending')) {
        reply = "You have 2 pending venue requests. Prof. Chakraborty requested Audi 1 for 2:00 PM.";
      } else {
        reply = `Query result for "${assistantQuery}": All 5 auditoriums are operational with zero hardware faults reported.`;
      }
      setAssistantResponse(reply);
      setIsQuerying(false);
    }, 600);
  };

  const filteredAudis = auditoriums.filter(a => 
    a.name.toLowerCase().includes(searchLookup.toLowerCase()) ||
    a.status.toLowerCase().includes(searchLookup.toLowerCase()) ||
    a.capacity.toString().includes(searchLookup)
  );

  return (
    <div className="space-y-6 font-sans">
      
      <LiveCampusTicker />

      {toastMsg && (
        <div className="fixed top-16 right-6 bg-zinc-900 text-zinc-50 font-semibold text-xs px-4 py-2.5 rounded-xl shadow-none border border-zinc-800 z-50 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* HEADER BANNER */}
      <div className="card-onyx p-6 space-y-3 font-sans">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            {rawDomain === 'all' && (
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => setActiveTab('auditorium')}
                  className={`btn-onyx-secondary text-xs ${activeTab === 'auditorium' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : ''}`}
                >
                  <Building2 className="w-3.5 h-3.5" />
                  <span>Auditorium Manager</span>
                </button>
                <button
                  onClick={() => setActiveTab('transport')}
                  className={`btn-onyx-secondary text-xs ${activeTab === 'transport' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : ''}`}
                >
                  <Bus className="w-3.5 h-3.5" />
                  <span>Transport Manager</span>
                </button>
                <button
                  onClick={() => setActiveTab('maintenance')}
                  className={`btn-onyx-secondary text-xs ${activeTab === 'maintenance' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : ''}`}
                >
                  <Wrench className="w-3.5 h-3.5" />
                  <span>Maintenance Manager</span>
                </button>
              </div>
            )}

            <div>
              <span className="badge-amber text-[10px] uppercase">
                Auditorium & Event Command
              </span>
              <h1 className="text-xl font-bold tracking-tight text-zinc-50 mt-1">
                Good morning, {currentUser?.full_name || 'Marcus Brody'}
              </h1>
              <p className="text-xs text-zinc-400 mt-0.5">
                Real-time auditorium occupancy, climate control approvals, and hardware telemetry dashboard.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={fetchSubAdminData}
              disabled={isLoading}
              className="btn-amber-primary text-xs py-1.5 px-3"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Refresh Status</span>
            </button>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      {activeTab === 'transport' ? (
        <TransportManagerInterface />
      ) : activeTab === 'maintenance' ? (
        <MaintenanceManagerInterface />
      ) : (
        <div className="space-y-6">

          {/* AUDITORIUM OVERVIEW SECTION */}
          <div className="card-onyx p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-400">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-zinc-50">
                    Auditorium Overview
                  </h2>
                  <p className="text-xs text-zinc-400">
                    Facility occupancy & automated climate control settings
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 flex-wrap">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-zinc-500" />
                  <input
                    type="text"
                    value={searchLookup}
                    onChange={(e) => setSearchLookup(e.target.value)}
                    placeholder="Search hall or capacity..."
                    className="pl-8 pr-3 py-1.5 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-500/50 min-w-[200px]"
                  />
                </div>
              </div>
            </div>

            {/* AUDITORIUM FLEET CARDS */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 pt-1">
              {filteredAudis.map((audi) => {
                const isBooked = audi.status === 'Booked';
                return (
                  <div
                    key={audi.id}
                    onClick={() => setSelectedAudi(audi)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                      isBooked
                        ? 'bg-zinc-950 border-rose-500/30'
                        : 'bg-zinc-950 border-zinc-800 hover:border-zinc-700'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-zinc-50 text-xs">{audi.name}</span>
                        <Wind className={`w-3.5 h-3.5 ${audi.acStatus === 'ON' ? 'text-amber-400' : 'text-zinc-500'}`} />
                      </div>
                      <span className="text-[11px] font-mono text-zinc-400 block mt-1">
                        Cap: {audi.capacity}
                      </span>
                    </div>

                    <div className="mt-3">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border block text-center uppercase tracking-wider ${
                        isBooked
                          ? 'badge-rose'
                          : 'badge-emerald'
                      }`}>
                        {audi.status}
                      </span>
                    </div>
                  </div>
                );
              })}

              <button
                onClick={() => setShowAddAudiModal(true)}
                className="p-3.5 rounded-xl border border-dashed border-zinc-800 bg-zinc-950 hover:bg-zinc-900 transition-all flex flex-col items-center justify-center gap-1 text-zinc-400 hover:text-zinc-200 cursor-pointer"
              >
                <Plus className="w-4 h-4 text-amber-400" />
                <span className="font-medium text-xs">Add Hall</span>
              </button>
            </div>
          </div>

          {/* TICKETS LOG CARD */}
          <TicketsSupportLogCard 
            adminDomain="events" 
            title="Event Admin Tickets & Support Log" 
            subtitle="Track AV equipment, stage lighting, climate control & auditorium support tickets" 
          />

        </div>
      )}

      {/* ADD NEW AUDITORIUM MODAL */}
      {showAddAudiModal && (
        <div className="fixed inset-0 bg-zinc-950/80 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 w-full max-w-md rounded-xl p-5 shadow-none space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-semibold text-zinc-50">
                  Add New Auditorium
                </h3>
              </div>
              <button
                onClick={() => setShowAddAudiModal(false)}
                className="p-1 rounded text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddAudiSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-zinc-400 font-medium mb-1">
                  Auditorium Name <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Audi 6, Seminar Hall C"
                  value={newAudiForm.name}
                  onChange={(e) => setNewAudiForm({ ...newAudiForm, name: e.target.value })}
                  className="w-full px-3 py-1.5 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-100 focus:outline-none focus:border-amber-500/50"
                />
              </div>

              <div>
                <label className="block text-zinc-400 font-medium mb-1">
                  Seating Capacity <span className="text-rose-400">*</span>
                </label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 350"
                  value={newAudiForm.capacity}
                  onChange={(e) => setNewAudiForm({ ...newAudiForm, capacity: e.target.value })}
                  className="w-full px-3 py-1.5 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-100 focus:outline-none focus:border-amber-500/50"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setShowAddAudiModal(false)}
                  className="btn-onyx-secondary text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-amber-primary text-xs"
                >
                  Create & Add Hall
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Role-Scoped Assistant */}
      <ChatWidget />

    </div>
  );
}
