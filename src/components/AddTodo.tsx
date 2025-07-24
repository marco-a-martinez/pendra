'use client';

import { useState } from 'react';
import { Plus, Calendar, X } from 'lucide-react';
import { getTodayDate, getTomorrowDate, parseDateFromInput } from '@/lib/dateUtils';

interface AddTodoProps {
  onAdd: (text: string, dueDate?: Date) => void;
}

export function AddTodo({ onAdd }: AddTodoProps) {
  const [text, setText] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      const parsedDueDate = dueDate ? parseDateFromInput(dueDate) : undefined;
      onAdd(text.trim(), parsedDueDate);
      setText('');
      setDueDate('');
      setIsExpanded(false);
    }
  };

  const handleCancel = () => {
    setText('');
    setDueDate('');
    setIsExpanded(false);
  };

  const setQuickDate = (dateString: string) => {
    setDueDate(dateString);
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
        <div className="flex gap-2 mb-2">
          <button
            type="button"
            onClick={() => setQuickDate(getTodayDate())}
            className="px-3 py-1 text-xs bg-orange-100 text-orange-700 rounded-md hover:bg-orange-200 transition-colors"
          >
            Today
          </button>
          <button
            type="button"
            onClick={() => setQuickDate(getTomorrowDate())}
            className="px-3 py-1 text-xs bg-yellow-100 text-yellow-700 rounded-md hover:bg-yellow-200 transition-colors"
          >
            Tomorrow
          </button>
        </div>
        
        {/* Date Input */}
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
        />
      </div>
      
      {/* Action Buttons */}
      <div className="flex gap-2">
        <button 
          type="submit" 
          className="px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors disabled:opacity-50" 
          disabled={!text.trim()}
        >
          Add Task
        </button>
        <button
          type="button"
          onClick={handleCancel}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
