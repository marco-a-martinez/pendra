'use client';

import { Todo, ChecklistItem as ChecklistItemType } from '@/lib/types';
import { Trash2, Check, GripVertical, Calendar, ChevronDown, ChevronRight, Plus, FileText } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { formatDueDate, getDueDateStatus, getDueDateColor, formatDateForInput, parseDateFromInput } from '@/lib/dateUtils';
import { ChecklistItem } from './ChecklistItem';
import { useState } from 'react';
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

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdateTodo: (id: string, updates: Partial<Todo>) => void;
}

export function TodoItem({ todo, onToggle, onDelete, onUpdateTodo }: TodoItemProps) {
  const [newChecklistItem, setNewChecklistItem] = useState('');
  const [isAddingChecklistItem, setIsAddingChecklistItem] = useState(false);
  const [isEditingTodoText, setIsEditingTodoText] = useState(false);
  const [editTodoText, setEditTodoText] = useState(todo.text);
  const [isEditingDate, setIsEditingDate] = useState(false);
  const [editDate, setEditDate] = useState(todo.dueDate ? formatDateForInput(todo.dueDate) : '');
  const [isEditingNote, setIsEditingNote] = useState(false);
  const [editNote, setEditNote] = useState(todo.note || '');
  
  // Swipe gesture state
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [isSwipeActive, setIsSwipeActive] = useState(false);
  const [touchStartX, setTouchStartX] = useState(0);

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

  const dueDateStatus = todo.dueDate ? getDueDateStatus(todo.dueDate) : null;
  const dueDateColor = dueDateStatus ? getDueDateColor(dueDateStatus) : '';

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Checklist helper functions
  const hasChecklist = todo.checklist && todo.checklist.length > 0;
  const completedChecklistItems = todo.checklist?.filter(item => item.completed).length || 0;
  const totalChecklistItems = todo.checklist?.length || 0;
  const checklistProgress = hasChecklist ? `${completedChecklistItems}/${totalChecklistItems}` : '';

  const toggleChecklistExpanded = () => {
    onUpdateTodo(todo.id, { checklistExpanded: !todo.checklistExpanded });
  };

  const addChecklistItem = () => {
    if (!newChecklistItem.trim()) return;
    
    const newItem: ChecklistItemType = {
      id: `checklist-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      text: newChecklistItem.trim(),
      completed: false,
      order: (todo.checklist?.length || 0) + 1,
    };
    
    const updatedChecklist = [...(todo.checklist || []), newItem];
    onUpdateTodo(todo.id, { checklist: updatedChecklist, checklistExpanded: true });
    setNewChecklistItem('');
    setIsAddingChecklistItem(false);
  };

  const toggleChecklistItem = (itemId: string) => {
    if (!todo.checklist) return;
    
    const updatedChecklist = todo.checklist.map(item =>
      item.id === itemId ? { ...item, completed: !item.completed } : item
    );
    onUpdateTodo(todo.id, { checklist: updatedChecklist });
  };

  const deleteChecklistItem = (itemId: string) => {
    if (!todo.checklist) return;
    
    const updatedChecklist = todo.checklist.filter(item => item.id !== itemId);
    onUpdateTodo(todo.id, { checklist: updatedChecklist.length > 0 ? updatedChecklist : undefined });
  };

  const editChecklistItem = (itemId: string, text: string) => {
    if (!todo.checklist) return;
    
    const updatedChecklist = todo.checklist.map(item =>
      item.id === itemId ? { ...item, text } : item
    );
    onUpdateTodo(todo.id, { checklist: updatedChecklist });
  };

  const handleChecklistDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || !todo.checklist) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    if (activeId !== overId) {
      const oldIndex = todo.checklist.findIndex(item => item.id === activeId);
      const newIndex = todo.checklist.findIndex(item => item.id === overId);
      
      const reorderedChecklist = arrayMove(todo.checklist, oldIndex, newIndex);
      const updatedChecklist = reorderedChecklist.map((item, index) => ({
        ...item,
        order: index + 1,
      }));
      
      onUpdateTodo(todo.id, { checklist: updatedChecklist });
    }
  };

  const handleAddChecklistKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addChecklistItem();
    } else if (e.key === 'Escape') {
      setNewChecklistItem('');
      setIsAddingChecklistItem(false);
    }
  };

  // Todo text editing handlers
  const handleEditTodoText = () => {
    if (isEditingTodoText && editTodoText.trim() && editTodoText !== todo.text) {
      onUpdateTodo(todo.id, { text: editTodoText.trim() });
    }
    setIsEditingTodoText(false);
  };

  const handleTodoTextKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleEditTodoText();
    } else if (e.key === 'Escape') {
      setEditTodoText(todo.text);
      setIsEditingTodoText(false);
    }
  };

  const startEditingTodoText = () => {
    setEditTodoText(todo.text);
    setIsEditingTodoText(true);
  };

  // Date editing handlers
  const handleEditDate = () => {
    if (isEditingDate) {
      if (editDate.trim()) {
        const newDate = parseDateFromInput(editDate);
        onUpdateTodo(todo.id, { dueDate: newDate });
      } else {
        // If date is cleared, remove the due date
        onUpdateTodo(todo.id, { dueDate: undefined });
      }
    }
    setIsEditingDate(false);
  };

  const handleDateKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleEditDate();
    } else if (e.key === 'Escape') {
      setEditDate(todo.dueDate ? formatDateForInput(todo.dueDate) : '');
      setIsEditingDate(false);
    }
  };

  const startEditingDate = () => {
    setEditDate(todo.dueDate ? formatDateForInput(todo.dueDate) : '');
    setIsEditingDate(true);
  };

  const clearDate = (e: React.MouseEvent) => {
    e.stopPropagation();
    onUpdateTodo(todo.id, { dueDate: undefined });
  };

  // Note editing handlers
  const toggleNoteExpanded = () => {
    onUpdateTodo(todo.id, { noteExpanded: !todo.noteExpanded });
  };

  const handleEditNote = () => {
    if (isEditingNote) {
      if (editNote.trim()) {
        // When saving a note (new or edited), always collapse it
        onUpdateTodo(todo.id, { 
          note: editNote.trim(),
          noteExpanded: false
        });
      } else {
        // If note is empty, remove it
        onUpdateTodo(todo.id, { 
          note: undefined,
          noteExpanded: false
        });
      }
    }
    setIsEditingNote(false);
  };

  const handleNoteKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleEditNote();
    } else if (e.key === 'Escape') {
      setEditNote(todo.note || '');
      setIsEditingNote(false);
    }
  };

  const startEditingNote = () => {
    setEditNote(todo.note || '');
    setIsEditingNote(true);
    // Only expand if note already exists, otherwise keep collapsed for new notes
    if (todo.note) {
      onUpdateTodo(todo.id, { noteExpanded: true });
    }
  };

  const clearNote = (e: React.MouseEvent) => {
    e.stopPropagation();
    onUpdateTodo(todo.id, { note: undefined, noteExpanded: false });
  };
  
  // Swipe gesture handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    if (isEditingTodoText || isEditingDate || isEditingNote) return;
    setTouchStartX(e.touches[0].clientX);
    setIsSwipeActive(true);
  };
  
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isSwipeActive || isEditingTodoText || isEditingDate || isEditingNote) return;
    
    const currentX = e.touches[0].clientX;
    const diff = currentX - touchStartX;
    
    // Only allow left swipe (negative diff)
    if (diff < 0) {
      setSwipeOffset(Math.max(diff, -120)); // Limit swipe to 120px
    }
  };
  
  const handleTouchEnd = () => {
    if (!isSwipeActive) return;
    
    setIsSwipeActive(false);
    
    if (swipeOffset < -60) {
      // Swipe threshold reached - trigger action
      if (swipeOffset < -90) {
        // Far swipe - delete
        onDelete(todo.id);
      } else {
        // Medium swipe - toggle complete
        onToggle(todo.id);
      }
    }
    
    // Reset swipe offset
    setSwipeOffset(0);
  };

  return (
    <div className="space-y-2 relative">
      {/* Swipe Action Indicators */}
      {swipeOffset < 0 && (
        <div className="absolute inset-0 flex items-center justify-end pr-4 bg-gradient-to-l from-red-500 to-orange-500 rounded-lg">
          <div className="flex items-center gap-2 text-white font-medium">
            {swipeOffset < -90 ? (
              <><Trash2 size={20} /> Delete</>
            ) : (
              <><Check size={20} /> Complete</>
            )}
          </div>
        </div>
      )}
      
      {/* Main Todo Item */}
      <div
        ref={setNodeRef}
        style={{
          ...style,
          transform: `${style?.transform || ''} translateX(${swipeOffset}px)`,
        }}
        className={`flex items-center gap-3 p-3 sm:p-4 bg-white rounded-lg shadow-sm border border-gray-200 transition-all duration-200 relative ${
          isDragging ? 'shadow-xl ring-2 ring-blue-500 ring-opacity-50 scale-105 rotate-1 z-50' : 'hover:shadow-md'
        } ${swipeOffset < 0 ? 'shadow-lg' : ''}`}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Drag Handle */}
        <button
          className="flex-shrink-0 p-2 sm:p-1 text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing transition-colors touch-manipulation"
          {...attributes}
          {...listeners}
        >
          <GripVertical size={20} className="sm:w-4 sm:h-4" />
        </button>
        
        {/* Complete Button */}
        <button
          onClick={() => onToggle(todo.id)}
          className={`flex-shrink-0 w-8 h-8 sm:w-6 sm:h-6 rounded-full border-2 flex items-center justify-center transition-colors touch-manipulation ${
            todo.completed
              ? 'bg-green-500 border-green-500 text-white'
              : 'border-gray-300 hover:border-green-400'
          }`}
        >
          {todo.completed && <Check size={16} className="sm:w-3.5 sm:h-3.5" />}
        </button>
        
        {/* Checklist Expand/Collapse Button */}
        {hasChecklist && (
          <button
            onClick={toggleChecklistExpanded}
            className="flex-shrink-0 p-2 sm:p-1 text-gray-400 hover:text-gray-600 transition-colors touch-manipulation"
          >
            {todo.checklistExpanded ? <ChevronDown size={20} className="sm:w-4 sm:h-4" /> : <ChevronRight size={20} className="sm:w-4 sm:h-4" />}
          </button>
        )}
        
        {/* Todo Content */}
        <div className="flex-1 min-w-0">
          {/* Todo Text */}
          <div className="flex items-center gap-2">
            {isEditingTodoText ? (
              <input
                type="text"
                value={editTodoText}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditTodoText(e.target.value)}
                onBlur={handleEditTodoText}
                onKeyDown={handleTodoTextKeyDown}
                className="flex-1 bg-white border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                autoFocus
              />
            ) : (
              <span
                className={`block cursor-pointer ${
                  todo.completed
                    ? 'text-gray-500 line-through'
                    : 'text-gray-900'
                } hover:bg-gray-50 px-1 py-0.5 rounded transition-colors`}
                onClick={startEditingTodoText}
              >
                {todo.text}
              </span>
            )}
            {hasChecklist && (
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                {checklistProgress}
              </span>
            )}
          </div>
          
          {/* Due Date */}
          {todo.dueDate || isEditingDate ? (
            <div className="flex items-center gap-1 mt-1">
              <Calendar size={12} className="text-gray-400" />
              {isEditingDate ? (
                <input
                  type="date"
                  value={editDate}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditDate(e.target.value)}
                  onBlur={handleEditDate}
                  onKeyDown={handleDateKeyDown}
                  className="text-xs px-2 py-0.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  autoFocus
                />
              ) : (
                <div className="flex items-center gap-1">
                  <span
                    className={`text-xs px-2 py-0.5 rounded-md border cursor-pointer hover:bg-gray-50 transition-colors ${
                      todo.completed ? 'opacity-50' : ''
                    } ${dueDateColor}`}
                    onClick={startEditingDate}
                  >
                    {dueDateStatus === 'overdue' && 'Overdue: '}
                    {dueDateStatus === 'today' && 'Due: '}
                    {dueDateStatus === 'tomorrow' && 'Due: '}
                    {dueDateStatus === 'upcoming' && 'Due: '}
                    {formatDueDate(todo.dueDate!)}
                  </span>
                  <button
                    onClick={clearDate}
                    className="text-gray-400 hover:text-red-500 transition-colors ml-1"
                    title="Remove due date"
                  >
                    ×
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-1 mt-1">
              <button
                onClick={startEditingDate}
                className="flex items-center gap-1 text-xs text-gray-500 hover:text-blue-500 transition-colors"
                title="Add due date"
              >
                <Calendar size={12} />
                Add due date
              </button>
            </div>
          )}

          {/* Note */}
          {todo.note || isEditingNote ? (
            <div className="mt-1">
              <div className="flex items-center gap-1 mb-1">
                {todo.note && (
                  <button
                    onClick={toggleNoteExpanded}
                    className="flex items-center gap-1 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                    title={todo.noteExpanded ? "Collapse note" : "Expand note"}
                  >
                    <FileText size={12} />
                    <span className="text-xs text-gray-500 hover:text-gray-700 transition-colors">Note</span>
                    <span className="ml-1">
                      {todo.noteExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                    </span>
                  </button>
                )}
                {!todo.note && (
                  <div className="flex items-center gap-1">
                    <FileText size={12} className="text-gray-400" />
                    <span className="text-xs text-gray-500">Note</span>
                  </div>
                )}
                {todo.note && !isEditingNote && (
                  <div className="flex items-center gap-1 ml-auto">
                    <button
                      onClick={clearNote}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                      title="Remove note"
                    >
                      ×
                    </button>
                  </div>
                )}
              </div>
              {isEditingNote ? (
                <textarea
                  value={editNote}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setEditNote(e.target.value)}
                  onBlur={handleEditNote}
                  onKeyDown={handleNoteKeyDown}
                  placeholder="Add a note... (Ctrl+Enter to save, Esc to cancel)"
                  className="w-full text-xs px-2 py-1 border border-gray-300 rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  autoFocus
                />
              ) : todo.note && todo.noteExpanded ? (
                <div
                  className="text-xs text-gray-700 px-2 py-1 bg-gray-50 rounded cursor-pointer hover:bg-gray-100 transition-colors whitespace-pre-wrap"
                  onClick={startEditingNote}
                >
                  {todo.note}
                </div>
              ) : null}
            </div>
          ) : (
            <div className="flex items-center gap-1 mt-1">
              <button
                onClick={startEditingNote}
                className="flex items-center gap-1 text-xs text-gray-500 hover:text-blue-500 transition-colors"
                title="Add note"
              >
                <FileText size={12} />
                Add note
              </button>
            </div>
          )}
        </div>
        
        {/* Add Checklist Item Button */}
        <button
          onClick={() => setIsAddingChecklistItem(true)}
          className="flex-shrink-0 p-2 sm:p-1 text-gray-400 hover:text-blue-500 transition-colors touch-manipulation"
          title="Add checklist item"
        >
          <Plus size={20} className="sm:w-4 sm:h-4" />
        </button>
        
        {/* Delete Button */}
        <button
          onClick={() => onDelete(todo.id)}
          className="flex-shrink-0 p-2 sm:p-1 text-gray-400 hover:text-red-500 transition-colors touch-manipulation"
        >
          <Trash2 size={20} className="sm:w-4 sm:h-4" />
        </button>
      </div>

      {/* Expanded Checklist */}
      {hasChecklist && todo.checklistExpanded && (
        <div className="ml-4 space-y-1">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleChecklistDragEnd}
          >
            <SortableContext
              items={todo.checklist?.map(item => item.id) || []}
              strategy={verticalListSortingStrategy}
            >
              {todo.checklist
                ?.sort((a, b) => a.order - b.order)
                .map(item => (
                  <ChecklistItem
                    key={item.id}
                    item={item}
                    onToggle={toggleChecklistItem}
                    onDelete={deleteChecklistItem}
                    onEdit={editChecklistItem}
                  />
                )) || []}
            </SortableContext>
          </DndContext>
        </div>
      )}

      {/* Add New Checklist Item */}
      {isAddingChecklistItem && (
        <div className="ml-10 mr-4">
          <input
            type="text"
            value={newChecklistItem}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewChecklistItem(e.target.value)}
            onBlur={() => {
              if (newChecklistItem.trim()) {
                addChecklistItem();
              } else {
                setIsAddingChecklistItem(false);
              }
            }}
            onKeyDown={handleAddChecklistKeyDown}
            placeholder="Add checklist item..."
            className="w-full text-sm border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            autoFocus
          />
        </div>
      )}
    </div>
  );
}
