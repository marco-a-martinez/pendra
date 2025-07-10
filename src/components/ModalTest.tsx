'use client';

import { useAppStore } from '@/lib/store';

export function ModalTest() {
  const { taskModalOpen, setTaskModalOpen } = useAppStore();

  return (
    <div className="p-4 bg-yellow-100 border border-yellow-400 rounded">
      <h3 className="font-bold">Modal Test</h3>
      <p>Modal Open: {taskModalOpen ? 'YES' : 'NO'}</p>
      <button 
        onClick={() => setTaskModalOpen(!taskModalOpen)}
        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Toggle Modal
      </button>
    </div>
  );
}
