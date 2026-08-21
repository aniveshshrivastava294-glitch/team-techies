-- Campus Intelligence Dashboard (SW-01-P)
-- Database Schema DDL for Supabase (PostgreSQL)

-- 1. CLASSROOMS TABLE
CREATE TABLE IF NOT EXISTS classrooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_number VARCHAR(50) UNIQUE NOT NULL,
    building VARCHAR(100) NOT NULL,
    capacity INT NOT NULL,
    room_type VARCHAR(50) NOT NULL, -- 'Lecture Hall', 'Lab', 'Seminar', 'Auditorium'
    hvac_zone VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. EVENTS TABLE
CREATE TABLE IF NOT EXISTS events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_name VARCHAR(150) NOT NULL,
    room_id UUID REFERENCES classrooms(id) ON DELETE CASCADE,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    expected_attendees INT NOT NULL,
    organizer VARCHAR(100) NOT NULL,
    status VARCHAR(30) DEFAULT 'Scheduled', -- 'Scheduled', 'Completed', 'Cancelled'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. MAINTENANCE TABLE
CREATE TABLE IF NOT EXISTS maintenance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_id UUID REFERENCES classrooms(id) ON DELETE CASCADE,
    issue_type VARCHAR(50) NOT NULL, -- 'HVAC', 'Electrical', 'Plumbing', 'Furniture', 'AV Equipment'
    severity VARCHAR(20) NOT NULL, -- 'Critical', 'High', 'Medium', 'Low'
    status VARCHAR(30) NOT NULL, -- 'Open', 'In Progress', 'Resolved'
    description TEXT NOT NULL,
    reported_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    resolved_at TIMESTAMP WITH TIME ZONE
);

-- 4. TRANSPORTATION TABLE
CREATE TABLE IF NOT EXISTS transportation (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    route_name VARCHAR(100) NOT NULL,
    vehicle_id VARCHAR(50) NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    passenger_count INT NOT NULL,
    capacity INT NOT NULL,
    status VARCHAR(30) NOT NULL -- 'On Time', 'Delayed', 'Overcrowded'
);

-- 5. ENERGY TABLE
CREATE TABLE IF NOT EXISTS energy (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_id UUID REFERENCES classrooms(id) ON DELETE CASCADE,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    kwh_consumed NUMERIC(8, 2) NOT NULL,
    peak_kw NUMERIC(8, 2) NOT NULL,
    hvac_status VARCHAR(30) NOT NULL -- 'Active', 'Eco', 'Off', 'Malfunction'
);

-- 6. ATTENDANCE TABLE
CREATE TABLE IF NOT EXISTS attendance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    room_id UUID REFERENCES classrooms(id) ON DELETE CASCADE,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    actual_count INT NOT NULL,
    scan_method VARCHAR(50) DEFAULT 'RFID Gate' -- 'RFID Gate', 'Manual Check-in', 'Camera AI'
);

-- INDEXES FOR FAST CROSS-DOMAIN ANALYTICS
CREATE INDEX IF NOT EXISTS idx_events_room_time ON events(room_id, start_time, end_time);
CREATE INDEX IF NOT EXISTS idx_maintenance_room_status ON maintenance(room_id, status);
CREATE INDEX IF NOT EXISTS idx_energy_room_time ON energy(room_id, timestamp);
CREATE INDEX IF NOT EXISTS idx_attendance_event ON attendance(event_id);
CREATE INDEX IF NOT EXISTS idx_transportation_time ON transportation(timestamp);

-- ANALYTICAL HELPER VIEW: CROSS-DOMAIN ANOMALY INDICATORS
CREATE OR REPLACE VIEW view_cross_domain_metrics AS
SELECT 
    c.id AS room_id,
    c.room_number,
    c.building,
    c.capacity,
    e.id AS event_id,
    e.event_name,
    e.start_time,
    e.end_time,
    e.expected_attendees,
    a.actual_count,
    m.id AS maintenance_id,
    m.issue_type AS maintenance_issue,
    m.severity AS maintenance_severity,
    m.status AS maintenance_status,
    eng.kwh_consumed,
    eng.hvac_status
FROM classrooms c
LEFT JOIN events e ON c.id = e.room_id
LEFT JOIN attendance a ON e.id = a.event_id
LEFT JOIN maintenance m ON c.id = m.room_id AND m.status IN ('Open', 'In Progress')
LEFT JOIN energy eng ON c.id = eng.room_id;
