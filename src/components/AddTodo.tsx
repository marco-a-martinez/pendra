'use client';

import { useState } from 'react';
import { Plus, Calendar, X, FolderOpen } from 'lucide-react';
import { getTodayDate, getTomorrowDate, parseDateFromInput } from '@/lib/dateUtils';
import { Section } from '@/lib/types';

interface AddTodoProps {
  onAdd: (text: string, dueDate?: Date, sectionId?: string) => void;
  sections: Section[];
  defaultSectionId?: string;
}

export function AddTodo({ onAdd, sections, defaultSectionId }: AddTodoProps) {
  const [text, setText] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [sectionId, setSectionId] = useState(defaultSectionId || sections[0]?.id || '');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      const parsedDueDate = dueDate ? parseDateFromInput(dueDate) : undefined;
      onAdd(text.trim(), parsedDueDate, sectionId);
      setText('');
      setDueDate('');
      setSectionId(defaultSectionId || sections[0]?.id || '');
      setIsExpanded(false);
    }
  };

  const handleCancel = () => {
    setText('');
    setDueDate('');
    setSectionId(defaultSectionId || sections[0]?.id || '');
    setIsExpanded(false);
  };

  const setQuickDate = (dateString: string) => {
    setDueDate(dateString);
  };

  const handleDateContainerClick = () => {
    // Focus the date input to trigger calendar popup
    const dateInput = document.getElementById('due-date-input') as HTMLInputElement;
    if (dateInput) {
      dateInput.focus();
      dateInput.showPicker?.(); // Modern browsers support this method
    }
  };

  if (!isExpanded) {
    return (
      <button
        onClick={() => setIsExpanded(true)}
        className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-400 hover:text-blue-500 transition-colors flex items-center justify-center gap-2"
      >
        <Plus size={20} />
        Add a new task...
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Task Title */}
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="What needs to be done?"
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-3"
        autoFocus
      />
      
      {/* Section Selection */}
      {sections.length > 1 && (
        <div className="mb-3">
          <div className="flex items-center gap-2 mb-2">
            <FolderOpen size={16} className="text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Section</span>
          </div>
          <select
            value={sectionId}
            onChange={(e) => setSectionId(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          >
            {sections.map(section => (
              <option key={section.id} value={section.id}>
                {section.name}
              </option>
            ))}
          </select>
        </div>
      )}
      
      {/* Due Date Section */}
      <div className="mb-3">
        <div className="flex items-center gap-2 mb-2">
          <Calendar size={16} className="text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Due Date (optional)</span>
          {dueDate && (
            <button
              type="button"
              onClick={() => setDueDate('')}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={14} />
            </button>
          )}
        </div>
        
        {/* Quick Date Buttons */}
        <div className="flex flex-wrap gap-2 mb-2">
          <button
            type="button"
            onClick={() => setQuickDate(getTodayDate())}
            className="px-3 py-2 text-sm bg-orange-100 text-orange-700 rounded-md hover:bg-orange-200 transition-colors min-h-[44px] flex items-center"
          >
            Today
          </button>
          <button
            type="button"
            onClick={() => setQuickDate(getTomorrowDate())}
            className="px-3 py-2 text-sm bg-yellow-100 text-yellow-700 rounded-md hover:bg-yellow-200 transition-colors min-h-[44px] flex items-center"
          >
            Tomorrow
          </button>
        </div>
        
        {/* Date Input Container - Make entire area clickable */}
        <div 
          className="relative cursor-pointer"
          onClick={handleDateContainerClick}
        >
          <input
            id="due-date-input"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm cursor-pointer"
          />
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-2">
        <button 
          type="submit" 
          className="flex-1 px-4 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors disabled:opacity-50 min-h-[44px]" 
          disabled={!text.trim()}
        >
          Add Task
        </button>
        <button
          type="button"
          onClick={handleCancel}
          className="flex-1 px-4 py-3 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300 transition-colors min-h-[44px]"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
