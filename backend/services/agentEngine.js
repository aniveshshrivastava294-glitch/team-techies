// Agentic AI Engine with Gemini API Function Calling (@google/genai & Tool Declarations)
require('dotenv').config();
const { GoogleGenAI, Type } = require('@google/genai');
const { isConnectedToSupabase, supabase, getLocalData, mockStore } = require('../db');

const geminiApiKey = process.env.GEMINI_API_KEY;
let ai = null;

if (geminiApiKey && geminiApiKey.trim() !== '') {
    try {
        ai = new GoogleGenAI({ apiKey: geminiApiKey.trim() });
        console.log('✅ Agentic AI Engine (Gemini Function Calling) initialized.');
    } catch (e) {
        console.warn('⚠️ Gemini Agent SDK warning:', e.message);
    }
}

// -------------------------------------------------------------
// 1. TOOL FUNCTION HANDLERS (EXACT AGENT EXECUTABLES)
// -------------------------------------------------------------

async function handleCheckVenueAvailability({ date, time_slot, room_type }) {
    console.log(`🤖 [Agent Executed Tool]: checkVenueAvailability(date=${date}, slot=${time_slot})`);
    const todayStr = date || new Date().toISOString().split('T')[0];
    const targetSlot = time_slot || "14:00 - 15:30";

    const classrooms = getLocalData('classrooms');
    const bookings = getLocalData('bookings');

    const availableRooms = classrooms.filter(room => {
        if (room_type && !room.room_type.toLowerCase().includes(room_type.toLowerCase())) return false;
        
        const booked = bookings.find(b => 
            (b.venue_id === room.id || b.venue_name === room.room_number) &&
            b.date === todayStr &&
            b.time_slot === targetSlot &&
            ['approved', 'pending'].includes(b.status)
        );
        return !booked;
    });

    return {
        date: todayStr,
        time_slot: targetSlot,
        count: availableRooms.length,
        availableRooms: availableRooms.map(r => ({
            room_number: r.room_number,
            building: r.building,
            capacity: r.capacity,
            type: r.type || 'Non-AC'
        }))
    };
}

async function handleBookVenue({ room_number, date, time_slot, event_name, booked_by_email }) {
    console.log(`🤖 [Agent Executed Tool]: bookVenue(room=${room_number}, date=${date}, slot=${time_slot})`);
    const todayStr = date || new Date().toISOString().split('T')[0];
    const targetSlot = time_slot || "14:00 - 15:30";
    const userEmail = booked_by_email || "faculty@demo.com";

    const classrooms = getLocalData('classrooms');
    const room = classrooms.find(r => r.room_number === room_number) || classrooms[0];

    const venue_id = room.id;
    const venue_type = room.type || (room_number.includes('CS') || room_number.includes('ART') ? 'AC' : 'Non-AC');

    // Conflict Check
    const bookings = getLocalData('bookings');
    const conflict = bookings.find(b => 
        (b.venue_id === venue_id || b.venue_name === room_number) &&
        b.date === todayStr &&
        b.time_slot === targetSlot &&
        ['approved', 'pending'].includes(b.status)
    );

    if (conflict) {
        return {
            status: 'CONFLICT',
            message: `Room ${room_number} is already reserved on ${todayStr} during ${targetSlot} by ${conflict.booked_by_email}.`
        };
    }

    // Conditional Logic: Non-AC -> approved, AC -> pending
    const initialStatus = venue_type === 'Non-AC' ? 'approved' : 'pending';

    const newBooking = {
        id: `b-${Date.now()}`,
        venue_id,
        venue_name: room_number,
        booked_by_email: userEmail,
        date: todayStr,
        time_slot: targetSlot,
        status: initialStatus,
        event_name: event_name || "Campus Lecture / Session",
        venue_type,
        created_at: new Date().toISOString()
    };

    if (isConnectedToSupabase && supabase) {
        await supabase.from('bookings').insert([newBooking]);
    }
    if (!mockStore.bookings) mockStore.bookings = [];
    mockStore.bookings.unshift(newBooking);

    return {
        status: 'SUCCESS',
        bookingStatus: initialStatus,
        room_number,
        date: todayStr,
        time_slot: targetSlot,
        message: initialStatus === 'approved'
            ? `Successfully booked Non-AC Room ${room_number}. Booking is AUTO-APPROVED instantly!`
            : `Submitted booking for AC Room ${room_number}. Booking status is PENDING Event Admin review.`
    };
}

async function handleRaiseTicket({ title, description, assigned_domain, venue_name, raised_by_email }) {
    console.log(`🤖 [Agent Executed Tool]: raiseTicket(title="${title}", domain=${assigned_domain})`);
    const newTicket = {
        ticket_id: `50000000-0000-0000-0000-${String(Date.now()).slice(-12).padStart(12, '0')}`,
        raised_by_email: raised_by_email || 'faculty@demo.com',
        assigned_domain: assigned_domain || 'maintenance',
        title: title || 'Campus Flaw Report',
        description: description || 'Reported via Agentic AI assistant',
        status: 'open',
        venue_name: venue_name || 'General Campus',
        created_at: new Date().toISOString()
    };

    if (isConnectedToSupabase && supabase) {
        await supabase.from('tickets').insert([newTicket]);
    }
    if (!mockStore.tickets) mockStore.tickets = [];
    mockStore.tickets.unshift(newTicket);

    return {
        status: 'SUCCESS',
        ticket_id: newTicket.ticket_id,
        message: `Opened ticket "${title}" routed to ${assigned_domain.toUpperCase()} Sub-Admin Kanban board.`
    };
}

async function handleApproveLeave({ leave_id_or_name, status }) {
    console.log(`🤖 [Agent Executed Tool]: approveLeave(target="${leave_id_or_name}", status=${status})`);
    const targetStatus = status || 'approved';
    const leaves = getLocalData('leave_requests');

    const targetLeave = leaves.find(l => 
        l.id === leave_id_or_name ||
        l.faculty_name.toLowerCase().includes(leave_id_or_name.toLowerCase()) ||
        l.faculty_email.toLowerCase().includes(leave_id_or_name.toLowerCase())
    );

    if (!targetLeave) {
        return { status: 'NOT_FOUND', message: `Could not locate leave request matching '${leave_id_or_name}'.` };
    }

    targetLeave.status = targetStatus;

    if (isConnectedToSupabase && supabase) {
        await supabase.from('leave_requests').update({ status: targetStatus }).eq('id', targetLeave.id);
    }

    return {
        status: 'SUCCESS',
        leave_id: targetLeave.id,
        faculty_name: targetLeave.faculty_name,
        newStatus: targetStatus,
        message: `Successfully set leave request status for ${targetLeave.faculty_name} to '${targetStatus}'.`
    };
}

// -------------------------------------------------------------
// 2. MAIN AGENTIC CHAT ROUTER WITH GEMINI FUNCTION CALLING
// -------------------------------------------------------------

async function processAgentChat(userQuery, userRole = 'faculty', departmentDomain = 'general') {
    const key = process.env.GEMINI_API_KEY;

    if (key && key.trim() !== '' && ai) {
        try {
            // Function Declaration Specs for Gemini API
            const toolDeclarations = [
                {
                    name: 'checkVenueAvailability',
                    description: 'Checks available classrooms or venues for a given date and time slot.',
                    parameters: {
                        type: Type.OBJECT,
                        properties: {
                            date: { type: Type.STRING, description: 'Date in YYYY-MM-DD format (or "today", "tomorrow")' },
                            time_slot: { type: Type.STRING, description: 'Time slot e.g. "14:00 - 15:30" or "09:00 - 10:30"' },
                            room_type: { type: Type.STRING, description: 'Optional room type e.g. "Lecture Hall", "Auditorium", "Lab"' }
                        }
                    }
                },
                {
                    name: 'bookVenue',
                    description: 'Books a venue/classroom. AC rooms require Event Admin approval; Non-AC rooms auto-approve.',
                    parameters: {
                        type: Type.OBJECT,
                        properties: {
                            room_number: { type: Type.STRING, description: 'Room number e.g. "CS-301", "SCI-104"' },
                            date: { type: Type.STRING, description: 'Date YYYY-MM-DD' },
                            time_slot: { type: Type.STRING, description: 'Time slot e.g. "14:00 - 15:30"' },
                            event_name: { type: Type.STRING, description: 'Name of the event or lecture' },
                            booked_by_email: { type: Type.STRING, description: 'Faculty email address' }
                        },
                        required: ['room_number']
                    }
                },
                {
                    name: 'raiseTicket',
                    description: 'Raises a maintenance, energy, or transport issue ticket.',
                    parameters: {
                        type: Type.OBJECT,
                        properties: {
                            title: { type: Type.STRING, description: 'Brief title of the issue' },
                            description: { type: Type.STRING, description: 'Detailed issue description' },
                            assigned_domain: { type: Type.STRING, description: '"maintenance", "energy", "transport", or "events"' },
                            venue_name: { type: Type.STRING, description: 'Affected room or area' }
                        },
                        required: ['title', 'assigned_domain']
                    }
                },
                {
                    name: 'approveLeave',
                    description: 'Approves or rejects a faculty leave request (Attendance Admin tool).',
                    parameters: {
                        type: Type.OBJECT,
                        properties: {
                            leave_id_or_name: { type: Type.STRING, description: 'Faculty name or leave ID to approve/reject' },
                            status: { type: Type.STRING, description: '"approved" or "rejected"' }
                        },
                        required: ['leave_id_or_name', 'status']
                    }
                }
            ];

            const systemInstruction = `You are Campus Orbit AI, an autonomous Agentic AI assistant for a university campus intelligence platform.
You have direct access to executable tools to check room availability, book venues, raise issue tickets, and approve faculty leave requests.

User Context:
Role: ${userRole} | Department: ${departmentDomain}

INSTRUCTIONS:
1. If the user asks to book a room, check availability or book it directly using \`bookVenue\`.
2. Remember: Non-AC rooms auto-approve; AC rooms default to pending Event Admin review.
3. If the user asks to approve a leave (Attendance Admin), call \`approveLeave\`.
4. If a room is occupied, check free rooms and suggest alternatives.
5. Be warm, approachable, conversational, concise, and helpful. Avoid robotic tech jargon.`;

            let response;
            try {
                response = await ai.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: userQuery,
                    config: {
                        systemInstruction,
                        tools: [{ functionDeclarations: toolDeclarations }]
                    }
                });
            } catch (err25) {
                console.warn('gemini-2.5-flash busy, falling back to gemini-1.5-flash:', err25.message);
                response = await ai.models.generateContent({
                    model: 'gemini-1.5-flash',
                    contents: userQuery,
                    config: {
                        systemInstruction,
                        tools: [{ functionDeclarations: toolDeclarations }]
                    }
                });
            }

            // Check if Gemini invoked a tool function call
            const functionCalls = response.functionCalls;

            if (functionCalls && functionCalls.length > 0) {
                const call = functionCalls[0];
                console.log(`🤖 Agentic Tool Triggered by Gemini: ${call.name}`, call.args);

                let toolResult = null;
                if (call.name === 'checkVenueAvailability') toolResult = await handleCheckVenueAvailability(call.args);
                else if (call.name === 'bookVenue') toolResult = await handleBookVenue(call.args);
                else if (call.name === 'raiseTicket') toolResult = await handleRaiseTicket(call.args);
                else if (call.name === 'approveLeave') toolResult = await handleApproveLeave(call.args);

                // Second synthesis turn with tool execution output
                const followUpResponse = await ai.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: `Original User Question: "${userQuery}"
Executed Tool Name: ${call.name}
Tool Output: ${JSON.stringify(toolResult, null, 2)}

Provide a warm, clear, conversational summary of the action taken for the user.`,
                    config: { systemInstruction }
                });

                return {
                    answer: followUpResponse.text || JSON.stringify(toolResult),
                    toolExecuted: call.name,
                    toolDetails: toolResult,
                    provider: `Gemini 2.5 Flash Agentic Function Calling (${call.name})`
                };
            }

            // Direct Conversational Text Answer
            if (response.text) {
                return {
                    answer: response.text,
                    provider: 'Gemini 2.5 Flash Autonomous Agent'
                };
            }
        } catch (err) {
            console.error('Agent Engine Error:', err.message);
        }
    }

    // Fallback Rule Parser if API offline or dry-run
    return fallbackAgentProcess(userQuery, userRole, departmentDomain);
}

async function fallbackAgentProcess(userQuery, userRole, departmentDomain) {
    const q = userQuery.toLowerCase();

    if (q.includes('book') && (q.includes('ac') || q.includes('room') || q.includes('venue'))) {
        const result = await handleBookVenue({
            room_number: q.includes('ac') ? 'CS-301' : 'SCI-104',
            date: new Date().toISOString().split('T')[0],
            time_slot: '14:00 - 15:30',
            event_name: 'Special AI Seminar'
        });

        return {
            answer: result.message,
            toolExecuted: 'bookVenue',
            toolDetails: result,
            provider: 'Campus Orbit Agent (Local Fallback)'
        };
    }

    if (q.includes('approve') && (q.includes('leave') || q.includes('john') || q.includes('elena'))) {
        const target = q.includes('elena') ? 'Prof. Elena Rostova' : 'John Doe';
        const result = await handleApproveLeave({ leave_id_or_name: target, status: 'approved' });

        return {
            answer: result.message,
            toolExecuted: 'approveLeave',
            toolDetails: result,
            provider: 'Campus Orbit Agent (Local Fallback)'
        };
    }

    return {
        answer: `I am your Campus Orbit AI Agent. I can automatically book rooms, check slot availability, log issue tickets, or approve leave requests for you!`,
        provider: 'Campus Orbit Agent Assistant'
    };
}

module.exports = { processAgentChat, handleCheckVenueAvailability, handleBookVenue, handleRaiseTicket, handleApproveLeave };
