'use client';

import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { generateId } from '@/lib/utils';
import { createTask as createTaskSupabase } from '@/lib/supabase-tasks';
import { useToast } from '@/hooks/use-toast';
import { Plus, X } from 'lucide-react';

interface InlineTaskCreatorProps {
  defaultStatus?: 'inbox' | 'today' | 'upcoming';
  placeholder?: string;
  className?: string;
}

export function InlineTaskCreator({ 
  defaultStatus = 'inbox', 
  placeholder = 'Add a task...', 
  className = '' 
}: InlineTaskCreatorProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [title, setTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { addTask, user } = useAppStore();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !user) return;

    setIsLoading(true);
    try {
      const taskData = {
        user_id: user.id,
        title: title.trim(),
        status: defaultStatus,
        priority: 'medium' as const,
        tags: [],
        order_index: Date.now(),
      };

      const { data, error } = await createTaskSupabase(taskData);
      if (error) throw error;
      
      if (data) {
        addTask(data);
        toast({
          title: "Task created",
          description: "Your task has been added successfully.",
        });
        setTitle('');
        setIsExpanded(false);
      }
    } catch (error) {
      console.error('Error creating task:', error);
      toast({
        title: "Error",
        description: "Failed to create task. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setTitle('');
    setIsExpanded(false);
  };

  if (!isExpanded) {
    return (
      <button
        onClick={() => setIsExpanded(true)}
        className={`w-full p-4 text-left rounded-xl border border-dashed border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-all duration-200 group ${className}`}
      >
        <div className="flex items-center gap-3">
          <Plus className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
          <span className="text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors">
            {placeholder}
          </span>
        </div>
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={`w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 ${className}`}>
      <div className="space-y-3">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What needs to be done?"
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          autoFocus
          disabled={isLoading}
        />
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={handleCancel}
            className="px-3 py-1 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!title.trim() || isLoading}
            className="px-4 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'Adding...' : 'Add Task'}
          </button>
        </div>
      </div>
    </form>
  );
}
