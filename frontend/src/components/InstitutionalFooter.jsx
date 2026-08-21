import React from 'react';
import { ShieldCheck, Globe } from 'lucide-react';

export default function InstitutionalFooter() {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-white text-slate-600 font-sans text-xs py-8 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Top Row: Brand & Compliance */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div className="space-y-1">
            <div className="flex items-center space-x-2.5">
              <span className="font-bold text-sm tracking-tight text-slate-900">
                Campus Orbit
              </span>
              <span className="badge-info text-[9px] uppercase">
                ENTERPRISE EDITION v2.4
              </span>
            </div>
            <p className="text-slate-500 text-xs">
              Unified Campus Resource Management & Decision Operations Platform
            </p>
          </div>

          <div className="flex items-center space-x-6 text-slate-600">
            <div className="flex items-center space-x-1.5 badge-success text-[10px]">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>FERPA Compliant</span>
            </div>
            <div className="flex items-center space-x-1.5 badge-slate text-[10px]">
              <Globe className="w-3.5 h-3.5 text-slate-500" />
              <span>System Operational</span>
            </div>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-xs">
          <div>
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[10px] mb-2.5">
              Platform Modules
            </h4>
            <ul className="space-y-1.5 text-slate-600">
              <li>Classroom & Facility Scheduling</li>
              <li>Campus Shuttle Telemetry</li>
              <li>Energy & Sustainability Log</li>
              <li>Maintenance Dispatch</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[10px] mb-2.5">
              Governance & Security
            </h4>
            <ul className="space-y-1.5 text-slate-600">
              <li>Role-Based Access Control (RBAC)</li>
              <li>Data Protection Policy</li>
              <li>Audit Logs & Compliance</li>
              <li>Security Disclosures</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[10px] mb-2.5">
              Institutional Resources
            </h4>
            <ul className="space-y-1.5 text-slate-600">
              <li>Faculty Operations Manual</li>
              <li>System Administrator Guide</li>
              <li>API Integration Docs</li>
              <li>Service Status Dashboard</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[10px] mb-2.5">
              Help & Administration
            </h4>
            <ul className="space-y-1.5 text-slate-600">
              <li>IT Support Desk</li>
              <li>Campus Safety Office</li>
              <li>Contact Registrar</li>
              <li>Submit Feedback</li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-4 border-t border-slate-200 text-[11px] text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} Campus Orbit Systems. Enterprise Education Platform.</p>
          <div className="flex items-center space-x-4">
            <span className="hover:text-slate-900 cursor-pointer">Privacy Policy</span>
            <span>•</span>
            <span className="hover:text-slate-900 cursor-pointer">Terms of Service</span>
            <span>•</span>
            <span className="hover:text-slate-900 cursor-pointer">Accessibility</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
