import React, { useState, useEffect } from 'react';
import {
  Building2, Bus, Ticket, UserCheck, Calendar as CalendarIcon, Clock, Plus, Phone,
  CheckCircle2, AlertTriangle, Send, MapPin, Users, Sparkles, ArrowRight,
  ChevronDown, ChevronRight, ShieldAlert, Info, X, Check, Wifi, Tv, Wind, Zap, Radio,
  CalendarDays, User, AlertCircle, HelpCircle, LayoutDashboard, Maximize2, Minimize2,
  Filter as FilterIcon
} from 'lucide-react';
import ChatWidget from '../ChatWidget';
import RealtimeBookingMatrix from '../RealtimeBookingMatrix';

export default function FacultyDashboard({ currentUser }) {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'matrix', 'transport', 'tickets'
  const [activeExpand, setActiveExpand] = useState('classroom'); // 'classroom', 'venue', 'bus', or null
  const [buses, setBuses] = useState([]);
  const [userTickets, setUserTickets] = useState([]);
  const [toastMsg, setToastMsg] = useState(null);

  // Profile & Dept State
  const [professorName, setProfessorName] = useState(currentUser?.full_name || 'Dr. Eleanor Vance');
  const [department, setDepartment] = useState('Department of Computer Science & Engineering');

  // Metrics State (matching mockup structure)
  const [attendancePercent, setAttendancePercent] = useState(96);
  const [leavesTaken, setLeavesTaken] = useState(5);
  const [activeTicketsCount, setActiveTicketsCount] = useState(3);

  // Classroom Reservation Form State
  const [classForm, setClassForm] = useState({
    eventName: '',
    date: '2026-09-01',
    timeSlot: '09:00 AM - 11:00 AM',
    venue: 'CS-301 Auditorium',
    capacity: 60
  });

  // Venue Booking Form State
  const [venueForm, setVenueForm] = useState({
    venueName: 'Main Campus Auditorium',
    eventDate: '2026-09-05',
    startTime: '10:00 AM',
    endTime: '02:00 PM',
    attendees: 150,
    purpose: ''
  });

  // Bus Fleet Interactive Selection & Telemetry Details
  const [busFleet, setBusFleet] = useState([
    { id: 'b1', label: 'Bus 1', busNo: 'BUS-101', loc: 'North Gate - Stop 2', capacity: 60, seatsLeft: 14, speed: '42 km/h', driver: 'Alex Rivera', phone: '+1 (555) 019-2831', status: 'On Schedule' },
    { id: 'b2', label: 'Bus 2', busNo: 'BUS-102', loc: 'Science Complex Quad', capacity: 60, seatsLeft: 5, speed: '38 km/h', driver: 'Sarah Jenkins', phone: '+1 (555) 019-4820', status: 'Peak Load' },
    { id: 'b3', label: 'Bus 3', busNo: 'BUS-103', loc: 'Library Main Terminal', capacity: 55, seatsLeft: 28, speed: '0 km/h (Boarding)', driver: 'Robert Chen', phone: '+1 (555) 019-9941', status: 'On Schedule' },
    { id: 'b4', label: 'Bin Shuttle', busNo: 'BUS-104', loc: 'West Campus Bin Park', capacity: 30, seatsLeft: 12, speed: '20 km/h', driver: 'Marcus Brody', phone: '+1 (555) 019-7711', status: 'Stationed' },
    { id: 'b5', label: 'Van Express', busNo: 'VAN-201', loc: 'Faculty Quad', capacity: 15, seatsLeft: 4, speed: '50 km/h', driver: 'Elena Rostova', phone: '+1 (555) 019-3382', status: 'On Schedule' },
    { id: 'b6', label: 'VIP Bus', busNo: 'BUS-106', loc: 'Main Admin Block', capacity: 40, seatsLeft: 22, speed: '35 km/h', driver: 'David Vance', phone: '+1 (555) 019-5544', status: 'Special Booking' }
  ]);

  const [selectedBus, setSelectedBus] = useState(busFleet[0]);

  // Raise Issue Modal
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [ticketTitle, setTicketTitle] = useState('');
  const [ticketDesc, setTicketDesc] = useState('');
  const [ticketDomain, setTicketDomain] = useState('maintenance');

  // Leave Form State
  const [leaveType, setLeaveType] = useState('Casual Leave');
  const [leaveReason, setLeaveReason] = useState('');

  // Academic Calendar Filter & Selected Day State
  const [calendarFilter, setCalendarFilter] = useState('All');
  const [selectedCalendarDay, setSelectedCalendarDay] = useState(21); // Aug 21 (Today)
  const [calendarMonth, setCalendarMonth] = useState('August 2026');

  const academicEvents = [
    { id: 1, day: 25, title: 'Mid-Semester Examinations (Fall 2026)', date: 'Aug 25 - Aug 30, 2026', type: 'Exams', status: 'Upcoming', venue: 'Main Examination Halls A & B', badgeColor: 'bg-amber-500/20 text-amber-400 border-amber-500/40', dotColor: 'bg-amber-400' },
    { id: 2, day: 2, title: 'Faculty Senate Monthly Assembly & Curriculum Review', date: 'Sep 02, 2026 • 10:00 AM', type: 'Meetings', status: 'Scheduled', venue: 'Auditorium Hall B', badgeColor: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40', dotColor: 'bg-cyan-400' },
    { id: 3, day: 7, title: 'Labor Day - University Holiday', date: 'Sep 07, 2026 (All Day)', type: 'Holidays', status: 'Holiday', venue: 'Entire Campus Closed', badgeColor: 'bg-purple-500/20 text-purple-400 border-purple-500/40', dotColor: 'bg-purple-400' },
    { id: 4, day: 15, title: 'Mid-Term Attendance & Marks Upload Deadline', date: 'Sep 15, 2026 • 05:00 PM', type: 'Grades', status: 'Deadline', venue: 'Faculty ERP Portal', badgeColor: 'bg-red-500/20 text-red-400 border-red-500/40', dotColor: 'bg-red-400' },
    { id: 5, day: 22, title: 'International Science & Tech Innovation Symposium', date: 'Sep 22 - Sep 24, 2026', type: 'Events', status: 'Upcoming', venue: 'Main Convention Complex', badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40', dotColor: 'bg-emerald-400' },
    { id: 6, day: 21, title: 'Faculty Office Hours & Research Mentorship Sync', date: 'Aug 21, 2026 • Today', type: 'Meetings', status: 'Active Today', venue: 'Faculty Cabin #304', badgeColor: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40', dotColor: 'bg-cyan-400' }
  ];

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  useEffect(() => {
    fetchFacultyData();
  }, []);

  const fetchFacultyData = async () => {
    try {
      const bRes = await fetch('/api/domains/transportation');
      const bData = await bRes.json();
      if (bData.status === 'success' && bData.records?.length > 0) setBuses(bData.records);

      const tRes = await fetch(`/api/tickets?userEmail=${currentUser?.email}`);
      const tData = await tRes.json();
      if (tData.status === 'success') setUserTickets(tData.tickets || []);
    } catch (e) {
      console.error('Error fetching faculty data:', e);
    }
  };

  // Submit Classroom Reservation
  const handleClassroomSubmit = (e) => {
    e.preventDefault();
    if (!classForm.eventName.trim()) {
      showToast('Please enter an Event Name for Classroom Reservation.');
      return;
    }
    showToast(`Reserved ${classForm.venue} for "${classForm.eventName}" on ${classForm.date}!`);
    setClassForm({
      eventName: '',
      date: '2026-09-01',
      timeSlot: '09:00 AM - 11:00 AM',
      venue: 'CS-301 Auditorium',
      capacity: 60
    });
  };

  // Submit Venue Booking
  const handleVenueSubmit = (e) => {
    e.preventDefault();
    if (!venueForm.purpose.trim()) {
      showToast('Please provide an event description / purpose.');
      return;
    }
    showToast(`Booked ${venueForm.venueName} for ${venueForm.attendees} attendees on ${venueForm.eventDate}!`);
    setVenueForm({
      venueName: 'Main Campus Auditorium',
      eventDate: '2026-09-05',
      startTime: '10:00 AM',
      endTime: '02:00 PM',
      attendees: 150,
      purpose: ''
    });
  };

  // Request Bus Allocation
  const handleBusBookingSubmit = () => {
    showToast(`Requested bus allocation for ${selectedBus.label} (${selectedBus.busNo})!`);
  };

  // Submit Issue Ticket
  const handleRaiseTicket = async (e) => {
    e.preventDefault();
    if (!ticketTitle || !ticketDesc) return;

    try {
      const res = await fetch('/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: ticketTitle,
          description: ticketDesc,
          assigned_domain: ticketDomain,
          venue_name: 'Faculty Desk',
          raised_by_email: currentUser?.email
        })
      });
      const data = await res.json();
      if (data.status === 'success') {
        showToast(`Raised Issue Ticket: "${ticketTitle}"`);
        setTicketTitle('');
        setTicketDesc('');
        setActiveTicketsCount(prev => prev + 1);
        setShowIssueModal(false);
        fetchFacultyData();
      }
    } catch (err) {
      console.error('Raise ticket error:', err);
      showToast('Raised Issue Ticket disptached!');
      setActiveTicketsCount(prev => prev + 1);
      setShowIssueModal(false);
    }
  };

  // Apply Leave Submit
  const handleApplyLeave = async (e) => {
    e.preventDefault();
    if (!leaveReason) return;

    showToast(`Submitted ${leaveType} request!`);
    setLeavesTaken(prev => prev + 1);
    setLeaveReason('');
  };

  return (
    <div className="space-y-6 font-sans pb-12 relative animate-in fade-in duration-500">
      
      {/* Faint Radial Nebula Accents */}
      <div className="absolute -top-12 left-10 w-96 h-96 bg-cyan-500/5 rounded-full blur-[140px] pointer-events-none star-pulse" />
      <div className="absolute top-1/2 right-0 w-80 h-80 bg-purple-500/5 rounded-full blur-[140px] pointer-events-none star-pulse" style={{ animationDelay: '3s' }} />

      {/* Toast Alert Banner */}
      {toastMsg && (
        <div className="fixed top-20 right-6 z-50 bg-black/90 text-white px-4 py-2.5 rounded-full shadow-2xl border border-cyan-500/40 text-xs font-mono font-bold flex items-center gap-2 backdrop-blur-2xl animate-in zoom-in-95">
          <CheckCircle2 className="w-4 h-4 text-cyan-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* ================= HEADER BANNER: FACULTY PORTAL GREETING ================= */}
      <div className="card-enterprise p-5 font-sans">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="badge-pill badge-info font-mono text-[10px]">
                <User className="w-3 h-3 text-[#2563EB]" />
                FACULTY PORTAL
              </span>
              <span className="text-xs text-slate-500 font-mono">
                {department}
              </span>
            </div>
            
            <h1 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
              Welcome back, <span className="text-[#2563EB]">{currentUser?.full_name || professorName}</span>
              <Sparkles className="w-4 h-4 text-[#2563EB]" />
            </h1>
            <p className="text-xs text-slate-500 max-w-xl">
              Welcome to your campus operations hub. Easily reserve classrooms, inspect shuttle schedules, apply for leave, and track support requests.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowIssueModal(true)}
              className="btn-secondary text-xs"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-[#F59E0B]" />
              <span>Report Facility Issue</span>
            </button>
          </div>

        </div>
      </div>

      {/* ================= NAVIGATION TABS (REQUIRED Pattern #5) ================= */}
      <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-0 font-sans">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3.5 py-2 text-xs font-semibold cursor-pointer transition-colors flex items-center space-x-2 ${
              activeTab === 'overview' ? 'nav-tab-active' : 'nav-tab-inactive'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>My Overview</span>
          </button>

          <button
            onClick={() => setActiveTab('matrix')}
            className={`px-3.5 py-2 text-xs font-semibold cursor-pointer transition-colors flex items-center space-x-2 ${
              activeTab === 'matrix' ? 'nav-tab-active' : 'nav-tab-inactive'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Classroom Booking</span>
          </button>

          <button
            onClick={() => setActiveTab('transport')}
            className={`px-3.5 py-2 text-xs font-semibold cursor-pointer transition-colors flex items-center space-x-2 ${
              activeTab === 'transport' ? 'nav-tab-active' : 'nav-tab-inactive'
            }`}
          >
            <Bus className="w-3.5 h-3.5" />
            <span>Campus Bus Tracker</span>
          </button>
        </div>

        <span className="text-xs font-mono text-slate-500 hidden sm:inline-block">
          Active Role: <strong className="text-[#2563EB]">Faculty</strong>
        </span>
      </div>

      {/* ================= TAB 1: EXECUTIVE DASHBOARD VIEW (HORIZONTAL METRICS) ================= */}
      {activeTab === 'overview' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          
          {/* TOP HORIZONTAL METRICS ROW */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* ATTENDANCE CARD */}
            <div className="p-5 rounded-2xl border border-white/5 bg-white/[0.02] space-y-2 hover:border-white/10 transition-all flex flex-col justify-between">
              <div>
                <span className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider block">
                  attendance rate
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl font-mono font-extrabold text-white tracking-tight">{attendancePercent}%</span>
                  <span className="text-xs text-emerald-400 font-mono font-bold">optimal</span>
                </div>
              </div>
              <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden mt-3">
                <div className="bg-emerald-400 h-full rounded-full transition-all duration-500" style={{ width: `${attendancePercent}%` }} />
              </div>
            </div>

            {/* LEAVES TAKEN CARD */}
            <div className="card-enterprise p-4 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                  casual leaves used
                </span>
                <div className="flex items-baseline gap-1.5 mt-1">
                  <span className="text-2xl font-bold text-slate-900">{leavesTaken}</span>
                  <span className="text-xs text-slate-500 font-mono">days</span>
                </div>
              </div>
              <p className="text-[10px] text-slate-500 font-mono mt-2">15 Days Available in Term</p>
            </div>

            {/* ACTIVE TICKETS CARD */}
            <div className="card-enterprise p-4 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                    active support tickets
                  </span>
                  <div className="flex items-baseline gap-1.5 mt-1">
                    <span className="text-2xl font-bold text-[#F59E0B]">{activeTicketsCount}</span>
                    <span className="text-xs text-slate-500 font-mono">in dispatch</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowIssueModal(true)}
                  className="btn-secondary text-[11px] py-1 px-2.5"
                >
                  + Raise Ticket
                </button>
              </div>
              <p className="text-[10px] text-slate-500 font-mono mt-2">IT Support & Maintenance Dispatch</p>
            </div>

          </div>

          {/* ================= COMPACT ACADEMIC CALENDAR ================= */}
          <div className="card-enterprise p-4 space-y-3 font-sans">
            
            {/* Widget Header */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E2E8F0] pb-2">
              <div className="flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-[#2563EB]" />
                <div>
                  <h4 className="text-xs font-bold text-slate-900 flex items-center gap-2">
                    Academic Calendar Grid
                    <span className="badge-pill badge-info text-[9px] font-mono">
                      Fall 2026
                    </span>
                  </h4>
                </div>
              </div>

              {/* Month Navigator */}
              <div className="flex items-center gap-1.5 font-mono text-xs">
                <button
                  type="button"
                  onClick={() => {
                    setCalendarMonth(calendarMonth === 'August 2026' ? 'July 2026' : 'August 2026');
                    showToast('Updated calendar month view');
                  }}
                  className="btn-secondary py-0.5 px-2 text-[10px]"
                >
                  ‹ Prev
                </button>
                <span className="text-[11px] font-mono font-semibold text-slate-800 px-2 py-0.5">
                  {calendarMonth}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setCalendarMonth(calendarMonth === 'August 2026' ? 'September 2026' : 'August 2026');
                    showToast('Updated calendar month view');
                  }}
                  className="btn-secondary py-0.5 px-2 text-[10px]"
                >
                  Next ›
                </button>
              </div>
            </div>

            {/* 2-Column Calendar Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
              
              {/* Left: Mini Month Date Grid Matrix */}
              <div className="lg:col-span-7 bg-[#F8FAFC] p-3 rounded-md border border-[#E2E8F0] space-y-2">
                <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-1">
                  <span className="text-[10px] font-mono font-bold uppercase text-slate-500">
                    Month View
                  </span>
                  <span className="text-[10px] font-mono text-[#2563EB] font-bold">
                    Today: Aug 21
                  </span>
                </div>

                {/* Day Headers (Sun-Sat) */}
                <div className="grid grid-cols-7 gap-1 text-center">
                  {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                    <div key={i} className="text-[9px] font-mono font-bold text-slate-400 py-0.2">
                      {d}
                    </div>
                  ))}
                </div>

                {/* Days Grid */}
                <div className="grid grid-cols-7 gap-1">
                  {[...Array(6)].map((_, i) => (
                    <div key={`off-${i}`} className="h-6 rounded bg-slate-100 opacity-40 cursor-not-allowed" />
                  ))}
                  {[...Array(31)].map((_, idx) => {
                    const dayNum = idx + 1;
                    const isSelected = selectedCalendarDay === dayNum;
                    const isToday = dayNum === 21;
                    const matchingEvents = academicEvents.filter(
                      (e) => (e.day === dayNum || (dayNum >= 25 && dayNum <= 30 && e.id === 1))
                    );

                    return (
                      <button
                        key={dayNum}
                        type="button"
                        onClick={() => setSelectedCalendarDay(dayNum)}
                        className={`h-6 rounded border text-[10px] font-mono font-semibold flex flex-col items-center justify-center transition-all cursor-pointer relative ${
                          isSelected
                            ? 'bg-[#2563EB] text-white border-[#2563EB]'
                            : isToday
                            ? 'bg-blue-50 border-blue-300 text-[#2563EB] font-bold'
                            : 'bg-white border-[#E2E8F0] text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <span>{dayNum}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Right: Selected Date Agenda */}
              <div className="lg:col-span-5 bg-[#F8FAFC] p-3 rounded-md border border-[#E2E8F0] flex flex-col justify-between space-y-2">
                <div className="space-y-2">
                  <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-1">
                    <span className="text-[11px] font-bold text-slate-900">
                      Aug {selectedCalendarDay} Agenda
                    </span>
                    <span className="text-[10px] font-mono text-[#2563EB] font-bold">
                      Day #{selectedCalendarDay}
                    </span>
                  </div>

                  {academicEvents.filter(e => e.day === selectedCalendarDay || (selectedCalendarDay >= 25 && selectedCalendarDay <= 30 && e.id === 1)).length > 0 ? (
                    academicEvents.filter(e => e.day === selectedCalendarDay || (selectedCalendarDay >= 25 && selectedCalendarDay <= 30 && e.id === 1)).map(ev => (
                      <div key={ev.id} className="p-2 bg-white rounded border border-[#E2E8F0] space-y-0.5">
                        <div className="flex items-center justify-between">
                          <span className="badge-pill badge-info text-[9px]">
                            {ev.type}
                          </span>
                          <span className="text-[9px] font-mono text-slate-500">
                            {ev.date}
                          </span>
                        </div>
                        <h5 className="text-[11px] font-bold text-slate-900 truncate">{ev.title}</h5>
                        <p className="text-[9px] text-slate-500 font-mono flex items-center gap-1 truncate">
                          <MapPin className="w-2.5 h-2.5 text-[#2563EB]" /> {ev.venue}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="p-2 text-center text-[10px] text-slate-500 font-mono">
                      <p className="font-semibold text-slate-700">Regular Classes</p>
                      <p className="text-[9px] text-slate-400">No scheduled exam on Aug {selectedCalendarDay}.</p>
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => showToast(`Added reminder for August ${selectedCalendarDay}, 2026!`)}
                  className="btn-secondary w-full text-[10px] py-1"
                >
                  <Plus className="w-3 h-3" />
                  <span>Reminder for Aug {selectedCalendarDay}</span>
                </button>
              </div>

            </div>
          </div>

          {/* WORKSPACE GRID STACK (2-BOX LAYOUT WITH DYNAMIC EXPANSION) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">

            {/* ================= 1. CLASSROOM RESERVATION ================= */}
            <div className={`w-full card-enterprise overflow-hidden ${
              activeExpand === 'classroom'
                ? 'md:col-span-2 border-[#2563EB]'
                : 'md:col-span-1'
            }`}>
              {/* Header Bar */}
              <div
                onClick={() => setActiveExpand(activeExpand === 'classroom' ? null : 'classroom')}
                className="p-4 flex items-center justify-between cursor-pointer select-none bg-[#F8FAFC] border-b border-[#E2E8F0]"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-2xl border transition-all ${
                    activeExpand === 'classroom'
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 scale-105'
                      : 'bg-white/5 text-cyan-400 border-white/10'
                  }`}>
                    <Building2 className="w-5 h-5 stroke-[1.5]" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                      Classroom Reservation
                      {activeExpand === 'classroom' ? (
                        <span className="text-[9px] font-mono font-bold px-2 py-0.5 bg-cyan-500/20 text-cyan-300 rounded-full border border-cyan-500/40 uppercase">
                          ACTIVE WORKSPACE
                        </span>
                      ) : (
                        <span className="text-[10px] text-zinc-500 font-mono">
                          • CS-301 Audi, Halls & Labs
                        </span>
                      )}
                    </h3>
                    <p className="text-xs text-zinc-400 font-medium">
                      Reserve classrooms, lecture halls & audio-visual equipment
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-cyan-400 hidden sm:inline-block">
                    {activeExpand === 'classroom' ? 'Minimize' : 'Expand'}
                  </span>
                  <div className="p-2 rounded-xl border border-white/10 bg-white/5 text-zinc-400">
                    {activeExpand === 'classroom' ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                  </div>
                </div>
              </div>

              {/* Expanded Body Form */}
              {activeExpand === 'classroom' && (
                <div className="px-6 pb-6 pt-2 border-t border-white/5 space-y-4 animate-in fade-in duration-300">
                  <form onSubmit={handleClassroomSubmit} className="space-y-4 text-xs font-sans">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="md:col-span-2">
                        <label className="block font-mono font-bold text-zinc-300 mb-1.5">Course / Event Title</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. CS-301 Advanced Data Structures Exam..."
                          value={classForm.eventName}
                          onChange={(e) => setClassForm({ ...classForm, eventName: e.target.value })}
                          className="w-full px-4 py-2.5 bg-black/60 border border-white/10 rounded-xl font-medium text-white focus:outline-none focus:border-cyan-500/60 transition-all"
                        />
                      </div>

                      <div>
                        <label className="block font-mono font-bold text-zinc-300 mb-1.5">Priority & Category</label>
                        <select className="w-full px-4 py-2.5 bg-black/60 border border-white/10 rounded-xl font-medium text-white focus:outline-none focus:border-cyan-500/60">
                          <option value="exam">Midterm / Endterm Exam</option>
                          <option value="lecture">Regular Academic Lecture</option>
                          <option value="seminar">Research & Guest Seminar</option>
                          <option value="workshop">Departmental Workshop</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <label className="block font-mono font-bold text-zinc-300 mb-1.5">Venue / Audi / Lab</label>
                        <select
                          value={classForm.venue}
                          onChange={(e) => setClassForm({ ...classForm, venue: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-black/60 border border-white/10 rounded-xl font-medium text-white focus:outline-none focus:border-cyan-500/60"
                        >
                          <option value="CS-301 Auditorium">CS-301 Auditorium (Cap: 120)</option>
                          <option value="Classroom 102">Classroom 102 (Cap: 60)</option>
                          <option value="Science Hall A">Science Hall A (Cap: 90)</option>
                          <option value="Main Audi">Main Audi (Cap: 300)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block font-mono font-bold text-zinc-300 mb-1.5">Date</label>
                        <input
                          type="date"
                          value={classForm.date}
                          onChange={(e) => setClassForm({ ...classForm, date: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-black/60 border border-white/10 rounded-xl font-medium text-white focus:outline-none focus:border-cyan-500/60"
                        />
                      </div>

                      <div>
                        <label className="block font-mono font-bold text-zinc-300 mb-1.5">Time Slot</label>
                        <select
                          value={classForm.timeSlot}
                          onChange={(e) => setClassForm({ ...classForm, timeSlot: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-black/60 border border-white/10 rounded-xl font-medium text-white focus:outline-none focus:border-cyan-500/60"
                        >
                          <option value="09:00 AM - 11:00 AM">09:00 AM - 11:00 AM</option>
                          <option value="11:30 AM - 01:30 PM">11:30 AM - 01:30 PM</option>
                          <option value="02:00 PM - 04:00 PM">02:00 PM - 04:00 PM</option>
                          <option value="04:30 PM - 06:30 PM">04:30 PM - 06:30 PM</option>
                        </select>
                      </div>

                      <div>
                        <label className="block font-mono font-bold text-zinc-300 mb-1.5">Expected Capacity</label>
                        <input
                          type="number"
                          placeholder="e.g. 60"
                          value={classForm.capacity}
                          onChange={(e) => setClassForm({ ...classForm, capacity: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-black/60 border border-white/10 rounded-xl font-medium text-white focus:outline-none focus:border-cyan-500/60"
                        />
                      </div>
                    </div>

                    {/* AV Equipment Facilities */}
                    <div className="p-4 rounded-2xl border border-white/5 bg-black/40 space-y-2.5">
                      <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider block">
                        AV & Classroom Equipment
                      </span>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-zinc-300 font-medium">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" defaultChecked className="accent-cyan-500 rounded" />
                          <span>4K Laser Projector</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" defaultChecked className="accent-cyan-500 rounded" />
                          <span>Wireless Mic & PA</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" className="accent-cyan-500 rounded" />
                          <span>Hybrid Stream Rig</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" defaultChecked className="accent-cyan-500 rounded" />
                          <span>AC Climate Control</span>
                        </label>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-2">
                      <span className="text-[11px] font-mono text-zinc-400">
                        Status: <strong className="text-emerald-400 font-bold">Pre-check Instant</strong>
                      </span>
                      <button
                        type="submit"
                        className="px-6 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-full transition-all border border-white/15 cursor-pointer text-xs flex items-center gap-2"
                      >
                        <span>Confirm Reservation</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>

            {/* ================= 2. VENUE BOOKING ================= */}
            <div className={`w-full rounded-3xl border transition-all duration-300 overflow-hidden ${
              activeExpand === 'venue'
                ? 'md:col-span-2 border-cyan-500/40 bg-gradient-to-br from-black via-zinc-950 to-cyan-950/20 shadow-2xl ring-1 ring-cyan-500/20 backdrop-blur-2xl'
                : 'md:col-span-1 border-white/5 bg-white/[0.02] hover:bg-white/[0.035] hover:border-white/15'
            }`}>
              {/* Header Bar */}
              <div
                onClick={() => setActiveExpand(activeExpand === 'venue' ? null : 'venue')}
                className="p-5 sm:px-6 flex items-center justify-between cursor-pointer select-none"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-2xl border transition-all ${
                    activeExpand === 'venue'
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 scale-105'
                      : 'bg-white/5 text-cyan-400 border-white/10'
                  }`}>
                    <CalendarIcon className="w-5 h-5 stroke-[1.5]" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                      Venue Booking
                      {activeExpand === 'venue' ? (
                        <span className="text-[9px] font-mono font-bold px-2 py-0.5 bg-cyan-500/20 text-cyan-300 rounded-full border border-cyan-500/40 uppercase">
                          ACTIVE WORKSPACE
                        </span>
                      ) : (
                        <span className="text-[10px] text-zinc-500 font-mono">
                          • Main Audi, Conference Hall & OAT
                        </span>
                      )}
                    </h3>
                    <p className="text-xs text-zinc-400 font-medium">
                      Book university auditoriums, conference centers & outdoor venues
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-cyan-400 hidden sm:inline-block">
                    {activeExpand === 'venue' ? 'Minimize' : 'Expand'}
                  </span>
                  <div className="p-2 rounded-xl border border-white/10 bg-white/5 text-zinc-400">
                    {activeExpand === 'venue' ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                  </div>
                </div>
              </div>

              {/* Expanded Body Form */}
              {activeExpand === 'venue' && (
                <div className="px-6 pb-6 pt-2 border-t border-white/5 space-y-4 animate-in fade-in duration-300">
                  <form onSubmit={handleVenueSubmit} className="space-y-4 text-xs font-sans">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-mono font-bold text-zinc-300 mb-1.5">Venue Name</label>
                        <select
                          value={venueForm.venueName}
                          onChange={(e) => setVenueForm({ ...venueForm, venueName: e.target.value })}
                          className="w-full px-4 py-2.5 bg-black/60 border border-white/10 rounded-xl font-medium text-white focus:outline-none focus:border-cyan-500/60"
                        >
                          <option value="Main Campus Auditorium">Main Campus Auditorium (Cap: 500)</option>
                          <option value="Science Complex Hall">Science Complex Hall (Cap: 250)</option>
                          <option value="Conference Center Room B">Conference Center Room B (Cap: 100)</option>
                          <option value="Open Air Theatre">Open Air Theatre (Cap: 1000)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block font-mono font-bold text-zinc-300 mb-1.5">Event Date</label>
                        <input
                          type="date"
                          value={venueForm.eventDate}
                          onChange={(e) => setVenueForm({ ...venueForm, eventDate: e.target.value })}
                          className="w-full px-4 py-2.5 bg-black/60 border border-white/10 rounded-xl font-medium text-white focus:outline-none focus:border-cyan-500/60"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <label className="block font-mono font-bold text-zinc-300 mb-1.5">Start Time</label>
                        <input
                          type="text"
                          placeholder="10:00 AM"
                          value={venueForm.startTime}
                          onChange={(e) => setVenueForm({ ...venueForm, startTime: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-black/60 border border-white/10 rounded-xl font-medium text-white focus:outline-none focus:border-cyan-500/60"
                        />
                      </div>
                      <div>
                        <label className="block font-mono font-bold text-zinc-300 mb-1.5">End Time</label>
                        <input
                          type="text"
                          placeholder="02:00 PM"
                          value={venueForm.endTime}
                          onChange={(e) => setVenueForm({ ...venueForm, endTime: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-black/60 border border-white/10 rounded-xl font-medium text-white focus:outline-none focus:border-cyan-500/60"
                        />
                      </div>
                      <div>
                        <label className="block font-mono font-bold text-zinc-300 mb-1.5">Expected Attendees</label>
                        <input
                          type="number"
                          placeholder="Number of people"
                          value={venueForm.attendees}
                          onChange={(e) => setVenueForm({ ...venueForm, attendees: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-black/60 border border-white/10 rounded-xl font-medium text-white focus:outline-none focus:border-cyan-500/60"
                        />
                      </div>
                      <div>
                        <label className="block font-mono font-bold text-zinc-300 mb-1.5">VIP Parking Badges</label>
                        <input
                          type="number"
                          placeholder="Passes count (e.g. 5)"
                          defaultValue="4"
                          className="w-full px-3.5 py-2.5 bg-black/60 border border-white/10 rounded-xl font-medium text-white focus:outline-none focus:border-cyan-500/60"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-mono font-bold text-zinc-300 mb-1.5">Purpose / Agenda Summary</label>
                      <textarea
                        rows={2}
                        placeholder="Detailed description of event, keynotes, guest speakers..."
                        value={venueForm.purpose}
                        onChange={(e) => setVenueForm({ ...venueForm, purpose: e.target.value })}
                        className="w-full px-4 py-2 bg-black/60 border border-white/10 rounded-xl font-medium text-white focus:outline-none focus:border-cyan-500/60"
                      />
                    </div>

                    {/* Logistics Requirements */}
                    <div className="p-4 rounded-2xl border border-white/5 bg-black/40 space-y-2.5">
                      <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider block">
                        Stage & Production Logistics
                      </span>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-zinc-300 font-medium">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" defaultChecked className="accent-cyan-500 rounded" />
                          <span>Stage Lighting Rig</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" defaultChecked className="accent-cyan-500 rounded" />
                          <span>Surround Sound PA</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" defaultChecked className="accent-cyan-500 rounded" />
                          <span>VIP Front Reserved</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" defaultChecked className="accent-cyan-500 rounded" />
                          <span>Post-Event Clean</span>
                        </label>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-1">
                      <span className="text-[11px] font-mono text-zinc-400">
                        Clearance: <strong className="text-cyan-400 font-bold">Approved</strong>
                      </span>
                      <button
                        type="submit"
                        className="px-6 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-full transition-all border border-white/15 cursor-pointer text-xs flex items-center gap-2"
                      >
                        <span>Confirm Venue Booking</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>

            {/* ================= 3. BUS FLEET SCHEDULE ================= */}
            <div className={`w-full rounded-3xl border transition-all duration-300 overflow-hidden ${
              activeExpand === 'bus'
                ? 'md:col-span-2 border-cyan-500/40 bg-gradient-to-br from-black via-zinc-950 to-cyan-950/20 shadow-2xl ring-1 ring-cyan-500/20 backdrop-blur-2xl'
                : 'md:col-span-1 border-white/5 bg-white/[0.02] hover:bg-white/[0.035] hover:border-white/15'
            }`}>
              {/* Header Bar */}
              <div
                onClick={() => setActiveExpand(activeExpand === 'bus' ? null : 'bus')}
                className="p-5 sm:px-6 flex items-center justify-between cursor-pointer select-none"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-2xl border transition-all ${
                    activeExpand === 'bus'
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 scale-105'
                      : 'bg-white/5 text-cyan-400 border-white/10'
                  }`}>
                    <Bus className="w-5 h-5 stroke-[1.5]" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                      Bus Fleet Schedule & Telemetry
                      {activeExpand === 'bus' ? (
                        <span className="text-[9px] font-mono font-bold px-2 py-0.5 bg-cyan-500/20 text-cyan-300 rounded-full border border-cyan-500/40 uppercase">
                          ACTIVE WORKSPACE
                        </span>
                      ) : (
                        <span className="text-[10px] text-zinc-500 font-mono">
                          • {selectedBus.label} ({selectedBus.busNo})
                        </span>
                      )}
                    </h3>
                    <p className="text-xs text-zinc-400 font-medium">
                      Select shuttle buses, check driver contact details, seat availability & allocation
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-cyan-400 hidden sm:inline-block">
                    {activeExpand === 'bus' ? 'Minimize' : 'Expand'}
                  </span>
                  <div className="p-2 rounded-xl border border-white/10 bg-white/5 text-zinc-400">
                    {activeExpand === 'bus' ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                  </div>
                </div>
              </div>

              {/* Expanded Body Form */}
              {activeExpand === 'bus' && (
                <div className="px-6 pb-6 pt-2 border-t border-white/5 space-y-4 animate-in fade-in duration-300">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                    
                    {/* Left: Shuttle Select Pills */}
                    <div className="lg:col-span-7 space-y-3">
                      <span className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider block">
                        Select Campus Shuttle Vehicle
                      </span>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                        {busFleet.map((bus) => {
                          const isSelected = selectedBus.id === bus.id;
                          return (
                            <button
                              key={bus.id}
                              type="button"
                              onClick={() => setSelectedBus(bus)}
                              className={`p-3 rounded-2xl border text-xs font-mono transition-all cursor-pointer text-left space-y-1 ${
                                isSelected
                                  ? 'bg-white/10 text-cyan-300 border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.15)] font-bold'
                                  : 'bg-black/40 border-white/5 text-zinc-400 hover:border-white/20 hover:text-white'
                              }`}
                            >
                              <div className="font-extrabold text-sm text-white">{bus.label}</div>
                              <div className="text-[10px] text-zinc-400">{bus.busNo}</div>
                              <div className="text-[10px] text-cyan-400 font-bold">{bus.seatsLeft} seats free</div>
                            </button>
                          );
                        })}
                      </div>

                      {/* Route Stops Indicator */}
                      <div className="p-3 rounded-2xl border border-white/5 bg-black/40 space-y-1 text-xs">
                        <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase block">Active Route Loop:</span>
                        <div className="flex items-center gap-1.5 text-cyan-300 font-mono text-[10px] overflow-x-auto">
                          <span>Main Gate</span>
                          <span>➔</span>
                          <span>Hostel A</span>
                          <span>➔</span>
                          <span className="text-white font-bold underline">CS Block</span>
                          <span>➔</span>
                          <span>Science Complex</span>
                          <span>➔</span>
                          <span>Library</span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={handleBusBookingSubmit}
                        className="w-full py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-full border border-white/15 transition-all cursor-pointer flex items-center justify-center gap-2"
                      >
                        <span>Submit Bus Allocation Request ({selectedBus.label})</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Driver Telemetry Box */}
                    <div className="lg:col-span-5 p-4 rounded-2xl border border-white/5 bg-black/60 text-white space-y-3 font-mono">
                      <div className="flex items-center justify-between border-b border-white/5 pb-2">
                        <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                          Bus Telemetry
                        </h4>
                        <span className="flex h-2 w-2 relative">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500" />
                        </span>
                      </div>

                      <div className="space-y-2 text-xs text-zinc-300">
                        <div className="flex justify-between items-center border-b border-white/5 pb-1.5">
                          <span className="text-zinc-500">vehicle no:</span>
                          <span className="text-cyan-300 font-bold">{selectedBus.busNo} ({selectedBus.label})</span>
                        </div>

                        <div className="flex justify-between items-center border-b border-white/5 pb-1.5">
                          <span className="text-zinc-500">live location:</span>
                          <span className="truncate max-w-[160px] text-white flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-cyan-400 inline stroke-[1.5]" /> {selectedBus.loc}
                          </span>
                        </div>

                        <div className="flex justify-between items-center border-b border-white/5 pb-1.5">
                          <span className="text-zinc-500">capacity / seats:</span>
                          <span className="text-emerald-400 font-bold">{selectedBus.capacity} ({selectedBus.seatsLeft} free)</span>
                        </div>

                        <div className="flex justify-between items-center border-b border-white/5 pb-1.5">
                          <span className="text-zinc-500">battery:</span>
                          <span className="text-emerald-400 font-bold">88% (EV Shuttle)</span>
                        </div>

                        <div className="pt-1 text-xs text-zinc-400 flex items-center justify-between">
                          <span>Driver: <strong className="text-white">{selectedBus.driver}</strong></span>
                          <a href={`tel:${selectedBus.phone}`} className="text-cyan-300 hover:underline flex items-center gap-1">
                            <Phone className="w-3 h-3 stroke-[1.5]" /> {selectedBus.phone}
                          </a>
                        </div>
                      </div>

                      <div className="pt-2 text-[10px] text-zinc-500 flex justify-between border-t border-white/5">
                        <span>GPS Sync: 12 Satellites</span>
                        <span className="text-cyan-400">Active</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ================= 4. TICKETS RAISED & MAINTENANCE SUPPORT LOG ================= */}
            <div className={`w-full rounded-3xl border transition-all duration-300 overflow-hidden ${
              activeExpand === 'tickets'
                ? 'md:col-span-2 border-amber-500/40 bg-gradient-to-br from-black via-zinc-950 to-amber-950/20 shadow-2xl ring-1 ring-amber-500/20 backdrop-blur-2xl'
                : 'md:col-span-1 border-white/5 bg-white/[0.02] hover:bg-white/[0.035] hover:border-white/15'
            }`}>
              {/* Header Bar */}
              <div
                onClick={() => setActiveExpand(activeExpand === 'tickets' ? null : 'tickets')}
                className="p-5 sm:px-6 flex items-center justify-between cursor-pointer select-none"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-2xl border transition-all ${
                    activeExpand === 'tickets'
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 scale-105'
                      : 'bg-white/5 text-amber-400 border-white/10'
                  }`}>
                    <AlertTriangle className="w-5 h-5 stroke-[1.5]" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                      Tickets Raised & Support Log
                      <span className="text-[9px] font-mono font-bold px-2 py-0.5 bg-amber-500/20 text-amber-300 rounded-full border border-amber-500/40 uppercase">
                        {activeTicketsCount} ACTIVE
                      </span>
                    </h3>
                    <p className="text-xs text-zinc-400 font-medium">
                      Track maintenance, IT support, AV repairs & facility tickets
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowIssueModal(true);
                    }}
                    className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-amber-400 border border-amber-500/30 rounded-full text-xs font-mono font-bold transition-all cursor-pointer shrink-0 flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Raise Ticket</span>
                  </button>
                  <div className="p-2 rounded-xl border border-white/10 bg-white/5 text-zinc-400">
                    {activeExpand === 'tickets' ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                  </div>
                </div>
              </div>

              {/* Expanded Body Form / Tickets Dispatch Log */}
              {activeExpand === 'tickets' && (
                <div className="px-6 pb-6 pt-2 border-t border-white/5 space-y-4 animate-in fade-in duration-300 font-mono">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                      Active Tickets Dispatch Log
                    </h4>
                    <button
                      type="button"
                      onClick={() => setShowIssueModal(true)}
                      className="px-4 py-2 bg-white/10 hover:bg-white/20 text-amber-300 font-bold rounded-full text-xs transition-all flex items-center gap-1.5 cursor-pointer border border-amber-500/30"
                    >
                      <Plus className="w-4 h-4" />
                      <span>+ Raise New Campus Ticket</span>
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    {[
                      { id: 'TCK-8901', title: 'CS-301 Laser Projector HDMI Port Signal Intermittent', domain: 'AV Tech Support', status: 'In Progress', priority: 'High', time: '10 mins ago', date: 'Aug 21' },
                      { id: 'TCK-8854', title: 'Faculty Quad AC Unit Thermostat Sensor Calibration', domain: 'HVAC Maintenance', status: 'Pending Dispatch', priority: 'Medium', time: '2 hours ago', date: 'Aug 21' },
                      { id: 'TCK-8720', title: 'Shuttle Bus 102 Live Telemetry GPS Offline Sync', domain: 'Fleet Dispatch', status: 'Resolved', priority: 'Normal', time: 'Yesterday', date: 'Aug 20' }
                    ].map((tck) => (
                      <div key={tck.id} className="p-4 rounded-2xl bg-black/60 border border-white/5 space-y-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-white/5 text-cyan-300 rounded-full border border-white/10">
                              {tck.id}
                            </span>
                            <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-amber-500/10 text-amber-300 rounded-full border border-amber-500/30">
                              {tck.domain}
                            </span>
                            <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border uppercase ${
                              tck.status === 'In Progress' ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' :
                              tck.status === 'Resolved' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' :
                              'bg-blue-500/20 text-blue-300 border-blue-500/40'
                            }`}>
                              {tck.status}
                            </span>
                          </div>
                          <h5 className="text-xs font-bold text-white font-sans">{tck.title}</h5>
                          <p className="text-[10px] text-zinc-500">Logged on {tck.date} • {tck.time}</p>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => showToast(`Dispatched technician update for ticket ${tck.id}`)}
                            className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-zinc-300 border border-white/10 rounded-full text-xs font-bold transition-all cursor-pointer font-sans"
                          >
                            Track Status
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* ================= TAB 2: FULL VENUE BOOKING MATRIX ================= */}
      {activeTab === 'matrix' && (
        <RealtimeBookingMatrix currentUser={currentUser} />
      )}

      {/* ================= TAB 3: SHUTTLE GPS RADAR ================= */}
      {activeTab === 'transport' && (
        <div className="p-6 rounded-3xl border border-white/5 bg-white/[0.02] space-y-6 backdrop-blur-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Bus className="w-4 h-4 text-cyan-400 stroke-[1.5]" />
                <span>Shuttle Bus Fleet Telemetry & GPS Radar</span>
              </h3>
              <p className="text-xs text-zinc-400 font-medium mt-0.5">Real-time shuttle driver telemetry, seat availability, speed & route operations</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Bus Cards Grid */}
            <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-4">
              {busFleet.map((bus) => (
                <div
                  key={bus.id}
                  onClick={() => setSelectedBus(bus)}
                  className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer space-y-3 ${
                    selectedBus.id === bus.id
                      ? 'bg-white/10 border-cyan-500/40 shadow-[0_0_20px_rgba(6,182,212,0.15)] ring-1 ring-cyan-500/30'
                      : 'bg-black/40 border-white/5 hover:border-white/15'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-white text-sm">{bus.busNo}</span>
                    <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full border uppercase ${
                      bus.status === 'Peak Load'
                        ? 'bg-red-500/20 text-red-300 border-red-500/40'
                        : bus.status === 'Stationed'
                        ? 'bg-white/5 text-zinc-400 border-white/10'
                        : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    }`}>
                      {bus.status}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-white">{bus.label}</h4>
                    <p className="text-[11px] text-zinc-400 mt-1 flex items-center gap-1 font-mono">
                      <MapPin className="w-3.5 h-3.5 text-cyan-400 stroke-[1.5]" />
                      <span>{bus.loc}</span>
                    </p>
                  </div>

                  <div className="pt-2 border-t border-white/5 text-xs font-mono space-y-1">
                    <p className="text-zinc-400 flex items-center justify-between">
                      <span>Driver: <strong className="text-white">{bus.driver}</strong></span>
                      <span className="text-[10px] text-zinc-500">{bus.phone}</span>
                    </p>
                    <p className="text-zinc-400 flex items-center justify-between">
                      <span>Speed: <strong className="text-white">{bus.speed}</strong></span>
                      <span className="text-cyan-400 font-bold">{bus.seatsLeft} seats left</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* GPS Radar & Telemetry Display */}
            <div className="lg:col-span-5 p-5 rounded-2xl border border-white/5 bg-black/60 text-white space-y-4 font-mono">
              
              {/* Live GPS Radar Grid */}
              <div className="w-full h-24 bg-black rounded-xl border border-white/10 relative overflow-hidden flex items-center justify-between px-4">
                <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px] opacity-10" />
                <div className="flex items-center gap-3 relative z-10">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500" />
                  </span>
                  <div>
                    <span className="text-xs text-cyan-400 font-bold block tracking-wider">GPS RADAR TELEMETRY</span>
                    <span className="text-xs text-zinc-400">{selectedBus.loc}</span>
                  </div>
                </div>
                <div className="text-right relative z-10">
                  <span className="text-xs font-bold text-emerald-400 bg-white/5 px-2.5 py-1 rounded-full border border-white/10">
                    {selectedBus.speed}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <h4 className="font-bold text-white text-xs">Live Vehicle Telemetry: {selectedBus.label}</h4>
                <span className="text-[9px] font-bold text-cyan-400 px-2 py-0.5 bg-white/5 rounded-full border border-white/10">
                  {selectedBus.status}
                </span>
              </div>

              <div className="space-y-2 text-xs text-zinc-300 pt-1">
                <div className="flex justify-between p-2.5 bg-black/40 rounded-xl border border-white/5">
                  <span className="text-zinc-500">Bus Registration:</span>
                  <span className="font-bold text-white">{selectedBus.busNo}</span>
                </div>

                <div className="flex justify-between p-2.5 bg-black/40 rounded-xl border border-white/5">
                  <span className="text-zinc-500">Current Location:</span>
                  <span className="text-white truncate max-w-[150px]">{selectedBus.loc}</span>
                </div>

                <div className="flex justify-between p-2.5 bg-black/40 rounded-xl border border-white/5">
                  <span className="text-zinc-500">Seat Occupancy:</span>
                  <span className="text-cyan-400 font-bold">{selectedBus.capacity - selectedBus.seatsLeft} / {selectedBus.capacity} ({selectedBus.seatsLeft} Free)</span>
                </div>
              </div>

              <div className="pt-2 border-t border-white/5 text-xs text-zinc-400 flex items-center justify-between">
                <span>Driver: <strong className="text-white">{selectedBus.driver}</strong></span>
                <a href={`tel:${selectedBus.phone}`} className="flex items-center gap-1 text-cyan-300 font-bold hover:underline">
                  <Phone className="w-3.5 h-3.5 stroke-[1.5]" /> Call Driver
                </a>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* ================= RAISE CAMPUS ISSUE MODAL DIALOG ================= */}
      {showIssueModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-black/90 border border-white/10 w-full max-w-md rounded-3xl p-5 shadow-2xl space-y-4 relative animate-in zoom-in-95 backdrop-blur-2xl">
            
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-white/5 border border-white/10 rounded-xl text-amber-400">
                  <AlertTriangle className="w-4 h-4 stroke-[1.5]" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">
                    Raise Campus Support Ticket
                  </h3>
                  <p className="text-[11px] text-zinc-400 font-mono">
                    Dispatch ticket to Maintenance, Energy, or Transport
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowIssueModal(false)}
                className="p-1 rounded-full hover:bg-white/10 text-zinc-400 cursor-pointer transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleRaiseTicket} className="space-y-3.5 text-xs font-sans">
              
              {/* Issue Title */}
              <div className="space-y-1">
                <label className="block font-mono font-bold text-zinc-300">
                  Issue Title <span className="text-amber-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Projector HDMI Fault in Room CS-301"
                  value={ticketTitle}
                  onChange={(e) => setTicketTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-black/60 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400/60 transition-all"
                />
              </div>

              {/* Domain */}
              <div className="space-y-1">
                <label className="block font-mono font-bold text-zinc-300">Target Sub-Admin Domain</label>
                <select
                  value={ticketDomain}
                  onChange={(e) => setTicketDomain(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-black/60 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400/60 transition-all"
                >
                  <option value="maintenance">Maintenance (AC, Projectors, Hardware)</option>
                  <option value="energy">Energy Sub-Admin (Power Supply)</option>
                  <option value="transport">Transport Sub-Admin (Shuttle Service)</option>
                  <option value="events">Event Sub-Admin (Venue Setup)</option>
                </select>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="block font-mono font-bold text-zinc-300">
                  Detailed Description <span className="text-amber-400">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Describe the issue..."
                  value={ticketDesc}
                  onChange={(e) => setTicketDesc(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-black/60 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400/60 transition-all"
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setShowIssueModal(false)}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 text-zinc-400 rounded-full font-mono font-bold cursor-pointer transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-white/10 hover:bg-white/20 text-amber-300 border border-amber-500/30 rounded-full font-bold transition-all cursor-pointer"
                >
                  Submit Ticket
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* AI Chat Co-Pilot */}
      <ChatWidget />

    </div>
  );
}
