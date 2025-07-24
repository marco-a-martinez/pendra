'use client';

import { useAppStore } from '@/lib/store';
import { TaskCard } from '@/components/TaskCard';
import { EmptyState } from '@/components/EmptyState';
import { InlineTaskCreator } from '@/components/InlineTaskCreator';
import { Inbox } from 'lucide-react';

export function InboxView() {
  const { tasks } = useAppStore();

  const inboxTasks = tasks.filter(task => task.status === 'inbox');

  if (inboxTasks.length === 0) {
    return (
      <EmptyState
        icon={Inbox}
        title="Your inbox is empty"
        description="All your new tasks will appear here. Add your first task to get started."
        actionLabel="Add Task"
        onAction={() => {}}
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
        <InlineTaskCreator 
          defaultStatus="inbox" 
          placeholder="Add a task to your inbox..."
        />
        
        {inboxTasks.map(task => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
}
