'use client';

import { useAppStore } from '@/lib/store';
import { useAuth } from './AuthProvider';
import { signOut } from '@/lib/supabase';
import { Plus, Search, Bell, LogOut } from 'lucide-react';
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
  const { currentView, selectedDate, setTaskModalOpen } = useAppStore();
  const { user } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  const getViewTitle = () => {
    if (currentView === 'today') {
      return `Today • ${formatDate(new Date())}`;
    }
    if (currentView === 'calendar') {
      return `Calendar • ${formatDate(selectedDate)}`;
    }
    return viewTitles[currentView] || 'Pendra';
  };

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 md:px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 min-w-0 flex-1">
          <h1 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white truncate">
            {getViewTitle()}
          </h1>
        </div>

        <div className="flex items-center space-x-2 md:space-x-4">
          {/* Search */}
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search tasks..."
              className="pl-10 pr-4 py-2 w-48 lg:w-64 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* Add Task Button */}
          <button
            onClick={() => setTaskModalOpen(true)}
            className="btn-primary flex items-center space-x-2 whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Task</span>
          </button>

          {/* Notifications */}
          <button className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors relative">
            <Bell className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* User Menu */}
          <div className="relative group">
            <button className="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                {user?.user_metadata?.avatar_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={user.user_metadata.avatar_url}
                    alt="Profile"
                    className="w-8 h-8 rounded-full"
                  />
                ) : (
                  getInitials(user?.user_metadata?.full_name || user?.email || 'U')
                )}
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {user?.user_metadata?.full_name || 'User'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {user?.email}
                </p>
              </div>
            </button>

            {/* Dropdown Menu */}
            <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <div className="py-1">
                <button
                  onClick={handleSignOut}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <LogOut className="w-4 h-4 mr-3" />
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
