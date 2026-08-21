-- Campus Intelligence Dashboard (SW-01-P)
-- Database Schema DDL for Supabase (PostgreSQL) with Real-Time Bookings, Conflicts & Sub-Admins

-- 1. USERS TABLE (RBAC)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(30) NOT NULL, -- 'super_admin', 'sub_admin', 'faculty'
    department_domain VARCHAR(50) DEFAULT 'general', -- 'events', 'transport', 'maintenance', 'classrooms', 'attendance', 'energy', 'general'
    approval_status VARCHAR(30) DEFAULT 'approved', -- 'pending', 'approved', 'rejected'
    full_name VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. CLASSROOMS & VENUES TABLE (AC vs Non-AC)
CREATE TABLE IF NOT EXISTS classrooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_number VARCHAR(50) UNIQUE NOT NULL,
    building VARCHAR(100) NOT NULL,
    capacity INT NOT NULL,
    room_type VARCHAR(50) NOT NULL, -- 'Lecture Hall', 'Lab', 'Seminar', 'Auditorium'
    hvac_zone VARCHAR(50) NOT NULL,
    type VARCHAR(20) DEFAULT 'Non-AC', -- 'AC', 'Non-AC'
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. BOOKINGS TABLE (Double-Booking Conflict Prevention)
CREATE TABLE IF NOT EXISTS bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    venue_id UUID REFERENCES classrooms(id) ON DELETE CASCADE,
    venue_name VARCHAR(50) NOT NULL,
    booked_by_email VARCHAR(150) NOT NULL,
    date DATE NOT NULL,
    time_slot VARCHAR(50) NOT NULL, -- e.g. '09:00 - 10:30', '11:00 - 12:30', '14:00 - 15:30'
    status VARCHAR(30) NOT NULL DEFAULT 'pending', -- 'approved', 'pending', 'rejected'
    event_name VARCHAR(150) NOT NULL,
    venue_type VARCHAR(20) DEFAULT 'Non-AC', -- 'AC', 'Non-AC'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT unique_venue_slot UNIQUE (venue_id, date, time_slot)
);

-- 4. EVENTS TABLE
CREATE TABLE IF NOT EXISTS events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_name VARCHAR(150) NOT NULL,
    room_id UUID REFERENCES classrooms(id) ON DELETE CASCADE,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    expected_attendees INT NOT NULL,
    organizer VARCHAR(100) NOT NULL,
    status VARCHAR(30) DEFAULT 'Scheduled',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. MAINTENANCE TABLE
CREATE TABLE IF NOT EXISTS maintenance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_id UUID REFERENCES classrooms(id) ON DELETE CASCADE,
    issue_type VARCHAR(50) NOT NULL,
    severity VARCHAR(20) NOT NULL,
    status VARCHAR(30) NOT NULL, -- 'Open', 'In Progress', 'Resolved'
    description TEXT NOT NULL,
    reported_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    resolved_at TIMESTAMP WITH TIME ZONE
);

-- 6. TICKETS TABLE (Faculty Issues)
CREATE TABLE IF NOT EXISTS tickets (
    ticket_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    raised_by_user UUID REFERENCES users(id) ON DELETE SET NULL,
    raised_by_email VARCHAR(150),
    assigned_domain VARCHAR(50) NOT NULL, -- 'maintenance', 'transport', 'events', 'energy'
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    status VARCHAR(30) DEFAULT 'open', -- 'open', 'in-progress', 'resolved'
    venue_id UUID REFERENCES classrooms(id) ON DELETE SET NULL,
    venue_name VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. LEAVE REQUESTS TABLE (Attendance Sub-Admin Queue)
CREATE TABLE IF NOT EXISTS leave_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    faculty_email VARCHAR(150) NOT NULL,
    faculty_name VARCHAR(100) NOT NULL,
    leave_type VARCHAR(50) NOT NULL, -- 'Sick Leave', 'Casual Leave', 'Duty Leave'
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    reason TEXT NOT NULL,
    status VARCHAR(30) DEFAULT 'pending', -- 'approved', 'pending', 'rejected'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. TRANSPORTATION TABLE
CREATE TABLE IF NOT EXISTS transportation (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    route_name VARCHAR(100) NOT NULL,
    vehicle_id VARCHAR(50) NOT NULL,
    driver_name VARCHAR(100) NOT NULL,
    driver_phone VARCHAR(50),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    passenger_count INT NOT NULL,
    capacity INT NOT NULL,
    status VARCHAR(30) NOT NULL
);

-- 9. ENERGY TABLE
CREATE TABLE IF NOT EXISTS energy (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_id UUID REFERENCES classrooms(id) ON DELETE CASCADE,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    kwh_consumed NUMERIC(8, 2) NOT NULL,
    peak_kw NUMERIC(8, 2) NOT NULL,
    hvac_status VARCHAR(30) NOT NULL
);

-- 10. ATTENDANCE TABLE
CREATE TABLE IF NOT EXISTS attendance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    room_id UUID REFERENCES classrooms(id) ON DELETE CASCADE,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    actual_count INT NOT NULL,
    scan_method VARCHAR(50) DEFAULT 'RFID Gate'
);

-- INDEXES & REALTIME ENABLEMENT
CREATE INDEX IF NOT EXISTS idx_bookings_slot ON bookings(venue_id, date, time_slot);
CREATE INDEX IF NOT EXISTS idx_leave_status ON leave_requests(status);

-- Enable Supabase Realtime for bookings table
ALTER PUBLICATION supabase_realtime ADD TABLE bookings;
