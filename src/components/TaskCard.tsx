'use client';

import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { Task } from '@/types';
import { cn, priorityColors } from '@/lib/utils';
import { formatDate, formatTime, isOverdue } from '@/lib/dateUtils';
import { 
  Calendar, 
  Clock, 
  Flag, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  CheckCircle2,
  Circle,
  FolderOpen
} from 'lucide-react';

interface TaskCardProps {
  task: Task;
  className?: string;
}

export function TaskCard({ task, className }: TaskCardProps) {
  const { updateTask, deleteTask, setEditingTask, setTaskModalOpen, projects } = useAppStore();
  const [showMenu, setShowMenu] = useState(false);

  const project = projects.find(p => p.id === task.project_id);
  const isCompleted = task.status === 'completed';
  const overdue = isOverdue(task.due_date || null);

  const handleToggleComplete = () => {
    updateTask(task.id, {
      status: isCompleted ? 'inbox' : 'completed',
      completed_at: isCompleted ? undefined : new Date().toISOString()
    });
  };

  const handleEdit = () => {
    setEditingTask(task);
    setTaskModalOpen(true);
    setShowMenu(false);
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this task?')) {
      deleteTask(task.id);
    }
    setShowMenu(false);
  };

  return (
    <div className={cn(
      'task-card group relative',
      isCompleted && 'task-completed',
      className
    )}>
      <div className="flex items-start space-x-3">
        {/* Completion Toggle */}
        <button
          onClick={handleToggleComplete}
          className="mt-1 flex-shrink-0 transition-colors duration-200"
        >
          {isCompleted ? (
            <CheckCircle2 className="w-5 h-5 text-green-500" />
          ) : (
            <Circle className="w-5 h-5 text-gray-400 hover:text-green-500" />
          )}
        </button>

        {/* Task Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className={cn(
                'text-sm font-medium text-gray-900 dark:text-white',
                isCompleted && 'line-through text-gray-500 dark:text-gray-400'
              )}>
                {task.title}
              </h3>
              
              {task.description && (
                <div 
                  className="mt-1 text-sm text-gray-600 dark:text-gray-400 prose prose-sm dark:prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: task.description }}
                />
              )}
            </div>

            {/* Actions Menu */}
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
              >
                <MoreHorizontal className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              </button>
              
              {showMenu && (
                <div className="absolute right-0 top-full mt-1 w-32 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-10">
                  <button
                    onClick={handleEdit}
                    className="flex items-center w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </button>
                  <button
                    onClick={handleDelete}
                    className="flex items-center w-full px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Task Meta */}
          <div className="mt-2 flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
            {/* Project */}
            {project && (
              <div className="flex items-center">
                <FolderOpen className="w-3 h-3 mr-1" />
                <span style={{ color: project.color }}>{project.name}</span>
              </div>
            )}

            {/* Due Date */}
            {task.due_date && (
              <div className={cn(
                'flex items-center',
                overdue && 'text-red-500 dark:text-red-400'
              )}>
                <Calendar className="w-3 h-3 mr-1" />
                <span>{formatDate(task.due_date)}</span>
              </div>
            )}

            {/* Scheduled Time */}
            {task.scheduled_time && (
              <div className="flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                <span>{formatTime(task.scheduled_time)}</span>
              </div>
            )}

            {/* Priority */}
            <div className={cn(
              'flex items-center px-2 py-1 rounded-full text-xs border',
              priorityColors[task.priority]
            )}>
              <Flag className="w-3 h-3 mr-1" />
              <span className="capitalize">{task.priority}</span>
            </div>

            {/* Duration */}
            {task.estimated_duration && (
              <div className="flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                <span>{task.estimated_duration}m</span>
              </div>
            )}
          </div>

          {/* Tags */}
          {task.tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {task.tags.map(tag => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-md"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Color Indicator */}
      {task.color && (
        <div 
          className="absolute left-0 top-0 bottom-0 w-1 rounded-l-lg"
          style={{ backgroundColor: task.color }}
        />
      )}
    </div>
  );
}
