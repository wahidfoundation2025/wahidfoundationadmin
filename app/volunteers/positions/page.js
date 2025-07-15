'use client'

import { useEffect, useState } from 'react'
import { GraduationCap, Heart, Users, Calendar, Eye, Trash2 } from 'lucide-react'

const ICON_MAP = {
  GraduationCap: GraduationCap,
  Heart: Heart,
  Users: Users,
  Calendar: Calendar,
}

export default function VolunteerPositionsPage() {
  const [positions, setPositions] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)
  const [deleting, setDeleting] = useState(null)

  useEffect(() => {
    fetchPositions()
  }, [])

  async function fetchPositions() {
    setLoading(true)
    const res = await fetch('/api/volunteer-positions')
    const data = await res.json()
    setPositions(data)
    setLoading(false)
  }

  async function handleDelete(id) {
    if (!window.confirm('Are you sure you want to delete this position?')) return
    setDeleting(id)
    await fetch(`/api/volunteer-positions?id=${id}`, { method: 'DELETE' })
    setDeleting(null)
    setPositions((prev) => prev.filter((pos) => pos._id !== id))
    if (selected && selected._id === id) setSelected(null)
  }

  return (
    <div className="min-h-screen w-full bg-gray-100 py-10 px-0">
      <div className="w-full px-0">
        <h1 className="text-4xl font-extrabold mb-2 text-gray-900 text-center">Volunteer Positions</h1>
        <p className="text-lg text-gray-600 mb-8 text-center">
          Browse all available volunteer positions and view or delete them.
        </p>

        <div className="overflow-x-auto w-full">
          <table className="min-w-full border bg-white rounded shadow">
            <thead>
              <tr className="bg-gray-200 text-gray-700">
                <th className="py-3 px-4 border">Icon</th>
                <th className="py-3 px-4 border">Title</th>
                <th className="py-3 px-4 border">Commitment</th>
                <th className="py-3 px-4 border text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {positions.length > 0 &&
                positions.map((pos) => {
                  const Icon = ICON_MAP[pos.icon] || Users
                  return (
                    <tr key={pos._id} className="border-b hover:bg-gray-50">
                      <td className="py-2 px-4 border text-center">
                        <Icon className="inline-block w-6 h-6 text-gray-700" />
                      </td>
                      <td className="py-2 px-4 border">{pos.title}</td>
                      <td className="py-2 px-4 border">{pos.commitment}</td>
                      <td className="py-2 px-4 border">
                        <div className="flex items-center justify-center gap-4">
                          <button
                            onClick={() => setSelected(pos)}
                            className="text-violet-600 hover:text-violet-800 p-1"
                            title="View"
                          >
                            <Eye size={20} />
                          </button>
                          <button
                            onClick={() => handleDelete(pos._id)}
                            className="text-red-600 hover:text-red-800 p-1"
                            title="Delete"
                            disabled={deleting === pos._id}
                          >
                            <Trash2 size={20} />
                            {deleting === pos._id && (
                              <span className="sr-only">Deleting...</span>
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Popup Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-8 relative">
            <button
              onClick={() => setSelected(null)}
              className="absolute top-2 right-3 text-gray-500 hover:text-black text-2xl"
              aria-label="Close"
            >
              &times;
            </button>
            <div className="flex items-center gap-3 mb-4">
              {(() => {
                const Icon = ICON_MAP[selected.icon] || Users
                return <Icon className="w-8 h-8 text-gray-700" />
              })()}
              <h2 className="text-xl font-semibold text-gray-800">{selected.title}</h2>
            </div>
            <div className="mb-2">
              <span className="font-semibold text-gray-700">Commitment:</span> {selected.commitment}
            </div>
            <div className="mb-2">
              <span className="font-semibold text-gray-700">Description:</span>
              <div className="mt-1 text-gray-700">{selected.description}</div>
            </div>
            <div className="text-xs text-gray-400 mt-4">
              Created: {selected.createdAt ? new Date(selected.createdAt).toLocaleString() : ''}
            </div>
          </div>
        </div>
      )
      }
    </div >
  )
}