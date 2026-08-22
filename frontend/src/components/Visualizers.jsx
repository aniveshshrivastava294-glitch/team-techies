import React, { useState } from 'react';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, AreaChart, Area, Cell
} from 'recharts';
import { BarChart3, TrendingUp, Zap, Bus, Wrench, ShieldAlert } from 'lucide-react';

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
        <div className="bg-[#2B1D12] text-stone-100 border border-[#E8DCC8] p-3 rounded-lg text-xs shadow-xl font-sans space-y-1">
          <p className="font-semibold text-stone-100 mb-1">{label}</p>
          {payload.map((entry, idx) => (
            <p key={idx} style={{ color: entry.color }} className="font-medium flex items-center justify-between gap-4">
              <span className="text-stone-300">{entry.name}:</span>
              <span className="font-semibold text-white">{entry.value}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="inst-card p-6 border border-[#E8DCC8] bg-[#F7EFE4] shadow-xs mb-6 font-sans">
      
      {/* Header & Navigation Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-[#E8DCC8]">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-[#BC4800]/15 border border-[#BC4800]/30 rounded-lg text-[#BC4800]">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-[#2B1D12] tracking-tight">Cross-Domain Operations Visualizers</h2>
            <p className="text-xs text-[#6B5A4A] mt-0.5">
              Comparative capacity limits, energy footprint, transit loads, and maintenance distribution
            </p>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 bg-[#FDF8F2] p-1 rounded-xl border border-[#E8DCC8]">
          <button
            onClick={() => setActiveChart('attendance')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeChart === 'attendance' ? 'bg-[#BC4800] text-white shadow-2xs' : 'text-[#6B5A4A] hover:text-[#2B1D12]'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Capacity vs Attendance</span>
          </button>

          <button
            onClick={() => setActiveChart('energy')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeChart === 'energy' ? 'bg-[#BC4800] text-white shadow-2xs' : 'text-[#6B5A4A] hover:text-[#2B1D12]'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Energy vs Occupancy</span>
          </button>

          <button
            onClick={() => setActiveChart('transit')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeChart === 'transit' ? 'bg-[#BC4800] text-white shadow-2xs' : 'text-[#6B5A4A] hover:text-[#2B1D12]'
            }`}
          >
            <Bus className="w-3.5 h-3.5" />
            <span>Shuttle Fleet</span>
          </button>

          <button
            onClick={() => setActiveChart('maintenance')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeChart === 'maintenance' ? 'bg-[#BC4800] text-white shadow-2xs' : 'text-[#6B5A4A] hover:text-[#2B1D12]'
            }`}
          >
            <Wrench className="w-3.5 h-3.5" />
            <span>Work Orders</span>
          </button>
        </div>
      </div>

      {/* Chart 1: Capacity vs Attendance */}
      {activeChart === 'attendance' && (
        <div>
          <div className="flex items-center justify-between mb-3 text-xs">
            <span className="text-[#6B5A4A] font-medium">
              Planned Seat Limit vs Actual Scanned Attendance
            </span>
            <span className="text-[#A6402F] font-semibold flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5" />
              SCI-104 Exceeds Room Limit (+75%)
            </span>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={capacityAttendanceData} margin={{ top: 20, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E8DCC8" />
                <XAxis dataKey="room" stroke="#6B5A4A" fontSize={11} tickLine={false} />
                <YAxis stroke="#6B5A4A" fontSize={11} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="capacity" name="Room Capacity Limit" fill="#6B5A4A" radius={[4, 4, 0, 0]} />
                <Bar dataKey="actual" name="Actual Attendance" radius={[4, 4, 0, 0]}>
                  {capacityAttendanceData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.actual > entry.capacity ? '#A6402F' : '#4E7A51'}
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
            <span className="text-[#6B5A4A] font-medium">
              Time-Series Power Demand (kWh) vs Room Occupancy
            </span>
            <span className="text-[#C48A2E] font-semibold">LIB-102 Overnight Spike: 48.7 kWh</span>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={energyTimelineData} margin={{ top: 20, right: 20, left: -10, bottom: 5 }}>
                <defs>
                  <linearGradient id="colorLib" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#BC4800" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#BC4800" stopOpacity={0.0}/>
                  </linearGradient>
                  <linearGradient id="colorCS" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6B5A4A" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#6B5A4A" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E8DCC8" />
                <XAxis dataKey="time" stroke="#6B5A4A" fontSize={11} />
                <YAxis stroke="#6B5A4A" fontSize={11} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Area type="monotone" dataKey="LIB102_kWh" name="Library LIB-102 (kWh)" stroke="#BC4800" fillOpacity={1} fill="url(#colorLib)" />
                <Area type="monotone" dataKey="CS301_kWh" name="Auditorium CS-301 (kWh)" stroke="#6B5A4A" fillOpacity={1} fill="url(#colorCS)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Chart 3: Transit Load */}
      {activeChart === 'transit' && (
        <div>
          <div className="flex items-center justify-between mb-3 text-xs">
            <span className="text-[#6B5A4A] font-medium">
              Shuttle Fleet Seating Capacity vs Active Passengers
            </span>
            <span className="text-[#A6402F] font-semibold">Shuttle 2: 145% Overcrowding</span>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={transitData} margin={{ top: 20, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E8DCC8" />
                <XAxis dataKey="route" stroke="#6B5A4A" fontSize={11} tickLine={false} />
                <YAxis stroke="#6B5A4A" fontSize={11} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="capacity" name="Vehicle Capacity" fill="#6B5A4A" radius={[4, 4, 0, 0]} />
                <Bar dataKey="passengers" name="Active Passenger Count" radius={[4, 4, 0, 0]}>
                  {transitData.map((entry, index) => (
                    <Cell
                      key={`cell-tr-${index}`}
                      fill={entry.passengers > entry.capacity ? '#A6402F' : '#BC4800'}
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
            <span className="text-[#6B5A4A] font-medium">
              Work Orders Grouped by Department Domain & Severity
            </span>
            <span className="text-[#6B5A4A] font-medium">Critical Ticket: HVAC CS-301</span>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={maintenanceData} margin={{ top: 20, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E8DCC8" />
                <XAxis dataKey="category" stroke="#6B5A4A" fontSize={11} tickLine={false} />
                <YAxis stroke="#6B5A4A" fontSize={11} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="Critical" stackId="a" fill="#A6402F" radius={[4, 4, 0, 0]} />
                <Bar dataKey="High" stackId="a" fill="#BC4800" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Medium" stackId="a" fill="#C48A2E" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Low" stackId="a" fill="#6B5A4A" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

    </div>
  );
}

