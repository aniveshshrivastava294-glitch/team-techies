import React from 'react';
import { Building2, Calendar, Wrench, Bus, Zap, Users, AlertTriangle, ArrowUpRight } from 'lucide-react';

export default function KpiOverview({ kpis }) {
  if (!kpis) return null;

  const cards = [
    {
      title: 'Classrooms & Venues',
      mainValue: `${kpis.totalClassrooms || 0}`,
      unit: 'halls',
      subValue: `${kpis.totalCapacity || 0} capacity`,
      icon: Building2,
      trend: '+12%',
      badge: '98% operational'
    },
    {
      title: 'Campus Events',
      mainValue: `${kpis.scheduledEvents || 0}`,
      unit: 'active',
      subValue: 'Across 4 complexes',
      icon: Calendar,
      trend: '+8%',
      badge: 'Q3 schedule'
    },
    {
      title: 'Facility Maintenance',
      mainValue: `${kpis.openMaintenance || 0}`,
      unit: 'tickets',
      subValue: `${kpis.criticalMaintenance || 0} critical priority`,
      icon: Wrench,
      trend: kpis.criticalMaintenance > 0 ? 'Alert' : '-15%',
      badge: kpis.criticalMaintenance > 0 ? 'Action Required' : 'Optimal',
      hasAlert: kpis.criticalMaintenance > 0
    },
    {
      title: 'Shuttle Ridership',
      mainValue: `${kpis.transitRiders || 0}`,
      unit: 'riders',
      subValue: `${kpis.transitUtilizationPercent || 0}% route load`,
      icon: Bus,
      trend: '+5%',
      badge: '6 Bus Fleet'
    },
    {
      title: 'Energy Usage',
      mainValue: `${kpis.totalEnergyKwh || 0}`,
      unit: 'kWh',
      subValue: `${kpis.avgKwhPerRoom || 0} kWh / room`,
      icon: Zap,
      trend: '-4.2%',
      badge: 'Eco Mode Active'
    },
    {
      title: 'Daily Check-ins',
      mainValue: `${kpis.dailyAttendanceCount || 0}`,
      unit: 'scans',
      subValue: 'Campus Gate Scans',
      icon: Users,
      trend: '+18%',
      badge: '94.2% Rate'
    }
  ];

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5 mb-6 font-sans">
      {cards.map((card, idx) => {
        const IconComponent = card.icon;

        return (
          <div
            key={idx}
            className="p-4 rounded-xl border border-[#E2DED4] bg-[#DCD7CC] shadow-xs relative group hover:border-[#3E5C76]/40 transition-colors"
          >
            {/* Top Bar: Icon + Badge */}
            <div className="flex items-center justify-between mb-2.5">
              <div className="p-1.5 rounded-lg bg-[#F5F4F0] border border-[#E2DED4] text-[#1F2A38]">
                <IconComponent className="w-3.5 h-3.5" />
              </div>
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full border border-[#E2DED4] bg-[#F5F4F0] text-[#8A8578]">
                {card.badge}
              </span>
            </div>

            {/* Title */}
            <p className="text-xs font-medium text-[#8A8578]">{card.title}</p>

            {/* Metric Value */}
            <div className="flex items-baseline space-x-1.5 mt-1">
              <h3 className="text-xl font-bold text-[#1F2A38]">{card.mainValue}</h3>
              <span className="text-xs text-[#8A8578]">{card.unit}</span>
            </div>

            {/* Context Line */}
            <div className="mt-2.5 pt-2 border-t border-[#E2DED4] flex items-center justify-between text-xs">
              <span className="text-[#8A8578] text-[11px] truncate">{card.subValue}</span>
              <span className={`text-[11px] font-semibold flex items-center gap-0.5 ${card.hasAlert ? 'text-[#A6402F]' : 'text-[#3E5C76]'}`}>
                {card.hasAlert ? <AlertTriangle className="w-3 h-3 text-[#A6402F] inline" /> : <ArrowUpRight className="w-3 h-3 inline" />}
                <span>{card.trend}</span>
              </span>
            </div>
          </div>
        );
      })}
    </section>
  );
}

