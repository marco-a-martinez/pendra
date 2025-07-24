'use client';

import { Section } from '@/lib/types';
import { GripVertical, ChevronDown, ChevronRight, Plus, Edit2, Trash2 } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useState } from 'react';

interface SectionHeaderProps {
  section: Section;
  taskCount: number;
  onToggleCollapse: (sectionId: string) => void;
  onAddTask: (sectionId: string) => void;
  onRename: (sectionId: string, newName: string) => void;
  onDelete: (sectionId: string) => void;
  canDelete: boolean;
}

export function SectionHeader({ 
  section, 
  taskCount, 
  onToggleCollapse, 
  onAddTask, 
  onRename, 
  onDelete,
  canDelete 
}: SectionHeaderProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(section.name);
  const [showActions, setShowActions] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleRename = () => {
    if (editName.trim() && editName.trim() !== section.name) {
      onRename(section.id, editName.trim());
    }
    setIsEditing(false);
    setShowActions(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleRename();
    }
    if (e.key === 'Escape') {
      setEditName(section.name);
      setIsEditing(false);
      setShowActions(false);
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-2 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg mb-2 group ${
        isDragging ? 'shadow-lg ring-2 ring-blue-500 ring-opacity-50' : ''
      }`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => !isEditing && setShowActions(false)}
    >
      {/* Drag Handle */}
      <button
        className="flex-shrink-0 p-1 text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing transition-colors opacity-0 group-hover:opacity-100"
        {...attributes}
        {...listeners}
      >
        <GripVertical size={16} />
      </button>

      {/* Collapse/Expand Button */}
      <button
        onClick={() => onToggleCollapse(section.id)}
        className="flex-shrink-0 p-1 text-gray-500 hover:text-gray-700 transition-colors"
      >
        {section.collapsed ? <ChevronRight size={16} /> : <ChevronDown size={16} />}
      </button>

      {/* Section Name */}
      <div className="flex-1 min-w-0">
        {isEditing ? (
          <input
            type="text"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            onBlur={handleRename}
            onKeyDown={handleKeyPress}
            className="w-full px-2 py-1 text-sm font-semibold bg-white border border-blue-500 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
            autoFocus
          />
        ) : (
          <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate">
            {section.name}
            {taskCount > 0 && (
              <span className="ml-2 text-xs text-gray-500 font-normal">({taskCount})</span>
            )}
          </h3>
        )}
      </div>

      {/* Action Buttons */}
      {showActions && !isEditing && (
        <div className="flex items-center gap-1">
          <button
            onClick={() => onAddTask(section.id)}
            className="p-1 text-gray-400 hover:text-blue-500 transition-colors"
            title="Add task to this section"
          >
            <Plus size={14} />
          </button>
          <button
            onClick={() => {
              setEditName(section.name);
              setIsEditing(true);
            }}
            className="p-1 text-gray-400 hover:text-blue-500 transition-colors"
            title="Rename section"
          >
            <Edit2 size={14} />
          </button>
          {canDelete && (
            <button
              onClick={() => onDelete(section.id)}
              className="p-1 text-gray-400 hover:text-red-500 transition-colors"
              title="Delete section"
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
