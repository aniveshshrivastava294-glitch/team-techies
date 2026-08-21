import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Header from './components/Header';
import LoginModal from './components/LoginModal';
import PendingApprovalView from './components/PendingApprovalView';
import ConversationalHero from './components/ConversationalHero';
import FloatingAIAssistant from './components/FloatingAIAssistant';
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

  // Compute Role-Based Theme Background Gradient
  const getRoleThemeGradient = () => {
    if (!currentUser) return 'from-slate-950 via-slate-900 to-slate-950';
    
    if (currentUser.role === 'super_admin') {
      return 'from-slate-950 via-purple-950/25 to-slate-950';
    }
    if (currentUser.role === 'faculty') {
      return 'from-slate-950 via-cyan-950/25 to-slate-950';
    }
    if (currentUser.role === 'sub_admin') {
      if (currentUser.department_domain === 'transport') {
        return 'from-slate-950 via-teal-950/25 to-slate-950';
      }
      return 'from-slate-950 via-amber-950/25 to-slate-950';
    }
    return 'from-slate-950 via-slate-900 to-slate-950';
  };

  const renderRoleDashboard = () => {
    if (!currentUser) {
      return (
        <div className="py-20 text-center space-y-4">
          <h2 className="text-xl font-bold text-white">Please sign in to access your Campus Orbit workspace</h2>
          <button
            onClick={() => setIsLoginOpen(true)}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-full shadow-lg transition-all cursor-pointer"
          >
            Open Login & Quick Role Switcher
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
    <div className={`min-h-screen bg-gradient-to-b ${getRoleThemeGradient()} text-slate-100 flex flex-col transition-colors duration-700 relative overflow-x-hidden`}>
      
      {/* Subtle Background 3D Vector Glow Accents */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-1/3 left-10 w-[400px] h-[400px] bg-purple-600/5 rounded-full blur-[140px] pointer-events-none"></div>

      {/* Floating Glass Pill Navbar */}
      <Header
        onRefresh={fetchDashboardData}
        isRefreshing={isRefreshing}
        datasource={datasource}
        onOpenLogin={() => setIsLoginOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 mb-12 space-y-8 relative z-10">
        
        {/* Conversational Hero Bar for All Signed-In Users */}
        {currentUser && currentUser.approval_status !== 'pending' && (
          <ConversationalHero currentUser={currentUser} />
        )}

        {/* Role Workspace */}
        {renderRoleDashboard()}

      </main>

      {/* Persistent 3D Glowing Omni-Agent Widget on Every Screen */}
      <FloatingAIAssistant currentUser={currentUser} />

      {/* Login / Demo Switcher Modal */}
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />

      {/* Footer */}
      <footer className="border-t border-slate-900/80 bg-slate-950/80 py-6 px-6 text-center text-xs text-slate-500 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Campus Orbit &bull; Agentic Glassmorphism Decision-Support Platform</span>
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
