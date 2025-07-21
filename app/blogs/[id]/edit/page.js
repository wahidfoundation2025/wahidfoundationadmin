// app/blogs/[id]/edit/page.js
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import axios from 'axios';

// rich text editor
const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });
import 'react-quill-new/dist/quill.snow.css';
import { IoIosCloseCircle } from 'react-icons/io';

export default function EditBlogPage() {
  const params = useParams();
  const router = useRouter();
  const blogId = params.id;

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [youtubeUrl, setYoutubeUrl] = useState('');

  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  useEffect(() => {
    async function fetchBlog() {
      const res = await axios.get(`/api/blogs/${blogId}`);
      const blog = res.data;
      setTitle(blog.title);
      setContent(blog.content);
      setImage(blog.imageUrl);
      setYoutubeUrl(blog.youtubeUrl || '');
      setSelectedCategories(blog.categories ?? [])
    }
    fetchBlog();
  }, [blogId]);

  // ✅ handle image upload (same as CreateBlogPage)
  async function handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    const data = new FormData();
    data.append('file', file);

    try {
      // call your /api/upload route (which uploads to Cloudinary)
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: data,
      });

      if (!res.ok) {
        const errorData = await res.json();
        alert(errorData.error || 'Upload failed');
        return;
      }

      const uploaded = await res.json();
      setImage(uploaded.url); // ✅ update preview
    } catch (err) {
      console.error('Upload failed', err);
      alert('Upload failed');
    }
  }

  // ✅ save blog
  async function handleSave() {
    await axios.put(`/api/blogs/${blogId}`, {
      title,
      content,
      imageUrl: image,
      youtubeUrl,
      categories: selectedCategories
    });
    alert('Blog updated!');
    router.push('/blogs');
  }

  async function fetchCategories() {
    const res = await fetch('/api/categories')
    const data = await res.json()
    setCategories(data)
  }

  useEffect(() => {
    fetchCategories()
  }, []);

  return (
    <div className="bg-white p-6 min-h-full rounded-2xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Edit Blog</h1>

        <button
          onClick={handleSave}
          className="font-medium border bg-violet-600 hover:bg-violet-700 px-6 py-2 text-white rounded-xl transition"
        >
          Save Changes
        </button>
      </div>

      {/* Title + YouTube Row */}
      <div className="flex flex-row gap-3 mb-6">
        <div className="flex-1">
          <label className="font-medium block mb-1">Heading</label>
          <input
            className="border p-2 w-full rounded-xl border-gray-300"
            placeholder="Title"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
        </div>

        <div className="flex-1">
          <label className="font-medium block mb-1">YouTube Link</label>
          <input
            className="border p-2 w-full rounded-xl border-gray-300"
            placeholder="YouTube URL"
            value={youtubeUrl}
            onChange={e => setYoutubeUrl(e.target.value)}
          />
        </div>
      </div>

      <div className='mb-6 w-1/2'>
        <label className="block text-sm font-medium mb-1">Category</label>
        <select
          name="category"
          onChange={(e) => {
            const selected = Array.from(e.target.selectedOptions).map(opt => opt.value);
            setSelectedCategories(prev => ([...new Set([...prev, ...selected])]));
          }}
          className="p-2.5 text-sm w-full border border-gray-300 rounded-xl appearance-none cursor-pointer"
        >
          {categories.map((cat, indx) => (
            <option value={cat.name} key={indx}>{cat.name}</option>
          ))}
        </select>

        {selectedCategories.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {selectedCategories.map((cat) => (
              <span
                key={cat}
                className="bg-violet-100 border border-violet-300 py-1 pl-3 pr-2 rounded-full text-sm flex items-center gap-2"
              >
                {cat}
                <button
                  type="button"
                  className="cursor-pointer hover:text-red-500 transition-colors"
                  onClick={() =>
                    setSelectedCategories(prev => (prev.filter(c => c !== cat)))
                  }
                >
                  <IoIosCloseCircle size={18} />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      <div className='flex flex-col gap-2 mb-6'>
        <label className='font-medium block mb-1'>Profile Photo</label>

        {image && (
          <img
            src={image}
            alt="preview"
            className="mb-6 h-40 w-40 rounded-full border-2 border-gray-300 object-cover"
          />
        )}

        <input
          type="file"
          onChange={handleImageUpload}
          className="block w-full text-sm text-gray-700
            file:mr-4 file:py-2 file:px-4
            file:rounded-lg file:border-0
            file:text-sm file:font-semibold
            file:bg-violet-100 file:text-violet-700
            hover:file:bg-violet-200 transition-all cursor-pointer"
        />
      </div>

      {/* Content Editor */}
      <ReactQuill
        value={content}
        onChange={setContent}
        className="mb-4 bg-white"
        modules={{
          toolbar: [
            [{ header: [1, 2, 3, false] }],
            ['bold', 'italic', 'underline'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            ['link', 'image'],
            ['clean'],
          ],
        }}
      />
    </div>
  );
}
