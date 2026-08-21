import React, { useState, useEffect } from 'react';
import ChatWidget from '../ChatWidget';
import ResolveConfirmationModal from '../ResolveConfirmationModal';
import { Wrench, Bus, Calendar, Check, X, Building2, UserCheck, Zap, RefreshCw, AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function SubAdminDashboard({ currentUser }) {
  const domain = currentUser?.department_domain || 'maintenance';
  
  const [tickets, setTickets] = useState([]);
  const [buses, setBuses] = useState([]);
  const [events, setEvents] = useState([]);
  const [venues, setVenues] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Safeguard Modal State
  const [selectedResolveTicket, setSelectedResolveTicket] = useState(null);

  useEffect(() => {
    fetchSubAdminData();
  }, [domain]);

  const fetchSubAdminData = async () => {
    setIsLoading(true);
    try {
      if (domain === 'maintenance' || domain === 'energy') {
        const res = await fetch(`/api/tickets?domain=${domain}`);
        const data = await res.json();
        if (data.status === 'success') setTickets(data.tickets || []);
      }
      if (domain === 'transport') {
        const res = await fetch('/api/domains/transportation');
        const data = await res.json();
        if (data.status === 'success') setBuses(data.records || []);
      }
      if (domain === 'events') {
        const res = await fetch('/api/bookings');
        const data = await res.json();
        if (data.status === 'success') setEvents(data.bookings || []);
      }
      if (domain === 'classrooms') {
        const res = await fetch('/api/bookings/venues');
        const data = await res.json();
        if (data.status === 'success') setVenues(data.venues || []);
      }
      if (domain === 'attendance') {
        const res = await fetch('/api/leaves');
        const data = await res.json();
        if (data.status === 'success') setLeaves(data.leaves || []);
      }
    } catch (e) {
      console.error('SubAdmin fetch error:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateTicketStatus = async (ticketId, status) => {
    try {
      const res = await fetch(`/api/tickets/${ticketId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      const data = await res.json();
      if (data.status === 'success') {
        setSelectedResolveTicket(null);
        fetchSubAdminData();
      }
    } catch (e) {
      console.error('Update ticket error:', e);
    }
  };

  const handleUpdateLeaveStatus = async (leaveId, status) => {
    try {
      const res = await fetch(`/api/leaves/${leaveId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      const data = await res.json();
      if (data.status === 'success') fetchSubAdminData();
    } catch (e) {
      console.error('Update leave error:', e);
    }
  };

  const handleApproveEventBooking = async (bookingId, status) => {
    try {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      const data = await res.json();
      if (data.status === 'success') fetchSubAdminData();
    } catch (e) {
      console.error('Approve event error:', e);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Sub-Admin Domain Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-full">
              {domain} Sub-Admin Workspace
            </span>
            <span className="text-xs text-slate-400 font-mono">Domain Control Center</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight mt-1.5">
            Operational Co-Pilot for {domain.toUpperCase()}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Logged in as <strong>{currentUser?.full_name || currentUser?.email}</strong>
          </p>
        </div>

        <button
          onClick={fetchSubAdminData}
          disabled={isLoading}
          className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold border border-slate-800 transition-all flex items-center space-x-1.5 cursor-pointer self-start sm:self-center"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh Domain Payload</span>
        </button>
      </div>

      {/* DOMAIN 1: MAINTENANCE SUB-ADMIN KANBAN BOARD WITH SAFEGUARD MODAL */}
      {domain === 'maintenance' && (
        <div className="glass-panel p-6 rounded-2xl border border-slate-800">
          <div className="flex items-center space-x-3 mb-6 pb-3 border-b border-slate-800">
            <div className="p-2 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Faculty Issue Tickets Kanban Board</h3>
              <p className="text-xs text-slate-400">Strict confirmation modal enforced prior to resolving tickets</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* OPEN */}
            <div className="bg-slate-950/80 p-4 rounded-xl border border-red-500/30 space-y-3">
              <span className="font-bold text-xs text-red-400 uppercase tracking-wider block border-b border-slate-800 pb-2">
                Open Tickets ({tickets.filter(t => t.status === 'open').length})
              </span>
              {tickets.filter(t => t.status === 'open').map(t => (
                <div key={t.ticket_id} className="bg-slate-900 p-3.5 rounded-lg border border-slate-800 space-y-2">
                  <span className="font-bold text-white text-xs block">{t.title}</span>
                  <p className="text-[11px] text-slate-300">{t.description}</p>
                  <button
                    onClick={() => handleUpdateTicketStatus(t.ticket_id, 'in-progress')}
                    className="w-full py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-md text-[11px] font-semibold transition-all cursor-pointer mt-2"
                  >
                    Start Investigation →
                  </button>
                </div>
              ))}
            </div>

            {/* IN PROGRESS */}
            <div className="bg-slate-950/80 p-4 rounded-xl border border-amber-500/30 space-y-3">
              <span className="font-bold text-xs text-amber-400 uppercase tracking-wider block border-b border-slate-800 pb-2">
                In Progress ({tickets.filter(t => t.status === 'in-progress').length})
              </span>
              {tickets.filter(t => t.status === 'in-progress').map(t => (
                <div key={t.ticket_id} className="bg-slate-900 p-3.5 rounded-lg border border-slate-800 space-y-2">
                  <span className="font-bold text-white text-xs block">{t.title}</span>
                  <p className="text-[11px] text-slate-300">{t.description}</p>
                  <button
                    onClick={() => setSelectedResolveTicket(t)}
                    className="w-full py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-md text-[11px] font-semibold transition-all cursor-pointer mt-2"
                  >
                    Mark as Resolved (Safeguard) ✓
                  </button>
                </div>
              ))}
            </div>

            {/* RESOLVED */}
            <div className="bg-slate-950/80 p-4 rounded-xl border border-emerald-500/30 space-y-3">
              <span className="font-bold text-xs text-emerald-400 uppercase tracking-wider block border-b border-slate-800 pb-2">
                Resolved ({tickets.filter(t => t.status === 'resolved').length})
              </span>
              {tickets.filter(t => t.status === 'resolved').map(t => (
                <div key={t.ticket_id} className="bg-slate-900/60 p-3.5 rounded-lg border border-slate-800/80 space-y-2 opacity-80">
                  <span className="font-bold text-slate-300 text-xs block line-through">{t.title}</span>
                  <p className="text-[11px] text-slate-400">{t.description}</p>
                </div>
              ))}
            </div>

          </div>
        </div>
      )}

      {/* DOMAIN 2: ATTENDANCE SUB-ADMIN FACULTY LEAVE QUEUE */}
      {domain === 'attendance' && (
        <div className="glass-panel p-6 rounded-2xl border border-slate-800">
          <div className="flex items-center space-x-3 mb-6 pb-3 border-b border-slate-800">
            <div className="p-2 bg-blue-500/10 border border-blue-500/30 rounded-xl text-blue-400">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Faculty Leave Request Approval Queue</h3>
              <p className="text-xs text-slate-400">Review and approve faculty casual, sick, and duty leave applications</p>
            </div>
          </div>

          <div className="space-y-3">
            {leaves.map((l) => (
              <div key={l.id} className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-xs">{l.faculty_name} ({l.faculty_email})</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                      l.status === 'approved' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                    }`}>
                      {l.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1">Reason: "{l.reason}" ({l.leave_type})</p>
                  <p className="text-[11px] text-slate-500 font-mono mt-0.5">Dates: {l.start_date} to {l.end_date}</p>
                </div>

                {l.status === 'pending' && (
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleUpdateLeaveStatus(l.id, 'approved')}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center space-x-1 cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Approve Leave</span>
                    </button>
                    <button
                      onClick={() => handleUpdateLeaveStatus(l.id, 'rejected')}
                      className="px-3 py-1.5 bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/30 rounded-lg text-xs font-semibold flex items-center space-x-1 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Reject</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* DOMAIN 3: CLASSROOMS SUB-ADMIN OVERRIDE MONITOR */}
      {domain === 'classrooms' && (
        <div className="glass-panel p-6 rounded-2xl border border-slate-800">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-indigo-500/10 border border-indigo-500/30 rounded-xl text-indigo-400">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Live Classroom Allocations & Schedule Override</h3>
              <p className="text-xs text-slate-400">Manage venue availability and seating thresholds</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {venues.map((v) => (
              <div key={v.id} className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-sm">{v.room_number} ({v.type || 'Non-AC'})</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                    v.is_available !== false ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'bg-red-500/20 text-red-300 border-red-500/30'
                  }`}>
                    {v.is_available !== false ? 'Available' : 'Maintenance Lock'}
                  </span>
                </div>
                <p className="text-xs text-slate-400">{v.building} — {v.capacity} Seats ({v.room_type})</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* DOMAIN 4: ENERGY SUB-ADMIN TICKET MONITOR */}
      {domain === 'energy' && (
        <div className="glass-panel p-6 rounded-2xl border border-slate-800">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Electricity & Water Grid Issues Monitor</h3>
              <p className="text-xs text-slate-400">Tickets assigned specifically to Campus Power & Utilities Sub-Admin</p>
            </div>
          </div>

          <div className="space-y-3">
            {tickets.map(t => (
              <div key={t.ticket_id} className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-xs">{t.title}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase">
                    {t.status}
                  </span>
                </div>
                <p className="text-xs text-slate-300">{t.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* DOMAIN 5: TRANSPORT SUB-ADMIN FLEET MONITOR */}
      {domain === 'transport' && (
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-cyan-500/10 border border-cyan-500/30 rounded-xl text-cyan-400">
              <Bus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Transport Fleet Management</h3>
              <p className="text-xs text-slate-400">Monitor driver schedules and passenger overcrowding</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {buses.map((bus, idx) => (
              <div key={idx} className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-sm">{bus.vehicle_id}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                    bus.status === 'Overcrowded' ? 'bg-red-500/20 text-red-300 border-red-500/40 animate-pulse' : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  }`}>
                    {bus.status}
                  </span>
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-slate-200">{bus.route_name}</h4>
                  <p className="text-xs text-slate-400 mt-1">Driver: <strong>{bus.driver_name || 'Driver'}</strong> ({bus.driver_phone || 'N/A'})</p>
                </div>
                <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Passengers:</span>
                  <span className="font-bold text-white font-mono">{bus.passenger_count} / {bus.capacity}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* DOMAIN 6: EVENT SUB-ADMIN VENUE APPROVALS */}
      {domain === 'events' && (
        <div className="glass-panel p-6 rounded-2xl border border-slate-800">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-indigo-500/10 border border-indigo-500/30 rounded-xl text-indigo-400">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Venue Reservation Requests (AC Venue Review)</h3>
              <p className="text-xs text-slate-400">Approve or reject faculty room reservation submissions</p>
            </div>
          </div>

          <div className="space-y-3">
            {events.map((e) => (
              <div key={e.id} className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-xs">{e.event_name}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                      e.status === 'approved' || e.status === 'Scheduled' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                    }`}>
                      {e.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">Venue: {e.venue_name || e.room_id} ({e.venue_type || 'AC'}) | Booked By: {e.booked_by_email || e.organizer}</p>
                </div>

                {e.status === 'pending' && (
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleApproveEventBooking(e.id, 'approved')}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center space-x-1 cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Approve AC Booking</span>
                    </button>
                    <button
                      onClick={() => handleApproveEventBooking(e.id, 'rejected')}
                      className="px-3 py-1.5 bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/30 rounded-lg text-xs font-semibold flex items-center space-x-1 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Reject</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Role-Scoped AI Operational Co-Pilot */}
      <ChatWidget />

      {/* Maintenance Resolution Safeguard Confirmation Modal */}
      <ResolveConfirmationModal
        isOpen={Boolean(selectedResolveTicket)}
        ticket={selectedResolveTicket}
        onConfirm={handleUpdateTicketStatus}
        onCancel={() => setSelectedResolveTicket(null)}
      />

    </div>
  );
}
