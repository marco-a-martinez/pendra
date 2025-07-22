'use client';

import { useState } from 'react';
import { NotionStyleEditor } from '@/components/NotionStyleEditor';
import { ModernRichTextEditor } from '@/components/ModernRichTextEditor';
import { CompactRichTextEditor } from '@/components/CompactRichTextEditor';

export default function EditorComparisonPage() {
  const [notionContent, setNotionContent] = useState('<p>Try typing <strong>/</strong> to see commands...</p>');
  const [modernContent, setModernContent] = useState('<p>Click the <strong>Format</strong> button to see options...</p>');
  const [compactContent, setCompactContent] = useState('<p>All formatting options are <strong>visible</strong> in the toolbar...</p>');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          WYSIWYG Editor Comparison
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Compare different editor styles to see which one fits your needs best.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Notion Style Editor */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Notion Style
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Slash commands & bubble menu
              </p>
            </div>
            <div className="p-4">
              <NotionStyleEditor
                content={notionContent}
                onChange={setNotionContent}
                placeholder="Type / for commands..."
              />
            </div>
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <p className="font-medium text-gray-900 dark:text-white">Features:</p>
                <ul className="space-y-1 ml-4">
                  <li>• Type <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">/</code> for commands</li>
                  <li>• Select text for formatting</li>
                  <li>• Clean, minimal interface</li>
                  <li>• Notion-like experience</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Modern Style Editor */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Modern Style
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Collapsible toolbar
              </p>
            </div>
            <div className="p-4">
              <ModernRichTextEditor
                content={modernContent}
                onChange={setModernContent}
                placeholder="Add more details..."
              />
            </div>
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <p className="font-medium text-gray-900 dark:text-white">Features:</p>
                <ul className="space-y-1 ml-4">
                  <li>• Format button toggles toolbar</li>
                  <li>• Clean when not in use</li>
                  <li>• Subtle animations</li>
                  <li>• Space-efficient</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Compact Style Editor */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Compact Style
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Always visible toolbar
              </p>
            </div>
            <div className="p-4">
              <CompactRichTextEditor
                content={compactContent}
                onChange={setCompactContent}
                placeholder="Add more details..."
              />
            </div>
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <p className="font-medium text-gray-900 dark:text-white">Features:</p>
                <ul className="space-y-1 ml-4">
                  <li>• All options visible</li>
                  <li>• Traditional toolbar</li>
                  <li>• Quick access to formatting</li>
                  <li>• Familiar interface</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Recommendation */}
        <div className="mt-8 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
            Recommendation
          </h3>
          <p className="text-blue-800 dark:text-blue-200">
            The <strong>Notion Style</strong> editor provides the most modern and intuitive experience for todo descriptions. 
            It keeps the interface clean while offering powerful formatting options through slash commands and a bubble menu.
          </p>
        </div>
      </div>
    </div>
  );
}
