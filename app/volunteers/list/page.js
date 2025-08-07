'use client'

import { useEffect, useState } from 'react'
import { Eye } from 'lucide-react'
import { FaAnglesLeft, FaAnglesRight } from 'react-icons/fa6'

export default function VolunteerListPage() {
  const [volunteers, setVolunteers] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const rowsPerPage = 10

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

  const totalVolunteers = volunteers.length
  const totalPages = Math.ceil(totalVolunteers / rowsPerPage)
  const paginatedVolunteers = volunteers.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  )

  return (
    <div className="bg-white p-4 sm:p-6 sm:rounded-2xl min-h-full w-full">
      <div className="w-full">
        <h1 className="text-xl sm:text-2xl font-bold mb-2">Volunteers</h1>
        <p className="text-base sm:text-lg text-gray-600 mb-6">
          View all submitted volunteer applications.
        </p>

        <div className="overflow-x-auto w-full">
          <div className="bg-white border border-gray-300 rounded-xl shadow overflow-hidden">
            <table className="w-full text-sm table-auto text-left">
              <thead className="bg-gray-200 text-gray-700 font-semibold border-b border-gray-300">
                <tr>
                  {['Name', 'Email', 'Phone', 'Skills', 'Availability', 'Actions'].map((heading, idx) => (
                    <th
                      key={idx}
                      className={`py-3 px-4 text-nowrap font-medium ${idx === 0 ? 'rounded-tl-xl' : idx === 5 ? 'rounded-tr-xl text-right' : ''}`}
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="text-gray-800">
                {paginatedVolunteers.length > 0 &&
                  paginatedVolunteers.map((vol) => (
                    <tr key={vol._id} className="border-b border-gray-300 last:border-none">
                      <td className="py-3 px-4">{vol.name}</td>
                      <td className="py-3 px-4">{vol.email}</td>
                      <td className="py-3 px-4">{vol.phone}</td>
                      <td className="py-3 px-4">{vol.skills}</td>
                      <td className="py-3 px-4">{vol.availability}</td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => setSelected(vol)}
                          className="text-violet-600 hover:bg-violet-200 rounded-3xl p-2 cursor-pointer transition"
                          title="View"
                        >
                          <Eye size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-4 py-3 bg-white text-sm text-gray-700 rounded-b-xl">
            <div>
              Showing {Math.min((currentPage - 1) * rowsPerPage + 1, totalVolunteers)} to{' '}
              {Math.min(currentPage * rowsPerPage, totalVolunteers)} of {totalVolunteers} entries
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2.5 border border-gray-300 hover:bg-gray-200 rounded-xl disabled:opacity-50 disabled:cursor-default disabled:bg-white"
              >
                <FaAnglesLeft />
              </button>
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2.5 border border-gray-300 hover:bg-gray-200 rounded-xl disabled:opacity-50 disabled:cursor-default disabled:bg-white"
              >
                <FaAnglesRight />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Popup Modal */}
      {selected && (
        <div className="bg-white border border-gray-300 rounded-2xl p-6 w-full relative">
          <button
            onClick={() => setSelected(null)}
            className="absolute top-3 right-4 text-gray-500 hover:text-black text-3xl cursor-pointer"
            aria-label="Close"
          >
            &times;
          </button>

          <h2 className="text-xl font-semibold mb-6">Volunteer Details</h2>

          <div className="grid grid-cols-2 gap-6 mb-4">
            <div>
              <p className="text-sm font-medium text-gray-700 mb-1">Name</p>
              <p>{selected.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700 mb-1">Email</p>
              <p>{selected.email}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700 mb-1">Phone</p>
              <p>{selected.phone}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700 mb-1">Skills</p>
              <p>{selected.skills}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700 mb-1">Availability</p>
              <p>{selected.availability}</p>
            </div>
          </div>

          <div className="mb-4">
            <p className="text-sm font-medium text-gray-700 mb-1">Message</p>
            <p className="whitespace-pre-line">{selected.message}</p>
          </div>

          <div className="text-xs text-gray-600 mt-4">
            Submitted: {selected.createdAt ? new Date(selected.createdAt).toLocaleString() : ''}
          </div>
        </div>
      )
      }
    </div >
  )
}
