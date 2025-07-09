'use client';

import { useAppStore } from '@/lib/store';
import { TaskCard } from '@/components/TaskCard';
import { EmptyState } from '@/components/EmptyState';
import { CheckSquare } from 'lucide-react';
import { isToday, isDueToday } from '@/lib/dateUtils';

export function TodayView() {
  const { tasks } = useAppStore();

  // Filter tasks for today
  const todayTasks = tasks.filter(task => 
    task.status === 'today' || 
    isDueToday(task.due_date) ||
    (task.scheduled_time && isToday(new Date(task.scheduled_time)))
  );

  const completedTasks = todayTasks.filter(task => task.status === 'completed');
  const pendingTasks = todayTasks.filter(task => task.status !== 'completed');

  if (todayTasks.length === 0) {
    return (
      <EmptyState
        icon={CheckSquare}
        title="No tasks for today"
        description="You're all caught up! Add a new task or schedule something for today."
        actionLabel="Add Task"
        onAction={() => useAppStore.getState().setTaskModalOpen(true)}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Pending Tasks */}
      {pendingTasks.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Today's Tasks ({pendingTasks.length})
          </h2>
          <div className="space-y-3">
            {pendingTasks.map(task => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        </div>
      )}

      {/* Completed Tasks */}
      {completedTasks.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Completed ({completedTasks.length})
          </h2>
          <div className="space-y-3">
            {completedTasks.map(task => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        </div>
      )}

      {/* Progress Summary */}
      {todayTasks.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Today's Progress
          </h3>
          <div className="flex items-center space-x-4">
            <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                style={{ 
                  width: `${todayTasks.length > 0 ? (completedTasks.length / todayTasks.length) * 100 : 0}%` 
                }}
              />
            </div>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {completedTasks.length} of {todayTasks.length} completed
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
