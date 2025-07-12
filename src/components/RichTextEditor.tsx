'use client';

import { useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { Bold, Italic, List, ListOrdered } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  className?: string;
  variant?: 'default' | 'things3';
}

export function RichTextEditor({ 
  content, 
  onChange, 
  placeholder = 'Start typing...', 
  className,
  variant = 'default'
}: RichTextEditorProps) {
  const [isFocused, setIsFocused] = useState(false);
  
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder,
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    onFocus: () => setIsFocused(true),
    onBlur: () => setIsFocused(false),
    editorProps: {
      attributes: {
        class: variant === 'things3' 
          ? 'prose prose-sm dark:prose-invert max-w-none focus:outline-none min-h-[60px] px-3 py-2 text-[15px] leading-relaxed'
          : 'prose prose-sm dark:prose-invert max-w-none focus:outline-none min-h-[100px] p-3',
      },
    },
  });

  if (!editor) {
    return null;
  }

  return (
    <div 
      className={cn(
        variant === 'things3' 
          ? 'rounded-lg transition-all duration-200'
          : 'border border-gray-300 dark:border-gray-600 rounded-md focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500',
        className
      )}
      style={variant === 'things3' ? {
        backgroundColor: isFocused ? '#FFFFFF' : 'var(--things-note-bg)',
        border: isFocused ? '1px solid var(--things-border)' : '1px solid transparent',
        boxShadow: isFocused ? '0 2px 8px rgba(0,0,0,0.04)' : 'none',
      } : {}}
    >
      {/* Toolbar */}
      {variant === 'things3' && !isFocused ? null : (
        <div className={cn(
          'flex items-center gap-1 p-2',
          variant === 'things3'
            ? 'border-b border-transparent'
            : 'border-b border-gray-200 dark:border-gray-600'
        )}>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={cn(
            'p-2 rounded transition-colors',
            variant === 'things3'
              ? 'hover:bg-gray-100 dark:hover:bg-gray-700'
              : 'hover:bg-gray-100 dark:hover:bg-gray-700',
            editor.isActive('bold') && (variant === 'things3' ? 'text-blue-500' : 'bg-gray-100 dark:bg-gray-700')
          )}
          data-1p-ignore
          data-lpignore="true"
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={cn(
            'p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors',
            editor.isActive('italic') && 'bg-gray-100 dark:bg-gray-700'
          )}
          data-1p-ignore
          data-lpignore="true"
        >
          <Italic className="w-4 h-4" />
        </button>
        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={cn(
            'p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors',
            editor.isActive('bulletList') && 'bg-gray-100 dark:bg-gray-700'
          )}
          data-1p-ignore
          data-lpignore="true"
        >
          <List className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={cn(
            'p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors',
            editor.isActive('orderedList') && 'bg-gray-100 dark:bg-gray-700'
          )}
          data-1p-ignore
          data-lpignore="true"
        >
          <ListOrdered className="w-4 h-4" />
        </button>
        </div>
      )}
      
      {/* Editor */}
      <EditorContent 
        editor={editor} 
        className="dark:bg-gray-700 dark:text-white rounded-b-md"
      />
    </div>
  );
}
