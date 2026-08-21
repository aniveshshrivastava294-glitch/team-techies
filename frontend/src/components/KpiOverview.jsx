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
      title: 'Grid Power Log',
      mainValue: `${kpis.totalEnergyKwh || 0}`,
      unit: 'kWh',
      subValue: `${kpis.avgKwhPerRoom || 0} kWh / room`,
      icon: Zap,
      trend: '-4.2%',
      color: 'amber',
      badge: 'BMS Eco Mode'
    },
    {
      title: 'Daily Scans',
      mainValue: `${kpis.dailyAttendanceCount || 0}`,
      unit: 'scans',
      subValue: 'Gateway Logged',
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
            className="p-5 rounded-2xl bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 hover:border-white/10 transition-all duration-300 relative group"
          >
            {/* Top Bar: Icon + Badge */}
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 rounded-xl bg-white/5 border border-white/10 text-zinc-300">
                <IconComponent className="w-4 h-4 stroke-[1.5]" />
              </div>
              <span className="text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border border-white/10 bg-white/[0.03] text-zinc-400">
                {card.badge}
              </span>
            </div>

            {/* Title */}
            <p className="text-xs font-semibold text-zinc-400 tracking-tight">{card.title}</p>

            {/* Floating Crisp Metric Value */}
            <div className="flex items-baseline space-x-1.5 mt-1">
              <h3 className="text-3xl font-mono font-black text-white tracking-tight">{card.mainValue}</h3>
              <span className="text-xs font-mono text-zinc-500">{card.unit}</span>
            </div>

            {/* Context Line */}
            <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between text-[11px]">
              <span className="text-zinc-500 font-mono text-[10px] truncate">{card.subValue}</span>
              <span className="font-mono text-[10px] font-bold text-cyan-400 flex items-center gap-0.5">
                {card.hasAlert ? <AlertTriangle className="w-3 h-3 text-rose-400 inline" /> : <ArrowUpRight className="w-3 h-3 inline stroke-[2]" />}
                <span>{card.trend}</span>
              </span>
            </div>
          </div>
        );
      })}
    </section>
  );
}
