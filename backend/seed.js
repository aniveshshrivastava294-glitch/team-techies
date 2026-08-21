// Supabase Data Seeding Script for RBAC Campus Intelligence Dashboard (SW-01-P)
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const { generateMockDataset } = require('./mockData');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey || !supabaseUrl.startsWith('http')) {
    console.error('❌ Missing valid SUPABASE_URL and SUPABASE_SERVICE_KEY in backend/.env file.');
    console.log('💡 Note: You can still run the Express backend without Supabase - it automatically serves synthetic RBAC mock data in memory!');
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

        // 2. Seed Classrooms
        console.log('📍 Seeding Classrooms & Venues...');
        const { error: errClassrooms } = await supabase.from('classrooms').upsert(dataset.classrooms, { onConflict: 'room_number' });
        if (errClassrooms) console.error('Error seeding classrooms:', errClassrooms.message);
        else console.log('✅ Classrooms seeded successfully.');

        // 3. Seed Events
        console.log('📅 Seeding Events...');
        const { error: errEvents } = await supabase.from('events').upsert(dataset.events);
        if (errEvents) console.error('Error seeding events:', errEvents.message);
        else console.log('✅ Events seeded successfully.');

        // 4. Seed Maintenance
        console.log('🔧 Seeding Maintenance Tickets...');
        const { error: errMaint } = await supabase.from('maintenance').upsert(dataset.maintenance);
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

        // 7. Seed Energy
        console.log('⚡ Seeding Energy Usage Records...');
        const { error: errEnergy } = await supabase.from('energy').upsert(dataset.energy);
        if (errEnergy) console.error('Error seeding energy:', errEnergy.message);
        else console.log('✅ Energy records seeded successfully.');

        // 8. Seed Attendance
        console.log('👥 Seeding Attendance Records...');
        const { error: errAtt } = await supabase.from('attendance').upsert(dataset.attendance);
        if (errAtt) console.error('Error seeding attendance:', errAtt.message);
        else console.log('✅ Attendance records seeded successfully.');

        console.log('\n🎉 Database Seeding Complete! Demo Accounts Ready:');
        console.log('   - super@demo.com (Super Admin)');
        console.log('   - faculty@demo.com (Faculty)');
        console.log('   - events@demo.com (Event Sub-Admin)');
        console.log('   - transport@demo.com (Transport Sub-Admin)');
        console.log('   - maint@demo.com (Maintenance Sub-Admin)');
        console.log('   - pending@demo.com (Pending Sub-Admin)');

    } catch (err) {
        console.error('❌ Exception during seeding:', err);
    }
}

seedDatabase();
