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
    <header className="sticky top-0 z-50 px-4 sm:px-8 py-3.5 bg-[#FAF7F2]/95 dark:bg-[#231F1B]/95 backdrop-blur-sm border-b-2 border-stone-300 dark:border-stone-800 font-sans">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* Brand: CampusOrbit Institutional Wordmark with Line-Art Orbit Ring */}
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full border-2 border-[#B5654A] flex items-center justify-center relative bg-stone-100 dark:bg-stone-800 flex-shrink-0">
            <div className="w-2.5 h-2.5 rounded-full bg-[#2F4034] dark:bg-[#5C6E3F]" />
            <div className="absolute inset-0 rounded-full border border-dashed border-[#B5654A]/50" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-serif font-bold tracking-tight text-stone-900 dark:text-stone-100">
                CampusOrbit
              </h1>
              <span className="px-2 py-0.5 text-[9px] font-mono font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 border border-stone-300 dark:border-stone-700 rounded bg-stone-200/60 dark:bg-stone-800">
                Institutional
              </span>
            </div>
            <p className="text-[11px] text-stone-500 dark:text-stone-400 font-medium">
              Campus Operations & Decision Support
            </p>
          </div>
        </div>

        {/* Navigation & Profile Actions */}
        <div className="flex items-center space-x-3">
          
          {/* Transport Fleet Status Button */}
          <button
            onClick={() => switchDemoRole(demoAccounts[3])}
            title="Switch to Transport Manager view"
            className="px-3 py-1.5 rounded border border-stone-300 dark:border-stone-700 bg-stone-100 dark:bg-stone-800/80 hover:bg-stone-200 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-200 text-xs font-medium transition-colors cursor-pointer flex items-center gap-2"
          >
            <span className="w-2 h-2 rounded-full bg-[#5C6E3F]"></span>
            <span className="hidden sm:inline font-mono">Bus Fleet Status</span>
          </button>

          {/* User Profile & Role Switcher */}
          <div className="relative">
            <button
              onClick={() => setShowRoleDropdown(!showRoleDropdown)}
              className="flex items-center space-x-2 px-3 py-1.5 rounded border border-stone-300 dark:border-stone-700 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-xs transition-colors cursor-pointer"
            >
              <div className="w-5 h-5 rounded-full bg-[#B5654A]/20 border border-[#B5654A]/40 flex items-center justify-center text-[#B5654A] font-mono text-[10px] font-bold">
                {currentUser?.full_name?.charAt(0) || 'G'}
              </div>
              <div className="text-left hidden md:block">
                <span className="font-bold text-stone-900 dark:text-stone-100 block leading-none text-xs">
                  {currentUser?.full_name?.split(' ')[0] || 'Guest'}
                </span>
                <span className="text-[9px] font-mono uppercase tracking-wider text-stone-500 dark:text-stone-400 block mt-0.5">
                  {currentUser?.role === 'sub_admin' ? currentUser?.department_domain : currentUser?.role?.replace('_', ' ')}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-stone-500" />
            </button>

            {/* Role Dropdown Menu */}
            {showRoleDropdown && (
              <div className="absolute right-0 mt-2 w-56 p-2 rounded-md border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 shadow-lg z-50 text-xs space-y-1">
                <div className="px-2.5 py-1 text-[10px] font-mono text-stone-500 uppercase tracking-wider border-b border-stone-200 dark:border-stone-800 mb-1">
                  Switch Account Role:
                </div>
                {demoAccounts.map((acc, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      switchDemoRole(acc);
                      setShowRoleDropdown(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded transition-colors flex items-center justify-between ${
                      currentUser?.email === acc.email ? 'bg-[#B5654A]/10 text-[#B5654A] font-bold border border-[#B5654A]/30' : 'hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300'
                    }`}
                  >
                    <span>{acc.full_name.split(' ')[0]}</span>
                    <span className="text-[10px] font-mono text-stone-500 capitalize">
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
            className="p-2 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white rounded border border-stone-300 dark:border-stone-700 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 transition-colors cursor-pointer disabled:opacity-50"
            title="Refresh Data"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-[#B5654A]' : ''}`} />
          </button>

          {/* Auth Action */}
          {currentUser ? (
            <button
              onClick={logout}
              className="p-2 text-stone-500 hover:text-[#A64B34] rounded border border-stone-300 dark:border-stone-700 bg-stone-100 dark:bg-stone-800 transition-colors cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={onOpenLogin}
              className="px-3.5 py-1.5 inst-button-primary text-xs flex items-center space-x-1.5 cursor-pointer"
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
