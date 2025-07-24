'use client';

import { useState, useEffect } from 'react';
import { Todo } from '@/lib/types';
import { saveTodos, loadTodos, generateId, reorderArray, updateOrderValues, sortTodosByDueDateAndOrder } from '@/lib/storage';
import { TodoItem } from '@/components/TodoItem';
import { AddTodo } from '@/components/AddTodo';
import { CheckSquare, Trash2, ArrowUpDown, Calendar } from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { getDueDateStatus } from '@/lib/dateUtils';

export default function HomePage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed' | 'overdue' | 'today'>('all');
  const [sortBy, setSortBy] = useState<'manual' | 'dueDate'>('manual');

  // Load todos from localStorage on mount
  useEffect(() => {
    setTodos(loadTodos());
  }, []);

  // Save todos to localStorage whenever todos change
  useEffect(() => {
    saveTodos(todos);
  }, [todos]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const addTodo = (text: string, dueDate?: Date) => {
    const newTodo: Todo = {
      id: generateId(),
      text,
      completed: false,
      createdAt: new Date(),
      order: todos.length, // Add to end
      dueDate: dueDate || null,
    };
    setTodos(prev => [...prev, newTodo]);
  };

  const toggleTodo = (id: string) => {
    setTodos(prev =>
      prev.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: string) => {
    setTodos(prev => {
      const filtered = prev.filter(todo => todo.id !== id);
      // Update order values after deletion
      return updateOrderValues(filtered);
    });
  };

  const clearCompleted = () => {
    setTodos(prev => {
      const filtered = prev.filter(todo => !todo.completed);
      // Update order values after clearing
      return updateOrderValues(filtered);
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setTodos(prev => {
        // Only reorder within the current filter
        const filteredTodos = getFilteredTodos(prev);
        const oldIndex = filteredTodos.findIndex(todo => todo.id === active.id);
        const newIndex = filteredTodos.findIndex(todo => todo.id === over.id);
        
        if (oldIndex === -1 || newIndex === -1) return prev;
        
        // Reorder the filtered todos
        const reorderedFiltered = arrayMove(filteredTodos, oldIndex, newIndex);
        
        // Update order values for the reordered items
        const updatedFiltered = updateOrderValues(reorderedFiltered);
        
        // Merge back with the rest of the todos
        const otherTodos = prev.filter(todo => {
          if (filter === 'active') return todo.completed;
          if (filter === 'completed') return !todo.completed;
          if (filter === 'overdue') return !isOverdue(todo);
          if (filter === 'today') return !isDueToday(todo);
          return false;
        });
        
        // Combine and sort by order
        const allTodos = [...updatedFiltered, ...otherTodos].sort((a, b) => a.order - b.order);
        
        // Re-normalize all order values
        return updateOrderValues(allTodos);
      });
    }
  };

  const isOverdue = (todo: Todo): boolean => {
    if (!todo.dueDate || todo.completed) return false;
    return getDueDateStatus(todo.dueDate) === 'overdue';
  };

  const isDueToday = (todo: Todo): boolean => {
    if (!todo.dueDate || todo.completed) return false;
    return getDueDateStatus(todo.dueDate) === 'today';
  };

  const getFilteredTodos = (todoList: Todo[]) => {
    let filtered = todoList;
    
    // Apply filter
    switch (filter) {
      case 'active':
        filtered = todoList.filter(todo => !todo.completed);
        break;
      case 'completed':
        filtered = todoList.filter(todo => todo.completed);
        break;
      case 'overdue':
        filtered = todoList.filter(todo => isOverdue(todo));
        break;
      case 'today':
        filtered = todoList.filter(todo => isDueToday(todo));
        break;
      default:
        filtered = todoList;
    }
    
    // Apply sorting
    if (sortBy === 'dueDate') {
      return sortTodosByDueDateAndOrder(filtered);
    } else {
      return filtered.sort((a, b) => a.order - b.order);
    }
  };

  const filteredTodos = getFilteredTodos(todos);
  const activeCount = todos.filter(todo => !todo.completed).length;
  const completedCount = todos.filter(todo => todo.completed).length;
  const overdueCount = todos.filter(todo => isOverdue(todo)).length;
  const todayCount = todos.filter(todo => isDueToday(todo)).length;

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-3">
          <CheckSquare className="text-blue-500" size={40} />
          Pendra
          <span className="text-lg font-normal text-blue-500">v0.1.2</span>
        </h1>
        <p className="text-gray-600">A simple, clean todo app with drag-and-drop reordering and due dates</p>
      </div>

      {/* Add Todo */}
      <div className="mb-6">
        <AddTodo onAdd={addTodo} />
      </div>

      {/* Filter Tabs and Sort Options */}
      {todos.length > 0 && (
        <div className="mb-6">
          {/* Filter Tabs */}
          <div className="flex gap-1 mb-3 bg-gray-100 p-1 rounded-lg">
            {(['all', 'active', 'completed', 'overdue', 'today'] as const).map(filterType => (
              <button
                key={filterType}
                onClick={() => setFilter(filterType)}
                className={`flex-1 py-2 px-2 rounded-md text-xs font-medium transition-colors ${
                  filter === filterType
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
                {filterType === 'active' && activeCount > 0 && (
                  <span className="ml-1 text-xs bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded-full">
                    {activeCount}
                  </span>
                )}
                {filterType === 'completed' && completedCount > 0 && (
                  <span className="ml-1 text-xs bg-green-100 text-green-600 px-1.5 py-0.5 rounded-full">
                    {completedCount}
                  </span>
                )}
                {filterType === 'overdue' && overdueCount > 0 && (
                  <span className="ml-1 text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full">
                    {overdueCount}
                  </span>
                )}
                {filterType === 'today' && todayCount > 0 && (
                  <span className="ml-1 text-xs bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded-full">
                    {todayCount}
                  </span>
                )}
              </button>
            ))}
          </div>
          
          {/* Sort Options */}
          <div className="flex gap-2">
            <button
              onClick={() => setSortBy('manual')}
              className={`flex items-center gap-1 px-3 py-1 text-sm rounded-md transition-colors ${
                sortBy === 'manual'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <ArrowUpDown size={14} />
              Manual Order
            </button>
            <button
              onClick={() => setSortBy('dueDate')}
              className={`flex items-center gap-1 px-3 py-1 text-sm rounded-md transition-colors ${
                sortBy === 'dueDate'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Calendar size={14} />
              Due Date
            </button>
          </div>
        </div>
      )}

      {/* Todo List with Drag and Drop */}
      <div className="space-y-2 mb-6">
        {filteredTodos.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            {filter === 'all' && todos.length === 0 && (
              <div>
                <CheckSquare size={48} className="mx-auto mb-4 text-gray-300" />
                <p>No tasks yet. Add one above to get started!</p>
              </div>
            )}
            {filter === 'active' && activeCount === 0 && todos.length > 0 && (
              <p>All tasks completed! 🎉</p>
            )}
            {filter === 'completed' && completedCount === 0 && (
              <p>No completed tasks yet.</p>
            )}
            {filter === 'overdue' && overdueCount === 0 && (
              <p>No overdue tasks! 👍</p>
            )}
            {filter === 'today' && todayCount === 0 && (
              <p>No tasks due today.</p>
            )}
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={filteredTodos.map(todo => todo.id)}
              strategy={verticalListSortingStrategy}
            >
              {filteredTodos.map(todo => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  onToggle={toggleTodo}
                  onDelete={deleteTodo}
                />
              ))}
            </SortableContext>
          </DndContext>
        )}
      </div>

      {/* Footer Stats */}
      {todos.length > 0 && (
        <div className="flex items-center justify-between text-sm text-gray-600 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center gap-4">
            <span>
              {activeCount} {activeCount === 1 ? 'task' : 'tasks'} remaining
            </span>
            {overdueCount > 0 && (
              <span className="text-red-600 font-medium">
                {overdueCount} overdue
              </span>
            )}
            {todayCount > 0 && (
              <span className="text-orange-600 font-medium">
                {todayCount} due today
              </span>
            )}
          </div>
          
          {completedCount > 0 && (
            <button
              onClick={clearCompleted}
              className="flex items-center gap-1 text-red-500 hover:text-red-600 transition-colors"
            >
              <Trash2 size={14} />
              Clear completed ({completedCount})
            </button>
          )}
        </div>
      )}
    </div>
  );
}
