import React, { useState, useEffect } from 'react';
import KpiOverview from '../KpiOverview';
import AnomaliesPanel from '../AnomaliesPanel';
import ChatWidget from '../ChatWidget';
import Visualizers from '../Visualizers';
import DomainDataTables from '../DomainDataTables';
import BulkFacultyUploadModal from '../BulkFacultyUploadModal';
import LiveCampusTicker from '../LiveCampusTicker';
import RealtimeBookingMatrix from '../RealtimeBookingMatrix';
import CosmicOrbitRadar from '../CosmicOrbitRadar';
import TicketsSupportLogCard from '../TicketsSupportLogCard';
import { UserCheck, ShieldCheck, Check, X, Sparkles, Upload } from 'lucide-react';
import { getApiUrl } from '../../apiConfig';

export default function SuperAdminDashboard({ kpis, anomalies, recommendations, isRefreshing, onRefresh, activeTab = 'overview', setActiveTab }) {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [actionLoading, setActionLoading] = useState(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  useEffect(() => {
    fetchPendingUsers();
  }, []);

  const fetchPendingUsers = async () => {
    try {
      const res = await fetch(getApiUrl('/api/auth/pending-users'));
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
      const res = await fetch(getApiUrl('/api/auth/approve-user'), {
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
    <div className="space-y-6 font-sans">
      
      {/* Live Campus Telemetry Ticker */}
      <LiveCampusTicker />

      {/* VIEW SWITCHER BASED ON TOPBAR TAB SELECTION */}
      {activeTab === 'matrix' && (
        <div className="space-y-6">
          <RealtimeBookingMatrix currentUser={{ role: 'super_admin' }} />
          <DomainDataTables defaultDomain="classrooms" />
        </div>
      )}

      {activeTab === 'transport' && (
        <div className="space-y-6">
          <CosmicOrbitRadar />
          <DomainDataTables defaultDomain="transportation" />
        </div>
      )}

      {activeTab === 'anomalies' && (
        <div className="space-y-6">
          <AnomaliesPanel
            anomalies={anomalies}
            recommendations={recommendations}
            isLoading={isRefreshing}
          />
        </div>
      )}

      {activeTab === 'maintenance' && (
        <div className="space-y-6">
          <TicketsSupportLogCard currentUser={{ role: 'super_admin', department_domain: 'maintenance' }} />
          <DomainDataTables defaultDomain="maintenance" />
        </div>
      )}

      {activeTab === 'users' && (
        <div className="space-y-6">
          {/* Pending Approvals & Universal AI Data Intaker */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 card-surface p-6 shadow-2xs">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#E6E0D2]">
                <div className="flex items-center space-x-2.5">
                  <UserCheck className="w-5 h-5 text-[#1C1917]" />
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-sm font-bold text-[#1C1917]">Pending Staff Access Approvals</h2>
                      <span className="badge-mono-dark text-[10px]">
                        {pendingUsers.length} Action Required
                      </span>
                    </div>
                    <p className="text-xs text-[#57534E] font-medium mt-0.5">
                      Review and verify administrative clearance for newly registered department staff.
                    </p>
                  </div>
                </div>
              </div>

              {pendingUsers.length === 0 ? (
                <div className="py-8 text-center text-[#57534E] text-xs bg-[#F0EBE1] rounded-lg border border-[#E6E0D2] flex items-center justify-center space-x-2 font-semibold">
                  <ShieldCheck className="w-4 h-4 text-[#1C1917]" />
                  <span>All staff registration requests have been reviewed and verified.</span>
                </div>
              ) : (
                <div className="divide-y divide-[#E6E0D2]">
                  {pendingUsers.map((user) => (
                    <div key={user.id} className="py-3 flex items-center justify-between gap-3 hover:bg-[#F5F2EB] px-2 rounded-md transition-colors">
                      <div className="min-w-0">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-bold text-[#1C1917] truncate">{user.full_name || user.email}</span>
                          <span className="badge-mono font-mono text-[10px] uppercase">
                            {user.department_domain} Admin
                          </span>
                        </div>
                        <p className="text-[11px] text-[#57534E] font-mono mt-0.5">{user.email}</p>
                      </div>

                      <div className="flex items-center space-x-2 shrink-0">
                        <button
                          onClick={() => handleApproveUser(user.id, 'approved')}
                          disabled={actionLoading === user.id}
                          className="btn-primary text-xs py-1 px-3"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Approve</span>
                        </button>
                        <button
                          onClick={() => handleApproveUser(user.id, 'rejected')}
                          disabled={actionLoading === user.id}
                          className="btn-secondary text-xs py-1 px-2.5 text-[#1C1917]"
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

            <div className="lg:col-span-4 card-surface p-6 flex flex-col justify-between space-y-4 shadow-2xs">
              <div>
                <div className="w-8 h-8 rounded-md bg-[#F0EBE1] border border-[#E6E0D2] flex items-center justify-center text-[#1C1917] mb-2.5">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-[#1C1917] flex items-center gap-2">
                  Universal AI Data Intaker
                </h3>
                <p className="text-xs text-[#57534E] font-medium mt-1 leading-relaxed">
                  Feed CSV, JSON, or unstructured text into Faculty, Transport, Energy, Classroom, or Maintenance databases with live placement guidance.
                </p>
              </div>

              <button
                onClick={() => setIsUploadOpen(true)}
                className="btn-primary w-full text-xs font-mono"
              >
                <Upload className="w-4 h-4" />
                <span>Open Universal AI Data Intaker</span>
              </button>
            </div>
          </div>

          <DomainDataTables defaultDomain="users" />
        </div>
      )}

      {/* DEFAULT OVERVIEW VIEW */}
      {(activeTab === 'overview' || !['matrix', 'transport', 'anomalies', 'maintenance', 'users'].includes(activeTab)) && (
        <div className="space-y-6">
          
          {/* Top Pending Approvals & AI Intaker Card */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 card-surface p-6 shadow-2xs">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#E6E0D2]">
                <div className="flex items-center space-x-2.5">
                  <UserCheck className="w-5 h-5 text-[#1C1917]" />
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-sm font-bold text-[#1C1917]">Pending Staff Access Approvals</h2>
                      <span className="badge-mono-dark text-[10px]">
                        {pendingUsers.length} Action Required
                      </span>
                    </div>
                    <p className="text-xs text-[#57534E] font-medium mt-0.5">
                      Review and verify administrative clearance for newly registered department staff.
                    </p>
                  </div>
                </div>
              </div>

              {pendingUsers.length === 0 ? (
                <div className="py-6 text-center text-[#57534E] text-xs bg-[#F0EBE1] rounded-lg border border-[#E6E0D2] flex items-center justify-center space-x-2 font-semibold">
                  <ShieldCheck className="w-4 h-4 text-[#1C1917]" />
                  <span>All staff registration requests have been reviewed and verified.</span>
                </div>
              ) : (
                <div className="divide-y divide-[#E6E0D2]">
                  {pendingUsers.map((user) => (
                    <div key={user.id} className="py-2.5 flex items-center justify-between gap-3 hover:bg-[#F5F2EB] px-2 rounded-md transition-colors">
                      <div className="min-w-0">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-bold text-[#1C1917] truncate">{user.full_name || user.email}</span>
                          <span className="badge-mono font-mono text-[10px] uppercase">
                            {user.department_domain} Admin
                          </span>
                        </div>
                        <p className="text-[11px] text-[#57534E] font-mono mt-0.5">{user.email}</p>
                      </div>

                      <div className="flex items-center space-x-2 shrink-0">
                        <button
                          onClick={() => handleApproveUser(user.id, 'approved')}
                          disabled={actionLoading === user.id}
                          className="btn-primary text-xs py-1 px-3"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Approve</span>
                        </button>
                        <button
                          onClick={() => handleApproveUser(user.id, 'rejected')}
                          disabled={actionLoading === user.id}
                          className="btn-secondary text-xs py-1 px-2.5 text-[#1C1917]"
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

            <div className="lg:col-span-4 card-surface p-6 flex flex-col justify-between space-y-4 shadow-2xs">
              <div>
                <div className="w-8 h-8 rounded-md bg-[#F0EBE1] border border-[#E6E0D2] flex items-center justify-center text-[#1C1917] mb-2.5">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-[#1C1917] flex items-center gap-2">
                  Universal AI Data Intaker
                  <span className="badge-mono text-[9px] font-mono">
                    AI Advisor
                  </span>
                </h3>
                <p className="text-xs text-[#57534E] font-medium mt-1 leading-relaxed">
                  Feed CSV, JSON, or unstructured text into Faculty, Transport, Energy, Classroom, or Maintenance databases with live placement guidance.
                </p>
              </div>

              <button
                onClick={() => setIsUploadOpen(true)}
                className="btn-primary w-full text-xs font-mono"
              >
                <Upload className="w-4 h-4" />
                <span>Open Universal AI Data Intaker</span>
              </button>
            </div>
          </div>

          {/* Executive Inline KPI Bar */}
          <KpiOverview kpis={kpis} />

          {/* Anomalies & Role AI Co-Pilot */}
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

          {/* Domain Data Tables */}
          <DomainDataTables />

        </div>
      )}

      {/* AI Bulk Upload Modal */}
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
