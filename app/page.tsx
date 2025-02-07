'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { Matter, Task, TaskType, TASKS } from './types';
import { Task as TaskComponent } from './components/Task';

export default function Home() {
  const [matters, setMatters] = useState<Matter[]>([]);
  const [title, setTitle] = useState('');

  const createMatter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const now = new Date();
    setMatters(prev => [...prev, {
      id: Date.now(),
      title: title.trim(),
      createdAt: now,
      tasks: Object.entries(TASKS).reduce((acc, [type, config]) => ({
        ...acc,
        [type]: {
          ...config,
          completed: false,
          createdAt: now,
        }
      }), {} as Record<TaskType, Task>)
    }]);
    setTitle('');
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <h1 className="text-xl font-medium mb-6">Legal Matter Task Manager</h1>
      
      <form onSubmit={createMatter} className="mb-6 flex gap-2">
        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Matter title..."
          className="flex-1 px-3 py-1.5 border rounded-md text-sm"
        />
        <button className="px-4 py-1.5 bg-white border text-gray-700 rounded-md text-sm hover:bg-gray-50 transition-colors">
          Create Matter
        </button>
      </form>

      {[...matters].reverse().map(matter => (
        <div key={matter.id} className="mb-4 border rounded-md p-4 bg-white shadow-sm">
          <div className="mb-3">
            <h2 className="text-lg font-medium">{matter.title}</h2>
            <p className="text-xs text-gray-500">
              Created on {format(matter.createdAt, 'MMM d, yyyy')}
            </p>
          </div>
          
          {(Object.entries(matter.tasks) as [TaskType, Task][]).map(([type, task]) => (
            <TaskComponent
              key={type}
              type={type}
              task={task}
              matter={matter}
              onComplete={() => {
                setMatters(prev => prev.map(m => 
                  m.id === matter.id ? {
                    ...m,
                    tasks: {
                      ...m.tasks,
                      [type]: { ...task, completed: true, completedAt: new Date() }
                    }
                  } : m
                ));
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
