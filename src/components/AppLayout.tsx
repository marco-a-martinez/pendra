'use client';

import { useAppStore } from '@/lib/store';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { TaskModal } from './TaskModal';
import { cn } from '@/lib/utils';

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const { sidebarCollapsed } = useAppStore();

  return (
    <div className="h-screen flex bg-gray-50 dark:bg-gray-900 overflow-hidden">
      <Sidebar />
      <div className={cn(
        'flex-1 flex flex-col transition-all duration-300 min-w-0',
        sidebarCollapsed ? 'ml-16' : 'ml-64',
        'md:ml-64 md:ml-16' // Responsive margins
      )}>
        <Header />
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <div className="max-w-full">
            {children}
          </div>
        </main>
      </div>
      <TaskModal />
    </div>
  );
}
