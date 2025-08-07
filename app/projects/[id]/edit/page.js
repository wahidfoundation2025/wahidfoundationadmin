'use client'

import { use, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Trash2 } from 'lucide-react'
import withAccessControl from '@/lib/withAccessControl';

function EditProjectPage(props) {
  const { id } = use(props.params);
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
    <div className="min-h-full w-full bg-white p-6 rounded-2xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Edit Project</h1>

        <button
          onClick={handleSubmit}
          className="px-10 py-2 font-medium cursor-pointer bg-violet-600 hover:bg-violet-700 text-white text-base rounded-xl flex items-center gap-2"
          disabled={submitting}
        >
          {submitting && <Loader2 className="w-4 h-4 animate-spin" />} Save Changes
        </button>
      </div>

      <div className="flex flex-col gap-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select name="status" value={form.status} onChange={handleChange} className="p-2.5 text-sm w-full border border-gray-300 rounded-xl">
                <option value="Active">Active</option>
                <option value="Completed">Completed</option>
                <option value="Upcoming">Upcoming</option>
                <option value="Draft">Draft</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <input name="title" value={form.title} onChange={handleChange} placeholder="Title" className="p-2.5 text-sm w-full border border-gray-300 rounded-xl" required />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea name="description" value={form.description} onChange={handleChange} rows={3} placeholder="Description" className="p-2.5 text-sm w-full border border-gray-300 rounded-xl" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <input name="category" value={form.category} onChange={handleChange} placeholder="Category" className="p-2.5 text-sm w-full border border-gray-300 rounded-xl" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Location</label>
              <input name="location" value={form.location} onChange={handleChange} placeholder="Location" className="p-2.5 text-sm w-full border border-gray-300 rounded-xl" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Total Required</label>
              <input name="totalRequired" type="number" value={form.totalRequired} onChange={handleChange} placeholder="Total Required" className="p-2.5 text-sm w-full border border-gray-300 rounded-xl" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Collected</label>
              <input name="collected" type="number" value={form.collected} onChange={handleChange} placeholder="Collected" className="p-2.5 text-sm w-full border border-gray-300 rounded-xl" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Beneficiaries</label>
              <input name="beneficiaries" type="number" value={form.beneficiaries} onChange={handleChange} placeholder="Beneficiaries" className="p-2.5 text-sm w-full border border-gray-300 rounded-xl" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Completion %</label>
              <input name="completion" type="number" value={form.completion} onChange={handleChange} placeholder="Completion %" className="p-2.5 text-sm w-full border border-gray-300 rounded-xl" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Days Left</label>
              <input name="daysLeft" type="number" value={form.daysLeft} onChange={handleChange} placeholder="Days Left" className="p-2.5 text-sm w-full border border-gray-300 rounded-xl" />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Overview</label>
              <input name="overview" value={form.overview} onChange={handleChange} placeholder="Overview" className="p-2.5 text-sm w-full border border-gray-300 rounded-xl" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">YouTube Iframe</label>
              <input name="youtubeIframe" value={form.youtubeIframe} onChange={handleChange} placeholder="YouTube Iframe" className="p-2.5 text-sm w-full border border-gray-300 rounded-xl" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Donation Frequency</label>
              <input name="donationFrequency" value={form.donationFrequency} onChange={handleChange} placeholder="Donation Frequency" className="p-2.5 text-sm w-full border border-gray-300 rounded-xl" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Min Donation</label>
              <input name="minDonationAmount" type="number" value={form.minDonationAmount} onChange={handleChange} placeholder="Min Donation" className="p-2.5 text-sm w-full border border-gray-300 rounded-xl" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Manager Name</label>
              <input name="projectManager.name" value={form.projectManager.name} onChange={(e) => setForm(prev => ({ ...prev, projectManager: { ...prev.projectManager, name: e.target.value } }))} placeholder="Manager Name" className="p-2.5 text-sm w-full border border-gray-300 rounded-xl" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Manager Email</label>
              <input name="projectManager.email" value={form.projectManager.email} onChange={(e) => setForm(prev => ({ ...prev, projectManager: { ...prev.projectManager, email: e.target.value } }))} placeholder="Manager Email" className="p-2.5 text-sm w-full border border-gray-300 rounded-xl" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Manager Phone</label>
              <input name="projectManager.phone" value={form.projectManager.phone} onChange={(e) => setForm(prev => ({ ...prev, projectManager: { ...prev.projectManager, phone: e.target.value } }))} placeholder="Manager Phone" className="p-2.5 text-sm w-full border border-gray-300 rounded-xl" />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">Main Image</label>
              <input type="file" onChange={(e) => handleUpload(e.target.files[0])} className="block text-sm w-full border border-gray-300 rounded-xl p-2.5" />
              {uploadingMain && <Loader2 className="animate-spin w-4 h-4" />}
              {form.mainImage && <img src={form.mainImage} alt="Main" className="w-full rounded-xl shadow mt-2" />}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">Photo Gallery</label>
              <input type="file" onChange={(e) => handleUpload(e.target.files[0], true)} className="block text-sm w-full border border-gray-300 rounded-xl p-2.5" />
              {uploadingGallery && <Loader2 className="animate-spin w-4 h-4" />}
              <div className="grid grid-cols-2 gap-2">
                {form.photoGallery.map((url, i) => (
                  <div key={i} className="relative">
                    <img src={url} className="rounded-xl w-full h-32 object-cover border border-gray-200" />
                    <button type="button" onClick={() => handleGalleryRemove(i)} className="absolute top-1 right-1 bg-white rounded-full p-1 shadow">
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default withAccessControl(EditProjectPage, "cms");
