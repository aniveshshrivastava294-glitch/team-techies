import React, { useState } from 'react';
import { useAuth, demoAccounts } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Layers, RefreshCw, LogOut, LogIn, ChevronDown, Sun, Moon } from 'lucide-react';

export default function Header({ onRefresh, isRefreshing, datasource, onOpenLogin }) {
  const { currentUser, logout, switchDemoRole } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);

  const getRoleBadgeClass = (role, domain) => {
    switch (role) {
      case 'super_admin':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case 'faculty':
        return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30';
      case 'sub_admin':
        return domain === 'transport' ? 'bg-teal-500/20 text-teal-300 border-teal-500/30' : 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <header className="sticky top-4 z-50 px-4 sm:px-6 mb-6">
      {/* Floating Glass Pill Navbar */}
      <div className="max-w-7xl mx-auto glass-pill px-6 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        
        {/* Brand: Plain Text Campus Orbit */}
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-600/20 border border-blue-500/30 rounded-full text-blue-400">
            <Layers className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold tracking-tight text-white">Campus Orbit</h1>
              <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full">
                Agentic Glassmorphism
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">
              Intelligent Decision-Support Platform (SW-01-P)
            </p>
          </div>
        </div>

        {/* Navigation & Profile Actions */}
        <div className="flex items-center space-x-3">
          
          {/* Dark / Light Theme Toggle Button */}
          {toggleTheme && (
            <button
              onClick={toggleTheme}
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
              className="p-2 rounded-full border border-slate-800 bg-slate-900/80 text-amber-400 hover:scale-105 transition-all cursor-pointer"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          )}

          {/* User Profile & Quick Demo Switcher */}
          <div className="relative">
            <button
              onClick={() => setShowRoleDropdown(!showRoleDropdown)}
              className="flex items-center space-x-2.5 px-3 py-1.5 bg-slate-900/80 hover:bg-slate-800/80 border border-slate-800 rounded-full text-xs transition-all cursor-pointer"
            >
              <div className="w-6 h-6 rounded-full bg-blue-600/30 border border-blue-500/40 flex items-center justify-center text-blue-400 font-bold text-[10px]">
                {currentUser?.full_name?.charAt(0) || 'U'}
              </div>
              <div className="text-left hidden md:block">
                <span className="font-bold text-white block leading-tight">{currentUser?.full_name?.split(' ')[0] || 'Guest'}</span>
                <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded-full border ${getRoleBadgeClass(currentUser?.role, currentUser?.department_domain)}`}>
                  {currentUser?.role === 'sub_admin' ? `${currentUser?.department_domain} Admin` : currentUser?.role?.replace('_', ' ')}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {/* Quick Demo Role Dropdown */}
            {showRoleDropdown && (
              <div className="absolute right-0 mt-2 w-56 glass-panel p-2 rounded-2xl border border-slate-800 shadow-2xl z-50 text-xs space-y-1">
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
                    className={`w-full text-left px-2.5 py-1.5 rounded-xl transition-colors flex items-center justify-between ${
                      currentUser?.email === acc.email ? 'bg-blue-600 text-white font-bold' : 'hover:bg-slate-800/80 text-slate-300'
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
            className="p-2 bg-blue-600 hover:bg-blue-500 text-white rounded-full transition-all shadow-md shadow-blue-600/20 cursor-pointer disabled:opacity-50"
            title="Refresh Payload"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>

          {/* Auth Action */}
          {currentUser ? (
            <button
              onClick={logout}
              className="p-2 text-slate-400 hover:text-red-400 bg-slate-900/80 border border-slate-800 rounded-full transition-colors cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={onOpenLogin}
              className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-full text-xs font-bold transition-all shadow-md shadow-blue-600/20 flex items-center space-x-1 cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Login</span>
            </button>
          )}

        </div>

      </div>
    </header>
  );
}
