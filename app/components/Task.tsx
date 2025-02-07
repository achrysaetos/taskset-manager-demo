import { Task as TaskType } from '../types';
import { useStore } from '../store';
import { useState } from 'react';

interface TaskProps {
  task: TaskType;
}

export function Task({ task }: TaskProps) {
  const [message, setMessage] = useState<string | null>(null);
  const triggerTask = useStore(state => state.triggerTask);

  const handleTrigger = () => {
    const result = triggerTask(task.matterId, task.id);
    setMessage(result.message);
    if (result.success) {
      setTimeout(() => setMessage(null), 3000);
    }
  };

  return (
    <div className="border rounded-lg p-4 mb-4 bg-white shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold">{task.type}</h3>
        <span className={`px-2 py-1 rounded text-sm ${
          task.completed 
            ? 'bg-green-100 text-green-800' 
            : 'bg-gray-100 text-gray-800'
        }`}>
          {task.completed ? 'Completed' : 'Pending'}
        </span>
      </div>
      
      {message && (
        <div className={`text-sm mb-2 ${
          task.completed ? 'text-green-600' : 'text-red-600'
        }`}>
          {message}
        </div>
      )}

      <button
        onClick={handleTrigger}
        disabled={task.completed}
        className={`mt-2 px-4 py-2 rounded-md text-sm ${
          task.completed
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-blue-500 text-white hover:bg-blue-600'
        }`}
      >
        {task.completed ? 'Task Complete' : 'Trigger Task'}
      </button>
    </div>
  );
} 