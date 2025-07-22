'use client';

import { useState } from 'react';
import { BeautifulEditor } from '@/components/BeautifulEditor';

export default function BeautifulEditorPage() {
  const [content, setContent] = useState(`
    <h1>Welcome to the Beautiful Editor</h1>
    <p>This is a <strong>modern</strong>, <em>elegant</em> WYSIWYG editor with a design that could be featured on <mark style="background-color: #FEF3C7">Dribbble</mark>.</p>
    <h2>Rich Text Features</h2>
    <p>Experience the power of rich text editing with:</p>
    <ul>
      <li><strong>Bold</strong>, <em>italic</em>, and <u>underlined</u> text</li>
      <li><mark style="background-color: #DBEAFE">Highlighted text</mark> in multiple colors</li>
      <li>Text in <span style="color: #9333EA">different</span> <span style="color: #3B82F6">colors</span></li>
      <li>Links to <a href="https://dribbble.com">amazing designs</a></li>
    </ul>
    <blockquote>"Great design is not just what it looks like and feels like. Design is how it works." - Steve Jobs</blockquote>
    <p style="text-align: center;">Center-aligned text for emphasis</p>
    <hr>
    <p style="text-align: right;"><em>Start creating beautiful content today!</em></p>
  `);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-pink-900/20 p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent">
              Beautiful WYSIWYG Editor
            </span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            A modern, Dribbble-worthy rich text editor for your todos
          </p>
        </div>

        {/* Editor Showcase */}
        <div className="mb-12">
          <BeautifulEditor
            content={content}
            onChange={setContent}
            placeholder="Start writing something amazing..."
          />
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Rich Formatting</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Complete text formatting with bold, italic, underline, colors, and highlights
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Beautiful UI</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Modern design with gradients, smooth animations, and intuitive controls
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Powerful Features</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Headings, lists, quotes, alignment, and more - everything you need
            </p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
            This editor brings a premium feel to your todo descriptions
          </p>
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-medium">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Ready for Production
          </div>
        </div>
      </div>
    </div>
  );
}
