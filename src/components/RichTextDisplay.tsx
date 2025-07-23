'use client';

import { useEffect, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';

interface RichTextDisplayProps {
  content: string;
  className?: string;
}

export function RichTextDisplay({ content, className = '' }: RichTextDisplayProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: true,
        HTMLAttributes: {
          class: 'text-blue-600 underline hover:text-blue-800',
        },
      }),
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
    ],
    content,
    editable: false,
    editorProps: {
      attributes: {
        class: 'task-notes-display focus:outline-none',
      },
    },
  });

  // Update content when it changes
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  if (!content || content === '<p></p>' || content === '') {
    return null;
  }

  return (
    <div className={`task-notes-display prose prose-sm max-w-none ${className}`}>
      <EditorContent editor={editor} />
    </div>
  );
}
