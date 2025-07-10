'use client';

import { useAppStore } from '@/lib/store';
import { TaskCard } from '@/components/TaskCard';
import { EmptyState } from '@/components/EmptyState';
import { Calendar } from 'lucide-react';
import { formatDate, isToday, isTomorrow } from '@/lib/dateUtils';
import { addDays, startOfDay } from 'date-fns';

export function UpcomingView() {
  const { tasks, setTaskModalOpen } = useAppStore();

  // Filter upcoming tasks (not today, but have due dates or are scheduled)
  const upcomingTasks = tasks.filter(task => {
    if (task.status === 'completed') return false;
    
    const dueDate = task.due_date ? new Date(task.due_date) : null;
    const scheduledDate = task.scheduled_time ? new Date(task.scheduled_time) : null;
    
    if (dueDate && dueDate >= startOfDay(addDays(new Date(), 1))) return true;
    if (scheduledDate && scheduledDate >= startOfDay(addDays(new Date(), 1))) return true;
    if (task.status === 'upcoming') return true;
    
    return false;
  });

  // Group tasks by date
  const groupedTasks = upcomingTasks.reduce((groups, task) => {
    const date = task.due_date || task.scheduled_time;
    if (!date) {
      const key = 'No date';
      if (!groups[key]) groups[key] = [];
      groups[key].push(task);
      return groups;
    }
    
    const taskDate = new Date(date);
    let key: string;
    
    if (isToday(taskDate)) {
      key = 'Today';
    } else if (isTomorrow(taskDate)) {
      key = 'Tomorrow';
    } else {
      key = formatDate(taskDate);
    }
    
    if (!groups[key]) groups[key] = [];
    groups[key].push(task);
    return groups;
  }, {} as Record<string, typeof upcomingTasks>);

  if (upcomingTasks.length === 0) {
    return (
      <EmptyState
        icon={Calendar}
        title="No upcoming tasks"
        description="You don't have any tasks scheduled for the future. Add some tasks with due dates to see them here."
        actionLabel="Add Task"
        onAction={() => setTaskModalOpen(true)}
      />
    );
  }

  return (
    <div className="space-y-6">
      {Object.entries(groupedTasks)
        .sort(([a], [b]) => {
          // Sort by date, with "No date" at the end
          if (a === 'No date') return 1;
          if (b === 'No date') return -1;
          if (a === 'Today') return -1;
          if (b === 'Today') return 1;
          if (a === 'Tomorrow') return -1;
          if (b === 'Tomorrow') return 1;
          return new Date(a).getTime() - new Date(b).getTime();
        })
        .map(([date, tasks]) => (
          <div key={date}>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {date} ({tasks.length})
            </h2>
            <div className="space-y-3">
              {tasks.map(task => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          </div>
        ))
      }
    </div>
  );
}
