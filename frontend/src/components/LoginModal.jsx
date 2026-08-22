import React, { useState } from 'react';
import { useAuth, demoAccounts } from '../context/AuthContext';
import { Lock, ArrowRight } from 'lucide-react';

export default function LoginModal({ isOpen, onClose }) {
  const { login, register, switchDemoRole } = useAuth();
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('demo123');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('faculty');
  const [domain, setDomain] = useState('events');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (isRegisterMode) {
      const res = await register(email, password, role, domain, fullName);
      if (res.success) {
        onClose();
      } else {
        setError(res.error || 'Registration failed');
      }
    } else {
      const res = await login(email, password);
      if (res.success) {
        onClose();
      } else {
        setError(res.error || 'Invalid credentials');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs font-sans">
      <div className="card-surface w-full max-w-md p-6 rounded-lg border border-[#E6E0D2] shadow-xl relative bg-[#FAF8F3]">
        
        {/* Header */}
        <div className="text-center mb-4">
          <div className="w-8 h-8 bg-[#F0EBE1] border border-[#E6E0D2] rounded-md flex items-center justify-center text-[#1C1917] mx-auto mb-2">
            <Lock className="w-4 h-4" />
          </div>
          <h2 className="text-base font-bold text-[#1C1917] tracking-tight">
            {isRegisterMode ? 'Register Campus Account' : 'Campus Orbit Authentication'}
          </h2>
          <p className="text-xs text-[#57534E] font-medium mt-1">
            {isRegisterMode ? 'Faculty accounts auto-approve. Sub-Admins require administrator verification.' : 'Select a demo role below or sign in with credentials'}
          </p>
        </div>

        {/* Quick Demo Login Chips */}
        <div className="mb-4 bg-[#F0EBE1] p-3 rounded-md border border-[#E6E0D2]">
          <span className="text-[10px] font-mono font-bold text-[#57534E] uppercase tracking-wider block mb-1.5">
            Quick Demo Role Switcher:
          </span>
          <div className="grid grid-cols-2 gap-1.5 text-xs font-medium">
            {demoAccounts.map((acc, idx) => (
              <button
                key={idx}
                onClick={() => {
                  switchDemoRole(acc);
                  onClose();
                }}
                className="p-2 rounded-md border border-[#E6E0D2] bg-[#FAF8F3] hover:bg-[#F0EBE1] text-left transition-all cursor-pointer flex flex-col justify-between shadow-2xs"
              >
                <span className="font-bold text-[#1C1917] text-[11px] truncate">{acc.full_name.split(' ')[0]}</span>
                <span className="text-[10px] text-[#57534E] capitalize font-semibold">
                  {acc.role === 'sub_admin' ? `${acc.department_domain} Admin` : acc.role.replace('_', ' ')}
                  {acc.approval_status === 'pending' ? ' [Pending]' : ''}
                </span>
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="mb-4 p-2.5 badge-mono-dark w-full text-xs">
            {error}
          </div>
        )}

        {/* Custom Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          
          {isRegisterMode && (
            <div>
              <label className="block text-[#1C1917] font-semibold mb-1">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Dr. Jane Doe"
                className="w-full bg-white border border-[#E6E0D2] rounded-md px-3 py-2 text-[#1C1917] focus:bg-[#FAF8F3] focus:outline-none focus:border-[#1C1917] font-bold"
              />
            </div>
          )}

          <div>
            <label className="block text-[#1C1917] font-semibold mb-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@demo.com"
              className="w-full bg-white border border-[#E6E0D2] rounded-md px-3 py-2 text-[#1C1917] focus:bg-[#FAF8F3] focus:outline-none focus:border-[#1C1917] font-bold"
              required
            />
          </div>

          <div>
            <label className="block text-[#1C1917] font-semibold mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-white border border-[#E6E0D2] rounded-md px-3 py-2 text-[#1C1917] focus:bg-[#FAF8F3] focus:outline-none focus:border-[#1C1917] font-bold"
              required
            />
          </div>

          {isRegisterMode && (
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[#1C1917] font-semibold mb-1">Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full bg-white border border-[#E6E0D2] rounded-md px-3 py-2 text-[#1C1917] focus:bg-[#FAF8F3] focus:outline-none focus:border-[#1C1917] font-medium"
                >
                  <option value="faculty">Faculty (Auto-approved)</option>
                  <option value="sub_admin">Sub-Admin (Needs Approval)</option>
                </select>
              </div>

              {role === 'sub_admin' && (
                <div>
                  <label className="block text-[#1C1917] font-semibold mb-1">Domain</label>
                  <select
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    className="w-full bg-white border border-[#E6E0D2] rounded-md px-3 py-2 text-[#1C1917] focus:bg-[#FAF8F3] focus:outline-none focus:border-[#1C1917] font-medium"
                  >
                    <option value="events">Events Admin</option>
                    <option value="transport">Transport Admin</option>
                    <option value="maintenance">Maintenance Admin</option>
                    <option value="energy">Energy & Sustainability Admin</option>
                    <option value="classroom">Classroom & Academic Admin</option>
                  </select>
                </div>
              )}
            </div>
          )}

          <button
            type="submit"
            className="btn-primary w-full text-xs py-2.5 mt-2"
          >
            <span>{isRegisterMode ? 'Complete Registration' : 'Sign In to Dashboard'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* Toggle Mode */}
        <div className="mt-4 pt-3 border-t border-[#E6E0D2] text-center">
          <button
            onClick={() => {
              setIsRegisterMode(!isRegisterMode);
              setError('');
            }}
            className="text-xs text-[#1C1917] hover:underline font-bold cursor-pointer"
          >
            {isRegisterMode ? 'Already have an account? Sign In' : 'Need a new role account? Register here'}
          </button>
        </div>

      </div>
    </div>
  );
}
