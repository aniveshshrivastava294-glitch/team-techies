import React, { useState } from 'react';
import { AlertTriangle, Plus, X, CheckCircle2 } from 'lucide-react';

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
    <div className="w-full rounded-2xl border border-[#E8DCC8] bg-[#F7EFE4] shadow-xs overflow-hidden font-sans">
      {/* Toast Banner */}
      {toastMsg && (
        <div className="fixed top-20 right-6 bg-[#2B1D12] text-white text-xs px-4 py-2.5 rounded-xl shadow-xl z-50 flex items-center gap-2 border border-[#E8DCC8] animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-[#4E7A51]" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header Bar */}
      <div className="p-4 sm:p-5 flex flex-col gap-3 border-b border-[#E8DCC8]">
        
        {/* Top Row: Icon + Title + Active Count + Subtitle + Raise Ticket CTA */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg border border-[#BC4800]/30 bg-[#BC4800]/15 text-[#BC4800] shrink-0 mt-0.5">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-sm font-bold text-[#2B1D12] tracking-tight">
                  {title}
                </h3>
                <span className="text-xs font-semibold px-2.5 py-0.5 inst-badge-ochre shrink-0">
                  {activeTicketsCount} Active
                </span>
              </div>
              <p className="text-xs text-[#6B5A4A] font-medium line-clamp-1">
                {subtitle}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowIssueModal(true)}
            className="px-3.5 py-1.5 inst-button-primary text-xs font-medium flex items-center justify-center gap-1.5 shrink-0 shadow-xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Raise Ticket</span>
          </button>
        </div>

        {/* Bottom Row: Status Filter Pills */}
        <div className="flex items-center justify-between gap-2 pt-2 border-t border-[#E8DCC8]">
          <div className="flex items-center bg-[#FDF8F2] p-1 rounded-lg border border-[#E8DCC8] text-xs font-medium w-full sm:w-auto justify-between sm:justify-start">
            {['ALL', 'ACTIVE', 'RESOLVED'].map(st => (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                  statusFilter === st
                    ? 'bg-[#BC4800] text-white font-semibold shadow-xs'
                    : 'text-[#6B5A4A] hover:text-[#2B1D12] hover:bg-[#F7EFE4]'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tickets List Body */}
      <div className="p-4 sm:p-5 space-y-3">
        {filteredTickets.length === 0 ? (
          <div className="py-8 text-center text-[#6B5A4A] text-xs bg-[#FDF8F2] rounded-xl border border-[#E8DCC8]">
            No support tickets match the selected filter.
          </div>
        ) : (
          filteredTickets.map((tck) => (
            <div 
              key={tck.id} 
              className="p-3.5 rounded-xl bg-[#FDF8F2] border border-[#E8DCC8] space-y-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-semibold px-2 py-0.5 bg-[#F7EFE4] text-[#2B1D12] border border-[#E8DCC8] rounded-full">
                    {tck.id}
                  </span>
                  <span className="text-xs font-semibold px-2.5 py-0.5 bg-[#E3A857]/20 text-[#2B1D12] border border-[#E3A857]/40 rounded-full">
                    {tck.domain}
                  </span>
                  <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                    tck.status === 'In Progress' ? 'inst-badge-warning' :
                    tck.status === 'Resolved' ? 'inst-badge-success' :
                    'inst-badge-neutral'
                  }`}>
                    {tck.status}
                  </span>
                </div>
                <h5 className="text-xs font-bold text-[#2B1D12]">{tck.title}</h5>
                <p className="text-xs text-[#6B5A4A]">
                  Logged by {tck.requestor} on {tck.date} • {tck.time}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {tck.status !== 'Resolved' ? (
                  <button
                    type="button"
                    onClick={() => handleStatusUpdate(tck.id, 'Resolved')}
                    className="px-3.5 py-1.5 bg-[#4E7A51] hover:bg-[#3d6140] text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                  >
                    Mark Resolved
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleStatusUpdate(tck.id, 'In Progress')}
                    className="px-3.5 py-1.5 bg-[#FDF8F2] hover:bg-[#F7EFE4] text-[#2B1D12] border border-[#E8DCC8] rounded-lg text-xs font-medium transition-colors cursor-pointer"
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
        <div className="fixed inset-0 bg-[#2B1D12]/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-[#F7EFE4] border border-[#E8DCC8] w-full max-w-md rounded-2xl p-6 shadow-2xl space-y-4 relative animate-in zoom-in-95 font-sans">
            
            <div className="flex items-center justify-between pb-3 border-b border-[#E8DCC8]">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-[#BC4800]/15 border border-[#BC4800]/30 rounded-lg text-[#BC4800]">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#2B1D12]">
                    Raise {adminDomain === 'transport' ? 'Transport' : 'Event'} Support Ticket
                  </h3>
                  <p className="text-xs text-[#6B5A4A]">
                    Dispatch issue to maintenance or tech team
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowIssueModal(false)}
                className="p-1 rounded-lg hover:bg-[#FDF8F2] text-[#6B5A4A] cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleRaiseTicket} className="space-y-3.5 text-xs font-sans">
              
              {/* Issue Title */}
              <div className="space-y-1">
                <label className="block font-semibold text-[#2B1D12]">
                  Issue Title <span className="text-[#BC4800]">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder={adminDomain === 'transport' ? 'e.g. Bus 3 Tyre Pressure Low Sensor Warning' : 'e.g. Main Audi Stage Mic Wireless Dropouts'}
                  value={ticketTitle}
                  onChange={(e) => setTicketTitle(e.target.value)}
                  className="w-full px-3.5 py-2 bg-[#FDF8F2] border border-[#E8DCC8] rounded-lg text-xs text-[#2B1D12] placeholder-[#6B5A4A]/60 focus:outline-none focus:border-[#BC4800] transition-colors"
                />
              </div>

              {/* Priority & Domain */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block font-semibold text-[#2B1D12]">Category Domain</label>
                  <select
                    value={ticketDomain}
                    onChange={(e) => setTicketDomain(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FDF8F2] border border-[#E8DCC8] rounded-lg text-xs text-[#2B1D12] focus:outline-none focus:border-[#BC4800] transition-colors"
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
                  <label className="block font-semibold text-[#2B1D12]">Priority</label>
                  <select
                    value={ticketPriority}
                    onChange={(e) => setTicketPriority(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FDF8F2] border border-[#E8DCC8] rounded-lg text-xs text-[#2B1D12] focus:outline-none focus:border-[#BC4800] transition-colors"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="block font-semibold text-[#2B1D12]">
                  Detailed Description <span className="text-[#BC4800]">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Describe hardware fault, bus route issue, or support requirement..."
                  value={ticketDesc}
                  onChange={(e) => setTicketDesc(e.target.value)}
                  className="w-full px-3.5 py-2 bg-[#FDF8F2] border border-[#E8DCC8] rounded-lg text-xs text-[#2B1D12] placeholder-[#6B5A4A]/60 focus:outline-none focus:border-[#BC4800] transition-colors"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E8DCC8]">
                <button
                  type="button"
                  onClick={() => setShowIssueModal(false)}
                  className="px-4 py-2 bg-[#FDF8F2] hover:bg-[#F7EFE4] text-[#2B1D12] border border-[#E8DCC8] rounded-lg text-xs font-medium cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 inst-button-primary text-xs font-semibold cursor-pointer"
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

