import React, { useState } from 'react';
import { useAuth, demoAccounts } from '../context/AuthContext';
import { 
  Search, RefreshCw, LogOut, LogIn, ChevronDown, Shield,
  LayoutDashboard, Building2, Bus, Zap, Wrench, Users 
} from 'lucide-react';

export default function Header({ onRefresh, isRefreshing, onOpenLogin, activeTab, setActiveTab }) {
  const { currentUser, logout, switchDemoRole } = useAuth();
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'matrix', label: 'Classroom Booking', icon: Building2 },
    { id: 'transport', label: 'Bus Tracker', icon: Bus },
    { id: 'anomalies', label: 'System Alerts', icon: Zap },
    { id: 'maintenance', label: 'Maintenance & Support', icon: Wrench },
    { id: 'users', label: 'Staff Approvals', icon: Users },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-[#E2E8F0] font-sans shadow-xs">
      
      {/* Top Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
        
        {/* Brand Logo & Tag */}
        <div className="flex items-center space-x-3 shrink-0">
          <div className="w-8 h-8 rounded bg-[#0F172A] text-white flex items-center justify-center font-bold text-xs">
            CO
          </div>
          <div>
            <h1 className="text-sm font-bold text-slate-900 tracking-tight leading-none">
              CampusOrbit
            </h1>
            <span className="text-[10px] text-slate-500 font-mono tracking-wide">
              CAMPUS MANAGEMENT PLATFORM
            </span>
          </div>
        </div>

        {/* Global Search Bar */}
        <div className="relative flex-1 max-w-md hidden md:block">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search rooms, bus routes, tickets, or staff (⌘K)..."
            className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-md pl-8 pr-12 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#2563EB]"
          />
          <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-mono text-slate-400 bg-white px-1.5 py-0.5 rounded border border-slate-200">
            ⌘K
          </kbd>
        </div>

        {/* Right Actions & User Role Switcher */}
        <div className="flex items-center space-x-2.5">
          
          <div className="hidden lg:flex items-center space-x-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
            <span className="font-mono text-[11px]">System Online</span>
          </div>

          <div className="relative">
            <button
              onClick={() => setShowRoleDropdown(!showRoleDropdown)}
              className="btn-secondary text-xs flex items-center space-x-1.5 py-1 px-2.5"
            >
              <Shield className="w-3.5 h-3.5 text-[#2563EB]" />
              <span className="font-semibold text-slate-900">
                {currentUser?.full_name?.split(' ')[0] || 'Guest'}
              </span>
              <span className="text-[10px] font-mono text-slate-500 uppercase">
                ({currentUser?.role === 'sub_admin' ? currentUser?.department_domain : currentUser?.role?.replace('_', ' ') || 'Visitor'})
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {showRoleDropdown && (
              <div className="absolute right-0 mt-1 w-56 p-1.5 rounded-md border border-slate-200 bg-white shadow-lg z-50 text-xs space-y-1">
                <div className="px-2 py-1 text-[10px] font-mono text-slate-400 uppercase tracking-wider border-b border-slate-100 mb-1">
                  Switch Demo Role:
                </div>
                {demoAccounts.map((acc, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      switchDemoRole(acc);
                      setShowRoleDropdown(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded text-xs transition-colors flex items-center justify-between ${
                      currentUser?.email === acc.email ? 'bg-blue-50 text-[#2563EB] font-bold' : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <span>{acc.full_name.split(' ')[0]}</span>
                    <span className="text-[10px] font-mono text-slate-400 capitalize">
                      {acc.role === 'sub_admin' ? `${acc.department_domain}` : acc.role.replace('_', ' ')}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="btn-ghost p-1.5 text-slate-500"
            title="Refresh Data"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-[#2563EB]' : ''}`} />
          </button>

          {currentUser ? (
            <button
              onClick={logout}
              className="btn-ghost p-1.5 text-slate-500 hover:text-red-600"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={onOpenLogin}
              className="btn-primary text-xs py-1 px-3"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
          )}

        </div>

      </div>

      {/* Top Horizontal Navigation Tab Bar */}
      <div className="border-t border-[#E2E8F0] bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center space-x-1 overflow-x-auto whitespace-nowrap">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab && setActiveTab(item.id)}
                className={`py-2.5 px-3.5 text-xs font-semibold flex items-center space-x-2 border-b-2 transition-colors cursor-pointer ${
                  isActive
                    ? 'border-[#2563EB] text-[#2563EB] bg-white font-bold'
                    : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#2563EB]' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

    </header>
  );
}
