'use client';

import { useState, useEffect } from 'react';
import { Todo, Section } from '@/lib/types';
import { 
  saveTodos, 
  loadTodos, 
  saveSections, 
  loadSections, 
  generateId, 
  updateOrderValues, 
  getTodosForSection,
  getNextTodoOrder,
  getNextSectionOrder
} from '@/lib/database';
import { SectionContainer } from '@/components/SectionContainer';
import { AddTodo } from '@/components/AddTodo';
import { CheckSquare, Trash2, Plus } from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  DragOverlay,
  Active,
  Over,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { getDueDateStatus } from '@/lib/dateUtils';
import { TodoItem } from '@/components/TodoItem';
import { SectionHeader } from '@/components/SectionHeader';

export default function HomePage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed' | 'overdue' | 'today'>('all');
  const [activeId, setActiveId] = useState<string | null>(null);
  const [draggedItem, setDraggedItem] = useState<Todo | Section | null>(null);

  // Load data from database on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const [sectionsData, todosData] = await Promise.all([
          loadSections(),
          loadTodos()
        ]);
        setSections(sectionsData);
        setTodos(todosData);
      } catch (error) {
        console.error('Failed to load data:', error);
      }
    };
    
    loadData();
  }, []);

  // Save data to database whenever they change
  useEffect(() => {
    if (todos.length > 0 || sections.length > 0) { // Only save if data has been loaded
      saveTodos(todos).catch(error => {
        console.error('Failed to save todos:', error);
      });
    }
  }, [todos]);

  useEffect(() => {
    if (sections.length > 0) { // Only save if data has been loaded
      saveSections(sections).catch(error => {
        console.error('Failed to save sections:', error);
      });
    }
  }, [sections]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const addTodo = (text: string, dueDate?: Date, sectionId?: string) => {
    const targetSectionId = sectionId || sections[0]?.id || 'default';
    const newTodo: Todo = {
      id: generateId(),
      text,
      completed: false,
      createdAt: new Date(),
      order: getNextTodoOrder(todos, targetSectionId),
      dueDate: dueDate || null,
      sectionId: targetSectionId,
    };
    setTodos(prev => [...prev, newTodo]);
  };

  const addSection = () => {
    const newSection: Section = {
      id: generateId(),
      name: 'New Section',
      order: getNextSectionOrder(sections),
      collapsed: false,
    };
    setSections(prev => [...prev, newSection]);
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

  const updateTodo = (id: string, updates: Partial<Todo>) => {
    setTodos(prev =>
      prev.map(todo =>
        todo.id === id ? { ...todo, ...updates } : todo
      )
    );
  };

  const toggleSectionCollapse = (sectionId: string) => {
    setSections(prev =>
      prev.map(section =>
        section.id === sectionId ? { ...section, collapsed: !section.collapsed } : section
      )
    );
  };

  const renameSection = (sectionId: string, newName: string) => {
    setSections(prev =>
      prev.map(section =>
        section.id === sectionId ? { ...section, name: newName } : section
      )
    );
  };

  const deleteSection = (sectionId: string) => {
    // Move todos to first remaining section or default
    const remainingSections = sections.filter(s => s.id !== sectionId);
    const targetSectionId = remainingSections[0]?.id || 'default';
    
    setTodos(prev =>
      prev.map(todo =>
        todo.sectionId === sectionId ? { ...todo, sectionId: targetSectionId } : todo
      )
    );
    
    setSections(prev => prev.filter(section => section.id !== sectionId));
  };

  const addTaskToSection = (sectionId: string) => {
    // This could open a quick add form or focus on the main add form
    // For now, we'll just scroll to the main add form
    const addForm = document.querySelector('form');
    addForm?.scrollIntoView({ behavior: 'smooth' });
  };

  const clearCompleted = () => {
    setTodos(prev => prev.filter(todo => !todo.completed));
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id as string);
    
    // Determine what's being dragged
    const todo = todos.find(t => t.id === active.id);
    const section = sections.find(s => s.id === active.id);
    
    setDraggedItem(todo || section || null);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // Handle todo dragging between sections
    const activeTodo = todos.find(t => t.id === activeId);
    if (activeTodo) {
      const overTodo = todos.find(t => t.id === overId);
      const overSection = over.data.current?.sectionId;
      
      if (overSection && activeTodo.sectionId !== overSection) {
        setTodos(prev =>
          prev.map(todo =>
            todo.id === activeId ? { ...todo, sectionId: overSection } : todo
          )
        );
      }
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    setDraggedItem(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // Handle section reordering
    const activeSection = sections.find(s => s.id === activeId);
    const overSection = sections.find(s => s.id === overId);
    
    if (activeSection && overSection && activeId !== overId) {
      setSections(prev => {
        const oldIndex = prev.findIndex(s => s.id === activeId);
        const newIndex = prev.findIndex(s => s.id === overId);
        const reordered = arrayMove(prev, oldIndex, newIndex);
        return updateOrderValues(reordered);
      });
      return;
    }

    // Handle todo reordering within same section
    const activeTodo = todos.find(t => t.id === activeId);
    const overTodo = todos.find(t => t.id === overId);
    
    if (activeTodo && overTodo && activeId !== overId && activeTodo.sectionId === overTodo.sectionId) {
      setTodos(prev => {
        const sectionTodos = prev.filter(t => t.sectionId === activeTodo.sectionId);
        const otherTodos = prev.filter(t => t.sectionId !== activeTodo.sectionId);
        
        const oldIndex = sectionTodos.findIndex(t => t.id === activeId);
        const newIndex = sectionTodos.findIndex(t => t.id === overId);
        
        const reorderedSection = arrayMove(sectionTodos, oldIndex, newIndex);
        const updatedSection = updateOrderValues(reorderedSection);
        
        return [...otherTodos, ...updatedSection].sort((a, b) => {
          const sectionA = sections.find(s => s.id === a.sectionId);
          const sectionB = sections.find(s => s.id === b.sectionId);
          if (sectionA && sectionB && sectionA.order !== sectionB.order) {
            return sectionA.order - sectionB.order;
          }
          return a.order - b.order;
        });
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
    switch (filter) {
      case 'active':
        return todoList.filter(todo => !todo.completed);
      case 'completed':
        return todoList.filter(todo => todo.completed);
      case 'overdue':
        return todoList.filter(todo => isOverdue(todo));
      case 'today':
        return todoList.filter(todo => isDueToday(todo));
      default:
        return todoList;
    }
  };

  const filteredTodos = getFilteredTodos(todos);
  const sortedSections = sections.sort((a, b) => a.order - b.order);
  
  const activeCount = todos.filter(todo => !todo.completed).length;
  const completedCount = todos.filter(todo => todo.completed).length;
  const overdueCount = todos.filter(todo => isOverdue(todo)).length;
  const todayCount = todos.filter(todo => isDueToday(todo)).length;

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6">
      {/* Header */}
      <div className="text-center mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-2 sm:gap-3">
          <CheckSquare className="text-blue-500" size={32} />
          Pendra
          <span className="text-sm sm:text-lg font-normal text-blue-500">v0.1.5</span>
        </h1>
        <p className="text-sm sm:text-base text-gray-600 px-2">A simple, clean todo app with drag-and-drop reordering, due dates, sections, checklists, and inline editing</p>
      </div>

      {/* Add Todo */}
      <div className="mb-6">
        <AddTodo onAdd={addTodo} sections={sections} />
      </div>

      {/* Filter Tabs */}
      {todos.length > 0 && (
        <div className="mb-6">
          <div className="flex gap-1 mb-3 bg-gray-100 p-1 rounded-lg overflow-x-auto">
            {(['all', 'active', 'completed', 'overdue', 'today'] as const).map(filterType => (
              <button
                key={filterType}
                onClick={() => setFilter(filterType)}
                className={`flex-shrink-0 py-2 px-3 rounded-md text-xs font-medium transition-colors ${
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
        </div>
      )}

      {/* Sections with Drag and Drop */}
      <div className="mb-6">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          {/* Section Headers Sortable Context */}
          <SortableContext
            items={sortedSections.map(section => section.id)}
            strategy={verticalListSortingStrategy}
          >
            {sortedSections.map(section => {
              const sectionTodos = getFilteredTodos(getTodosForSection(todos, section.id));
              
              return (
                <SectionContainer
                  key={section.id}
                  section={section}
                  todos={sectionTodos}
                  onToggleCollapse={toggleSectionCollapse}
                  onAddTask={addTaskToSection}
                  onRenameSection={renameSection}
                  onDeleteSection={deleteSection}
                  onToggleTodo={toggleTodo}
                  onDeleteTodo={deleteTodo}
                  onUpdateTodo={updateTodo}
                  canDeleteSection={sections.length > 1}
                />
              );
            })}
          </SortableContext>
          
          {/* Drag Overlay */}
          <DragOverlay>
            {activeId ? (
              draggedItem && 'text' in draggedItem ? (
                <TodoItem
                  todo={draggedItem as Todo}
                  onToggle={() => {}}
                  onDelete={() => {}}
                  onUpdateTodo={() => {}}
                />
              ) : draggedItem && 'name' in draggedItem ? (
                <SectionHeader
                  section={draggedItem as Section}
                  taskCount={getTodosForSection(todos, draggedItem.id).length}
                  onToggleCollapse={() => {}}
                  onAddTask={() => {}}
                  onRename={() => {}}
                  onDelete={() => {}}
                  canDelete={false}
                />
              ) : null
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>

      {/* Add Section Button */}
      <div className="mb-6">
        <button
          onClick={addSection}
          className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-400 hover:text-blue-500 transition-colors flex items-center justify-center gap-2"
        >
          <Plus size={18} />
          Add Section
        </button>
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
