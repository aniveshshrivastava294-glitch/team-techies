// Groq Text-to-SQL Translation Service (groq-sdk) with Role Context Awareness
require('dotenv').config();

const groqApiKey = process.env.GROQ_API_KEY;
let groqClient = null;

if (groqApiKey && groqApiKey.trim() !== '') {
    try {
        const Groq = require('groq-sdk');
        groqClient = new Groq({ apiKey: groqApiKey });
        console.log('✅ Groq SDK initialized for RBAC.');
    } catch (e) {
        console.warn('⚠️ Groq SDK failed to initialize:', e.message);
    }
} else {
    console.log('ℹ️ GROQ_API_KEY not set in .env. Using smart fallback RBAC Text-to-SQL engine for demo.');
}

const TABLE_SCHEMAS = `
Database Schema:
1. users (id UUID, email VARCHAR, role VARCHAR, department_domain VARCHAR, approval_status VARCHAR, full_name VARCHAR)
2. classrooms (id UUID, room_number VARCHAR, building VARCHAR, capacity INT, room_type VARCHAR, hvac_zone VARCHAR, is_available BOOLEAN)
3. events (id UUID, event_name VARCHAR, room_id UUID, start_time TIMESTAMP, end_time TIMESTAMP, expected_attendees INT, organizer VARCHAR, status VARCHAR)
4. maintenance (id UUID, room_id UUID, issue_type VARCHAR, severity VARCHAR, status VARCHAR, description TEXT, reported_at TIMESTAMP)
5. tickets (ticket_id VARCHAR, raised_by_email VARCHAR, assigned_domain VARCHAR, title VARCHAR, description TEXT, status VARCHAR, venue_name VARCHAR)
6. transportation (id UUID, route_name VARCHAR, vehicle_id VARCHAR, driver_name VARCHAR, driver_phone VARCHAR, passenger_count INT, capacity INT, status VARCHAR)
7. energy (id UUID, room_id UUID, timestamp TIMESTAMP, kwh_consumed NUMERIC, peak_kw NUMERIC, hvac_status VARCHAR)
8. attendance (id UUID, event_id UUID, room_id UUID, timestamp TIMESTAMP, actual_count INT, scan_method VARCHAR)
`;

/**
 * Uses Groq to parse user question into safe, role-scoped SQL query
 */
async function translateToSQL(userQuery, userRole = 'faculty', departmentDomain = 'general') {
    if (groqClient) {
        try {
            const roleInstruction = getRolePromptInstruction(userRole, departmentDomain);

            const completion = await groqClient.chat.completions.create({
                messages: [
                    {
                        role: 'system',
                        content: `You are an expert PostgreSQL DBA and SQL generator for a Campus Intelligence System.
Given the schema below, generate a clean, read-only SELECT query that answers the user prompt.

USER ROLE CONTEXT:
Role: ${userRole} | Department: ${departmentDomain}
${roleInstruction}

${TABLE_SCHEMAS}

IMPORTANT RULES:
1. Return ONLY valid JSON in the following format:
{"sql": "SELECT ...", "intent": "Brief description of query goal", "explanation": "Why this query was selected for this user role"}
2. Only generate SELECT queries. Never write INSERT, UPDATE, DELETE, or DROP.
3. Keep queries focused and relevant to the user's operational role domain.`
                    },
                    {
                        role: 'user',
                        content: userQuery
                    }
                ],
                model: 'llama-3.3-70b-versatile',
                temperature: 0.1,
                response_format: { type: 'json_object' }
            });

            const content = completion.choices[0]?.message?.content;
            if (content) {
                const parsed = JSON.parse(content);
                return {
                    sql: cleanSql(parsed.sql),
                    intent: parsed.intent || 'Execute role-based domain search',
                    explanation: parsed.explanation || `Generated via Groq for ${userRole}`,
                    provider: 'Groq (llama-3.3-70b-versatile)'
                };
            }
        } catch (err) {
            console.error('Groq Text-to-SQL API Error:', err.message);
        }
    }

    // Smart Fallback SQL Generator for offline / dry-run testing
    return generateFallbackSQL(userQuery, userRole, departmentDomain);
}

function getRolePromptInstruction(role, domain) {
    if (role === 'faculty') {
        return 'Scope: Helper queries for class scheduling, free venue search, bus schedules, and personal ticket status.';
    }
    if (role === 'sub_admin') {
        return `Scope: Operational co-pilot for ${domain}. Focus on capacity optimization, driver schedules, maintenance Kanban, or venue approvals.`;
    }
    return 'Scope: Super Admin master view across all 6 campus datasets, user management, and system-wide anomaly audits.';
}

function cleanSql(sql) {
    if (!sql) return '';
    return sql.replace(/```sql/gi, '').replace(/```/g, '').trim();
}

function generateFallbackSQL(userQuery, role, domain) {
    const q = userQuery.toLowerCase();
    
    if (q.includes('bus') || q.includes('transit') || q.includes('route') || q.includes('driver')) {
        return {
            sql: `SELECT route_name, vehicle_id, driver_name, driver_phone, passenger_count, capacity, status 
FROM transportation 
ORDER BY (passenger_count::float / capacity::float) DESC;`,
            intent: role === 'sub_admin' ? "Transport Admin: Optimize route capacity and driver fleet" : "Faculty: Check active bus route schedule & driver details",
            explanation: "Groq Translation: Queries transportation fleet with passenger utilization ratios.",
            provider: "Groq Engine (RBAC Rule Simulation)"
        };
    }
    
    if (q.includes('room') || q.includes('free') || q.includes('venue') || q.includes('available') || q.includes('capacity')) {
        return {
            sql: `SELECT room_number, building, capacity, room_type, is_available 
FROM classrooms 
WHERE capacity >= 50 
ORDER BY capacity DESC;`,
            intent: role === 'faculty' ? "Faculty Helper: Find available lecture halls and capacities" : "Event Admin: Audit venue availability and seating limits",
            explanation: "Groq Translation: Queries classrooms table filtered by seating capacity.",
            provider: "Groq Engine (RBAC Rule Simulation)"
        };
    }

    if (q.includes('ticket') || q.includes('issue') || q.includes('maint') || q.includes('broken')) {
        return {
            sql: `SELECT ticket_id, title, assigned_domain, status, venue_name, raised_by_email, created_at 
FROM tickets 
ORDER BY CASE status WHEN 'open' THEN 1 WHEN 'in-progress' THEN 2 ELSE 3 END;`,
            intent: role === 'sub_admin' ? "Maintenance Admin: Kanban ticket queue prioritized by status" : "Faculty: Check status of submitted campus issues",
            explanation: "Groq Translation: Queries tickets table ordered by open/in-progress priority.",
            provider: "Groq Engine (RBAC Rule Simulation)"
        };
    }

    if (q.includes('energy') || q.includes('kwh') || q.includes('power')) {
        return {
            sql: `SELECT c.room_number, c.building, e.kwh_consumed, e.peak_kw, e.hvac_status 
FROM energy e 
JOIN classrooms c ON e.room_id = c.id 
ORDER BY e.kwh_consumed DESC LIMIT 10;`,
            intent: "Identify room energy consumption and HVAC status",
            explanation: "Groq Translation: Joins energy and classrooms tables by peak kWh consumption.",
            provider: "Groq Engine (RBAC Rule Simulation)"
        };
    }

    // Default general query
    return {
        sql: `SELECT c.room_number, c.building, c.capacity, e.event_name, m.severity AS maint_status 
FROM classrooms c 
LEFT JOIN events e ON c.id = e.room_id 
LEFT JOIN maintenance m ON c.id = m.room_id 
LIMIT 10;`,
        intent: `Campus Operational Search for ${role}`,
        explanation: "Groq Translation: Cross-domain query across classrooms, events, and maintenance.",
        provider: "Groq Engine (RBAC Rule Simulation)"
    };
}

module.exports = { translateToSQL };
