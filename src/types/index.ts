export interface User {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  color: string;
  created_at: string;
  updated_at: string;
}

export interface Task {
  id: string;
  user_id: string;
  project_id?: string;
  title: string;
  description?: string;
  due_date?: string;
  scheduled_time?: string;
  estimated_duration?: number; // in minutes
  priority: 'low' | 'medium' | 'high';
  status: 'inbox' | 'today' | 'upcoming' | 'completed';
  tags: string[];
  color?: string;
  repeat_rule?: RepeatRule;
  completed_at?: string;
  created_at: string;
  updated_at: string;
  order_index: number;
}

export interface SubTask {
  id: string;
  task_id: string;
  title: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
  order_index: number;
}

export interface RepeatRule {
  type: 'daily' | 'weekly' | 'monthly' | 'custom';
  interval: number;
  days_of_week?: number[]; // 0-6, Sunday = 0
  end_date?: string;
}

export interface Attachment {
  id: string;
  task_id: string;
  name: string;
  url: string;
  type: 'file' | 'link';
  size?: number;
  created_at: string;
}

export interface CalendarEvent {
  id: string;
  task_id: string;
  start_time: string;
  end_time: string;
  title: string;
  description?: string;
  color?: string;
}

export type ViewType = 'inbox' | 'today' | 'upcoming' | 'projects' | 'calendar' | 'dashboard';

export type CalendarViewType = 'day' | 'week' | 'month';

export interface AppState {
  currentView: ViewType;
  selectedDate: Date;
  calendarView: CalendarViewType;
  darkMode: boolean;
  sidebarCollapsed: boolean;
}
