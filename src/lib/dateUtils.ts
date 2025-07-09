import { format, isToday, isTomorrow, isYesterday, startOfDay, endOfDay, addDays, subDays } from 'date-fns';

// Re-export date-fns functions for convenience
export { isToday, isTomorrow, isYesterday, startOfDay, endOfDay, addDays, subDays };

export const formatDate = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  
  if (isToday(d)) return 'Today';
  if (isTomorrow(d)) return 'Tomorrow';
  if (isYesterday(d)) return 'Yesterday';
  
  return format(d, 'MMM d, yyyy');
};

export const formatTime = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return format(d, 'h:mm a');
};

export const formatDateTime = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return `${formatDate(d)} at ${formatTime(d)}`;
};

export const isOverdue = (dueDate: string | null): boolean => {
  if (!dueDate) return false;
  return new Date(dueDate) < startOfDay(new Date());
};

export const isDueToday = (dueDate: string | null): boolean => {
  if (!dueDate) return false;
  return isToday(new Date(dueDate));
};

export const isDueTomorrow = (dueDate: string | null): boolean => {
  if (!dueDate) return false;
  return isTomorrow(new Date(dueDate));
};

export const getDateRange = (view: 'day' | 'week' | 'month', date: Date) => {
  const start = startOfDay(date);
  
  switch (view) {
    case 'day':
      return { start, end: endOfDay(date) };
    case 'week':
      const weekStart = subDays(start, start.getDay());
      const weekEnd = addDays(weekStart, 6);
      return { start: weekStart, end: endOfDay(weekEnd) };
    case 'month':
      const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
      const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      return { start: startOfDay(monthStart), end: endOfDay(monthEnd) };
    default:
      return { start, end: endOfDay(date) };
  }
};

export const generateTimeSlots = (startHour = 6, endHour = 22, intervalMinutes = 30) => {
  const slots = [];
  for (let hour = startHour; hour <= endHour; hour++) {
    for (let minute = 0; minute < 60; minute += intervalMinutes) {
      const time = new Date();
      time.setHours(hour, minute, 0, 0);
      slots.push({
        value: format(time, 'HH:mm'),
        label: format(time, 'h:mm a')
      });
    }
  }
  return slots;
};
