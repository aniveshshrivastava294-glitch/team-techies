import React, { useState } from 'react';
import { AlertTriangle, Plus, X, CheckCircle2 } from 'lucide-react';

export default function TicketsSupportLogCard({ 
  adminDomain = 'events', 
  title = 'Support & Maintenance Tickets',
  subtitle = 'Track maintenance, IT support, AV repairs, and facility tickets' 
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
    showToast(`Logged ticket ${newTck.id} successfully!`);
  };

  const handleStatusUpdate = (tckId, newStatus) => {
    setTickets(prev => prev.map(t => t.id === tckId ? { ...t, status: newStatus } : t));
    showToast(`Updated ticket ${tckId} status to ${newStatus}`);
  };

  const activeTicketsCount = tickets.filter(t => t.status !== 'Resolved').length;

  const filteredTickets = tickets.filter(t => {
    if (statusFilter === 'ACTIVE') return t.status !== 'Resolved';
    if (statusFilter === 'RESOLVED') return t.status === 'Resolved';
    return true;
  });

  return (
    <div className="card-surface p-5 mb-6 font-sans shadow-2xs">
      {/* Toast Banner */}
      {toastMsg && (
        <div className="fixed top-16 right-6 bg-[#1C1917] text-[#FAF8F3] text-xs px-4 py-2.5 rounded-md shadow-md z-50 flex items-center gap-2 font-mono font-bold">
          <CheckCircle2 className="w-4 h-4 text-white" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 mb-4 border-b border-[#E6E0D2]">
        <div className="flex items-start gap-2.5">
          <div className="p-2 rounded-md bg-[#F0EBE1] text-[#1C1917] border border-[#E6E0D2] shrink-0">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm font-bold text-[#1C1917]">
                {title}
              </h3>
              <span className="badge-mono-dark text-[10px]">
                {activeTicketsCount} Active
              </span>
            </div>
            <p className="text-xs text-[#57534E] font-medium mt-0.5">
              {subtitle}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center space-x-1 border-b border-[#E6E0D2] sm:border-b-0">
            {['ALL', 'ACTIVE', 'RESOLVED'].map(st => (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`px-2.5 py-1 text-xs font-semibold cursor-pointer transition-colors ${
                  statusFilter === st ? 'nav-tab-active' : 'nav-tab-inactive'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setShowIssueModal(true)}
            className="btn-primary text-xs py-1 px-3"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Raise Ticket</span>
          </button>
        </div>
      </div>

      {/* Tickets List Body */}
      <div className="space-y-2.5">
        {filteredTickets.length === 0 ? (
          <div className="py-6 text-center text-[#57534E] text-xs bg-[#F0EBE1] rounded-lg border border-[#E6E0D2] font-semibold">
            No support tickets match the selected filter.
          </div>
        ) : (
          filteredTickets.map((tck) => (
            <div 
              key={tck.id} 
              className="p-3.5 rounded-lg bg-[#FAF8F3] border border-[#E6E0D2] hover:border-[#1C1917] transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs"
            >
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-xs font-bold text-[#1C1917]">
                    {tck.id}
                  </span>
                  <span className="badge-mono text-[10px]">
                    {tck.domain}
                  </span>
                  <span className={`text-[10px] ${
                    tck.status === 'In Progress' ? 'badge-mono-dark' :
                    tck.status === 'Resolved' ? 'badge-mono' :
                    'badge-mono'
                  }`}>
                    {tck.status}
                  </span>
                </div>
                <h5 className="text-xs font-bold text-[#1C1917] truncate">{tck.title}</h5>
                <p className="text-[11px] text-[#57534E] font-mono font-medium">
                  Logged by {tck.requestor} on {tck.date} • {tck.time}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0 self-start sm:self-center">
                {tck.status !== 'Resolved' ? (
                  <button
                    type="button"
                    onClick={() => handleStatusUpdate(tck.id, 'Resolved')}
                    className="btn-primary text-xs py-1 px-3"
                  >
                    Mark Resolved
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleStatusUpdate(tck.id, 'In Progress')}
                    className="btn-secondary text-xs py-1 px-3 text-[#1C1917] font-semibold"
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
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 font-sans">
          <div className="bg-[#FAF8F3] border border-[#E6E0D2] w-full max-w-md rounded-lg p-6 shadow-xl space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b border-[#E6E0D2]">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-[#1C1917]" />
                <h3 className="text-sm font-bold text-[#1C1917]">
                  Raise New Support Ticket
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowIssueModal(false)}
                className="p-1 rounded text-[#78716C] hover:text-[#1C1917] hover:bg-[#F0EBE1] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleRaiseTicket} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-[#1C1917] mb-1">
                  Issue Title <span className="text-[#1C1917]">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Laser Projector HDMI Port Signal Loss"
                  value={ticketTitle}
                  onChange={(e) => setTicketTitle(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-[#E6E0D2] rounded text-xs text-[#1C1917] focus:outline-none focus:border-[#1C1917] font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-[#1C1917] mb-1">Category Domain</label>
                  <select
                    value={ticketDomain}
                    onChange={(e) => setTicketDomain(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-[#E6E0D2] rounded text-xs text-[#1C1917] focus:outline-none focus:border-[#1C1917] font-medium"
                  >
                    <option value="events">Event AV & Stage</option>
                    <option value="transport">Transport Fleet</option>
                    <option value="maintenance">HVAC & Facility</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-[#1C1917] mb-1">Priority</label>
                  <select
                    value={ticketPriority}
                    onChange={(e) => setTicketPriority(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-[#E6E0D2] rounded text-xs text-[#1C1917] focus:outline-none focus:border-[#1C1917] font-medium"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#1C1917] mb-1">
                  Detailed Description <span className="text-[#1C1917]">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Describe hardware fault, room location, or support requirement..."
                  value={ticketDesc}
                  onChange={(e) => setTicketDesc(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-[#E6E0D2] rounded text-xs text-[#1C1917] focus:outline-none focus:border-[#1C1917] font-medium"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#E6E0D2]">
                <button
                  type="button"
                  onClick={() => setShowIssueModal(false)}
                  className="btn-secondary text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary text-xs"
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
