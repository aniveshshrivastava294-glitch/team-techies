import React from 'react';
import { useAuth, demoAccounts } from '../context/AuthContext';
import { Clock, ShieldAlert, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function PendingApprovalView() {
  const { currentUser, switchDemoRole } = useAuth();
  const superAccount = demoAccounts.find(a => a.role === 'super_admin');

  return (
    <div className="max-w-2xl mx-auto py-16 px-4">
      <div className="glass-panel p-8 rounded-3xl border border-amber-500/30 text-center space-y-6 shadow-2xl glow-amber">
        
        <div className="w-16 h-16 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center justify-center text-amber-400 mx-auto animate-pulse">
          <Clock className="w-8 h-8" />
        </div>

        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Sub-Admin Registration Pending Approval
          </h2>
          <p className="text-sm text-slate-300 mt-2 max-w-md mx-auto">
            Welcome, <strong className="text-white">{currentUser?.full_name || currentUser?.email}</strong>. Your Sub-Admin request for domain <span className="text-amber-400 font-bold uppercase">{currentUser?.department_domain}</span> has been submitted to campus administration.
          </p>
        </div>

        <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 text-xs text-slate-400 space-y-2 text-left">
          <div className="flex items-center space-x-2 text-amber-400 font-semibold">
            <ShieldAlert className="w-4 h-4" />
            <span>Operational Boundary Notice:</span>
          </div>
          <p className="leading-relaxed">
            Per campus security policy, Sub-Admin permissions require verification by the Super Admin before accessing domain control dashboards (Event booking approvals, Transport fleet management, or Maintenance Kanban boards).
          </p>
        </div>

        {/* Demo Fast-Forward Helper */}
        <div className="pt-2">
          <p className="text-xs text-slate-400 mb-3">
            💡 <strong>Hackathon Demo Tip:</strong> Switch to the Super Admin account to approve this account right now:
          </p>
          <button
            onClick={() => switchDemoRole(superAccount)}
            className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-purple-600/20 inline-flex items-center space-x-2 cursor-pointer"
          >
            <span>Switch to Super Admin (super@demo.com)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}
