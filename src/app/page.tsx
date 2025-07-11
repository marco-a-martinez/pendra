'use client';

import { useState, useEffect, useRef } from 'react';
import { Plus, Check, GripVertical, ChevronDown, ChevronRight, ListTodo } from 'lucide-react';
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

interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  checklist?: ChecklistItem[];
  expanded?: boolean;
}

// Sortable Todo Item Component
function SortableTodoItem({ 
  todo, 
  onToggle, 
  onToggleExpand,
  onAddChecklistItem,
  onToggleChecklistItem,
  onUpdateChecklistItem,
  onDeleteChecklistItem
}: { 
  todo: Todo; 
  onToggle: (id: string) => void;
  onToggleExpand: (id: string) => void;
  onAddChecklistItem: (todoId: string, text: string) => void;
  onToggleChecklistItem: (todoId: string, itemId: string) => void;
  onUpdateChecklistItem: (todoId: string, itemId: string, text: string) => void;
  onDeleteChecklistItem: (todoId: string, itemId: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: todo.id });

  const [isAddingChecklistItem, setIsAddingChecklistItem] = useState(false);
  const [checklistInput, setChecklistInput] = useState('');
  const checklistInputRef = useRef<HTMLInputElement>(null);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const hasChecklist = todo.checklist && todo.checklist.length > 0;
  const completedCount = todo.checklist?.filter(item => item.completed).length || 0;
  const totalCount = todo.checklist?.length || 0;

  const handleAddChecklistItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (checklistInput.trim()) {
      onAddChecklistItem(todo.id, checklistInput.trim());
      setChecklistInput('');
      setIsAddingChecklistItem(false);
    }
  };

  const startAddingChecklistItem = () => {
    setIsAddingChecklistItem(true);
    setTimeout(() => checklistInputRef.current?.focus(), 0);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`todo-item ${isDragging ? 'dragging' : ''} animate-fade-in`}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button
          className="drag-handle"
          {...attributes}
          {...listeners}
          style={{
            cursor: 'grab',
            padding: '4px',
            color: 'var(--text-tertiary)',
            background: 'none',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            opacity: 0,
            transition: 'opacity 0.2s ease',
          }}
          aria-label="Drag to reorder"
        >
          <GripVertical size={16} />
        </button>
        
        {hasChecklist && (
          <button
            onClick={() => onToggleExpand(todo.id)}
            className="expand-button"
            style={{
              background: 'none',
              border: 'none',
              padding: '2px',
              cursor: 'pointer',
              color: 'var(--text-tertiary)',
              display: 'flex',
              alignItems: 'center',
              transition: 'transform 0.2s ease',
              transform: todo.expanded ? 'rotate(0deg)' : 'rotate(-90deg)'
            }}
            aria-label={todo.expanded ? 'Collapse checklist' : 'Expand checklist'}
          >
            <ChevronDown size={16} />
          </button>
        )}
        
        <button
          onClick={() => onToggle(todo.id)}
          className="checkbox"
          style={{ background: 'none', border: '1.5px solid var(--gray-3)' }}
          aria-label="Mark as complete"
        />
        
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '17px', color: 'var(--text)' }}>
              {todo.text}
            </span>
            {hasChecklist && (
              <span style={{ 
                fontSize: '13px', 
                color: 'var(--text-tertiary)',
                backgroundColor: completedCount === totalCount ? 'var(--green-bg)' : 'var(--gray-5)',
                padding: '2px 6px',
                borderRadius: '4px'
              }}>
                {completedCount}/{totalCount}
              </span>
            )}
          </div>
        </div>
        
        <button
          onClick={() => {
            if (!hasChecklist) {
              onAddChecklistItem(todo.id, '');
              onToggleExpand(todo.id);
            }
            startAddingChecklistItem();
          }}
          className="checklist-button"
          style={{
            background: 'none',
            border: 'none',
            padding: '4px',
            cursor: 'pointer',
            color: 'var(--text-tertiary)',
            opacity: 0,
            transition: 'opacity 0.2s ease',
          }}
          aria-label="Add checklist"
        >
          <ListTodo size={18} />
        </button>
      </div>
      
      {/* Checklist items */}
      {todo.expanded && hasChecklist && (
        <div style={{ marginLeft: '56px', marginTop: '8px' }}>
          {todo.checklist?.map((item) => (
            <div key={item.id} className="checklist-item" style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '4px 0',
            }}>
              <button
                onClick={() => onToggleChecklistItem(todo.id, item.id)}
                className="checklist-checkbox"
                style={{
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  border: '1.5px solid var(--gray-3)',
                  background: item.completed ? 'var(--blue)' : 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
                aria-label={item.completed ? 'Mark as incomplete' : 'Mark as complete'}
              >
                {item.completed && <Check size={10} color="white" strokeWidth={3} />}
              </button>
              <input
                type="text"
                value={item.text}
                onChange={(e) => onUpdateChecklistItem(todo.id, item.id, e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Backspace' && item.text === '') {
                    e.preventDefault();
                    onDeleteChecklistItem(todo.id, item.id);
                  }
                }}
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  fontSize: '15px',
                  color: item.completed ? 'var(--text-tertiary)' : 'var(--text)',
                  textDecoration: item.completed ? 'line-through' : 'none',
                }}
                placeholder="Checklist item"
              />
            </div>
          ))}
          
          {/* Add new checklist item */}
          {isAddingChecklistItem ? (
            <form onSubmit={handleAddChecklistItem} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '4px 0',
            }}>
              <div style={{
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                border: '1.5px solid var(--gray-3)',
                flexShrink: 0,
              }} />
              <input
                ref={checklistInputRef}
                type="text"
                value={checklistInput}
                onChange={(e) => setChecklistInput(e.target.value)}
                onBlur={() => !checklistInput.trim() && setIsAddingChecklistItem(false)}
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  fontSize: '15px',
                  color: 'var(--text)',
                }}
                placeholder="New checklist item"
                autoFocus
              />
            </form>
          ) : (
            <button
              onClick={startAddingChecklistItem}
              className="add-checklist-item-button"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '4px 0',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--text-tertiary)',
                fontSize: '15px',
                width: '100%',
                textAlign: 'left',
              }}
            >
              <Plus size={16} />
              <span>Add item</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default function HomePage() {
  const [todos, setTodos] = useState<Todo[]>([
    { id: '1', text: 'Welcome to your simple todo app!', completed: false },
    { id: '2', text: 'Click the circle to complete a todo', completed: false },
    { id: '3', text: 'Press the blue + button to add a new todo', completed: false },
    { id: '4', text: 'Drag tasks to reorder them', completed: false },
    { id: '5', text: 'Click the list icon to add a checklist', completed: false },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
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

  const startAdding = () => {
    setIsAdding(true);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'n' && !e.metaKey && !e.ctrlKey && !e.altKey && 
          document.activeElement?.tagName !== 'INPUT') {
        e.preventDefault();
        startAdding();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  const toggleTodo = (id: string) => {
    setTodos(current => 
      current.map(todo => 
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const toggleExpand = (id: string) => {
    setTodos(current =>
      current.map(todo =>
        todo.id === id ? { ...todo, expanded: !todo.expanded } : todo
      )
    );
  };

  const addChecklistItem = (todoId: string, text: string) => {
    setTodos(current =>
      current.map(todo => {
        if (todo.id === todoId) {
          const newItem: ChecklistItem = {
            id: `checklist-${Date.now()}`,
            text: text,
            completed: false,
          };
          return {
            ...todo,
            checklist: [...(todo.checklist || []), newItem],
            expanded: true,
          };
        }
        return todo;
      })
    );
  };

  const toggleChecklistItem = (todoId: string, itemId: string) => {
    setTodos(current =>
      current.map(todo => {
        if (todo.id === todoId && todo.checklist) {
          return {
            ...todo,
            checklist: todo.checklist.map(item =>
              item.id === itemId ? { ...item, completed: !item.completed } : item
            ),
          };
        }
        return todo;
      })
    );
  };

  const updateChecklistItem = (todoId: string, itemId: string, text: string) => {
    setTodos(current =>
      current.map(todo => {
        if (todo.id === todoId && todo.checklist) {
          return {
            ...todo,
            checklist: todo.checklist.map(item =>
              item.id === itemId ? { ...item, text } : item
            ),
          };
        }
        return todo;
      })
    );
  };

  const deleteChecklistItem = (todoId: string, itemId: string) => {
    setTodos(current =>
      current.map(todo => {
        if (todo.id === todoId && todo.checklist) {
          return {
            ...todo,
            checklist: todo.checklist.filter(item => item.id !== itemId),
          };
        }
        return todo;
      })
    );
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setTodos((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }

    setActiveId(null);
  };

  const incompleteTodos = todos.filter(todo => !todo.completed);
  const completedTodos = todos.filter(todo => todo.completed);
  const activeTodo = activeId ? todos.find(todo => todo.id === activeId) : null;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--background)' }}>
      <div style={{ maxWidth: '680px', margin: '0 auto', padding: '48px 24px' }}>
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ 
            fontSize: '34px', 
            fontWeight: '700', 
            letterSpacing: '-0.5px',
            margin: '0 0 4px 0',
            color: 'var(--text)'
          }}>
            Today
          </h1>
          <p style={{ 
            fontSize: '15px', 
            color: 'var(--text-tertiary)',
            margin: 0
          }}>
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </div>

        {/* Add new todo form */}
        {isAdding && (
          <form onSubmit={addTodo} className="animate-slide-down" style={{ marginBottom: '8px' }}>
            <div className="todo-item" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '20px' }} />
              <div className="checkbox" />
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onBlur={() => !inputValue.trim() && setIsAdding(false)}
                placeholder="New To-Do"
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
          </form>
        )}

        {/* Todo list */}
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div>
            {incompleteTodos.length === 0 && !isAdding ? (
              <div style={{ textAlign: 'center', padding: '48px 0' }}>
                <p style={{ fontSize: '17px', color: 'var(--text-tertiary)', marginBottom: '8px' }}>
                  No tasks for today
                </p>
                <p style={{ fontSize: '15px', color: 'var(--text-tertiary)' }}>
                  Tap + to add a task
                </p>
              </div>
            ) : (
              <>
                <SortableContext
                  items={incompleteTodos.map(todo => todo.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {incompleteTodos.map((todo) => (
                    <SortableTodoItem
                      key={todo.id}
                      todo={todo}
                      onToggle={toggleTodo}
                      onToggleExpand={toggleExpand}
                      onAddChecklistItem={addChecklistItem}
                      onToggleChecklistItem={toggleChecklistItem}
                      onUpdateChecklistItem={updateChecklistItem}
                      onDeleteChecklistItem={deleteChecklistItem}
                    />
                  ))}
                </SortableContext>
                {/* Inline add button */}
                <button
                  onClick={startAdding}
                  className="inline-add-button"
                  style={{
                    width: '100%',
                    padding: '12px 0',
                    marginTop: '8px',
                    background: 'none',
                    border: 'none',
                    fontSize: '17px',
                    color: 'var(--text-tertiary)',
                    cursor: 'pointer',
                    textAlign: 'left',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    transition: 'color 0.2s ease'
                  }}
                  aria-label="Add new task"
                >
                  <div style={{ width: '20px' }} />
                  <div style={{ 
                    width: '20px', 
                    height: '20px', 
                    borderRadius: '50%',
                    border: '1.5px solid var(--gray-3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginLeft: '2px'
                  }}>
                    <Plus size={12} strokeWidth={2} />
                  </div>
                  <span>Add task</span>
                </button>
              </>
            )}
          </div>
          <DragOverlay>
            {activeTodo ? (
              <div className="todo-item dragging-overlay" style={{ 
                backgroundColor: 'var(--background)',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
                cursor: 'grabbing'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div className="drag-handle" style={{
                    padding: '4px',
                    color: 'var(--text-tertiary)',
                    display: 'flex',
                    alignItems: 'center',
                  }}>
                    <GripVertical size={16} />
                  </div>
                  <div className="checkbox" style={{ background: 'none', border: '1.5px solid var(--gray-3)' }} />
                  <span style={{ flex: 1, fontSize: '17px', color: 'var(--text)' }}>
                    {activeTodo.text}
                  </span>
                </div>
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>

        {/* Completed section */}
        {completedTodos.length > 0 && (
          <div style={{ marginTop: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <h2 style={{ 
                fontSize: '13px', 
                fontWeight: '600', 
                textTransform: 'uppercase', 
                letterSpacing: '0.5px',
                color: 'var(--text-tertiary)',
                margin: 0
              }}>
                Completed
              </h2>
              <button
                onClick={() => setTodos(current => current.filter(todo => !todo.completed))}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '15px',
                  color: 'var(--blue)',
                  cursor: 'pointer',
                  padding: 0
                }}
              >
                Clear
              </button>
            </div>
            <div style={{ opacity: 0.6 }}>
              {completedTodos.map((todo) => (
                <div key={todo.id} className="todo-item">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '20px' }} />
                    <button
                      onClick={() => toggleTodo(todo.id)}
                      className="checkbox checked"
                      style={{ background: 'var(--blue)', border: '1.5px solid var(--blue)' }}
                      aria-label="Mark as incomplete"
                    >
                      <Check className="animate-checkmark" size={14} color="white" strokeWidth={3} />
                    </button>
                    <span style={{ 
                      flex: 1, 
                      fontSize: '17px', 
                      color: 'var(--text-tertiary)', 
                      textDecoration: 'line-through' 
                    }}>
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
          onClick={startAdding}
          className="add-button"
          style={{
            position: 'fixed',
            bottom: '32px',
            right: '32px'
          }}
          aria-label="Add new task (Press 'n')"
          title="Add new task (Press 'n')"
        >
          <Plus size={28} color="white" strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
}