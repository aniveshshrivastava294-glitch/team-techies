// Express AI Orchestration Backend for Campus Intelligence Dashboard (SW-01-P)
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { isConnectedToSupabase, supabase, getLocalData } = require('./db');
const { detectAnomalies } = require('./services/anomalyEngine');
const { generateRecommendations, synthesizeAnswer } = require('./services/geminiService');
const { translateToSQL } = require('./services/groqService');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// -------------------------------------------------------------
// 1. GET /api/kpis - Aggregated Statistics Across 6 Domains
// -------------------------------------------------------------
app.get('/api/kpis', async (req, res) => {
    try {
        let classrooms = [], events = [], maintenance = [], transportation = [], energy = [], attendance = [];

        if (isConnectedToSupabase && supabase) {
            const [rC, rE, rM, rT, rEng, rAtt] = await Promise.all([
                supabase.from('classrooms').select('id, capacity'),
                supabase.from('events').select('id, status'),
                supabase.from('maintenance').select('id, status, severity'),
                supabase.from('transportation').select('id, passenger_count, capacity'),
                supabase.from('energy').select('id, kwh_consumed'),
                supabase.from('attendance').select('id, actual_count')
            ]);
            classrooms = rC.data || [];
            events = rE.data || [];
            maintenance = rM.data || [];
            transportation = rT.data || [];
            energy = rEng.data || [];
            attendance = rAtt.data || [];
        } else {
            classrooms = getLocalData('classrooms');
            events = getLocalData('events');
            maintenance = getLocalData('maintenance');
            transportation = getLocalData('transportation');
            energy = getLocalData('energy');
            attendance = getLocalData('attendance');
        }

        const totalClassrooms = classrooms.length;
        const totalCapacity = classrooms.reduce((sum, c) => sum + (c.capacity || 0), 0);
        const scheduledEvents = events.filter(e => e.status === 'Scheduled').length;
        const openMaintenance = maintenance.filter(m => ['Open', 'In Progress'].includes(m.status)).length;
        const criticalMaintenance = maintenance.filter(m => m.severity === 'Critical' && m.status === 'Open').length;
        
        const totalTransitRiders = transportation.reduce((sum, t) => sum + (t.passenger_count || 0), 0);
        const totalTransitCap = transportation.reduce((sum, t) => sum + (t.capacity || 0), 0);
        const transitUtilPercent = totalTransitCap > 0 ? Math.round((totalTransitRiders / totalTransitCap) * 100) : 78;
        
        const totalKwh = energy.reduce((sum, e) => sum + Number(e.kwh_consumed || 0), 0);
        const avgKwhPerRoom = totalClassrooms > 0 ? (totalKwh / totalClassrooms).toFixed(1) : 38.5;
        const totalActualAttendance = attendance.reduce((sum, a) => sum + (a.actual_count || 0), 0);

        res.json({
            status: 'success',
            kpis: {
                totalClassrooms,
                totalCapacity,
                scheduledEvents,
                openMaintenance,
                criticalMaintenance,
                transitRiders: totalTransitRiders,
                transitUtilizationPercent: transitUtilPercent,
                totalEnergyKwh: totalKwh.toFixed(1),
                avgKwhPerRoom,
                dailyAttendanceCount: totalActualAttendance
            },
            datasource: isConnectedToSupabase ? 'Supabase PostgreSQL' : 'Local Synthetic Database'
        });
    } catch (err) {
        console.error('KPI Endpoint Error:', err);
        res.status(500).json({ error: 'Failed to aggregate KPI statistics', message: err.message });
    }
});

// -------------------------------------------------------------
// 2. GET /api/anomalies - Hybrid Detection Engine
// -------------------------------------------------------------
app.get('/api/anomalies', async (req, res) => {
    try {
        const anomalies = await detectAnomalies();
        res.json({
            status: 'success',
            count: anomalies.length,
            anomalies
        });
    } catch (err) {
        console.error('Anomalies Endpoint Error:', err);
        res.status(500).json({ error: 'Failed to run anomaly detection engine', message: err.message });
    }
});

// -------------------------------------------------------------
// 3. GET /api/recommendations - Gemini API Actionable Fixes
// -------------------------------------------------------------
app.get('/api/recommendations', async (req, res) => {
    try {
        const anomalies = await detectAnomalies();
        const recommendations = await generateRecommendations(anomalies);
        res.json({
            status: 'success',
            count: recommendations.length,
            recommendations
        });
    } catch (err) {
        console.error('Recommendations Endpoint Error:', err);
        res.status(500).json({ error: 'Failed to generate recommendations from Gemini API', message: err.message });
    }
});

// -------------------------------------------------------------
// 4. POST /api/chat - Natural Language Query Pipeline (Groq -> Supabase -> Gemini)
// -------------------------------------------------------------
app.post('/api/chat', async (req, res) => {
    const { query } = req.body;
    if (!query || query.trim() === '') {
        return res.status(400).json({ error: 'Query string is required' });
    }

    try {
        console.log(`💬 Processing NL Query: "${query}"`);

        // Step A: Groq Text-to-SQL Translation
        const sqlTranslation = await translateToSQL(query);
        console.log(`⚡ Groq Generated SQL: ${sqlTranslation.sql}`);

        // Step B: Execute Query on Supabase (or Fallback Store)
        let queryResults = [];
        if (isConnectedToSupabase && supabase) {
            try {
                // Execute RPC or SQL query via Supabase if setup, else fetch related domain tables
                const { data, error } = await supabase.rpc('execute_read_only_sql', { sql_query: sqlTranslation.sql });
                if (!error && data) {
                    queryResults = data;
                } else {
                    // Fallback to table sampling if custom RPC function is not created
                    queryResults = await fetchDomainFallbackForSql(sqlTranslation.sql);
                }
            } catch (sqle) {
                console.warn('Supabase query execution fallback:', sqle.message);
                queryResults = await fetchDomainFallbackForSql(sqlTranslation.sql);
            }
        } else {
            queryResults = await fetchDomainFallbackForSql(sqlTranslation.sql);
        }

        // Step C: Route Raw Data to Gemini for Conversational Answer Synthesis
        const geminiSynthesis = await synthesizeAnswer(query, sqlTranslation.sql, queryResults);

        res.json({
            status: 'success',
            query,
            groq: {
                sql: sqlTranslation.sql,
                intent: sqlTranslation.intent,
                explanation: sqlTranslation.explanation,
                provider: sqlTranslation.provider
            },
            dataCount: queryResults.length,
            rawResults: queryResults,
            gemini: {
                answer: geminiSynthesis.answer,
                provider: geminiSynthesis.provider
            }
        });
    } catch (err) {
        console.error('Chat Pipeline Error:', err);
        res.status(500).json({ error: 'Failed to process AI chat query pipeline', message: err.message });
    }
});

// Helper for local SQL simulation data extraction
async function fetchDomainFallbackForSql(sql) {
    const s = sql.toLowerCase();
    if (s.includes('energy')) {
        const eng = getLocalData('energy');
        const rooms = getLocalData('classrooms');
        return eng.map(e => {
            const r = rooms.find(rc => rc.id === e.room_id) || { room_number: 'LIB-102', building: 'Main Library' };
            return { room_number: r.room_number, building: r.building, kwh_consumed: e.kwh_consumed, hvac_status: e.hvac_status, timestamp: e.timestamp };
        });
    }
    if (s.includes('maintenance')) {
        const maint = getLocalData('maintenance');
        const rooms = getLocalData('classrooms');
        return maint.map(m => {
            const r = rooms.find(rc => rc.id === m.room_id) || { room_number: 'CS-301', building: 'Computer Science Hall' };
            return { room_number: r.room_number, building: r.building, issue_type: m.issue_type, severity: m.severity, status: m.status, description: m.description };
        });
    }
    if (s.includes('transportation') || s.includes('route')) {
        return getLocalData('transportation');
    }
    if (s.includes('attendance') || s.includes('capacity')) {
        const att = getLocalData('attendance');
        const rooms = getLocalData('classrooms');
        const events = getLocalData('events');
        return att.map(a => {
            const r = rooms.find(rc => rc.id === a.room_id) || { room_number: 'SCI-104', capacity: 60 };
            const e = events.find(ev => ev.id === a.event_id) || { event_name: 'Quantum Physics 101' };
            return { room_number: r.room_number, capacity: r.capacity, event_name: e.event_name, actual_count: a.actual_count };
        });
    }
    // Return sample classrooms
    return getLocalData('classrooms');
}

// -------------------------------------------------------------
// 5. GET /api/domains/:domain - Inspect Raw Domain Datasets
// -------------------------------------------------------------
app.get('/api/domains/:domain', async (req, res) => {
    const domain = req.params.domain.toLowerCase();
    const validDomains = ['classrooms', 'events', 'maintenance', 'transportation', 'energy', 'attendance'];

    if (!validDomains.includes(domain)) {
        return res.status(400).json({ error: `Invalid domain. Must be one of: ${validDomains.join(', ')}` });
    }

    try {
        let records = [];
        if (isConnectedToSupabase && supabase) {
            const { data, error } = await supabase.from(domain).select('*');
            if (!error && data) records = data;
            else records = getLocalData(domain);
        } else {
            records = getLocalData(domain);
        }

        res.json({
            status: 'success',
            domain,
            count: records.length,
            records
        });
    } catch (err) {
        res.status(500).json({ error: `Failed to fetch domain data for ${domain}`, message: err.message });
    }
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'online',
        uptime: process.uptime(),
        database: isConnectedToSupabase ? 'Supabase Connected' : 'Local Fallback Engine',
        aiProviders: {
            groq: Boolean(process.env.GROQ_API_KEY),
            gemini: Boolean(process.env.GEMINI_API_KEY)
        }
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Campus Orbit AI Express Server running on http://localhost:${PORT}`);
});
