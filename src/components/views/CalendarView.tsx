'use client';

import { EmptyState } from '@/components/EmptyState';
import { Calendar } from 'lucide-react';

export function CalendarView() {
  return (
    <EmptyState
      icon={Calendar}
      title="Calendar View"
      description="Calendar view is coming soon! You'll be able to see your tasks in a beautiful calendar layout."
    />
  );
}
