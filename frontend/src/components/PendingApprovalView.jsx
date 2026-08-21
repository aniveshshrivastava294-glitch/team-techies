import React from 'react';
import { useAuth, demoAccounts } from '../context/AuthContext';
import { Clock, ShieldAlert, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function PendingApprovalView() {
  const { currentUser, switchDemoRole } = useAuth();
  const superAccount = demoAccounts.find(a => a.role === 'super_admin');

  return (
    <div className="max-w-2xl mx-auto py-12 px-4 font-sans">
      <div className="inst-card p-8 rounded border border-stone-300 dark:border-stone-800 text-center space-y-5 bg-white dark:bg-stone-900 shadow-sm">
        
        <div className="w-12 h-12 bg-[#C79A45]/10 border border-[#C79A45]/30 rounded flex items-center justify-center text-[#C79A45] mx-auto">
          <Clock className="w-6 h-6" />
        </div>

        <div>
          <h2 className="text-xl font-serif font-bold text-stone-900 dark:text-stone-100 tracking-tight">
            Account Approval Pending
          </h2>
          <p className="text-xs text-stone-600 dark:text-stone-400 mt-2 max-w-md mx-auto">
            Welcome, <strong className="text-stone-900 dark:text-stone-100">{currentUser?.full_name || currentUser?.email}</strong>. Your requested account for department <span className="text-[#B5654A] font-bold uppercase">{currentUser?.department_domain}</span> is undergoing review by campus administration.
          </p>
        </div>

        <div className="bg-stone-50 dark:bg-stone-950 p-4 rounded border border-stone-200 dark:border-stone-800 text-xs text-stone-600 dark:text-stone-400 space-y-1.5 text-left">
          <div className="flex items-center space-x-2 text-[#C79A45] font-bold">
            <ShieldAlert className="w-4 h-4" />
            <span>Admin Notice:</span>
          </div>
          <p className="leading-relaxed">
            Your account is pending review by the administrator before accessing department management features.
          </p>
        </div>

        {/* Demo Helper */}
        <div className="pt-2">
          <p className="text-xs text-stone-500 dark:text-stone-400 mb-2">
            Switch to the Super Admin account to approve this account right now:
          </p>
          <button
            onClick={() => switchDemoRole(superAccount)}
            className="px-4 py-2 inst-button-primary text-xs inline-flex items-center space-x-2 cursor-pointer shadow-sm"
          >
            <span>Switch to Super Admin (super@demo.com)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}
