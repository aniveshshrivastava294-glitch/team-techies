// Faculty Leave Requests Route (Attendance Sub-Admin)
const express = require('express');
const router = express.Router();
const { isConnectedToSupabase, supabase, getLocalData, mockStore } = require('../db');

// GET /api/leaves - Fetch leave requests
router.get('/', async (req, res) => {
    try {
        let leaves = [];
        if (isConnectedToSupabase && supabase) {
            const { data } = await supabase.from('leave_requests').select('*');
            if (data) leaves = data;
        } else {
            leaves = getLocalData('leave_requests');
        }
        res.json({ status: 'success', count: leaves.length, leaves });
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch leave requests', message: err.message });
    }
});

// POST /api/leaves - Submit a new leave request
router.post('/', async (req, res) => {
    const { faculty_email, faculty_name, leave_type, start_date, end_date, reason } = req.body;

    if (!faculty_email || !reason) {
        return res.status(400).json({ error: 'Faculty email and reason are required' });
    }

    const todayStr = new Date().toISOString().split('T')[0];

    const newLeave = {
        id: `l-${Date.now()}`,
        faculty_email,
        faculty_name: faculty_name || faculty_email.split('@')[0],
        leave_type: leave_type || 'Casual Leave',
        start_date: start_date || todayStr,
        end_date: end_date || todayStr,
        reason,
        status: 'pending',
        created_at: new Date().toISOString()
    };

    try {
        if (isConnectedToSupabase && supabase) {
            const { data, error } = await supabase.from('leave_requests').insert([newLeave]).select().single();
            if (!error && data) return res.json({ status: 'success', leave: data });
        }

        if (!mockStore.leave_requests) mockStore.leave_requests = [];
        mockStore.leave_requests.unshift(newLeave);
        res.json({ status: 'success', leave: newLeave });
    } catch (err) {
        res.status(500).json({ error: 'Failed to submit leave request', message: err.message });
    }
});

// PATCH /api/leaves/:id - Attendance Sub-Admin approves/rejects leave
router.patch('/:id', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body; // 'approved' | 'rejected'

    try {
        if (isConnectedToSupabase && supabase) {
            await supabase.from('leave_requests').update({ status }).eq('id', id);
        }

        const leaves = getLocalData('leave_requests');
        const target = leaves.find(l => l.id === id);
        if (target) {
            target.status = status;
        }

        res.json({ status: 'success', message: `Leave request ${id} updated to ${status}` });
    } catch (err) {
        res.status(500).json({ error: 'Failed to update leave request', message: err.message });
    }
});

module.exports = router;
