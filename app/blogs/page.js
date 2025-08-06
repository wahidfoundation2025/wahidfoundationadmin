'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { Plus, Trash2 } from 'lucide-react';
import { TbEdit } from 'react-icons/tb';

export default function BlogListPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true); // ✅ New loading state

  useEffect(() => {
    async function fetchBlogs() {
      try {
        const res = await axios.get('/api/blogs');
        setBlogs(res.data);
      } catch (error) {
        console.error('Error fetching blogs:', error);
      } finally {
        setLoading(false); // ✅ Stop loading once data is fetched
      }
    }
    fetchBlogs();
  }, []);

  async function handleDelete(id) {
    if (!confirm('Are you sure you want to delete this blog?')) return;
    await axios.delete(`/api/blogs/${id}`);
    setBlogs(prev => prev.filter(b => b._id !== id));
  }

  return (
    <div className="bg-white p-4 sm:p-6 sm:rounded-2xl min-h-full w-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl sm:text-2xl font-bold">All Blogs</h1>

        <Link href="/blogeditor">
          <button
            className="flex flex-row text-sm sm:text-base gap-2 items-center font-medium btn btn-primary border bg-violet-600 hover:bg-violet-700 px-4 sm:px-6 py-2 cursor-pointer text-white transition rounded-xl"
          >
            <Plus size={16} /> Create New
          </button>
        </Link>
      </div>

      {/* ✅ Show Loading Indicator */}
      {loading ? (
        <div className="text-center py-10 text-gray-500">Loading...</div>
      ) : (
        <div className="grid md:grid-cols-3 grid-cols-1 gap-4">
          {blogs.map(blog => (
            <div key={blog._id} className="border-2 border-violet-300 bg-violet-50 p-4 rounded-xl gap-4">
              <div className="flex gap-3">
                {blog.imageUrl && (
                  <img src={blog.imageUrl} alt="" className="w-20 h-20 object-cover rounded-full" />
                )}

                <div>
                  <h2 className="text-xl font-semibold">{blog.title}</h2>
                  <p className="text-gray-500 text-sm mt-2">{new Date(blog.createdAt).toLocaleString()}</p>
                </div>
              </div>

              <div className="mt-2 flex justify-end gap-4">
                <Link href={`/blogs/${blog._id}/edit`}>
                  <button
                    className="text-violet-600 hover:bg-violet-200 rounded-3xl p-2 cursor-pointer transition"
                    title="Edit"
                  >
                    <TbEdit size={20} />
                  </button>
                </Link>

                <button
                  onClick={() => handleDelete(blog._id)}
                  className="text-red-600 hover:bg-red-200 rounded-3xl p-2 cursor-pointer transition"
                  title="Delete"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}

          {!blogs.length && (
            <div className="text-center py-10 text-gray-400">No blogs found.</div>
          )}
        </div>
      )}
    </div>
  );
}
