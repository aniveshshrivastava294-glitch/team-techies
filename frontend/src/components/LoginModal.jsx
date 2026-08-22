import React, { useState } from 'react';
import { useAuth, demoAccounts } from '../context/AuthContext';
import { BACKDROP_IMAGES } from '../config/backdropImages';
import { ArrowRight, X } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1F2A38]/60 backdrop-blur-xs font-sans">
      <div className="w-full max-w-md rounded-2xl border border-[#E2DED4] shadow-2xl relative bg-[#F5F4F0] overflow-hidden">
        
        {/* Header with campus photo and navy overlay */}
        <div className="relative p-6 bg-[#1F2A38] text-white flex flex-col justify-between">
          <img
            src={BACKDROP_IMAGES.loginLanding.url}
            alt={BACKDROP_IMAGES.loginLanding.alt}
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: 'rgba(31, 42, 56, 0.72)' }}
          />

          {/* Close Button */}
          <div className="relative z-10 flex items-center justify-between mb-3">
            <span className="px-2.5 py-0.5 rounded-full bg-white/15 border border-white/25 text-xs font-semibold tracking-widest uppercase text-white/90">
              Presidency University
            </span>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-white/60 hover:text-white bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="relative z-10">
            <h2 className="text-lg font-bold text-white leading-snug">
              {isRegisterMode ? 'Register Campus Account' : 'CampusOrbit Authentication'}
            </h2>
            <p className="text-xs text-white/70 mt-0.5">
              {isRegisterMode ? 'Faculty accounts auto-approve. Sub-Admins require review.' : 'Sign in to access unified institutional operations'}
            </p>
          </div>
        </div>

        <div className="p-5 space-y-4 bg-[#F5F4F0]">
          
          {/* Quick Demo Role Switcher */}
          <div className="bg-[#DCD7CC] p-3.5 rounded-xl border border-[#E2DED4]">
            <span className="text-xs font-semibold text-[#8A8578] block mb-2">
              Quick Demo Role Switcher:
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {demoAccounts.map((acc, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    switchDemoRole(acc);
                    onClose();
                  }}
                  className="p-2.5 rounded-lg border border-[#E2DED4] bg-[#F5F4F0] hover:border-[#3E5C76] hover:bg-[#DCD7CC] text-left text-[#1F2A38] transition-all cursor-pointer flex flex-col justify-between shadow-2xs"
                >
                  <span className="font-semibold text-xs text-[#1F2A38] truncate">{acc.full_name.split(' ')[0]}</span>
                  <span className="text-[11px] text-[#8A8578] capitalize mt-0.5">
                    {acc.role === 'sub_admin' ? `${acc.department_domain} Admin` : acc.role.replace('_', ' ')}
                    {acc.approval_status === 'pending' ? ' [Pending]' : ''}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="p-2.5 bg-[#A6402F]/15 border border-[#A6402F]/30 text-[#A6402F] rounded-lg text-xs font-medium">
              {error}
            </div>
          )}

          {/* Custom Auth Form */}
          <form onSubmit={handleSubmit} className="space-y-3 text-xs">
            
            {isRegisterMode && (
              <div>
                <label className="block text-[#8A8578] font-semibold mb-1">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Dr. Jane Doe"
                  className="w-full bg-[#DCD7CC] border border-[#E2DED4] rounded-lg px-3 py-2 text-[#1F2A38] focus:outline-none focus:border-[#3E5C76]"
                />
              </div>
            )}

            <div>
              <label className="block text-[#8A8578] font-semibold mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@demo.com"
                className="w-full bg-[#DCD7CC] border border-[#E2DED4] rounded-lg px-3 py-2 text-[#1F2A38] focus:outline-none focus:border-[#3E5C76]"
                required
              />
            </div>

            <div>
              <label className="block text-[#8A8578] font-semibold mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#DCD7CC] border border-[#E2DED4] rounded-lg px-3 py-2 text-[#1F2A38] focus:outline-none focus:border-[#3E5C76]"
                required
              />
            </div>

            {isRegisterMode && (
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[#8A8578] font-semibold mb-1">Role</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full bg-[#DCD7CC] border border-[#E2DED4] rounded-lg px-2.5 py-2 text-[#1F2A38] focus:outline-none focus:border-[#3E5C76]"
                  >
                    <option value="faculty">Faculty (Auto-approved)</option>
                    <option value="sub_admin">Sub-Admin (Needs Approval)</option>
                  </select>
                </div>

                {role === 'sub_admin' && (
                  <div>
                    <label className="block text-[#8A8578] font-semibold mb-1">Domain</label>
                    <select
                      value={domain}
                      onChange={(e) => setDomain(e.target.value)}
                      className="w-full bg-[#DCD7CC] border border-[#E2DED4] rounded-lg px-2.5 py-2 text-[#1F2A38] focus:outline-none focus:border-[#3E5C76]"
                    >
                      <option value="events">Events Admin</option>
                      <option value="transport">Transport Admin</option>
                      <option value="maintenance">Maintenance Admin</option>
                      <option value="energy">Energy Admin</option>
                      <option value="classroom">Classroom Admin</option>
                    </select>
                  </div>
                )}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2.5 inst-button-primary text-xs flex items-center justify-center space-x-2 cursor-pointer mt-2 shadow-2xs"
            >
              <span>{isRegisterMode ? 'Complete Registration' : 'Sign In to Dashboard'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Toggle Mode */}
          <div className="pt-3 border-t border-[#E2DED4] text-center">
            <button
              onClick={() => {
                setIsRegisterMode(!isRegisterMode);
                setError('');
              }}
              className="text-xs text-[#3E5C76] hover:underline font-semibold cursor-pointer"
            >
              {isRegisterMode ? 'Already have an account? Sign In' : 'Need a new role account? Register here'}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
