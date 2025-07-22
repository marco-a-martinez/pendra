'use client';

import { useEditor, EditorContent, BubbleMenu } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
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
  Plus,
  Hash,
  CheckSquare,
  Image,
  Minus
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState, useRef, useEffect } from 'react';

interface NotionStyleEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  className?: string;
}

export function NotionStyleEditor({ 
  content, 
  onChange, 
  placeholder = 'Type / for commands...', 
  className
}: NotionStyleEditorProps) {
  const [showSlashMenu, setShowSlashMenu] = useState(false);
  const [slashMenuPosition, setSlashMenuPosition] = useState({ top: 0, left: 0 });
  const [searchQuery, setSearchQuery] = useState('');
  
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
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
        types: ['paragraph', 'heading'],
      }),
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
      
      // Check for slash command
      const { from, to, $from } = editor.state.selection;
      const text = editor.state.doc.textBetween(from - 1, from);
      
      if (text === '/') {
        const coords = editor.view.coordsAtPos(from);
        setSlashMenuPosition({
          top: coords.top + 20,
          left: coords.left,
        });
        setShowSlashMenu(true);
        setSearchQuery('');
      } else {
        setShowSlashMenu(false);
      }
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm dark:prose-invert max-w-none focus:outline-none text-gray-700 dark:text-gray-300',
      },
      handleKeyDown: (view, event) => {
        if (showSlashMenu && event.key === 'Escape') {
          setShowSlashMenu(false);
          return true;
        }
        return false;
      },
    },
    immediatelyRender: false,
  });

  const slashCommands = [
    { 
      icon: Type, 
      title: 'Text', 
      description: 'Just start writing with plain text.',
      command: () => editor?.chain().focus().setParagraph().run()
    },
    { 
      icon: Hash, 
      title: 'Heading 1', 
      description: 'Big section heading.',
      command: () => editor?.chain().focus().toggleHeading({ level: 1 }).run()
    },
    { 
      icon: Hash, 
      title: 'Heading 2', 
      description: 'Medium section heading.',
      command: () => editor?.chain().focus().toggleHeading({ level: 2 }).run()
    },
    { 
      icon: List, 
      title: 'Bullet List', 
      description: 'Create a simple bullet list.',
      command: () => editor?.chain().focus().toggleBulletList().run()
    },
    { 
      icon: ListOrdered, 
      title: 'Numbered List', 
      description: 'Create a list with numbering.',
      command: () => editor?.chain().focus().toggleOrderedList().run()
    },
    { 
      icon: CheckSquare, 
      title: 'To-do List', 
      description: 'Track tasks with a to-do list.',
      command: () => editor?.chain().focus().toggleTaskList().run()
    },
    { 
      icon: Quote, 
      title: 'Quote', 
      description: 'Capture a quote.',
      command: () => editor?.chain().focus().toggleBlockquote().run()
    },
    { 
      icon: Code, 
      title: 'Code', 
      description: 'Capture a code snippet.',
      command: () => editor?.chain().focus().toggleCodeBlock().run()
    },
    { 
      icon: Minus, 
      title: 'Divider', 
      description: 'Visually divide blocks.',
      command: () => editor?.chain().focus().setHorizontalRule().run()
    },
  ];

  const filteredCommands = slashCommands.filter(cmd => 
    cmd.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cmd.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const executeCommand = (command: () => void) => {
    // Remove the slash
    editor?.chain().focus().deleteRange({ from: editor.state.selection.from - 1, to: editor.state.selection.from }).run();
    command();
    setShowSlashMenu(false);
  };

  if (!editor) {
    return null;
  }

  const addLink = () => {
    const url = window.prompt('Enter URL:');
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  return (
    <div className={cn('relative', className)}>
      {/* Bubble Menu for text formatting */}
      <BubbleMenu 
        editor={editor} 
        tippyOptions={{ duration: 100 }}
        className="flex items-center gap-1 p-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700"
      >
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={cn(
            'p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors',
            editor.isActive('bold') && 'bg-gray-100 dark:bg-gray-700'
          )}
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={cn(
            'p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors',
            editor.isActive('italic') && 'bg-gray-100 dark:bg-gray-700'
          )}
        >
          <Italic className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={cn(
            'p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors',
            editor.isActive('underline') && 'bg-gray-100 dark:bg-gray-700'
          )}
        >
          <UnderlineIcon className="w-4 h-4" />
        </button>
        <div className="w-px h-4 bg-gray-300 dark:bg-gray-600" />
        <button
          onClick={addLink}
          className={cn(
            'p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors',
            editor.isActive('link') && 'bg-gray-100 dark:bg-gray-700'
          )}
        >
          <LinkIcon className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleCode().run()}
          className={cn(
            'p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors',
            editor.isActive('code') && 'bg-gray-100 dark:bg-gray-700'
          )}
        >
          <Code className="w-4 h-4" />
        </button>
      </BubbleMenu>

      {/* Slash Command Menu */}
      {showSlashMenu && (
        <div 
          className="absolute z-50 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-2 max-h-80 overflow-y-auto"
          style={{ top: slashMenuPosition.top, left: slashMenuPosition.left }}
        >
          <div className="px-3 py-1.5 text-xs font-medium text-gray-500 dark:text-gray-400">
            Basic blocks
          </div>
          {filteredCommands.map((cmd, index) => {
            const Icon = cmd.icon;
            return (
              <button
                key={index}
                onClick={() => executeCommand(cmd.command)}
                className="w-full px-3 py-2 flex items-start gap-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left"
              >
                <div className="p-1.5 bg-gray-100 dark:bg-gray-700 rounded">
                  <Icon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {cmd.title}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {cmd.description}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Editor */}
      <div className="min-h-[200px] px-4 py-3 cursor-text" onClick={() => editor?.chain().focus().run()}>
        <EditorContent editor={editor} />
      </div>

      <style jsx global>{`
        .ProseMirror {
          min-height: 150px;
        }
        
        .ProseMirror p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: #9ca3af;
          pointer-events: none;
          height: 0;
        }
        
        .ProseMirror h1 {
          font-size: 2em;
          font-weight: 700;
          margin: 0.5em 0;
        }
        
        .ProseMirror h2 {
          font-size: 1.5em;
          font-weight: 600;
          margin: 0.5em 0;
        }
        
        .ProseMirror h3 {
          font-size: 1.25em;
          font-weight: 600;
          margin: 0.5em 0;
        }
        
        .ProseMirror ul,
        .ProseMirror ol {
          padding-left: 1.5em;
          margin: 0.5em 0;
        }
        
        .ProseMirror blockquote {
          border-left: 3px solid #e5e7eb;
          padding-left: 1em;
          margin: 0.5em 0;
          color: #6b7280;
        }
        
        .ProseMirror pre {
          background: #f3f4f6;
          border-radius: 0.375rem;
          padding: 0.75rem 1rem;
          margin: 0.5em 0;
        }
        
        .ProseMirror code {
          background: #f3f4f6;
          padding: 0.125rem 0.25rem;
          border-radius: 0.25rem;
          font-size: 0.875em;
        }
        
        .ProseMirror hr {
          border: none;
          border-top: 1px solid #e5e7eb;
          margin: 1.5em 0;
        }
        
        .dark .ProseMirror blockquote {
          border-left-color: #4b5563;
          color: #9ca3af;
        }
        
        .dark .ProseMirror pre,
        .dark .ProseMirror code {
          background: #1f2937;
        }
        
        .dark .ProseMirror hr {
          border-top-color: #4b5563;
        }
      `}</style>
    </div>
  );
}
