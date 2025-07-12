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
  Strikethrough,
  Link as LinkIcon,
  List, 
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Undo,
  Redo,
  Image,
  Quote,
  Columns
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  className?: string;
  theme?: 'light' | 'dark' | 'blue';
}

export function RichTextEditor({ 
  content, 
  onChange, 
  placeholder = 'Start typing...', 
  className,
  theme = 'light'
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-500 underline',
        },
      }),
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
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

  const getThemeClasses = () => {
    switch (theme) {
      case 'dark':
        return {
          container: 'border-gray-700 bg-gray-800',
          toolbar: 'bg-gray-800 border-gray-700',
          button: 'hover:bg-gray-700 text-gray-300',
          buttonActive: 'bg-gray-700 text-white',
          separator: 'bg-gray-600',
          editor: 'bg-gray-800 text-gray-100'
        };
      case 'blue':
        return {
          container: 'border-blue-500 bg-blue-50',
          toolbar: 'bg-blue-500 border-blue-600',
          button: 'hover:bg-blue-600 text-white',
          buttonActive: 'bg-blue-600 text-white',
          separator: 'bg-blue-400',
          editor: 'bg-white text-gray-900'
        };
      default:
        return {
          container: 'border-gray-300 bg-white',
          toolbar: 'bg-gray-50 border-gray-200',
          button: 'hover:bg-gray-100 text-gray-700',
          buttonActive: 'bg-gray-200 text-gray-900',
          separator: 'bg-gray-300',
          editor: 'bg-white text-gray-900'
        };
    }
  };

  const themeClasses = getThemeClasses();

  const getButtonClass = (isActive: boolean, isDisabled?: boolean) => {
    return cn(
      'p-2 rounded transition-colors',
      themeClasses.button,
      isActive && themeClasses.buttonActive,
      isDisabled && 'opacity-50 cursor-not-allowed'
    );
  };

  return (
    <div className={cn(
      'border rounded-md focus-within:ring-2 focus-within:ring-blue-500',
      themeClasses.container,
      className
    )}>
      {/* Toolbar */}
      <div className={cn(
        'flex items-center gap-1 p-2 border-b flex-wrap',
        themeClasses.toolbar
      )}>
        {/* Undo/Redo */}
        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className={getButtonClass(false, !editor.can().undo())}
          data-1p-ignore
          data-lpignore="true"
        >
          <Undo className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className={getButtonClass(false, !editor.can().redo())}
          data-1p-ignore
          data-lpignore="true"
        >
          <Redo className="w-4 h-4" />
        </button>
        
        <div className={cn('w-px h-6 mx-1', themeClasses.separator)} />
        
        {/* Text formatting */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={getButtonClass(editor.isActive('bold'))}
          data-1p-ignore
          data-lpignore="true"
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={getButtonClass(editor.isActive('italic'))}
          data-1p-ignore
          data-lpignore="true"
        >
          <Italic className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={getButtonClass(editor.isActive('underline'))}
          data-1p-ignore
          data-lpignore="true"
        >
          <UnderlineIcon className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={getButtonClass(editor.isActive('strike'))}
          data-1p-ignore
          data-lpignore="true"
        >
          <Strikethrough className="w-4 h-4" />
        </button>
        
        <div className={cn('w-px h-6 mx-1', themeClasses.separator)} />
        
        {/* Link */}
        <button
          type="button"
          onClick={() => {
            const url = window.prompt('Enter URL');
            if (url) {
              editor.chain().focus().setLink({ href: url }).run();
            }
          }}
          className={getButtonClass(editor.isActive('link'))}
          data-1p-ignore
          data-lpignore="true"
        >
          <LinkIcon className="w-4 h-4" />
        </button>
        
        <div className={cn('w-px h-6 mx-1', themeClasses.separator)} />
        
        {/* Lists */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={getButtonClass(editor.isActive('bulletList'))}
          data-1p-ignore
          data-lpignore="true"
        >
          <List className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={getButtonClass(editor.isActive('orderedList'))}
          data-1p-ignore
          data-lpignore="true"
        >
          <ListOrdered className="w-4 h-4" />
        </button>
        
        <div className={cn('w-px h-6 mx-1', themeClasses.separator)} />
        
        {/* Text alignment */}
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          className={getButtonClass(editor.isActive({ textAlign: 'left' }))}
          data-1p-ignore
          data-lpignore="true"
        >
          <AlignLeft className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          className={getButtonClass(editor.isActive({ textAlign: 'center' }))}
          data-1p-ignore
          data-lpignore="true"
        >
          <AlignCenter className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          className={getButtonClass(editor.isActive({ textAlign: 'right' }))}
          data-1p-ignore
          data-lpignore="true"
        >
          <AlignRight className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('justify').run()}
          className={getButtonClass(editor.isActive({ textAlign: 'justify' }))}
          data-1p-ignore
          data-lpignore="true"
        >
          <AlignJustify className="w-4 h-4" />
        </button>
      </div>
      
      {/* Editor */}
      <EditorContent 
        editor={editor} 
        className={cn('rounded-b-md p-2', themeClasses.editor)}
      />
    </div>
  );
}
