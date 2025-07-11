'use client';

import { useState, useEffect, useRef } from 'react';
import { Plus, Check, GripVertical, Calendar } from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  dueDate?: string;
}

// Sortable Todo Item Component
function SortableTodoItem({ 
  todo, 
  onToggle, 
  onUpdate, 
  onDelete,
  onUpdateDate,
}: {
  todo: Todo;
  onToggle: (id: string) => void;
  onUpdate: (id: string, text: string) => void;
  onDelete: (id: string) => void;
  onUpdateDate: (id: string, date: string | undefined) => void;
}) {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const datePickerRef = useRef<DatePicker>(null);
  const calendarButtonRef = useRef<HTMLButtonElement>(null);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: todo.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="todo-item sortable-item"
      {...attributes}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', position: 'relative' }}>
        <button
          className="drag-handle"
          {...listeners}
          style={{
            cursor: 'grab',
            padding: '4px',
            color: 'var(--text-tertiary)',
            display: 'flex',
            alignItems: 'center',
          }}
          aria-label="Drag to reorder"
        >
          <GripVertical size={20} />
        </button>
        
        <button
          onClick={() => onToggle(todo.id)}
          className={`checkbox ${todo.completed ? 'checked' : ''}`}
          aria-label={todo.completed ? 'Mark as incomplete' : 'Mark as complete'}
        >
          {todo.completed && <Check size={16} strokeWidth={3} />}
        </button>
        
        <input
          type="text"
          value={todo.text}
          onChange={(e) => onUpdate(todo.id, e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.currentTarget.blur();
            } else if (e.key === 'Backspace' && todo.text === '') {
              e.preventDefault();
              onDelete(todo.id);
            }
          }}
          className={`todo-text ${todo.completed ? 'completed' : ''}`}
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            outline: 'none',
            fontSize: '17px',
            color: todo.completed ? 'var(--text-tertiary)' : 'var(--text)',
            textDecoration: todo.completed ? 'line-through' : 'none',
          }}
        />
        
        {/* Date display */}
        {todo.dueDate && (
          <span style={{
            fontSize: '14px',
            color: 'var(--text-secondary)',
            marginRight: '8px',
          }}>
            {new Date(todo.dueDate).toLocaleDateString()}
          </span>
        )}
        
        {/* Calendar icon */}
        <button
          ref={calendarButtonRef}
          onClick={() => {
            setShowDatePicker(!showDatePicker);
          }}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '4px',
            color: todo.dueDate ? 'var(--blue)' : 'var(--text-tertiary)',
            display: 'flex',
            alignItems: 'center',
            opacity: todo.dueDate ? 1 : 0,
            transition: 'opacity 0.2s ease',
          }}
          className="calendar-button"
          aria-label="Set due date"
        >
          <Calendar size={18} />
        </button>
        
        {/* Date picker */}
        {showDatePicker && (
          <div style={{
            position: 'absolute',
            right: '40px',
            top: '100%',
            marginTop: '4px',
            zIndex: 1000,
          }}>
            <DatePicker
              ref={datePickerRef}
              selected={todo.dueDate ? new Date(todo.dueDate) : null}
              onChange={(date: Date | null) => {
                if (date) {
                  const dateString = date.toISOString().split('T')[0];
                  onUpdateDate(todo.id, dateString);
                  setShowDatePicker(false);
                }
              }}
              onClickOutside={() => setShowDatePicker(false)}
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  setShowDatePicker(false);
                }
              }}
              inline
              autoFocus
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default function HomePage() {
  const [todos, setTodos] = useState<Todo[]>([
    { id: '1', text: 'Welcome to your simple todo app!', completed: false },
    { id: '2', text: 'Click the circle to complete a todo', completed: false },
    { id: '3', text: 'Press the blue + button to add a new todo', completed: false },
    { id: '4', text: 'Drag tasks to reorder them', completed: false },
  ]);
  const [newTodo, setNewTodo] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [activeTodoId, setActiveTodoId] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    if (isAdding && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isAdding]);

  const addTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodo.trim()) {
      const newTodoItem: Todo = {
        id: Date.now().toString(),
        text: newTodo.trim(),
        completed: false,
      };
      setTodos([...todos, newTodoItem]);
      setNewTodo('');
      setIsAdding(false);
    }
  };

  const toggleTodo = (id: string) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const updateTodo = (id: string, text: string) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, text } : todo
    ));
  };

  const updateTodoDate = (id: string, date: string | undefined) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, dueDate: date } : todo
    ));
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveTodoId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveTodoId(null);
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setTodos((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const startAdding = () => {
    setIsAdding(true);
  };

  const cancelAdding = () => {
    setIsAdding(false);
    setNewTodo('');
  };

  const activeTodo = activeTodoId ? todos.find(todo => todo.id === activeTodoId) : null;

  return (
    <div className="app-container">
      <div style={{ maxWidth: '680px', margin: '0 auto', padding: '48px 24px' }}>
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{
            fontSize: '32px',
            fontWeight: '700',
            margin: '0 0 4px 0',
            color: 'var(--text)'
          }}>
            Today
          </h1>
          <p style={{
            fontSize: '16px',
            color: 'var(--text-secondary)',
            margin: 0
          }}>
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </div>

        {/* Add new todo form */}
        {isAdding && (
          <form onSubmit={addTodo} className="animate-slide-down" style={{ marginBottom: '8px' }}>
            <div className="todo-item" style={{ padding: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '20px' }} />
                <div className="checkbox" style={{ opacity: 0.5 }} />
                <input
                  type="text"
                  value={newTodo}
                  onChange={(e) => setNewTodo(e.target.value)}
                  onBlur={() => !newTodo.trim() && cancelAdding()}
                  placeholder="What needs to be done?"
                  className="todo-text"
                  style={{
                    flex: 1,
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    fontSize: '17px',
                    color: 'var(--text)'
                  }}
                  autoFocus
                  ref={inputRef}
                />
              </div>
            </div>
          </form>
        )}

        {/* Todo list */}
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="todo-list">
            {todos.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '48px 24px',
                color: 'var(--text-tertiary)'
              }}>
                <p style={{ fontSize: '18px', marginBottom: '8px' }}>No tasks yet</p>
                <p style={{ fontSize: '16px' }}>Add a task to get started</p>
              </div>
            ) : (
              <SortableContext
                items={todos.map(todo => todo.id)}
                strategy={verticalListSortingStrategy}
              >
                {todos.map((todo) => (
                  <SortableTodoItem
                    key={todo.id}
                    todo={todo}
                    onToggle={toggleTodo}
                    onUpdate={updateTodo}
                    onDelete={deleteTodo}
                    onUpdateDate={updateTodoDate}
                  />
                ))}
              </SortableContext>
            )}
          </div>
          
          <DragOverlay>
            {activeTodo && (
              <div className="todo-item" style={{
                backgroundColor: 'var(--background)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                borderRadius: '12px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '20px' }} />
                  <div className="checkbox" style={{ background: 'none', border: '1.5px solid var(--gray-3)' }} />
                  <span style={{ fontSize: '17px', color: 'var(--text)' }}>
                    {activeTodo.text}
                  </span>
                </div>
              </div>
            )}
          </DragOverlay>
        </DndContext>

        {/* Floating add button */}
        <button
          onClick={startAdding}
          className="floating-add-button"
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            backgroundColor: 'var(--blue)',
            color: 'white',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
          aria-label="Add new task"
        >
          <Plus size={24} />
        </button>

        {/* Add task inline button */}
        {!isAdding && todos.length > 0 && (
          <button
            onClick={startAdding}
            className="add-task-inline"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 0',
              marginLeft: '32px',
              background: 'none',
              border: 'none',
              color: 'var(--text-tertiary)',
              fontSize: '16px',
              cursor: 'pointer',
              transition: 'color 0.2s ease',
            }}
          >
            <Plus size={20} />
            <span>Add Task</span>
          </button>
        )}
      </div>
    </div>
  );
}