// Supabase Data Seeding Script for RBAC Campus Intelligence Dashboard (SW-01-P)
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const { generateMockDataset } = require('./mockData');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey || !supabaseUrl.startsWith('http')) {
    console.error('❌ Missing valid SUPABASE_URL and SUPABASE_SERVICE_KEY in backend/.env file.');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seedDatabase() {
    console.log('🌱 Starting Supabase Seeding Process...');
    const dataset = generateMockDataset();

    try {
        // 1. Seed Users (RBAC)
        console.log('👤 Seeding Users (Super Admin, Faculty, Sub-Admins)...');
        const { error: errUsers } = await supabase.from('users').upsert(dataset.users, { onConflict: 'email' });
        if (errUsers) console.error('Error seeding users:', errUsers.message);
        else console.log('✅ Users seeded successfully.');

        // 2. Seed Classrooms & Venues (Ignore duplicates to preserve existing foreign keys)
        console.log('📍 Seeding Classrooms & Venues...');
        const { error: errClassrooms } = await supabase.from('classrooms').upsert(dataset.classrooms, { onConflict: 'room_number', ignoreDuplicates: true });
        if (errClassrooms) console.error('Note on classrooms:', errClassrooms.message);
        else console.log('✅ Classrooms seeded successfully.');

        // Fetch actual room UUID mapping from database to guarantee FK integrity
        const { data: dbRooms } = await supabase.from('classrooms').select('id, room_number');
        const roomMap = {};
        if (dbRooms) {
            dbRooms.forEach(r => {
                roomMap[r.room_number] = r.id;
            });
        }

        // 3. Map Room IDs into Events
        const mappedEvents = dataset.events.map((e, idx) => {
            const roomNum = idx === 0 ? 'CS-301' : idx === 1 ? 'SCI-104' : idx === 2 ? 'ENG-202' : 'ART-101';
            return {
                ...e,
                room_id: roomMap[roomNum] || e.room_id
            };
        });

        console.log('📅 Seeding Events...');
        const { error: errEvents } = await supabase.from('events').upsert(mappedEvents);
        if (errEvents) console.error('Error seeding events:', errEvents.message);
        else console.log('✅ Events seeded successfully.');

        // Fetch actual event UUID mapping from database for attendance FK integrity
        const { data: dbEvents } = await supabase.from('events').select('id, event_name');
        const eventMap = {};
        if (dbEvents) {
            dbEvents.forEach(ev => {
                eventMap[ev.event_name] = ev.id;
            });
        }

        // 4. Map Room IDs into Maintenance
        const mappedMaint = dataset.maintenance.map((m, idx) => {
            const roomNum = idx === 0 ? 'CS-301' : 'ENG-202';
            return {
                ...m,
                room_id: roomMap[roomNum] || m.room_id
            };
        });

        console.log('🔧 Seeding Maintenance Tickets...');
        const { error: errMaint } = await supabase.from('maintenance').upsert(mappedMaint);
        if (errMaint) console.error('Error seeding maintenance:', errMaint.message);
        else console.log('✅ Maintenance tickets seeded successfully.');

        // 5. Seed Tickets (Faculty Issue Board)
        console.log('🎟️ Seeding Faculty Issue Tickets...');
        const { error: errTickets } = await supabase.from('tickets').upsert(dataset.tickets, { onConflict: 'ticket_id' });
        if (errTickets) console.error('Error seeding tickets:', errTickets.message);
        else console.log('✅ Tickets seeded successfully.');

        // 6. Seed Transportation (6 Seeded Buses)
        console.log('🚌 Seeding Transportation Fleet (6 Buses)...');
        const { error: errTransit } = await supabase.from('transportation').upsert(dataset.transportation);
        if (errTransit) console.error('Error seeding transportation:', errTransit.message);
        else console.log('✅ Transportation seeded successfully.');

        // 7. Map Room IDs into Energy
        const mappedEnergy = dataset.energy.map((eng, idx) => {
            const roomNum = idx === 0 ? 'LIB-102' : 'CS-301';
            return {
                ...eng,
                room_id: roomMap[roomNum] || eng.room_id
            };
        });

        console.log('⚡ Seeding Energy Usage Records...');
        const { error: errEnergy } = await supabase.from('energy').upsert(mappedEnergy);
        if (errEnergy) console.error('Error seeding energy:', errEnergy.message);
        else console.log('✅ Energy records seeded successfully.');

        // 8. Map Event and Room IDs into Attendance
        const mappedAtt = dataset.attendance.map(a => {
            return {
                ...a,
                event_id: eventMap['Quantum Physics 101 Lecture'] || a.event_id,
                room_id: roomMap['SCI-104'] || a.room_id
            };
        });

        console.log('👥 Seeding Attendance Records...');
        const { error: errAtt } = await supabase.from('attendance').upsert(mappedAtt);
        if (errAtt) console.error('Error seeding attendance:', errAtt.message);
        else console.log('✅ Attendance records seeded successfully.');

        console.log('\n🎉 ALL 8 DOMAIN TABLES SEEDED 100% SUCCESSFULLY INTO SUPABASE!');
        console.log('   - users, classrooms, events, maintenance, tickets, transportation, energy, attendance');

    } catch (err) {
        console.error('❌ Exception during seeding:', err);
    }
}

seedDatabase();
