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
import { LogIn, ArrowRight, Sparkles } from 'lucide-react';

function DashboardRouter() {
  const { currentUser, switchDemoRole } = useAuth();
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
        /* Full-Viewport Edge-to-Edge Photographic Hero Landing Page (No boxed card edges) */
        <div className="relative w-full -mt-8 -mx-4 sm:-mx-6 min-h-[calc(100vh-65px)] flex flex-col justify-center px-6 sm:px-12 lg:px-20 py-16 overflow-hidden">
          {/* Full Screen Photography Backdrop */}
          <img
            src={BACKDROP_IMAGES.loginLanding.url}
            alt={BACKDROP_IMAGES.loginLanding.alt}
            className="absolute inset-0 w-full h-full object-cover object-center"
          />

          {/* Warm Dark Brown Overlay (#2B1D12 at ~50-55% opacity) */}
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'linear-gradient(135deg, rgba(43, 29, 18, 0.72) 0%, rgba(43, 29, 18, 0.52) 60%, rgba(43, 29, 18, 0.65) 100%)'
            }}
          />

          {/* Hero Content Block - Sits Seamlessly On Top of Photo */}
          <div className="relative z-10 max-w-2xl space-y-6 text-white">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FDF8F2]/90 border border-[#E8DCC8] text-xs font-semibold text-[#2B1D12] shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-[#BC4800]" />
              <span>PRESIDENCY UNIVERSITY</span>
            </span>

            <div className="space-y-3">
              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
                CampusOrbit Operations Platform
              </h1>
              <p className="text-base sm:text-lg text-stone-200 font-normal leading-relaxed max-w-xl">
                Unified cross-domain management for classroom scheduling, transit telemetry, energy sustainability, and facilities maintenance.
              </p>
            </div>

            {/* CTA & Demo Role Switcher Bar */}
            <div className="pt-2 space-y-4">
              <div className="flex items-center gap-3 flex-wrap">
                <button
                  onClick={() => setIsLoginOpen(true)}
                  className="px-6 py-3 bg-[#BC4800] hover:bg-[#9A3A00] text-white font-semibold rounded-lg text-sm transition-colors cursor-pointer shadow-md inline-flex items-center gap-2"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Sign In / Switch Demo Role</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Direct Quick Role Switcher Chips */}
              <div className="pt-3">
                <p className="text-xs text-stone-300 mb-2 font-medium">Or explore instantly as demo role:</p>
                <div className="flex flex-wrap gap-2">
                  {demoAccounts.slice(0, 4).map((acc, idx) => (
                    <button
                      key={idx}
                      onClick={() => switchDemoRole(acc)}
                      className="px-3 py-1.5 rounded-full bg-[#FDF8F2]/90 hover:bg-[#FDF8F2] text-[#2B1D12] border border-[#E8DCC8] text-xs font-medium transition-colors cursor-pointer shadow-xs"
                    >
                      {acc.full_name.split(' ')[0]} ({acc.role === 'sub_admin' ? `${acc.department_domain} Admin` : acc.role.replace('_', ' ')})
                    </button>
                  ))}
                </div>
              </div>
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

  return (
    <div className="min-h-screen bg-[#FDF8F2] text-[#2B1D12] flex flex-col transition-colors duration-150 relative overflow-x-hidden font-sans">
      
      {/* Header Navbar */}
      <Header
        onRefresh={fetchDashboardData}
        isRefreshing={isRefreshing}
        datasource={datasource}
        onOpenLogin={() => setIsLoginOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 mb-12 space-y-8 relative z-10">
        
        {/* Conversational Hero Bar for Signed-In Users */}
        {currentUser && currentUser.approval_status !== 'pending' && (
          <ConversationalHero currentUser={currentUser} />
        )}

        {/* Role Workspace */}
        {renderRoleDashboard()}

      </main>

      {/* Persistent AI Assistant Widget */}
      <FloatingAIAssistant currentUser={currentUser} />

      {/* Login / Demo Switcher Modal */}
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />

      {/* Institutional Enterprise Footer */}
      <InstitutionalFooter />

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

