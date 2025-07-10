'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import { AppLayout } from '@/components/AppLayout';
import { TaskModal } from '@/components/TaskModal';
import { TodayView } from '@/components/views/TodayView';
import { InboxView } from '@/components/views/InboxView';
import { UpcomingView } from '@/components/views/UpcomingView';
import { ProjectsView } from '@/components/views/ProjectsView';
import { CalendarView } from '@/components/views/CalendarView';
import { DashboardView } from '@/components/views/DashboardView';
import { useTasks } from '@/hooks/use-tasks';
import { useAuth } from '@/components/AuthProvider';

export default function HomePage() {
  const { currentView } = useAppStore();
  const { user, loading } = useAuth();
  const router = useRouter();
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);
  
  // Load tasks and projects from Supabase
  useTasks();
  
  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }
  
  // Don't render app if not authenticated
  if (!user) {
    return null;
  }

  const renderView = () => {
    switch (currentView) {
      case 'inbox':
        return <InboxView />;
      case 'today':
        return <TodayView />;
      case 'upcoming':
        return <UpcomingView />;
      case 'projects':
        return <ProjectsView />;
      case 'calendar':
        return <CalendarView />;
      case 'dashboard':
        return <DashboardView />;
      default:
        return <TodayView />;
    }
  };

  return (
    <>
      <AppLayout>
        {renderView()}
      </AppLayout>
      <TaskModal />
    </>
  );
}
