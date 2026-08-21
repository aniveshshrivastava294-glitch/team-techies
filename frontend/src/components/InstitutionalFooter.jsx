import React from 'react';
import { ShieldCheck, Globe } from 'lucide-react';

export default function InstitutionalFooter() {
  return (
    <footer className="mt-16 border-t border-zinc-800 bg-zinc-950 text-zinc-400 font-sans text-xs py-8 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Top Row: Brand & Compliance */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
          <div className="space-y-1">
            <div className="flex items-center space-x-2.5">
              <span className="font-semibold text-sm tracking-tight text-zinc-50">
                Campus Orbit
              </span>
              <span className="badge-amber text-[9px] uppercase">
                EXECUTIVE v2.4
              </span>
            </div>
            <p className="text-zinc-400 text-xs">
              Unified Campus Resource Management & Decision Operations Platform
            </p>
          </div>

          <div className="flex items-center space-x-6 text-zinc-400">
            <div className="flex items-center space-x-1.5 badge-emerald text-[10px]">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>FERPA Compliant</span>
            </div>
            <div className="flex items-center space-x-1.5 badge-zinc text-[10px]">
              <Globe className="w-3.5 h-3.5 text-zinc-400" />
              <span>System Operational</span>
            </div>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-xs">
          <div>
            <h4 className="font-semibold text-zinc-200 uppercase tracking-wider text-[10px] mb-2.5">
              Platform Modules
            </h4>
            <ul className="space-y-1.5 text-zinc-400">
              <li>Classroom & Facility Scheduling</li>
              <li>Campus Shuttle Telemetry</li>
              <li>Energy & Sustainability Log</li>
              <li>Maintenance Dispatch</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-zinc-200 uppercase tracking-wider text-[10px] mb-2.5">
              Governance & Security
            </h4>
            <ul className="space-y-1.5 text-zinc-400">
              <li>Role-Based Access Control (RBAC)</li>
              <li>Data Protection Policy</li>
              <li>Audit Logs & Compliance</li>
              <li>Security Disclosures</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-zinc-200 uppercase tracking-wider text-[10px] mb-2.5">
              Institutional Resources
            </h4>
            <ul className="space-y-1.5 text-zinc-400">
              <li>Faculty Operations Manual</li>
              <li>System Administrator Guide</li>
              <li>API Integration Docs</li>
              <li>Service Status Dashboard</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-zinc-200 uppercase tracking-wider text-[10px] mb-2.5">
              Help & Administration
            </h4>
            <ul className="space-y-1.5 text-zinc-400">
              <li>IT Support Desk</li>
              <li>Campus Safety Office</li>
              <li>Contact Registrar</li>
              <li>Submit Feedback</li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-4 border-t border-zinc-800 text-[11px] text-zinc-500 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} Campus Orbit Systems. Enterprise Education Platform.</p>
          <div className="flex items-center space-x-4">
            <span className="hover:text-zinc-300 cursor-pointer">Privacy Policy</span>
            <span>•</span>
            <span className="hover:text-zinc-300 cursor-pointer">Terms of Service</span>
            <span>•</span>
            <span className="hover:text-zinc-300 cursor-pointer">Accessibility</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
