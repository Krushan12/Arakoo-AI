export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'done';
  columnId: string;
  createdAt: number;
  updatedAt: number;
  assignee?: string;
  priority: 'low' | 'medium' | 'high';
  userId: string;
}

export interface Column {
  id: string;
  title: string;
  tasks: Task[];
}

export interface Board {
  columns: Column[];
}
