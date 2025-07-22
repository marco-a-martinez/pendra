'use client';

import { TaskModal } from './TaskModal';

export function AppWrapper({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <TaskModal />
    </>
  );
}
