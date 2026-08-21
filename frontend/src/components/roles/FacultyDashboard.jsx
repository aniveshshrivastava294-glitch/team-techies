import React, { useState, useEffect } from 'react';
import ChatWidget from '../ChatWidget';
import RealtimeBookingMatrix from '../RealtimeBookingMatrix';
import { Building2, Bus, Ticket, UserCheck, Calendar, Clock, Plus, Phone, CheckCircle2, AlertTriangle, Send } from 'lucide-react';

export default function FacultyDashboard({ currentUser }) {
  const [activeTab, setActiveTab] = useState('venues');
  const [buses, setBuses] = useState([]);
  const [userTickets, setUserTickets] = useState([]);

  // Form States
  const [ticketTitle, setTicketTitle] = useState('');
  const [ticketDesc, setTicketDesc] = useState('');
  const [ticketDomain, setTicketDomain] = useState('maintenance');
  const [ticketVenue, setTicketVenue] = useState('CS-301');
  const [ticketSuccess, setTicketSuccess] = useState(false);

  const [leaveType, setLeaveType] = useState('Casual Leave');
  const [leaveReason, setLeaveReason] = useState('');
  const [leaveSuccess, setLeaveSuccess] = useState(false);

  useEffect(() => {
    fetchFacultyData();
  }, []);

  const fetchFacultyData = async () => {
    try {
      // Buses
      const bRes = await fetch('/api/domains/transportation');
      const bData = await bRes.json();
      if (bData.status === 'success') setBuses(bData.records || []);

      // User Tickets
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
          faculty_name: currentUser?.full_name,
          leave_type: leaveType,
          reason: leaveReason
        })
      });
      const data = await res.json();
      if (data.status === 'success') {
        setLeaveSuccess(true);
        setLeaveReason('');
        setTimeout(() => setLeaveSuccess(false), 3000);
      }
    } catch (err) {
      console.error('Leave error:', err);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Faculty Executive Personal Summary Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-blue-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="px-2.5 py-0.5 text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full">
            Faculty Workspace & Realtime Booking Portal
          </span>
          <h2 className="text-xl font-bold text-white tracking-tight mt-1">
            Welcome, {currentUser?.full_name || 'Prof. Elena Rostova'}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Department of Computer Science & Automation
          </p>
        </div>

        {/* Personal Metrics */}
        <div className="flex items-center gap-3">
          <div className="bg-slate-900/90 px-4 py-2.5 rounded-xl border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">Faculty Attendance</span>
            <span className="text-lg font-bold text-emerald-400">94.2%</span>
          </div>
          <div className="bg-slate-900/90 px-4 py-2.5 rounded-xl border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">Leaves Taken</span>
            <span className="text-lg font-bold text-blue-400">3 Days</span>
          </div>
          <div className="bg-slate-900/90 px-4 py-2.5 rounded-xl border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">Active Tickets</span>
            <span className="text-lg font-bold text-amber-400">{userTickets.filter(t => t.status !== 'resolved').length}</span>
          </div>
        </div>
      </div>

      {/* Main Faculty Tabs Navigation */}
      <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('venues')}
          className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer flex items-center space-x-2 ${
            activeTab === 'venues' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white bg-slate-900'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Real-Time Venue Booking Matrix</span>
        </button>

        <button
          onClick={() => setActiveTab('transport')}
          className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer flex items-center space-x-2 ${
            activeTab === 'transport' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white bg-slate-900'
          }`}
        >
          <Bus className="w-4 h-4" />
          <span>Bus Fleet Schedule</span>
        </button>

        <button
          onClick={() => setActiveTab('tickets')}
          className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer flex items-center space-x-2 ${
            activeTab === 'tickets' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white bg-slate-900'
          }`}
        >
          <Ticket className="w-4 h-4" />
          <span>Raise Issue / Leave Form</span>
        </button>
      </div>

      {/* TAB 1: REALTIME BOOKING MATRIX */}
      {activeTab === 'venues' && (
        <RealtimeBookingMatrix currentUser={currentUser} />
      )}

      {/* TAB 2: BUS FLEET SCHEDULE */}
      {activeTab === 'transport' && (
        <div className="glass-panel p-6 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Bus className="w-4 h-4 text-cyan-400" />
                <span>Campus Shuttle Bus Fleet Schedule (6 Seeded Buses)</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Real-time driver details, capacity, and route operational status</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {buses.map((bus, idx) => (
              <div key={idx} className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-sm">{bus.vehicle_id}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                    bus.status === 'Overcrowded'
                      ? 'bg-red-500/20 text-red-300 border-red-500/40 animate-pulse'
                      : bus.status === 'Delayed'
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  }`}>
                    {bus.status}
                  </span>
                </div>

                <div>
                  <h4 className="text-xs font-semibold text-slate-200">{bus.route_name}</h4>
                  <div className="mt-2 text-xs text-slate-400 space-y-1">
                    <p className="flex items-center gap-1.5">
                      <UserCheck className="w-3.5 h-3.5 text-blue-400" />
                      <span>Driver: <strong>{bus.driver_name || 'Assigned Driver'}</strong></span>
                    </p>
                    <p className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-slate-500" />
                      <span className="font-mono">{bus.driver_phone || '+1 (555) 019-0000'}</span>
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Ridership Load:</span>
                  <span className="font-bold text-white font-mono">{bus.passenger_count} / {bus.capacity} Passengers</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: RAISE ISSUE TICKET & APPLY LEAVE FORMS */}
      {activeTab === 'tickets' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Raise Issue Form */}
          <div className="lg:col-span-6 glass-panel p-6 rounded-2xl border border-slate-800">
            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
              <Plus className="w-4 h-4 text-amber-400" />
              <span>Raise Campus Issue Ticket</span>
            </h3>

            {ticketSuccess && (
              <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 rounded-xl text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Ticket raised! Routed directly to Sub-Admin Kanban board.</span>
              </div>
            )}

            <form onSubmit={handleRaiseTicket} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Issue Title</label>
                <input
                  type="text"
                  value={ticketTitle}
                  onChange={(e) => setTicketTitle(e.target.value)}
                  placeholder="e.g. AC Malfunction in Room CS-301"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Department Domain</label>
                <select
                  value={ticketDomain}
                  onChange={(e) => setTicketDomain(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-blue-500"
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
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl transition-all shadow-md shadow-amber-600/20 cursor-pointer"
              >
                Submit Ticket
              </button>
            </form>
          </div>

          {/* Apply Leave Form */}
          <div className="lg:col-span-6 glass-panel p-6 rounded-2xl border border-slate-800">
            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-blue-400" />
              <span>Apply for Faculty Leave</span>
            </h3>

            {leaveSuccess && (
              <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 rounded-xl text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Leave application submitted to Attendance Sub-Admin queue!</span>
              </div>
            )}

            <form onSubmit={handleApplyLeave} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Leave Category</label>
                <select
                  value={leaveType}
                  onChange={(e) => setLeaveType(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-blue-500"
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
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all shadow-md shadow-blue-600/20 cursor-pointer"
              >
                Submit Leave Application
              </button>
            </form>
          </div>

        </div>
      )}

      {/* Scoped AI Co-Pilot Widget for Faculty */}
      <ChatWidget />

    </div>
  );
}
