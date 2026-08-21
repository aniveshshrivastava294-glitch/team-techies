import React, { useState } from 'react';
import TicketsSupportLogCard from '../TicketsSupportLogCard';
import LiveCampusTicker from '../LiveCampusTicker';
import {
  Bus, Search, Plus, Check, X, Clock, MapPin, Users, Calendar,
  Edit2, AlertCircle, ShieldAlert, Sparkles, CheckCircle2, Navigation,
  Radio, ArrowRight, Zap, RefreshCw, Trash2, CreditCard
} from 'lucide-react';

export default function TransportManagerInterface() {
  // Filter States
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Bus Fleet Initial State (with exact fields: Bus Number, Capacity, Dist, Number Plate)
  const [busFleet, setBusFleet] = useState([
    {
      id: 'b1', busNumber: 'Bus 1', capacity: 50, dist: 'ptk', numberPlate: 'PB-01-AB-1001',
      status: 'On Route', occupied: 38, morningDep: '07:00 AM', morningArr: '09:30 AM', eveDep: '04:30 PM', eveArr: '06:00 PM (*approx*)'
    },
    {
      id: 'b2', busNumber: 'Bus 2', capacity: 25, dist: 'itemi', numberPlate: 'PB-01-AB-1002',
      status: 'On Route', occupied: 22, morningDep: '07:15 AM', morningArr: '09:15 AM', eveDep: '04:45 PM', eveArr: '06:15 PM (*approx*)'
    },
    {
      id: 'b3', busNumber: 'Bus 3', capacity: 25, dist: 'haktar', numberPlate: 'PB-01-AB-1003',
      status: 'On Route', occupied: 12, morningDep: '07:30 AM', morningArr: '09:45 AM', eveDep: '05:00 PM', eveArr: '06:30 PM (*approx*)'
    },
    {
      id: 'b4', busNumber: 'Bus 4', capacity: 30, dist: 'jabban', numberPlate: 'PB-01-AB-1004',
      status: 'Maintenance', occupied: 0, morningDep: '08:00 AM', morningArr: '10:00 AM', eveDep: '05:15 PM', eveArr: '06:45 PM (*approx*)'
    },
    {
      id: 'b5', busNumber: 'Bus 5', capacity: 30, dist: 'sxrr', numberPlate: 'PB-01-AB-1005',
      status: 'Stationed', occupied: 0, morningDep: '06:45 AM', morningArr: '08:45 AM', eveDep: '04:15 PM', eveArr: '05:45 PM (*approx*)'
    },
    {
      id: 'b6', busNumber: 'Bus 6', capacity: 55, dist: 'dalbalpur', numberPlate: 'PB-01-AB-1006',
      status: 'On Route', occupied: 49, morningDep: '07:10 AM', morningArr: '09:20 AM', eveDep: '04:40 PM', eveArr: '06:10 PM (*approx*)'
    },
    {
      id: 'b7', busNumber: 'Bus 7', capacity: 10, dist: 'taganable', numberPlate: 'PB-01-AB-1007',
      status: 'Special Shuttle', occupied: 6, morningDep: '08:15 AM', morningArr: '09:45 AM', eveDep: '05:30 PM', eveArr: '06:50 PM (*approx*)'
    },
    {
      id: 'b8', busNumber: 'Bus 8', capacity: 50, dist: 'Airport road', numberPlate: 'PB-01-AB-1008',
      status: 'On Route', occupied: 46, morningDep: '06:30 AM', morningArr: '08:30 AM', eveDep: '04:00 PM', eveArr: '05:30 PM (*approx*)'
    },
    {
      id: 'b9', busNumber: 'Bus 9', capacity: 40, dist: 'M& road', numberPlate: 'PB-01-AB-1009',
      status: 'On Route', occupied: 28, morningDep: '07:40 AM', morningArr: '09:50 AM', eveDep: '05:10 PM', eveArr: '06:40 PM (*approx*)'
    },
    {
      id: 'b10', busNumber: 'Bus 10', capacity: 30, dist: 'on spot', numberPlate: 'PB-01-AB-1010',
      status: 'Stationed', occupied: 0, morningDep: '08:00 AM', morningArr: '09:30 AM', eveDep: '05:00 PM', eveArr: '06:20 PM (*approx*)'
    },
  ]);

  // Selected Bus for Inspection
  const [selectedBusId, setSelectedBusId] = useState('b1');
  const activeBus = busFleet.find(b => b.id === selectedBusId) || busFleet[0] || null;

  // Fresh Bus Booking Requests
  const [bookingRequests, setBookingRequests] = useState([
    {
      id: 'req-101',
      requestor: 'Dr. Meera Nambiar',
      department: 'Biotechnology',
      date: '2026-09-01',
      day: 'Tuesday',
      purpose: 'Student Excursion to Life Sciences Lab',
      busType: 'Bus 1 (50 Seater)',
      status: 'Pending'
    },
    {
      id: 'req-102',
      requestor: 'Prof. Kabir Mehta',
      department: 'Mechanical Eng',
      date: '2026-09-03',
      day: 'Thursday',
      purpose: 'Industrial Robotics Workshop Visit',
      busType: 'Bus 5 (30 Seater)',
      status: 'Pending'
    },
    {
      id: 'req-103',
      requestor: 'Dr. Sunita Rao',
      department: 'Humanities & Arts',
      date: '2026-09-05',
      day: 'Saturday',
      purpose: 'National Museum Cultural Trip',
      busType: 'Bus 8 (50 Seater)',
      status: 'Pending'
    }
  ]);

  // Form state for adding new booking request
  const [showAddReqModal, setShowAddReqModal] = useState(false);
  const [newReqForm, setNewReqForm] = useState({
    requestor: '',
    department: '',
    date: '2026-09-06',
    day: 'Sunday',
    purpose: '',
    busType: 'Bus 1 (50 Seater)'
  });

  // Events requiring city bus allocation
  const [cityBusEvents, setCityBusEvents] = useState([
    { id: 'evt-1', title: 'Annual Inter-College Sports Fest', busCount: 4, date: '2026-08-29', location: 'Off-Campus Arena' },
    { id: 'evt-2', title: 'Computer Science Industrial Visit', busCount: 2, date: '2026-08-30', location: 'Tech Park (Airport Rd)' },
    { id: 'evt-3', title: 'National Science Symposium Transport', busCount: 3, date: '2026-09-02', location: 'Convention Center' }
  ]);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventBuses, setNewEventBuses] = useState(2);

  // Modals & UI States
  const [showAddBusModal, setShowAddBusModal] = useState(false);
  const [toastMsg, setToastMsg] = useState(null);

  // Add New Bus Form State (Bus Number, Capacity, Dist, Number Plate)
  const [newBusForm, setNewBusForm] = useState({
    busNumber: '',
    capacity: 30,
    dist: '',
    numberPlate: '',
    status: 'Stationed',
    morningDep: '07:30 AM',
    morningArr: '09:30 AM',
    eveDep: '04:30 PM',
    eveArr: '06:00 PM (*approx*)'
  });

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  // Delete Single Bus Card
  const handleDeleteBus = (e, busId, busNum) => {
    e.stopPropagation();
    setBusFleet(prev => prev.filter(b => b.id !== busId));
    if (selectedBusId === busId) {
      const remaining = busFleet.filter(b => b.id !== busId);
      setSelectedBusId(remaining.length > 0 ? remaining[0].id : null);
    }
    showToast(`Removed ${busNum} from fleet matrix.`);
  };

  // Clear All Buses
  const handleClearAllBuses = () => {
    setBusFleet([]);
    setSelectedBusId(null);
    showToast('Cleared all buses from fleet matrix.');
  };

  // Filtered Buses
  const filteredBuses = busFleet.filter(b => {
    const matchesStatus = filterStatus === 'ALL' || b.status.toUpperCase().replace(/\s+/g, '') === filterStatus.replace(/\s+/g, '');
    const matchesSearch = b.busNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          b.dist.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          b.numberPlate.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Handle Approve / Reject Booking Request
  const handleBookingAction = (reqId, action) => {
    setBookingRequests(prev => prev.map(r => r.id === reqId ? { ...r, status: action } : r));
    const req = bookingRequests.find(r => r.id === reqId);
    showToast(`Request by ${req?.requestor} set to ${action}!`);
  };

  // Delete Booking Request
  const handleDeleteBookingReq = (reqId, requestor) => {
    setBookingRequests(prev => prev.filter(r => r.id !== reqId));
    showToast(`Deleted request from ${requestor}`);
  };

  // Submit New Booking Request
  const handleAddBookingReqSubmit = (e) => {
    e.preventDefault();
    if (!newReqForm.requestor.trim()) return;

    const createdReq = {
      id: `req-${Date.now()}`,
      requestor: newReqForm.requestor.trim(),
      department: newReqForm.department.trim() || 'General Academic',
      date: newReqForm.date,
      day: newReqForm.day,
      purpose: newReqForm.purpose.trim() || 'Academic Transport Request',
      busType: newReqForm.busType,
      status: 'Pending'
    };

    setBookingRequests(prev => [createdReq, ...prev]);
    setShowAddReqModal(false);
    setNewReqForm({
      requestor: '',
      department: '',
      date: '2026-09-06',
      day: 'Sunday',
      purpose: '',
      busType: 'Bus 1 (50 Seater)'
    });
    showToast(`Added new booking request for ${createdReq.requestor}!`);
  };

  // Add New Bus Submit (with busNumber, capacity, dist, numberPlate)
  const handleAddBusSubmit = (e) => {
    e.preventDefault();
    if (!newBusForm.busNumber.trim() || !newBusForm.dist.trim()) {
      showToast('Please enter Bus Number and Distance Tag!');
      return;
    }

    const createdBus = {
      id: `b-${Date.now()}`,
      busNumber: newBusForm.busNumber.trim(),
      capacity: parseInt(newBusForm.capacity, 10) || 30,
      dist: newBusForm.dist.trim(),
      numberPlate: newBusForm.numberPlate.trim() || `PB-01-AB-${Math.floor(1000 + Math.random() * 9000)}`,
      status: newBusForm.status || 'Stationed',
      occupied: 0,
      morningDep: newBusForm.morningDep,
      morningArr: newBusForm.morningArr,
      eveDep: newBusForm.eveDep,
      eveArr: newBusForm.eveArr
    };

    setBusFleet(prev => [...prev, createdBus]);
    if (!selectedBusId) setSelectedBusId(createdBus.id);
    setShowAddBusModal(false);
    setNewBusForm({
      busNumber: '',
      capacity: 30,
      dist: '',
      numberPlate: '',
      status: 'Stationed',
      morningDep: '07:30 AM',
      morningArr: '09:30 AM',
      eveDep: '04:30 PM',
      eveArr: '06:00 PM (*approx*)'
    });
    showToast(`Registered ${createdBus.busNumber} (${createdBus.numberPlate}) into Fleet Matrix!`);
  };

  // Add City Event Requirement
  const handleAddCityBusEvent = (e) => {
    e.preventDefault();
    if (!newEventTitle.trim()) return;

    const newEvt = {
      id: `evt-${Date.now()}`,
      title: newEventTitle.trim(),
      busCount: parseInt(newEventBuses, 10) || 1,
      date: '2026-09-01',
      location: 'Campus Event Venue'
    };

    setCityBusEvents(prev => [...prev, newEvt]);
    setNewEventTitle('');
    setNewEventBuses(2);
    showToast(`Added City Bus Event Requirement!`);
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-500 font-sans pb-10 relative">
      
      {/* Live Orbit Telemetry Ticker Marquee */}
      <LiveCampusTicker />

      {/* Background Animated Vector Ambient Glow Spheres */}
      <div className="absolute -top-10 right-10 w-96 h-96 bg-teal-500/10 rounded-full blur-[120px] pointer-events-none sphere-glow" />
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none sphere-glow" style={{ animationDelay: '2s' }} />

      {/* Toast Alert Banner */}
      {toastMsg && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-4 py-2.5 rounded-2xl shadow-2xl border dark:border-teal-500/40 border-slate-800 text-xs font-black flex items-center gap-2 animate-in zoom-in-95 duration-200">
          <CheckCircle2 className="w-4 h-4 text-teal-400 dark:text-teal-600" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* ================= HEADER BANNER WITH ANIMATED BUS & SHIMMER ================= */}
      <div className="p-6 rounded-3xl bg-slate-950 text-white border border-teal-500/30 shadow-2xl relative overflow-hidden group shimmer-effect glow-teal-pulse">
        
        {/* Background Campus Bus Collage Image with 40% Visibility */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-40 pointer-events-none rounded-3xl transition-transform duration-700 group-hover:scale-105"
          style={{ backgroundImage: `url('/campus_bus_collage.png')` }}
        />

        {/* Ambient Vibrant Glass Gradient Layer */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-900/85 to-teal-950/80 pointer-events-none rounded-3xl" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 text-[10px] font-mono font-extrabold uppercase tracking-wider bg-teal-500/20 text-teal-300 border border-teal-500/40 rounded-full flex items-center gap-1.5 shadow-sm">
                <Bus className="w-3.5 h-3.5 text-teal-400 animate-bus-drive" />
                TRANSIT COMMAND
              </span>
              <span className="text-xs text-teal-200/80 font-bold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
                Live Fleet Manager
              </span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white drop-shadow-sm flex items-center gap-2">
              Transport Manager Interface
              <Sparkles className="w-5 h-5 text-teal-400 animate-pulse" />
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl font-medium leading-relaxed">
              Real-time bus occupancy, arrival/departure schedules, faculty booking approvals & city bus requirements.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            {busFleet.length > 0 && (
              <button
                onClick={handleClearAllBuses}
                className="px-3.5 py-2 bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-800 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-sm hover:scale-105 active:scale-95"
                title="Remove all buses"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove All</span>
              </button>
            )}

            <button
              onClick={() => setShowAddBusModal(true)}
              className="px-4 py-2.5 bg-teal-600 hover:bg-teal-500 text-white text-xs font-black rounded-xl transition-all shadow-lg shadow-teal-950/50 flex items-center gap-1.5 cursor-pointer border border-teal-400/30 hover:scale-105 active:scale-95"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Add New Bus</span>
            </button>
          </div>
        </div>
      </div>

      {/* ================= TOP SECTION: 10 BUS FLEET STATUS MATRIX ================= */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-black dark:text-white text-black tracking-tight flex items-center gap-2">
            <Bus className="w-4 h-4 text-teal-600 dark:text-teal-400 animate-pulse" />
            Active Bus Fleet Matrix ({busFleet.length} Buses)
          </h2>

          {/* Filter Status Pills */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-900/90 p-1 rounded-xl border dark:border-slate-800 border-slate-200 text-[11px] font-bold shadow-inner">
            {['ALL', 'ON ROUTE', 'STATIONED', 'MAINTENANCE'].map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  filterStatus === st
                    ? 'bg-teal-600 text-white shadow-md scale-105 font-black'
                    : 'text-slate-600 dark:text-slate-400 hover:text-black dark:hover:text-white'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Fleet Grid or Empty State */}
        {filteredBuses.length === 0 ? (
          <div className="p-8 text-center rounded-3xl border border-dashed dark:border-slate-800 border-slate-300 dark:bg-slate-900/50 bg-slate-50 space-y-3 animate-in fade-in">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-950/50 text-teal-600 dark:text-teal-400 flex items-center justify-center mx-auto border border-teal-500/20">
              <Bus className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-black dark:text-white text-black">No buses in fleet matrix</h3>
              <p className="text-xs dark:text-slate-400 text-slate-500 font-medium mt-0.5">
                Click "+ Add New Bus" to register a bus with Bus Number, Capacity, Dist, and Number Plate.
              </p>
            </div>
            <button
              onClick={() => setShowAddBusModal(true)}
              className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold rounded-xl shadow-md inline-flex items-center gap-1.5 cursor-pointer hover:scale-105"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Bus</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {filteredBuses.map((bus) => {
              const isSelected = bus.id === selectedBusId;
              const occPct = Math.round((bus.occupied / bus.capacity) * 100);

              return (
                <div
                  key={bus.id}
                  onClick={() => setSelectedBusId(bus.id)}
                  className={`p-3.5 rounded-2xl border transition-all duration-300 cursor-pointer space-y-2 relative overflow-hidden group shimmer-effect ${
                    isSelected
                      ? 'bg-teal-50/90 dark:bg-teal-950/60 border-teal-500 dark:border-teal-400 shadow-lg ring-2 ring-teal-500/30 -translate-y-1 scale-[1.02]'
                      : 'bg-white dark:bg-slate-900/90 border-slate-200 dark:border-slate-800/80 hover:border-teal-500/60 hover:-translate-y-1 hover:shadow-md'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-black dark:text-white text-black leading-none truncate group-hover:text-teal-400 transition-colors">
                      {bus.busNumber}
                    </h3>
                    
                    <div className="flex items-center space-x-1">
                      <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                        bus.status === 'On Route' ? 'bg-emerald-400 animate-pulse shadow-sm shadow-emerald-400' : bus.status === 'Maintenance' ? 'bg-rose-500' : 'bg-teal-400'
                      }`} />
                      
                      <button
                        onClick={(e) => handleDeleteBus(e, bus.id, bus.busNumber)}
                        className="p-1 rounded-md opacity-0 group-hover:opacity-100 hover:bg-rose-100 dark:hover:bg-rose-950 text-rose-600 dark:text-rose-400 transition-all cursor-pointer ml-1 hover:scale-110"
                        title="Remove bus"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {/* Bus Specs: Capacity, Dist, Number Plate */}
                  <div className="space-y-1 text-[11px] font-bold dark:text-slate-300 text-black">
                    <div className="flex justify-between items-center">
                      <span className="dark:text-slate-400 text-black font-medium">Capacity:</span>
                      <span className="font-extrabold">{bus.capacity}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="dark:text-slate-400 text-black font-medium">Dist:</span>
                      <span className="font-extrabold text-teal-600 dark:text-teal-400 uppercase truncate max-w-[90px]">{bus.dist}</span>
                    </div>

                    <div className="flex justify-between items-center pt-0.5 border-t border-slate-100 dark:border-slate-800 text-[10px]">
                      <span className="dark:text-slate-400 text-slate-500 font-medium">Plate:</span>
                      <span className="font-mono font-extrabold text-slate-800 dark:text-slate-200">{bus.numberPlate || 'N/A'}</span>
                    </div>
                  </div>

                  {/* Progress Bar inside box */}
                  <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${occPct > 85 ? 'bg-rose-500' : 'bg-teal-400'}`}
                      style={{ width: `${occPct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ================= BOTTOM SECTION: TWO-COLUMN DASHBOARD LAYOUT ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">

        {/* LEFT COLUMN: Check Arrival and Departure Time of Bus */}
        <div className="lg:col-span-6 p-5 rounded-3xl border dark:border-slate-800 border-slate-200 dark:bg-slate-900/90 bg-white shadow-sm space-y-4">
          
          <div className="border-b pb-3 dark:border-slate-800 border-slate-200">
            <h3 className="text-sm font-black dark:text-white text-black tracking-tight flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-teal-400 animate-spin" style={{ animationDuration: '10s' }} />
              To check arrival and departure time of bus
            </h3>
            <p className="text-xs dark:text-slate-400 text-black font-medium mt-0.5">
              Select a bus to inspect morning and evening shift schedules
            </p>
          </div>

          {/* Search Dropdown / Bus Picker */}
          {busFleet.length > 0 && activeBus ? (
            <>
              <div className="relative">
                <select
                  value={selectedBusId || ''}
                  onChange={(e) => setSelectedBusId(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl text-xs font-black text-black dark:text-white focus:outline-none focus:border-teal-500 transition-colors shadow-inner"
                >
                  {busFleet.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.busNumber} (Plate: {b.numberPlate} — Dist: {b.dist})
                    </option>
                  ))}
                </select>
              </div>

              {/* Schedule Details Box */}
              <div className="space-y-3 pt-1">
                <h4 className="text-xs font-black dark:text-white text-black tracking-tight flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                  Schedule details for <span className="text-teal-600 dark:text-teal-400 font-extrabold">{activeBus.busNumber}</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                  
                  {/* Morning Departure */}
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 space-y-1 hover:border-teal-500/40 transition-colors">
                    <label className="block font-black dark:text-slate-400 text-slate-600 uppercase text-[10px] tracking-wider">
                      Morning departure
                    </label>
                    <div className="font-black text-sm dark:text-white text-black">
                      {activeBus.morningDep}
                    </div>
                  </div>

                  {/* Morning Arrival */}
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 space-y-1 hover:border-teal-500/40 transition-colors">
                    <label className="block font-black dark:text-slate-400 text-slate-600 uppercase text-[10px] tracking-wider">
                      Morning Arrival
                    </label>
                    <div className="font-black text-sm dark:text-white text-black">
                      {activeBus.morningArr}
                    </div>
                  </div>

                  {/* Evening Departure */}
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 space-y-1 hover:border-teal-500/40 transition-colors">
                    <label className="block font-black dark:text-slate-400 text-slate-600 uppercase text-[10px] tracking-wider">
                      Evening Departure
                    </label>
                    <div className="font-black text-sm dark:text-white text-black">
                      {activeBus.eveDep}
                    </div>
                  </div>

                  {/* Evening Arrival */}
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 space-y-1 hover:border-teal-500/40 transition-colors">
                    <label className="block font-black dark:text-slate-400 text-slate-600 uppercase text-[10px] tracking-wider">
                      Evening Arrival
                    </label>
                    <div className="font-black text-sm dark:text-white text-black">
                      {activeBus.eveArr}
                    </div>
                  </div>

                </div>
              </div>
            </>
          ) : (
            <div className="py-6 text-center text-xs dark:text-slate-400 text-slate-500 font-medium">
              No bus selected. Register a bus to inspect timetable.
            </div>
          )}

        </div>

        {/* RIGHT COLUMN: Bus Booking Req & Events that would req *city bus* */}
        <div className="lg:col-span-6 space-y-5">

          {/* CARD 1: BUS BOOKING REQUESTS */}
          <div className="p-5 rounded-3xl border dark:border-slate-800 border-slate-200 dark:bg-slate-900/90 bg-white shadow-sm space-y-3">
            
            <div className="flex items-center justify-between pb-2 border-b dark:border-slate-800 border-slate-200">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-black dark:text-white text-black tracking-tight">
                  Bus Booking Req
                </h3>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800 animate-pulse">
                  {bookingRequests.filter(r => r.status === 'Pending').length} Pending
                </span>
              </div>

              <button
                onClick={() => setShowAddReqModal(true)}
                className="px-2.5 py-1 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 shadow-sm hover:scale-105 active:scale-95"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Req</span>
              </button>
            </div>

            {/* List of Requests */}
            {bookingRequests.length === 0 ? (
              <p className="text-xs text-slate-500 py-3 text-center">No pending bus booking requests.</p>
            ) : (
              <div className="space-y-2">
                {bookingRequests.map((req) => (
                  <div
                    key={req.id}
                    className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2 group hover:border-teal-500/40 transition-all"
                  >
                    <div className="space-y-0.5 text-xs font-bold text-black dark:text-white truncate">
                      <p className="font-black text-xs text-black dark:text-white truncate">{req.requestor} ({req.department})</p>
                      <p className="dark:text-slate-400 text-black text-[11px] truncate">
                        date: <span className="font-extrabold">{req.date}</span> &bull; day: <span className="font-extrabold">{req.day}</span>
                      </p>
                      <p className="text-[10px] text-teal-600 dark:text-teal-400 font-semibold truncate">
                        {req.purpose} &bull; <span className="font-mono">{req.busType}</span>
                      </p>
                      {req.status !== 'Pending' && (
                        <span className={`inline-block mt-0.5 text-[9px] font-black uppercase px-2 py-0.5 rounded-md ${
                          req.status === 'Approved' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                        }`}>
                          {req.status}
                        </span>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center space-x-1 shrink-0">
                      {req.status === 'Pending' ? (
                        <>
                          <button
                            onClick={() => handleBookingAction(req.id, 'Approved')}
                            className="p-1.5 rounded-lg bg-teal-600 text-white hover:bg-teal-500 transition-all cursor-pointer shadow-sm hover:scale-110 active:scale-95"
                            title="Approve request"
                          >
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </button>
                          <button
                            onClick={() => handleBookingAction(req.id, 'Rejected')}
                            className="p-1.5 rounded-lg bg-rose-600 text-white hover:bg-rose-500 transition-all cursor-pointer shadow-sm hover:scale-110 active:scale-95"
                            title="Reject request"
                          >
                            <X className="w-3.5 h-3.5 stroke-[3]" />
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => handleBookingAction(req.id, 'Pending')}
                          className="p-1.5 rounded-lg bg-slate-200 dark:bg-slate-800 text-[10px] font-bold text-slate-700 dark:text-slate-300 cursor-pointer"
                        >
                          Reset
                        </button>
                      )}

                      <button
                        onClick={() => handleDeleteBookingReq(req.id, req.requestor)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-all cursor-pointer hover:scale-110"
                        title="Delete request"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>

          {/* CARD 2: EVENTS THAT WOULD REQ *CITY BUS* */}
          <div className="p-5 rounded-3xl border dark:border-slate-800 border-slate-200 dark:bg-slate-900/90 bg-white shadow-sm space-y-3">
            
            <div className="border-b pb-2 dark:border-slate-800 border-slate-200">
              <h3 className="text-sm font-black dark:text-white text-black tracking-tight">
                Events that would req *city bus*
              </h3>
            </div>

            {/* List of City Bus Events */}
            <div className="space-y-2 text-xs">
              {cityBusEvents.map((evt) => (
                <div
                  key={evt.id}
                  className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2 font-bold hover:border-teal-500/40 transition-colors"
                >
                  <div className="truncate">
                    <span className="block text-black dark:text-white truncate text-xs font-black">{evt.title}</span>
                    <span className="text-[10px] text-teal-600 dark:text-teal-400 font-extrabold uppercase">{evt.date}</span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-lg bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800 text-[10px] font-black shrink-0">
                    {evt.busCount} City Buses
                  </span>
                </div>
              ))}
            </div>

            {/* Add New Event Input Form */}
            <form onSubmit={handleAddCityBusEvent} className="pt-1 flex items-center gap-2">
              <input
                type="text"
                placeholder="Enter event name requiring city bus..."
                value={newEventTitle}
                onChange={(e) => setNewEventTitle(e.target.value)}
                className="flex-1 px-3 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl text-xs font-bold text-black dark:text-white focus:outline-none focus:border-teal-500 transition-colors"
              />
              <button
                type="submit"
                className="px-3.5 py-1.5 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 shadow-sm hover:scale-105"
              >
                Add Event
              </button>
            </form>

          </div>

        </div>

      </div>

      {/* ================= TRANSPORT ADMIN TICKETS & SUPPORT LOG ================= */}
      <TicketsSupportLogCard 
        adminDomain="transport" 
        title="Transport Admin Tickets & Support Log" 
        subtitle="Track bus maintenance, driver telemetry, shuttle GPS & transit logistics tickets" 
      />

      {/* ================= ADD NEW BOOKING REQ MODAL ================= */}
      {showAddReqModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border dark:border-slate-800 border-slate-200 w-full max-w-md rounded-3xl p-5 shadow-2xl space-y-4 relative animate-in zoom-in-95">
            
            <div className="flex items-center justify-between pb-2 border-b dark:border-slate-800 border-slate-200">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-teal-50 dark:bg-teal-950/50 border border-teal-200 dark:border-teal-800 rounded-xl text-teal-600 dark:text-teal-400">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black dark:text-white text-black">
                    Add Bus Booking Request
                  </h3>
                  <p className="text-[11px] dark:text-slate-400 text-black font-medium">
                    Submit faculty or department transport booking
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAddReqModal(false)}
                className="p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddBookingReqSubmit} className="space-y-3 text-xs">
              
              {/* Requestor Name */}
              <div className="space-y-1">
                <label className="block font-bold dark:text-slate-300 text-black">
                  Requestor Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Meera Nambiar"
                  value={newReqForm.requestor}
                  onChange={(e) => setNewReqForm({ ...newReqForm, requestor: e.target.value })}
                  className="w-full px-3 py-2 dark:bg-slate-950 bg-slate-50 border dark:border-slate-800 border-slate-300 rounded-xl text-xs dark:text-white text-black font-semibold focus:outline-none focus:border-teal-500"
                />
              </div>

              {/* Department */}
              <div className="space-y-1">
                <label className="block font-bold dark:text-slate-300 text-black">
                  Department
                </label>
                <input
                  type="text"
                  placeholder="e.g. Biotechnology"
                  value={newReqForm.department}
                  onChange={(e) => setNewReqForm({ ...newReqForm, department: e.target.value })}
                  className="w-full px-3 py-2 dark:bg-slate-950 bg-slate-50 border dark:border-slate-800 border-slate-300 rounded-xl text-xs dark:text-white text-black font-semibold focus:outline-none focus:border-teal-500"
                />
              </div>

              {/* Date & Day */}
              <div className="grid grid-cols-2 gap-2.5">
                <div className="space-y-1">
                  <label className="block font-bold dark:text-slate-300 text-black">Date</label>
                  <input
                    type="date"
                    value={newReqForm.date}
                    onChange={(e) => setNewReqForm({ ...newReqForm, date: e.target.value })}
                    className="w-full px-3 py-2 dark:bg-slate-950 bg-slate-50 border dark:border-slate-800 border-slate-300 rounded-xl text-xs dark:text-white text-black font-semibold focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block font-bold dark:text-slate-300 text-black">Day</label>
                  <input
                    type="text"
                    placeholder="e.g. Tuesday"
                    value={newReqForm.day}
                    onChange={(e) => setNewReqForm({ ...newReqForm, day: e.target.value })}
                    className="w-full px-3 py-2 dark:bg-slate-950 bg-slate-50 border dark:border-slate-800 border-slate-300 rounded-xl text-xs dark:text-white text-black font-semibold focus:outline-none"
                  />
                </div>
              </div>

              {/* Purpose */}
              <div className="space-y-1">
                <label className="block font-bold dark:text-slate-300 text-black">Purpose</label>
                <input
                  type="text"
                  placeholder="e.g. Field Excursion Visit"
                  value={newReqForm.purpose}
                  onChange={(e) => setNewReqForm({ ...newReqForm, purpose: e.target.value })}
                  className="w-full px-3 py-2 dark:bg-slate-950 bg-slate-50 border dark:border-slate-800 border-slate-300 rounded-xl text-xs dark:text-white text-black font-semibold focus:outline-none focus:border-teal-500"
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t dark:border-slate-800 border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowAddReqModal(false)}
                  className="px-3.5 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-teal-600 hover:bg-teal-500 text-white rounded-xl font-bold transition-colors cursor-pointer shadow-md"
                >
                  Submit Request
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ================= ADD NEW BUS MODAL DIALOG (bus number, capacity, dist, number plate) ================= */}
      {showAddBusModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border dark:border-slate-800 border-slate-200 w-full max-w-md rounded-3xl p-5 shadow-2xl space-y-4 relative animate-in zoom-in-95">
            
            <div className="flex items-center justify-between pb-2 border-b dark:border-slate-800 border-slate-200">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-teal-50 dark:bg-teal-950/50 border border-teal-200 dark:border-teal-800 rounded-xl text-teal-600 dark:text-teal-400">
                  <Bus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black dark:text-white text-black">
                    Add New Bus
                  </h3>
                  <p className="text-[11px] dark:text-slate-400 text-black font-medium">
                    Register bus number, capacity, dist, and number plate
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAddBusModal(false)}
                className="p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddBusSubmit} className="space-y-3 text-xs">
              
              {/* Bus Number */}
              <div className="space-y-1">
                <label className="block font-bold dark:text-slate-300 text-black">
                  Bus Number <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bus 1, Bus 11"
                  value={newBusForm.busNumber}
                  onChange={(e) => setNewBusForm({ ...newBusForm, busNumber: e.target.value })}
                  className="w-full px-3 py-2 dark:bg-slate-950 bg-slate-50 border dark:border-slate-800 border-slate-300 rounded-xl text-xs dark:text-white text-black font-semibold focus:outline-none focus:border-teal-500"
                />
              </div>

              {/* Seating Capacity */}
              <div className="space-y-1">
                <label className="block font-bold dark:text-slate-300 text-black">
                  Capacity <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  min="5"
                  max="100"
                  placeholder="e.g. 50"
                  value={newBusForm.capacity}
                  onChange={(e) => setNewBusForm({ ...newBusForm, capacity: e.target.value })}
                  className="w-full px-3 py-2 dark:bg-slate-950 bg-slate-50 border dark:border-slate-800 border-slate-300 rounded-xl text-xs dark:text-white text-black font-semibold focus:outline-none focus:border-teal-500"
                />
              </div>

              {/* Distance / Route Tag */}
              <div className="space-y-1">
                <label className="block font-bold dark:text-slate-300 text-black">
                  Dist (Route / Distance) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ptk, itemi, Airport road"
                  value={newBusForm.dist}
                  onChange={(e) => setNewBusForm({ ...newBusForm, dist: e.target.value })}
                  className="w-full px-3 py-2 dark:bg-slate-950 bg-slate-50 border dark:border-slate-800 border-slate-300 rounded-xl text-xs dark:text-white text-black font-semibold focus:outline-none focus:border-teal-500"
                />
              </div>

              {/* Number Plate */}
              <div className="space-y-1">
                <label className="block font-bold dark:text-slate-300 text-black">
                  Number Plate <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. PB-01-AB-1234"
                  value={newBusForm.numberPlate}
                  onChange={(e) => setNewBusForm({ ...newBusForm, numberPlate: e.target.value })}
                  className="w-full px-3 py-2 dark:bg-slate-950 bg-slate-50 border dark:border-slate-800 border-slate-300 rounded-xl text-xs dark:text-white text-black font-semibold focus:outline-none focus:border-teal-500"
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t dark:border-slate-800 border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowAddBusModal(false)}
                  className="px-3.5 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-teal-600 hover:bg-teal-500 text-white rounded-xl font-bold transition-colors cursor-pointer shadow-md"
                >
                  Create Bus
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
