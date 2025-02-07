import { useState } from 'react';
import { addWeeks, isAfter } from 'date-fns';
import { Task as TaskType, Matter, TaskType as TaskName } from '../types';

interface TaskProps {
  type: TaskName;
  task: TaskType;
  matter: Matter;
  onComplete: () => void;
}

export function Task({ type, task, matter, onComplete }: TaskProps) {
  const [error, setError] = useState<string>();

  const handleClick = () => {
    // Check required tasks
    for (const req of task.requires) {
      if (!matter.tasks[req].completed) {
        setError(`${req} must be completed first`);
        return;
      }
    }

    // Check time requirement
    if (task.waitWeeks) {
      const afterTask = matter.tasks[task.waitWeeks.after];
      const requiredDate = addWeeks(afterTask.completedAt || afterTask.createdAt, task.waitWeeks.weeks);
      if (!isAfter(new Date(), requiredDate)) {
        setError(`${task.waitWeeks.weeks} weeks must pass after ${task.waitWeeks.after}`);
        return;
      }
    }

    onComplete();
    setError(undefined);
  };

  return (
    <div className="border-b last:border-b-0 py-3">
      <div className="flex justify-between items-center">
        <div>
          <span className="text-sm font-medium">{type}</span>
          <span className={`ml-2 text-xs ${task.completed ? "text-green-600" : "text-gray-400"}`}>
            {task.completed ? "Completed" : "Pending"}
          </span>
          {error && <div className="text-red-500 text-xs mt-1">{error}</div>}
        </div>
        <button
          onClick={handleClick}
          disabled={task.completed}
          className={`px-3 py-1 rounded-md text-xs transition-colors ${
            task.completed 
              ? "bg-gray-100 text-gray-400 cursor-default border border-gray-200" 
              : "bg-white border text-gray-700 hover:bg-gray-50"
          }`}
        >
          Complete
        </button>
      </div>
    </div>
  );
} 