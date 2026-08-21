import React, { useState, useEffect } from 'react';
import ChatWidget from '../ChatWidget';
import { 
  Building2, Sparkles, Check, X, Calendar as CalendarIcon, Clock, 
  Search, Plus, Tv, Wind, Mic, Volume2, ShieldAlert, Wrench, 
  Bus, Radio, CheckCircle2, RefreshCw, Zap, Users, Sliders, ArrowRight,
  Bot, Send, Activity, Cpu, Gauge
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

  // Natural Language AI Query Engine States
  const [aiQuery, setAiQuery] = useState('');
  const [aiResponse, setAiResponse] = useState(null);
  const [isAiQuerying, setIsAiQuerying] = useState(false);

  // Auditorium Fleet Initial Data matching Wireframe
  const [auditoriums, setAuditoriums] = useState([
    { id: 'audi-1', name: 'Audi 1', capacity: 500, status: 'Booked', acStatus: 'ON', currentEvent: 'CS-402 Cloud Computing' },
    { id: 'audi-2', name: 'Audi 2', capacity: 400, status: 'Available', acStatus: 'STANDBY', currentEvent: 'Vacant' },
    { id: 'audi-3', name: 'Audi 3', capacity: 100, status: 'Available', acStatus: 'STANDBY', currentEvent: 'Vacant' },
    { id: 'audi-4', name: 'Audi 4', capacity: 50, status: 'Available', acStatus: 'STANDBY', currentEvent: 'Vacant' },
    { id: 'audi-5', name: 'Audi 5', capacity: 100, status: 'Available', acStatus: 'STANDBY', currentEvent: 'Vacant' },
  ]);

  // AC / Venue Approval Requests matching Wireframe
  const [approvalRequests, setApprovalRequests] = useState([
    {
      id: 'req-1',
      requestor: 'Prof. Chakraborty',
      department: 'Computer Science & Eng',
      details: 'Audi 1 (2pm - 3pm)',
      purpose: 'Guest Lecture on Quantum AI',
      status: 'Pending'
    },
    {
      id: 'req-2',
      requestor: 'Dr. Prashad',
      department: 'Auditorium Management',
      details: 'Audi 2 (10am - 12pm)',
      purpose: 'Annual Research Symposium',
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
    showToast(`Request ${action === 'Approved' ? 'APPROVED ✓' : 'REJECTED ✕'} successfully!`);
  };

  const handleAiQuerySubmit = (e) => {
    e?.preventDefault();
    if (!aiQuery.trim()) return;

    setIsAiQuerying(true);
    setAiResponse(null);

    setTimeout(() => {
      const q = aiQuery.toLowerCase();
      let reply = "";
      if (q.includes('ac') || q.includes('climate')) {
        reply = "⚡ AC Climate Status: Audi 1 is currently active (ON - 22°C). Audi 2 to 5 are in eco STANDBY mode. Master AC Book is set to AUTO.";
      } else if (q.includes('projector') || q.includes('hardware') || q.includes('av')) {
        reply = "📽️ Hardware Telemetry: 4 of 5 projectors are online and operational. Audi 3 projector bulb life is at 88%. 8/10 wireless mics are charged.";
      } else if (q.includes('request') || q.includes('approval') || q.includes('pending')) {
        reply = "📋 Approval Telemetry: 2 pending requests found. Prof. Chakraborty requested Audi 1 (2pm-3pm). Auto-approval check: Audi 1 is booked by CS-402.";
      } else {
        reply = `🔍 Campus Intelligence Query: "${aiQuery}" analyzed. All 5 auditoriums (Audi 1-5) are monitored with zero critical hardware alerts.`;
      }
      setAiResponse(reply);
      setIsAiQuerying(false);
    }, 800);
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
        <div className="fixed top-20 right-6 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white font-bold text-xs px-4.5 py-3.5 rounded-2xl shadow-2xl z-50 flex items-center gap-2.5 animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 className="w-5 h-5 text-emerald-200" />
          <span className="tracking-tight">{toastMsg}</span>
        </div>
      )}

      {/* ================= STUNNING AUDI MANAGER HEADER BANNER ================= */}
      <div className="w-full glass-panel p-6.5 rounded-3xl border dark:border-slate-800/90 border-slate-200 dark:bg-gradient-to-r dark:from-slate-900/95 dark:via-slate-900/90 dark:to-slate-950/95 bg-white shadow-xl relative overflow-hidden group">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl pointer-events-none group-hover:scale-110 transition-transform duration-700" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-500/15 rounded-full blur-3xl pointer-events-none group-hover:scale-110 transition-transform duration-700" />

        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4 z-10">
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="px-3 py-1 text-[10px] font-black uppercase tracking-widest bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30 rounded-full flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5" />
                <span>Audi Manager Interface // Class Manager</span>
              </span>
              <span className="text-xs text-slate-400 font-mono">Domain: {domain.toUpperCase()}</span>
            </div>

            <h1 className="text-2xl md:text-3xl font-black tracking-tight dark:text-white text-slate-900 mt-2 flex items-center gap-2">
              <span>Good morning,</span>
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                {currentUser?.full_name || 'Dr. Prashad'}
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full font-bold dark:bg-slate-800 bg-slate-100 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                Auditorium Manager
              </span>
            </h1>
            <p className="text-xs md:text-sm dark:text-slate-400 text-slate-600 mt-1">
              Real-time facility occupancy, automated AC climate approvals & hardware telemetry dashboard.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchSubAdminData}
              disabled={isLoading}
              className="px-4 py-2.5 dark:bg-slate-900 bg-slate-100 dark:hover:bg-slate-800 hover:bg-slate-200 dark:text-white text-slate-800 rounded-xl text-xs font-bold border dark:border-slate-800 border-slate-300 transition-all flex items-center space-x-2 cursor-pointer shadow-sm"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Refresh Telemetry</span>
            </button>
          </div>
        </div>
      </div>

      {/* ================= DOMAIN VIEW: AUDITORIUM & EVENT ADMIN ================= */}
      {(domain === 'events' || domain === 'all') && (
        <div className="space-y-6">

          {/* 1. AUDITORIUM OVERVIEW SECTION */}
          <div className="glass-panel p-6 rounded-3xl border dark:border-slate-800 border-slate-200 dark:bg-slate-900/90 bg-white shadow-lg space-y-4 relative overflow-hidden">
            {/* Nice Auditorium Background Overlay (40% Visibility) */}
            <div 
              className="absolute inset-0 bg-cover bg-center opacity-40 dark:opacity-40 mix-blend-multiply dark:mix-blend-overlay pointer-events-none rounded-3xl transition-opacity duration-500"
              style={{ backgroundImage: `url('https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80')` }}
            />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b dark:border-slate-800 border-slate-200 relative z-10">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-blue-500/10 border border-blue-500/30 rounded-2xl text-blue-500">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base md:text-lg font-bold dark:text-white text-slate-900">
                    Auditorium Overview
                  </h2>
                  <p className="text-xs dark:text-slate-400 text-slate-600">
                    Live capacity status & Climate AC Book controls
                  </p>
                </div>
              </div>

              {/* Master AC Book Toggle & Facility Lookup Search */}
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800">
                  <Wind className="w-4 h-4 text-cyan-500 animate-pulse" />
                  <span className="text-xs font-bold dark:text-slate-300 text-slate-700">AC Book Master:</span>
                  <button
                    onClick={() => {
                      setAcMasterToggle(!acMasterToggle);
                      showToast(`Master Climate AC set to ${!acMasterToggle ? 'AUTOMATIC' : 'MANUAL OVERRIDE'}`);
                    }}
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase transition-all ${
                      acMasterToggle
                        ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/40'
                        : 'bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/40'
                    }`}
                  >
                    {acMasterToggle ? 'AUTO ON' : 'MANUAL'}
                  </button>
                </div>

                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    value={searchLookup}
                    onChange={(e) => setSearchLookup(e.target.value)}
                    placeholder="Facility Lookup (Name/department)..."
                    className="pl-8 pr-3 py-1.5 dark:bg-slate-950 bg-slate-50 border dark:border-slate-800 border-slate-300 rounded-xl text-xs dark:text-white text-slate-900 focus:outline-none focus:border-blue-500 min-w-[210px] shadow-inner font-medium"
                  />
                </div>
              </div>
            </div>

            {/* AUDITORIUM CARDS ROW (Audi 1 to Audi 5 + Add More) */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3.5 pt-1 relative z-10">
              {filteredAudis.map((audi) => {
                const isBooked = audi.status === 'Booked';
                return (
                  <div
                    key={audi.id}
                    onClick={() => setSelectedAudi(audi)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between hover-classic-lift ${
                      isBooked
                        ? 'dark:bg-slate-950 bg-rose-50/60 dark:border-rose-500/40 border-rose-200'
                        : 'dark:bg-slate-950 bg-slate-50 dark:border-slate-800 border-slate-200 hover:border-blue-400'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold dark:text-white text-slate-900 text-sm">{audi.name}</span>
                        <Wind className={`w-3.5 h-3.5 ${audi.acStatus === 'ON' ? 'text-cyan-500 animate-spin-slow' : 'text-slate-400'}`} />
                      </div>
                      <span className="text-[11px] font-mono dark:text-slate-400 text-slate-600 block mt-0.5">
                        {audi.capacity} C
                      </span>
                    </div>

                    <div className="mt-3">
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border block text-center uppercase tracking-wider ${
                        isBooked
                          ? 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30'
                          : 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                      }`}>
                        {audi.status}
                      </span>
                    </div>
                  </div>
                );
              })}

              {/* Add More Button matching Wireframe */}
              <button
                onClick={() => {
                  const nextNum = auditoriums.length + 1;
                  const newAudi = {
                    id: `audi-${nextNum}`,
                    name: `Audi ${nextNum}`,
                    capacity: 150,
                    status: 'Available',
                    acStatus: 'STANDBY',
                    currentEvent: 'Vacant'
                  };
                  setAuditoriums([...auditoriums, newAudi]);
                  showToast(`Added Audi ${nextNum} to Auditorium Overview!`);
                }}
                className="p-4 rounded-2xl border border-dashed dark:border-slate-700 border-slate-300 dark:bg-slate-900/40 bg-slate-100 hover:bg-slate-200 dark:hover:bg-slate-800 transition-all flex flex-col items-center justify-center gap-1.5 text-slate-600 dark:text-slate-300 cursor-pointer group shadow-sm"
              >
                <Plus className="w-5 h-5 text-blue-500 group-hover:scale-110 transition-transform" />
                <span className="font-bold text-xs">Add More</span>
              </button>
            </div>
          </div>

          {/* 2. APPROVAL REQUESTS & ACADEMIC CALENDAR (2 COLUMNS matching wireframe) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

            {/* LEFT COLUMN: Approval Requests (for AC / Venue Booking) */}
            <div className="lg:col-span-6 glass-panel p-5.5 rounded-3xl border dark:border-slate-800 border-slate-200 dark:bg-slate-900/90 bg-white shadow-lg space-y-4">
              <div className="flex items-center justify-between pb-3 border-b dark:border-slate-800 border-slate-200">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-indigo-500/10 border border-indigo-500/30 rounded-xl text-indigo-500">
                    <ShieldAlert className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold dark:text-white text-slate-900">
                      Approval Requests (for AC)
                    </h3>
                    <span className="text-[10px] font-mono text-indigo-500 font-bold px-2 py-0.5 bg-indigo-500/10 rounded-full border border-indigo-500/20">
                      Pending Request(s)
                    </span>
                  </div>
                </div>
              </div>

              {/* Callout Tooltip matching Wireframe */}
              <div className="p-3 bg-blue-50/80 dark:bg-slate-950/80 border border-blue-200 dark:border-slate-800 rounded-2xl text-xs dark:text-slate-300 text-slate-700 leading-relaxed font-medium relative shadow-inner">
                💡 <strong>Auto-Approval Rule:</strong> Requests are automatically approved <em>only if</em> the venue is vacant at that given time window.
              </div>

              {/* Pending Request Items */}
              <div className="space-y-3">
                {approvalRequests.map((req) => (
                  <div
                    key={req.id}
                    className="p-4 rounded-2xl dark:bg-slate-950 bg-slate-50 border dark:border-slate-800 border-slate-200 space-y-2 shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs dark:text-white text-slate-900">
                        Requestor: <strong className="text-blue-600 dark:text-blue-400">{req.requestor}</strong>
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        req.status === 'Approved' ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30' :
                        req.status === 'Rejected' ? 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30' :
                        'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30'
                      }`}>
                        {req.status}
                      </span>
                    </div>

                    <p className="text-xs dark:text-slate-300 text-slate-700">
                      Request details: <strong className="font-mono">{req.details}</strong>
                    </p>
                    <p className="text-[11px] dark:text-slate-400 text-slate-500 font-medium">
                      Purpose: {req.purpose} ({req.department})
                    </p>

                    {req.status === 'Pending' && (
                      <div className="flex items-center gap-2 pt-2 border-t dark:border-slate-800/80 border-slate-200">
                        <span className="text-[11px] font-bold dark:text-slate-400 text-slate-600">Approval options:</span>
                        <div className="flex items-center gap-2 ml-auto">
                          <button
                            onClick={() => handleApproveRequest(req.id, 'Approved')}
                            className="p-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer flex items-center gap-1"
                          >
                            <Check className="w-4 h-4 stroke-[3]" />
                            <span>Approve</span>
                          </button>
                          <button
                            onClick={() => handleApproveRequest(req.id, 'Rejected')}
                            className="p-2 bg-rose-600/20 hover:bg-rose-600/30 text-rose-600 dark:text-rose-300 border border-rose-500/30 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                          >
                            <X className="w-4 h-4 stroke-[3]" />
                            <span>Reject</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT COLUMN: Academic Calendar / Timetable Schedule Matrix */}
            <div className="lg:col-span-6 glass-panel p-5.5 rounded-3xl border dark:border-slate-800 border-slate-200 dark:bg-slate-900/90 bg-white shadow-lg space-y-4">
              <div className="flex items-center justify-between pb-3 border-b dark:border-slate-800 border-slate-200">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-purple-500/10 border border-purple-500/30 rounded-xl text-purple-500">
                    <CalendarIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold dark:text-white text-slate-900">
                      Academic Calendar
                    </h3>
                    <p className="text-[11px] dark:text-slate-400 text-slate-600">
                      Auditorium timetable conflict detection matrix
                    </p>
                  </div>
                </div>

                {/* Date Dropdown matching Wireframe */}
                <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800">
                  <CalendarIcon className="w-3.5 h-3.5 text-blue-500" />
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="bg-transparent dark:text-white text-slate-900 text-xs font-bold focus:outline-none"
                  />
                </div>
              </div>

              {/* Slot selector numbers matching wireframe 1 2 3 4 5 6 */}
              <div>
                <span className="text-[11px] font-bold dark:text-slate-400 text-slate-600 uppercase tracking-wider block mb-2">
                  Academic Schedule Slots (Slot 1 - 6)
                </span>
                <div className="flex items-center justify-between gap-1.5">
                  {[1, 2, 3, 4, 5, 6].map((slot) => {
                    const isSelected = activeCalendarSlot === slot;
                    return (
                      <button
                        key={slot}
                        onClick={() => setActiveCalendarSlot(slot)}
                        className={`flex-1 py-2 rounded-xl text-xs font-extrabold transition-all border ${
                          isSelected
                            ? 'bg-blue-600 text-white border-blue-400 shadow-md scale-105'
                            : 'dark:bg-slate-950 bg-slate-50 dark:text-slate-300 text-slate-700 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        {slot}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Interactive Calendar Timetable Matrix Grid */}
              <div className="p-4 rounded-2xl dark:bg-slate-950 bg-slate-50 border dark:border-slate-800 border-slate-200 space-y-2.5 shadow-inner">
                <div className="flex items-center justify-between text-xs font-bold dark:text-slate-300 text-slate-700">
                  <span>Active Slot #{activeCalendarSlot} Overview</span>
                  <span className="text-[10px] font-mono text-emerald-500 font-bold">
                    {activeCalendarSlot === 3 ? 'Audi 1 Occupied (2pm-3pm)' : 'All Auditoriums Available'}
                  </span>
                </div>

                <div className="grid grid-cols-5 gap-1.5 text-center text-[10px] font-mono pt-1">
                  {auditoriums.map((audi) => {
                    const isSlotBooked = (activeCalendarSlot === 3 && audi.id === 'audi-1') || (activeCalendarSlot === 1 && audi.id === 'audi-4');
                    return (
                      <div
                        key={audi.id}
                        className={`p-2.5 rounded-xl border transition-all ${
                          isSlotBooked
                            ? 'bg-blue-600/20 text-blue-600 dark:text-blue-300 border-blue-500/40 font-bold'
                            : 'dark:bg-slate-900 bg-white text-slate-500 border-slate-200 dark:border-slate-800'
                        }`}
                      >
                        <span className="block font-sans font-bold">{audi.name}</span>
                        <span className="text-[9px] mt-0.5 block">{isSlotBooked ? 'BUSY' : 'FREE'}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

          </div>

          {/* 3. HARDWARE & RESOURCE TELEMETRY STATUS (2 SLEEK ENHANCED BOXES) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* CARD 1: Resource Status (AV Hardware) */}
            <div className="glass-panel p-6 rounded-3xl border dark:border-slate-800 border-slate-200 dark:bg-slate-900/90 bg-white shadow-xl space-y-4 hover-classic-lift">
              <div className="flex items-center justify-between pb-3 border-b dark:border-slate-800 border-slate-200">
                <div className="flex items-center gap-2.5">
                  <div className="p-2.5 bg-blue-500/10 border border-blue-500/30 rounded-2xl text-blue-500 shadow-sm">
                    <Tv className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm md:text-base font-bold dark:text-white text-slate-900 tracking-tight">
                      Resource Status (AV Hardware)
                    </h3>
                    <p className="text-xs dark:text-slate-400 text-slate-600">
                      Real-time auditorium audio-visual diagnostics
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-[10px] font-mono font-extrabold">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span>Telemetry Live</span>
                </div>
              </div>

              <div className="space-y-3 text-xs font-semibold">
                {/* Projectors */}
                <div className="p-3.5 rounded-2xl dark:bg-slate-950 bg-slate-50 border dark:border-slate-800 border-slate-200 shadow-sm space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="dark:text-slate-300 text-slate-700 flex items-center gap-2 font-bold">
                      <Tv className="w-4 h-4 text-blue-500" />
                      Projectors:
                    </span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono text-xs">(4/5 Avail.)</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: '80%' }} />
                  </div>
                </div>

                {/* Sound Systems */}
                <div className="flex justify-between items-center p-3.5 rounded-2xl dark:bg-slate-950 bg-slate-50 border dark:border-slate-800 border-slate-200 shadow-sm">
                  <span className="dark:text-slate-300 text-slate-700 flex items-center gap-2 font-bold">
                    <Volume2 className="w-4 h-4 text-indigo-500" />
                    Sound Systems:
                  </span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono px-2 py-0.5 bg-emerald-500/10 rounded-md border border-emerald-500/20">
                    (All Ok)
                  </span>
                </div>

                {/* Audio Speakers */}
                <div className="flex justify-between items-center p-3.5 rounded-2xl dark:bg-slate-950 bg-slate-50 border dark:border-slate-800 border-slate-200 shadow-sm">
                  <span className="dark:text-slate-300 text-slate-700 flex items-center gap-2 font-bold">
                    <Radio className="w-4 h-4 text-purple-500" />
                    Audio Speakers:
                  </span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono px-2 py-0.5 bg-emerald-500/10 rounded-md border border-emerald-500/20">
                    (All Ok)
                  </span>
                </div>

                {/* Climate HVAC */}
                <div className="flex justify-between items-center p-3.5 rounded-2xl dark:bg-slate-950 bg-slate-50 border dark:border-slate-800 border-slate-200 shadow-sm">
                  <span className="dark:text-slate-300 text-slate-700 flex items-center gap-2 font-bold">
                    <Wind className="w-4 h-4 text-cyan-500" />
                    Climate HVAC:
                  </span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono px-2 py-0.5 bg-emerald-500/10 rounded-md border border-emerald-500/20">
                    (All Ok)
                  </span>
                </div>
              </div>
            </div>

            {/* CARD 2: Facility Hardware Telemetry */}
            <div className="glass-panel p-6 rounded-3xl border dark:border-slate-800 border-slate-200 dark:bg-slate-900/90 bg-white shadow-xl space-y-4 hover-classic-lift">
              <div className="flex items-center justify-between pb-3 border-b dark:border-slate-800 border-slate-200">
                <div className="flex items-center gap-2.5">
                  <div className="p-2.5 bg-purple-500/10 border border-purple-500/30 rounded-2xl text-purple-500 shadow-sm">
                    <Mic className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm md:text-base font-bold dark:text-white text-slate-900 tracking-tight">
                      Facility Hardware Telemetry
                    </h3>
                    <p className="text-xs dark:text-slate-400 text-slate-600">
                      Infrastructure power & wireless frequency metrics
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30 text-[10px] font-mono font-extrabold">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                  </span>
                  <span>100% Operational</span>
                </div>
              </div>

              <div className="space-y-3 text-xs font-semibold">
                {/* 4K Screens & Displays */}
                <div className="flex justify-between items-center p-3.5 rounded-2xl dark:bg-slate-950 bg-slate-50 border dark:border-slate-800 border-slate-200 shadow-sm">
                  <span className="dark:text-slate-300 text-slate-700 flex items-center gap-2 font-bold">
                    <Tv className="w-4 h-4 text-blue-500" />
                    4K Screens & Displays:
                  </span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono px-2 py-0.5 bg-emerald-500/10 rounded-md border border-emerald-500/20">
                    (All Ok)
                  </span>
                </div>

                {/* Wireless Microphones */}
                <div className="p-3.5 rounded-2xl dark:bg-slate-950 bg-slate-50 border dark:border-slate-800 border-slate-200 shadow-sm space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="dark:text-slate-300 text-slate-700 flex items-center gap-2 font-bold">
                      <Mic className="w-4 h-4 text-purple-500" />
                      Wireless Microphones:
                    </span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono text-xs">(8/10 Avail.)</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-purple-500 h-full rounded-full" style={{ width: '80%' }} />
                  </div>
                </div>

                {/* Stage Lighting Grid */}
                <div className="flex justify-between items-center p-3.5 rounded-2xl dark:bg-slate-950 bg-slate-50 border dark:border-slate-800 border-slate-200 shadow-sm">
                  <span className="dark:text-slate-300 text-slate-700 flex items-center gap-2 font-bold">
                    <Zap className="w-4 h-4 text-amber-500" />
                    Stage Lighting Grid:
                  </span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono px-2 py-0.5 bg-emerald-500/10 rounded-md border border-emerald-500/20">
                    (All Ok)
                  </span>
                </div>

                {/* UPS Power Backup */}
                <div className="flex justify-between items-center p-3.5 rounded-2xl dark:bg-slate-950 bg-slate-50 border dark:border-slate-800 border-slate-200 shadow-sm">
                  <span className="dark:text-slate-300 text-slate-700 flex items-center gap-2 font-bold">
                    <Cpu className="w-4 h-4 text-emerald-500" />
                    UPS Power Backup:
                  </span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono px-2 py-0.5 bg-emerald-500/10 rounded-md border border-emerald-500/20">
                    (100% Charged)
                  </span>
                </div>
              </div>
            </div>

          </div>

          {/* 4. NATURAL-LANGUAGE AI QUERY ENGINE CARD (ULTRA-COOL BOX) */}
          <div className="glass-panel p-6 rounded-3xl border dark:border-slate-800 border-slate-200 dark:bg-gradient-to-br dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 bg-white shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b dark:border-slate-800 border-slate-200">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-2xl shadow-md shadow-blue-500/30">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold dark:text-white text-slate-900 tracking-tight flex items-center gap-2">
                    <span>Natural-Language AI Query Engine</span>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30 rounded-full">
                      v2.4 Co-Pilot
                    </span>
                  </h3>
                  <p className="text-xs dark:text-slate-400 text-slate-600">
                    Ask plain-language questions about AC status, hall schedules, or facility hardware telemetry
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Query Suggestion Chips */}
            <div className="flex items-center gap-2 flex-wrap text-xs">
              <span className="text-[11px] font-bold dark:text-slate-400 text-slate-500 uppercase tracking-wider">Quick Queries:</span>
              <button
                onClick={() => {
                  setAiQuery("Which auditoriums have AC turned on right now?");
                }}
                className="px-3 py-1.5 dark:bg-slate-950 bg-slate-100 dark:text-slate-300 text-slate-700 hover:bg-blue-500/10 hover:text-blue-500 rounded-xl border dark:border-slate-800 border-slate-200 text-[11px] font-semibold transition-all cursor-pointer"
              >
                ⚡ AC Status
              </button>
              <button
                onClick={() => {
                  setAiQuery("Check projectors available in Audi 1 & Audi 2");
                }}
                className="px-3 py-1.5 dark:bg-slate-950 bg-slate-100 dark:text-slate-300 text-slate-700 hover:bg-blue-500/10 hover:text-blue-500 rounded-xl border dark:border-slate-800 border-slate-200 text-[11px] font-semibold transition-all cursor-pointer"
              >
                📽️ Projectors Info
              </button>
              <button
                onClick={() => {
                  setAiQuery("Summarize pending AC approval requests");
                }}
                className="px-3 py-1.5 dark:bg-slate-950 bg-slate-100 dark:text-slate-300 text-slate-700 hover:bg-blue-500/10 hover:text-blue-500 rounded-xl border dark:border-slate-800 border-slate-200 text-[11px] font-semibold transition-all cursor-pointer"
              >
                📋 Pending Approvals
              </button>
            </div>

            {/* Form Input Box */}
            <form onSubmit={handleAiQuerySubmit} className="flex items-center gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                <input
                  type="text"
                  value={aiQuery}
                  onChange={(e) => setAiQuery(e.target.value)}
                  placeholder="Ask anything (e.g. 'Show me vacant halls for 3pm session')..."
                  className="w-full pl-10 pr-4 py-2.5 dark:bg-slate-950 bg-slate-50 border dark:border-slate-800 border-slate-300 rounded-2xl text-xs dark:text-white text-slate-900 focus:outline-none focus:border-blue-500 shadow-inner font-medium"
                />
              </div>
              <button
                type="submit"
                disabled={isAiQuerying || !aiQuery.trim()}
                className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-2xl text-xs font-bold transition-all shadow-md shadow-blue-600/30 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {isAiQuerying ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                <span>Run Query</span>
              </button>
            </form>

            {/* AI Response Output Box */}
            {aiResponse && (
              <div className="p-4 rounded-2xl bg-blue-50/80 dark:bg-slate-950/90 border border-blue-200 dark:border-slate-800 text-xs dark:text-slate-200 text-slate-800 space-y-1.5 animate-in fade-in-0 slide-in-from-top-2 shadow-inner">
                <div className="flex items-center gap-2 font-bold text-blue-600 dark:text-blue-400">
                  <Sparkles className="w-4 h-4" />
                  <span>AI Co-Pilot Telemetry Response:</span>
                </div>
                <p className="leading-relaxed font-mono text-[11px] pt-1">{aiResponse}</p>
              </div>
            )}
          </div>

        </div>
      )}

      {/* Role-Scoped AI Co-Pilot */}
      <ChatWidget />

    </div>
  );
}
