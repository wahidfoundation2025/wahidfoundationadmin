'use client'

import { useEffect, useState } from 'react'
import { GraduationCap, Heart, Users, Calculator, Trash2, Plus } from 'lucide-react'
import { TbTrash } from 'react-icons/tb'

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
    fetchStories();
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
    <div className="bg-white p-6 rounded-2xl min-h-full">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold mb-6">Impact Stories</h1>

        <button
          onClick={() => setShowAdd(true)}
          className="flex flex-row gap-2 items-center font-medium btn btn-primary border bg-blue-600 hover:bg-blue-700 px-6 py-2 cursor-pointer text-white transition rounded-xl"
        >
          <Plus size={16} /> Add Impact Story
        </button>
      </div>

      {loading ? (
        <div className="text-center py-10 text-gray-500">Loading...</div>
      ) : stories.length === 0 ? (
        <div className="text-center py-10 text-gray-500">No stories found.</div>
      ) : (
        <div className="space-y-6 grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4">
          {stories.map((story) => {
            const Icon = ICON_MAP[story.icon] || Users;

            return (
              <div key={story._id} className="gap-1 bg-blue-50 rounded-xl p-4 border-2 border-blue-300 w-full min-h-full flex flex-col justify-between">
                <div className='flex flex-row justify-between'>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="bg-blue-200 text-blue-600 rounded-full p-2 text-xs font-semibold">{story.initials}</span>
                      <span className="font-semibold text-gray-700">{story.name}</span>
                    </div>

                    <span className="text-gray-500 text-sm">({story.location})</span>

                    <div className="text-xs text-gray-400 mt-1">
                      {story.createdAt ? new Date(story.createdAt).toLocaleString() : ''}
                    </div>

                    <p className="text-gray-700 mt-2">"{story.quote}"</p>
                  </div>

                  <Icon className="min-w-6 h-6 text-gray-700" />
                </div>

                <div className="flex flex-row gap-2 items-center justify-end w-full">
                  <button
                    className="btn btn-sm btn-error ml-2 text-red-500 cursor-pointer hover:bg-red-100 rounded-full p-2.5"
                    onClick={() => handleDelete(story._id)}
                    type="button"
                  >
                    <TbTrash className="text-xl" />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <div className="bg-white border border-gray-300 rounded-xl p-6 w-full mt-10">
        <h2 className="font-semibold text-lg mb-4">Add Impact Story</h2>

        <div className="flex flex-col gap-y-4">
          <div className="grid grid-cols-2 gap-4 w-full">
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1">Quote</label>
              <textarea
                name="quote"
                value={form.quote}
                onChange={handleFormChange}
                required
                className="p-2.5 text-sm w-full border border-gray-300 rounded-xl"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                name="name"
                value={form.name}
                onChange={handleFormChange}
                required
                className="p-2.5 text-sm w-full border border-gray-300 rounded-xl"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Location</label>
              <input
                name="location"
                value={form.location}
                onChange={handleFormChange}
                required
                className="p-2.5 text-sm w-full border border-gray-300 rounded-xl"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Initials</label>
              <input
                name="initials"
                value={form.initials}
                onChange={handleFormChange}
                required
                className="p-2.5 text-sm w-full border border-gray-300 rounded-xl"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Icon</label>
              <select
                name="icon"
                value={form.icon}
                onChange={handleFormChange}
                className="p-2.5 text-sm w-full border border-gray-300 rounded-xl appearance-none cursor-pointer"
              >
                {ICONS.map((icon) => (
                  <option key={icon.value} value={icon.value}>{icon.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              onClick={handleAdd}
              disabled={adding}
              className="px-10 py-2 font-medium cursor-pointer bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-xl"
            >
              {adding ? 'Adding...' : 'Add'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}