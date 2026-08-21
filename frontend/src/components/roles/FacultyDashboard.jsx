import React, { useState, useEffect } from 'react';
import {
  Building2,
  Bus,
  Ticket,
  UserCheck,
  Calendar as CalendarIcon,
  Clock,
  Plus,
  Phone,
  CheckCircle2,
  AlertTriangle,
  Send,
  MapPin,
  Users,
  Sparkles,
  ArrowRight,
  ChevronDown,
  ChevronRight,
  ShieldAlert,
  Info,
  X,
  Check,
  Wifi,
  Tv,
  Wind,
  Zap,
  Radio,
  CalendarDays
} from 'lucide-react';
import ChatWidget from '../ChatWidget';

export default function FacultyDashboard({ currentUser }) {
  // Editable Profile
  const [professorName, setProfessorName] = useState(currentUser?.full_name || 'Dr. Eleanor Vance');
  const [department, setDepartment] = useState('Department of Computer Science & Engineering');

  // Metrics State
  const [attendancePercent, setAttendancePercent] = useState(96);
  const [leavesTaken, setLeavesTaken] = useState(3);
  const [activeTicketsCount, setActiveTicketsCount] = useState(2);

  // Active Expanded Section State: 'classroom' | 'venue' | 'bus' | null
  const [expandedSection, setExpandedSection] = useState('classroom');

  // Classroom Reservation State & Details
  const [classEventName, setClassEventName] = useState('');
  const [classDate, setClassDate] = useState('2026-08-21');
  const [classTimeSlot, setClassTimeSlot] = useState('10:00 AM - 11:30 AM');
  const [classVenue, setClassVenue] = useState('Auditorium CS-301');
  const [classCapacity, setClassCapacity] = useState(80);
  const [needProjector, setNeedProjector] = useState(true);
  const [needAc, setNeedAc] = useState(true);
  const [classToast, setClassToast] = useState(null);

  // Venue Booking State & Details
  const [venueName, setVenueName] = useState('Main Campus Auditorium');
  const [venueEventDate, setVenueEventDate] = useState('2026-08-25');
  const [startTime, setStartTime] = useState('02:00 PM');
  const [endTime, setEndTime] = useState('05:00 PM');
  const [expectedAttendees, setExpectedAttendees] = useState(150);
  const [venuePurpose, setVenuePurpose] = useState('');
  const [venueToast, setVenueToast] = useState(null);

  // Bus Fleet Interactive Selection & Telemetry Details
  const busFleet = [
    { id: 'bus-1', label: 'Transit Alpha', busNo: 'BUS-101', loc: 'North Gate - Stop 2', capacity: 60, seatsLeft: 14, speed: '42 km/h', driver: 'Alex Rivera', status: 'On Schedule' },
    { id: 'bus-2', label: 'Shuttle Beta', busNo: 'BUS-102', loc: 'Science Complex Quad', capacity: 60, seatsLeft: 5, speed: '38 km/h', driver: 'Sarah Jenkins', status: 'Peak Load' },
    { id: 'bus-3', label: 'Terminal Shuttle', busNo: 'BUS-103', loc: 'Library Main Terminal', capacity: 55, seatsLeft: 28, speed: '0 km/h (Boarding)', driver: 'Robert Chen', status: 'On Schedule' },
    { id: 'bin', label: 'Utility Fleet', busNo: 'UTIL-401', loc: 'Facility Yard 4', capacity: 20, seatsLeft: 0, speed: 'Depot Maintenance', driver: 'Campus Operations', status: 'Maintenance' },
    { id: 'van', label: 'Express Van', busNo: 'VAN-201', loc: 'South Campus Quad', capacity: 14, seatsLeft: 6, speed: '48 km/h', driver: 'Executive Express', status: 'On Schedule' },
    { id: 'bus-5', label: 'Engineering Shuttle', busNo: 'BUS-105', loc: 'Engineering Wing', capacity: 60, seatsLeft: 18, speed: '25 km/h', driver: 'David Vance', status: 'Delayed 5m' },
  ];

  const [selectedBus, setSelectedBus] = useState(busFleet[0]);

  // Issue Modal State
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
  const [issueTitle, setIssueTitle] = useState('');
  const [issueDomain, setIssueDomain] = useState('maintenance');
  const [issueVenue, setIssueVenue] = useState('Science 204');
  const [issueDescription, setIssueDescription] = useState('');
  const [issueToast, setIssueToast] = useState(null);

  // Attendance Calendar Statuses for August 2026 (1 to 31)
  const attendanceDays = [
    { day: 1, type: 'present' }, { day: 2, type: 'weekend' }, { day: 3, type: 'present' },
    { day: 4, type: 'present' }, { day: 5, type: 'present' }, { day: 6, type: 'leave' },
    { day: 7, type: 'present' }, { day: 8, type: 'present' }, { day: 9, type: 'weekend' },
    { day: 10, type: 'present' }, { day: 11, type: 'present' }, { day: 12, type: 'present' },
    { day: 13, type: 'present' }, { day: 14, type: 'leave' }, { day: 15, type: 'holiday' },
    { day: 16, type: 'weekend' }, { day: 17, type: 'present' }, { day: 18, type: 'present' },
    { day: 19, type: 'present' }, { day: 20, type: 'present' }, { day: 21, type: 'today' },
    { day: 22, type: 'future' }, { day: 23, type: 'weekend' }, { day: 24, type: 'future' },
    { day: 25, type: 'future' }, { day: 26, type: 'future' }, { day: 27, type: 'future' },
    { day: 28, type: 'future' }, { day: 29, type: 'future' }, { day: 30, type: 'weekend' },
    { day: 31, type: 'future' }
  ];

  // Dynamic ordering: clicked section comes to the top, rest shift down!
  const defaultOrder = ['classroom', 'venue', 'bus'];
  const orderedSections = expandedSection
    ? [expandedSection, ...defaultOrder.filter((id) => id !== expandedSection)]
    : defaultOrder;

  // Entrance animation
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const handleClassSubmit = (e) => {
    e.preventDefault();
    if (!classEventName) return;
    setClassToast(`Classroom Reserved: "${classEventName}" in ${classVenue}!`);
    setClassEventName('');
    setTimeout(() => setClassToast(null), 4000);
  };

  const handleVenueSubmit = (e) => {
    e.preventDefault();
    if (!venuePurpose) return;
    setVenueToast(`Venue Booking Request Submitted for "${venueName}"!`);
    setVenuePurpose('');
    setTimeout(() => setVenueToast(null), 4000);
  };

  const handleIssueSubmit = (e) => {
    e.preventDefault();
    if (!issueTitle || !issueDescription) return;
    setActiveTicketsCount(prev => prev + 1);
    setIssueToast(`Ticket Raised: "${issueTitle}" dispatched.`);
    setIssueTitle('');
    setIssueDescription('');
    setIsIssueModalOpen(false);
    setTimeout(() => setIssueToast(null), 4000);
  };

  // Section Renderers (Human-Curated Professional Color Palette)
  const renderClassroomCard = () => (
    <div
      key="classroom"
      className={`w-full glass-panel rounded-3xl border transition-all duration-500 ease-out transform relative overflow-hidden ${
        expandedSection === 'classroom'
          ? 'border-blue-500/50 dark:bg-slate-900/95 bg-white ring-1 ring-blue-500/20 p-6.5 shadow-xl scale-[1.002]'
          : 'dark:border-slate-800/80 border-slate-200 hover:border-blue-500/40 dark:bg-slate-900/60 bg-white/90 py-7.5 px-6.5 min-h-[155px] flex flex-col justify-center hover:bg-slate-50 dark:hover:bg-slate-900/80 cursor-pointer shadow-sm'
      }`}
    >
      {/* Empty Classroom Watermark Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-25 mix-blend-overlay pointer-events-none rounded-3xl transition-opacity duration-500"
        style={{ backgroundImage: `url('https://images.unsplash.com/photo-1580582932707-520aed937b7b?q=80&w=1200&auto=format&fit=crop')` }}
      />
      <div
        onClick={() => setExpandedSection(expandedSection === 'classroom' ? null : 'classroom')}
        className="w-full flex items-center justify-between cursor-pointer group relative z-10"
      >
        <div className="flex items-center gap-4">
          <div className={`p-3.5 rounded-2xl transition-all duration-300 ${
            expandedSection === 'classroom'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 scale-105'
              : 'dark:bg-slate-800/90 bg-slate-100 dark:text-blue-400 text-blue-600 border dark:border-slate-700/60 border-slate-200 group-hover:bg-blue-600 group-hover:text-white'
          }`}>
            <Building2 className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-base md:text-lg font-bold dark:text-white text-slate-900 tracking-tight group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors">
                Classroom Reservation
              </h2>
              <span className={`text-[10px] md:text-[11px] font-bold px-3 py-0.5 rounded-full border transition-all uppercase tracking-wider ${
                expandedSection === 'classroom'
                  ? 'bg-blue-500/15 text-blue-600 dark:text-blue-300 border-blue-500/30'
                  : 'dark:bg-slate-800/80 bg-slate-100 dark:text-slate-400 text-slate-600 border-slate-200 dark:border-slate-700/60'
              }`}>
                {expandedSection === 'classroom' ? 'Active Reservation' : 'Expand Form'}
              </span>
            </div>
            <p className="text-xs md:text-sm dark:text-slate-400 text-slate-600 mt-1 leading-relaxed">
              Reserve lecture halls, smart labs & auditoriums with real-time timetable conflict detection.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className={`p-2.5 rounded-2xl transition-all transform duration-500 ease-in-out ${
            expandedSection === 'classroom'
              ? 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30 rotate-180 scale-110 shadow-sm'
              : 'dark:bg-slate-800/80 bg-slate-100 dark:text-slate-400 text-slate-600 border border-slate-200 dark:border-slate-700/60 group-hover:text-slate-900 dark:group-hover:text-slate-200'
          }`}>
            <ChevronDown className="w-5 h-5 stroke-[2.8]" />
          </div>
        </div>
      </div>

      {expandedSection === 'classroom' && (
        <div className="w-full mt-6 pt-5 animate-in fade-in-0 zoom-in-95 slide-in-from-top-4 duration-500 fill-mode-forwards relative z-10">
          <div className="w-1/2 h-px bg-gradient-to-r from-blue-500/40 via-slate-300 dark:via-slate-700/60 to-transparent mb-6" />

          <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-5">
            <form onSubmit={handleClassSubmit} className="md:col-span-7 space-y-3.5 text-xs md:text-sm animate-in slide-in-from-left-4 duration-500">
              <div>
                <label className="block dark:text-slate-300 text-slate-700 font-bold mb-1.5">Course / Lecture Title</label>
                <input
                  type="text"
                  value={classEventName}
                  onChange={(e) => setClassEventName(e.target.value)}
                  placeholder="e.g. CS-402 Distributed Systems & Cloud Computing"
                  className="w-full dark:bg-slate-950 bg-slate-50 border dark:border-slate-800 border-slate-300 rounded-xl px-3.5 py-2.5 dark:text-white text-slate-900 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors font-medium text-xs md:text-sm shadow-inner"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block dark:text-slate-300 text-slate-700 font-bold mb-1.5">Reservation Date</label>
                  <input
                    type="date"
                    value={classDate}
                    onChange={(e) => setClassDate(e.target.value)}
                    className="w-full dark:bg-slate-950 bg-slate-50 border dark:border-slate-800 border-slate-300 rounded-xl px-3 py-2.5 dark:text-white text-slate-900 focus:outline-none focus:border-blue-500 transition-colors text-xs md:text-sm font-medium shadow-inner"
                  />
                </div>

                <div>
                  <label className="block dark:text-slate-300 text-slate-700 font-bold mb-1.5">Time Slot</label>
                  <select
                    value={classTimeSlot}
                    onChange={(e) => setClassTimeSlot(e.target.value)}
                    className="w-full dark:bg-slate-950 bg-slate-50 border dark:border-slate-800 border-slate-300 rounded-xl px-2.5 py-2.5 dark:text-white text-slate-900 focus:outline-none focus:border-blue-500 transition-colors text-xs md:text-sm font-medium shadow-inner"
                  >
                    <option value="08:00 AM - 09:30 AM">08:00 AM - 09:30 AM</option>
                    <option value="10:00 AM - 11:30 AM">10:00 AM - 11:30 AM</option>
                    <option value="01:00 PM - 02:30 PM">01:00 PM - 02:30 PM</option>
                    <option value="03:00 PM - 04:30 PM">03:00 PM - 04:30 PM</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block dark:text-slate-300 text-slate-700 font-bold mb-1.5">Target Venue / Hall</label>
                  <select
                    value={classVenue}
                    onChange={(e) => setClassVenue(e.target.value)}
                    className="w-full dark:bg-slate-950 bg-slate-50 border dark:border-slate-800 border-slate-300 rounded-xl px-3 py-2.5 dark:text-white text-slate-900 focus:outline-none focus:border-blue-500 transition-colors font-bold text-xs md:text-sm shadow-inner"
                  >
                    <option value="Auditorium CS-301">Auditorium CS-301 (200 Capacity)</option>
                    <option value="Science 204">Science Complex 204 (50 Capacity)</option>
                    <option value="Lecture Hall 104">Lecture Hall 104 (60 Capacity)</option>
                    <option value="Eng Hall 202">Engineering Hall 202 (80 Capacity)</option>
                  </select>
                </div>

                <div>
                  <label className="block dark:text-slate-300 text-slate-700 font-bold mb-1.5">Seat Capacity Needed</label>
                  <input
                    type="number"
                    value={classCapacity}
                    onChange={(e) => setClassCapacity(Number(e.target.value))}
                    className="w-full dark:bg-slate-950 bg-slate-50 border dark:border-slate-800 border-slate-300 rounded-xl px-3.5 py-2.5 dark:text-white text-slate-900 focus:outline-none focus:border-blue-500 transition-colors font-mono font-bold text-xs md:text-sm shadow-inner"
                  />
                </div>
              </div>

              <div className="pt-1">
                <label className="block dark:text-slate-400 text-slate-600 font-bold mb-1.5 text-xs uppercase tracking-wider">Required AV Equipment</label>
                <div className="flex items-center gap-4 text-xs font-semibold">
                  <label className="flex items-center gap-2 dark:text-slate-300 text-slate-700 cursor-pointer">
                    <input type="checkbox" checked={needProjector} onChange={(e) => setNeedProjector(e.target.checked)} className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-3.5 h-3.5" />
                    <span>4K Projection Display</span>
                  </label>
                  <label className="flex items-center gap-2 dark:text-slate-300 text-slate-700 cursor-pointer">
                    <input type="checkbox" checked={needAc} onChange={(e) => setNeedAc(e.target.checked)} className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-3.5 h-3.5" />
                    <span>Climate Control (HVAC)</span>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all shadow-md cursor-pointer text-xs md:text-sm tracking-wide mt-2"
              >
                Confirm Classroom Reservation
              </button>
            </form>

            <div className="md:col-span-5 dark:bg-slate-950/90 bg-slate-50 p-4.5 rounded-2xl border dark:border-slate-800 border-slate-200 space-y-3 animate-in slide-in-from-right-4 duration-500 flex flex-col justify-between shadow-inner">
              <div>
                <div className="flex items-center justify-between border-b dark:border-slate-800 border-slate-200 pb-2.5 mb-2.5">
                  <h4 className="text-xs font-bold dark:text-slate-300 text-slate-700 uppercase tracking-wider">Telemetry Status</h4>
                  <span className="text-emerald-600 dark:text-emerald-400 text-[10px] font-mono font-bold px-2.5 py-0.5 bg-emerald-500/10 rounded-full border border-emerald-500/20">
                    ● Confirmed Available
                  </span>
                </div>

                <div className="space-y-2 text-xs dark:text-slate-300 text-slate-700">
                  <div className="flex justify-between p-2.5 dark:bg-slate-900/90 bg-white rounded-xl border dark:border-slate-800 border-slate-200 shadow-sm">
                    <span className="dark:text-slate-400 text-slate-500 font-semibold">Selected Venue:</span>
                    <span className="font-bold dark:text-white text-slate-900 truncate max-w-[130px]">{classVenue}</span>
                  </div>

                  <div className="flex justify-between p-2.5 dark:bg-slate-900/90 bg-white rounded-xl border dark:border-slate-800 border-slate-200 shadow-sm">
                    <span className="dark:text-slate-400 text-slate-500 font-semibold">Schedule Slot:</span>
                    <span className="font-mono dark:text-white text-slate-900 text-[11px]">{classDate} ({classTimeSlot})</span>
                  </div>

                  <div className="flex justify-between p-2.5 dark:bg-slate-900/90 bg-white rounded-xl border dark:border-slate-800 border-slate-200 shadow-sm">
                    <span className="dark:text-slate-400 text-slate-500 font-semibold">Max Seating:</span>
                    <span className="font-bold text-blue-600 dark:text-blue-400 font-mono">{classCapacity} Seats</span>
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t dark:border-slate-800/80 border-slate-200">
                  <span className="text-[10px] font-bold dark:text-slate-400 text-slate-500 uppercase tracking-wider block mb-2">Facility Hardware</span>
                  <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                    <div className="flex items-center gap-1.5 dark:text-slate-300 text-slate-700 dark:bg-slate-900/90 bg-white px-2.5 py-1.5 rounded-lg border dark:border-slate-800 border-slate-200 font-semibold shadow-sm">
                      <Tv className="w-3.5 h-3.5 text-blue-500" />
                      <span>4K Projection</span>
                    </div>
                    <div className="flex items-center gap-1.5 dark:text-slate-300 text-slate-700 dark:bg-slate-900/90 bg-white px-2.5 py-1.5 rounded-lg border dark:border-slate-800 border-slate-200 font-semibold shadow-sm">
                      <Wind className="w-3.5 h-3.5 text-cyan-500" />
                      <span>Climate HVAC</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-2.5 dark:bg-slate-900/80 bg-blue-50/80 border dark:border-slate-800 border-blue-100 rounded-xl text-[11px] dark:text-slate-300 text-slate-700 leading-relaxed font-medium">
                💡 <strong>Enterprise Sync:</strong> Reservation syncs directly to the central Registrar portal.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderVenueCard = () => (
    <div
      key="venue"
      className={`w-full glass-panel rounded-3xl border transition-all duration-500 ease-out transform relative overflow-hidden ${
        expandedSection === 'venue'
          ? 'border-indigo-500/50 dark:bg-slate-900/95 bg-white ring-1 ring-indigo-500/20 p-6.5 shadow-xl scale-[1.002]'
          : 'dark:border-slate-800/80 border-slate-200 hover:border-indigo-500/40 dark:bg-slate-900/60 bg-white/90 py-7.5 px-6.5 min-h-[155px] flex flex-col justify-center hover:bg-slate-50 dark:hover:bg-slate-900/80 cursor-pointer shadow-sm'
      }`}
    >
      {/* University Seminar Hall Watermark Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-20 dark:opacity-25 mix-blend-multiply dark:mix-blend-overlay pointer-events-none rounded-3xl transition-opacity duration-500"
        style={{ backgroundImage: `url('https://images.unsplash.com/photo-1431540015161-0bf868a2d407?q=80&w=1200&auto=format&fit=crop')` }}
      />
      <div
        onClick={() => setExpandedSection(expandedSection === 'venue' ? null : 'venue')}
        className="w-full flex items-center justify-between cursor-pointer group relative z-10"
      >
        <div className="flex items-center gap-4">
          <div className={`p-3.5 rounded-2xl transition-all duration-300 ${
            expandedSection === 'venue'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 scale-105'
              : 'dark:bg-slate-800/90 bg-slate-100 dark:text-indigo-400 text-indigo-600 border dark:border-slate-700/60 border-slate-200 group-hover:bg-indigo-600 group-hover:text-white'
          }`}>
            <CalendarIcon className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-base md:text-lg font-bold dark:text-white text-slate-900 tracking-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors">
                Venue Booking
              </h2>
              <span className={`text-[10px] md:text-[11px] font-bold px-3 py-0.5 rounded-full border transition-all uppercase tracking-wider ${
                expandedSection === 'venue'
                  ? 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-300 border-indigo-500/30'
                  : 'dark:bg-slate-800/80 bg-slate-100 dark:text-slate-400 text-slate-600 border-slate-200 dark:border-slate-700/60'
              }`}>
                {expandedSection === 'venue' ? 'Active Venue Form' : 'Expand Form'}
              </span>
            </div>
            <p className="text-xs md:text-sm dark:text-slate-400 text-slate-600 mt-1 leading-relaxed">
              Book auditoriums, galleries & conference halls with automated administrative approval routing.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className={`p-2.5 rounded-2xl transition-all transform duration-500 ease-in-out ${
            expandedSection === 'venue'
              ? 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border border-indigo-500/30 rotate-180 scale-110 shadow-sm'
              : 'dark:bg-slate-800/80 bg-slate-100 dark:text-slate-400 text-slate-600 border border-slate-200 dark:border-slate-700/60 group-hover:text-slate-900 dark:group-hover:text-slate-200'
          }`}>
            <ChevronDown className="w-5 h-5 stroke-[2.8]" />
          </div>
        </div>
      </div>

      {expandedSection === 'venue' && (
        <div className="w-full mt-6 pt-5 animate-in fade-in-0 zoom-in-95 slide-in-from-top-4 duration-500 fill-mode-forwards relative z-10">
          <div className="w-1/2 h-px bg-gradient-to-r from-indigo-500/40 via-slate-300 dark:via-slate-700/60 to-transparent mb-6" />

          <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-5">
            <form onSubmit={handleVenueSubmit} className="md:col-span-7 space-y-3.5 text-xs md:text-sm animate-in slide-in-from-left-4 duration-500">
              <div>
                <label className="block dark:text-slate-300 text-slate-700 font-bold mb-1.5">Target Venue / Hall</label>
                <select
                  value={venueName}
                  onChange={(e) => setVenueName(e.target.value)}
                  className="w-full dark:bg-slate-950 bg-slate-50 border dark:border-slate-800 border-slate-300 rounded-xl px-3.5 py-2.5 dark:text-white text-slate-900 focus:outline-none focus:border-indigo-500 transition-colors font-bold text-xs md:text-sm shadow-inner"
                >
                  <option value="Main Campus Auditorium">Main Campus Auditorium (250 Seats)</option>
                  <option value="Science Complex Hall B">Science Complex Hall B (120 Seats)</option>
                  <option value="Conference Center Hall A">Conference Center Hall A (80 Seats)</option>
                  <option value="Fine Arts Exhibition Gallery">Fine Arts Exhibition Gallery (300 Guests)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block dark:text-slate-300 text-slate-700 font-bold mb-1.5">Event Date</label>
                  <input
                    type="date"
                    value={venueEventDate}
                    onChange={(e) => setVenueEventDate(e.target.value)}
                    className="w-full dark:bg-slate-950 bg-slate-50 border dark:border-slate-800 border-slate-300 rounded-xl px-3 py-2.5 dark:text-white text-slate-900 focus:outline-none focus:border-indigo-500 transition-colors text-xs md:text-sm font-medium shadow-inner"
                  />
                </div>

                <div>
                  <label className="block dark:text-slate-300 text-slate-700 font-bold mb-1.5">Expected Attendees</label>
                  <input
                    type="number"
                    value={expectedAttendees}
                    onChange={(e) => setExpectedAttendees(Number(e.target.value))}
                    placeholder="Number of guests"
                    className="w-full dark:bg-slate-950 bg-slate-50 border dark:border-slate-800 border-slate-300 rounded-xl px-3.5 py-2.5 dark:text-white text-slate-900 focus:outline-none focus:border-indigo-500 transition-colors font-mono font-bold text-xs md:text-sm shadow-inner"
                  />
                </div>
              </div>

              <div>
                <label className="block dark:text-slate-300 text-slate-700 font-bold mb-1.5">Time Slot Window</label>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    placeholder="Start Time"
                    className="w-full dark:bg-slate-950 bg-slate-50 border dark:border-slate-800 border-slate-300 rounded-xl px-3 py-2.5 dark:text-white text-slate-900 focus:outline-none focus:border-indigo-500 transition-colors text-xs md:text-sm font-medium shadow-inner"
                  />
                  <input
                    type="text"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    placeholder="End Time"
                    className="w-full dark:bg-slate-950 bg-slate-50 border dark:border-slate-800 border-slate-300 rounded-xl px-3 py-2.5 dark:text-white text-slate-900 focus:outline-none focus:border-indigo-500 transition-colors text-xs md:text-sm font-medium shadow-inner"
                  />
                </div>
              </div>

              <div>
                <label className="block dark:text-slate-300 text-slate-700 font-bold mb-1.5">Event Purpose & Executive Summary</label>
                <textarea
                  value={venuePurpose}
                  onChange={(e) => setVenuePurpose(e.target.value)}
                  placeholder="Brief description of official event..."
                  rows={2}
                  className="w-full dark:bg-slate-950 bg-slate-50 border dark:border-slate-800 border-slate-300 rounded-xl px-3.5 py-2.5 dark:text-white text-slate-900 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors text-xs md:text-sm font-medium shadow-inner"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all shadow-md cursor-pointer text-xs md:text-sm tracking-wide mt-2"
              >
                Submit Venue Booking Request
              </button>
            </form>

            <div className="md:col-span-5 dark:bg-slate-950/90 bg-slate-50 p-4.5 rounded-2xl border dark:border-slate-800 border-slate-200 space-y-3 animate-in slide-in-from-right-4 duration-500 flex flex-col justify-between shadow-inner">
              <div>
                <div className="flex items-center justify-between border-b dark:border-slate-800 border-slate-200 pb-2.5 mb-2.5">
                  <h4 className="text-xs font-bold dark:text-slate-300 text-slate-700 uppercase tracking-wider">Approval Workflow</h4>
                  <span className="text-indigo-600 dark:text-indigo-400 text-[10px] font-mono font-bold px-2.5 py-0.5 bg-indigo-500/10 rounded-full border border-indigo-500/20">
                    Sub-Admin Queue
                  </span>
                </div>

                <div className="space-y-2 text-xs dark:text-slate-300 text-slate-700">
                  <div className="flex justify-between p-2.5 dark:bg-slate-900/90 bg-white rounded-xl border dark:border-slate-800 border-slate-200 shadow-sm">
                    <span className="dark:text-slate-400 text-slate-500 font-semibold">Venue Name:</span>
                    <span className="font-bold dark:text-white text-slate-900 truncate max-w-[130px]">{venueName}</span>
                  </div>

                  <div className="flex justify-between p-2.5 dark:bg-slate-900/90 bg-white rounded-xl border dark:border-slate-800 border-slate-200 shadow-sm">
                    <span className="dark:text-slate-400 text-slate-500 font-semibold">Time Window:</span>
                    <span className="font-mono dark:text-white text-slate-900 text-[11px]">{startTime} - {endTime}</span>
                  </div>

                  <div className="flex justify-between p-2.5 dark:bg-slate-900/90 bg-white rounded-xl border dark:border-slate-800 border-slate-200 shadow-sm">
                    <span className="dark:text-slate-400 text-slate-500 font-semibold">Guest Capacity:</span>
                    <span className="font-bold text-indigo-600 dark:text-indigo-400 font-mono">{expectedAttendees} Guests</span>
                  </div>
                </div>
              </div>

              <div className="p-2.5 dark:bg-slate-900/80 bg-indigo-50/80 border dark:border-slate-800 border-indigo-100 rounded-xl text-[11px] dark:text-slate-300 text-slate-700 leading-relaxed font-medium">
                🏛️ <strong>Sub-Admin Review:</strong> Dispatched directly to Sub-Admin event management board.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderBusCard = () => (
    <div
      key="bus"
      className={`w-full glass-panel rounded-3xl border transition-all duration-500 ease-out transform relative overflow-hidden ${
        expandedSection === 'bus'
          ? 'border-cyan-500/50 dark:bg-slate-900/95 bg-white ring-1 ring-cyan-500/20 p-6.5 shadow-xl scale-[1.002]'
          : 'dark:border-slate-800/80 border-slate-200 hover:border-cyan-500/40 dark:bg-slate-900/60 bg-white/90 py-7.5 px-6.5 min-h-[155px] flex flex-col justify-center hover:bg-slate-50 dark:hover:bg-slate-900/80 cursor-pointer shadow-sm'
      }`}
    >
      {/* Simple Yellow School Bus Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-25 dark:opacity-30 mix-blend-multiply dark:mix-blend-overlay pointer-events-none rounded-3xl transition-opacity duration-500"
        style={{ backgroundImage: `url('https://images.unsplash.com/photo-1557223562-6c77ef16210f?auto=format&fit=crop&w=1200&q=80')` }}
      />
      <div
        onClick={() => setExpandedSection(expandedSection === 'bus' ? null : 'bus')}
        className="w-full flex items-center justify-between cursor-pointer group relative z-10"
      >
        <div className="flex items-center gap-4">
          <div className={`p-3.5 rounded-2xl transition-all duration-300 ${
            expandedSection === 'bus'
              ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30 scale-105'
              : 'dark:bg-slate-800/90 bg-slate-100 dark:text-cyan-400 text-cyan-600 border dark:border-slate-700/60 border-slate-200 group-hover:bg-cyan-600 group-hover:text-white'
          }`}>
            <Bus className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-base md:text-lg font-bold dark:text-white text-slate-900 tracking-tight group-hover:text-cyan-600 dark:group-hover:text-cyan-300 transition-colors">
                Bus Fleet Schedule
              </h2>
              <span className={`text-[10px] md:text-[11px] font-bold px-3 py-0.5 rounded-full border transition-all uppercase tracking-wider ${
                expandedSection === 'bus'
                  ? 'bg-cyan-500/15 text-cyan-600 dark:text-cyan-300 border-cyan-500/30'
                  : 'dark:bg-slate-800/80 bg-slate-100 dark:text-slate-400 text-slate-600 border-slate-200 dark:border-slate-700/60'
              }`}>
                {expandedSection === 'bus' ? 'Active Fleet Tracker' : 'Expand Fleet'}
              </span>
            </div>
            <p className="text-xs md:text-sm dark:text-slate-400 text-slate-600 mt-1 leading-relaxed">
              Real-time campus transit tracking, seat occupancy telemetry & driver dispatch communications.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className={`p-2.5 rounded-2xl transition-all transform duration-500 ease-in-out ${
            expandedSection === 'bus'
              ? 'bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30 rotate-180 scale-110 shadow-sm'
              : 'dark:bg-slate-800/80 bg-slate-100 dark:text-slate-400 text-slate-600 border border-slate-200 dark:border-slate-700/60 group-hover:text-slate-900 dark:group-hover:text-slate-200'
          }`}>
            <ChevronDown className="w-5 h-5 stroke-[2.8]" />
          </div>
        </div>
      </div>

      {expandedSection === 'bus' && (
        <div className="w-full mt-6 pt-5 animate-in fade-in-0 zoom-in-95 slide-in-from-top-4 duration-500 fill-mode-forwards relative z-10">
          <div className="w-1/2 h-px bg-gradient-to-r from-cyan-500/40 via-slate-300 dark:via-slate-700/60 to-transparent mb-6" />

          <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-5">
            <div className="md:col-span-7 space-y-3.5 animate-in slide-in-from-left-4 duration-500">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold dark:text-slate-300 text-slate-700 uppercase tracking-wider flex items-center gap-2">
                  <Radio className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400 animate-pulse" />
                  <span>Select Active Fleet Vehicle</span>
                </h3>
                <span className="text-[10px] font-mono font-bold text-cyan-600 dark:text-cyan-400">6 Vehicles Active</span>
              </div>

              <div className="grid grid-cols-3 gap-2.5">
                {busFleet.map((b) => {
                  const isSelected = selectedBus.id === b.id;
                  return (
                    <button
                      key={b.id}
                      onClick={() => setSelectedBus(b)}
                      className={`p-3 rounded-2xl text-xs font-bold border transition-all cursor-pointer text-center relative overflow-hidden ${
                        isSelected
                          ? 'bg-gradient-to-br from-cyan-600 to-blue-600 text-white border-cyan-400 shadow-md scale-105 ring-1 ring-cyan-400/30'
                          : 'dark:bg-slate-950 bg-slate-50 dark:text-slate-300 text-slate-800 dark:border-slate-800 border-slate-300 hover:border-slate-400 dark:hover:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-900/60'
                      }`}
                    >
                      <span className="block font-bold text-[11px] truncate">{b.label}</span>
                      <span className={`text-[9px] font-mono mt-0.5 block ${isSelected ? 'text-cyan-100' : 'dark:text-slate-400 text-slate-500'}`}>{b.busNo}</span>
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => {
                  setClassToast(`Bus Fleet Telemetry refreshed for ${selectedBus.busNo}!`);
                  setTimeout(() => setClassToast(null), 3000);
                }}
                className="w-full py-2.5 dark:bg-slate-950 bg-slate-100 dark:hover:bg-slate-900 hover:bg-slate-200 dark:text-slate-300 text-slate-800 rounded-xl text-xs font-bold transition-all border dark:border-slate-800 border-slate-300 cursor-pointer shadow-sm"
              >
                Refresh Live Fleet Telemetry
              </button>
            </div>

            <div className="md:col-span-5 dark:bg-slate-950/90 bg-slate-50 p-4.5 rounded-2xl border dark:border-slate-800 border-slate-200 space-y-3 animate-in slide-in-from-right-4 duration-500 shadow-inner">
              <div className="p-3 dark:bg-slate-900/90 bg-white rounded-xl border dark:border-slate-800 border-slate-200 text-xs space-y-2 relative overflow-hidden shadow-sm">
                {/* Cool Live GPS Radar Grid Animation */}
                <div className="w-full h-14 dark:bg-slate-950/80 bg-slate-100 rounded-lg border dark:border-slate-800/80 border-slate-200 relative overflow-hidden flex items-center justify-between px-3">
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,#cbd5e1_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e1_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:14px_14px] opacity-30" />
                  <div className="flex items-center gap-2 relative z-10">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500" />
                    </span>
                    <div>
                      <span className="font-mono text-[10px] text-cyan-600 dark:text-cyan-400 font-bold block">GPS RADAR LIVE</span>
                      <span className="text-[9px] dark:text-slate-400 text-slate-600">{selectedBus.loc}</span>
                    </div>
                  </div>
                  <div className="text-right relative z-10">
                    <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      {selectedBus.speed}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between border-b dark:border-slate-800 border-slate-200 pb-2">
                  <h4 className="font-bold dark:text-white text-slate-900 text-xs">Live Vehicle Telemetry</h4>
                  <span className="text-[10px] font-bold text-cyan-600 dark:text-cyan-400 px-2 py-0.5 bg-cyan-500/10 rounded-full border border-cyan-500/20 font-mono">
                    {selectedBus.status}
                  </span>
                </div>

                <div className="space-y-1.5 dark:text-slate-300 text-slate-700 font-sans pt-1">
                  <p className="flex justify-between p-2 dark:bg-slate-950 bg-slate-50 rounded-lg border dark:border-slate-800 border-slate-200">
                    <span className="dark:text-slate-400 text-slate-500 font-semibold">Registration:</span>
                    <span className="font-mono font-bold dark:text-white text-slate-900">{selectedBus.busNo}</span>
                  </p>

                  <p className="flex justify-between p-2 dark:bg-slate-950 bg-slate-50 rounded-lg border dark:border-slate-800 border-slate-200">
                    <span className="dark:text-slate-400 text-slate-500 font-semibold">Current Stop:</span>
                    <span className="font-semibold dark:text-white text-slate-900 truncate max-w-[130px]">{selectedBus.loc}</span>
                  </p>

                  <p className="flex justify-between p-2 dark:bg-slate-950 bg-slate-50 rounded-lg border dark:border-slate-800 border-slate-200">
                    <span className="dark:text-slate-400 text-slate-500 font-semibold">Seat Occupancy:</span>
                    <span className="font-mono font-bold text-cyan-600 dark:text-cyan-400">{selectedBus.capacity - selectedBus.seatsLeft} / {selectedBus.capacity} Seats</span>
                  </p>
                </div>

                <div className="pt-2 mt-1 border-t dark:border-slate-800/80 border-slate-200 text-[11px] dark:text-slate-400 text-slate-600 flex items-center justify-between">
                  <span>Driver: <strong className="dark:text-slate-200 text-slate-900">{selectedBus.driver}</strong></span>
                  <span className="flex items-center gap-1 text-cyan-600 dark:text-cyan-400 font-bold cursor-pointer hover:underline">
                    <Phone className="w-3.5 h-3.5" /> Call Dispatch
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className={`w-full space-y-6 transition-all duration-700 font-sans ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      
      {/* Toast Alert */}
      {(classToast || venueToast || issueToast) && (
        <div className="fixed top-20 right-6 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-xs px-4.5 py-3.5 rounded-2xl shadow-2xl z-50 flex items-center gap-2.5 animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 className="w-5 h-5 text-emerald-200" />
          <span className="tracking-tight">{classToast || venueToast || issueToast}</span>
        </div>
      )}

      {/* TOP BANNER WITH COOL AMBIENT DESIGN */}
      <div className="w-full glass-panel p-6.5 rounded-3xl border border-slate-800/90 bg-gradient-to-r from-slate-900/95 via-slate-900/90 to-slate-950/95 shadow-2xl relative overflow-hidden group hover-classic-lift">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl pointer-events-none group-hover:scale-110 transition-transform duration-700" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-500/15 rounded-full blur-3xl pointer-events-none group-hover:scale-110 transition-transform duration-700" />

        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl md:text-3xl font-black tracking-tight flex items-center gap-2.5 dark:text-white text-slate-900">
                <span>Faculty Administrative Portal</span>
                <span className="px-3 py-0.5 text-[10px] font-black uppercase tracking-widest bg-gradient-to-r from-blue-500/20 to-indigo-500/20 text-blue-400 border border-blue-500/30 rounded-full shadow-sm animate-pulse">
                  Pro Studio Live
                </span>
              </h1>
              <span className="h-5 w-px bg-slate-800 hidden sm:inline-block" />
              <div className="flex items-center gap-2 px-3.5 py-1.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full text-xs font-bold shadow-sm">
                <Sparkles className="w-4 h-4 text-blue-400 animate-spin-slow" />
                <span>Good morning,</span>
                <input
                  type="text"
                  value={professorName}
                  onChange={(e) => setProfessorName(e.target.value)}
                  className="bg-blue-950/40 text-blue-200 font-bold border border-blue-500/30 rounded px-2 py-0.5 focus:outline-none text-xs"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 mt-3 flex-wrap">
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="bg-slate-900/90 text-slate-300 border border-slate-800 rounded-xl px-3.5 py-1.5 text-xs font-bold tracking-wide focus:outline-none focus:border-blue-500 min-w-[280px] shadow-inner"
              />
              <span className="text-xs text-slate-400 flex items-center gap-2 font-medium bg-slate-900/60 px-3 py-1 rounded-xl border border-slate-800/80">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                Telemetry Status: <strong className="text-emerald-400 font-mono font-bold">100% Operational</strong>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsIssueModalOpen(true)}
              className="px-5.5 py-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-extrabold rounded-2xl shadow-xl shadow-blue-600/25 transition-all transform hover:-translate-y-0.5 cursor-pointer flex items-center gap-2 text-xs md:text-sm group"
            >
              <AlertTriangle className="w-4 h-4 text-amber-300 group-hover:rotate-12 transition-transform" />
              <span>Raise Campus Issue</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* METRICS ROW (3 BOXES) */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="glass-panel p-5 rounded-2xl border border-slate-800/90 hover:border-slate-700 transition-all group flex items-center justify-between shadow-md">
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Attendance Rate</span>
            <div className="flex items-baseline gap-2">
              <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">{attendancePercent}%</h2>
              <span className="text-[11px] text-emerald-400 font-bold">+2.4% this wk</span>
            </div>
            <div className="w-36 bg-slate-800 h-2 rounded-full overflow-hidden mt-2">
              <div className="bg-blue-500 h-full rounded-full" style={{ width: `${attendancePercent}%` }} />
            </div>
          </div>
          <div className="p-3.5 bg-blue-500/10 text-blue-400 rounded-2xl border border-blue-500/20 group-hover:scale-105 transition-transform">
            <UserCheck className="w-6 h-6" />
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800/90 hover:border-slate-700 transition-all group flex items-center justify-between shadow-md">
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Leaves Taken</span>
            <div className="flex items-baseline gap-2">
              <h2 className="text-2xl md:text-3xl font-bold text-emerald-400 tracking-tight">{leavesTaken}</h2>
              <span className="text-[11px] text-slate-400 font-medium">days</span>
            </div>
            <span className="text-[11px] text-emerald-400/90 font-mono font-bold block flex items-center gap-1">
              <Check className="w-3.5 h-3.5 text-emerald-400" /> 12 Days Available
            </span>
          </div>
          <div className="p-3.5 bg-emerald-500/10 text-emerald-400 rounded-2xl border border-emerald-500/20 group-hover:scale-105 transition-transform">
            <CalendarIcon className="w-6 h-6" />
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800/90 hover:border-slate-700 transition-all group flex items-center justify-between shadow-md">
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Active Tickets</span>
            <div className="flex items-baseline gap-2">
              <h2 className="text-2xl md:text-3xl font-bold text-amber-400 tracking-tight">{activeTicketsCount}</h2>
              <span className="text-[11px] text-slate-400 font-medium">pending</span>
            </div>
            <button onClick={() => setIsIssueModalOpen(true)} className="text-[11px] text-amber-400 hover:underline font-bold block">
              + Raise Emergency Ticket
            </button>
          </div>
          <div className="p-3.5 bg-amber-500/10 text-amber-400 rounded-2xl border border-amber-500/20 group-hover:scale-105 transition-transform">
            <Ticket className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* ================= MAIN GRID ================= */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* DYNAMICALLY RE-ORDERED FEATURE CARDS CONTAINER (lg:col-span-8) */}
        <div className="lg:col-span-8 space-y-7 md:space-y-8 transition-all duration-500">
          {orderedSections.map((sec) => {
            if (sec === 'classroom') return renderClassroomCard();
            if (sec === 'venue') return renderVenueCard();
            if (sec === 'bus') return renderBusCard();
            return null;
          })}
        </div>

        {/* SIDE COLUMN CONTAINER (lg:col-span-4) */}
        <div className="lg:col-span-4 space-y-4.5">
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3 shadow-md">
            <h3 className="text-xs md:text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              <span>Campus Dispatch</span>
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              Instantly report classroom hardware or facility issues to Sub-Admin maintenance.
            </p>
            <button
              onClick={() => setIsIssueModalOpen(true)}
              className="w-full py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl text-xs transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
            >
              <AlertTriangle className="w-4 h-4 text-amber-200" />
              <span>+ Raise Emergency Ticket</span>
            </button>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3 shadow-md">
            <h3 className="text-xs md:text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Info className="w-4 h-4 text-blue-400" />
              <span>Live System Updates</span>
            </h3>
            <div className="space-y-2 text-xs">
              <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800">
                <span className="font-bold text-white block text-xs">Auditorium CS-301</span>
                <span className="text-[11px] text-slate-400">Reserved • 10:00 AM Slot</span>
              </div>
              <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800">
                <span className="font-bold text-white block text-xs">Shuttle BUS-101</span>
                <span className="text-[11px] text-slate-400">On Schedule • North Gate Stop 2</span>
              </div>
            </div>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-slate-800/90 space-y-3 shadow-lg bg-slate-900/80">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-emerald-400" />
                <span>Attendance Calendar</span>
              </h3>
              <span className="text-[11px] font-bold text-emerald-400 font-mono">Aug 2026</span>
            </div>

            <div className="grid grid-cols-7 text-center text-xs font-bold text-slate-400">
              <span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center text-xs font-mono font-bold">
              <span className="text-transparent">0</span>
              <span className="text-transparent">0</span>
              <span className="text-transparent">0</span>
              <span className="text-transparent">0</span>
              <span className="text-transparent">0</span>
              <span className="text-transparent">0</span>
              
              {attendanceDays.map((d) => {
                let cellStyle = 'bg-slate-950 text-slate-400 border-slate-800';
                if (d.type === 'present') cellStyle = 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';
                else if (d.type === 'leave') cellStyle = 'bg-amber-500/15 text-amber-300 border-amber-500/30';
                else if (d.type === 'holiday') cellStyle = 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30';
                else if (d.type === 'today') cellStyle = 'bg-blue-600 text-white font-bold ring-2 ring-blue-400 scale-105 shadow-md';
                else if (d.type === 'weekend') cellStyle = 'bg-slate-900/40 text-slate-600 border-transparent';
                
                return (
                  <div
                    key={d.day}
                    title={`Aug ${d.day}: ${d.type.toUpperCase()}`}
                    className={`py-1 rounded-lg border text-[11px] transition-all cursor-default ${cellStyle}`}
                  >
                    {d.day}
                  </div>
                );
              })}
            </div>

            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-bold text-slate-400">
              <span className="flex items-center gap-1 text-emerald-400">● Present</span>
              <span className="flex items-center gap-1 text-amber-400">● Leave</span>
              <span className="flex items-center gap-1 text-blue-400">● Today</span>
            </div>
          </div>
        </div>

      </div>

      {/* ISSUE MODAL */}
      {isIssueModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-lg p-6 rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl relative animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-amber-500/10 text-amber-400 rounded-xl">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Raise Campus Ticket</h3>
                  <p className="text-xs text-slate-400">Dispatches directly to Sub-Admin Kanban Queue</p>
                </div>
              </div>
              <button onClick={() => setIsIssueModalOpen(false)} className="p-1 text-slate-400 hover:text-white rounded-lg cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleIssueSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-400 font-bold mb-1">Ticket Title</label>
                <input
                  type="text"
                  value={issueTitle}
                  onChange={(e) => setIssueTitle(e.target.value)}
                  placeholder="e.g. AC compressor malfunction in Science 204"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Department Domain</label>
                  <select
                    value={issueDomain}
                    onChange={(e) => setIssueDomain(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="maintenance">Maintenance</option>
                    <option value="transportation">Transit / Fleet</option>
                    <option value="events">Event / AV Tech</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-bold mb-1">Venue / Location</label>
                  <input
                    type="text"
                    value={issueVenue}
                    onChange={(e) => setIssueVenue(e.target.value)}
                    placeholder="e.g. Science 204"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">Detailed Description</label>
                <textarea
                  value={issueDescription}
                  onChange={(e) => setIssueDescription(e.target.value)}
                  placeholder="Describe operational issue..."
                  rows={3}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button type="button" onClick={() => setIsIssueModalOpen(false)} className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl cursor-pointer">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl shadow-md cursor-pointer flex items-center gap-1.5">
                  <span>Submit Ticket</span>
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* AI Assistant */}
      <ChatWidget />

    </div>
  );
}
