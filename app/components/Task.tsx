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
    <div className="border p-4 mb-2 rounded bg-white">
      <div className="flex justify-between mb-2">
        <span className="font-medium">{type}</span>
        <span className={task.completed ? "text-green-600" : "text-gray-500"}>
          {task.completed ? "Completed" : "Pending"}
        </span>
      </div>
      {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
      <button
        onClick={handleClick}
        disabled={task.completed}
        className={`px-4 py-1 rounded text-sm ${
          task.completed 
            ? "bg-gray-100 text-gray-400" 
            : "bg-blue-500 text-white"
        }`}
      >
        Complete
      </button>
    </div>
  );
} 