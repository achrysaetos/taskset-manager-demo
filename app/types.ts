export type TaskType = 
  | 'Intake Call'
  | 'Sign Engagement Letter'
  | 'Collect Medical Records'
  | 'Client Check-in'
  | 'Create Demand';

export interface TimeDependency {
  type: 'time';
  taskId: string;
  weeksRequired: number;
}

export interface TaskDependency {
  type: 'task';
  taskId: string;
}

export type Dependency = TimeDependency | TaskDependency;

export interface Task {
  id: string;
  type: TaskType;
  matterId: string;
  completed: boolean;
  completedAt?: Date;
  createdAt: Date;
  dependencies: Dependency[];
}

export interface Matter {
  id: string;
  title: string;
  createdAt: Date;
  tasks: Task[];
}

export interface TaskDefinition {
  type: TaskType;
  dependencies: {
    tasks?: TaskType[];
    timeRequirements?: {
      taskType: TaskType;
      weeks: number;
    }[];
  };
}

export const TASK_DEFINITIONS: TaskDefinition[] = [
  {
    type: 'Intake Call',
    dependencies: {},
  },
  {
    type: 'Sign Engagement Letter',
    dependencies: {
      tasks: ['Intake Call'],
    },
  },
  {
    type: 'Collect Medical Records',
    dependencies: {
      tasks: ['Sign Engagement Letter'],
    },
  },
  {
    type: 'Client Check-in',
    dependencies: {
      tasks: ['Sign Engagement Letter'],
      timeRequirements: [
        {
          taskType: 'Intake Call',
          weeks: 2,
        },
      ],
    },
  },
  {
    type: 'Create Demand',
    dependencies: {
      tasks: ['Collect Medical Records'],
    },
  },
]; 