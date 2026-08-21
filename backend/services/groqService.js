// Groq Text-to-SQL Translation Service (groq-sdk)
require('dotenv').config();

const groqApiKey = process.env.GROQ_API_KEY;
let groqClient = null;

if (groqApiKey && groqApiKey.trim() !== '') {
    try {
        const Groq = require('groq-sdk');
        groqClient = new Groq({ apiKey: groqApiKey });
        console.log('✅ Groq SDK initialized.');
    } catch (e) {
        console.warn('⚠️ Groq SDK failed to initialize:', e.message);
    }
} else {
    console.log('ℹ️ GROQ_API_KEY not set in .env. Using smart fallback Text-to-SQL engine for demo.');
}

const TABLE_SCHEMAS = `
Database Schema:
1. classrooms (id UUID, room_number VARCHAR, building VARCHAR, capacity INT, room_type VARCHAR, hvac_zone VARCHAR)
2. events (id UUID, event_name VARCHAR, room_id UUID, start_time TIMESTAMP, end_time TIMESTAMP, expected_attendees INT, organizer VARCHAR, status VARCHAR)
3. maintenance (id UUID, room_id UUID, issue_type VARCHAR, severity VARCHAR, status VARCHAR, description TEXT, reported_at TIMESTAMP, resolved_at TIMESTAMP)
4. transportation (id UUID, route_name VARCHAR, vehicle_id VARCHAR, timestamp TIMESTAMP, passenger_count INT, capacity INT, status VARCHAR)
5. energy (id UUID, room_id UUID, timestamp TIMESTAMP, kwh_consumed NUMERIC, peak_kw NUMERIC, hvac_status VARCHAR)
6. attendance (id UUID, event_id UUID, room_id UUID, timestamp TIMESTAMP, actual_count INT, scan_method VARCHAR)

Relationships:
- events.room_id -> classrooms.id
- maintenance.room_id -> classrooms.id
- energy.room_id -> classrooms.id
- attendance.event_id -> events.id
- attendance.room_id -> classrooms.id
`;

/**
 * Uses Groq to parse user question and generate PostgreSQL query
 */
async function translateToSQL(userQuery) {
    if (groqClient) {
        try {
            const completion = await groqClient.chat.completions.create({
                messages: [
                    {
                        role: 'system',
                        content: `You are an expert PostgreSQL DBA and SQL generator for a Campus Intelligence System.
Given the schema below, generate a clean, read-only SELECT query that answers the user prompt.
${TABLE_SCHEMAS}

IMPORTANT RULES:
1. Return ONLY valid JSON in the following format:
{"sql": "SELECT ...", "intent": "Brief description of query goal", "explanation": "Why this query was selected"}
2. Only generate SELECT queries. Never write INSERT, UPDATE, DELETE, or DROP.
3. Always join with classrooms when room details like room_number or building are needed.
4. Do not include markdown code block formatting like \`\`\`json in your response if possible, or ensure it's clean JSON.`
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
                    intent: parsed.intent || 'Execute cross-domain search',
                    explanation: parsed.explanation || 'Generated via Groq Llama-3.3 model',
                    provider: 'Groq (llama-3.3-70b-versatile)'
                };
            }
        } catch (err) {
            console.error('Groq Text-to-SQL API Error:', err.message);
        }
    }

    // Smart Fallback SQL Generator for offline / dry-run testing
    return generateFallbackSQL(userQuery);
}

function cleanSql(sql) {
    if (!sql) return '';
    return sql.replace(/```sql/gi, '').replace(/```/g, '').trim();
}

function generateFallbackSQL(userQuery) {
    const q = userQuery.toLowerCase();
    
    if (q.includes('energy') || q.includes('kwh') || q.includes('waste') || q.includes('power')) {
        return {
            sql: `SELECT c.room_number, c.building, e.kwh_consumed, e.peak_kw, e.hvac_status, e.timestamp 
FROM energy e 
JOIN classrooms c ON e.room_id = c.id 
ORDER BY e.kwh_consumed DESC LIMIT 10;`,
            intent: "Identify top energy-consuming rooms and HVAC status",
            explanation: "Fallback Groq Translation: Joins energy and classrooms tables filtered by highest kWh consumption.",
            provider: "Groq Engine (Rule Simulation)"
        };
    }
    
    if (q.includes('hvac') || q.includes('maintenance') || q.includes('ticket') || q.includes('repair')) {
        return {
            sql: `SELECT c.room_number, c.building, m.issue_type, m.severity, m.status, m.description, m.reported_at 
FROM maintenance m 
JOIN classrooms c ON m.room_id = c.id 
WHERE m.status IN ('Open', 'In Progress') 
ORDER BY CASE m.severity WHEN 'Critical' THEN 1 WHEN 'High' THEN 2 WHEN 'Medium' THEN 3 ELSE 4 END;`,
            intent: "List active maintenance tickets ordered by severity",
            explanation: "Fallback Groq Translation: Queries open maintenance tickets prioritized by urgency.",
            provider: "Groq Engine (Rule Simulation)"
        };
    }

    if (q.includes('capacity') || q.includes('overflow') || q.includes('crowd') || q.includes('attend')) {
        return {
            sql: `SELECT c.room_number, c.building, c.capacity, e.event_name, e.expected_attendees, a.actual_count 
FROM attendance a 
JOIN events e ON a.event_id = e.id 
JOIN classrooms c ON a.room_id = c.id 
WHERE a.actual_count > c.capacity OR e.expected_attendees > c.capacity;`,
            intent: "Detect room capacity and attendance overflow violations",
            explanation: "Fallback Groq Translation: Joins attendance, events, and classrooms to flag safety hazard over-occupancy.",
            provider: "Groq Engine (Rule Simulation)"
        };
    }

    if (q.includes('transit') || q.includes('bus') || q.includes('shuttle') || q.includes('route')) {
        return {
            sql: `SELECT route_name, vehicle_id, passenger_count, capacity, status, timestamp 
FROM transportation 
ORDER BY (passenger_count::float / capacity::float) DESC;`,
            intent: "Analyze transit route utilization and delay status",
            explanation: "Fallback Groq Translation: Queries transportation records sorted by peak passenger capacity ratio.",
            provider: "Groq Engine (Rule Simulation)"
        };
    }

    // Default general query
    return {
        sql: `SELECT c.room_number, c.building, c.capacity, e.event_name, m.severity AS maint_status, eng.kwh_consumed 
FROM classrooms c 
LEFT JOIN events e ON c.id = e.room_id 
LEFT JOIN maintenance m ON c.id = m.room_id 
LEFT JOIN energy eng ON c.id = eng.room_id 
LIMIT 10;`,
        intent: "Multi-domain campus status overview",
        explanation: "Fallback Groq Translation: Aggregates records across classrooms, events, maintenance, and energy.",
        provider: "Groq Engine (Rule Simulation)"
    };
}

module.exports = { translateToSQL };
