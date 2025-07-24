import { format, isToday, isTomorrow, isPast, isThisWeek, startOfDay } from 'date-fns';

export function formatDueDate(date: Date): string {
  if (isToday(date)) {
    return 'Today';
  }
  if (isTomorrow(date)) {
    return 'Tomorrow';
  }
  if (isThisWeek(date)) {
    return format(date, 'EEEE'); // Monday, Tuesday, etc.
  }
  return format(date, 'MMM d'); // Jan 24, Feb 15, etc.
}

export function getDueDateStatus(date: Date): 'overdue' | 'today' | 'tomorrow' | 'upcoming' {
  const today = startOfDay(new Date());
  const dueDate = startOfDay(date);
  
  if (isPast(dueDate) && !isToday(dueDate)) {
    return 'overdue';
  }
  if (isToday(dueDate)) {
    return 'today';
  }
  if (isTomorrow(dueDate)) {
    return 'tomorrow';
  }
  return 'upcoming';
}

export function getDueDateColor(status: 'overdue' | 'today' | 'tomorrow' | 'upcoming'): string {
  switch (status) {
    case 'overdue':
      return 'text-red-600 bg-red-50 border-red-200';
    case 'today':
      return 'text-orange-600 bg-orange-50 border-orange-200';
    case 'tomorrow':
      return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    case 'upcoming':
      return 'text-blue-600 bg-blue-50 border-blue-200';
    default:
      return 'text-gray-600 bg-gray-50 border-gray-200';
  }
}

export function formatDateForInput(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}

export function parseDateFromInput(dateString: string): Date {
  return new Date(dateString + 'T00:00:00');
}

// Quick date helpers
export function getTodayDate(): string {
  return formatDateForInput(new Date());
}

export function getTomorrowDate(): string {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return formatDateForInput(tomorrow);
}
