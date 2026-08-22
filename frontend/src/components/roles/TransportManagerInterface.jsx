import React, { useState } from 'react';
import TicketsSupportLogCard from '../TicketsSupportLogCard';
import LiveCampusTicker from '../LiveCampusTicker';
import {
  Bus, Search, Plus, Check, X, Clock, MapPin, Users, Calendar,
  Edit2, AlertCircle, ShieldAlert, Sparkles, CheckCircle2, Navigation,
  Radio, ArrowRight, Zap, RefreshCw, Trash2, CreditCard
} from 'lucide-react';

export default function TransportManagerInterface() {
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

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

  const [selectedBusId, setSelectedBusId] = useState('b1');
  const activeBus = busFleet.find(b => b.id === selectedBusId) || busFleet[0] || null;

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

  const [showAddReqModal, setShowAddReqModal] = useState(false);
  const [newReqForm, setNewReqForm] = useState({
    requestor: '',
    department: '',
    date: '2026-09-06',
    day: 'Sunday',
    purpose: '',
    busType: 'Bus 1 (50 Seater)'
  });

  const [cityBusEvents, setCityBusEvents] = useState([
    { id: 'evt-1', title: 'Annual Inter-College Sports Fest', busCount: 4, date: '2026-08-29', location: 'Off-Campus Arena' },
    { id: 'evt-2', title: 'Computer Science Industrial Visit', busCount: 2, date: '2026-08-30', location: 'Tech Park (Airport Rd)' },
    { id: 'evt-3', title: 'National Science Symposium Transport', busCount: 3, date: '2026-09-02', location: 'Convention Center' }
  ]);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventBuses, setNewEventBuses] = useState(2);

  const [showAddBusModal, setShowAddBusModal] = useState(false);
  const [toastMsg, setToastMsg] = useState(null);

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

  const handleDeleteBus = (e, busId, busNum) => {
    e.stopPropagation();
    setBusFleet(prev => prev.filter(b => b.id !== busId));
    if (selectedBusId === busId) {
      const remaining = busFleet.filter(b => b.id !== busId);
      setSelectedBusId(remaining.length > 0 ? remaining[0].id : null);
    }
    showToast(`Removed ${busNum} from fleet matrix.`);
  };

  const handleClearAllBuses = () => {
    setBusFleet([]);
    setSelectedBusId(null);
    showToast('Cleared all buses from fleet matrix.');
  };

  const filteredBuses = busFleet.filter(b => {
    const matchesStatus = filterStatus === 'ALL' || b.status.toUpperCase().replace(/\s+/g, '') === filterStatus.replace(/\s+/g, '');
    const matchesSearch = b.busNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          b.dist.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          b.numberPlate.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleBookingAction = (reqId, action) => {
    setBookingRequests(prev => prev.map(r => r.id === reqId ? { ...r, status: action } : r));
    const req = bookingRequests.find(r => r.id === reqId);
    showToast(`Request by ${req?.requestor} set to ${action}!`);
  };

  const handleDeleteBookingReq = (reqId, requestor) => {
    setBookingRequests(prev => prev.filter(r => r.id !== reqId));
    showToast(`Deleted request from ${requestor}`);
  };

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
    <div className="space-y-6 font-sans pb-10 relative">
      
      {/* Live Campus Orbit Telemetry Ticker */}
      <LiveCampusTicker />

      {/* Toast Banner */}
      {toastMsg && (
        <div className="fixed top-20 right-6 z-50 bg-[#1C1917] text-[#FAF8F3] px-4 py-2.5 rounded-md shadow-md border border-[#292524] text-xs font-mono font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-white" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* HEADER BANNER */}
      <div className="p-6 rounded-lg bg-[#1C1917] text-[#FAF8F3] border border-[#292524] shadow-md relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="badge-mono-dark text-[10px]">
                <Bus className="w-3.5 h-3.5 text-white" />
                TRANSIT COMMAND
              </span>
              <span className="text-xs text-[#D6CEBE] font-bold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-white animate-ping inline-block" />
                Live Fleet Manager
              </span>
            </div>
            
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              Transport Manager Interface
              <Sparkles className="w-5 h-5 text-white" />
            </h1>
            <p className="text-xs text-[#D6CEBE] max-w-2xl font-medium leading-relaxed">
              Real-time bus occupancy, arrival/departure schedules, faculty booking approvals & city bus requirements.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            {busFleet.length > 0 && (
              <button
                onClick={handleClearAllBuses}
                className="btn-secondary text-xs"
                title="Remove all buses"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove All</span>
              </button>
            )}

            <button
              onClick={() => setShowAddBusModal(true)}
              className="btn-primary text-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Bus</span>
            </button>
          </div>
        </div>
      </div>

      {/* ACTIVE BUS FLEET MATRIX */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-[#1C1917] tracking-tight flex items-center gap-2">
            <Bus className="w-4 h-4 text-[#1C1917]" />
            Active Bus Fleet Matrix ({busFleet.length} Buses)
          </h2>

          <div className="flex items-center space-x-1">
            {['ALL', 'ON ROUTE', 'STATIONED', 'MAINTENANCE'].map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all cursor-pointer ${
                  filterStatus === st
                    ? 'bg-[#1C1917] text-white'
                    : 'text-[#57534E] hover:text-[#1C1917]'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Fleet Grid */}
        {filteredBuses.length === 0 ? (
          <div className="p-8 text-center rounded-lg border border-[#E6E0D2] bg-[#FAF8F3] space-y-2">
            <p className="text-xs font-bold text-[#1C1917]">No buses in fleet matrix matching filter.</p>
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
                  className={`p-3.5 rounded-lg border transition-all cursor-pointer space-y-2 relative shadow-2xs ${
                    isSelected
                      ? 'bg-[#F0EBE1] border-[#1C1917]'
                      : 'bg-[#FAF8F3] border-[#E6E0D2] hover:border-[#1C1917]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-[#1C1917] truncate">
                      {bus.busNumber}
                    </h3>
                    
                    <div className="flex items-center space-x-1">
                      <span className="badge-mono text-[9px] uppercase font-bold">
                        {bus.status}
                      </span>
                      <button
                        onClick={(e) => handleDeleteBus(e, bus.id, bus.busNumber)}
                        className="p-1 rounded text-[#78716C] hover:text-black transition-all cursor-pointer ml-1"
                        title="Remove bus"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1 text-[11px] font-bold text-[#1C1917]">
                    <div className="flex justify-between items-center">
                      <span className="text-[#57534E] font-medium">Capacity:</span>
                      <span className="font-bold">{bus.capacity}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-[#57534E] font-medium">Dist:</span>
                      <span className="font-bold uppercase truncate max-w-[90px]">{bus.dist}</span>
                    </div>

                    <div className="flex justify-between items-center pt-0.5 border-t border-[#E6E0D2] text-[10px]">
                      <span className="text-[#57534E] font-medium">Plate:</span>
                      <span className="font-mono font-bold text-[#1C1917]">{bus.numberPlate || 'N/A'}</span>
                    </div>
                  </div>

                  <div className="w-full bg-[#E6E0D2] h-1.5 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[#1C1917] transition-all duration-500"
                      style={{ width: `${occPct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* TWO-COLUMN DASHBOARD LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">

        {/* LEFT COLUMN: Arrival/Departure Schedules */}
        <div className="lg:col-span-6 card-surface p-5 space-y-4 shadow-2xs">
          
          <div className="border-b pb-3 border-[#E6E0D2]">
            <h3 className="text-sm font-bold text-[#1C1917] tracking-tight flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-[#1C1917]" />
              Arrival and Departure Time Schedules
            </h3>
            <p className="text-xs text-[#57534E] font-medium mt-0.5">
              Select a bus to inspect morning and evening shift schedules
            </p>
          </div>

          {busFleet.length > 0 && activeBus ? (
            <>
              <div className="relative">
                <select
                  value={selectedBusId || ''}
                  onChange={(e) => setSelectedBusId(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#E6E0D2] rounded-md text-xs font-bold text-[#1C1917] focus:outline-none focus:border-[#1C1917]"
                >
                  {busFleet.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.busNumber} (Plate: {b.numberPlate} — Dist: {b.dist})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-3 pt-1">
                <h4 className="text-xs font-bold text-[#1C1917] tracking-tight flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-[#1C1917]" />
                  Schedule details for <span className="text-[#1C1917] font-bold">{activeBus.busNumber}</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                  <div className="p-3.5 rounded-lg bg-[#FAF8F3] border border-[#E6E0D2] space-y-1">
                    <label className="block font-bold text-[#57534E] uppercase text-[10px]">
                      Morning departure
                    </label>
                    <div className="font-bold text-sm text-[#1C1917]">
                      {activeBus.morningDep}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-lg bg-[#FAF8F3] border border-[#E6E0D2] space-y-1">
                    <label className="block font-bold text-[#57534E] uppercase text-[10px]">
                      Morning Arrival
                    </label>
                    <div className="font-bold text-sm text-[#1C1917]">
                      {activeBus.morningArr}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-lg bg-[#FAF8F3] border border-[#E6E0D2] space-y-1">
                    <label className="block font-bold text-[#57534E] uppercase text-[10px]">
                      Evening Departure
                    </label>
                    <div className="font-bold text-sm text-[#1C1917]">
                      {activeBus.eveDep}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-lg bg-[#FAF8F3] border border-[#E6E0D2] space-y-1">
                    <label className="block font-bold text-[#57534E] uppercase text-[10px]">
                      Evening Arrival
                    </label>
                    <div className="font-bold text-sm text-[#1C1917]">
                      {activeBus.eveArr}
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="py-6 text-center text-xs text-[#57534E] font-medium">
              No bus selected. Register a bus to inspect timetable.
            </div>
          )}

        </div>

        {/* RIGHT COLUMN: Bus Booking Req & Events */}
        <div className="lg:col-span-6 space-y-5">

          {/* CARD 1: BUS BOOKING REQUESTS */}
          <div className="card-surface p-5 shadow-2xs space-y-3">
            
            <div className="flex items-center justify-between pb-2 border-b border-[#E6E0D2]">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-[#1C1917] tracking-tight">
                  Bus Booking Requests
                </h3>
                <span className="badge-mono-dark text-[10px]">
                  {bookingRequests.filter(r => r.status === 'Pending').length} Pending
                </span>
              </div>

              <button
                onClick={() => setShowAddReqModal(true)}
                className="btn-primary text-xs py-1 px-2.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Req</span>
              </button>
            </div>

            {/* List of Requests */}
            {bookingRequests.length === 0 ? (
              <p className="text-xs text-[#57534E] py-3 text-center">No pending bus booking requests.</p>
            ) : (
              <div className="space-y-2">
                {bookingRequests.map((req) => (
                  <div
                    key={req.id}
                    className="p-3 rounded-lg bg-[#FAF8F3] border border-[#E6E0D2] flex items-center justify-between gap-2 shadow-2xs"
                  >
                    <div className="space-y-0.5 text-xs font-bold text-[#1C1917] truncate">
                      <p className="font-bold text-xs text-[#1C1917] truncate">{req.requestor} ({req.department})</p>
                      <p className="text-[#57534E] text-[11px] truncate">
                        date: <span className="font-bold text-[#1C1917]">{req.date}</span> &bull; day: <span className="font-bold text-[#1C1917]">{req.day}</span>
                      </p>
                      <p className="text-[10px] text-[#57534E] font-semibold truncate">
                        {req.purpose} &bull; <span className="font-mono text-[#1C1917]">{req.busType}</span>
                      </p>
                    </div>

                    <div className="flex items-center space-x-1 shrink-0">
                      {req.status === 'Pending' ? (
                        <>
                          <button
                            onClick={() => handleBookingAction(req.id, 'Approved')}
                            className="btn-primary text-xs py-1 px-2"
                            title="Approve request"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleBookingAction(req.id, 'Rejected')}
                            className="btn-secondary text-xs py-1 px-2 text-[#1C1917]"
                            title="Reject request"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => handleBookingAction(req.id, 'Pending')}
                          className="btn-secondary text-[10px] py-0.5 px-2"
                        >
                          Reset
                        </button>
                      )}

                      <button
                        onClick={() => handleDeleteBookingReq(req.id, req.requestor)}
                        className="p-1 text-[#78716C] hover:text-[#1C1917]"
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

          {/* CARD 2: EVENTS THAT REQUIRE CITY BUS */}
          <div className="card-surface p-5 shadow-2xs space-y-3">
            
            <div className="border-b pb-2 border-[#E6E0D2]">
              <h3 className="text-sm font-bold text-[#1C1917] tracking-tight">
                Events Requiring City Bus Allocation
              </h3>
            </div>

            <div className="space-y-2 text-xs">
              {cityBusEvents.map((evt) => (
                <div
                  key={evt.id}
                  className="p-3 rounded-lg bg-[#FAF8F3] border border-[#E6E0D2] flex items-center justify-between gap-2 font-bold shadow-2xs"
                >
                  <div className="truncate">
                    <span className="block text-[#1C1917] truncate text-xs font-bold">{evt.title}</span>
                    <span className="text-[10px] text-[#57534E] font-mono">{evt.date}</span>
                  </div>
                  <span className="badge-mono text-[10px] font-bold shrink-0">
                    {evt.busCount} City Buses
                  </span>
                </div>
              ))}
            </div>

            <form onSubmit={handleAddCityBusEvent} className="pt-1 flex items-center gap-2">
              <input
                type="text"
                placeholder="Enter event name requiring city bus..."
                value={newEventTitle}
                onChange={(e) => setNewEventTitle(e.target.value)}
                className="flex-1 px-3 py-1.5 bg-white border border-[#E6E0D2] rounded-md text-xs font-bold text-[#1C1917] focus:outline-none focus:border-[#1C1917]"
              />
              <button
                type="submit"
                className="btn-primary text-xs py-1.5 px-3"
              >
                Add Event
              </button>
            </form>

          </div>

        </div>

      </div>

      {/* TRANSPORT ADMIN TICKETS & SUPPORT LOG */}
      <TicketsSupportLogCard 
        adminDomain="transport" 
        title="Transport Admin Tickets & Support Log" 
        subtitle="Track bus maintenance, driver telemetry, shuttle GPS & transit logistics tickets" 
      />

      {/* ADD NEW BUS MODAL */}
      {showAddBusModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-[#FAF8F3] border border-[#E6E0D2] w-full max-w-md rounded-lg p-5 shadow-xl space-y-4 relative">
            <div className="flex items-center justify-between pb-2 border-b border-[#E6E0D2]">
              <div className="flex items-center gap-2">
                <Bus className="w-4 h-4 text-[#1C1917]" />
                <h3 className="text-sm font-bold text-[#1C1917]">
                  Register New Bus in Fleet
                </h3>
              </div>
              <button
                onClick={() => setShowAddBusModal(false)}
                className="p-1 rounded text-[#78716C] hover:text-[#1C1917] hover:bg-[#F0EBE1]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddBusSubmit} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="block font-semibold text-[#1C1917]">
                  Bus Identifier / Number <span className="text-[#1C1917]">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bus 11"
                  value={newBusForm.busNumber}
                  onChange={(e) => setNewBusForm({ ...newBusForm, busNumber: e.target.value })}
                  className="w-full px-3 py-1.5 bg-white border border-[#E6E0D2] rounded-md text-xs text-[#1C1917] font-bold focus:outline-none focus:border-[#1C1917]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div className="space-y-1">
                  <label className="block font-semibold text-[#1C1917]">Seating Capacity</label>
                  <input
                    type="number"
                    value={newBusForm.capacity}
                    onChange={(e) => setNewBusForm({ ...newBusForm, capacity: e.target.value })}
                    className="w-full px-3 py-1.5 bg-white border border-[#E6E0D2] rounded-md text-xs text-[#1C1917] font-bold focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block font-semibold text-[#1C1917]">Distance / Route Tag <span className="text-[#1C1917]">*</span></label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. ptk / Airport Rd"
                    value={newBusForm.dist}
                    onChange={(e) => setNewBusForm({ ...newBusForm, dist: e.target.value })}
                    className="w-full px-3 py-1.5 bg-white border border-[#E6E0D2] rounded-md text-xs text-[#1C1917] font-bold focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block font-semibold text-[#1C1917]">Number Plate</label>
                <input
                  type="text"
                  placeholder="e.g. PB-01-AB-1011"
                  value={newBusForm.numberPlate}
                  onChange={(e) => setNewBusForm({ ...newBusForm, numberPlate: e.target.value })}
                  className="w-full px-3 py-1.5 bg-white border border-[#E6E0D2] rounded-md text-xs text-[#1C1917] font-bold focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#E6E0D2]">
                <button
                  type="button"
                  onClick={() => setShowAddBusModal(false)}
                  className="btn-secondary text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary text-xs"
                >
                  Register Bus
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
