import { Matter as MatterType } from '../types';
import { Task } from './Task';
import { format } from 'date-fns';

interface MatterProps {
  matter: MatterType;
}

export function Matter({ matter }: MatterProps) {
  return (
    <div className="border rounded-lg p-6 mb-6 bg-gray-50">
      <div className="mb-4">
        <h2 className="text-2xl font-bold mb-2">{matter.title}</h2>
        <p className="text-sm text-gray-600">
          Created on {format(matter.createdAt, 'MMM d, yyyy')}
        </p>
      </div>
      
      <div className="space-y-4">
        {matter.tasks.map(task => (
          <Task key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
} 