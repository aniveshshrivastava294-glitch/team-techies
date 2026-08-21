import React from 'react';
import { Building2, Calendar, Wrench, Bus, Zap, Users, AlertTriangle, ArrowUpRight, TrendingUp } from 'lucide-react';

export default function KpiOverview({ kpis }) {
  if (!kpis) return null;

  const cards = [
    {
      title: 'Classrooms & Venues',
      mainValue: `${kpis.totalClassrooms || 0}`,
      unit: 'Active Halls',
      subValue: `${kpis.totalCapacity || 0} Total Capacity`,
      icon: Building2,
      trend: '+12%',
      color: 'blue',
      badge: '98% Operational'
    },
    {
      title: 'Campus Events',
      mainValue: `${kpis.scheduledEvents || 0}`,
      unit: 'Scheduled',
      subValue: 'Across 4 Complexes',
      icon: Calendar,
      trend: '+8%',
      color: 'indigo',
      badge: 'Q3 Schedule'
    },
    {
      title: 'Facility Maintenance',
      mainValue: `${kpis.openMaintenance || 0}`,
      unit: 'Open Tickets',
      subValue: `${kpis.criticalMaintenance || 0} Critical Priority`,
      icon: Wrench,
      trend: kpis.criticalMaintenance > 0 ? 'Alert' : '-15%',
      color: kpis.criticalMaintenance > 0 ? 'red' : 'amber',
      badge: kpis.criticalMaintenance > 0 ? 'Action Required' : 'Optimal',
      hasAlert: kpis.criticalMaintenance > 0
    },
    {
      title: 'Shuttle Ridership',
      mainValue: `${kpis.transitRiders || 0}`,
      unit: 'Active Passengers',
      subValue: `${kpis.transitUtilizationPercent || 0}% Peak Route Load`,
      icon: Bus,
      trend: '+5%',
      color: 'cyan',
      badge: '6 Bus Fleet'
    },
    {
      title: 'Grid Power Consumption',
      mainValue: `${kpis.totalEnergyKwh || 0}`,
      unit: 'kWh Total',
      subValue: `${kpis.avgKwhPerRoom || 0} kWh / Room Avg`,
      icon: Zap,
      trend: '-4.2%',
      color: 'amber',
      badge: 'BMS Eco Mode'
    },
    {
      title: 'Daily Check-ins',
      mainValue: `${kpis.dailyAttendanceCount || 0}`,
      unit: 'RFID Scans',
      subValue: 'Gate Gateway Logged',
      icon: Users,
      trend: '+18%',
      color: 'emerald',
      badge: '94.2% Attendance'
    }
  ];

  const getColorStyles = (color) => {
    switch (color) {
      case 'red':
        return {
          iconBg: 'bg-red-500/10 text-red-400 border-red-500/20',
          badge: 'bg-red-500/15 text-red-300 border-red-500/30',
          trend: 'text-red-400 bg-red-500/10'
        };
      case 'amber':
        return {
          iconBg: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
          badge: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
          trend: 'text-amber-400 bg-amber-500/10'
        };
      case 'cyan':
        return {
          iconBg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
          badge: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
          trend: 'text-emerald-400 bg-emerald-500/10'
        };
      case 'emerald':
        return {
          iconBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
          badge: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
          trend: 'text-emerald-400 bg-emerald-500/10'
        };
      case 'indigo':
        return {
          iconBg: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
          badge: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30',
          trend: 'text-emerald-400 bg-emerald-500/10'
        };
      default:
        return {
          iconBg: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
          badge: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
          trend: 'text-emerald-400 bg-emerald-500/10'
        };
    }
  };

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
      {cards.map((card, idx) => {
        const IconComponent = card.icon;
        const style = getColorStyles(card.color);

        return (
          <div
            key={idx}
            className={`glass-card p-5 rounded-2xl relative overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:border-slate-700/80 group ${
              card.hasAlert ? 'glow-red' : ''
            }`}
          >
            {/* Top Bar: Icon + Badge */}
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2.5 rounded-xl border ${style.iconBg}`}>
                <IconComponent className="w-4 h-4 stroke-[2.2]" />
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${style.badge}`}>
                {card.badge}
              </span>
            </div>

            {/* Title */}
            <p className="text-xs font-semibold text-slate-400">{card.title}</p>

            {/* Metric Value */}
            <div className="flex items-baseline space-x-1.5 mt-1">
              <h3 className="text-2xl font-extrabold text-white tracking-tight">{card.mainValue}</h3>
              <span className="text-[11px] font-medium text-slate-400">{card.unit}</span>
            </div>

            {/* Micro Trend & Context */}
            <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
              <span className="text-slate-400 truncate max-w-[110px]">{card.subValue}</span>
              <span className={`px-1.5 py-0.5 rounded font-mono font-bold text-[10px] flex items-center gap-0.5 ${style.trend}`}>
                {card.hasAlert ? <AlertTriangle className="w-3 h-3 inline" /> : <ArrowUpRight className="w-3 h-3 inline" />}
                <span>{card.trend}</span>
              </span>
            </div>
          </div>
        );
      })}
    </section>
  );
}
