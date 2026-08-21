import React, { useState, useEffect } from 'react';
import KpiOverview from '../KpiOverview';
import AnomaliesPanel from '../AnomaliesPanel';
import ChatWidget from '../ChatWidget';
import Visualizers from '../Visualizers';
import DomainDataTables from '../DomainDataTables';
import { UserCheck, ShieldCheck, Check, X, Clock, AlertCircle } from 'lucide-react';

export default function SuperAdminDashboard({ kpis, anomalies, recommendations, isRefreshing, onRefresh }) {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    fetchPendingUsers();
  }, []);

  const fetchPendingUsers = async () => {
    try {
      const res = await fetch('/api/auth/pending-users');
      const data = await res.json();
      if (data.status === 'success') {
        setPendingUsers(data.pending || []);
      }
    } catch (e) {
      console.error('Error fetching pending users:', e);
    }
  };

  const handleApproveUser = async (userId, status) => {
    setActionLoading(userId);
    try {
      const res = await fetch('/api/auth/approve-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, status })
      });
      const data = await res.json();
      if (data.status === 'success') {
        fetchPendingUsers();
        onRefresh();
      }
    } catch (e) {
      console.error('Error updating approval status:', e);
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Pending Sub-Admin Registration Approvals Card */}
      <div className="glass-panel p-6 rounded-2xl border border-purple-500/30 glow-purple">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-purple-500/10 border border-purple-500/30 rounded-xl text-purple-400">
              <UserCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white tracking-tight">Pending Sub-Admin Registrations</h2>
                <span className="px-2 py-0.5 text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-full">
                  {pendingUsers.length} Action Required
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Review and approve domain access requests for Event, Transport, and Maintenance Sub-Admins
              </p>
            </div>
          </div>
        </div>

        {pendingUsers.length === 0 ? (
          <div className="py-6 text-center text-slate-400 text-xs bg-slate-900/40 rounded-xl border border-slate-800 flex items-center justify-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>No pending Sub-Admin registrations awaiting approval. All accounts verified.</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {pendingUsers.map((user) => (
              <div key={user.id} className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-white">{user.full_name || user.email}</span>
                    <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-md">
                      {user.department_domain} Admin
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 font-mono mb-3">{user.email}</p>
                </div>

                <div className="flex items-center space-x-2 pt-2 border-t border-slate-800">
                  <button
                    onClick={() => handleApproveUser(user.id, 'approved')}
                    disabled={actionLoading === user.id}
                    className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold transition-all flex items-center justify-center space-x-1 cursor-pointer disabled:opacity-50"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Approve</span>
                  </button>
                  <button
                    onClick={() => handleApproveUser(user.id, 'rejected')}
                    disabled={actionLoading === user.id}
                    className="py-1.5 px-3 bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/30 rounded-lg text-xs font-semibold transition-all flex items-center justify-center space-x-1 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Reject</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Master Executive KPI Overview */}
      <KpiOverview kpis={kpis} />

      {/* Top Grid: Anomalies & Role AI Co-Pilot */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <AnomaliesPanel
            anomalies={anomalies}
            recommendations={recommendations}
            isLoading={isRefreshing}
          />
        </div>

        <div className="lg:col-span-5">
          <ChatWidget />
        </div>
      </div>

      {/* Recharts Visualizers */}
      <Visualizers kpis={kpis} anomalies={anomalies} />

      {/* Domain Inspector */}
      <DomainDataTables />

    </div>
  );
}
