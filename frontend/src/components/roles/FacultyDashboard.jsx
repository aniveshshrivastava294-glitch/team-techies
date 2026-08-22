import React, { useState, useEffect } from 'react';
import {
  Building2, Bus, Ticket, UserCheck, Calendar as CalendarIcon, Clock, Plus, Phone,
  CheckCircle2, AlertTriangle, Send, MapPin, Users, Sparkles, ArrowRight,
  ChevronDown, ChevronRight, ShieldAlert, Info, X, Check, Wifi, Tv, Wind, Zap, Radio,
  CalendarDays, User, AlertCircle, HelpCircle, LayoutDashboard, Maximize2, Minimize2,
  Filter as FilterIcon
} from 'lucide-react';
import SectionHero from '../SectionHero';
import { BACKDROP_IMAGES } from '../../config/backdropImages';
import ChatWidget from '../ChatWidget';
import RealtimeBookingMatrix from '../RealtimeBookingMatrix';

export default function FacultyDashboard({ currentUser }) {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'matrix', 'transport'
  const [activeExpand, setActiveExpand] = useState('classroom'); // 'classroom', 'venue', 'bus', 'tickets' or null
  const [buses, setBuses] = useState([]);
  const [userTickets, setUserTickets] = useState([]);
  const [toastMsg, setToastMsg] = useState(null);

  // Profile & Dept State
  const [professorName, setProfessorName] = useState(currentUser?.full_name || 'Dr. Eleanor Vance');
  const [department, setDepartment] = useState('Department of Computer Science & Engineering');

  // Metrics State
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

  // Bus Fleet Interactive Selection
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

  // Academic Calendar Filter & Selected Day State
  const [selectedCalendarDay, setSelectedCalendarDay] = useState(21);
  const [calendarMonth, setCalendarMonth] = useState('August 2026');

  const academicEvents = [
    { id: 1, day: 25, title: 'Mid-Semester Examinations (Fall 2026)', date: 'Aug 25 - Aug 30, 2026', type: 'Exams', status: 'Upcoming', venue: 'Main Examination Halls A & B', badgeColor: 'bg-[#C48A2E]/15 text-[#C48A2E] border-[#C48A2E]/30', dotColor: 'bg-[#C48A2E]' },
    { id: 2, day: 2, title: 'Faculty Senate Monthly Assembly & Curriculum Review', date: 'Sep 02, 2026 • 10:00 AM', type: 'Meetings', status: 'Scheduled', venue: 'Auditorium Hall B', badgeColor: 'bg-[#BC4800]/15 text-[#BC4800] border-[#BC4800]/30', dotColor: 'bg-[#BC4800]' },
    { id: 3, day: 7, title: 'Labor Day - University Holiday', date: 'Sep 07, 2026 (All Day)', type: 'Holidays', status: 'Holiday', venue: 'Entire Campus Closed', badgeColor: 'bg-[#6B5A4A]/15 text-[#6B5A4A] border-[#6B5A4A]/30', dotColor: 'bg-[#6B5A4A]' },
    { id: 4, day: 15, title: 'Mid-Term Attendance & Marks Upload Deadline', date: 'Sep 15, 2026 • 05:00 PM', type: 'Grades', status: 'Deadline', venue: 'Faculty ERP Portal', badgeColor: 'bg-[#A6402F]/15 text-[#A6402F] border-[#A6402F]/30', dotColor: 'bg-[#A6402F]' },
    { id: 5, day: 22, title: 'International Science & Tech Innovation Symposium', date: 'Sep 22 - Sep 24, 2026', type: 'Events', status: 'Upcoming', venue: 'Main Convention Complex', badgeColor: 'bg-[#4E7A51]/15 text-[#4E7A51] border-[#4E7A51]/30', dotColor: 'bg-[#4E7A51]' },
    { id: 6, day: 21, title: 'Faculty Office Hours & Research Mentorship Sync', date: 'Aug 21, 2026 • Today', type: 'Meetings', status: 'Active Today', venue: 'Faculty Cabin #304', badgeColor: 'bg-[#BC4800]/15 text-[#BC4800] border-[#BC4800]/30', dotColor: 'bg-[#BC4800]' }
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
      showToast('Raised Issue Ticket dispatched!');
      setActiveTicketsCount(prev => prev + 1);
      setShowIssueModal(false);
    }
  };

  return (
    <div className="space-y-6 font-sans pb-12 relative animate-in fade-in duration-300">
      
      {/* Toast Alert Banner */}
      {toastMsg && (
        <div className="fixed top-20 right-6 z-50 bg-[#2B1D12] text-white px-4 py-2.5 rounded-xl shadow-2xl border border-[#E8DCC8] text-xs font-medium flex items-center gap-2 animate-in zoom-in-95">
          <CheckCircle2 className="w-4 h-4 text-[#4E7A51]" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* ================= SECTION HERO: FACULTY PORTAL GREETING ================= */}
      <SectionHero
        image={BACKDROP_IMAGES.faculty}
        category="Academic Instruction"
        categoryIcon={User}
        badgeText={department}
        title={`Welcome, ${currentUser?.full_name || professorName}`}
        subtitle="Manage classroom reservations, timetable schedules, student transport, and administrative tickets."
      >
        <button
          onClick={() => setShowIssueModal(true)}
          className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg border border-white/20 text-xs font-medium backdrop-blur-xs transition-colors cursor-pointer flex items-center gap-2"
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Report an Issue</span>
        </button>
      </SectionHero>

      {/* ================= NAVIGATION TABS ================= */}
      <div className="flex items-center justify-between border-b border-[#E8DCC8] pb-3">
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center space-x-2 border ${
              activeTab === 'overview'
                ? 'bg-[#BC4800] text-white border-[#BC4800] shadow-xs'
                : 'text-[#6B5A4A] hover:text-[#2B1D12] bg-[#F7EFE4] border-[#E8DCC8]'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Faculty Workspace</span>
          </button>

          <button
            onClick={() => setActiveTab('matrix')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center space-x-2 border ${
              activeTab === 'matrix'
                ? 'bg-[#BC4800] text-white border-[#BC4800] shadow-xs'
                : 'text-[#6B5A4A] hover:text-[#2B1D12] bg-[#F7EFE4] border-[#E8DCC8]'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Classroom Matrix</span>
          </button>

          <button
            onClick={() => setActiveTab('transport')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center space-x-2 border ${
              activeTab === 'transport'
                ? 'bg-[#BC4800] text-white border-[#BC4800] shadow-xs'
                : 'text-[#6B5A4A] hover:text-[#2B1D12] bg-[#F7EFE4] border-[#E8DCC8]'
            }`}
          >
            <Bus className="w-3.5 h-3.5" />
            <span>Campus Shuttle Fleet</span>
          </button>
        </div>

        <span className="text-xs text-[#6B5A4A] hidden sm:inline-block">
          Role: <strong className="text-[#BC4800]">Faculty</strong>
        </span>
      </div>

      {/* ================= TAB 1: EXECUTIVE DASHBOARD VIEW ================= */}
      {activeTab === 'overview' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          
          {/* TOP HORIZONTAL METRICS ROW */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* ATTENDANCE CARD */}
            <div className="p-5 rounded-2xl border border-[#E8DCC8] bg-[#F7EFE4] space-y-2 shadow-xs flex flex-col justify-between">
              <div>
                <span className="text-xs font-semibold text-[#6B5A4A] block">
                  Attendance Rate
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl font-bold text-[#2B1D12] tracking-tight">{attendancePercent}%</span>
                  <span className="text-xs text-[#4E7A51] font-semibold">Optimal</span>
                </div>
              </div>
              <div className="w-full bg-[#E8DCC8] h-1.5 rounded-full overflow-hidden mt-3">
                <div className="bg-[#4E7A51] h-full rounded-full transition-all duration-500" style={{ width: `${attendancePercent}%` }} />
              </div>
            </div>

            {/* LEAVES TAKEN CARD */}
            <div className="p-5 rounded-2xl border border-[#E8DCC8] bg-[#F7EFE4] space-y-2 shadow-xs flex flex-col justify-between">
              <div>
                <span className="text-xs font-semibold text-[#6B5A4A] block">
                  Casual Leaves Used
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl font-bold text-[#2B1D12] tracking-tight">{leavesTaken}</span>
                  <span className="text-xs text-[#6B5A4A]">days</span>
                </div>
              </div>
              <p className="text-xs text-[#6B5A4A] mt-3">15 Days Available in Term</p>
            </div>

            {/* ACTIVE TICKETS CARD */}
            <div className="p-5 rounded-2xl border border-[#E8DCC8] bg-[#F7EFE4] space-y-2 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-[#6B5A4A] block">
                    Active Support Tickets
                  </span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-3xl font-bold text-[#BC4800] tracking-tight">{activeTicketsCount}</span>
                    <span className="text-xs text-[#BC4800]/80">in dispatch</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowIssueModal(true)}
                  className="px-3 py-1.5 bg-[#FDF8F2] hover:bg-[#F7EFE4] text-[#BC4800] border border-[#BC4800]/30 rounded-full text-xs font-semibold transition-all cursor-pointer"
                >
                  + Raise Ticket
                </button>
              </div>
              <p className="text-xs text-[#6B5A4A] mt-2">IT Support & Maintenance Dispatch</p>
            </div>

          </div>

          {/* ================= COMPACT ACADEMIC CALENDAR ================= */}
          <div className="p-5 rounded-2xl border border-[#E8DCC8] bg-[#F7EFE4] space-y-4 shadow-xs">
            
            {/* Widget Header */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E8DCC8] pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-[#BC4800]/15 text-[#BC4800] border border-[#BC4800]/30">
                  <CalendarDays className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#2B1D12] tracking-tight flex items-center gap-2">
                    Academic Calendar
                    <span className="text-xs font-semibold px-2 py-0.5 bg-[#FDF8F2] text-[#4E7A51] rounded-full border border-[#E8DCC8]">
                      Fall Term 2026
                    </span>
                  </h4>
                </div>
              </div>

              {/* Month Navigator & Sync */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setCalendarMonth(calendarMonth === 'August 2026' ? 'July 2026' : 'August 2026');
                    showToast('Updated calendar month view');
                  }}
                  className="px-2.5 py-1 bg-[#FDF8F2] hover:bg-[#F7EFE4] text-[#2B1D12] rounded-lg text-xs font-semibold border border-[#E8DCC8] cursor-pointer"
                >
                  ‹ Prev
                </button>
                <span className="text-xs font-bold text-[#2B1D12] bg-[#FDF8F2] px-3 py-1 rounded-lg border border-[#E8DCC8]">
                  {calendarMonth}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setCalendarMonth(calendarMonth === 'August 2026' ? 'September 2026' : 'August 2026');
                    showToast('Updated calendar month view');
                  }}
                  className="px-2.5 py-1 bg-[#FDF8F2] hover:bg-[#F7EFE4] text-[#2B1D12] rounded-lg text-xs font-semibold border border-[#E8DCC8] cursor-pointer"
                >
                  Next ›
                </button>
                <button
                  type="button"
                  onClick={() => showToast('Synced Academic Calendar with Outlook & Google Calendar!')}
                  className="px-3 py-1 bg-[#BC4800]/15 hover:bg-[#BC4800]/25 text-[#BC4800] border border-[#BC4800]/30 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Sync</span>
                </button>
              </div>
            </div>

            {/* 2-Column Ultra-Compact Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              
              {/* Left: Mini Month Date Grid Matrix */}
              <div className="lg:col-span-7 bg-[#FDF8F2] p-4 rounded-xl border border-[#E8DCC8] space-y-2">
                <div className="flex items-center justify-between border-b border-[#E8DCC8] pb-1.5">
                  <span className="text-xs font-semibold text-[#6B5A4A]">
                    Monthly Schedule Grid
                  </span>
                  <span className="text-xs text-[#BC4800] font-semibold bg-[#F7EFE4] px-2 py-0.5 rounded-full border border-[#E8DCC8]">
                    Today: Aug 21
                  </span>
                </div>

                {/* Day Headers (Sun-Sat) */}
                <div className="grid grid-cols-7 gap-1 text-center">
                  {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                    <div key={i} className="text-xs font-semibold text-[#6B5A4A] py-0.5">
                      {d}
                    </div>
                  ))}
                </div>

                {/* Days Grid */}
                <div className="grid grid-cols-7 gap-1">
                  {[...Array(6)].map((_, i) => (
                    <div key={`off-${i}`} className="h-7 rounded bg-[#F7EFE4]/40 opacity-40 cursor-not-allowed" />
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
                        className={`h-7 rounded-lg border text-xs font-semibold flex flex-col items-center justify-center transition-all cursor-pointer relative ${
                          isSelected
                            ? 'bg-[#BC4800] border-[#BC4800] text-white shadow-xs scale-105 z-10'
                            : isToday
                            ? 'bg-[#F7EFE4] border-[#BC4800] text-[#BC4800] font-bold'
                            : 'bg-[#F7EFE4] border-[#E8DCC8] text-[#2B1D12] hover:border-[#BC4800]/50'
                        }`}
                      >
                        <span>{dayNum}</span>
                        {matchingEvents.length > 0 && !isSelected && (
                          <span className={`w-1 h-1 rounded-full ${matchingEvents[0].dotColor} absolute bottom-0.5`} />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Right: Selected Date Agenda */}
              <div className="lg:col-span-5 bg-[#FDF8F2] p-4 rounded-xl border border-[#E8DCC8] flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between border-b border-[#E8DCC8] pb-1.5">
                    <span className="text-xs font-bold text-[#2B1D12]">
                      Aug {selectedCalendarDay} Agenda
                    </span>
                    <span className="text-xs text-[#BC4800] font-semibold bg-[#F7EFE4] px-2 py-0.5 rounded-full border border-[#E8DCC8]">
                      Day #{selectedCalendarDay}
                    </span>
                  </div>

                  {academicEvents.filter(e => e.day === selectedCalendarDay || (selectedCalendarDay >= 25 && selectedCalendarDay <= 30 && e.id === 1)).length > 0 ? (
                    academicEvents.filter(e => e.day === selectedCalendarDay || (selectedCalendarDay >= 25 && selectedCalendarDay <= 30 && e.id === 1)).map(ev => (
                      <div key={ev.id} className="p-2.5 rounded-lg bg-[#F7EFE4] border border-[#E8DCC8] space-y-1">
                        <div className="flex items-center justify-between">
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${ev.badgeColor}`}>
                            {ev.type}
                          </span>
                          <span className="text-xs text-[#6B5A4A]">
                            {ev.date}
                          </span>
                        </div>
                        <h5 className="text-xs font-bold text-[#2B1D12] truncate">{ev.title}</h5>
                        <p className="text-xs text-[#6B5A4A] flex items-center gap-1 truncate">
                          <MapPin className="w-3 h-3 text-[#BC4800]" /> {ev.venue}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="p-3 text-center text-xs text-[#6B5A4A] space-y-0.5">
                      <p className="font-semibold text-[#2B1D12]">Regular Academic Schedule</p>
                      <p className="text-xs text-[#6B5A4A]">Standard classroom lectures and office hours on Aug {selectedCalendarDay}.</p>
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => showToast(`Added reminder for August ${selectedCalendarDay}, 2026!`)}
                  className="w-full py-2 bg-[#F7EFE4] hover:bg-[#E8DCC8]/50 text-[#2B1D12] border border-[#E8DCC8] rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Set Reminder for Aug {selectedCalendarDay}</span>
                </button>
              </div>

            </div>
          </div>

          {/* WORKSPACE GRID STACK (2-BOX LAYOUT WITH DYNAMIC EXPANSION) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full animate-in fade-in duration-300">

            {/* ================= 1. CLASSROOM RESERVATION ================= */}
            <div className={`w-full rounded-2xl border transition-all duration-300 overflow-hidden bg-[#F7EFE4] ${
              activeExpand === 'classroom'
                ? 'md:col-span-2 border-[#BC4800] shadow-xs'
                : 'md:col-span-1 border-[#E8DCC8] hover:border-[#BC4800]/50'
            }`}>
              {/* Header Bar */}
              <div
                onClick={() => setActiveExpand(activeExpand === 'classroom' ? null : 'classroom')}
                className="p-5 flex items-center justify-between cursor-pointer select-none"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl border transition-all ${
                    activeExpand === 'classroom'
                      ? 'bg-[#BC4800] text-white border-[#BC4800]'
                      : 'bg-[#FDF8F2] text-[#BC4800] border-[#E8DCC8]'
                  }`}>
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#2B1D12] tracking-tight flex items-center gap-2">
                      Classroom Reservation
                      {activeExpand === 'classroom' ? (
                        <span className="text-xs font-semibold px-2 py-0.5 bg-[#BC4800]/15 text-[#BC4800] rounded-full border border-[#BC4800]/30">
                          Active Workspace
                        </span>
                      ) : (
                        <span className="text-xs text-[#6B5A4A]">
                          • CS-301 Audi, Halls & Labs
                        </span>
                      )}
                    </h3>
                    <p className="text-xs text-[#6B5A4A] font-medium">
                      Reserve classrooms, lecture halls & audio-visual equipment
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-[#BC4800] hidden sm:inline-block">
                    {activeExpand === 'classroom' ? 'Minimize' : 'Expand'}
                  </span>
                  <div className="p-2 rounded-lg border border-[#E8DCC8] bg-[#FDF8F2] text-[#6B5A4A]">
                    {activeExpand === 'classroom' ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                  </div>
                </div>
              </div>

              {/* Expanded Body Form */}
              {activeExpand === 'classroom' && (
                <div className="px-5 pb-5 pt-2 border-t border-[#E8DCC8] space-y-4 animate-in fade-in duration-300">
                  <form onSubmit={handleClassroomSubmit} className="space-y-4 text-xs font-sans">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="md:col-span-2">
                        <label className="block font-semibold text-[#2B1D12] mb-1.5">Course / Event Title</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. CS-301 Advanced Data Structures Exam..."
                          value={classForm.eventName}
                          onChange={(e) => setClassForm({ ...classForm, eventName: e.target.value })}
                          className="w-full px-3.5 py-2 bg-[#FDF8F2] border border-[#E8DCC8] rounded-lg font-medium text-[#2B1D12] placeholder-[#6B5A4A]/60 focus:outline-none focus:border-[#BC4800] transition-all"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-[#2B1D12] mb-1.5">Priority & Category</label>
                        <select className="w-full px-3.5 py-2 bg-[#FDF8F2] border border-[#E8DCC8] rounded-lg font-medium text-[#2B1D12] focus:outline-none focus:border-[#BC4800]">
                          <option value="exam">Midterm / Endterm Exam</option>
                          <option value="lecture">Regular Academic Lecture</option>
                          <option value="seminar">Research & Guest Seminar</option>
                          <option value="workshop">Departmental Workshop</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <label className="block font-semibold text-[#2B1D12] mb-1.5">Venue / Audi / Lab</label>
                        <select
                          value={classForm.venue}
                          onChange={(e) => setClassForm({ ...classForm, venue: e.target.value })}
                          className="w-full px-3.5 py-2 bg-[#FDF8F2] border border-[#E8DCC8] rounded-lg font-medium text-[#2B1D12] focus:outline-none focus:border-[#BC4800]"
                        >
                          <option value="CS-301 Auditorium">CS-301 Auditorium (Cap: 120)</option>
                          <option value="Classroom 102">Classroom 102 (Cap: 60)</option>
                          <option value="Science Hall A">Science Hall A (Cap: 90)</option>
                          <option value="Main Audi">Main Audi (Cap: 300)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block font-semibold text-[#2B1D12] mb-1.5">Date</label>
                        <input
                          type="date"
                          value={classForm.date}
                          onChange={(e) => setClassForm({ ...classForm, date: e.target.value })}
                          className="w-full px-3.5 py-2 bg-[#FDF8F2] border border-[#E8DCC8] rounded-lg font-medium text-[#2B1D12] focus:outline-none focus:border-[#BC4800]"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-[#2B1D12] mb-1.5">Time Slot</label>
                        <select
                          value={classForm.timeSlot}
                          onChange={(e) => setClassForm({ ...classForm, timeSlot: e.target.value })}
                          className="w-full px-3.5 py-2 bg-[#FDF8F2] border border-[#E8DCC8] rounded-lg font-medium text-[#2B1D12] focus:outline-none focus:border-[#BC4800]"
                        >
                          <option value="09:00 AM - 11:00 AM">09:00 AM - 11:00 AM</option>
                          <option value="11:30 AM - 01:30 PM">11:30 AM - 01:30 PM</option>
                          <option value="02:00 PM - 04:00 PM">02:00 PM - 04:00 PM</option>
                          <option value="04:30 PM - 06:30 PM">04:30 PM - 06:30 PM</option>
                        </select>
                      </div>

                      <div>
                        <label className="block font-semibold text-[#2B1D12] mb-1.5">Expected Capacity</label>
                        <input
                          type="number"
                          placeholder="e.g. 60"
                          value={classForm.capacity}
                          onChange={(e) => setClassForm({ ...classForm, capacity: e.target.value })}
                          className="w-full px-3.5 py-2 bg-[#FDF8F2] border border-[#E8DCC8] rounded-lg font-medium text-[#2B1D12] placeholder-[#6B5A4A]/60 focus:outline-none focus:border-[#BC4800]"
                        />
                      </div>
                    </div>

                    {/* AV Equipment Facilities */}
                    <div className="p-4 rounded-xl border border-[#E8DCC8] bg-[#FDF8F2] space-y-2.5">
                      <span className="text-xs font-semibold text-[#BC4800] block">
                        AV & Classroom Equipment
                      </span>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-[#2B1D12] font-medium">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" defaultChecked className="accent-[#BC4800] rounded" />
                          <span>4K Laser Projector</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" defaultChecked className="accent-[#BC4800] rounded" />
                          <span>Wireless Mic & PA</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" className="accent-[#BC4800] rounded" />
                          <span>Hybrid Stream Rig</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" defaultChecked className="accent-[#BC4800] rounded" />
                          <span>AC Climate Control</span>
                        </label>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-2">
                      <span className="text-xs text-[#6B5A4A]">
                        Status: <strong className="text-[#4E7A51] font-semibold">Pre-check Instant</strong>
                      </span>
                      <button
                        type="submit"
                        className="px-6 py-2.5 inst-button-primary rounded-lg font-semibold transition-all cursor-pointer text-xs flex items-center gap-2"
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
            <div className={`w-full rounded-2xl border transition-all duration-300 overflow-hidden bg-[#F7EFE4] ${
              activeExpand === 'venue'
                ? 'md:col-span-2 border-[#BC4800] shadow-xs'
                : 'md:col-span-1 border-[#E8DCC8] hover:border-[#BC4800]/50'
            }`}>
              {/* Header Bar */}
              <div
                onClick={() => setActiveExpand(activeExpand === 'venue' ? null : 'venue')}
                className="p-5 flex items-center justify-between cursor-pointer select-none"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl border transition-all ${
                    activeExpand === 'venue'
                      ? 'bg-[#BC4800] text-white border-[#BC4800]'
                      : 'bg-[#FDF8F2] text-[#BC4800] border-[#E8DCC8]'
                  }`}>
                    <CalendarIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#2B1D12] tracking-tight flex items-center gap-2">
                      Venue Booking
                      {activeExpand === 'venue' ? (
                        <span className="text-xs font-semibold px-2 py-0.5 bg-[#BC4800]/15 text-[#BC4800] rounded-full border border-[#BC4800]/30">
                          Active Workspace
                        </span>
                      ) : (
                        <span className="text-xs text-[#6B5A4A]">
                          • Main Audi, Conference Hall & OAT
                        </span>
                      )}
                    </h3>
                    <p className="text-xs text-[#6B5A4A] font-medium">
                      Book university auditoriums, conference centers & outdoor venues
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-[#BC4800] hidden sm:inline-block">
                    {activeExpand === 'venue' ? 'Minimize' : 'Expand'}
                  </span>
                  <div className="p-2 rounded-lg border border-[#E8DCC8] bg-[#FDF8F2] text-[#6B5A4A]">
                    {activeExpand === 'venue' ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                  </div>
                </div>
              </div>

              {/* Expanded Body Form */}
              {activeExpand === 'venue' && (
                <div className="px-5 pb-5 pt-2 border-t border-[#E8DCC8] space-y-4 animate-in fade-in duration-300">
                  <form onSubmit={handleVenueSubmit} className="space-y-4 text-xs font-sans">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-semibold text-[#2B1D12] mb-1.5">Venue Name</label>
                        <select
                          value={venueForm.venueName}
                          onChange={(e) => setVenueForm({ ...venueForm, venueName: e.target.value })}
                          className="w-full px-3.5 py-2 bg-[#FDF8F2] border border-[#E8DCC8] rounded-lg font-medium text-[#2B1D12] focus:outline-none focus:border-[#BC4800]"
                        >
                          <option value="Main Campus Auditorium">Main Campus Auditorium (Cap: 500)</option>
                          <option value="Science Complex Hall">Science Complex Hall (Cap: 250)</option>
                          <option value="Conference Center Room B">Conference Center Room B (Cap: 100)</option>
                          <option value="Open Air Theatre">Open Air Theatre (Cap: 1000)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block font-semibold text-[#2B1D12] mb-1.5">Event Date</label>
                        <input
                          type="date"
                          value={venueForm.eventDate}
                          onChange={(e) => setVenueForm({ ...venueForm, eventDate: e.target.value })}
                          className="w-full px-3.5 py-2 bg-[#FDF8F2] border border-[#E8DCC8] rounded-lg font-medium text-[#2B1D12] focus:outline-none focus:border-[#BC4800]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <label className="block font-semibold text-[#2B1D12] mb-1.5">Start Time</label>
                        <input
                          type="text"
                          placeholder="10:00 AM"
                          value={venueForm.startTime}
                          onChange={(e) => setVenueForm({ ...venueForm, startTime: e.target.value })}
                          className="w-full px-3.5 py-2 bg-[#FDF8F2] border border-[#E8DCC8] rounded-lg font-medium text-[#2B1D12] placeholder-[#6B5A4A]/60 focus:outline-none focus:border-[#BC4800]"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-[#2B1D12] mb-1.5">End Time</label>
                        <input
                          type="text"
                          placeholder="02:00 PM"
                          value={venueForm.endTime}
                          onChange={(e) => setVenueForm({ ...venueForm, endTime: e.target.value })}
                          className="w-full px-3.5 py-2 bg-[#FDF8F2] border border-[#E8DCC8] rounded-lg font-medium text-[#2B1D12] placeholder-[#6B5A4A]/60 focus:outline-none focus:border-[#BC4800]"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-[#2B1D12] mb-1.5">Expected Attendees</label>
                        <input
                          type="number"
                          placeholder="e.g. 150"
                          value={venueForm.attendees}
                          onChange={(e) => setVenueForm({ ...venueForm, attendees: e.target.value })}
                          className="w-full px-3.5 py-2 bg-[#FDF8F2] border border-[#E8DCC8] rounded-lg font-medium text-[#2B1D12] placeholder-[#6B5A4A]/60 focus:outline-none focus:border-[#BC4800]"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-[#2B1D12] mb-1.5">VIP Parking Badges</label>
                        <input
                          type="number"
                          placeholder="Passes count (e.g. 5)"
                          defaultValue="4"
                          className="w-full px-3.5 py-2 bg-[#FDF8F2] border border-[#E8DCC8] rounded-lg font-medium text-[#2B1D12] placeholder-[#6B5A4A]/60 focus:outline-none focus:border-[#BC4800]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-semibold text-[#2B1D12] mb-1.5">Purpose / Agenda Summary</label>
                      <textarea
                        rows={2}
                        placeholder="Detailed description of event, keynotes, guest speakers..."
                        value={venueForm.purpose}
                        onChange={(e) => setVenueForm({ ...venueForm, purpose: e.target.value })}
                        className="w-full px-3.5 py-2 bg-[#FDF8F2] border border-[#E8DCC8] rounded-lg font-medium text-[#2B1D12] placeholder-[#6B5A4A]/60 focus:outline-none focus:border-[#BC4800]"
                      />
                    </div>

                    {/* Logistics Requirements */}
                    <div className="p-4 rounded-xl border border-[#E8DCC8] bg-[#FDF8F2] space-y-2.5">
                      <span className="text-xs font-semibold text-[#BC4800] block">
                        Stage & Production Logistics
                      </span>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-[#2B1D12] font-medium">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" defaultChecked className="accent-[#BC4800] rounded" />
                          <span>Stage Lighting Rig</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" defaultChecked className="accent-[#BC4800] rounded" />
                          <span>Surround Sound PA</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" defaultChecked className="accent-[#BC4800] rounded" />
                          <span>VIP Front Reserved</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" defaultChecked className="accent-[#BC4800] rounded" />
                          <span>Post-Event Clean</span>
                        </label>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-1">
                      <span className="text-xs text-[#6B5A4A]">
                        Clearance: <strong className="text-[#4E7A51] font-semibold">Available</strong>
                      </span>
                      <button
                        type="submit"
                        className="px-6 py-2.5 inst-button-primary rounded-lg font-semibold transition-all cursor-pointer text-xs flex items-center gap-2"
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
            <div className={`w-full rounded-2xl border transition-all duration-300 overflow-hidden bg-[#F7EFE4] ${
              activeExpand === 'bus'
                ? 'md:col-span-2 border-[#BC4800] shadow-xs'
                : 'md:col-span-1 border-[#E8DCC8] hover:border-[#BC4800]/50'
            }`}>
              {/* Header Bar */}
              <div
                onClick={() => setActiveExpand(activeExpand === 'bus' ? null : 'bus')}
                className="p-5 flex items-center justify-between cursor-pointer select-none"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl border transition-all ${
                    activeExpand === 'bus'
                      ? 'bg-[#BC4800] text-white border-[#BC4800]'
                      : 'bg-[#FDF8F2] text-[#BC4800] border-[#E8DCC8]'
                  }`}>
                    <Bus className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#2B1D12] tracking-tight flex items-center gap-2">
                      Bus Fleet Schedule & Telemetry
                      {activeExpand === 'bus' ? (
                        <span className="text-xs font-semibold px-2 py-0.5 bg-[#BC4800]/15 text-[#BC4800] rounded-full border border-[#BC4800]/30">
                          Active Workspace
                        </span>
                      ) : (
                        <span className="text-xs text-[#6B5A4A]">
                          • {selectedBus.label} ({selectedBus.busNo})
                        </span>
                      )}
                    </h3>
                    <p className="text-xs text-[#6B5A4A] font-medium">
                      Select shuttle buses, check driver contact details, seat availability & allocation
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-[#BC4800] hidden sm:inline-block">
                    {activeExpand === 'bus' ? 'Minimize' : 'Expand'}
                  </span>
                  <div className="p-2 rounded-lg border border-[#E8DCC8] bg-[#FDF8F2] text-[#6B5A4A]">
                    {activeExpand === 'bus' ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                  </div>
                </div>
              </div>

              {/* Expanded Body Form */}
              {activeExpand === 'bus' && (
                <div className="px-5 pb-5 pt-2 border-t border-[#E8DCC8] space-y-4 animate-in fade-in duration-300">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                    
                    {/* Left: Shuttle Select Pills */}
                    <div className="lg:col-span-7 space-y-3">
                      <span className="text-xs font-semibold text-[#6B5A4A] block">
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
                              className={`p-3 rounded-xl border text-xs transition-all cursor-pointer text-left space-y-1 ${
                                isSelected
                                  ? 'bg-[#FDF8F2] text-[#2B1D12] border-[#BC4800] ring-1 ring-[#BC4800] font-bold shadow-xs'
                                  : 'bg-[#FDF8F2] border-[#E8DCC8] text-[#6B5A4A] hover:border-[#BC4800]/50'
                              }`}
                            >
                              <div className="font-bold text-xs text-[#2B1D12]">{bus.label}</div>
                              <div className="text-xs text-[#6B5A4A]">{bus.busNo}</div>
                              <div className="text-xs text-[#4E7A51] font-semibold">{bus.seatsLeft} seats free</div>
                            </button>
                          );
                        })}
                      </div>

                      {/* Route Stops Indicator */}
                      <div className="p-3 rounded-xl border border-[#E8DCC8] bg-[#FDF8F2] space-y-1 text-xs">
                        <span className="text-xs font-semibold text-[#6B5A4A] block">Active Route Loop:</span>
                        <div className="flex items-center gap-1.5 text-[#6B5A4A] text-xs overflow-x-auto">
                          <span>Main Gate</span>
                          <span>➔</span>
                          <span>Hostel A</span>
                          <span>➔</span>
                          <span className="text-[#BC4800] font-bold">CS Block</span>
                          <span>➔</span>
                          <span>Science Complex</span>
                          <span>➔</span>
                          <span>Library</span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={handleBusBookingSubmit}
                        className="w-full py-2.5 inst-button-primary font-semibold text-xs rounded-lg transition-all cursor-pointer flex items-center justify-center gap-2"
                      >
                        <span>Submit Bus Allocation Request ({selectedBus.label})</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Driver Telemetry Box */}
                    <div className="lg:col-span-5 p-4 rounded-xl border border-[#E8DCC8] bg-[#FDF8F2] text-[#2B1D12] space-y-3">
                      <div className="flex items-center justify-between border-b border-[#E8DCC8] pb-2">
                        <h4 className="text-xs font-bold text-[#BC4800]">
                          Bus Telemetry
                        </h4>
                        <span className="text-xs font-semibold px-2 py-0.5 bg-[#4E7A51]/15 text-[#4E7A51] rounded-full border border-[#4E7A51]/30">
                          {selectedBus.status}
                        </span>
                      </div>

                      <div className="space-y-2 text-xs text-[#6B5A4A]">
                        <div className="flex justify-between items-center border-b border-[#E8DCC8] pb-1.5">
                          <span>Vehicle No:</span>
                          <span className="text-[#2B1D12] font-semibold">{selectedBus.busNo} ({selectedBus.label})</span>
                        </div>

                        <div className="flex justify-between items-center border-b border-[#E8DCC8] pb-1.5">
                          <span>Live Location:</span>
                          <span className="truncate max-w-[160px] text-[#2B1D12] font-semibold flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-[#BC4800] inline" /> {selectedBus.loc}
                          </span>
                        </div>

                        <div className="flex justify-between items-center border-b border-[#E8DCC8] pb-1.5">
                          <span>Capacity / Seats:</span>
                          <span className="text-[#4E7A51] font-semibold">{selectedBus.capacity} ({selectedBus.seatsLeft} free)</span>
                        </div>

                        <div className="flex justify-between items-center border-b border-[#E8DCC8] pb-1.5">
                          <span>Battery:</span>
                          <span className="text-[#4E7A51] font-semibold">88% (EV Shuttle)</span>
                        </div>

                        <div className="pt-1 text-xs text-[#6B5A4A] flex items-center justify-between">
                          <span>Driver: <strong className="text-[#2B1D12]">{selectedBus.driver}</strong></span>
                          <a href={`tel:${selectedBus.phone}`} className="text-[#BC4800] font-semibold hover:underline flex items-center gap-1">
                            <Phone className="w-3 h-3" /> {selectedBus.phone}
                          </a>
                        </div>
                      </div>

                      <div className="pt-2 text-xs text-[#6B5A4A] flex justify-between border-t border-[#E8DCC8]">
                        <span>GPS Sync: 12 Satellites</span>
                        <span className="text-[#4E7A51] font-semibold">Active</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ================= 4. TICKETS RAISED & MAINTENANCE SUPPORT LOG ================= */}
            <div className={`w-full rounded-2xl border transition-all duration-300 overflow-hidden bg-[#F7EFE4] ${
              activeExpand === 'tickets'
                ? 'md:col-span-2 border-[#BC4800] shadow-xs'
                : 'md:col-span-1 border-[#E8DCC8] hover:border-[#BC4800]/50'
            }`}>
              {/* Header Bar */}
              <div
                onClick={() => setActiveExpand(activeExpand === 'tickets' ? null : 'tickets')}
                className="p-5 flex items-center justify-between cursor-pointer select-none"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl border transition-all ${
                    activeExpand === 'tickets'
                      ? 'bg-[#BC4800] text-white border-[#BC4800]'
                      : 'bg-[#FDF8F2] text-[#BC4800] border-[#E8DCC8]'
                  }`}>
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#2B1D12] tracking-tight flex items-center gap-2">
                      Tickets Raised & Support Log
                      <span className="text-xs font-semibold px-2 py-0.5 bg-[#BC4800]/15 text-[#BC4800] rounded-full border border-[#BC4800]/30">
                        {activeTicketsCount} Active
                      </span>
                    </h3>
                    <p className="text-xs text-[#6B5A4A] font-medium">
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
                    className="px-3 py-1.5 bg-[#FDF8F2] hover:bg-[#F7EFE4] text-[#BC4800] border border-[#BC4800]/30 rounded-full text-xs font-semibold transition-all cursor-pointer shrink-0 flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Raise Ticket</span>
                  </button>
                  <div className="p-2 rounded-lg border border-[#E8DCC8] bg-[#FDF8F2] text-[#6B5A4A]">
                    {activeExpand === 'tickets' ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                  </div>
                </div>
              </div>

              {/* Expanded Body Form / Tickets Dispatch Log */}
              {activeExpand === 'tickets' && (
                <div className="px-5 pb-5 pt-2 border-t border-[#E8DCC8] space-y-4 animate-in fade-in duration-300">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-[#2B1D12]">
                      Active Tickets Dispatch Log
                    </h4>
                    <button
                      type="button"
                      onClick={() => setShowIssueModal(true)}
                      className="px-4 py-2 inst-button-primary text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Raise New Ticket</span>
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    {[
                      { id: 'TCK-8901', title: 'CS-301 Laser Projector HDMI Port Signal Intermittent', domain: 'AV Tech Support', status: 'In Progress', priority: 'High', time: '10 mins ago', date: 'Aug 21' },
                      { id: 'TCK-8854', title: 'Faculty Quad AC Unit Thermostat Sensor Calibration', domain: 'HVAC Maintenance', status: 'Pending Dispatch', priority: 'Medium', time: '2 hours ago', date: 'Aug 21' },
                      { id: 'TCK-8720', title: 'Shuttle Bus 102 Live Telemetry GPS Offline Sync', domain: 'Fleet Dispatch', status: 'Resolved', priority: 'Normal', time: 'Yesterday', date: 'Aug 20' }
                    ].map((tck) => (
                      <div key={tck.id} className="p-3.5 rounded-xl bg-[#FDF8F2] border border-[#E8DCC8] space-y-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold px-2 py-0.5 bg-[#F7EFE4] text-[#2B1D12] rounded border border-[#E8DCC8]">
                              {tck.id}
                            </span>
                            <span className="text-xs font-semibold px-2 py-0.5 bg-[#F7EFE4] text-[#BC4800] rounded border border-[#E8DCC8]">
                              {tck.domain}
                            </span>
                            <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${
                              tck.status === 'In Progress' ? 'bg-[#C48A2E]/15 text-[#C48A2E] border-[#C48A2E]/30' :
                              tck.status === 'Resolved' ? 'bg-[#4E7A51]/15 text-[#4E7A51] border-[#4E7A51]/30' :
                              'bg-[#BC4800]/15 text-[#BC4800] border-[#BC4800]/30'
                            }`}>
                              {tck.status}
                            </span>
                          </div>
                          <h5 className="text-xs font-bold text-[#2B1D12]">{tck.title}</h5>
                          <p className="text-xs text-[#6B5A4A]">Logged on {tck.date} • {tck.time}</p>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => showToast(`Dispatched technician update for ticket ${tck.id}`)}
                            className="px-3 py-1.5 bg-[#F7EFE4] hover:bg-[#E8DCC8]/50 text-[#2B1D12] border border-[#E8DCC8] rounded-lg text-xs font-semibold transition-colors cursor-pointer"
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
        <div className="p-6 rounded-2xl border border-[#E8DCC8] bg-[#F7EFE4] space-y-6 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-[#2B1D12] flex items-center gap-2">
                <Bus className="w-4 h-4 text-[#BC4800]" />
                <span>Shuttle Bus Fleet Telemetry & GPS Radar</span>
              </h3>
              <p className="text-xs text-[#6B5A4A] font-medium mt-0.5">Real-time shuttle driver telemetry, seat availability, speed & route operations</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Bus Cards Grid */}
            <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-4">
              {busFleet.map((bus) => (
                <div
                  key={bus.id}
                  onClick={() => setSelectedBus(bus)}
                  className={`p-4 sm:p-5 rounded-xl border transition-all cursor-pointer space-y-3 bg-[#FDF8F2] ${
                    selectedBus.id === bus.id
                      ? 'border-[#BC4800] ring-1 ring-[#BC4800] shadow-xs'
                      : 'border-[#E8DCC8] hover:border-[#BC4800]/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#2B1D12] text-xs">{bus.busNo}</span>
                    <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${
                      bus.status === 'Peak Load'
                        ? 'bg-[#A6402F]/15 text-[#A6402F] border-[#A6402F]/30'
                        : bus.status === 'Stationed'
                        ? 'bg-[#E8DCC8]/40 text-[#6B5A4A] border-[#E8DCC8]'
                        : 'bg-[#4E7A51]/15 text-[#4E7A51] border-[#4E7A51]/30'
                    }`}>
                      {bus.status}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-[#2B1D12]">{bus.label}</h4>
                    <p className="text-xs text-[#6B5A4A] mt-1 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#BC4800]" />
                      <span>{bus.loc}</span>
                    </p>
                  </div>

                  <div className="pt-2 border-t border-[#E8DCC8] text-xs space-y-1">
                    <p className="text-[#6B5A4A] flex items-center justify-between">
                      <span>Driver: <strong className="text-[#2B1D12]">{bus.driver}</strong></span>
                      <span className="text-xs text-[#6B5A4A]">{bus.phone}</span>
                    </p>
                    <p className="text-[#6B5A4A] flex items-center justify-between">
                      <span>Speed: <strong className="text-[#2B1D12]">{bus.speed}</strong></span>
                      <span className="text-[#4E7A51] font-semibold">{bus.seatsLeft} seats left</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* GPS Radar & Telemetry Display */}
            <div className="lg:col-span-5 p-5 rounded-xl border border-[#E8DCC8] bg-[#FDF8F2] text-[#2B1D12] space-y-4">
              
              {/* Live GPS Radar Display */}
              <div className="w-full h-24 bg-[#F7EFE4] rounded-lg border border-[#E8DCC8] relative overflow-hidden flex items-center justify-between px-4">
                <div className="flex items-center gap-3 relative z-10">
                  <div className="p-2 rounded-lg bg-[#BC4800]/15 text-[#BC4800] border border-[#BC4800]/30">
                    <Bus className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#2B1D12] block">GPS Radar Telemetry</span>
                    <span className="text-xs text-[#6B5A4A]">{selectedBus.loc}</span>
                  </div>
                </div>
                <div className="text-right relative z-10">
                  <span className="text-xs font-semibold text-[#4E7A51] bg-[#4E7A51]/15 px-2.5 py-1 rounded-full border border-[#4E7A51]/30">
                    {selectedBus.speed}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between border-b border-[#E8DCC8] pb-2">
                <h4 className="font-bold text-[#2B1D12] text-xs">Live Telemetry: {selectedBus.label}</h4>
                <span className="text-xs font-semibold text-[#4E7A51] px-2 py-0.5 bg-[#4E7A51]/15 rounded-full border border-[#4E7A51]/30">
                  {selectedBus.status}
                </span>
              </div>

              <div className="space-y-2 text-xs text-[#6B5A4A] pt-1">
                <div className="flex justify-between p-2.5 bg-[#F7EFE4] rounded-lg border border-[#E8DCC8]">
                  <span>Bus Registration:</span>
                  <span className="font-bold text-[#2B1D12]">{selectedBus.busNo}</span>
                </div>

                <div className="flex justify-between p-2.5 bg-[#F7EFE4] rounded-lg border border-[#E8DCC8]">
                  <span>Current Location:</span>
                  <span className="text-[#2B1D12] font-semibold truncate max-w-[150px]">{selectedBus.loc}</span>
                </div>

                <div className="flex justify-between p-2.5 bg-[#F7EFE4] rounded-lg border border-[#E8DCC8]">
                  <span>Seat Occupancy:</span>
                  <span className="text-[#4E7A51] font-semibold">{selectedBus.capacity - selectedBus.seatsLeft} / {selectedBus.capacity} ({selectedBus.seatsLeft} Free)</span>
                </div>
              </div>

              <div className="pt-2 border-t border-[#E8DCC8] text-xs text-[#6B5A4A] flex items-center justify-between">
                <span>Driver: <strong className="text-[#2B1D12]">{selectedBus.driver}</strong></span>
                <a href={`tel:${selectedBus.phone}`} className="flex items-center gap-1 text-[#BC4800] font-semibold hover:underline">
                  <Phone className="w-3.5 h-3.5" /> Call Driver
                </a>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* ================= RAISE CAMPUS ISSUE MODAL DIALOG ================= */}
      {showIssueModal && (
        <div className="fixed inset-0 bg-[#2B1D12]/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in font-sans">
          <div className="bg-[#F7EFE4] border border-[#E8DCC8] w-full max-w-md rounded-2xl p-5 shadow-2xl space-y-4 relative animate-in zoom-in-95">
            
            <div className="flex items-center justify-between pb-3 border-b border-[#E8DCC8]">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-[#BC4800]/15 border border-[#BC4800]/30 rounded-lg text-[#BC4800]">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#2B1D12]">
                    Raise Campus Support Ticket
                  </h3>
                  <p className="text-xs text-[#6B5A4A]">
                    Dispatch ticket to Maintenance, Energy, or Transport
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowIssueModal(false)}
                className="p-1 rounded-lg hover:bg-[#FDF8F2] text-[#6B5A4A] cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleRaiseTicket} className="space-y-3.5 text-xs font-sans">
              
              {/* Issue Title */}
              <div className="space-y-1">
                <label className="block font-semibold text-[#2B1D12]">
                  Issue Title <span className="text-[#BC4800]">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Projector HDMI Fault in Room CS-301"
                  value={ticketTitle}
                  onChange={(e) => setTicketTitle(e.target.value)}
                  className="w-full px-3.5 py-2 bg-[#FDF8F2] border border-[#E8DCC8] rounded-lg text-xs text-[#2B1D12] placeholder-[#6B5A4A]/60 focus:outline-none focus:border-[#BC4800] transition-all"
                />
              </div>

              {/* Domain */}
              <div className="space-y-1">
                <label className="block font-semibold text-[#2B1D12]">Target Sub-Admin Domain</label>
                <select
                  value={ticketDomain}
                  onChange={(e) => setTicketDomain(e.target.value)}
                  className="w-full px-3.5 py-2 bg-[#FDF8F2] border border-[#E8DCC8] rounded-lg text-xs text-[#2B1D12] focus:outline-none focus:border-[#BC4800] transition-all"
                >
                  <option value="maintenance">Maintenance (AC, Projectors, Hardware)</option>
                  <option value="energy">Energy Sub-Admin (Power Supply)</option>
                  <option value="transport">Transport Sub-Admin (Shuttle Service)</option>
                  <option value="events">Event Sub-Admin (Venue Setup)</option>
                </select>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="block font-semibold text-[#2B1D12]">
                  Detailed Description <span className="text-[#BC4800]">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Describe the issue..."
                  value={ticketDesc}
                  onChange={(e) => setTicketDesc(e.target.value)}
                  className="w-full px-3.5 py-2 bg-[#FDF8F2] border border-[#E8DCC8] rounded-lg text-xs text-[#2B1D12] placeholder-[#6B5A4A]/60 focus:outline-none focus:border-[#BC4800] transition-all"
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E8DCC8]">
                <button
                  type="button"
                  onClick={() => setShowIssueModal(false)}
                  className="px-4 py-2 bg-[#FDF8F2] hover:bg-[#F7EFE4] text-[#2B1D12] border border-[#E8DCC8] rounded-lg font-semibold cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 inst-button-primary rounded-lg font-semibold transition-colors cursor-pointer shadow-xs"
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

