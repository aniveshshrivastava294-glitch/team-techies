import React from 'react';
import { ShieldCheck, Globe } from 'lucide-react';

export default function InstitutionalFooter() {
  return (
    <footer className="mt-16 border-t border-[#E8DCC8] bg-[#FDF8F2] text-[#6B5A4A] font-sans text-xs py-10 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Top Row: Brand Lockup & Org Tagline */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-[#E8DCC8]">
          <div className="space-y-1">
            <div className="flex items-center space-x-2.5">
              <div className="w-5 h-5 rounded-md bg-[#2B1D12] flex items-center justify-center relative">
                <div className="w-2 h-2 rounded-full border border-[#BC4800]" />
              </div>
              <span className="font-bold text-sm tracking-tight text-[#2B1D12]">
                CampusOrbit
              </span>
              <span className="px-2 py-0.5 text-xs bg-[#F7EFE4] text-[#6B5A4A] rounded-full border border-[#E8DCC8]">
                Institutional v2.4
              </span>
            </div>
            <p className="text-[#6B5A4A] text-xs">
              Unified Campus Resource Management & Operations Platform
            </p>
          </div>

          <div className="flex items-center space-x-6 text-[#6B5A4A]">
            <div className="flex items-center space-x-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#4E7A51]" />
              <span>FERPA Compliant</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <Globe className="w-3.5 h-3.5 text-[#BC4800]" />
              <span>Systems Operational</span>
            </div>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-xs">
          <div>
            <h4 className="font-semibold text-[#2B1D12] text-xs mb-3">
              Platform Modules
            </h4>
            <ul className="space-y-2 text-[#6B5A4A]">
              <li>Classroom & Facility Scheduling</li>
              <li>Campus Shuttle Telemetry</li>
              <li>Energy & Sustainability Log</li>
              <li>Maintenance Dispatch</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-[#2B1D12] text-xs mb-3">
              Governance & Security
            </h4>
            <ul className="space-y-2 text-[#6B5A4A]">
              <li>Role-Based Access Control (RBAC)</li>
              <li>Data Protection Policy</li>
              <li>Audit Logs & Compliance</li>
              <li>Security Disclosures</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-[#2B1D12] text-xs mb-3">
              Institutional Resources
            </h4>
            <ul className="space-y-2 text-[#6B5A4A]">
              <li>Faculty Operations Manual</li>
              <li>System Administrator Guide</li>
              <li>API Integration Docs</li>
              <li>Service Status Dashboard</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-[#2B1D12] text-xs mb-3">
              Help & Administration
            </h4>
            <ul className="space-y-2 text-[#6B5A4A]">
              <li>IT Support Desk</li>
              <li>Campus Safety Office</li>
              <li>Contact Registrar</li>
              <li>Submit Feedback</li>
            </ul>
          </div>
        </div>

        {/* Copyright & Disclaimer Line */}
        <div className="pt-6 border-t border-[#E8DCC8] text-xs text-[#6B5A4A] flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} CampusOrbit Systems. Presidency University Edition.</p>
          <div className="flex items-center space-x-4">
            <span className="hover:underline cursor-pointer">Privacy Policy</span>
            <span>•</span>
            <span className="hover:underline cursor-pointer">Terms of Service</span>
            <span>•</span>
            <span className="hover:underline cursor-pointer">Accessibility Statement</span>
          </div>
        </div>

      </div>
    </footer>
  );
}

