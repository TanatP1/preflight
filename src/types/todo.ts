export enum Priority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT'
}

export interface Task {
  id: string;
  title: string;
  dueDate?: Date;
  dueTime?: Date;
  priority: Priority;
  link?: string;
  isCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTaskInput {
  title: string;
  dueDate?: Date;
  dueTime?: Date;
  priority: Priority;
  link?: string;
}