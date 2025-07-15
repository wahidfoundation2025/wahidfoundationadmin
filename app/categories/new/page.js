'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AddCategoryPage() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    await fetch('/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, description })
    });
    router.push('/categories');
  }

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Add Category</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Name"
          className="border p-2 w-full rounded"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
        <textarea
          placeholder="Description"
          className="border p-2 w-full rounded"
          value={description}
          onChange={e => setDescription(e.target.value)}
        />
        <button className="bg-green-600 text-white px-4 py-2 rounded" type="submit">
          Save
        </button>
      </form>
    </div>
  );
}
