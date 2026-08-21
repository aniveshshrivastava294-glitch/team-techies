// Hybrid Anomaly Detection Engine (Deterministic Rules + Statistical Outliers)
const { isConnectedToSupabase, supabase, getLocalData } = require('../db');

/**
 * Detects cross-domain anomalies across Classrooms, Events, Maintenance, Transportation, Energy, and Attendance
 */
async function detectAnomalies() {
    let classrooms = [];
    let events = [];
    let maintenance = [];
    let transportation = [];
    let energy = [];
    let attendance = [];

    if (isConnectedToSupabase && supabase) {
        try {
            const [rC, rE, rM, rT, rEng, rAtt] = await Promise.all([
                supabase.from('classrooms').select('*'),
                supabase.from('events').select('*'),
                supabase.from('maintenance').select('*'),
                supabase.from('transportation').select('*'),
                supabase.from('energy').select('*'),
                supabase.from('attendance').select('*')
            ]);
            classrooms = rC.data || [];
            events = rE.data || [];
            maintenance = rM.data || [];
            transportation = rT.data || [];
            energy = rEng.data || [];
            attendance = rAtt.data || [];
        } catch (e) {
            console.warn('Error fetching from Supabase for anomaly engine, utilizing local store:', e.message);
            classrooms = getLocalData('classrooms');
            events = getLocalData('events');
            maintenance = getLocalData('maintenance');
            transportation = getLocalData('transportation');
            energy = getLocalData('energy');
            attendance = getLocalData('attendance');
        }
    } else {
        classrooms = getLocalData('classrooms');
        events = getLocalData('events');
        maintenance = getLocalData('maintenance');
        transportation = getLocalData('transportation');
        energy = getLocalData('energy');
        attendance = getLocalData('attendance');
    }

    const detected = [];

    // Rule 1: Cross-Domain Conflict - Event scheduled in room with Open Critical/High Maintenance Ticket
    for (const ev of events) {
        const room = classrooms.find(c => c.id === ev.room_id || c.room_number === ev.room_id);
        const roomTickets = maintenance.filter(m => 
            (m.room_id === ev.room_id || m.room_id === room?.id) && 
            ['Open', 'In Progress'].includes(m.status) && 
            ['Critical', 'High'].includes(m.severity)
        );

        if (roomTickets.length > 0) {
            for (const ticket of roomTickets) {
                detected.push({
                    id: `anom-maint-${ev.id}`,
                    type: 'HVAC_EVENT_CONFLICT',
                    severity: ticket.severity === 'Critical' ? 'Critical' : 'High',
                    category: 'Facility & Maintenance',
                    title: `Critical Conflict: Event in Room ${room?.room_number || 'CS-301'} with Unresolved ${ticket.issue_type} Ticket`,
                    location: `${room?.building || 'Campus'} - ${room?.room_number || 'CS-301'}`,
                    metric: `Expected Attendees: ${ev.expected_attendees} | Issue: ${ticket.issue_type} (${ticket.status})`,
                    details: {
                        event_name: ev.event_name,
                        room: room?.room_number || 'CS-301',
                        expected_attendees: ev.expected_attendees,
                        ticket_id: ticket.id,
                        issue_type: ticket.issue_type,
                        ticket_status: ticket.status,
                        description: ticket.description
                    },
                    detectedAt: new Date().toISOString()
                });
            }
        }
    }

    // Rule 2: Statistical Outlier - Ghost Energy Consumption (High kWh with low/zero occupancy)
    const avgKwh = energy.length > 0 ? energy.reduce((sum, e) => sum + Number(e.kwh_consumed), 0) / energy.length : 15;
    const stdDevKwh = energy.length > 0 ? Math.sqrt(energy.reduce((sum, e) => sum + Math.pow(Number(e.kwh_consumed) - avgKwh, 2), 0) / energy.length) : 10;

    for (const eng of energy) {
        const kwh = Number(eng.kwh_consumed);
        const zScore = stdDevKwh > 0 ? (kwh - avgKwh) / stdDevKwh : 0;

        // If kWh is > 2 standard deviations above mean
        if (zScore > 1.8 || kwh > 40) {
            const room = classrooms.find(c => c.id === eng.room_id);
            const hour = new Date(eng.timestamp).getHours();
            const isNight = hour >= 22 || hour <= 5;

            detected.push({
                id: `anom-energy-${eng.id}`,
                type: 'GHOST_ENERGY_CONSUMPTION',
                severity: isNight ? 'High' : 'Medium',
                category: 'Energy & Sustainability',
                title: `Energy Spike in ${room?.room_number || 'LIB-102'} (${kwh.toFixed(1)} kWh) ${isNight ? '[Night Off-Hours]' : ''}`,
                location: `${room?.building || 'Library'} - ${room?.room_number || 'LIB-102'}`,
                metric: `Current Usage: ${kwh.toFixed(1)} kWh (Baseline Avg: ${avgKwh.toFixed(1)} kWh) | Z-Score: ${zScore.toFixed(2)}`,
                details: {
                    room: room?.room_number || 'LIB-102',
                    kwh: kwh,
                    peak_kw: eng.peak_kw,
                    hvac_status: eng.hvac_status,
                    timestamp: eng.timestamp,
                    isOffHours: isNight
                },
                detectedAt: new Date().toISOString()
            });
        }
    }

    // Rule 3: Attendance Overflow Capacity Violation (Actual count > Room capacity)
    for (const att of attendance) {
        const room = classrooms.find(c => c.id === att.room_id);
        const ev = events.find(e => e.id === att.event_id);

        if (room && att.actual_count > room.capacity) {
            const overflowPercent = Math.round(((att.actual_count - room.capacity) / room.capacity) * 100);

            detected.push({
                id: `anom-capacity-${att.id}`,
                type: 'ATTENDANCE_OVERFLOW',
                severity: overflowPercent > 50 ? 'Critical' : 'High',
                category: 'Safety & Capacity',
                title: `Occupancy Safety Code Breach in ${room.room_number}: ${overflowPercent}% Over Capacity`,
                location: `${room.building} - ${room.room_number}`,
                metric: `Actual Scanned: ${att.actual_count} | Room Capacity Limit: ${room.capacity}`,
                details: {
                    event_name: ev?.event_name || 'Scheduled Lecture',
                    room: room.room_number,
                    actual: att.actual_count,
                    capacity: room.capacity,
                    overflowPercent: overflowPercent
                },
                detectedAt: new Date().toISOString()
            });
        }
    }

    // Rule 4: Transportation Overcrowding & Delays
    for (const tr of transportation) {
        const utilRatio = tr.passenger_count / tr.capacity;
        if (utilRatio > 1.2 || tr.status === 'Overcrowded') {
            detected.push({
                id: `anom-transit-${tr.id}`,
                type: 'TRANSIT_OVERCROWDING',
                severity: utilRatio > 1.3 ? 'High' : 'Medium',
                category: 'Transportation',
                title: `Transit Overcrowding on ${tr.route_name} (${Math.round(utilRatio * 100)}% Utilization)`,
                location: tr.route_name,
                metric: `Riders: ${tr.passenger_count} / Capacity: ${tr.capacity} (${tr.status})`,
                details: {
                    route: tr.route_name,
                    vehicle_id: tr.vehicle_id,
                    passengers: tr.passenger_count,
                    capacity: tr.capacity,
                    status: tr.status
                },
                detectedAt: new Date().toISOString()
            });
        }
    }

    return detected;
}

module.exports = { detectAnomalies };
