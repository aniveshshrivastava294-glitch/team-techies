import React from 'react';
import { ShieldCheck, Globe } from 'lucide-react';

export default function InstitutionalFooter() {
  return (
    <footer className="mt-16 border-t border-[#E2DED4] bg-[#F5F4F0] text-[#8A8578] font-sans text-xs py-10 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Top Row: Brand Lockup & Org Tagline */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-[#E2DED4]">
          <div className="space-y-1">
            <div className="flex items-center space-x-2.5">
              <div className="w-5 h-5 rounded-md bg-[#1F2A38] flex items-center justify-center relative">
                <div className="w-2 h-2 rounded-full border border-[#3E5C76]" />
              </div>
              <span className="font-bold text-sm tracking-tight text-[#1F2A38]">
                CampusOrbit
              </span>
              <span className="px-2 py-0.5 text-xs bg-[#DCD7CC] text-[#8A8578] rounded-full border border-[#E2DED4]">
                Institutional v2.4
              </span>
            </div>
            <p className="text-[#8A8578] text-xs">
              Unified Campus Resource Management &amp; Operations Platform
            </p>
          </div>

          <div className="flex items-center space-x-6 text-[#8A8578]">
            <div className="flex items-center space-x-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#4E7A51]" />
              <span>FERPA Compliant</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <Globe className="w-3.5 h-3.5 text-[#3E5C76]" />
              <span>Systems Operational</span>
            </div>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-xs">
          <div>
            <h4 className="font-semibold text-[#1F2A38] text-xs mb-3">
              Platform Modules
            </h4>
            <ul className="space-y-2 text-[#8A8578]">
              <li>Classroom &amp; Facility Scheduling</li>
              <li>Campus Shuttle Telemetry</li>
              <li>Energy &amp; Sustainability Log</li>
              <li>Maintenance Dispatch</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-[#1F2A38] text-xs mb-3">
              Governance &amp; Security
            </h4>
            <ul className="space-y-2 text-[#8A8578]">
              <li>Role-Based Access Control (RBAC)</li>
              <li>Data Protection Policy</li>
              <li>Audit Logs &amp; Compliance</li>
              <li>Security Disclosures</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-[#1F2A38] text-xs mb-3">
              Institutional Resources
            </h4>
            <ul className="space-y-2 text-[#8A8578]">
              <li>Faculty Operations Manual</li>
              <li>System Administrator Guide</li>
              <li>API Integration Docs</li>
              <li>Service Status Dashboard</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-[#1F2A38] text-xs mb-3">
              Help &amp; Administration
            </h4>
            <ul className="space-y-2 text-[#8A8578]">
              <li>IT Support Desk</li>
              <li>Campus Safety Office</li>
              <li>Contact Registrar</li>
              <li>Submit Feedback</li>
            </ul>
          </div>
        </div>

        {/* Copyright & Disclaimer Line */}
        <div className="pt-6 border-t border-[#E2DED4] text-xs text-[#8A8578] flex flex-col sm:flex-row items-center justify-between gap-3">
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
