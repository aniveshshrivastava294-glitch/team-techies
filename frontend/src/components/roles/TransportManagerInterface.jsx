import React, { useState } from 'react';
import SectionHero from '../SectionHero';
import { BACKDROP_IMAGES } from '../../config/backdropImages';
import TicketsSupportLogCard from '../TicketsSupportLogCard';
import LiveCampusTicker from '../LiveCampusTicker';
import {
  Bus, Clock, Plus, Check, X, Calendar,
  CheckCircle2, Trash2
} from 'lucide-react';

export default function TransportManagerInterface() {
  // Filter States
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Bus Fleet Initial State
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
    showToast('Cleared all buses from matrix.');
  };

  const filteredBuses = busFleet.filter(b => {
    const matchesStatus = filterStatus === 'ALL' || b.status.toUpperCase().replace(/\s+/g, '') === filterStatus.replace(/\s+/g, '');
    const matchesSearch = b.busNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          b.dist.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          b.numberPlate.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleBookingAction = (reqId, status) => {
    setBookingRequests(prev => prev.map(r => r.id === reqId ? { ...r, status: status } : r));
    showToast(`Booking request ${status.toLowerCase()} successfully!`);
  };

  const handleDeleteBookingReq = (reqId, requestor) => {
    setBookingRequests(prev => prev.filter(r => r.id !== reqId));
    showToast(`Deleted request from ${requestor}`);
  };

  const handleAddBookingReqSubmit = (e) => {
    e.preventDefault();
    if (!newReqForm.requestor.trim() || !newReqForm.purpose.trim()) {
      showToast('Please enter Requestor Name & Purpose!');
      return;
    }

    const createdReq = {
      id: `req-${Date.now()}`,
      requestor: newReqForm.requestor.trim(),
      department: newReqForm.department.trim() || 'General Academic',
      date: newReqForm.date,
      day: newReqForm.day,
      purpose: newReqForm.purpose.trim(),
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
    showToast(`Booking request submitted for ${createdReq.requestor}!`);
  };

  const handleAddCityBusEvent = (e) => {
    e.preventDefault();
    if (!newEventTitle.trim()) return;

    const newEvt = {
      id: `evt-${Date.now()}`,
      title: newEventTitle.trim(),
      busCount: 2,
      date: '2026-09-04',
      location: 'Main University Campus'
    };

    setCityBusEvents(prev => [...prev, newEvt]);
    setNewEventTitle('');
    showToast(`Added event: "${newEvt.title}"`);
  };

  const handleAddBusSubmit = (e) => {
    e.preventDefault();
    if (!newBusForm.busNumber.trim() || !newBusForm.dist.trim() || !newBusForm.numberPlate.trim()) {
      showToast('Please fill all bus details (Bus Number, Dist, Plate)');
      return;
    }

    const newBus = {
      id: `b-${Date.now()}`,
      busNumber: newBusForm.busNumber.trim(),
      capacity: parseInt(newBusForm.capacity) || 30,
      dist: newBusForm.dist.trim(),
      numberPlate: newBusForm.numberPlate.trim(),
      status: newBusForm.status,
      occupied: 0,
      morningDep: newBusForm.morningDep,
      morningArr: newBusForm.morningArr,
      eveDep: newBusForm.eveDep,
      eveArr: newBusForm.eveArr
    };

    setBusFleet(prev => [...prev, newBus]);
    setShowAddBusModal(false);
    setSelectedBusId(newBus.id);
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
    showToast(`Added ${newBus.busNumber} to transport fleet!`);
  };

  return (
    <div className="space-y-6 font-sans animate-in fade-in duration-300">
      
      {/* Toast Alert */}
      {toastMsg && (
        <div className="fixed top-20 right-6 bg-[#2B1D12] text-white font-medium text-xs px-4 py-2.5 rounded-xl shadow-2xl z-50 flex items-center gap-2 border border-[#E8DCC8]">
          <CheckCircle2 className="w-4 h-4 text-[#4E7A51]" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* ================= SECTION HERO: TRANSPORT BACKDROP ================= */}
      <SectionHero
        image={BACKDROP_IMAGES.transport}
        category="Fleet & Logistics"
        categoryIcon={Bus}
        badgeText={`${busFleet.length} Buses in Fleet`}
        title="Transit & Fleet Logistics Command"
        subtitle="Manage daily student bus routes, live GPS telemetry, special faculty vehicle reservations & transit maintenance tickets."
      >
        {busFleet.length > 0 && (
          <button
            onClick={handleClearAllBuses}
            className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-medium rounded-lg transition-colors cursor-pointer"
            title="Remove all buses"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}

        <button
          onClick={() => setShowAddBusModal(true)}
          className="px-4 py-2 inst-button-primary text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add New Bus</span>
        </button>
      </SectionHero>

      {/* Live Orbit Telemetry Ticker Marquee */}
      <LiveCampusTicker />

      {/* ================= TOP SECTION: 10 BUS FLEET STATUS MATRIX ================= */}
      <div className="space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h2 className="text-sm font-bold text-[#2B1D12] tracking-tight flex items-center gap-2">
            <Bus className="w-4 h-4 text-[#BC4800]" />
            Active Bus Fleet Matrix ({busFleet.length} Buses)
          </h2>

          {/* Filter Status Pills */}
          <div className="flex items-center bg-[#F7EFE4] p-1 rounded-lg border border-[#E8DCC8] text-xs font-semibold">
            {['ALL', 'ON ROUTE', 'STATIONED', 'MAINTENANCE'].map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                  filterStatus === st
                    ? 'bg-[#BC4800] text-white shadow-xs'
                    : 'text-[#6B5A4A] hover:text-[#2B1D12]'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Fleet Grid or Empty State */}
        {filteredBuses.length === 0 ? (
          <div className="p-8 text-center rounded-2xl border border-dashed border-[#E8DCC8] bg-[#F7EFE4] space-y-3">
            <div className="w-12 h-12 rounded-xl bg-[#BC4800]/15 text-[#BC4800] flex items-center justify-center mx-auto border border-[#BC4800]/30">
              <Bus className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#2B1D12]">No buses in fleet matrix</h3>
              <p className="text-xs text-[#6B5A4A] font-medium mt-0.5">
                Click "+ Add New Bus" to register a bus with Bus Number, Capacity, Dist, and Number Plate.
              </p>
            </div>
            <button
              onClick={() => setShowAddBusModal(true)}
              className="px-4 py-2 inst-button-primary text-xs font-semibold rounded-lg shadow-xs inline-flex items-center gap-1.5 cursor-pointer"
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
                  className={`p-3.5 rounded-xl border transition-all duration-200 cursor-pointer space-y-2 relative bg-[#F7EFE4] ${
                    isSelected
                      ? 'border-[#BC4800] ring-1 ring-[#BC4800] shadow-xs'
                      : 'border-[#E8DCC8] hover:border-[#BC4800]/60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-[#2B1D12] leading-none truncate">
                      {bus.busNumber}
                    </h3>
                    
                    <div className="flex items-center space-x-1">
                      <span className={`w-2 h-2 rounded-full shrink-0 ${
                        bus.status === 'On Route' ? 'bg-[#4E7A51]' : bus.status === 'Maintenance' ? 'bg-[#A6402F]' : 'bg-[#C48A2E]'
                      }`} />
                      
                      <button
                        onClick={(e) => handleDeleteBus(e, bus.id, bus.busNumber)}
                        className="p-1 rounded text-[#6B5A4A] hover:text-[#A6402F] transition-colors cursor-pointer ml-1"
                        title="Remove bus"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {/* Bus Specs: Capacity, Dist, Number Plate */}
                  <div className="space-y-1 text-xs text-[#6B5A4A]">
                    <div className="flex justify-between items-center">
                      <span>Capacity:</span>
                      <span className="font-semibold text-[#2B1D12]">{bus.capacity}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span>Dist:</span>
                      <span className="font-semibold text-[#BC4800] uppercase truncate max-w-[90px]">{bus.dist}</span>
                    </div>

                    <div className="flex justify-between items-center pt-0.5 border-t border-[#E8DCC8]">
                      <span>Plate:</span>
                      <span className="font-semibold text-[#2B1D12]">{bus.numberPlate || 'N/A'}</span>
                    </div>
                  </div>

                  {/* Progress Bar inside box */}
                  <div className="w-full bg-[#E8DCC8] h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${occPct > 85 ? 'bg-[#A6402F]' : 'bg-[#4E7A51]'}`}
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
        <div className="lg:col-span-6 p-5 rounded-2xl border border-[#E8DCC8] bg-[#F7EFE4] shadow-xs space-y-4">
          
          <div className="border-b pb-3 border-[#E8DCC8]">
            <h3 className="text-sm font-bold text-[#2B1D12] tracking-tight flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-[#BC4800]" />
              Check Arrival and Departure Times
            </h3>
            <p className="text-xs text-[#6B5A4A] font-medium mt-0.5">
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
                  className="w-full px-3.5 py-2 bg-[#FDF8F2] border border-[#E8DCC8] rounded-lg text-xs font-semibold text-[#2B1D12] focus:outline-none focus:border-[#BC4800] transition-colors"
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
                <h4 className="text-xs font-bold text-[#2B1D12] tracking-tight flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-[#BC4800]" />
                  Schedule details for <span className="text-[#BC4800] font-semibold">{activeBus.busNumber}</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                  
                  {/* Morning Departure */}
                  <div className="p-3.5 rounded-xl bg-[#FDF8F2] border border-[#E8DCC8] space-y-1">
                    <label className="block text-xs font-semibold text-[#6B5A4A]">
                      Morning Departure
                    </label>
                    <div className="font-bold text-xs text-[#2B1D12]">
                      {activeBus.morningDep}
                    </div>
                  </div>

                  {/* Morning Arrival */}
                  <div className="p-3.5 rounded-xl bg-[#FDF8F2] border border-[#E8DCC8] space-y-1">
                    <label className="block text-xs font-semibold text-[#6B5A4A]">
                      Morning Arrival
                    </label>
                    <div className="font-bold text-xs text-[#2B1D12]">
                      {activeBus.morningArr}
                    </div>
                  </div>

                  {/* Evening Departure */}
                  <div className="p-3.5 rounded-xl bg-[#FDF8F2] border border-[#E8DCC8] space-y-1">
                    <label className="block text-xs font-semibold text-[#6B5A4A]">
                      Evening Departure
                    </label>
                    <div className="font-bold text-xs text-[#2B1D12]">
                      {activeBus.eveDep}
                    </div>
                  </div>

                  {/* Evening Arrival */}
                  <div className="p-3.5 rounded-xl bg-[#FDF8F2] border border-[#E8DCC8] space-y-1">
                    <label className="block text-xs font-semibold text-[#6B5A4A]">
                      Evening Arrival
                    </label>
                    <div className="font-bold text-xs text-[#2B1D12]">
                      {activeBus.eveArr}
                    </div>
                  </div>

                </div>
              </div>
            </>
          ) : (
            <div className="py-6 text-center text-xs text-[#6B5A4A] font-medium">
              No bus selected. Register a bus to inspect timetable.
            </div>
          )}

        </div>

        {/* RIGHT COLUMN: Bus Booking Req & Events that would req city bus */}
        <div className="lg:col-span-6 space-y-5">

          {/* CARD 1: BUS BOOKING REQUESTS */}
          <div className="p-5 rounded-2xl border border-[#E8DCC8] bg-[#F7EFE4] shadow-xs space-y-3">
            
            <div className="flex items-center justify-between pb-2 border-b border-[#E8DCC8]">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-[#2B1D12] tracking-tight">
                  Bus Booking Requests
                </h3>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#C48A2E]/15 text-[#C48A2E] border border-[#C48A2E]/30">
                  {bookingRequests.filter(r => r.status === 'Pending').length} Pending
                </span>
              </div>

              <button
                onClick={() => setShowAddReqModal(true)}
                className="px-3 py-1 inst-button-primary rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1 shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Request</span>
              </button>
            </div>

            {/* List of Requests */}
            {bookingRequests.length === 0 ? (
              <p className="text-xs text-[#6B5A4A] py-3 text-center">No pending bus booking requests.</p>
            ) : (
              <div className="space-y-2">
                {bookingRequests.map((req) => (
                  <div
                    key={req.id}
                    className="p-3 rounded-xl bg-[#FDF8F2] border border-[#E8DCC8] flex items-center justify-between gap-2"
                  >
                    <div className="space-y-0.5 text-xs text-[#2B1D12] truncate">
                      <p className="font-bold text-xs text-[#2B1D12] truncate">{req.requestor} ({req.department})</p>
                      <p className="text-[#6B5A4A] text-xs truncate">
                        Date: <span className="font-semibold text-[#2B1D12]">{req.date}</span> • Day: <span className="font-semibold text-[#2B1D12]">{req.day}</span>
                      </p>
                      <p className="text-xs text-[#BC4800] font-medium truncate">
                        {req.purpose} • <span>{req.busType}</span>
                      </p>
                      {req.status !== 'Pending' && (
                        <span className={`inline-block mt-0.5 text-xs font-semibold px-2 py-0.5 rounded-full border ${
                          req.status === 'Approved' ? 'bg-[#4E7A51]/15 text-[#4E7A51] border-[#4E7A51]/30' : 'bg-[#A6402F]/15 text-[#A6402F] border-[#A6402F]/30'
                        }`}>
                          {req.status}
                        </span>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center space-x-1.5 shrink-0">
                      {req.status === 'Pending' ? (
                        <>
                          <button
                            onClick={() => handleBookingAction(req.id, 'Approved')}
                            className="p-1.5 rounded-lg bg-[#4E7A51] text-white hover:bg-[#3D6140] transition-colors cursor-pointer"
                            title="Approve request"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleBookingAction(req.id, 'Rejected')}
                            className="p-1.5 rounded-lg bg-[#A6402F]/15 hover:bg-[#A6402F]/25 text-[#A6402F] border border-[#A6402F]/30 transition-colors cursor-pointer"
                            title="Reject request"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => handleBookingAction(req.id, 'Pending')}
                          className="px-2.5 py-1 rounded-lg bg-[#F7EFE4] text-xs font-semibold text-[#6B5A4A] border border-[#E8DCC8] cursor-pointer"
                        >
                          Reset
                        </button>
                      )}

                      <button
                        onClick={() => handleDeleteBookingReq(req.id, req.requestor)}
                        className="p-1.5 rounded-lg text-[#6B5A4A] hover:text-[#A6402F] transition-colors cursor-pointer"
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

          {/* CARD 2: EVENTS REQUIRING CITY BUS */}
          <div className="p-5 rounded-2xl border border-[#E8DCC8] bg-[#F7EFE4] shadow-xs space-y-3">
            
            <div className="border-b pb-2 border-[#E8DCC8]">
              <h3 className="text-sm font-bold text-[#2B1D12] tracking-tight">
                Events Requiring City Bus
              </h3>
            </div>

            {/* List of City Bus Events */}
            <div className="space-y-2 text-xs">
              {cityBusEvents.map((evt) => (
                <div
                  key={evt.id}
                  className="p-3 rounded-xl bg-[#FDF8F2] border border-[#E8DCC8] flex items-center justify-between gap-2"
                >
                  <div className="truncate">
                    <span className="block text-[#2B1D12] truncate text-xs font-bold">{evt.title}</span>
                    <span className="text-xs text-[#BC4800] font-semibold">{evt.date}</span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#BC4800]/15 text-[#BC4800] border border-[#BC4800]/30 text-xs font-semibold shrink-0">
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
                className="flex-1 px-3 py-1.5 bg-[#FDF8F2] border border-[#E8DCC8] rounded-lg text-xs font-medium text-[#2B1D12] placeholder-[#6B5A4A]/60 focus:outline-none focus:border-[#BC4800] transition-colors"
              />
              <button
                type="submit"
                className="px-3.5 py-1.5 inst-button-primary rounded-lg text-xs font-semibold transition-colors cursor-pointer shrink-0 shadow-xs"
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
        <div className="fixed inset-0 bg-[#2B1D12]/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in font-sans">
          <div className="bg-[#F7EFE4] border border-[#E8DCC8] w-full max-w-md rounded-2xl p-5 shadow-2xl space-y-4 relative animate-in zoom-in-95">
            
            <div className="flex items-center justify-between pb-2 border-b border-[#E8DCC8]">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-[#BC4800]/15 border border-[#BC4800]/30 rounded-lg text-[#BC4800]">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#2B1D12]">
                    Add Bus Booking Request
                  </h3>
                  <p className="text-xs text-[#6B5A4A] font-medium">
                    Submit faculty or department transport booking
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAddReqModal(false)}
                className="p-1 rounded-lg hover:bg-[#FDF8F2] text-[#6B5A4A] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddBookingReqSubmit} className="space-y-3 text-xs">
              
              {/* Requestor Name */}
              <div className="space-y-1">
                <label className="block font-semibold text-[#2B1D12]">
                  Requestor Name <span className="text-[#BC4800]">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Meera Nambiar"
                  value={newReqForm.requestor}
                  onChange={(e) => setNewReqForm({ ...newReqForm, requestor: e.target.value })}
                  className="w-full px-3 py-2 bg-[#FDF8F2] border border-[#E8DCC8] rounded-lg text-xs text-[#2B1D12] placeholder-[#6B5A4A]/60 font-semibold focus:outline-none focus:border-[#BC4800]"
                />
              </div>

              {/* Department */}
              <div className="space-y-1">
                <label className="block font-semibold text-[#2B1D12]">
                  Department
                </label>
                <input
                  type="text"
                  placeholder="e.g. Biotechnology"
                  value={newReqForm.department}
                  onChange={(e) => setNewReqForm({ ...newReqForm, department: e.target.value })}
                  className="w-full px-3 py-2 bg-[#FDF8F2] border border-[#E8DCC8] rounded-lg text-xs text-[#2B1D12] placeholder-[#6B5A4A]/60 font-semibold focus:outline-none focus:border-[#BC4800]"
                />
              </div>

              {/* Date & Day */}
              <div className="grid grid-cols-2 gap-2.5">
                <div className="space-y-1">
                  <label className="block font-semibold text-[#2B1D12]">Date</label>
                  <input
                    type="date"
                    value={newReqForm.date}
                    onChange={(e) => setNewReqForm({ ...newReqForm, date: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FDF8F2] border border-[#E8DCC8] rounded-lg text-xs text-[#2B1D12] font-semibold focus:outline-none focus:border-[#BC4800]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block font-semibold text-[#2B1D12]">Day</label>
                  <input
                    type="text"
                    placeholder="e.g. Tuesday"
                    value={newReqForm.day}
                    onChange={(e) => setNewReqForm({ ...newReqForm, day: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FDF8F2] border border-[#E8DCC8] rounded-lg text-xs text-[#2B1D12] placeholder-[#6B5A4A]/60 font-semibold focus:outline-none focus:border-[#BC4800]"
                  />
                </div>
              </div>

              {/* Purpose */}
              <div className="space-y-1">
                <label className="block font-semibold text-[#2B1D12]">Purpose</label>
                <input
                  type="text"
                  placeholder="e.g. Field Excursion Visit"
                  value={newReqForm.purpose}
                  onChange={(e) => setNewReqForm({ ...newReqForm, purpose: e.target.value })}
                  className="w-full px-3 py-2 bg-[#FDF8F2] border border-[#E8DCC8] rounded-lg text-xs text-[#2B1D12] placeholder-[#6B5A4A]/60 font-semibold focus:outline-none focus:border-[#BC4800]"
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#E8DCC8]">
                <button
                  type="button"
                  onClick={() => setShowAddReqModal(false)}
                  className="px-3.5 py-1.5 bg-[#FDF8F2] hover:bg-[#F7EFE4] text-[#2B1D12] border border-[#E8DCC8] rounded-lg font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 inst-button-primary rounded-lg font-semibold transition-colors cursor-pointer shadow-xs"
                >
                  Submit Request
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ================= ADD NEW BUS MODAL DIALOG ================= */}
      {showAddBusModal && (
        <div className="fixed inset-0 bg-[#2B1D12]/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in font-sans">
          <div className="bg-[#F7EFE4] border border-[#E8DCC8] w-full max-w-md rounded-2xl p-5 shadow-2xl space-y-4 relative animate-in zoom-in-95">
            
            <div className="flex items-center justify-between pb-2 border-b border-[#E8DCC8]">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-[#BC4800]/15 border border-[#BC4800]/30 rounded-lg text-[#BC4800]">
                  <Bus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#2B1D12]">
                    Add New Bus
                  </h3>
                  <p className="text-xs text-[#6B5A4A] font-medium">
                    Register bus number, capacity, dist, and number plate
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAddBusModal(false)}
                className="p-1 rounded-lg hover:bg-[#FDF8F2] text-[#6B5A4A] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddBusSubmit} className="space-y-3 text-xs">
              
              {/* Bus Number */}
              <div className="space-y-1">
                <label className="block font-semibold text-[#2B1D12]">
                  Bus Number <span className="text-[#BC4800]">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bus 1, Bus 11"
                  value={newBusForm.busNumber}
                  onChange={(e) => setNewBusForm({ ...newBusForm, busNumber: e.target.value })}
                  className="w-full px-3 py-2 bg-[#FDF8F2] border border-[#E8DCC8] rounded-lg text-xs text-[#2B1D12] placeholder-[#6B5A4A]/60 font-semibold focus:outline-none focus:border-[#BC4800]"
                />
              </div>

              {/* Seating Capacity */}
              <div className="space-y-1">
                <label className="block font-semibold text-[#2B1D12]">
                  Capacity <span className="text-[#BC4800]">*</span>
                </label>
                <input
                  type="number"
                  required
                  min="5"
                  max="100"
                  placeholder="e.g. 50"
                  value={newBusForm.capacity}
                  onChange={(e) => setNewBusForm({ ...newBusForm, capacity: e.target.value })}
                  className="w-full px-3 py-2 bg-[#FDF8F2] border border-[#E8DCC8] rounded-lg text-xs text-[#2B1D12] placeholder-[#6B5A4A]/60 font-semibold focus:outline-none focus:border-[#BC4800]"
                />
              </div>

              {/* Distance / Route Tag */}
              <div className="space-y-1">
                <label className="block font-semibold text-[#2B1D12]">
                  Dist (Route / Distance) <span className="text-[#BC4800]">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ptk, itemi, Airport road"
                  value={newBusForm.dist}
                  onChange={(e) => setNewBusForm({ ...newBusForm, dist: e.target.value })}
                  className="w-full px-3 py-2 bg-[#FDF8F2] border border-[#E8DCC8] rounded-lg text-xs text-[#2B1D12] placeholder-[#6B5A4A]/60 font-semibold focus:outline-none focus:border-[#BC4800]"
                />
              </div>

              {/* Number Plate */}
              <div className="space-y-1">
                <label className="block font-semibold text-[#2B1D12]">
                  Number Plate <span className="text-[#BC4800]">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. PB-01-AB-1234"
                  value={newBusForm.numberPlate}
                  onChange={(e) => setNewBusForm({ ...newBusForm, numberPlate: e.target.value })}
                  className="w-full px-3 py-2 bg-[#FDF8F2] border border-[#E8DCC8] rounded-lg text-xs text-[#2B1D12] placeholder-[#6B5A4A]/60 font-semibold focus:outline-none focus:border-[#BC4800]"
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#E8DCC8]">
                <button
                  type="button"
                  onClick={() => setShowAddBusModal(false)}
                  className="px-3.5 py-1.5 bg-[#FDF8F2] hover:bg-[#F7EFE4] text-[#2B1D12] border border-[#E8DCC8] rounded-lg font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 inst-button-primary rounded-lg font-semibold transition-colors cursor-pointer shadow-xs"
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
