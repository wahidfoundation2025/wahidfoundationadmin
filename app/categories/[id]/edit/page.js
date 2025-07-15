'use client'
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function EditCategoryPage() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    async function fetchData() {
      const res = await fetch(`/api/categories/${params.id}`);
      const data = await res.json();
      setName(data.name);
      setDescription(data.description || '');
    }
    fetchData();
  }, [params.id]);

  async function handleSubmit(e) {
    e.preventDefault();
    await fetch(`/api/categories/${params.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, description })
    });
    router.push('/categories');
  }

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Edit Category</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          className="border p-2 w-full rounded"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
        <textarea
          className="border p-2 w-full rounded"
          value={description}
          onChange={e => setDescription(e.target.value)}
        />
        <button className="bg-yellow-600 text-white px-4 py-2 rounded" type="submit">
          Update
        </button>
      </form>
    </div>
  );
}
