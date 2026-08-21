import React from 'react';
import { AlertTriangle, CheckCircle2, X } from 'lucide-react';

export default function ResolveConfirmationModal({ isOpen, ticket, onConfirm, onCancel }) {
  if (!isOpen || !ticket) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="glass-panel w-full max-w-md p-6 rounded-2xl border border-amber-500/30 shadow-2xl relative space-y-4">
        
        {/* Header */}
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-amber-400">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">Confirm Ticket Resolution</h3>
            <p className="text-xs text-slate-400">Maintenance Sub-Admin Safeguard Verification</p>
          </div>
        </div>

        {/* Confirmation Body */}
        <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-2">
          <p className="font-semibold text-white">
            Are you sure you want to mark this issue as resolved?
          </p>
          <div className="pt-2 border-t border-slate-800 space-y-1 font-mono text-[11px] text-slate-400">
            <p><strong>Ticket ID:</strong> {ticket.ticket_id}</p>
            <p><strong>Title:</strong> {ticket.title}</p>
            <p><strong>Venue:</strong> {ticket.venue_name}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-3 pt-2">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-xl text-xs font-semibold transition-all cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(ticket.ticket_id, 'resolved')}
            className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-600/20 flex items-center justify-center space-x-1.5 cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Confirm Resolution</span>
          </button>
        </div>

      </div>
    </div>
  );
}
