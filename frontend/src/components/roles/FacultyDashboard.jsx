import React, { useState, useEffect } from 'react';
import {
  Building2, Bus, Ticket, UserCheck, Calendar as CalendarIcon, Clock, Plus, Phone,
  CheckCircle2, AlertTriangle, Send, MapPin, Users, Sparkles, ArrowRight,
  ChevronDown, ChevronRight, ShieldAlert, Info, X, Check, Wifi, Tv, Wind, Zap, Radio, CalendarDays
} from 'lucide-react';
import ChatWidget from '../ChatWidget';
import RealtimeBookingMatrix from '../RealtimeBookingMatrix';

export default function FacultyDashboard({ currentUser }) {
  const [activeTab, setActiveTab] = useState('matrix');
  const [buses, setBuses] = useState([]);
  const [userTickets, setUserTickets] = useState([]);

  // Editable Profile
  const [professorName, setProfessorName] = useState(currentUser?.full_name || 'Dr. Eleanor Vance');
  const [department, setDepartment] = useState('Department of Computer Science & Engineering');

  // Metrics State
  const [attendancePercent, setAttendancePercent] = useState(96);
  const [leavesTaken, setLeavesTaken] = useState(3);
  const [activeTicketsCount, setActiveTicketsCount] = useState(2);

  // Leave Form State
  const [leaveType, setLeaveType] = useState('Casual Leave');
  const [leaveReason, setLeaveReason] = useState('');
  const [leaveSuccess, setLeaveSuccess] = useState(false);

  // Ticket Form State
  const [ticketTitle, setTicketTitle] = useState('');
  const [ticketDesc, setTicketDesc] = useState('');
  const [ticketDomain, setTicketDomain] = useState('maintenance');
  const [ticketVenue, setTicketVenue] = useState('CS-301');
  const [ticketSuccess, setTicketSuccess] = useState(false);

  // Bus Fleet Interactive Selection & Telemetry Details
  const busFleet = [
    { id: 'bus-1', label: 'Transit Alpha', busNo: 'BUS-101', loc: 'North Gate - Stop 2', capacity: 60, seatsLeft: 14, speed: '42 km/h', driver: 'Alex Rivera', phone: '+1 (555) 019-2831', status: 'On Schedule' },
    { id: 'bus-2', label: 'Shuttle Beta', busNo: 'BUS-102', loc: 'Science Complex Quad', capacity: 60, seatsLeft: 5, speed: '38 km/h', driver: 'Sarah Jenkins', phone: '+1 (555) 019-4820', status: 'Peak Load' },
    { id: 'bus-3', label: 'Terminal Shuttle', busNo: 'BUS-103', loc: 'Library Main Terminal', capacity: 55, seatsLeft: 28, speed: '0 km/h (Boarding)', driver: 'Robert Chen', phone: '+1 (555) 019-9941', status: 'On Schedule' },
    { id: 'bus-5', label: 'Engineering Shuttle', busNo: 'BUS-105', loc: 'Engineering Wing', capacity: 60, seatsLeft: 18, speed: '25 km/h', driver: 'David Vance', phone: '+1 (555) 019-3382', status: 'Delayed 5m' }
  ];

  const [selectedBus, setSelectedBus] = useState(busFleet[0]);

  useEffect(() => {
    fetchFacultyData();
  }, []);

  const fetchFacultyData = async () => {
    try {
      const bRes = await fetch('/api/domains/transportation');
      const bData = await bRes.json();
      if (bData.status === 'success' && bData.records?.length > 0) setBuses(bData.records);

      const tRes = await fetch(`/api/tickets?userEmail=${currentUser?.email}`);
      const tData = await tRes.json();
      if (tData.status === 'success') setUserTickets(tData.tickets || []);
    } catch (e) {
      console.error('Error fetching faculty data:', e);
    }
  };

  const handleRaiseTicket = async (e) => {
    e.preventDefault();
    if (!ticketTitle || !ticketDesc) return;

    try {
      const res = await fetch('/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: ticketTitle,
          description: ticketDesc,
          assigned_domain: ticketDomain,
          venue_name: ticketVenue,
          raised_by_email: currentUser?.email
        })
      });
      const data = await res.json();
      if (data.status === 'success') {
        setTicketSuccess(true);
        setTicketTitle('');
        setTicketDesc('');
        setActiveTicketsCount(prev => prev + 1);
        fetchFacultyData();
        setTimeout(() => setTicketSuccess(false), 3000);
      }
    } catch (err) {
      console.error('Raise ticket error:', err);
    }
  };

  const handleApplyLeave = async (e) => {
    e.preventDefault();
    if (!leaveReason) return;

    try {
      const res = await fetch('/api/leaves', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          faculty_email: currentUser?.email,
          faculty_name: currentUser?.full_name || professorName,
          leave_type: leaveType,
          reason: leaveReason
        })
      });
      const data = await res.json();
      if (data.status === 'success') {
        setLeaveSuccess(true);
        setLeaveReason('');
        setLeavesTaken(prev => prev + 1);
        setTimeout(() => setLeaveSuccess(false), 3000);
      }
    } catch (err) {
      console.error('Leave error:', err);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Faculty Executive Personal Summary Banner */}
      <div className="glass-panel p-6 rounded-3xl border border-cyan-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="px-3 py-1 text-xs font-semibold bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 rounded-full">
            Faculty Workspace & Realtime Booking Portal
          </span>
          <h2 className="text-xl font-bold text-white tracking-tight mt-1.5">
            Welcome, {currentUser?.full_name || professorName}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {department}
          </p>
        </div>

        {/* Personal Metrics */}
        <div className="flex items-center gap-3">
          <div className="glass-card px-4 py-2.5 rounded-2xl text-center">
            <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">Faculty Attendance</span>
            <span className="text-lg font-bold text-emerald-400">{attendancePercent}%</span>
          </div>
          <div className="glass-card px-4 py-2.5 rounded-2xl text-center">
            <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">Leaves Taken</span>
            <span className="text-lg font-bold text-cyan-400">{leavesTaken} Days</span>
          </div>
          <div className="glass-card px-4 py-2.5 rounded-2xl text-center">
            <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">Active Tickets</span>
            <span className="text-lg font-bold text-amber-400">{activeTicketsCount}</span>
          </div>
        </div>
      </div>

      {/* Main Faculty Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800/80 pb-3">
        <button
          onClick={() => setActiveTab('matrix')}
          className={`px-4 py-2 text-xs font-semibold rounded-2xl transition-all cursor-pointer flex items-center space-x-2 ${
            activeTab === 'matrix' ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20' : 'text-slate-400 hover:text-white glass-card'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Real-Time Venue Booking Matrix</span>
        </button>

        <button
          onClick={() => setActiveTab('transport')}
          className={`px-4 py-2 text-xs font-semibold rounded-2xl transition-all cursor-pointer flex items-center space-x-2 ${
            activeTab === 'transport' ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20' : 'text-slate-400 hover:text-white glass-card'
          }`}
        >
          <Bus className="w-4 h-4" />
          <span>Shuttle Bus Telemetry</span>
        </button>

        <button
          onClick={() => setActiveTab('tickets')}
          className={`px-4 py-2 text-xs font-semibold rounded-2xl transition-all cursor-pointer flex items-center space-x-2 ${
            activeTab === 'tickets' ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20' : 'text-slate-400 hover:text-white glass-card'
          }`}
        >
          <Ticket className="w-4 h-4" />
          <span>Raise Issue / Leave Portal</span>
        </button>
      </div>

      {/* TAB 1: REALTIME BOOKING MATRIX */}
      {activeTab === 'matrix' && (
        <RealtimeBookingMatrix currentUser={currentUser} />
      )}

      {/* TAB 2: BUS FLEET TELEMETRY */}
      {activeTab === 'transport' && (
        <div className="glass-panel p-6 rounded-3xl space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Bus className="w-4 h-4 text-cyan-400" />
                <span>Campus Shuttle Bus Fleet Telemetry</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Real-time driver details, capacity, speed, and route operational status</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {busFleet.map((bus) => (
              <div
                key={bus.id}
                onClick={() => setSelectedBus(bus)}
                className={`glass-card p-5 rounded-2xl border transition-all cursor-pointer space-y-3 ${
                  selectedBus.id === bus.id ? 'border-cyan-500/60 ring-1 ring-cyan-500/30' : 'hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-sm">{bus.busNo}</span>
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                    bus.status === 'Peak Load'
                      ? 'bg-red-500/20 text-red-300 border-red-500/40 animate-pulse'
                      : bus.status === 'Delayed 5m'
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  }`}>
                    {bus.status}
                  </span>
                </div>

                <div>
                  <h4 className="text-xs font-semibold text-slate-200">{bus.label}</h4>
                  <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{bus.loc}</span>
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-800 text-xs space-y-1">
                  <p className="text-slate-400 flex items-center justify-between">
                    <span>Driver: <strong>{bus.driver}</strong></span>
                    <span className="font-mono text-[10px] text-slate-400">{bus.phone}</span>
                  </p>
                  <p className="text-slate-400 flex items-center justify-between">
                    <span>Speed: <strong className="text-white">{bus.speed}</strong></span>
                    <span className="font-mono font-bold text-cyan-300">{bus.seatsLeft} seats left</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: RAISE ISSUE & APPLY LEAVE FORMS */}
      {activeTab === 'tickets' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Raise Issue Form */}
          <div className="lg:col-span-6 glass-panel p-6 rounded-3xl">
            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
              <Plus className="w-4 h-4 text-amber-400" />
              <span>Raise Campus Issue Ticket</span>
            </h3>

            {ticketSuccess && (
              <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 rounded-2xl text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Ticket raised! Dispatched directly to Maintenance Sub-Admin.</span>
              </div>
            )}

            <form onSubmit={handleRaiseTicket} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Issue Title</label>
                <input
                  type="text"
                  value={ticketTitle}
                  onChange={(e) => setTicketTitle(e.target.value)}
                  placeholder="e.g. AC Malfunction in Room CS-301"
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Target Sub-Admin Domain</label>
                <select
                  value={ticketDomain}
                  onChange={(e) => setTicketDomain(e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="maintenance">Maintenance Sub-Admin (HVAC, Hardware, Repairs)</option>
                  <option value="energy">Energy Sub-Admin (Electricity & Water Grid)</option>
                  <option value="transport">Transport Sub-Admin (Shuttle Overcrowding, Driver)</option>
                  <option value="events">Event Sub-Admin (Audio/Visual, Venue Setup)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Detailed Description</label>
                <textarea
                  value={ticketDesc}
                  onChange={(e) => setTicketDesc(e.target.value)}
                  placeholder="Describe the operational flaw..."
                  rows={3}
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-2xl transition-all shadow-md shadow-amber-600/20 cursor-pointer"
              >
                Submit Issue Ticket
              </button>
            </form>
          </div>

          {/* Apply Leave Form */}
          <div className="lg:col-span-6 glass-panel p-6 rounded-3xl">
            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-cyan-400" />
              <span>Apply for Faculty Leave</span>
            </h3>

            {leaveSuccess && (
              <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 rounded-2xl text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Leave application submitted to Attendance Admin queue!</span>
              </div>
            )}

            <form onSubmit={handleApplyLeave} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Leave Category</label>
                <select
                  value={leaveType}
                  onChange={(e) => setLeaveType(e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="Casual Leave">Casual Leave</option>
                  <option value="Sick Leave">Sick Leave</option>
                  <option value="Duty Leave">Duty Leave</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Reason for Leave</label>
                <textarea
                  value={leaveReason}
                  onChange={(e) => setLeaveReason(e.target.value)}
                  placeholder="Explain reason for leave application..."
                  rows={3}
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-2xl transition-all shadow-md shadow-cyan-600/20 cursor-pointer"
              >
                Submit Leave Application
              </button>
            </form>
          </div>

        </div>
      )}

      {/* AI Chat Co-Pilot */}
      <ChatWidget />

    </div>
  );
}
