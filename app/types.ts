export type TaskType = 'Intake Call' | 'Sign Engagement Letter' | 'Collect Medical Records' | 'Client Check-in' | 'Create Demand';

export type Task = {
  type: TaskType;
  completed: boolean;
  completedAt?: Date;
  createdAt: Date;
  requires: TaskType[];
  waitWeeks?: { after: TaskType; weeks: number };
};

export type Matter = {
  id: number;
  title: string;
  createdAt: Date;
  tasks: Record<TaskType, Task>;
};

// Task definitions
export const TASKS: Record<TaskType, Omit<Task, 'completed' | 'completedAt' | 'createdAt'>> = {
  'Intake Call': { type: 'Intake Call', requires: [] },
  'Sign Engagement Letter': { type: 'Sign Engagement Letter', requires: ['Intake Call'] },
  'Collect Medical Records': { type: 'Collect Medical Records', requires: ['Sign Engagement Letter'] },
  'Client Check-in': { 
    type: 'Client Check-in', 
    requires: ['Sign Engagement Letter'],
    waitWeeks: { after: 'Intake Call', weeks: 2 }
  },
  'Create Demand': { type: 'Create Demand', requires: ['Collect Medical Records'] }
}; 