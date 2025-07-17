'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import axios from 'axios';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });
import 'react-quill-new/dist/quill.snow.css';
import { useRouter } from 'next/navigation';

export default function CreateBlogPage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState(''); // HTML
  const [image, setImage] = useState(null);
  const [youtubeUrl, setYoutubeUrl] = useState('');

  const router = useRouter();

  async function handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    const data = new FormData();
    data.append('file', file);

    // 👇 Call your Next.js API route
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
    setImage(uploaded.url);
  }

  async function handleSubmit() {
    try {
      await axios.post('/api/blogs', { title, content, imageUrl: image, youtubeUrl });

      alert('Blog saved!');
      router.push('/blogs');
    } catch (error) {
      alert("Couldn't Save Blog!");
    }
  }

  return (
    <div className="bg-white p-6 min-h-full rounded-2xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Create Blog</h1>

        <button
          onClick={handleSubmit}
          className="font-medium btn btn-primary border bg-violet-600 hover:bg-violet-700 px-6 py-2 cursor-pointer text-white transition rounded-xl"
        >
          Save Blog
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

      {/* Image Upload */}
      <div className="flex flex-col gap-2 mb-6">
        <label className="font-medium block mb-1">Profile Photo</label>

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

      {/* Blog Content */}
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
