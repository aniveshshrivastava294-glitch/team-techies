import React from 'react';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function ResolveConfirmationModal({ isOpen, ticket, onConfirm, onCancel }) {
  if (!isOpen || !ticket) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1F2A38]/60 backdrop-blur-xs font-sans">
      <div className="inst-card w-full max-w-md p-6 rounded-2xl border border-[#E2DED4] bg-[#DCD7CC] shadow-2xl relative space-y-4 font-sans">
        
        {/* Header */}
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-[#C48A2E]/15 border border-[#C48A2E]/30 rounded-xl text-[#C48A2E]">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#1F2A38] tracking-tight">Confirm Ticket Resolution</h3>
            <p className="text-xs text-[#8A8578]">Maintenance Sub-Admin Safeguard Verification</p>
          </div>
        </div>

        {/* Confirmation Body */}
        <div className="bg-[#F5F4F0] p-4 rounded-xl border border-[#E2DED4] text-xs text-[#8A8578] space-y-2">
          <p className="font-semibold text-[#1F2A38]">
            Are you sure you want to mark this issue as resolved?
          </p>
          <div className="pt-2 border-t border-[#E2DED4] space-y-1 text-xs text-[#8A8578]">
            <p><strong>Ticket ID:</strong> {ticket.ticket_id}</p>
            <p><strong>Title:</strong> {ticket.title}</p>
            <p><strong>Venue:</strong> {ticket.venue_name}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-3 pt-2">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 bg-[#F5F4F0] hover:bg-[#DCD7CC] text-[#1F2A38] border border-[#E2DED4] rounded-xl text-xs font-semibold transition-all cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(ticket.ticket_id, 'resolved')}
            className="flex-1 py-2.5 bg-[#4E7A51] hover:bg-[#3D6140] text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center space-x-1.5 cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Confirm Resolution</span>
          </button>
        </div>

      </div>
    </div>
  );
}

