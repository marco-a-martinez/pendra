import { Todo } from './types';

const STORAGE_KEY = 'pendra-todos';

export function saveTodos(todos: Todo[]): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }
}

export function loadTodos(): Todo[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    
    const parsed = JSON.parse(stored);
    return parsed.map((todo: any, index: number) => ({
      ...todo,
      createdAt: new Date(todo.createdAt),
      // Migrate old todos without order field
      order: todo.order ?? index
    }));
  } catch {
    return [];
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
export function updateOrderValues(todos: Todo[]): Todo[] {
  return todos.map((todo, index) => ({
    ...todo,
    order: index
  }));
}
