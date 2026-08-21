import React, { useState } from 'react';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, AreaChart, Area, Cell
} from 'recharts';
import { BarChart3, TrendingUp, Zap, Bus, Wrench } from 'lucide-react';

export default function Visualizers({ kpis, anomalies }) {
  const [activeChart, setActiveChart] = useState('attendance');

  const capacityAttendanceData = [
    { room: 'CS-301', capacity: 200, actual: 185, expected: 185, hasIssue: true },
    { room: 'SCI-104', capacity: 60, actual: 105, expected: 90, hasIssue: true },
    { room: 'SCI-201', capacity: 120, actual: 110, expected: 115, hasIssue: false },
    { room: 'ENG-202', capacity: 80, actual: 72, expected: 75, hasIssue: false },
    { room: 'ART-101', capacity: 250, actual: 210, expected: 210, hasIssue: false },
    { room: 'BUS-401', capacity: 150, actual: 130, expected: 130, hasIssue: false }
  ];

  const energyTimelineData = [
    { time: '00:00', LIB102_kWh: 4.2, CS301_kWh: 12.0, Occupancy: 0 },
    { time: '02:30', LIB102_kWh: 48.7, CS301_kWh: 11.5, Occupancy: 0 },
    { time: '06:00', LIB102_kWh: 5.1, CS301_kWh: 15.0, Occupancy: 5 },
    { time: '09:00', LIB102_kWh: 18.4, CS301_kWh: 45.2, Occupancy: 120 },
    { time: '12:00', LIB102_kWh: 22.0, CS301_kWh: 58.0, Occupancy: 190 },
    { time: '14:00', LIB102_kWh: 21.5, CS301_kWh: 62.4, Occupancy: 185 },
    { time: '17:00', LIB102_kWh: 16.0, CS301_kWh: 38.0, Occupancy: 80 },
    { time: '21:00', LIB102_kWh: 8.5, CS301_kWh: 18.0, Occupancy: 10 }
  ];

  const maintenanceData = [
    { category: 'HVAC System', Critical: 1, High: 2, Medium: 1, Low: 0 },
    { category: 'AV & Projectors', Critical: 0, High: 1, Medium: 2, Low: 1 },
    { category: 'Electrical', Critical: 0, High: 0, Medium: 2, Low: 1 },
    { category: 'Plumbing & Fixtures', Critical: 0, High: 1, Medium: 0, Low: 2 },
    { category: 'Furniture & Seating', Critical: 0, High: 0, Medium: 1, Low: 3 }
  ];

  const transitData = [
    { route: 'Shuttle 1', capacity: 60, passengers: 55, util: '91%' },
    { route: 'Shuttle 2', capacity: 60, passengers: 87, util: '145%' },
    { route: 'North Loop', capacity: 50, passengers: 38, util: '76%' },
    { route: 'Dorm Connect', capacity: 25, passengers: 22, util: '88%' }
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-slate-200 p-3 rounded-md text-xs shadow-md font-sans space-y-1">
          <p className="font-bold text-slate-900 mb-1">{label}</p>
          {payload.map((entry, idx) => (
            <p key={idx} style={{ color: entry.color }} className="font-medium flex items-center justify-between gap-4">
              <span>{entry.name}:</span>
              <span className="font-mono font-bold text-slate-900">{entry.value}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="card-surface p-5 mb-6 font-sans shadow-xs">
      
      {/* Header & Navigation Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-200">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-md bg-blue-50 border border-blue-200 text-blue-600">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900">Campus Analytics & Trends</h2>
            <p className="text-xs text-slate-600 mt-0.5">
              Interactive charts for room capacity, energy use, transit load, and maintenance tickets.
            </p>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center space-x-1 overflow-x-auto pb-1 sm:pb-0 whitespace-nowrap">
          <button
            onClick={() => setActiveChart('attendance')}
            className={`px-3 py-1.5 text-xs font-semibold cursor-pointer transition-colors flex items-center gap-1.5 ${
              activeChart === 'attendance' ? 'nav-tab-active' : 'nav-tab-inactive'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Seat Capacity</span>
          </button>

          <button
            onClick={() => setActiveChart('energy')}
            className={`px-3 py-1.5 text-xs font-semibold cursor-pointer transition-colors flex items-center gap-1.5 ${
              activeChart === 'energy' ? 'nav-tab-active' : 'nav-tab-inactive'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Energy Use</span>
          </button>

          <button
            onClick={() => setActiveChart('transit')}
            className={`px-3 py-1.5 text-xs font-semibold cursor-pointer transition-colors flex items-center gap-1.5 ${
              activeChart === 'transit' ? 'nav-tab-active' : 'nav-tab-inactive'
            }`}
          >
            <Bus className="w-3.5 h-3.5" />
            <span>Shuttle Load</span>
          </button>

          <button
            onClick={() => setActiveChart('maintenance')}
            className={`px-3 py-1.5 text-xs font-semibold cursor-pointer transition-colors flex items-center gap-1.5 ${
              activeChart === 'maintenance' ? 'nav-tab-active' : 'nav-tab-inactive'
            }`}
          >
            <Wrench className="w-3.5 h-3.5" />
            <span>Maintenance</span>
          </button>
        </div>
      </div>

      {/* Chart 1: Capacity vs Attendance */}
      {activeChart === 'attendance' && (
        <div>
          <div className="flex items-center justify-between mb-3 text-xs">
            <span className="text-slate-900 font-bold">
              Planned Room Capacity vs Actual Attendance
            </span>
            <span className="badge-error text-[10px]">
              SCI-104 Exceeds Limit (+75%)
            </span>
          </div>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={capacityAttendanceData} margin={{ top: 10, right: 10, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="room" stroke="#64748B" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={11} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Bar dataKey="capacity" name="Room Capacity Limit" fill="#CBD5E1" radius={[4, 4, 0, 0]} />
                <Bar dataKey="actual" name="Actual Attendance" radius={[4, 4, 0, 0]}>
                  {capacityAttendanceData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.actual > entry.capacity ? '#DC2626' : '#2563EB'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Chart 2: Energy Timeline vs Occupancy */}
      {activeChart === 'energy' && (
        <div>
          <div className="flex items-center justify-between mb-3 text-xs">
            <span className="text-slate-900 font-bold">
              Power Demand (kWh) Across Time
            </span>
            <span className="badge-warning text-[10px]">LIB-102 Overnight Spike: 48.7 kWh</span>
          </div>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={energyTimelineData} margin={{ top: 10, right: 10, left: -10, bottom: 5 }}>
                <defs>
                  <linearGradient id="colorLib" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#14B8A6" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#14B8A6" stopOpacity={0.0}/>
                  </linearGradient>
                  <linearGradient id="colorCS" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="time" stroke="#64748B" fontSize={11} />
                <YAxis stroke="#64748B" fontSize={11} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Area type="monotone" dataKey="LIB102_kWh" name="Library LIB-102 (kWh)" stroke="#14B8A6" fillOpacity={1} fill="url(#colorLib)" />
                <Area type="monotone" dataKey="CS301_kWh" name="Auditorium CS-301 (kWh)" stroke="#2563EB" fillOpacity={1} fill="url(#colorCS)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Chart 3: Transit Load */}
      {activeChart === 'transit' && (
        <div>
          <div className="flex items-center justify-between mb-3 text-xs">
            <span className="text-slate-900 font-bold">
              Shuttle Seating Capacity vs Active Passengers
            </span>
            <span className="badge-error text-[10px]">Shuttle 2: 145% Load</span>
          </div>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={transitData} margin={{ top: 10, right: 10, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="route" stroke="#64748B" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={11} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Bar dataKey="capacity" name="Vehicle Capacity" fill="#CBD5E1" radius={[4, 4, 0, 0]} />
                <Bar dataKey="passengers" name="Passenger Count" radius={[4, 4, 0, 0]}>
                  {transitData.map((entry, index) => (
                    <Cell
                      key={`cell-tr-${index}`}
                      fill={entry.passengers > entry.capacity ? '#DC2626' : '#14B8A6'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Chart 4: Maintenance Work Orders */}
      {activeChart === 'maintenance' && (
        <div>
          <div className="flex items-center justify-between mb-3 text-xs">
            <span className="text-slate-900 font-bold">
              Maintenance Tickets by Category & Severity
            </span>
            <span className="text-slate-500 font-mono text-[11px]">Critical: HVAC CS-301</span>
          </div>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={maintenanceData} margin={{ top: 10, right: 10, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="category" stroke="#64748B" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={11} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Bar dataKey="Critical" stackId="a" fill="#DC2626" radius={[4, 4, 0, 0]} />
                <Bar dataKey="High" stackId="a" fill="#F59E0B" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Medium" stackId="a" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Low" stackId="a" fill="#2563EB" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

    </div>
  );
}
