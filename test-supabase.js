const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://mwiqrqaxntpvjdkadhfd.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im13aXFycWF4bnRwdmpka2FkaGZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIxMDU0MTYsImV4cCI6MjA2NzY4MTQxNn0.oyDPn3nbg3YssjMbL2gbcQ6mbb8ZOW_KZZMf3ySA-iM';

console.log('Testing Supabase connection...');
console.log('URL:', supabaseUrl);
console.log('Key length:', supabaseKey.length);

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  try {
    // Test 1: Check if we can connect
    console.log('\n1. Testing basic connection...');
    const { data: test, error: testError } = await supabase
      .from('tasks')
      .select('count')
      .limit(1);
    
    if (testError) {
      console.log('Connection error:', testError.message);
      console.log('Error details:', testError);
    } else {
      console.log('Connection successful!');
    }

    // Test 2: Try to fetch tasks
    console.log('\n2. Fetching tasks for test-user-123...');
    const { data: tasks, error: tasksError } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', 'test-user-123');
    
    if (tasksError) {
      console.log('Error fetching tasks:', tasksError.message);
    } else {
      console.log('Tasks found:', tasks ? tasks.length : 0);
      if (tasks && tasks.length > 0) {
        console.log('First task:', tasks[0]);
      }
    }

    // Test 3: Try to create a task
    console.log('\n3. Creating a test task...');
    const testTask = {
      user_id: 'test-user-123',
      title: 'Test Task from Node.js',
      status: 'inbox',
      priority: 'medium',
      tags: [],
      order_index: Date.now(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    const { data: newTask, error: createError } = await supabase
      .from('tasks')
      .insert([testTask])
      .select()
      .single();
    
    if (createError) {
      console.log('Error creating task:', createError.message);
      console.log('Error details:', createError);
    } else {
      console.log('Task created successfully!');
      console.log('New task:', newTask);
    }

  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

testConnection();
