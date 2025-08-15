'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { IoIosCloseCircle } from 'react-icons/io';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });
import 'react-quill-new/dist/quill.snow.css';

export default function CreateBlogPage() {
  const [form, setForm] = useState({
    title: '',
    content: '',
    imageUrl: '',
    imageAlt: '',
    youtubeUrl: '',
    category: [],
    authorName: '',
    metaTitle: '',
    metaDescription: '',
    targetKeywords: [],
    ogTitle: '',
    ogDescription: '',
    ogImage: '',
    schemaMarkup: '',
  });
  const [categories, setCategories] = useState([]);
  const [keywordInput, setKeywordInput] = useState('');

  const router = useRouter();

  async function handleImageUpload(e, field) {
    const file = e.target.files[0];
    if (!file) return;

    const data = new FormData();
    data.append('file', file);

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
    setForm((prev) => ({ ...prev, [field]: uploaded.url }));
  }

  async function handleSubmit() {
    console.log('Submitting form:', form);
    try {
      await axios.post('/api/blogs', {
...form,
  categories: form.category,
  imageUrl: form.imageUrl,
  schemaMarkup: form.schemaMarkup ? JSON.parse(form.schemaMarkup) : undefined,
      });

      alert('Blog saved!');
      router.push('/blogs');
    } catch (error) {
      alert("Couldn't Save Blog!",error);
    }
  }

  async function fetchCategories() {
    const res = await fetch('/api/categories');
    const data = await res.json();
    setCategories(data);
  }

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddKeyword = () => {
    if (keywordInput.trim() && !form.targetKeywords.includes(keywordInput.trim())) {
      setForm((prev) => ({
        ...prev,
        targetKeywords: [...prev.targetKeywords, keywordInput.trim()],
      }));
      setKeywordInput('');
    }
  };

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
            value={form.title}
            onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
          />
        </div>
        <div className="flex-1">
          <label className="font-medium block mb-1">YouTube Link</label>
          <input
            className="border p-2 w-full rounded-xl border-gray-300"
            placeholder="YouTube URL"
            value={form.youtubeUrl}
            onChange={(e) => setForm((prev) => ({ ...prev, youtubeUrl: e.target.value }))}
          />
        </div>
      </div>

      {/* Author Name */}
      <div className="mb-6">
        <label className="font-medium block mb-1">Author Name</label>
        <input
          className="border p-2 w-full rounded-xl border-gray-300"
          placeholder="Author Name"
          value={form.authorName}
          onChange={(e) => setForm((prev) => ({ ...prev, authorName: e.target.value }))}
        />
      </div>

      {/* Category */}
      <div className="mb-6 w-1/2">
        <label className="block text-sm font-medium mb-1">Category</label>
        <select
          name="category"
          multiple
          value={form.category}
          onChange={(e) => {
            const selected = Array.from(e.target.selectedOptions).map(
              (opt) => opt.value
            );
            setForm((prev) => ({
              ...prev,
              category: Array.from(new Set([...prev.category, ...selected])),
            }));
          }}
          className="p-2.5 text-sm w-full border border-gray-300 rounded-xl appearance-none cursor-pointer"
        >
          <option value="" disabled>
            Choose category
          </option>
          {categories.map((cat, idx) => (
            <option value={cat.name} key={idx}>
              {cat.name}
            </option>
          ))}
        </select>
        {form.category.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {form.category.map((cat) => (
              <span
                key={cat}
                className="bg-violet-100 border border-violet-300 py-1 pl-3 pr-2 rounded-full text-sm flex items-center gap-2"
              >
                {cat}
                <button
                  type="button"
                  className="cursor-pointer hover:text-red-500 transition-colors"
                  onClick={() =>
                    setForm((prev) => ({
                      ...prev,
                      category: prev.category.filter((c) => c !== cat),
                    }))
                  }
                >
                  <IoIosCloseCircle size={18} />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Image Upload + Image Alt */}
      <div className="flex flex-col gap-2 mb-6">
        <label className="font-medium block mb-1">Featured Image</label>
        {form.imageUrl && (
          <img
            src={form.imageUrl}
            alt="preview"
            className="mb-6 h-40 w-40 rounded-full border-2 border-gray-300 object-cover"
          />
        )}
        <input
          type="file"
          onChange={(e) => handleImageUpload(e, 'imageUrl')}
          className="block w-full text-sm text-gray-700
            file:mr-4 file:py-2 file:px-4
            file:rounded-lg file:border-0
            file:text-sm file:font-semibold
            file:bg-violet-100 file:text-violet-700
            hover:file:bg-violet-200 transition-all cursor-pointer"
        />
        <label className="font-medium block mb-1">Image Alt Text</label>
        <input
          className="border p-2 w-full rounded-xl border-gray-300"
          placeholder="Image Alt Text"
          value={form.imageAlt}
          onChange={(e) => setForm((prev) => ({ ...prev, imageAlt: e.target.value }))}
        />
      </div>

      {/* SEO Fields */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-3">SEO Settings</h2>
        <div className="flex flex-col gap-3">
          <div>
            <label className="font-medium block mb-1">Meta Title</label>
            <input
              className="border p-2 w-full rounded-xl border-gray-300"
              placeholder="Meta Title"
              value={form.metaTitle}
              onChange={(e) => setForm((prev) => ({ ...prev, metaTitle: e.target.value }))}
            />
          </div>
          <div>
            <label className="font-medium block mb-1">Meta Description</label>
            <textarea
              className="border p-2 w-full rounded-xl border-gray-300"
              placeholder="Meta Description"
              value={form.metaDescription}
              onChange={(e) => setForm((prev) => ({ ...prev, metaDescription: e.target.value }))}
              rows={4}
            />
          </div>
          <div>
            <label className="font-medium block mb-1">Target Keywords</label>
            <div className="flex gap-2">
              <input
                className="border p-2 w-full rounded-xl border-gray-300"
                placeholder="Add a keyword"
                value={keywordInput}
                onChange={(e) => setKeywordInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddKeyword();
                  }
                }}
              />
              <button
                type="button"
                className="font-medium border bg-violet-600 hover:bg-violet-700 px-4 py-2 text-white transition rounded-xl"
                onClick={handleAddKeyword}
              >
                Add
              </button>
            </div>
            {form.targetKeywords.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {form.targetKeywords.map((keyword) => (
                  <span
                    key={keyword}
                    className="bg-violet-100 border border-violet-300 py-1 pl-3 pr-2 rounded-full text-sm flex items-center gap-2"
                  >
                    {keyword}
                    <button
                      type="button"
                      className="cursor-pointer hover:text-red-500 transition-colors"
                      onClick={() =>
                        setForm((prev) => ({
                          ...prev,
                          targetKeywords: prev.targetKeywords.filter((k) => k !== keyword),
                        }))
                      }
                    >
                      <IoIosCloseCircle size={18} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Open Graph Fields */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-3">Open Graph Settings</h2>
        <div className="flex flex-col gap-3">
          <div>
            <label className="font-medium block mb-1">OG Title</label>
            <input
              className="border p-2 w-full rounded-xl border-gray-300"
              placeholder="OG Title"
              value={form.ogTitle}
              onChange={(e) => setForm((prev) => ({ ...prev, ogTitle: e.target.value }))}
            />
          </div>
          <div>
            <label className="font-medium block mb-1">OG Description</label>
            <textarea
              className="border p-2 w-full rounded-xl border-gray-300"
              placeholder="OG Description"
              value={form.ogDescription}
              onChange={(e) => setForm((prev) => ({ ...prev, ogDescription: e.target.value }))}
              rows={4}
            />
          </div>
          <div>
            <label className="font-medium block mb-1">OG Image</label>
            {form.ogImage && (
              <img
                src={form.ogImage}
                alt="OG image preview"
                className="mb-6 h-40 w-40 rounded-full border-2 border-gray-300 object-cover"
              />
            )}
            <input
              type="file"
              onChange={(e) => handleImageUpload(e, 'ogImage')}
              className="block w-full text-sm text-gray-700
                file:mr-4 file:py-2 file:px-4
                file:rounded-lg file:border-0
                file:text-sm file:font-semibold
                file:bg-violet-100 file:text-violet-700
                hover:file:bg-violet-200 transition-all cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Schema Markup */}
      <div className="mb-6">
        <label className="font-medium block mb-1">Schema Markup (JSON-LD)</label>
        <textarea
          className="border p-2 w-full rounded-xl border-gray-300 font-mono"
          placeholder='{"@context": "https://schema.org", "@type": "BlogPosting", ...}'
          value={form.schemaMarkup}
          onChange={(e) => setForm((prev) => ({ ...prev, schemaMarkup: e.target.value }))}
          rows={6}
        />
      </div>

      {/* Blog Content */}
      <div className="mb-6">
        <label className="font-medium block mb-1">Blog Content</label>
        <ReactQuill
          value={form.content}
          onChange={(value) => setForm((prev) => ({ ...prev, content: value }))}
          className="bg-white"
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
    </div>
  );
}