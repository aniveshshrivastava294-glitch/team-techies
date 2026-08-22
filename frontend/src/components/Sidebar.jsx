import React from 'react';
import { useAuth, demoAccounts } from '../context/AuthContext';
import { 
  LayoutDashboard, Building2, Bus, Zap, Wrench, Users, Shield, 
  Sparkles, Layers, LogOut, ChevronRight 
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab }) {
  const { currentUser, logout, switchDemoRole } = useAuth();

  const navItems = [
    { id: 'overview', label: 'Overview Dashboard', icon: LayoutDashboard },
    { id: 'matrix', label: 'Classroom Booking', icon: Building2 },
    { id: 'transport', label: 'Bus Fleet Tracker', icon: Bus },
    { id: 'anomalies', label: 'System Alerts Log', icon: Zap },
    { id: 'maintenance', label: 'Maintenance & Operations', icon: Wrench },
    { id: 'users', label: 'Staff & Approvals', icon: Users },
  ];

  return (
    <aside className="w-64 bg-[#0F2747] text-white flex flex-col fixed inset-y-0 left-0 z-40 border-r border-[#1E3A5F] font-sans">
      
      {/* Sidebar Header Lockup */}
      <div className="h-14 px-5 flex items-center space-x-3 border-b border-[#1E3A5F]">
        <div className="w-7 h-7 rounded bg-[#2563EB] flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
          CO
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-sm font-semibold text-white tracking-tight truncate">
            CampusOrbit
          </h1>
          <p className="text-[10px] text-slate-400 font-mono tracking-wide truncate">
            ENTERPRISE PLATFORM
          </p>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-semibold text-slate-400 uppercase tracking-wider font-mono">
          Main Navigation
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab && setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-colors duration-150 cursor-pointer relative ${
                isActive
                  ? 'bg-[#1E3A5F] text-white font-semibold'
                  : 'text-slate-300 hover:bg-[#1E3A5F]/60 hover:text-white'
              }`}
            >
              {isActive && (
                <span className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-[#2563EB] rounded-r-full" />
              )}
              <div className="flex items-center space-x-2.5">
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#2563EB]' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {isActive && <ChevronRight className="w-3.5 h-3.5 text-slate-400" />}
            </button>
          );
        })}
      </div>

      {/* User Scope Footer */}
      <div className="p-3 border-t border-[#1E3A5F] bg-[#0B1E36]">
        <div className="flex items-center space-x-2.5 px-2 py-1.5">
          <div className="w-7 h-7 rounded-full bg-[#2563EB]/20 border border-[#2563EB]/40 text-[#2563EB] flex items-center justify-center text-xs font-bold font-mono">
            {currentUser?.full_name?.charAt(0) || 'G'}
          </div>
          <div className="flex-1 min-w-0">
            <span className="block text-xs font-semibold text-white truncate">
              {currentUser?.full_name || 'Guest User'}
            </span>
            <span className="block text-[10px] text-slate-400 font-mono uppercase truncate">
              {currentUser?.role === 'sub_admin' ? currentUser?.department_domain : currentUser?.role?.replace('_', ' ') || 'Visitor'}
            </span>
          </div>
          <button
            onClick={logout}
            className="p-1 text-slate-400 hover:text-white rounded hover:bg-[#1E3A5F] transition-colors"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

    </aside>
  );
}
