'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

const ICONS = [
  { label: 'Graduation Cap', value: 'GraduationCap' },
  { label: 'Heart', value: 'Heart' },
  { label: 'Users', value: 'Users' },
  { label: 'Calendar', value: 'Calendar' },
]

export default function AddPositionPage() {
  const [form, setForm] = useState({
    title: '',
    description: '',
    commitment: '',
    icon: ICONS[0].value,
  })
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/volunteer-positions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        toast.success('Volunteer position added!')
        setForm({
          title: '',
          description: '',
          commitment: '',
          icon: ICONS[0].value,
        })
        router.push('/volunteers/positions')
      } else {
        toast.error('Failed to add position.')
      }
    } catch {
      toast.error('Network error.')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-2xl bg-white p-10 rounded shadow-md">
        <h1 className="text-3xl font-semibold mb-8 text-gray-800">Add Volunteer Position</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-1 font-medium text-gray-700">Title</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium text-gray-700">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              required
              rows={3}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium text-gray-700">Time Commitment</label>
            <input
              name="commitment"
              value={form.commitment}
              onChange={handleChange}
              required
              className="w-full border rounded px-3 py-2"
              placeholder="e.g. 4 hours/week"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium text-gray-700">Icon</label>
            <select
              name="icon"
              value={form.icon}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            >
              {ICONS.map((icon) => (
                <option key={icon.value} value={icon.value}>
                  {icon.label}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white px-6 py-2 rounded font-semibold hover:bg-gray-800 transition disabled:opacity-60"
          >
            {loading ? 'Adding...' : 'Add Position'}
          </button>
        </form>
      </div>
    </div>
  )
}