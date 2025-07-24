export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
  order: number;
  dueDate?: Date | null;
  sectionId: string;
}

export interface Section {
  id: string;
  name: string;
  color?: string;
  order: number;
  collapsed?: boolean;
}
