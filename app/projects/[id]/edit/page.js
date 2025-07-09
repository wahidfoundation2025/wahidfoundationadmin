'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Trash2 } from 'lucide-react'

export default function EditProjectPage({ params }) {
  const { id } = params
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [uploadingMain, setUploadingMain] = useState(false)
  const [uploadingGallery, setUploadingGallery] = useState(false)

  const [form, setForm] = useState({
    title: '',
    description: '',
    status: 'Active',
    category: '',
    location: '',
    totalRequired: '',
    collected: '',
    beneficiaries: '',
    completion: '',
    daysLeft: '',
    zakat_eligible: false,
    interest_earnings_eligible: false,
    donationFrequency: 'One Time',
    minDonationAmount: 365,
    donationOptions: [],
    projectManager: { name: '', email: '', phone: '' },
    mainImage: '',
    photoGallery: [],
    overview: '',
    youtubeIframe: '',
  })

  useEffect(() => {
    async function fetchProject() {
      const res = await fetch(`/api/projects/${id}`)
      if (!res.ok) {
        alert('Failed to load project')
        return
      }
      const data = await res.json()
      setForm(data)
      setLoading(false)
    }

    fetchProject()
  }, [id])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleUpload = async (file, isGallery = false) => {
    const formData = new FormData()
    formData.append('file', file)

    if (isGallery) setUploadingGallery(true)
    else setUploadingMain(true)

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    })

    const data = await res.json()
    if (isGallery) {
      setForm((prev) => ({
        ...prev,
        photoGallery: [...prev.photoGallery, data.url],
      }))
      setUploadingGallery(false)
    } else {
      setForm((prev) => ({ ...prev, mainImage: data.url }))
      setUploadingMain(false)
    }
  }

  const handleGalleryRemove = (index) => {
    setForm((prev) => ({
      ...prev,
      photoGallery: prev.photoGallery.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    const res = await fetch(`/api/projects/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    setSubmitting(false)
    if (res.ok) {
      router.push(`/projects/${id}`)
    } else {
      alert('Failed to update project')
    }
  }

  if (loading) return <p className="p-4">Loading...</p>

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6">
      <h1 className="text-3xl font-semibold mb-6">Edit Project</h1>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          {/* Status Dropdown */}
          <label className="block font-medium">Status</label>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          >
            <option value="Active">Active</option>
            <option value="Completed">Completed</option>
            <option value="Upcoming">Upcoming</option>
            <option value="Draft">Draft</option>
          </select>

          <label className="block font-medium">Title</label>
          <input name="title" value={form.title} onChange={handleChange} placeholder="Title" className="w-full border px-3 py-2 rounded" required />

          <label className="block font-medium">Description</label>
          <textarea name="description" value={form.description} onChange={handleChange} rows={3} placeholder="Description" className="w-full border px-3 py-2 rounded" />

          <label className="block font-medium">Category</label>
          <input name="category" value={form.category} onChange={handleChange} placeholder="Category" className="w-full border px-3 py-2 rounded" />

          <label className="block font-medium">Location</label>
          <input name="location" value={form.location} onChange={handleChange} placeholder="Location" className="w-full border px-3 py-2 rounded" />

          <label className="block font-medium">Total Required</label>
          <input name="totalRequired" type="number" value={form.totalRequired} onChange={handleChange} placeholder="Total Required" className="w-full border px-3 py-2 rounded" />

          <label className="block font-medium">Collected</label>
          <input name="collected" type="number" value={form.collected} onChange={handleChange} placeholder="Collected" className="w-full border px-3 py-2 rounded" />

          <label className="block font-medium">Beneficiaries</label>
          <input name="beneficiaries" type="number" value={form.beneficiaries} onChange={handleChange} placeholder="Beneficiaries" className="w-full border px-3 py-2 rounded" />

          <label className="block font-medium">Completion %</label>
          <input name="completion" type="number" value={form.completion} onChange={handleChange} placeholder="Completion %" className="w-full border px-3 py-2 rounded" />

          <label className="block font-medium">Days Left</label>
          <input name="daysLeft" type="number" value={form.daysLeft} onChange={handleChange} placeholder="Days Left" className="w-full border px-3 py-2 rounded" />

          <div className="flex items-center gap-2">
            <input type="checkbox" name="zakat_eligible" checked={form.zakat_eligible} onChange={handleChange} /> Zakat Eligible
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" name="interest_earnings_eligible" checked={form.interest_earnings_eligible} onChange={handleChange} /> Interest Eligible
          </div>
        </div>

        <div className="space-y-4">
          <label className="block font-medium">Overview</label>
          <input name="overview" value={form.overview} onChange={handleChange} placeholder="Overview" className="w-full border px-3 py-2 rounded" />

          <label className="block font-medium">YouTube Iframe</label>
          <input name="youtubeIframe" value={form.youtubeIframe} onChange={handleChange} placeholder="YouTube Iframe" className="w-full border px-3 py-2 rounded" />

          <label className="block font-medium">Donation Frequency</label>
          <input name="donationFrequency" value={form.donationFrequency} onChange={handleChange} placeholder="Donation Frequency" className="w-full border px-3 py-2 rounded" />

          <label className="block font-medium">Min Donation</label>
          <input name="minDonationAmount" type="number" value={form.minDonationAmount} onChange={handleChange} placeholder="Min Donation" className="w-full border px-3 py-2 rounded" />

          <label className="block font-medium">Manager Name</label>
          <input name="projectManager.name" value={form.projectManager.name} onChange={(e) => setForm(prev => ({ ...prev, projectManager: { ...prev.projectManager, name: e.target.value } }))} placeholder="Manager Name" className="w-full border px-3 py-2 rounded" />

          <label className="block font-medium">Manager Email</label>
          <input name="projectManager.email" value={form.projectManager.email} onChange={(e) => setForm(prev => ({ ...prev, projectManager: { ...prev.projectManager, email: e.target.value } }))} placeholder="Manager Email" className="w-full border px-3 py-2 rounded" />

          <label className="block font-medium">Manager Phone</label>
          <input name="projectManager.phone" value={form.projectManager.phone} onChange={(e) => setForm(prev => ({ ...prev, projectManager: { ...prev.projectManager, phone: e.target.value } }))} placeholder="Manager Phone" className="w-full border px-3 py-2 rounded" />

          <div className="space-y-2">
            <label className="block font-medium">Main Image</label>
            <input type="file" onChange={(e) => handleUpload(e.target.files[0])} className="block" />
            {uploadingMain && <Loader2 className="animate-spin w-5 h-5" />}
            {form.mainImage && <img src={form.mainImage} alt="Main" className="w-full rounded shadow mt-2" />}
          </div>

          <div className="space-y-2">
            <label className="block font-medium">Photo Gallery</label>
            <input type="file" onChange={(e) => handleUpload(e.target.files[0], true)} className="block" />
            {uploadingGallery && <Loader2 className="animate-spin w-5 h-5" />}
            <div className="grid grid-cols-2 gap-2">
              {form.photoGallery.map((url, i) => (
                <div key={i} className="relative">
                  <img src={url} className="rounded w-full h-32 object-cover" />
                  <button type="button" onClick={() => handleGalleryRemove(i)} className="absolute top-1 right-1 bg-white rounded-full p-1 shadow">
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="md:col-span-2">
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-medium flex items-center justify-center"
            disabled={submitting}
          >
            {submitting && <Loader2 className="animate-spin w-5 h-5 mr-2" />} Save Changes
          </button>
        </div>
      </form>
    </div>
  )
}