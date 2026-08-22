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
        <div className="fixed top-20 right-6 z-50 bg-[#92400E] text-white px-4 py-2.5 rounded-md shadow-md border border-[#78350F] text-xs font-mono font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-white" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* HEADER BANNER */}
      <div className="p-6 rounded-lg bg-[#1C1917] text-[#FAF8F3] border border-[#92400E] shadow-md relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="badge-brown text-[10px]">
                <Bus className="w-3.5 h-3.5 text-[#92400E]" />
                TRANSIT COMMAND
              </span>
              <span className="text-xs text-[#FDE68A] font-bold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#F59E0B] animate-ping inline-block" />
                Live Fleet Manager
              </span>
            </div>
            
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              Transport Manager Interface
              <Sparkles className="w-5 h-5 text-[#F59E0B]" />
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
              className="btn-primary-brown text-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Add Vehicle to Fleet</span>
            </button>
          </div>
        </div>
      </div>

      {/* Fleet Summary Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="card-surface p-4 border-l-4 border-l-amber-600">
          <div className="flex items-center justify-between text-xs text-[#57534E]">
            <span className="font-bold">Total Shuttles</span>
            <Bus className="w-4 h-4 text-amber-700" />
          </div>
          <p className="text-xl font-bold text-[#1C1917] mt-1">{busFleet.length}</p>
          <span className="text-[10px] text-[#78716C] font-mono font-semibold">Active Fleet Register</span>
        </div>

        <div className="card-surface p-4 border-l-4 border-l-emerald-600">
          <div className="flex items-center justify-between text-xs text-[#57534E]">
            <span className="font-bold">On Route Now</span>
            <Navigation className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-xl font-bold text-[#1C1917] mt-1">
            {busFleet.filter(b => b.status === 'On Route').length}
          </p>
          <span className="text-[10px] text-emerald-700 font-mono font-bold">GPS Beacon Active</span>
        </div>

        <div className="card-surface p-4 border-l-4 border-l-blue-600">
          <div className="flex items-center justify-between text-xs text-[#57534E]">
            <span className="font-bold">Passenger Riders</span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-xl font-bold text-[#1C1917] mt-1">
            {busFleet.reduce((acc, b) => acc + (b.occupied || 0), 0)}
          </p>
          <span className="text-[10px] text-blue-700 font-mono font-bold">Live Scan Ingress</span>
        </div>

        <div className="card-surface p-4 border-l-4 border-l-rose-600">
          <div className="flex items-center justify-between text-xs text-[#57534E]">
            <span className="font-bold">Pending Bookings</span>
            <Clock className="w-4 h-4 text-rose-600" />
          </div>
          <p className="text-xl font-bold text-[#1C1917] mt-1">
            {bookingRequests.filter(r => r.status === 'Pending').length}
          </p>
          <span className="text-[10px] text-rose-700 font-mono font-bold">Requires Approval</span>
        </div>
      </div>

      {/* Main Bus Fleet Matrix Table */}
      <div className="card-surface p-5 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E6E0D2]">
          <div className="flex items-center space-x-2">
            <Bus className="w-4 h-4 text-[#92400E]" />
            <h2 className="text-sm font-bold text-[#1C1917]">
              Shuttle Fleet Roster & Live Timetable Matrix
            </h2>
            <span className="badge-brown text-[10px]">
              {filteredBuses.length} Vehicles
            </span>
          </div>

          {/* Search & Filter */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-[#78716C] absolute left-2.5 top-2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search bus, route..."
                className="bg-[#F0EBE1] border border-[#E6E0D2] rounded-md pl-8 pr-2 py-1 text-xs text-[#1C1917] placeholder-[#78716C] focus:outline-none focus:border-[#92400E] font-bold"
              />
            </div>
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-[#F0EBE1] border border-[#E6E0D2] rounded-md px-2 py-1 text-xs text-[#1C1917] font-bold focus:outline-none"
            >
              <option value="ALL">All Status</option>
              <option value="ON ROUTE">On Route</option>
              <option value="STATIONED">Stationed</option>
              <option value="MAINTENANCE">Maintenance</option>
            </select>
          </div>
        </div>

        {/* Bus Table */}
        <div className="overflow-x-auto border border-[#E6E0D2] rounded-md">
          <table className="table-mono">
            <thead>
              <tr>
                <th>Bus Identifier</th>
                <th>Route Tag</th>
                <th>Plate Number</th>
                <th>Status</th>
                <th>Occupancy</th>
                <th>Morning Schedule</th>
                <th>Evening Schedule</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredBuses.map((bus) => {
                const isSelected = bus.id === selectedBusId;
                const isOverloaded = bus.occupied > bus.capacity;

                return (
                  <tr
                    key={bus.id}
                    onClick={() => setSelectedBusId(bus.id)}
                    className={`cursor-pointer transition-colors ${isSelected ? 'bg-[#F0EBE1] font-bold' : ''}`}
                  >
                    <td className="font-bold text-[#1C1917] flex items-center gap-2">
                      <Bus className={`w-3.5 h-3.5 ${isSelected ? 'text-[#92400E]' : 'text-[#78716C]'}`} />
                      <span>{bus.busNumber}</span>
                    </td>

                    <td className="font-mono text-xs text-[#57534E] font-semibold">{bus.dist}</td>
                    <td className="font-mono text-xs text-[#57534E] font-semibold">{bus.numberPlate}</td>

                    <td>
                      <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded border ${
                        bus.status === 'On Route' ? 'badge-emerald' : bus.status === 'Maintenance' ? 'badge-error' : 'badge-brown'
                      }`}>
                        {bus.status}
                      </span>
                    </td>

                    <td>
                      <div className="flex items-center space-x-2">
                        <span className={`font-mono font-bold text-xs ${isOverloaded ? 'text-rose-700' : 'text-[#1C1917]'}`}>
                          {bus.occupied} / {bus.capacity}
                        </span>
                        {isOverloaded && (
                          <span className="badge-error text-[9px]">OVERLOAD</span>
                        )}
                      </div>
                    </td>

                    <td className="font-mono text-[11px] text-[#57534E] font-semibold">
                      {bus.morningDep} → {bus.morningArr}
                    </td>

                    <td className="font-mono text-[11px] text-[#57534E] font-semibold">
                      {bus.eveDep} → {bus.eveArr}
                    </td>

                    <td>
                      <button
                        onClick={(e) => handleDeleteBus(e, bus.id, bus.busNumber)}
                        className="text-[#78716C] hover:text-rose-700 p-1 rounded"
                        title="Remove vehicle"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Selected Bus Inspection & Timetable Detail */}
      {activeBus && (
        <div className="card-surface p-5 shadow-2xs space-y-3 bg-[#F0EBE1]/50 border-amber-200">
          <div className="flex items-center justify-between pb-2 border-b border-[#E6E0D2]">
            <div className="flex items-center space-x-2">
              <Navigation className="w-4 h-4 text-[#92400E]" />
              <h3 className="text-sm font-bold text-[#1C1917]">
                Live Inspector: {activeBus.busNumber} ({activeBus.numberPlate})
              </h3>
            </div>
            <span className="badge-brown text-[10px]">
              Route Tag: {activeBus.dist}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
            <div className="bg-[#FAF8F3] p-3 rounded border border-[#E6E0D2]">
              <span className="text-[#57534E] block mb-1 font-bold">Occupancy Gauge</span>
              <div className="flex items-baseline space-x-2">
                <span className="text-xl font-bold text-[#1C1917]">{activeBus.occupied}</span>
                <span className="text-xs text-[#78716C]">/ {activeBus.capacity} Capacity Limit</span>
              </div>
            </div>

            <div className="bg-[#FAF8F3] p-3 rounded border border-[#E6E0D2]">
              <span className="text-[#57534E] block mb-1 font-bold">Morning Schedule</span>
              <p className="text-[#1C1917] font-bold">Departs: {activeBus.morningDep}</p>
              <p className="text-[#57534E] font-semibold">Arrives: {activeBus.morningArr}</p>
            </div>

            <div className="bg-[#FAF8F3] p-3 rounded border border-[#E6E0D2]">
              <span className="text-[#57534E] block mb-1 font-bold">Evening Schedule</span>
              <p className="text-[#1C1917] font-bold">Departs: {activeBus.eveDep}</p>
              <p className="text-[#57534E] font-semibold">Arrives: {activeBus.eveArr}</p>
            </div>
          </div>
        </div>
      )}

      {/* Grid: Faculty Booking Requests & Support Tickets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        
        {/* Faculty Booking Requests List */}
        <div className="card-surface p-5 shadow-2xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#E6E0D2] mb-3">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-[#92400E]" />
                <h3 className="text-sm font-bold text-[#1C1917]">
                  Faculty Bus Excursion Booking Requests
                </h3>
              </div>
              <span className="badge-brown text-[10px]">
                {bookingRequests.length} Pending
              </span>
            </div>

            <div className="divide-y divide-[#E6E0D2]">
              {bookingRequests.map((req) => (
                <div key={req.id} className="py-3 space-y-1.5">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="text-xs font-bold text-[#1C1917]">{req.requestor}</h4>
                        <span className="badge-brown text-[9px]">{req.department}</span>
                      </div>
                      <p className="text-xs font-medium text-[#1C1917] mt-0.5">{req.purpose}</p>
                      <p className="text-[11px] text-[#57534E] font-mono mt-0.5">
                        Date: {req.date} ({req.day}) • {req.busType}
                      </p>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      {req.status === 'Pending' ? (
                        <>
                          <button
                            onClick={() => handleBookingAction(req.id, 'Approved')}
                            className="btn-primary-brown text-[10px] py-1 px-2"
                            title="Approve Excursion"
                          >
                            <Check className="w-3 h-3" />
                            <span>Approve</span>
                          </button>
                          <button
                            onClick={() => handleBookingAction(req.id, 'Rejected')}
                            className="btn-secondary text-[10px] py-1 px-2"
                            title="Reject Excursion"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </>
                      ) : (
                        <span className={`text-[10px] font-mono font-bold px-2 py-1 rounded border ${
                          req.status === 'Approved' ? 'badge-emerald' : 'badge-brown'
                        }`}>
                          {req.status}
                        </span>
                      )}

                      <button
                        onClick={() => handleDeleteBookingReq(req.id, req.requestor)}
                        className="text-[#78716C] hover:text-rose-700 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => setShowAddReqModal(true)}
            className="btn-primary-brown w-full text-xs py-2 mt-2"
          >
            <Plus className="w-4 h-4" />
            <span>Submit Faculty Excursion Bus Request</span>
          </button>
        </div>

        {/* Support Tickets Logger */}
        <div>
          <TicketsSupportLogCard currentUser={{ role: 'transport_manager', full_name: 'Sub-Admin Transport' }} />
        </div>

      </div>

      {/* Modal: Add Bus */}
      {showAddBusModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs font-sans">
          <div className="card-surface w-full max-w-md p-6 rounded-lg border border-[#E6E0D2] shadow-xl relative bg-[#FAF8F3]">
            <div className="flex items-center justify-between pb-3 border-b border-[#E6E0D2] mb-4">
              <h3 className="text-sm font-bold text-[#1C1917] flex items-center gap-2">
                <Bus className="w-4 h-4 text-[#92400E]" />
                Register Vehicle into Fleet Matrix
              </h3>
              <button onClick={() => setShowAddBusModal(false)} className="text-[#78716C] hover:text-[#1C1917]">×</button>
            </div>

            <form onSubmit={handleAddBusSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-[#1C1917] font-semibold mb-1">Bus Name / Identifier</label>
                <input
                  type="text"
                  value={newBusForm.busNumber}
                  onChange={(e) => setNewBusForm({ ...newBusForm, busNumber: e.target.value })}
                  placeholder="e.g. Bus 11 (Express Shuttle)"
                  className="w-full bg-white border border-[#E6E0D2] rounded-md px-3 py-2 text-[#1C1917] focus:outline-none focus:border-[#92400E] font-bold"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[#1C1917] font-semibold mb-1">Route / Distance Tag</label>
                  <input
                    type="text"
                    value={newBusForm.dist}
                    onChange={(e) => setNewBusForm({ ...newBusForm, dist: e.target.value })}
                    placeholder="e.g. North Campus Loop"
                    className="w-full bg-white border border-[#E6E0D2] rounded-md px-3 py-2 text-[#1C1917] focus:outline-none focus:border-[#92400E] font-bold"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[#1C1917] font-semibold mb-1">Seating Capacity</label>
                  <input
                    type="number"
                    value={newBusForm.capacity}
                    onChange={(e) => setNewBusForm({ ...newBusForm, capacity: e.target.value })}
                    className="w-full bg-white border border-[#E6E0D2] rounded-md px-3 py-2 text-[#1C1917] focus:outline-none focus:border-[#92400E] font-bold"
                    min="10"
                    max="100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#1C1917] font-semibold mb-1">License Plate Number</label>
                <input
                  type="text"
                  value={newBusForm.numberPlate}
                  onChange={(e) => setNewBusForm({ ...newBusForm, numberPlate: e.target.value })}
                  placeholder="e.g. PB-01-AB-9988"
                  className="w-full bg-white border border-[#E6E0D2] rounded-md px-3 py-2 text-[#1C1917] focus:outline-none focus:border-[#92400E] font-bold"
                />
              </div>

              <div className="pt-2 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddBusModal(false)}
                  className="btn-secondary text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary-brown text-xs py-2 px-4"
                >
                  Add Vehicle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Faculty Excursion Request */}
      {showAddReqModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs font-sans">
          <div className="card-surface w-full max-w-md p-6 rounded-lg border border-[#E6E0D2] shadow-xl relative bg-[#FAF8F3]">
            <div className="flex items-center justify-between pb-3 border-b border-[#E6E0D2] mb-4">
              <h3 className="text-sm font-bold text-[#1C1917] flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#92400E]" />
                Submit Excursion Bus Booking
              </h3>
              <button onClick={() => setShowAddReqModal(false)} className="text-[#78716C] hover:text-[#1C1917]">×</button>
            </div>

            <form onSubmit={handleAddBookingReqSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-[#1C1917] font-semibold mb-1">Faculty / Requestor Name</label>
                <input
                  type="text"
                  value={newReqForm.requestor}
                  onChange={(e) => setNewReqForm({ ...newReqForm, requestor: e.target.value })}
                  placeholder="e.g. Dr. Ananya Sharma"
                  className="w-full bg-white border border-[#E6E0D2] rounded-md px-3 py-2 text-[#1C1917] focus:outline-none focus:border-[#92400E] font-bold"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[#1C1917] font-semibold mb-1">Department</label>
                  <input
                    type="text"
                    value={newReqForm.department}
                    onChange={(e) => setNewReqForm({ ...newReqForm, department: e.target.value })}
                    placeholder="e.g. Computer Science"
                    className="w-full bg-white border border-[#E6E0D2] rounded-md px-3 py-2 text-[#1C1917] focus:outline-none focus:border-[#92400E] font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[#1C1917] font-semibold mb-1">Date</label>
                  <input
                    type="date"
                    value={newReqForm.date}
                    onChange={(e) => setNewReqForm({ ...newReqForm, date: e.target.value })}
                    className="w-full bg-white border border-[#E6E0D2] rounded-md px-3 py-2 text-[#1C1917] focus:outline-none focus:border-[#92400E] font-bold font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#1C1917] font-semibold mb-1">Excursion Purpose / Destination</label>
                <input
                  type="text"
                  value={newReqForm.purpose}
                  onChange={(e) => setNewReqForm({ ...newReqForm, purpose: e.target.value })}
                  placeholder="e.g. Science Park Planetarium Field Trip"
                  className="w-full bg-white border border-[#E6E0D2] rounded-md px-3 py-2 text-[#1C1917] focus:outline-none focus:border-[#92400E] font-bold"
                  required
                />
              </div>

              <div className="pt-2 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddReqModal(false)}
                  className="btn-secondary text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary-brown text-xs py-2 px-4"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
