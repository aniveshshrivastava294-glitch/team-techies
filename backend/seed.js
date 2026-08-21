// Supabase Data Seeding Script for Campus Intelligence Dashboard (SW-01-P)
// Inserts 2-3 months of synthetic data into Supabase across 6 domain tables
// Injecting realistic cross-domain anomalies (HVAC ticket conflict, energy ghosting, attendance overflow)

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const { generateMockDataset } = require('./mockData');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey || !supabaseUrl.startsWith('http')) {
    console.error('❌ Missing valid SUPABASE_URL and SUPABASE_SERVICE_KEY in backend/.env file.');
    console.log('💡 Note: You can still run the Express backend without Supabase - it will automatically serve synthetic mock data in memory!');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seedDatabase() {
    console.log('🌱 Starting Supabase Seeding Process...');
    const dataset = generateMockDataset();

    try {
        // 1. Seed Classrooms
        console.log('📍 Seeding Classrooms (10 rooms)...');
        const { error: errClassrooms } = await supabase.from('classrooms').upsert(dataset.classrooms, { onConflict: 'room_number' });
        if (errClassrooms) console.error('Error seeding classrooms:', errClassrooms.message);
        else console.log('✅ Classrooms seeded successfully.');

        // 2. Seed Events
        console.log('📅 Seeding Events...');
        const { error: errEvents } = await supabase.from('events').upsert(dataset.events);
        if (errEvents) console.error('Error seeding events:', errEvents.message);
        else console.log('✅ Events seeded successfully.');

        // 3. Seed Maintenance
        console.log('🔧 Seeding Maintenance Tickets...');
        const { error: errMaint } = await supabase.from('maintenance').upsert(dataset.maintenance);
        if (errMaint) console.error('Error seeding maintenance:', errMaint.message);
        else console.log('✅ Maintenance tickets seeded successfully.');

        // 4. Seed Transportation
        console.log('🚌 Seeding Transportation Routes...');
        const { error: errTransit } = await supabase.from('transportation').upsert(dataset.transportation);
        if (errTransit) console.error('Error seeding transportation:', errTransit.message);
        else console.log('✅ Transportation seeded successfully.');

        // 5. Seed Energy
        console.log('⚡ Seeding Energy Usage Records...');
        const { error: errEnergy } = await supabase.from('energy').upsert(dataset.energy);
        if (errEnergy) console.error('Error seeding energy:', errEnergy.message);
        else console.log('✅ Energy records seeded successfully.');

        // 6. Seed Attendance
        console.log('👥 Seeding Attendance Records...');
        const { error: errAtt } = await supabase.from('attendance').upsert(dataset.attendance);
        if (errAtt) console.error('Error seeding attendance:', errAtt.message);
        else console.log('✅ Attendance records seeded successfully.');

        console.log('\n🎉 Database Seeding Complete! Seeded Cross-Domain Anomalies:');
        console.log('   1. Event "Annual CS AI & Cloud Summit" in CS-301 while HVAC ticket is Critical/Open.');
        console.log('   2. Ghost Energy Consumption spike (48.7 kWh) in LIB-102 at 2:30 AM with 0 occupants.');
        console.log('   3. Capacity Violation: 105 students in SCI-104 (Max capacity: 60).');
        console.log('   4. Transit Overcrowding: Shuttle 2 at 145% passenger load during class dismissal peak.');

    } catch (err) {
        console.error('❌ Exception during seeding:', err);
    }
}

seedDatabase();
