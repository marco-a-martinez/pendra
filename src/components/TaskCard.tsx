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
  FolderOpen,
  Tag
} from 'lucide-react';


interface TaskCardProps {
  task: Task;
  className?: string;
}

export function TaskCard({ task, className }: TaskCardProps) {
  const { updateTask, deleteTask, setEditingTask, setTaskModalOpen, projects } = useAppStore();
  const [showMenu, setShowMenu] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

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

  const handleTaskUpdate = (updates: Partial<Task>) => {
    updateTask(task.id, updates);
  };

  return (
    <div 
      className={cn(
        'bg-white rounded-lg shadow-sm border border-gray-100 p-4 mb-2',
        'hover:shadow-md transition-shadow duration-200',
        isCompleted && 'opacity-60',
        className
      )}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div className="flex items-start space-x-3">
        {/* Completion Toggle - Things 3 Style */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleToggleComplete();
          }}
          className="mt-0.5 flex-shrink-0 transition-all duration-200"
        >
          {isCompleted ? (
            <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          ) : (
            <div className="w-6 h-6 rounded-full border-2 border-gray-300 hover:border-blue-500 transition-colors" />
          )}
        </button>

        {/* Task Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className={cn(
                'text-base font-medium text-gray-900',
                isCompleted && 'line-through text-gray-500'
              )}>
                {task.title}
              </h3>

            </div>

            {/* Actions Menu */}
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenu(!showMenu);
                }}
                className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-gray-100 transition-all duration-200"
              >
                <MoreHorizontal className="w-4 h-4 text-gray-500" />
              </button>
              
              {showMenu && (
                <div className="absolute right-0 top-full mt-1 w-32 bg-white rounded-md shadow-lg border border-gray-200 z-10">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit();
                    }}
                    className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete();
                    }}
                    className="flex items-center w-full px-3 py-2 text-sm text-red-600 hover:bg-gray-100 transition-colors"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Task Meta */}
          <div className="mt-2 flex items-center flex-wrap gap-3 text-xs text-gray-500">
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
