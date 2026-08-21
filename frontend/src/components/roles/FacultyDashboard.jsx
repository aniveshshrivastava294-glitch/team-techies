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

export default function FacultyDashboard({ currentUser, activeTab: propActiveTab, setActiveTab: propSetActiveTab }) {
  const [internalActiveTab, setInternalActiveTab] = useState(propActiveTab || 'overview');

  const activeTab = propActiveTab || internalActiveTab;
  const setActiveTab = propSetActiveTab || setInternalActiveTab;

  const [activeExpand, setActiveExpand] = useState('classroom');
  const [buses, setBuses] = useState([]);
  const [userTickets, setUserTickets] = useState([]);
  const [toastMsg, setToastMsg] = useState(null);

  const [professorName, setProfessorName] = useState(currentUser?.full_name || 'Dr. Eleanor Vance');
  const [department, setDepartment] = useState('Department of Computer Science & Engineering');

  const [attendancePercent, setAttendancePercent] = useState(96);
  const [leavesTaken, setLeavesTaken] = useState(5);
  const [activeTicketsCount, setActiveTicketsCount] = useState(3);

  const [classForm, setClassForm] = useState({
    eventName: '',
    date: '2026-09-01',
    timeSlot: '09:00 AM - 11:00 AM',
    venue: 'CS-301 Auditorium',
    capacity: 60
  });

  const [venueForm, setVenueForm] = useState({
    venueName: 'Main Campus Auditorium',
    eventDate: '2026-09-05',
    startTime: '10:00 AM',
    endTime: '02:00 PM',
    attendees: 150,
    purpose: ''
  });

  const [busFleet, setBusFleet] = useState([
    { id: 'b1', label: 'Bus 1', busNo: 'BUS-101', loc: 'North Gate - Stop 2', capacity: 60, seatsLeft: 14, speed: '42 km/h', driver: 'Alex Rivera', phone: '+1 (555) 019-2831', status: 'On Schedule' },
    { id: 'b2', label: 'Bus 2', busNo: 'BUS-102', loc: 'Science Complex Quad', capacity: 60, seatsLeft: 5, speed: '38 km/h', driver: 'Sarah Jenkins', phone: '+1 (555) 019-4820', status: 'Peak Load' },
    { id: 'b3', label: 'Bus 3', busNo: 'BUS-103', loc: 'Library Main Terminal', capacity: 55, seatsLeft: 28, speed: '0 km/h (Boarding)', driver: 'Robert Chen', phone: '+1 (555) 019-9941', status: 'On Schedule' },
    { id: 'b4', label: 'Bin Shuttle', busNo: 'BUS-104', loc: 'West Campus Bin Park', capacity: 30, seatsLeft: 12, speed: '20 km/h', driver: 'Marcus Brody', phone: '+1 (555) 019-7711', status: 'Stationed' },
    { id: 'b5', label: 'Van Express', busNo: 'VAN-201', loc: 'Faculty Quad', capacity: 15, seatsLeft: 4, speed: '50 km/h', driver: 'Elena Rostova', phone: '+1 (555) 019-3382', status: 'On Schedule' },
    { id: 'b6', label: 'VIP Bus', busNo: 'BUS-106', loc: 'Main Admin Block', capacity: 40, seatsLeft: 22, speed: '35 km/h', driver: 'David Vance', phone: '+1 (555) 019-5544', status: 'Special Booking' }
  ]);

  const [selectedBus, setSelectedBus] = useState(busFleet[0]);

  const [showIssueModal, setShowIssueModal] = useState(false);
  const [ticketTitle, setTicketTitle] = useState('');
  const [ticketDesc, setTicketDesc] = useState('');
  const [ticketDomain, setTicketDomain] = useState('maintenance');

  const [selectedCalendarDay, setSelectedCalendarDay] = useState(21);
  const [calendarMonth, setCalendarMonth] = useState('August 2026');

  const academicEvents = [
    { id: 1, day: 25, title: 'Mid-Semester Examinations (Fall 2026)', date: 'Aug 25 - Aug 30, 2026', type: 'Exams', status: 'Upcoming', venue: 'Main Examination Halls A & B' },
    { id: 2, day: 2, title: 'Faculty Senate Monthly Assembly & Curriculum Review', date: 'Sep 02, 2026 • 10:00 AM', type: 'Meetings', status: 'Scheduled', venue: 'Auditorium Hall B' },
    { id: 3, day: 7, title: 'Labor Day - University Holiday', date: 'Sep 07, 2026 (All Day)', type: 'Holidays', status: 'Holiday', venue: 'Entire Campus Closed' },
    { id: 4, day: 15, title: 'Mid-Term Attendance & Marks Upload Deadline', date: 'Sep 15, 2026 • 05:00 PM', type: 'Grades', status: 'Deadline', venue: 'Faculty ERP Portal' },
    { id: 5, day: 22, title: 'International Science & Tech Innovation Symposium', date: 'Sep 22 - Sep 24, 2026', type: 'Events', status: 'Upcoming', venue: 'Main Convention Complex' },
    { id: 6, day: 21, title: 'Faculty Office Hours & Research Mentorship Sync', date: 'Aug 21, 2026 • Today', type: 'Meetings', status: 'Active Today', venue: 'Faculty Cabin #304' }
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

  const handleBusBookingSubmit = () => {
    showToast(`Requested bus allocation for ${selectedBus.label} (${selectedBus.busNo})!`);
  };

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
      showToast('Raised Issue Ticket dispatched!');
      setActiveTicketsCount(prev => prev + 1);
      setShowIssueModal(false);
    }
  };

  return (
    <div className="space-y-6 font-sans pb-12 relative">
      
      {/* Toast Banner */}
      {toastMsg && (
        <div className="fixed top-16 right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-lg shadow-md border border-slate-700 text-xs font-mono font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* HEADER BANNER */}
      <div className="card-surface p-6 font-sans shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="badge-info text-[10px]">
                FACULTY PORTAL
              </span>
              <span className="text-xs text-slate-500 font-mono">
                {department}
              </span>
            </div>
            
            <h1 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
              Welcome back, <span className="text-blue-600">{currentUser?.full_name || professorName}</span>
              <Sparkles className="w-4 h-4 text-blue-600" />
            </h1>
            <p className="text-xs text-slate-600 max-w-xl">
              Welcome to your campus operations hub. Easily reserve classrooms, inspect shuttle schedules, apply for leave, and track support requests.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowIssueModal(true)}
              className="btn-secondary text-xs"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-blue-600" />
              <span>Report Facility Issue</span>
            </button>
          </div>

        </div>
      </div>

      {/* TAB NAVIGATION */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-0 font-sans">
        <div className="flex items-center space-x-1">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3.5 py-2 text-xs font-medium cursor-pointer transition-colors flex items-center space-x-2 border-b-2 ${
              activeTab === 'overview' ? 'border-blue-600 text-blue-600 font-semibold bg-blue-50/50' : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>My Overview</span>
          </button>

          <button
            onClick={() => setActiveTab('matrix')}
            className={`px-3.5 py-2 text-xs font-medium cursor-pointer transition-colors flex items-center space-x-2 border-b-2 ${
              activeTab === 'matrix' ? 'border-blue-600 text-blue-600 font-semibold bg-blue-50/50' : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Classroom Booking</span>
          </button>

          <button
            onClick={() => setActiveTab('transport')}
            className={`px-3.5 py-2 text-xs font-medium cursor-pointer transition-colors flex items-center space-x-2 border-b-2 ${
              activeTab === 'transport' ? 'border-blue-600 text-blue-600 font-semibold bg-blue-50/50' : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Bus className="w-3.5 h-3.5" />
            <span>Campus Bus Tracker</span>
          </button>
        </div>

        <span className="text-xs font-mono text-slate-500 hidden sm:inline-block">
          Active Role: <strong className="text-blue-600">Faculty</strong>
        </span>
      </div>

      {/* TAB 1: EXECUTIVE OVERVIEW VIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          
          {/* HORIZONTAL METRICS ROW */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            <div className="card-surface p-5 flex flex-col justify-between space-y-2 shadow-xs">
              <div>
                <span className="text-xs font-mono font-semibold text-slate-500 uppercase tracking-wider block">
                  Attendance Rate
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl font-mono font-bold text-slate-900">{attendancePercent}%</span>
                  <span className="badge-success text-[10px]">Optimal</span>
                </div>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-3 border border-slate-200">
                <div className="bg-emerald-600 h-full rounded-full transition-all duration-500" style={{ width: `${attendancePercent}%` }} />
              </div>
            </div>

            <div className="card-surface p-5 flex flex-col justify-between shadow-xs">
              <div>
                <span className="text-[10px] font-mono font-semibold text-slate-500 uppercase tracking-wider block">
                  Casual Leaves Used
                </span>
                <div className="flex items-baseline gap-1.5 mt-1">
                  <span className="text-2xl font-bold text-slate-900">{leavesTaken}</span>
                  <span className="text-xs text-slate-500 font-mono">days</span>
                </div>
              </div>
              <p className="text-[10px] text-slate-500 font-mono mt-2">15 Days Available in Term</p>
            </div>

            <div className="card-surface p-5 flex flex-col justify-between shadow-xs">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono font-semibold text-slate-500 uppercase tracking-wider block">
                    Active Support Tickets
                  </span>
                  <div className="flex items-baseline gap-1.5 mt-1">
                    <span className="text-2xl font-bold text-blue-600">{activeTicketsCount}</span>
                    <span className="text-xs text-slate-500 font-mono">in dispatch</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowIssueModal(true)}
                  className="btn-primary text-[11px] py-1 px-2.5"
                >
                  + Raise Ticket
                </button>
              </div>
              <p className="text-[10px] text-slate-500 font-mono mt-2">IT Support & Maintenance Dispatch</p>
            </div>

          </div>

          {/* ACADEMIC CALENDAR */}
          <div className="card-surface p-5 space-y-3 font-sans shadow-xs">
            
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-2">
              <div className="flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-blue-600" />
                <h4 className="text-xs font-bold text-slate-900 flex items-center gap-2">
                  Academic Calendar Grid
                  <span className="badge-info text-[9px]">Fall 2026</span>
                </h4>
              </div>

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
                <span className="text-[11px] font-mono font-bold text-slate-800 px-2 py-0.5">
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

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
              
              <div className="lg:col-span-7 bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-2">
                <div className="flex items-center justify-between border-b border-slate-200 pb-1">
                  <span className="text-[10px] font-mono font-semibold uppercase text-slate-500">
                    Month View
                  </span>
                  <span className="text-[10px] font-mono text-blue-600 font-semibold">
                    Today: Aug 21
                  </span>
                </div>

                <div className="grid grid-cols-7 gap-1 text-center">
                  {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                    <div key={i} className="text-[9px] font-mono font-bold text-slate-500 py-0.2">
                      {d}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-1">
                  {[...Array(6)].map((_, i) => (
                    <div key={`off-${i}`} className="h-6 rounded bg-slate-100 opacity-40 cursor-not-allowed" />
                  ))}
                  {[...Array(31)].map((_, idx) => {
                    const dayNum = idx + 1;
                    const isSelected = selectedCalendarDay === dayNum;
                    const isToday = dayNum === 21;

                    return (
                      <button
                        key={dayNum}
                        type="button"
                        onClick={() => setSelectedCalendarDay(dayNum)}
                        className={`h-6 rounded border text-[10px] font-mono font-semibold flex flex-col items-center justify-center transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-blue-600 text-white border-blue-600 font-bold'
                            : isToday
                            ? 'bg-blue-50 border-blue-200 text-blue-600 font-bold'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <span>{dayNum}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="lg:col-span-5 bg-slate-50 p-3 rounded-lg border border-slate-200 flex flex-col justify-between space-y-2">
                <div className="space-y-2">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-1">
                    <span className="text-[11px] font-bold text-slate-900">
                      Aug {selectedCalendarDay} Agenda
                    </span>
                    <span className="text-[10px] font-mono text-blue-600 font-semibold">
                      Day #{selectedCalendarDay}
                    </span>
                  </div>

                  {academicEvents.filter(e => e.day === selectedCalendarDay || (selectedCalendarDay >= 25 && selectedCalendarDay <= 30 && e.id === 1)).length > 0 ? (
                    academicEvents.filter(e => e.day === selectedCalendarDay || (selectedCalendarDay >= 25 && selectedCalendarDay <= 30 && e.id === 1)).map(ev => (
                      <div key={ev.id} className="p-2 bg-white rounded border border-slate-200 space-y-0.5 shadow-2xs">
                        <div className="flex items-center justify-between">
                          <span className="badge-info text-[9px]">
                            {ev.type}
                          </span>
                          <span className="text-[9px] font-mono text-slate-500">
                            {ev.date}
                          </span>
                        </div>
                        <h5 className="text-[11px] font-bold text-slate-900 truncate">{ev.title}</h5>
                        <p className="text-[9px] text-slate-600 font-mono flex items-center gap-1 truncate">
                          <MapPin className="w-2.5 h-2.5 text-blue-600" /> {ev.venue}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="p-2 text-center text-[10px] text-slate-500 font-mono">
                      <p className="font-semibold text-slate-800">Regular Classes</p>
                      <p className="text-[9px] text-slate-500">No scheduled exam on Aug {selectedCalendarDay}.</p>
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

          {/* WORKSPACE GRID STACK */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">

            {/* CLASSROOM RESERVATION */}
            <div className={`w-full card-surface overflow-hidden shadow-xs ${
              activeExpand === 'classroom'
                ? 'md:col-span-2 border-blue-500'
                : 'md:col-span-1'
            }`}>
              <div
                onClick={() => setActiveExpand(activeExpand === 'classroom' ? null : 'classroom')}
                className="p-4 flex items-center justify-between cursor-pointer select-none bg-slate-50 border-b border-slate-200"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-md bg-blue-50 border border-blue-200 text-blue-600">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      Classroom Reservation
                      {activeExpand === 'classroom' && (
                        <span className="badge-info text-[9px]">
                          ACTIVE WORKSPACE
                        </span>
                      )}
                    </h3>
                    <p className="text-xs text-slate-600">
                      Reserve classrooms, lecture halls & audio-visual equipment
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-md border border-slate-200 bg-white text-slate-600">
                    {activeExpand === 'classroom' ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                  </div>
                </div>
              </div>

              {activeExpand === 'classroom' && (
                <div className="p-5 border-t border-slate-200 space-y-4">
                  <form onSubmit={handleClassroomSubmit} className="space-y-4 text-xs font-sans">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-slate-700 font-semibold mb-1">Course / Event Title</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. CS-301 Advanced Data Structures Exam..."
                          value={classForm.eventName}
                          onChange={(e) => setClassForm({ ...classForm, eventName: e.target.value })}
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-md text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-700 font-semibold mb-1">Priority & Category</label>
                        <select className="w-full px-3 py-2 bg-white border border-slate-200 rounded-md text-xs text-slate-900 focus:outline-none focus:border-blue-600">
                          <option value="exam">Midterm / Endterm Exam</option>
                          <option value="lecture">Regular Academic Lecture</option>
                          <option value="seminar">Research & Guest Seminar</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-2">
                      <span className="text-[11px] font-mono text-slate-600">
                        Status: <strong className="text-emerald-600 font-semibold">Pre-check Instant</strong>
                      </span>
                      <button
                        type="submit"
                        className="btn-primary text-xs"
                      >
                        <span>Confirm Reservation</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* TAB 2: FULL VENUE BOOKING MATRIX */}
      {activeTab === 'matrix' && (
        <RealtimeBookingMatrix currentUser={currentUser} />
      )}

      {/* TAB 3: SHUTTLE GPS RADAR */}
      {activeTab === 'transport' && (
        <div className="card-surface p-6 space-y-6 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Bus className="w-4 h-4 text-blue-600" />
                <span>Shuttle Bus Fleet Telemetry & GPS Tracker</span>
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">Real-time shuttle driver telemetry, seat availability, speed & route operations</p>
            </div>
          </div>
        </div>
      )}

      {/* RAISE CAMPUS ISSUE MODAL */}
      {showIssueModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 w-full max-w-md rounded-lg p-5 shadow-lg space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  Raise Support Ticket
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowIssueModal(false)}
                className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleRaiseTicket} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Issue Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Projector HDMI Fault in Room CS-301"
                  value={ticketTitle}
                  onChange={(e) => setTicketTitle(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-md text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Detailed Description <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Describe the issue..."
                  value={ticketDesc}
                  onChange={(e) => setTicketDesc(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-md text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowIssueModal(false)}
                  className="btn-secondary text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary text-xs"
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
