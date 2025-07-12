'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { Bold, Italic, List, ListOrdered, Heading2 } from 'lucide-react';
import { useEffect, useState } from 'react';

interface ModernNotesEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

export function ModernNotesEditor({ content, onChange, placeholder = 'Add notes...' }: ModernNotesEditorProps) {
  const [mounted, setMounted] = useState(false);
  const [isEditorFocused, setIsEditorFocused] = useState(false);
  
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3],
        },
      }),
      Placeholder.configure({
        placeholder,
        emptyEditorClass: 'is-editor-empty',
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    onFocus: () => setIsEditorFocused(true),
    onBlur: () => setIsEditorFocused(false),
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none focus:outline-none min-h-[80px] px-3 py-2',
      },
    },
    immediatelyRender: false,
  });

  // Handle SSR
  useEffect(() => {
    setMounted(true);
  }, []);

  // Update editor content when prop changes
  useEffect(() => {
    if (editor && content !== editor.getHTML() && mounted) {
      editor.commands.setContent(content);
    }
  }, [content, editor, mounted]);

  if (!mounted || !editor) {
    return (
      <div className="w-full text-sm border border-gray-100 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 min-h-[80px] p-3">
        <p className="text-gray-400">{placeholder}</p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Simple Toolbar - shown when editor is focused */}
      {isEditorFocused && (
        <div className="absolute -top-10 left-0 flex items-center gap-1 p-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-100 dark:border-gray-700 z-10">
          <button
            onMouseDown={(e) => {
              e.preventDefault();
              editor.chain().focus().toggleBold().run();
            }}
            className={`p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
              editor.isActive('bold') ? 'bg-gray-100 dark:bg-gray-700 text-blue-600' : 'text-gray-600'
            }`}
            type="button"
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            onMouseDown={(e) => {
              e.preventDefault();
              editor.chain().focus().toggleItalic().run();
            }}
            className={`p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
              editor.isActive('italic') ? 'bg-gray-100 dark:bg-gray-700 text-blue-600' : 'text-gray-600'
            }`}
            type="button"
          >
            <Italic className="w-4 h-4" />
          </button>
          <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-1" />
          <button
            onMouseDown={(e) => {
              e.preventDefault();
              editor.chain().focus().toggleHeading({ level: 2 }).run();
            }}
            className={`p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
              editor.isActive('heading', { level: 2 }) ? 'bg-gray-100 dark:bg-gray-700 text-blue-600' : 'text-gray-600'
            }`}
            type="button"
          >
            <Heading2 className="w-4 h-4" />
          </button>
          <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-1" />
          <button
            onMouseDown={(e) => {
              e.preventDefault();
              editor.chain().focus().toggleBulletList().run();
            }}
            className={`p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
              editor.isActive('bulletList') ? 'bg-gray-100 dark:bg-gray-700 text-blue-600' : 'text-gray-600'
            }`}
            type="button"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            onMouseDown={(e) => {
              e.preventDefault();
              editor.chain().focus().toggleOrderedList().run();
            }}
            className={`p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
              editor.isActive('orderedList') ? 'bg-gray-100 dark:bg-gray-700 text-blue-600' : 'text-gray-600'
            }`}
            type="button"
          >
            <ListOrdered className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Editor Content */}
      <div className="w-full text-sm border border-gray-100 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 transition-all duration-200">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
