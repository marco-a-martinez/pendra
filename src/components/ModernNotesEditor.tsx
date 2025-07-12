'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { Bold, Italic, Heading2, Type, Minus } from 'lucide-react';
import { useEffect, useState } from 'react';

interface ModernNotesEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

export function ModernNotesEditor({ content, onChange, placeholder = 'Start typing your notes...' }: ModernNotesEditorProps) {
  const [mounted, setMounted] = useState(false);
  
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
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none focus:outline-none min-h-[120px] px-4 py-3',
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
      <div className="w-full bg-white dark:bg-gray-800 rounded-lg overflow-hidden border border-gray-100 dark:border-gray-700">
        <div className="bg-gray-50 dark:bg-gray-900 px-3 py-2">
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-white dark:bg-gray-800 rounded-full px-1 py-1 gap-0.5">
              <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-full" />
              <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-full" />
            </div>
            <div className="flex items-center bg-white dark:bg-gray-800 rounded-full px-1 py-1 gap-0.5">
              <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-full" />
              <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-full" />
            </div>
          </div>
        </div>
        <div className="min-h-[120px] px-4 py-3">
          <p className="text-gray-400 text-sm">{placeholder}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white dark:bg-gray-800 rounded-lg overflow-hidden border border-gray-100 dark:border-gray-700">
      {/* Integrated Toolbar with pill-shaped button groups */}
      <div className="bg-gray-50 dark:bg-gray-900 px-3 py-2">
        <div className="flex items-center gap-2">
          {/* Text Style Group */}
          <div className="flex items-center bg-white dark:bg-gray-800 rounded-full px-1 py-1 gap-0.5 shadow-sm">
            <button
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                editor.isActive('bold') 
                  ? 'bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900' 
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
              type="button"
              title="Bold"
            >
              B
            </button>
            <button
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={`px-3 py-1.5 rounded-full text-sm italic transition-all ${
                editor.isActive('italic') 
                  ? 'bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900' 
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
              type="button"
              title="Italic"
            >
              I
            </button>
          </div>
          
          {/* Heading Group */}
          <div className="flex items-center bg-white dark:bg-gray-800 rounded-full px-1 py-1 gap-0.5 shadow-sm">
            <button
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                editor.isActive('heading', { level: 2 }) 
                  ? 'bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900' 
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
              type="button"
              title="Heading"
            >
              H2
            </button>
            <button
              onClick={() => editor.chain().focus().setParagraph().run()}
              className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                editor.isActive('paragraph') 
                  ? 'bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900' 
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
              type="button"
              title="Normal text"
            >
              Text
            </button>
          </div>
          
          {/* List Group */}
          <div className="flex items-center bg-white dark:bg-gray-800 rounded-full px-1 py-1 gap-0.5 shadow-sm">
            <button
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                editor.isActive('bulletList') 
                  ? 'bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900' 
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
              type="button"
              title="Bullet list"
            >
              List
            </button>
            <button
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                editor.isActive('orderedList') 
                  ? 'bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900' 
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
              type="button"
              title="Numbered list"
            >
              Numbered
            </button>
          </div>
        </div>
      </div>

      {/* Editor Content Area */}
      <div className="bg-white dark:bg-gray-800">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
