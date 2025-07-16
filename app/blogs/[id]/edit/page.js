// app/blogs/[id]/edit/page.js
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import axios from 'axios';

// use react-quill-new
const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });
import 'react-quill-new/dist/quill.snow.css';

export default function EditBlogPage() {
  const params = useParams();
  const router = useRouter();
  const blogId = params.id;

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [youtubeUrl, setYoutubeUrl] = useState('');

  useEffect(() => {
    async function fetchBlog() {
      const res = await axios.get(`/api/blogs/${blogId}`);
      const blog = res.data;
      setTitle(blog.title);
      setContent(blog.content);
      setImage(blog.imageUrl);
      setYoutubeUrl(blog.youtubeUrl || '');
    }
    fetchBlog();
  }, [blogId]);

  async function handleImageUpload(e) {
    const file = e.target.files[0];
    const data = new FormData();
    data.append('file', file);
    data.append('upload_preset', '<your-cloudinary-preset>');

    const res = await fetch('https://api.cloudinary.com/v1_1/<your-cloud-name>/image/upload', {
      method: 'POST',
      body: data,
    });
    const uploaded = await res.json();
    setImage(uploaded.secure_url);
  }

  async function handleSave() {
    await axios.put(`/api/blogs/${blogId}`, {
      title,
      content,
      imageUrl: image,
      youtubeUrl,
    });
    alert('Blog updated!');
    router.push('/blogs');
  }

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Edit Blog</h1>
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
        onClick={handleSave}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Save Changes
      </button>
    </div>
  );
}
