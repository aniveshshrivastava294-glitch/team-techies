import React, { useState, useEffect } from 'react';
import ChatWidget from '../ChatWidget';
import SectionHero from '../SectionHero';
import { BACKDROP_IMAGES } from '../../config/backdropImages';
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

export default function SubAdminDashboard({ currentUser }) {
  // Determine primary domain
  const rawDomain = currentUser?.department_domain || 'events';
  const domain = rawDomain;

  // Strict Domain Isolation: Render only the dedicated domain interface for single-domain sub-admins
  if (domain === 'transport') {
    return <TransportManagerInterface />;
  }

  if (domain === 'maintenance') {
    return <MaintenanceManagerInterface />;
  }

  if (domain === 'energy') {
    return <EnergyManagerInterface />;
  }

  if (domain === 'classroom' || domain === 'classes' || domain === 'class') {
    return <ClassroomManagerInterface />;
  }

  // Active view tab state (for multi-domain / events view)
  const [activeTab, setActiveTab] = useState(
    domain === 'transport' ? 'transport' :
    domain === 'maintenance' ? 'maintenance' :
    'auditorium'
  );

  // Auditorium / Event Admin States
  const [selectedAudi, setSelectedAudi] = useState(null);
  const [searchLookup, setSearchLookup] = useState('');
  const [acMasterToggle, setAcMasterToggle] = useState(true);
  const [selectedDate, setSelectedDate] = useState('2026-08-26');
  const [activeCalendarSlot, setActiveCalendarSlot] = useState(3);
  const [toastMsg, setToastMsg] = useState(null);

  // Add New Auditorium Modal States
  const [showAddAudiModal, setShowAddAudiModal] = useState(false);
  const [newAudiForm, setNewAudiForm] = useState({
    name: '',
    capacity: '',
    features: '4K Dual Projector, Dolby Surround Audio, Stage Lighting Grid',
    acStatus: 'STANDBY'
  });

  // Quick Query Assistant States
  const [assistantQuery, setAssistantQuery] = useState('');
  const [assistantResponse, setAssistantResponse] = useState(null);
  const [isQuerying, setIsQuerying] = useState(false);

  // Auditorium Fleet Initial Data
  const [auditoriums, setAuditoriums] = useState([
    { id: 'audi-1', name: 'Audi 1', capacity: 500, features: '4K Projector, Dolby Audio, Stage Lighting', status: 'Booked', acStatus: 'ON', currentEvent: 'CS-402 Cloud Computing' },
    { id: 'audi-2', name: 'Audi 2', capacity: 400, features: 'Dual Displays, Wireless Mics, Climate AC', status: 'Available', acStatus: 'STANDBY', currentEvent: 'Vacant' },
    { id: 'audi-3', name: 'Audi 3', capacity: 100, features: 'Interactive Smart Board, HD Audio', status: 'Available', acStatus: 'STANDBY', currentEvent: 'Vacant' },
    { id: 'audi-4', name: 'Audi 4', capacity: 50, features: 'Conference Screen, Podiums, HVAC', status: 'Available', acStatus: 'STANDBY', currentEvent: 'Vacant' },
    { id: 'audi-5', name: 'Audi 5', capacity: 100, features: 'Laser Projection, Wireless Mics', status: 'Available', acStatus: 'STANDBY', currentEvent: 'Vacant' },
  ]);

  // AC / Venue Approval Requests
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

  // Maintenance & Transport Domain States
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

  // Filter Auditoriums by Search Lookup
  const filteredAudis = auditoriums.filter(a => 
    a.name.toLowerCase().includes(searchLookup.toLowerCase()) ||
    a.status.toLowerCase().includes(searchLookup.toLowerCase()) ||
    a.capacity.toString().includes(searchLookup)
  );

  return (
    <div className="space-y-6 font-sans">
      
      {/* Toast Alert Banner */}
      {toastMsg && (
        <div className="fixed top-20 right-6 bg-[#2B1D12] text-white font-medium text-xs px-4 py-2.5 rounded-xl shadow-xl z-50 flex items-center gap-2 border border-[#E8DCC8]">
          <CheckCircle2 className="w-4 h-4 text-[#4E7A51]" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* ================= SECTION HERO: AUDITORIUM & EVENT COMMAND ================= */}
      <SectionHero
        image={BACKDROP_IMAGES.classrooms}
        category="Auditorium & Events"
        categoryIcon={Building2}
        badgeText="Venue Scheduling"
        title={`Welcome, ${currentUser?.full_name || 'Event Administrator'}`}
        subtitle="Real-time auditorium occupancy, climate control approvals, and hardware telemetry dashboard."
      >
        <button
          onClick={fetchSubAdminData}
          disabled={isLoading}
          className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg border border-white/20 text-xs font-medium backdrop-blur-xs transition-colors cursor-pointer flex items-center gap-2"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh Matrix</span>
        </button>
      </SectionHero>

      {/* Live Campus Telemetry Ticker */}
      <LiveCampusTicker />

      {/* ================= MAIN CONTENT ================= */}
      {activeTab === 'transport' ? (
        <TransportManagerInterface />
      ) : activeTab === 'maintenance' ? (
        <MaintenanceManagerInterface />
      ) : (
        <div className="space-y-8 md:space-y-10">

          {/* 1. AUDITORIUM OVERVIEW SECTION */}
          <div className="p-6 md:p-7 rounded-2xl border border-[#E8DCC8] bg-[#F7EFE4] shadow-xs space-y-5 relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8DCC8] relative z-10">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#BC4800]/15 border border-[#BC4800]/30 rounded-lg text-[#BC4800]">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base md:text-lg font-bold text-[#2B1D12]">
                    Auditorium Overview
                  </h2>
                  <p className="text-xs text-[#6B5A4A] font-medium">
                    Facility occupancy & automated climate control settings
                  </p>
                </div>
              </div>

              {/* Master AC Control & Lookup Search */}
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-2 bg-[#FDF8F2] px-3 py-1.5 rounded-lg border border-[#E8DCC8]">
                  <Wind className="w-4 h-4 text-[#BC4800]" />
                  <span className="text-xs font-semibold text-[#2B1D12]">Master Climate AC:</span>
                  <button
                    onClick={() => {
                      setAcMasterToggle(!acMasterToggle);
                      showToast(`Master Climate AC set to ${!acMasterToggle ? 'Automatic' : 'Manual Override'}`);
                    }}
                    className={`px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase transition-all ${
                      acMasterToggle
                        ? 'bg-[#4E7A51]/15 text-[#4E7A51] border border-[#4E7A51]/30'
                        : 'bg-[#C48A2E]/15 text-[#C48A2E] border border-[#C48A2E]/30'
                    }`}
                  >
                    {acMasterToggle ? 'Auto' : 'Manual'}
                  </button>
                </div>

                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[#6B5A4A]" />
                  <input
                    type="text"
                    value={searchLookup}
                    onChange={(e) => setSearchLookup(e.target.value)}
                    placeholder="Search hall or capacity..."
                    className="pl-8 pr-3 py-1.5 bg-[#FDF8F2] border border-[#E8DCC8] rounded-lg text-xs text-[#2B1D12] placeholder-[#6B5A4A]/60 focus:outline-none focus:border-[#BC4800] min-w-[210px] font-medium"
                  />
                </div>
              </div>
            </div>

            {/* AUDITORIUM FLEET CARDS */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 pt-1 relative z-10">
              {filteredAudis.map((audi) => {
                const isBooked = audi.status === 'Booked';
                return (
                  <div
                    key={audi.id}
                    onClick={() => setSelectedAudi(audi)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between bg-[#FDF8F2] border-[#E8DCC8] hover:border-[#BC4800] shadow-xs`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#2B1D12] text-sm">{audi.name}</span>
                        <Wind className={`w-3.5 h-3.5 ${audi.acStatus === 'ON' ? 'text-[#BC4800]' : 'text-[#6B5A4A]'}`} />
                      </div>
                      <span className="text-xs text-[#6B5A4A] font-semibold block mt-1">
                        Cap: {audi.capacity}
                      </span>
                      {audi.features && (
                        <p className="text-xs text-[#6B5A4A]/80 line-clamp-1 mt-0.5" title={audi.features}>
                          {audi.features}
                        </p>
                      )}
                    </div>

                    <div className="mt-3">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border block text-center ${
                        isBooked
                          ? 'bg-[#A6402F]/15 text-[#A6402F] border-[#A6402F]/30'
                          : 'bg-[#4E7A51]/15 text-[#4E7A51] border-[#4E7A51]/30'
                      }`}>
                        {audi.status}
                      </span>
                    </div>
                  </div>
                );
              })}

              {/* Add Hall Button triggering Modal */}
              <button
                onClick={() => setShowAddAudiModal(true)}
                className="p-4 rounded-xl border border-dashed border-[#E8DCC8] bg-[#FDF8F2] hover:bg-[#F7EFE4] transition-all flex flex-col items-center justify-center gap-1 text-[#6B5A4A] cursor-pointer"
              >
                <Plus className="w-5 h-5 text-[#BC4800]" />
                <span className="font-semibold text-xs text-[#2B1D12]">Add Hall</span>
              </button>
            </div>
          </div>

          {/* 2. APPROVAL REQUESTS & ACADEMIC CALENDAR */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-10">

            {/* LEFT COLUMN: Approval Requests (for AC) */}
            <div className="lg:col-span-6 p-6 rounded-2xl border border-[#E8DCC8] bg-[#F7EFE4] shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#E8DCC8]">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-[#BC4800]/15 border border-[#BC4800]/30 rounded-lg text-[#BC4800]">
                    <ShieldAlert className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#2B1D12]">
                      Approval Requests (for AC)
                    </h3>
                    <span className="text-xs font-semibold text-[#BC4800]">
                      Pending Request(s)
                    </span>
                  </div>
                </div>
              </div>

              {/* Callout Box */}
              <div className="p-3 bg-[#FDF8F2] border border-[#E8DCC8] rounded-xl text-xs text-[#6B5A4A] leading-relaxed">
                💡 <strong className="text-[#2B1D12]">Auto-Approval Rule:</strong> Requests are automatically approved only if the venue is vacant at that given time window.
              </div>

              {/* Pending Request Items matching User Text */}
              <div className="space-y-3">
                {approvalRequests.map((req) => (
                  <div
                    key={req.id}
                    className="p-4 rounded-xl bg-[#FDF8F2] border border-[#E8DCC8] space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-[#2B1D12]">
                        Requestor: <strong className="text-[#BC4800]">{req.requestor}</strong>
                      </span>
                      <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${
                        req.status === 'Approved' ? 'bg-[#4E7A51]/15 text-[#4E7A51] border-[#4E7A51]/30' :
                        req.status === 'Rejected' ? 'bg-[#A6402F]/15 text-[#A6402F] border-[#A6402F]/30' :
                        'bg-[#C48A2E]/15 text-[#C48A2E] border-[#C48A2E]/30'
                      }`}>
                        {req.status}
                      </span>
                    </div>

                    <p className="text-xs text-[#2B1D12] font-semibold">
                      Request details: <strong>{req.details}</strong>
                    </p>
                    <p className="text-xs text-[#6B5A4A]">
                      Purpose: {req.purpose} ({req.department})
                    </p>

                    {req.status === 'Pending' && (
                      <div className="flex items-center gap-2 pt-2 border-t border-[#E8DCC8]">
                        <span className="text-xs font-semibold text-[#6B5A4A]">Approval options:</span>
                        <div className="flex items-center gap-2 ml-auto">
                          <button
                            onClick={() => handleApproveRequest(req.id, 'Approved')}
                            className="px-3.5 py-1.5 bg-[#4E7A51] hover:bg-[#3D6140] text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Approve</span>
                          </button>
                          <button
                            onClick={() => handleApproveRequest(req.id, 'Rejected')}
                            className="px-3 py-1.5 bg-[#A6402F]/15 hover:bg-[#A6402F]/25 text-[#A6402F] border border-[#A6402F]/30 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1"
                          >
                            <X className="w-3.5 h-3.5" />
                            <span>Reject</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT COLUMN: Academic Calendar */}
            <div className="lg:col-span-6 p-6 rounded-2xl border border-[#E8DCC8] bg-[#F7EFE4] shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#E8DCC8]">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-[#BC4800]/15 border border-[#BC4800]/30 rounded-lg text-[#BC4800]">
                    <CalendarIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#2B1D12]">
                      Academic Calendar
                    </h3>
                    <p className="text-xs text-[#6B5A4A] font-medium">
                      Auditorium timetable conflict detection matrix
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 bg-[#FDF8F2] px-3 py-1.5 rounded-lg border border-[#E8DCC8]">
                  <CalendarIcon className="w-3.5 h-3.5 text-[#BC4800]" />
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="bg-transparent text-[#2B1D12] text-xs font-semibold focus:outline-none"
                  />
                </div>
              </div>

              {/* Slot selector numbers */}
              <div>
                <span className="text-xs font-semibold text-[#6B5A4A] block mb-2">
                  Select Timetable Slot (Slot 1 to 6)
                </span>
                <div className="flex items-center justify-between gap-1.5">
                  {[1, 2, 3, 4, 5, 6].map((slot) => {
                    const isSelected = activeCalendarSlot === slot;
                    return (
                      <button
                        key={slot}
                        onClick={() => setActiveCalendarSlot(slot)}
                        className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all border ${
                          isSelected
                            ? 'bg-[#BC4800] text-white border-[#BC4800] shadow-xs'
                            : 'bg-[#FDF8F2] text-[#2B1D12] border-[#E8DCC8] hover:bg-[#F7EFE4]'
                        }`}
                      >
                        {slot}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Timetable Matrix */}
              <div className="p-4 rounded-xl bg-[#FDF8F2] border border-[#E8DCC8] space-y-3">
                {(() => {
                  const slotScheduleMap = {
                    1: ['audi-4'],
                    2: ['audi-2'],
                    3: ['audi-1'],
                    4: [],
                    5: ['audi-1', 'audi-3'],
                    6: []
                  };
                  const occupiedIds = slotScheduleMap[activeCalendarSlot] || [];
                  const occupiedCount = auditoriums.filter(a => occupiedIds.includes(a.id) || (a.status === 'Booked' && activeCalendarSlot === 3)).length;
                  const availableCount = auditoriums.length - occupiedCount;

                  return (
                    <>
                      <div className="flex items-center justify-between text-xs font-semibold">
                        <span className="text-[#2B1D12] font-bold">
                          Slot #{activeCalendarSlot} Overview:
                        </span>
                        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full border bg-[#F7EFE4] text-[#2B1D12] border-[#E8DCC8]">
                          {occupiedCount > 0 
                            ? `${occupiedCount} Hall${occupiedCount > 1 ? 's' : ''} Occupied (${availableCount} Available)`
                            : `All ${auditoriums.length} Halls Available`}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 text-center text-xs pt-1">
                        {auditoriums.map((audi) => {
                          const isSlotBooked = occupiedIds.includes(audi.id) || (audi.status === 'Booked' && activeCalendarSlot === 3);
                          return (
                            <div
                              key={audi.id}
                              className={`p-2.5 rounded-lg border transition-all ${
                                isSlotBooked
                                  ? 'bg-[#A6402F]/15 text-[#A6402F] border-[#A6402F]/30 font-bold'
                                  : 'bg-[#FDF8F2] border-[#E8DCC8] font-semibold text-[#2B1D12]'
                              }`}
                            >
                              <span className="block font-bold text-xs">{audi.name}</span>
                              <span className={`text-xs mt-0.5 block font-semibold ${
                                isSlotBooked ? 'text-[#A6402F]' : 'text-[#4E7A51]'
                              }`}>
                                {isSlotBooked ? 'Occupied' : 'Available'}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>

          </div>

          {/* 3. HARDWARE & RESOURCE STATUS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">

            {/* CARD 1: AV Hardware */}
            <div className="p-6 rounded-2xl border border-[#E8DCC8] bg-[#F7EFE4] shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#E8DCC8]">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-[#BC4800]/15 border border-[#BC4800]/30 rounded-lg text-[#BC4800]">
                    <Tv className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#2B1D12]">
                      Resource Status (AV Hardware)
                    </h3>
                    <p className="text-xs text-[#6B5A4A] font-medium">
                      Audio-visual equipment diagnostic metrics
                    </p>
                  </div>
                </div>

                <span className="px-2.5 py-1 rounded-full bg-[#4E7A51]/15 text-[#4E7A51] border border-[#4E7A51]/30 text-xs font-semibold">
                  Telemetry Active
                </span>
              </div>

              <div className="space-y-3 text-xs">
                {/* Projectors */}
                <div className="p-3.5 rounded-xl bg-[#FDF8F2] border border-[#E8DCC8] space-y-1.5">
                  <div className="flex justify-between items-center font-bold">
                    <span className="text-[#2B1D12] flex items-center gap-2">
                      <Tv className="w-4 h-4 text-[#BC4800]" />
                      Projectors:
                    </span>
                    <span className="font-bold text-[#4E7A51]">(4/5 Avail.)</span>
                  </div>
                  <div className="w-full bg-[#E8DCC8] h-2 rounded-full overflow-hidden">
                    <div className="bg-[#4E7A51] h-full rounded-full" style={{ width: '80%' }} />
                  </div>
                </div>

                {/* Sound Systems */}
                <div className="flex justify-between items-center p-3.5 rounded-xl bg-[#FDF8F2] border border-[#E8DCC8] font-bold">
                  <span className="text-[#2B1D12] flex items-center gap-2">
                    <Volume2 className="w-4 h-4 text-[#BC4800]" />
                    Sound Systems:
                  </span>
                  <span className="font-semibold text-[#4E7A51] px-2 py-0.5 bg-[#4E7A51]/15 rounded-full border border-[#4E7A51]/30">
                    All Ok
                  </span>
                </div>

                {/* Audio Speakers */}
                <div className="flex justify-between items-center p-3.5 rounded-xl bg-[#FDF8F2] border border-[#E8DCC8] font-bold">
                  <span className="text-[#2B1D12] flex items-center gap-2">
                    <Radio className="w-4 h-4 text-[#BC4800]" />
                    Audio Speakers:
                  </span>
                  <span className="font-semibold text-[#4E7A51] px-2 py-0.5 bg-[#4E7A51]/15 rounded-full border border-[#4E7A51]/30">
                    All Ok
                  </span>
                </div>

                {/* Climate HVAC */}
                <div className="flex justify-between items-center p-3.5 rounded-xl bg-[#FDF8F2] border border-[#E8DCC8] font-bold">
                  <span className="text-[#2B1D12] flex items-center gap-2">
                    <Wind className="w-4 h-4 text-[#BC4800]" />
                    Climate HVAC:
                  </span>
                  <span className="font-semibold text-[#4E7A51] px-2 py-0.5 bg-[#4E7A51]/15 rounded-full border border-[#4E7A51]/30">
                    All Ok
                  </span>
                </div>
              </div>
            </div>

            {/* CARD 2: Facility Telemetry */}
            <div className="p-6 rounded-2xl border border-[#E8DCC8] bg-[#F7EFE4] shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#E8DCC8]">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-[#BC4800]/15 border border-[#BC4800]/30 rounded-lg text-[#BC4800]">
                    <Mic className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#2B1D12]">
                      Facility Hardware Telemetry
                    </h3>
                    <p className="text-xs text-[#6B5A4A] font-medium">
                      Display panels, wireless mics & power backup status
                    </p>
                  </div>
                </div>

                <span className="px-2.5 py-1 rounded-full bg-[#4E7A51]/15 text-[#4E7A51] border border-[#4E7A51]/30 text-xs font-semibold">
                  100% Operational
                </span>
              </div>

              <div className="space-y-3 text-xs">
                {/* 4K Displays */}
                <div className="flex justify-between items-center p-3.5 rounded-xl bg-[#FDF8F2] border border-[#E8DCC8] font-bold">
                  <span className="text-[#2B1D12] flex items-center gap-2">
                    <Tv className="w-4 h-4 text-[#BC4800]" />
                    4K Screens & Displays:
                  </span>
                  <span className="font-semibold text-[#4E7A51] px-2 py-0.5 bg-[#4E7A51]/15 rounded-full border border-[#4E7A51]/30">
                    All Ok
                  </span>
                </div>

                {/* Wireless Microphones */}
                <div className="p-3.5 rounded-xl bg-[#FDF8F2] border border-[#E8DCC8] space-y-1.5">
                  <div className="flex justify-between items-center font-bold">
                    <span className="text-[#2B1D12] flex items-center gap-2">
                      <Mic className="w-4 h-4 text-[#BC4800]" />
                      Wireless Microphones:
                    </span>
                    <span className="font-bold text-[#4E7A51]">(8/10 Avail.)</span>
                  </div>
                  <div className="w-full bg-[#E8DCC8] h-2 rounded-full overflow-hidden">
                    <div className="bg-[#4E7A51] h-full rounded-full" style={{ width: '80%' }} />
                  </div>
                </div>

                {/* Stage Lighting */}
                <div className="flex justify-between items-center p-3.5 rounded-xl bg-[#FDF8F2] border border-[#E8DCC8] font-bold">
                  <span className="text-[#2B1D12] flex items-center gap-2">
                    <Zap className="w-4 h-4 text-[#BC4800]" />
                    Stage Lighting Grid:
                  </span>
                  <span className="font-semibold text-[#4E7A51] px-2 py-0.5 bg-[#4E7A51]/15 rounded-full border border-[#4E7A51]/30">
                    All Ok
                  </span>
                </div>

                {/* UPS Backup */}
                <div className="flex justify-between items-center p-3.5 rounded-xl bg-[#FDF8F2] border border-[#E8DCC8] font-bold">
                  <span className="text-[#2B1D12] flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-[#BC4800]" />
                    UPS Power Backup:
                  </span>
                  <span className="font-semibold text-[#4E7A51] px-2 py-0.5 bg-[#4E7A51]/15 rounded-full border border-[#4E7A51]/30">
                    100% Charged
                  </span>
                </div>
              </div>
            </div>

          </div>

          {/* 4. QUICK QUERY ASSISTANT */}
          <div className="p-6 md:p-7 rounded-2xl border border-[#E8DCC8] bg-[#F7EFE4] shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8DCC8]">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#BC4800]/15 border border-[#BC4800]/30 rounded-lg text-[#BC4800]">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#2B1D12]">
                    Facility Assistant Query
                  </h3>
                  <p className="text-xs text-[#6B5A4A] font-medium">
                    Search operational status, climate controls, or auditorium timetables
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Query Chips */}
            <div className="flex items-center gap-2 flex-wrap text-xs">
              <span className="text-xs font-semibold text-[#6B5A4A]">Common Questions:</span>
              <button
                onClick={() => setAssistantQuery("Which auditoriums have AC turned on right now?")}
                className="px-3 py-1.5 bg-[#FDF8F2] text-[#2B1D12] hover:bg-[#F7EFE4] rounded-full border border-[#E8DCC8] text-xs font-semibold transition-colors cursor-pointer"
              >
                AC Status
              </button>
              <button
                onClick={() => setAssistantQuery("Check projectors available in Audi 1 & Audi 2")}
                className="px-3 py-1.5 bg-[#FDF8F2] text-[#2B1D12] hover:bg-[#F7EFE4] rounded-full border border-[#E8DCC8] text-xs font-semibold transition-colors cursor-pointer"
              >
                Projector Availability
              </button>
              <button
                onClick={() => setAssistantQuery("Summarize pending AC approval requests")}
                className="px-3 py-1.5 bg-[#FDF8F2] text-[#2B1D12] hover:bg-[#F7EFE4] rounded-full border border-[#E8DCC8] text-xs font-semibold transition-colors cursor-pointer"
              >
                Pending Requests
              </button>
            </div>

            {/* Form Input Box */}
            <form onSubmit={handleAssistantQuerySubmit} className="flex items-center gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3.5 top-3 text-[#6B5A4A]" />
                <input
                  type="text"
                  value={assistantQuery}
                  onChange={(e) => setAssistantQuery(e.target.value)}
                  placeholder="Type a query (e.g. 'Show vacant halls for 3:00 PM')..."
                  className="w-full pl-10 pr-4 py-2.5 bg-[#FDF8F2] border border-[#E8DCC8] rounded-lg text-xs text-[#2B1D12] placeholder-[#6B5A4A]/60 focus:outline-none focus:border-[#BC4800] font-medium"
                />
              </div>
              <button
                type="submit"
                disabled={isQuerying || !assistantQuery.trim()}
                className="px-4.5 py-2.5 inst-button-primary rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {isQuerying ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Send className="w-3.5 h-3.5" />
                )}
                <span>Search</span>
              </button>
            </form>

            {/* Response Output Box */}
            {assistantResponse && (
              <div className="p-4 rounded-xl bg-[#FDF8F2] border border-[#E8DCC8] text-xs text-[#2B1D12] space-y-1">
                <div className="flex items-center gap-2 font-bold text-[#BC4800]">
                  <FileText className="w-4 h-4" />
                  <span>Query Result:</span>
                </div>
                <p className="leading-relaxed text-xs pt-0.5">{assistantResponse}</p>
              </div>
            )}
          </div>

          {/* 5. EVENT ADMIN TICKETS & SUPPORT LOG */}
          <TicketsSupportLogCard 
            adminDomain="events" 
            title="Event Admin Tickets & Support Log" 
            subtitle="Track AV equipment, stage lighting, climate control & auditorium support tickets" 
          />

        </div>
      )}

      {/* ================= ADD NEW AUDITORIUM MODAL DIALOG ================= */}
      {showAddAudiModal && (
        <div className="fixed inset-0 bg-[#2B1D12]/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in font-sans">
          <div className="bg-[#F7EFE4] border border-[#E8DCC8] w-full max-w-md rounded-2xl p-6 shadow-2xl space-y-5 relative">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8DCC8]">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-[#BC4800]/15 border border-[#BC4800]/30 rounded-lg text-[#BC4800]">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#2B1D12]">
                    Add New Auditorium
                  </h3>
                  <p className="text-xs text-[#6B5A4A] font-medium">
                    Register a new hall with capacity & feature specs
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAddAudiModal(false)}
                className="p-1.5 rounded-lg hover:bg-[#FDF8F2] text-[#6B5A4A] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddAudiSubmit} className="space-y-4 text-xs">
              {/* Hall Name */}
              <div className="space-y-1.5">
                <label className="block font-semibold text-[#2B1D12]">
                  Auditorium Name <span className="text-[#BC4800]">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Audi 6, Seminar Hall C"
                  value={newAudiForm.name}
                  onChange={(e) => setNewAudiForm({ ...newAudiForm, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#FDF8F2] border border-[#E8DCC8] rounded-lg text-xs text-[#2B1D12] placeholder-[#6B5A4A]/60 font-semibold focus:outline-none focus:border-[#BC4800]"
                />
              </div>

              {/* Seating Capacity */}
              <div className="space-y-1.5">
                <label className="block font-semibold text-[#2B1D12]">
                  Seating Capacity <span className="text-[#BC4800]">*</span>
                </label>
                <input
                  type="number"
                  required
                  min="10"
                  max="5000"
                  placeholder="e.g. 350"
                  value={newAudiForm.capacity}
                  onChange={(e) => setNewAudiForm({ ...newAudiForm, capacity: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#FDF8F2] border border-[#E8DCC8] rounded-lg text-xs text-[#2B1D12] placeholder-[#6B5A4A]/60 font-semibold focus:outline-none focus:border-[#BC4800]"
                />
              </div>

              {/* Hall Features */}
              <div className="space-y-1.5">
                <label className="block font-semibold text-[#2B1D12]">
                  Equipment & Feature Specifications
                </label>
                <textarea
                  rows="3"
                  placeholder="e.g. 4K Dual Projectors, Dolby Surround Audio, Stage Lighting Grid, Central HVAC"
                  value={newAudiForm.features}
                  onChange={(e) => setNewAudiForm({ ...newAudiForm, features: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#FDF8F2] border border-[#E8DCC8] rounded-lg text-xs text-[#2B1D12] placeholder-[#6B5A4A]/60 font-medium focus:outline-none focus:border-[#BC4800]"
                />
              </div>

              {/* Initial Climate AC Status */}
              <div className="space-y-1.5">
                <label className="block font-semibold text-[#2B1D12]">
                  Initial AC Climate Mode
                </label>
                <select
                  value={newAudiForm.acStatus}
                  onChange={(e) => setNewAudiForm({ ...newAudiForm, acStatus: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#FDF8F2] border border-[#E8DCC8] rounded-lg text-xs text-[#2B1D12] font-semibold focus:outline-none focus:border-[#BC4800]"
                >
                  <option value="STANDBY">Eco Standby</option>
                  <option value="ON">Climate ON (22°C)</option>
                  <option value="OFF">Power OFF</option>
                </select>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-[#E8DCC8]">
                <button
                  type="button"
                  onClick={() => setShowAddAudiModal(false)}
                  className="px-4 py-2 bg-[#FDF8F2] hover:bg-[#F7EFE4] text-[#2B1D12] border border-[#E8DCC8] rounded-lg font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 inst-button-primary rounded-lg font-semibold cursor-pointer shadow-xs"
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
