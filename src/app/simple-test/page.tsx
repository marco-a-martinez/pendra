'use client';

import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { Task } from '@/types';

export default function SimpleTestPage() {
  const { tasks, addTask,  } = useAppStore();
  const [title, setTitle] = useState('');

  const handleAddTask = () => {
    if (!title.trim()) return;
    
    const newTask: Task = {
      id: `test-${Date.now()}`,
      user_id: 'test-user-123',
      title: title.trim(),
      status: 'inbox',
      priority: 'medium',
      tags: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      order_index: Date.now(),
    };
    
    addTask(newTask);
    setTitle('');
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Simple Test Page (No Supabase)</h1>
      
      <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900 rounded">
        <p className="text-sm">This page tests the app without Supabase integration.</p>
        <p className="text-sm">Tasks are only stored in memory and will be lost on refresh.</p>
      </div>
      
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Add Task (Local Only)</h2>
        <div className="flex gap-2">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
            placeholder="Enter task title"
            className="flex-1 px-3 py-2 border rounded dark:bg-gray-800 dark:border-gray-600"
          />
          <button
            onClick={handleAddTask}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Add Task
          </button>
        </div>
      </div>
      
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Current Tasks ({tasks.length})</h2>
        {tasks.length === 0 ? (
          <p className="text-gray-500">No tasks yet. Add one above!</p>
        ) : (
          <ul className="space-y-2">
            {tasks.map((task) => (
              <li key={task.id} className="p-3 bg-gray-100 dark:bg-gray-800 rounded">
                <div className="font-medium">{task.title}</div>
                <div className="text-sm text-gray-500">
                  Status: {task.status} | Priority: {task.priority} | ID: {task.id}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Test Modal State</h2>
        <p className="mb-2">Task creation removed</p>
        <button
          onClick={() => alert("Task creation removed")}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Toggle Task Modal
        </button>
      </div>
      
      <div>
        <a href="/" className="text-blue-500 hover:underline">← Back to Home</a>
      </div>
    </div>
  );
}
