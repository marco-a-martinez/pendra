const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://mwiqrqaxntpvjdkadhfd.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im13aXFycWF4bnRwdmpka2FkaGZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIxMDU0MTYsImV4cCI6MjA2NzY4MTQxNn0.oyDPn3nbg3YssjMbL2gbcQ6mbb8ZOW_KZZMf3ySA-iM';

const supabase = createClient(supabaseUrl, supabaseKey);

const TEST_USER_ID = '550e8400-e29b-41d4-a716-446655440000';

async function setupTestUser() {
  console.log('Setting up test user...');
  
  try {
    // First, check if user already exists
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('*')
      .eq('id', TEST_USER_ID)
      .single();
    
    if (existingUser) {
      console.log('Test user already exists:', existingUser);
      return;
    }
    
    // Create the test user
    const { data: newUser, error: createError } = await supabase
      .from('users')
      .insert([{
        id: TEST_USER_ID,
        email: 'test@example.com',
        name: 'Test User',
        avatar_url: '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single();
    
    if (createError) {
      console.log('Error creating user:', createError.message);
      console.log('Error details:', createError);
      
      // If the error is about auth.users reference, we need a different approach
      if (createError.code === '23503') {
        console.log('\nNote: The user needs to exist in auth.users first.');
        console.log('This typically happens when using Supabase Auth.');
        console.log('For testing, you may need to:');
        console.log('1. Sign up with test@example.com through the app');
        console.log('2. Or modify the database schema to allow non-auth users');
      }
    } else {
      console.log('Test user created successfully!');
      console.log('User:', newUser);
    }
    
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

setupTestUser();
