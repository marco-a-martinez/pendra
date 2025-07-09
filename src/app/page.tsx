'use client';

import { useAppStore } from '@/lib/store';
import { AppLayout } from '@/components/AppLayout';
import { TodayView } from '@/components/views/TodayView';
import { InboxView } from '@/components/views/InboxView';
import { UpcomingView } from '@/components/views/UpcomingView';
import { ProjectsView } from '@/components/views/ProjectsView';
import { CalendarView } from '@/components/views/CalendarView';
import { DashboardView } from '@/components/views/DashboardView';

export default function HomePage() {
  const { currentView } = useAppStore();

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
    <AppLayout>
      {renderView()}
    </AppLayout>
  );
}
