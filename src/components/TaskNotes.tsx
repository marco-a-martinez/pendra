'use client';

import { useState, useCallback } from 'react';
import { Task } from '@/types';

interface TaskNotesProps {
  task: Task;
  onUpdate: (updates: Partial<Task>) => void;
}

export function TaskNotes({ task, onUpdate }: TaskNotesProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [notes, setNotes] = useState(task.notes || '');

  const handleBlur = useCallback(() => {
    setIsEditing(false);
    if (notes !== task.notes) {
      onUpdate({ notes });
    }
  }, [notes, task.notes, onUpdate]);

  const toggleCheckbox = useCallback((lineIndex: number) => {
    const lines = notes.split('\n');
    const line = lines[lineIndex];
    const checkboxMatch = line.match(/^(\s*)-\s*\[([ x])\]\s*(.*)$/);
    
    if (checkboxMatch) {
      const indent = checkboxMatch[1];
      const isChecked = checkboxMatch[2] === 'x';
      const text = checkboxMatch[3];
      lines[lineIndex] = `${indent}- [${isChecked ? ' ' : 'x'}] ${text}`;
      const newNotes = lines.join('\n');
      setNotes(newNotes);
      onUpdate({ notes: newNotes });
    }
  }, [notes, onUpdate]);

  const renderNotes = (content: string) => {
    if (!content) return null;

    return content.split('\n').map((line, i) => {
      // Match checkbox pattern with optional indentation
      const checkboxMatch = line.match(/^(\s*)-\s*\[([ x])\]\s*(.*)$/);
      
      if (checkboxMatch) {
        const indent = checkboxMatch[1];
        const isChecked = checkboxMatch[2] === 'x';
        const text = checkboxMatch[3];
        
        return (
          <div 
            key={i} 
            className="flex items-start gap-2 py-0.5"
            style={{ paddingLeft: `${indent.length * 8}px` }}
          >
            <input
              type="checkbox"
              checked={isChecked}
              onChange={() => toggleCheckbox(i)}
              className="mt-0.5 h-4 w-4 rounded border-gray-300 text-blue-500 
                         focus:ring-1 focus:ring-blue-500 focus:ring-offset-0"
            />
            <span className={`text-sm leading-relaxed ${
              isChecked ? 'line-through text-gray-400' : 'text-gray-600'
            }`}>
              {text}
            </span>
          </div>
        );
      }

      // Handle bullet points
      const bulletMatch = line.match(/^(\s*)-\s+(.*)$/);
      if (bulletMatch && !line.match(/^(\s*)-\s*\[/)) {
        const indent = bulletMatch[1];
        const text = bulletMatch[2];
        return (
          <div 
            key={i} 
            className="flex items-start gap-2 py-0.5"
            style={{ paddingLeft: `${indent.length * 8}px` }}
          >
            <span className="text-gray-400 text-sm leading-relaxed">•</span>
            <span className="text-sm text-gray-600 leading-relaxed">{text}</span>
          </div>
        );
      }

      // Handle headings (lines starting with #)
      const headingMatch = line.match(/^(#+)\s+(.*)$/);
      if (headingMatch) {
        const level = headingMatch[1].length;
        const text = headingMatch[2];
        const className = level === 1 
          ? 'text-sm font-semibold text-gray-700 mt-2 mb-1'
          : 'text-sm font-medium text-gray-600 mt-1';
        return <div key={i} className={className}>{text}</div>;
      }

      // Regular text
      if (line.trim()) {
        return (
          <p key={i} className="text-sm text-gray-600 leading-relaxed py-0.5">
            {line}
          </p>
        );
      }

      // Empty line
      return <div key={i} className="h-2" />;
    });
  };

  return (
    <div className="mt-3 pt-3 border-t border-gray-100">
      <h4 className="text-[11px] font-medium text-gray-400 uppercase tracking-wider mb-2">
        Notes
      </h4>
      
      {isEditing ? (
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              setNotes(task.notes || '');
              setIsEditing(false);
            }
          }}
          className="w-full px-2 py-1.5 text-sm text-gray-600 bg-transparent 
                     border-0 focus:ring-0 focus:outline-none resize-none 
                     leading-relaxed font-sans placeholder-gray-400"
          placeholder="Add notes, details, or checklists...\n\nUse:\n- [ ] for checklists\n- for bullet points\n# for headings"
          autoFocus
          style={{ minHeight: '80px' }}
        />
      ) : (
        <div 
          onClick={() => setIsEditing(true)}
          className="cursor-text min-h-[60px] -mx-2 px-2 py-1.5 rounded 
                     hover:bg-gray-50 transition-colors duration-150"
        >
          {notes ? (
            <div className="space-y-0.5">
              {renderNotes(notes)}
            </div>
          ) : (
            <span className="text-sm text-gray-400">
              Add notes, details, or checklists...
            </span>
          )}
        </div>
      )}
    </div>
  );
}