// Mock Data Generator & Fallback Store for Campus Intelligence Dashboard
// Contains 2-3 months of realistic multi-domain campus synthetic data + seeded anomalies

const generateMockDataset = () => {
    // 1. CLASSROOMS
    const classrooms = [
        { id: "c0010000-0000-0000-0000-000000000001", room_number: "CS-301", building: "Computer Science Hall", capacity: 200, room_type: "Auditorium", hvac_zone: "Zone-A1" },
        { id: "c0010000-0000-0000-0000-000000000002", room_number: "CS-102", building: "Computer Science Hall", capacity: 45, room_type: "Lab", hvac_zone: "Zone-A2" },
        { id: "c0010000-0000-0000-0000-000000000003", room_number: "SCI-104", building: "Science Complex", capacity: 60, room_type: "Lecture Hall", hvac_zone: "Zone-B1" },
        { id: "c0010000-0000-0000-0000-000000000004", room_number: "SCI-201", building: "Science Complex", capacity: 120, room_type: "Lecture Hall", hvac_zone: "Zone-B2" },
        { id: "c0010000-0000-0000-0000-000000000005", room_number: "ENG-202", building: "Engineering Building", capacity: 80, room_type: "Lab", hvac_zone: "Zone-C1" },
        { id: "c0010000-0000-0000-0000-000000000006", room_number: "ENG-105", building: "Engineering Building", capacity: 30, room_type: "Seminar", hvac_zone: "Zone-C2" },
        { id: "c0010000-0000-0000-0000-000000000007", room_number: "LIB-102", building: "Main Library", capacity: 50, room_type: "Seminar", hvac_zone: "Zone-D1" },
        { id: "c0010000-0000-0000-0000-000000000008", room_number: "LIB-305", building: "Main Library", capacity: 100, room_type: "Study Hall", hvac_zone: "Zone-D2" },
        { id: "c0010000-0000-0000-0000-000000000009", room_number: "ART-101", building: "Fine Arts Center", capacity: 250, room_type: "Auditorium", hvac_zone: "Zone-E1" },
        { id: "c0010000-0000-0000-0000-000000000010", room_number: "BUS-401", building: "Business School", capacity: 150, room_type: "Lecture Hall", hvac_zone: "Zone-F1" }
    ];

    const now = new Date();
    const isoDateStr = (daysOffset, hours = 10, minutes = 0) => {
        const d = new Date(now.getTime() + daysOffset * 86400000);
        d.setHours(hours, minutes, 0, 0);
        return d.toISOString();
    };

    // 2. EVENTS
    const events = [
        // Seed Anomaly 1: Major event in CS-301 with Open Critical HVAC Ticket
        {
            id: "e0020000-0000-0000-0000-000000000001",
            event_name: "Annual CS AI & Cloud Summit 2026",
            room_id: "c0010000-0000-0000-0000-000000000001", // CS-301
            start_time: isoDateStr(0, 14, 0),
            end_time: isoDateStr(0, 17, 30),
            expected_attendees: 185,
            organizer: "Dept of Computer Science",
            status: "Scheduled"
        },
        // Seed Anomaly 3: Attendance Overflow in SCI-104 (Capacity 60, expected 90, actual 105)
        {
            id: "e0020000-0000-0000-0000-000000000002",
            event_name: "Quantum Physics 101 Lecture",
            room_id: "c0010000-0000-0000-0000-000000000003", // SCI-104
            start_time: isoDateStr(0, 10, 0),
            end_time: isoDateStr(0, 11, 30),
            expected_attendees: 90,
            organizer: "Physics Dept",
            status: "Scheduled"
        },
        {
            id: "e0020000-0000-0000-0000-000000000003",
            event_name: "Robotics Workshop",
            room_id: "c0010000-0000-0000-0000-000000000005", // ENG-202
            start_time: isoDateStr(-1, 9, 0),
            end_time: isoDateStr(-1, 12, 0),
            expected_attendees: 75,
            organizer: "Engineering Society",
            status: "Completed"
        },
        {
            id: "e0020000-0000-0000-0000-000000000004",
            event_name: "Symphony Orchestra Rehearsal",
            room_id: "c0010000-0000-0000-0000-000000000009", // ART-101
            start_time: isoDateStr(1, 18, 0),
            end_time: isoDateStr(1, 21, 0),
            expected_attendees: 210,
            organizer: "Music Dept",
            status: "Scheduled"
        },
        {
            id: "e0020000-0000-0000-0000-000000000005",
            event_name: "MBA Case Competition",
            room_id: "c0010000-0000-0000-0000-000000000010", // BUS-401
            start_time: isoDateStr(2, 13, 0),
            end_time: isoDateStr(2, 16, 0),
            expected_attendees: 130,
            organizer: "Business School Council",
            status: "Scheduled"
        }
    ];

    // 3. MAINTENANCE TICKETS
    const maintenance = [
        // Seed Anomaly 1 Ticket: Open Critical HVAC ticket in CS-301
        {
            id: "m0030000-0000-0000-0000-000000000001",
            room_id: "c0010000-0000-0000-0000-000000000001", // CS-301
            issue_type: "HVAC",
            severity: "Critical",
            status: "Open",
            description: "HVAC Compressor failure. Ambient temperature reaching 32°C. No cooling active.",
            reported_at: isoDateStr(-2, 8, 30),
            resolved_at: null
        },
        // Seed Anomaly 5: Multiple open tickets in ENG-202
        {
            id: "m0030000-0000-0000-0000-000000000002",
            room_id: "c0010000-0000-0000-0000-000000000005", // ENG-202
            issue_type: "AV Equipment",
            severity: "High",
            status: "Open",
            description: "Main projector bulb blown out and HDMI switch malfunctioning.",
            reported_at: isoDateStr(-10, 11, 0),
            resolved_at: null
        },
        {
            id: "m0030000-0000-0000-0000-000000000003",
            room_id: "c0010000-0000-0000-0000-000000000005", // ENG-202
            issue_type: "Electrical",
            severity: "Medium",
            status: "Open",
            description: "Lab workbench outlets 4-8 trip circuit breaker under load.",
            reported_at: isoDateStr(-15, 14, 20),
            resolved_at: null
        },
        {
            id: "m0030000-0000-0000-0000-000000000004",
            room_id: "c0010000-0000-0000-0000-000000000003", // SCI-104
            issue_type: "Furniture",
            severity: "Low",
            status: "Resolved",
            description: "Broken tier-2 desk seating bolt repaired.",
            reported_at: isoDateStr(-20, 9, 0),
            resolved_at: isoDateStr(-18, 16, 0)
        }
    ];

    // 4. TRANSPORTATION
    const transportation = [
        // Seed Anomaly 4: Overcrowded & Delayed Shuttle 2 during peak hours
        {
            id: "t0040000-0000-0000-0000-000000000001",
            route_name: "Campus Express Shuttle 2",
            vehicle_id: "BUS-EX-02",
            timestamp: isoDateStr(0, 16, 45),
            passenger_count: 87,
            capacity: 60, // 145% utilization
            status: "Overcrowded"
        },
        {
            id: "t0040000-0000-0000-0000-000000000002",
            route_name: "North Campus Loop",
            vehicle_id: "BUS-NC-01",
            timestamp: isoDateStr(0, 10, 15),
            passenger_count: 38,
            capacity: 50,
            status: "On Time"
        },
        {
            id: "t0040000-0000-0000-0000-000000000003",
            route_name: "South Dorm Connector",
            vehicle_id: "VAN-SD-04",
            timestamp: isoDateStr(0, 11, 30),
            passenger_count: 22,
            capacity: 25,
            status: "Delayed"
        },
        {
            id: "t0040000-0000-0000-0000-000000000004",
            route_name: "Campus Express Shuttle 1",
            vehicle_id: "BUS-EX-01",
            timestamp: isoDateStr(0, 9, 0),
            passenger_count: 55,
            capacity: 60,
            status: "On Time"
        }
    ];

    // 5. ENERGY
    const energy = [
        // Seed Anomaly 2: High Energy Consumption in Empty LIB-102 at Night
        {
            id: "n0050000-0000-0000-0000-000000000001",
            room_id: "c0010000-0000-0000-0000-000000000007", // LIB-102
            timestamp: isoDateStr(0, 2, 30), // 2:30 AM
            kwh_consumed: 48.70, // Excessive spike vs expected ~2.5 kWh
            peak_kw: 24.50,
            hvac_status: "Active"
        },
        {
            id: "n0050000-0000-0000-0000-000000000002",
            room_id: "c0010000-0000-0000-0000-000000000001", // CS-301
            timestamp: isoDateStr(0, 14, 0),
            kwh_consumed: 62.40,
            peak_kw: 31.20,
            hvac_status: "Malfunction"
        },
        {
            id: "n0050000-0000-0000-0000-000000000003",
            room_id: "c0010000-0000-0000-0000-000000000003", // SCI-104
            timestamp: isoDateStr(0, 10, 30),
            kwh_consumed: 35.10,
            peak_kw: 18.00,
            hvac_status: "Active"
        },
        {
            id: "n0050000-0000-0000-0000-000000000004",
            room_id: "c0010000-0000-0000-0000-000000000009", // ART-101
            timestamp: isoDateStr(1, 19, 0),
            kwh_consumed: 8.50,
            peak_kw: 5.00,
            hvac_status: "Eco"
        }
    ];

    // 6. ATTENDANCE
    const attendance = [
        // Seed Anomaly 3: Actual count (105) > Room Capacity (60) in SCI-104
        {
            id: "a0060000-0000-0000-0000-000000000001",
            event_id: "e0020000-0000-0000-0000-000000000002",
            room_id: "c0010000-0000-0000-0000-000000000003",
            timestamp: isoDateStr(0, 10, 15),
            actual_count: 105,
            scan_method: "RFID Gate"
        },
        {
            id: "a0060000-0000-0000-0000-000000000002",
            event_id: "e0020000-0000-0000-0000-000000000003",
            room_id: "c0010000-0000-0000-0000-000000000005",
            timestamp: isoDateStr(-1, 9, 20),
            actual_count: 72,
            scan_method: "Camera AI"
        }
    ];

    return { classrooms, events, maintenance, transportation, energy, attendance };
};

module.exports = { generateMockDataset };
