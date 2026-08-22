import React, { useState } from 'react';
import TicketsSupportLogCard from '../TicketsSupportLogCard';
import LiveCampusTicker from '../LiveCampusTicker';
import { 
  Building2, Tv, Wind, CheckCircle2, AlertTriangle, RefreshCw, 
  Activity, Gauge, Sparkles, Check, X, Sliders, Cpu, Users, Lock, Unlock, Thermometer
} from 'lucide-react';

export default function ClassroomManagerInterface() {
  const [toastMsg, setToastMsg] = useState(null);
  const [autoClimateLock, setAutoClimateLock] = useState(true);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const [classrooms, setClassrooms] = useState([
    { id: 'CR-301', name: 'Block A - Hall 301', capacity: 120, occupied: 94, temp: '22°C', projector: '4K Active', status: 'In Session', subject: 'CS-402 Distributed Systems' },
    { id: 'CR-302', name: 'Block A - Room 302', capacity: 60, occupied: 45, temp: '21.5°C', projector: 'Laser ON', status: 'In Session', subject: 'EC-301 Signal Processing' },
    { id: 'CR-204', name: 'Block B - Seminar 204', capacity: 200, occupied: 0, temp: '24°C Standby', projector: 'OFF (Eco)', status: 'Vacant', subject: 'Next: 14:00 Workshop' },
    { id: 'CR-105', name: 'Science Block - Lab 105', capacity: 45, occupied: 38, temp: '20°C', projector: 'Smartboard active', status: 'In Session', subject: 'PH-102 Physics Lab' }
  ]);

  const [classScheduleDispatches, setClassScheduleDispatches] = useState([
    {
      id: 'CLR-802',
      title: 'Block A Room 302 Smartboard Calibration & HDMI Input Audio Hiss',
      room: 'CR-302',
      priority: 'High',
      status: 'Pending Tech',
      date: 'Aug 21, 2026'
    },
    {
      id: 'CLR-798',
      title: 'Seminar Hall 204 Automated Blinds & Lighting Mesh Sensor Reset',
      room: 'CR-204',
      priority: 'Medium',
      status: 'In Progress',
      date: 'Aug 21, 2026'
    },
    {
      id: 'CLR-740',
      title: 'Science Lab 105 Climate Control Sensor Setpoint Adjust to 20°C',
      room: 'CR-105',
      priority: 'Low',
      status: 'Resolved',
      date: 'Aug 20, 2026'
    }
  ]);

  const handleClassDispatch = (id, newStatus) => {
    setClassScheduleDispatches(prev => prev.map(d => d.id === id ? { ...d, status: newStatus } : d));
    showToast(`Classroom Request ${id} updated to ${newStatus}`);
  };

  const toggleProjector = (roomId) => {
    setClassrooms(prev => prev.map(c => {
      if (c.id === roomId) {
        const isOff = c.projector.includes('OFF');
        const nextState = isOff ? '4K Active' : 'OFF (Eco)';
        showToast(`${c.name} Projector power set to ${nextState}`);
        return { ...c, projector: nextState };
      }
      return c;
    }));
  };

  return (
    <div className="space-y-6 font-sans pb-10 relative">
      
      <LiveCampusTicker />

      {toastMsg && (
        <div className="fixed top-20 right-6 bg-[#1D4ED8] border border-[#1E40AF] text-white font-mono text-xs px-4 py-2.5 rounded-md shadow-md z-50 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-white" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header Banner - Executive Obsidian with Blue Accents */}
      <div className="p-6 rounded-lg bg-[#1C1917] text-[#FAF8F3] border border-[#1D4ED8] shadow-md relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="badge-blue text-[10px]">
                <Building2 className="w-3.5 h-3.5 text-[#1D4ED8]" />
                ACADEMIC CLASSROOM & SMART LAB COMMAND
              </span>
              <span className="text-xs text-[#93C5FD] font-bold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#3B82F6] animate-ping inline-block" />
                38 Classrooms Live Synced
              </span>
            </div>
            
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              Classroom & Smart Space Interface
              <Sparkles className="w-5 h-5 text-[#3B82F6]" />
            </h1>
            <p className="text-xs text-[#D6CEBE] max-w-2xl font-medium leading-relaxed">
              Real-time room occupancy, smartboard/projector power cycling, HVAC room setpoint management & automated schedule locks.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => {
                setAutoClimateLock(!autoClimateLock);
                showToast(`Auto Climate Lock set to ${!autoClimateLock ? 'ENABLED' : 'DISABLED'}`);
              }}
              className={`btn-secondary text-xs ${autoClimateLock ? 'border-[#1D4ED8] text-[#1D4ED8] bg-[#EFF6FF] font-bold' : ''}`}
            >
              {autoClimateLock ? <Lock className="w-3.5 h-3.5 text-[#1D4ED8]" /> : <Unlock className="w-3.5 h-3.5 text-[#78716C]" />}
              <span>Auto Climate Lock: {autoClimateLock ? 'ON' : 'OFF'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Classroom Sensor Matrix */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-[#1C1917] tracking-tight flex items-center gap-2">
            <Building2 className="w-4 h-4 text-[#1D4ED8]" />
            Classroom & Seminar Hall Sensor Matrix ({classrooms.length} Active Spaces)
          </h2>
          <span className="badge-blue text-xs">
            {classrooms.reduce((acc, c) => acc + c.occupied, 0)} Students Currently Seated
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {classrooms.map((room) => {
            const isVacant = room.status === 'Vacant';
            return (
              <div 
                key={room.id} 
                className={`card-surface p-4 shadow-2xs space-y-3 border-l-4 ${isVacant ? 'border-l-[#78716C]' : 'border-l-[#1D4ED8]'}`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-[#1D4ED8] bg-[#EFF6FF] px-2 py-0.5 rounded border border-[#BFDBFE]">
                    {room.id}
                  </span>
                  <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded border uppercase ${
                    isVacant ? 'badge-mono' : 'badge-blue'
                  }`}>
                    {room.status}
                  </span>
                </div>

                <div>
                  <h3 className="text-xs font-bold text-[#1C1917]">{room.name}</h3>
                  <p className="text-[11px] text-[#57534E] font-mono font-semibold truncate">{room.subject}</p>
                </div>

                <div className="space-y-1.5 text-[11px] font-mono pt-1">
                  <div className="flex items-center justify-between text-[#57534E]">
                    <span>Occupancy:</span>
                    <span className="text-[#1C1917] font-bold">{room.occupied} / {room.capacity}</span>
                  </div>

                  <div className="flex items-center justify-between text-[#57534E]">
                    <span className="flex items-center gap-1">
                      <Thermometer className="w-3 h-3 text-[#1D4ED8]" />
                      Climate Setpoint:
                    </span>
                    <span className="text-[#1C1917] font-bold">{room.temp}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#E6E0D2] flex items-center justify-between">
                  <span className="text-[10px] text-[#57534E] font-mono font-semibold flex items-center gap-1">
                    <Tv className="w-3 h-3 text-[#1D4ED8]" />
                    Projector:
                  </span>
                  <button
                    onClick={() => toggleProjector(room.id)}
                    className="btn-secondary text-[10px] py-0.5 px-2"
                  >
                    {room.projector}
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      </div>

      {/* Grid: AV Requests & Support Tickets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        
        {/* Left Column: AV Tech Requests */}
        <div className="card-surface p-5 shadow-2xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#E6E0D2] mb-3">
              <div className="flex items-center space-x-2">
                <Tv className="w-4 h-4 text-[#1D4ED8]" />
                <h3 className="text-sm font-bold text-[#1C1917]">
                  Classroom Hardware & AV Tech Requests
                </h3>
              </div>
              <span className="badge-blue text-[10px]">
                {classScheduleDispatches.length} Action Required
              </span>
            </div>

            <div className="divide-y divide-[#E6E0D2]">
              {classScheduleDispatches.map((disp) => (
                <div key={disp.id} className="py-3 space-y-1.5">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-xs font-bold text-[#1D4ED8]">{disp.id}</span>
                        <span className="badge-blue text-[9px]">{disp.room}</span>
                      </div>
                      <h4 className="text-xs font-bold text-[#1C1917] mt-0.5">{disp.title}</h4>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      {disp.status === 'Pending Tech' ? (
                        <button
                          onClick={() => handleClassDispatch(disp.id, 'Resolved')}
                          className="btn-primary-blue text-[10px] py-1 px-2"
                        >
                          <Check className="w-3 h-3" />
                          <span>Resolve</span>
                        </button>
                      ) : (
                        <span className="badge-blue text-[10px]">
                          {disp.status}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#EFF6FF] p-3 rounded border border-[#BFDBFE] text-xs font-mono text-[#1E40AF] space-y-1">
            <span className="font-bold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-[#1D4ED8]" />
              Smart Class Automated Rules:
            </span>
            <p className="text-[#1E40AF] font-semibold">
              Projectors automatically power down 15 minutes after class conclusion when room occupancy sensors drop to 0.
            </p>
          </div>
        </div>

        {/* Right Column: Support Tickets Logger */}
        <div>
          <TicketsSupportLogCard currentUser={{ role: 'classroom_manager', full_name: 'Sub-Admin Academic' }} />
        </div>

      </div>

    </div>
  );
}
