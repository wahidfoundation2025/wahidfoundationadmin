'use client'

import { useEffect, useState } from 'react'
import { GraduationCap, Heart, Users, Calculator, Trash2, Plus } from 'lucide-react'

const ICON_MAP = {
  GraduationCap,
  Heart,
  Users,
  Calculator,
}

const ICONS = [
  { label: 'Graduation Cap', value: 'GraduationCap' },
  { label: 'Heart', value: 'Heart' },
  { label: 'Users', value: 'Users' },
  { label: 'Calculator', value: 'Calculator' },
]

export default function ImpactPage() {
  const [stories, setStories] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const [deleting, setDeleting] = useState(null)
  const [form, setForm] = useState({
    quote: '',
    name: '',
    location: '',
    initials: '',
    icon: ICONS[0].value,
  })
  const [adding, setAdding] = useState(false)

  useEffect(() => {
    fetchStories()
  }, [])

  async function fetchStories() {
    setLoading(true)
    const res = await fetch('/api/impact-stories')
    const data = await res.json()
    setStories(data)
    setLoading(false)
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this story?')) return
    setDeleting(id)
    await fetch(`/api/impact-stories?id=${id}`, { method: 'DELETE' })
    setDeleting(null)
    setStories((prev) => prev.filter((s) => s._id !== id))
  }

  function handleFormChange(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  async function handleAdd(e) {
    e.preventDefault()
    setAdding(true)
    await fetch('/api/impact-stories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    setAdding(false)
    setShowAdd(false)
    setForm({
      quote: '',
      name: '',
      location: '',
      initials: '',
      icon: ICONS[0].value,
    })
    fetchStories()
  }

  return (
    <div className="min-h-screen w-full bg-gray-100 py-10 px-0">
      <div className="w-full max-w-5xl mx-auto bg-white p-8 rounded shadow">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <h1 className="text-3xl font-bold text-gray-800">Impact Stories</h1>
          <button
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-2 bg-black text-white px-5 py-2 rounded font-semibold hover:bg-gray-800 transition"
          >
            <Plus size={20} /> Add Impact Story
          </button>
        </div>
        {loading ? (
          <div className="text-center py-10 text-gray-500">Loading...</div>
        ) : stories.length === 0 ? (
          <div className="text-center py-10 text-gray-500">No stories found.</div>
        ) : (
          <div className="space-y-6">
            {stories.map((story) => {
              const Icon = ICON_MAP[story.icon] || Users
              return (
                <div key={story._id} className="flex items-start gap-4 bg-gray-50 rounded p-4 shadow-sm w-full">
                  <div className="flex-shrink-0">
                    <Icon className="w-10 h-10 text-gray-700" />
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-700 mb-2">"{story.quote}"</p>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-900">{story.name}</span>
                      <span className="text-gray-500 text-sm">({story.location})</span>
                      <span className="bg-gray-200 text-gray-700 rounded-full px-2 py-1 text-xs font-bold ml-2">{story.initials}</span>
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      {story.createdAt ? new Date(story.createdAt).toLocaleString() : ''}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(story._id)}
                    className="text-red-600 hover:text-red-800 p-2"
                    disabled={deleting === story._id}
                    title="Delete"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </div>


      {showAdd && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-8 relative">
            <button
              onClick={() => setShowAdd(false)}
              className="absolute top-2 right-3 text-gray-500 hover:text-black text-2xl"
              aria-label="Close"
            >
              &times;
            </button>
            <form onSubmit={handleAdd} className="space-y-5">
              <h2 className="text-xl font-bold mb-2 text-gray-800">Add Impact Story</h2>
              <div>
                <label className="block mb-1 font-medium">Quote</label>
                <textarea name="quote" value={form.quote} onChange={handleFormChange} required className="w-full border rounded px-3 py-2" />
              </div>
              <div>
                <label className="block mb-1 font-medium">Name</label>
                <input name="name" value={form.name} onChange={handleFormChange} required className="w-full border rounded px-3 py-2" />
              </div>
              <div>
                <label className="block mb-1 font-medium">Location</label>
                <input name="location" value={form.location} onChange={handleFormChange} required className="w-full border rounded px-3 py-2" />
              </div>
              <div>
                <label className="block mb-1 font-medium">Initials</label>
                <input name="initials" value={form.initials} onChange={handleFormChange} required className="w-full border rounded px-3 py-2" />
              </div>
              <div>
                <label className="block mb-1 font-medium">Icon</label>
                <select name="icon" value={form.icon} onChange={handleFormChange} className="w-full border rounded px-3 py-2">
                  {ICONS.map((icon) => (
                    <option key={icon.value} value={icon.value}>{icon.label}</option>
                  ))}
                </select>
              </div>
              <button type="submit" disabled={adding} className="w-full bg-black text-white py-2 rounded font-semibold">
                {adding ? 'Adding...' : 'Add Story'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}