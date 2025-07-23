'use client';

import { RichTextDisplay } from './RichTextDisplay';

interface TaskDescriptionProps {
  description?: string;
  className?: string;
}

export function TaskDescription({ description, className = '' }: TaskDescriptionProps) {
  if (!description || description === '<p></p>' || description.trim() === '') {
    return null;
  }

  return (
    <div className={`mt-2 ${className}`}>
      <RichTextDisplay 
        content={description} 
        className="text-sm text-gray-600 dark:text-gray-400"
      />
    </div>
  );
}
