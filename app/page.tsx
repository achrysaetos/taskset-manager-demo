'use client';

import { useState } from 'react';
import { useStore } from './store';
import { Matter } from './components/Matter';

export default function Home() {
  const [newMatterTitle, setNewMatterTitle] = useState('');
  const { matters, createMatter } = useStore();

  const handleCreateMatter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMatterTitle.trim()) return;
    
    createMatter(newMatterTitle.trim());
    setNewMatterTitle('');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-4xl mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8">Legal Matter Task Manager</h1>
        
        <div className="bg-white rounded-lg p-6 mb-8 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Create New Matter</h2>
          <form onSubmit={handleCreateMatter} className="flex gap-4">
            <input
              type="text"
              value={newMatterTitle}
              onChange={(e) => setNewMatterTitle(e.target.value)}
              placeholder="Enter matter title..."
              className="flex-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Create Matter
            </button>
          </form>
        </div>

        <div className="space-y-6">
          {matters.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              No matters yet. Create one to get started!
            </p>
          ) : (
            matters.map(matter => (
              <Matter key={matter.id} matter={matter} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
