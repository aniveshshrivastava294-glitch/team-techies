import React from 'react';
import { ShieldCheck, Globe } from 'lucide-react';

export default function InstitutionalFooter() {
  return (
    <footer className="mt-16 border-t border-[#E6E0D2] bg-[#FAF8F3] text-[#57534E] font-sans text-xs py-8 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Top Row: Brand & Compliance */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-[#E6E0D2]">
          <div className="space-y-1">
            <div className="flex items-center space-x-2.5">
              <span className="font-bold text-sm tracking-tight text-[#1C1917]">
                Campus Orbit
              </span>
              <span className="badge-mono text-[9px] uppercase">
                EXECUTIVE BEIGE v2.4
              </span>
            </div>
            <p className="text-[#78716C] text-xs font-medium">
              Unified Campus Resource Management & Decision Operations Platform
            </p>
          </div>

          <div className="flex items-center space-x-6 text-[#57534E]">
            <div className="flex items-center space-x-1.5 badge-mono text-[10px]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#1C1917]" />
              <span>FERPA Compliant</span>
            </div>
            <div className="flex items-center space-x-1.5 badge-mono text-[10px]">
              <Globe className="w-3.5 h-3.5 text-[#57534E]" />
              <span>System Operational</span>
            </div>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-xs">
          <div>
            <h4 className="font-bold text-[#1C1917] uppercase tracking-wider text-[10px] mb-2.5">
              Platform Modules
            </h4>
            <ul className="space-y-1.5 text-[#57534E] font-medium">
              <li>Classroom & Facility Scheduling</li>
              <li>Campus Shuttle Telemetry</li>
              <li>Energy & Sustainability Log</li>
              <li>Maintenance Dispatch</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-[#1C1917] uppercase tracking-wider text-[10px] mb-2.5">
              Governance & Security
            </h4>
            <ul className="space-y-1.5 text-[#57534E] font-medium">
              <li>Role-Based Access Control (RBAC)</li>
              <li>Data Protection Policy</li>
              <li>Audit Logs & Compliance</li>
              <li>Security Disclosures</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-[#1C1917] uppercase tracking-wider text-[10px] mb-2.5">
              Institutional Resources
            </h4>
            <ul className="space-y-1.5 text-[#57534E] font-medium">
              <li>Faculty Operations Manual</li>
              <li>System Administrator Guide</li>
              <li>API Integration Docs</li>
              <li>Service Status Dashboard</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-[#1C1917] uppercase tracking-wider text-[10px] mb-2.5">
              Help & Administration
            </h4>
            <ul className="space-y-1.5 text-[#57534E] font-medium">
              <li>IT Support Desk</li>
              <li>Campus Safety Office</li>
              <li>Contact Registrar</li>
              <li>Submit Feedback</li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-4 border-t border-[#E6E0D2] text-[11px] text-[#78716C] flex flex-col sm:flex-row items-center justify-between gap-3 font-semibold">
          <p>© {new Date().getFullYear()} Campus Orbit Systems. Enterprise Education Platform.</p>
          <div className="flex items-center space-x-4">
            <span className="hover:text-[#1C1917] cursor-pointer">Privacy Policy</span>
            <span>•</span>
            <span className="hover:text-[#1C1917] cursor-pointer">Terms of Service</span>
            <span>•</span>
            <span className="hover:text-[#1C1917] cursor-pointer">Accessibility</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
