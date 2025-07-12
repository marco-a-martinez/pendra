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
  FileText,
  ChevronDown
} from 'lucide-react';
import { NotesEditor } from './NotesEditor';

interface TaskCardProps {
  task: Task;
  className?: string;
}

export function TaskCard({ task, className }: TaskCardProps) {
  const { updateTask, deleteTask, setEditingTask, setTaskModalOpen, projects } = useAppStore();
  const [showMenu, setShowMenu] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [notes, setNotes] = useState(task.notes || '');

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

  const handleNotesUpdate = (newNotes: string) => {
    setNotes(newNotes);
    updateTask(task.id, { notes: newNotes });
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

      {/* Notes Section */}
      <div className="mt-3 border-t border-gray-100 dark:border-gray-800">
        <button
          onClick={() => setShowNotes(!showNotes)}
          className="flex items-center w-full py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
        >
          <ChevronDown 
            className={cn(
              'w-4 h-4 mr-1 transition-transform duration-200',
              showNotes && 'rotate-180'
            )} 
          />
          <FileText className="w-4 h-4 mr-1" />
          <span className="font-medium">Notes</span>
          {notes && !showNotes && (
            <span className="ml-2 text-xs text-gray-500 dark:text-gray-500">
              {notes.replace(/<[^>]*>/g, '').substring(0, 50)}...
            </span>
          )}
        </button>
        
        {/* Collapsible Notes Editor */}
        <div className={cn(
          'overflow-hidden transition-all duration-300',
          showNotes ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
        )}>
          <div className="pb-3">
            <NotesEditor
              content={notes}
              onChange={handleNotesUpdate}
              placeholder="Add notes, ideas, or additional context..."
              className="mt-2"
            />
          </div>
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
