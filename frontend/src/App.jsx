import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Header from './components/Header';
import LoginModal from './components/LoginModal';
import PendingApprovalView from './components/PendingApprovalView';
import ConversationalHero from './components/ConversationalHero';
import SuperAdminDashboard from './components/roles/SuperAdminDashboard';
import FacultyDashboard from './components/roles/FacultyDashboard';
import SubAdminDashboard from './components/roles/SubAdminDashboard';

function DashboardRouter() {
  const { currentUser } = useAuth();
  const [kpis, setKpis] = useState(null);
  const [anomalies, setAnomalies] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [datasource, setDatasource] = useState('Local Synthetic Store');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const fetchDashboardData = async () => {
    setIsRefreshing(true);
    try {
      // 1. Fetch KPIs
      const kpiRes = await fetch('/api/kpis');
      const kpiData = await kpiRes.json();
      if (kpiData.status === 'success') {
        setKpis(kpiData.kpis);
        setDatasource(kpiData.datasource);
      }

      // 2. Fetch Anomalies
      const anomRes = await fetch('/api/anomalies');
      const anomData = await anomRes.json();
      if (anomData.status === 'success') {
        setAnomalies(anomData.anomalies || []);
      }

      // 3. Fetch Recommendations
      const recRes = await fetch('/api/recommendations');
      const recData = await recRes.json();
      if (recData.status === 'success') {
        setRecommendations(recData.recommendations || []);
      }
    } catch (err) {
      console.error('Error fetching dashboard payload:', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const renderRoleDashboard = () => {
    if (!currentUser) {
      return (
        <div className="py-20 text-center space-y-4">
          <h2 className="text-xl font-bold text-white">Please sign in to access your role workspace</h2>
          <button
            onClick={() => setIsLoginOpen(true)}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg transition-all"
          >
            Open Login & Quick Role Switcher
          </button>
        </div>
      );
    }

    // Pending approval state
    if (currentUser.approval_status === 'pending') {
      return <PendingApprovalView />;
    }

    // Role views
    switch (currentUser.role) {
      case 'super_admin':
        return (
          <SuperAdminDashboard
            kpis={kpis}
            anomalies={anomalies}
            recommendations={recommendations}
            isRefreshing={isRefreshing}
            onRefresh={fetchDashboardData}
          />
        );
      case 'faculty':
        return <FacultyDashboard currentUser={currentUser} />;
      case 'sub_admin':
        return <SubAdminDashboard currentUser={currentUser} />;
      default:
        return (
          <SuperAdminDashboard
            kpis={kpis}
            anomalies={anomalies}
            recommendations={recommendations}
            isRefreshing={isRefreshing}
            onRefresh={fetchDashboardData}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-blue-600 selection:text-white">
      
      {/* Header */}
      <Header
        onRefresh={fetchDashboardData}
        isRefreshing={isRefreshing}
        datasource={datasource}
        onOpenLogin={() => setIsLoginOpen(true)}
      />

      {/* Main Container with Hero & Role Router */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 mb-12 space-y-8 pt-4">
        
        {/* Conversational Hero Bar for All Signed-In Users */}
        {currentUser && currentUser.approval_status !== 'pending' && (
          <ConversationalHero currentUser={currentUser} />
        )}

        {/* Role Workspace */}
        {renderRoleDashboard()}

      </main>

      {/* Login / Demo Switcher Modal */}
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 px-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Campus Orbit Agentic AI Platform (Problem SW-01-P)</span>
          <span className="text-slate-400">Gemini 2.5 API Function Calling & Groq Text-to-SQL</span>
        </div>
      </footer>

    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <DashboardRouter />
    </AuthProvider>
  );
}
