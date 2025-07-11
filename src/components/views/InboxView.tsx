'use client';

import { useAppStore } from '@/lib/store';
import { TaskCard } from '@/components/TaskCard';
import { EmptyState } from '@/components/EmptyState';
import { Inbox } from 'lucide-react';

export function InboxView() {
  const { tasks, setTaskModalOpen } = useAppStore();

  const inboxTasks = tasks.filter(task => task.status === 'inbox');

  if (inboxTasks.length === 0) {
    return (
      <EmptyState
        icon={Inbox}
        title="Your inbox is empty"
        description="All your new tasks will appear here. Add your first task to get started."
        actionLabel="Add Task"
        onAction={() => setTaskModalOpen(true)}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {inboxTasks.length} task{inboxTasks.length !== 1 ? 's' : ''} in your inbox
        </p>
      </div>
      
      <div className="space-y-3">
        {/* Inline Add Task Button */}
        <button
          onClick={() => setTaskModalOpen(true)}
          className="w-full p-4 text-left rounded-xl border border-dashed border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-all duration-200 group"
        >
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 rounded-full border-2 border-gray-300 dark:border-gray-700 group-hover:border-blue-500 dark:group-hover:border-blue-400 transition-colors" />
            <span className="text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors">
              Add a task...
            </span>
          </div>
        </button>
        
        {inboxTasks.map(task => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
}
