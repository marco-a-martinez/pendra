import { Todo, Section } from './types';

const TODOS_STORAGE_KEY = 'pendra-todos';
const SECTIONS_STORAGE_KEY = 'pendra-sections';

// Default section for migration
const DEFAULT_SECTION: Section = {
  id: 'default',
  name: 'Tasks',
  order: 0,
  collapsed: false
};

export function saveTodos(todos: Todo[]): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(TODOS_STORAGE_KEY, JSON.stringify(todos));
  }
}

export function loadTodos(): Todo[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(TODOS_STORAGE_KEY);
    if (!stored) return [];
    
    const parsed = JSON.parse(stored);
    return parsed.map((todo: any, index: number) => ({
      ...todo,
      createdAt: new Date(todo.createdAt),
      // Migrate old todos without order field
      order: todo.order ?? index,
      // Migrate old todos without due date field
      dueDate: todo.dueDate ? new Date(todo.dueDate) : null,
      // Migrate old todos without section field
      sectionId: todo.sectionId ?? 'default'
    }));
  } catch {
    return [];
  }
}

export function saveSections(sections: Section[]): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(SECTIONS_STORAGE_KEY, JSON.stringify(sections));
  }
}

export function loadSections(): Section[] {
  if (typeof window === 'undefined') return [DEFAULT_SECTION];
  
  try {
    const stored = localStorage.getItem(SECTIONS_STORAGE_KEY);
    if (!stored) return [DEFAULT_SECTION];
    
    const parsed = JSON.parse(stored);
    return parsed.map((section: any, index: number) => ({
      ...section,
      // Migrate old sections without order field
      order: section.order ?? index,
      collapsed: section.collapsed ?? false
    }));
  } catch {
    return [DEFAULT_SECTION];
  }
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Helper function to reorder array
export function reorderArray<T>(array: T[], startIndex: number, endIndex: number): T[] {
  const result = Array.from(array);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
}

// Helper function to update order values after reordering
export function updateOrderValues<T extends { order: number }>(items: T[]): T[] {
  return items.map((item, index) => ({
    ...item,
    order: index
  }));
}

// Sort todos by due date and then by order within sections
export function sortTodosByDueDateAndOrder(todos: Todo[]): Todo[] {
  return todos.sort((a, b) => {
    // First, sort by section
    if (a.sectionId !== b.sectionId) {
      return a.sectionId.localeCompare(b.sectionId);
    }
    
    // Within same section, sort by due date
    if (a.dueDate && b.dueDate) {
      return a.dueDate.getTime() - b.dueDate.getTime();
    }
    if (a.dueDate && !b.dueDate) {
      return -1; // Tasks with due dates come first
    }
    if (!a.dueDate && b.dueDate) {
      return 1; // Tasks without due dates come last
    }
    // If neither has due date, sort by order
    return a.order - b.order;
  });
}

// Get todos for a specific section, sorted by order
export function getTodosForSection(todos: Todo[], sectionId: string): Todo[] {
  return todos
    .filter(todo => todo.sectionId === sectionId)
    .sort((a, b) => a.order - b.order);
}

// Get the highest order value for todos in a section
export function getNextTodoOrder(todos: Todo[], sectionId: string): number {
  const sectionTodos = getTodosForSection(todos, sectionId);
  return sectionTodos.length > 0 ? Math.max(...sectionTodos.map(t => t.order)) + 1 : 0;
}

// Get the highest order value for sections
export function getNextSectionOrder(sections: Section[]): number {
  return sections.length > 0 ? Math.max(...sections.map(s => s.order)) + 1 : 0;
}
