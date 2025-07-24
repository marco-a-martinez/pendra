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
      order: todo.order ?? index,
      // Migrate old todos without due date field
      dueDate: todo.dueDate ? new Date(todo.dueDate) : null
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

// Sort todos by due date and then by order
export function sortTodosByDueDateAndOrder(todos: Todo[]): Todo[] {
  return todos.sort((a, b) => {
    // First, sort by due date (overdue first, then by date)
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
