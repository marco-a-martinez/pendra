'use client';

import { ChecklistItem as ChecklistItemType } from '@/lib/types';
import { Check, GripVertical, X } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useState } from 'react';

interface ChecklistItemProps {
  item: ChecklistItemType;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, text: string) => void;
}

export function ChecklistItem({ item, onToggle, onDelete, onEdit }: ChecklistItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(item.text);

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

  const handleEdit = () => {
    if (isEditing && editText.trim() && editText !== item.text) {
      onEdit(item.id, editText.trim());
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleEdit();
    } else if (e.key === 'Escape') {
      setEditText(item.text);
      setIsEditing(false);
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-2 py-2 px-3 ml-6 bg-gray-50 rounded border border-gray-100 ${
        isDragging ? 'shadow-lg ring-2 ring-blue-500 ring-opacity-50' : ''
      }`}
    >
      {/* Drag Handle */}
      <button
        className="flex-shrink-0 p-0.5 text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing transition-colors"
        {...attributes}
        {...listeners}
      >
        <GripVertical size={12} />
      </button>
      
      {/* Complete Button */}
      <button
        onClick={() => onToggle(item.id)}
        className={`flex-shrink-0 w-4 h-4 rounded border flex items-center justify-center transition-colors ${
          item.completed
            ? 'bg-green-500 border-green-500 text-white'
            : 'border-gray-300 hover:border-green-400'
        }`}
      >
        {item.completed && <Check size={10} />}
      </button>
      
      {/* Checklist Item Content */}
      <div className="flex-1 min-w-0">
        {isEditing ? (
          <input
            type="text"
            value={editText}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditText(e.target.value)}
            onBlur={handleEdit}
            onKeyDown={handleKeyDown}
            className="w-full text-sm bg-white border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            autoFocus
          />
        ) : (
          <span
            className={`block text-sm cursor-pointer ${
              item.completed
                ? 'text-gray-500 line-through'
                : 'text-gray-700'
            }`}
            onClick={() => setIsEditing(true)}
          >
            {item.text}
          </span>
        )}
      </div>
      
      {/* Delete Button */}
      <button
        onClick={() => onDelete(item.id)}
        className="flex-shrink-0 p-0.5 text-gray-400 hover:text-red-500 transition-colors"
      >
        <X size={12} />
      </button>
    </div>
  );
}
