import React, { useState, useEffect } from 'react';
import { UserCheck, AlertTriangle, CheckCircle2, Clock, Check, X, ShieldAlert } from 'lucide-react';

export default function AttendanceAdminWidget() {
  const [checkins, setCheckins] = useState(null);
  const [leaves, setLeaves] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Leave Action Confirmation Modal state
  const [selectedLeaveAction, setSelectedLeaveAction] = useState(null); // { leave, status: 'approved'|'rejected' }

  useEffect(() => {
    fetchAttendanceData();
  }, []);

  const fetchAttendanceData = async () => {
    setIsLoading(true);
    try {
      // Fetch Daily Staff Check-ins & Anomaly Alerts
      const cRes = await fetch('/api/leaves/daily-checkins');
      const cData = await cRes.json();
      if (cData.status === 'success') setCheckins(cData);

      // Fetch Faculty Leave Requests
      const lRes = await fetch('/api/leaves');
      const lData = await lRes.json();
      if (lData.status === 'success') setLeaves(lData.leaves || []);
    } catch (e) {
      console.error('Fetch attendance data error:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmLeaveAction = async () => {
    if (!selectedLeaveAction) return;

    const { leave, status } = selectedLeaveAction;

    try {
      const res = await fetch(`/api/leaves/${leave.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      const data = await res.json();
      if (data.status === 'success') {
        setSelectedLeaveAction(null);
        fetchAttendanceData();
      }
    } catch (e) {
      console.error('Update leave error:', e);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* 1. DAILY STAFF CHECK-IN MONITORING WIDGET */}
      <div className="inst-card p-6 border border-[#E8DCC8] bg-[#F7EFE4] shadow-xs space-y-4">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8DCC8]">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-[#BC4800]/15 border border-[#BC4800]/30 rounded-lg text-[#BC4800]">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#2B1D12] tracking-tight">Daily Staff Check-in & Roster Telemetry</h2>
              <p className="text-xs text-[#6B5A4A] mt-0.5">Real-time RFID gate check-ins cross-referenced against course timetables</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 text-xs">
            <div className="bg-[#FDF8F2] px-3 py-1.5 rounded-lg border border-[#E8DCC8] text-center">
              <span className="text-[#6B5A4A]">Checked In: </span>
              <strong className="text-[#4E7A51]">{checkins?.presentCount || 3} / {checkins?.totalScheduled || 4}</strong>
            </div>
            <div className="bg-[#A6402F]/15 px-3 py-1.5 rounded-lg border border-[#A6402F]/30 text-center">
              <span className="text-[#A6402F] font-semibold">Anomalies: </span>
              <strong className="text-[#A6402F]">{checkins?.anomaliesCount || 1}</strong>
            </div>
          </div>
        </div>

        {/* Check-ins Roster Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {checkins?.checkins?.map((item) => (
            <div
              key={item.id}
              className={`p-3.5 rounded-xl border flex items-center justify-between transition-colors ${
                item.status === 'ABSENT_ANOMALY'
                  ? 'bg-[#A6402F]/5 border-[#A6402F]/30'
                  : 'bg-[#FDF8F2] border-[#E8DCC8]'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-[#2B1D12] text-xs">{item.name}</span>
                  <span className="text-xs text-[#6B5A4A]">({item.email})</span>
                </div>
                {item.alert ? (
                  <p className="text-xs text-[#A6402F] font-medium flex items-center gap-1">
                    <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                    <span>{item.alert}</span>
                  </p>
                ) : (
                  <p className="text-xs text-[#6B5A4A] flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[#6B5A4A]" />
                    <span>Checked in at {item.time}</span>
                  </p>
                )}
              </div>

              <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${
                item.status === 'ABSENT_ANOMALY'
                  ? 'bg-[#A6402F]/15 text-[#A6402F] border-[#A6402F]/30'
                  : 'bg-[#4E7A51]/15 text-[#4E7A51] border-[#4E7A51]/30'
              }`}>
                {item.status === 'ABSENT_ANOMALY' ? 'Missing' : 'Present'}
              </span>
            </div>
          ))}
        </div>

      </div>

      {/* 2. LEAVE MANAGEMENT BOARD */}
      <div className="inst-card p-6 border border-[#E8DCC8] bg-[#F7EFE4] shadow-xs space-y-4">
        
        <div className="pb-4 border-b border-[#E8DCC8]">
          <h2 className="text-sm font-bold text-[#2B1D12] tracking-tight">Faculty Leave Approval Queue</h2>
          <p className="text-xs text-[#6B5A4A] mt-0.5">Review and verify faculty leave applications</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* PENDING QUEUE */}
          <div className="bg-[#FDF8F2] p-4 rounded-xl border border-[#E8DCC8] space-y-3">
            <span className="font-semibold text-xs text-[#C48A2E] uppercase tracking-wider block border-b border-[#E8DCC8] pb-2">
              Pending Applications ({leaves.filter(l => l.status === 'pending').length})
            </span>
            {leaves.filter(l => l.status === 'pending').map(l => (
              <div key={l.id} className="bg-[#F7EFE4] p-3.5 rounded-lg border border-[#E8DCC8] space-y-2 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-[#2B1D12] text-xs">{l.faculty_name}</span>
                  <span className="px-2.5 py-0.5 text-xs font-semibold inst-badge-ochre">
                    {l.leave_type}
                  </span>
                </div>
                <p className="text-xs text-[#6B5A4A]">"{l.reason}"</p>
                <p className="text-xs text-[#6B5A4A]">Dates: {l.start_date} to {l.end_date}</p>

                <div className="flex items-center space-x-2 pt-2 border-t border-[#E8DCC8]">
                  <button
                    onClick={() => setSelectedLeaveAction({ leave: l, status: 'approved' })}
                    className="flex-1 py-1.5 bg-[#4E7A51] hover:bg-[#3D6140] text-white rounded-lg text-xs font-semibold flex items-center justify-center space-x-1 cursor-pointer transition-colors"
                  >
                    <Check className="w-3 h-3" />
                    <span>Approve</span>
                  </button>
                  <button
                    onClick={() => setSelectedLeaveAction({ leave: l, status: 'rejected' })}
                    className="py-1.5 px-3 bg-[#A6402F]/15 hover:bg-[#A6402F]/25 text-[#A6402F] border border-[#A6402F]/30 rounded-lg text-xs font-semibold cursor-pointer transition-colors"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* APPROVED LEAVES */}
          <div className="bg-[#FDF8F2] p-4 rounded-xl border border-[#E8DCC8] space-y-3">
            <span className="font-semibold text-xs text-[#4E7A51] uppercase tracking-wider block border-b border-[#E8DCC8] pb-2">
              Approved Leaves ({leaves.filter(l => l.status === 'approved').length})
            </span>
            {leaves.filter(l => l.status === 'approved').map(l => (
              <div key={l.id} className="bg-[#F7EFE4] p-3.5 rounded-lg border border-[#E8DCC8] space-y-1 shadow-2xs">
                <span className="font-semibold text-[#2B1D12] text-xs block">{l.faculty_name}</span>
                <p className="text-xs text-[#6B5A4A]">{l.reason}</p>
                <span className="text-xs text-[#4E7A51] font-semibold block">Approved</span>
              </div>
            ))}
          </div>

          {/* REJECTED LEAVES */}
          <div className="bg-[#FDF8F2] p-4 rounded-xl border border-[#E8DCC8] space-y-3">
            <span className="font-semibold text-xs text-[#6B5A4A] uppercase tracking-wider block border-b border-[#E8DCC8] pb-2">
              Rejected Requests ({leaves.filter(l => l.status === 'rejected').length})
            </span>
            {leaves.filter(l => l.status === 'rejected').map(l => (
              <div key={l.id} className="bg-[#F7EFE4] p-3.5 rounded-lg border border-[#E8DCC8] space-y-1 shadow-2xs">
                <span className="font-semibold text-[#6B5A4A] text-xs block">{l.faculty_name}</span>
                <p className="text-xs text-[#6B5A4A] line-through">{l.reason}</p>
              </div>
            ))}
          </div>

        </div>

      </div>

      {/* LEAVE ACTION CONFIRMATION MODAL */}
      {selectedLeaveAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2B1D12]/60 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-md p-6 rounded-2xl bg-[#F7EFE4] border border-[#E8DCC8] shadow-xl space-y-4 font-sans">
            
            <div className="flex items-center space-x-3">
              <div className="p-2.5 bg-[#C48A2E]/15 border border-[#C48A2E]/30 rounded-xl text-[#C48A2E]">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#2B1D12]">Confirm Leave Status Update</h3>
                <p className="text-xs text-[#6B5A4A]">Attendance Sub-Admin Action Verification</p>
              </div>
            </div>

            <div className="bg-[#FDF8F2] p-4 rounded-xl border border-[#E8DCC8] text-xs text-[#6B5A4A] space-y-2">
              <p className="font-medium text-[#2B1D12]">
                Are you sure you want to mark {selectedLeaveAction.leave.faculty_name}'s leave request as <strong className="uppercase text-[#BC4800]">{selectedLeaveAction.status}</strong>?
              </p>
              <div className="pt-2 border-t border-[#E8DCC8] text-xs space-y-1">
                <p>Reason: "{selectedLeaveAction.leave.reason}"</p>
                <p>Type: {selectedLeaveAction.leave.leave_type}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 pt-2">
              <button
                onClick={() => setSelectedLeaveAction(null)}
                className="flex-1 py-2 bg-[#FDF8F2] hover:bg-[#F7EFE4] text-[#2B1D12] border border-[#E8DCC8] rounded-lg text-xs font-semibold cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmLeaveAction}
                className="flex-1 py-2 inst-button-primary text-xs font-semibold cursor-pointer"
              >
                Confirm Update
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

