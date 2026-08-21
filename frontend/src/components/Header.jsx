import React, { useState } from 'react';
import { useAuth, demoAccounts } from '../context/AuthContext';
import { Layers, Zap, Cpu, Database, RefreshCw, UserCheck, LogOut, LogIn, ChevronDown } from 'lucide-react';

export default function Header({ onRefresh, isRefreshing, datasource, onOpenLogin }) {
  const { currentUser, logout, switchDemoRole } = useAuth();
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);

  const getRoleBadgeClass = (role, domain) => {
    switch (role) {
      case 'super_admin':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case 'faculty':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'sub_admin':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-slate-800/80 px-6 py-3.5 mb-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Title & Branding */}
        <div className="flex items-center space-x-3.5">
          <div className="p-2.5 bg-blue-600/20 border border-blue-500/30 rounded-xl text-blue-400 shadow-lg shadow-blue-500/10">
            <Layers className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold tracking-tight text-white">Campus Intelligence Dashboard</h1>
              <span className="px-2 py-0.5 text-[10px] font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full">
                RBAC Active
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              Role-Based Access Control Architecture (Problem SW-01-P)
            </p>
          </div>
        </div>

        {/* User Profile & Demo Role Switcher */}
        <div className="flex flex-wrap items-center gap-3">
          
          {/* Active User Card & Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowRoleDropdown(!showRoleDropdown)}
              className="flex items-center space-x-2.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded-xl text-xs transition-all cursor-pointer"
            >
              <div className="w-6 h-6 rounded-full bg-blue-600/30 border border-blue-500/40 flex items-center justify-center text-blue-400 font-bold text-[10px]">
                {currentUser?.full_name?.charAt(0) || 'U'}
              </div>
              <div className="text-left">
                <span className="font-bold text-white block leading-tight">{currentUser?.full_name || 'Guest User'}</span>
                <span className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded border ${getRoleBadgeClass(currentUser?.role, currentUser?.department_domain)}`}>
                  {currentUser?.role === 'sub_admin' ? `${currentUser?.department_domain} Admin` : currentUser?.role?.replace('_', ' ')}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {/* Quick Demo Role Dropdown */}
            {showRoleDropdown && (
              <div className="absolute right-0 mt-2 w-56 glass-panel p-2 rounded-xl border border-slate-800 shadow-2xl z-50 text-xs space-y-1">
                <div className="px-2.5 py-1 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                  Switch Demo Account:
                </div>
                {demoAccounts.map((acc, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      switchDemoRole(acc);
                      setShowRoleDropdown(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg transition-colors flex items-center justify-between ${
                      currentUser?.email === acc.email ? 'bg-blue-600 text-white' : 'hover:bg-slate-800/80 text-slate-300'
                    }`}
                  >
                    <span>{acc.full_name.split(' ')[0]}</span>
                    <span className="text-[10px] opacity-75 capitalize">
                      {acc.role === 'sub_admin' ? `${acc.department_domain}` : acc.role.replace('_', '')}
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
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold transition-all disabled:opacity-50 shadow-md shadow-blue-600/20 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Refresh Payload</span>
          </button>

          {/* Auth Button */}
          {currentUser ? (
            <button
              onClick={logout}
              className="p-2 text-slate-400 hover:text-red-400 bg-slate-900 border border-slate-800 rounded-xl transition-colors cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={onOpenLogin}
              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-600/20 flex items-center space-x-1 cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Login / Register</span>
            </button>
          )}

        </div>

      </div>
    </header>
  );
}
