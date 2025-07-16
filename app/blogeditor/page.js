'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import axios from 'axios';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });
import 'react-quill-new/dist/quill.snow.css';

export default function CreateBlogPage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState(''); // HTML
  const [image, setImage] = useState(null);
  const [youtubeUrl, setYoutubeUrl] = useState('');

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
    await axios.post('/api/blogs', { title, content, imageUrl: image, youtubeUrl });
    alert('Blog saved!');
  }

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Create Blog</h1>
      <input
        className="border p-2 w-full mb-4"
        placeholder="Title"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />

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

      <input type="file" onChange={handleImageUpload} className="mb-4" />
      {image && <img src={image} alt="preview" className="mb-4 max-h-60" />}

      <input
        className="border p-2 w-full mb-4"
        placeholder="YouTube URL"
        value={youtubeUrl}
        onChange={e => setYoutubeUrl(e.target.value)}
      />

      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Save Blog
      </button>
    </div>
  );
}
