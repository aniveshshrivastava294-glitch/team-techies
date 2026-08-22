import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth, demoAccounts } from './context/AuthContext';
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
import { BACKDROP_IMAGES } from './config/backdropImages';
import { LogIn } from 'lucide-react';

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
        /* Full-Viewport Edge-to-Edge Photographic Hero Landing Page */
        <div className="fixed inset-0 z-0 w-screen h-screen flex flex-col justify-center items-start px-8 sm:px-16 lg:px-24 overflow-hidden">
          {/* Full Screen Photography Backdrop */}
          <img
            src={BACKDROP_IMAGES.loginLanding.url}
            alt={BACKDROP_IMAGES.loginLanding.alt}
            className="absolute inset-0 w-full h-full object-cover object-center"
          />

          {/* Deep Navy Overlay (#1F2A38 at ~50% opacity) — flat, no gradient */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: 'rgba(31, 42, 56, 0.52)' }}
          />

          {/* Hero Content — centered vertically over full-viewport photo */}
          <div className="relative z-10 max-w-xl space-y-5 text-white">
            <span className="inline-block px-3 py-1 rounded-full bg-white/15 border border-white/25 text-xs font-semibold tracking-widest uppercase text-white/90">
              PRESIDENCY UNIVERSITY
            </span>

            <div className="space-y-3">
              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
                CampusOrbit Operations Platform
              </h1>
              <p className="text-sm sm:text-base text-white/80 font-normal leading-relaxed max-w-lg">
                Unified cross-domain management for classroom scheduling, transit telemetry, energy sustainability, and facilities maintenance.
              </p>
            </div>

            <div className="pt-1">
              <button
                onClick={() => setIsLoginOpen(true)}
                className="px-6 py-3 bg-[#3E5C76] hover:bg-[#2E4459] text-white font-semibold rounded-lg text-sm transition-colors cursor-pointer shadow-md inline-flex items-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In</span>
              </button>
            </div>
          </div>
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

  const isLoggedOut = !currentUser;

  return (
    <div className="min-h-screen bg-[#F5F4F0] text-[#1F2A38] flex flex-col transition-colors duration-150 relative overflow-x-hidden font-sans">

      {/* Header Navbar — only show when logged in */}
      {!isLoggedOut && (
        <Header
          onRefresh={fetchDashboardData}
          isRefreshing={isRefreshing}
          datasource={datasource}
          onOpenLogin={() => setIsLoginOpen(true)}
        />
      )}

      {/* Main Container */}
      {isLoggedOut ? (
        /* Landing page: full viewport, no constraints */
        <div className="flex-1 relative">
          {renderRoleDashboard()}
          {/* Sign In button for header area on login page */}
          <div className="absolute top-4 right-6 z-20">
            <button
              onClick={() => setIsLoginOpen(true)}
              className="px-4 py-2 bg-white/15 hover:bg-white/25 border border-white/30 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-2 backdrop-blur-sm"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
          </div>
        </div>
      ) : (
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 mb-12 space-y-8 relative z-10">

          {/* Conversational Hero Bar for Signed-In Users */}
          {currentUser && currentUser.approval_status !== 'pending' && (
            <ConversationalHero currentUser={currentUser} />
          )}

          {/* Role Workspace */}
          {renderRoleDashboard()}

        </main>
      )}

      {/* Persistent AI Assistant Widget */}
      <FloatingAIAssistant currentUser={currentUser} />

      {/* Login / Demo Switcher Modal */}
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />

      {/* Institutional Enterprise Footer — only when logged in */}
      {!isLoggedOut && <InstitutionalFooter />}

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
