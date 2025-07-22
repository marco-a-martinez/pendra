'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import { 
  Bold, 
  Italic, 
  Underline as UnderlineIcon,
  Link as LinkIcon,
  List, 
  ListOrdered,
  Code,
  Quote,
  Type,
  AlignLeft
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface ModernRichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  className?: string;
}

export function ModernRichTextEditor({ 
  content, 
  onChange, 
  placeholder = 'Add more details...', 
  className
}: ModernRichTextEditorProps) {
  const [showFormatting, setShowFormatting] = useState(false);
  
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
      }),
      Placeholder.configure({
        placeholder,
        emptyEditorClass: 'is-editor-empty',
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-500 hover:text-blue-600 underline cursor-pointer',
        },
      }),
      Underline,
      TextAlign.configure({
        types: ['paragraph'],
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm dark:prose-invert max-w-none focus:outline-none min-h-[80px] text-gray-700 dark:text-gray-300',
      },
    },
  });

  if (!editor) {
    return null;
  }

  const addLink = () => {
    const url = window.prompt('Enter URL:');
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  const ToolbarButton = ({ 
    onClick, 
    isActive = false, 
    children, 
    title 
  }: { 
    onClick: () => void; 
    isActive?: boolean; 
    children: React.ReactNode;
    title: string;
  }) => (
    <button
      onClick={onClick}
      title={title}
      className={cn(
        'p-1 rounded transition-all duration-150',
        'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200',
        isActive && 'text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700/50'
      )}
      type="button"
    >
      {children}
    </button>
  );

  const hasContent = editor.getText().length > 0;

  return (
    <div className={cn('relative', className)}>
      {/* Floating Format Button */}
      <div className="absolute top-2 right-2 z-10">
        <button
          onClick={() => setShowFormatting(!showFormatting)}
          className={cn(
            'flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-md transition-all duration-200',
            'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200',
            showFormatting && 'bg-gray-100 dark:bg-gray-700/50 text-gray-700 dark:text-gray-200'
          )}
          type="button"
        >
          <Type className="w-3 h-3" />
          Format
        </button>
      </div>

      {/* Inline Toolbar - Only show when formatting is enabled */}
      {showFormatting && (
        <div className="flex items-center gap-1 p-2 bg-gray-50 dark:bg-gray-800/50 rounded-t-lg border-b border-gray-100 dark:border-gray-700/30">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            isActive={editor.isActive('bold')}
            title="Bold (Cmd+B)"
          >
            <Bold className="w-3.5 h-3.5" />
          </ToolbarButton>
          
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            isActive={editor.isActive('italic')}
            title="Italic (Cmd+I)"
          >
            <Italic className="w-3.5 h-3.5" />
          </ToolbarButton>
          
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            isActive={editor.isActive('underline')}
            title="Underline (Cmd+U)"
          >
            <UnderlineIcon className="w-3.5 h-3.5" />
          </ToolbarButton>

          <div className="w-px h-4 bg-gray-200 dark:bg-gray-600" />
          
          <ToolbarButton
            onClick={addLink}
            isActive={editor.isActive('link')}
            title="Add Link"
          >
            <LinkIcon className="w-3.5 h-3.5" />
          </ToolbarButton>
          
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            isActive={editor.isActive('bulletList')}
            title="Bullet List"
          >
            <List className="w-3.5 h-3.5" />
          </ToolbarButton>
          
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            isActive={editor.isActive('orderedList')}
            title="Numbered List"
          >
            <ListOrdered className="w-3.5 h-3.5" />
          </ToolbarButton>

          <div className="w-px h-4 bg-gray-200 dark:bg-gray-600" />
          
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleCode().run()}
            isActive={editor.isActive('code')}
            title="Code"
          >
            <Code className="w-3.5 h-3.5" />
          </ToolbarButton>
          
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            isActive={editor.isActive('blockquote')}
            title="Quote"
          >
            <Quote className="w-3.5 h-3.5" />
          </ToolbarButton>
        </div>
      )}

      {/* Editor */}
      <div className={cn(
        'bg-white dark:bg-gray-800/50 px-4 py-3',
        showFormatting ? 'rounded-b-lg' : 'rounded-lg',
        'transition-all duration-200',
        'hover:bg-gray-50/50 dark:hover:bg-gray-800/70'
      )}>
        <EditorContent 
          editor={editor} 
          className="text-sm"
        />
      </div>

      <style jsx global>{`
        .ProseMirror p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: #9ca3af;
          pointer-events: none;
          height: 0;
        }
      `}</style>
    </div>
  );
}
