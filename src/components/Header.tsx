/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { useAuth } from './AuthProvider';
import { createTask as createTaskSupabase } from '@/lib/supabase-tasks';
import { useToast } from '@/hooks/use-toast';
import { Plus, Search, Bell } from 'lucide-react';
import { getInitials } from '@/lib/utils';
import { formatDate } from '@/lib/dateUtils';

const viewTitles = {
  inbox: 'Inbox',
  today: 'Today',
  upcoming: 'Upcoming',
  projects: 'Projects',
  calendar: 'Calendar',
  dashboard: 'Dashboard',
};

export function Header() {
  const { currentView, selectedDate, searchQuery, setSearchQuery, addTask, user: appUser } = useAppStore();
  const { user } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const { toast } = useToast();



  const getViewTitle = () => {
    if (currentView === 'today') {
      const today = new Date();
      return `Today • ${today.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}`;
    }
    if (currentView === 'calendar') {
      return `Calendar • ${formatDate(selectedDate)}`;
    }
    return viewTitles[currentView] || 'Pendra';
  };

  return (
    <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg px-4 md:px-6 py-4 relative z-10 shadow-sm">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center space-x-4 min-w-0 flex-1">
          <h1 className="text-lg md:text-xl lg:text-2xl font-semibold text-gray-900 dark:text-white truncate max-w-full">
            {getViewTitle()}
          </h1>
        </div>

        <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-4 flex-shrink-0 min-w-0">
          {/* Search */}
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 w-48 lg:w-64 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              data-1p-ignore
              data-lpignore="true"
              autoComplete="off"
            />
          </div>

          {/* Add Task Button */}
          <button
            type="button"
            onClick={async () => {
              const title = prompt('What needs to be done?');
              if (!title?.trim() || !appUser) return;
              
              try {
                const taskData = {
                  user_id: appUser.id,
                  title: title.trim(),
                  status: 'inbox' as const,
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
                }
              } catch (error) {
                console.error('Error creating task:', error);
                toast({
                  title: "Error",
                  description: "Failed to create task. Please try again.",
                  variant: "destructive",
                });
              }
            }}
            className="btn-primary flex items-center space-x-2 whitespace-nowrap flex-shrink-0"
            data-1p-ignore
            data-lpignore="true"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Task</span>
          </button>

          {/* Notifications */}
          <div className="relative">
            <button 
              type="button"
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors relative"
              data-1p-ignore
              data-lpignore="true"
            >
              <Bell className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            
            {showNotifications && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="font-semibold text-gray-900 dark:text-white">Notifications</h3>
                </div>
                <div className="p-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400">No new notifications</p>
                </div>
              </div>
            )}
          </div>

          {/* User Menu */}
          <div className="relative group">
            <button 
              type="button"
              className="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              data-1p-ignore
              data-lpignore="true"
            >
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                {user?.user_metadata?.avatar_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={user.user_metadata.avatar_url}
                    alt="Profile"
                    className="w-8 h-8 rounded-full"
                  />
                ) : (
                  getInitials(user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email || 'U')
                )}
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {user?.user_metadata?.full_name || user?.user_metadata?.name || 'User'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {user?.email}
                </p>
              </div>
            </button>

            {/* Dropdown Menu */}

          </div>
        </div>
      </div>
    </header>
  );
}
