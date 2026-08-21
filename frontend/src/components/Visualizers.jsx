import React, { useState } from 'react';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, AreaChart, Area, Cell
} from 'recharts';
import { BarChart3, TrendingUp, Zap, Bus, Wrench, ShieldAlert } from 'lucide-react';

export default function Visualizers({ kpis, anomalies }) {
  const [activeChart, setActiveChart] = useState('attendance');

  // Chart 1 Data: Room Capacity vs Actual Scanned Attendance
  const capacityAttendanceData = [
    { room: 'CS-301', capacity: 200, actual: 185, expected: 185, hasIssue: true },
    { room: 'SCI-104', capacity: 60, actual: 105, expected: 90, hasIssue: true }, // Overflow Anomaly!
    { room: 'SCI-201', capacity: 120, actual: 110, expected: 115, hasIssue: false },
    { room: 'ENG-202', capacity: 80, actual: 72, expected: 75, hasIssue: false },
    { room: 'ART-101', capacity: 250, actual: 210, expected: 210, hasIssue: false },
    { room: 'BUS-401', capacity: 150, actual: 130, expected: 130, hasIssue: false }
  ];

  // Chart 2 Data: Time-series Energy Consumption (kWh) vs Room Occupancy Status
  const energyTimelineData = [
    { time: '00:00', LIB102_kWh: 4.2, CS301_kWh: 12.0, Occupancy: 0 },
    { time: '02:30', LIB102_kWh: 48.7, CS301_kWh: 11.5, Occupancy: 0 }, // Ghost Energy Spike!
    { time: '06:00', LIB102_kWh: 5.1, CS301_kWh: 15.0, Occupancy: 5 },
    { time: '09:00', LIB102_kWh: 18.4, CS301_kWh: 45.2, Occupancy: 120 },
    { time: '12:00', LIB102_kWh: 22.0, CS301_kWh: 58.0, Occupancy: 190 },
    { time: '14:00', LIB102_kWh: 21.5, CS301_kWh: 62.4, Occupancy: 185 },
    { time: '17:00', LIB102_kWh: 16.0, CS301_kWh: 38.0, Occupancy: 80 },
    { time: '21:00', LIB102_kWh: 8.5, CS301_kWh: 18.0, Occupancy: 10 }
  ];

  // Chart 3 Data: Maintenance Tickets by Domain & Severity
  const maintenanceData = [
    { category: 'HVAC System', Critical: 1, High: 2, Medium: 1, Low: 0 },
    { category: 'AV & Projectors', Critical: 0, High: 1, Medium: 2, Low: 1 },
    { category: 'Electrical', Critical: 0, High: 0, Medium: 2, Low: 1 },
    { category: 'Plumbing & Fixtures', Critical: 0, High: 1, Medium: 0, Low: 2 },
    { category: 'Furniture & Seating', Critical: 0, High: 0, Medium: 1, Low: 3 }
  ];

  // Chart 4 Data: Transit Routes Capacity vs Passengers
  const transitData = [
    { route: 'Shuttle 1', capacity: 60, passengers: 55, util: '91%' },
    { route: 'Shuttle 2', capacity: 60, passengers: 87, util: '145%' }, // Overcrowded Anomaly!
    { route: 'North Loop', capacity: 50, passengers: 38, util: '76%' },
    { route: 'Dorm Connect', capacity: 25, passengers: 22, util: '88%' }
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 border border-slate-700 p-3 rounded-lg text-xs shadow-xl font-sans">
          <p className="font-bold text-white mb-1">{label}</p>
          {payload.map((entry, idx) => (
            <p key={idx} style={{ color: entry.color }} className="font-medium">
              {entry.name}: <span className="font-bold text-white">{entry.value}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass-panel p-6 rounded-2xl border border-slate-800 mb-6">
      
      {/* Header & Chart Selector Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-blue-600/20 border border-blue-500/30 rounded-xl text-blue-400">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">Cross-Domain Interactive Visualizers</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Comparative capacity, energy footprint, transit loads, and maintenance distribution
            </p>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveChart('attendance')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              activeChart === 'attendance' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Capacity vs Attendance</span>
          </button>

          <button
            onClick={() => setActiveChart('energy')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              activeChart === 'energy' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Energy vs Occupancy</span>
          </button>

          <button
            onClick={() => setActiveChart('transit')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              activeChart === 'transit' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Bus className="w-3.5 h-3.5" />
            <span>Transit Utilization</span>
          </button>

          <button
            onClick={() => setActiveChart('maintenance')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              activeChart === 'maintenance' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Wrench className="w-3.5 h-3.5" />
            <span>Maintenance Tickets</span>
          </button>
        </div>
      </div>

      {/* Render Chart 1: Capacity vs Attendance */}
      {activeChart === 'attendance' && (
        <div>
          <div className="flex items-center justify-between mb-3 text-xs">
            <span className="text-slate-300 font-semibold">
              Comparison: Planned Seat Capacity vs Actual Scanned Attendance
            </span>
            <span className="text-red-400 font-semibold flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5" />
              SCI-104 exceeds room limit by 75%
            </span>
          </div>
          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={capacityAttendanceData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="room" stroke="#94a3b8" fontSize={12} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Bar dataKey="capacity" name="Room Capacity Limit" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="actual" name="Actual Scanned Attendance" radius={[4, 4, 0, 0]}>
                  {capacityAttendanceData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.actual > entry.capacity ? '#ef4444' : '#10b981'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Render Chart 2: Energy Timeline vs Occupancy */}
      {activeChart === 'energy' && (
        <div>
          <div className="flex items-center justify-between mb-3 text-xs">
            <span className="text-slate-300 font-semibold">
              Time-Series kWh Consumption vs Room Occupancy (Highlighting Ghost Energy Spike at 02:30 AM)
            </span>
            <span className="text-amber-400 font-semibold">LIB-102 Night Spike: 48.7 kWh</span>
          </div>
          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={energyTimelineData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <defs>
                  <linearGradient id="colorLib" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0}/>
                  </linearGradient>
                  <linearGradient id="colorCS" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="time" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Area type="monotone" dataKey="LIB102_kWh" name="Library LIB-102 (kWh)" stroke="#f59e0b" fillOpacity={1} fill="url(#colorLib)" />
                <Area type="monotone" dataKey="CS301_kWh" name="Auditorium CS-301 (kWh)" stroke="#3b82f6" fillOpacity={1} fill="url(#colorCS)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Render Chart 3: Transit Utilization */}
      {activeChart === 'transit' && (
        <div>
          <div className="flex items-center justify-between mb-3 text-xs">
            <span className="text-slate-300 font-semibold">
              Shuttle & Transit Route Capacity vs Active Passenger Load
            </span>
            <span className="text-red-400 font-semibold">Shuttle 2 at 145% Capacity</span>
          </div>
          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={transitData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="route" stroke="#94a3b8" fontSize={12} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Bar dataKey="capacity" name="Route Bus Capacity" fill="#64748b" radius={[4, 4, 0, 0]} />
                <Bar dataKey="passengers" name="Active Passenger Count" radius={[4, 4, 0, 0]}>
                  {transitData.map((entry, index) => (
                    <Cell
                      key={`cell-tr-${index}`}
                      fill={entry.passengers > entry.capacity ? '#ef4444' : '#06b6d4'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Render Chart 4: Maintenance Tickets */}
      {activeChart === 'maintenance' && (
        <div>
          <div className="flex items-center justify-between mb-3 text-xs">
            <span className="text-slate-300 font-semibold">
              Open Maintenance Work Orders by Issue Type and Severity
            </span>
            <span className="text-slate-400 font-medium">Critical Ticket: HVAC CS-301</span>
          </div>
          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={maintenanceData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="category" stroke="#94a3b8" fontSize={12} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Bar dataKey="Critical" stackId="a" fill="#ef4444" radius={[4, 4, 0, 0]} />
                <Bar dataKey="High" stackId="a" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Medium" stackId="a" fill="#eab308" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Low" stackId="a" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

    </div>
  );
}
