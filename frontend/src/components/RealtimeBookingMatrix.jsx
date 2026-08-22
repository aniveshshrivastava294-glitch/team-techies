import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle2, AlertCircle, Check, Lock } from 'lucide-react';

export default function RealtimeBookingMatrix({ currentUser }) {
  const [venues, setVenues] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [selectedVenue, setSelectedVenue] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [eventName, setEventName] = useState('');
  
  const [bookingStatus, setBookingStatus] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const timeSlots = [
    "09:00 - 10:30",
    "11:00 - 12:30",
    "14:00 - 15:30",
    "16:00 - 17:30"
  ];

  useEffect(() => {
    fetchVenueMatrix();

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
    <div className="inst-card p-6 border border-[#E8DCC8] bg-[#F7EFE4] shadow-xs space-y-6 font-sans">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#E8DCC8]">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-sm font-bold text-[#2B1D12] tracking-tight">Classroom & Room Booking</h2>
            <span className="px-2.5 py-0.5 text-xs font-semibold inst-badge-sage">
              Live Availability
            </span>
          </div>
          <p className="text-xs text-[#6B5A4A] mt-0.5">
            Instant booking confirmation with zero double-booking or scheduling conflicts
          </p>
        </div>

        {/* Conditional Logic Pills */}
        <div className="flex items-center space-x-2 text-xs">
          <div className="px-2.5 py-1 bg-[#FDF8F2] border border-[#E8DCC8] text-[#2B1D12] rounded-full font-medium text-xs">
            <strong>Standard Room:</strong> Instant Approval
          </div>
          <div className="px-2.5 py-1 inst-badge-ochre rounded-full font-medium text-xs">
            <strong>AC Room:</strong> Admin Review Required
          </div>
        </div>
      </div>

      {/* Booking Form Controls */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 bg-[#FDF8F2] p-4 rounded-xl border border-[#E8DCC8]">
        
        {/* Event Name */}
        <div className="md:col-span-5">
          <label className="block text-xs font-semibold text-[#2B1D12] mb-1">Event / Lecture Title</label>
          <input
            type="text"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            placeholder="e.g. Machine Learning Lecture"
            className="w-full bg-[#F7EFE4] border border-[#E8DCC8] rounded-lg px-3 py-2 text-xs text-[#2B1D12] placeholder-[#6B5A4A]/60 focus:outline-none focus:border-[#BC4800]"
          />
        </div>

        {/* Venue Selector */}
        <div className="md:col-span-4">
          <label className="block text-xs font-semibold text-[#2B1D12] mb-1">Select Venue</label>
          <select
            value={selectedVenue}
            onChange={(e) => setSelectedVenue(e.target.value)}
            className="w-full bg-[#F7EFE4] border border-[#E8DCC8] rounded-lg px-3 py-2 text-xs text-[#2B1D12] focus:outline-none focus:border-[#BC4800] font-medium"
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
          <label className="block text-xs font-semibold text-[#2B1D12] mb-1">Reservation Date</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full bg-[#F7EFE4] border border-[#E8DCC8] rounded-lg px-3 py-2 text-xs text-[#2B1D12] focus:outline-none focus:border-[#BC4800]"
          />
        </div>

      </div>

      {/* Feedback Banner */}
      {bookingStatus && (
        <div className={`p-3.5 rounded-xl text-xs flex items-center space-x-2 border ${
          bookingStatus.type === 'success'
            ? 'bg-[#4E7A51]/15 border-[#4E7A51]/30 text-[#4E7A51]'
            : 'bg-[#A6402F]/15 border-[#A6402F]/30 text-[#A6402F]'
        }`}>
          {bookingStatus.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-[#4E7A51] shrink-0" /> : <AlertCircle className="w-4 h-4 text-[#A6402F] shrink-0" />}
          <span>{bookingStatus.message}</span>
        </div>
      )}

      {/* Real-Time Time Slots Matrix */}
      <div>
        <div className="flex items-center justify-between mb-3 text-xs">
          <span className="text-[#2B1D12] font-medium flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-[#BC4800]" />
            Time Slot Availability for <strong>{selectedVenue}</strong> on {selectedDate}
          </span>
          <span className={`px-2.5 py-0.5 font-semibold rounded-full border text-xs ${
            isAcVenue ? 'bg-[#C48A2E]/15 text-[#C48A2E] border-[#C48A2E]/30' : 'bg-[#4E7A51]/15 text-[#4E7A51] border-[#4E7A51]/30'
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
                className={`p-4 rounded-xl border transition-colors flex flex-col justify-between space-y-3 relative overflow-hidden ${
                  booked
                    ? 'bg-[#A6402F]/5 border-[#A6402F]/25 text-[#6B5A4A]'
                    : 'bg-[#FDF8F2] border-[#E8DCC8] hover:border-[#BC4800]/40'
                }`}
              >
                {/* Status Indicator */}
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-[#2B1D12]">{slot}</span>
                  {booked ? (
                    <span className="flex items-center space-x-1.5 px-2 py-0.5 bg-[#A6402F]/15 text-[#A6402F] border border-[#A6402F]/30 rounded-full text-xs font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#A6402F]"></span>
                      <span>Reserved</span>
                    </span>
                  ) : (
                    <span className="flex items-center space-x-1.5 px-2 py-0.5 bg-[#4E7A51]/15 text-[#4E7A51] border border-[#4E7A51]/30 rounded-full text-xs font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#4E7A51]"></span>
                      <span>Available</span>
                    </span>
                  )}
                </div>

                {/* Slot Detail */}
                {booked ? (
                  <div className="text-xs text-[#6B5A4A] bg-[#F7EFE4] p-2.5 rounded-lg border border-[#E8DCC8]">
                    <span className="font-semibold text-[#2B1D12] block truncate">{booked.event_name}</span>
                    <span className="text-[11px] text-[#6B5A4A] block truncate">By: {booked.booked_by_email}</span>
                  </div>
                ) : (
                  <p className="text-xs text-[#6B5A4A]">
                    Available for reservation. {isAcVenue ? 'AC venue triggers Event Admin review.' : 'Instant Non-AC booking.'}
                  </p>
                )}

                {/* Action Button */}
                <button
                  onClick={() => handleBookSlot(slot)}
                  disabled={Boolean(booked) || isSubmitting}
                  className={`w-full py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center justify-center space-x-1.5 ${
                    booked
                      ? 'bg-[#E8DCC8] text-[#6B5A4A] border border-[#E8DCC8] cursor-not-allowed'
                      : 'inst-button-primary shadow-xs'
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

