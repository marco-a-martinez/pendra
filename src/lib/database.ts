import { supabase, dbTodoToTodo, todoToDbTodo, dbSectionToSection, sectionToDbSection, DatabaseTodo, DatabaseSection } from './supabase';
import { Todo, Section } from './types';

// Default section for migration
const DEFAULT_SECTION: Section = {
  id: 'default',
  name: 'Tasks',
  order: 0,
  collapsed: false
};

// Todo operations
export async function saveTodos(todos: Todo[]): Promise<void> {
  try {
    // Convert todos to database format
    const dbTodos = todos.map(todoToDbTodo);
    
    // Upsert all todos
    const { error } = await supabase
      .from('todos')
      .upsert(dbTodos, { onConflict: 'id' });
    
    if (error) {
      console.error('Error saving todos:', error);
      throw error;
    }
  } catch (error) {
    console.error('Failed to save todos:', error);
    throw error;
  }
}

export async function loadTodos(): Promise<Todo[]> {
  try {
    const { data, error } = await supabase
      .from('todos')
      .select('*')
      .order('order_index');
    
    if (error) {
      console.error('Error loading todos:', error);
      return [];
    }
    
    return (data as DatabaseTodo[]).map(dbTodoToTodo);
  } catch (error) {
    console.error('Failed to load todos:', error);
    return [];
  }
}

export async function saveTodo(todo: Todo): Promise<void> {
  try {
    const dbTodo = todoToDbTodo(todo);
    
    const { error } = await supabase
      .from('todos')
      .upsert(dbTodo, { onConflict: 'id' });
    
    if (error) {
      console.error('Error saving todo:', error);
      throw error;
    }
  } catch (error) {
    console.error('Failed to save todo:', error);
    throw error;
  }
}

export async function deleteTodo(id: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('todos')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting todo:', error);
      throw error;
    }
  } catch (error) {
    console.error('Failed to delete todo:', error);
    throw error;
  }
}

// Section operations
export async function saveSections(sections: Section[]): Promise<void> {
  try {
    // Convert sections to database format
    const dbSections = sections.map(sectionToDbSection);
    
    // Upsert all sections
    const { error } = await supabase
      .from('sections')
      .upsert(dbSections, { onConflict: 'id' });
    
    if (error) {
      console.error('Error saving sections:', error);
      throw error;
    }
  } catch (error) {
    console.error('Failed to save sections:', error);
    throw error;
  }
}

export async function loadSections(): Promise<Section[]> {
  try {
    const { data, error } = await supabase
      .from('sections')
      .select('*')
      .order('order_index');
    
    if (error) {
      console.error('Error loading sections:', error);
      return [DEFAULT_SECTION];
    }
    
    if (!data || data.length === 0) {
      // Create default section if none exist
      await saveSections([DEFAULT_SECTION]);
      return [DEFAULT_SECTION];
    }
    
    return (data as DatabaseSection[]).map(dbSectionToSection);
  } catch (error) {
    console.error('Failed to load sections:', error);
    return [DEFAULT_SECTION];
  }
}

export async function saveSection(section: Section): Promise<void> {
  try {
    const dbSection = sectionToDbSection(section);
    
    const { error } = await supabase
      .from('sections')
      .upsert(dbSection, { onConflict: 'id' });
    
    if (error) {
      console.error('Error saving section:', error);
      throw error;
    }
  } catch (error) {
    console.error('Failed to save section:', error);
    throw error;
  }
}

export async function deleteSection(id: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('sections')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting section:', error);
      throw error;
    }
  } catch (error) {
    console.error('Failed to delete section:', error);
    throw error;
  }
}

// Utility functions (keeping the same as before)
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

export function reorderArray<T>(array: T[], startIndex: number, endIndex: number): T[] {
  const result = Array.from(array);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
}

export function updateOrderValues<T extends { order: number }>(items: T[]): T[] {
  return items.map((item, index) => ({
    ...item,
    order: index
  }));
}

export function sortTodosByDueDateAndOrder(todos: Todo[]): Todo[] {
  return todos.sort((a, b) => {
    if (a.sectionId !== b.sectionId) {
      return a.sectionId.localeCompare(b.sectionId);
    }
    
    if (a.dueDate && b.dueDate) {
      return a.dueDate.getTime() - b.dueDate.getTime();
    }
    if (a.dueDate && !b.dueDate) {
      return -1;
    }
    if (!a.dueDate && b.dueDate) {
      return 1;
    }
    return a.order - b.order;
  });
}

export function getTodosForSection(todos: Todo[], sectionId: string): Todo[] {
  return todos
    .filter(todo => todo.sectionId === sectionId)
    .sort((a, b) => a.order - b.order);
}

export function getNextTodoOrder(todos: Todo[], sectionId: string): number {
  const sectionTodos = getTodosForSection(todos, sectionId);
  return sectionTodos.length > 0 ? Math.max(...sectionTodos.map(t => t.order)) + 1 : 0;
}

export function getNextSectionOrder(sections: Section[]): number {
  return sections.length > 0 ? Math.max(...sections.map(s => s.order)) + 1 : 0;
}
