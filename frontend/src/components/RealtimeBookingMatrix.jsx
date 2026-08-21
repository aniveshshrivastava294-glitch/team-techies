import React, { useState, useEffect } from 'react';
import { Calendar, Clock, CheckCircle2, AlertCircle, Building2, Check, Lock } from 'lucide-react';

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
          message: data.message || 'DOUBLE_BOOKING_CONFLICT: This slot is already reserved.'
        });
        fetchBookingsData();
      } else if (data.status === 'success') {
        setBookingStatus({
          type: 'success',
          message: data.message || (data.isAutoApproved 
            ? `Instant Auto-Approval: Non-AC Venue ${selectedVenue} reserved!`
            : `AC Venue ${selectedVenue} booking submitted for admin review.`)
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
    <div className="card-surface p-5 space-y-4 font-sans shadow-xs">
      
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <div className="flex items-center space-x-2">
            <Building2 className="w-5 h-5 text-blue-600" />
            <h2 className="text-sm font-bold text-slate-900">Classroom Reservation & Schedule</h2>
            <span className="badge-success font-mono text-[10px]">
              Live Conflict Prevention
            </span>
          </div>
          <p className="text-xs text-slate-600 mt-0.5">
            Instant booking confirmation with zero double-booking or scheduling collisions.
          </p>
        </div>

        {/* Policy Badges */}
        <div className="flex items-center space-x-2 text-xs">
          <span className="badge-info">Standard Room: Instant</span>
          <span className="badge-warning">AC Room: Admin Review</span>
        </div>
      </div>

      {/* Reservation Form Controls */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 p-3.5 bg-slate-50 rounded-lg border border-slate-200 text-xs">
        <div className="md:col-span-5">
          <label className="block text-slate-700 font-semibold mb-1">Event / Lecture Title</label>
          <input
            type="text"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            placeholder="e.g. Machine Learning Lecture"
            className="w-full bg-white border border-slate-200 rounded-md px-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600"
          />
        </div>

        <div className="md:col-span-4">
          <label className="block text-slate-700 font-semibold mb-1">Select Venue</label>
          <select
            value={selectedVenue}
            onChange={(e) => setSelectedVenue(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-md px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600 font-semibold"
          >
            {venues.map(v => (
              <option key={v.id} value={v.room_number}>
                {v.room_number} ({v.type || 'Non-AC'}) — {v.building} [{v.capacity} seats]
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-3">
          <label className="block text-slate-700 font-semibold mb-1">Reservation Date</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-md px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600 font-mono"
          />
        </div>
      </div>

      {/* Status Notice */}
      {bookingStatus && (
        <div className={`p-3 rounded-lg text-xs flex items-center space-x-2 border ${
          bookingStatus.type === 'success' ? 'badge-success' : 'badge-error'
        }`}>
          {bookingStatus.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> : <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />}
          <span>{bookingStatus.message}</span>
        </div>
      )}

      {/* Table Display */}
      <div className="overflow-x-auto border border-slate-200 rounded-lg">
        <table className="table-light">
          <thead>
            <tr>
              <th>Time Slot</th>
              <th>Status</th>
              <th>Reserved By / Lecture Title</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {timeSlots.map((slot, idx) => {
              const booked = isSlotBooked(selectedVenue, selectedDate, slot);
              return (
                <tr key={idx}>
                  <td className="font-mono font-bold text-slate-900">{slot}</td>
                  <td>
                    {booked ? (
                      <span className="badge-error text-[10px]">
                        <span>Reserved</span>
                      </span>
                    ) : (
                      <span className="badge-success text-[10px]">
                        <span>Available</span>
                      </span>
                    )}
                  </td>
                  <td>
                    {booked ? (
                      <div className="text-xs">
                        <span className="font-bold text-slate-900 block">{booked.event_name}</span>
                        <span className="text-[11px] text-slate-500 font-mono">{booked.booked_by_email}</span>
                      </div>
                    ) : (
                      <span className="text-slate-400 text-xs italic">Open for reservation</span>
                    )}
                  </td>
                  <td>
                    <button
                      onClick={() => handleBookSlot(slot)}
                      disabled={Boolean(booked) || isSubmitting}
                      className={booked ? 'btn-secondary text-slate-400 opacity-50 cursor-not-allowed text-xs py-1 px-3' : 'btn-primary text-xs py-1 px-3'}
                    >
                      {booked ? (
                        <>
                          <Lock className="w-3.5 h-3.5" />
                          <span>Reserved</span>
                        </>
                      ) : (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>{isAcVenue ? 'Request AC Slot' : 'Book Instant'}</span>
                        </>
                      )}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

    </div>
  );
}
