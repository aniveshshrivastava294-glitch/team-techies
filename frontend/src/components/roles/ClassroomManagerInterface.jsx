import React, { useState } from 'react';
import SectionHero from '../SectionHero';
import { BACKDROP_IMAGES } from '../../config/backdropImages';
import TicketsSupportLogCard from '../TicketsSupportLogCard';
import LiveCampusTicker from '../LiveCampusTicker';
import { 
  Building2, Tv, CheckCircle2, Check, Users, Lock, Unlock, Thermometer
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
    <div className="space-y-6 font-sans animate-in fade-in duration-300 pb-10 relative">
      
      {/* Toast Alert Banner */}
      {toastMsg && (
        <div className="fixed top-20 right-6 bg-[#1F2A38] text-white font-medium text-xs px-4 py-2.5 rounded-xl shadow-2xl z-50 flex items-center gap-2 border border-[#E2DED4]">
          <CheckCircle2 className="w-4 h-4 text-[#4E7A51]" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* ================= SECTION HERO: CLASSROOM & LAB BACKDROP ================= */}
      <SectionHero
        image={BACKDROP_IMAGES.classrooms}
        category="Academic Spaces & Labs"
        categoryIcon={Building2}
        badgeText="38 Spaces Synchronized"
        title="Classrooms & Smart Learning Spaces"
        subtitle="Real-time room occupancy, smartboard/projector power cycling, HVAC room setpoint management & automated schedule locks."
      >
        <button
          onClick={() => {
            setAutoClimateLock(!autoClimateLock);
            showToast(`Automated Schedule Climate Lock ${!autoClimateLock ? 'Enabled' : 'Disabled'}`);
          }}
          className="px-4 py-2 rounded-lg border border-white/20 bg-white/10 hover:bg-white/20 text-white text-xs font-medium backdrop-blur-xs transition-colors cursor-pointer flex items-center gap-1.5"
        >
          {autoClimateLock ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
          <span>Auto Climate Lock: {autoClimateLock ? 'ON' : 'OFF'}</span>
        </button>
      </SectionHero>

      {/* Live Campus Orbit Telemetry Ticker */}
      <LiveCampusTicker />

      {/* Classrooms Telemetry Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-[#1F2A38] tracking-tight flex items-center gap-2">
            <Building2 className="w-4 h-4 text-[#3E5C76]" />
            Classroom & Seminar Hall Sensor Matrix ({classrooms.length} Active Spaces)
          </h2>
          <span className="text-xs text-[#1F2A38] font-semibold px-2.5 py-1 bg-[#F5F4F0] border border-[#E2DED4] rounded-full flex items-center gap-1">
            <Users className="w-3.5 h-3.5 text-[#4E7A51]" />
            177 Students Currently Seated
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {classrooms.map((room) => {
            const isSession = room.status === 'In Session';
            return (
              <div 
                key={room.id}
                className="p-4 rounded-xl border border-[#E2DED4] bg-[#DCD7CC] shadow-xs space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#8A8578] font-semibold bg-[#F5F4F0] px-2 py-0.5 rounded border border-[#E2DED4]">
                    {room.id}
                  </span>
                  <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${
                    isSession ? 'bg-[#4E7A51]/15 text-[#4E7A51] border-[#4E7A51]/30' : 'bg-[#E2DED4]/40 text-[#8A8578] border-[#E2DED4]'
                  }`}>
                    {room.status}
                  </span>
                </div>

                <div>
                  <h3 className="text-xs font-bold text-[#1F2A38]">{room.name}</h3>
                  <p className="text-xs text-[#3E5C76] font-medium truncate mt-0.5">{room.subject}</p>
                </div>

                <div className="space-y-1 text-xs text-[#8A8578] pt-2 border-t border-[#E2DED4]">
                  <div className="flex justify-between">
                    <span>Occupancy:</span>
                    <span className="text-[#1F2A38] font-semibold">{room.occupied} / {room.capacity}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Climate Setpoint:</span>
                    <span className="text-[#1F2A38] font-semibold flex items-center gap-1">
                      <Thermometer className="w-3 h-3 text-[#3E5C76]" />
                      {room.temp}
                    </span>
                  </div>

                  <div className="flex justify-between items-center pt-1">
                    <span className="flex items-center gap-1 text-[#8A8578]">
                      <Tv className="w-3 h-3 text-[#8A8578]" />
                      Projector:
                    </span>
                    <button
                      type="button"
                      onClick={() => toggleProjector(room.id)}
                      className="px-2.5 py-0.5 bg-[#F5F4F0] hover:bg-[#DCD7CC] text-[#1F2A38] border border-[#E2DED4] rounded-full text-xs font-medium cursor-pointer transition-colors"
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
        <div className="w-full rounded-2xl border border-[#E2DED4] bg-[#DCD7CC] shadow-xs overflow-hidden flex flex-col justify-between">
          <div>
            {/* Header Bar */}
            <div className="p-4 sm:p-5 flex flex-col gap-3 border-b border-[#E2DED4]">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg border border-[#3E5C76]/30 bg-[#3E5C76]/15 text-[#3E5C76] shrink-0">
                    <Tv className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#1F2A38] tracking-tight">
                      Classroom Hardware & AV Tech Requests
                    </h3>
                    <p className="text-xs text-[#8A8578] font-medium line-clamp-1">
                      Manage smartboard fixes, HDMI audio hiss & climate setpoint resets
                    </p>
                  </div>
                </div>

                <span className="text-xs font-semibold px-2.5 py-0.5 inst-badge-ochre shrink-0">
                  {classScheduleDispatches.filter(d => d.status !== 'Resolved').length} Action Required
                </span>
              </div>
            </div>

            {/* Dispatches List */}
            <div className="p-4 sm:p-5 space-y-3">
              {classScheduleDispatches.map((disp) => (
                <div 
                  key={disp.id}
                  className="p-3.5 rounded-xl bg-[#F5F4F0] border border-[#E2DED4] space-y-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap text-xs">
                      <span className="font-semibold px-2 py-0.5 bg-[#DCD7CC] text-[#1F2A38] border border-[#E2DED4] rounded">
                        {disp.id}
                      </span>
                      <span className="font-semibold px-2 py-0.5 bg-[#DCD7CC] text-[#3E5C76] border border-[#E2DED4] rounded">
                        {disp.room}
                      </span>
                      <span className={`font-semibold px-2.5 py-0.5 rounded-full border ${
                        disp.status === 'Resolved' ? 'bg-[#4E7A51]/15 text-[#4E7A51] border-[#4E7A51]/30' :
                        'bg-[#C48A2E]/15 text-[#C48A2E] border-[#C48A2E]/30'
                      }`}>
                        {disp.status}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-[#1F2A38]">{disp.title}</h4>
                    <p className="text-xs text-[#8A8578]">
                      Room: <span className="text-[#1F2A38] font-semibold">{disp.room}</span> • Date: {disp.date}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {disp.status !== 'Resolved' ? (
                      <button
                        type="button"
                        onClick={() => handleClassDispatch(disp.id, 'Resolved')}
                        className="px-3.5 py-1.5 bg-[#4E7A51] hover:bg-[#3D6140] text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Resolve</span>
                      </button>
                    ) : (
                      <span className="px-2.5 py-1 bg-[#DCD7CC] text-[#8A8578] border border-[#E2DED4] rounded-full text-xs font-semibold">
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

