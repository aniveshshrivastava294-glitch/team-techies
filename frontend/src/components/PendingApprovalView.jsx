import React from 'react';
import { useAuth, demoAccounts } from '../context/AuthContext';
import { Clock, ShieldAlert, ArrowRight } from 'lucide-react';

export default function PendingApprovalView() {
  const { currentUser, switchDemoRole } = useAuth();
  const superAccount = demoAccounts.find(a => a.role === 'super_admin');

  return (
    <div className="max-w-2xl mx-auto py-12 px-4 font-sans">
      <div className="inst-card p-8 rounded-2xl border border-[#E2DED4] text-center space-y-5 bg-[#DCD7CC] shadow-xs">
        
        <div className="w-12 h-12 bg-[#C48A2E]/15 border border-[#C48A2E]/30 rounded-xl flex items-center justify-center text-[#C48A2E] mx-auto">
          <Clock className="w-6 h-6" />
        </div>

        <div>
          <h2 className="text-xl font-bold text-[#1F2A38] tracking-tight">
            Account Approval Pending
          </h2>
          <p className="text-xs text-[#8A8578] mt-2 max-w-md mx-auto">
            Welcome, <strong className="text-[#1F2A38]">{currentUser?.full_name || currentUser?.email}</strong>. Your requested account for department <span className="text-[#3E5C76] font-bold uppercase">{currentUser?.department_domain}</span> is undergoing review by campus administration.
          </p>
        </div>

        <div className="bg-[#F5F4F0] p-4 rounded-xl border border-[#E2DED4] text-xs text-[#8A8578] space-y-1.5 text-left">
          <div className="flex items-center space-x-2 text-[#C48A2E] font-bold">
            <ShieldAlert className="w-4 h-4" />
            <span>Admin Notice:</span>
          </div>
          <p className="leading-relaxed">
            Your account is pending review by the administrator before accessing department management features.
          </p>
        </div>

        {/* Demo Helper */}
        <div className="pt-2">
          <p className="text-xs text-[#8A8578] mb-2 font-medium">
            Switch to the Super Admin account to approve this account right now:
          </p>
          <button
            onClick={() => switchDemoRole(superAccount)}
            className="px-5 py-2.5 inst-button-primary text-xs inline-flex items-center space-x-2 cursor-pointer shadow-xs font-semibold"
          >
            <span>Switch to Super Admin (super@demo.com)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}

