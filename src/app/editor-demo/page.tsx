'use client';

import { useState } from 'react';
import { RichTextEditor } from '@/components/RichTextEditor';

export default function EditorDemoPage() {
  const [content1, setContent1] = useState('<p>This is the light theme editor.</p>');
  const [content2, setContent2] = useState('<p>This is the dark theme editor.</p>');
  const [content3, setContent3] = useState('<p>This is the blue theme editor.</p>');

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Rich Text Editor Demo</h1>
        
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">Light Theme</h2>
            <RichTextEditor
              content={content1}
              onChange={setContent1}
              placeholder="Start typing in light theme..."
              theme="light"
            />
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">Dark Theme</h2>
            <RichTextEditor
              content={content2}
              onChange={setContent2}
              placeholder="Start typing in dark theme..."
              theme="dark"
            />
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">Blue Theme</h2>
            <RichTextEditor
              content={content3}
              onChange={setContent3}
              placeholder="Start typing in blue theme..."
              theme="blue"
            />
          </div>
        </div>

        <div className="mt-12 p-6 bg-white rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Features Added:</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Undo/Redo functionality</li>
            <li>Text formatting: Bold, Italic, Underline, Strikethrough</li>
            <li>Link insertion</li>
            <li>Lists: Bullet and Numbered</li>
            <li>Text alignment: Left, Center, Right, Justify</li>
            <li>Three theme variations: Light, Dark, and Blue</li>
          </ul>
        </div>
      </div>
    </div>
  );
}