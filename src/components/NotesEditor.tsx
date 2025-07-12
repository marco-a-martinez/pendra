'use client';

import { useEditor, EditorContent, BubbleMenu } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import Typography from '@tiptap/extension-typography';
import TextAlign from '@tiptap/extension-text-align';
import { lowlight } from 'lowlight';
import { 
  Bold, 
  Italic, 
  Underline as UnderlineIcon,
  Strikethrough,
  Code,
  List,
  ListOrdered,
  CheckSquare,
  Quote,
  Link2,
  Undo2,
  Redo2,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Type
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEffect, useCallback } from 'react';

interface NotesEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  className?: string;
  editable?: boolean;
}

export function NotesEditor({ 
  content, 
  onChange, 
  placeholder = 'Add a note...', 
  className,
  editable = true
}: NotesEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3]
        },
        codeBlock: false,
      }),
      Placeholder.configure({
        placeholder,
        emptyEditorClass: 'is-editor-empty',
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-500 underline cursor-pointer hover:text-blue-600 transition-colors',
        },
      }),
      Underline,
      TaskList.configure({
        HTMLAttributes: {
          class: 'not-prose pl-2 space-y-1',
        },
      }),
      TaskItem.configure({
        nested: true,
        HTMLAttributes: {
          class: 'flex items-start gap-2',
        },
      }),
      CodeBlockLowlight.configure({
        lowlight,
        HTMLAttributes: {
          class: 'rounded-lg bg-gray-50 dark:bg-gray-900 p-4 font-mono text-sm my-2',
        },
      }),
      Typography,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    content,
    editable,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: cn(
          'prose prose-sm dark:prose-invert max-w-none',
          'focus:outline-none',
          'min-h-[100px] px-3 py-2',
          '[&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-1',
          '[&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:space-y-1',
          '[&_h1]:text-2xl [&_h1]:font-bold [&_h1]:mb-3 [&_h1]:mt-4',
          '[&_h2]:text-xl [&_h2]:font-semibold [&_h2]:mb-2 [&_h2]:mt-3',
          '[&_h3]:text-lg [&_h3]:font-medium [&_h3]:mb-2 [&_h3]:mt-2',
          '[&_p]:mb-3 [&_p]:leading-relaxed',
          '[&_blockquote]:border-l-4 [&_blockquote]:border-blue-500 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:my-3',
          '[&_code]:bg-gray-100 [&_code]:dark:bg-gray-800 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:font-mono [&_code]:text-sm [&_code]:text-blue-600 [&_code]:dark:text-blue-400',
          '[&_.is-editor-empty:first-child::before]:content-[attr(data-placeholder)]',
          '[&_.is-editor-empty:first-child::before]:text-gray-400',
          '[&_.is-editor-empty:first-child::before]:float-left',
          '[&_.is-editor-empty:first-child::before]:pointer-events-none',
          '[&_.is-editor-empty:first-child::before]:h-0',
          '[&_ul[data-type="taskList"]]:list-none [&_ul[data-type="taskList"]]:pl-0',
          '[&_li[data-type="taskItem"]>label]:flex [&_li[data-type="taskItem"]>label]:items-center [&_li[data-type="taskItem"]>label]:gap-2',
          '[&_li[data-type="taskItem"]>label>input]:rounded [&_li[data-type="taskItem"]>label>input]:border-gray-300',
          '[&_li[data-type="taskItem"]>div]:flex-1',
          className
        ),
      },
    },
  });

  // Update editor content when prop changes
  useEffect(() => {
    if (editor && content !== editor.getHTML() && !editor.isFocused) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  // Update editable state
  useEffect(() => {
    if (editor) {
      editor.setEditable(editable);
    }
  }, [editor, editable]);

  const setLink = useCallback(() => {
    if (!editor) return;
    
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL', previousUrl);

    if (url === null) {
      return;
    }

    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  if (!editor) {
    return null;
  }

  const ToolbarButton = ({ 
    onClick, 
    isActive = false,
    disabled = false,
    children,
    title
  }: {
    onClick: () => void;
    isActive?: boolean;
    disabled?: boolean;
    children: React.ReactNode;
    title?: string;
  }) => (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={cn(
        'p-2 rounded-md transition-all duration-200',
        'hover:bg-gray-100 dark:hover:bg-gray-800',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        isActive && 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30'
      )}
    >
      {children}
    </button>
  );

  const Separator = () => (
    <div className="w-px h-6 bg-gray-200 dark:bg-gray-700" />
  );

  return (
    <div className={cn('relative', className)}>
      {editable && editor && (
        <BubbleMenu
          editor={editor}
          tippyOptions={{ 
            duration: 100,
            placement: 'top',
          }}
          className={cn(
            'flex items-center gap-1 p-1.5 rounded-xl shadow-lg',
            'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700',
            'backdrop-blur-sm'
          )}
        >
          {/* Undo/Redo */}
          <ToolbarButton
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            title="Undo (Cmd+Z)"
          >
            <Undo2 className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            title="Redo (Cmd+Shift+Z)"
          >
            <Redo2 className="w-4 h-4" />
          </ToolbarButton>
          
          <Separator />
          
          {/* Text Formatting */}
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            isActive={editor.isActive('bold')}
            title="Bold (Cmd+B)"
          >
            <Bold className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            isActive={editor.isActive('italic')}
            title="Italic (Cmd+I)"
          >
            <Italic className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            isActive={editor.isActive('underline')}
            title="Underline (Cmd+U)"
          >
            <UnderlineIcon className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleStrike().run()}
            isActive={editor.isActive('strike')}
            title="Strikethrough"
          >
            <Strikethrough className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleCode().run()}
            isActive={editor.isActive('code')}
            title="Code"
          >
            <Code className="w-4 h-4" />
          </ToolbarButton>
          
          <Separator />
          
          {/* Links */}
          <ToolbarButton
            onClick={setLink}
            isActive={editor.isActive('link')}
            title="Add Link (Cmd+K)"
          >
            <Link2 className="w-4 h-4" />
          </ToolbarButton>
          
          <Separator />
          
          {/* Lists */}
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            isActive={editor.isActive('bulletList')}
            title="Bullet List"
          >
            <List className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            isActive={editor.isActive('orderedList')}
            title="Numbered List"
          >
            <ListOrdered className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleTaskList().run()}
            isActive={editor.isActive('taskList')}
            title="Task List"
          >
            <CheckSquare className="w-4 h-4" />
          </ToolbarButton>
          
          <Separator />
          
          {/* Block Formatting */}
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            isActive={editor.isActive('blockquote')}
            title="Quote"
          >
            <Quote className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            isActive={editor.isActive('codeBlock')}
            title="Code Block"
          >
            <Code className="w-4 h-4" />
          </ToolbarButton>
          
          <Separator />
          
          {/* Text Alignment */}
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            isActive={editor.isActive({ textAlign: 'left' })}
            title="Align Left"
          >
            <AlignLeft className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            isActive={editor.isActive({ textAlign: 'center' })}
            title="Align Center"
          >
            <AlignCenter className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            isActive={editor.isActive({ textAlign: 'right' })}
            title="Align Right"
          >
            <AlignRight className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign('justify').run()}
            isActive={editor.isActive({ textAlign: 'justify' })}
            title="Justify"
          >
            <AlignJustify className="w-4 h-4" />
          </ToolbarButton>
        </BubbleMenu>
      )}
      
      <EditorContent 
        editor={editor} 
        className={cn(
          'rounded-lg border border-gray-200 dark:border-gray-700',
          'bg-white dark:bg-gray-900',
          'transition-colors duration-200',
          editor?.isFocused && 'border-blue-500 dark:border-blue-400',
          !editable && 'bg-gray-50 dark:bg-gray-950'
        )}
      />
    </div>
  );
}