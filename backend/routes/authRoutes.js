// Authentication & User Approval Routes for RBAC
const express = require('express');
const router = express.Router();
const { isConnectedToSupabase, supabase, getLocalData, mockStore } = require('../db');

// POST /api/auth/login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }

    try {
        let user = null;
        if (isConnectedToSupabase && supabase) {
            const { data } = await supabase.from('users').select('*').eq('email', email.trim().toLowerCase()).single();
            if (data) user = data;
        }

        if (!user) {
            const users = getLocalData('users');
            user = users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
        }

        if (!user) {
            return res.status(401).json({ error: 'User not found with this email' });
        }

        // Demo password check (flexible for hackathon demo)
        res.json({
            status: 'success',
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                department_domain: user.department_domain,
                approval_status: user.approval_status,
                full_name: user.full_name
            },
            token: `demo-jwt-token-${user.id}-${Date.now()}`
        });
    } catch (err) {
        res.status(500).json({ error: 'Login error', message: err.message });
    }
});

// POST /api/auth/register
router.post('/register', async (req, res) => {
    const { email, password, role, department_domain, full_name } = req.body;

    if (!email || !role) {
        return res.status(400).json({ error: 'Email and Role are required' });
    }

    const cleanRole = role.toLowerCase();
    const cleanEmail = email.trim().toLowerCase();

    // Faculty auto-approves; Sub-Admins remain 'pending'
    const approval_status = cleanRole === 'faculty' ? 'approved' : 'pending';
    const domain = department_domain || 'general';

    const newUser = {
        id: `u-${Date.now()}`,
        email: cleanEmail,
        password_hash: password || 'demo123',
        role: cleanRole,
        department_domain: domain,
        approval_status,
        full_name: full_name || cleanEmail.split('@')[0],
        created_at: new Date().toISOString()
    };

    try {
        if (isConnectedToSupabase && supabase) {
            const { data, error } = await supabase.from('users').insert([newUser]).select().single();
            if (!error && data) {
                return res.json({ status: 'success', user: data });
            }
        }

        // Local Store fallback
        mockStore.users.push(newUser);
        res.json({ status: 'success', user: newUser });
    } catch (err) {
        res.status(500).json({ error: 'Registration error', message: err.message });
    }
});

// GET /api/auth/pending-users - List Sub-Admins awaiting Super Admin approval
router.get('/pending-users', async (req, res) => {
    try {
        let pending = [];
        if (isConnectedToSupabase && supabase) {
            const { data } = await supabase.from('users').select('*').eq('approval_status', 'pending');
            if (data) pending = data;
        } else {
            const users = getLocalData('users');
            pending = users.filter(u => u.approval_status === 'pending');
        }

        res.json({ status: 'success', count: pending.length, pending });
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch pending approvals', message: err.message });
    }
});

// POST /api/auth/approve-user - Approve or Reject Sub-Admin
router.post('/approve-user', async (req, res) => {
    const { userId, status } = req.body; // status: 'approved' | 'rejected'
    if (!userId || !status) {
        return res.status(400).json({ error: 'userId and status are required' });
    }

    try {
        if (isConnectedToSupabase && supabase) {
            await supabase.from('users').update({ approval_status: status }).eq('id', userId);
        }

        // Update local mock store
        const users = getLocalData('users');
        const target = users.find(u => u.id === userId || u.email === userId);
        if (target) {
            target.approval_status = status;
        }

        res.json({ status: 'success', message: `User status updated to ${status}`, userId });
    } catch (err) {
        res.status(500).json({ error: 'Approval update error', message: err.message });
    }
});

module.exports = router;
