import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const demoAccounts = [
  {
    id: "u0010000-0000-0000-0000-000000000001",
    email: "super@demo.com",
    role: "super_admin",
    department_domain: "general",
    approval_status: "approved",
    full_name: "Dr. Arthur Vance"
  },
  {
    id: "u0010000-0000-0000-0000-000000000002",
    email: "faculty@demo.com",
    role: "faculty",
    department_domain: "general",
    approval_status: "approved",
    full_name: "Prof. Elena Rostova"
  },
  {
    id: "u0010000-0000-0000-0000-000000000003",
    email: "events@demo.com",
    role: "sub_admin",
    department_domain: "events",
    approval_status: "approved",
    full_name: "Marcus Brody"
  },
  {
    id: "u0010000-0000-0000-0000-000000000004",
    email: "transport@demo.com",
    role: "sub_admin",
    department_domain: "transport",
    approval_status: "approved",
    full_name: "Cap. Frank Miller"
  },
  {
    id: "u0010000-0000-0000-0000-000000000005",
    email: "maint@demo.com",
    role: "sub_admin",
    department_domain: "maintenance",
    approval_status: "approved",
    full_name: "Eng. Sarah Jenkins"
  },
  {
    id: "u0010000-0000-0000-0000-000000000007",
    email: "energy@demo.com",
    role: "sub_admin",
    department_domain: "energy",
    approval_status: "approved",
    full_name: "Eng. Robert Vance (Energy)"
  },
  {
    id: "u0010000-0000-0000-0000-000000000008",
    email: "classroom@demo.com",
    role: "sub_admin",
    department_domain: "classroom",
    approval_status: "approved",
    full_name: "Prof. Vikram Patel (Classrooms)"
  },
  {
    id: "u0010000-0000-0000-0000-000000000006",
    email: "pending@demo.com",
    role: "sub_admin",
    department_domain: "events",
    approval_status: "pending",
    full_name: "David Chen"
  }
];

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('campus_orbit_user');
    return saved ? JSON.parse(saved) : demoAccounts[2]; // Default to Events Admin for immediate preview of Auditorium & Event Manager Interface
  });

  const login = async (email, password) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (data.status === 'success') {
        setCurrentUser(data.user);
        localStorage.setItem('campus_orbit_user', JSON.stringify(data.user));
        return { success: true };
      }
      return { success: false, error: data.error };
    } catch (err) {
      // Local fallback
      const found = demoAccounts.find(a => a.email.toLowerCase() === email.toLowerCase());
      if (found) {
        setCurrentUser(found);
        localStorage.setItem('campus_orbit_user', JSON.stringify(found));
        return { success: true };
      }
      return { success: false, error: 'User not found' };
    }
  };

  const register = async (email, password, role, department_domain, full_name) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role, department_domain, full_name })
      });
      const data = await res.json();
      if (data.status === 'success') {
        setCurrentUser(data.user);
        localStorage.setItem('campus_orbit_user', JSON.stringify(data.user));
        return { success: true, user: data.user };
      }
      return { success: false, error: data.error };
    } catch (err) {
      const approval_status = role === 'faculty' ? 'approved' : 'pending';
      const user = {
        id: `u-${Date.now()}`,
        email,
        role,
        department_domain: department_domain || 'general',
        approval_status,
        full_name: full_name || email.split('@')[0]
      };
      setCurrentUser(user);
      localStorage.setItem('campus_orbit_user', JSON.stringify(user));
      return { success: true, user };
    }
  };

  const switchDemoRole = (account) => {
    setCurrentUser(account);
    localStorage.setItem('campus_orbit_user', JSON.stringify(account));
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('campus_orbit_user');
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, register, logout, switchDemoRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
