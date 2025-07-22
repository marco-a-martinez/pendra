'use client';

import { useEditor, EditorContent, FloatingMenu, BubbleMenu } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Highlight from '@tiptap/extension-highlight';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import FontFamily from '@tiptap/extension-font-family';
import { 
  Bold, 
  Italic, 
  Underline as UnderlineIcon,
  Link2,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Highlighter,
  Type,
  Palette,
  Quote,
  Heading1,
  Heading2,
  Pilcrow,
  Minus
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface BeautifulEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  className?: string;
}

const colors = [
  { name: 'Default', value: null },
  { name: 'Purple', value: '#9333EA' },
  { name: 'Blue', value: '#3B82F6' },
  { name: 'Green', value: '#10B981' },
  { name: 'Orange', value: '#F97316' },
  { name: 'Pink', value: '#EC4899' },
  { name: 'Red', value: '#EF4444' },
];

const highlights = [
  { name: 'None', value: null },
  { name: 'Yellow', value: '#FEF3C7' },
  { name: 'Green', value: '#D1FAE5' },
  { name: 'Blue', value: '#DBEAFE' },
  { name: 'Purple', value: '#E9D5FF' },
  { name: 'Pink', value: '#FCE7F3' },
];

export function BeautifulEditor({ 
  content, 
  onChange, 
  placeholder = 'Start writing something amazing...', 
  className
}: BeautifulEditorProps) {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showHighlightPicker, setShowHighlightPicker] = useState(false);
  
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
          class: 'text-blue-500 hover:text-blue-600 underline cursor-pointer transition-colors',
        },
      }),
      Underline,
      TextAlign.configure({
        types: ['paragraph', 'heading'],
      }),
      Highlight.configure({
        multicolor: true,
      }),
      TextStyle,
      Color,
      FontFamily,
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-lg dark:prose-invert max-w-none focus:outline-none min-h-[200px] px-8 py-6',
      },
    },
    immediatelyRender: false,
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
    title,
    className: btnClassName = ''
  }: { 
    onClick: () => void; 
    isActive?: boolean; 
    children: React.ReactNode;
    title: string;
    className?: string;
  }) => (
    <button
      onClick={onClick}
      title={title}
      className={cn(
        'relative p-2 rounded-lg transition-all duration-200 group',
        'hover:bg-gray-100 dark:hover:bg-gray-800',
        isActive && 'bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 text-purple-700 dark:text-purple-300',
        btnClassName
      )}
      type="button"
    >
      <div className="relative z-10">
        {children}
      </div>
      {isActive && (
        <div className="absolute inset-0 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-lg blur-sm" />
      )}
    </button>
  );

  return (
    <div className={cn('relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden', className)}>
      {/* Gradient Border */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 opacity-10" />
      
      {/* Main Toolbar */}
      <div className="relative border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
        <div className="flex items-center gap-1 p-3 flex-wrap">
          {/* Text Style Group */}
          <div className="flex items-center gap-1 px-2 py-1 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
              isActive={editor.isActive('heading', { level: 1 })}
              title="Heading 1"
            >
              <Heading1 className="w-4 h-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              isActive={editor.isActive('heading', { level: 2 })}
              title="Heading 2"
            >
              <Heading2 className="w-4 h-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().setParagraph().run()}
              isActive={editor.isActive('paragraph')}
              title="Paragraph"
            >
              <Pilcrow className="w-4 h-4" />
            </ToolbarButton>
          </div>

          <div className="w-px h-6 bg-gray-300 dark:bg-gray-700 mx-1" />

          {/* Format Group */}
          <div className="flex items-center gap-1">
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBold().run()}
              isActive={editor.isActive('bold')}
              title="Bold"
            >
              <Bold className="w-4 h-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleItalic().run()}
              isActive={editor.isActive('italic')}
              title="Italic"
            >
              <Italic className="w-4 h-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              isActive={editor.isActive('underline')}
              title="Underline"
            >
              <UnderlineIcon className="w-4 h-4" />
            </ToolbarButton>
          </div>

          <div className="w-px h-6 bg-gray-300 dark:bg-gray-700 mx-1" />

          {/* Color & Highlight */}
          <div className="flex items-center gap-1">
            <div className="relative">
              <ToolbarButton
                onClick={() => setShowColorPicker(!showColorPicker)}
                isActive={false}
                title="Text Color"
              >
                <Palette className="w-4 h-4" />
              </ToolbarButton>
              {showColorPicker && (
                <div className="absolute top-full left-0 mt-2 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50">
                  <div className="grid grid-cols-4 gap-1">
                    {colors.map((color) => (
                      <button
                        key={color.name}
                        onClick={() => {
                          if (color.value) {
                            editor.chain().focus().setColor(color.value).run();
                          } else {
                            editor.chain().focus().unsetColor().run();
                          }
                          setShowColorPicker(false);
                        }}
                        className="w-8 h-8 rounded-lg border-2 border-gray-200 dark:border-gray-700 hover:scale-110 transition-transform"
                        style={{ backgroundColor: color.value || '#000000' }}
                        title={color.name}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className="relative">
              <ToolbarButton
                onClick={() => setShowHighlightPicker(!showHighlightPicker)}
                isActive={editor.isActive('highlight')}
                title="Highlight"
              >
                <Highlighter className="w-4 h-4" />
              </ToolbarButton>
              {showHighlightPicker && (
                <div className="absolute top-full left-0 mt-2 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50">
                  <div className="grid grid-cols-3 gap-1">
                    {highlights.map((highlight) => (
                      <button
                        key={highlight.name}
                        onClick={() => {
                          if (highlight.value) {
                            editor.chain().focus().setHighlight({ color: highlight.value }).run();
                          } else {
                            editor.chain().focus().unsetHighlight().run();
                          }
                          setShowHighlightPicker(false);
                        }}
                        className="w-8 h-8 rounded-lg border-2 border-gray-200 dark:border-gray-700 hover:scale-110 transition-transform"
                        style={{ backgroundColor: highlight.value || 'transparent' }}
                        title={highlight.name}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="w-px h-6 bg-gray-300 dark:bg-gray-700 mx-1" />

          {/* Lists & Links */}
          <div className="flex items-center gap-1">
            <ToolbarButton
              onClick={addLink}
              isActive={editor.isActive('link')}
              title="Add Link"
            >
              <Link2 className="w-4 h-4" />
            </ToolbarButton>
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
          </div>

          <div className="w-px h-6 bg-gray-300 dark:bg-gray-700 mx-1" />

          {/* Alignment */}
          <div className="flex items-center gap-1 px-2 py-1 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
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
          </div>

          <div className="w-px h-6 bg-gray-300 dark:bg-gray-700 mx-1" />

          {/* Special */}
          <div className="flex items-center gap-1">
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              isActive={editor.isActive('blockquote')}
              title="Quote"
            >
              <Quote className="w-4 h-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().setHorizontalRule().run()}
              isActive={false}
              title="Divider"
            >
              <Minus className="w-4 h-4" />
            </ToolbarButton>
          </div>
        </div>
      </div>

      {/* Editor Content */}
      <div className="relative">
        <EditorContent editor={editor} />
      </div>

      {/* Character Count */}
      <div className="absolute bottom-4 right-4 text-xs text-gray-400 dark:text-gray-600">
        {editor.storage.characterCount?.characters() || 0} characters
      </div>

      <style jsx global>{`
        .ProseMirror {
          min-height: 200px;
        }
        
        .ProseMirror p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: #9ca3af;
          pointer-events: none;
          height: 0;
        }
        
        .ProseMirror h1 {
          font-size: 2.5em;
          font-weight: 800;
          line-height: 1.2;
          margin: 0.5em 0;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .ProseMirror h2 {
          font-size: 2em;
          font-weight: 700;
          line-height: 1.3;
          margin: 0.5em 0;
          color: #1f2937;
        }
        
        .dark .ProseMirror h2 {
          color: #f3f4f6;
        }
        
        .ProseMirror h3 {
          font-size: 1.5em;
          font-weight: 600;
          margin: 0.5em 0;
        }
        
        .ProseMirror p {
          line-height: 1.8;
          margin: 0.75em 0;
        }
        
        .ProseMirror ul,
        .ProseMirror ol {
          padding-left: 1.5em;
          margin: 0.75em 0;
        }
        
        .ProseMirror li {
          margin: 0.25em 0;
        }
        
        .ProseMirror blockquote {
          border-left: 4px solid;
          border-image: linear-gradient(to bottom, #9333ea, #ec4899) 1;
          padding-left: 1.5em;
          margin: 1em 0;
          font-style: italic;
          color: #6b7280;
        }
        
        .dark .ProseMirror blockquote {
          color: #9ca3af;
        }
        
        .ProseMirror hr {
          border: none;
          height: 2px;
          background: linear-gradient(to right, transparent, #e5e7eb, transparent);
          margin: 2em 0;
        }
        
        .dark .ProseMirror hr {
          background: linear-gradient(to right, transparent, #4b5563, transparent);
        }
        
        .ProseMirror mark {
          padding: 0.125em 0.25em;
          border-radius: 0.25em;
          box-decoration-break: clone;
        }
      `}</style>
    </div>
  );
}
