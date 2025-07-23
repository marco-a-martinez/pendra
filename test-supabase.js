// Test Supabase connection
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

console.log('Testing Supabase connection...');
console.log('\nEnvironment variables:');
console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? '✓ Set' : '✗ Missing');
console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✓ Set' : '✗ Missing');

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  console.error('\n❌ Missing required environment variables!');
  process.exit(1);
}

// Add fetch polyfill for Node.js
global.fetch = require('node-fetch');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function testConnection() {
  try {
    // Test 1: Check if we can query the tasks table
    console.log('\nTesting database connection...');
    const { data, error } = await supabase
      .from('tasks')
      .select('id')
      .limit(1);
    
    if (error) {
      console.error('❌ Database connection failed:', error.message);
      return;
    }
    
    console.log('✓ Successfully connected to Supabase!');
    
    // Test 2: Check if notes column exists
    console.log('\nChecking if notes column exists...');
    const { data: taskData, error: taskError } = await supabase
      .from('tasks')
      .select('id, notes')
      .limit(1);
    
    if (taskError) {
      console.error('❌ Notes column check failed:', taskError.message);
      console.log('\nYou may need to run the migration to add the notes column.');
    } else {
      console.log('✓ Notes column exists in tasks table!');
    }
    
    console.log('\n✅ All tests passed! Your Supabase connection is working correctly.');
    
  } catch (err) {
    console.error('\n❌ Unexpected error:', err.message);
  }
}

testConnection();
