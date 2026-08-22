import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Header from './components/Header';
import LoginModal from './components/LoginModal';
import PendingApprovalView from './components/PendingApprovalView';
import ConversationalHero from './components/ConversationalHero';
import FloatingAIAssistant from './components/FloatingAIAssistant';
import SuperAdminDashboard from './components/roles/SuperAdminDashboard';
import FacultyDashboard from './components/roles/FacultyDashboard';
import SubAdminDashboard from './components/roles/SubAdminDashboard';
import InstitutionalFooter from './components/InstitutionalFooter';

function DashboardRouter() {
  const { currentUser } = useAuth();
  const [kpis, setKpis] = useState(null);
  const [anomalies, setAnomalies] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [datasource, setDatasource] = useState('Local Synthetic Store');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const fetchDashboardData = async () => {
    setIsRefreshing(true);
    try {
      const kpiRes = await fetch('/api/kpis');
      const kpiData = await kpiRes.json();
      if (kpiData.status === 'success') {
        setKpis(kpiData.kpis);
        setDatasource(kpiData.datasource);
      }

      const anomRes = await fetch('/api/anomalies');
      const anomData = await anomRes.json();
      if (anomData.status === 'success') {
        setAnomalies(anomData.anomalies || []);
      }

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
        <div className="py-12 text-center space-y-3 card-surface max-w-lg mx-auto my-8 p-6">
          <h2 className="text-base font-bold text-[#09090B]">
            Welcome to Campus Orbit
          </h2>
          <p className="text-xs text-[#52525B] max-w-sm mx-auto">
            Please sign in to access your administrative operations workspace.
          </p>
          <button
            onClick={() => setIsLoginOpen(true)}
            className="btn-primary text-xs"
          >
            Sign In / Switch Demo Account
          </button>
        </div>
      );
    }

    if (currentUser.approval_status === 'pending') {
      return <PendingApprovalView />;
    }

    switch (currentUser.role) {
      case 'super_admin':
        return (
          <SuperAdminDashboard
            kpis={kpis}
            anomalies={anomalies}
            recommendations={recommendations}
            isRefreshing={isRefreshing}
            onRefresh={fetchDashboardData}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        );
      case 'faculty':
        return <FacultyDashboard currentUser={currentUser} activeTab={activeTab} setActiveTab={setActiveTab} />;
      case 'sub_admin':
        return <SubAdminDashboard currentUser={currentUser} activeTab={activeTab} setActiveTab={setActiveTab} />;
      default:
        return (
          <SuperAdminDashboard
            kpis={kpis}
            anomalies={anomalies}
            recommendations={recommendations}
            isRefreshing={isRefreshing}
            onRefresh={fetchDashboardData}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F2EB] text-[#1C1917] flex flex-col font-sans">
      
      {/* Top Header Bar */}
      <Header
        onRefresh={fetchDashboardData}
        isRefreshing={isRefreshing}
        datasource={datasource}
        onOpenLogin={() => setIsLoginOpen(true)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Content Canvas */}
      <main className="flex-1 p-4 sm:p-6 space-y-6 max-w-7xl w-full mx-auto">
        
        {currentUser && currentUser.approval_status !== 'pending' && (
          <ConversationalHero currentUser={currentUser} />
        )}

        {renderRoleDashboard()}

      </main>

      {/* Institutional Footer */}
      <InstitutionalFooter />

      {/* Persistent AI Assistant Drawer */}
      <FloatingAIAssistant currentUser={currentUser} />

      {/* Login Modal */}
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />

    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <DashboardRouter />
      </AuthProvider>
    </ThemeProvider>
  );
}
