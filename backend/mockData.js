// Mock Data Generator & Fallback Store for RBAC Campus Intelligence Dashboard
// Standardized with valid 32-character hex UUID format, AC/Non-AC Venues, Bookings Matrix, & Leave Requests

const generateMockDataset = () => {
    // 1. DEMO USERS (RBAC Expanded)
    const users = [
        {
            id: "10000000-0000-0000-0000-000000000001",
            email: "super@demo.com",
            password_hash: "demo123",
            role: "super_admin",
            department_domain: "general",
            approval_status: "approved",
            full_name: "Dr. Arthur Vance (Super Admin)"
        },
        {
            id: "10000000-0000-0000-0000-000000000002",
            email: "faculty@demo.com",
            password_hash: "demo123",
            role: "faculty",
            department_domain: "general",
            approval_status: "approved",
            full_name: "Prof. Elena Rostova (Faculty)"
        },
        {
            id: "10000000-0000-0000-0000-000000000003",
            email: "events@demo.com",
            password_hash: "demo123",
            role: "sub_admin",
            department_domain: "events",
            approval_status: "approved",
            full_name: "Marcus Brody (Event Sub-Admin)"
        },
        {
            id: "10000000-0000-0000-0000-000000000004",
            email: "transport@demo.com",
            password_hash: "demo123",
            role: "sub_admin",
            department_domain: "transport",
            approval_status: "approved",
            full_name: "Cap. Frank Miller (Transport Sub-Admin)"
        },
        {
            id: "10000000-0000-0000-0000-000000000005",
            email: "maint@demo.com",
            password_hash: "demo123",
            role: "sub_admin",
            department_domain: "maintenance",
            approval_status: "approved",
            full_name: "Eng. Sarah Jenkins (Maintenance Sub-Admin)"
        },
        {
            id: "10000000-0000-0000-0000-000000000007",
            email: "classrooms@demo.com",
            password_hash: "demo123",
            role: "sub_admin",
            department_domain: "classrooms",
            approval_status: "approved",
            full_name: "Prof. Charles Xavier (Classrooms Sub-Admin)"
        },
        {
            id: "10000000-0000-0000-0000-000000000008",
            email: "attendance@demo.com",
            password_hash: "demo123",
            role: "sub_admin",
            department_domain: "attendance",
            approval_status: "approved",
            full_name: "Dr. Jean Grey (Attendance Sub-Admin)"
        },
        {
            id: "10000000-0000-0000-0000-000000000009",
            email: "energy@demo.com",
            password_hash: "demo123",
            role: "sub_admin",
            department_domain: "energy",
            approval_status: "approved",
            full_name: "Eng. Nikola Tesla (Energy Sub-Admin)"
        },
        {
            id: "10000000-0000-0000-0000-000000000006",
            email: "pending@demo.com",
            password_hash: "demo123",
            role: "sub_admin",
            department_domain: "events",
            approval_status: "pending",
            full_name: "David Chen (Pending Sub-Admin)"
        }
    ];

    // 2. CLASSROOMS & VENUES (AC vs Non-AC)
    const classrooms = [
        { id: "20000000-0000-0000-0000-000000000001", room_number: "CS-301", building: "Computer Science Hall", capacity: 200, room_type: "Auditorium", hvac_zone: "Zone-A1", type: "AC", is_available: true },
        { id: "20000000-0000-0000-0000-000000000002", room_number: "CS-102", building: "Computer Science Hall", capacity: 45, room_type: "Lab", hvac_zone: "Zone-A2", type: "AC", is_available: true },
        { id: "20000000-0000-0000-0000-000000000003", room_number: "SCI-104", building: "Science Complex", capacity: 60, room_type: "Lecture Hall", hvac_zone: "Zone-B1", type: "Non-AC", is_available: false },
        { id: "20000000-0000-0000-0000-000000000004", room_number: "SCI-201", building: "Science Complex", capacity: 120, room_type: "Lecture Hall", hvac_zone: "Zone-B2", type: "AC", is_available: true },
        { id: "20000000-0000-0000-0000-000000000005", room_number: "ENG-202", building: "Engineering Building", capacity: 80, room_type: "Lab", hvac_zone: "Zone-C1", type: "Non-AC", is_available: true },
        { id: "20000000-0000-0000-0000-000000000006", room_number: "ENG-105", building: "Engineering Building", capacity: 30, room_type: "Seminar", hvac_zone: "Zone-C2", type: "Non-AC", is_available: true },
        { id: "20000000-0000-0000-0000-000000000007", room_number: "LIB-102", building: "Main Library", capacity: 50, room_type: "Seminar", hvac_zone: "Zone-D1", type: "AC", is_available: true },
        { id: "20000000-0000-0000-0000-000000000008", room_number: "LIB-305", building: "Main Library", capacity: 100, room_type: "Study Hall", hvac_zone: "Zone-D2", type: "Non-AC", is_available: true },
        { id: "20000000-0000-0000-0000-000000000009", room_number: "ART-101", building: "Fine Arts Center", capacity: 250, room_type: "Auditorium", hvac_zone: "Zone-E1", type: "AC", is_available: true },
        { id: "20000000-0000-0000-0000-000000000010", room_number: "BUS-401", building: "Business School", capacity: 150, room_type: "Lecture Hall", hvac_zone: "Zone-F1", type: "AC", is_available: true }
    ];

    const todayStr = new Date().toISOString().split('T')[0];

    // 3. BOOKINGS MATRIX (Unique venue_id + date + time_slot)
    const bookings = [
        {
            id: "b0000000-0000-0000-0000-000000000001",
            venue_id: "20000000-0000-0000-0000-000000000001", // CS-301
            venue_name: "CS-301",
            booked_by_email: "faculty@demo.com",
            date: todayStr,
            time_slot: "09:00 - 10:30",
            status: "approved",
            event_name: "AI Systems Keynote",
            venue_type: "AC",
            created_at: new Date().toISOString()
        },
        {
            id: "b0000000-0000-0000-0000-000000000002",
            venue_id: "20000000-0000-0000-0000-000000000003", // SCI-104
            venue_name: "SCI-104",
            booked_by_email: "faculty@demo.com",
            date: todayStr,
            time_slot: "11:00 - 12:30",
            status: "approved",
            event_name: "Quantum Physics 101",
            venue_type: "Non-AC",
            created_at: new Date().toISOString()
        },
        {
            id: "b0000000-0000-0000-0000-000000000003",
            venue_id: "20000000-0000-0000-0000-000000000009", // ART-101
            venue_name: "ART-101",
            booked_by_email: "faculty@demo.com",
            date: todayStr,
            time_slot: "14:00 - 15:30",
            status: "pending", // AC Venue pending Event Admin approval
            event_name: "Orchestra Rehearsal",
            venue_type: "AC",
            created_at: new Date().toISOString()
        }
    ];

    // 4. LEAVE REQUESTS (Attendance Sub-Admin Queue)
    const leave_requests = [
        {
            id: "l0000000-0000-0000-0000-000000000001",
            faculty_email: "faculty@demo.com",
            faculty_name: "Prof. Elena Rostova",
            leave_type: "Casual Leave",
            start_date: todayStr,
            end_date: todayStr,
            reason: "Attending International AI Conference session",
            status: "pending",
            created_at: new Date().toISOString()
        },
        {
            id: "l0000000-0000-0000-0000-000000000002",
            faculty_email: "turing@demo.com",
            faculty_name: "Dr. Alan Turing",
            leave_type: "Duty Leave",
            start_date: todayStr,
            end_date: todayStr,
            reason: "Research Project Evaluation at Science Complex",
            status: "approved",
            created_at: new Date().toISOString()
        }
    ];

    const now = new Date();
    const isoDateStr = (daysOffset, hours = 10, minutes = 0) => {
        const d = new Date(now.getTime() + daysOffset * 86400000);
        d.setHours(hours, minutes, 0, 0);
        return d.toISOString();
    };

    // 5. EVENTS
    const events = [
        {
            id: "30000000-0000-0000-0000-000000000001",
            event_name: "Annual CS AI & Cloud Summit 2026",
            room_id: "20000000-0000-0000-0000-000000000001",
            start_time: isoDateStr(0, 14, 0),
            end_time: isoDateStr(0, 17, 30),
            expected_attendees: 185,
            organizer: "Dept of Computer Science",
            status: "Scheduled"
        }
    ];

    // 6. MAINTENANCE TICKETS
    const maintenance = [
        {
            id: "40000000-0000-0000-0000-000000000001",
            room_id: "20000000-0000-0000-0000-000000000001",
            issue_type: "HVAC",
            severity: "Critical",
            status: "Open",
            description: "HVAC Compressor failure. Ambient temperature reaching 32°C. No cooling active.",
            reported_at: isoDateStr(-2, 8, 30),
            resolved_at: null
        }
    ];

    // 7. TICKETS
    const tickets = [
        {
            ticket_id: "50000000-0000-0000-0000-000000000001",
            raised_by_email: "faculty@demo.com",
            assigned_domain: "maintenance",
            title: "AC Inoperative & Overheating in CS-301",
            description: "Temperature in Auditorium CS-301 is 32°C. Students complaining of severe heat.",
            status: "open",
            venue_name: "CS-301",
            created_at: isoDateStr(0, 8, 30)
        },
        {
            ticket_id: "50000000-0000-0000-0000-000000000002",
            raised_by_email: "faculty@demo.com",
            assigned_domain: "energy",
            title: "Water Grid Pipe Leakage in Science Complex",
            description: "Sub-level water pipe pressure drop detected near Lab 2.",
            status: "open",
            venue_name: "Science Complex",
            created_at: isoDateStr(0, 10, 15)
        }
    ];

    // 8. TRANSPORTATION
    const transportation = [
        {
            id: "60000000-0000-0000-0000-000000000001",
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
            id: "60000000-0000-0000-0000-000000000002",
            route_name: "Campus Express Shuttle 2",
            vehicle_id: "BUS-02",
            driver_name: "Sarah Connor",
            driver_phone: "+1 (555) 019-4820",
            timestamp: isoDateStr(0, 16, 45),
            passenger_count: 87,
            capacity: 60,
            status: "Overcrowded"
        }
    ];

    // 9. ENERGY
    const energy = [
        {
            id: "70000000-0000-0000-0000-000000000001",
            room_id: "20000000-0000-0000-0000-000000000007",
            timestamp: isoDateStr(0, 2, 30),
            kwh_consumed: 48.70,
            peak_kw: 24.50,
            hvac_status: "Active"
        }
    ];

    // 10. ATTENDANCE
    const attendance = [
        {
            id: "80000000-0000-0000-0000-000000000001",
            event_id: "30000000-0000-0000-0000-000000000001",
            room_id: "20000000-0000-0000-0000-000000000001",
            timestamp: isoDateStr(0, 10, 15),
            actual_count: 105,
            scan_method: "RFID Gate"
        }
    ];

    return { users, classrooms, bookings, leave_requests, events, maintenance, tickets, transportation, energy, attendance };
};

module.exports = { generateMockDataset };
