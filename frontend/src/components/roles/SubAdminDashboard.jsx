import React, { useState, useEffect } from 'react';
import ChatWidget from '../ChatWidget';
import { 
  Building2, Check, X, Calendar as CalendarIcon, Clock, 
  Search, Plus, Tv, Wind, Mic, Volume2, ShieldAlert, Wrench, 
  Bus, Radio, CheckCircle2, RefreshCw, Zap, Users, Sliders, ArrowRight,
  Send, Activity, Cpu, Gauge, HelpCircle, FileText
} from 'lucide-react';

export default function SubAdminDashboard({ currentUser }) {
  // Determine primary domain or default to events/audi manager
  const rawDomain = currentUser?.department_domain || 'events';
  const domain = rawDomain === 'all' || rawDomain === 'events' ? 'events' : rawDomain;

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
    <div className="space-y-8 md:space-y-10 font-sans">
      
      {/* Toast Alert Banner */}
      {toastMsg && (
        <div className="fixed top-20 right-6 bg-slate-900 text-white font-semibold text-xs px-4 py-3 rounded-xl shadow-xl z-50 flex items-center gap-2 border border-slate-700 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* ================= CLEAN HUMAN-DESIGNED HEADER BANNER ================= */}
      <div className="w-full p-6 md:p-8 rounded-3xl border dark:border-slate-800 border-slate-200 dark:bg-slate-900 bg-white shadow-md relative overflow-hidden">
        {/* Subtle Auditorium Watermark */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-10 dark:opacity-15 pointer-events-none rounded-3xl"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1200&q=80')` }}
        />

        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-5 z-10">
          <div className="space-y-2 max-w-3xl">
            {/* Clean Department Pills */}
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="px-3 py-1 text-xs font-semibold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 rounded-lg flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>Auditorium & Venue Management</span>
              </span>
              <span className="text-xs font-mono font-medium px-2.5 py-1 bg-slate-100 dark:bg-slate-950 text-slate-600 dark:text-slate-400 rounded-lg border border-slate-200 dark:border-slate-800">
                Domain: EVENTS
              </span>
            </div>

            {/* Practical Greeting Header */}
            <div className="pt-1">
              <h1 className="text-2xl md:text-3xl font-black dark:text-white text-black tracking-tight">
                Good morning, {currentUser?.full_name || 'Marcus Brody'}
              </h1>
              <p className="text-xs md:text-sm dark:text-slate-400 text-black mt-1 font-semibold">
                Real-time auditorium occupancy, climate control approvals, and hardware telemetry dashboard.
              </p>
            </div>
          </div>

          {/* Clean Action Button */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={fetchSubAdminData}
              disabled={isLoading}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors cursor-pointer flex items-center gap-2 text-xs shadow-sm"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Refresh Status</span>
            </button>
          </div>
        </div>
      </div>

      {/* ================= MAIN CONTENT ================= */}
      {(domain === 'events' || domain === 'all') && (
        <div className="space-y-8 md:space-y-10">

          {/* 1. AUDITORIUM OVERVIEW SECTION */}
          <div className="p-6 md:p-7 rounded-3xl border dark:border-slate-800 border-slate-200 dark:bg-slate-900 bg-white shadow-sm space-y-5 relative overflow-hidden">
            {/* Background Overlay */}
            <div 
              className="absolute inset-0 bg-cover bg-center opacity-10 dark:opacity-15 pointer-events-none rounded-3xl"
              style={{ backgroundImage: `url('https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80')` }}
            />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b dark:border-slate-800 border-slate-200 relative z-10">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 dark:bg-slate-800 border border-blue-200 dark:border-slate-700 rounded-xl text-blue-600 dark:text-blue-400">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base md:text-lg font-black dark:text-white text-black">
                    Auditorium Overview
                  </h2>
                  <p className="text-xs dark:text-slate-400 text-black font-medium">
                    Facility occupancy & automated climate control settings
                  </p>
                </div>
              </div>

              {/* Master AC Control & Lookup Search */}
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800">
                  <Wind className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                  <span className="text-xs font-bold dark:text-slate-300 text-black">Master Climate AC:</span>
                  <button
                    onClick={() => {
                      setAcMasterToggle(!acMasterToggle);
                      showToast(`Master Climate AC set to ${!acMasterToggle ? 'Automatic' : 'Manual Override'}`);
                    }}
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase transition-all ${
                      acMasterToggle
                        ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                        : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800'
                    }`}
                  >
                    {acMasterToggle ? 'Auto' : 'Manual'}
                  </button>
                </div>

                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    value={searchLookup}
                    onChange={(e) => setSearchLookup(e.target.value)}
                    placeholder="Search hall or capacity..."
                    className="pl-8 pr-3 py-1.5 dark:bg-slate-950 bg-slate-50 border dark:border-slate-800 border-slate-300 rounded-xl text-xs dark:text-white text-slate-900 focus:outline-none focus:border-blue-500 min-w-[210px] font-medium"
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
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                      isBooked
                        ? 'dark:bg-slate-950 bg-rose-50/70 dark:border-rose-900 border-rose-200'
                        : 'dark:bg-slate-950 bg-slate-50 dark:border-slate-800 border-slate-200 hover:border-blue-400'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold dark:text-white text-black text-sm">{audi.name}</span>
                        <Wind className={`w-3.5 h-3.5 ${audi.acStatus === 'ON' ? 'text-cyan-500' : 'text-slate-400'}`} />
                      </div>
                      <span className="text-[11px] font-mono font-bold dark:text-slate-400 text-black block mt-1">
                        Cap: {audi.capacity}
                      </span>
                      {audi.features && (
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5" title={audi.features}>
                          {audi.features}
                        </p>
                      )}
                    </div>

                    <div className="mt-3">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border block text-center uppercase tracking-wider ${
                        isBooked
                          ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800'
                          : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
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
                className="p-4 rounded-2xl border border-dashed dark:border-slate-700 border-slate-300 dark:bg-slate-950 bg-slate-50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all flex flex-col items-center justify-center gap-1 text-slate-600 dark:text-slate-300 cursor-pointer"
              >
                <Plus className="w-5 h-5 text-blue-600" />
                <span className="font-semibold text-xs">Add Hall</span>
              </button>
            </div>
          </div>

          {/* 2. APPROVAL REQUESTS & ACADEMIC CALENDAR */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-10">

            {/* LEFT COLUMN: Approval Requests (for AC) */}
            <div className="lg:col-span-6 p-6 rounded-3xl border dark:border-slate-800 border-slate-200 dark:bg-slate-900 bg-white shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b dark:border-slate-800 border-slate-200">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-indigo-50 dark:bg-slate-800 border border-indigo-200 dark:border-slate-700 rounded-xl text-indigo-600 dark:text-indigo-400">
                    <ShieldAlert className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black dark:text-white text-black">
                      Approval Requests (for AC)
                    </h3>
                    <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400">
                      Pending Request(s)
                    </span>
                  </div>
                </div>
              </div>

              {/* Callout Box */}
              <div className="p-3 bg-blue-50/70 dark:bg-slate-950 border border-blue-200 dark:border-slate-800 rounded-2xl text-xs dark:text-slate-300 text-black leading-relaxed font-semibold">
                💡 <strong>Auto-Approval Rule:</strong> Requests are automatically approved only if the venue is vacant at that given time window.
              </div>

              {/* Pending Request Items matching User Text */}
              <div className="space-y-3">
                {approvalRequests.map((req) => (
                  <div
                    key={req.id}
                    className="p-4 rounded-2xl dark:bg-slate-950 bg-slate-50 border dark:border-slate-800 border-slate-200 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-black text-xs dark:text-white text-black">
                        Requestor: <strong className="text-blue-600 dark:text-blue-400">{req.requestor}</strong>
                      </span>
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md border ${
                        req.status === 'Approved' ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800' :
                        req.status === 'Rejected' ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800' :
                        'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                      }`}>
                        {req.status}
                      </span>
                    </div>

                    <p className="text-xs dark:text-slate-300 text-black font-semibold">
                      Request details: <strong className="font-mono">{req.details}</strong>
                    </p>
                    <p className="text-[11px] dark:text-slate-400 text-black font-medium">
                      Purpose: {req.purpose} ({req.department})
                    </p>

                    {req.status === 'Pending' && (
                      <div className="flex items-center gap-2 pt-2 border-t dark:border-slate-800/80 border-slate-200">
                        <span className="text-[11px] font-semibold dark:text-slate-400 text-slate-600">Approval options:</span>
                        <div className="flex items-center gap-2 ml-auto">
                          <button
                            onClick={() => handleApproveRequest(req.id, 'Approved')}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Approve</span>
                          </button>
                          <button
                            onClick={() => handleApproveRequest(req.id, 'Rejected')}
                            className="px-3 py-1.5 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1"
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
            <div className="lg:col-span-6 p-6 rounded-3xl border dark:border-slate-800 border-slate-200 dark:bg-slate-900 bg-white shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b dark:border-slate-800 border-slate-200">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-purple-50 dark:bg-slate-800 border border-purple-200 dark:border-slate-700 rounded-xl text-purple-600 dark:text-purple-400">
                    <CalendarIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black dark:text-white text-black">
                      Academic Calendar
                    </h3>
                    <p className="text-[11px] dark:text-slate-400 text-black font-medium">
                      Auditorium timetable conflict detection matrix
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800">
                  <CalendarIcon className="w-3.5 h-3.5 text-blue-600" />
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="bg-transparent dark:text-white text-slate-900 text-xs font-semibold focus:outline-none"
                  />
                </div>
              </div>

              {/* Slot selector numbers */}
              <div>
                <span className="text-[11px] font-semibold dark:text-slate-400 text-slate-600 uppercase tracking-wider block mb-2">
                  Select Timetable Slot (Slot 1 to 6)
                </span>
                <div className="flex items-center justify-between gap-1.5">
                  {[1, 2, 3, 4, 5, 6].map((slot) => {
                    const isSelected = activeCalendarSlot === slot;
                    return (
                      <button
                        key={slot}
                        onClick={() => setActiveCalendarSlot(slot)}
                        className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all border ${
                          isSelected
                            ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                            : 'dark:bg-slate-950 bg-slate-50 dark:text-slate-300 text-slate-700 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        {slot}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Timetable Matrix */}
              <div className="p-4 rounded-2xl dark:bg-slate-950 bg-slate-50 border dark:border-slate-800 border-slate-200 space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold dark:text-slate-300 text-slate-700">
                  <span>Slot #{activeCalendarSlot} Status</span>
                  <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-mono font-medium">
                    {activeCalendarSlot === 3 ? 'Audi 1 Occupied' : 'All Halls Available'}
                  </span>
                </div>

                <div className="grid grid-cols-5 gap-2 text-center text-[11px] pt-1">
                  {auditoriums.map((audi) => {
                    const isSlotBooked = (activeCalendarSlot === 3 && audi.id === 'audi-1') || (activeCalendarSlot === 1 && audi.id === 'audi-4');
                    return (
                      <div
                        key={audi.id}
                        className={`p-2 rounded-xl border ${
                          isSlotBooked
                            ? 'bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 border-blue-300 dark:border-blue-800 font-bold'
                            : 'dark:bg-slate-900 bg-white text-slate-600 border-slate-200 dark:border-slate-800'
                        }`}
                      >
                        <span className="block font-semibold">{audi.name}</span>
                        <span className="text-[10px] mt-0.5 block">{isSlotBooked ? 'Occupied' : 'Vacant'}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

          </div>

          {/* 3. HARDWARE & RESOURCE STATUS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">

            {/* CARD 1: AV Hardware */}
            <div className="p-6 rounded-3xl border dark:border-slate-800 border-slate-200 dark:bg-slate-900 bg-white shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b dark:border-slate-800 border-slate-200">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-blue-50 dark:bg-slate-800 border border-blue-200 dark:border-slate-700 rounded-xl text-blue-600 dark:text-blue-400">
                    <Tv className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black dark:text-white text-black">
                      Resource Status (AV Hardware)
                    </h3>
                    <p className="text-xs dark:text-slate-400 text-black font-medium">
                      Audio-visual equipment diagnostic metrics
                    </p>
                  </div>
                </div>

                <span className="px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-[10px] font-mono font-bold">
                  Telemetry Active
                </span>
              </div>

              <div className="space-y-3 text-xs">
                {/* Projectors */}
                <div className="p-3.5 rounded-2xl dark:bg-slate-950 bg-slate-50 border dark:border-slate-800 border-slate-200 space-y-1.5">
                  <div className="flex justify-between items-center font-bold">
                    <span className="dark:text-slate-300 text-black flex items-center gap-2">
                      <Tv className="w-4 h-4 text-blue-500" />
                      Projectors:
                    </span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono">(4/5 Avail.)</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: '80%' }} />
                  </div>
                </div>

                {/* Sound Systems */}
                <div className="flex justify-between items-center p-3.5 rounded-2xl dark:bg-slate-950 bg-slate-50 border dark:border-slate-800 border-slate-200 font-bold">
                  <span className="dark:text-slate-300 text-black flex items-center gap-2">
                    <Volume2 className="w-4 h-4 text-indigo-500" />
                    Sound Systems:
                  </span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950 rounded-md border border-emerald-200 dark:border-emerald-800">
                    (All Ok)
                  </span>
                </div>

                {/* Audio Speakers */}
                <div className="flex justify-between items-center p-3.5 rounded-2xl dark:bg-slate-950 bg-slate-50 border dark:border-slate-800 border-slate-200 font-bold">
                  <span className="dark:text-slate-300 text-black flex items-center gap-2">
                    <Radio className="w-4 h-4 text-purple-500" />
                    Audio Speakers:
                  </span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950 rounded-md border border-emerald-200 dark:border-emerald-800">
                    (All Ok)
                  </span>
                </div>

                {/* Climate HVAC */}
                <div className="flex justify-between items-center p-3.5 rounded-2xl dark:bg-slate-950 bg-slate-50 border dark:border-slate-800 border-slate-200 font-bold">
                  <span className="dark:text-slate-300 text-black flex items-center gap-2">
                    <Wind className="w-4 h-4 text-cyan-500" />
                    Climate HVAC:
                  </span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950 rounded-md border border-emerald-200 dark:border-emerald-800">
                    (All Ok)
                  </span>
                </div>
              </div>
            </div>

            {/* CARD 2: Facility Telemetry */}
            <div className="p-6 rounded-3xl border dark:border-slate-800 border-slate-200 dark:bg-slate-900 bg-white shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b dark:border-slate-800 border-slate-200">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-purple-50 dark:bg-slate-800 border border-purple-200 dark:border-slate-700 rounded-xl text-purple-600 dark:text-purple-400">
                    <Mic className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black dark:text-white text-black">
                      Facility Hardware Telemetry
                    </h3>
                    <p className="text-xs dark:text-slate-400 text-black font-medium">
                      Display panels, wireless mics & power backup status
                    </p>
                  </div>
                </div>

                <span className="px-2.5 py-1 rounded-full bg-cyan-100 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800 text-[10px] font-mono font-bold">
                  100% Operational
                </span>
              </div>

              <div className="space-y-3 text-xs">
                {/* 4K Displays */}
                <div className="flex justify-between items-center p-3.5 rounded-2xl dark:bg-slate-950 bg-slate-50 border dark:border-slate-800 border-slate-200 font-bold">
                  <span className="dark:text-slate-300 text-black flex items-center gap-2">
                    <Tv className="w-4 h-4 text-blue-500" />
                    4K Screens & Displays:
                  </span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950 rounded-md border border-emerald-200 dark:border-emerald-800">
                    (All Ok)
                  </span>
                </div>

                {/* Wireless Microphones */}
                <div className="p-3.5 rounded-2xl dark:bg-slate-950 bg-slate-50 border dark:border-slate-800 border-slate-200 space-y-1.5">
                  <div className="flex justify-between items-center font-bold">
                    <span className="dark:text-slate-300 text-black flex items-center gap-2">
                      <Mic className="w-4 h-4 text-purple-500" />
                      Wireless Microphones:
                    </span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono">(8/10 Avail.)</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-purple-500 h-full rounded-full" style={{ width: '80%' }} />
                  </div>
                </div>

                {/* Stage Lighting */}
                <div className="flex justify-between items-center p-3.5 rounded-2xl dark:bg-slate-950 bg-slate-50 border dark:border-slate-800 border-slate-200 font-bold">
                  <span className="dark:text-slate-300 text-black flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-500" />
                    Stage Lighting Grid:
                  </span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950 rounded-md border border-emerald-200 dark:border-emerald-800">
                    (All Ok)
                  </span>
                </div>

                {/* UPS Backup */}
                <div className="flex justify-between items-center p-3.5 rounded-2xl dark:bg-slate-950 bg-slate-50 border dark:border-slate-800 border-slate-200 font-bold">
                  <span className="dark:text-slate-300 text-black flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-emerald-500" />
                    UPS Power Backup:
                  </span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950 rounded-md border border-emerald-200 dark:border-emerald-800">
                    (100% Charged)
                  </span>
                </div>
              </div>
            </div>

          </div>

          {/* 4. PRACTICAL QUICK QUERY ASSISTANT (CLEAN HUMAN UI) */}
          <div className="p-6 md:p-7 rounded-3xl border dark:border-slate-800 border-slate-200 dark:bg-slate-900 bg-white shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b dark:border-slate-800 border-slate-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 dark:bg-slate-800 border border-blue-200 dark:border-slate-700 rounded-xl text-blue-600 dark:text-blue-400">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black dark:text-white text-black">
                    Facility Assistant Query
                  </h3>
                  <p className="text-xs dark:text-slate-400 text-black font-medium">
                    Search operational status, climate controls, or auditorium timetables
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Query Chips */}
            <div className="flex items-center gap-2 flex-wrap text-xs">
              <span className="text-[11px] font-medium dark:text-slate-400 text-slate-500 uppercase tracking-wider">Common Questions:</span>
              <button
                onClick={() => setAssistantQuery("Which auditoriums have AC turned on right now?")}
                className="px-3 py-1.5 dark:bg-slate-950 bg-slate-100 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg border dark:border-slate-800 border-slate-200 text-xs font-medium transition-colors cursor-pointer"
              >
                AC Status
              </button>
              <button
                onClick={() => setAssistantQuery("Check projectors available in Audi 1 & Audi 2")}
                className="px-3 py-1.5 dark:bg-slate-950 bg-slate-100 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg border dark:border-slate-800 border-slate-200 text-xs font-medium transition-colors cursor-pointer"
              >
                Projector Availability
              </button>
              <button
                onClick={() => setAssistantQuery("Summarize pending AC approval requests")}
                className="px-3 py-1.5 dark:bg-slate-950 bg-slate-100 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg border dark:border-slate-800 border-slate-200 text-xs font-medium transition-colors cursor-pointer"
              >
                Pending Requests
              </button>
            </div>

            {/* Form Input Box */}
            <form onSubmit={handleAssistantQuerySubmit} className="flex items-center gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                <input
                  type="text"
                  value={assistantQuery}
                  onChange={(e) => setAssistantQuery(e.target.value)}
                  placeholder="Type a query (e.g. 'Show vacant halls for 3:00 PM')..."
                  className="w-full pl-10 pr-4 py-2.5 dark:bg-slate-950 bg-slate-50 border dark:border-slate-800 border-slate-300 rounded-xl text-xs dark:text-white text-slate-900 focus:outline-none focus:border-blue-500 font-medium"
                />
              </div>
              <button
                type="submit"
                disabled={isQuerying || !assistantQuery.trim()}
                className="px-4.5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
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
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs dark:text-slate-200 text-slate-800 space-y-1">
                <div className="flex items-center gap-2 font-bold text-blue-600 dark:text-blue-400">
                  <FileText className="w-4 h-4" />
                  <span>QueryResult:</span>
                </div>
                <p className="leading-relaxed text-xs pt-0.5">{assistantResponse}</p>
              </div>
            )}
          </div>

        </div>
      )}

      {/* ================= ADD NEW AUDITORIUM MODAL DIALOG ================= */}
      {showAddAudiModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border dark:border-slate-800 border-slate-200 w-full max-w-md rounded-3xl p-6 shadow-2xl space-y-5 relative">
            <div className="flex items-center justify-between pb-3 border-b dark:border-slate-800 border-slate-200">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-blue-50 dark:bg-slate-800 border border-blue-200 dark:border-slate-700 rounded-xl text-blue-600 dark:text-blue-400">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black dark:text-white text-black">
                    Add New Auditorium
                  </h3>
                  <p className="text-xs dark:text-slate-400 text-black font-medium">
                    Register a new hall with capacity & feature specs
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAddAudiModal(false)}
                className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddAudiSubmit} className="space-y-4 text-xs">
              {/* Hall Name */}
              <div className="space-y-1.5">
                <label className="block font-bold dark:text-slate-300 text-black">
                  Auditorium Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Audi 6, Seminar Hall C"
                  value={newAudiForm.name}
                  onChange={(e) => setNewAudiForm({ ...newAudiForm, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 dark:bg-slate-950 bg-slate-50 border dark:border-slate-800 border-slate-300 rounded-xl text-xs dark:text-white text-black font-semibold focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Seating Capacity */}
              <div className="space-y-1.5">
                <label className="block font-bold dark:text-slate-300 text-black">
                  Seating Capacity <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  min="10"
                  max="5000"
                  placeholder="e.g. 350"
                  value={newAudiForm.capacity}
                  onChange={(e) => setNewAudiForm({ ...newAudiForm, capacity: e.target.value })}
                  className="w-full px-3.5 py-2.5 dark:bg-slate-950 bg-slate-50 border dark:border-slate-800 border-slate-300 rounded-xl text-xs dark:text-white text-black font-semibold focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Hall Features */}
              <div className="space-y-1.5">
                <label className="block font-bold dark:text-slate-300 text-black">
                  Equipment & Feature Specifications
                </label>
                <textarea
                  rows="3"
                  placeholder="e.g. 4K Dual Projectors, Dolby Surround Audio, Stage Lighting Grid, Central HVAC"
                  value={newAudiForm.features}
                  onChange={(e) => setNewAudiForm({ ...newAudiForm, features: e.target.value })}
                  className="w-full px-3.5 py-2.5 dark:bg-slate-950 bg-slate-50 border dark:border-slate-800 border-slate-300 rounded-xl text-xs dark:text-white text-black font-medium focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Initial Climate AC Status */}
              <div className="space-y-1.5">
                <label className="block font-bold dark:text-slate-300 text-black">
                  Initial AC Climate Mode
                </label>
                <select
                  value={newAudiForm.acStatus}
                  onChange={(e) => setNewAudiForm({ ...newAudiForm, acStatus: e.target.value })}
                  className="w-full px-3.5 py-2.5 dark:bg-slate-950 bg-slate-50 border dark:border-slate-800 border-slate-300 rounded-xl text-xs dark:text-white text-black font-semibold focus:outline-none focus:border-blue-500"
                >
                  <option value="STANDBY">Eco Standby</option>
                  <option value="ON">Climate ON (22°C)</option>
                  <option value="OFF">Power OFF</option>
                </select>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-2 border-t dark:border-slate-800 border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowAddAudiModal(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-colors cursor-pointer shadow-md"
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
