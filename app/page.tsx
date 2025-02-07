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
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-8">Legal Matter Task Manager</h1>
      
      <form onSubmit={createMatter} className="mb-8 flex gap-4">
        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Matter title..."
          className="flex-1 px-4 py-2 border rounded"
        />
        <button className="px-6 py-2 bg-blue-500 text-white rounded">
          Create Matter
        </button>
      </form>

      {matters.map(matter => (
        <div key={matter.id} className="mb-8 border rounded-lg p-6 bg-gray-50">
          <div className="mb-4">
            <h2 className="text-xl font-bold">{matter.title}</h2>
            <p className="text-sm text-gray-600">
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
