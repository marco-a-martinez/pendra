'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAppStore } from '@/lib/store';
import { useAuth } from '@/components/AuthProvider';

export default function TestPage() {
  const [testResult, setTestResult] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { user: appUser, tasks } = useAppStore();

  const testSupabase = async () => {
    setLoading(true);
    setTestResult('Testing...');
    
    try {
      // Test 1: Check environment variables
      const envCheck = `
Environment Variables:
- SUPABASE_URL: ${process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Not set'}
- SUPABASE_ANON_KEY: ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Not set'}
`;
      
      // Test 2: Check auth user
      const authCheck = `
Auth User:
- Supabase User: ${user ? `${user.email} (${user.id})` : 'Not logged in'}
- App User: ${appUser ? `${appUser.email} (${appUser.id})` : 'Not set'}
`;
      
      // Test 3: Check current tasks
      const tasksCheck = `
Current Tasks: ${tasks.length} tasks in store
`;
      
      // Test 4: Try to fetch tasks
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', 'test-user-123')
        .limit(5);
      
      const fetchCheck = `
Fetch Test:
- Success: ${!error}
- Error: ${error ? error.message : 'None'}
- Data: ${data ? `${data.length} tasks fetched` : 'No data'}
`;
      
      // Test 5: Try to create a test task
      const testTask = {
        user_id: 'test-user-123',
        title: `Test Task ${new Date().toISOString()}`,
        status: 'inbox',
        priority: 'medium',
        tags: [],
        order_index: Date.now(),
      };
      
      const { data: createData, error: createError } = await supabase
        .from('tasks')
        .insert([testTask])
        .select()
        .single();
      
      const createCheck = `
Create Test:
- Success: ${!createError}
- Error: ${createError ? createError.message : 'None'}
- Created Task: ${createData ? createData.title : 'No data'}
`;
      
      setTestResult(envCheck + authCheck + tasksCheck + fetchCheck + createCheck);
    } catch (err) {
      setTestResult(`Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Environment Test Page</h1>
      
      <button
        onClick={testSupabase}
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50 mb-4"
      >
        {loading ? 'Testing...' : 'Run Tests'}
      </button>
      
      <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded overflow-auto whitespace-pre-wrap">
        {testResult || 'Click "Run Tests" to test the environment'}
      </pre>
      
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-2">Quick Actions</h2>
        <div className="space-y-2">
          <button
            onClick={() => window.location.href = '/'}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 mr-2"
          >
            Go to Home
          </button>
          <button
            onClick={() => {
              
              {}();
            }}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Open Task Modal
          </button>
        </div>
      </div>
    </div>
  );
}
