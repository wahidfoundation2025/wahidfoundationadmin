'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function EditProjectPage({ params }) {
  const { id } = params
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({
    title: '',
    description: '',
    status: 'Active',
    category: '',
    location: '',
    totalRequired: '',
    collected: '',
  })

  useEffect(() => {
    async function fetchProject() {
      const res = await fetch(`/api/projects/${id}`)
      if (!res.ok) {
        alert('Failed to load project')
        return
      }
      const data = await res.json()
      setForm({
        title: data.title || '',
        description: data.description || '',
        status: data.status || 'Active',
        category: data.category || '',
        location: data.location || '',
        totalRequired: data.totalRequired || '',
        collected: data.collected || '',
      })
      setLoading(false)
    }

    fetchProject()
  }, [id])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const res = await fetch(`/api/projects/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    if (res.ok) {
      router.push(`/projects/${id}`)
    } else {
      alert('Failed to update project')
    }
  }

  if (loading) return <p className="p-4">Loading...</p>

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Edit Project</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Title</label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            rows={4}
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Status</label>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="Active">Active</option>
            <option value="Completed">Completed</option>
            <option value="Upcoming">Upcoming</option>
          </select>
        </div>

        <div>
          <label className="block font-medium mb-1">Category</label>
          <input
            name="category"
            value={form.category}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Location</label>
          <input
            name="location"
            value={form.location}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block font-medium mb-1">Total Required</label>
            <input
              name="totalRequired"
              type="number"
              value={form.totalRequired}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          <div className="flex-1">
            <label className="block font-medium mb-1">Collected</label>
            <input
              name="collected"
              type="number"
              value={form.collected}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
            />
          </div>
        </div>

        <button
          type="submit"
          className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-medium"
        >
          Save Changes
        </button>
      </form>
    </div>
  )
}
