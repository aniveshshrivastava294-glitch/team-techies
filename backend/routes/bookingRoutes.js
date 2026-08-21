// Venue Booking & Availability Routes
const express = require('express');
const router = express.Router();
const { isConnectedToSupabase, supabase, getLocalData, mockStore } = require('../db');

// GET /api/bookings/venues - Available Classrooms & Venues
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

// POST /api/bookings - Submit Venue Booking Request
router.post('/', async (req, res) => {
    const { event_name, room_number, start_time, end_time, expected_attendees, organizer } = req.body;

    if (!event_name || !room_number) {
        return res.status(400).json({ error: 'Event name and Room number are required' });
    }

    const rooms = getLocalData('classrooms');
    const room = rooms.find(r => r.room_number === room_number);

    const newEvent = {
        id: `e-${Date.now()}`,
        event_name,
        room_id: room?.id || room_number,
        start_time: start_time || new Date().toISOString(),
        end_time: end_time || new Date(Date.now() + 7200000).toISOString(),
        expected_attendees: Number(expected_attendees) || 50,
        organizer: organizer || 'Faculty Reservation',
        status: 'Pending Approval',
        created_at: new Date().toISOString()
    };

    try {
        if (isConnectedToSupabase && supabase) {
            const { data, error } = await supabase.from('events').insert([newEvent]).select().single();
            if (!error && data) {
                return res.json({ status: 'success', booking: data });
            }
        }

        mockStore.events.unshift(newEvent);
        res.json({ status: 'success', booking: newEvent });
    } catch (err) {
        res.status(500).json({ error: 'Failed to submit booking', message: err.message });
    }
});

// PATCH /api/bookings/:id - Event Sub-Admin approves/rejects event booking
router.patch('/:id', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body; // 'Scheduled' | 'Cancelled'

    try {
        if (isConnectedToSupabase && supabase) {
            await supabase.from('events').update({ status }).eq('id', id);
        }

        const events = getLocalData('events');
        const target = events.find(e => e.id === id);
        if (target) {
            target.status = status;
        }

        res.json({ status: 'success', message: `Booking ${id} status updated to ${status}` });
    } catch (err) {
        res.status(500).json({ error: 'Failed to update booking status', message: err.message });
    }
});

module.exports = router;
