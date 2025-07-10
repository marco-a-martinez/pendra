'use client';
// Force deployment refresh - cache bust

import { useAppStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { ViewType } from '@/types';
import { 
  Inbox, 
  Calendar, 
  CheckSquare, 
  FolderOpen, 
  BarChart3, 
  Plus,
  Menu,
  Settings,
  Moon,
  Sun
} from 'lucide-react';
import { useTheme } from './ThemeProvider';

const navigationItems = [
  { id: 'inbox', label: 'Inbox', icon: Inbox, count: 0 },
  { id: 'today', label: 'Today', icon: CheckSquare, count: 0 },
  { id: 'upcoming', label: 'Upcoming', icon: Calendar, count: 0 },
  { id: 'projects', label: 'Projects', icon: FolderOpen, count: 0 },
  { id: 'dashboard', label: 'Dashboard', icon: BarChart3, count: 0 },
];

export function Sidebar() {
  const { 
    currentView, 
    setCurrentView, 
    sidebarCollapsed, 
    toggleSidebar,
    projects,
    tasks
  } = useAppStore();
  const { darkMode, toggleDarkMode } = useTheme();

  // Calculate counts for each view
  const getCounts = () => {
    const inboxCount = tasks.filter(t => t.status === 'inbox').length;
    const todayCount = tasks.filter(t => t.status === 'today').length;
    const upcomingCount = tasks.filter(t => t.status === 'upcoming').length;
    
    return {
      inbox: inboxCount,
      today: todayCount,
      upcoming: upcomingCount,
      projects: projects.length,
      dashboard: 0
    };
  };

  const counts = getCounts();

  return (
    <div className={cn(
      'fixed left-0 top-0 h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 z-20',
      sidebarCollapsed ? 'w-16' : 'w-64'
    )}>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center p-4 border-b border-gray-200 dark:border-gray-700">
          {!sidebarCollapsed && (
            <h1 className="text-xl font-bold text-gray-900 dark:text-white truncate flex-1 mr-2">
              Pendra
            </h1>
          )}
          <button
            type="button"
            onClick={toggleSidebar}
            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex-shrink-0 ml-auto"
            data-1p-ignore
            data-lpignore="true"
          >
            <Menu className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const count = counts[item.id as keyof typeof counts];
            
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setCurrentView(item.id as ViewType)}
                className={cn(
                  'sidebar-item w-full',
                  currentView === item.id && 'active'
                )}
                data-1p-ignore
                data-lpignore="true"
              >
                <Icon className="w-5 h-5 mr-3 flex-shrink-0" />
                {!sidebarCollapsed && (
                  <>
                    <span className="flex-1 text-left">{item.label}</span>
                    {count > 0 && (
                      <span className="bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 text-xs px-2 py-1 rounded-full">
                        {count}
                      </span>
                    )}
                  </>
                )}
              </button>
            );
          })}

          {!sidebarCollapsed && (
            <>
              {/* Projects Section */}
              <div className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Projects
                  </h3>
                  <button 
                    type="button"
                    className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                    data-1p-ignore
                    data-lpignore="true"
                  >
                    <Plus className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  </button>
                </div>
                <div className="space-y-1">
                  {projects.slice(0, 5).map((project) => (
                    <button
                      key={project.id}
                      type="button"
                      className="sidebar-item w-full"
                      data-1p-ignore
                      data-lpignore="true"
                    >
                      <div 
                        className="w-3 h-3 rounded-full mr-3 flex-shrink-0"
                        style={{ backgroundColor: project.color }}
                      />
                      <span className="flex-1 text-left truncate">{project.name}</span>
                    </button>
                  ))}
                  {projects.length === 0 && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 px-3 py-2">
                      No projects yet
                    </p>
                  )}
                </div>
              </div>
            </>
          )}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
          <button
            type="button"
            onClick={toggleDarkMode}
            className="sidebar-item w-full"
            data-1p-ignore
            data-lpignore="true"
          >
            {darkMode ? (
              <Sun className="w-5 h-5 mr-3 flex-shrink-0" />
            ) : (
              <Moon className="w-5 h-5 mr-3 flex-shrink-0" />
            )}
            {!sidebarCollapsed && (
              <span className="flex-1 text-left">
                {darkMode ? 'Light Mode' : 'Dark Mode'}
              </span>
            )}
          </button>
          
          <button 
            type="button"
            className="sidebar-item w-full"
            data-1p-ignore
            data-lpignore="true"
          >
            <Settings className="w-5 h-5 mr-3 flex-shrink-0" />
            {!sidebarCollapsed && (
              <span className="flex-1 text-left">Settings</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
