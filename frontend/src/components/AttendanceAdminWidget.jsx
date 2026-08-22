import React, { useState, useEffect } from 'react';
import { UserCheck, AlertTriangle, CheckCircle2, Clock, Check, X, ShieldAlert } from 'lucide-react';
import { getApiUrl } from '../apiConfig';

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
      const cRes = await fetch(getApiUrl('/api/leaves/daily-checkins'));
      const cData = await cRes.json();
      if (cData.status === 'success') setCheckins(cData);

      // Fetch Faculty Leave Requests
      const lRes = await fetch(getApiUrl('/api/leaves'));
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
      const res = await fetch(getApiUrl(`/api/leaves/${leave.id}`), {
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
    <div className="space-y-6">
      
      {/* 1. DAILY STAFF CHECK-IN MONITORING WIDGET */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-blue-500/10 border border-blue-500/30 rounded-xl text-blue-400">
              <UserCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">Daily Staff Check-in & Anomaly Monitor</h2>
              <p className="text-xs text-slate-400">Real-time RFID gate check-ins cross-referenced against course timetables</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 text-xs">
            <div className="bg-slate-900 px-3.5 py-1.5 rounded-xl border border-slate-800 text-center font-mono">
              <span className="text-slate-400">Checked In: </span>
              <strong className="text-emerald-400">{checkins?.presentCount || 3} / {checkins?.totalScheduled || 4}</strong>
            </div>
            <div className="bg-red-950/40 px-3.5 py-1.5 rounded-xl border border-red-500/30 text-center font-mono">
              <span className="text-red-400 font-bold">Anomalies: </span>
              <strong className="text-red-300">{checkins?.anomaliesCount || 1}</strong>
            </div>
          </div>
        </div>

        {/* Check-ins Roster Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {checkins?.checkins?.map((item) => (
            <div
              key={item.id}
              className={`p-4 rounded-xl border flex items-center justify-between transition-all ${
                item.status === 'ABSENT_ANOMALY'
                  ? 'bg-red-950/20 border-red-500/40'
                  : 'bg-slate-900/90 border-slate-800'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-white text-xs">{item.name}</span>
                  <span className="text-[10px] text-slate-400 font-mono">({item.email})</span>
                </div>
                {item.alert ? (
                  <p className="text-[11px] text-red-400 font-medium flex items-center gap-1">
                    <ShieldAlert className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>{item.alert}</span>
                  </p>
                ) : (
                  <p className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-blue-400" />
                    <span>Checked in at {item.time}</span>
                  </p>
                )}
              </div>

              <span className={`px-2.5 py-1 text-[10px] font-bold uppercase rounded-md border ${
                item.status === 'ABSENT_ANOMALY'
                  ? 'bg-red-500/20 text-red-300 border-red-500/30 animate-pulse'
                  : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
              }`}>
                {item.status === 'ABSENT_ANOMALY' ? 'Missing Check-in' : 'Present'}
              </span>
            </div>
          ))}
        </div>

      </div>

      {/* 2. LEAVE MANAGEMENT BOARD (KANBAN STYLE) */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        
        <div className="pb-3 border-b border-slate-800">
          <h2 className="text-base font-bold text-white tracking-tight">Faculty Leave Request Kanban Board</h2>
          <p className="text-xs text-slate-400 mt-0.5">Click Approve or Reject to trigger state-change confirmation</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* PENDING QUEUE */}
          <div className="bg-slate-950/80 p-4 rounded-xl border border-amber-500/30 space-y-3">
            <span className="font-bold text-xs text-amber-400 uppercase tracking-wider block border-b border-slate-800 pb-2">
              Pending Applications ({leaves.filter(l => l.status === 'pending').length})
            </span>
            {leaves.filter(l => l.status === 'pending').map(l => (
              <div key={l.id} className="bg-slate-900 p-3.5 rounded-lg border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-xs">{l.faculty_name}</span>
                  <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded">
                    {l.leave_type}
                  </span>
                </div>
                <p className="text-[11px] text-slate-300">"{l.reason}"</p>
                <p className="text-[10px] text-slate-500 font-mono">Dates: {l.start_date} to {l.end_date}</p>

                <div className="flex items-center space-x-2 pt-2 border-t border-slate-800">
                  <button
                    onClick={() => setSelectedLeaveAction({ leave: l, status: 'approved' })}
                    className="flex-1 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-[11px] font-semibold flex items-center justify-center space-x-1 cursor-pointer"
                  >
                    <Check className="w-3 h-3" />
                    <span>Approve</span>
                  </button>
                  <button
                    onClick={() => setSelectedLeaveAction({ leave: l, status: 'rejected' })}
                    className="py-1 px-2.5 bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/30 rounded text-[11px] font-semibold cursor-pointer"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* APPROVED LEAVES */}
          <div className="bg-slate-950/80 p-4 rounded-xl border border-emerald-500/30 space-y-3">
            <span className="font-bold text-xs text-emerald-400 uppercase tracking-wider block border-b border-slate-800 pb-2">
              Approved Leaves ({leaves.filter(l => l.status === 'approved').length})
            </span>
            {leaves.filter(l => l.status === 'approved').map(l => (
              <div key={l.id} className="bg-slate-900/60 p-3.5 rounded-lg border border-slate-800/80 space-y-1">
                <span className="font-bold text-slate-200 text-xs block">{l.faculty_name}</span>
                <p className="text-[11px] text-slate-400">{l.reason}</p>
                <span className="text-[10px] text-emerald-400 font-semibold block">Approved ✓</span>
              </div>
            ))}
          </div>

          {/* REJECTED LEAVES */}
          <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-3">
            <span className="font-bold text-xs text-slate-400 uppercase tracking-wider block border-b border-slate-800 pb-2">
              Rejected Requests ({leaves.filter(l => l.status === 'rejected').length})
            </span>
            {leaves.filter(l => l.status === 'rejected').map(l => (
              <div key={l.id} className="bg-slate-900/40 p-3.5 rounded-lg border border-slate-800/60 space-y-1">
                <span className="font-bold text-slate-400 text-xs block">{l.faculty_name}</span>
                <p className="text-[11px] text-slate-500 line-through">{l.reason}</p>
              </div>
            ))}
          </div>

        </div>

      </div>

      {/* LEAVE ACTION CONFIRMATION MODAL */}
      {selectedLeaveAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="glass-panel w-full max-w-md p-6 rounded-2xl border border-blue-500/30 shadow-2xl space-y-4">
            
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-2xl text-blue-400">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Confirm Leave Status Update</h3>
                <p className="text-xs text-slate-400">Attendance Sub-Admin Action Verification</p>
              </div>
            </div>

            <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-2">
              <p className="font-semibold text-white">
                Are you sure you want to mark {selectedLeaveAction.leave.faculty_name}'s leave request as <strong className="uppercase text-blue-400">{selectedLeaveAction.status}</strong>?
              </p>
              <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 space-y-1 font-mono">
                <p>Reason: "{selectedLeaveAction.leave.reason}"</p>
                <p>Type: {selectedLeaveAction.leave.leave_type}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 pt-2">
              <button
                onClick={() => setSelectedLeaveAction(null)}
                className="flex-1 py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-xl text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmLeaveAction}
                className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs shadow-md shadow-blue-600/20 cursor-pointer"
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
