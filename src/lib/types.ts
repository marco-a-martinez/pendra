export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
  order: number;
}

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
  order: number;
  dueDate?: Date | null;
  sectionId: string;
  checklist?: ChecklistItem[];
  checklistExpanded?: boolean;
  note?: string;
  noteExpanded?: boolean;
}

export interface Section {
  id: string;
  name: string;
  color?: string;
  order: number;
  collapsed?: boolean;
}
