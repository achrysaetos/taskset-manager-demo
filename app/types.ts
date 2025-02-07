export type TaskType = 
  | 'Intake Call'
  | 'Sign Engagement Letter'
  | 'Collect Medical Records'
  | 'Client Check-in'
  | 'Create Demand';

export interface Task {
  id: string;
  type: TaskType;
  matterId: string;
  completed: boolean;
  completedAt?: Date;
  createdAt: Date;
  requiredTasks: TaskType[];
  timeRequirement?: {
    afterTask: TaskType;
    weeks: number;
  };
}

export interface Matter {
  id: string;
  title: string;
  createdAt: Date;
  tasks: Task[];
}

// Predefined task flow
export const TASK_FLOW: Record<TaskType, { 
  requiredTasks: TaskType[],
  timeRequirement?: { afterTask: TaskType, weeks: number }
}> = {
  'Intake Call': {
    requiredTasks: [],
  },
  'Sign Engagement Letter': {
    requiredTasks: ['Intake Call'],
  },
  'Collect Medical Records': {
    requiredTasks: ['Sign Engagement Letter'],
  },
  'Client Check-in': {
    requiredTasks: ['Sign Engagement Letter'],
    timeRequirement: {
      afterTask: 'Intake Call',
      weeks: 2,
    },
  },
  'Create Demand': {
    requiredTasks: ['Collect Medical Records'],
  },
}; 