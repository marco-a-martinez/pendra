'use client';

import { useState, useEffect } from 'react';
import { Todo } from '@/lib/types';
import { saveTodos, loadTodos, generateId } from '@/lib/storage';
import { TodoItem } from '@/components/TodoItem';
import { AddTodo } from '@/components/AddTodo';
import { CheckSquare, Trash2 } from 'lucide-react';

export default function HomePage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  // Load todos from localStorage on mount
  useEffect(() => {
    setTodos(loadTodos());
  }, []);

  // Save todos to localStorage whenever todos change
  useEffect(() => {
    saveTodos(todos);
  }, [todos]);

  const addTodo = (text: string) => {
    const newTodo: Todo = {
      id: generateId(),
      text,
      completed: false,
      createdAt: new Date(),
    };
    setTodos(prev => [newTodo, ...prev]);
  };

  const toggleTodo = (id: string) => {
    setTodos(prev =>
      prev.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: string) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  };

  const clearCompleted = () => {
    setTodos(prev => prev.filter(todo => !todo.completed));
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  const activeCount = todos.filter(todo => !todo.completed).length;
  const completedCount = todos.filter(todo => todo.completed).length;

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-3">
          <CheckSquare className="text-blue-500" size={40} />
          Pendra
          <span className="text-lg font-normal text-blue-500">v0.1</span>
        </h1>
        <p className="text-gray-600">A simple, clean todo app that actually works</p>
      </div>

      {/* Add Todo */}
      <div className="mb-6">
        <AddTodo onAdd={addTodo} />
      </div>

      {/* Filter Tabs */}
      {todos.length > 0 && (
        <div className="flex gap-1 mb-6 bg-gray-100 p-1 rounded-lg">
          {(['all', 'active', 'completed'] as const).map(filterType => (
            <button
              key={filterType}
              onClick={() => setFilter(filterType)}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
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
            </button>
          ))}
        </div>
      )}

      {/* Todo List */}
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
          </div>
        ) : (
          filteredTodos.map(todo => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={toggleTodo}
              onDelete={deleteTodo}
            />
          ))
        )}
      </div>

      {/* Footer Stats */}
      {todos.length > 0 && (
        <div className="flex items-center justify-between text-sm text-gray-600 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <span>
            {activeCount} {activeCount === 1 ? 'task' : 'tasks'} remaining
          </span>
          
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
