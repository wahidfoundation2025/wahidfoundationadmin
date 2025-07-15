'use client'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const router = useRouter();

  async function fetchCategories() {
    const res = await fetch('/api/categories');
    const data = await res.json();
    setCategories(data);
  }

  async function handleDelete(id) {
    if (!confirm('Delete this category?')) return;
    await fetch(`/api/categories/${id}`, { method: 'DELETE' });
    fetchCategories();
  }

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Categories</h1>
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded"
        onClick={() => router.push('/categories/new')}
      >
        Add Category
      </button>
      <ul className="mt-6 space-y-3">
        {categories.map(cat => (
          <li key={cat._id} className="flex justify-between items-center border p-3 rounded">
            <div>
              <h2 className="font-semibold">{cat.name}</h2>
              <p className="text-sm text-gray-500">{cat.description}</p>
            </div>
            <div className="space-x-2">
              <button
                className="bg-yellow-500 text-white px-3 py-1 rounded"
                onClick={() => router.push(`/categories/${cat._id}/edit`)}
              >
                Edit
              </button>
              <button
                className="bg-red-600 text-white px-3 py-1 rounded"
                onClick={() => handleDelete(cat._id)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
