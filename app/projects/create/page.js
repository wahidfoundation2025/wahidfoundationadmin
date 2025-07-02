'use client'

import { useState } from 'react';
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
      setForm((prev) => ({ ...prev, donationOptions: updated }));
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

  return (
    <div className="w-full px-4 py-6">
      <h1 className="text-3xl font-bold mb-6">Create New Project</h1>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <input name="title" placeholder="Title" onChange={handleChange} className="w-full p-2 border rounded" required />
          <textarea name="description" placeholder="Description" onChange={handleChange} className="w-full p-2 border rounded" required />
          <input name="category" placeholder="Category" onChange={handleChange} className="w-full p-2 border rounded" />
          <input name="location" placeholder="Location" onChange={handleChange} className="w-full p-2 border rounded" />
          <input name="totalRequired" type="number" placeholder="Total Required" onChange={handleChange} className="w-full p-2 border rounded" />
          <input name="collected" type="number" placeholder="Collected" onChange={handleChange} className="w-full p-2 border rounded" />
          <input name="beneficiaries" type="number" placeholder="Beneficiaries" onChange={handleChange} className="w-full p-2 border rounded" />
          <input name="completion" type="number" placeholder="Completion %" onChange={handleChange} className="w-full p-2 border rounded" />
          <input name="daysLeft" type="number" placeholder="Days Left" onChange={handleChange} className="w-full p-2 border rounded" />
          <select name="status" value={form.status} onChange={handleChange} className="w-full p-2 border rounded">
            <option value="Active">Active</option>
            <option value="Completed">Completed</option>
            <option value="Upcoming">Upcoming</option>
          </select>

          <div className="space-y-2">
            <label>Main Image</label>
            <button
              type="button"
              onClick={() => document.getElementById('mainImageInput').click()}
              className="bg-gray-200 px-4 py-1 rounded"
            >
              {uploadingMain ? <Loader2 className="animate-spin" /> : 'Upload Main Image'}
            </button>
            <input id="mainImageInput" type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e)} />
            {imagePreview && <img src={imagePreview} className="w-40 h-40 object-cover rounded" />}
          </div>

          <div className="space-y-2">
            <label>Photo Gallery</label>
            <button
              type="button"
              onClick={() => document.getElementById('galleryInput').click()}
              className="bg-gray-200 px-4 py-1 rounded"
            >
              {uploadingGallery ? <Loader2 className="animate-spin" /> : 'Upload Gallery Images'}
            </button>
            <input id="galleryInput" type="file" multiple accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, true)} />
            <div className="flex flex-wrap gap-2">
              {galleryPreviews.map((url, i) => (
                <img key={i} src={url} className="w-24 h-24 object-cover rounded" />
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <input name="youtubeIframe" placeholder="YouTube iframe embed" onChange={handleChange} className="w-full p-2 border rounded" />
          <textarea name="overview" placeholder="Overview" onChange={handleChange} className="w-full p-2 border rounded" />

          <div className="flex items-center gap-2">
            <input type="checkbox" name="zakat_eligible" checked={form.zakat_eligible} onChange={handleChange} />
            <label>Zakat Eligible</label>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" name="interest_earnings_eligible" checked={form.interest_earnings_eligible} onChange={handleChange} />
            <label>Interest Earnings Eligible</label>
          </div>

          <h2 className="font-semibold">Project Manager</h2>
          <input name="projectManager.name" placeholder="Name" onChange={handleChange} className="w-full p-2 border rounded" />
          <input name="projectManager.email" placeholder="Email" onChange={handleChange} className="w-full p-2 border rounded" />
          <input name="projectManager.phone" placeholder="Phone" onChange={handleChange} className="w-full p-2 border rounded" />

          <h2 className="font-semibold">Donation Options</h2>
          {form.donationOptions.map((option, index) => (
            <div key={index} className="flex items-center gap-2">
              <input
                type="checkbox"
                name={`donationOptions.${index}`}
                checked={option.isEnabled}
                onChange={handleChange}
              />
              <label>{option.type}</label>
            </div>
          ))}

          <input name="minDonationAmount" type="number" placeholder="Minimum Donation Amount" onChange={handleChange} className="w-full p-2 border rounded" />
          <select name="donationFrequency" value={form.donationFrequency} onChange={handleChange} className="w-full p-2 border rounded">
            <option>One Time</option>
            <option>Monthly</option>
            <option>Yearly</option>
          </select>

          <button
            type="submit"
            disabled={submitting}
            className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2"
          >
            {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
            Create Project
          </button>
        </div>
      </form>
    </div>
  );
}