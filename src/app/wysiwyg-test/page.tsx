'use client';

import { useState } from 'react';
import { ModernRichTextEditor } from '@/components/ModernRichTextEditor';

export default function WysiwygTestPage() {
  const [content, setContent] = useState('<p>This is a <strong>rich text</strong> todo description with <em>formatting</em>!</p>');
  const [displayMode, setDisplayMode] = useState<'edit' | 'view'>('edit');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
          WYSIWYG Todo Editor Test
        </h1>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 space-y-6">
          {/* Toggle between edit and view modes */}
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              Todo Description
            </h2>
            <button
              onClick={() => setDisplayMode(displayMode === 'edit' ? 'view' : 'edit')}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
            >
              {displayMode === 'edit' ? 'View Mode' : 'Edit Mode'}
            </button>
          </div>

          {/* Editor or Display */}
          {displayMode === 'edit' ? (
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Edit your todo description with rich formatting:
              </p>
              <ModernRichTextEditor
                content={content}
                onChange={setContent}
                placeholder="Describe your todo..."
              />
            </div>
          ) : (
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                This is how your todo description will appear:
              </p>
              <div 
                className="prose prose-sm dark:prose-invert max-w-none p-4 bg-gray-50 dark:bg-gray-900 rounded-md"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            </div>
          )}

          {/* Raw HTML Output */}
          <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Raw HTML Output:
            </h3>
            <pre className="text-xs bg-gray-100 dark:bg-gray-900 p-3 rounded overflow-x-auto">
              <code>{content}</code>
            </pre>
          </div>

          {/* Feature List */}
          <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Available Formatting Options:
            </h3>
            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <li>• <strong>Bold</strong> text (Cmd/Ctrl + B)</li>
              <li>• <em>Italic</em> text (Cmd/Ctrl + I)</li>
              <li>• <u>Underlined</u> text (Cmd/Ctrl + U)</li>
              <li>• <a href="#" className="text-blue-500 hover:text-blue-600">Links</a></li>
              <li>• Bullet lists</li>
              <li>• Numbered lists</li>
              <li>• <code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded">Inline code</code></li>
              <li>• Block quotes</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
