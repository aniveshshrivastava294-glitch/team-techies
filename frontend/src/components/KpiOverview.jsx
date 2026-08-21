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
      color: 'blue',
      badge: '98% operational'
    },
    {
      title: 'Campus Events',
      mainValue: `${kpis.scheduledEvents || 0}`,
      unit: 'active',
      subValue: 'Across 4 complexes',
      icon: Calendar,
      trend: '+8%',
      color: 'indigo',
      badge: 'Q3 schedule'
    },
    {
      title: 'Facility Maintenance',
      mainValue: `${kpis.openMaintenance || 0}`,
      unit: 'tickets',
      subValue: `${kpis.criticalMaintenance || 0} critical priority`,
      icon: Wrench,
      trend: kpis.criticalMaintenance > 0 ? 'Alert' : '-15%',
      color: kpis.criticalMaintenance > 0 ? 'red' : 'amber',
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
      color: 'cyan',
      badge: '6 Bus Fleet'
    },
    {
      title: 'Energy Usage',
      mainValue: `${kpis.totalEnergyKwh || 0}`,
      unit: 'kWh',
      subValue: `${kpis.avgKwhPerRoom || 0} kWh / room`,
      icon: Zap,
      trend: '-4.2%',
      color: 'amber',
      badge: 'Eco Mode Active'
    },
    {
      title: 'Daily Check-ins',
      mainValue: `${kpis.dailyAttendanceCount || 0}`,
      unit: 'scans',
      subValue: 'Campus Gate Scans',
      icon: Users,
      trend: '+18%',
      color: 'emerald',
      badge: '94.2% Attendance'
    }
  ];

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
      {cards.map((card, idx) => {
        const IconComponent = card.icon;

        return (
          <div
            key={idx}
            className="p-4 rounded border border-stone-300 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-sm relative group hover:border-[#B5654A]/40 transition-colors"
          >
            {/* Top Accent Line */}
            <div className="absolute top-0 left-3 right-3 h-0.5 bg-[#B5654A]/30 group-hover:bg-[#B5654A] transition-colors" />

            {/* Top Bar: Icon + Badge */}
            <div className="flex items-center justify-between mb-2 pt-1">
              <div className="p-1.5 rounded bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300">
                <IconComponent className="w-3.5 h-3.5" />
              </div>
              <span className="text-[9px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded border border-stone-200 dark:border-stone-700 bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400">
                {card.badge}
              </span>
            </div>

            {/* Title */}
            <p className="text-xs font-bold text-stone-600 dark:text-stone-400 tracking-tight font-sans">{card.title}</p>

            {/* Metric Value */}
            <div className="flex items-baseline space-x-1.5 mt-1">
              <h3 className="text-2xl font-serif font-bold text-stone-900 dark:text-stone-100 tracking-tight">{card.mainValue}</h3>
              <span className="text-xs font-mono text-stone-500">{card.unit}</span>
            </div>

            {/* Context Line */}
            <div className="mt-2.5 pt-2 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between text-[11px]">
              <span className="text-stone-500 font-mono text-[10px] truncate">{card.subValue}</span>
              <span className="font-mono text-[10px] font-bold text-[#B5654A] flex items-center gap-0.5">
                {card.hasAlert ? <AlertTriangle className="w-3 h-3 text-[#A64B34] inline" /> : <ArrowUpRight className="w-3 h-3 inline" />}
                <span>{card.trend}</span>
              </span>
            </div>
          </div>
        );
      })}
    </section>
  );
}
