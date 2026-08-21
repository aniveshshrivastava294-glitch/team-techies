// Mock Data Generator & Fallback Store for RBAC Campus Intelligence Dashboard
// Supports Users (RBAC), Tickets (Faculty Issues), 6 Seeded Buses, Venues & Multi-Domain Metrics

const generateMockDataset = () => {
    // 1. DEMO USERS (RBAC)
    const users = [
        {
            id: "u0010000-0000-0000-0000-000000000001",
            email: "super@demo.com",
            password_hash: "demo123",
            role: "super_admin",
            department_domain: "general",
            approval_status: "approved",
            full_name: "Dr. Arthur Vance (Super Admin)"
        },
        {
            id: "u0010000-0000-0000-0000-000000000002",
            email: "faculty@demo.com",
            password_hash: "demo123",
            role: "faculty",
            department_domain: "general",
            approval_status: "approved",
            full_name: "Prof. Elena Rostova (Faculty)"
        },
        {
            id: "u0010000-0000-0000-0000-000000000003",
            email: "events@demo.com",
            password_hash: "demo123",
            role: "sub_admin",
            department_domain: "events",
            approval_status: "approved",
            full_name: "Marcus Brody (Event Sub-Admin)"
        },
        {
            id: "u0010000-0000-0000-0000-000000000004",
            email: "transport@demo.com",
            password_hash: "demo123",
            role: "sub_admin",
            department_domain: "transport",
            approval_status: "approved",
            full_name: "Cap. Frank Miller (Transport Sub-Admin)"
        },
        {
            id: "u0010000-0000-0000-0000-000000000005",
            email: "maint@demo.com",
            password_hash: "demo123",
            role: "sub_admin",
            department_domain: "maintenance",
            approval_status: "approved",
            full_name: "Eng. Sarah Jenkins (Maintenance Sub-Admin)"
        },
        {
            id: "u0010000-0000-0000-0000-000000000006",
            email: "pending@demo.com",
            password_hash: "demo123",
            role: "sub_admin",
            department_domain: "events",
            approval_status: "pending",
            full_name: "David Chen (Pending Sub-Admin)"
        }
    ];

    // 2. CLASSROOMS & VENUES
    const classrooms = [
        { id: "c0010000-0000-0000-0000-000000000001", room_number: "CS-301", building: "Computer Science Hall", capacity: 200, room_type: "Auditorium", hvac_zone: "Zone-A1", is_available: true },
        { id: "c0010000-0000-0000-0000-000000000002", room_number: "CS-102", building: "Computer Science Hall", capacity: 45, room_type: "Lab", hvac_zone: "Zone-A2", is_available: true },
        { id: "c0010000-0000-0000-0000-000000000003", room_number: "SCI-104", building: "Science Complex", capacity: 60, room_type: "Lecture Hall", hvac_zone: "Zone-B1", is_available: false },
        { id: "c0010000-0000-0000-0000-000000000004", room_number: "SCI-201", building: "Science Complex", capacity: 120, room_type: "Lecture Hall", hvac_zone: "Zone-B2", is_available: true },
        { id: "c0010000-0000-0000-0000-000000000005", room_number: "ENG-202", building: "Engineering Building", capacity: 80, room_type: "Lab", hvac_zone: "Zone-C1", is_available: true },
        { id: "c0010000-0000-0000-0000-000000000006", room_number: "ENG-105", building: "Engineering Building", capacity: 30, room_type: "Seminar", hvac_zone: "Zone-C2", is_available: true },
        { id: "c0010000-0000-0000-0000-000000000007", room_number: "LIB-102", building: "Main Library", capacity: 50, room_type: "Seminar", hvac_zone: "Zone-D1", is_available: true },
        { id: "c0010000-0000-0000-0000-000000000008", room_number: "LIB-305", building: "Main Library", capacity: 100, room_type: "Study Hall", hvac_zone: "Zone-D2", is_available: true },
        { id: "c0010000-0000-0000-0000-000000000009", room_number: "ART-101", building: "Fine Arts Center", capacity: 250, room_type: "Auditorium", hvac_zone: "Zone-E1", is_available: true },
        { id: "c0010000-0000-0000-0000-000000000010", room_number: "BUS-401", building: "Business School", capacity: 150, room_type: "Lecture Hall", hvac_zone: "Zone-F1", is_available: true }
    ];

    const now = new Date();
    const isoDateStr = (daysOffset, hours = 10, minutes = 0) => {
        const d = new Date(now.getTime() + daysOffset * 86400000);
        d.setHours(hours, minutes, 0, 0);
        return d.toISOString();
    };

    // 3. EVENTS
    const events = [
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
            status: "Pending Approval"
        }
    ];

    // 4. MAINTENANCE TICKETS
    const maintenance = [
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
        {
            id: "m0030000-0000-0000-0000-000000000002",
            room_id: "c0010000-0000-0000-0000-000000000005", // ENG-202
            issue_type: "AV Equipment",
            severity: "High",
            status: "In Progress",
            description: "Main projector bulb blown out and HDMI switch malfunctioning.",
            reported_at: isoDateStr(-10, 11, 0),
            resolved_at: null
        }
    ];

    // 5. FACULTY TICKETS KANBAN STORE
    const tickets = [
        {
            ticket_id: "tk-101",
            raised_by_email: "faculty@demo.com",
            assigned_domain: "maintenance",
            title: "AC Inoperative & Overheating in CS-301",
            description: "Temperature in Auditorium CS-301 is 32°C. Students complaining of severe heat.",
            status: "open",
            venue_name: "CS-301",
            created_at: isoDateStr(0, 8, 30)
        },
        {
            ticket_id: "tk-102",
            raised_by_email: "faculty@demo.com",
            assigned_domain: "maintenance",
            title: "Projector HDMI Port Loose in ENG-202",
            description: "Display cuts off every 5 minutes during lab demonstration.",
            status: "in-progress",
            venue_name: "ENG-202",
            created_at: isoDateStr(-1, 14, 0)
        },
        {
            ticket_id: "tk-103",
            raised_by_email: "faculty@demo.com",
            assigned_domain: "transport",
            title: "Shuttle Bus #2 Overcrowding Request",
            description: "Bus #2 at 4:30 PM is dangerously packed with 87 students. Need backup shuttle.",
            status: "open",
            venue_name: "Main Bus Stop",
            created_at: isoDateStr(0, 9, 15)
        },
        {
            ticket_id: "tk-104",
            raised_by_email: "faculty@demo.com",
            assigned_domain: "events",
            title: "Auditorium ART-101 Microphone Feedback",
            description: "Audio mic #3 produces loud feedback noise during orchestra rehearsal.",
            status: "resolved",
            venue_name: "ART-101",
            created_at: isoDateStr(-3, 11, 20)
        }
    ];

    // 6. TRANSPORTATION (5-6 Seeded Buses)
    const transportation = [
        {
            id: "t0040000-0000-0000-0000-000000000001",
            route_name: "Campus Express Shuttle 1",
            vehicle_id: "BUS-01",
            driver_name: "Robert Vance",
            driver_phone: "+1 (555) 019-2831",
            timestamp: isoDateStr(0, 9, 0),
            passenger_count: 55,
            capacity: 60,
            status: "On Time"
        },
        {
            id: "t0040000-0000-0000-0000-000000000002",
            route_name: "Campus Express Shuttle 2",
            vehicle_id: "BUS-02",
            driver_name: "Sarah Connor",
            driver_phone: "+1 (555) 019-4820",
            timestamp: isoDateStr(0, 16, 45),
            passenger_count: 87,
            capacity: 60,
            status: "Overcrowded"
        },
        {
            id: "t0040000-0000-0000-0000-000000000003",
            route_name: "North Campus Express",
            vehicle_id: "BUS-03",
            driver_name: "Michael Scott",
            driver_phone: "+1 (555) 019-7723",
            timestamp: isoDateStr(0, 10, 15),
            passenger_count: 38,
            capacity: 50,
            status: "On Time"
        },
        {
            id: "t0040000-0000-0000-0000-000000000004",
            route_name: "South Dorm Connector",
            vehicle_id: "BUS-04",
            driver_name: "Dwight Schrute",
            driver_phone: "+1 (555) 019-3392",
            timestamp: isoDateStr(0, 11, 30),
            passenger_count: 22,
            capacity: 25,
            status: "Delayed"
        },
        {
            id: "t0040000-0000-0000-0000-000000000005",
            route_name: "Night Owl Shuttle",
            vehicle_id: "BUS-05",
            driver_name: "Jim Halpert",
            driver_phone: "+1 (555) 019-8812",
            timestamp: isoDateStr(0, 23, 0),
            passenger_count: 12,
            capacity: 40,
            status: "On Time"
        },
        {
            id: "t0040000-0000-0000-0000-000000000006",
            route_name: "West Campus Science Loop",
            vehicle_id: "BUS-06",
            driver_name: "Pam Beesly",
            driver_phone: "+1 (555) 019-9941",
            timestamp: isoDateStr(0, 14, 20),
            passenger_count: 45,
            capacity: 45,
            status: "On Time"
        }
    ];

    // 7. ENERGY
    const energy = [
        {
            id: "n0050000-0000-0000-0000-000000000001",
            room_id: "c0010000-0000-0000-0000-000000000007", // LIB-102
            timestamp: isoDateStr(0, 2, 30),
            kwh_consumed: 48.70,
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
        }
    ];

    // 8. ATTENDANCE
    const attendance = [
        {
            id: "a0060000-0000-0000-0000-000000000001",
            event_id: "e0020000-0000-0000-0000-000000000002",
            room_id: "c0010000-0000-0000-0000-000000000003",
            timestamp: isoDateStr(0, 10, 15),
            actual_count: 105,
            scan_method: "RFID Gate"
        }
    ];

    return { users, classrooms, events, maintenance, tickets, transportation, energy, attendance };
};

module.exports = { generateMockDataset };
