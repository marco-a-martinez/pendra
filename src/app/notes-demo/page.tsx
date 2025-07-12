'use client';

import { useState } from 'react';
import { TaskCard } from '@/components/TaskCard';
import { Task } from '@/types';
import { useAppStore } from '@/lib/store';

export default function NotesDemoPage() {
  // Use the actual store
  const store = useAppStore();
  
  // Demo tasks with notes
  const demoTasks: Task[] = [
    {
      id: 'demo-1',
      user_id: 'demo',
      title: 'Prepare Presentation',
      description: '',
      notes: `Keep the talk simple:
- [ ] Revise introduction
- [ ] Simplify slide layouts
- [x] Review quarterly data

Remember to bring adapter!`,
      status: 'today',
      priority: 'high',
      tags: ['work', 'important'],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      order_index: 1
    },
    {
      id: 'demo-2',
      user_id: 'demo',
      title: 'Book hotels for trip',
      description: '',
      notes: `Make sure they are central, have WiFi, and are close to a subway station.

# Cities
- London from June 3
- Paris from June 10
- Berlin from June 17

## Budget
Max $150 per night`,
      status: 'today',
      priority: 'medium',
      tags: ['travel'],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      order_index: 2
    },
    {
      id: 'demo-3',
      user_id: 'demo',
      title: 'Review quarterly data with Olivia',
      description: '',
      notes: '',
      status: 'today',
      priority: 'medium',
      tags: ['work'],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      order_index: 3
    }
  ];

  // Add demo tasks to store if not already present
  useState(() => {
    demoTasks.forEach(task => {
      if (!store.tasks.find(t => t.id === task.id)) {
        store.addTask(task);
      }
    });
  });

  const displayTasks = store.tasks.filter(t => t.id.startsWith('demo-'));

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Things 3 Style Notes Demo
        </h1>
        <p className="text-gray-600 mb-8">
          Click on tasks to expand and see the new inline notes feature. 
          Try editing notes and using markdown checkboxes!
        </p>
        
        <div className="space-y-2">
          {displayTasks.map(task => (
            <TaskCard 
              key={task.id} 
              task={task}
            />
          ))}
        </div>
        
        <div className="mt-12 p-6 bg-white rounded-lg border border-gray-200">
          <h2 className="text-lg font-semibold mb-3">Notes Features:</h2>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>• Click any task to expand and see notes</li>
            <li>• Click on notes area to edit</li>
            <li>• Use <code className="bg-gray-100 px-1 py-0.5 rounded">- [ ]</code> for interactive checkboxes</li>
            <li>• Use <code className="bg-gray-100 px-1 py-0.5 rounded">#</code> for headings</li>
            <li>• Use <code className="bg-gray-100 px-1 py-0.5 rounded">-</code> for bullet points</li>
            <li>• Notes are styled with Things 3's minimal aesthetic</li>
          </ul>
        </div>
      </div>
    </div>
  );
}