import React, { useState } from 'react';
import { useAuth, demoAccounts } from '../context/AuthContext';
import { RefreshCw, LogOut, LogIn, ChevronDown } from 'lucide-react';

export default function Header({ onRefresh, isRefreshing, datasource, onOpenLogin }) {
  const { currentUser, logout, switchDemoRole } = useAuth();
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);

  return (
    <header className="sticky top-0 z-50 px-4 sm:px-8 py-3 bg-[#F5F4F0]/95 backdrop-blur-md border-b border-[#E2DED4] font-sans">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* Brand: CampusOrbit Minimal Wordmark */}
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-[#1F2A38] flex items-center justify-center relative shrink-0 shadow-xs">
            <div className="w-3 h-3 rounded-full border-2 border-[#3E5C76]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold tracking-tight text-[#1F2A38]">
                CampusOrbit
              </h1>
              <span className="px-2 py-0.5 text-xs font-medium text-[#8A8578] border border-[#E2DED4] rounded-full bg-[#DCD7CC]">
                Operations
              </span>
            </div>
            <p className="text-xs text-[#8A8578]">
              Presidency University Intelligence
            </p>
          </div>
        </div>

        {/* Navigation & Profile Actions */}
        <div className="flex items-center space-x-2.5">
          
          {/* Quick Bus Fleet Status Button */}
          <button
            onClick={() => switchDemoRole(demoAccounts[3])}
            title="Switch to Transport Manager view"
            className="px-3 py-1.5 rounded-lg border border-[#E2DED4] bg-[#DCD7CC] hover:bg-[#F5F4F0] text-[#1F2A38] text-xs font-medium transition-colors cursor-pointer flex items-center gap-2 shadow-2xs"
          >
            <span className="w-2 h-2 rounded-full bg-[#4E7A51]"></span>
            <span className="hidden sm:inline">Fleet Operations</span>
          </button>

          {/* User Profile & Role Switcher */}
          <div className="relative">
            <button
              onClick={() => setShowRoleDropdown(!showRoleDropdown)}
              className="flex items-center space-x-2 px-3 py-1.5 rounded-lg border border-[#E2DED4] bg-[#DCD7CC] hover:bg-[#F5F4F0] text-xs transition-colors cursor-pointer shadow-2xs"
            >
              <div className="w-5 h-5 rounded-full bg-[#3E5C76]/15 border border-[#3E5C76]/30 flex items-center justify-center text-[#3E5C76] text-[11px] font-bold">
                {currentUser?.full_name?.charAt(0) || 'G'}
              </div>
              <div className="text-left hidden md:block">
                <span className="font-semibold text-[#1F2A38] block leading-tight text-xs">
                  {currentUser?.full_name?.split(' ')[0] || 'Guest'}
                </span>
                <span className="text-xs text-[#8A8578] block capitalize">
                  {currentUser?.role === 'sub_admin' ? currentUser?.department_domain : currentUser?.role?.replace('_', ' ')}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-[#8A8578]" />
            </button>

            {/* Role Dropdown Menu */}
            {showRoleDropdown && (
              <div className="absolute right-0 mt-2 w-64 p-2 rounded-xl border border-[#E2DED4] bg-[#DCD7CC] shadow-xl z-50 text-xs space-y-1">
                <div className="px-2.5 py-1 text-xs font-medium text-[#8A8578] border-b border-[#E2DED4] mb-1">
                  Switch Account Role:
                </div>
                {demoAccounts.map((acc, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      switchDemoRole(acc);
                      setShowRoleDropdown(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg transition-colors flex items-center justify-between cursor-pointer ${
                      currentUser?.email === acc.email ? 'bg-[#3E5C76]/15 text-[#3E5C76] font-semibold border border-[#3E5C76]/30' : 'hover:bg-[#F5F4F0] text-[#1F2A38]'
                    }`}
                  >
                    <span>{acc.full_name.split(' ')[0]}</span>
                    <span className="text-xs text-[#8A8578] capitalize">
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
            className="p-2 text-[#8A8578] hover:text-[#1F2A38] rounded-lg border border-[#E2DED4] bg-[#DCD7CC] hover:bg-[#F5F4F0] transition-colors cursor-pointer disabled:opacity-50 shadow-2xs"
            title="Refresh Data"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-[#3E5C76]' : ''}`} />
          </button>

          {/* Auth Action */}
          {currentUser ? (
            <button
              onClick={logout}
              className="p-2 text-[#8A8578] hover:text-[#A6402F] rounded-lg border border-[#E2DED4] bg-[#DCD7CC] hover:bg-[#F5F4F0] transition-colors cursor-pointer shadow-2xs"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={onOpenLogin}
              className="px-3.5 py-1.5 inst-button-primary text-xs flex items-center space-x-1.5 cursor-pointer shadow-2xs"
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
