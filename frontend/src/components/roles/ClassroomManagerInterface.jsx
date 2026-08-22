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
        <div className="fixed top-20 right-6 bg-[#1C1917] border border-[#292524] text-[#FAF8F3] font-mono text-xs px-4 py-2.5 rounded-md shadow-md z-50 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-white" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header Banner - Executive Obsidian */}
      <div className="p-6 rounded-lg bg-[#1C1917] text-[#FAF8F3] border border-[#292524] shadow-md relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="badge-mono-dark text-[10px]">
                <Building2 className="w-3.5 h-3.5 text-white" />
                ACADEMIC CLASSROOM & SMART LAB COMMAND
              </span>
              <span className="text-xs text-[#D6CEBE] font-bold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-white animate-ping inline-block" />
                38 Classrooms Live Synced
              </span>
            </div>
            
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              Classroom & Smart Space Interface
              <Sparkles className="w-5 h-5 text-white" />
            </h1>
            <p className="text-xs text-[#D6CEBE] max-w-2xl font-medium leading-relaxed">
              Real-time room occupancy, smartboard/projector power cycling, HVAC room setpoint management & automated schedule locks.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={() => {
                setAutoClimateLock(!autoClimateLock);
                showToast(`Automated Schedule Climate Lock ${!autoClimateLock ? 'Enabled' : 'Disabled'}`);
              }}
              className={`btn-secondary text-xs ${autoClimateLock ? 'bg-[#1C1917] text-white' : ''}`}
            >
              {autoClimateLock ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
              <span>Auto Climate Lock: {autoClimateLock ? 'ON' : 'OFF'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Classrooms Telemetry Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-[#1C1917] tracking-tight flex items-center gap-2">
            <Building2 className="w-4 h-4 text-[#1C1917]" />
            Classroom & Seminar Hall Sensor Matrix ({classrooms.length} Active Spaces)
          </h2>
          <span className="badge-mono-dark text-xs flex items-center gap-1">
            <Users className="w-3.5 h-3.5" />
            177 Students Currently Seated
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 font-mono">
          {classrooms.map((room) => {
            const isSession = room.status === 'In Session';
            return (
              <div 
                key={room.id}
                className="card-surface p-4 shadow-2xs space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <span className="badge-mono text-[10px] font-bold">
                    {room.id}
                  </span>
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded border uppercase ${
                    isSession ? 'badge-mono-dark' : 'badge-mono'
                  }`}>
                    {room.status}
                  </span>
                </div>

                <div>
                  <h3 className="text-xs font-bold text-[#1C1917] font-sans">{room.name}</h3>
                  <p className="text-[10px] text-[#57534E] font-medium truncate mt-0.5">{room.subject}</p>
                </div>

                <div className="space-y-1 text-[10px] text-[#57534E] pt-1 border-t border-[#E6E0D2]">
                  <div className="flex justify-between">
                    <span>Occupancy:</span>
                    <span className="text-[#1C1917] font-bold">{room.occupied} / {room.capacity}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Climate Setpoint:</span>
                    <span className="text-[#1C1917] font-bold flex items-center gap-1">
                      <Thermometer className="w-3 h-3 text-[#1C1917]" />
                      {room.temp}
                    </span>
                  </div>

                  <div className="flex justify-between items-center pt-1">
                    <span className="flex items-center gap-1">
                      <Tv className="w-3 h-3 text-[#1C1917]" />
                      Projector:
                    </span>
                    <button
                      type="button"
                      onClick={() => toggleProjector(room.id)}
                      className="btn-secondary text-[9px] py-0.5 px-2"
                    >
                      {room.projector}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Side-by-Side Grid: Classroom Dispatches & Support Tickets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch font-sans">
        
        {/* Left Box: Classroom Maintenance & Hardware Dispatches */}
        <div className="card-surface p-5 shadow-2xs flex flex-col justify-between space-y-4">
          <div>
            <div className="pb-3 border-b border-[#E6E0D2] flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-md bg-[#F0EBE1] border border-[#E6E0D2] text-[#1C1917]">
                  <Tv className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#1C1917] tracking-tight">
                    Classroom Hardware & AV Tech Requests
                  </h3>
                  <p className="text-[11px] text-[#57534E] font-medium font-mono">
                    Manage smartboard fixes, HDMI audio hiss & climate setpoint resets
                  </p>
                </div>
              </div>

              <span className="badge-mono-dark text-[10px]">
                {classScheduleDispatches.filter(d => d.status !== 'Resolved').length} ACTION REQUIRED
              </span>
            </div>

            <div className="space-y-3 pt-3 font-mono">
              {classScheduleDispatches.map((disp) => (
                <div 
                  key={disp.id}
                  className="p-3.5 rounded-lg bg-[#FAF8F3] border border-[#E6E0D2] hover:border-[#1C1917] transition-all space-y-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="badge-mono text-[10px]">
                        {disp.id}
                      </span>
                      <span className="badge-mono text-[10px]">
                        {disp.room}
                      </span>
                      <span className={`text-[10px] ${
                        disp.status === 'Resolved' ? 'badge-mono-dark' : 'badge-mono'
                      }`}>
                        {disp.status}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-[#1C1917] font-sans">{disp.title}</h4>
                    <p className="text-[10px] text-[#57534E]">
                      Room: <span className="text-[#1C1917] font-bold">{disp.room}</span> • Date: {disp.date}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 font-sans">
                    {disp.status !== 'Resolved' ? (
                      <button
                        type="button"
                        onClick={() => handleClassDispatch(disp.id, 'Resolved')}
                        className="btn-primary text-xs py-1 px-3"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Resolve</span>
                      </button>
                    ) : (
                      <span className="badge-mono text-[10px]">
                        Resolved
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Box: Classroom Support Tickets */}
        <TicketsSupportLogCard 
          adminDomain="classroom" 
          title="Classroom & Lab Support Tickets" 
          subtitle="Track smartboard repairs, seating maintenance & AV hardware dispatches" 
        />

      </div>
    </div>
  );
}
