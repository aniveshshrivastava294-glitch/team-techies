import React, { useState } from 'react';
import { useAuth, demoAccounts } from '../context/AuthContext';
import { Search, RefreshCw, LogOut, LogIn, ChevronDown, Bell, Shield, Radio, Clock } from 'lucide-react';

export default function Header({ onRefresh, isRefreshing, datasource, onOpenLogin, activeTab }) {
  const { currentUser, logout, switchDemoRole } = useAuth();
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const getTabBreadcrumb = () => {
    switch (activeTab) {
      case 'matrix': return 'Classroom Booking Matrix';
      case 'transport': return 'Bus Fleet Telemetry';
      case 'anomalies': return 'System Alerts Register';
      case 'maintenance': return 'Infrastructure Maintenance';
      case 'users': return 'Staff Approvals';
      default: return 'Executive Operations Dashboard';
    }
  };

  return (
    <header className="sticky top-0 z-30 h-14 bg-white border-b border-[#E2E8F0] px-4 sm:px-6 flex items-center justify-between font-sans">
      
      {/* Left: Breadcrumb & Search Bar */}
      <div className="flex items-center space-x-6 flex-1 max-w-2xl">
        <div className="flex items-center space-x-2 text-xs">
          <span className="font-semibold text-slate-900">CampusOrbit</span>
          <span className="text-slate-300">/</span>
          <span className="text-slate-500 font-medium">{getTabBreadcrumb()}</span>
        </div>

        {/* Global Search Input Bar */}
        <div className="relative flex-1 hidden md:block max-w-md">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search rooms, bus routes, tickets, or faculty (⌘K)..."
            className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-md pl-8 pr-12 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]"
          />
          <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-mono text-slate-400 bg-white px-1.5 py-0.5 rounded border border-slate-200">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right: Actions, Role Selector & Quick Switcher */}
      <div className="flex items-center space-x-3">
        
        {/* Status Indicator */}
        <div className="hidden lg:flex items-center space-x-2 px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
          <span className="font-mono text-[11px]">System Online</span>
        </div>

        {/* User Role Switcher Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowRoleDropdown(!showRoleDropdown)}
            className="btn-secondary text-xs flex items-center space-x-2"
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

        {/* Refresh Action */}
        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          className="btn-ghost p-1.5"
          title="Refresh Data"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-[#2563EB]' : ''}`} />
        </button>

        {/* Auth Action */}
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
            className="btn-primary text-xs"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In</span>
          </button>
        )}

      </div>

    </header>
  );
}
