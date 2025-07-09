'use client';

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
}

export function RichTextEditor({ 
  content, 
  onChange, 
  placeholder = 'Start typing...', 
  className 
}: RichTextEditorProps) {
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
    editorProps: {
      attributes: {
        class: 'prose prose-sm dark:prose-invert max-w-none focus:outline-none min-h-[100px] p-3',
      },
    },
  });

  if (!editor) {
    return null;
  }

  return (
    <div className={cn(
      'border border-gray-300 dark:border-gray-600 rounded-md focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500',
      className
    )}>
      {/* Toolbar */}
      <div className="flex items-center gap-1 p-2 border-b border-gray-200 dark:border-gray-600">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={cn(
            'p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors',
            editor.isActive('bold') && 'bg-gray-100 dark:bg-gray-700'
          )}
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
        >
          <ListOrdered className="w-4 h-4" />
        </button>
      </div>
      
      {/* Editor */}
      <EditorContent 
        editor={editor} 
        className="dark:bg-gray-700 dark:text-white rounded-b-md"
      />
    </div>
  );
}
