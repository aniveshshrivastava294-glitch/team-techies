import React, { useState } from 'react';
import { useAuth, demoAccounts } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { RefreshCw, LogOut, LogIn, ChevronDown, Sun, Moon } from 'lucide-react';

export default function Header({ onRefresh, isRefreshing, datasource, onOpenLogin }) {
  const { currentUser, logout, switchDemoRole } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);

  const getRoleBadgeClass = (role, domain) => {
    switch (role) {
      case 'super_admin':
        return 'text-purple-400 border-purple-500/30 bg-purple-500/10';
      case 'faculty':
        return 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10';
      case 'sub_admin':
        return domain === 'transport' ? 'text-teal-400 border-teal-500/30 bg-teal-500/10' : 'text-amber-400 border-amber-500/30 bg-amber-500/10';
      default:
        return 'text-zinc-400 border-zinc-700 bg-zinc-900';
    }
  };

  return (
    <header className="sticky top-0 z-50 px-4 sm:px-8 py-4 backdrop-blur-md bg-black/40 border-b border-white/5">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* Brand: Strictly Text-Only "Campus Orbit" */}
        <div className="flex items-center space-x-3">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-lg font-black tracking-tight text-white font-sans uppercase">
                Campus Orbit
              </h1>
              <span className="px-2 py-0.5 text-[9px] font-mono font-bold tracking-widest text-zinc-400 border border-white/10 rounded-full uppercase bg-white/[0.03]">
                Deep Space OS
              </span>
            </div>
            <p className="text-[11px] text-zinc-500 font-medium tracking-wide">
              Enterprise Autonomous Intelligence
            </p>
          </div>
        </div>

        {/* Navigation & Profile Actions */}
        <div className="flex items-center space-x-4">
          
          {/* Quick Transport Manager Shortcut */}
          <button
            onClick={() => switchDemoRole(demoAccounts[3])}
            title="Switch to Transport Manager Interface"
            className="px-3.5 py-1.5 rounded-full border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] text-zinc-300 text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 hover:border-cyan-500/40"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
            <span className="hidden sm:inline font-mono">Transport Telemetry</span>
          </button>

          {/* User Profile & Role Switcher */}
          <div className="relative">
            <button
              onClick={() => setShowRoleDropdown(!showRoleDropdown)}
              className="flex items-center space-x-2.5 px-3 py-1.5 rounded-full border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] text-xs transition-all cursor-pointer"
            >
              <div className="w-5 h-5 rounded-full bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 font-mono text-[10px] font-bold">
                {currentUser?.full_name?.charAt(0) || 'G'}
              </div>
              <div className="text-left hidden md:block">
                <span className="font-bold text-white block leading-none text-xs">{currentUser?.full_name?.split(' ')[0] || 'Guest'}</span>
                <span className={`text-[8px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.2 rounded-full border inline-block mt-0.5 ${getRoleBadgeClass(currentUser?.role, currentUser?.department_domain)}`}>
                  {currentUser?.role === 'sub_admin' ? `${currentUser?.department_domain}` : currentUser?.role?.replace('_', ' ')}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
            </button>

            {/* Role Dropdown Menu */}
            {showRoleDropdown && (
              <div className="absolute right-0 mt-2 w-56 p-2 rounded-2xl border border-white/10 bg-black/95 backdrop-blur-2xl shadow-2xl z-50 text-xs space-y-1">
                <div className="px-2.5 py-1 text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
                  Select Persona:
                </div>
                {demoAccounts.map((acc, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      switchDemoRole(acc);
                      setShowRoleDropdown(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-xl transition-colors flex items-center justify-between ${
                      currentUser?.email === acc.email ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30' : 'hover:bg-white/5 text-zinc-300'
                    }`}
                  >
                    <span>{acc.full_name.split(' ')[0]}</span>
                    <span className="text-[10px] font-mono text-zinc-500 capitalize">
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
            className="p-2 text-zinc-400 hover:text-white rounded-full border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] transition-all cursor-pointer disabled:opacity-50"
            title="Sync Workspace Data"
          >
            <RefreshCw className={`w-3.5 h-3.5 stroke-[1.75] ${isRefreshing ? 'animate-spin text-cyan-400' : ''}`} />
          </button>

          {/* Auth Action */}
          {currentUser ? (
            <button
              onClick={logout}
              className="p-2 text-zinc-400 hover:text-rose-400 rounded-full border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] transition-colors cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5 stroke-[1.75]" />
            </button>
          ) : (
            <button
              onClick={onOpenLogin}
              className="px-4 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-full text-xs font-semibold border border-white/20 transition-all flex items-center space-x-1.5 cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
          )}

        </div>

      </div>
    </header>
  );
}
