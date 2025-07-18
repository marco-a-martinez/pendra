'use client';

import {
  Plus,
  Inbox,
  CheckSquare,
  Calendar,
  FolderOpen,
  BarChart3,
  Sun,
  Moon,
  Settings,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/lib/store';
import { ViewType } from '@/types';

const navigationItems = [
  { id: 'inbox', label: 'Inbox', icon: Inbox },
  { id: 'today', label: 'Today', icon: CheckSquare },
  { id: 'upcoming', label: 'Upcoming', icon: Calendar },
  { id: 'projects', label: 'Projects', icon: FolderOpen },
  { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
];

export function Sidebar() {
  const {
    currentView,
    setCurrentView,
    darkMode,
    toggleDarkMode,
    tasks,
    projects,
  } = useAppStore();

  const counts = {
    inbox: tasks.filter((t) => t.status === 'inbox').length,
    today: tasks.filter((t) => t.status === 'today').length,
    upcoming: tasks.filter((t) => t.status === 'upcoming').length,
    projects: projects.length,
    dashboard: 0,
  } as const;

  return (
    <div
      className={cn(
        'fixed left-0 top-0 h-full w-64',
        'bg-gradient-to-b from-gray-50/50 to-white dark:from-gray-900 dark:to-gray-800',
        'shadow-xl z-20 flex flex-col'
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-start p-6">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
          Pendra
        </h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        {navigationItems.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => setCurrentView(id as ViewType)}
            className={cn('sidebar-item w-full', currentView === id && 'active')}
            data-1p-ignore
            data-lpignore="true"
          >
            <Icon className="w-4 h-4 flex-shrink-0" />
            <span className="flex-1 text-left">{label}</span>
            {counts[id as keyof typeof counts] > 0 && (
              <span className="bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 text-xs px-2 py-1 rounded-full">
                {counts[id as keyof typeof counts]}
              </span>
            )}
          </button>
        ))}

        {/* Projects */}
        <div className="pt-6 mt-6">
          <div className="flex items-center justify-between mb-3 px-3">
            <h3 className="text-xs font-semibold text-muted-foreground/70 tracking-wider">
              Projects
            </h3>
            <button
              type="button"
              onClick={() => {
                setCurrentView('projects');
                // Trigger the new project form in ProjectsView
                setTimeout(() => {
                  const event = new CustomEvent('showNewProject');
                  window.dispatchEvent(event);
                }, 100);
              }}
              className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
              data-1p-ignore
              data-lpignore="true"
            >
              <Plus className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            </button>
          </div>

          <div className="space-y-1">
            {projects.map((p) => (
              <button
                key={p.id}
                type="button"
                className="sidebar-item w-full text-sm"
              >
                <span
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: p.color }}
                />
                <span className="flex-1 text-left truncate">{p.name}</span>
              </button>
            ))}
            {projects.length === 0 && (
              <p className="text-sm text-gray-500 dark:text-gray-400 px-3 py-2">No projects yet</p>
            )}
          </div>
        </div>
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-gray-200 dark:border-gray-700">
        <button
          type="button"
          onClick={toggleDarkMode}
          className="sidebar-item w-full"
          data-1p-ignore
          data-lpignore="true"
        >
          {darkMode ? (
            <Sun className="w-4 h-4 flex-shrink-0" />
          ) : (
            <Moon className="w-4 h-4 flex-shrink-0" />
          )}
          <span className="flex-1 text-left">{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
        </button>

        <button
          type="button"
          className="sidebar-item w-full"
          data-1p-ignore
          data-lpignore="true"
        >
          <Settings className="w-4 h-4 flex-shrink-0" />
          <span className="flex-1 text-left">Settings</span>
        </button>
      </div>
    </div>
  );
}
