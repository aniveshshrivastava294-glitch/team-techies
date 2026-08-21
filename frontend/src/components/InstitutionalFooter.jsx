import React from 'react';
import { ShieldCheck, Globe } from 'lucide-react';

export default function InstitutionalFooter() {
  return (
    <footer className="mt-16 border-t border-[#E4E4E7] bg-white text-[#52525B] font-sans text-xs py-8 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Top Row: Brand & Compliance */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-[#E4E4E7]">
          <div className="space-y-1">
            <div className="flex items-center space-x-2.5">
              <span className="font-bold text-sm tracking-tight text-[#09090B]">
                Campus Orbit
              </span>
              <span className="badge-mono text-[9px] uppercase">
                EXECUTIVE MONOCHROME v2.4
              </span>
            </div>
            <p className="text-[#71717A] text-xs">
              Unified Campus Resource Management & Decision Operations Platform
            </p>
          </div>

          <div className="flex items-center space-x-6 text-[#52525B]">
            <div className="flex items-center space-x-1.5 badge-mono text-[10px]">
              <ShieldCheck className="w-3.5 h-3.5 text-black" />
              <span>FERPA Compliant</span>
            </div>
            <div className="flex items-center space-x-1.5 badge-mono text-[10px]">
              <Globe className="w-3.5 h-3.5 text-[#52525B]" />
              <span>System Operational</span>
            </div>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-xs">
          <div>
            <h4 className="font-bold text-[#09090B] uppercase tracking-wider text-[10px] mb-2.5">
              Platform Modules
            </h4>
            <ul className="space-y-1.5 text-[#52525B]">
              <li>Classroom & Facility Scheduling</li>
              <li>Campus Shuttle Telemetry</li>
              <li>Energy & Sustainability Log</li>
              <li>Maintenance Dispatch</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-[#09090B] uppercase tracking-wider text-[10px] mb-2.5">
              Governance & Security
            </h4>
            <ul className="space-y-1.5 text-[#52525B]">
              <li>Role-Based Access Control (RBAC)</li>
              <li>Data Protection Policy</li>
              <li>Audit Logs & Compliance</li>
              <li>Security Disclosures</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-[#09090B] uppercase tracking-wider text-[10px] mb-2.5">
              Institutional Resources
            </h4>
            <ul className="space-y-1.5 text-[#52525B]">
              <li>Faculty Operations Manual</li>
              <li>System Administrator Guide</li>
              <li>API Integration Docs</li>
              <li>Service Status Dashboard</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-[#09090B] uppercase tracking-wider text-[10px] mb-2.5">
              Help & Administration
            </h4>
            <ul className="space-y-1.5 text-[#52525B]">
              <li>IT Support Desk</li>
              <li>Campus Safety Office</li>
              <li>Contact Registrar</li>
              <li>Submit Feedback</li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-4 border-t border-[#E4E4E7] text-[11px] text-[#71717A] flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} Campus Orbit Systems. Enterprise Education Platform.</p>
          <div className="flex items-center space-x-4">
            <span className="hover:text-[#09090B] cursor-pointer">Privacy Policy</span>
            <span>•</span>
            <span className="hover:text-[#09090B] cursor-pointer">Terms of Service</span>
            <span>•</span>
            <span className="hover:text-[#09090B] cursor-pointer">Accessibility</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
