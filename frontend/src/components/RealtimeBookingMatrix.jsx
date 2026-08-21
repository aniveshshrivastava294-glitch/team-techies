import React, { useState, useEffect } from 'react';
import { Calendar, Clock, CheckCircle2, AlertCircle, Zap, ShieldAlert, Sparkles, Check, Lock } from 'lucide-react';

export default function RealtimeBookingMatrix({ currentUser }) {
  const [venues, setVenues] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [selectedVenue, setSelectedVenue] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [eventName, setEventName] = useState('');
  
  const [bookingStatus, setBookingStatus] = useState(null); // { type: 'success'|'error', message }
  const [isSubmitting, setIsSubmitting] = useState(false);

  const timeSlots = [
    "09:00 - 10:30",
    "11:00 - 12:30",
    "14:00 - 15:30",
    "16:00 - 17:30"
  ];

  useEffect(() => {
    fetchVenueMatrix();

    // Live polling fallback / WebSockets interval
    const interval = setInterval(fetchBookingsData, 3000);
    return () => clearInterval(interval);
  }, []);

  const fetchVenueMatrix = async () => {
    try {
      const vRes = await fetch('/api/bookings/venues');
      const vData = await vRes.json();
      if (vData.status === 'success' && vData.venues?.length > 0) {
        setVenues(vData.venues);
        setSelectedVenue(vData.venues[0].room_number);
      }
      fetchBookingsData();
    } catch (e) {
      console.error('Fetch matrix error:', e);
    }
  };

  const fetchBookingsData = async () => {
    try {
      const bRes = await fetch('/api/bookings');
      const bData = await bRes.json();
      if (bData.status === 'success') {
        setBookings(bData.bookings || []);
      }
    } catch (e) {
      console.error('Fetch bookings error:', e);
    }
  };

  const activeVenueObj = venues.find(v => v.room_number === selectedVenue) || venues[0];
  const isAcVenue = activeVenueObj?.type === 'AC' || selectedVenue.includes('CS') || selectedVenue.includes('ART');

  const isSlotBooked = (venueNum, dateStr, slotStr) => {
    return bookings.find(b => 
      b.venue_name === venueNum &&
      b.date === dateStr &&
      b.time_slot === slotStr &&
      ['approved', 'pending'].includes(b.status)
    );
  };

  const handleBookSlot = async (slotStr) => {
    if (!eventName || eventName.trim() === '') {
      setBookingStatus({ type: 'error', message: 'Please enter an Event Name before booking a slot.' });
      return;
    }

    setIsSubmitting(true);
    setBookingStatus(null);

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event_name: eventName,
          room_number: selectedVenue,
          date: selectedDate,
          time_slot: slotStr,
          booked_by_email: currentUser?.email || 'faculty@demo.com'
        })
      });

      const data = await res.json();

      if (res.status === 409) {
        setBookingStatus({
          type: 'error',
          message: data.message || 'DOUBLE_BOOKING_CONFLICT: This date and time slot is already reserved.'
        });
        fetchBookingsData();
      } else if (data.status === 'success') {
        setBookingStatus({
          type: 'success',
          message: data.message || (data.isAutoApproved 
            ? `Instant Auto-Approval: Non-AC Venue ${selectedVenue} reserved!`
            : `AC Venue ${selectedVenue} booking submitted to Event Sub-Admin for review.`)
        });
        fetchBookingsData();
      } else {
        setBookingStatus({ type: 'error', message: data.error || 'Failed to complete booking' });
      }
    } catch (err) {
      setBookingStatus({ type: 'error', message: err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-stone-200 dark:border-stone-800">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-base font-serif font-bold text-stone-900 dark:text-stone-100">Classroom & Room Booking</h2>
            <span className="px-2 py-0.5 text-[9px] font-mono font-bold bg-[#5C6E3F]/10 text-[#5C6E3F] border border-[#5C6E3F]/30 rounded uppercase">
              Live Availability
            </span>
          </div>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
            Instant booking confirmation with zero double-booking or scheduling conflicts.
          </p>
        </div>

        {/* Conditional Logic Pills */}
        <div className="flex items-center space-x-2 text-xs">
          <div className="px-3 py-1 bg-stone-100 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 rounded font-medium">
            <strong>Standard Room:</strong> Instant Approval
          </div>
          <div className="px-3 py-1 bg-[#C79A45]/10 border border-[#C79A45]/30 text-[#C79A45] rounded font-medium">
            <strong>AC Room:</strong> Admin Review Required
          </div>
        </div>
      </div>

      {/* Booking Form Controls */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 bg-stone-50 dark:bg-stone-900 p-4 rounded border border-stone-300 dark:border-stone-800">
        
        {/* Event Name */}
        <div className="md:col-span-5">
          <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">Event / Lecture Title</label>
          <input
            type="text"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            placeholder="e.g. Machine Learning Lecture"
            className="w-full bg-white dark:bg-stone-950 border border-stone-300 dark:border-stone-700 rounded px-3 py-2 text-xs text-stone-900 dark:text-stone-100 focus:outline-none focus:border-[#B5654A]"
          />
        </div>

        {/* Venue Selector */}
        <div className="md:col-span-4">
          <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">Select Venue</label>
          <select
            value={selectedVenue}
            onChange={(e) => setSelectedVenue(e.target.value)}
            className="w-full bg-white dark:bg-stone-950 border border-stone-300 dark:border-stone-700 rounded px-3 py-2 text-xs text-stone-900 dark:text-stone-100 focus:outline-none focus:border-[#B5654A] font-semibold"
          >
            {venues.map(v => (
              <option key={v.id} value={v.room_number}>
                {v.room_number} ({v.type || 'Non-AC'}) — {v.building} [{v.capacity} seats]
              </option>
            ))}
          </select>
        </div>

        {/* Date Selector */}
        <div className="md:col-span-3">
          <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">Reservation Date</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full bg-white dark:bg-stone-950 border border-stone-300 dark:border-stone-700 rounded px-3 py-2 text-xs text-stone-900 dark:text-stone-100 focus:outline-none focus:border-[#B5654A] font-mono"
          />
        </div>

      </div>

      {/* Feedback Banner */}
      {bookingStatus && (
        <div className={`p-3.5 rounded-xl text-xs flex items-center space-x-2 border ${
          bookingStatus.type === 'success'
            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
            : 'bg-red-500/10 border-red-500/30 text-red-400'
        }`}>
          {bookingStatus.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" /> : <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />}
          <span>{bookingStatus.message}</span>
        </div>
      )}

      {/* Real-Time Time Slots Matrix */}
      <div>
        <div className="flex items-center justify-between mb-3 text-xs">
          <span className="text-slate-300 font-semibold flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-blue-400" />
            Time Slot Availability for <strong>{selectedVenue}</strong> on {selectedDate}
          </span>
          <span className={`px-2 py-0.5 font-bold rounded border text-[11px] ${
            isAcVenue ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
          }`}>
            {isAcVenue ? 'AC Venue (Requires Review)' : 'Non-AC Venue (Instant Approval)'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {timeSlots.map((slot, idx) => {
            const booked = isSlotBooked(selectedVenue, selectedDate, slot);

            return (
              <div
                key={idx}
                className={`p-4 rounded-xl border transition-all flex flex-col justify-between space-y-3 relative overflow-hidden ${
                  booked
                    ? 'bg-red-950/20 border-red-500/40 text-slate-400'
                    : 'bg-slate-900/90 border-slate-800 hover:border-blue-500/50'
                }`}
              >
                {/* Red Dot / Status Indicator */}
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-xs text-white">{slot}</span>
                  {booked ? (
                    <span className="flex items-center space-x-1 px-2 py-0.5 bg-red-500/20 text-red-400 border border-red-500/30 rounded-full text-[10px] font-bold">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></div>
                      <span>Reserved</span>
                    </span>
                  ) : (
                    <span className="flex items-center space-x-1 px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full text-[10px] font-bold">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>
                      <span>Open</span>
                    </span>
                  )}
                </div>

                {/* Slot Detail */}
                {booked ? (
                  <div className="text-[11px] text-slate-400 bg-slate-950/80 p-2 rounded-lg border border-slate-800/80">
                    <span className="font-semibold text-slate-300 block truncate">{booked.event_name}</span>
                    <span className="text-[10px] text-slate-500 block truncate">By: {booked.booked_by_email}</span>
                  </div>
                ) : (
                  <p className="text-[11px] text-slate-400">
                    Available for reservation. {isAcVenue ? 'AC venue triggers Event Admin check.' : 'Instant Non-AC booking.'}
                  </p>
                )}

                {/* Action Button */}
                <button
                  onClick={() => handleBookSlot(slot)}
                  disabled={Boolean(booked) || isSubmitting}
                  className={`w-full py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center space-x-1.5 ${
                    booked
                      ? 'bg-slate-800/60 text-slate-600 border border-slate-800 cursor-not-allowed'
                      : isAcVenue
                      ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-md shadow-amber-600/20'
                      : 'bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/20'
                  }`}
                >
                  {booked ? (
                    <>
                      <Lock className="w-3.5 h-3.5" />
                      <span>Slot Reserved</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>{isAcVenue ? 'Request AC Slot' : 'Book Non-AC Slot'}</span>
                    </>
                  )}
                </button>

              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
