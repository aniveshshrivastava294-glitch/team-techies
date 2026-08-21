// Real-Time Venue Booking Engine with AC vs Non-AC Conditional Approval & Conflict Checking
const express = require('express');
const router = express.Router();
const { isConnectedToSupabase, supabase, getLocalData, mockStore } = require('../db');

// GET /api/bookings - Fetch bookings matrix
router.get('/', async (req, res) => {
    try {
        let bookings = [];
        if (isConnectedToSupabase && supabase) {
            const { data } = await supabase.from('bookings').select('*');
            if (data) bookings = data;
        } else {
            bookings = getLocalData('bookings');
        }
        res.json({ status: 'success', count: bookings.length, bookings });
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch bookings', message: err.message });
    }
});

// GET /api/bookings/venues - Available Classrooms & Venues with AC / Non-AC types
router.get('/venues', async (req, res) => {
    try {
        let rooms = [];
        if (isConnectedToSupabase && supabase) {
            const { data } = await supabase.from('classrooms').select('*');
            if (data) rooms = data;
        } else {
            rooms = getLocalData('classrooms');
        }

        res.json({ status: 'success', count: rooms.length, venues: rooms });
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch venues', message: err.message });
    }
});

// POST /api/bookings - Submit Venue Booking with Conflict Prevention & Conditional Logic
router.post('/', async (req, res) => {
    const { event_name, room_number, date, time_slot, booked_by_email } = req.body;

    if (!event_name || !room_number || !date || !time_slot) {
        return res.status(400).json({ error: 'Event name, Room number, Date, and Time Slot are required' });
    }

    const rooms = getLocalData('classrooms');
    const room = rooms.find(r => r.room_number === room_number);

    const venue_id = room?.id || `20000000-0000-0000-0000-000000000001`;
    const venue_type = room?.type || (room_number.includes('CS') || room_number.includes('ART') ? 'AC' : 'Non-AC');

    // 1. Conflict Check: Look for existing bookings on same venue_id + date + time_slot
    const existingBookings = getLocalData('bookings');
    const conflict = existingBookings.find(b => 
        (b.venue_id === venue_id || b.venue_name === room_number) &&
        b.date === date &&
        b.time_slot === time_slot &&
        ['approved', 'pending'].includes(b.status)
    );

    if (conflict) {
        return res.status(409).json({
            error: 'DOUBLE_BOOKING_CONFLICT',
            message: `Conflict: Room ${room_number} is already booked on ${date} during ${time_slot} by ${conflict.booked_by_email}.`
        });
    }

    // 2. Conditional Approval Logic:
    // Non-AC -> Auto-Approved instantly!
    // AC -> Default to 'pending' (triggers Event Admin review)
    const initialStatus = venue_type === 'Non-AC' ? 'approved' : 'pending';

    const newBooking = {
        id: `b-${Date.now()}`,
        venue_id,
        venue_name: room_number,
        booked_by_email: booked_by_email || 'faculty@demo.com',
        date,
        time_slot,
        status: initialStatus,
        event_name,
        venue_type,
        created_at: new Date().toISOString()
    };

    try {
        if (isConnectedToSupabase && supabase) {
            const { data, error } = await supabase.from('bookings').insert([newBooking]).select().single();
            if (!error && data) {
                return res.json({ status: 'success', booking: data, isAutoApproved: initialStatus === 'approved' });
            }
            if (error && error.code === '23505') { // Unique constraint violation
                return res.status(409).json({
                    error: 'DOUBLE_BOOKING_CONFLICT',
                    message: `Database Conflict: ${room_number} slot ${time_slot} is already taken.`
                });
            }
        }

        if (!mockStore.bookings) mockStore.bookings = [];
        mockStore.bookings.unshift(newBooking);

        res.json({
            status: 'success',
            booking: newBooking,
            isAutoApproved: initialStatus === 'approved',
            message: initialStatus === 'approved' 
                ? `Booking auto-approved instantly for Non-AC venue ${room_number}!` 
                : `AC Venue ${room_number} booking submitted for Event Sub-Admin approval.`
        });
    } catch (err) {
        res.status(500).json({ error: 'Failed to submit booking', message: err.message });
    }
});

// PATCH /api/bookings/:id - Event Sub-Admin approves/rejects event booking
router.patch('/:id', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body; // 'approved' | 'rejected'

    try {
        if (isConnectedToSupabase && supabase) {
            await supabase.from('bookings').update({ status }).eq('id', id);
        }

        const bookings = getLocalData('bookings');
        const target = bookings.find(b => b.id === id);
        if (target) {
            target.status = status;
        }

        res.json({ status: 'success', message: `Booking ${id} status updated to ${status}` });
    } catch (err) {
        res.status(500).json({ error: 'Failed to update booking status', message: err.message });
    }
});

module.exports = router;
