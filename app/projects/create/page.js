'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function CreateProjectPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '',
    location: '',
    totalRequired: '',
    collected: 0,
    beneficiaries: '',
    completion: '',
    daysLeft: '',
    status: 'Active',
    mainImage: '',
    photoGallery: [],
    youtubeIframe: '',
    overview: '',
    zakat_eligible: false,
    interest_earnings_eligible: false,
    projectManager: {
      name: '',
      email: '',
      phone: '',
    },
    donationOptions: [
      { type: 'General Donation', isEnabled: false },
      { type: 'Zakat', isEnabled: false },
      { type: 'Sadqa', isEnabled: false },
      { type: 'Interest Earnings', isEnabled: false },
    ],
    minDonationAmount: 365,
    donationFrequency: 'One Time',
  });

  const [uploadingMain, setUploadingMain] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState('');
  const [galleryPreviews, setGalleryPreviews] = useState([]);
  const [categories, setCategories] = useState([]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.startsWith('projectManager.')) {
      const field = name.split('.')[1];

      setForm((prev) => ({
        ...prev,
        projectManager: { ...prev.projectManager, [field]: value },
      }));
    } else if (name.startsWith('donationOptions.')) {
      const index = parseInt(name.split('.')[1]);
      const updated = [...form.donationOptions];
      updated[index].isEnabled = checked;

      setForm((prev) => ({
        ...prev, donationOptions: updated
      }));
    } else if (type === 'checkbox') {
      setForm((prev) => ({ ...prev, [name]: checked }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleImageUpload = async (e, isGallery = false) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    isGallery ? setUploadingGallery(true) : setUploadingMain(true);

    const uploadPromises = files.map(async (file) => {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      return data.url;
    });

    const urls = await Promise.all(uploadPromises);
    if (isGallery) {
      setForm((prev) => ({ ...prev, photoGallery: [...prev.photoGallery, ...urls] }));
      setGalleryPreviews((prev) => [...prev, ...urls]);
      setUploadingGallery(false);
    } else {
      setForm((prev) => ({ ...prev, mainImage: urls[0] }));
      setImagePreview(urls[0]);
      setUploadingMain(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const res = await fetch('/api/projects', {
      method: 'POST',
      body: JSON.stringify(form),
      headers: { 'Content-Type': 'application/json' },
    });
    setSubmitting(false);

    if (res.ok) {
      router.push('/projects');
    } else {
      alert('Error creating project');
    }
  };

  async function fetchCategories() {
    const res = await fetch('/api/categories')
    const data = await res.json()
    setCategories(data)
  }

  useEffect(() => {
    fetchCategories()
  }, []);

  return (
    <div className="min-h-full w-full bg-white p-6 rounded-2xl">
      <h1 className="text-2xl font-bold mb-6">Create New Project</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <input name="title" placeholder="Enter project title" onChange={handleChange} className="p-2.5 text-sm w-full border border-gray-300 rounded-xl" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea name="description" placeholder="Enter project description" onChange={handleChange} className="p-2.5 text-sm w-full border border-gray-300 rounded-xl" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <select
                name="category"
                onChange={handleChange}
                className="p-2.5 text-sm w-full border border-gray-300 rounded-xl appearance-none cursor-pointer"
              >
                {categories.map((cat, indx) => (
                  <option value={cat.name} key={indx}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Location</label>
              <input name="location" placeholder="Enter location" onChange={handleChange} className="p-2.5 text-sm w-full border border-gray-300 rounded-xl" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Total Required</label>
              <input name="totalRequired" type="number" placeholder="Enter required amount" onChange={handleChange} className="p-2.5 text-sm w-full border border-gray-300 rounded-xl" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Collected</label>
              <input name="collected" type="number" placeholder="Amount collected so far" onChange={handleChange} className="p-2.5 text-sm w-full border border-gray-300 rounded-xl" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Beneficiaries</label>
              <input name="beneficiaries" type="number" placeholder="No. of beneficiaries" onChange={handleChange} className="p-2.5 text-sm w-full border border-gray-300 rounded-xl" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Completion %</label>
              <input name="completion" type="number" placeholder="Completion percentage" onChange={handleChange} className="p-2.5 text-sm w-full border border-gray-300 rounded-xl" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Days Left</label>
              <input name="daysLeft" type="number" placeholder="Days left to complete" onChange={handleChange} className="p-2.5 text-sm w-full border border-gray-300 rounded-xl" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select name="status" value={form.status} onChange={handleChange} className="p-2.5 text-sm w-full border border-gray-300 rounded-xl">
                <option value="Active">Active</option>
                <option value="Completed">Completed</option>
                <option value="Upcoming">Upcoming</option>
                <option value="Draft">Draft</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">Main Image</label>
              <button
                type="button"
                onClick={() => document.getElementById('mainImageInput').click()}
                className="cursor-pointer bg-gray-100 px-4 py-2 rounded-xl border border-gray-300 text-sm"
              >
                {uploadingMain ? <Loader2 className="animate-spin w-4 h-4" /> : 'Upload Main Image'}
              </button>
              <input id="mainImageInput" type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e)} />
              {imagePreview && <img src={imagePreview} className="w-40 h-40 object-cover rounded-xl border border-gray-200" />}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">Photo Gallery</label>
              <button
                type="button"
                onClick={() => document.getElementById('galleryInput').click()}
                className="cursor-pointer bg-gray-100 px-4 py-2 rounded-xl border border-gray-300 text-sm"
              >
                {uploadingGallery ? <Loader2 className="animate-spin w-4 h-4" /> : 'Upload Gallery Images'}
              </button>
              <input id="galleryInput" type="file" multiple accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, true)} />
              <div className="flex flex-wrap gap-2">
                {galleryPreviews.map((url, i) => (
                  <img key={i} src={url} className="w-24 h-24 object-cover rounded-xl border border-gray-200" />
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">YouTube iframe embed</label>
              <input name="youtubeIframe" placeholder="Paste YouTube iframe embed here" onChange={handleChange} className="p-2.5 text-sm w-full border border-gray-300 rounded-xl" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Overview</label>
              <textarea name="overview" placeholder="Enter detailed overview" onChange={handleChange} className="p-2.5 text-sm w-full border border-gray-300 rounded-xl" />
            </div>
            <h2 className="font-semibold text-sm">Project Manager</h2>
            <input name="projectManager.name" placeholder="Manager name" onChange={handleChange} className="p-2.5 text-sm w-full border border-gray-300 rounded-xl" />
            <input name="projectManager.email" placeholder="Manager email" onChange={handleChange} className="p-2.5 text-sm w-full border border-gray-300 rounded-xl" />
            <input name="projectManager.phone" placeholder="Manager phone" onChange={handleChange} className="p-2.5 text-sm w-full border border-gray-300 rounded-xl" />

            <h2 className="font-semibold text-sm">Donation Options</h2>
            <div className="flex flex-wrap gap-4">
              {form.donationOptions.map((option, index) => (
                <label key={index} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    className="custom-checkbox"
                    name={`donationOptions.${index}`}
                    checked={option.isEnabled}
                    onChange={handleChange}
                  />
                  <span>{option.type}</span>
                </label>
              ))}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Minimum Donation Amount</label>
              <input name="minDonationAmount" type="number" placeholder="Enter minimum amount" onChange={handleChange} className="p-2.5 text-sm w-full border border-gray-300 rounded-xl" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Donation Frequency</label>
              <select name="donationFrequency" value={form.donationFrequency} onChange={handleChange} className="p-2.5 text-sm w-full border border-gray-300 rounded-xl">
                <option>One Time</option>
                <option>Monthly</option>
                <option>Yearly</option>
              </select>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={submitting}
                className="px-10 py-2 font-medium cursor-pointer bg-violet-600 hover:bg-violet-700 text-white text-base rounded-xl flex items-center gap-2"
              >
                {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                Create Project
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
