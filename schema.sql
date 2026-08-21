-- Campus Intelligence Dashboard (SW-01-P)
-- Database Schema DDL for Supabase (PostgreSQL) with RBAC & Ticketing Support

-- 1. USERS TABLE (RBAC)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(30) NOT NULL, -- 'super_admin', 'sub_admin', 'faculty'
    department_domain VARCHAR(50) DEFAULT 'general', -- 'events', 'transport', 'maintenance', 'general'
    approval_status VARCHAR(30) DEFAULT 'approved', -- 'pending', 'approved', 'rejected'
    full_name VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. CLASSROOMS TABLE
CREATE TABLE IF NOT EXISTS classrooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_number VARCHAR(50) UNIQUE NOT NULL,
    building VARCHAR(100) NOT NULL,
    capacity INT NOT NULL,
    room_type VARCHAR(50) NOT NULL, -- 'Lecture Hall', 'Lab', 'Seminar', 'Auditorium'
    hvac_zone VARCHAR(50) NOT NULL,
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. EVENTS TABLE
CREATE TABLE IF NOT EXISTS events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_name VARCHAR(150) NOT NULL,
    room_id UUID REFERENCES classrooms(id) ON DELETE CASCADE,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    expected_attendees INT NOT NULL,
    organizer VARCHAR(100) NOT NULL,
    status VARCHAR(30) DEFAULT 'Scheduled', -- 'Scheduled', 'Pending Approval', 'Completed', 'Cancelled'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. MAINTENANCE TABLE
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

-- 5. TICKETS TABLE (Faculty Issues -> Sub-Admins)
CREATE TABLE IF NOT EXISTS tickets (
    ticket_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    raised_by_user UUID REFERENCES users(id) ON DELETE SET NULL,
    raised_by_email VARCHAR(150),
    assigned_domain VARCHAR(50) NOT NULL, -- 'maintenance', 'transport', 'events'
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    status VARCHAR(30) DEFAULT 'open', -- 'open', 'in-progress', 'resolved'
    venue_id UUID REFERENCES classrooms(id) ON DELETE SET NULL,
    venue_name VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. TRANSPORTATION TABLE (5-6 Seeded Buses)
CREATE TABLE IF NOT EXISTS transportation (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    route_name VARCHAR(100) NOT NULL,
    vehicle_id VARCHAR(50) NOT NULL,
    driver_name VARCHAR(100) NOT NULL,
    driver_phone VARCHAR(50),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    passenger_count INT NOT NULL,
    capacity INT NOT NULL,
    status VARCHAR(30) NOT NULL -- 'On Time', 'Delayed', 'Overcrowded', 'Maintenance Required'
);

-- 7. ENERGY TABLE
CREATE TABLE IF NOT EXISTS energy (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_id UUID REFERENCES classrooms(id) ON DELETE CASCADE,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    kwh_consumed NUMERIC(8, 2) NOT NULL,
    peak_kw NUMERIC(8, 2) NOT NULL,
    hvac_status VARCHAR(30) NOT NULL -- 'Active', 'Eco', 'Off', 'Malfunction'
);

-- 8. ATTENDANCE TABLE
CREATE TABLE IF NOT EXISTS attendance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    room_id UUID REFERENCES classrooms(id) ON DELETE CASCADE,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    actual_count INT NOT NULL,
    scan_method VARCHAR(50) DEFAULT 'RFID Gate'
);

-- INDEXES
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role, approval_status);
CREATE INDEX IF NOT EXISTS idx_tickets_domain_status ON tickets(assigned_domain, status);
CREATE INDEX IF NOT EXISTS idx_events_room_time ON events(room_id, start_time, end_time);
