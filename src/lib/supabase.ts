import { createClient } from '@supabase/supabase-js';
import { Todo, Section } from './types';

const supabaseUrl = 'https://mwiqrrqaxntpvjdkadhfd.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im13aXFycWF4bnRwdmpka2FkaGZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIxMDU0MTYsImV4cCI6MjA2NzY4MTQxNn0.oyDPn3nbg3YssjMbL2gbcQ6mbb8ZOW_KZZMf3ySA-iM';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types for Supabase
export interface DatabaseTodo {
  id: string;
  text: string;
  completed: boolean;
  created_at: string;
  order_index: number;
  due_date?: string | null;
  section_id: string;
  checklist?: any[] | null;
  checklist_expanded?: boolean;
}

export interface DatabaseSection {
  id: string;
  name: string;
  color?: string | null;
  order_index: number;
  collapsed?: boolean;
}

// Convert database todo to app todo
export function dbTodoToTodo(dbTodo: DatabaseTodo): Todo {
  return {
    id: dbTodo.id,
    text: dbTodo.text,
    completed: dbTodo.completed,
    createdAt: new Date(dbTodo.created_at),
    order: dbTodo.order_index,
    dueDate: dbTodo.due_date ? new Date(dbTodo.due_date) : null,
    sectionId: dbTodo.section_id,
    checklist: dbTodo.checklist || undefined,
    checklistExpanded: dbTodo.checklist_expanded || false,
  };
}

// Convert app todo to database todo
export function todoToDbTodo(todo: Todo): Omit<DatabaseTodo, 'created_at'> {
  return {
    id: todo.id,
    text: todo.text,
    completed: todo.completed,
    order_index: todo.order,
    due_date: todo.dueDate ? todo.dueDate.toISOString() : null,
    section_id: todo.sectionId,
    checklist: todo.checklist || null,
    checklist_expanded: todo.checklistExpanded || false,
  };
}

// Convert database section to app section
export function dbSectionToSection(dbSection: DatabaseSection): Section {
  return {
    id: dbSection.id,
    name: dbSection.name,
    color: dbSection.color || undefined,
    order: dbSection.order_index,
    collapsed: dbSection.collapsed || false,
  };
}

// Convert app section to database section
export function sectionToDbSection(section: Section): DatabaseSection {
  return {
    id: section.id,
    name: section.name,
    color: section.color || null,
    order_index: section.order,
    collapsed: section.collapsed || false,
  };
}
