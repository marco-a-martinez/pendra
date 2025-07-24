export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
  order: number;
  dueDate?: Date | null;
}
