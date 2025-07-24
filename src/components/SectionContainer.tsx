'use client';

import { Section, Todo } from '@/lib/types';
import { TodoItem } from './TodoItem';
import { SectionHeader } from './SectionHeader';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

interface SectionContainerProps {
  section: Section;
  todos: Todo[];
  onToggleCollapse: (sectionId: string) => void;
  onAddTask: (sectionId: string) => void;
  onRenameSection: (sectionId: string, newName: string) => void;
  onDeleteSection: (sectionId: string) => void;
  onToggleTodo: (todoId: string) => void;
  onDeleteTodo: (todoId: string) => void;
  onUpdateTodo: (todoId: string, updates: Partial<Todo>) => void;
  canDeleteSection: boolean;
}

export function SectionContainer({
  section,
  todos,
  onToggleCollapse,
  onAddTask,
  onRenameSection,
  onDeleteSection,
  onToggleTodo,
  onDeleteTodo,
  onUpdateTodo,
  canDeleteSection
}: SectionContainerProps) {
  const { setNodeRef } = useDroppable({
    id: `section-${section.id}`,
    data: {
      type: 'section',
      sectionId: section.id
    }
  });

  return (
    <div className="mb-4">
      <SectionHeader
        section={section}
        taskCount={todos.length}
        onToggleCollapse={onToggleCollapse}
        onAddTask={onAddTask}
        onRename={onRenameSection}
        onDelete={onDeleteSection}
        canDelete={canDeleteSection}
      />
      
      {!section.collapsed && (
        <div
          ref={setNodeRef}
          className="min-h-[50px] space-y-2 p-2 border-2 border-dashed border-transparent hover:border-gray-200 rounded-lg transition-colors"
        >
          {todos.length === 0 ? (
            <div className="text-center py-8 text-gray-400 text-sm">
              No tasks in this section
            </div>
          ) : (
            <SortableContext
              items={todos.map(todo => todo.id)}
              strategy={verticalListSortingStrategy}
            >
              {todos.map(todo => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  onToggle={onToggleTodo}
                  onDelete={onDeleteTodo}
                  onUpdateTodo={onUpdateTodo}
                />
              ))}
            </SortableContext>
          )}
        </div>
      )}
    </div>
  );
}
