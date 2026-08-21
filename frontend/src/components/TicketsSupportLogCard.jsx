import React, { useState } from 'react';
import { AlertTriangle, Plus, X, CheckCircle2, Clock, ShieldAlert, ArrowRight, Filter } from 'lucide-react';

export default function TicketsSupportLogCard({ 
  adminDomain = 'events', 
  title = 'Tickets Raised & Support Log',
  subtitle = 'Track maintenance, IT support, AV repairs & facility tickets' 
}) {
  const [tickets, setTickets] = useState(() => {
    if (adminDomain === 'transport') {
      return [
        { id: 'TCK-9102', title: 'Shuttle Bus 102 Live Telemetry GPS Offline Sync', domain: 'Transport Fleet', status: 'In Progress', priority: 'High', time: '15 mins ago', date: 'Aug 21', requestor: 'Driver Ramesh' },
        { id: 'TCK-9088', title: 'Bus 4 (PB-01-AB-1004) AC Compressor Low Coolant Fault', domain: 'Vehicle Maintenance', status: 'Pending Dispatch', priority: 'Medium', time: '1 hour ago', date: 'Aug 21', requestor: 'Transport Admin' },
        { id: 'TCK-8940', title: 'Airport Road Shuttle Stop Solar Signage Battery Drain', domain: 'Station Logistics', status: 'Resolved', priority: 'Low', time: 'Yesterday', date: 'Aug 20', requestor: 'Fleet Control' }
      ];
    } else if (adminDomain === 'energy') {
      return [
        { id: 'TCK-9310', title: 'Substation Beta Phase 3 Transformer Overheating Alert', domain: 'Electrical Grid', status: 'In Progress', priority: 'High', time: '8 mins ago', date: 'Aug 21', requestor: 'Energy Ops' },
        { id: 'TCK-9244', title: 'Block C Rooftop Solar Inverter #2 MPPT Calibration', domain: 'Solar Generation', status: 'Pending Dispatch', priority: 'Medium', time: '1 hour ago', date: 'Aug 21', requestor: 'Grid Lead' },
        { id: 'TCK-9105', title: 'Library Battery Storage Voltage Stabilization Check', domain: 'Battery Reserve', status: 'Resolved', priority: 'Low', time: 'Yesterday', date: 'Aug 20', requestor: 'Solar Tech' }
      ];
    } else if (adminDomain === 'classroom') {
      return [
        { id: 'TCK-8812', title: 'Block A Hall 301 4K Laser Projector Color Calibration', domain: 'Classroom AV', status: 'In Progress', priority: 'High', time: '12 mins ago', date: 'Aug 21', requestor: 'Prof. Sharma' },
        { id: 'TCK-8790', title: 'Seminar Hall 204 Stage Wireless Mic Battery & Receiver Dip', domain: 'Audio Hardware', status: 'Pending Dispatch', priority: 'Medium', time: '2 hours ago', date: 'Aug 21', requestor: 'Dr. Mehta' },
        { id: 'TCK-8633', title: 'Science Lab 105 Smartboard Touch Grid Sensor Cleaning', domain: 'Smartboard Hardware', status: 'Resolved', priority: 'Low', time: 'Yesterday', date: 'Aug 20', requestor: 'Lab Admin' }
      ];
    } else {
      return [
        { id: 'TCK-8901', title: 'Main Audi 4K Laser Projector HDMI Port Signal Intermittent', domain: 'AV Tech Support', status: 'In Progress', priority: 'High', time: '10 mins ago', date: 'Aug 21', requestor: 'Prof. Chakraborty' },
        { id: 'TCK-8854', title: 'Audi 2 Stage Wireless Mic Ch-4 Frequency Interference', domain: 'Stage Audio', status: 'Pending Dispatch', priority: 'Medium', time: '2 hours ago', date: 'Aug 21', requestor: 'Dr. Prashad' },
        { id: 'TCK-8720', title: 'Conference Hall B AC Chiller Unit Sensor Recalibration', domain: 'HVAC Maintenance', status: 'Resolved', priority: 'Normal', time: 'Yesterday', date: 'Aug 20', requestor: 'Event Admin' }
      ];
    }
  });

  const [showIssueModal, setShowIssueModal] = useState(false);
  const [ticketTitle, setTicketTitle] = useState('');
  const [ticketDomain, setTicketDomain] = useState(adminDomain === 'transport' ? 'transport' : 'events');
  const [ticketPriority, setTicketPriority] = useState('Medium');
  const [ticketDesc, setTicketDesc] = useState('');
  const [toastMsg, setToastMsg] = useState(null);
  const [statusFilter, setStatusFilter] = useState('ALL');

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const handleRaiseTicket = (e) => {
    e.preventDefault();
    if (!ticketTitle.trim() || !ticketDesc.trim()) return;

    const newTck = {
      id: `TCK-${Math.floor(9000 + Math.random() * 999)}`,
      title: ticketTitle.trim(),
      domain: ticketDomain === 'events' ? 'Event AV & Stage' : ticketDomain === 'transport' ? 'Transport Fleet' : 'Maintenance',
      status: 'Pending Dispatch',
      priority: ticketPriority,
      time: 'Just now',
      date: 'Aug 21',
      requestor: 'Current Admin'
    };

    setTickets(prev => [newTck, ...prev]);
    setShowIssueModal(false);
    setTicketTitle('');
    setTicketDesc('');
    showToast(`Successfully logged ticket ${newTck.id}!`);
  };

  const handleStatusUpdate = (tckId, newStatus) => {
    setTickets(prev => prev.map(t => t.id === tckId ? { ...t, status: newStatus } : t));
    showToast(`Ticket ${tckId} status updated to ${newStatus}`);
  };

  const activeTicketsCount = tickets.filter(t => t.status !== 'Resolved').length;

  const filteredTickets = tickets.filter(t => {
    if (statusFilter === 'ACTIVE') return t.status !== 'Resolved';
    if (statusFilter === 'RESOLVED') return t.status === 'Resolved';
    return true;
  });

  return (
    <div className="w-full rounded-3xl border border-white/5 bg-white/[0.02] backdrop-blur-2xl transition-all duration-300 overflow-hidden shadow-2xl">
      {/* Toast Banner */}
      {toastMsg && (
        <div className="fixed top-20 right-6 bg-black/90 border border-amber-500/40 text-amber-300 font-mono text-xs px-4 py-2.5 rounded-2xl shadow-2xl z-50 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-amber-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header Bar */}
      <div className="p-4 sm:p-5 flex flex-col gap-3 border-b border-white/5 bg-gradient-to-r from-amber-500/5 via-transparent to-transparent">
        
        {/* Top Row: Icon + Title + Active Count + Subtitle + Raise Ticket CTA */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-400 shrink-0 mt-0.5">
              <AlertTriangle className="w-4 h-4 stroke-[1.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-sm font-bold text-white tracking-tight">
                  {title}
                </h3>
                <span className="text-[9px] font-mono font-bold px-2 py-0.5 bg-amber-500/20 text-amber-300 rounded-full border border-amber-500/40 uppercase shrink-0">
                  {activeTicketsCount} ACTIVE
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 font-medium font-mono line-clamp-1">
                {subtitle}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowIssueModal(true)}
            className="px-3.5 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 shrink-0 shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Raise Ticket</span>
          </button>
        </div>

        {/* Bottom Row: Status Filter Pills */}
        <div className="flex items-center justify-between gap-2 pt-2 border-t border-white/5">
          <div className="flex items-center bg-black/50 p-1 rounded-xl border border-white/10 text-[10px] font-mono w-full sm:w-auto justify-between sm:justify-start">
            {['ALL', 'ACTIVE', 'RESOLVED'].map(st => (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  statusFilter === st
                    ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tickets List Body */}
      <div className="p-5 sm:p-6 space-y-3 font-mono">
        {filteredTickets.length === 0 ? (
          <div className="py-8 text-center text-zinc-500 text-xs bg-black/40 rounded-2xl border border-white/5">
            No support tickets match the selected filter.
          </div>
        ) : (
          filteredTickets.map((tck) => (
            <div 
              key={tck.id} 
              className="p-4 rounded-2xl bg-black/40 border border-white/5 hover:border-white/15 transition-all space-y-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-white/5 text-cyan-300 rounded-full border border-white/10">
                    {tck.id}
                  </span>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-amber-500/10 text-amber-300 rounded-full border border-amber-500/30">
                    {tck.domain}
                  </span>
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border uppercase ${
                    tck.status === 'In Progress' ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' :
                    tck.status === 'Resolved' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' :
                    'bg-blue-500/20 text-blue-300 border-blue-500/40'
                  }`}>
                    {tck.status}
                  </span>
                </div>
                <h5 className="text-xs font-bold text-white font-sans">{tck.title}</h5>
                <p className="text-[10px] text-zinc-500">
                  Logged by {tck.requestor} on {tck.date} • {tck.time}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {tck.status !== 'Resolved' ? (
                  <button
                    type="button"
                    onClick={() => handleStatusUpdate(tck.id, 'Resolved')}
                    className="px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full text-xs font-bold transition-all cursor-pointer font-sans"
                  >
                    Mark Resolved
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleStatusUpdate(tck.id, 'In Progress')}
                    className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-zinc-400 border border-white/10 rounded-full text-xs font-bold transition-all cursor-pointer font-sans"
                  >
                    Reopen
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Raise Ticket Modal */}
      {showIssueModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-black/90 border border-white/10 w-full max-w-md rounded-3xl p-6 shadow-2xl space-y-4 relative animate-in zoom-in-95 backdrop-blur-2xl">
            
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-white/5 border border-white/10 rounded-xl text-amber-400">
                  <AlertTriangle className="w-4 h-4 stroke-[1.5]" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">
                    Raise {adminDomain === 'transport' ? 'Transport' : 'Event'} Support Ticket
                  </h3>
                  <p className="text-[11px] text-zinc-400 font-mono">
                    Dispatch issue to maintenance or tech team
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowIssueModal(false)}
                className="p-1 rounded-full hover:bg-white/10 text-zinc-400 cursor-pointer transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleRaiseTicket} className="space-y-3.5 text-xs font-sans">
              
              {/* Issue Title */}
              <div className="space-y-1">
                <label className="block font-mono font-bold text-zinc-300">
                  Issue Title <span className="text-amber-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder={adminDomain === 'transport' ? 'e.g. Bus 3 Tyre Pressure Low Sensor Warning' : 'e.g. Main Audi Stage Mic Wireless Dropouts'}
                  value={ticketTitle}
                  onChange={(e) => setTicketTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-black/60 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400/60 transition-all"
                />
              </div>

              {/* Priority & Domain */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block font-mono font-bold text-zinc-300">Category Domain</label>
                  <select
                    value={ticketDomain}
                    onChange={(e) => setTicketDomain(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-black/60 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400/60 transition-all"
                  >
                    {adminDomain === 'transport' ? (
                      <>
                        <option value="transport">Transport Fleet</option>
                        <option value="maintenance">Vehicle Maintenance</option>
                        <option value="station">Station Logistics</option>
                      </>
                    ) : (
                      <>
                        <option value="events">Event AV & Stage</option>
                        <option value="maintenance">HVAC Climate</option>
                        <option value="audi">Auditorium Hardware</option>
                      </>
                    )}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block font-mono font-bold text-zinc-300">Priority</label>
                  <select
                    value={ticketPriority}
                    onChange={(e) => setTicketPriority(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-black/60 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400/60 transition-all"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="block font-mono font-bold text-zinc-300">
                  Detailed Description <span className="text-amber-400">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Describe hardware fault, bus route issue, or support requirement..."
                  value={ticketDesc}
                  onChange={(e) => setTicketDesc(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-black/60 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400/60 transition-all"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setShowIssueModal(false)}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 text-zinc-400 rounded-full font-mono font-bold cursor-pointer transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-white/10 hover:bg-white/20 text-amber-300 border border-amber-500/40 rounded-full font-bold transition-all cursor-pointer"
                >
                  Submit Ticket
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
}
