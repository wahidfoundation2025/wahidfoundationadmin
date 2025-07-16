// app/blogs/page.js
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';

export default function BlogListPage() {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    async function fetchBlogs() {
      const res = await axios.get('/api/blogs');
      setBlogs(res.data);
    }
    fetchBlogs();
  }, []);

  async function handleDelete(id) {
    if (!confirm('Are you sure you want to delete this blog?')) return;
    await axios.delete(`/api/blogs/${id}`);
    setBlogs(prev => prev.filter(b => b._id !== id));
  }

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">All Blogs</h1>
      <Link href="/blogeditor" className="bg-green-600 text-white px-4 py-2 rounded">
        + Create New Blog
      </Link>
      <div className="mt-6 space-y-4">
        {blogs.map(blog => (
          <div key={blog._id} className="border p-4 rounded shadow-sm flex gap-4">
            {blog.imageUrl && (
              <img src={blog.imageUrl} alt="" className="w-32 h-20 object-cover rounded" />
            )}
            <div className="flex-1">
              <h2 className="text-xl font-semibold">{blog.title}</h2>
              <p className="text-gray-600 text-sm">{new Date(blog.createdAt).toLocaleString()}</p>
              <div className="mt-2 flex gap-2">
                <Link
                  href={`/blogs/${blog._id}/edit`}
                  className="text-blue-600 hover:underline"
                >
                  ✏️ Edit
                </Link>
                <button
                  onClick={() => handleDelete(blog._id)}
                  className="text-red-600 hover:underline"
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          </div>
        ))}
        {blogs.length === 0 && <p>No blogs found.</p>}
      </div>
    </div>
  );
}
