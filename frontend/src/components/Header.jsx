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
    <header className="sticky top-0 z-40 bg-white border-b border-[#E4E4E7] font-sans shadow-2xs">
      
      {/* Top Main Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
        
        {/* Brand Name Typography */}
        <div className="flex items-center space-x-3 shrink-0">
          <div className="w-7 h-7 rounded-md bg-black text-white flex items-center justify-center font-mono font-bold text-xs">
            CO
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-tight text-[#09090B] leading-none">
              Campus Orbit
            </h1>
            <span className="text-[10px] text-[#71717A] font-mono tracking-wider uppercase">
              EXECUTIVE MONOCHROME
            </span>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative flex-1 max-w-md hidden md:block">
          <Search className="w-3.5 h-3.5 text-[#A1A1AA] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search rooms, bus routes, tickets, or staff (⌘K)..."
            className="w-full bg-[#F4F4F5] border border-[#E4E4E7] rounded-md pl-9 pr-12 py-1.5 text-xs text-[#09090B] placeholder-[#A1A1AA] focus:outline-none focus:border-black focus:bg-white transition-all"
          />
          <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-mono text-[#71717A] bg-white px-1.5 py-0.5 rounded border border-[#E4E4E7]">
            ⌘K
          </kbd>
        </div>

        {/* Status Indicator & Role Switcher */}
        <div className="flex items-center space-x-2">
          
          <div className="hidden lg:flex items-center space-x-1.5 badge-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-black animate-ping"></span>
            <span>System Online</span>
          </div>

          <div className="relative">
            <button
              onClick={() => setShowRoleDropdown(!showRoleDropdown)}
              className="btn-secondary text-xs flex items-center space-x-1.5 py-1 px-2.5"
            >
              <Shield className="w-3.5 h-3.5 text-black" />
              <span className="font-bold text-[#09090B]">
                {currentUser?.full_name?.split(' ')[0] || 'Guest'}
              </span>
              <span className="text-[10px] font-mono text-[#71717A] uppercase">
                ({currentUser?.role === 'sub_admin' ? currentUser?.department_domain : currentUser?.role?.replace('_', ' ') || 'Visitor'})
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-[#A1A1AA]" />
            </button>

            {showRoleDropdown && (
              <div className="absolute right-0 mt-1 w-56 p-1.5 rounded-md border border-[#E4E4E7] bg-white shadow-md z-50 text-xs space-y-1">
                <div className="px-2 py-1 text-[10px] font-mono text-[#71717A] uppercase tracking-wider border-b border-[#F4F4F5] mb-1">
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
                      currentUser?.email === acc.email ? 'bg-black text-white font-bold' : 'hover:bg-[#F4F4F5] text-[#09090B]'
                    }`}
                  >
                    <span>{acc.full_name.split(' ')[0]}</span>
                    <span className="text-[10px] font-mono text-[#71717A] capitalize">
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
            className="p-1.5 text-[#71717A] hover:text-black rounded hover:bg-[#F4F4F5]"
            title="Refresh Data"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-black' : ''}`} />
          </button>

          {currentUser ? (
            <button
              onClick={logout}
              className="p-1.5 text-[#71717A] hover:text-black rounded hover:bg-[#F4F4F5]"
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

      {/* Integrated Navigation Tab Bar */}
      <div className="border-t border-[#E4E4E7] bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center space-x-1 overflow-x-auto whitespace-nowrap">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab && setActiveTab(item.id)}
                className={`py-2.5 px-3.5 text-xs font-semibold flex items-center space-x-2 border-b-2 transition-all cursor-pointer ${
                  isActive
                    ? 'border-black text-black font-bold bg-[#F4F4F5]'
                    : 'border-transparent text-[#52525B] hover:text-black hover:bg-[#FAFAFA]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-black' : 'text-[#71717A]'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

    </header>
  );
}
