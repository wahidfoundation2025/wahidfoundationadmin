'use client'

import { useEffect, useState } from 'react'
import { Eye } from 'lucide-react'

export default function VolunteerListPage() {
  const [volunteers, setVolunteers] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    fetchVolunteers()
  }, [])

  async function fetchVolunteers() {
    setLoading(true)
    const res = await fetch('/api/volunteer')
    const data = await res.json()
    setVolunteers(data)
    setLoading(false)
  }

  return (
    <div className="min-h-screen w-full bg-gray-100 py-10 px-0">
      <div className="w-full px-0">
        <h1 className="text-4xl font-extrabold mb-2 text-gray-900 text-center">Volunteers</h1>
        <p className="text-lg text-gray-600 mb-8 text-center">
          View all submitted volunteer applications.
        </p>
        <div className="w-full">
          {loading ? (
            <div className="text-center py-10 text-gray-500">Loading...</div>
          ) : volunteers.length === 0 ? (
            <div className="text-center py-10 text-gray-500">No volunteers found.</div>
          ) : (
            <div className="overflow-x-auto w-full">
              <table className="min-w-full border bg-white rounded shadow">
                <thead>
                  <tr className="bg-gray-200 text-gray-700">
                    <th className="py-3 px-4 border">Name</th>
                    <th className="py-3 px-4 border">Email</th>
                    <th className="py-3 px-4 border">Phone</th>
                    <th className="py-3 px-4 border">Skills</th>
                    <th className="py-3 px-4 border">Availability</th>
                    <th className="py-3 px-4 border text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {volunteers.map((vol) => (
                    <tr key={vol._id} className="border-b hover:bg-gray-50">
                      <td className="py-2 px-4 border">{vol.name}</td>
                      <td className="py-2 px-4 border">{vol.email}</td>
                      <td className="py-2 px-4 border">{vol.phone}</td>
                      <td className="py-2 px-4 border">{vol.skills}</td>
                      <td className="py-2 px-4 border">{vol.availability}</td>
                      <td className="py-2 px-4 border text-center">
                        <button
                          onClick={() => setSelected(vol)}
                          className="text-blue-600 hover:text-blue-800 p-1"
                          title="View"
                        >
                          <Eye size={20} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
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
            <h2 className="text-xl font-bold text-gray-800 mb-4">{selected.name}</h2>
            <div className="mb-2">
              <span className="font-semibold text-gray-700">Email:</span> {selected.email}
            </div>
            <div className="mb-2">
              <span className="font-semibold text-gray-700">Phone:</span> {selected.phone}
            </div>
            <div className="mb-2">
              <span className="font-semibold text-gray-700">Skills:</span> {selected.skills}
            </div>
            <div className="mb-2">
              <span className="font-semibold text-gray-700">Availability:</span> {selected.availability}
            </div>
            <div className="mb-2">
              <span className="font-semibold text-gray-700">Message:</span>
              <div className="mt-1 text-gray-700">{selected.message}</div>
            </div>
            <div className="text-xs text-gray-400 mt-4">
              Submitted: {selected.createdAt ? new Date(selected.createdAt).toLocaleString() : ''}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}