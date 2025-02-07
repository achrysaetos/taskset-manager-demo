import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { addWeeks, isAfter } from 'date-fns';
import { Matter, TaskType, TASK_FLOW } from './types';

interface Store {
  matters: Matter[];
  createMatter: (title: string) => Matter;
  triggerTask: (matterId: string, taskId: string) => { success: boolean; message: string };
}

export const useStore = create<Store>((set, get) => ({
  matters: [],

  createMatter: (title: string) => {
    const matter: Matter = {
      id: uuidv4(),
      title,
      createdAt: new Date(),
      tasks: Object.entries(TASK_FLOW).map(([type, config]) => ({
        id: uuidv4(),
        type: type as TaskType,
        matterId: '',
        completed: false,
        createdAt: new Date(),
        requiredTasks: config.requiredTasks,
        timeRequirement: config.timeRequirement,
      })),
    };

    // Set matter ID for all tasks
    matter.tasks = matter.tasks.map(task => ({ ...task, matterId: matter.id }));

    set(state => ({ matters: [...state.matters, matter] }));
    return matter;
  },

  triggerTask: (matterId: string, taskId: string) => {
    const matter = get().matters.find(m => m.id === matterId);
    if (!matter) return { success: false, message: 'Matter not found' };

    const task = matter.tasks.find(t => t.id === taskId);
    if (!task) return { success: false, message: 'Task not found' };

    // Check required tasks
    for (const requiredType of task.requiredTasks) {
      const requiredTask = matter.tasks.find(t => t.type === requiredType);
      if (!requiredTask?.completed) {
        return { success: false, message: `${requiredType} must be completed first` };
      }
    }

    // Check time requirement
    if (task.timeRequirement) {
      const afterTask = matter.tasks.find(t => t.type === task.timeRequirement!.afterTask);
      if (afterTask) {
        const requiredDate = addWeeks(afterTask.completedAt || afterTask.createdAt, task.timeRequirement.weeks);
        if (!isAfter(new Date(), requiredDate)) {
          return { 
            success: false, 
            message: `${task.timeRequirement.weeks} weeks must pass after ${task.timeRequirement.afterTask}` 
          };
        }
      }
    }

    // All checks passed, complete the task
    set(state => ({
      matters: state.matters.map(m => m.id === matterId ? {
        ...m,
        tasks: m.tasks.map(t => t.id === taskId ? {
          ...t,
          completed: true,
          completedAt: new Date(),
        } : t),
      } : m),
    }));

    return { success: true, message: `Task ${task.type} complete.` };
  },
})); 