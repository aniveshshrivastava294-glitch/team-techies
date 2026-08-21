import React from 'react';
import { Building2, Calendar, Wrench, Bus, Zap, Users, ArrowUpRight, AlertTriangle } from 'lucide-react';

export default function KpiOverview({ kpis }) {
  if (!kpis) return null;

  const items = [
    {
      title: 'Classrooms',
      mainValue: `${kpis.totalClassrooms || 0}`,
      unit: 'halls',
      subValue: `${kpis.totalCapacity || 0} cap`,
      icon: Building2,
      badge: '98% active'
    },
    {
      title: 'Active Events',
      mainValue: `${kpis.scheduledEvents || 0}`,
      unit: 'events',
      subValue: '4 Complexes',
      icon: Calendar,
      badge: 'Q3 Schedule'
    },
    {
      title: 'Maintenance',
      mainValue: `${kpis.openMaintenance || 0}`,
      unit: 'tickets',
      subValue: `${kpis.criticalMaintenance || 0} critical`,
      icon: Wrench,
      badge: kpis.criticalMaintenance > 0 ? 'Action Needed' : 'Optimal',
      isAlert: kpis.criticalMaintenance > 0
    },
    {
      title: 'Transit Fleet',
      mainValue: `${kpis.transitRiders || 0}`,
      unit: 'riders',
      subValue: `${kpis.transitUtilizationPercent || 0}% load`,
      icon: Bus,
      badge: '6 Shuttles'
    },
    {
      title: 'Energy Grid',
      mainValue: `${kpis.totalEnergyKwh || 0}`,
      unit: 'kWh',
      subValue: `${kpis.avgKwhPerRoom || 0} / room`,
      icon: Zap,
      badge: 'Eco Active'
    },
    {
      title: 'Gate Scans',
      mainValue: `${kpis.dailyAttendanceCount || 0}`,
      unit: 'scans',
      subValue: '94.2% Attendance',
      icon: Users,
      badge: 'Gate Verified'
    }
  ];

  return (
    <section className="card-enterprise p-0 mb-6 font-sans">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 divide-y md:divide-y-0 md:divide-x divide-[#E2E8F0]">
        {items.map((item, idx) => {
          const IconComponent = item.icon;
          return (
            <div key={idx} className="p-3.5 space-y-1 hover:bg-[#F8FAFC] transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-medium text-slate-500 truncate">{item.title}</span>
                <IconComponent className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              </div>

              <div className="flex items-baseline space-x-1">
                <span className="text-xl font-bold text-slate-900 tracking-tight">{item.mainValue}</span>
                <span className="text-[11px] text-slate-400 font-mono">{item.unit}</span>
              </div>

              <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono pt-1">
                <span className="truncate">{item.subValue}</span>
                <span className={`px-1.5 py-0.5 rounded text-[9px] font-semibold ${
                  item.isAlert ? 'badge-pill badge-error' : 'bg-slate-100 text-slate-600'
                }`}>
                  {item.badge}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
