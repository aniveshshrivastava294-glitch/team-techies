// Supabase Database Client & Fallback Proxy Layer
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const { generateMockDataset } = require('./mockData');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_KEY || process.env.SUPABASE_ANON_KEY;

let supabase = null;
let isConnectedToSupabase = false;

if (supabaseUrl && supabaseServiceKey && supabaseUrl.startsWith('http')) {
    try {
        supabase = createClient(supabaseUrl, supabaseServiceKey);
        isConnectedToSupabase = true;
        console.log('✅ Supabase client initialized with URL:', supabaseUrl);
    } catch (err) {
        console.warn('⚠️ Could not connect to Supabase, running in local synthetic memory mode:', err.message);
    }
} else {
    console.log('ℹ️ No valid SUPABASE_URL / SUPABASE_SERVICE_KEY found in .env. Running with local synthetic dataset.');
}

// In-Memory Data Store for local fallback
let mockStore = generateMockDataset();

const getLocalData = (tableName) => {
    return mockStore[tableName] || [];
};

module.exports = {
    supabase,
    isConnectedToSupabase,
    getLocalData,
    mockStore,
    refreshMockStore: () => {
        mockStore = generateMockDataset();
        return mockStore;
    }
};
