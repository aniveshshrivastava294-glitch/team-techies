import React from 'react';
import { Building2, Calendar, Wrench, Bus, Zap, Users, AlertTriangle, TrendingUp } from 'lucide-react';

export default function KpiOverview({ kpis }) {
  if (!kpis) return null;

  const cards = [
    {
      title: 'Classrooms & Capacity',
      mainValue: `${kpis.totalClassrooms || 0} Halls`,
      subValue: `${kpis.totalCapacity || 0} Seat Capacity`,
      icon: Building2,
      color: 'blue',
      badge: 'Active Zones'
    },
    {
      title: 'Campus Events',
      mainValue: `${kpis.scheduledEvents || 0} Scheduled`,
      subValue: '2-3 Month Window',
      icon: Calendar,
      color: 'indigo',
      badge: 'Across 4 Complexes'
    },
    {
      title: 'Facility Maintenance',
      mainValue: `${kpis.openMaintenance || 0} Open Tickets`,
      subValue: `${kpis.criticalMaintenance || 0} Critical Priority`,
      icon: Wrench,
      color: kpis.criticalMaintenance > 0 ? 'red' : 'amber',
      badge: kpis.criticalMaintenance > 0 ? 'Action Required' : 'Normal',
      hasAlert: kpis.criticalMaintenance > 0
    },
    {
      title: 'Transit Ridership',
      mainValue: `${kpis.transitRiders || 0} Passengers`,
      subValue: `${kpis.transitUtilizationPercent || 0}% Peak Route Load`,
      icon: Bus,
      color: 'cyan',
      badge: '4 Shuttle Routes'
    },
    {
      title: 'Energy Demand',
      mainValue: `${kpis.totalEnergyKwh || 0} kWh`,
      subValue: `${kpis.avgKwhPerRoom || 0} kWh / Room Avg`,
      icon: Zap,
      color: 'amber',
      badge: 'Real-time BMS'
    },
    {
      title: 'Daily Attendance',
      mainValue: `${kpis.dailyAttendanceCount || 0} Scans`,
      subValue: 'RFID & AI Cameras',
      icon: Users,
      color: 'emerald',
      badge: 'Logged Gateways'
    }
  ];

  const getColorClasses = (color) => {
    switch (color) {
      case 'red':
        return {
          bg: 'bg-red-500/10 border-red-500/30',
          text: 'text-red-400',
          badge: 'bg-red-500/20 text-red-300 border-red-500/30'
        };
      case 'amber':
        return {
          bg: 'bg-amber-500/10 border-amber-500/30',
          text: 'text-amber-400',
          badge: 'bg-amber-500/20 text-amber-300 border-amber-500/30'
        };
      case 'cyan':
        return {
          bg: 'bg-cyan-500/10 border-cyan-500/30',
          text: 'text-cyan-400',
          badge: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
        };
      case 'emerald':
        return {
          bg: 'bg-emerald-500/10 border-emerald-500/30',
          text: 'text-emerald-400',
          badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
        };
      case 'indigo':
        return {
          bg: 'bg-indigo-500/10 border-indigo-500/30',
          text: 'text-indigo-400',
          badge: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
        };
      default:
        return {
          bg: 'bg-blue-500/10 border-blue-500/30',
          text: 'text-blue-400',
          badge: 'bg-blue-500/20 text-blue-300 border-blue-500/30'
        };
    }
  };

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
      {cards.map((card, idx) => {
        const IconComponent = card.icon;
        const style = getColorClasses(card.color);

        return (
          <div
            key={idx}
            className={`glass-panel p-4 rounded-xl relative overflow-hidden transition-all duration-200 hover:border-slate-700 group ${card.hasAlert ? 'glow-red' : ''}`}
          >
            {/* Header / Badge */}
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2 rounded-lg border ${style.bg} ${style.text}`}>
                <IconComponent className="w-4 h-4" />
              </div>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${style.badge}`}>
                {card.badge}
              </span>
            </div>

            {/* Main Title & Value */}
            <div>
              <p className="text-xs font-medium text-slate-400">{card.title}</p>
              <h3 className="text-xl font-bold text-white mt-1 tracking-tight">{card.mainValue}</h3>
              <p className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1">
                {card.hasAlert ? (
                  <AlertTriangle className="w-3 h-3 text-red-400 inline" />
                ) : (
                  <TrendingUp className="w-3 h-3 text-slate-500 inline" />
                )}
                <span>{card.subValue}</span>
              </p>
            </div>
          </div>
        );
      })}
    </section>
  );
}
