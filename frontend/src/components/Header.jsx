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
    <header className="sticky top-0 z-40 bg-[#FAF8F3] border-b border-[#E6E0D2] font-sans shadow-2xs">
      
      {/* Top Main Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
        
        {/* Brand Name Typography */}
        <div className="flex items-center space-x-3 shrink-0">
          <div className="w-7 h-7 rounded-md bg-[#1D4ED8] text-white flex items-center justify-center font-mono font-extrabold text-xs shadow-2xs">
            CO
          </div>
          <div>
            <h1 className="text-sm font-extrabold tracking-tight text-[#1C1917] leading-none">
              Campus Orbit
            </h1>
            <span className="text-[10px] text-[#1D4ED8] font-mono font-bold tracking-wider uppercase">
              EXECUTIVE PORTAL
            </span>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative flex-1 max-w-md hidden md:block">
          <Search className="w-3.5 h-3.5 text-[#78716C] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search rooms, bus routes, tickets, or staff (⌘K)..."
            className="w-full bg-[#F0EBE1] border border-[#E6E0D2] rounded-md pl-9 pr-12 py-1.5 text-xs text-[#1C1917] placeholder-[#78716C] focus:outline-none focus:border-[#1D4ED8] focus:bg-[#FAF8F3] font-medium transition-all"
          />
          <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-mono text-[#78716C] bg-[#FAF8F3] px-1.5 py-0.5 rounded border border-[#E6E0D2]">
            ⌘K
          </kbd>
        </div>

        {/* Status Indicator & Role Switcher */}
        <div className="flex items-center space-x-2">
          
          <div className="hidden lg:flex items-center space-x-1.5 badge-blue">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1D4ED8] animate-ping"></span>
            <span>System Online</span>
          </div>

          <div className="relative">
            <button
              onClick={() => setShowRoleDropdown(!showRoleDropdown)}
              className="btn-secondary text-xs flex items-center space-x-1.5 py-1 px-2.5"
            >
              <Shield className="w-3.5 h-3.5 text-[#1D4ED8]" />
              <span className="font-bold text-[#1C1917]">
                {currentUser?.full_name?.split(' ')[0] || 'Guest'}
              </span>
              <span className="text-[10px] font-mono text-[#78716C] uppercase">
                ({currentUser?.role === 'sub_admin' ? currentUser?.department_domain : currentUser?.role?.replace('_', ' ') || 'Visitor'})
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-[#78716C]" />
            </button>

            {showRoleDropdown && (
              <div className="absolute right-0 mt-1 w-56 p-1.5 rounded-md border border-[#E6E0D2] bg-[#FAF8F3] shadow-md z-50 text-xs space-y-1">
                <div className="px-2 py-1 text-[10px] font-mono text-[#78716C] uppercase tracking-wider border-b border-[#E6E0D2] mb-1 font-bold">
                  Switch Demo Role:
                </div>
                {demoAccounts.map((acc, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      switchDemoRole(acc);
                      setShowRoleDropdown(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs transition-colors flex items-center justify-between ${
                      currentUser?.email === acc.email ? 'bg-[#1D4ED8] text-white font-bold' : 'hover:bg-[#F0EBE1] text-[#1C1917]'
                    }`}
                  >
                    <span>{acc.full_name.split(' ')[0]}</span>
                    <span className="text-[10px] font-mono text-[#78716C] capitalize font-semibold">
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
            className="p-1.5 text-[#78716C] hover:text-[#1D4ED8] rounded hover:bg-[#F0EBE1]"
            title="Refresh Data"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-[#1D4ED8]' : ''}`} />
          </button>

          {currentUser ? (
            <button
              onClick={logout}
              className="p-1.5 text-[#78716C] hover:text-[#1C1917] rounded hover:bg-[#F0EBE1]"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={onOpenLogin}
              className="btn-primary-blue text-xs py-1 px-3"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
          )}

        </div>

      </div>

      {/* Integrated Navigation Tab Bar */}
      <div className="border-t border-[#E6E0D2] bg-[#FAF8F3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center space-x-1 overflow-x-auto whitespace-nowrap">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab && setActiveTab(item.id)}
                className={`py-2.5 px-3.5 text-xs font-bold flex items-center space-x-2 border-b-2 transition-all cursor-pointer ${
                  isActive
                    ? 'border-[#1D4ED8] text-[#1D4ED8] bg-[#EFF6FF]'
                    : 'border-transparent text-[#57534E] hover:text-[#1D4ED8] hover:bg-[#F5F2EB]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#1D4ED8]' : 'text-[#78716C]'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

    </header>
  );
}
