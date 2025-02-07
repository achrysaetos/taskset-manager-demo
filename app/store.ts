import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { addWeeks, isAfter } from 'date-fns';
import { Matter, Task, TaskType, TASK_DEFINITIONS } from './types';

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
      tasks: TASK_DEFINITIONS.map(def => ({
        id: uuidv4(),
        type: def.type,
        matterId: '',  // Will be set after matter creation
        completed: false,
        createdAt: new Date(),
        dependencies: [],
      })),
    };

    // Set matter ID for all tasks
    matter.tasks = matter.tasks.map(task => ({
      ...task,
      matterId: matter.id,
    }));

    // Set up dependencies for each task
    matter.tasks = matter.tasks.map(task => {
      const def = TASK_DEFINITIONS.find(d => d.type === task.type);
      if (!def) return task;

      const dependencies = [];

      // Add task dependencies
      if (def.dependencies.tasks) {
        for (const depType of def.dependencies.tasks) {
          const depTask = matter.tasks.find(t => t.type === depType);
          if (depTask) {
            dependencies.push({
              type: 'task',
              taskId: depTask.id,
            });
          }
        }
      }

      // Add time dependencies
      if (def.dependencies.timeRequirements) {
        for (const timeReq of def.dependencies.timeRequirements) {
          const depTask = matter.tasks.find(t => t.type === timeReq.taskType);
          if (depTask) {
            dependencies.push({
              type: 'time',
              taskId: depTask.id,
              weeksRequired: timeReq.weeks,
            });
          }
        }
      }

      return {
        ...task,
        dependencies,
      };
    });

    set(state => ({
      matters: [...state.matters, matter],
    }));

    return matter;
  },

  triggerTask: (matterId: string, taskId: string) => {
    const matter = get().matters.find(m => m.id === matterId);
    if (!matter) {
      return { success: false, message: 'Matter not found' };
    }

    const task = matter.tasks.find(t => t.id === taskId);
    if (!task) {
      return { success: false, message: 'Task not found' };
    }

    // Check all dependencies
    for (const dep of task.dependencies) {
      const depTask = matter.tasks.find(t => t.id === dep.taskId);
      if (!depTask) continue;

      if (dep.type === 'task') {
        if (!depTask.completed) {
          return { 
            success: false, 
            message: `Task ${depTask.type} must be completed first` 
          };
        }
      } else if (dep.type === 'time') {
        const requiredDate = addWeeks(depTask.completedAt || depTask.createdAt, dep.weeksRequired);
        if (!isAfter(new Date(), requiredDate)) {
          return { 
            success: false, 
            message: `${dep.weeksRequired} weeks must pass after ${depTask.type}` 
          };
        }
      }
    }

    // All dependencies satisfied, mark task as complete
    set(state => ({
      matters: state.matters.map(m => {
        if (m.id !== matterId) return m;
        return {
          ...m,
          tasks: m.tasks.map(t => {
            if (t.id !== taskId) return t;
            return {
              ...t,
              completed: true,
              completedAt: new Date(),
            };
          }),
        };
      }),
    }));

    return { success: true, message: `Task ${task.type} complete.` };
  },
})); 