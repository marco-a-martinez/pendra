'use client';

import { Todo, ChecklistItem as ChecklistItemType } from '@/lib/types';
import { Trash2, Check, GripVertical, Calendar, ChevronDown, ChevronRight, Plus } from 'lucide-react';
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

  return (
    <div className="space-y-2">
      {/* Main Todo Item */}
      <div
        ref={setNodeRef}
        style={style}
        className={`flex items-center gap-3 p-4 bg-white rounded-lg shadow-sm border border-gray-200 ${
          isDragging ? 'shadow-lg ring-2 ring-blue-500 ring-opacity-50' : ''
        }`}
      >
        {/* Drag Handle */}
        <button
          className="flex-shrink-0 p-1 text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing transition-colors"
          {...attributes}
          {...listeners}
        >
          <GripVertical size={16} />
        </button>
        
        {/* Complete Button */}
        <button
          onClick={() => onToggle(todo.id)}
          className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
            todo.completed
              ? 'bg-green-500 border-green-500 text-white'
              : 'border-gray-300 hover:border-green-400'
          }`}
        >
          {todo.completed && <Check size={14} />}
        </button>
        
        {/* Checklist Expand/Collapse Button */}
        {hasChecklist && (
          <button
            onClick={toggleChecklistExpanded}
            className="flex-shrink-0 p-1 text-gray-400 hover:text-gray-600 transition-colors"
          >
            {todo.checklistExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
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
        </div>
        
        {/* Add Checklist Item Button */}
        <button
          onClick={() => setIsAddingChecklistItem(true)}
          className="flex-shrink-0 p-1 text-gray-400 hover:text-blue-500 transition-colors"
          title="Add checklist item"
        >
          <Plus size={16} />
        </button>
        
        {/* Delete Button */}
        <button
          onClick={() => onDelete(todo.id)}
          className="flex-shrink-0 p-1 text-gray-400 hover:text-red-500 transition-colors"
        >
          <Trash2 size={16} />
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
