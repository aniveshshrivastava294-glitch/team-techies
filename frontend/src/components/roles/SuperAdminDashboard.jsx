import React, { useState, useEffect } from 'react';
import SectionHero from '../SectionHero';
import { BACKDROP_IMAGES } from '../../config/backdropImages';
import KpiOverview from '../KpiOverview';
import AnomaliesPanel from '../AnomaliesPanel';
import ChatWidget from '../ChatWidget';
import Visualizers from '../Visualizers';
import DomainDataTables from '../DomainDataTables';
import BulkFacultyUploadModal from '../BulkFacultyUploadModal';
import LiveCampusTicker from '../LiveCampusTicker';
import { UserCheck, ShieldCheck, Check, X, Sparkles, Upload, LayoutDashboard } from 'lucide-react';

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
    <div className="space-y-6 font-sans">
      
      {/* Section Hero Photography Backdrop */}
      <SectionHero
        image={BACKDROP_IMAGES.dashboardOverview}
        category="Institutional Operations"
        categoryIcon={LayoutDashboard}
        badgeText="Campus Grid Synchronized"
        title="Campus Operations & Strategic Overview"
        subtitle="Real-time multi-domain analytics across classrooms, transit fleet, sustainability grid, and infrastructure."
      >
        <button
          onClick={() => setIsUploadOpen(true)}
          className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg border border-white/20 text-xs font-medium backdrop-blur-xs transition-colors cursor-pointer flex items-center gap-2"
        >
          <Upload className="w-3.5 h-3.5" />
          <span>Universal Data Intaker</span>
        </button>
      </SectionHero>

      {/* Live Campus Telemetry Ticker */}
      <LiveCampusTicker />

      {/* Super Admin Actions: Sub-Admin Approvals & AI Bulk Faculty Extraction */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Pending Sub-Admin Registrations */}
        <div className="lg:col-span-8 inst-card p-6 border border-[#E8DCC8] bg-[#F7EFE4] shadow-xs">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#E8DCC8]">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-[#BC4800]/15 border border-[#BC4800]/30 rounded-lg text-[#BC4800]">
                <UserCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-bold text-[#2B1D12] tracking-tight">Staff Access Approvals</h2>
                  <span className="px-2.5 py-0.5 text-xs font-semibold inst-badge-ochre">
                    {pendingUsers.length} Action Required
                  </span>
                </div>
                <p className="text-xs text-[#6B5A4A] mt-0.5">
                  Review and verify administrative clearance requests
                </p>
              </div>
            </div>
          </div>

          {pendingUsers.length === 0 ? (
            <div className="py-6 text-center text-[#6B5A4A] text-xs bg-[#FDF8F2] rounded-xl border border-[#E8DCC8] flex items-center justify-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-[#4E7A51]" />
              <span>All staff accounts are verified. No pending approvals in queue.</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {pendingUsers.map((user) => (
                <div key={user.id} className="bg-[#FDF8F2] p-3.5 rounded-xl border border-[#E8DCC8] flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold text-[#2B1D12]">{user.full_name || user.email}</span>
                      <span className="px-2.5 py-0.5 text-xs font-semibold uppercase inst-badge-ochre">
                        {user.department_domain} Admin
                      </span>
                    </div>
                    <p className="text-xs text-[#6B5A4A] mb-2">{user.email}</p>
                  </div>

                  <div className="flex items-center space-x-2 pt-2 border-t border-[#E8DCC8]">
                    <button
                      onClick={() => handleApproveUser(user.id, 'approved')}
                      disabled={actionLoading === user.id}
                      className="flex-1 py-1.5 bg-[#4E7A51] hover:bg-[#3D6140] text-white rounded-lg text-xs font-semibold transition-colors flex items-center justify-center space-x-1 cursor-pointer disabled:opacity-50"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Approve</span>
                    </button>
                    <button
                      onClick={() => handleApproveUser(user.id, 'rejected')}
                      disabled={actionLoading === user.id}
                      className="py-1.5 px-3 bg-[#A6402F]/15 hover:bg-[#A6402F]/25 text-[#A6402F] border border-[#A6402F]/30 rounded-lg text-xs font-semibold transition-colors flex items-center justify-center space-x-1 cursor-pointer"
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
        <div className="lg:col-span-4 inst-card p-6 border border-[#E8DCC8] bg-[#F7EFE4] flex flex-col justify-between space-y-4 shadow-xs">
          <div>
            <div className="w-8 h-8 bg-[#BC4800]/15 border border-[#BC4800]/30 rounded-lg flex items-center justify-center text-[#BC4800] mb-3">
              <Sparkles className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-[#2B1D12] tracking-tight flex items-center gap-2">
              Universal Multi-Batch Data Intaker
              <span className="px-2.5 py-0.5 text-xs font-semibold inst-badge-ochre">
                AI Powered
              </span>
            </h3>
            <p className="text-xs text-[#6B5A4A] mt-1 leading-relaxed">
              Import CSV, JSON, or text files into Faculty, Transport, Energy, Classroom, or Maintenance databases with AI schema placement guidance.
            </p>
          </div>

          <button
            onClick={() => setIsUploadOpen(true)}
            className="w-full py-2.5 inst-button-primary text-xs flex items-center justify-center space-x-2 cursor-pointer shadow-xs font-semibold"
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

