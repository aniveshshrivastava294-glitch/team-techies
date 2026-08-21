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

  // Classrooms Telemetry Matrix State
  const [classrooms, setClassrooms] = useState([
    { id: 'CR-301', name: 'Block A - Hall 301', capacity: 120, occupied: 94, temp: '22°C', projector: '4K Active', status: 'In Session', subject: 'CS-402 Distributed Systems' },
    { id: 'CR-302', name: 'Block A - Room 302', capacity: 60, occupied: 45, temp: '21.5°C', projector: 'Laser ON', status: 'In Session', subject: 'EC-301 Signal Processing' },
    { id: 'CR-204', name: 'Block B - Seminar 204', capacity: 200, occupied: 0, temp: '24°C Standby', projector: 'OFF (Eco)', status: 'Vacant', subject: 'Next: 14:00 Workshop' },
    { id: 'CR-105', name: 'Science Block - Lab 105', capacity: 45, occupied: 38, temp: '20°C', projector: 'Smartboard active', status: 'In Session', subject: 'PH-102 Physics Lab' }
  ]);

  // Classroom Hardware & Reservation Tickets
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
    <div className="space-y-6 font-sans animate-in fade-in duration-500 pb-10 relative">
      
      {/* Live Campus Orbit Telemetry Ticker */}
      <LiveCampusTicker />

      {/* Toast Alert Banner */}
      {toastMsg && (
        <div className="fixed top-20 right-6 bg-black/90 border border-indigo-500/40 text-indigo-300 font-mono text-xs px-4 py-2.5 rounded-2xl shadow-2xl z-50 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-indigo-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header Banner - Borderless Galaxy Indigo */}
      <div className="p-6 rounded-3xl bg-slate-950 text-white border border-indigo-500/30 shadow-2xl relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/90 to-indigo-950/40 pointer-events-none rounded-3xl" />
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 text-[10px] font-mono font-extrabold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 rounded-full flex items-center gap-1.5 shadow-sm">
                <Building2 className="w-3.5 h-3.5 text-indigo-400" />
                ACADEMIC CLASSROOM & SMART LAB COMMAND
              </span>
              <span className="text-xs text-indigo-200/80 font-bold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
                38 Classrooms Live Synced
              </span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white drop-shadow-sm flex items-center gap-2">
              Classroom & Smart Space Interface
              <Sparkles className="w-5 h-5 text-indigo-400 animate-pulse" />
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl font-medium leading-relaxed">
              Real-time room occupancy, smartboard/projector power cycling, HVAC room setpoint management & automated schedule locks.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={() => {
                setAutoClimateLock(!autoClimateLock);
                showToast(`Automated Schedule Climate Lock ${!autoClimateLock ? 'Enabled' : 'Disabled'}`);
              }}
              className={`px-3.5 py-2 rounded-xl border text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                autoClimateLock 
                  ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40' 
                  : 'bg-white/5 text-zinc-400 border-white/10'
              }`}
            >
              {autoClimateLock ? <Lock className="w-4 h-4 text-indigo-400" /> : <Unlock className="w-4 h-4 text-zinc-400" />}
              <span>Auto Climate Lock: {autoClimateLock ? 'ON' : 'OFF'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Classrooms Telemetry Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
            <Building2 className="w-4 h-4 text-indigo-400" />
            Classroom & Seminar Hall Sensor Matrix ({classrooms.length} Active Spaces)
          </h2>
          <span className="text-xs font-mono text-indigo-400 font-bold px-2.5 py-1 bg-indigo-500/10 border border-indigo-500/30 rounded-full flex items-center gap-1">
            <Users className="w-3.5 h-3.5 text-indigo-400" />
            177 Students Currently Seated
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 font-mono">
          {classrooms.map((room) => {
            const isSession = room.status === 'In Session';
            return (
              <div 
                key={room.id}
                className={`p-4 rounded-2xl border transition-all duration-300 space-y-2.5 ${
                  isSession 
                    ? 'bg-indigo-500/5 border-indigo-500/30 hover:border-indigo-400' 
                    : 'bg-white/[0.02] border-white/5 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-zinc-400 font-bold bg-white/5 px-2 py-0.5 rounded-full border border-white/10">
                    {room.id}
                  </span>
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border uppercase ${
                    isSession ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' : 'bg-white/5 text-zinc-400 border-white/10'
                  }`}>
                    {room.status}
                  </span>
                </div>

                <div>
                  <h3 className="text-xs font-bold text-white font-sans">{room.name}</h3>
                  <p className="text-[10px] text-indigo-300 font-medium truncate mt-0.5">{room.subject}</p>
                </div>

                <div className="space-y-1 text-[10px] text-zinc-400 pt-1 border-t border-white/5">
                  <div className="flex justify-between">
                    <span>Occupancy:</span>
                    <span className="text-white font-bold">{room.occupied} / {room.capacity}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Climate Setpoint:</span>
                    <span className="text-cyan-300 font-bold flex items-center gap-1">
                      <Thermometer className="w-3 h-3 text-cyan-400" />
                      {room.temp}
                    </span>
                  </div>

                  <div className="flex justify-between items-center pt-1">
                    <span className="flex items-center gap-1">
                      <Tv className="w-3 h-3 text-indigo-400" />
                      Projector:
                    </span>
                    <button
                      type="button"
                      onClick={() => toggleProjector(room.id)}
                      className="px-2 py-0.5 bg-white/5 hover:bg-white/10 text-indigo-300 border border-white/10 rounded-md text-[9px] font-bold cursor-pointer transition-all"
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
        <div className="w-full rounded-3xl border border-white/5 bg-white/[0.02] backdrop-blur-2xl transition-all duration-300 overflow-hidden shadow-2xl flex flex-col justify-between">
          <div>
            {/* Header Bar */}
            <div className="p-4 sm:p-5 flex flex-col gap-3 border-b border-white/5 bg-gradient-to-r from-indigo-500/5 via-transparent to-transparent">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl border border-indigo-500/30 bg-indigo-500/10 text-indigo-400 shrink-0">
                    <Tv className="w-4 h-4 stroke-[1.5]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white tracking-tight">
                      Classroom Hardware & AV Tech Requests
                    </h3>
                    <p className="text-[11px] text-zinc-400 font-medium font-mono line-clamp-1">
                      Manage smartboard fixes, HDMI audio hiss & climate setpoint resets
                    </p>
                  </div>
                </div>

                <span className="text-[10px] font-mono font-bold px-2.5 py-1 bg-indigo-500/20 text-indigo-300 rounded-full border border-indigo-500/40 shrink-0 uppercase">
                  {classScheduleDispatches.filter(d => d.status !== 'Resolved').length} ACTION REQUIRED
                </span>
              </div>
            </div>

            {/* Dispatches List */}
            <div className="p-4 sm:p-5 space-y-3 font-mono">
              {classScheduleDispatches.map((disp) => (
                <div 
                  key={disp.id}
                  className="p-4 rounded-2xl bg-black/40 border border-white/5 hover:border-white/15 transition-all space-y-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-bold px-2 py-0.5 bg-white/5 text-indigo-300 rounded-full border border-white/10">
                        {disp.id}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 bg-white/5 text-cyan-300 rounded-full border border-white/10">
                        {disp.room}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase ${
                        disp.status === 'Resolved' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' :
                        'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      }`}>
                        {disp.status}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-white font-sans">{disp.title}</h4>
                    <p className="text-[10px] text-zinc-500">
                      Room: <span className="text-zinc-300">{disp.room}</span> • Date: {disp.date}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 font-sans">
                    {disp.status !== 'Resolved' ? (
                      <button
                        type="button"
                        onClick={() => handleClassDispatch(disp.id, 'Resolved')}
                        className="px-3 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Resolve</span>
                      </button>
                    ) : (
                      <span className="px-3 py-1 bg-white/5 text-zinc-400 border border-white/10 rounded-full text-[11px] font-mono font-bold">
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
