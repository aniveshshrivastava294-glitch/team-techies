// Ticket Management Routes (Faculty Issues -> Domain Sub-Admins)
const express = require('express');
const router = express.Router();
const { isConnectedToSupabase, supabase, getLocalData, mockStore } = require('../db');

// GET /api/tickets - Fetch tickets filtered by domain / user
router.get('/', async (req, res) => {
    const { domain, userEmail } = req.query;

    try {
        let tickets = [];
        if (isConnectedToSupabase && supabase) {
            let query = supabase.from('tickets').select('*');
            if (domain && domain !== 'all') query = query.eq('assigned_domain', domain);
            if (userEmail) query = query.eq('raised_by_email', userEmail);
            const { data } = await query;
            if (data) tickets = data;
        } else {
            tickets = getLocalData('tickets');
            if (domain && domain !== 'all') {
                tickets = tickets.filter(t => t.assigned_domain === domain);
            }
            if (userEmail) {
                tickets = tickets.filter(t => t.raised_by_email === userEmail);
            }
        }

        res.json({ status: 'success', count: tickets.length, tickets });
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch tickets', message: err.message });
    }
});

// POST /api/tickets - Faculty raises an issue
router.post('/', async (req, res) => {
    const { title, description, assigned_domain, venue_name, raised_by_email } = req.body;

    if (!title || !description) {
        return res.status(400).json({ error: 'Title and Description are required' });
    }

    const newTicket = {
        ticket_id: `tk-${Date.now()}`,
        title,
        description,
        assigned_domain: assigned_domain || 'maintenance',
        venue_name: venue_name || 'Campus Venue',
        raised_by_email: raised_by_email || 'faculty@demo.com',
        status: 'open',
        created_at: new Date().toISOString()
    };

    try {
        if (isConnectedToSupabase && supabase) {
            const { data, error } = await supabase.from('tickets').insert([newTicket]).select().single();
            if (!error && data) {
                return res.json({ status: 'success', ticket: data });
            }
        }

        mockStore.tickets.unshift(newTicket);
        res.json({ status: 'success', ticket: newTicket });
    } catch (err) {
        res.status(500).json({ error: 'Failed to create ticket', message: err.message });
    }
});

// PATCH /api/tickets/:id - Sub-Admin updates ticket status (open -> in-progress -> resolved)
router.patch('/:id', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
        return res.status(400).json({ error: 'Status is required' });
    }

    try {
        if (isConnectedToSupabase && supabase) {
            await supabase.from('tickets').update({ status }).eq('ticket_id', id);
        }

        const tickets = getLocalData('tickets');
        const target = tickets.find(t => t.ticket_id === id);
        if (target) {
            target.status = status;
        }

        res.json({ status: 'success', message: `Ticket ${id} updated to ${status}` });
    } catch (err) {
        res.status(500).json({ error: 'Failed to update ticket status', message: err.message });
    }
});

module.exports = router;
