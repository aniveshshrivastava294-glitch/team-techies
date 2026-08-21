import React, { useState } from 'react';
import { useAuth, demoAccounts } from '../context/AuthContext';
import { ShieldCheck, UserCheck, Key, Lock, ArrowRight, UserPlus, LogIn } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs font-sans">
      <div className="card-enterprise w-full max-w-md p-6 rounded-lg border border-slate-200 shadow-xl relative bg-white">
        
        {/* Header */}
        <div className="text-center mb-4">
          <div className="w-9 h-9 bg-blue-50 border border-blue-200 rounded flex items-center justify-center text-[#2563EB] mx-auto mb-2">
            <Lock className="w-4 h-4" />
          </div>
          <h2 className="text-base font-bold text-slate-900 tracking-tight">
            {isRegisterMode ? 'Register Campus Account' : 'CampusOrbit Authentication'}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {isRegisterMode ? 'Faculty accounts auto-approve. Sub-Admins require administrator verification.' : 'Select a demo role below or sign in with credentials'}
          </p>
        </div>

        {/* Quick Demo Login Chips */}
        <div className="mb-4 bg-[#F8FAFC] p-3 rounded border border-slate-200">
          <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
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
                className={`p-2 rounded-lg border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  acc.role === 'super_admin'
                    ? 'bg-purple-950/40 border-purple-500/30 text-purple-300 hover:bg-purple-900/40'
                    : acc.role === 'faculty'
                    ? 'bg-blue-950/40 border-blue-500/30 text-blue-300 hover:bg-blue-900/40'
                    : acc.approval_status === 'pending'
                    ? 'bg-amber-950/40 border-amber-500/30 text-amber-300 hover:bg-amber-900/40'
                    : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <span className="font-bold text-[11px] truncate">{acc.full_name.split(' ')[0]}</span>
                <span className="text-[10px] opacity-75 capitalize">
                  {acc.role === 'sub_admin' ? `${acc.department_domain} Admin` : acc.role.replace('_', ' ')}
                  {acc.approval_status === 'pending' ? ' [Pending]' : ''}
                </span>
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl text-xs">
            {error}
          </div>
        )}

        {/* Custom Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          
          {isRegisterMode && (
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Dr. Jane Doe"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          )}

          <div>
            <label className="block text-slate-400 font-semibold mb-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@demo.com"
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-slate-400 font-semibold mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          {isRegisterMode && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="faculty">Faculty (Auto-approved)</option>
                  <option value="sub_admin">Sub-Admin (Needs Approval)</option>
                </select>
              </div>

              {role === 'sub_admin' && (
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Domain</label>
                  <select
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-blue-500"
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
            className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center space-x-2 cursor-pointer mt-2"
          >
            <span>{isRegisterMode ? 'Complete Registration' : 'Sign In to Dashboard'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Toggle Mode */}
        <div className="mt-4 pt-4 border-t border-slate-800 text-center">
          <button
            onClick={() => {
              setIsRegisterMode(!isRegisterMode);
              setError('');
            }}
            className="text-xs text-blue-400 hover:text-blue-300 font-semibold cursor-pointer"
          >
            {isRegisterMode ? 'Already have an account? Sign In' : 'Need a new role account? Register here'}
          </button>
        </div>

      </div>
    </div>
  );
}
