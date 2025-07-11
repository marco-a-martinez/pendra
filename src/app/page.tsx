'use client';

import { useState } from 'react';
import { Plus, Check } from 'lucide-react';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

export default function HomePage() {
  const [todos, setTodos] = useState<Todo[]>([
    { id: '1', text: 'Welcome to your simple todo app!', completed: false },
    { id: '2', text: 'Click the circle to complete a todo', completed: false },
    { id: '3', text: 'Press the blue + button to add a new todo', completed: false },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const addTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      const newTodo: Todo = {
        id: `todo-${Date.now()}`,
        text: inputValue.trim(),
        completed: false,
      };
      setTodos(current => [...current, newTodo]);
      setInputValue('');
      setIsAdding(false);
    }
  };

  const toggleTodo = (id: string) => {
    setTodos(current => 
      current.map(todo => 
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: string) => {
    setTodos(current => current.filter(todo => todo.id !== id));
  };

  const incompleteTodos = todos.filter(todo => !todo.completed);
  const completedTodos = todos.filter(todo => todo.completed);

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'rgb(var(--system-grouped-background))' }}>
      <div className="max-w-2xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-[34px] font-bold tracking-tight" style={{ color: 'rgb(var(--system-label))' }}>
            Today
          </h1>
          <p className="text-[15px] mt-1" style={{ color: 'rgb(var(--system-secondary-label))' }}>
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </div>

        {/* Add new todo form */}
        {isAdding && (
          <form onSubmit={addTodo} className="mb-4 animate-slide-down">
            <div className="todo-item flex items-center gap-3">
              <div className="checkbox-ring" />
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onBlur={() => !inputValue.trim() && setIsAdding(false)}
                placeholder="New To-Do"
                className="flex-1 bg-transparent outline-none text-[17px]"
                style={{ color: 'rgb(var(--system-label))' }}
                autoFocus
              />
            </div>
          </form>
        )}

        {/* Todo list */}
        <div className="space-y-2">
          {incompleteTodos.length === 0 && !isAdding ? (
            <div className="text-center py-12">
              <p className="text-[17px] mb-2" style={{ color: 'rgb(var(--system-tertiary-label))' }}>
                No tasks for today
              </p>
              <p className="text-[15px]" style={{ color: 'rgb(var(--system-quaternary-label))' }}>
                Tap + to add a task
              </p>
            </div>
          ) : (
            incompleteTodos.map((todo) => (
              <div key={todo.id} className="todo-item animate-fade-in">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toggleTodo(todo.id)}
                    className="checkbox-ring"
                    aria-label="Mark as complete"
                  />
                  <span className="flex-1 text-[17px]" style={{ color: 'rgb(var(--system-label))' }}>
                    {todo.text}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Completed section */}
        {completedTodos.length > 0 && (
          <div className="mt-8">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-[13px] font-medium uppercase tracking-wide" style={{ color: 'rgb(var(--system-tertiary-label))' }}>
                Completed
              </h2>
              <button
                onClick={() => setTodos(current => current.filter(todo => !todo.completed))}
                className="text-[15px] transition-colors"
                style={{ color: 'rgb(var(--system-blue))' }}
              >
                Clear
              </button>
            </div>
            <div className="space-y-2">
              {completedTodos.map((todo) => (
                <div key={todo.id} className="todo-item opacity-60">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleTodo(todo.id)}
                      className="checkbox-ring checked"
                      aria-label="Mark as incomplete"
                    >
                      <Check className="w-3.5 h-3.5 text-white animate-checkmark" strokeWidth={3} />
                    </button>
                    <span className="flex-1 text-[17px] line-through" style={{ color: 'rgb(var(--system-tertiary-label))' }}>
                      {todo.text}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Floating add button */}
        <button
          onClick={() => setIsAdding(true)}
          className="add-button fixed bottom-8 right-8"
          aria-label="Add new todo"
        >
          <Plus className="w-6 h-6 text-white" strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
}