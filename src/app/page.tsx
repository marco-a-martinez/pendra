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

// Sortable Checklist Item Component
function SortableChecklistItem({
  item,
  todoId,
  onToggle,
  onUpdate,
  onDelete,
}: {
  item: ChecklistItem;
  todoId: string;
  onToggle: (todoId: string, itemId: string) => void;
  onUpdate: (todoId: string, itemId: string, text: string) => void;
  onDelete: (todoId: string, itemId: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={{
        ...style,
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '4px 8px',
        margin: '0 -8px',
        borderRadius: '6px',
        transition: 'background-color 0.2s ease',
      }}
      className="checklist-item sortable-checklist-item"
      {...attributes}
    >
      <button
        className="drag-handle checklist-drag-handle"
        {...listeners}
        style={{
          cursor: 'grab',
          padding: '2px',
          color: 'var(--text-tertiary)',
          opacity: 0,
          transition: 'opacity 0.2s ease',
          display: 'flex',
          alignItems: 'center',
        }}
        aria-label="Drag to reorder checklist item"
      >
        <GripVertical size={14} />
      </button>
      
      <button
        onClick={() => onToggle(todoId, item.id)}
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
        onChange={(e) => onUpdate(todoId, item.id, e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Backspace' && item.text === '') {
            e.preventDefault();
            onDelete(todoId, item.id);
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
  );
}

// Checklist DnD Context Component
function ChecklistDndContext({
  todoId,
  checklist,
  onReorder,
  onToggleChecklistItem,
  onUpdateChecklistItem,
  onDeleteChecklistItem,
  onAddChecklistItem,
}: {
  todoId: string;
  checklist: ChecklistItem[];
  onReorder: (newChecklist: ChecklistItem[]) => void;
  onToggleChecklistItem: (todoId: string, itemId: string) => void;
  onUpdateChecklistItem: (todoId: string, itemId: string, text: string) => void;
  onDeleteChecklistItem: (todoId: string, itemId: string) => void;
  onAddChecklistItem: (todoId: string, text: string) => void;
}) {
  const [activeChecklistId, setActiveChecklistId] = useState<string | null>(null);
  const [isAddingChecklistItem, setIsAddingChecklistItem] = useState(false);
  const [checklistInput, setChecklistInput] = useState('');
  const checklistInputRef = useRef<HTMLInputElement>(null);

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

  const handleChecklistDragStart = (event: DragStartEvent) => {
    setActiveChecklistId(event.active.id as string);
  };

  const handleChecklistDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = checklist.findIndex((item) => item.id === active.id);
      const newIndex = checklist.findIndex((item) => item.id === over.id);
      const newChecklist = arrayMove(checklist, oldIndex, newIndex);
      onReorder(newChecklist);
    }

    setActiveChecklistId(null);
  };

  const startAddingChecklistItem = () => {
    setIsAddingChecklistItem(true);
    setTimeout(() => checklistInputRef.current?.focus(), 0);
  };

  const handleAddChecklistItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (checklistInput.trim()) {
      onAddChecklistItem(todoId, checklistInput.trim());
      setChecklistInput('');
      setTimeout(() => checklistInputRef.current?.focus(), 0);
    }
  };

  const activeItem = activeChecklistId ? checklist.find(item => item.id === activeChecklistId) : null;

  return (
    <div style={{ marginLeft: '56px', marginTop: '8px' }}>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleChecklistDragStart}
        onDragEnd={handleChecklistDragEnd}
      >
        <SortableContext
          items={checklist.map(item => item.id)}
          strategy={verticalListSortingStrategy}
        >
          {checklist.map((item) => (
            <SortableChecklistItem
              key={item.id}
              item={item}
              todoId={todoId}
              onToggle={onToggleChecklistItem}
              onUpdate={onUpdateChecklistItem}
              onDelete={onDeleteChecklistItem}
            />
          ))}
        </SortableContext>
        
        <DragOverlay>
          {activeItem && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '4px 8px',
              backgroundColor: 'var(--background)',
              borderRadius: '8px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
              width: 'auto',
            }}>
              <div style={{ width: '20px' }} />
              <div style={{
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                border: '1.5px solid var(--gray-3)',
                background: activeItem.completed ? 'var(--blue)' : 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}>
                {activeItem.completed && <Check size={10} color="white" strokeWidth={3} />}
              </div>
              <span style={{
                fontSize: '15px',
                color: activeItem.completed ? 'var(--text-tertiary)' : 'var(--text)',
                textDecoration: activeItem.completed ? 'line-through' : 'none',
              }}>
                {activeItem.text}
              </span>
            </div>
          )}
        </DragOverlay>
      </DndContext>
      
      {/* Add new checklist item */}
      {isAddingChecklistItem ? (
        <form onSubmit={handleAddChecklistItem} style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '4px 8px',
          margin: '0 -8px',
        }}>
          <div style={{ width: '20px' }} />
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
            marginLeft: '28px',
          }}
        >
          <Plus size={16} />
          <span>Add item</span>
        </button>
      )}
    </div>
  );
}

// Sortable Todo Item Component
function SortableTodoItem({ 
  todo, 
  onToggle, 
  onToggleExpand,
  onAddChecklistItem,
  onToggleChecklistItem,
  onUpdateChecklistItem,
  onDeleteChecklistItem,
  onReorderChecklist,
}: { 
  todo: Todo;
  onToggle: (id: string) => void;
  onToggleExpand: (id: string) => void;
  onAddChecklistItem: (todoId: string, text: string) => void;
  onToggleChecklistItem: (todoId: string, itemId: string) => void;
  onUpdateChecklistItem: (todoId: string, itemId: string, text: string) => void;
  onDeleteChecklistItem: (todoId: string, itemId: string) => void;
  onReorderChecklist: (todoId: string, newChecklist: ChecklistItem[]) => void;
}) {
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

  const hasChecklist = todo.checklist && todo.checklist.length > 0;
  const completedCount = todo.checklist?.filter(item => item.completed).length || 0;
  const totalCount = todo.checklist?.length || 0;

  const startAddingChecklistItem = () => {
    if (!hasChecklist) {
      onAddChecklistItem(todo.id, '');
      onToggleExpand(todo.id);
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="todo-item sortable-item"
      {...attributes}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button
          className="drag-handle"
          {...listeners}
          style={{
            cursor: 'grab',
            padding: '4px',
            color: 'var(--text-tertiary)',
            opacity: 0,
            transition: 'opacity 0.2s ease',
          }}
          aria-label="Drag to reorder"
        >
          <GripVertical size={20} />
        </button>
        
        {hasChecklist && (
          <button
            onClick={() => onToggleExpand(todo.id)}
            style={{
              background: 'none',
              border: 'none',
              padding: '4px',
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
          onClick={startAddingChecklistItem}
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
        <ChecklistDndContext
          todoId={todo.id}
          checklist={todo.checklist || []}
          onReorder={(newChecklist) => onReorderChecklist(todo.id, newChecklist)}
          onToggleChecklistItem={onToggleChecklistItem}
          onUpdateChecklistItem={onUpdateChecklistItem}
          onDeleteChecklistItem={onDeleteChecklistItem}
          onAddChecklistItem={onAddChecklistItem}
        />
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

  const reorderChecklist = (todoId: string, newChecklist: ChecklistItem[]) => {
    setTodos(current =>
      current.map(todo => {
        if (todo.id === todoId) {
          return {
            ...todo,
            checklist: newChecklist,
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
            {incompleteTodos.length > 0 && (
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
                    onReorderChecklist={reorderChecklist}
                  />
                ))}
              </SortableContext>
            )}
            
            {/* Add task button at bottom of list */}
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
                cursor: 'pointer',
                color: 'var(--text-tertiary)',
                fontSize: '15px',
                transition: 'color 0.2s ease',
              }}
              aria-label="Add new task (press 'n')"
            >
              <Plus size={18} />
              <span>Add Task</span>
            </button>

            {/* Completed section */}
            {completedTodos.length > 0 && (
              <div style={{ marginTop: '32px' }}>
                <h3 style={{ 
                  fontSize: '13px', 
                  fontWeight: '600', 
                  color: 'var(--text-tertiary)', 
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  marginBottom: '12px'
                }}>
                  Completed ({completedTodos.length})
                </h3>
                {completedTodos.map((todo) => (
                  <div key={todo.id} className="todo-item completed" style={{ opacity: 0.6 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '20px' }} />
                      <button
                        onClick={() => toggleTodo(todo.id)}
                        className="checkbox completed"
                        style={{ 
                          background: 'var(--blue)', 
                          border: '1.5px solid var(--blue)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                        aria-label="Mark as incomplete"
                      >
                        <Check size={14} color="white" strokeWidth={3} />
                      </button>
                      <span style={{ 
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
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(0, 122, 255, 0.3)',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          }}
          aria-label="Add new task (press 'n')"
        >
          <Plus size={24} />
        </button>
      </div>
    </div>
  );
}