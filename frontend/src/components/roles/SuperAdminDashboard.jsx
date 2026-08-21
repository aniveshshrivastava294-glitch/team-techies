import React, { useState, useEffect } from 'react';
import KpiOverview from '../KpiOverview';
import AnomaliesPanel from '../AnomaliesPanel';
import ChatWidget from '../ChatWidget';
import Visualizers from '../Visualizers';
import DomainDataTables from '../DomainDataTables';
import BulkFacultyUploadModal from '../BulkFacultyUploadModal';
import LiveCampusTicker from '../LiveCampusTicker';
import { UserCheck, ShieldCheck, Check, X, Sparkles, Upload } from 'lucide-react';

export default function SuperAdminDashboard({ kpis, anomalies, recommendations, isRefreshing, onRefresh }) {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [actionLoading, setActionLoading] = useState(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);

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
      
      {/* Live Campus Telemetry Ticker Marquee */}
      <LiveCampusTicker />

      {/* Super Admin Actions: Sub-Admin Approvals & AI Bulk Faculty Extraction */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Pending Sub-Admin Registrations */}
        <div className="lg:col-span-8 inst-card p-6 border border-stone-300 dark:border-stone-800">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-stone-200 dark:border-stone-800">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-[#B5654A]/10 border border-[#B5654A]/30 rounded text-[#B5654A]">
                <UserCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-serif font-bold text-stone-900 dark:text-stone-100 tracking-tight">Pending Staff Approvals</h2>
                  <span className="px-2 py-0.5 text-xs font-mono font-bold inst-badge-ochre">
                    {pendingUsers.length} Action Required
                  </span>
                </div>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                  Review and approve access requests for staff members
                </p>
              </div>
            </div>
          </div>

          {pendingUsers.length === 0 ? (
            <div className="py-6 text-center text-stone-500 dark:text-stone-400 text-xs bg-stone-50 dark:bg-stone-950 rounded border border-stone-200 dark:border-stone-800 flex items-center justify-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-[#5C6E3F]" />
              <span>No pending accounts awaiting approval. All accounts are verified.</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {pendingUsers.map((user) => (
                <div key={user.id} className="bg-stone-50 dark:bg-stone-950 p-3.5 rounded border border-stone-200 dark:border-stone-800 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-stone-900 dark:text-stone-100">{user.full_name || user.email}</span>
                      <span className="px-2 py-0.5 text-[10px] font-mono font-bold uppercase inst-badge-ochre">
                        {user.department_domain} Admin
                      </span>
                    </div>
                    <p className="text-xs text-stone-500 dark:text-stone-400 font-mono mb-2">{user.email}</p>
                  </div>

                  <div className="flex items-center space-x-2 pt-2 border-t border-stone-200 dark:border-stone-800">
                    <button
                      onClick={() => handleApproveUser(user.id, 'approved')}
                      disabled={actionLoading === user.id}
                      className="flex-1 py-1.5 bg-[#5C6E3F] hover:bg-[#4B5B32] text-white rounded text-xs font-semibold transition-colors flex items-center justify-center space-x-1 cursor-pointer disabled:opacity-50"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Approve</span>
                    </button>
                    <button
                      onClick={() => handleApproveUser(user.id, 'rejected')}
                      disabled={actionLoading === user.id}
                      className="py-1.5 px-3 bg-[#A64B34]/10 hover:bg-[#A64B34]/20 text-[#A64B34] border border-[#A64B34]/30 rounded text-xs font-semibold transition-colors flex items-center justify-center space-x-1 cursor-pointer"
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

        {/* Right: Universal Multi-Batch AI Data Intaker Hero Card */}
        <div className="lg:col-span-4 inst-card p-6 border border-stone-300 dark:border-stone-800 flex flex-col justify-between space-y-4 font-sans">
          <div>
            <div className="w-9 h-9 bg-[#B5654A]/10 border border-[#B5654A]/30 rounded flex items-center justify-center text-[#B5654A] mb-3">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-base font-serif font-bold text-stone-900 dark:text-stone-100 tracking-tight flex items-center gap-2">
              Universal Multi-Batch AI Data Intaker
              <span className="px-2 py-0.5 text-[9px] font-mono font-bold inst-badge-ochre">
                AI Advisor
              </span>
            </h3>
            <p className="text-xs text-stone-600 dark:text-stone-400 mt-1 leading-relaxed">
              Feed CSV, JSON, or unstructured text unlimited times into Faculty, Transport, Energy, Classroom, or Maintenance databases. Features real-time AI placement guidance chatbox.
            </p>
          </div>

          <button
            onClick={() => setIsUploadOpen(true)}
            className="w-full py-2.5 inst-button-primary text-xs flex items-center justify-center space-x-2 cursor-pointer shadow-sm font-mono"
          >
            <Upload className="w-4 h-4" />
            <span>Open Universal AI Data Intaker</span>
          </button>
        </div>

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

      {/* AI Bulk Faculty Upload Modal */}
      <BulkFacultyUploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onSuccess={() => {
          onRefresh();
          fetchPendingUsers();
        }}
      />

    </div>
  );
}
