import React, { useState } from 'react';
import { useAuth, demoAccounts } from '../context/AuthContext';
import { 
  Search, RefreshCw, LogOut, LogIn, ChevronDown, Shield, Sparkles,
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
    <header className="sticky top-0 z-40 bg-zinc-950 border-b border-zinc-800/80 font-sans shadow-none">
      
      {/* Top Main Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
        
        {/* Brand Name Typography (No Logo) */}
        <div className="flex items-center space-x-3 shrink-0">
          <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center font-mono font-bold text-xs">
            CO
          </div>
          <div>
            <h1 className="text-sm font-semibold tracking-tight text-zinc-50 leading-none">
              Campus Orbit
            </h1>
            <span className="text-[10px] text-zinc-500 font-mono tracking-wider uppercase">
              EXECUTIVE PLATFORM
            </span>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative flex-1 max-w-md hidden md:block">
          <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search rooms, bus routes, tickets, or staff (⌘K)..."
            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-9 pr-12 py-1.5 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-500/50"
          />
          <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-mono text-zinc-500 bg-zinc-950 px-1.5 py-0.5 rounded border border-zinc-800">
            ⌘K
          </kbd>
        </div>

        {/* Status Indicator & Role Switcher */}
        <div className="flex items-center space-x-2.5">
          
          <div className="hidden lg:flex items-center space-x-1.5 badge-emerald">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>System Online</span>
          </div>

          <div className="relative">
            <button
              onClick={() => setShowRoleDropdown(!showRoleDropdown)}
              className="btn-onyx-secondary text-xs flex items-center space-x-1.5 py-1 px-2.5"
            >
              <Shield className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-semibold text-zinc-100">
                {currentUser?.full_name?.split(' ')[0] || 'Guest'}
              </span>
              <span className="text-[10px] font-mono text-zinc-400 uppercase">
                ({currentUser?.role === 'sub_admin' ? currentUser?.department_domain : currentUser?.role?.replace('_', ' ') || 'Visitor'})
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />
            </button>

            {showRoleDropdown && (
              <div className="absolute right-0 mt-1 w-56 p-1.5 rounded-xl border border-zinc-800 bg-zinc-900 shadow-none z-50 text-xs space-y-1">
                <div className="px-2 py-1 text-[10px] font-mono text-zinc-500 uppercase tracking-wider border-b border-zinc-800 mb-1">
                  Switch Demo Role:
                </div>
                {demoAccounts.map((acc, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      switchDemoRole(acc);
                      setShowRoleDropdown(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-colors flex items-center justify-between ${
                      currentUser?.email === acc.email ? 'bg-amber-500/10 text-amber-400 font-bold border border-amber-500/20' : 'hover:bg-zinc-800 text-zinc-300'
                    }`}
                  >
                    <span>{acc.full_name.split(' ')[0]}</span>
                    <span className="text-[10px] font-mono text-zinc-400 capitalize">
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
            className="btn-onyx-ghost p-1.5 text-zinc-400"
            title="Refresh Data"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-amber-400' : ''}`} />
          </button>

          {currentUser ? (
            <button
              onClick={logout}
              className="btn-onyx-ghost p-1.5 text-zinc-400 hover:text-rose-400"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={onOpenLogin}
              className="btn-amber-primary text-xs py-1 px-3"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
          )}

        </div>

      </div>

      {/* Integrated Navigation Tab Bar */}
      <div className="border-t border-zinc-800/80 bg-zinc-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center space-x-1 overflow-x-auto whitespace-nowrap">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab && setActiveTab(item.id)}
                className={`py-2.5 px-3.5 text-xs font-medium flex items-center space-x-2 border-b-2 transition-all cursor-pointer ${
                  isActive
                    ? 'border-amber-400 text-amber-400 font-semibold bg-zinc-900/60'
                    : 'border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/30'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-400' : 'text-zinc-500'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

    </header>
  );
}
